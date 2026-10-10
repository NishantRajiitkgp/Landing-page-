"use client";

import { useRef, useState, type DragEvent } from "react";

import { fill } from "@/components/momapply/fill";
import { StepFrame } from "@/components/momapply/flow/StepFrame";
import { FileIcon } from "@/components/momapply/icons";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import type { Prices } from "@/lib/mom/apply/pricing";
import { BATCH_MAX, blankCandidate, isBlankCandidate, type Candidate, type CandidateIssues } from "@/lib/mom/org/batch";
import { resolveInstitutions } from "@/lib/mom/org/batchClient";
import { fold, type Cell } from "@/lib/mom/org/cells";
import { importRows, parseDelimited, unresolved, type ImportReport } from "@/lib/mom/org/sheet";

import { BatchNotice, type Notice } from "./BatchNotice";
import { CandidateList, rowId, type ChecksPatch, type Filter } from "./CandidateList";
import { CandidatePanel } from "./CandidatePanel";
import { ADD_ID, Intake, type Busy } from "./Intake";
import { readTable, TABLE_MAX_MB } from "./readTable";
import { withCandidate, type UpdateBatch } from "./useBatch";

type Frame = Omit<Parameters<typeof StepFrame>[0], "title" | "lede" | "left" | "onNext" | "children">;

const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");
const later = (fn: () => void) => window.requestAnimationFrame(() => window.requestAnimationFrame(fn));

export function CandidatesStep({
  candidates,
  issues,
  update,
  frame,
  onDone,
  t,
  s,
  locale,
  now,
  prices,
}: {
  candidates: readonly Candidate[];
  issues: ReadonlyMap<string, CandidateIssues>;
  update: UpdateBatch;
  frame: Frame;
  onDone: () => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  now: string;
  prices: Prices;
}) {
  const b = t.batch;
  const [filter, setFilter] = useState<Filter>("all");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [panel, setPanel] = useState<{ id: string; fresh: boolean } | null>(null);
  const [tried, setTried] = useState(false);
  const [drag, setDrag] = useState(false);
  const depth = useRef(0);
  const flagged = candidates.filter((c) => issues.get(c.id)?.count);
  const open = panel ? candidates.find((c) => c.id === panel.id) : undefined;

  function add() {
    if (candidates.length >= BATCH_MAX) return;
    const c = blankCandidate();
    update((x) => ({ ...x, candidates: [...x.candidates, c] }));
    setPanel({ id: c.id, fresh: true });
  }

  async function ingest(rows: Cell[][]) {
    setNotice(null);
    const holder: { report?: ImportReport; list?: Candidate[] } = {};
    update((x) => {
      const r = importRows(rows, x.candidates);
      holder.report = r.report;
      holder.list = r.candidates;
      return { ...x, candidates: r.candidates };
    });
    const { report, list = [] } = holder;
    if (!report || (!report.added && !report.updated)) {
      setNotice({ kind: "error", text: report?.skipped ? fill(b.full, { max: BATCH_MAX }) : b.nothing });
      return;
    }
    const ids = new Set(report.ids);
    const names = unresolved(list, ids);
    if (names.length) {
      setBusy("checking");
      const res = await resolveInstitutions(names);
      if (res.ok) {
        const found = new Map(names.map((n, i) => [fold(n), res.items[i]]));
        update((x) => ({
          ...x,
          candidates: x.candidates.map((c) =>
            ids.has(c.id)
              ? {
                  ...c,
                  quals: c.quals.map((q) => {
                    const hit = q.listed === null ? found.get(fold(q.institution)) : null;
                    return hit ? { ...q, institution: hit.name, listed: hit.listed, country: q.country || hit.country } : q;
                  }),
                }
              : c,
          ),
        }));
      }
    }
    setBusy(null);
    setTried(false);
    setNotice({ kind: "import", report });
  }

  async function takeFile(file: File) {
    if (busy) return;
    setNotice(null);
    setBusy("reading");
    const res = await readTable(file);
    if (!res.ok) {
      setBusy(null);
      setNotice({ kind: "error", text: res.code === "too_large" ? fill(b.tooBig, { mb: TABLE_MAX_MB }) : b.badFile });
      return;
    }
    await ingest(res.rows);
  }

  function remove(ids: string[]) {
    const before = [...candidates];
    update((x) => ({ ...x, candidates: x.candidates.filter((c) => !ids.includes(c.id)) }));
    setNotice({ kind: "removed", ids, before });
    if (panel && ids.includes(panel.id)) setPanel(null);
  }

  function undo(n: Extract<Notice, { kind: "removed" }>) {
    const back = new Set(n.ids);
    update((x) => {
      const live = new Map(x.candidates.map((c) => [c.id, c]));
      const restored = n.before.filter((c) => back.has(c.id) || live.has(c.id)).map((c) => live.get(c.id) ?? c);
      const kept = new Set(restored.map((c) => c.id));
      return { ...x, candidates: [...restored, ...x.candidates.filter((c) => !kept.has(c.id))].slice(0, BATCH_MAX) };
    });
    setNotice(null);
  }

  function checks(ids: string[], patch: ChecksPatch) {
    const set = new Set(ids);
    update((x) => ({ ...x, candidates: x.candidates.map((c) => (set.has(c.id) ? { ...c, ...patch } : c)) }));
  }

  function close() {
    const id = panel?.id;
    setPanel(null);
    if (!id) return;
    const c = candidates.find((x) => x.id === id);
    if (c && isBlankCandidate(c)) {
      update((x) => ({ ...x, candidates: x.candidates.filter((y) => y.id !== id) }));
      later(() => document.getElementById(ADD_ID)?.focus());
    } else later(() => (document.getElementById(rowId(id)) ?? document.querySelector<HTMLElement>(".mo-row-b"))?.focus());
  }

  function nextFix(): (() => void) | null {
    if (!panel) return null;
    const at = candidates.findIndex((c) => c.id === panel.id);
    const after = [...candidates.slice(at + 1), ...candidates.slice(0, at)].find((c) => issues.get(c.id)?.count);
    return after ? () => setPanel({ id: after.id, fresh: false }) : null;
  }

  function next() {
    if (busy) return;
    if (!candidates.length || flagged.length) {
      setTried(true);
      if (flagged.length) setFilter("fix");
      later(() => document.getElementById(flagged.length ? rowId(flagged[0].id) : ADD_ID)?.focus());
      return;
    }
    onDone();
  }

  const toFix = notice?.kind === "import" ? notice.report.ids.filter((id) => issues.get(id)?.count).length : 0;

  return (
    <StepFrame
      {...frame}
      title={b.title}
      lede={b.lede}
      left={tried ? (candidates.length ? flagged.length : 1) : null}
      onNext={next}
    >
      <div
        className={`mo-cands${drag ? " is-drag" : ""}`}
        onDragEnter={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          depth.current++;
          setDrag(true);
        }}
        onDragOver={(e) => {
          if (hasFiles(e)) e.preventDefault();
        }}
        onDragLeave={() => {
          depth.current = Math.max(0, depth.current - 1);
          if (!depth.current) setDrag(false);
        }}
        onDrop={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          depth.current = 0;
          setDrag(false);
          const file = e.dataTransfer.files[0];
          if (file) void takeFile(file);
        }}
      >
        <Intake
          t={t}
          count={candidates.length}
          busy={busy}
          missing={tried && !candidates.length}
          onAdd={add}
          onFile={(f) => void takeFile(f)}
          onPaste={(text) => void ingest(parseDelimited(text))}
        />

        <BatchNotice
          notice={notice}
          toFix={toFix}
          onShow={() => setFilter("fix")}
          onUndo={() => notice?.kind === "removed" && undo(notice)}
          onDismiss={() => setNotice(null)}
          t={t}
        />

        {candidates.length ? (
          <CandidateList
            candidates={candidates}
            issues={issues}
            filter={flagged.length ? filter : "all"}
            onFilter={setFilter}
            onOpen={(id) => setPanel({ id, fresh: false })}
            onRemove={remove}
            onChecks={checks}
            t={t}
            locale={locale}
          />
        ) : null}

        {drag ? (
          <div className="mo-drop" aria-hidden="true">
            <FileIcon />
            {b.dropping}
          </div>
        ) : null}
      </div>

      {open && panel ? (
        <CandidatePanel
          key={open.id}
          candidate={open}
          n={candidates.indexOf(open) + 1}
          total={candidates.length}
          fresh={panel.fresh}
          issues={issues.get(open.id) ?? { fields: {}, quals: {}, count: 0 }}
          onChange={(change) => update((x) => withCandidate(x, open.id, change))}
          onRemove={() => remove([open.id])}
          onNextFix={nextFix()}
          onClose={close}
          t={t}
          s={s}
          locale={locale}
          now={now}
          prices={prices}
        />
      ) : null}
    </StepFrame>
  );
}

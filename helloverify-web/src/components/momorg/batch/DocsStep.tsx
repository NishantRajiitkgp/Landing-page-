"use client";

import { useRef, useState, type DragEvent } from "react";

import { fill } from "@/components/momapply/fill";
import { StepFrame } from "@/components/momapply/flow/StepFrame";
import { FileIcon, TickIcon } from "@/components/momapply/icons";
import type { MomErrors } from "@/lib/copy/momApply";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { FILE_ACCEPT, FILE_MAX_MB } from "@/lib/mom/apply/policy";
import type { ApplyFailure, DocRef } from "@/lib/mom/apply/types";
import { candidateSlots, missingSlots, type Candidate } from "@/lib/mom/org/batch";
import { fold } from "@/lib/mom/org/cells";

import { DocCard, slotDomId } from "./DocCard";
import { DocTray } from "./DocTray";
import { useBulkUpload } from "./useBulkUpload";
import { withCandidate, type UpdateBatch } from "./useBatch";

type Frame = Omit<Parameters<typeof StepFrame>[0], "title" | "lede" | "left" | "onNext" | "children">;

const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");
const later = (fn: () => void) => window.requestAnimationFrame(() => window.requestAnimationFrame(fn));

export function DocsStep({
  candidates,
  update,
  frame,
  onDone,
  t,
  s,
  errors,
  locale,
}: {
  candidates: readonly Candidate[];
  update: UpdateBatch;
  frame: Frame;
  onDone: () => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  errors: MomErrors;
  locale: string;
}) {
  const d = t.docs;
  const input = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [drag, setDrag] = useState(false);
  const [tried, setTried] = useState(false);
  const [filter, setFilter] = useState<"all" | "missing">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(candidates.length <= 3 ? candidates.map((c) => c.id) : []));

  const setDoc = (candidate: string, slot: string, doc: DocRef | null) =>
    update((b) =>
      withCandidate(b, candidate, (c) => {
        const docs = { ...c.docs };
        if (doc) docs[slot] = doc;
        else delete docs[slot];
        return { ...c, docs };
      }),
    );

  const message = (f: ApplyFailure) =>
    f.code === "too_large"
      ? fill(s.issues.too_large, { mb: FILE_MAX_MB })
      : f.code === "bad_type"
        ? s.issues.bad_type
        : f.code === "rate_limited"
          ? fill(errors.rate_limited, { s: f.retryAfter ?? 30 })
          : errors[f.code];

  const bulk = useBulkUpload({ onPlaced: (c, slot, doc) => setDoc(c, slot, doc), message });

  const required = candidates.reduce((n, c) => n + candidateSlots(c).filter((x) => x.required).length, 0);
  const missing = candidates.reduce((n, c) => n + missingSlots(c).length, 0);
  const incomplete = candidates.filter((c) => missingSlots(c).length);
  const q = fold(query);
  const shown = candidates.filter(
    (c) =>
      (filter === "all" || !incomplete.length || missingSlots(c).length) &&
      (!q || q.split(" ").every((w) => fold(`${c.fullName} ${c.passportNo}`).includes(w))),
  );

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  function next() {
    if (!incomplete.length) {
      onDone();
      return;
    }
    const first = incomplete[0];
    setTried(true);
    setFilter("missing");
    setQuery("");
    setOpen((prev) => new Set(prev).add(first.id));
    later(() => document.getElementById(slotDomId(first.id, missingSlots(first)[0].key))?.focus());
  }

  const st = bulk.stats;
  const status = bulk.busy
    ? fill(d.uploading, { n: Math.min(st.done + 1, st.total), total: st.total })
    : st.total || st.trayed
      ? [st.placed ? fill(d.placed, { n: st.placed }) : "", bulk.tray.length ? fill(d.toPlace, { n: bulk.tray.length }) : ""]
          .filter(Boolean)
          .join(" · ")
      : "";

  return (
    <StepFrame {...frame} title={d.title} lede={d.lede} left={tried ? incomplete.length : null} onNext={next} busy={bulk.busy}>
      <div
        className="mo-cands"
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
          bulk.drop(Array.from(e.dataTransfer.files), candidates);
        }}
      >
        <input
          ref={input}
          type="file"
          accept={FILE_ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) bulk.drop(files, candidates);
          }}
        />
        <button type="button" className={`mo-zone${drag ? " is-drag" : ""}`} onClick={() => input.current?.click()}>
          <span className="mo-zone-i">
            <FileIcon />
          </span>
          <span className="mo-zone-t">{d.drop}</span>
          <span className="mo-zone-m">{fill(d.rule, { mb: FILE_MAX_MB })}</span>
          <span className="mo-zone-h">
            {d.naming.split("{example}")[0]}
            <bdi dir="ltr">{d.example}</bdi>
            {d.naming.split("{example}")[1]}
          </span>
          <span className="btn btn-line btn-sm mo-zone-b">{d.choose}</span>
        </button>

        <div className="mo-prog">
          <p>
            <span>{fill(d.progress, { n: required - missing, total: required })}</span>
            <span className="mo-prog-s" aria-live="polite">
              {bulk.busy ? <span className="ma-spin" aria-hidden="true" /> : status && !bulk.tray.length ? <TickIcon /> : null}
              {status}
            </span>
          </p>
          <span className="mf-sum-bar" aria-hidden="true">
            <i style={{ inlineSize: `${required ? ((required - missing) / required) * 100 : 0}%` }} />
          </span>
        </div>

        {bulk.tray.length ? (
          <DocTray
            items={bulk.tray}
            candidates={candidates}
            onEdit={bulk.edit}
            onPlace={bulk.place}
            onDiscard={bulk.discard}
            t={t}
            s={s}
            locale={locale}
          />
        ) : null}

        <div className="mo-tools mo-dtools">
          <div className="ma-ctl mo-search">
            <input type="search" value={query} placeholder={d.search} aria-label={d.search} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="mo-seg" role="group" aria-label={d.missing}>
            {(["all", "missing"] as const).map((f) => {
              const on = (incomplete.length ? filter : "all") === f;
              return (
                <button key={f} type="button" aria-pressed={on} className={on ? "is-on" : undefined} onClick={() => setFilter(f)}>
                  {f === "all" ? d.all : d.missing}
                  <span>{f === "all" ? candidates.length : incomplete.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        {shown.length ? (
          <div className="mf-quals mo-dcards">
            {shown.map((c) => (
              <DocCard
                key={c.id}
                c={c}
                n={candidates.indexOf(c) + 1}
                open={open.has(c.id)}
                onToggle={() => toggle(c.id)}
                onDoc={(slot, doc) => setDoc(c.id, slot, doc)}
                tried={tried}
                t={t}
                s={s}
                errors={errors}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="mo-none">{d.none}</p>
        )}
      </div>
    </StepFrame>
  );
}

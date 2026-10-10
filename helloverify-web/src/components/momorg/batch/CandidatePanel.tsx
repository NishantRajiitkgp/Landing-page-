"use client";

import { useEffect, useRef, useState } from "react";

import { fill } from "@/components/momapply/fill";
import { CountryField, SelectField, TextField } from "@/components/momapply/flow/Fields";
import { ArrowIcon, CrossIcon, PlusIcon } from "@/components/momapply/icons";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { blankQual, FULL_NAME_MAX, MAX_QUALS, normalizePassport } from "@/lib/mom/apply/policy";
import type { Prices } from "@/lib/mom/apply/pricing";
import { PASS_TYPES, type Qual } from "@/lib/mom/apply/types";
import { CANDIDATE_FIELDS, type BatchIssue, type Candidate, type CandidateIssues } from "@/lib/mom/org/batch";

import { PanelChecks } from "./PanelChecks";
import { panelId, PanelQual, QUAL_FIELDS } from "./PanelQual";

/** The first field still to fix, in reading order. */
function firstIssue(c: Candidate, issues: CandidateIssues): string | null {
  const field = CANDIDATE_FIELDS.find((f) => issues.fields[f]);
  if (field) return panelId(field);
  for (const q of c.quals) {
    const f = QUAL_FIELDS.find((k) => issues.quals[q.id]?.[k]);
    if (f) return panelId(f, q.id);
  }
  return null;
}

export function CandidatePanel({
  candidate: c,
  n,
  total,
  fresh,
  issues,
  onChange,
  onRemove,
  onNextFix,
  onClose,
  t,
  s,
  locale,
  now,
  prices,
}: {
  candidate: Candidate;
  n: number;
  total: number;
  /** Just added: stay quiet until the employer has typed something. */
  fresh: boolean;
  issues: CandidateIssues;
  onChange: (change: (c: Candidate) => Candidate) => void;
  onRemove: () => void;
  onNextFix: (() => void) | null;
  onClose: () => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  now: string;
  prices: Prices;
}) {
  const p = t.panel;
  const ref = useRef<HTMLDialogElement>(null);
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [openQual, setOpenQual] = useState<string | null>(
    () => c.quals.find((q) => Object.keys(issues.quals[q.id] ?? {}).length)?.id ?? c.quals[0]?.id ?? null,
  );
  const [focusOn] = useState(() => (fresh ? panelId("fullName") : firstIssue(c, issues)));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    if (focusOn) document.getElementById(focusOn)?.focus();
  }, [focusOn]);

  const touch = (key: string) => setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  const show = (key: string, issue: BatchIssue | undefined) => {
    if (!issue || (fresh && !touched.has(key))) return null;
    return issue === "email" || issue === "duplicate" ? t.issues[issue] : s.issues[issue];
  };
  const field = (f: (typeof CANDIDATE_FIELDS)[number]) => ({
    id: panelId(f),
    value: c[f],
    error: show(panelId(f), issues.fields[f]),
    onBlur: () => touch(panelId(f)),
  });
  const set = (patch: Partial<Candidate>) => onChange((x) => ({ ...x, ...patch }));
  const setQual = (id: string, patch: Partial<Qual>) =>
    onChange((x) => ({ ...x, quals: x.quals.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
  const name = c.fullName.trim();

  return (
    <dialog
      ref={ref}
      className="mo-sheet"
      aria-labelledby="mo-sheet-t"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="mo-sheet-in">
        <header className="mo-sheet-h">
          <div>
            <p className="k">{fresh ? p.new : fill(p.of, { n, total })}</p>
            <h2 className="mo-sheet-t" id="mo-sheet-t">
              {name || t.batch.unnamed}
            </h2>
          </div>
          <button type="button" className="ma-icon-btn" aria-label={p.close} onClick={() => ref.current?.close()}>
            <CrossIcon />
          </button>
        </header>

        <div className="mo-sheet-b">
          <section className="mo-sheet-s" aria-labelledby="mo-sheet-who">
            <p className="ma-l mo-sheet-k" id="mo-sheet-who">
              {p.person}
            </p>
            <TextField
              {...field("fullName")}
              label={s.about.fullName}
              autoComplete="off"
              maxLength={FULL_NAME_MAX}
              onChange={(v) => set({ fullName: v })}
            />
            <TextField
              {...field("email")}
              label={p.email}
              type="email"
              dir="ltr"
              inputMode="email"
              autoComplete="off"
              spellCheck={false}
              placeholder="name@example.com"
              hint={p.emailHint}
              onChange={(v) => set({ email: v.trim() })}
            />
            <div className="ma-row2">
              <TextField
                {...field("passportNo")}
                label={s.about.passportNo}
                dir="ltr"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                onChange={(v) => set({ passportNo: normalizePassport(v) })}
              />
              <CountryField
                {...field("nationality")}
                label={s.about.nationality}
                locale={locale}
                placeholder={s.nav.select}
                onChange={(v) => set({ nationality: v })}
              />
            </div>
            <div className="ma-row2">
              <TextField {...field("dob")} label={s.about.dob} type="date" max={now} onChange={(v) => set({ dob: v })} />
              <TextField
                {...field("passportExpiry")}
                label={s.about.passportExpiry}
                type="date"
                min={now}
                onChange={(v) => set({ passportExpiry: v })}
              />
            </div>
            <SelectField
              {...field("passType")}
              label={p.pass}
              placeholder={s.nav.select}
              onChange={(v) => set({ passType: v as Candidate["passType"] })}
            >
              {PASS_TYPES.map((pass) => (
                <option key={pass} value={pass}>
                  {s.about.passes[pass]}
                </option>
              ))}
            </SelectField>
          </section>

          <section className="mo-sheet-s" aria-labelledby="mo-sheet-q">
            <p className="ma-l mo-sheet-k" id="mo-sheet-q">
              {p.quals}
            </p>
            <div className="mf-quals mo-sheet-quals">
              {c.quals.map((q, i) => (
                <PanelQual
                  key={q.id}
                  q={q}
                  n={i + 1}
                  issues={issues.quals[q.id] ?? {}}
                  show={show}
                  open={openQual === q.id}
                  onToggle={() => setOpenQual(openQual === q.id ? null : q.id)}
                  onChange={(patch) => setQual(q.id, patch)}
                  onRemove={c.quals.length > 1 ? () => onChange((x) => ({ ...x, quals: x.quals.filter((y) => y.id !== q.id) })) : null}
                  onTouch={touch}
                  s={s}
                  locale={locale}
                  now={now}
                />
              ))}
              {c.quals.length < MAX_QUALS ? (
                <button
                  type="button"
                  className="mf-add"
                  onClick={() => {
                    const q = blankQual();
                    onChange((x) => ({ ...x, quals: [...x.quals, q] }));
                    setOpenQual(q.id);
                  }}
                >
                  <PlusIcon />
                  {p.addQual}
                </button>
              ) : null}
            </div>
          </section>

          <PanelChecks c={c} onChange={set} t={t} s={s} locale={locale} prices={prices} />
        </div>

        <footer className="mo-sheet-f">
          <button type="button" className="btn btn-line btn-sm mo-sheet-rm" onClick={onRemove}>
            {p.remove}
          </button>
          {onNextFix ? (
            <button type="button" className="btn btn-line mo-sheet-next" onClick={onNextFix}>
              {p.next}
              <ArrowIcon />
            </button>
          ) : null}
          <button type="button" className="btn btn-ink" onClick={() => ref.current?.close()}>
            {p.done}
          </button>
        </footer>
      </div>
    </dialog>
  );
}

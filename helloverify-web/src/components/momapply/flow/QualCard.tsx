"use client";

import { useState } from "react";

import type { MomErrors } from "@/lib/copy/momApply";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { COURSE_MAX, EARLIEST_YEAR, qualIssues, qualSlots, STUDENT_ID_MAX } from "@/lib/mom/apply/policy";
import { LEVELS, type DocRef, type Qual } from "@/lib/mom/apply/types";

import { fill } from "../fill";
import { CrossIcon, TickIcon } from "../icons";
import { DocSlot } from "./DocSlot";
import { ChoiceField, CountryField, MonthField, SelectField, TextField } from "./Fields";
import { InstitutionField } from "./InstitutionField";
import { fieldId } from "./steps";

export function QualCard({
  q,
  n,
  docs,
  open,
  onOpen,
  onClose,
  onChange,
  onDoc,
  onRemove,
  s,
  errors,
  locale,
  now,
  tried,
}: {
  q: Qual;
  n: number;
  docs: Record<string, DocRef>;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (patch: Partial<Qual>) => void;
  onDoc: (slot: string, doc: DocRef | null) => void;
  onRemove: (() => void) | null;
  s: MomStepsCopy;
  errors: MomErrors;
  locale: string;
  now: string;
  tried: boolean;
}) {
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const t = s.quals;
  const issues = qualIssues(q, docs, now);
  const left = Object.keys(issues).length;
  const show = (f: string) => {
    const issue = issues[f];
    return issue && (tried || touched.has(f)) ? s.issues[issue] : null;
  };
  const touch = (f: string) => setTouched((prev) => (prev.has(f) ? prev : new Set(prev).add(f)));
  const id = (f: string) => fieldId(f, q.id);
  const year = Number(now.slice(0, 4));
  const title = [q.level ? t.levels[q.level] : "", q.institution.trim()].filter(Boolean).join(" · ");
  const headId = `${q.id}-h`;

  return (
    <section className={`mf-qual${open ? " is-open" : ""}`} aria-labelledby={headId}>
      <header className="mf-qual-h">
        <button type="button" className="mf-qual-tog" aria-expanded={open} aria-controls={`${q.id}-b`} onClick={open ? onClose : onOpen}>
          <span className="mf-qual-n">{String(n).padStart(2, "0")}</span>
          <span className="mf-qual-tt" id={headId}>
            {title || fill(t.card, { n })}
          </span>
          <span className={`mf-qual-st${left ? "" : " is-ok"}`}>
            {left ? fill(t.incomplete, { n: left }) : <TickIcon />}
            {left ? null : t.complete}
          </span>
        </button>
        {onRemove ? (
          <button type="button" className="ma-icon-btn" aria-label={fill(t.removeLabel, { n })} onClick={onRemove}>
            <CrossIcon />
          </button>
        ) : null}
      </header>

      <div className="mf-qual-b" id={`${q.id}-b`} hidden={!open}>
        {open ? (
          <>
            <div className="ma-row2">
              <SelectField
                id={id("level")}
                label={t.level}
                value={q.level}
                placeholder={s.nav.select}
                error={show("level")}
                onChange={(v) => onChange({ level: v as Qual["level"] })}
                onBlur={() => touch("level")}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {t.levels[l]}
                  </option>
                ))}
              </SelectField>
              <TextField
                id={id("course")}
                label={t.course}
                placeholder={t.coursePlaceholder}
                value={q.course}
                maxLength={COURSE_MAX}
                error={show("course")}
                onChange={(v) => onChange({ course: v })}
                onBlur={() => touch("course")}
              />
            </div>
            <InstitutionField
              id={id("institution")}
              t={t}
              locale={locale}
              value={q.institution}
              listed={q.listed}
              error={show("institution")}
              onType={(v) => onChange({ institution: v, listed: null })}
              onPick={(inst) => onChange({ institution: inst.name, listed: inst.listed, country: inst.country || q.country })}
              onBlur={() => touch("institution")}
            />
            <div className="ma-row2">
              <CountryField
                id={id("country")}
                label={t.country}
                locale={locale}
                value={q.country}
                placeholder={s.nav.select}
                error={show("country")}
                onChange={(v) => onChange({ country: v })}
                onBlur={() => touch("country")}
              />
              <TextField
                id={id("studentId")}
                label={t.studentId}
                optional={s.nav.optional}
                value={q.studentId}
                dir="ltr"
                autoComplete="off"
                maxLength={STUDENT_ID_MAX}
                onChange={(v) => onChange({ studentId: v })}
              />
            </div>
            <div className="ma-row2">
              {(["start", "end"] as const).map((f) => (
                <MonthField
                  key={f}
                  id={id(f)}
                  label={t[f]}
                  value={q[f]}
                  locale={locale}
                  monthLabel={t.month}
                  yearLabel={t.year}
                  firstYear={EARLIEST_YEAR}
                  lastYear={year}
                  error={show(f)}
                  onChange={(v) => {
                    onChange({ [f]: v });
                    if (/^\d{4}-\d{2}$/.test(v)) touch(f);
                  }}
                />
              ))}
            </div>
            <ChoiceField
              id={id("english")}
              label={t.english}
              compact
              value={q.english ? "yes" : "no"}
              options={[
                { value: "yes", label: t.yes },
                { value: "no", label: t.no },
              ]}
              onChange={(v) => onChange({ english: v === "yes" })}
            />
            <div className="mf-docs">
              <p className="ma-l">{t.docs}</p>
              {qualSlots(q).map((slot) => (
                <DocSlot
                  key={slot.key}
                  slot={slot}
                  doc={docs[slot.key]}
                  t={s.docs}
                  optional={s.nav.optional}
                  issues={s.issues}
                  errors={errors}
                  error={show(slot.key)}
                  locale={locale}
                  onChange={(doc) => onDoc(slot.key, doc)}
                />
              ))}
            </div>
            <button type="button" className="btn btn-line btn-sm mf-qual-done" onClick={onClose}>
              {t.collapse}
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

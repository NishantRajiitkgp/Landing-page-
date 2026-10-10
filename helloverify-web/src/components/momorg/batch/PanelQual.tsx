"use client";

import { fill } from "@/components/momapply/fill";
import { ChoiceField, CountryField, MonthField, SelectField, TextField } from "@/components/momapply/flow/Fields";
import { InstitutionField } from "@/components/momapply/flow/InstitutionField";
import { CrossIcon, TickIcon } from "@/components/momapply/icons";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { COURSE_MAX, EARLIEST_YEAR, STUDENT_ID_MAX, type Issue, type QualIssues } from "@/lib/mom/apply/policy";
import { LEVELS, type Qual } from "@/lib/mom/apply/types";
import { searchOrgInstitutions } from "@/lib/mom/org/batchClient";

export const QUAL_FIELDS = ["level", "course", "institution", "country", "start", "end"] as const;
export const panelId = (field: string, qualId?: string) => (qualId ? `mo-p-${qualId}-${field}` : `mo-p-${field}`);

/** One qualification in the candidate panel: the applicant's card without
 *  documents, which have their own step here. */
export function PanelQual({
  q,
  n,
  issues,
  show,
  open,
  onToggle,
  onChange,
  onRemove,
  onTouch,
  s,
  locale,
  now,
}: {
  q: Qual;
  n: number;
  issues: QualIssues;
  show: (key: string, issue: Issue | undefined) => string | null;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<Qual>) => void;
  onRemove: (() => void) | null;
  onTouch: (key: string) => void;
  s: MomStepsCopy;
  locale: string;
  now: string;
}) {
  const t = s.quals;
  const id = (f: string) => panelId(f, q.id);
  const err = (f: (typeof QUAL_FIELDS)[number]) => show(id(f), issues[f]);
  const left = Object.keys(issues).length;
  const title = [q.level ? t.levels[q.level] : "", q.institution.trim()].filter(Boolean).join(" · ");
  const year = Number(now.slice(0, 4));

  return (
    <section className={`mf-qual${open ? " is-open" : ""}`} aria-labelledby={`${q.id}-ph`}>
      <header className="mf-qual-h">
        <button type="button" className="mf-qual-tog" aria-expanded={open} aria-controls={`${q.id}-pb`} onClick={onToggle}>
          <span className="mf-qual-n">{String(n).padStart(2, "0")}</span>
          <span className="mf-qual-tt" id={`${q.id}-ph`}>
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
      <div className="mf-qual-b" id={`${q.id}-pb`} hidden={!open}>
        {open ? (
          <>
            <div className="ma-row2">
              <SelectField
                id={id("level")}
                label={t.level}
                value={q.level}
                placeholder={s.nav.select}
                error={err("level")}
                onChange={(v) => onChange({ level: v as Qual["level"] })}
                onBlur={() => onTouch(id("level"))}
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
                error={err("course")}
                onChange={(v) => onChange({ course: v })}
                onBlur={() => onTouch(id("course"))}
              />
            </div>
            <InstitutionField
              id={id("institution")}
              t={t}
              locale={locale}
              value={q.institution}
              listed={q.listed}
              error={err("institution")}
              search={searchOrgInstitutions}
              onType={(v) => onChange({ institution: v, listed: null })}
              onPick={(inst) => onChange({ institution: inst.name, listed: inst.listed, country: inst.country || q.country })}
              onBlur={() => onTouch(id("institution"))}
            />
            <div className="ma-row2">
              <CountryField
                id={id("country")}
                label={t.country}
                locale={locale}
                value={q.country}
                placeholder={s.nav.select}
                error={err("country")}
                onChange={(v) => onChange({ country: v })}
                onBlur={() => onTouch(id("country"))}
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
                  error={err(f)}
                  onChange={(v) => {
                    onChange({ [f]: v });
                    if (/^\d{4}-\d{2}$/.test(v)) onTouch(id(f));
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
          </>
        ) : null}
      </div>
    </section>
  );
}

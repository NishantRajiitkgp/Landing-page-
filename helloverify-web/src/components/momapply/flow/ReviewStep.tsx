"use client";

import { useState, type ReactNode } from "react";

import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { localise } from "@/lib/i18n/href";
import { normalizeName } from "@/lib/mom/account/policy";
import { countryName } from "@/lib/mom/apply/countries";
import { FULL_NAME_MAX, needsAccreditation, qualSlots, signatureMatches, signIssues } from "@/lib/mom/apply/policy";
import { money, quote, type Prices } from "@/lib/mom/apply/pricing";
import type { Draft } from "@/lib/mom/apply/types";

import { fill, fillNodes } from "../fill";
import { PlusIcon, TickIcon } from "../icons";
import { FieldError } from "../PasswordField";
import type { UpdateDraft } from "./draft";
import { TextField } from "./Fields";
import { formatDate, formatMonth } from "./format";
import { LoaLetter } from "./LoaLetter";
import { fieldId } from "./steps";

function Block({ title, s, onEdit, children }: { title: string; s: MomStepsCopy; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="mf-rev-s">
      <header className="mf-rev-h">
        <h3>{title}</h3>
        <button type="button" className="mf-rev-edit" aria-label={fill(s.review.editLabel, { section: title })} onClick={onEdit}>
          {s.review.edit}
        </button>
      </header>
      {children}
    </section>
  );
}

export function ReviewStep({
  draft,
  update,
  s,
  locale,
  now,
  tried,
  prices,
  onEdit,
}: {
  draft: Draft;
  update: UpdateDraft;
  s: MomStepsCopy;
  locale: string;
  now: string;
  tried: boolean;
  prices: Prices;
  onEdit: (step: number) => void;
}) {
  const t = s.review;
  const a = draft.about;
  const [touched, setTouched] = useState(false);
  const issues = signIssues(draft);
  const signError = issues.sign && (tried || touched) ? s.issues[issues.sign] : null;
  const agreeError = issues.agree && tried ? s.issues[issues.agree] : null;
  const q = quote(draft, prices);
  const docsText = (n: number) => (n === 1 ? t.docsOne : fill(t.docsMany, { n }));
  const doc = (path: string, label: string) => (
    <a href={localise(path, locale)} target="_blank" rel="noopener">
      {label}
    </a>
  );
  const about: [string, ReactNode][] = [
    [s.about.fullName, a.fullName.trim()],
    [s.about.dob, formatDate(a.dob, locale)],
    [s.about.nationality, countryName(a.nationality, locale)],
    [s.about.passportNo, <span key="passport" dir="ltr">{a.passportNo}</span>],
    [s.about.passportExpiry, formatDate(a.passportExpiry, locale)],
    [s.about.pass, a.passType ? s.about.passes[a.passType] : "—"],
  ];

  return (
    <>
      <Block title={t.about} s={s} onEdit={() => onEdit(1)}>
        <dl className="mf-rev-dl">
          {about.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="mf-rev-wide">
            <dt>{s.docs.passport}</dt>
            <dd className="mf-rev-file">{draft.docs.passport?.name ?? "—"}</dd>
          </div>
        </dl>
      </Block>

      <Block title={t.quals} s={s} onEdit={() => onEdit(2)}>
        <ol className="mf-rev-q">
          {draft.quals.map((x, i) => {
            const listed = !needsAccreditation(x);
            return (
              <li key={x.id}>
                <span className="mf-qual-n">{String(i + 1).padStart(2, "0")}</span>
                <div className="mf-rev-qb">
                  <p className="mf-rev-qt">{[x.level ? s.quals.levels[x.level] : "", x.course.trim()].filter(Boolean).join(" · ")}</p>
                  <p className="mf-rev-qm">
                    {x.institution.trim()}, {countryName(x.country, locale)}
                  </p>
                  <p className="mf-rev-qm">
                    {fillNodes(t.period, {
                      start: <bdi dir="ltr">{formatMonth(x.start, locale)}</bdi>,
                      end: <bdi dir="ltr">{formatMonth(x.end, locale)}</bdi>,
                    })}
                    {" · "}
                    {docsText(qualSlots(x).filter((slot) => draft.docs[slot.key]).length)}
                  </p>
                  <span className={`mf-sum-tag${listed ? " is-listed" : ""}`}>
                    {listed ? <TickIcon /> : <PlusIcon />}
                    {listed ? s.quals.listed : s.summary.accTag}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </Block>

      <Block title={t.checks} s={s} onEdit={() => onEdit(3)}>
        <ul className="mf-rev-c">
          {q.lines.map((line) => (
            <li key={line.id}>
              <span>
                {line.id === "express"
                  ? `${s.checks.express} · ${s.checks.expressDays}`
                  : fill(s.summary[line.id], { n: line.qty })}
              </span>
              <span>{money(line.amount, locale)}</span>
            </li>
          ))}
          {draft.express ? null : (
            <li>
              <span>{`${s.checks.standard} · ${s.checks.standardDays}`}</span>
              <span>{s.checks.included}</span>
            </li>
          )}
        </ul>
      </Block>

      <LoaLetter draft={draft} s={s} locale={locale} now={now} />

      <div className="mf-sign">
        <TextField
          id={fieldId("sign")}
          label={t.sign}
          value={draft.sign.name}
          autoComplete="off"
          spellCheck={false}
          maxLength={FULL_NAME_MAX}
          hint={fillNodes(t.signHint, { name: <b>{a.fullName.trim()}</b> })}
          error={signError}
          onChange={(v) => update((d) => ({ ...d, sign: { ...d.sign, name: v } }))}
          onBlur={() => {
            setTouched(true);
            update((d) =>
              signatureMatches(d.sign.name, d.about.fullName)
                ? { ...d, sign: { ...d.sign, name: normalizeName(d.about.fullName) } }
                : d,
            );
          }}
        />
        <div className="ma-field">
          <label className={`ma-check${agreeError ? " is-bad" : ""}`}>
            <input
              id={fieldId("agree")}
              type="checkbox"
              checked={draft.sign.agreed}
              aria-invalid={agreeError ? true : undefined}
              aria-describedby={agreeError ? `${fieldId("agree")}-err` : undefined}
              onChange={(e) => {
                const agreed = e.target.checked;
                update((d) => ({ ...d, sign: { ...d.sign, agreed } }));
              }}
            />
            <span>{fillNodes(t.agree, { terms: doc("/legal/terms-of-service", t.terms), privacy: doc("/legal/privacy-policy", t.privacy) })}</span>
          </label>
          {agreeError ? <FieldError id={`${fieldId("agree")}-err`}>{agreeError}</FieldError> : null}
        </div>
      </div>
    </>
  );
}

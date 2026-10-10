import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { normalizeName } from "@/lib/mom/account/policy";
import { countryName } from "@/lib/mom/apply/countries";
import { LOA_VERSION, signatureMatches } from "@/lib/mom/apply/policy";
import type { About, Qual } from "@/lib/mom/apply/types";

import { fill, fillNodes } from "../fill";
import { formatDate, formatMonth } from "./format";

/** Who signs and what the letter reaches: an applicant's draft, or a case an
 *  employer paid for. */
export type LoaSubject = {
  about: Pick<About, "fullName" | "passportNo" | "nationality" | "passType">;
  quals: Pick<Qual, "level" | "course" | "institution" | "start" | "end">[];
  sign: { name: string };
};

/** The letter as it will be signed: the applicant's own details, the
 *  institutions it reaches, and the typed signature once it matches. `wet`
 *  leaves the signature and date blank for a pen. */
export function LoaLetter({
  draft,
  s,
  locale,
  now,
  wet,
  id = "mf-loa-t",
}: {
  draft: LoaSubject;
  s: MomStepsCopy;
  locale: string;
  now: string;
  wet?: boolean;
  id?: string;
}) {
  const t = s.loa;
  const a = draft.about;
  const signed = !wet && signatureMatches(draft.sign.name, a.fullName);

  return (
    <figure className={`mf-loa${wet ? " is-wet" : ""}`} aria-labelledby={id}>
      <header className="mf-loa-h">
        <p className="mf-loa-t" id={id}>
          {t.title}
        </p>
        <p className="mf-loa-v">{fill(t.version, { v: LOA_VERSION })}</p>
      </header>
      <p className="mf-loa-to">{t.to}</p>
      <p>
        {fillNodes(t.grant, {
          name: <b>{a.fullName.trim()}</b>,
          passport: <b dir="ltr">{a.passportNo}</b>,
          country: countryName(a.nationality, locale),
          pass: a.passType ? s.about.passes[a.passType] : "",
        })}
      </p>
      <ol className="mf-loa-q">
        {draft.quals.map((q, i) => (
          <li key={i}>
            <b>{q.institution.trim()}</b>
            <span>
              <bdi>{[q.level ? s.quals.levels[q.level] : "", q.course.trim()].filter(Boolean).join(", ")}</bdi>
            </span>
            <span>
              {fillNodes(s.review.period, {
                start: <bdi dir="ltr">{formatMonth(q.start, locale)}</bdi>,
                end: <bdi dir="ltr">{formatMonth(q.end, locale)}</bdi>,
              })}
            </span>
          </li>
        ))}
      </ol>
      <p>{t.share}</p>
      <p>{t.valid}</p>
      <footer className="mf-loa-f">
        <div className="mf-loa-sig">
          <span key={signed ? "signed" : "pending"} className={`mf-loa-ink${signed ? " is-signed" : ""}`}>
            {signed ? normalizeName(a.fullName) : wet ? "" : t.pending}
          </span>
          <span className="mf-loa-k">{signed ? `${t.signature} · ${t.signed}` : t.signature}</span>
        </div>
        <div className="mf-loa-dt">
          <span className="mf-loa-day">{wet ? "" : formatDate(now, locale)}</span>
          <span className="mf-loa-k">{t.date}</span>
        </div>
      </footer>
    </figure>
  );
}

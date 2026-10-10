import type { ReactNode } from "react";

import { fillNodes } from "@/components/momapply/fill";
import { formatDate, formatMonth } from "@/components/momapply/flow/format";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { countryName } from "@/lib/mom/apply/countries";
import type { LoaView } from "@/lib/mom/org/loa";

/** The details the letter names, laid out to be checked at a glance. */
export function LoaDetails({ view, s, locale }: { view: LoaView; s: MomStepsCopy; locale: string }) {
  const a = s.about;
  const rows: [string, ReactNode][] = [
    [a.fullName, view.name],
    [a.passportNo, <bdi key="p" dir="ltr">{view.passportNo}</bdi>],
    [a.dob, formatDate(view.dob, locale)],
    [a.nationality, countryName(view.nationality, locale)],
    [a.pass, a.passes[view.passType]],
  ];
  return (
    <div className="mo-sign-d">
      <dl className="mo-sign-dl">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="k mo-sign-qk">{s.review.quals}</p>
      <ol className="mo-sign-q">
        {view.quals.map((q, i) => (
          <li key={i}>
            <span className="mf-qual-n">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <b>{q.institution}</b>
              <small>
                <bdi>{[q.level ? s.quals.levels[q.level] : "", q.course].filter(Boolean).join(", ")}</bdi>
                {" · "}
                {countryName(q.country, locale)}
                {" · "}
                {fillNodes(s.review.period, {
                  start: <bdi dir="ltr">{formatMonth(q.start, locale)}</bdi>,
                  end: <bdi dir="ltr">{formatMonth(q.end, locale)}</bdi>,
                })}
              </small>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

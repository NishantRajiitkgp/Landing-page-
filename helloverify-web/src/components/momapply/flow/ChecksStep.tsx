"use client";

import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { countryName } from "@/lib/mom/apply/countries";
import { addWorkingDays, needsAccreditation, TURNAROUND } from "@/lib/mom/apply/policy";
import { money, quote, type Prices } from "@/lib/mom/apply/pricing";
import type { Draft } from "@/lib/mom/apply/types";

import { fill } from "../fill";
import { DashIcon, TickIcon } from "../icons";
import type { UpdateDraft } from "./draft";
import { formatDay } from "./format";

/** The checks follow from the qualifications, so the only choice is speed. */
export function ChecksStep({
  draft,
  update,
  s,
  locale,
  now,
  prices,
}: {
  draft: Draft;
  update: UpdateDraft;
  s: MomStepsCopy;
  locale: string;
  now: string;
  prices: Prices;
}) {
  const t = s.checks;
  const total = quote(draft, prices).total;
  const speeds = [
    { express: false, name: t.standard, days: t.standardDays, price: t.included, perks: null, eta: addWorkingDays(now, TURNAROUND.standard) },
    {
      express: true,
      name: t.express,
      days: t.expressDays,
      price: `+${money(prices.express, locale)}`,
      perks: t.expressPerks,
      eta: addWorkingDays(now, TURNAROUND.express),
    },
  ];

  return (
    <>
      <section className="ma-field" aria-labelledby="mf-plan-k">
        <p className="ma-l" id="mf-plan-k">
          {t.plan}
        </p>
        <ol className="mf-plan">
          {draft.quals.map((q, i) => {
            const acc = needsAccreditation(q);
            const meta = [q.level ? s.quals.levels[q.level] : "", q.course.trim(), q.country ? countryName(q.country, locale) : ""];
            return (
              <li key={q.id} className="mf-plan-q">
                <div className="mf-plan-h">
                  <span className="mf-qual-n">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mf-plan-hb">
                    <p className="mf-plan-t">{q.institution.trim()}</p>
                    <p className="mf-plan-m">{meta.filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
                <ul className="mf-plan-c">
                  <li className="is-on">
                    <span className="mf-plan-i">
                      <TickIcon />
                    </span>
                    <span className="mf-plan-cb">
                      <b>{t.edu}</b>
                      <small>{t.eduHint}</small>
                    </span>
                    <span className="mf-plan-p">{money(prices.edu, locale)}</span>
                  </li>
                  <li className={acc ? "is-on" : "is-off"}>
                    <span className="mf-plan-i">{acc ? <TickIcon /> : <DashIcon />}</span>
                    <span className="mf-plan-cb">
                      <b>{t.acc}</b>
                      <small>{acc ? t.accHint : t.accSkip}</small>
                    </span>
                    <span className="mf-plan-p">{acc ? money(prices.acc, locale) : null}</span>
                  </li>
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      <fieldset className="ma-field mf-set">
        <legend className="ma-l">{t.speed}</legend>
        <div className="mf-speed">
          {speeds.map((o) => {
            const on = draft.express === o.express;
            return (
              <label key={o.name} className={`mf-speed-o${on ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="mf-speed"
                  id={o.express ? "mf-express" : "mf-standard"}
                  checked={on}
                  onChange={() => update((d) => ({ ...d, express: o.express }))}
                />
                <span className="mf-speed-top">
                  <span className="mf-speed-dot" aria-hidden="true" />
                  <span className="mf-speed-n">{o.name}</span>
                  <span className="mf-speed-p">{o.express ? <bdi dir="ltr">{o.price}</bdi> : o.price}</span>
                </span>
                <span className="mf-speed-d">{o.days}</span>
                {o.perks ? <span className="mf-speed-x">{o.perks}</span> : null}
                <span className="mf-speed-e">{fill(t.eta, { date: formatDay(o.eta, locale) })}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mf-mtot" aria-live="polite">
        <span>{t.total}</span>
        <b>{money(total, locale)}</b>
      </p>
    </>
  );
}

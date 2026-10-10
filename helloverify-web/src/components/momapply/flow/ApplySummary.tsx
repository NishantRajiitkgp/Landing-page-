import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { requiredSlots } from "@/lib/mom/apply/policy";
import { money, quote, type Prices } from "@/lib/mom/apply/pricing";
import type { Draft } from "@/lib/mom/apply/types";

import { fill } from "../fill";
import { PlusIcon, TickIcon } from "../icons";

/** The running application: who, which pass, what is being verified, how
 *  many documents are in, and what it will cost. */
export function ApplySummary({ draft, s, locale, prices, due = false }: { draft: Draft; s: MomStepsCopy; locale: string; prices: Prices; due?: boolean }) {
  const t = s.summary;
  const slots = requiredSlots(draft);
  const done = slots.filter((slot) => draft.docs[slot.key]).length;
  const q = quote(draft, prices);
  const quals = draft.quals.filter((x) => x.level || x.institution.trim());

  return (
    <aside className="mf-sum" aria-labelledby="mf-sum-k">
      <p className="k" id="mf-sum-k">
        {t.k}
      </p>
      <dl className="mf-sum-dl">
        <div>
          <dt>{t.holder}</dt>
          <dd>{draft.about.fullName.trim() || "—"}</dd>
        </div>
        <div>
          <dt>{t.pass}</dt>
          <dd>{draft.about.passType ? s.about.passes[draft.about.passType] : "—"}</dd>
        </div>
        <div className="mf-sum-q">
          <dt>{t.quals}</dt>
          <dd>
            {quals.length ? (
              <ul>
                {quals.map((x) => (
                  <li key={x.id}>
                    <span>{x.institution.trim() || (x.level ? s.quals.levels[x.level] : "")}</span>
                    {x.institution.trim() ? (
                      <span className={`mf-sum-tag${x.listed ? " is-listed" : ""}`}>
                        {x.listed ? <TickIcon /> : <PlusIcon />}
                        {x.listed ? s.quals.listed : t.accTag}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              t.none
            )}
          </dd>
        </div>
        <div>
          <dt>{t.docs}</dt>
          <dd>
            {fill(t.docsCount, { n: done, total: slots.length })}
            <span className="mf-sum-bar" aria-hidden="true">
              <i style={{ inlineSize: `${slots.length ? (done / slots.length) * 100 : 0}%` }} />
            </span>
          </dd>
        </div>
      </dl>

      <div className="mf-sum-quote">
        <p className="k">{due ? t.due : t.estimate}</p>
        <ul>
          {q.lines.map((line) => (
            <li key={line.id}>
              <span>{line.id === "express" ? t.express : fill(t[line.id], { n: line.qty })}</span>
              <span>{money(line.amount, locale)}</span>
            </li>
          ))}
          <li className="mf-sum-gst">
            <span>{fill(t.gst, { rate: Math.round(prices.gst * 100) })}</span>
            <span>{money(q.gst, locale)}</span>
          </li>
        </ul>
        <p className="mf-sum-tot" aria-live="polite">
          <span>{t.total}</span>
          <b>{money(q.total, locale)}</b>
        </p>
      </div>
    </aside>
  );
}

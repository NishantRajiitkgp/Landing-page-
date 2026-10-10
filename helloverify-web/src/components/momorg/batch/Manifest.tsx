"use client";

import { useState } from "react";

import { fill } from "@/components/momapply/fill";
import { PlusIcon } from "@/components/momapply/icons";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { money, type Prices } from "@/lib/mom/apply/pricing";
import { batchQuote, qualHasAcc, type Candidate } from "@/lib/mom/org/batch";

const FIRST = 5;

/** Every candidate once, with what they cost before GST. Long batches open
 *  folded, so the declarations stay in reach. */
export function Manifest({
  candidates,
  onEdit,
  t,
  s,
  locale,
  prices,
}: {
  candidates: readonly Candidate[];
  onEdit: (step: 1 | 2) => void;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  prices: Prices;
}) {
  const [all, setAll] = useState(false);
  const r = t.review;
  const shown = all ? candidates : candidates.slice(0, FIRST);
  const steps = t.aside.steps;

  return (
    <section className="mf-rev-s" aria-labelledby="mo-man-t">
      <header className="mf-rev-h">
        <h3 id="mo-man-t">{r.batch}</h3>
        <span className="mo-man-edit">
          {([1, 2] as const).map((step) => (
            <button key={step} type="button" className="mf-rev-edit" aria-label={fill(r.editLabel, { section: steps[step].t })} onClick={() => onEdit(step)}>
              {steps[step].t}
            </button>
          ))}
        </span>
      </header>
      <ol className="mo-man" id="mo-man">
        {shown.map((c, i) => {
          const acc = c.quals.filter((q) => qualHasAcc(c, q)).length;
          return (
            <li key={c.id} className="mo-man-r">
              <span className="mf-qual-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="mo-man-who">
                <b>{c.fullName.trim()}</b>
                <small>
                  <bdi dir="ltr">{c.passportNo}</bdi>
                  {" · "}
                  {c.quals.length === 1 ? t.batch.qualsOne : fill(t.batch.qualsMany, { n: c.quals.length })}
                  {" · "}
                  {fill(s.review.docsMany, { n: Object.keys(c.docs).length })}
                </small>
              </span>
              <span className="mo-man-tags">
                {acc ? (
                  <span className="mf-sum-tag">
                    <PlusIcon />
                    {fill(t.batch.acc, { n: acc })}
                  </span>
                ) : null}
                {c.express ? (
                  <span className="mf-sum-tag">
                    <PlusIcon />
                    {t.batch.express}
                  </span>
                ) : null}
              </span>
              <span className="mo-man-amt">{money(batchQuote([c], prices).subtotal, locale)}</span>
            </li>
          );
        })}
      </ol>
      {candidates.length > FIRST ? (
        <button type="button" className="ma-link mo-man-more" aria-expanded={all} aria-controls="mo-man" onClick={() => setAll((v) => !v)}>
          {all ? r.showLess : fill(r.showAll, { n: candidates.length })}
        </button>
      ) : null}
    </section>
  );
}

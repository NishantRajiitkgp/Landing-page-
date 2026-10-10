import { fill } from "@/components/momapply/fill";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { money, type Prices } from "@/lib/mom/apply/pricing";
import { BATCH_MAX, batchQuote, candidateSlots, missingSlots, type Candidate, type CandidateIssues } from "@/lib/mom/org/batch";

/** The running batch: how many, how many are ready, and the one invoice. */
export function BatchSummary({
  candidates,
  issues,
  t,
  s,
  locale,
  prices,
  due = false,
}: {
  candidates: readonly Candidate[];
  issues: ReadonlyMap<string, CandidateIssues>;
  t: MomOrgCopy;
  s: MomStepsCopy;
  locale: string;
  prices: Prices;
  /** On the pay step the estimate is what's due. */
  due?: boolean;
}) {
  const n = candidates.length;
  const quals = candidates.reduce((sum, c) => sum + c.quals.length, 0);
  const ready = candidates.filter((c) => !issues.get(c.id)?.count).length;
  const q = batchQuote(candidates, prices);
  const required = candidates.reduce((sum, c) => sum + candidateSlots(c).filter((x) => x.required).length, 0);
  const missing = candidates.reduce((sum, c) => sum + missingSlots(c).length, 0);
  const label = (id: "edu" | "acc" | "express", qty: number) =>
    id === "express" ? fill(t.sum.express, { n: qty }) : fill(s.summary[id], { n: qty });

  return (
    <aside className="mf-sum" aria-labelledby="mo-sum-k">
      <p className="k" id="mo-sum-k">
        {t.sum.k}
      </p>
      <dl className="mf-sum-dl mo-sum-dl">
        <div>
          <dt>{t.sum.candidates}</dt>
          <dd>
            {fill(t.sum.count, { n, max: BATCH_MAX })}
            <span className="mf-sum-bar" aria-hidden="true">
              <i style={{ inlineSize: `${(n / BATCH_MAX) * 100}%` }} />
            </span>
          </dd>
        </div>
        <div>
          <dt>{t.sum.quals}</dt>
          <dd>{quals}</dd>
        </div>
        <div>
          <dt>{t.sum.ready}</dt>
          <dd>{fill(t.sum.count, { n: ready, max: n })}</dd>
        </div>
        {required ? (
          <div className="mo-sum-wide">
            <dt>{t.sum.docs}</dt>
            <dd>
              {fill(t.sum.count, { n: required - missing, max: required })}
              <span className="mf-sum-bar" aria-hidden="true">
                <i style={{ inlineSize: `${((required - missing) / required) * 100}%` }} />
              </span>
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mf-sum-quote">
        <p className="k">{due ? s.summary.due : s.summary.estimate}</p>
        <ul>
          {q.lines.map((line) => (
            <li key={line.id}>
              <span>{label(line.id, line.qty)}</span>
              <span>{money(line.amount, locale)}</span>
            </li>
          ))}
          <li className="mf-sum-gst">
            <span>{fill(s.summary.gst, { rate: Math.round(prices.gst * 100) })}</span>
            <span>{money(q.gst, locale)}</span>
          </li>
        </ul>
        <p className="mf-sum-tot" aria-live="polite">
          <span>{s.summary.total}</span>
          <b>{money(q.total, locale)}</b>
        </p>
      </div>
    </aside>
  );
}

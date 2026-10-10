import { fill, fillNodes } from "@/components/momapply/fill";
import { formatDate, localDay } from "@/components/momapply/flow/format";
import type { MomOrgCopy } from "@/lib/copy/momOrg";
import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { countryName } from "@/lib/mom/apply/countries";
import { money } from "@/lib/mom/apply/pricing";
import type { PaidBatch } from "@/lib/mom/org/checkout";

/** The one tax invoice for a batch, laid out to print as a page. */
export function Invoice({ batch, t, s, locale }: { batch: PaidBatch; t: MomOrgCopy; s: MomStepsCopy; locale: string }) {
  const p = t.paid;
  const b = batch.billing;
  const item = { edu: s.checks.edu, acc: s.checks.acc, express: s.checks.express };

  return (
    <article className="mo-inv" aria-labelledby="mo-inv-t">
      <header className="mo-inv-h">
        <div>
          <h3 id="mo-inv-t">{p.invoice}</h3>
          {batch.demo ? <p className="mo-inv-demo">{p.demo}</p> : null}
        </div>
        <dl className="mo-inv-meta">
          <div>
            <dt>{p.no}</dt>
            <dd>
              <bdi dir="ltr">{batch.invoice}</bdi>
            </dd>
          </div>
          <div>
            <dt>{p.date}</dt>
            <dd>{formatDate(localDay(batch.paidAt), locale)}</dd>
          </div>
        </dl>
      </header>

      <div className="mo-inv-parties">
        <div>
          <p className="k">{p.from}</p>
          <p className="mo-inv-name">
            <bdi>{batch.supplier.name}</bdi>
          </p>
          {batch.supplier.address ? (
            <p>
              <bdi>{batch.supplier.address}</bdi>
            </p>
          ) : null}
          {batch.supplier.gst ? (
            <p>
              {fillNodes(p.gstNo, { n: <bdi dir="ltr">{batch.supplier.gst}</bdi> })}
            </p>
          ) : null}
        </div>
        <div>
          <p className="k">{p.to}</p>
          <p className="mo-inv-name">
            <bdi>{b.org}</bdi>
          </p>
          <p>
            <bdi>{b.address}</bdi>
            {" · "}
            {countryName(b.country, locale)}
          </p>
          {b.reg ? <p>{fillNodes(p.regNo, { n: <bdi dir="ltr">{b.reg}</bdi> })}</p> : null}
          {b.po ? <p>{fillNodes(p.po, { n: <bdi>{b.po}</bdi> })}</p> : null}
          <p>
            <bdi dir="ltr">{b.email}</bdi>
          </p>
        </div>
      </div>

      <table className="mo-inv-t">
        <thead>
          <tr>
            <th scope="col">{p.item}</th>
            <th scope="col">{p.qty}</th>
            <th scope="col" className="mo-inv-u">
              {p.unit}
            </th>
            <th scope="col">{p.amount}</th>
          </tr>
        </thead>
        <tbody>
          {batch.lines.map((line) => (
            <tr key={line.id}>
              <th scope="row">{item[line.id]}</th>
              <td>{line.qty}</td>
              <td className="mo-inv-u">{money(line.amount / line.qty, locale)}</td>
              <td>{money(line.amount, locale)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {(
            [
              ["", p.subtotal, batch.subtotal],
              ["", fill(s.summary.gst, { rate: batch.rate }), batch.gst],
              ["mo-inv-tot", p.total, batch.total],
            ] as const
          ).map(([cls, label, amount]) => (
            <tr key={label} className={cls || undefined}>
              <th scope="row" colSpan={2}>
                {label}
              </th>
              <td className="mo-inv-u" />
              <td>{money(amount, locale)}</td>
            </tr>
          ))}
        </tfoot>
      </table>

      <dl className="mo-inv-f">
        <div>
          <dt>{p.reference}</dt>
          <dd>
            <bdi dir="ltr">{batch.reference}</bdi>
          </dd>
        </div>
        <div>
          <dt>{p.batch}</dt>
          <dd>
            <bdi dir="ltr">{batch.id}</bdi>
          </dd>
        </div>
      </dl>
    </article>
  );
}

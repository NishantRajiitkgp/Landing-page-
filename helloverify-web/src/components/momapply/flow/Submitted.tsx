import type { MomStepsCopy } from "@/lib/copy/momSteps";
import { reportDay } from "@/lib/mom/apply/policy";
import { money } from "@/lib/mom/apply/pricing";
import type { CaseFile } from "@/lib/mom/apply/types";

import { fill } from "../fill";
import { formatDate, formatDay, localDay } from "./format";

/** The paid application: its id, where it is, and the receipt. Coming back to
 *  this page shows the same thing, which is how an applicant tracks it. */
export function Submitted({ file, s, locale }: { file: CaseFile; s: MomStepsCopy; locale: string }) {
  const t = s.submitted;
  const subtotal = file.total - file.gst;
  const rate = subtotal > 0 ? Math.round((file.gst / subtotal) * 100) : 0;
  const when = localDay(file.paidAt);

  return (
    <section className="mf-done" aria-labelledby="mf-done-id">
      <p className="k">{t.k}</p>
      <h2 className="mf-id" id="mf-done-id" dir="ltr">
        {file.id}
      </h2>
      <p className="ma-lede">{t.lede}</p>
      <p className="mf-done-who" dir="auto">
        {file.holder} · {s.about.passes[file.pass]}
      </p>

      <h3 className="mf-done-h" id="mf-tl-k">
        {t.timeline}
      </h3>
      <ol className="mf-tl" aria-labelledby="mf-tl-k">
        <li className="is-done">
          <span className="mf-tl-m" aria-hidden="true" />
          <span>
            <b>{t.submitted}</b>
            <small>{formatDate(when, locale)}</small>
          </span>
        </li>
        <li className="is-now" aria-current="step">
          <span className="mf-tl-m" aria-hidden="true" />
          <span>
            <b>{t.verifying}</b>
          </span>
        </li>
        <li>
          <span className="mf-tl-m" aria-hidden="true" />
          <span>
            <b>{fill(t.report, { date: formatDay(reportDay(when, file.express), locale) })}</b>
          </span>
        </li>
      </ol>

      <h3 className="mf-done-h" id="mf-rc-k">
        {t.receipt}
      </h3>
      <div className="mf-receipt" aria-labelledby="mf-rc-k">
        <ul>
          {file.lines.map((line) => (
            <li key={line.id}>
              <span>{line.id === "express" ? s.summary.express : fill(s.summary[line.id], { n: line.qty })}</span>
              <span>{money(line.amount, locale)}</span>
            </li>
          ))}
          <li className="is-gst">
            <span>{fill(s.summary.gst, { rate })}</span>
            <span>{money(file.gst, locale)}</span>
          </li>
        </ul>
        <p className="mf-sum-tot">
          <span>{t.paid}</span>
          <b>{money(file.total, locale)}</b>
        </p>
        <dl>
          <div>
            <dt>{t.reference}</dt>
            <dd dir="ltr">{file.reference}</dd>
          </div>
          <div>
            <dt>{t.billed}</dt>
            <dd dir="auto">{file.billing.company ? `${file.billing.name} · ${file.billing.company}` : file.billing.name}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

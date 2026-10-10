import Image from "next/image";

import type { MomApplyCopy } from "@/lib/copy/momApply";
import type { MomDoc } from "@/lib/mom/doc";

/** The register page's receipt: what the applicant is starting, what it
 *  costs, what to have at hand. Prices come from the MOM pricing data. */
export function ApplyAside({ t, doc }: { t: MomApplyCopy; doc: MomDoc }) {
  const from = Math.min(...doc.screening.pricing.packagesBand.packages.map((p) => p.amount));
  const caption = doc.hero.logoCaption.replace(/\s+/g, " ").trim();

  return (
    <aside className="ma-aside" aria-labelledby="ma-aside-t">
      <div className="ma-rcpt">
        <div className="ma-mom">
          <Image src="/img/partners/mom.png" alt="" width={36} height={36} />
          <span>{caption}</span>
        </div>
        <p className="k ma-k">{t.aside.k}</p>
        <h2 className="ma-aside-t" id="ma-aside-t">
          {t.aside.title}
        </h2>
        <ol className="ma-steps">
          {t.aside.steps.map((step, i) => (
            <li key={step.t} className={i === 0 ? "is-now" : undefined}>
              <span className="ma-n">{i === 0 ? <span className="dot live" /> : String(i + 1).padStart(2, "0")}</span>
              <span className="ma-st">{step.t}</span>
              <span className="ma-sm">{i === 0 ? t.aside.now : step.m}</span>
            </li>
          ))}
        </ol>
        <div className="ma-tot">
          <span className="ma-tot-l">{t.aside.from}</span>
          <span className="ma-tot-v">SGD {from}</span>
        </div>
        <p className="ma-tot-u">{t.aside.unit}</p>
      </div>
      <div className="ma-ready">
        <p className="k">{t.aside.ready}</p>
        <ul>
          {t.aside.readyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

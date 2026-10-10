import Image from "next/image";

import type { ItalyPartnerCopy } from "@/lib/copy/italyPartner";

/** What joining starts, and what to have at hand for the documents step. */
export function PartnerAside({ t }: { t: ItalyPartnerCopy }) {
  return (
    <aside className="ma-aside" aria-labelledby="ip-aside-t">
      <div className="ma-rcpt">
        <div className="ma-mom">
          <Image src="/img/italy-emblem.png" alt="" width={36} height={36} />
          <span>{t.crumbs.italy}</span>
        </div>
        <p className="k ma-k">{t.aside.k}</p>
        <h2 className="ma-aside-t" id="ip-aside-t">
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

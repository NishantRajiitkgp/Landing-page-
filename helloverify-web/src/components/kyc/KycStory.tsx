/** `/products/customer-kyc`: why KYC, the one decision after the six steps,
 *  and life with and without a KYC desk. */
import Image from "next/image";
import { Tick } from "@/components/brand/Tick";
import { Reveal } from "@/components/about/AboutMotion";
import { d, Head, Source, type KycCopy } from "./kycParts";

/** One photo per reason, from `public/img/kyc/`. */
const WHY = [
  ["law", "/img/kyc/why-law.jpg"],
  ["fraud", "/img/kyc/why-fraud.jpg"],
  ["trust", "/img/kyc/why-trust-her.jpg"],
] as const satisfies readonly [keyof KycCopy["why"]["cards"], string][];

export function KycWhy({ c }: { c: KycCopy["why"] }) {
  const fraud = c.cards.fraud;
  return (
    <section className="wrap kz-sec" aria-labelledby="kyc-why-h">
      <Head k={c.k} h={c.h} id="kyc-why-h" />
      <Reveal className="kz-why">
        {WHY.map(([k, src], i) => (
          <article key={k} className={`kz-why-${k}`} style={d(i)}>
            <div className="kz-ph">
              <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <Image src={src} alt="" width={1152} height={864} sizes="(max-width: 1080px) 92vw, 380px" />
            </div>
            <div className="kz-body">
              <h3>{c.cards[k].t}</h3>
              <p>{c.cards[k].p}</p>
              {k === "fraud" ? <Source lead={fraud.source} name={fraud.sourceName} href={fraud.sourceHref} /> : null}
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}

export function KycDecision({ c }: { c: KycCopy["how"]["decision"] }) {
  return (
    <Reveal className="kz-fork">
      <div className="kz-lead">
        <p className="k">{c.k}</p>
        <h3>{c.h}</h3>
      </div>
      <div className="kz-split">
        <article className="kz-yes">
          <span className="kz-mark" aria-hidden="true"><Tick tone="inverse" /></span>
          <div>
            <h4>{c.approved.t}</h4>
            <p>{c.approved.p}</p>
          </div>
        </article>
        <article className="kz-flag">
          <span className="kz-mark" aria-hidden="true">!</span>
          <div>
            <h4>{c.flagged.t}</h4>
            <p>{c.flagged.p}</p>
          </div>
        </article>
      </div>
    </Reveal>
  );
}

export function KycOps({ c }: { c: KycCopy["ops"] }) {
  return (
    <section className="wrap kz-sec" aria-labelledby="kyc-ops-h">
      <Head k={c.k} h={c.h} id="kyc-ops-h" />
      <Reveal className="kz-ops">
        <article className="kz-ops-off">
          <p className="k">{c.without.k}</p>
          <ul>
            {c.without.items.map((x, i) => (
              <li key={x} style={d(i)}><span className="no" aria-hidden="true" />{x}</li>
            ))}
          </ul>
        </article>
        <article className="kz-ops-on">
          <p className="k">{c.with.k}</p>
          <ul>
            {c.with.items.map((x, i) => (
              <li key={x} style={d(i)}><Tick />{x}</li>
            ))}
          </ul>
        </article>
      </Reveal>
    </section>
  );
}

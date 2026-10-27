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
              <Image src={src} alt="" width={1152} height={864} sizes="(max-width: 1080px) 92vw, 400px" />
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
        <svg className="kz-fork-lines" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} d="M0 60H70C110 60 110 20 200 20" />
          <path className="b" pathLength={1} d="M0 60H70C110 60 110 100 200 100" />
        </svg>
      </div>
      <article className="kz-yes">
        <span className="kz-badge"><Tick tone="inverse" /></span>
        <h4>{c.approved.t}</h4>
        <p>{c.approved.p}</p>
      </article>
      <article className="kz-flag">
        <span className="kz-badge" aria-hidden="true">!</span>
        <h4>{c.flagged.t}</h4>
        <p>{c.flagged.p}</p>
      </article>
    </Reveal>
  );
}

export function KycOps({ c }: { c: KycCopy["ops"] }) {
  return (
    <section className="wrap kz-sec" aria-labelledby="kyc-ops-h">
      <Head k={c.k} h={c.h} id="kyc-ops-h" />
      <Reveal className="kz-ops">
        <div className="kz-ops-off">
          <div className="vis" aria-hidden="true">
            <svg viewBox="0 0 300 160" preserveAspectRatio="none">
              <path d="M40 40C120 140 180 -20 260 120" />
              <path d="M40 120C140 20 160 160 260 40" />
              <path d="M150 20C60 80 240 90 150 140" />
            </svg>
            <span className="v v1" /><span className="v v2" /><span className="v v3" /><span className="v v4" />
            <span className="clock"><i /></span>
          </div>
          <p className="k">{c.without.k}</p>
          <ul>
            {c.without.items.map((x, i) => (
              <li key={x} style={d(i)}><span className="no" aria-hidden="true" />{x}</li>
            ))}
          </ul>
        </div>
        <div className="kz-ops-on">
          <div className="vis" aria-hidden="true">
            <span className="hub"><Tick tone="inverse" /></span>
            <span className="pipe"><i /><i /><i /><i /><i /></span>
            <span className="end"><Tick /></span>
          </div>
          <p className="k">{c.with.k}</p>
          <ul>
            {c.with.items.map((x, i) => (
              <li key={x} style={d(i)}><Tick tone="inverse" />{x}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

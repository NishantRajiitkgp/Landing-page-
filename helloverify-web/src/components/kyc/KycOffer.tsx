/** `/products/customer-kyc`: the bundle as a ticket, who needs KYC, the
 *  RBI split, and the closing band. */
import Image from "next/image";
import { AppLink } from "@/components/chrome/AppLink";
import { Tick } from "@/components/brand/Tick";
import { Arrow } from "@/components/brand/Arrow";
import { Reveal } from "@/components/about/AboutMotion";
import { d, Head, Source, SALES, STEPS, type KycCopy } from "./kycParts";

const TRAITS = ["instant", "automatic", "audit"] as const satisfies readonly (keyof KycCopy["bundle"]["traits"])[];
const LAW = ["banks", "nbfc", "payments", "insurance", "markets", "crypto"] as const satisfies readonly (keyof KycCopy["who"]["law"]["cards"])[];
const PLATFORMS: readonly [keyof KycCopy["who"]["platforms"]["cards"], string, number, number][] = [
  ["gig", "/img/people/01-rider-bengaluru.jpg", 810, 1080],
  ["marketplaces", "/img/v2/sm-shop.jpg", 1300, 867],
  ["rentals", "/img/people/07-tenant-singapore.jpg", 810, 1080],
  ["workforce", "/img/kyc/plat-workforce.jpg", 864, 1152],
  ["agents", "/img/kyc/plat-agents-v2.jpg", 864, 1152],
];

function TraitIcon({ k }: { k: (typeof TRAITS)[number] }) {
  if (k === "instant") return <svg viewBox="0 0 24 24"><path d="M13 2L4 14h8l-1 8 9-12h-8z" /></svg>;
  if (k === "automatic") {
    return <svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" /><path d="M18 2v5h-5M6 22v-5h5" /></svg>;
  }
  return <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path className="tk" pathLength={1} d="M10 14l2 2 4-4" /></svg>;
}

export function KycBundle({ c }: { c: KycCopy["bundle"] }) {
  return (
    <section className="wrap kz-sec" id="bundle" aria-labelledby="kyc-bundle-h">
      <Head k={c.k} h={c.h} id="kyc-bundle-h" />
      <Reveal className="kz-bundle">
        <div className="kz-ticket">
          <span className="kz-glow" aria-hidden="true" />
          <div className="top">
            <p className="k">{c.name}</p>
            <p className="pr">{c.price}</p>
            <p className="per">{c.per}</p>
          </div>
          <span className="perf" aria-hidden="true" />
          <ul>
            {c.items.map((x, i) => (
              <li key={x} style={d(i)}><span className="pip"><Tick /></span>{x}</li>
            ))}
          </ul>
          <p className="plug">{c.plug}<i aria-hidden="true" /></p>
          <div className="hrow">
            <AppLink href={SALES} className="btn kz-btn-light">{c.buy}<Arrow /></AppLink>
            <AppLink href={SALES} className="btn kz-btn-out">{c.sales}</AppLink>
          </div>
        </div>
        <ul className="kz-traits">
          {TRAITS.map((k, i) => (
            <li key={k} className={`t-${k}`} style={d(i)}>
              <span className="kz-ic" aria-hidden="true"><TraitIcon k={k} /></span>
              <h3>{c.traits[k].t}</h3>
              <p>{c.traits[k].p}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function KycWho({ c }: { c: KycCopy["who"] }) {
  return (
    <section className="wrap kz-sec" aria-labelledby="kyc-who-h">
      <Head k={c.k} h={c.h} id="kyc-who-h" />
      <Reveal className="kz-law">
        <div className="kz-law-head">
          <h3>{c.law.h}</h3>
          <p>{c.law.p}</p>
        </div>
        <ul>
          {LAW.map((k, i) => {
            const card = c.law.cards[k];
            return (
              <li key={k} style={d(i)}>
                <span className="wm" aria-hidden="true">{card.tag}</span>
                <span className="kz-tag">{card.tag}</span>
                <h4>{card.t}</h4>
                <p>{card.p}</p>
                <p className="src">{card.src}</p>
              </li>
            );
          })}
        </ul>
      </Reveal>
      <Reveal className="kz-plats">
        <h3>{c.platforms.h}</h3>
        <ul>
          {PLATFORMS.map(([k, src, w, h], i) => (
            <li key={k} style={d(i)}>
              <Image src={src} alt="" width={w} height={h} sizes="(max-width: 1080px) 70vw, 240px" />
              <div className="kz-cap">
                <h4>{c.platforms.cards[k].t}</h4>
                <p>{c.platforms.cards[k].p}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function KycRbi({ c }: { c: KycCopy["rbi"] }) {
  return (
    <section className="wrap kz-sec" aria-labelledby="kyc-rbi-h">
      <Head k={c.k} h={c.h} id="kyc-rbi-h" sub={c.sub} />
      <Reveal className="kz-rbi">
        <div className="does">
          <p className="k">{c.does.k}</p>
          <ul>
            {c.does.items.map((x, i) => (
              <li key={x} style={d(i)}><span className="pip"><Tick /></span>{x}</li>
            ))}
          </ul>
        </div>
        <span className="hand" aria-hidden="true"><Arrow /></span>
        <div className="asks">
          <p className="k">{c.asks.k}</p>
          <ul>
            {c.asks.items.map((x, i) => (
              <li key={x} style={d(i)}><span className="n">{String(i + 1).padStart(2, "0")}</span>{x}</li>
            ))}
          </ul>
          <Source lead={c.asks.source} name={c.asks.sourceName} href={c.asks.sourceHref} tail={c.asks.sourceTail} />
        </div>
      </Reveal>
    </section>
  );
}

export function KycClose({ c }: { c: KycCopy["close"] }) {
  return (
    <div className="wrap">
      <Reveal as="section" className="kz-close">
        <Image className="bg" src="/img/12-phone-signup.jpg" alt="" fill sizes="(max-width: 1080px) 100vw, 1200px" />
        <span className="scrim" aria-hidden="true" />
        <div className="kz-body">
          <span className="six" aria-hidden="true">
            {STEPS.map((k, i) => (
              <i key={k} style={d(i)}><Tick tone="inverse" /></i>
            ))}
          </span>
          <h2 className="h2">{c.h}</h2>
          <p className="lede">{c.sub}</p>
          <div className="hrow">
            <AppLink href="#bundle" className="btn kz-btn-light">{c.cta}<Arrow /></AppLink>
            <AppLink href={SALES} className="btn kz-btn-out">{c.cta2}</AppLink>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

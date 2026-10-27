/** `/partner-with-us`: the programme's advantages as a bento — the 15% on
 *  ink across four cells, seven more beside and under it, the last cell a
 *  way in — then the pull line; and the case for HelloVerify: the record,
 *  six figures that count up once seen, and the reviewed marks. */
import Image from "next/image";
import { Arrow } from "@/components/brand/Arrow";
import { YCBadge } from "@/components/brand/YCBadge";
import { Count, Reveal } from "@/components/about/AboutMotion";
import { CREDENTIAL_MARKS } from "@/lib/content/company";
import { d, Head, Icon, JOIN, TEL, type IconName, type PartnerCopy } from "./partnerParts";

type Adv = PartnerCopy["advantages"];
type Proof = PartnerCopy["proof"];

const ADV: readonly [Exclude<keyof Adv["items"], "commission">, IconName, string][] = [
  ["recurring", "repeat", "spin"],
  ["unlimited", "trend", "draw"],
  ["zero", "wallet", "bob"],
  ["minimum", "check", "draw"],
  ["transparent", "doc", "draw"],
  ["wider", "case", "bob"],
  ["credibility", "medal", "swing"],
];

/** Twelve months of one client's commission, rising. Artwork. */
const BARS = [22, 30, 28, 38, 44, 41, 52, 58, 63, 70, 78, 92];

export function PartnerAdvantages({ c, join }: { c: Adv; join: string }) {
  const lead = c.items.commission;
  return (
    <section className="wrap pw-sec" id="advantages" aria-labelledby="pw-adv-h">
      <Head k={c.k} h={c.h} id="pw-adv-h" sub={c.sub} />
      <Reveal as="ul" className="pw-bento">
        <li className="pw-adv-lead" style={d(0)}>
          <span className="pw-coin pw-coin-lg" aria-hidden="true">₹</span>
          <span className="pw-rate" data-wm={c.rate} aria-hidden="true" />
          <h3>{lead.t}</h3>
          <p>{lead.p}</p>
          <span className="pw-bars" aria-hidden="true">
            {BARS.map((h, i) => (
              <i key={i} style={{ ...d(i), blockSize: `${h}%` }} />
            ))}
          </span>
        </li>
        {ADV.map(([k, icon, mo], i) => (
          <li key={k} className="pw-adv" style={d(i + 1)}>
            <span className={`pw-tile pw-mo-${mo}`}><Icon n={icon} /></span>
            <h3>{c.items[k].t}</h3>
            <p>{c.items[k].p}</p>
          </li>
        ))}
        <li className="pw-adv-go" style={d(8)}>
          <a href={JOIN}>
            <span>{join}</span>
            <Arrow />
          </a>
        </li>
      </Reveal>
      <Reveal className="pw-quote">
        <p>{c.quote}</p>
      </Reveal>
    </section>
  );
}

const STATS = ["checks", "clients", "countries", "catalogue", "rate", "speed"] as const satisfies readonly (keyof Proof["stats"])[];
const BADGES = [
  ["iso", CREDENTIAL_MARKS.iso27001.img, 240, 240],
  ["gdpr", CREDENTIAL_MARKS.gdpr.img, 240, 240],
  ["pbsa", CREDENTIAL_MARKS.pbsa.img, 240, 169],
  ["nsr", CREDENTIAL_MARKS.nsr.img, 240, 112],
] as const satisfies readonly (readonly [keyof Proof["badges"], string, number, number])[];

export function PartnerProof({ c, join, call }: { c: Proof; join: string; call: string }) {
  return (
    <section className="wrap pw-sec pw-proof" aria-labelledby="pw-proof-h">
      <div className="pw-proof-tx">
        <Head k={c.k} h={c.h} id="pw-proof-h" />
        <Reveal className="pw-proof-p">
          <p>{c.p1}</p>
          <p>{c.p2}</p>
          <div className="hrow">
            <a href={JOIN} className="btn pw-btn-red">{join}<Arrow /></a>
            <a href={TEL} className="btn pw-btn-line"><Icon n="phone" className="pw-ic-s" />{call}</a>
          </div>
        </Reveal>
      </div>
      <Reveal className="pw-proof-panel">
        <h3>{c.panel}</h3>
        <ul className="pw-stats">
          {STATS.map((k, i) => (
            <li key={k} style={d(i)}>
              <p className="v"><Count v={c.stats[k].v} /><span className="sr-only">{c.stats[k].v}</span></p>
              <p className="l">{c.stats[k].l}</p>
            </li>
          ))}
        </ul>
        <ul className="pw-badges">
          {BADGES.map(([k, img, w, h], i) => (
            <li key={k} style={d(i)}>
              <Image src={img} alt="" width={w} height={h} sizes="72px" />
              <span>{c.badges[k]}</span>
            </li>
          ))}
        </ul>
        <p className="pw-yc">
          {c.backed} <span className="sr-only">{c.yc}</span><YCBadge />
        </p>
      </Reveal>
    </section>
  );
}

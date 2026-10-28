/** `/partner-with-us`: the programme's eight advantages as one equal
 *  index, then the pull line and a way in; and the case for HelloVerify:
 *  the record, six figures that count up once seen, and the reviewed marks. */
import Image from "next/image";
import { Arrow } from "@/components/brand/Arrow";
import { YCBadge } from "@/components/brand/YCBadge";
import { Count, Reveal } from "@/components/about/AboutMotion";
import { CREDENTIAL_MARKS } from "@/lib/content/company";
import { d, Head, Icon, JOIN, TEL, type PartnerCopy } from "./partnerParts";

type Adv = PartnerCopy["advantages"];
type Proof = PartnerCopy["proof"];

const ADV = [
  "commission",
  "recurring",
  "unlimited",
  "zero",
  "minimum",
  "transparent",
  "wider",
  "credibility",
] as const satisfies readonly (keyof Adv["items"])[];

export function PartnerAdvantages({ c, join }: { c: Adv; join: string }) {
  return (
    <section className="wrap pw-sec" id="advantages" aria-labelledby="pw-adv-h">
      <Head k={c.k} h={c.h} id="pw-adv-h" sub={c.sub} />
      <Reveal as="ul" className="pw-advs">
        {ADV.map((k, i) => (
          <li key={k} style={d(i)}>
            <span className="pw-adv-n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{c.items[k].t}</h3>
            <p>{c.items[k].p}</p>
          </li>
        ))}
      </Reveal>
      <Reveal className="pw-quote">
        <p>{c.quote}</p>
        <a href={JOIN} className="btn pw-btn-red">{join}<Arrow /></a>
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

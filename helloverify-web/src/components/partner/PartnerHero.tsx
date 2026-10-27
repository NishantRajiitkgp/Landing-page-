/** `/partner-with-us`: the hero. The promise and the two ways in on the
 *  ink, the join form on a white card beside it, and under it the page's
 *  own section links. The receipt that floats on the form is decoration. */
import type { ReactNode } from "react";
import { Arrow } from "@/components/brand/Arrow";
import type { PartnerSectionKey } from "@/lib/copy/partner";
import { d, Icon, JOIN, Phone, TEL, Words, type PartnerCopy } from "./partnerParts";

const SECTIONS = ["advantages", "services", "earnings", "process", "faqs"] as const satisfies readonly PartnerSectionKey[];

export function PartnerHero({ c, form }: { c: PartnerCopy; form: ReactNode }) {
  const h = c.hero;
  return (
    <div className="wrap">
      <section className="pw-hero" aria-labelledby="pw-h1">
        <span className="pw-grid" aria-hidden="true" />
        <span className="pw-glow" aria-hidden="true" />
        <div className="pw-hero-copy">
          <p className="k pw-kick"><i aria-hidden="true" />{h.k}</p>
          <h1 className="h1" id="pw-h1">
            <span className="pw-l"><Words text={h.h1} /></span>{" "}
            <em className="pw-l"><Words text={h.h1b} /></em>{" "}
            <em className="pw-l"><Words text={h.h1c} /></em>
          </h1>
          <p className="sub">{h.sub}</p>
          <div className="pw-callout">
            <Icon n="phone" />
            <p>{h.note(<Phone c={c.phone} />)}</p>
          </div>
          <div className="hrow">
            <a href={JOIN} className="btn pw-btn-red">{h.join}<Arrow /></a>
            <a href={TEL} className="btn pw-btn-line"><Icon n="phone" className="pw-ic-s" />{c.phone.callTo}</a>
            <a href="#earnings" className="pw-link">{h.calc}<Arrow /></a>
          </div>
        </div>
        <div className="pw-hero-form" id="join">
          <div className="pw-receipt" aria-hidden="true">
            <span className="pw-coin">₹</span>
            <span>
              <b>{h.chip.k}</b>
              <strong>{h.chip.v}</strong>
              <small>{h.chip.p}</small>
            </span>
          </div>
          {form}
        </div>
      </section>
      <nav className="pw-onpage" aria-label={c.onPage.label}>
        {SECTIONS.map((k, i) => (
          <a key={k} href={`#${k}`} style={d(i)}>{c.onPage.links[k]}</a>
        ))}
        <a href={JOIN} className="pw-onpage-go">{h.join}<Arrow size="14" /></a>
      </nav>
    </div>
  );
}

/** `/partner-with-us`: the hero. The promise and the two ways in, with the
 *  join form on a white card beside it. */
import type { ReactNode } from "react";
import { Arrow } from "@/components/brand/Arrow";
import { Icon, JOIN, Phone, TEL, Words, type PartnerCopy } from "./partnerParts";

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
          {form}
        </div>
      </section>
    </div>
  );
}

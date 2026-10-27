/** `/partner-with-us`: what HelloVerify does once the partner has made the
 *  introduction — six checkpoints on a relay line that fills as it comes on
 *  screen — and what that is worth: the worked example beside the
 *  calculator. */
import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { Reveal } from "@/components/about/AboutMotion";
import { EarningsCalc } from "./EarningsCalc";
import { d, Head, Icon, JOIN, Phone, TEL, type PartnerCopy } from "./partnerParts";

const SUPPORT = ["onboarding", "scope", "online", "reports", "clarifications", "credited"] as const satisfies readonly (keyof PartnerCopy["support"]["items"])[];

export function PartnerSupport({ c }: { c: PartnerCopy }) {
  const s = c.support;
  return (
    <div className="wrap pw-sec">
      <section className="pw-support" aria-labelledby="pw-sup-h">
        <span className="pw-glow" aria-hidden="true" />
        <div className="pw-support-tx">
          <Head k={s.k} h={s.h} id="pw-sup-h" />
          <Reveal className="pw-support-p">
            <p>{s.p1}</p>
            <p>{s.p2}</p>
            <div className="pw-callout">
              <Icon n="phone" />
              <p>{s.note(<Phone c={c.phone} />)}</p>
            </div>
            <div className="hrow">
              <a href={JOIN} className="btn pw-btn-red">{c.hero.join}<Arrow /></a>
              <a href={TEL} className="btn pw-btn-line">{c.phone.call}</a>
            </div>
          </Reveal>
        </div>
        <Reveal as="ul" className="pw-relay">
          {SUPPORT.map((k, i) => (
            <li key={k} style={d(i)}>
              <span className="pip"><Tick tone="inverse" /></span>
              <div>
                <h3>{s.items[k].t}</h3>
                <p>{s.items[k].p}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </section>
    </div>
  );
}

export function PartnerEarnings({ c }: { c: PartnerCopy["earnings"] }) {
  return (
    <section className="wrap pw-sec pw-earn" id="earnings" aria-labelledby="pw-earn-h">
      <div className="pw-earn-tx">
        <Head k={c.k} h={c.h} id="pw-earn-h" />
        <Reveal className="pw-earn-p">
          <p>{c.p1}</p>
          <p>{c.p2}</p>
          <div className="pw-example">
            <h3>{c.example.h}</h3>
            <p>{c.example.p}</p>
            <p className="fine">{c.example.fine}</p>
          </div>
        </Reveal>
      </div>
      <Reveal className="pw-earn-calc">
        <EarningsCalc t={c.calc} join={JOIN} />
      </Reveal>
    </section>
  );
}

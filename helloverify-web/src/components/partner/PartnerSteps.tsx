/** `/partner-with-us`: the five onboarding steps on one track, with the
 *  pause between steps three and four marked on it; what comes with the
 *  account; and the closing band with the call card and the disclaimer. */
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { Reveal } from "@/components/about/AboutMotion";
import { d, Head, Icon, JOIN, Phone, SALES, TEL, type IconName, type PartnerCopy } from "./partnerParts";

type Proc = PartnerCopy["process"];

const STEPS: readonly [keyof Proc["steps"], IconName][] = [
  ["register", "userPlus"],
  ["business", "building"],
  ["documents", "doc"],
  ["agreement", "pen"],
  ["refer", "send"],
];

export function PartnerProcess({ c, phone }: { c: Proc; phone: PartnerCopy["phone"] }) {
  return (
    <section className="wrap pw-sec" id="process" aria-labelledby="pw-proc-h">
      <Head k={c.k} h={c.h} id="pw-proc-h" sub={c.sub(<Phone c={phone} />)} />
      <Reveal className="pw-track">
        <span className="pw-rail" aria-hidden="true"><i /></span>
        <span className="pw-pause" aria-hidden="true"><Icon n="clock" /></span>
        <ol>
          {STEPS.map(([k, icon], i) => (
            <li key={k} style={d(i)}>
              <span className="pw-node">
                <Icon n={icon} />
                <b>{i + 1}</b>
              </span>
              <h3>{c.steps[k].t}</h3>
              <p>{c.steps[k].p}</p>
            </li>
          ))}
        </ol>
        <div className="pw-note pw-between">
          <Icon n="clock" />
          <p>{c.between}</p>
        </div>
      </Reveal>
      <Reveal className="pw-band">
        <span className="pw-band-ic"><Icon n="lock" /></span>
        <p>{c.band}</p>
      </Reveal>
      <p className="pw-offline">{c.offline}</p>
    </section>
  );
}

const KIT: readonly [keyof PartnerCopy["included"]["items"], IconName][] = [
  ["manager", "chat"],
  ["kit", "megaphone"],
  ["training", "cap"],
  ["yours", "shield"],
  ["priority", "bolt"],
  ["statement", "doc"],
];

export function PartnerKit({ c }: { c: PartnerCopy["included"] }) {
  return (
    <section className="wrap pw-sec" aria-labelledby="pw-kit-h">
      <Head k={c.k} h={c.h} id="pw-kit-h" />
      <Reveal as="ul" className="pw-kit">
        {KIT.map(([k, icon], i) => (
          <li key={k} style={d(i)}>
            <span className="pw-tile"><Icon n={icon} /></span>
            <span className="pw-kit-n" aria-hidden="true">{String(i + 1).padStart(2, "0")} / {String(KIT.length).padStart(2, "0")}</span>
            <h3>{c.items[k].t}</h3>
            <p>{c.items[k].p}</p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}

export function PartnerClose({ c, phone }: { c: PartnerCopy["close"]; phone: PartnerCopy["phone"] }) {
  return (
    <div className="wrap">
      <Reveal as="section" className="pw-close">
        <span className="pw-grid" aria-hidden="true" />
        <span className="pw-glow" aria-hidden="true" />
        <div className="pw-close-tx">
          <h2 className="h2">{c.h}</h2>
          <p className="lede">{c.p}</p>
          <p className="pw-close-more">
            {c.travel}
            <br />
            {c.own} <AppLink href={SALES}>{c.sales}</AppLink>
          </p>
          <span className="pw-three" aria-hidden="true"><i /><i /><i /></span>
        </div>
        <div className="pw-callcard">
          <span className="pw-callcard-ic"><Icon n="phone" /></span>
          <h3>{c.call.h}</h3>
          <p>{c.call.p}</p>
          <a href={TEL} className="btn pw-callcard-go" dir="ltr">{phone.display}</a>
          <p className="pw-hours">{c.call.hours}</p>
          <a href={JOIN} className="btn btn-line pw-callcard-form">{c.call.form}<Arrow /></a>
        </div>
      </Reveal>
      <aside className="pw-disclaimer" aria-labelledby="pw-disc-h">
        <h2 id="pw-disc-h">{c.disclaimer.h}</h2>
        <p>{c.disclaimer.p}</p>
      </aside>
    </div>
  );
}

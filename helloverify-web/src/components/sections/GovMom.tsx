/** The Ministry of Manpower case and the premium services band, under the
    government dossiers (`sections/GovDossiers.tsx`, which renders this inside
    its own wrap — the canvas has them as one chapter). Homepage v2.

    The canvas's "calmer" MOM block (`assemble_mom.py`): headline and intro,
    then one card — COMPASS's two stages and a C2 points picker on the left,
    the SGD 108 price on the right. The picker is the one interactive part,
    `./MomPicker`; the rest is static. Prices and the COMPASS rules are the
    MOM page's own, verbatim. */
import Image from "next/image";

import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type MomC2Id } from "@/lib/copy/sections";
import { MomPicker } from "./MomPicker";

const MOM_PAGE = "/governments/manpower-education/ministry-of-manpower";

/** C2 options with the points each scores: the big figure the picker shows. */
const C2: { id: MomC2Id; pts: number }[] = [
  { id: "top", pts: 20 },
  { id: "any", pts: 10 },
  { id: "none", pts: 0 },
];

/** Both premium services are applicant-side and live on the individuals'
 *  immigration page — the hero's "Premium services" door goes there too. */
const PREMIUM = ["health", "immigration"] as const;

export async function GovMom() {
  const t = (await copy(SECTIONS)).govDossiers;
  const m = t.mom;

  return (
    <>
      <div className="mw">
        <div className="mw-kick">
          <span className="mw-logo"><Image src="/img/mom.jpg" alt={m.logoAlt} width={30} height={30} /></span>
          <span className="k">{m.kicker}</span>
          <span className="mw-sg">{m.sg}</span>
          <i aria-hidden="true" />
        </div>
        <div className="mw-head">
          <h3 className="mw-h">
            {m.headingA}
            <br />
            <em>{m.headingB}</em>
          </h3>
          <div className="mw-intro">
            <p>{m.intro}</p>
            <div className="mw-passes">
              <span className="mw-pk">{m.passesK}</span>
              <span className="mw-pl">
                {Object.values(m.passes).map((p) => <span key={p}>{p}</span>)}
              </span>
            </div>
          </div>
        </div>
        <div className="mw-card">
          <div className="mw-l">
            <div className="k">{m.compassK}</div>
            <p className="mw-lp">{m.compassP}</p>
            <ol className="mw-track">
              <li className="mw-st">
                <span className="mw-sn" aria-hidden="true">1</span>
                <div><b>{m.stage1.b}</b><span>{m.stage1.t}</span></div>
              </li>
              <li className="mw-st mw-st-on">
                <span className="mw-sn" aria-hidden="true">2</span>
                <div><b>{m.stage2.b}</b><span>{m.stage2.t}</span></div>
              </li>
            </ol>
            <MomPicker
              heading={m.c2K}
              unit={m.unit}
              options={C2.map(({ id, pts }) => ({ t: m.c2[id].t, label: m.c2[id].pts, pts }))}
            />
            <p className="mw-note">
              {m.noteLead} <span className="mw-hl">{m.noteMark}</span>.
            </p>
          </div>
          <div className="mw-r">
            <div className="mw-rk"><span>{m.pricingK}</span><span>{m.pricingTag}</span></div>
            <div className="mw-tt">{m.priceTitle}</div>
            <p className="mw-sub">{m.priceSub}</p>
            <div className="mw-price"><span className="mw-cur">{m.currency}</span><span className="mw-amt">{m.amount}</span></div>
            <div className="mw-per">{m.per}</div>
            <div className="mw-add">
              {Object.values(m.addons).map((a) => (
                <div key={a.t}><span>{a.t}</span><em>{a.base}</em><b>{a.total}</b></div>
              ))}
            </div>
            <AppLink href={MOM_PAGE} className="mw-cta">
              <span>{m.cta}</span>
              <Arrow />
            </AppLink>
            <div className="mw-who">{m.who}</div>
          </div>
        </div>
      </div>
      <div className="mw-prem">
        <div>
          <div className="k">{t.premium.kicker}</div>
          <p className="mw-prem-h">{t.premium.heading}</p>
        </div>
        <div className="gv-prem-list">
          {PREMIUM.map((id, i) => (
            <AppLink key={id} href="/individuals/immigration" className="gv-prem-row">
              <span className="gv-prem-n" aria-hidden="true">{`0${i + 1}`}</span>
              <span><b>{t.premium.rows[id].t}</b><i>{t.premium.rows[id].p}</i></span>
              <Arrow />
            </AppLink>
          ))}
        </div>
      </div>
    </>
  );
}

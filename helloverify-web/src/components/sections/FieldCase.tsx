/** The field case — "Some checks end at a database. Ours go to the door."
    Homepage v2, 30 Sep 2026, from the founder's brief: global scale, local
    expertise, AI-powered intelligence and deep evidence, through one
    platform.

    One address check in Foumban, Cameroon, followed on a survey map while
    the section is pinned (`./FieldCaseStage`, the client island; the map is
    `./fieldWorld`): the request lands, the AI finds what does not fit, a
    local verifier walks to both doors, the evidence is sealed in-country,
    and a seven-page report rises off the map. Under it, the founder's core
    message and the same platform at work in five other places.

    The case is illustrative and says so (`note`). One tree at every width:
    on a phone the stage sits over the act text inside the pinned frame
    (`app/v2/field.css`). */
import Image from "next/image";

import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
// One sheet per v2 section (see the header of `app/v2/hero.css`).
import "@/app/v2/field.css";
import { FieldCaseScene } from "./FieldCaseScene";
import { FieldCaseStage } from "./FieldCaseStage";

const ELSEWHERE = ["sd", "sy", "eg", "ph", "sa"] as const;

export async function FieldCase() {
  const t = (await copy(SECTIONS)).fieldCase;
  // What the engine paints as words: office and place names, the loupe's.
  const g = t.globe, pl = t.outro.places;
  const labels = {
    dive: { offices: g.offices, cities: { riyadh: g.riyadh, foumban: g.foumban } },
    finale: { offices: g.offices, cities: { foumban: g.foumban, riyadh: g.riyadh, khartoum: pl.sd.city, aleppo: pl.sy.city, cairo: pl.eg.city, davao: pl.ph.city } },
    loupe: t.loupe.label,
    region: g.region,
  };

  return (
    <div className="wrap hair-top fc">
      <div className="fc-mast">
        <span className="k">{t.k}</span>
        <span className="fc-note">{t.note}</span>
      </div>
      <div className="sec-head fc-head">
        <h2 className="h2">
          {t.headingA}
          <br />
          <em className="fc-em">{t.headingEm}</em>
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      <p className="fc-hint">
        <span aria-hidden="true" className="fc-hint-i" />
        {t.hint}
      </p>

      <FieldCaseStage labels={labels}>
        <FieldCaseScene t={t} />
      </FieldCaseStage>

      <div className="fc-outro">
        <p className="fc-line">{t.outro.line}</p>
        <p className="fc-scale-l">{t.outro.scale}</p>
        <div className="fc-also">
          <span className="k">{t.outro.also}</span>
          <ul>
            {ELSEWHERE.map((c) => (
              <li key={c}>
                <Image src={`/flags/${c}.svg`} alt="" width={24} height={18} unoptimized />
                <b>{t.outro.places[c].city}</b>
                <span>{t.outro.places[c].what}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

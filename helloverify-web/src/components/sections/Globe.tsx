/** International — homepage v2's globe (the canvas "09 World — the orb",
    Sep 2026), at every width: on the phone the stage runs edge to edge and
    the card stacks under the orb (`globe.css`). Replaced the five photo
    cards, desktop first and then the phone.

    The words and the flags are rendered here, on the server; the canvas, the
    pins' positions and the card that opens are `./GlobeStage`. */
import { getLocale } from "next-intl/server";

import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { localise } from "@/lib/i18n/href";
import "@/app/v2/globe.css";
import { GlobeStage, type GlobePin } from "./GlobeStage";

type PinId = "in" | "sa" | "ae" | "sg" | "ph" | "eg" | "gb" | "it" | "lv" | "us";

/** Each country's own guide, where one exists (`lib/content/countries.ts`). */
const GUIDE: Partial<Record<PinId, string>> = {
  in: "/countries/india",
  ph: "/countries/philippines",
  sg: "/countries/singapore",
  ae: "/countries/united-arab-emirates",
  eg: "/countries/egypt",
  gb: "/countries/united-kingdom",
};

/** Where each pin sits, and its flag. The flag is the country's official
 *  flag from `public/flags/` (the MIT-licensed flag-icons set, the files the
 *  relay and the country grid use) — never a hand-drawn approximation: the
 *  pins used to carry simplified drawings (India's chakra without its
 *  spokes, a misproportioned UAE flag, and no flag at all for Saudi Arabia,
 *  shown as "KSA"). India comes first because every route starts there. */
const PINS: { id: PinId; lat: number; lon: number; flag: string }[] = [
  { id: "in", lat: 28.5, lon: 77.4, flag: "in" },
  { id: "sa", lat: 24.7, lon: 46.7, flag: "sa" },
  { id: "ae", lat: 25.2, lon: 55.3, flag: "ae" },
  { id: "sg", lat: 1.35, lon: 103.8, flag: "sg" },
  { id: "ph", lat: 14.6, lon: 121.0, flag: "ph" },
  { id: "eg", lat: 30.0, lon: 31.2, flag: "eg" },
  { id: "gb", lat: 51.5, lon: -0.13, flag: "gb" },
  { id: "it", lat: 41.9, lon: 12.5, flag: "it" },
  { id: "lv", lat: 56.95, lon: 24.1, flag: "lv" },
  { id: "us", lat: 40.7, lon: -74.0, flag: "us" },
];

export async function Globe() {
  const t = (await copy(SECTIONS)).international;
  const g = t.globe;
  const locale = await getLocale();
  const L = (href: string) => localise(href, locale);
  const c = g.compass;
  const coord = (lat: number, lon: number) =>
    `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? c.n : c.s} · ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? c.e : c.w}`;

  const pins: GlobePin[] = PINS.map(({ id, lat, lon, flag }) => {
    const p = g.pins[id];
    return {
      id,
      name: p.name,
      flag: `/flags/${flag}.svg`,
      lat,
      lon,
      role: p.role,
      head: p.head,
      rows: p.rows,
      coord: coord(lat, lon),
      buy: L("/contact"),
      guide: GUIDE[id] ? L(GUIDE[id]) : undefined,
    };
  });

  const w = g.world;
  const world = (
    <div className="gb-card gb-card-w">
      <div className="gb-role">{w.k}</div>
      <div className="gb-big">{w.big}<span>{w.plus}</span></div>
      <p className="gb-big-p">{w.line}</p>
      <dl className="gb-imp">
        {Object.values(w.impact).map((m) => (
          <div key={m.l}>
            <dt>{m.l}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>
      <div className="gb-acts">
        <a href={L("/contact")} className="gb-buy">
          {w.cta}
          <Arrow />
        </a>
        <a href={L("/resources/countries")} className="gb-guide">{w.ctaAlt}</a>
      </div>
      <div className="gb-offk">{w.officesK}</div>
      <ul className="gb-offs">
        {w.offices.map((o) => <li key={o}>{o}</li>)}
      </ul>
      <p className="gb-tip"><span className="gb-tipdot" aria-hidden="true" />{w.tip}</p>
    </div>
  );

  return (
    <div className="wrap hair-top gb">
      <div className="gb-mast">
        <span className="k">{g.kicker}</span>
        <span className="gb-sheet">{g.sheet}</span>
      </div>
      <div className="sec-head gb-sh">
        <h2 className="h2">
          {t.headingA}
          <br />
          <em className="gb-it">{t.headingB}</em>
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      <GlobeStage
        pins={pins}
        world={world}
        labels={{ pinCta: g.pinCta, guide: g.guide, canvas: g.canvas, hud: g.hud, compass: c, legend: g.legend, spin: g.spin, speeds: g.speeds, close: g.close }}
      />
      <div className="gb-foot">
        <span>{t.courts}</span>
        <AppLink href="/resources/countries" className="gb-all">
          {t.all}
          <Arrow />
        </AppLink>
      </div>
    </div>
  );
}

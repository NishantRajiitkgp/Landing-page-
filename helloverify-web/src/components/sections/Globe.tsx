/** International, desktop — homepage v2's globe (the canvas "09 World — the
    orb", Sep 2026). Replaces the five photo cards on desktop; the phone keeps
    `International.tsx`'s generated card grid, since the v2 boards have no
    390px artboard.

    The words and the flags are rendered here, on the server; the canvas, the
    pins' positions and the card that opens are `./GlobeStage`. */
import type { ReactNode } from "react";

import { Arrow } from "@/components/brand/Arrow";
import { AppLink } from "@/components/chrome/AppLink";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import "@/app/v2/globe.css";
import { GlobeStage, type GlobePin } from "./GlobeStage";

type PinId = "in" | "sa" | "ae" | "sg" | "ph" | "eg" | "gb" | "it" | "lv" | "us";

/** Where each pin sits, and its flag. India comes first because every route
 *  starts there. Flag hex stays literal — facts about the world, not palette
 *  (the exemption `International.tsx`'s header records); the five drawings
 *  shared with that file's cards are the same paths, and Saudi Arabia has
 *  none on the board, so its pin shows a code. */
const PINS: { id: PinId; lat: number; lon: number; flag?: ReactNode }[] = [
  {
    id: "in", lat: 28.5, lon: 77.4,
    flag: <><rect width="30" height="6.7" fill="#FF9933" /><rect y="6.7" width="30" height="6.6" fill="#FFFFFF" /><rect y="13.3" width="30" height="6.7" fill="#138808" /><circle cx="15" cy="10" r="2.4" fill="none" stroke="#000080" strokeWidth="0.7" /></>,
  },
  { id: "sa", lat: 24.7, lon: 46.7 },
  {
    id: "ae", lat: 25.2, lon: 55.3,
    flag: <><rect width="30" height="6.7" fill="#00732F" /><rect y="6.7" width="30" height="6.6" fill="#FFFFFF" /><rect y="13.3" width="30" height="6.7" fill="#15140F" /><rect x="3" width="8" height="20" fill="#FF0000" /></>,
  },
  {
    id: "sg", lat: 1.35, lon: 103.8,
    flag: <><rect width="30" height="10" fill="#EF3340" /><rect y="10" width="30" height="10" fill="#FFFFFF" /><circle cx="9.5" cy="5" r="2.8" fill="#FFFFFF" /><circle cx="10.6" cy="5" r="2.4" fill="#EF3340" /></>,
  },
  {
    id: "ph", lat: 14.6, lon: 121.0,
    flag: <><rect width="30" height="10" fill="#0038A8" /><rect y="10" width="30" height="10" fill="#CE1126" /><polygon points="3,0 16,10 3,20" fill="#FFFFFF" /><circle cx="8" cy="10" r="1.7" fill="#FCD116" /></>,
  },
  {
    id: "eg", lat: 30.0, lon: 31.2,
    flag: <><rect width="30" height="6.7" fill="#CE1126" /><rect y="6.7" width="30" height="6.6" fill="#FFFFFF" /><rect y="13.3" width="30" height="6.7" fill="#15140F" /><circle cx="15" cy="10" r="1.8" fill="#C09300" /></>,
  },
  {
    id: "gb", lat: 51.5, lon: -0.13,
    flag: <><rect width="30" height="20" fill="#012169" /><path d="M0 0L30 20M30 0L0 20" stroke="#FFFFFF" strokeWidth="4" /><path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.5" /><rect x="12.5" width="5" height="20" fill="#FFFFFF" /><rect y="7.5" width="30" height="5" fill="#FFFFFF" /><rect x="13.5" width="3" height="20" fill="#C8102E" /><rect y="8.5" width="30" height="3" fill="#C8102E" /></>,
  },
  {
    id: "it", lat: 41.9, lon: 12.5,
    flag: <><rect width="10" height="20" fill="#009246" /><rect x="10" width="10" height="20" fill="#FFFFFF" /><rect x="20" width="10" height="20" fill="#CE2B37" /></>,
  },
  {
    id: "lv", lat: 56.95, lon: 24.1,
    flag: <><rect width="30" height="20" fill="#9E3039" /><rect y="8" width="30" height="4" fill="#FFFFFF" /></>,
  },
  {
    id: "us", lat: 40.7, lon: -74.0,
    // Seven stripes on white, 1.54 tall every 3.08 — the board's drawing.
    flag: <><rect width="30" height="20" fill="#FFFFFF" />{[0, 1, 2, 3, 4, 5, 6].map((k) => <rect key={k} y={(k * 3.08).toFixed(2)} width="30" height="1.54" fill="#B22234" />)}<rect width="13" height="10.8" fill="#3C3B6E" /></>,
  },
];

export async function Globe() {
  const t = (await copy(SECTIONS)).international;
  const g = t.globe;
  const c = g.compass;
  const coord = (lat: number, lon: number) =>
    `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? c.n : c.s} · ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? c.e : c.w}`;

  const pins: GlobePin[] = PINS.map(({ id, lat, lon, flag }) => {
    const p = g.pins[id];
    return {
      id,
      name: p.name,
      flag,
      code: "code" in p ? p.code : undefined,
      lat,
      lon,
      role: p.role,
      head: p.head,
      rows: p.rows,
      coord: coord(lat, lon),
    };
  });

  const w = g.world;
  const world = (
    <div className="gb-card gb-card-w">
      <div className="gb-role">{w.k}</div>
      <div className="gb-big">{w.big}<span>{w.plus}</span></div>
      <p className="gb-big-p">{w.line}</p>
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
        labels={{ canvas: g.canvas, hud: g.hud, compass: c, legend: g.legend, spin: g.spin, speeds: g.speeds, close: g.close }}
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

/** The relay's data (homepage v2, Presence): the network the map draws, the
 *  six journeys a visitor can pick by where their candidate's papers are,
 *  the flights' geometry, the camera that follows them, and today's modelled
 *  counts. Pure and DOM-free, shared by `sections/RelayStage.tsx`, its loop
 *  and its painter.
 *
 *  EACH JOURNEY CARRIES A REAL SPECIMEN. The document that flies is one of
 *  the synthetic scans the page already shows (`public/img/docs`, see
 *  `tools/img/specimens`), and the holder's name in the story is the name
 *  printed on it — Sneha's nursing degree, Jerome's transcript.
 *
 *  PLACEHOLDER FIGURES. The journeys' timings and the daily shares below are
 *  illustrative; the founder's real numbers replace them. The one published
 *  anchor is the rate: 20M+ checks since 2018 is ~6,300 a day, one every
 *  ~14 s — the hero ledger's tick (`HeroLedger.tsx`), so the counts agree. */
import type { OfficeId } from "@/lib/copy/sections";
import { MAP_H, MAP_W, px } from "@/lib/sunMap";

export type CityId = keyof typeof CITY;
export type Pt = { x: number; y: number };

/** Latitude, longitude. Projected onto the 1200 x 434 map by `px()`. */
const CITY = {
  thrissur: [10.52, 76.21],
  bengaluru: [12.97, 77.59],
  chennai: [13.08, 80.27],
  hyderabad: [17.39, 78.49],
  mumbai: [19.08, 72.88],
  delhi: [28.61, 77.21],
  iloilo: [10.72, 122.56],
  cebu: [10.32, 123.9],
  manila: [14.6, 121.0],
  cairo: [30.04, 31.24],
  asyut: [27.18, 31.18],
  islamabad: [33.68, 73.05],
  dhaka: [23.81, 90.41],
  kathmandu: [27.72, 85.32],
  colombo: [6.93, 79.86],
  lagos: [6.52, 3.38],
  nairobi: [-1.29, 36.82],
  amman: [31.95, 35.93],
  jakarta: [-6.2, 106.85],
  london: [51.51, -0.13],
  manchester: [53.48, -2.24],
  newYork: [40.71, -74.0],
  toronto: [43.65, -79.38],
  berlin: [52.52, 13.4],
  dubai: [25.2, 55.27],
  abuDhabi: [24.45, 54.38],
  riyadh: [24.71, 46.68],
  doha: [25.29, 51.53],
  muscat: [23.59, 58.41],
  kuwait: [29.38, 47.99],
  singapore: [1.35, 103.82],
  tokyo: [35.68, 139.69],
} as const;

export const at = (c: CityId) => px(CITY[c][0], CITY[c][1]);
export const NODES = Object.keys(CITY) as CityId[];

/** The network the map draws faintly behind a journey. */
export const WEB: readonly (readonly [CityId, CityId])[] = [
  ["thrissur", "abuDhabi"], ["iloilo", "riyadh"], ["bengaluru", "london"], ["asyut", "kuwait"],
  ["hyderabad", "newYork"], ["islamabad", "doha"], ["cebu", "singapore"], ["chennai", "singapore"],
  ["dhaka", "dubai"], ["lagos", "london"], ["abuDhabi", "london"], ["kathmandu", "kuwait"],
  ["nairobi", "riyadh"], ["delhi", "toronto"], ["manila", "tokyo"], ["manchester", "tokyo"],
  ["colombo", "muscat"], ["amman", "abuDhabi"], ["jakarta", "singapore"], ["newYork", "bengaluru"],
  ["mumbai", "berlin"], ["cairo", "dubai"],
];

export type JourneyId = "in" | "ph" | "eg" | "pk" | "ae" | "gb";
/** Below its point — the document rises ABOVE its point as it grows, so a
 *  tag there would be covered — and `br` nudged right, clear of a pin just
 *  west of it (Iloilo, beside Singapore). `t` is kept for a point with no
 *  room below. */
export type Side = "t" | "b" | "br";

/** A journey: the source that issued the document, the hirer, the desk that
 *  works it, the UTC hour it is filed (09:00 at the hirer, so the desk is
 *  open), the minutes after upload at which each of its five steps is
 *  reached, which side of its point each end's tag sits (source, hirer), and
 *  the specimen that flies (its file under `/img/docs/` and proportions). */
export type Journey = {
  src: CityId;
  dst: CityId;
  desk: OfficeId;
  startUtc: number;
  mins: readonly [0, number, number, number, number];
  tag: readonly [Side, Side];
  doc: { f: string; w: number; h: number };
};

const LAND = { w: 1000, h: 747 };
const PORT = { w: 747, h: 1000 };
export const JOURNEYS: Record<JourneyId, Journey> = {
  in: { src: "thrissur", dst: "abuDhabi", desk: "noida", startUtc: 5, mins: [0, 14, 148, 1371, 1409], tag: ["b", "b"], doc: { f: "hw-degree-kl.jpg", w: 470, h: 300 } },
  ph: { src: "iloilo", dst: "riyadh", desk: "manila", startUtc: 6, mins: [0, 9, 72, 1620, 1690], tag: ["br", "b"], doc: { f: "ev-03-tor-ph.jpg", ...PORT } },
  eg: { src: "asyut", dst: "kuwait", desk: "cairo", startUtc: 7, mins: [0, 6, 64, 1100, 1142], tag: ["b", "b"], doc: { f: "ev-04-pharmacy-eg.jpg", ...LAND } },
  pk: { src: "islamabad", dst: "doha", desk: "dubai", startUtc: 6, mins: [0, 20, 185, 4140, 4200], tag: ["b", "b"], doc: { f: "ev-08-mbbs-pk.jpg", ...PORT } },
  ae: { src: "abuDhabi", dst: "london", desk: "dubai", startUtc: 8, mins: [0, 12, 40, 1210, 1260], tag: ["b", "b"], doc: { f: "ev-02-transcript-ae.jpg", ...PORT } },
  gb: { src: "manchester", dst: "tokyo", desk: "singapore", startUtc: 0, mins: [0, 60, 610, 1330, 1395], tag: ["b", "b"], doc: { f: "ev-05-mba-uk.jpg", ...LAND } },
};
export const JOURNEY_ORDER = Object.keys(JOURNEYS) as JourneyId[];

/** A journey plays in `JOURNEY_MS`, as progress 0-1, then holds `HOLD_MS`.
 *  `STEP_AT` is where each step is reached: uploaded, at the desk, at the
 *  source, confirmed, back verified. `LEGS` are the three flights: hirer to
 *  desk, desk to source, source back to hirer. */
export const JOURNEY_MS = 14000;
export const HOLD_MS = 3400;
export const STEP_AT = [0, 0.2, 0.42, 0.66, 0.93] as const;
export const LEGS = [
  [0.05, 0.2],
  [0.25, 0.42],
  [0.7, 0.93],
] as const;

export function stepAt(p: number): number {
  let s = 0;
  for (let i = 0; i < STEP_AT.length; i++) if (p >= STEP_AT[i]) s = i;
  return s;
}

/** Minutes after upload at progress `p`: the step times, joined linearly. */
export function minutesAt(j: Journey, p: number): number {
  if (p >= STEP_AT[4]) return j.mins[4];
  const i = stepAt(p);
  const f = (p - STEP_AT[i]) / (STEP_AT[i + 1] - STEP_AT[i]);
  return j.mins[i] + (j.mins[i + 1] - j.mins[i]) * f;
}

/** The instant a journey has reached at progress `p`, on today's date: the
 *  map's sun and the desks' clocks run on it, not on now. */
export function journeyTime(j: Journey, p: number, today: number): number {
  const d = new Date(today);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), j.startUtc) + minutesAt(j, p) * 60000;
}

/** "1d 4h 10m", with the copy's unit letters. */
export function duration(mins: number, u: { d: string; h: string; m: string }): string {
  const m = Math.round(mins);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const r = m % 60;
  return [d ? `${d}${u.d}` : "", d || h ? `${h}${u.h}` : "", `${r}${u.m}`].filter(Boolean).join(" ");
}

// ── The flights ──────────────────────────────────────────────────────────

export type Arc = { a: Pt; b: Pt; c: Pt };
/** A to B, bowed upwards by `bow` of its length (at least `min`). The
 *  journey's flights bow less than the web, so a flight between two points
 *  does not sail over a third desk and seem to go there. */
export function arcOf(a: Pt, b: Pt, min = 10, bow = 0.16): Arc {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return { a, b, c: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - Math.max(min, d * bow) } };
}
export function on({ a, b, c }: Arc, e: number): Pt {
  const f = 1 - e;
  return { x: f * f * a.x + 2 * f * e * c.x + e * e * b.x, y: f * f * a.y + 2 * f * e * c.y + e * e * b.y };
}
export const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const legAt = (p: number, i: 0 | 1 | 2) => ease(clamp01((p - LEGS[i][0]) / (LEGS[i][1] - LEGS[i][0])));

export type Ends = { src: Pt; dst: Pt; desk: Pt };
export const legsOf = ({ src, dst, desk }: Ends): [Arc, Arc, Arc] => [arcOf(dst, desk), arcOf(desk, src), arcOf(src, dst)];

/** Where the document is at progress `p`: waiting, or riding a flight. */
export function docAt(e: Ends, p: number): Pt {
  const L = legsOf(e);
  if (p < LEGS[0][0]) return e.dst;
  if (p < LEGS[0][1]) return on(L[0], legAt(p, 0));
  if (p < LEGS[1][0]) return e.desk;
  if (p < LEGS[1][1]) return on(L[1], legAt(p, 1));
  if (p < LEGS[2][0]) return e.src;
  if (p < LEGS[2][1]) return on(L[2], legAt(p, 2));
  return e.dst;
}

// ── The camera ───────────────────────────────────────────────────────────

/** The camera: the map point at the centre of the view, and CSS px per map
 *  px. The loop eases it toward `shotAt()` every frame. */
export type Cam = { x: number; y: number; k: number };
type Box = { x0: number; y0: number; x1: number; y1: number };

/** The whole network, Toronto to Tokyo, the Arctic to Jakarta. */
const WIDE: Box = { x0: 300, y0: 28, x1: 1140, y1: 332 };
const box = (...ps: Pt[]): Box => ({ x0: Math.min(...ps.map((p) => p.x)), y0: Math.min(...ps.map((p) => p.y)), x1: Math.max(...ps.map((p) => p.x)), y1: Math.max(...ps.map((p) => p.y)) });

/** What the camera frames at progress `p`: the hirer as the request is
 *  filed, each flight whole while it flies, close on the source while it
 *  checks its records, the hirer as the answer lands, then the whole network. */
export function shotAt(e: Ends, p: number): { b: Box; close: boolean } {
  if (p < LEGS[0][0]) return { b: box(e.dst), close: true };
  if (p < 0.21) return { b: box(e.dst, e.desk), close: false };
  if (p < LEGS[1][1]) return { b: box(e.desk, e.src), close: false };
  if (p < LEGS[2][0]) return { b: box(e.src), close: true };
  if (p < LEGS[2][1]) return { b: box(e.src, e.dst), close: false };
  if (p < 0.985) return { b: box(e.dst), close: true };
  return { b: WIDE, close: false };
}
export const wide = (): { b: Box; close: boolean } => ({ b: WIDE, close: false });

/** The camera that fits `b` into a `vw` x `vh` view, padded, zoomed no closer
 *  than 420 map px across for a close shot (520 for a flight) — the land is
 *  a 2° dot grid, and closer than that it stops reading as land — and no
 *  wider than the map. */
export function fit({ b, close }: { b: Box; close: boolean }, vw: number, vh: number): Cam {
  const pad = close ? 60 : 90;
  const minW = close ? 420 : 520;
  const w = Math.max(b.x1 - b.x0 + 2 * pad, minW, ((b.y1 - b.y0 + 2 * pad) * vw) / vh);
  const k = Math.max(vw / MAP_W, vw / w);
  const hw = vw / k / 2;
  const hh = vh / k / 2;
  const cx = Math.max(hw, Math.min(MAP_W - hw, (b.x0 + b.x1) / 2));
  const cy = hh * 2 >= MAP_H ? MAP_H / 2 : Math.max(hh, Math.min(MAP_H - hh, (b.y0 + b.y1) / 2));
  return { x: cx, y: cy, k };
}

/** Today's figures, modelled. `checks` is the published rate (above); the
 *  rest are placeholders. `forged` is the site's own claim, fraud in 12-14%
 *  of applications (`oneInEight`). */
export const RATE = { secondsPerCheck: 14, borders: 0.41, forged: 0.12, countries: 118 } as const;

export function today(now: number) {
  const secs = (now % 86400000) / 1000;
  const checks = Math.floor(secs / RATE.secondsPerCheck);
  const frac = secs / 86400;
  return {
    checks,
    borders: Math.floor(checks * RATE.borders),
    forged: Math.floor(checks * RATE.forged),
    countries: Math.max(1, Math.round(RATE.countries * (1 - Math.exp(-3.4 * frac)))),
  };
}

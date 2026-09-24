/** The follow-the-sun map's data and time maths (homepage v2, Presence).
 *
 *  Pure and DOM-free, so `sections/SunStage.tsx` (the client island) and its
 *  painter `sections/sunPaint.ts` share one statement of where each office is,
 *  when it is open and which request is being handed on.
 *
 *  THE MAP IS AN EQUIRECTANGULAR 1200 x 434 BOX spanning 74°N to 56°S — the
 *  board's projection (`scripts/assemble_sun.py`), cropped to where the land
 *  and the offices are. `px()` is that projection.
 *
 *  The land dots are in `./sunLand`: only the painter draws them, and it
 *  loads as the map approaches, not with the page. */
import type { OfficeId } from "@/lib/copy/sections";

export const MAP_W = 1200;
export const MAP_H = 434;
/** Card box, px, on the 1200 x 434 map. */
export const CARD_W = 172;
export const CARD_H = 54;

export const px = (lat: number, lon: number) => ({ x: ((lon + 180) / 360) * MAP_W, y: ((74 - lat) / 130) * MAP_H });

export type Office = {
  k: OfficeId;
  tz: string;
  /** Standard-time UTC offset in minutes. Only what the server renders the
   *  hour strip with, before the browser has `Intl` and a clock; replaced
   *  by the real offset (DST included) on mount. */
  std: number;
  x: number;
  y: number;
  /** The card's top-left on the map, placed by hand on the board so no card
   *  covers another office's lamp. */
  cl: number;
  ct: number;
};

/** East to west — the board's order, which is also the hour strip's stack
 *  order, bottom up. */
export const OFFICES: Office[] = [
  { k: "manila", tz: "Asia/Manila", std: 480, ...px(14.6, 121.0), cl: 1014, ct: 104 },
  { k: "singapore", tz: "Asia/Singapore", std: 480, ...px(1.35, 103.8), cl: 872, ct: 318 },
  { k: "noida", tz: "Asia/Kolkata", std: 330, ...px(28.6, 77.2), cl: 792, ct: 22 }, // New Delhi (see `presence.offices`)
  { k: "dubai", tz: "Asia/Dubai", std: 240, ...px(25.2, 55.3), cl: 606, ct: 236 },
  { k: "cairo", tz: "Africa/Cairo", std: 120, ...px(30.0, 31.2), cl: 540, ct: 22 },
  { k: "newYork", tz: "America/New_York", std: -300, ...px(40.7, -74.0), cl: 384, ct: 132 },
];

/** A desk is staffed 09:00–18:00 local, minutes after midnight. */
const OPEN = 540;
const CLOSE = 1080;
const DAY = 1440;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export type Offsets = Record<OfficeId, number>;
export const STD_OFFSETS = Object.fromEntries(OFFICES.map((o) => [o.k, o.std])) as Offsets;

const fmtCache = new Map<string, Intl.DateTimeFormat>();
let offCache: { at: number; v: Offsets } | null = null;

/** Each office's UTC offset at instant `t`, DST included, from `Intl`.
 *  Cached for ten minutes of map time: the 24-hour time-lapse asks ~10
 *  times a second and no zone changes offset more often than that. */
export function offsetsAt(t: number): Offsets {
  if (offCache && Math.abs(t - offCache.at) < 600000) return offCache.v;
  const d = new Date(t);
  const utc = d.getUTCHours() * 60 + d.getUTCMinutes();
  const v = { ...STD_OFFSETS };
  for (const o of OFFICES) {
    let f = fmtCache.get(o.tz);
    if (!f) {
      f = new Intl.DateTimeFormat("en-GB", { timeZone: o.tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      fmtCache.set(o.tz, f);
    }
    let hh = 0;
    let mm = 0;
    for (const p of f.formatToParts(d)) {
      if (p.type === "hour") hh = Number(p.value) % 24;
      if (p.type === "minute") mm = Number(p.value);
    }
    let off = hh * 60 + mm - utc;
    if (off > 840) off -= DAY;
    if (off < -720) off += DAY;
    v[o.k] = off;
  }
  offCache = { at: t, v };
  return v;
}

export type Row = { o: Office; m: number; on: boolean };
export type World = { rows: Row[]; open: Row[]; from: Row | null; to: Row | null; utc: number };

/** Who is at a desk at `t`, and the hand-off to draw: FROM the office that
 *  closed most recently TO the one that opened most recently. Undefined
 *  (null) when every desk is open or every desk is shut. */
export function worldAt(t: number, off: Offsets): World {
  const d = new Date(t);
  const utc = d.getUTCHours() * 60 + d.getUTCMinutes();
  const rows = OFFICES.map((o) => {
    const m = mod(utc + off[o.k], DAY);
    return { o, m, on: m >= OPEN && m < CLOSE };
  });
  const open = rows.filter((r) => r.on);
  const shut = rows.filter((r) => !r.on);
  let from: Row | null = null;
  let to: Row | null = null;
  if (open.length && shut.length) {
    from = shut.reduce((a, b) => (mod(b.m - CLOSE, DAY) < mod(a.m - CLOSE, DAY) ? b : a));
    to = open.reduce((a, b) => (b.m - OPEN < a.m - OPEN ? b : a));
  }
  return { rows, open, from, to, utc };
}

/** The closed office that opens next, and in how many minutes. */
export function nextOpen(w: World): { row: Row; wait: number } {
  const row = w.rows.reduce((a, b) => (mod(OPEN - b.m, DAY) < mod(OPEN - a.m, DAY) ? b : a));
  return { row, wait: mod(OPEN - row.m, DAY) };
}

/** Which offices are at a desk during each UTC hour (tested at half past),
 *  and how many of the 24 hours have anyone at all. */
export function coverage(off: Offsets): { on: boolean[][]; hours: number } {
  const on = Array.from({ length: 24 }, (_, h) =>
    OFFICES.map((o) => {
      const m = mod(h * 60 + 30 + off[o.k], DAY);
      return m >= OPEN && m < CLOSE;
    }),
  );
  return { on, hours: on.filter((r) => r.some(Boolean)).length };
}

export const hhmm = (m: number) => {
  const v = mod(Math.round(m), DAY);
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
};

/** The six desks' places and hours, and the map projection (homepage v2,
 *  Presence). Pure and DOM-free: the relay map (`sections/RelayStage.tsx`,
 *  its loop and painter, and `lib/relayData`) reads where each office is
 *  and whether it is open.
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
};

/** East to west. */
export const OFFICES: Office[] = [
  { k: "manila", tz: "Asia/Manila", std: 480, ...px(14.6, 121.0) },
  { k: "singapore", tz: "Asia/Singapore", std: 480, ...px(1.35, 103.8) },
  { k: "noida", tz: "Asia/Kolkata", std: 330, ...px(28.6, 77.2) }, // New Delhi (see `presence.offices`)
  { k: "dubai", tz: "Asia/Dubai", std: 240, ...px(25.2, 55.3) },
  { k: "cairo", tz: "Africa/Cairo", std: 120, ...px(30.0, 31.2) },
  { k: "newYork", tz: "America/New_York", std: -300, ...px(40.7, -74.0) },
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

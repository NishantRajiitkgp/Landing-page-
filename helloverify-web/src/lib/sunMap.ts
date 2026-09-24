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
 *  THE LAND IS A 2° DOT GRID, sent as a bitmap. The board carried it as
 *  3,711 "lon,lat" pairs in tenths of a degree, 32 KB of text in its script.
 *  Every pair sits on the same lattice — longitudes -179..179 and latitudes
 *  73..-55, both in steps of 2 (checked: all 3,711 do) — so it is 180 x 65
 *  bits, row-major from the north-west, LSB first: 1,463 bytes, 1,952 as
 *  base64. Regenerate from the board's `suDots()` string with the same
 *  lattice if the land ever changes. */
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
  { k: "noida", tz: "Asia/Kolkata", std: 330, ...px(28.5, 77.4), cl: 792, ct: 22 },
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

const DOTS =
  "AAAAcBHtDcD/fwAAAAAwAPz/fwMAABCAAQD5w/wD8P8FAAAMAIL7//9//xOAAP/ff0668QD/HwAA+A8At///////v3/w/////x8++B8AAOD/1//7////////jP////+/+AE/gAcAn9f//////////w/w/////wEs4AEAAHz+////////////gL////8HeAAcAADg5///////////9ADgAf7/f4AnAAAAAH78////////H0QAAAiA//8f8AcAAIBB4////////38ADwAQAOD//5//AQAAHAT/////////A3AAAAAA/v//+T8AAGDz//////////8DAQAAAMD/////AwAAsP//////////LwAAAAAA6P///2IAAAD+//////////8CAAAAAAD///8/CAAA4P//////////JwAAAAAA8P///wYAAAD+/un//////z8AAAAAAAD///8HAAAA/pgP/P//////MQAAAAAA8P//PwAAAMBD9v7//////wcBAAAAAAD///8AAAAAPkD7//////8hEAAAAAAA4P//DwAAAIDhAv//////f8YAAAAAAAD8//8AAAAA+AdE//////8jDwAAAAAAgP//AwAAAMD/APD/////PxgAAAAAAADw/x8AAAAA/n/v//////8HAAAAAAAAAPwDAgAAAOD////7////fwAAAAAAAACgHyAAAACA//9/f/7///8DAAAAAAAAAPQBAAAAAPj//+cv+P//PwAAAAAAAAAAHjAAAADA/////g/+//8EAAAAAAAAAOBhCAAAAP7//99/4D//AAAAAAAAAAAAPAMEAADA////+Qf84BcAAAAAAAAAAAA/AAAAAPz//58fgAf+QAAAAAAAAAAAAA8AAADg////ewA4gA8EAAAAAAAAAADAAAAAAPz//38BgAP4QQAAAAAAAAAAAAgPAADA////zwAwgAwQAAAAAAAAAAAA9Q8AAPj///8HAAVIAAAAAAAAAAAAAID/AQAA////fwBAAAAQAAAAAAAAAAAA+P8AAGDh//8DAAA0GAAAAAAAAAAAAID/HwAAAPj/HwAAgMIBAAAAAAAAAAAA/P8BAACA//8AAAAYXgAAAAAAAAAAAMD/fwAAAPz/BwAAAOOBAQAAAAAAAAAA/P8/AACA/z8AAABgbtQBAAAAAAAAAOD//w8AAPD/AwAAAAQIeAAAAAAAAAAA/P//AQAA/z8AAACAA4APAQAAAAAAAID//w8AAPD/AwAAAAARsEAAAAAAAAAA+P9/AAAA/j8AAAAAAAAAAAAAAAAAAAD//wcAAPD/QwAAAACAIwAAAAAAAAAA8P9/AAAA/z8EAAAAAD8GIAAAAAAAAAD8/wMAAPD/cQAAAAD4ZwAAAAAAAAAAgP8/AAAA/w8HAAAAgP8HAAAAAAAAAAD4/wMAAOD/MAAAAAD//wEBAAAAAAAAgP8PAAAA/g8DAAAA+P8fAAAAAAAAAAD4PwAAAOB/EAAAAID//wMAAAAAAAAAgP8DAAAA/AMAAAAA+P9/AAAAAAAAAAD8HwAAAMA/AAAAAID//wcAAAAAAAAAwP8BAAAA+AEAAAAA8P9/AAAAAAAAAAD8DwAAAIAPAAAAAAAP/gMAAAAAAAAAwB8AAAAAAAAAAAAAEIAfAAEAAAAAAAD+AwAAAAAAAAAAAAAA8AEgAAAAAAAA4AcAAAAAAAAAAAAAAAAAAAYAAAAAAABeAAAAAAAAAAAAAAAAwAAwAAAAAAAAwAMAAAAAAAAAAAAAAAAIgAEAAAAAAAAeAAAAAAAAAAAAAAAAAAAMAAAAAAAA4AEAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAABAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAA=";

/** The land dots as `[x, y, latRad, lonRad]` quadruples. */
export function landDots(): Float32Array {
  const bin = atob(DOTS);
  const out: number[] = [];
  for (let i = 0; i < 180 * 65; i++) {
    if (!((bin.charCodeAt(i >> 3) >> (i & 7)) & 1)) continue;
    const lon = -179 + (i % 180) * 2;
    const lat = 73 - Math.floor(i / 180) * 2;
    const p = px(lat, lon);
    out.push(p.x, p.y, (lat * Math.PI) / 180, (lon * Math.PI) / 180);
  }
  return new Float32Array(out);
}

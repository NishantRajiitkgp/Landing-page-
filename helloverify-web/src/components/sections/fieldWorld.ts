/** The field case's terrain, for `./FieldCaseStage`: six by four kilometres
 *  round Foumban, West Region, Cameroon, drawn as a survey sheet — hill
 *  shading, 10 m contours, the river in its valley, laterite roads, the
 *  town's roofs — plus the painter for the "satellite captures" the
 *  evidence cards carry.
 *
 *  Everything is generated from a fixed seed, so every visitor gets the
 *  same town, and nothing is fetched: the terrain is ILLUSTRATIVE (a
 *  plausible town at Foumban's latitude and height, not a survey of it).
 *  The coordinates it prints come from `toLatLon`, a local flat projection
 *  about the town centre — accurate to metres over six kilometres.
 *
 *  COLOUR COMES FROM CSS, as in `./relayWorld`: `readFieldPalette()` reads
 *  the tokens and the `--v2-fc-*` tints (`app/v2/field.css`) off the stage,
 *  and `rgba()` recombines them. No colour is typed in this file. */

export type RGB = [number, number, number];
export type Pt = readonly [number, number];

const TOKENS = {
  paper: "--paper",
  ink: "--ink",
  green: "--green",
  greenLight: "--green-light",
  red: "--red",
  white: "--white",
  low: "--v2-fc-low",
  high: "--v2-fc-high",
  road: "--v2-fc-road",
  river: "--v2-fc-river",
  veg1: "--v2-fc-veg1",
  veg2: "--v2-fc-veg2",
  veg3: "--v2-fc-veg3",
  earth: "--v2-fc-earth",
  roof: "--v2-fc-roof",
  rust: "--v2-fc-rust",
};
export type FieldPalette = Record<keyof typeof TOKENS, RGB>;

function hexRgb(v: string): RGB {
  const h = v.trim().replace("#", "");
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function readFieldPalette(el: Element): { pal: FieldPalette; mono: string } {
  const cs = getComputedStyle(el);
  const pal = Object.fromEntries(Object.entries(TOKENS).map(([k, v]) => [k, hexRgb(cs.getPropertyValue(v))])) as FieldPalette;
  return { pal, mono: cs.getPropertyValue("--mono").trim() || "monospace" };
}
export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// ── the sheet ────────────────────────────────────────────────────────────

/** The sheet, in metres; y runs south. */
export const MAP_W = 6000;
export const MAP_H = 4200;
/** Foumban's centre sits at this point of the sheet. */
const ORIGIN = { lat: 5.727, lon: 10.9004, x: 3000, y: 2100 };
const M_PER_DEG = 111320;
const COS = Math.cos((ORIGIN.lat * Math.PI) / 180);
export const toLatLon = (x: number, y: number) => ({
  lat: ORIGIN.lat - (y - ORIGIN.y) / M_PER_DEG,
  lon: ORIGIN.lon + (x - ORIGIN.x) / (M_PER_DEG * COS),
});
export const toXY = (lat: number, lon: number): Pt => [ORIGIN.x + (lon - ORIGIN.lon) * M_PER_DEG * COS, ORIGIN.y - (lat - ORIGIN.lat) * M_PER_DEG];

/** The case's places. */
export const PLACES = {
  /** The field partner's desk, on the main road east of the market. */
  partner: [3060, 2257] as Pt,
  /** The declared address, down a lane behind the central market. */
  declared: [2600, 2180] as Pt,
  /** Where she lives: the location she shared, in the newer quarter north-east. */
  shared: [4100, 1500] as Pt,
  market: [2720, 2215] as Pt,
};
export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Roads: `w` is the carriageway in metres. */
export const ROADS: { w: number; pts: Pt[] }[] = [
  { w: 15, pts: [[0, 2500], [1200, 2400], [2200, 2300], [3000, 2250], [3900, 2350], [6000, 2600]] },
  { w: 12, pts: [[3000, 2250], [3300, 1900], [3700, 1650], [4100, 1500], [4700, 1300], [6000, 900]] },
  { w: 11, pts: [[2200, 2300], [2100, 3000], [1900, 4200]] },
  { w: 9, pts: [[1200, 2400], [1500, 1500], [2600, 1100], [3700, 1650]] },
  { w: 8, pts: [[3900, 2350], [4500, 3200], [5200, 4200]] },
  { w: 8, pts: [[1500, 1500], [700, 900], [0, 700]] },
  { w: 7, pts: [[2600, 1100], [2900, 0]] },
  { w: 6, pts: [[2600, 2275], [2600, 2180], [2520, 2080]] },
  { w: 6, pts: [[4100, 1500], [4150, 1380], [4300, 1250]] },
  { w: 6, pts: [[3700, 1650], [3850, 1900], [4300, 1950]] },
  { w: 6, pts: [[2400, 2290], [2380, 1900], [2600, 1700], [3300, 1900]] },
  { w: 5, pts: [[3000, 2250], [2950, 2600], [3200, 2900]] },
];
export const RIVER: Pt[] = [[0, 1250], [700, 1400], [1500, 1850], [2050, 2600], [2600, 2850], [3600, 3120], [4700, 3300], [6000, 3550]];

/** The verifier's walk: desk → declared address → back to the main road →
 *  north-east to where she lives. Along the roads above. */
export const ROUTE: Pt[] = [PLACES.partner, [3000, 2250], [2600, 2275], PLACES.declared, [2600, 2275], [3000, 2250], [3300, 1900], [3700, 1650], PLACES.shared];
const SEG = ROUTE.slice(1).map((p, i) => dist(ROUTE[i], p));
export const ROUTE_LEN = SEG.reduce((a, b) => a + b, 0);
/** How far along the route (metres) the declared address is reached. */
export const AT_DECLARED = SEG.slice(0, 3).reduce((a, b) => a + b, 0);
/** The point `m` metres along the route. */
export function along(m: number): Pt {
  let left = Math.max(0, Math.min(ROUTE_LEN, m));
  for (let i = 0; i < SEG.length; i++) {
    if (left <= SEG[i] || i === SEG.length - 1) {
      const t = SEG[i] ? Math.min(1, left / SEG[i]) : 0;
      return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * t, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * t];
    }
    left -= SEG[i];
  }
  return ROUTE[ROUTE.length - 1];
}

// ── noise ────────────────────────────────────────────────────────────────

function hash(ix: number, iy: number, seed: number) {
  let h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed), c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
function fbm(x: number, y: number, seed: number, oct = 5) {
  let s = 0, a = 0.5, f = 1, n = 0;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, seed + i * 17); n += a; a *= 0.5; f *= 2.03; }
  return s / n;
}
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function distToLine(p: Pt, pts: readonly Pt[]) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / L));
    best = Math.min(best, Math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy));
  }
  return best;
}

/** Height above sea level, metres: rolling plateau near 1,150 m, a hill
 *  north-east of the newer quarter, the river's valley cut through. */
export function height(x: number, y: number) {
  const base = 1150 + 78 * (fbm(x / 1900, y / 1900, 7) - 0.5) + 22 * (fbm(x / 520, y / 520, 31, 4) - 0.5);
  const hill = 70 * Math.exp(-((x - 4900) ** 2 + (y - 900) ** 2) / (2 * 900 ** 2)) + 40 * Math.exp(-((x - 900) ** 2 + (y - 3500) ** 2) / (2 * 700 ** 2));
  const d = distToLine([x, y], RIVER);
  const valley = 46 * Math.exp(-(d * d) / (2 * 380 ** 2));
  return base + hill - valley;
}

// ── the sheet's geometry, built once ─────────────────────────────────────

const CELL = 40;
const GX = MAP_W / CELL + 1;
const GY = MAP_H / CELL + 1;

export type Sheet = {
  h: Float32Array;
  min: number;
  max: number;
  contours: Path2D;
  index: Path2D;
  buildings: Path2D;
  market: Path2D;
  bldgs: { x: number; y: number; w: number; d: number; a: number }[];
  shade: HTMLCanvasElement;
};

export const altAt = (s: Sheet, x: number, y: number) => {
  const gx = Math.max(0, Math.min(GX - 1, Math.round(x / CELL))), gy = Math.max(0, Math.min(GY - 1, Math.round(y / CELL)));
  return s.h[gy * GX + gx];
};

/** Marching squares at `level` over the grid, as line segments in metres. */
function contour(h: Float32Array, level: number, into: Path2D) {
  const P = (i: number, j: number) => h[j * GX + i];
  const lerp = (a: number, b: number) => (level - a) / (b - a || 1e-6);
  for (let j = 0; j < GY - 1; j++) {
    for (let i = 0; i < GX - 1; i++) {
      const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
      const k = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (k === 0 || k === 15) continue;
      const x = i * CELL, y = j * CELL;
      const top: Pt = [x + lerp(a, b) * CELL, y];
      const right: Pt = [x + CELL, y + lerp(b, c) * CELL];
      const bottom: Pt = [x + lerp(d, c) * CELL, y + CELL];
      const left: Pt = [x, y + lerp(a, d) * CELL];
      const seg = (p: Pt, q: Pt) => { into.moveTo(p[0], p[1]); into.lineTo(q[0], q[1]); };
      switch (k) {
        case 1: case 14: seg(left, bottom); break;
        case 2: case 13: seg(bottom, right); break;
        case 3: case 12: seg(left, right); break;
        case 4: case 11: seg(top, right); break;
        case 6: case 9: seg(top, bottom); break;
        case 7: case 8: seg(left, top); break;
        case 5: seg(left, top); seg(bottom, right); break;
        case 10: seg(top, right); seg(left, bottom); break;
      }
    }
  }
}

/** Where people build: the old town round the market, the newer quarter
 *  north-east, a thin scatter along every road. */
function urban(x: number, y: number) {
  const g = (cx: number, cy: number, s: number) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));
  return Math.min(0.95, 0.9 * g(2850, 2230, 620) + 0.75 * g(4150, 1470, 380) + 0.35 * g(3500, 1800, 500) + 0.07);
}

export function buildSheet(pal: FieldPalette): Sheet {
  const h = new Float32Array(GX * GY);
  let min = Infinity, max = -Infinity;
  for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
    const v = height(i * CELL, j * CELL);
    h[j * GX + i] = v; min = Math.min(min, v); max = Math.max(max, v);
  }
  const contours = new Path2D(), index = new Path2D();
  for (let lv = Math.ceil(min / 10) * 10; lv < max; lv += 10) contour(h, lv, lv % 50 === 0 ? index : contours);

  // Buildings: plots along each road, then infill round the two centres.
  const r = rng(4417);
  const bldgs: Sheet["bldgs"] = [];
  const onRoad = (x: number, y: number) => ROADS.some((rd) => distToLine([x, y], rd.pts) < rd.w / 2 + 7);
  for (const rd of ROADS) {
    for (let s = 0; s < rd.pts.length - 1; s++) {
      const [ax, ay] = rd.pts[s], [bx, by] = rd.pts[s + 1];
      const L = Math.hypot(bx - ax, by - ay), a = Math.atan2(by - ay, bx - ax);
      for (let m = 0; m < L; m += 24 + r() * 14) {
        for (const side of [-1, 1]) {
          const x0 = ax + ((bx - ax) * m) / L, y0 = ay + ((by - ay) * m) / L;
          if (r() > urban(x0, y0)) continue;
          const off = rd.w / 2 + 12 + r() * 30;
          const x = x0 - Math.sin(a) * off * side, y = y0 + Math.cos(a) * off * side;
          if (onRoad(x, y) || distToLine([x, y], RIVER) < 60) continue;
          bldgs.push({ x, y, w: 9 + r() * 11, d: 7 + r() * 8, a: a + (r() - 0.5) * 0.12 });
        }
      }
    }
  }
  for (let n = 0; n < 2600; n++) {
    const x = 1900 + r() * 2900, y = 1000 + r() * 1900;
    if (r() > urban(x, y) * 0.9 || onRoad(x, y) || distToLine([x, y], RIVER) < 70) continue;
    if (bldgs.some((b) => Math.abs(b.x - x) < 18 && Math.abs(b.y - y) < 18)) continue;
    bldgs.push({ x, y, w: 8 + r() * 10, d: 7 + r() * 7, a: (r() - 0.5) * 0.6 });
  }
  const buildings = new Path2D();
  for (const b of bldgs) {
    const c = Math.cos(b.a), s = Math.sin(b.a), hw = b.w / 2, hd = b.d / 2;
    const pts: Pt[] = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
    pts.forEach(([u, v], i) => (i ? buildings.lineTo : buildings.moveTo).call(buildings, b.x + u * c - v * s, b.y + u * s + v * c));
    buildings.closePath();
  }
  const market = new Path2D();
  market.rect(PLACES.market[0] - 55, PLACES.market[1] - 45, 110, 70);

  // Hill shading: height graded low → high, lit from the north-west.
  const shade = document.createElement("canvas");
  shade.width = GX; shade.height = GY;
  const sc = shade.getContext("2d");
  if (sc) {
    const img = sc.createImageData(GX, GY);
    for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
      const v = h[j * GX + i];
      const dx = h[j * GX + Math.min(GX - 1, i + 1)] - h[j * GX + Math.max(0, i - 1)];
      const dy = h[Math.min(GY - 1, j + 1) * GX + i] - h[Math.max(0, j - 1) * GX + i];
      const lit = Math.max(-1, Math.min(1, (-dx - dy) / 22));
      const c = mix(pal.low, pal.high, (v - min) / (max - min));
      const k = 1 + lit * 0.09;
      const o = (j * GX + i) * 4;
      // Feathered at the sheet's edge, so it blooms in during the dive.
      const edge = Math.min(i, j, GX - 1 - i, GY - 1 - j) / 10;
      img.data[o] = c[0] * k; img.data[o + 1] = c[1] * k; img.data[o + 2] = c[2] * k; img.data[o + 3] = 255 * Math.min(1, edge);
    }
    sc.putImageData(img, 0, 0);
  }
  return { h, min, max, contours, index, buildings, market, bldgs, shade };
}

// ── drawing ──────────────────────────────────────────────────────────────

export type Cam = { x: number; y: number; z: number };

/** Draws the sheet with the camera `cam` into a canvas `w`×`h` CSS px.
 *  `k` is px per metre at z = 1; `wash` (0-1) pales it (the in-country act);
 *  `alpha` fades the whole sheet in over whatever is under it (the dive). */
export function drawSheet(ctx: CanvasRenderingContext2D, s: Sheet, pal: FieldPalette, cam: Cam, w: number, h: number, k: number, dpr: number, wash: number, alpha = 1) {
  const scale = k * cam.z;
  // No backdrop: the caller clears to paper, and during the dive the region
  // round the sheet stays visible past its feathered edge.
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (w / 2 - cam.x * scale), dpr * (h / 2 - cam.y * scale));
  const px = 1 / scale;

  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = 0.9 * alpha;
  ctx.drawImage(s.shade, -CELL / 2, -CELL / 2, GX * CELL, GY * CELL);
  ctx.globalAlpha = alpha;

  // The river, in its valley.
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  const line = (pts: readonly Pt[]) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  line(RIVER);
  ctx.strokeStyle = rgba(pal.river, 0.22); ctx.lineWidth = Math.max(34, 7 * px); ctx.stroke();
  ctx.strokeStyle = rgba(pal.river, 0.7); ctx.lineWidth = Math.max(9, 1.6 * px); ctx.stroke();

  // Contours: 10 m hairlines, 50 m index lines a touch heavier.
  ctx.strokeStyle = rgba(pal.green, 0.2); ctx.lineWidth = 0.7 * px; ctx.stroke(s.contours);
  ctx.strokeStyle = rgba(pal.green, 0.38); ctx.lineWidth = 1.15 * px; ctx.stroke(s.index);

  // Roads: a pale casing, then laterite.
  for (const rd of ROADS) {
    line(rd.pts);
    ctx.strokeStyle = rgba(pal.white, 0.85); ctx.lineWidth = Math.max(rd.w + 8, 3 * px); ctx.stroke();
  }
  for (const rd of ROADS) {
    line(rd.pts);
    ctx.strokeStyle = rgba(pal.road, 0.78); ctx.lineWidth = Math.max(rd.w, 1.4 * px); ctx.stroke();
  }

  // Roofs, and the market hall.
  ctx.fillStyle = rgba(pal.ink, 0.5); ctx.fill(s.buildings);
  ctx.fillStyle = rgba(pal.ink, 0.12); ctx.fill(s.market);
  ctx.strokeStyle = rgba(pal.ink, 0.5); ctx.lineWidth = 1 * px; ctx.stroke(s.market);

  if (wash > 0) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = rgba(pal.paper, 0.55 * wash);
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

/** Graticule every 0.005° with edge labels, in screen space. Labels stay
 *  clear of the HUD (above `top`) and the scale bar (bottom-left). */
export function drawGraticule(ctx: CanvasRenderingContext2D, pal: FieldPalette, mono: string, cam: Cam, w: number, h: number, k: number, dpr: number, top = 0, alpha = 1) {
  const scale = k * cam.z;
  const sx = (x: number) => w / 2 + (x - cam.x) * scale, sy = (y: number) => h / 2 + (y - cam.y) * scale;
  const tl = toLatLon(cam.x - w / 2 / scale, cam.y - h / 2 / scale), br = toLatLon(cam.x + w / 2 / scale, cam.y + h / 2 / scale);
  // The finest round step whose lines stay 110px apart: 1° from high up,
  // down to 0.0025° at the door.
  const degPx = M_PER_DEG * scale;
  const step = [0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5].find((v) => v * degPx >= 110) ?? 5;
  const dp = step < 0.01 ? 4 : step < 0.1 ? 3 : step < 1 ? 2 : 0;
  if (alpha <= 0 || (br.lon - tl.lon) / step > 60) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = rgba(pal.ink, 0.1); ctx.lineWidth = 1;
  ctx.fillStyle = rgba(pal.ink, 0.45);
  ctx.font = `10px ${mono}`;
  ctx.setLineDash([2, 4]);
  for (let lon = Math.ceil(tl.lon / step) * step; lon < br.lon; lon += step) {
    const x = sx(toXY(ORIGIN.lat, lon)[0]);
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    if (x > 150 && x < w - 80) ctx.fillText(`${lon.toFixed(dp)}°E`, x + 4, h - 10);
  }
  for (let lat = Math.ceil(br.lat / step) * step; lat < tl.lat; lat += step) {
    const y = sy(toXY(lat, ORIGIN.lon)[1]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    if (y > top && y < h - 60) ctx.fillText(`${lat.toFixed(dp)}°N`, 10, y - 4);
  }
  ctx.setLineDash([]);
  ctx.restore();
}

// ── satellite captures ───────────────────────────────────────────────────

/** Paints a top-down "satellite capture" of the sheet round `c`, `span`
 *  metres across, into `cv`: bush and gardens, bare laterite yards, the
 *  roads, tin roofs (some rusted) with their shadows, and trees. */
export function paintCapture(cv: HTMLCanvasElement, s: Sheet, pal: FieldPalette, c: Pt, span: number) {
  const W = cv.width, H = cv.height, ctx = cv.getContext("2d");
  if (!ctx) return;
  const m = span / W;
  const X = (u: number) => c[0] - span / 2 + u * m, Y = (v: number) => c[1] - (H * m) / 2 + v * m;
  const img = ctx.createImageData(W, H);
  const near = (x: number, y: number) => {
    let best = Infinity;
    for (const b of s.bldgs) if (Math.abs(b.x - x) < 60 && Math.abs(b.y - y) < 60) best = Math.min(best, Math.hypot(b.x - x, b.y - y));
    return best;
  };
  // A coarse "yard" field first (cheap), then per-pixel colour.
  const yard = new Float32Array(Math.ceil(W / 4) * Math.ceil(H / 4));
  const YW = Math.ceil(W / 4);
  for (let v = 0; v < H; v += 4) for (let u = 0; u < W; u += 4) yard[(v / 4) * YW + u / 4] = Math.max(0, 1 - near(X(u), Y(v)) / 34);
  for (let v = 0; v < H; v++) for (let u = 0; u < W; u++) {
    const x = X(u), y = Y(v);
    const n = fbm(x / 24, y / 24, 91, 4), n2 = fbm(x / 7, y / 7, 57, 3);
    let col = n < 0.45 ? mix(pal.veg1, pal.veg2, n / 0.45) : mix(pal.veg2, pal.veg3, (n - 0.45) / 0.55);
    const yd = yard[Math.floor(v / 4) * YW + Math.floor(u / 4)];
    col = mix(col, pal.earth, Math.min(0.92, yd * 1.25 * (0.75 + 0.5 * n2)));
    const k = 0.86 + n2 * 0.26;
    const o = (v * W + u) * 4;
    img.data[o] = col[0] * k; img.data[o + 1] = col[1] * k; img.data[o + 2] = col[2] * k; img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  ctx.save();
  ctx.scale(1 / m, 1 / m);
  ctx.translate(-(c[0] - span / 2), -(c[1] - (H * m) / 2));
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const rd of ROADS) {
    ctx.beginPath(); rd.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = rgba(pal.earth, 0.95); ctx.lineWidth = rd.w + 3; ctx.stroke();
    ctx.strokeStyle = rgba(pal.road, 0.55); ctx.lineWidth = rd.w * 0.6; ctx.stroke();
  }
  const r = rng(Math.round(c[0] * 7 + c[1]));
  for (const b of s.bldgs) {
    if (Math.abs(b.x - c[0]) > span * 0.7 || Math.abs(b.y - c[1]) > span * 0.6) continue;
    ctx.save();
    ctx.translate(b.x, b.y); ctx.rotate(b.a);
    ctx.fillStyle = rgba(pal.ink, 0.35);
    ctx.fillRect(-b.w / 2 + 1.6, -b.d / 2 + 1.6, b.w, b.d);
    const rusty = r() < 0.4;
    ctx.fillStyle = rgba(rusty ? pal.rust : pal.roof, 1);
    ctx.fillRect(-b.w / 2, -b.d / 2, b.w, b.d);
    // Corrugations, and the ridge.
    ctx.strokeStyle = rgba(pal.ink, 0.12); ctx.lineWidth = 0.35;
    for (let t = -b.w / 2 + 0.8; t < b.w / 2; t += 0.9) { ctx.beginPath(); ctx.moveTo(t, -b.d / 2); ctx.lineTo(t, b.d / 2); ctx.stroke(); }
    ctx.fillStyle = rgba(pal.white, 0.18); ctx.fillRect(-b.w / 2, -b.d / 2, b.w, b.d / 2);
    ctx.restore();
  }
  // Trees: dark crowns with a shadow to the south-east.
  for (let n = 0; n < 70; n++) {
    const x = c[0] + (r() - 0.5) * span, y = c[1] + (r() - 0.5) * span * (H / W);
    if (near(x, y) < 8 || ROADS.some((rd) => distToLine([x, y], rd.pts) < rd.w)) continue;
    const rad = 2.5 + r() * 4;
    ctx.fillStyle = rgba(pal.ink, 0.3); ctx.beginPath(); ctx.arc(x + rad * 0.5, y + rad * 0.5, rad, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(pal.veg1, 1); ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(pal.veg3, 0.35); ctx.beginPath(); ctx.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ── Plus Codes (Open Location Code), for the coordinates HUD ─────────────

const OLC = "23456789CFGHJMPQRVWX";
/** A 10-digit Plus Code (~14 m square) for `lat`, `lon`. */
export function plusCode(lat: number, lon: number) {
  // Plus Codes truncate, never round: the code names the cell the point is in.
  let la = Math.floor((Math.min(90, Math.max(-90, lat)) + 90) * 8000 + 1e-7);
  let lo = Math.floor(((((lon + 180) % 360) + 360) % 360) * 8000 + 1e-7);
  let code = "";
  const res = [160000, 8000, 400, 20, 1];
  for (const r of res) {
    code += OLC[Math.floor(la / r) % 20] + OLC[Math.floor(lo / r) % 20];
    la %= r; lo %= r;
    if (code.length === 8) code += "+";
  }
  return code;
}

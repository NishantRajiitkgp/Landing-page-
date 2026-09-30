/** The field case's orbit (`./fieldLoop`): the globe the case starts on and
 *  pulls back out to. An orthographic Earth — a luminous mint-glass orb,
 *  the land as brand-green dots (`lib/globeLand`, the International globe's
 *  own points), HelloVerify's six offices — carrying the request's arc from
 *  Riyadh to Foumban, and at the end, checks lit across the land with the
 *  places they run to flowing into the nearest office.
 *
 *  The lit checks are ILLUSTRATIVE (a fixed sample of land points, not a
 *  feed). Colour comes from CSS through `./fieldWorld`'s palette; none is
 *  typed here. */
import { LAND } from "@/lib/globeLand";

import { rgba, type FieldPalette } from "./fieldWorld";

export const EARTH = 6371000;
const D = Math.PI / 180;

export type GeoCam = { lat: number; lon: number; R: number };
export type Place = readonly [number, number];

export const CITY: Record<"riyadh" | "foumban" | "khartoum" | "aleppo" | "cairo" | "davao", Place> = {
  riyadh: [24.7136, 46.6753],
  foumban: [5.727, 10.9004],
  khartoum: [15.5007, 32.5599],
  aleppo: [36.2021, 37.1343],
  cairo: [30.0444, 31.2357],
  davao: [7.1907, 125.4553],
};
/** The six offices, east to west, as the relay has them (`lib/sunMap`). */
export const OFFICE: Record<"manila" | "singapore" | "newDelhi" | "dubai" | "cairo" | "newYork", Place> = {
  manila: [14.6, 121.0],
  singapore: [1.35, 103.8],
  newDelhi: [28.6, 77.2],
  dubai: [25.2, 55.3],
  cairo: [30.0, 31.2],
  newYork: [40.7, -74.0],
};
/** Which office each place's check flows to, in the finale. */
const FLOWS: [keyof typeof CITY, keyof typeof OFFICE][] = [
  ["foumban", "cairo"], ["khartoum", "cairo"], ["aleppo", "dubai"], ["riyadh", "dubai"], ["davao", "manila"],
];

let land: Float32Array | null = null;
/** Land points as radians, `[lat, lon, …]`, parsed once. */
function landPts() {
  if (land) return land;
  const v = LAND.split(",").map(Number);
  land = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) land[i] = (v[i] / 10) * D;
  return land;
}

/** Orthographic projection about the camera: screen x, y and the cosine of
 *  the angle from the centre (≤ 0 is the far side). `lift` raises the point
 *  above the surface, as a fraction of the radius. */
export function project(c: GeoCam, lat: number, lon: number, w: number, h: number, lift = 0): [number, number, number] {
  const p0 = c.lat * D, l0 = c.lon * D, p = lat * D, l = lon * D;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
  const r = c.R * (1 + lift);
  const x = r * Math.cos(p) * Math.sin(l - l0);
  const y = r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0));
  return [w / 2 + x, h / 2 - y, cosc];
}

/** Points along the great circle a → b, `n` + 1 of them, as [lat, lon]. */
function greatCircle(a: Place, b: Place, n: number): Place[] {
  const v = ([la, lo]: Place) => [Math.cos(la * D) * Math.cos(lo * D), Math.cos(la * D) * Math.sin(lo * D), Math.sin(la * D)];
  const A = v(a), B = v(b);
  const om = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const out: Place[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
    const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2];
    out.push([Math.atan2(z, Math.hypot(x, y)) / D, Math.atan2(y, x) / D]);
  }
  return out;
}
const ARC = greatCircle(CITY.riyadh, CITY.foumban, 64);
const FLOW_ARCS = FLOWS.map(([c, o]) => greatCircle(CITY[c], OFFICE[o], 40));

/** A fixed sample of land points that light up as checks in the finale:
 *  index, phase and rate, from a seeded generator. */
const CASES = (() => {
  let s = 20181;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const out: [number, number, number][] = [];
  const n = LAND.split(",").length / 2;
  for (let i = 0; i < n; i++) if (r() < 0.36) out.push([i, r() * Math.PI * 2, 0.6 + r() * 1.6]);
  return out;
})();

export type GlobeLabels = { offices: Record<keyof typeof OFFICE, string>; cities: Partial<Record<keyof typeof CITY, string>> };

/** Paints the globe at `alpha`. `arc` (0-1) draws the request out from
 *  Riyadh; `cases` (0-1) brings in the lit checks, the flows and the city
 *  labels; `time` drives the pulses (seconds; frozen when paused). */
export function drawGlobe(
  ctx: CanvasRenderingContext2D, pal: FieldPalette, fonts: { mono: string; sans: string }, c: GeoCam,
  w: number, h: number, dpr: number, alpha: number, arc: number, cases: number, time: number, L: GlobeLabels,
) {
  if (alpha <= 0) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  const cx = w / 2, cy = h / 2, R = c.R;

  // Atmosphere, then the glass orb, lit from the upper left.
  if (R < 20000) {
    const atm = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.28);
    atm.addColorStop(0, rgba(pal.greenLight, 0.42));
    atm.addColorStop(1, rgba(pal.greenLight, 0));
    ctx.fillStyle = atm;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2); ctx.fill();
    const orb = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.42, R * 0.05, cx, cy, R);
    orb.addColorStop(0, rgba(pal.white, 1));
    orb.addColorStop(0.55, rgba(pal.greenLight, 0.22));
    orb.addColorStop(1, rgba(pal.green, 0.2));
    ctx.fillStyle = orb;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba(pal.green, 0.25); ctx.lineWidth = 1; ctx.stroke();
  } else {
    ctx.fillStyle = rgba(pal.greenLight, 0.1);
    ctx.fillRect(0, 0, w, h);
  }

  // Graticule, every 15°.
  ctx.strokeStyle = rgba(pal.green, 0.1); ctx.lineWidth = 0.8;
  for (let lo = -180; lo < 180; lo += 15) {
    ctx.beginPath(); let on = false;
    for (let la = -90; la <= 90; la += 3) { const [x, y, k] = project(c, la, lo, w, h); if (k > 0) { if (on) ctx.lineTo(x, y); else ctx.moveTo(x, y); on = true; } else on = false; }
    ctx.stroke();
  }
  for (let la = -75; la <= 75; la += 15) {
    ctx.beginPath(); let on = false;
    for (let lo = -180; lo <= 180; lo += 3) { const [x, y, k] = project(c, la, lo, w, h); if (k > 0) { if (on) ctx.lineTo(x, y); else ctx.moveTo(x, y); on = true; } else on = false; }
    ctx.stroke();
  }

  // Land: dots graded by their angle to the viewer, in four batches.
  const pts = landPts();
  const size = Math.max(1.1, Math.min(4.2, R * 0.0072));
  const p0 = c.lat * D, l0 = c.lon * D, sp0 = Math.sin(p0), cp0 = Math.cos(p0);
  const batches: Path2D[] = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
  for (let i = 0; i < pts.length; i += 2) {
    const p = pts[i], l = pts[i + 1];
    const cp = Math.cos(p), dl = l - l0, cd = Math.cos(dl);
    const k = sp0 * Math.sin(p) + cp0 * cp * cd;
    if (k <= 0.02) continue;
    const x = cx + R * cp * Math.sin(dl), y = cy - R * (cp0 * Math.sin(p) - sp0 * cp * cd);
    if (x < -10 || y < -10 || x > w + 10 || y > h + 10) continue;
    const b = batches[Math.min(3, Math.floor(k * 4))];
    b.moveTo(x + size, y); b.arc(x, y, size, 0, Math.PI * 2);
  }
  batches.forEach((b, i) => { ctx.fillStyle = rgba(pal.green, 0.22 + i * 0.2); ctx.fill(b); });

  // The finale: checks lighting up across the land.
  if (cases > 0) {
    const glow = new Path2D(), core = new Path2D();
    for (const [i, ph, rate] of CASES) {
      const p = pts[i * 2], l = pts[i * 2 + 1];
      const cp = Math.cos(p), dl = l - l0, cd = Math.cos(dl);
      const k = sp0 * Math.sin(p) + cp0 * cp * cd;
      if (k <= 0.05) continue;
      const tw = Math.sin(time * rate + ph);
      if (tw < 0.55) continue;
      const x = cx + R * cp * Math.sin(dl), y = cy - R * (cp0 * Math.sin(p) - sp0 * cp * cd);
      glow.moveTo(x + size * 3, y); glow.arc(x, y, size * 3, 0, Math.PI * 2);
      core.moveTo(x + size * 1.1, y); core.arc(x, y, size * 1.1, 0, Math.PI * 2);
    }
    ctx.fillStyle = rgba(pal.greenLight, 0.28 * cases); ctx.fill(glow);
    ctx.fillStyle = rgba(pal.white, 0.95 * cases); ctx.fill(core);
    // Flows: each place's check running to its office.
    FLOW_ARCS.forEach((a, n) => {
      ctx.beginPath(); let on = false;
      a.forEach(([la, lo], i) => { const [x, y, k] = project(c, la, lo, w, h, 0.08 * Math.sin((Math.PI * i) / (a.length - 1))); if (k > 0) { if (on) ctx.lineTo(x, y); else ctx.moveTo(x, y); on = true; } else on = false; });
      ctx.strokeStyle = rgba(pal.green, 0.45 * cases); ctx.lineWidth = 1.4; ctx.stroke();
      const t = (time * 0.35 + n / FLOW_ARCS.length) % 1, j = Math.floor(t * (a.length - 1));
      const [x, y, k] = project(c, a[j][0], a[j][1], w, h, 0.08 * Math.sin(Math.PI * t));
      if (k > 0) { ctx.fillStyle = rgba(pal.white, cases); ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
    });
  }

  // The request: Riyadh to Foumban, lifted off the surface.
  if (arc > 0) {
    const n = Math.max(1, Math.round(arc * (ARC.length - 1)));
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const [la, lo] = ARC[i];
      const [x, y] = project(c, la, lo, w, h, 0.16 * Math.sin((Math.PI * i) / (ARC.length - 1)));
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.strokeStyle = rgba(pal.green, 0.18); ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.stroke();
    ctx.strokeStyle = rgba(pal.green, 0.95); ctx.lineWidth = 2.2; ctx.stroke();
    const [hx, hy] = project(c, ARC[n][0], ARC[n][1], w, h, 0.16 * Math.sin((Math.PI * n) / (ARC.length - 1)));
    ctx.fillStyle = rgba(pal.white, 1); ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(pal.green, 1); ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI * 2); ctx.fill();
    if (arc >= 1) {
      const [fx, fy] = project(c, CITY.foumban[0], CITY.foumban[1], w, h);
      for (let i = 0; i < 3; i++) {
        const ph = (time * 0.6 + i / 3) % 1;
        ctx.strokeStyle = rgba(pal.green, 0.6 * (1 - ph)); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(fx, fy, 6 + ph * 34, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }

  // Offices, and the places the case touches.
  if (R < 20000) {
    ctx.font = `10px ${fonts.mono}`;
    ctx.textBaseline = "middle";
    // An office's name steps aside for a city label near it.
    const labelled = (Object.keys(L.cities) as (keyof typeof CITY)[]).map((id) => project(c, CITY[id][0], CITY[id][1], w, h));
    for (const [id, [la, lo]] of Object.entries(OFFICE) as [keyof typeof OFFICE, Place][]) {
      const [x, y, k] = project(c, la, lo, w, h);
      if (k < 0.15) continue;
      ctx.fillStyle = rgba(pal.ink, 0.9);
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-3.2, -3.2, 6.4, 6.4); ctx.restore();
      if (labelled.some(([cx2, cy2]) => Math.abs(cx2 - x) < 110 && Math.abs(cy2 - y) < 22)) continue;
      ctx.fillStyle = rgba(pal.ink, 0.72);
      ctx.fillText(L.offices[id].toUpperCase(), x + 8, y);
    }
    ctx.font = `600 12.5px ${fonts.sans}`;
    for (const [id, name] of Object.entries(L.cities) as [keyof typeof CITY, string][]) {
      const [x, y, k] = project(c, CITY[id][0], CITY[id][1], w, h);
      if (k < 0.1 || !name) continue;
      ctx.fillStyle = rgba(pal.white, 0.92);
      const tw = ctx.measureText(name).width;
      ctx.beginPath(); ctx.roundRect(x + 9, y - 10, tw + 14, 20, 6); ctx.fill();
      ctx.fillStyle = rgba(pal.ink, 1);
      ctx.fillText(name, x + 16, y + 0.5);
      ctx.strokeStyle = rgba(pal.green, 1); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
}

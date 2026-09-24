/** The homepage globe's renderer (`sections/GlobeStage.tsx`): an orthographic
    projection of the land points, the graticule, the arcs out of India and the
    office rings, drawn on a 2D canvas each frame.

    A straight port of the canvas board's `gbFrame()` (Desktop3, "09 World —
    the orb"), split out so the island holds state and events and this holds
    geometry. The numbers — radius, halo stops, dot sizes, arc lift, pulse
    speeds — are the board's, unchanged.

    COLOUR COMES FROM THE STYLESHEET, not from here: `readPalette()` reads the
    design tokens and the three `--v2-gb-*` globe tints off the stage element
    at runtime (`app/v2/globe.css`), so the canvas re-themes with the page and
    this file carries no literal for `hv/no-color-literal` to find. */

import { H, W } from "./globeFrame";

export type Vec = [number, number, number];
type RGB = [number, number, number];

/** The stage's drawing box, in CSS px (`./globeFrame`, which the eager
 *  island shares). */
export { H, W };
const CY = 372;
const R = 286;
/** The globe's centre on the inline axis, measured from the inline-start
 *  edge. Mirrored under RTL by the island, so the card never covers it. */
export const CX = 410;

export function vec(lat: number, lon: number): Vec {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

/** A great-circle arc from `a` to `b`, lifted off the surface in the middle
 *  (16% of the radius at most) so routes read as flights, not coastlines. */
export function arc(a: Vec, b: Vec): Vec[] {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  const so = Math.sin(om) || 1;
  const pts: Vec[] = [];
  const N = 56;
  for (let k = 0; k <= N; k++) {
    const t = k / N;
    const f1 = Math.sin((1 - t) * om) / so;
    const f2 = Math.sin(t * om) / so;
    const lift = 1 + 0.16 * Math.sin(Math.PI * t) * Math.min(1, om * 1.2);
    pts.push([(a[0] * f1 + b[0] * f2) * lift, (a[1] * f1 + b[1] * f2) * lift, (a[2] * f1 + b[2] * f2) * lift]);
  }
  return pts;
}

/** Decodes `lib/globeLand`'s `lat*10,lon*10` string into unit vectors. */
export function landPoints(raw: string): Float32Array {
  const v = raw.split(",");
  const n = v.length / 2;
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const p = vec(+v[2 * i] / 10, +v[2 * i + 1] / 10);
    out.set(p, 3 * i);
  }
  return out;
}

export type Palette = {
  ink: RGB;
  green: RGB;
  greenLight: RGB;
  white: RGB;
  bodyMid: RGB;
  bodyLo: RGB;
  pulse: RGB;
};

/** `#RRGGBB` or `rgb(r g b)` / `rgb(r, g, b)`, as computed styles return. */
function parse(value: string): RGB {
  const s = value.trim();
  if (s.startsWith("#")) {
    const h = s.length === 4 ? s.slice(1).split("").map((c) => c + c).join("") : s.slice(1, 7);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const n = s.match(/[\d.]+/g) ?? ["0", "0", "0"];
  return [+n[0], +n[1], +n[2]];
}

export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const get = (name: string) => parse(cs.getPropertyValue(name));
  return {
    ink: get("--ink"),
    green: get("--green"),
    greenLight: get("--green-light"),
    white: get("--white"),
    bodyMid: get("--v2-gb-body-mid"),
    bodyLo: get("--v2-gb-body-lo"),
    pulse: get("--v2-gb-pulse"),
  };
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

export type Scene = {
  pts: Float32Array;
  pins: Vec[];
  offices: Vec[];
  arcs: Vec[][];
  cx: number;
};

/** Draws one frame and returns each pin's projected `[x, y, z]` (z > 0 is the
 *  near side) so the island can place the HTML pins over it. `time` is in
 *  seconds and drives only the pulses; `sel` is the chosen pin, or -1. */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  dpr: number,
  scene: Scene,
  rot: { lon: number; lat: number },
  pal: Palette,
  time: number,
  sel: number,
): Vec[] {
  const { cx } = scene;
  const lam = (rot.lon * Math.PI) / 180;
  const phi = (rot.lat * Math.PI) / 180;
  const cl = Math.cos(lam), sl = Math.sin(lam), cp = Math.cos(phi), sp = Math.sin(phi);
  const P = (v: Vec): Vec => {
    const x = v[0] * cl + v[2] * sl;
    const z0 = -v[0] * sl + v[2] * cl;
    const y = v[1] * cp - z0 * sp;
    const z = v[1] * sp + z0 * cp;
    return [cx + R * x, CY - R * y, z];
  };
  const TAU = Math.PI * 2;
  const disc = (x: number, y: number, r: number) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // Contact shadow on the floor.
  ctx.save();
  ctx.translate(cx, CY + R + 26);
  ctx.scale(1, 0.16);
  let g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.95);
  g.addColorStop(0, rgba(pal.ink, 0.22)); g.addColorStop(0.6, rgba(pal.ink, 0.07)); g.addColorStop(1, rgba(pal.ink, 0));
  ctx.fillStyle = g; disc(0, 0, R * 0.95); ctx.fill();
  ctx.restore();
  // Mint halo.
  g = ctx.createRadialGradient(cx, CY, R * 0.9, cx, CY, R * 1.3);
  g.addColorStop(0, rgba(pal.greenLight, 0.55)); g.addColorStop(0.35, rgba(pal.greenLight, 0.18)); g.addColorStop(1, rgba(pal.greenLight, 0));
  ctx.fillStyle = g; disc(cx, CY, R * 1.3); ctx.fill();
  // Body, lit from the upper inline-start.
  g = ctx.createRadialGradient(cx - R * 0.38, CY - R * 0.42, R * 0.05, cx, CY, R);
  g.addColorStop(0, rgba(pal.white, 1)); g.addColorStop(0.5, rgba(pal.bodyMid, 1)); g.addColorStop(1, rgba(pal.bodyLo, 1));
  ctx.fillStyle = g; disc(cx, CY, R); ctx.fill();

  // Graticule, near side only.
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = rgba(pal.green, 0.1);
  const line = (at: (s: number) => Vec, from: number, to: number) => {
    ctx.beginPath();
    let on = false;
    for (let s = from; s <= to; s += 4) {
      const p = P(at(s));
      if (p[2] > 0) { if (on) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); on = true; } else on = false;
    }
    ctx.stroke();
  };
  for (let la = -60; la <= 60; la += 30) line((lo) => vec(la, lo), -180, 180);
  for (let lo = -180; lo < 180; lo += 30) line((la) => vec(la, lo), -84, 84);

  // Land: square dots, larger and darker toward the viewer; the far side
  // shows through faintly, as on a glass orb.
  const pts = scene.pts;
  const n = pts.length / 3;
  const [gr, gg, gb] = pal.green;
  const pre = `rgba(${gr},${gg},${gb},`;
  for (let i = 0; i < n; i++) {
    const vx = pts[3 * i], vy = pts[3 * i + 1], vz = pts[3 * i + 2];
    const x = vx * cl + vz * sl;
    const z0 = -vx * sl + vz * cl;
    const y = vy * cp - z0 * sp;
    const z = vy * sp + z0 * cp;
    if (z > 0) {
      const s = 1.1 + z * 1.45;
      ctx.fillStyle = pre + (0.3 + z * 0.66).toFixed(3) + ")";
      ctx.fillRect(cx + R * x - s / 2, CY - R * y - s / 2, s, s);
    } else if (z > -0.55) {
      ctx.fillStyle = pre + (0.08 + z * 0.12).toFixed(3) + ")";
      ctx.fillRect(cx + R * x * 0.985 - 0.6, CY - R * y * 0.985 - 0.6, 1.2, 1.2);
    }
  }

  // Rim light and edge.
  g = ctx.createRadialGradient(cx, CY, R * 0.82, cx, CY, R);
  g.addColorStop(0, rgba(pal.green, 0)); g.addColorStop(1, rgba(pal.green, 0.14));
  ctx.fillStyle = g; disc(cx, CY, R); ctx.fill();
  ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(pal.green, 0.28); ctx.stroke();

  // Routes out of India, each with a travelling pulse.
  const shown = (p: Vec) => p[2] > -0.05 || Math.hypot(p[0] - cx, p[1] - CY) > R;
  scene.arcs.forEach((a, j) => {
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = rgba(pal.green, 0.5);
    ctx.beginPath();
    let on = false;
    for (const q of a) {
      const p = P(q);
      if (shown(p)) { if (on) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); on = true; } else on = false;
    }
    ctx.stroke();
    const ph = (time * 0.35 + j * 0.137) % 1;
    const p = P(a[Math.floor(ph * (a.length - 1))]);
    if (shown(p)) {
      const pg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 11);
      pg.addColorStop(0, rgba(pal.white, 1)); pg.addColorStop(0.25, rgba(pal.pulse, 0.95)); pg.addColorStop(1, rgba(pal.pulse, 0));
      ctx.fillStyle = pg; disc(p[0], p[1], 11); ctx.fill();
    }
  });

  // Offices: a ring each, the head office filled, all breathing.
  scene.offices.forEach((v, k) => {
    const p = P(v);
    if (p[2] <= 0) return;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = rgba(pal.green, 0.9);
    disc(p[0], p[1], k === 0 ? 7 : 5); ctx.stroke();
    if (k === 0) { ctx.fillStyle = rgba(pal.green, 1); disc(p[0], p[1], 3.2); ctx.fill(); }
    const pr = (time * 0.6 + k * 0.2) % 1;
    ctx.strokeStyle = rgba(pal.green, 0.45 * (1 - pr));
    disc(p[0], p[1], 6 + pr * 18); ctx.stroke();
  });

  const pins = scene.pins.map(P);

  // Ripples round the chosen pin.
  if (sel >= 0 && pins[sel][2] > 0) {
    const p = pins[sel];
    ctx.lineWidth = 1.2;
    for (let q = 0; q < 3; q++) {
      const pr = (time * 0.5 + q / 3) % 1;
      ctx.strokeStyle = rgba(pal.green, 0.55 * (1 - pr));
      disc(p[0], p[1], 18 + pr * 46); ctx.stroke();
    }
  }
  return pins;
}

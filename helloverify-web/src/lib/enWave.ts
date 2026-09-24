/** The trust-perimeter canvas (`sections/EnterprisePerimeter.tsx`): the
 *  geometry, the simulation state and one frame of drawing, kept apart from
 *  the component so the component is only the loop and the pointer.
 *
 *  Pure apart from the canvas it is handed: no DOM reads, no clock. The
 *  caller supplies the time and the palette (read from CSS custom properties
 *  at runtime, so there is no colour literal here either). Constants are the
 *  Business board's, unchanged. */

/** Canvas geometry, in the board's 640-unit canvas that overhangs the
 *  540 px perimeter box by 50 px each side. */
export const SIZE = 640;
export const C = SIZE / 2;
const RS = [96, 170, 244];
const K1 = [3, 4, 5];
const BR = [20, 30, 42];
const NODES = [8, 14, 20];
const SAMP = 300;
/** Each pill sits on its ring's 12 o'clock: `270 − r − 17` in the 540 box
 *  (17 = half the 34 px pill). */
export const PILL_TOP = RS.map((r) => 270 - r - 17);

export type RGB = [number, number, number];

/** A token's computed value → RGB. Browsers return a custom property as
 *  authored, so this reads the `#RRGGBB` the palette is written in and
 *  `rgb()` in case a theme ever writes it that way. */
export function parseColour(v: string): RGB {
  const s = v.trim();
  const h = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (h) {
    const x = h[1].length === 3 ? [...h[1]].map((c) => c + c).join("") : h[1];
    const n = parseInt(x, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const f = s.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  return f ? [Number(f[1]), Number(f[2]), Number(f[3])] : [0, 0, 0];
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

const wrap = (a: number) => {
  a = (a + Math.PI) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
};

/** Which ring (if any) a canvas-space point is over: within 24 units of it. */
export function ringAt(x: number, y: number): number {
  const d = Math.hypot(x - C, y - C);
  let hov = -1;
  RS.forEach((R, i) => {
    if (Math.abs(d - R) < 24) hov = i;
  });
  return hov;
}

export type Sim = {
  A: number[];
  H: number[];
  P: { x: number; y: number; in: boolean; e: number };
  hov: number;
  last: number;
  rip: { t0: number; s: number }[];
  nextRip: number;
  th0: number;
  t0: number;
  ts: number;
};

export type Palette = { INK: RGB; GREEN: RGB; MINT: RGB; WHITE: RGB };

export function newSim(): Sim {
  return { A: [1, 0, 0], H: [0, 0, 0], P: { x: 0, y: 0, in: false, e: 0 }, hov: -1, last: -1, rip: [], nextRip: 0, th0: -Math.PI / 2, t0: 0, ts: 0 };
}

/** One frame at time `ts` (seconds) for selection `en`. `calm` = stopped:
 *  eased values snap to their targets and nothing time-driven is added. */
export function drawWave(ctx: CanvasRenderingContext2D, dpr: number, S: Sim, en: number, ts: number, calm: boolean, pal: Palette) {
  const { INK, GREEN, MINT, WHITE } = pal;
    const P = S.P;
    if (en !== S.last) {
      if (S.last !== -1 && !calm) S.rip.push({ t0: ts, s: 1.2 });
      S.last = en;
      S.t0 = ts;
      S.th0 = -Math.PI / 2;
    }
    if (calm) {
      S.rip = [];
    } else if (ts > S.nextRip) {
      S.rip.push({ t0: ts, s: 0.75 });
      S.nextRip = ts + 2.8;
    }
    S.rip = S.rip.filter((r) => 62 + (ts - r.t0) * 200 < 340);
    const th = S.th0 + (ts - S.t0) * 0.9;
    // Easing: 8 %, 5 % and 10 % a frame, the board's constants.
    P.e = calm ? 0 : P.e + ((P.in ? 1 : 0) - P.e) * 0.08;
    for (let i = 0; i < 3; i++) {
      const a = i === en ? 1 : 0;
      const h = i === S.hov && i !== en ? 1 : 0;
      S.A[i] = calm ? a : S.A[i] + (a - S.A[i]) * 0.05;
      S.H[i] = calm ? h : S.H[i] + (h - S.H[i]) * 0.1;
    }
    const kickAt = (R: number) => {
      let k = 0;
      for (const rp of S.rip) {
        const g = (62 + (ts - rp.t0) * 200 - R) / 26;
        k += Math.exp(-g * g) * rp.s;
      }
      return k;
    };
    const cr = Math.hypot(P.x - C, P.y - C);
    const cth = Math.atan2(P.y - C, P.x - C);
    // Each perimeter is a braid of fine lines; the signal, the pointer and
    // the ripples swell the braid, they never bend the ring.
    const swell = (R: number, A: number, H: number, kick: number, a: number) => {
      let w = 0.6 + 2.3 * A + 1.1 * H + kick * 1.5;
      if (A > 0.01) {
        const d = wrap(a - th) / 0.5;
        w += A * 3.4 * Math.exp(-d * d);
      }
      if (P.e > 0.01) {
        const arc = (wrap(a - cth) * R) / 64;
        const gg = (cr - R) / 46;
        w += 3 * Math.exp(-arc * arc) * Math.exp(-gg * gg) * P.e;
      }
      return w;
    };
    // …except the hover lean: the ring lifts toward the pointer.
    const lean = (R: number, a: number) => {
      if (P.e < 0.01) return 0;
      const arc = (wrap(a - cth) * R) / 80;
      const gap = cr - R;
      const gg = gap / 60;
      return gap * 0.16 * Math.exp(-arc * arc) * Math.exp(-gg * gg) * P.e;
    };
    const radius = (i: number, R: number, A: number, H: number, kick: number, l: number | null, a: number) => {
      const base = R + lean(R, a) + (0.6 + 0.9 * A) * Math.sin(K1[i] * a - 0.6 * ts);
      if (l === null) return base;
      return base + swell(R, A, H, kick, a) * Math.sin(BR[i] * a + (A * 2.4 + 0.5) * ts * (i % 2 ? -1 : 1) + (l * 2 * Math.PI) / 5);
    };
    const ring = (n: number, r: (a: number) => number) => {
      ctx.beginPath();
      for (let k = 0; k <= n; k++) {
        const a = (k / n) * 2 * Math.PI;
        const rr = r(a);
        const x = C + rr * Math.cos(a);
        const y = C + rr * Math.sin(a);
        if (k) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
    };

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    // The guilloche halo: faintly breathing, green when the outer ring is on.
    const hk = kickAt(268);
    const hg = S.A[2];
    const haloC = mix(INK, GREEN, hg);
    for (let l = 0; l < 7; l++) {
      ring(SAMP, (a) => 267 + (4.2 + hk * 3) * Math.sin(44 * a + l * 0.9 + 0.22 * ts) + 2.4 * Math.sin(9 * a - 0.35 * ts + l * 0.45));
      ctx.strokeStyle = rgba(haloC, 0.07 + 0.05 * hg + 0.05 * hk);
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    // Ripples leaving the organisation.
    for (const rp of S.rip) {
      const pr = 62 + (ts - rp.t0) * 200;
      const fade = Math.max(0, 1 - pr / 340);
      ctx.beginPath();
      ctx.arc(C, C, pr, 0, 2 * Math.PI);
      ctx.strokeStyle = rgba(GREEN, 0.16 * fade * rp.s);
      ctx.lineWidth = 1;
      ctx.stroke();
      const g = ctx.createRadialGradient(C, C, Math.max(0, pr - 18), C, C, pr);
      g.addColorStop(0, rgba(MINT, 0));
      g.addColorStop(1, rgba(MINT, 0.14 * fade * rp.s));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(C, C, pr, 0, 2 * Math.PI);
      ctx.fill();
    }
    // The three perimeters.
    for (let i = 0; i < 3; i++) {
      const R = RS[i];
      const A = S.A[i];
      const H = S.H[i];
      const kick = kickAt(R);
      const col = mix(INK, GREEN, Math.max(A, H * 0.5));
      if (A > 0.02 || kick > 0.05) {
        ring(SAMP, (a) => radius(i, R, A, H, kick, null, a));
        ctx.strokeStyle = rgba(MINT, 0.22 * A + 0.1 * kick);
        ctx.lineWidth = 12;
        ctx.stroke();
      }
      for (let l = 0; l < 5; l++) {
        ring(SAMP * 2, (a) => radius(i, R, A, H, kick, l, a));
        ctx.strokeStyle = rgba(col, Math.min(0.9, 0.14 + 0.46 * A + 0.18 * H + 0.1 * kick));
        ctx.lineWidth = 0.75 + 0.25 * A;
        ctx.stroke();
      }
      // Nodes ride the centre line and swell as the signal passes.
      for (let j = 0; j < NODES[i]; j++) {
        const a = (2 * Math.PI * j) / NODES[i] - Math.PI / 2 + (i % 2 ? 0.3 : 0);
        const r = radius(i, R, A, H, kick, null, a);
        const x = C + r * Math.cos(a);
        const y = C + r * Math.sin(a);
        const d = wrap(a - th) / 0.22;
        const near = A * Math.exp(-d * d);
        const rr = 4 + 2.4 * near + 0.6 * H;
        if (near > 0.05) {
          ctx.beginPath();
          ctx.arc(x, y, rr + 6 * near, 0, 2 * Math.PI);
          ctx.fillStyle = rgba(MINT, 0.35 * near);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, rr, 0, 2 * Math.PI);
        ctx.fillStyle = rgba(A > 0.5 ? GREEN : WHITE, 1);
        ctx.fill();
        ctx.strokeStyle = A > 0.5 ? rgba(GREEN, 1) : rgba(col, 0.35 + 0.3 * H);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      // The signal travelling the engaged perimeter.
      if (A > 0.05) {
        const r = radius(i, R, A, H, kick, null, th);
        const x = C + r * Math.cos(th);
        const y = C + r * Math.sin(th);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 16);
        g.addColorStop(0, rgba(MINT, 0.85 * A));
        g.addColorStop(1, rgba(MINT, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = rgba(GREEN, A);
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = rgba(WHITE, 0.9 * A);
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
}

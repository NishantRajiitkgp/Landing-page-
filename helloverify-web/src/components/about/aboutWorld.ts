/** The `/about` hero map, computed once on the server in the relay map's
    projection (`lib/sunMap`, 1200 x 434, 74°N to 56°S).

    - `LAND`: the land as one path of rectangles, one per run of adjacent
      2° dots in a row; a dot pattern fills it (`./AboutMap`), so the page
      carries ~600 rectangles rather than ~3,700 circles.
    - `HQ` and `ARCS`: the head office (Noida) and an arc from it to each of
      the other five offices, nearest first.
    - `LIT`: a fixed sample of land dots that light in a wave out from the
      head office. ILLUSTRATIVE: a scatter, not a list of countries. */
import { landDots } from "@/lib/sunLand";
import { MAP_H, MAP_W, OFFICES } from "@/lib/sunMap";

export { MAP_H, MAP_W };
export const STEP_X = MAP_W / 180;
export const STEP_Y = MAP_H / 65;

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;

const dots = landDots();
const N = dots.length / 4;

function landPath() {
  let d = "";
  let x0 = 0;
  let x1 = 0;
  let y = Number.NaN;
  const flush = () => {
    if (Number.isNaN(y)) return;
    d += `M${r1(x0 - STEP_X / 2)} ${r1(y - STEP_Y / 2)}h${r1(x1 - x0 + STEP_X)}v${r1(STEP_Y)}h${-r1(x1 - x0 + STEP_X)}z`;
  };
  for (let i = 0; i < N; i++) {
    const x = dots[i * 4];
    const yy = dots[i * 4 + 1];
    if (yy === y && Math.abs(x - x1 - STEP_X) < 0.5) {
      x1 = x;
      continue;
    }
    flush();
    x0 = x1 = x;
    y = yy;
  }
  flush();
  return d;
}
export const LAND = landPath();

const hq = OFFICES.find((o) => o.k === "noida") ?? OFFICES[0];
export const HQ = { x: r1(hq.x), y: r1(hq.y) };

/** Arc timing starts here; the wave of lit dots follows the arcs out. */
export const ARC_AT = 1.2;
const ARC_GAP = 0.2;

export const ARCS = OFFICES.filter((o) => o !== hq)
  .map((o) => ({ k: o.k, x: r1(o.x), y: r1(o.y), len: Math.hypot(o.x - hq.x, o.y - hq.y) }))
  .sort((a, b) => a.len - b.len)
  .map((o, i) => {
    const lift = Math.min(o.len * 0.32, 110);
    const cx = r1((HQ.x + o.x) / 2);
    const cy = r1((HQ.y + o.y) / 2 - lift);
    return { ...o, at: r2(ARC_AT + i * ARC_GAP), d: `M${HQ.x} ${HQ.y}Q${cx} ${cy} ${o.x} ${o.y}` };
  });

const WAVE_AT = 2.1;
const WAVE_SPAN = 1.8;

export const LIT = (() => {
  const near = (x: number, y: number) => OFFICES.some((o) => Math.hypot(o.x - x, o.y - y) < 16);
  const pts: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < N; i++) {
    if (((Math.imul(i + 1, 2654435761) >>> 0) % 1000) >= 42) continue;
    const x = dots[i * 4];
    const y = dots[i * 4 + 1];
    if (near(x, y)) continue;
    pts.push({ x: r1(x), y: r1(y), r: Math.hypot(x - hq.x, y - hq.y) });
  }
  const far = Math.max(...pts.map((p) => p.r));
  return pts.map((p) => ({ x: p.x, y: p.y, at: r2(WAVE_AT + (p.r / far) * WAVE_SPAN) }));
})();

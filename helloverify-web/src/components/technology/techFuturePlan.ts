/** The plan of the `/technology` future-of-trust scene (`./TechFuture`):
    the story's timeline in scroll, and where its parts sit on the board,
    800 × 700 units with the trust core at the centre.

    The scroll is one timeline in three acts (`ACTS`), each a window of the
    runway's progress: the assets are verified, stored in the core and
    watched round its orbit; four organisations reach them by consent
    instead of checking again; and, after the pull-back (`ZOOM`), the
    network the core powers lights up ring by ring. The pull-back scales
    the hub about the core by `HUB`, so the organisations it already
    reached become the network's inner ring. Computed once, at build. */
import { n } from "./TechPillarKit";
import { halve, path, strand, type Pt } from "./techRoadPlan";

export type { Pt };
export type Quad = { x0: number; y0: number; x1: number; y1: number; x2: number; y2: number };

export const C: Pt = { x: 400, y: 350 };
/** A board point as `--x`/`--y`, in % of the board. */
export const pc = (p: Pt) => ({ "--x": n(p.x / 8), "--y": n(p.y / 7) });

/** Each act's build, as a window of the runway's progress 0…1. */
export const ACTS: [number, number][] = [[0.03, 0.33], [0.37, 0.63], [0.72, 0.95]];
/** The pull-back from the second act to the third. */
export const ZOOM: [number, number] = [0.62, 0.76];
/** Where the copy moves on to the next step; past the last, its line closes. */
export const STEPS = [0.355, 0.67, 0.975];
/** Where a jump to each step lands: its act just finished. */
export const REST = [0.33, 0.635, 0.955];
/** How far the scroll clock, `--fl`, runs over the whole runway. */
export const CLOCK = 36;
/** The hub's size once the view has pulled back. */
export const HUB = 0.5;

const RAD = Math.PI / 180;
const at = (rx: number, ry: number, deg: number): Pt => ({ x: n(C.x + rx * Math.cos(deg * RAD)), y: n(C.y + ry * Math.sin(deg * RAD)) });
const ellipse = (rx: number, ry: number) => `M${C.x - rx} ${C.y}a${rx} ${n(ry)} 0 1 1 ${2 * rx} 0a${rx} ${n(ry)} 0 1 1 ${-2 * rx} 0`;

export const quad = (a: Pt, b: Pt, bow: number): Quad => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l = Math.hypot(dx, dy) || 1;
  return { x0: a.x, y0: a.y, x1: n((a.x + b.x) / 2 - (dy / l) * bow), y1: n((a.y + b.y) / 2 + (dx / l) * bow), x2: b.x, y2: b.y };
};
export const back = (q: Quad): Quad => ({ x0: q.x2, y0: q.y2, x1: q.x1, y1: q.y1, x2: q.x0, y2: q.y0 });
export const qd = (q: Quad) => `M${q.x0} ${q.y0}Q${q.x1} ${q.y1} ${q.x2} ${q.y2}`;
const qAt = (q: Quad, t: number): Pt => {
  const u = 1 - t;
  return { x: n(u * u * q.x0 + 2 * u * t * q.x1 + t * t * q.x2), y: n(u * u * q.y0 + 2 * u * t * q.y1 + t * t * q.y2) };
};

/* ── Act one: the core, its orbit and the three assets ── */

/** The orbit the assets are watched round; drawn clockwise from the left,
    the way the sweep turns. */
export const ORBIT = { rx: 270, ry: 175 };
export const ORBIT_D = ellipse(ORBIT.rx, ORBIT.ry);
/** The core's three layers, top face centres from the top, and their size. */
export const LAYER = { rx: 72, ry: 24, th: 14, y: [C.y - 36, C.y - 8, C.y + 20] };

/** The assets round the orbit in the copy's order (an identity, a
    business, a credential): each arrives at `at`, is stored in its layer
    a beat later, and is updated at `up`. `ang` is where it sits on the
    orbit, which the sweep passes. */
export const ASSETS = [150, 270, 30].map((ang, k) => ({ ang, ...at(ORBIT.rx, ORBIT.ry, ang), at: 0.14 + k * 0.08, up: 0.62 + k * 0.12 }));
export const TETHERS = ASSETS.map((a, k) => quad(a, C, k === 1 ? 0 : k ? 30 : -30));
export const MONITOR = at(ORBIT.rx + 6, ORBIT.ry + 6, 318);

/** The road the page has travelled, six strands braided into the core. */
const BRAID_P = halve([{ x: -130, y: 296 }, { x: 110, y: 296 }, { x: 200, y: 342 }, { x: 340, y: 342 }]);
export const BRAID = Array.from({ length: 6 }, (_, k) => strand(BRAID_P, k, 4.2));
export const BRAID_C = path(BRAID_P);

/** A heartbeat, three beats across a 120 × 20 strip. */
export const ECG = "M0 10h18l4-6 5 13 5-14 4 7h22l4-6 5 13 5-14 4 7h22l4-6 5 13 5-14 4 7h4";

/* ── Act two: the four organisations ── */

/** A government, an enterprise, a bank and a hospital, each starting its
    request at `a`; `gh` is where its own repeat check stood, `nm` its name. */
export const ORGS = [
  { x: 104, y: 112, gh: { x: 186, y: 50 }, nm: { x: 104, y: 190 } },
  { x: 698, y: 108, gh: { x: 616, y: 46 }, nm: { x: 690, y: 196 } },
  { x: 704, y: 584, gh: { x: 622, y: 650 }, nm: { x: 696, y: 664 } },
  { x: 96, y: 586, gh: { x: 178, y: 652 }, nm: { x: 96, y: 664 } },
].map((o, k) => ({ ...o, a: 0.04 + k * 0.15 }));
export const BEAMS = ORGS.map((o, k) => quad(o, C, k % 2 ? 36 : -36));
export const CONSENT = qAt(BEAMS[0], 0.42);

/* ── Act three: the network the core powers ── */

const K = 0.65;
const ring = (rx: number, deg: number) => at(rx, rx * K, deg);
/** The four organisations, where the pull-back leaves them. */
const INNER = ORGS.map((o) => ({ x: n(C.x + (o.x - C.x) * HUB), y: n(C.y + (o.y - C.y) * HUB) }));
export const RING_A = [0, 90, 180, 270].map((d) => ring(300, d));
export const RING_B = [25, 60, 120, 155, 205, 240, 300, 335].map((d) => ring(400, d));
/** Out of focus beyond the board, on every side but the copy's. */
export const FAR = [...[-12, 12, 42, 74, 106, 254, 286, 318].map((d) => ring(540, d)), ...[-24, 0, 24].map((d) => ring(680, d))];

const near = (p: Pt, set: Pt[]) => set.reduce((b, q) => (Math.hypot(q.x - p.x, q.y - p.y) < Math.hypot(b.x - p.x, b.y - p.y) ? q : b));
/** A trace as a circuit board routes it: along the longer axis, then a 45° run in. */
const trace = (a: Pt, b: Pt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  const m = ax > ay ? { x: a.x + Math.sign(dx) * (ax - ay), y: a.y } : { x: a.x, y: a.y + Math.sign(dy) * (ay - ax) };
  return `M${n(a.x)} ${n(a.y)}L${n(m.x)} ${n(m.y)}L${n(b.x)} ${n(b.y)}`;
};
/** Every node with the trace that powers it and when (act three's build). */
export const NODES = [
  ...RING_A.map((p, k) => ({ p, d: trace(C, p), t0: 0.08 + k * 0.05, far: false })),
  ...RING_B.map((p, k) => ({ p, d: trace(near(p, [...RING_A, ...INNER]), p), t0: 0.32 + k * 0.04, far: false })),
  ...FAR.map((p, k) => ({ p, d: trace(near(p, RING_B), p), t0: 0.6 + k * 0.02, far: true })),
];
/** The inner ring joined up, round the core. */
const LOOP = [RING_A[0], INNER[2], RING_A[1], INNER[3], RING_A[2], INNER[0], RING_A[3], INNER[1]];
export const MESH = `M${LOOP.map((p) => `${p.x} ${p.y}`).join("L")}Z`;
/** The ground the network stands on: rings and spokes in perspective. */
export const GRID = [
  ...[140, 220, 300, 400, 540, 680].map((rx) => ellipse(rx, rx * K)),
  ...Array.from({ length: 12 }, (_, i) => {
    const a = ring(70, i * 30);
    const b = ring(760, i * 30);
    return `M${a.x} ${a.y}L${b.x} ${b.y}`;
  }),
].join("");

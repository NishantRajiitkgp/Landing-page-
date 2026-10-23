/** The script of the `/technology` compounding story (`./TechGrowBoard`,
    `./techGrow`): what the scene holds, where each part sits, in scene
    units, and when it moves, in story time (0 to `END`; the runway is that
    long).

    Act one, from 0: twelve candidates' checks float in from every side,
    amid a crowd of others out of focus, and are read; each gives up what
    is behind it: an institution, or a fraud. Act two, from `ACT[1]`: the
    candidates drift away. The institutions bond to HelloVerify one by one,
    each bond drawing out and strengthening until the node is trusted, the
    trusted nodes knit into a web, and the frauds are masked into the fraud
    database; a
    wider network waits out of focus. Act three, from `ACT[2]`: the view
    pulls back over every check since 2018, and the dots draw the mark.

    The places come in two layouts: `WIDE` beside the claims, `TALL` under
    them on a phone. The stylesheet picks one through `--sw`, the scene's
    width in units; both are `SH` tall with the hub at `HUB_Y`. */

export const SH = 600;
export const HUB_Y = 260;
export const END = 10;
export const ACT = [0, 3.4, 6.8] as const;
/** When the caption under the finished mark shows. */
export const CAPTION = 9.1;

export const CARD = { w: 136, h: 78 } as const;
export const CHIP = { w: 122, h: 30 } as const;
export const HUB_W = 150;
export const HUB_H = 60;
/** A card's chip sits along its foot in act one. */
export const CHIP_IN = { x: 7, y: 42 } as const;
/** The middle of the finished mark. */
export const MARK_Y = 250;

/** The institutions the checks reveal, in the order they bond. */
export const INSTS = [
  { kind: "uni", city: "delhi", flag: "in" },
  { kind: "firm", city: "singapore", flag: "sg" },
  { kind: "council", city: "london", flag: "gb" },
  { kind: "regulator", city: "dubai", flag: "ae" },
  { kind: "uni", city: "boston", flag: "us" },
  { kind: "firm", city: "frankfurt", flag: "de" },
  { kind: "uni", city: "sydney", flag: "au" },
  { kind: "regulator", city: "manila", flag: "ph" },
  { kind: "council", city: "riyadh", flag: "sa" },
  { kind: "firm", city: "tokyo", flag: "jp" },
] as const;
/** Trusted neighbours that knit into a web: round each orbit, and across. */
export const MESH = [[7, 3], [3, 5], [5, 9], [9, 6], [6, 4], [4, 8], [0, 2], [2, 1], [0, 3], [0, 5], [1, 4], [1, 6], [2, 9]] as const;

/** The frauds, each the database row of the same index. */
export const FRAUDS = ["lookalike", "seal"] as const;
/** The database's rows: the two frauds, then five it already held. */
export const ROWS = 7;

type Card = { who: string; check: "degree" | "employment" | "licence" | "registration"; inst?: number; fraud?: number };

/** The candidates in focus, and what each check gives up. */
export const CARDS: readonly Card[] = [
  { who: "person", check: "degree", inst: 0 },
  { who: "p2", check: "employment", inst: 1 },
  { who: "p3", check: "licence", inst: 2 },
  { who: "p4", check: "degree", fraud: 0 },
  { who: "p5", check: "registration", inst: 3 },
  { who: "p7", check: "degree", inst: 4 },
  { who: "p6", check: "degree", fraud: 1 },
  { who: "p8", check: "employment", inst: 5 },
  { who: "p10", check: "degree", inst: 6 },
  { who: "p12", check: "registration", inst: 7 },
  { who: "p14", check: "licence", inst: 8 },
  { who: "p13", check: "employment", inst: 9 },
];

type Pt = readonly [number, number];
/** One of the crowd out of focus: its corner, how far out it lies (0 at
    the edge of focus, 1 far out), and when it is read, and how it reads. */
export type Ghost = { x: number; y: number; depth: number; at: number; bad: boolean };
export type Layout = {
  /** The scene's width, in units. */
  sw: number;
  /** Each card's corner in act one. */
  cards: readonly Pt[];
  /** Each institution's node in act two, round the hub. */
  insts: readonly Pt[];
  db: { x: number; y: number; w: number; h: number };
  /** The finished mark's width. */
  lw: number;
  /** The field once the view has pulled back: its radii, and its dots. */
  field: readonly [rx: number, ry: number, n: number];
  /** The crowd round the cards, and the wider network round the nodes. */
  crowd: readonly Ghost[];
  wider: readonly Ghost[];
};

export const GHOSTS = 26;
export const WIDER = 18;
const rand = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
/** `n` places on a squared-off ring round (`cx`, `cy`), so the corners are
    filled as well as the sides, skipping the arc under the hub that the
    database takes when `gap` is set. Each sits `w` × `h` on its point. */
function ring(n: number, cx: number, cy: number, rx: number, ry: number, w: number, h: number, seed: number, gap = false): Ghost[] {
  const r = rand(seed);
  const out: Ghost[] = [];
  const skip = gap ? 0.5 : 0;
  for (let i = 0; i < n; i++) {
    let a = ((i + r() * 0.5) / n) * Math.PI * 2;
    if (skip) a = Math.PI / 2 + skip + (a / (Math.PI * 2)) * (Math.PI * 2 - 2 * skip);
    const c = Math.cos(a);
    const s = Math.sin(a);
    const f = (c ** 4 + s ** 4) ** -0.25;
    const j = 1 + (r() - 0.5) * 0.22;
    out.push({ x: cx + rx * c * f * j - w / 2, y: cy + ry * s * f * j - h / 2, depth: r(), at: 0.8 + r() * 2.4, bad: r() < 0.16 });
  }
  return out;
}

/** Beside the claims: three nodes on an inner orbit, seven on an outer. */
export const WIDE: Layout = {
  sw: 640,
  cards: [[40, 58], [236, 40], [432, 66], [80, 182], [276, 200], [472, 172], [30, 310], [226, 296], [422, 320], [76, 440], [272, 456], [468, 432]],
  insts: [[197, 197], [443, 197], [320, 150], [68, 190], [572, 190], [170, 90], [470, 90], [62, 316], [578, 316], [320, 55]],
  db: { x: 180, y: 356, w: 280, h: 236 },
  lw: 460,
  field: [600, 390, 5200],
  crowd: ring(GHOSTS, 320, 296, 372, 318, CARD.w, CARD.h, 11),
  wider: ring(WIDER, 320, HUB_Y, 360, 318, CHIP.w, CHIP.h, 23, true),
};

/** Under the claims on a phone: the same parts, stacked taller. */
export const TALL: Layout = {
  sw: 400,
  cards: [[24, 20], [220, 44], [52, 118], [240, 142], [16, 216], [212, 240], [48, 314], [232, 338], [20, 412], [216, 436], [56, 510], [236, 522]],
  insts: [[110, 190], [290, 190], [200, 150], [64, 270], [336, 270], [90, 106], [310, 106], [64, 336], [336, 336], [200, 62]],
  db: { x: 60, y: 362, w: 280, h: 236 },
  lw: 360,
  field: [260, 430, 2600],
  crowd: ring(GHOSTS, 200, 300, 262, 352, CARD.w, CARD.h, 11),
  wider: ring(WIDER, 200, HUB_Y, 250, 330, CHIP.w, CHIP.h, 23, true),
};

/** The hub, centred across the scene so the scene mirrors about it. */
export const hubOf = (L: Layout) => ({ x: L.sw / 2 - HUB_W / 2, y: HUB_Y - HUB_H / 2, cx: L.sw / 2, cy: HUB_Y });
/** Which way a card floats: out from the middle of the scene, so the cards
    come in from every side and drift back out the way they came. */
export const away = (L: Layout, x: number, y: number) => {
  const dx = x + CARD.w / 2 - L.sw / 2;
  const dy = y + CARD.h / 2 - SH / 2;
  const l = Math.hypot(dx, dy) || 1;
  return { x: dx / l, y: dy / l };
};
export const slotAt = (L: Layout, k: number) => ({ x: L.insts[k][0] - CHIP.w / 2, y: L.insts[k][1] - CHIP.h / 2 });
export const rowAt = (L: Layout, r: number) => ({ x: L.db.x + 9, y: L.db.y + 47 + r * 26 });

/* ── A bond: a straight line from the hub to its node ── */
export type Tie = { x0: number; y0: number; x1: number; y1: number };
export const tieOf = (L: Layout, k: number): Tie => {
  const h = hubOf(L);
  return { x0: h.cx, y0: h.cy, x1: L.insts[k][0], y1: L.insts[k][1] };
};
export const along = (c: Tie, u: number): Pt => [c.x0 + (c.x1 - c.x0) * u, c.y0 + (c.y1 - c.y0) * u];
export const tieD = (c: Tie) => `M${c.x0} ${c.y0}L${c.x1} ${c.y1}`;

/* Story time. Act one: the cards float in, then each is read in turn. */
export const enterAt = (i: number) => 0.04 + i * 0.06;
export const ENTER = 0.6;
/** How far a card floats in from, and drifts on its own while it is read. */
export const FLOAT_IN = 280;
export const DRIFT = 6;
export const scanAt = (i: number) => 0.7 + i * 0.17;
export const SCAN = 0.44;
/** A card's institution or fraud shows once the reading is this far down. */
export const FOUND = 0.8;

/* Act two: the candidates drift away; the hub and the database rise; the
   chips fly to their places; each institution bonds; the frauds and five
   older rows are masked into the database. */
export const leaveAt = (i: number) => ACT[1] + i * 0.03;
export const LEAVE = 0.45;
export const HUB_AT = 3.7;
export const DB_AT = 3.85;
export const travelAt = (i: number) => 3.75 + i * 0.045;
export const TRAVEL = 0.7;
export const bondAt = (k: number) => 4.4 + k * 0.13;
export const BOND = 0.9;
export const rowTime = (r: number) => {
  const i = CARDS.findIndex((c) => c.fraud === r);
  return i >= 0 ? travelAt(i) + TRAVEL * 0.85 : 5.2 + (r - FRAUDS.length) * 0.2;
};
export const SAFE = 6.3;
/** The wider network fades in round the nodes, and is trusted, over this. */
export const WIDER_AT = [4.0, 1.8] as const;
/** The year on the hub runs 2018 to today over this. */
export const YEAR = [4.4, 2.0] as const;

/* Act three: the view pulls back to `ZMIN` while the figures count, the
   network's HTML fades into dots, then the dots fly to the mark, left to
   right over `SWEEP`, each taking `FLY`. */
export const ZOOM = [ACT[2], 1.1] as const;
export const ZMIN = 0.14;
export const FADE = [7.2, 0.5] as const;
export const COUNT = [7.0, 1.2] as const;
export const CONVERGE = 8.1;
/** Past this the dots are the mark. */
export const MARKED = 8.5;
export const SWEEP = 0.6;
export const FLY = 0.7;

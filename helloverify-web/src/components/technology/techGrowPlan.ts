/** The script of the `/technology` compounding story (`./TechGrowBoard`,
    `./techGrow`): what the scene holds, where each part sits, in scene
    units, and when it moves, in story time (0 to `END`; the runway is that
    long).

    Act one, from 0: fifteen candidates' checks float in from every side
    and are read, and each gives up what is behind it: an institution, or
    a fraud. Act two, from `ACT[1]`: the candidates drift away. The
    institutions bond to HelloVerify one by one until each is a trusted
    node (a second check from a known university joins the node it already
    has), and the frauds are masked into the fraud database. Act three,
    from `ACT[2]`: the view pulls back over every check since 2018, and the
    dots draw the mark.

    The places come in two layouts: `WIDE` beside the claims, `TALL` under
    them on a phone. The stylesheet picks one through `--sw`, the scene's
    width in units; both are `SH` tall with the hub at `HUB_Y`. */

export const SH = 600;
export const HUB_Y = 260;
export const END = 10;
export const ACT = [0, 3.4, 6.8] as const;
/** When the headline lands in the column beside the scene. */
export const CONCLUDE = 8.9;
/** When the caption under the finished mark shows. */
export const CAPTION = 9.1;

export const CARD = { w: 120, h: 70 } as const;
export const CHIP = { w: 108, h: 26 } as const;
export const HUB_W = 150;
export const HUB_H = 60;
/** A card's chip sits along its foot in act one. */
export const CHIP_IN = { x: 6, y: 38 } as const;
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

/** The frauds, each the database row of the same index. */
export const FRAUDS = ["lookalike", "seal", "employer", "dates"] as const;
/** The database's rows: the four frauds, then three it already held. */
export const ROWS = 7;

type Card = { who: string; check: "degree" | "employment" | "licence" | "registration"; inst?: number; fraud?: number };

/** The candidates, and what each check gives up. */
export const CARDS: readonly Card[] = [
  { who: "person", check: "degree", inst: 0 },
  { who: "p2", check: "employment", inst: 1 },
  { who: "p3", check: "licence", inst: 2 },
  { who: "p4", check: "degree", fraud: 0 },
  { who: "p5", check: "registration", inst: 3 },
  { who: "p6", check: "degree", fraud: 1 },
  { who: "p7", check: "degree", inst: 4 },
  { who: "p8", check: "employment", inst: 5 },
  { who: "p9", check: "degree", inst: 0 },
  { who: "p10", check: "degree", inst: 6 },
  { who: "p11", check: "employment", fraud: 2 },
  { who: "p12", check: "registration", inst: 7 },
  { who: "p13", check: "employment", inst: 9 },
  { who: "p14", check: "licence", inst: 8 },
  { who: "p15", check: "degree", fraud: 3 },
];

/** For each institution, the card whose chip becomes its node; any later
    card from the same institution merges into it. */
export const PRIMARY = INSTS.map((_, k) => CARDS.findIndex((c) => c.inst === k));

type Pt = readonly [number, number];
export type Layout = {
  /** The scene's width, in units. */
  sw: number;
  /** Each card's corner in act one, scattered over the scene. */
  cards: readonly Pt[];
  /** Each institution's node in act two, round the hub. */
  insts: readonly Pt[];
  db: { x: number; y: number; w: number; h: number };
  /** The finished mark's width. */
  lw: number;
  /** The field once the view has pulled back: its radii, and its dots. */
  field: readonly [rx: number, ry: number, n: number];
};

/** Beside the claims: three nodes on an inner orbit, seven on an outer. */
export const WIDE: Layout = {
  sw: 640,
  cards: [
    [24, 46], [176, 80], [336, 30], [494, 66], [60, 178], [222, 206], [392, 170], [516, 244],
    [18, 310], [168, 340], [330, 306], [480, 362], [92, 450], [268, 478], [436, 500],
  ],
  insts: [[197, 197], [443, 197], [320, 150], [68, 190], [572, 190], [170, 90], [470, 90], [62, 316], [578, 316], [320, 55]],
  db: { x: 180, y: 356, w: 280, h: 236 },
  lw: 460,
  field: [600, 390, 5200],
};

/** Under the claims on a phone: the same parts, stacked taller. */
export const TALL: Layout = {
  sw: 400,
  cards: [
    [6, 14], [140, 30], [274, 8], [30, 128], [160, 112], [276, 136], [4, 236], [138, 252],
    [272, 228], [28, 352], [158, 336], [278, 360], [8, 460], [142, 476], [274, 452],
  ],
  insts: [[110, 190], [290, 190], [200, 150], [64, 270], [336, 270], [90, 106], [310, 106], [64, 336], [336, 336], [200, 62]],
  db: { x: 60, y: 362, w: 280, h: 236 },
  lw: 360,
  field: [260, 430, 2600],
};

/** The hub, centred across the scene so the scene mirrors about it. */
export const hubOf = (L: Layout) => ({ x: L.sw / 2 - HUB_W / 2, y: HUB_Y - HUB_H / 2, cx: L.sw / 2, cy: HUB_Y });
/** Which way a card floats: out from the middle of the scene, so the cards
    come in from every side and drift back out the way they came. */
export const away = (L: Layout, i: number) => {
  const [x, y] = L.cards[i];
  const dx = x + CARD.w / 2 - L.sw / 2;
  const dy = y + CARD.h / 2 - SH / 2;
  const l = Math.hypot(dx, dy) || 1;
  return { x: dx / l, y: dy / l };
};
export const slotAt = (L: Layout, k: number) => ({ x: L.insts[k][0] - CHIP.w / 2, y: L.insts[k][1] - CHIP.h / 2 });
export const rowAt = (L: Layout, r: number) => ({ x: L.db.x + 9, y: L.db.y + 47 + r * 26 });

/* Story time. Act one: the cards float in, then each is read in turn. */
export const enterAt = (i: number) => 0.04 + i * 0.05;
export const ENTER = 0.6;
/** How far a card floats in from, and drifts on its own while it is read. */
export const FLOAT_IN = 280;
export const DRIFT = 6;
export const scanAt = (i: number) => 0.7 + i * 0.14;
export const SCAN = 0.42;
/** A card's institution or fraud shows once the reading is this far down. */
export const FOUND = 0.8;

/* Act two: the candidates drift away; the hub and the database rise; the
   chips fly to their places; each institution bonds; the frauds and three
   older rows are masked into the database. */
export const leaveAt = (i: number) => ACT[1] + i * 0.025;
export const LEAVE = 0.45;
export const HUB_AT = 3.7;
export const DB_AT = 3.85;
export const travelAt = (i: number) => 3.75 + i * 0.04;
export const TRAVEL = 0.7;
export const bondAt = (k: number) => 4.4 + k * 0.13;
export const BOND = 0.9;
export const rowTime = (r: number) => {
  const i = CARDS.findIndex((c) => c.fraud === r);
  return i >= 0 ? travelAt(i) + TRAVEL * 0.85 : 5.6 + (r - FRAUDS.length) * 0.22;
};
export const SAFE = 6.3;
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

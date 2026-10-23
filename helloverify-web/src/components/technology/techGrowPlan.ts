/** The script of the `/technology` compounding story (`./TechGrowBoard`,
    `./techGrow`): where each part of the board sits, in board units, and
    when it moves, in story time (0 to `END`; the runway is that long).

    Act one, from 0: six candidates' checks come in and are read, and each
    gives up the institution behind it; two give up a fraud as well. Act
    two, from `ACT[1]`: the candidates leave. The institutions bond to
    HelloVerify one by one until each is a trusted node, and the frauds
    are masked into the fraud database. Act three, from `ACT[2]`: the view
    pulls back over every check since 2018, and the dots draw the mark. */

export const SW = 560;
export const SH = 520;
export const END = 10;
export const ACT = [0, 3.4, 6.8] as const;
/** When the headline lands in the column beside the board. */
export const CONCLUDE = 8.9;
/** When the caption under the finished mark shows. */
export const CAPTION = 9.1;

export const CARD = { w: 164, h: 150 } as const;
export const CHIP = { w: 150, h: 40 } as const;
export const HUB = { x: 210, y: 189, w: 140, h: 50 } as const;
/** The hub's centre: the bonds start here and the view pulls back on it. */
export const HC = { x: HUB.x + HUB.w / 2, y: HUB.y + HUB.h / 2 } as const;
export const DB = { x: 140, y: 292, w: 280, h: 192 } as const;
/** The middle of the finished mark, which is `LW` wide. */
export const MARK_Y = 200;
export const LW = 400;

export const CARDS = [
  { who: "person", check: "degree", bad: false },
  { who: "p2", check: "employment", bad: false },
  { who: "p3", check: "licence", bad: false },
  { who: "p4", check: "degree", bad: true },
  { who: "p5", check: "registration", bad: false },
  { who: "p6", check: "degree", bad: true },
] as const;

/** The institutions the checks reveal, in the order they bond. */
export const INSTS = [
  { card: 0, kind: "uni", city: "delhi", flag: "in" },
  { card: 1, kind: "firm", city: "singapore", flag: "sg" },
  { card: 2, kind: "council", city: "london", flag: "gb" },
  { card: 4, kind: "regulator", city: "dubai", flag: "ae" },
  { card: 5, kind: "uni", city: "boston", flag: "us" },
] as const;

/** The frauds: a look-alike institution, and a forged seal on a real one's
    degree. Each becomes the database row of the same index. */
export const FRAUDS = [
  { card: 3, kind: "lookalike" },
  { card: 5, kind: "seal" },
] as const;

/** The database's rows: the two frauds above, then three it already held. */
export const ROWS = 5;

export const cardAt = (i: number) => ({ x: [20, 198, 376][i % 3], y: [62, 226][Math.floor(i / 3)] });
/** A chip in act one sits along its card's foot; the seal, over its document. */
export const instAt1 = (k: number) => {
  const c = cardAt(INSTS[k].card);
  return { x: c.x + 7, y: c.y + 102 };
};
export const fraudAt1 = (r: number) => {
  const c = cardAt(FRAUDS[r].card);
  return { x: c.x + 7, y: c.y + (FRAUDS[r].kind === "seal" ? 49 : 102) };
};
/** Act two: the institutions on an arc over the hub. */
export const SLOTS = [180, 140, 90, 40, 0].map((deg) => {
  const a = (deg * Math.PI) / 180;
  const cx = Math.round(HC.x + 190 * Math.cos(a));
  const cy = Math.round(HC.y - 150 * Math.sin(a));
  return { x: cx - CHIP.w / 2, y: cy - CHIP.h / 2, cx, cy };
});
export const rowAt = (r: number) => ({ x: DB.x + 10, y: DB.y + 44 + r * 28 });

/* Story time. Act one: each card deals in, then each is read in turn. */
export const enterAt = (i: number) => 0.05 + i * 0.1;
export const ENTER = 0.45;
export const scanAt = (i: number) => 0.75 + i * 0.33;
export const SCAN = 0.55;
/** A card's institution and fraud show once the reading is this far down. */
export const FOUND = 0.8;

/* Act two: the candidates leave; the hub and the database rise; the chips
   fly to their places (institutions `j` 0–4, frauds 5–6); each institution
   bonds; the frauds and three older rows are masked into the database. */
export const leaveAt = (i: number) => ACT[1] + i * 0.05;
export const LEAVE = 0.4;
export const HUB_AT = 3.75;
export const DB_AT = 3.9;
export const travelAt = (j: number) => 3.75 + j * 0.07;
export const TRAVEL = 0.7;
export const bondAt = (k: number) => 4.5 + k * 0.2;
export const BOND = 1.1;
export const rowTime = (r: number) => (r < FRAUDS.length ? travelAt(INSTS.length + r) + TRAVEL * 0.85 : 5.3 + (r - FRAUDS.length) * 0.28);
export const SAFE = 6.1;
/** The year in the corner runs 2018 to today over this. */
export const YEAR = [4.5, 1.9] as const;

/* Act three: the view pulls back to `ZMIN` while the figures count, the
   network's HTML fades into dots, then the dots fly to the mark, left to
   right over `SWEEP`, each taking `FLY`. */
export const ZOOM = [ACT[2], 1.1] as const;
export const ZMIN = 0.14;
export const FADE = [7.2, 0.5] as const;
export const COUNT = [7.0, 1.2] as const;
export const CONVERGE = 8.1;
/** Past this the dots are the mark, and the legend for them goes. */
export const MARKED = 8.5;
export const SWEEP = 0.6;
export const FLY = 0.7;

/** The race on `/technology`'s compounding section (`./TechRace`), as data:
    the eight cases, how long each lane spends on each, and what HelloVerify
    keeps along the way. Shared by the drawing and its clock
    (`./TechCompoundStage`) so the two cannot disagree.

    Time is in "case units": one unit is what a case costs a system that
    starts from zero. The static lane pays it every time. HelloVerify pays it
    for the first two, then less and less, because each case leaves it a
    contact, a pattern or a customer the next one can use. */

export type CaseKind = "degree" | "employment" | "licence";
export type Inst = "iit" | "abc" | "uae";

/** Same queue for both lanes: who sent it, what it is, where it goes. */
export const CASES: { kind: CaseKind; inst: Inst; from: "A" | "B" | "C"; forged?: boolean }[] = [
  { kind: "degree", inst: "iit", from: "A" },
  { kind: "employment", inst: "abc", from: "A" },
  { kind: "degree", inst: "iit", from: "B" },
  { kind: "degree", inst: "iit", from: "B", forged: true },
  { kind: "employment", inst: "abc", from: "A" },
  { kind: "licence", inst: "uae", from: "C" },
  { kind: "degree", inst: "iit", from: "C" },
  { kind: "employment", inst: "abc", from: "B" },
];

const GAP = 0.04;
const lay = (ds: number[]) => {
  let s = 0;
  return ds.map((d) => {
    const t = { s: +s.toFixed(3), d };
    s += d + GAP;
    return t;
  });
};

/** The static system gets through four in the time; the fourth is forged. */
export const STATIC = lay([1, 1, 1, 1]);
export const HV = lay([1, 0.92, 0.34, 0.3, 0.26, 0.55, 0.22, 0.2]);
/** The whole clock, in case units. */
export const SPAN = 4.2;

const end = (i: number) => +(HV[i].s + HV[i].d).toFixed(3);
/** What HelloVerify keeps, and when it has it. */
export const KEEPS = [
  { key: "keepRegistrar", at: end(0) },
  { key: "keepHr", at: end(1) },
  { key: "keepB", at: HV[2].s, join: true },
  { key: "keepPattern", at: end(3), bad: true },
  { key: "keepC", at: HV[5].s, join: true },
  { key: "keepUae", at: end(5) },
] as const;

/** The claim each of HelloVerify's cases proves: 0 intelligence, 1 network, 2 ecosystem. */
export const CLAIM = [1, 1, 2, 0, 1, 1, 2, 0];
/** The narration line for each of HelloVerify's cases. */
export const SAY = ["say1", "say2", "say3", "say4", "say5", "say6", "say7", "say7"] as const;

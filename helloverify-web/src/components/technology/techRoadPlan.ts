/** The plan of the `/technology` trust road (`./TechRoadStage`): the
    journey's timeline, and the shape of the road between two stops.

    The timeline, `SEGS`, is in scroll units: the case leaves HelloVerify
    (`lead`), then at each stop it docks while the stop builds (`build`),
    rests a moment on the finished scene (`hold`) and rides on to the next
    (`travel`). Stop `STOPS` is the destination, which has no ride after it.

    The road is a braid of six strands along one cubic: pinched at both
    ends, where it meets a stop's port, and spread between, where each
    strand crosses to another lane, so the strands weave over each other. */

export type Pt = { x: number; y: number };
type Seg = { k: "lead" | "build" | "hold" | "travel"; i: number; w: number };

/** Stops on the road; the frame after the last is the destination. */
export const STOPS = 8;
export const SEGS: Seg[] = [{ k: "lead", i: 0, w: 0.9 }];
for (let i = 0; i <= STOPS; i++) {
  SEGS.push({ k: "build", i, w: i < STOPS ? 1.5 : 1.3 }, { k: "hold", i, w: i < STOPS ? 0.45 : 0.7 });
  if (i < STOPS) SEGS.push({ k: "travel", i, w: 1.15 });
}
export const TOTAL = SEGS.reduce((a, s) => a + s.w, 0);
/** Where each frame's build sits in `SEGS`. The ride into frame `j` is the segment before it. */
export const BUILD = Array.from({ length: STOPS + 1 }, (_, i) => SEGS.findIndex((s) => s.k === "build" && s.i === i));
/** The scroll units up to stop `k` at rest, half way through its hold. */
export const restAt = (k: number) => SEGS.slice(0, BUILD[k] + 1).reduce((s, g) => s + g.w, 0) + SEGS[BUILD[k] + 1].w / 2;

/** Each strand's lane at the ends of a stretch, and the lane it crosses to mid-way. */
export const LANES = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
const SWAP = [2, 5, 0, 4, 1, 3];
const PINCH = [0.14, 0.7, 1.15, 1.15, 1.15, 0.7, 0.14];

const mid = (a: Pt, b: Pt) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
/** A cubic split at its middle, as seven points: two cubics end to end. */
export const halve = ([p0, p1, p2, p3]: Pt[]) => {
  const a = mid(p0, p1);
  const b = mid(p1, p2);
  const c = mid(p2, p3);
  const d = mid(a, b);
  const e = mid(b, c);
  return [p0, a, d, mid(d, e), e, c, p3];
};
const f1 = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
export const path = (p: Pt[]) => `M${f1(p[0])}C${f1(p[1])} ${f1(p[2])} ${f1(p[3])}C${f1(p[4])} ${f1(p[5])} ${f1(p[6])}`;
const normal = (a: Pt, b: Pt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l = Math.hypot(dx, dy) || 1;
  return { x: -dy / l, y: dx / l };
};
/** Strand `k` of the braid along the halved cubic `p`, `gap` px between lanes. */
export const strand = (p: Pt[], k: number, gap: number) => {
  const n0 = normal(p[0], p[1]);
  const nm = normal(p[2], p[4]);
  const n1 = normal(p[5], p[6]);
  const nn = [n0, n0, nm, nm, nm, n1, n1];
  return path(
    p.map((q, i) => {
      const o = (i >= 2 && i <= 4 ? LANES[SWAP[k]] : LANES[k]) * gap * PINCH[i];
      return { x: q.x + nn[i].x * o, y: q.y + nn[i].y * o };
    }),
  );
};

/** The road from `P` to `Q`: a ride between stops dips `sag` below the
    lower of the two; the first stretch, from HelloVerify, swings straight
    across (or, on a phone, rises from the badge's top). */
export const road = (P: Pt, Q: Pt, first: boolean, phone: boolean, dir: number, sag: number): Pt[] => {
  if (!first) {
    const dx = Q.x - P.x;
    const y = Math.max(P.y, Q.y) + sag * 1.33;
    return [P, { x: P.x + dx * 0.36, y }, { x: Q.x - dx * 0.36, y }, Q];
  }
  if (phone) return [P, { x: P.x, y: P.y - (P.y - Q.y) * 0.55 }, { x: Q.x - dir * 70, y: Q.y }, Q];
  const k = Math.max(90, Math.abs(Q.x - P.x) * 0.5);
  return [P, { x: P.x + dir * k, y: P.y }, { x: Q.x - dir * k, y: Q.y }, Q];
};

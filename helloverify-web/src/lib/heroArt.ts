/** Geometry for the homepage hero's security print (`sections/Hero.tsx`).

    The guilloche is four interlaced rings, each a sine-modulated circle drawn
    as a closed polyline and repeated at small rotations. It is computed here
    rather than pasted as path data: the canvas generated it with
    `hero/gen.py` and shipped ~30 KB of coordinates; this is the same function,
    so the source stays readable and the vertices are identical — the
    `.toFixed(1)` matches Python's `'%.1f'` for every coordinate that occurs
    (none lands on a .x5 tie; measured by diffing the two outputs). Since the
    Sep 2026 perf pass they are written as relative moves between those same
    rounded vertices (`lib/svgPath.ts`), not as absolute coordinates.

    Runs at build time only: `Hero` is a Server Component and the homepage is
    statically prerendered (BUILD-SPEC §5), so none of this reaches the
    client bundle. */

import { closedPolyline, polarRing } from "@/lib/svgPath";

type Ring = { R: number; A: number; n: number; per: number; B?: number; m?: number; phase?: number };

/** Same vertices as the canvas's absolute `'%.1f'` polyline, written as
 *  relative moves (`lib/svgPath.ts` has the measurement). */
function ringPath({ R, A, n, per, B = 0, m = 0, phase = 0 }: Ring): string {
  return closedPolyline(
    polarRing(n * per, (t) => R + A * Math.sin(n * t) + (B ? B * Math.sin(m * t + phase) : 0)),
  );
}

/** The four rings, outer to inner, and how many rotated copies each gets
 *  (spread across one lobe, so the copies interlace instead of overlapping). */
const RINGS = {
  gA: { ring: { R: 560, A: 24, n: 72, per: 8 }, copies: 5 },
  gB: { ring: { R: 430, A: 58, n: 30, per: 10, B: 14, m: 5 }, copies: 6 },
  gC: { ring: { R: 250, A: 78, n: 24, per: 10 }, copies: 8 },
  gD: { ring: { R: 110, A: 26, n: 16, per: 10 }, copies: 4 },
} as const;

export type RingId = keyof typeof RINGS;
export const RING_IDS = Object.keys(RINGS) as RingId[];

export const GUILLOCHE: Record<RingId, { d: string; rotations: string[] }> = Object.fromEntries(
  RING_IDS.map((id) => {
    const { ring, copies } = RINGS[id];
    const lobe = 360 / ring.n;
    return [id, { d: ringPath(ring), rotations: Array.from({ length: copies }, (_, i) => ((i * lobe) / copies).toFixed(3)) }];
  }),
) as Record<RingId, { d: string; rotations: string[] }>;

/** Paper fibres under the UV lamp: 70 short quadratic strokes scattered over
 *  the 1440×900 box. Random in the canvas generator (seed 11) and frozen here,
 *  because a seeded PRNG port would be more code than the path it reproduces.
 *  Written with relative control and end points (`q`), the same integers the
 *  canvas emitted as absolute `Q` - exact, and 1.9 KB -> 1.3 KB. */
export const FIBRES =
  "M655 495q-8 3-17 4M291 455q-9 8-9 21M163 702q3 10-6 9M929 541q5-3 9 5M299 231q8 5 17 1M746 561q0 8 0 21M1397 856q-12 2-19 11M433 88q-2 4-12 11M1343 733q12 0 13 0M1373 360q13-1 20 4M159 306q-16-2-22 3M177 80q-4 3-10 7M299 637q5 4 19 9M329 254q-13 6-22 2M327 357q-14 11-19 9M330 244q-8 0-12 10M163 514q5 6 14 13M1344 431q-6 8-5 24M1275 709q8 10 10 9M307 819q-10-2-18 7M93 829q5 11 15 15M851 274q4 2 19 11M801 737q2 4-5 14M63 253q-3 4 1 11M818 139q11 13 10 22M980 515q-1 7 10 5M993 829q10 4 20 1M474 859q12 7 18 5M1042 614q-11 10-19 15M1265 753q7 12 6 22M890 347q-8 12-5 19M1391 760q-3 7-11 12M639 726q5 4 21 6M694 221q-4 12-10 15M388 39q2 5 12 17M1272 578q0 14 4 24M310 388q-6 5-20 14M833 293q12 8 16 7M1007 819q4 2 8 9M331 374q-6 12-7 16M1376 406q9-5 10 2M1004 504q0 5 13 18M659 51q-11-2-12 7M896 401q-1 14-8 18M971 195q-5 7 1 13M1011 179q8 6 10 11M876 658q8 5 7 21M1308 630q10 8 16 6M552 502q-5 4-21 9M926 200q-6 12-15 18M330 777q-12 4-26 2M476 785q-12 3-14 7M788 668q4 0 1 10M1128 174q1 5 11 19M742 631q-3 5-18 10M1331 101q4 9 14 12M909 464q-11 3-17 9M1190 777q15 8 18 15M819 197q1 3-2 18M1358 458q5 11 7 22M980 85q4 13-2 16M406 423q12 8 16 6M688 293q13 1 16 12M1100 49q8 2 11 8M523 544q6 4 21 7M381 194q-3 8-2 17M760 163q10 6 16 12M1198 538q-4 6-13 6M1268 292q3 17 13 21M1247 141q5 3 16 15";

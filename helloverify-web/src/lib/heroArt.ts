/** Geometry for the homepage hero's security print (`sections/Hero.tsx`).

    The guilloche is four interlaced rings, each a sine-modulated circle drawn
    as a closed polyline and repeated at small rotations. It is computed here
    rather than pasted as path data: the canvas generated it with
    `hero/gen.py` and shipped ~30 KB of coordinates; this is the same function,
    so the source stays readable and the rendered bytes are identical — the
    `.toFixed(1)` matches Python's `'%.1f'` for every coordinate that occurs
    (none lands on a .x5 tie; measured by diffing the two outputs).

    Runs at build time only: `Hero` is a Server Component and the homepage is
    statically prerendered (BUILD-SPEC §5), so none of this reaches the
    client bundle. */

type Ring = { R: number; A: number; n: number; per: number; B?: number; m?: number; phase?: number };

function ringPath({ R, A, n, per, B = 0, m = 0, phase = 0 }: Ring): string {
  const N = n * per;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (2 * Math.PI * i) / N;
    const r = R + A * Math.sin(n * t) + (B ? B * Math.sin(m * t + phase) : 0);
    pts.push(`${(r * Math.cos(t)).toFixed(1)} ${(r * Math.sin(t)).toFixed(1)}`);
  }
  return "M" + pts.join(" L") + "Z";
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
 *  because a seeded PRNG port would be more code than the path it reproduces. */
export const FIBRES =
  "M655 495 Q647 498 638 499 M291 455 Q282 463 282 476 M163 702 Q166 712 157 711 M929 541 Q934 538 938 546 M299 231 Q307 236 316 232 M746 561 Q746 569 746 582 M1397 856 Q1385 858 1378 867 M433 88 Q431 92 421 99 M1343 733 Q1355 733 1356 733 M1373 360 Q1386 359 1393 364 M159 306 Q143 304 137 309 M177 80 Q173 83 167 87 M299 637 Q304 641 318 646 M329 254 Q316 260 307 256 M327 357 Q313 368 308 366 M330 244 Q322 244 318 254 M163 514 Q168 520 177 527 M1344 431 Q1338 439 1339 455 M1275 709 Q1283 719 1285 718 M307 819 Q297 817 289 826 M93 829 Q98 840 108 844 M851 274 Q855 276 870 285 M801 737 Q803 741 796 751 M63 253 Q60 257 64 264 M818 139 Q829 152 828 161 M980 515 Q979 522 990 520 M993 829 Q1003 833 1013 830 M474 859 Q486 866 492 864 M1042 614 Q1031 624 1023 629 M1265 753 Q1272 765 1271 775 M890 347 Q882 359 885 366 M1391 760 Q1388 767 1380 772 M639 726 Q644 730 660 732 M694 221 Q690 233 684 236 M388 39 Q390 44 400 56 M1272 578 Q1272 592 1276 602 M310 388 Q304 393 290 402 M833 293 Q845 301 849 300 M1007 819 Q1011 821 1015 828 M331 374 Q325 386 324 390 M1376 406 Q1385 401 1386 408 M1004 504 Q1004 509 1017 522 M659 51 Q648 49 647 58 M896 401 Q895 415 888 419 M971 195 Q966 202 972 208 M1011 179 Q1019 185 1021 190 M876 658 Q884 663 883 679 M1308 630 Q1318 638 1324 636 M552 502 Q547 506 531 511 M926 200 Q920 212 911 218 M330 777 Q318 781 304 779 M476 785 Q464 788 462 792 M788 668 Q792 668 789 678 M1128 174 Q1129 179 1139 193 M742 631 Q739 636 724 641 M1331 101 Q1335 110 1345 113 M909 464 Q898 467 892 473 M1190 777 Q1205 785 1208 792 M819 197 Q820 200 817 215 M1358 458 Q1363 469 1365 480 M980 85 Q984 98 978 101 M406 423 Q418 431 422 429 M688 293 Q701 294 704 305 M1100 49 Q1108 51 1111 57 M523 544 Q529 548 544 551 M381 194 Q378 202 379 211 M760 163 Q770 169 776 175 M1198 538 Q1194 544 1185 544 M1268 292 Q1271 309 1281 313 M1247 141 Q1252 144 1263 156";

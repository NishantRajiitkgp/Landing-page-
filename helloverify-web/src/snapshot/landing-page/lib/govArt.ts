/** Geometry for the homepage's two government bands: the seal rims and the
    rosette behind them (`sections/GovSeals.tsx`), and the dossier watermarks
    (`sections/GovDossiers.tsx`).

    Same approach as `lib/heroArt.ts`: the canvas generated these as pasted
    coordinates (`assemble_govw.py`, `assemble_gov.py`); this is the same
    function, so the source stays readable. They are only ever evaluated in the
    browser after mount (`sections/GovArt.tsx` says why), so none of it is in
    the HTML or the flight payload — measured on the canvas at ~120 KB of raw
    path data across five rims, the rosette and four watermarks. */

const f = (n: number) => n.toFixed(1);

/** A seal's guilloche rim: six phase-shifted wave rings between the two rules
 *  (r 84 and 101.5) of a 208-unit disc. `k` is the lobe count, one per seal,
 *  so no two authorities carry the same pattern. */
export function rimPaths(k: number): string[] {
  const C = 104;
  const N = k * 6;
  return Array.from({ length: 6 }, (_, l) => {
    const ph = (l * Math.PI) / 3;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = (2 * Math.PI * i) / N;
      const r = 93 + 5.2 * Math.sin(k * t + ph) * (0.75 + 0.25 * Math.cos(3 * t));
      pts.push(`${f(C + r * Math.cos(t))} ${f(C + r * Math.sin(t))}`);
    }
    return "M" + pts.join(" L") + "Z";
  });
}

/** The rosette turning behind the seal row: ten interlaced rings in a
 *  1000-unit box. */
export function rosettePaths(): string[] {
  return Array.from({ length: 10 }, (_, l) => {
    const pts: string[] = [];
    for (let i = 0; i <= 360; i++) {
      const t = (2 * Math.PI * i) / 360;
      const r = 380 + 70 * Math.sin(18 * t + (l * Math.PI) / 5) + 24 * Math.sin(5 * t - l * 0.4);
      pts.push(`${f(500 + r * Math.cos(t))} ${f(500 + r * Math.sin(t))}`);
    }
    return "M" + pts.join(" L") + "Z";
  });
}

/** One sine-modulated ring centred on the origin, for a dossier watermark. */
export function ringPath(R: number, A: number, n: number): string {
  const N = n * 8;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (2 * Math.PI * i) / N;
    const r = R + A * Math.sin(n * t);
    pts.push(`${f(r * Math.cos(t))} ${f(r * Math.sin(t))}`);
  }
  return "M" + pts.join(" L") + "Z";
}

/** A dossier watermark: rings as `[R, A, lobes, copies]`, each copy rotated by
 *  a fraction of one lobe so they interlace. */
export type Watermark = readonly (readonly [number, number, number, number])[];

export const WATERMARKS: Record<"health" | "immigration" | "manpower" | "trade", Watermark> = {
  health: [[150, 14, 36, 4], [96, 22, 18, 5], [46, 10, 12, 3]],
  immigration: [[160, 10, 48, 3], [110, 30, 12, 6], [52, 12, 20, 3]],
  manpower: [[158, 18, 30, 5], [104, 16, 24, 4], [58, 20, 8, 6]],
  trade: [[156, 12, 40, 4], [100, 26, 16, 5], [50, 14, 10, 4]],
};

/** The dashed thread joining the seal centres (x 120 + 240i, y 104 + lift)
 *  across a 1200×260 box, entering and leaving at the edges. */
export function threadPath(lift: readonly number[]): string {
  const cx = lift.map((_, i) => 120 + i * 240);
  const cy = lift.map((l) => 104 + l);
  let d = `M0 ${cy[0] + 30} C 60 ${cy[0] + 20}, 60 ${cy[0]}, ${cx[0]} ${cy[0]}`;
  for (let i = 1; i < lift.length; i++) d += ` S ${cx[i] - 90} ${cy[i]}, ${cx[i]} ${cy[i]}`;
  const e = cy[cy.length - 1];
  return `${d} S 1140 ${e + 20}, 1200 ${e + 30}`;
}

/** The octagonal stamp's two outlines (r 90 and 80), in a 200-unit box. */
export function octagon(r: number): string {
  return Array.from({ length: 8 }, (_, i) => {
    const a = ((22.5 + 45 * i) * Math.PI) / 180;
    return `${f(100 + r * Math.cos(a))},${f(100 + r * Math.sin(a))}`;
  }).join(" ");
}

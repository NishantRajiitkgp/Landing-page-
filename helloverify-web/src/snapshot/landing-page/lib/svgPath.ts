/** Compact path data for the formula-drawn guilloche rings (the hero's
    security print, the seals, the chronograph, the specimen documents).

    Every one of those rings used to be written as absolute coordinates to one
    decimal - `M560.0 0.0 L576.9 6.3 L583.9 12.7 …Z` - and together they were
    the single largest thing in the homepage HTML: 97 KB of path data, 12.6 KB
    of the 92 KB brotli document (measured by stripping them, Sep 2026). Four
    digits of high-entropy decimals per coordinate is what brotli is worst at.

    This emits the SAME vertices as relative moves: `M560 0l16.9 6.3 7 6.4…Z`.
    Each vertex is still its coordinate rounded exactly as `.toFixed(1)`
    rounded it - the deltas are taken between those rounded values in integer
    tenths, so no rounding error accumulates in the string - and the deltas of
    a periodic curve repeat, which brotli is good at. Measured on the built
    `/en`, switching the rings to this took the whole document from 91,999 to
    88,699 bytes brotli. The render is the same at 1440 and 390: full-page
    screenshots diffed, and the hero moved 2 pixels by one grey level - the
    rasteriser summing relative moves in float32, ~1e-4 of a user unit over
    700 vertices.

    Separators follow the SVG path grammar: a space between two numbers,
    dropped before a minus sign, which already delimits. Leading zeros are
    dropped (`.5`). Commands repeat implicitly, so one `l` carries the run. */

/** `.toFixed(1)`'s rounding, as an integer count of tenths. Parsing the
 *  string back is what keeps it exact: `x * 10` would round in binary. */
const tenths = (v: number): number => Math.round(Number(v.toFixed(1)) * 10);

/** Integer tenths → the shortest decimal the grammar accepts. */
function num(t: number): string {
  const s = String(Math.abs(t) / 10).replace(/^0\./, ".");
  return t < 0 ? `-${s}` : s;
}

/** Append `n` to a run of numbers, with a separator only where one is needed. */
const push = (out: string, n: string): string => (n[0] === "-" ? out + n : `${out} ${n}`);

/** An open polyline through `points` (user units), as compact relative path
 *  data on the 0.1 grid: `M` to the first point, one `l` run for the rest. */
export function polyline(points: Iterable<readonly [number, number]>): string {
  let out = "";
  let px = 0;
  let py = 0;
  let first = true;
  for (const [x, y] of points) {
    const tx = tenths(x);
    const ty = tenths(y);
    if (first) {
      out = `M${num(tx)}`;
      out = push(out, num(ty));
      out += "l";
      first = false;
    } else {
      const dx = num(tx - px);
      // The first number after the `l` needs no separator either.
      out = out.endsWith("l") ? out + dx : push(out, dx);
      out = push(out, num(ty - py));
    }
    px = tx;
    py = ty;
  }
  return out;
}

/** The same, closed with `Z`: the rings. */
export function closedPolyline(points: Iterable<readonly [number, number]>): string {
  return `${polyline(points)}Z`;
}

/** `n + 1` samples of a polar curve r(t), t over one full turn, centred on
 *  (cx, cy) - the loop every ring here shares. */
export function* polarRing(
  n: number,
  r: (t: number) => number,
  cx = 0,
  cy = 0,
): Generator<readonly [number, number]> {
  for (let i = 0; i <= n; i++) {
    const t = (2 * Math.PI * i) / n;
    const rr = r(t);
    yield [cx + rr * Math.cos(t), cy + rr * Math.sin(t)];
  }
}

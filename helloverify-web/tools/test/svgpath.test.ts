/** `closedPolyline()` — the relative path encoding for the guilloche rings.
 *
 *  The whole claim of `src/lib/svgPath.ts` is "same vertices, fewer bytes".
 *  The bytes are measured by the perf gate; the vertices are held here, by
 *  decoding the relative string back to absolute tenths and comparing it with
 *  the absolute `.toFixed(1)` polyline every ring used to emit. A decoder that
 *  drifted by one tenth anywhere would move a line on the hero.
 */
import { closedPolyline, polarRing } from "../../src/lib/svgPath.ts";

import { check } from "./harness.ts";

/** The encoding every ring used before: absolute, one decimal. */
function legacy(pts: Iterable<readonly [number, number]>): string {
  return `M${[...pts].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}Z`;
}

/** Absolute vertices in integer tenths, from either encoding. */
function decode(d: string): number[][] {
  const out: number[][] = [];
  const tokens = d.match(/[MLlZ]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  let cmd = "";
  let x = 0;
  let y = 0;
  const nums: number[] = [];
  const flush = () => {
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const a = Math.round(nums[i] * 10);
      const b = Math.round(nums[i + 1] * 10);
      if (cmd === "l") { x += a; y += b; } else { x = a; y = b; }
      out.push([x, y]);
    }
    nums.length = 0;
  };
  for (const t of tokens) {
    if (/^[MLlZ]$/.test(t)) { flush(); cmd = t; } else nums.push(Number(t));
  }
  flush();
  return out;
}

const RINGS: [string, () => Iterable<readonly [number, number]>][] = [
  ["hero gA", () => polarRing(72 * 8, (t) => 560 + 24 * Math.sin(72 * t))],
  ["hero gB", () => polarRing(30 * 10, (t) => 430 + 58 * Math.sin(30 * t) + 14 * Math.sin(5 * t))],
  ["letter seal", () => polarRing(180, (t) => 34 + 5 * Math.sin(14 * t + Math.PI / 3), 44, 44)],
  ["chronograph", () => polarRing(240, (t) => 104 + 10 * Math.sin(12 * t), 200, 200)],
  ["specimen", () => polarRing(36 * 8, (a) => 70 + 6 * Math.sin(36 * a), 380, 150)],
];

console.log("1. same vertices as the absolute `.toFixed(1)` polyline");

for (const [name, pts] of RINGS) {
  const a = decode(legacy(pts()));
  const b = decode(closedPolyline(pts()));
  const same = a.length === b.length && a.every((p, i) => p[0] === b[i][0] && p[1] === b[i][1]);
  const first = a.findIndex((p, i) => !b[i] || p[0] !== b[i][0] || p[1] !== b[i][1]);
  check(`${name}: ${a.length} vertices, identical`, same, { first, a: a[first], b: b[first] });
  check(`${name}: shorter than the absolute form`, closedPolyline(pts()).length < legacy(pts()).length);
}

console.log("2. the grammar");

const d = closedPolyline([[0.04, -0.04], [1.25, -0.5], [0.5, 2], [0.5, 2]]);
check("rounds as .toFixed(1) does, minus zero prints as 0", d.startsWith("M0 0l"), d);
check("a minus sign is its own separator", d.includes("1.3-.5"), d);
check("leading zeros are dropped, a zero delta is 0", d.endsWith(" 0 0Z"), d);
check("closes with Z and uses one `l` for the run", /^M[^l]*l[^lL]*Z$/.test(d), d);

/** The engraved chronograph of the v2 "33 checks" race (`./ChecksRace`).
 *  Decorative — the readout beside it says the same thing in words — so the
 *  whole drawing is `aria-hidden`.
 *
 *  Drawn from formulas at render, not shipped as path data, for the reason
 *  `HeroPrint.tsx` gives: this is imported by a Client Component, so what
 *  crosses the RSC flight payload is this code, not its output. And the
 *  board's eight guilloche rings are ONE ring rotated: r = 104 + 10·sin(12t +
 *  lπ/4) is ring 0 turned by −3.75°·l, so one path and seven `<use>`s replace
 *  eight 241-point paths (measured: the board's eight paths are 25.0 KB of
 *  markup; the one path and its seven copies are 3.6 KB).
 *
 *  Geometry in a 400-unit box, centre (200, 200): minute ring r168, ticks
 *  r170–182, numerals r136; the days subdial at 9 o'clock (116, 200) r44.
 *  The markers' `×N` are how many of the 17 checks finish at that mark. */

import { closedPolyline, polarRing } from "@/lib/svgPath";

const C = 200;
const f = (n: number) => n.toFixed(1);
const at = (k: number, of: number) => (k / of) * 2 * Math.PI - Math.PI / 2;

/** Relative moves on the 0.1 grid (`lib/svgPath.ts`), same vertices. */
function ring(): string {
  return closedPolyline(polarRing(240, (t) => 104 + 10 * Math.sin(12 * t), C, C));
}

/** Minute-ring markers: where on the 60-minute dial, how many land there,
 *  and the state key the race lights it by. Label offsets are the board's. */
const MINUTE_MARKS = [
  { min: 15, count: 6, key: "m15", dx: 8, dy: 4 },
  { min: 30, count: 4, key: "m30", dx: 0, dy: 14 },
  { min: 60, count: 3, key: "m60", dx: 0, dy: -4 },
] as const;

const SX = 116;
const SY = 200;
const SR = 44;

export type DialMarks = { m15: boolean; m30: boolean; m60: boolean; d2: boolean; d3: boolean };

export function ChecksDial({
  hand,
  arc,
  marks,
  unitMin,
  unitDays,
}: {
  /** `cz-hA`/`cz-hB` while a run plays (two names so a restart restarts), else "". */
  hand: string;
  arc: string;
  marks: DialMarks;
  unitMin: string;
  unitDays: string;
}) {
  const on = (b: boolean) => (b ? " cz-mk-on" : "");
  return (
    <svg className="cz-dial" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <defs>
        <path id="cz-gl" d={ring()} />
      </defs>
      <g className="cz-gl">
        {Array.from({ length: 8 }, (_, l) => (
          <use key={l} href="#cz-gl" transform={`rotate(${-3.75 * l} 200 200)`} />
        ))}
      </g>
      <circle className="cz-rim" cx="200" cy="200" r="186" />
      <circle className="cz-rim2" cx="200" cy="200" r="150" />
      <circle className={`cz-arc ${arc}`} cx="200" cy="200" r="168" pathLength="100" />
      {Array.from({ length: 60 }, (_, k) => {
        const a = at(k, 60);
        const r1 = k % 5 ? 176 : 170;
        return (
          <line
            key={k}
            className={k % 5 ? "cz-tk" : "cz-tk5"}
            x1={f(C + 182 * Math.cos(a))}
            y1={f(C + 182 * Math.sin(a))}
            x2={f(C + r1 * Math.cos(a))}
            y2={f(C + r1 * Math.sin(a))}
          />
        );
      })}
      {[15, 30, 60].map((m) => {
        const a = at(m % 60, 60);
        return (
          <text key={m} className="cz-num" x={f(C + 136 * Math.cos(a))} y={f(C + 136 * Math.sin(a) + 4)}>
            {m}
          </text>
        );
      })}
      <text className="cz-unit" x="200" y="92">{unitMin}</text>
      {MINUTE_MARKS.map(({ min, count, key, dx, dy }) => {
        const a = at(min % 60, 60);
        return (
          <g key={key} className={`cz-mk${on(marks[key])}`}>
            <circle cx={f(C + 168 * Math.cos(a))} cy={f(C + 168 * Math.sin(a))} r="7" />
            <text x={f(C + 206 * Math.cos(a) + dx)} y={f(C + 206 * Math.sin(a) + dy)}>{`×${count}`}</text>
          </g>
        );
      })}
      <circle className="cz-sub" cx={SX} cy={SY} r={SR} />
      {[0, 1, 2, 3].map((d) => {
        const a = at(d, 4);
        return (
          <g key={d}>
            <line className="cz-tk5" x1={f(SX + SR * Math.cos(a))} y1={f(SY + SR * Math.sin(a))} x2={f(SX + (SR - 7) * Math.cos(a))} y2={f(SY + (SR - 7) * Math.sin(a))} />
            <text className="cz-snum" x={f(SX + (SR - 17) * Math.cos(a))} y={f(SY + (SR - 17) * Math.sin(a) + 3.5)}>{d}</text>
          </g>
        );
      })}
      <circle className={`cz-smk${marks.d2 ? " cz-smk-on" : ""}`} cx={SX} cy={SY + SR} r="4.5" />
      <circle className={`cz-smk${marks.d3 ? " cz-smk-on" : ""}`} cx={SX - SR} cy={SY} r="4.5" />
      <text className="cz-sunit" x={SX} y={SY - SR - 9}>{unitDays}</text>
      <text className="cz-sx" x={SX} y={SY + SR + 16}>×2</text>
      <text className="cz-sx" x={SX - SR - 20} y={SY + 3}>×2</text>
      <g className={`cz-hand-s ${hand}`} style={{ transformOrigin: `${SX}px ${SY}px` }}>
        <line x1={SX} y1={SY + 8} x2={SX} y2={SY - SR + 8} />
        <circle cx={SX} cy={SY} r="3.2" />
      </g>
      <g className={`cz-hand ${hand}`} style={{ transformOrigin: "200px 200px" }}>
        <line x1="200" y1="226" x2="200" y2="40" />
        <circle className="cz-tip" cx="200" cy="40" r="4.5" />
        <circle className="cz-cap" cx="200" cy="200" r="8" />
        <circle className="cz-pin" cx="200" cy="200" r="2.4" />
      </g>
    </svg>
  );
}

/** The `/about` hero's world: HelloVerify's land-dot map with the head
    office lit. Played once, in under five seconds: the head office pulses,
    an arc draws to each of the other five offices (nearest first) and a red
    signal runs it, the office answers, and a wave of lit dots spreads out
    across the land from the head office.

    Geography, so it does not mirror under `dir="rtl"`. Decoration,
    `aria-hidden`. Geometry in `./aboutWorld`. */
import type { CSSProperties } from "react";
import { ARCS, HQ, LAND, LIT, MAP_H, MAP_W, STEP_X, STEP_Y } from "./aboutWorld";

const d = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as CSSProperties;

export function AboutMap() {
  return (
    <svg className="ab-map-svg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} fill="none" aria-hidden="true">
      <defs>
        <pattern id="ab-land-dots" width={STEP_X} height={STEP_Y} patternUnits="userSpaceOnUse">
          <circle className="ab-dot" cx={STEP_X / 2} cy={STEP_Y / 2} r="1.3" />
        </pattern>
      </defs>
      <path className="ab-land" d={LAND} fill="url(#ab-land-dots)" />

      <g>
        {LIT.map((p, i) => (
          <circle key={i} className="ab-lit" cx={p.x} cy={p.y} r="1.6" style={d(p.at)} />
        ))}
      </g>

      <g>
        {ARCS.map((a) => (
          <path key={a.k} className="ab-arc" d={a.d} pathLength="1" style={d(a.at)} />
        ))}
        {ARCS.map((a) => (
          <path key={a.k} className="ab-comet" d={a.d} pathLength="1" style={d(a.at + 0.3)} />
        ))}
      </g>

      {ARCS.map((a) => (
        <g key={a.k} style={d(a.at + 1.05)}>
          <circle className="ab-off-rip" cx={a.x} cy={a.y} r="4" />
          <circle className="ab-off" cx={a.x} cy={a.y} r="4" />
        </g>
      ))}

      <circle className="ab-hq-halo" cx={HQ.x} cy={HQ.y} r="13" />
      <circle className="ab-hq-rip" cx={HQ.x} cy={HQ.y} r="5" style={d(0.95)} />
      <circle className="ab-hq-rip" cx={HQ.x} cy={HQ.y} r="5" style={d(1.35)} />
      <circle className="ab-hq" cx={HQ.x} cy={HQ.y} r="5" />
    </svg>
  );
}

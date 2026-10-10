/** The third pillar drawing (`./TechPillars`), on the same 560 × 360 board
    and `tk-a-*` motion classes as `./TechPillarArt`. */
import { CAP, CASE, GLOBE, Glyph, INST, Ok, PERSON, SHIELD, d } from "./TechPillarKit";

/* ── 03 · Orchestration: cases queue; the engine routes each to its own
   authority, across a border and through that jurisdiction's checks, and
   closes the case itself. ── */

const CASES = [
  { y: 140, g: CAP, dest: CAP, lane: "M290 220C340 220 352 110 412 110H504", to: 110 },
  { y: 220, g: CASE, dest: CASE, lane: "M290 220H504", to: 220 },
  { y: 300, g: PERSON, dest: INST, lane: "M290 220C340 220 352 330 412 330H504", to: 330 },
];
const FEEDS = ["M156 140C196 140 200 220 232 220", "M156 220H232", "M156 300C196 300 200 220 232 220"];
const at = (i: number) => 0.55 + i * 0.6;

export function RouteArt() {
  return (
    <svg className="tk-art tk-mirror" viewBox="20 40 560 360" fill="none">
      {/* Across the border: another jurisdiction */}
      <rect className="tk-abroad tk-a-fade" x="412" y="52" width="158" height="336" rx="18" style={d(0.15)} />
      <path className="tk-border tk-a-fade" d="M412 52V388" style={d(0.15)} />
      <g className="tk-a-pop" style={d(0.3)}>
        <circle className="tk-node" cx="412" cy="52" r="13" />
        <Glyph g={GLOBE} x={412} y={52} s={0.58} />
      </g>

      {FEEDS.map((p, i) => (
        <path key={i} className="tk-lane" d={p} />
      ))}
      {CASES.map((c, i) => (
        <g key={i}>
          <path className="tk-lane" d={c.lane} />
          <path className="tk-lane-on tk-a-draw" d={c.lane} pathLength="1" style={d(at(i) + 0.35, { "--t": ".7s" })} />
          <path className="tk-pk tk-a-pk" d={FEEDS[i]} pathLength="1" style={d(at(i), { "--t": ".35s" })} />
          <path className="tk-pk tk-a-pk" d={c.lane} pathLength="1" style={d(at(i) + 0.35, { "--t": ".7s" })} />
        </g>
      ))}

      {/* The queue: education, employment, identity */}
      {CASES.map((c, i) => (
        <g key={i} className="tk-a-in" style={d(i * 0.08)}>
          <rect className="tk-sheet" x="40" y={c.y - 30} width="116" height="60" rx="10" />
          <rect className="tk-paperfill" x="50" y={c.y - 16} width="32" height="32" rx="8" />
          <Glyph g={c.g} x={66} y={c.y} s={0.62} />
          <rect className="tk-inkbar" x="92" y={c.y - 8} width="44" height="6" rx="3" />
          <rect className="tk-soft" x="92" y={c.y + 4} width="30" height="5" rx="2.5" />
        </g>
      ))}

      {/* The engine decides each route */}
      <g transform="translate(262 220)">
        {CASES.map((_, i) => (
          <rect key={i} className="tk-o-rip tk-a-rip" x="-28" y="-28" width="56" height="56" rx="12" transform="rotate(45)" style={d(at(i) + 0.35)} />
        ))}
        <rect className="tk-router" x="-28" y="-28" width="56" height="56" rx="12" transform="rotate(45)" />
        <path className="tk-router-g" d="M-8 0h5M-3 0C1 0 2-7 7-7M-3 0h10M-3 0C1 0 2 7 7 7" />
        <circle className="tk-router-end" cx="9" cy="-7" r="2" />
        <circle className="tk-router-end" cx="9" cy="0" r="2" />
        <circle className="tk-router-end" cx="9" cy="7" r="2" />
        <circle className="tk-dot-red" cx="-9" cy="0" r="3.2" />
      </g>

      {/* Each jurisdiction's checks at the border, then the authority */}
      {CASES.map((c, i) => (
        <g key={i}>
          <circle className="tk-node" cx="412" cy={c.to} r="17" />
          <Glyph g={SHIELD} x={412} y={c.to} s={0.58} />
          <Ok x={424} y={c.to - 12} r={6} at={at(i) + 0.75} />
          <circle className="tk-node" cx="528" cy={c.to} r="24" />
          <Glyph g={c.dest} x={528} y={c.to} s={0.72} />
          <Ok x={546} y={c.to - 18} at={at(i) + 1.05} />
          <Ok x={150} y={c.y - 24} r={7} at={at(i) + 1.2} />
        </g>
      ))}
    </svg>
  );
}

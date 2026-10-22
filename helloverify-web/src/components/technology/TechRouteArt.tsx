/** The third pillar drawing on the `/technology` stage (`./TechPillars`), on
    the same 560 × 360 board and `tk-a-*` motion classes as the other two.

      0s    a mixed queue: education, employment, identity, licence
      0.45s the ML router sends each case down its own lane; every fork is an
            automatic decision, ticked
      1.9s  the lanes cross the border, and each jurisdiction adds its own
            stops: consent, legalisation, data residency
      3.3s  each lane ends at the right authority, which confirms, and the
            case closes itself */
import { CAP, CASE, DOC, GLOBE, Glyph, ID, INST, LOCK, Label, OFFICE, Ok, SEAL, SHIELD, d, type TechArt } from "./TechPillarKit";

type Stop = "consent" | "legalised" | "residency";
const LANES: { y: number; g: string; end: string; stop?: { g: string; k: Stop } }[] = [
  { y: 66, g: CAP, end: INST, stop: { g: DOC, k: "consent" } },
  { y: 140, g: CASE, end: OFFICE, stop: { g: SEAL, k: "legalised" } },
  { y: 214, g: ID, end: INST, stop: { g: LOCK, k: "residency" } },
  { y: 288, g: DOC, end: SHIELD },
];
const feed = (y: number) => `M132 ${y}C160 ${y} 166 177 188 177`;
const lane = (y: number) => `M240 177C268 177 272 ${y} 300 ${y}H502`;

export function RouteArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* Across the border: another jurisdiction */}
      <rect className="tk-abroad tk-a-fade" x="384" y="34" width="164" height="300" rx="16" style={d(1.9)} />
      <path className="tk-border tk-a-fade" d="M384 30V336" style={d(1.9)} />
      <g className="tk-a-pop" style={d(2)}>
        <circle className="tk-node" cx="384" cy="30" r="12" />
        <Glyph g={GLOBE} x={384} y={30} s={0.5} cls="tk-ic tk-ic-m" />
      </g>

      {LANES.map((c, i) => (
        <g key={c.y}>
          <path className="tk-edge2 tk-a-draw" d={feed(c.y)} pathLength="1" style={d(0.5 + i * 0.06)} />
          <path className="tk-lane" d={lane(c.y)} />
          <path className="tk-lane-on tk-a-draw" d={lane(c.y)} pathLength="1" style={d(2 + i * 0.15, { "--t": ".9s" })} />
          <path className="tk-pk tk-a-pk" d={feed(c.y)} pathLength="1" style={d(0.7 + i * 0.12, { "--t": ".35s" })} />
          <path className="tk-pk tk-a-pk" d={lane(c.y)} pathLength="1" style={d(2 + i * 0.15, { "--t": ".9s" })} />
        </g>
      ))}

      {/* The queue */}
      {LANES.map((c, i) => (
        <g key={c.y} className="tk-a-in" style={d(i * 0.08)}>
          <rect className="tk-sheet" x="24" y={c.y - 24} width="108" height="48" rx="12" />
          <rect className="tk-paperfill" x="32" y={c.y - 14} width="28" height="28" rx="8" />
          <Glyph g={c.g} x={46} y={c.y} s={0.58} />
          <rect className="tk-inkbar" x="68" y={c.y - 7} width="44" height="6" rx="3" />
          <rect className="tk-soft" x="68" y={c.y + 4} width="30" height="5" rx="2.5" />
        </g>
      ))}

      {/* The router, and the automatic decision at every fork */}
      <g transform="translate(214 177)">
        {LANES.map((c, i) => (
          <rect key={c.y} className="tk-o-rip tk-a-rip" x="-27" y="-27" width="54" height="54" rx="12" transform="rotate(45)" style={d(1 + i * 0.12)} />
        ))}
        <g className="tk-a-pop" style={d(0.45)}>
          <rect className="tk-router" x="-27" y="-27" width="54" height="54" rx="12" transform="rotate(45)" />
          <path className="tk-router-g" d="M-13 0h6M-7 0c4 0 5-8 11-8M-7 0h11M-7 0c4 0 5 8 11 8" />
          <circle className="tk-router-end" cx="7" cy="-8" r="2" />
          <circle className="tk-router-end" cx="7" cy="0" r="2" />
          <circle className="tk-router-end" cx="7" cy="8" r="2" />
          <circle className="tk-dot-red" cx="-12" cy="0" r="3" />
        </g>
      </g>
      <Label x={214} y={238} at={0.6}>{l.router}</Label>
      {LANES.map((c, i) => (
        <g key={c.y}>
          <g className="tk-a-pop" style={d(1 + i * 0.12)}>
            <rect className="tk-fork" x="311" y={c.y - 7} width="14" height="14" rx="3" transform={`rotate(45 318 ${c.y})`} />
          </g>
          <Ok x={318} y={c.y - 16} r={5} at={1.2 + i * 0.12} />
        </g>
      ))}

      {/* Each jurisdiction's checks at the border, its own stop, then the authority */}
      {LANES.map((c, i) => (
        <g key={c.y}>
          <g className="tk-a-pop" style={d(2.15 + i * 0.08)}>
            <circle className="tk-node" cx="384" cy={c.y} r="13" />
            <Glyph g={SHIELD} x={384} y={c.y} s={0.5} />
          </g>
          {c.stop && (
            <>
              <g className="tk-a-pop" style={d(2.4 + i * 0.12)}>
                <circle className="tk-node" cx="448" cy={c.y} r="14" />
                <Glyph g={c.stop.g} x={448} y={c.y} s={0.55} cls="tk-ic tk-ic-r" />
              </g>
              <Label x={448} y={c.y + 28} at={2.5 + i * 0.12}>{l[c.stop.k]}</Label>
            </>
          )}
          <g className="tk-a-pop" style={d(1.1 + i * 0.06)}>
            <circle className="tk-node" cx="520" cy={c.y} r="19" />
            <Glyph g={c.end} x={520} y={c.y} s={0.72} />
          </g>
          <Ok x={535} y={c.y - 15} r={7} at={3.3 + i * 0.12} />
          <Ok x={128} y={c.y - 22} r={7} at={3.6 + i * 0.1} />
        </g>
      ))}
    </svg>
  );
}

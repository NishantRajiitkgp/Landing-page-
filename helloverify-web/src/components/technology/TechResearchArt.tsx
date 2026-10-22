/** The second pillar drawing on the `/technology` stage (`./TechPillars`).

    Two certificates come in, one genuine and one a lookalike (dashed). The
    engine, drawn as a small neural network with a search badge, then acts
    out the paragraph in order:

      0.4s  it researches the issuer and every way to reach it
      1.5s  hotline and inbox are ruled out; the authorised registrar answers
            and the genuine certificate is ticked
      2.5s  the lookalike's issuer is checked against the fraud database,
            matches a listed institution, and that certificate is stamped
      3.6s  both outcomes loop back; the network lights and the fraud shield
            beneath it grows */
import { CAP, Glyph, INST, Label, MAIL, Ok, PERSON, PHONE, SEARCH, SHIELD, d, type TechArt } from "./TechPillarKit";

/** The engine's three layers of neurons, and the four that light as it learns. */
const NET = [
  [[230, 162], [230, 180], [230, 198]],
  [[250, 152], [250, 170], [250, 190], [250, 208]],
  [[270, 170], [270, 190]],
];
const LIT = [[0, 1], [1, 0], [1, 2], [2, 1]];
const EDGES = NET.slice(1).flatMap((layer, k) => NET[k].flatMap(([x1, y1]) => layer.map(([x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`)));

/** The ways to reach the issuer: only the registrar is authorised. */
const CONTACTS = [
  { g: PHONE, x: 494, y: 40, wire: "M410 84C440 50 460 40 478 40" },
  { g: MAIL, x: 494, y: 160, wire: "M410 108C440 150 460 160 478 160" },
];
const LISTED = [230, 262, 294];
const MATCH = 1;

function Cert({ y, fake }: { y: number; fake?: boolean }) {
  return (
    <g className="tk-a-in" style={d(fake ? 0.1 : 0)}>
      <rect className={fake ? "tk-sheet tk-sheet-dash" : "tk-sheet"} x="26" y={y} width="118" height="96" rx="12" />
      <rect className="tk-paperfill" x="36" y={y + 10} width="30" height="30" rx="9" />
      <Glyph g={CAP} x={51} y={y + 25} s={0.65} />
      <rect className="tk-inkbar" x="74" y={y + 16} width="52" height="6" rx="3" />
      <rect className="tk-soft" x="74" y={y + 28} width="34" height="5" rx="2.5" />
      <rect className="tk-bar" x="36" y={y + 56} width="92" height="5" rx="2.5" />
      <rect className="tk-bar" x="36" y={y + 68} width="70" height="5" rx="2.5" />
    </g>
  );
}

export function ResearchArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      <Cert y={46} />
      <Cert y={218} fake />
      <path className="tk-edge2 tk-a-draw" d="M144 94C180 94 180 168 208 168" pathLength="1" style={d(0.35)} />
      <path className="tk-edge2 tk-a-draw" d="M144 266C180 266 180 192 208 192" pathLength="1" style={d(0.4)} />

      {/* The engine */}
      <circle className="tk-eng-ring tk-a-draw" cx="250" cy="180" r="60" pathLength="1" style={d(3.9, { "--t": ".8s" })} />
      <g className="tk-a-in" style={d(0.15)}>
        <rect className="tk-eng" x="208" y="138" width="84" height="84" rx="22" />
        {EDGES.map((p) => (
          <path key={p} className="tk-eng-e" d={p} />
        ))}
        {NET.flat().map(([x, y]) => (
          <circle key={`${x}-${y}`} className="tk-eng-n" cx={x} cy={y} r="3.2" />
        ))}
      </g>
      {LIT.map(([k, i], j) => (
        <circle key={j} className="tk-dot-red tk-a-pop" cx={NET[k][i][0]} cy={NET[k][i][1]} r="3.4" style={d(4 + j * 0.08)} />
      ))}
      <g className="tk-a-pop" style={d(0.3)}>
        <circle className="tk-node" cx="292" cy="138" r="13" />
        <Glyph g={SEARCH} x={292} y={138} s={0.55} cls="tk-ic tk-ic-r" />
      </g>
      <Label x={250} y={112} at={0.3}>{l.ai}</Label>

      {/* It researches the issuer and every way to reach it */}
      <path className="tk-edge2 tk-a-draw" d="M305 150C335 110 350 96 370 96" pathLength="1" style={d(0.55)} />
      <g className="tk-a-pop" style={d(0.7)}>
        <circle className="tk-node" cx="392" cy="96" r="22" />
        <Glyph g={INST} x={392} y={96} s={0.8} />
      </g>
      {CONTACTS.map((c, i) => (
        <g key={c.y}>
          <g className="tk-dim tk-a-dim" style={d(1.5)}>
            <path className="tk-edge2 tk-a-draw" d={c.wire} pathLength="1" style={d(0.85)} />
            <g className="tk-a-pop" style={d(0.95 + i * 0.1)}>
              <circle className="tk-node" cx={c.x} cy={c.y} r="16" />
              <Glyph g={c.g} x={c.x} y={c.y} s={0.62} cls="tk-ic tk-ic-m" />
            </g>
          </g>
          <Ok x={c.x + 13} y={c.y - 11} r={6} at={1.55 + i * 0.08} bad />
        </g>
      ))}
      <path className="tk-edge2 tk-a-draw" d="M414 96H492" pathLength="1" style={d(0.85)} />
      <g className="tk-a-pop" style={d(1.15)}>
        <circle className="tk-node" cx="510" cy="96" r="18" />
        <Glyph g={PERSON} x={510} y={96} s={0.72} />
      </g>

      {/* …the right authorised contact answers */}
      <path className="tk-p-link tk-a-draw" d="M414 96H492" pathLength="1" style={d(1.65, { "--t": ".35s" })} />
      <path className="tk-comet tk-a-back" d="M305 150C335 110 350 96 370 96" pathLength="1" style={d(2.05, { "--t": ".35s" })} />
      <circle className="tk-hi-ring tk-a-pop" cx="510" cy="96" r="22" style={d(1.85)} />
      <g className="tk-a-pop" style={d(1.95)}>
        <circle className="tk-dot-red" cx="526" cy="80" r="8" />
        <Glyph g={SHIELD} x={526} y={80} s={0.4} cls="tk-ic tk-ic-w" />
      </g>
      <Label x={510} y={134} at={1.95} red>{l.registrar}</Label>
      <Ok x={136} y={54} r={9} at={2.3} />

      {/* The lookalike's issuer, checked against the fraud database */}
      <path className="tk-p-link tk-a-draw" d="M292 196C330 230 345 262 368 262" pathLength="1" style={d(2.5)} />
      <g className="tk-a-in" style={d(2.55)}>
        <path className="tk-db" d="M370 240c0-5 13-9 30-9s30 4 30 9v44c0 5-13 9-30 9s-30-4-30-9z" />
        <path className="tk-hair" d="M370 256c0 5 13 9 30 9s30-4 30-9M370 270c0 5 13 9 30 9s30-4 30-9" />
        <ellipse className="tk-db-top" cx="400" cy="240" rx="30" ry="9" />
      </g>
      <Label x={400} y={218} at={2.7}>{l.fraudDb}</Label>
      {LISTED.map((y, i) => (
        <g key={y}>
          <g className="tk-a-in" style={d(2.6 + i * 0.08)}>
            <rect className="tk-sheet" x="446" y={y - 13} width="94" height="26" rx="8" />
            {i === MATCH && <rect className="tk-row-hi tk-a-fade" x="446" y={y - 13} width="94" height="26" rx="8" style={d(3.1)} />}
            <Glyph g={INST} x={462} y={y} s={0.55} cls="tk-ic tk-ic-m" />
            <rect className="tk-soft" x="476" y={y - 2.5} width="42" height="5" rx="2.5" />
          </g>
          <path className="tk-strike tk-a-draw" d={`M474 ${y}H522`} pathLength="1" style={d(2.8 + i * 0.08, { "--t": ".25s" })} />
          <Ok x={530} y={y} r={5} at={2.85 + i * 0.08} bad />
        </g>
      ))}
      <rect className="tk-hi-ring tk-a-fade" x="446" y={LISTED[MATCH] - 13} width="94" height="26" rx="8" style={d(3.1)} />
      <rect className="tk-flag tk-a-fade" x="26" y="218" width="118" height="96" rx="12" style={d(3.25)} />
      <Ok x={136} y={226} r={9} at={3.3} bad />

      {/* Both outcomes loop back: it learns, and fraud detection grows */}
      <path className="tk-loop tk-a-fade" d="M494 110C460 128 340 124 306 150" style={d(3.6)} />
      <path className="tk-loop tk-a-fade" d="M400 293C380 330 300 330 272 306" style={d(3.7)} />
      <path className="tk-p-link tk-a-draw" d="M250 222V280" pathLength="1" style={d(4.1, { "--t": ".3s" })} />
      <g className="tk-a-pop" style={d(4.25)}>
        <circle className="tk-pale" cx="250" cy="302" r="22" />
        <Glyph g={SHIELD} x={250} y={302} s={0.95} cls="tk-ic tk-ic-r" />
      </g>
      <Label x={250} y={342} at={4.35} red>{l.learns}</Label>
    </svg>
  );
}

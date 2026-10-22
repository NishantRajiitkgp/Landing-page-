/** The second pillar drawing on the `/technology` stage (`./TechPillars`).

    One certificate, read left to right in the paragraph's order:

      0.2s  the certificate arrives and reaches HelloVerify
      1.2s  HelloVerify connects the right authorised contact, the
            registrar, who confirms
      2.4s  the issuer is checked against the fraud database and matches
            a listed institution
      3.6s  that result returns, and fraud detection grows */
import { Logo } from "@/components/brand/Logo";
import { CAP, Glyph, INST, Label, Ok, PERSON, SHIELD, d, type TechArt } from "./TechPillarKit";

const ROWS = [206, 240, 274];
const MATCH = 1;

export function ResearchArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* The certificate */}
      <g className="tk-a-in" style={d(0)}>
        <rect className="tk-sheet" x="24" y="112" width="120" height="100" rx="12" />
        <rect className="tk-paperfill" x="36" y="124" width="30" height="30" rx="9" />
        <Glyph g={CAP} x={51} y={139} s={0.65} />
        <rect className="tk-inkbar" x="74" y="130" width="54" height="6" rx="3" />
        <rect className="tk-soft" x="74" y="142" width="36" height="5" rx="2.5" />
        <rect className="tk-bar" x="36" y="168" width="92" height="5" rx="2.5" />
        <rect className="tk-bar" x="36" y="182" width="70" height="5" rx="2.5" />
      </g>
      <path className="tk-p-link tk-a-draw" d="M144 162H181" pathLength="1" style={d(0.45, { "--t": ".3s" })} />

      {/* HelloVerify, where the engine sits */}
      <g className="tk-a-pop" style={d(0.6)} transform="translate(220 162)">
        <g className="tk-uf">
          <rect className="tk-sheet" x="-39" y="-15" width="78" height="30" rx="10" />
          <g transform="translate(-35 -10)">
            <Logo width={70} height={20} />
          </g>
        </g>
      </g>

      {/* The right authorised contact */}
      <path className="tk-p-link tk-a-draw" d="M259 150C330 150 400 96 434 96" pathLength="1" style={d(1.2)} />
      <g className="tk-a-pop" style={d(1.45)}>
        <circle className="tk-node" cx="456" cy="96" r="22" />
        <Glyph g={PERSON} x={456} y={96} s={0.85} />
      </g>
      <g className="tk-a-pop" style={d(1.6)}>
        <circle className="tk-dot-red" cx="474" cy="80" r="9" />
        <Glyph g={SHIELD} x={474} y={80} s={0.42} cls="tk-ic tk-ic-w" />
      </g>
      <Label x={456} y={136} at={1.7} red>{l.registrar}</Label>
      <Ok x={136} y={120} r={9} at={1.9} />

      {/* The fraud database */}
      <path className="tk-p-link tk-a-draw" d="M259 174C320 174 340 250 368 250" pathLength="1" style={d(2.4)} />
      <g className="tk-a-in" style={d(2.5)}>
        <path className="tk-db" d="M370 232c0-6 13-10 30-10s30 4 30 10v36c0 6-13 10-30 10s-30-4-30-10z" />
        <path className="tk-hair" d="M370 248c0 6 13 10 30 10s30-4 30-10M370 262c0 6 13 10 30 10s30-4 30-10" />
        <ellipse className="tk-db-top" cx="400" cy="232" rx="30" ry="10" />
      </g>
      <Label x={330} y={198} at={2.6}>{l.fraudDb}</Label>
      {ROWS.map((y, i) => (
        <g key={y}>
          <g className="tk-a-in" style={d(2.65 + i * 0.08)}>
            <rect className="tk-sheet" x="448" y={y - 13} width="92" height="26" rx="8" />
            {i === MATCH && <rect className="tk-row-hi tk-a-fade" x="448" y={y - 13} width="92" height="26" rx="8" style={d(3.15)} />}
            <Glyph g={INST} x={464} y={y} s={0.52} cls="tk-ic tk-ic-m" />
            <rect className="tk-soft" x="478" y={y - 3} width="40" height="5" rx="2.5" />
          </g>
          <path className="tk-strike tk-a-draw" d={`M476 ${y}H522`} pathLength="1" style={d(3.05 + i * 0.08, { "--t": ".25s" })} />
          <Ok x={530} y={y} r={5} at={3.1 + i * 0.08} bad />
        </g>
      ))}

      {/* The result returns, and fraud detection grows */}
      <path className="tk-loop tk-a-fade" d="M448 240C400 310 270 300 236 250" style={d(3.6)} />
      <g className="tk-a-pop" style={d(3.9)}>
        <circle className="tk-pale" cx="220" cy="248" r="20" />
        <Glyph g={SHIELD} x={220} y={248} s={0.85} cls="tk-ic tk-ic-r" />
      </g>
      <Label x={220} y={286} at={4.05} red>{l.learns}</Label>
    </svg>
  );
}

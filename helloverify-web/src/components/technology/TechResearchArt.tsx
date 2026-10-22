/** The second pillar drawing on the `/technology` stage (`./TechPillars`).

    A magnifying glass over a certificate: this is the research. The glass
    finds two things, and only those two words are written on the board.

      0.2s  the certificate, then the glass settles on it
      1.1s  it reaches the authorised registrar, who confirms
      2.2s  it matches a fraudulent institution and voids it
      3.4s  that finding is kept: a checked card joins the file */
import { Logo } from "@/components/brand/Logo";
import { CAP, Glyph, INST, Label, Ok, PERSON, SHIELD, d, type TechArt } from "./TechPillarKit";

const LENS = { x: 248, y: 132 };

export function ResearchArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* The certificate under research */}
      <g className="tk-a-in" style={d(0.05)}>
        <rect className="tk-sheet" x="28" y="48" width="196" height="168" rx="16" />
        <circle className="tk-paperfill" cx="62" cy="86" r="16" />
        <Glyph g={CAP} x={62} y={86} s={0.62} />
        <rect className="tk-inkbar" x="88" y="76" width="108" height="7" rx="3.5" />
        <rect className="tk-soft" x="88" y="92" width="72" height="5" rx="2.5" />
        <rect className="tk-bar" x="46" y="122" width="150" height="6" rx="3" />
        <rect className="tk-bar" x="46" y="138" width="124" height="6" rx="3" />
        <rect className="tk-bar" x="46" y="154" width="136" height="6" rx="3" />
        <path className="tk-sign" d="M48 186c12-14 18-14 22-4s10 12 18-2 14-12 18 0" />
      </g>
      <path className="tk-scanl tk-a-scan" d="M40 122H210" style={d(0.7, { "--dy": "52px", "--t": ".8s" })} />

      {/* The research: a glass over the certificate */}
      <g className="tk-a-pop" style={d(0.35)}>
        <circle className="tk-sheet" cx={LENS.x} cy={LENS.y} r="62" />
        <circle className="tk-hi-ring" cx={LENS.x} cy={LENS.y} r="62" />
        <rect className="tk-inkbar" x={LENS.x - 28} y={LENS.y - 8} width="56" height="7" rx="3.5" />
        <rect className="tk-bar" x={LENS.x - 28} y={LENS.y + 8} width="40" height="5" rx="2.5" />
        <rect className="tk-inkbar" x="-4" y="-5" width="54" height="10" rx="5" transform={`translate(${LENS.x + 46} ${LENS.y + 46}) rotate(42)`} />
      </g>
      <g className="tk-a-pop" style={d(0.55)} transform={`translate(${LENS.x - 26} 268)`}>
        <g className="tk-uf">
          <Logo width={52} height={15} />
        </g>
      </g>
      <Label x={LENS.x} y={304} at={0.7}>{l.research}</Label>

      {/* It finds the right authorised contact */}
      <path className="tk-p-link tk-a-draw" d={`M${LENS.x + 48} ${LENS.y - 28}C340 70 390 58 430 72`} pathLength="1" style={d(1.15, { "--t": ".55s" })} />
      <g className="tk-a-in" style={d(1.4)}>
        <rect className="tk-sheet" x="404" y="28" width="132" height="88" rx="14" />
        <circle className="tk-paperfill" cx="440" cy="68" r="18" />
        <Glyph g={PERSON} x={440} y={68} s={0.72} />
        <Glyph g={SHIELD} x={500} y={52} s={0.55} cls="tk-ic tk-ic-r" />
      </g>
      <Ok x={516} y={48} r={8} at={1.85} />

      {/* It matches a fraudulent institution */}
      <path className="tk-p-link tk-a-draw" d={`M${LENS.x + 40} ${LENS.y + 46}C330 230 360 236 400 248`} pathLength="1" style={d(2.2, { "--t": ".55s" })} />
      <g className="tk-a-in" style={d(2.45)}>
        <rect className="tk-sheet" x="400" y="220" width="136" height="72" rx="14" />
        <rect className="tk-flag tk-a-fade" x="400" y="220" width="136" height="72" rx="14" style={d(2.8)} />
        <rect className="tk-paperfill" x="414" y="234" width="36" height="28" rx="8" />
        <Glyph g={INST} x={432} y={248} s={0.62} cls="tk-ic tk-ic-m" />
        <rect className="tk-inkbar" x="460" y="240" width="58" height="6" rx="3" />
        <rect className="tk-soft" x="460" y="254" width="40" height="5" rx="2.5" />
      </g>
      <g className="tk-a-pop" style={d(2.9)}>
        <circle className="tk-dot-red" cx="468" cy="256" r="16" />
        <path className="tk-tick-white" d="M460 248l16 16M476 248L460 264" />
      </g>
      <Label x={468} y={310} at={3} red>{l.fraud}</Label>

      {/* The finding is kept */}
      <g className="tk-a-drop" style={d(3.5)}>
        <rect className="tk-sheet" x="28" y="250" width="150" height="64" rx="12" />
        <rect className="tk-paperfill" x="40" y="264" width="28" height="28" rx="8" />
        <Glyph g={CAP} x={54} y={278} s={0.55} />
        <rect className="tk-inkbar" x="76" y="270" width="72" height="6" rx="3" />
        <rect className="tk-soft" x="76" y="284" width="48" height="5" rx="2.5" />
      </g>
      <Ok x={158} y={262} r={8} at={3.8} />
    </svg>
  );
}

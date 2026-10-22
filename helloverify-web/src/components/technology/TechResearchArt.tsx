/** The second pillar drawing on the `/technology` stage (`./TechPillars`).

    A scene, not a diagram. One certificate is taken to the institution that
    issued it; the person there confirms. Along the shelf, the institutions
    we already know, one of them void. The confirmed check is then filed,
    and the shelf is one card longer.

      0.2s  the certificate and the institution
      0.8s  the line reaches the person at the door, who confirms
      1.8s  the shelf of institutions, and the fraudulent one is voided
      3.2s  this verification is filed, and HelloVerify seals the certificate */
import { Logo } from "@/components/brand/Logo";
import { CAP, Glyph, INST, Label, Ok, PERSON, d, type TechArt } from "./TechPillarKit";

const SHELF = [0, 1, 2, 3, 4];
const FAKE = 2;

function Institution({ x, voided }: { x: number; voided?: boolean }) {
  return (
    <g transform={`translate(${x} 252)`}>
      <rect className="tk-sheet" width="70" height="78" rx="10" />
      <rect className="tk-paperfill" x="16" y="12" width="38" height="28" rx="8" />
      <Glyph g={INST} x={35} y={26} s={0.7} cls="tk-ic tk-ic-m" />
      <rect className="tk-inkbar" x="14" y="48" width="42" height="5" rx="2.5" />
      <rect className="tk-soft" x="20" y="60" width="30" height="4" rx="2" />
      {voided && (
        <>
          <rect className="tk-flag tk-a-fade" width="70" height="78" rx="10" style={d(2.5)} />
          <g className="tk-a-pop" style={d(2.6)}>
            <circle className="tk-dot-red" cx="35" cy="40" r="14" />
            <path className="tk-tick-white" d="M28 33l14 14M42 33L28 47" />
          </g>
        </>
      )}
    </g>
  );
}

export function ResearchArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* The certificate being researched */}
      <g className="tk-a-in" style={d(0.1)}>
        <rect className="tk-sheet" x="28" y="24" width="180" height="200" rx="16" />
        <circle className="tk-paperfill" cx="64" cy="62" r="18" />
        <Glyph g={CAP} x={64} y={62} s={0.7} />
        <rect className="tk-inkbar" x="94" y="50" width="88" height="7" rx="3.5" />
        <rect className="tk-soft" x="94" y="66" width="56" height="5" rx="2.5" />
        <rect className="tk-bar" x="46" y="100" width="144" height="6" rx="3" />
        <rect className="tk-bar" x="46" y="116" width="120" height="6" rx="3" />
        <rect className="tk-bar" x="46" y="132" width="132" height="6" rx="3" />
        <path className="tk-sign" d="M48 168c10-12 16-12 20-4s8 10 16-2 12-10 16 0" />
      </g>

      {/* The institution that actually issued it */}
      <g className="tk-a-in" style={d(0.25)}>
        <rect className="tk-sheet" x="352" y="24" width="180" height="200" rx="16" />
        <path className="tk-inkbar" d="M392 92 442 64l50 28z" />
        <rect className="tk-paperfill" x="386" y="92" width="112" height="96" rx="4" />
        {[404, 442, 480].map((x) => (
          <rect key={x} className="tk-sheet" x={x} y="104" width="12" height="68" rx="2" />
        ))}
        <path className="tk-sheet" d="M424 172v16h36v-16a18 18 0 0 0-36 0z" />
      </g>
      <path className="tk-p-link tk-a-draw" d="M196 120C250 96 320 88 400 130" pathLength="1" style={d(0.8, { "--t": ".7s" })} />
      <path className="tk-comet tk-a-comet" d="M196 120C250 96 320 88 400 130" pathLength="1" style={d(0.8, { "--t": ".7s" })} />

      {/* The authorised person at the door */}
      <g className="tk-a-pop" style={d(1.35)}>
        <circle className="tk-node" cx="442" cy="150" r="20" />
        <Glyph g={PERSON} x={442} y={150} s={0.8} />
      </g>
      <Label x={442} y={196} at={1.5} red>{l.registrar}</Label>
      <Ok x={176} y={146} r={10} at={1.7} />

      {/* Institutions we already know. One of them is fraudulent. */}
      {SHELF.map((i) => (
        <g key={i} className="tk-a-in" style={d(2 + i * 0.08)} transform={i === FAKE ? "translate(0 -16)" : undefined}>
          <Institution x={28 + i * 86} voided={i === FAKE} />
        </g>
      ))}

      {/* This verification is filed, and the certificate is sealed */}
      <g className="tk-a-drop" style={d(3.2)}>
        <Institution x={458} />
        <g transform="translate(493 278)">
          <circle className="tk-dot-red" r="8" />
          <path className="tk-tick-white" d="M-3.4 0.2l2.2 2.2 4.4-4.6" />
        </g>
      </g>
      <g className="tk-a-pop" style={d(3.6)} transform="translate(46 188)">
        <g className="tk-uf">
          <Logo width={64} height={19} />
        </g>
      </g>
    </svg>
  );
}

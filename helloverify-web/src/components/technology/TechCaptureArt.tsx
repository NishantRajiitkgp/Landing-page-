/** The first pillar drawing on the `/technology` stage (`./TechPillars`).

      0s    the applicant uploads a passport, a degree and a payslip from a
            phone, as they come: tilted and mixed
      0.9s  AI captures: it frames the key detail on every document
      1.7s  it structures: each detail runs into its own row of one record
      2.9s  it validates every row; the record is verification-ready, and
            the crossed-out hand says nobody typed any of it */
import { Logo } from "@/components/brand/Logo";
import { CAL, CAP, Glyph, HAND, HASH, Label, Ok, PERSON, UPLOAD, d, type TechArt } from "./TechPillarKit";

const DOCS = [
  { t: "translate(128 50) rotate(-7)", frame: [38, 10, 58, 24], at: 0.2 },
  { t: "translate(150 146) rotate(5)", frame: [36, 11, 60, 24], at: 0.32 },
  { t: "translate(128 248) rotate(-4)", frame: [64, 20, 36, 34], at: 0.44 },
];
const ROWS = [
  { y: 124, g: PERSON, w: 72 },
  { y: 164, g: HASH, w: 90 },
  { y: 204, g: CAP, w: 64 },
  { y: 244, g: CAL, w: 40 },
];

function DocFace({ k }: { k: number }) {
  return (
    <>
      <rect className="tk-sheet" width="104" height="66" rx="10" />
      {k === 0 && (
        <>
          <rect className="tk-paperfill" x="10" y="10" width="24" height="30" rx="5" />
          <Glyph g={PERSON} x={22} y={25} s={0.55} cls="tk-ic tk-ic-m" />
          <rect className="tk-inkbar" x="42" y="14" width="48" height="6" rx="3" />
          <rect className="tk-soft" x="42" y="27" width="34" height="5" rx="2.5" />
          <rect className="tk-inkbar tk-faint" x="10" y="50" width="84" height="4" rx="2" />
        </>
      )}
      {k === 1 && (
        <>
          <circle className="tk-paperfill" cx="22" cy="22" r="11" />
          <Glyph g={CAP} x={22} y={22} s={0.55} cls="tk-ic tk-ic-m" />
          <rect className="tk-inkbar" x="40" y="15" width="52" height="6" rx="3" />
          <rect className="tk-soft" x="40" y="28" width="40" height="5" rx="2.5" />
          <rect className="tk-bar" x="12" y="46" width="44" height="5" rx="2.5" />
          <path className="tk-sign" d="M66 50c4-7 7-7 9-2s4 5 7-1 5-5 7 0" />
        </>
      )}
      {k === 2 && (
        <>
          <rect className="tk-red" x="10" y="10" width="44" height="6" rx="3" />
          {[24, 36, 48].map((y, i) => (
            <g key={y}>
              <rect className="tk-bar" x="10" y={y} width={[46, 38, 42][i]} height="5" rx="2.5" />
              <rect className="tk-inkbar" x="70" y={y} width="24" height="5" rx="2.5" />
            </g>
          ))}
        </>
      )}
    </>
  );
}

export function CaptureArt({ l }: { l: TechArt }) {
  return (
    <svg className="tk-art tk-mirror" viewBox="0 0 560 360" fill="none">
      {/* Uploaded from a phone */}
      <g className="tk-a-in" style={d(0)}>
        <rect className="tk-phone" x="30" y="118" width="64" height="122" rx="13" />
        <rect className="tk-soft" x="52" y="226" width="20" height="4" rx="2" />
      </g>
      <g className="tk-a-pop" style={d(0.1)}>
        <circle className="tk-pale" cx="62" cy="172" r="17" />
        <Glyph g={UPLOAD} x={62} y={172} s={0.7} cls="tk-ic tk-ic-r" />
      </g>
      <Label x={62} y={260} at={0.2}>{l.uploaded}</Label>
      {["M94 150C110 150 112 92 128 88", "M94 178H150", "M94 206C110 206 112 270 128 278"].map((p, i) => (
        <path key={p} className="tk-dash tk-a-fade" d={p} style={d(0.15 + i * 0.1)} />
      ))}
      {DOCS.map((doc, k) => (
        <g key={k} className="tk-a-drop" style={d(doc.at)}>
          <g transform={doc.t}>
            <DocFace k={k} />
          </g>
        </g>
      ))}

      {/* AI captures the key detail on each */}
      {["M234 88C250 88 250 181 262 181", "M254 182H262", "M232 278C250 278 250 181 262 181"].map((p, i) => (
        <path key={p} className="tk-edge2 tk-a-draw" d={p} pathLength="1" style={d(0.95 + i * 0.05)} />
      ))}
      {/* The wordmark replaces the star, centred on the same spot. */}
      <g className="tk-a-pop" style={d(0.9)} transform="translate(312 181)">
        <g className="tk-uf">
          <rect className="tk-sheet" x="-48" y="-18" width="96" height="36" rx="12" />
          <g transform="translate(-44 -13)">
            <Logo width={88} height={26} />
          </g>
        </g>
      </g>
      {DOCS.map((doc, k) => {
        const [x, y, w, h] = doc.frame;
        return (
          <g key={k} transform={doc.t}>
            <rect className="tk-fbox tk-a-draw" x={x} y={y} width={w} height={h} rx="4" pathLength="1" style={d(1.1 + k * 0.15, { "--t": ".3s" })} />
          </g>
        );
      })}

      {/* …structures it into one record */}
      <g className="tk-a-in" style={d(1.6)}>
        <rect className="tk-sheet" x="358" y="46" width="180" height="262" rx="16" />
        <circle className="tk-paperfill" cx="384" cy="74" r="14" />
        <Glyph g={PERSON} x={384} y={74} s={0.6} />
        <rect className="tk-inkbar" x="406" y="66" width="70" height="6" rx="3" />
        <rect className="tk-soft" x="406" y="78" width="44" height="5" rx="2.5" />
        <path className="tk-hair" d="M358 98H538" />
        {ROWS.map((r) => (
          <g key={r.y}>
            <rect className="tk-paperfill" x="370" y={r.y - 14} width="156" height="28" rx="8" />
            <Glyph g={r.g} x={386} y={r.y} s={0.55} />
            <rect className="tk-soft" x="402" y={r.y - 3} width={r.w + 6} height="6" rx="3" />
          </g>
        ))}
        <path className="tk-track" d="M372 286H524" />
      </g>
      {ROWS.map((r, i) => {
        const p = `M360 181C366 181 368 ${r.y} 370 ${r.y}`;
        return (
          <g key={r.y}>
            <path className="tk-wire tk-a-draw" d={p} pathLength="1" style={d(1.9 + i * 0.1)} />
            <path className="tk-comet tk-a-comet" d={p} pathLength="1" style={d(1.9 + i * 0.1)} />
            <path className="tk-val tk-a-draw" d={`M405 ${r.y}h${r.w}`} pathLength="1" style={d(2.25 + i * 0.12, { "--t": ".35s" })} />
          </g>
        );
      })}

      {/* …validates every row: verification-ready, no manual entry */}
      {ROWS.map((r, i) => (
        <Ok key={r.y} x={512} y={r.y} r={7} at={2.9 + i * 0.12} />
      ))}
      <path className="tk-ready tk-a-draw" d="M372 286H524" pathLength="1" style={d(3.4, { "--t": ".5s" })} />
      <Ok x={514} y={74} r={8} at={3.5} />
      <Label x={448} y={330} at={3.6} red>{l.ready}</Label>
      <g className="tk-a-pop" style={d(3.7)}>
        <circle className="tk-node" cx="297" cy="290" r="19" />
        <Glyph g={HAND} x={297} y={290} s={0.7} cls="tk-ic tk-ic-m" />
      </g>
      <path className="tk-strike tk-a-draw" d="M284 277 310 303" pathLength="1" style={d(3.9, { "--t": ".25s" })} />
      <Label x={297} y={330} at={4}>{l.manual}</Label>
    </svg>
  );
}

/** The two specimen documents and the verification stamp that the v2
    "How we know" case file draws (`./HowWeKnowStage`). Split out only to keep
    the stage under the 300-line cap; imported by that client island, so it
    renders on both sides like `HeroPrint`.

    Everything here is a drawing of a printed document, so the fills are
    literal SVG presentation attributes — the artwork exemption
    `hv/no-color-literal` gives. Geometry and wording are the canvas's
    (`scripts/assemble_how2.py`: `licence()`, `degree()`, `SEAL`). */
import type { SectionsCopy } from "@/lib/copy/sections";
import { closedPolyline, polarRing } from "@/lib/svgPath";

type Routes = SectionsCopy["howItWorks"]["v2"]["routes"];

/** 8 vertices a lobe, relative moves on the 0.1 grid (`lib/svgPath.ts`). */
function ring(cx: number, cy: number, R: number, A: number, n: number): string {
  return closedPolyline(polarRing(n * 8, (a) => R + A * Math.sin(n * a), cx, cy));
}

/** One period of the canvas's engraved wave lines (`waves()`), as a pattern
 *  tile `period` wide and `gap` tall. The canvas drew every line out in full
 *  (≈20 KB of path for the licence); tiled, it is the same drawing. */
function Waves({ id, gap, amp, period, stroke, width }: { id: string; gap: number; amp: number; period: number; stroke: string; width: number }) {
  const h = period / 2;
  return (
    <pattern id={id} width={period} height={gap} y={gap / 2} patternUnits="userSpaceOnUse">
      <path d={`M0 ${gap / 2} q${period / 4} ${-amp} ${h} 0 q${period / 4} ${amp} ${h} 0`} fill="none" stroke={stroke} strokeWidth={width} />
    </pattern>
  );
}

const MONO = "geistMono, SF Mono, monospace";
const SERIF = "newsreader, Georgia, serif";

export function Licence({ d }: { d: Routes["licence"]["doc"] }) {
  return (
    <svg className="hw2-doc-svg" viewBox="0 0 470 300" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hwl-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3EEE2" />
          <stop offset="1" stopColor="#E6DDCA" />
        </linearGradient>
        <Waves id="hwl-wave" gap={7} amp={2.2} period={26} stroke="#D9CFBA" width={0.6} />
        <pattern id="hwl-hatch" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 1.5h3" stroke="#3D3B35" strokeWidth="0.9" />
        </pattern>
        <clipPath id="hwl-clip">
          <rect x="26" y="74" width="112" height="140" rx="6" />
        </clipPath>
      </defs>
      <rect x="0.5" y="0.5" width="469" height="299" rx="18" fill="url(#hwl-paper)" stroke="#CFC5B0" />
      <rect x="0.5" y="0.5" width="469" height="299" rx="18" fill="url(#hwl-wave)" />
      <path d={ring(380, 150, 70, 6, 36) + ring(380, 150, 50, 9, 24)} fill="none" stroke="#CBBFA6" strokeWidth="0.6" />
      <rect x="12" y="12" width="446" height="276" rx="11" fill="none" stroke="#C8BCA3" strokeWidth="0.8" strokeDasharray="1 2" />
      <text x="26" y="44" fontFamily={MONO} fontSize="11" letterSpacing="2.6" fill="#3D3B35">{d.title}</text>
      <text x="444" y="44" textAnchor="end" fontFamily={MONO} fontSize="10" letterSpacing="2" fill="#6F6B62">{d.specimen}</text>
      <text x="26" y="58" fontFamily={MONO} fontSize="5.2" letterSpacing="1.4" fill="#8B8170">{d.micro}</text>
      <g clipPath="url(#hwl-clip)">
        <rect x="26" y="74" width="112" height="140" fill="#E7E0CF" />
        <path d="M82 96 c15 0 25 12 25 28 c0 13 -6 23 -14 28 l1.5 9 c20 4 37 15 37 44 v9 h-99 v-9 c0 -29 17 -40 37 -44 l1.5 -9 c-8 -5 -14 -15 -14 -28 c0 -16 10 -28 25 -28 z" fill="url(#hwl-hatch)" stroke="#3D3B35" strokeWidth="1.1" />
        <path d="M66 118 c4 -10 24 -12 32 -2" fill="none" stroke="#3D3B35" strokeWidth="0.8" />
      </g>
      <g fontFamily={MONO} fill="#15140F">
        {([d.f1, d.f2, d.f3, d.f4] as const).map((f, i) => (
          <g key={f.l}>
            <text x="160" y={88 + i * 42} fontSize="7" letterSpacing="1.4" fill="#8B8170">{f.l}</text>
            <text x="160" y={104 + i * 42} fontSize="15" letterSpacing="1">{f.v}</text>
          </g>
        ))}
      </g>
      <path d="M30 262 C 50 244, 64 270, 82 254 S 110 246, 126 258" fill="none" stroke="#3D3B35" strokeWidth="1.2" />
      <text x="26" y="280" fontFamily={MONO} fontSize="6" letterSpacing="1.2" fill="#8B8170">{d.sign}</text>
      <circle cx="404" cy="244" r="26" fill="none" stroke="#C9D6CF" strokeWidth="14" opacity="0.9" />
    </svg>
  );
}

export function Degree({ d }: { d: Routes["degree"]["doc"] }) {
  return (
    <svg className="hw2-doc-svg" viewBox="0 0 470 300" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hwd-paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7F3EA" />
          <stop offset="1" stopColor="#EAE2D1" />
        </linearGradient>
        <Waves id="hwd-wave" gap={8} amp={1.8} period={30} stroke="#E0D7C4" width={0.5} />
      </defs>
      <rect x="0.5" y="0.5" width="469" height="299" rx="4" fill="url(#hwd-paper)" stroke="#CFC5B0" />
      <rect x="0.5" y="0.5" width="469" height="299" rx="4" fill="url(#hwd-wave)" />
      <path d={ring(235, 150, 110, 8, 48) + ring(235, 150, 86, 12, 30)} fill="none" stroke="#D4C9B1" strokeWidth="0.6" />
      <rect x="10" y="10" width="450" height="280" fill="none" stroke="#BFB297" strokeWidth="1.2" />
      <rect x="16" y="16" width="438" height="268" fill="none" stroke="#CFC5B0" strokeWidth="0.6" />
      <path d="M235 30 l16 6 v14 c0 10 -8 17 -16 20 c-8 -3 -16 -10 -16 -20 v-14 z" fill="none" stroke="#6F6B62" strokeWidth="1.3" />
      <path d="M235 36 v28 M225 48 h20" stroke="#6F6B62" strokeWidth="1" />
      <text x="444" y="36" textAnchor="end" fontFamily={MONO} fontSize="9" letterSpacing="2" fill="#6F6B62">{d.specimen}</text>
      <text x="235" y="92" textAnchor="middle" fontFamily={SERIF} fontSize="11" letterSpacing="3" fill="#4A4437">{d.issuer}</text>
      <text x="235" y="112" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="10" fill="#8B8170">{d.certify}</text>
      <text x="235" y="140" textAnchor="middle" fontFamily={SERIF} fontSize="24" fill="#2B271F">{d.f1.v}</text>
      <text x="235" y="166" textAnchor="middle" fontFamily={SERIF} fontSize="13" fill="#4A4437">{d.f2.v}</text>
      <text x="235" y="186" textAnchor="middle" fontFamily={MONO} fontSize="10" letterSpacing="1.4" fill="#4A4437">{d.f3.v}</text>
      <text x="235" y="204" textAnchor="middle" fontFamily={MONO} fontSize="10" letterSpacing="1.4" fill="#4A4437">{d.f4.v}</text>
      <path d="M60 250 C 80 232, 94 258, 112 242 S 140 236, 156 246" fill="none" stroke="#3D3B35" strokeWidth="1.2" />
      <path d="M52 262 H176" stroke="#BFB297" strokeWidth="0.8" />
      <text x="114" y="276" textAnchor="middle" fontFamily={MONO} fontSize="6" letterSpacing="1.2" fill="#8B8170">{d.sign}</text>
      <circle cx="392" cy="250" r="24" fill="none" stroke="#C9D6CF" strokeWidth="14" opacity="0.9" />
    </svg>
  );
}

export function Seal({ id, ring: text }: { id: string; ring: string }) {
  return (
    <svg className="hw2-seal" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <g fill="none" stroke="#1B6B4A">
        <circle cx="60" cy="60" r="55" strokeWidth="2.6" />
        <circle cx="60" cy="60" r="49" strokeWidth="0.9" />
        <text fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="7.4" letterSpacing="1.4">
          <textPath href={`#${id}`} textLength="272" lengthAdjust="spacing">{`${text} `}</textPath>
        </text>
        <path d="M44 60 l10 10 l22 -23" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

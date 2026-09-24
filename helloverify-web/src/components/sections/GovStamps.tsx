/** The four ink stamps on the dossier photographs (`sections/GovDossiers.tsx`),
    one shape per authority: a round PSV seal for health, a rectangular
    pre-screening chop for immigration, an octagon for accreditation, an oval
    for business and trade. All roughened by the one `#gv-ink` filter the
    band declares once. Decorative (`aria-hidden`); the words are copy.

    The `#1B6B4A` on the elements is `--green` written as an SVG presentation
    attribute — artwork, the exemption `hv/no-color-literal` makes for SVG,
    and the same way `sections/Hero.tsx` draws its seal. */
import { octagon } from "@/lib/govArt";

const MONO = "geistMono, SF Mono, Menlo, monospace";
const OCT_OUTER = octagon(90);
const OCT_INNER = octagon(80);

export type StampWords = { big: string; small: string };

export function StampRound({ big, small }: StampWords) {
  return (
    <svg className="gv-stamp" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <path id="gv-arc-r" d="M100 100 m-70 0 a70 70 0 1 1 140 0 a70 70 0 1 1 -140 0" />
      </defs>
      <g filter="url(#gv-ink)" fill="none" stroke="#1B6B4A">
        <circle cx="100" cy="100" r="92" strokeWidth="3.4" />
        <circle cx="100" cy="100" r="84" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="56" strokeWidth="1.2" />
        <text fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="11" fontWeight="500" letterSpacing="1.3">
          <textPath href="#gv-arc-r" textLength="434" lengthAdjust="spacing">{`${small} `}</textPath>
        </text>
        <path d="M76 94 l15 15 l33 -34" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="100" y="134" textAnchor="middle" fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="10" letterSpacing="1.6">{big}</text>
      </g>
    </svg>
  );
}

export function StampRect({ big, small }: StampWords) {
  return (
    <svg className="gv-stamp gv-stamp-wide" viewBox="0 0 240 120" aria-hidden="true" focusable="false">
      <g filter="url(#gv-ink)" fill="none" stroke="#1B6B4A">
        <rect x="4" y="4" width="232" height="112" rx="10" strokeWidth="3.4" />
        <rect x="12" y="12" width="216" height="96" rx="5" strokeWidth="1.2" />
        <path d="M30 60 l10 10 l20 -22" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="72" y="66" fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="18.5" fontWeight="500" letterSpacing="1.2">{big}</text>
        <text x="72" y="86" fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="8.6" letterSpacing="1.2">{small}</text>
        <path d="M24 34 H216" strokeWidth="1" strokeDasharray="3 4" />
      </g>
    </svg>
  );
}

export function StampOct({ big, small }: StampWords) {
  return (
    <svg className="gv-stamp" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <g filter="url(#gv-ink)" fill="none" stroke="#1B6B4A">
        <polygon points={OCT_OUTER} strokeWidth="3.4" />
        <polygon points={OCT_INNER} strokeWidth="1.2" />
        <path d="M78 74 l14 14 l30 -31" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="100" y="122" textAnchor="middle" fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="14.5" fontWeight="500" letterSpacing="0.8">{big}</text>
        <text x="100" y="141" textAnchor="middle" fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="8.4" letterSpacing="1.2">{small}</text>
      </g>
    </svg>
  );
}

export function StampOval({ big, small }: StampWords) {
  return (
    <svg className="gv-stamp gv-stamp-wide" viewBox="0 0 240 140" aria-hidden="true" focusable="false">
      <defs>
        <path id="gv-arc-o" d="M30 70 a90 52 0 1 1 180 0" />
      </defs>
      <g filter="url(#gv-ink)" fill="none" stroke="#1B6B4A">
        <ellipse cx="120" cy="70" rx="114" ry="64" strokeWidth="3.4" />
        <ellipse cx="120" cy="70" rx="104" ry="55" strokeWidth="1.2" />
        <text fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="9.5" letterSpacing="1.6">
          <textPath href="#gv-arc-o" startOffset="50%" textAnchor="middle">{small}</textPath>
        </text>
        <text x="120" y="86" textAnchor="middle" fill="#1B6B4A" stroke="none" fontFamily={MONO} fontSize="21" fontWeight="500" letterSpacing="2">{big}</text>
        <path d="M104 104 l8 8 l16 -17" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** The ink roughening: displacement for the wobble, a noise mask for the
 *  voids an uneven stamp leaves. The hero's `#hv-ink`, with its own id. */
export function InkFilter() {
  return (
    <svg width="0" height="0" className="gv-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="gv-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={3} seed={9} result="n2" />
          <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.45" result="holes" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

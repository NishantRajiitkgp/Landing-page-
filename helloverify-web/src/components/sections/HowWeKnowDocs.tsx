/** The two specimen documents and the verification stamp that the v2
    "How we know" case file draws (`./HowWeKnowStage`). Split out only to keep
    the stage under the 300-line cap; imported by that client island, so it
    renders on both sides like `HeroPrint`.

    THE SPECIMENS ARE SCANS (29 Sep 2026). The canvas drew both documents in
    SVG; they read as illustrations, so they are now synthetic scans — a
    Karnataka driving licence card and a Kerala nursing degree, fictional
    holders and issuers, each marked SPECIMEN on the document itself. The
    licence is cut out on a transparent 470:300 canvas so the stage's drop
    shadow follows the card. The seal stays drawn: its fills are literal SVG
    presentation attributes, the artwork exemption `hv/no-color-literal`
    gives. */
import Image from "next/image";

const MONO = "geistMono, SF Mono, monospace";

/** 470px on desktop; the stage is the full column on a phone. */
const SIZES_SPECIMEN = "(max-width: 1080px) 92vw, 470px";
const SPECIMEN = {
  licence: "/img/docs/hw-licence-ka.webp",
  degree: "/img/docs/hw-degree-kl.jpg",
} as const;

export function Specimen({ route }: { route: keyof typeof SPECIMEN }) {
  return <Image className="hw2-doc-img" src={SPECIMEN[route]} alt="" fill sizes={SIZES_SPECIMEN} />;
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

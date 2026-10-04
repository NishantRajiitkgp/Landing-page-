/** 03 · AI Powered Trust Platform — chapter three (`./GovWhy`).

    Same kit and 12 s beat as `./GovWhyTrust`. 01 laid the layer under a
    nation of people; 02 was the first door. 03 is the same layer taking
    organisations: three private parties on the left, the public
    institution on the right, HelloVerify and its AI in the soil between
    them. Each arrives unknown; a check drops through the AI and they
    light. Then a current runs private → public through the pill — one
    ecosystem. Clock: `govwhy.css` "03 · PLATFORM". At rest: all four
    lit, the current live. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { Tick } from "./GovWhyArt";

type V = SectionsCopy["govWhy"]["viz"];

const UP = [
  "M136 120V112Q136 108 132 108H54Q50 108 50 104V100",
  "M148 120V110Q148 106 144 106H109Q105 106 105 102V100",
  "M160 120V100",
  "M184 120V112Q184 108 188 108H266Q270 108 270 104V100",
];
const UNI = "M50 134H114M206 134H270";
const ASK = ["gwt-d8", "gwt-d26", "gwt-d43", "gwt-d65"];
const DOWN = ["gwt-d9", "gwt-d27", "gwt-d52", "gwt-d75"];
const UP_PK = ["gwt-d18", "gwt-d36", "gwt-d60", "gwt-d85"];
const LIT = ["gwt-d20", "gwt-d38", "gwt-d62", "gwt-d86"];
const PING = ["gwt-d13", "gwt-d32", "gwt-d56", "gwt-d80"];

const ICO = [
  () => <path d="M-5.5 7V-7h8v14M2.5-2h4V7M-8 7h16M-3-4h3M-3-1h3M-3 2h3" />,
  () => (
    <>
      <path d="M-8 3.5v-8h9.5v8M1.5-1.5h3.6L8 1.5v2H1.5M-8 3.5h1.7M-2.7 3.5h4.4" />
      <circle cx="-4.5" cy="4.6" r="1.8" />
      <circle cx="4.4" cy="4.6" r="1.8" />
    </>
  ),
  () => <path d="M-8.5 3.5h17M-6.5 3.5V2a6.5 6.5 0 0 1 13 0v1.5M-1.6-4.3V3.5M1.6-4.3V3.5" />,
  () => <path d="M-8.5-3L0-8l8.5 5zM-6-1v6M-2-1v6M2-1v6M6-1v6M-8.5 7h17" />,
];

const PARTY = [
  { x: 50, cls: "gwa-a", ico: ICO[0] },
  { x: 105, cls: "gwa-b", ico: ICO[1] },
  { x: 160, cls: "gwa-c", ico: ICO[2] },
  { x: 270, cls: "gwa-d", ico: ICO[3] },
];

function Token({ i, lit }: { i: number; lit?: boolean }) {
  const p = PARTY[i];
  return (
    <g className={lit ? "gwa-tok-on" : "gwa-tok"}>
      <circle r="14" />
      <g className="gw-ico" transform="scale(.85)">{p.ico()}</g>
    </g>
  );
}

export function ArtPlatform({ core, nodes, layer, sides }: {
  core: string;
  nodes: V["nodes"];
  layer: string;
  sides: V["sides"];
}) {
  const n = Object.values(nodes);
  return (
    <svg className="gwt gwa" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gwa-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path className="gwt-hatch" d="M0 0V7" />
        </pattern>
        <radialGradient id="gwa-glow">
          <stop offset="0" className="gwt-glow-a" />
          <stop offset="1" className="gwt-glow-b" />
        </radialGradient>
      </defs>

      <rect className="gwt-rock" x="-200" y="168" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="68" />
      <rect x="-200" y="100" width="720" height="68" fill="url(#gwa-soil)" />
      <path className="gwt-strata" d="M-200 168H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <circle cx="160" cy="134" r="78" fill="url(#gwa-glow)" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{layer}</text>
      <text className="gwt-mono" x="78" y="16" textAnchor="middle">{sides.priv}</text>
      <text className="gwt-mono" x="270" y="16" textAnchor="middle">{sides.pub}</text>
      <path className="gwa-split" d="M204 20V94" />

      {UP.map((d) => (
        <g key={d}>
          <path className="gwt-pipe" pathLength={1} d={d} />
          <path className="gwt-pipe-in" pathLength={1} d={d} />
        </g>
      ))}
      <path className="gwt-pipe" pathLength={1} d={UNI} />
      <path className="gwt-pipe-in" pathLength={1} d={UNI} />
      {UP.map((d, i) => (
        <g key={`l${d}`} className={`gwa-on-${i}`}>
          <path className="gwt-live" d={d} />
        </g>
      ))}
      <g className="gwa-uni">
        <path className="gwt-live" d={UNI} />
        <path className="gwt-rush" d={UNI} />
      </g>
      <g className="gwt-fin">
        <path className="gwt-glowline" d="M-200 100H520" />
        <path className="gwt-rush" d={UNI} />
      </g>

      {UP.map((d, i) => (
        <g key={`p${d}`}>
          <path className={`gwt-pk gwt-rev ${DOWN[i]}`} pathLength={1} d={d} />
          <path className={`gwt-pk ${UP_PK[i]}`} pathLength={1} d={d} />
        </g>
      ))}
      <path className="gwt-pk gwa-u-pk gwt-d88" pathLength={1} d="M50 134H270" />

      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      {PING.map((d) => (
        <rect key={d} className={`gwt-ring ${d}`} x="114" y="120" width="92" height="28" rx="14" />
      ))}

      <g className="gwa-ai">
        <title>{core}</title>
        <path className="gwa-hex" d="M226 118l14 8v16l-14 8-14-8v-16z" />
        <text className="gwa-ai-t" x="226" y="137" textAnchor="middle">{core}</text>
      </g>
      {PING.map((d) => (
        <path key={`r${d}`} className={`gwa-hex-r ${d}`} d="M226 118l14 8v16l-14 8-14-8v-16z" />
      ))}

      {PARTY.map((p, i) => (
        <g key={p.x} transform={`translate(${p.x} 78)`}>
          <title>{n[i]}</title>
          <g className={p.cls}>
            <Token i={i} />
          </g>
          <g className={`gwa-on-${i}`}>
            <Token i={i} lit />
            <g className={`gwt-pop ${LIT[i]}`}>
              <Tick x={12} y={-10} />
            </g>
          </g>
          <g className={`gwa-q ${ASK[i]}`} transform="translate(12 -10)">
            <circle r="5.5" />
            <text y="2.5" textAnchor="middle">?</text>
          </g>
        </g>
      ))}
    </svg>
  );
}

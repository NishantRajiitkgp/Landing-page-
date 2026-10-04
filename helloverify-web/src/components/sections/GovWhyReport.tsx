/** 06 · Evidence-Backed Reports — the last chapter (`./GovWhy`).

    Same kit, same 12 s beat. Everything the film sent down through
    HelloVerify comes back up as one document. Three proofs sit in the
    rock — the remark, the artefact, the trail. Each one fires into the
    layer, and a line writes on the report above the ground. When the
    trail is complete the stamp hits: VERIFIED. Clock: `govwhy.css`
    "06 · REPORT". At rest: the report is full, the stamp is down, and
    every proof is still wired through the layer. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { Tick } from "./GovWhyArt";

type V = SectionsCopy["govWhy"]["viz"];

/** Into the pill, then one way out to the sheet. */
const FEEDS = [
  "M58 175V160H146V148",
  "M160 175V148",
  "M262 175V160H174V148",
];
const UP = "M160 120V76";

function Remark() {
  return <path d="M-6.2-4.2h12.4v6.6H-1.2l-2.6 2.4v-2.4h-2.4zM-3.4-1.4h6.6M-3.4.6h4" />;
}
function Artefact() {
  return (
    <>
      <path d="M-4.6-6h6.4l2.6 2.6V6h-9zM1.8-6v2.6h2.6M-2.4-2.2h3.4" />
      <circle cx=".2" cy="2.2" r="1.8" />
    </>
  );
}
function Trail() {
  return (
    <>
      <path d="M-3.6-5.2v10.4M-.6-5.2h5.6M-.6 0h3.8M-.6 5.2h4.8" />
      <circle cx="-3.6" cy="-5.2" r="1.35" />
      <circle cx="-3.6" cy="0" r="1.35" />
      <circle cx="-3.6" cy="5.2" r="1.35" />
    </>
  );
}
const ICONS = [Artefact, Remark, Trail];

export function ArtReport({ report, stamp, proofs, layer }: {
  report: V["report"];
  stamp: string;
  proofs: V["proofs"];
  layer: string;
}) {
  const seals = [
    { x: 58, t: proofs.p2, line: report.r1 },
    { x: 160, t: proofs.p1, line: report.r3 },
    { x: 262, t: proofs.p3, line: report.r2 },
  ];
  const pipes = [...FEEDS, UP];
  return (
    <svg className="gwt gwr" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gwr-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path className="gwt-hatch" d="M0 0V7" />
        </pattern>
        <radialGradient id="gwr-glow">
          <stop offset="0" className="gwt-glow-a" />
          <stop offset="1" className="gwt-glow-b" />
        </radialGradient>
      </defs>

      <rect className="gwt-rock" x="-200" y="168" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="68" />
      <rect x="-200" y="100" width="720" height="68" fill="url(#gwr-soil)" />
      <path className="gwt-strata" d="M-200 168H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <circle cx="160" cy="134" r="70" fill="url(#gwr-glow)" />

      {pipes.map((d) => (
        <path key={d} className="gwt-pipe" pathLength={1} d={d} />
      ))}
      {pipes.map((d) => (
        <path key={`in${d}`} className="gwt-pipe-in" pathLength={1} d={d} />
      ))}
      {FEEDS.map((d, i) => (
        <g key={d} className={`gwr-flow gwr-f${i}`}>
          <path className="gwt-live" pathLength={1} d={d} />
        </g>
      ))}
      <g className="gwr-flow gwr-f0">
        <path className="gwt-live" pathLength={1} d={UP} />
      </g>
      <g className="gwr-rush">
        {pipes.map((d) => (
          <path key={d} className="gwt-rush" pathLength={1} d={d} />
        ))}
      </g>
      {FEEDS.map((d, i) => (
        <path key={`a${d}`} className={`gwr-pk gwr-a${i}`} pathLength={1} d={d} />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={`b${i}`} className={`gwr-pk gwr-b${i}`} pathLength={1} d={UP} />
      ))}

      {seals.map((s, i) => {
        const Icon = ICONS[i];
        return (
          <g key={s.t}>
            <circle className="gwr-seal" cx={s.x} cy="178" r="13" />
            <g className="gw-ico" transform={`translate(${s.x} 178)`}>{Icon()}</g>
            <g className={`gwr-lit gwr-s${i}`}>
              <circle cx={s.x} cy="178" r="13" />
              <g className="gw-ico" transform={`translate(${s.x} 178)`}>{Icon()}</g>
            </g>
            <text className="gwr-lab" x={s.x} y="204" textAnchor="middle">{s.t}</text>
          </g>
        );
      })}

      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      <text className="gwt-mono gwt-mono-hot" x="6" y="116">{layer}</text>

      <g className="gwr-sheet">
        <rect className="gwr-paper" x="18" y="6" width="252" height="70" rx="6" />
        <text className="gwr-title" x="32" y="22">{report.k}</text>
        <path className="gwr-rule" d="M32 28H200" />
        {seals.map((s, i) => (
          <g key={s.line} className={`gwr-row gwr-r${i}`}>
            <Tick x={34} y={40 + i * 14} />
            <text className="gwr-line" x="46" y={43 + i * 14}>{s.line}</text>
          </g>
        ))}
      </g>

      <circle className="gwr-ring" cx="232" cy="34" r="22" />
      <g className="gwr-stamp">
        <circle cx="232" cy="34" r="20" />
        <circle cx="232" cy="34" r="16" />
        <text x="232" y="36.4" textAnchor="middle">{stamp}</text>
      </g>
      <g className="gwr-fin">
        <path className="gwt-glowline" d="M-200 100H520" />
      </g>
    </svg>
  );
}

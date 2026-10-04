/** 02 · Primary Source Verification at Scale — chapter two (`./GovWhy`).

    Same kit and 12 s beat as `./GovWhyTrust`. 01 laid the layer; 02 is the
    first door, close up: nobody walks through until the source that issued
    the claim has answered, and those sources are the world. The sign rolls
    through work permit / visa / licence / clearance / profession; a root
    runs to India, the UK, Nigeria, the US, the Philippines and lights the
    matching mark from 01. The third is a mismatch and steps aside. Then
    the map lights and the 20M+ is earned. Clock: `govwhy.css` "02 · SCALE".
    At rest: one through, one aside, the queue, every mark lit, the figure. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { Tick } from "./GovWhyArt";

type S = SectionsCopy["govWhy"]["viz"]["scale"];

/** The world as the bedrock. "x" is land; each dot is a zero-length stroke. */
const MAP = [
  "...xxxxxxxxxxxxxxxxxx.xxxxxxxx....xxx.xxxxxxxxxxxxxxxxxxxxxxxxxx",
  "...xxxxxxxxxxxx...xxx..x.......x.xxxxxxxxxxxxxxxxxxxxxxxx...xxx.",
  ".........xxxxxxxxxxxxx........xxxxxxxxxxxxxxxxxxxxxxxxxxx.......",
  "..........xxxxxxxxxx..........xxx.xxx..x.xxxxxxxxxxxxxx..x......",
  "...........xxxxxxx............xxxxx..xxxxxxxxxxxxxxxxxxxx.......",
  "............xxx..x...........xxxxxxxxx.xxxxxxxxxxxxxxx..........",
  "..............xx...x.........xxxxxxxxxxxxx...xx..xx..x..........",
  ".................xxxxxx.......xxxxxxxxxxx........xx.............",
  "..................xxxxx...........xxxxx............xxx..........",
  "..................xxxxxxxx........xxxxx............xxx.xxxx.....",
  "...................xxxxxx.........xxxxx.x.............xxxx......",
  "....................xxxx...........xxx..............xxxxxxx.....",
  "...................xxxx............xx...............x...xxx.....",
];
type Pt = readonly [number, number];
const at = (c: number, r: number): Pt => [4 + c * 4.9, Math.round((152 + r * 4.3) * 10) / 10];
const MAP_D = MAP.flatMap((row, r) => [...row].map((ch, c) => (ch === "x" ? `M${at(c, r).join(" ")}h0` : ""))).join("");
const root = ([x, y]: Pt) => `M160 148C160 158 ${x} ${y - 12} ${x} ${y}`;

/** 01's three bedrock marks, plus a shield for a clearance. */
const mark = {
  degree: () => (
    <>
      <path d="M-8-1.5L0-5.5l8 4-8 4z" />
      <path d="M-4.5.5v3.2c0 1.4 2 2.3 4.5 2.3s4.5-.9 4.5-2.3V.5M8-1.5V3" />
    </>
  ),
  licence: () => (
    <>
      <path d="M-7-6.5h14v9H-7zM-4-3.5h8M-4-.8h4.5" />
      <circle cx="3.5" cy="4.3" r="2.2" />
      <path d="M2.4 6.2L1.8 8.6l1.7-.8 1.7.8-.6-2.4" />
    </>
  ),
  identity: () => (
    <>
      <rect x="-8" y="-5.5" width="16" height="11" rx="2" />
      <circle cx="-3.4" cy="-1.3" r="1.9" />
      <path d="M-6.4 3.3c.4-2.2 5.6-2.2 6 0M1.5-2h4.5M1.5 1h3.5" />
    </>
  ),
  shield: () => (
    <>
      <path d="M0-7l6 2.2v4.3c0 3.6-2.5 6-6 7.5-3.5-1.5-6-3.9-6-7.5v-4.3z" />
      <path d="M-2.2.2l1.5 1.5 3-3.2" />
    </>
  ),
};

/** Queue order: India, the UK, Nigeria (mismatch), the US, the Philippines. */
const CHECKS = [
  { src: at(45, 5), mark: mark.identity, on: "gwp-on-a", down: "gwt-d9", up: "gwt-d14", ring: "gwt-d13" },
  { src: at(32, 2), mark: mark.identity, on: "gwp-on-b", down: "gwt-d32", up: "gwt-d37", ring: "gwt-d36" },
  { src: at(33, 7), mark: mark.licence, on: "gwp-on-c", down: "gwt-d53", up: "gwt-d58", ring: "gwt-d57" },
  { src: at(15, 3), mark: mark.shield, on: "gwp-on-d", down: "gwt-d76", up: "gwt-d81", ring: "gwt-d80" },
  { src: at(53, 6), mark: mark.degree, on: "gwp-on-e", down: "gwt-d93", up: "gwt-d98", ring: "gwt-d97" },
];
const MISMATCH = 2;
/** The rush: two more countries every tenth of a second. */
const RUSH = [
  [23, 10], [56, 4], [11, 2], [38, 8], [58, 12], [34, 2], [14, 6],
  [52, 3], [36, 11], [38, 1], [41, 5], [21, 12], [51, 9], [37, 4],
].map(([c, r], i) => ({ src: at(c, r), d: `gwt-d${104 + Math.floor(i / 2)}` }));
const CORE_PINGS = ["gwt-d8", "gwt-d18", "gwt-d31", "gwt-d41", "gwt-d52", "gwt-d62", "gwt-d75", "gwt-d85", "gwt-d92", "gwt-d102"];
const QUEUE = [
  { cls: "gwp-p1", card: "gwt-d20" },
  { cls: "gwp-p2", card: "gwt-d43" },
  { cls: "gwp-p3" },
  { cls: "gwp-p4", card: "gwt-d86" },
  { cls: "gwp-p5", card: "gwt-d103" },
];
const STREAM = ["gwt-d104", "gwt-d106", "gwt-d108", "gwt-d110"];

/** Gate faces, in `creds` order: briefcase, passport, certificate, shield, scope. */
const credIcon = [
  () => <path d="M-7-2.5h14v9H-7zM-2.8-2.5V-5h5.6v2.5M-7 1.5h14" />,
  () => (
    <g>
      <rect x="-5" y="-7" width="10" height="14" rx="1.5" />
      <circle cy="-1" r="2.6" />
      <path d="M-2.6-1h5.2M-2.5 4.5h5" />
    </g>
  ),
  () => (
    <g>
      <path d="M-7-6.5h14v9H-7zM-4-3.5h8M-4-.8h4.5" />
      <circle cx="3.5" cy="4.3" r="2.2" />
    </g>
  ),
  () => <path d="M0-7l6 2.2v4.3c0 3.6-2.5 6-6 7.5-3.5-1.5-6-3.9-6-7.5v-4.3zM-2.4 0l1.6 1.6 3.2-3.4" />,
  () => (
    <g>
      <path d="M-5-6.5V-3a4 4 0 0 0 8 0v-3.5M-1 1v4.2a3.2 3.2 0 0 0 6.4 0V2.5" />
      <circle cx="5.4" cy="1" r="1.5" />
    </g>
  ),
];

function Person() {
  return (
    <>
      <circle className="gwt-me-o" r="8" />
      <g className="gwt-me-i">
        <circle cy="-2.6" r="2.3" />
        <path d="M-4.2 4.6c.4-3.6 8-3.6 8.4 0" />
      </g>
    </>
  );
}

function Doc({ cls }: { cls: string }) {
  return (
    <g className={`gwp-doc ${cls}`}>
      <rect x="7" y="-11" width="8" height="10" rx="1.3" />
      <path d="M8.8-8h4.2M8.8-5.4h3" />
    </g>
  );
}

function Gate() {
  return (
    <>
      <path className="gwt-pole" d="M114 32V11" />
      <path className="gwt-a" d="M114 11h11l-2.4 2.8 2.4 2.8H114z" />
      <rect className="gwt-o" x="118" y="32" width="84" height="6" />
      <rect className="gwt-o" x="120" y="38" width="9" height="59" />
      <rect className="gwt-o" x="191" y="38" width="9" height="59" />
      <rect className="gwt-o" x="118" y="38" width="13" height="4" />
      <rect className="gwt-o" x="189" y="38" width="13" height="4" />
      <rect className="gwt-o" x="114" y="97" width="92" height="3" />
    </>
  );
}

export function ArtScale({ s, layer }: { s: S; layer: string }) {
  const creds = Object.values(s.creds);
  return (
    <svg className="gwt gwp" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gwp-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path className="gwt-hatch" d="M0 0V7" />
        </pattern>
        <radialGradient id="gwp-glow">
          <stop offset="0" className="gwt-glow-a" />
          <stop offset="1" className="gwt-glow-b" />
        </radialGradient>
        <clipPath id="gwp-win">
          <rect x="126" y="10" width="68" height="18" />
        </clipPath>
      </defs>

      <rect className="gwt-rock" x="-200" y="168" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="68" />
      <rect x="-200" y="100" width="720" height="68" fill="url(#gwp-soil)" />
      <path className="gwt-strata" d="M-200 168H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <circle cx="160" cy="134" r="78" fill="url(#gwp-glow)" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{layer}</text>
      <text className="gwt-mono" x="6" y="207">{s.countries}</text>

      <g>
        <title>{s.sources}</title>
        <path className="gwp-map" d={MAP_D} />
      </g>
      <g className="gwp-fin">
        <path className="gwp-map-hot" d={MAP_D} />
        {RUSH.map((r) => <circle key={r.d + r.src} className="gwp-lit" cx={r.src[0]} cy={r.src[1]} r="2.2" />)}
      </g>
      {RUSH.map((r) => (
        <g key={r.d + r.src}>
          <path className={`gwp-zap ${r.d}`} pathLength={1} d={root(r.src)} />
          <circle className={`gwp-blip ${r.d}`} cx={r.src[0]} cy={r.src[1]} r="2.4" />
        </g>
      ))}
      {CHECKS.map((c, i) => (
        <g key={c.on}>
          <path className={`gwp-root ${c.on}`} pathLength={1} d={root(c.src)} />
          <path className={`gwt-pk ${c.down}`} pathLength={1} d={root(c.src)} />
          <path className={`gwt-pk gwt-rev ${c.up}${i === MISMATCH ? " gwp-pk-no" : ""}`} pathLength={1} d={root(c.src)} />
          <circle className={`gwp-ripple ${c.ring}${i === MISMATCH ? " gwp-ripple-no" : ""}`} cx={c.src[0]} cy={c.src[1]} r="8" />
          <g className={`${c.on} gwt-d4`} transform={`translate(${c.src[0]} ${c.src[1]})`}>
            <g className={i === MISMATCH ? "gwp-badge gwp-badge-no" : "gwp-badge"}>
              <circle r="8" />
              <g className="gw-ico" transform="scale(.55)">{c.mark()}</g>
            </g>
          </g>
        </g>
      ))}

      <path className="gwt-pipe" pathLength={1} d="M160 120V100" />
      <path className="gwt-pipe-in" pathLength={1} d="M160 120V100" />
      <path className="gwt-live" d="M160 120V100" />
      <path className="gwt-pk gwt-rev gwt-d8" pathLength={1} d="M160 120V100" />
      <path className="gwt-pk gwt-d18" pathLength={1} d="M160 120V100" />
      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      {CORE_PINGS.map((d) => (
        <rect key={d} className={`gwt-ring ${d}`} x="114" y="120" width="92" height="28" rx="14" />
      ))}

      <g className="gwt-b"><Gate /></g>
      <g className="gwt-lit gwp-gate-lit"><Gate /></g>
      <g className="gwp-bar">
        <rect className="gwp-arm" x="140" y="68" width="46" height="4" rx="2" />
        <path className="gwp-stripe" d="M146 70h5M156 70h5M166 70h5M176 70h5" />
      </g>

      <g className="gwp-sign">
        <rect className="gwp-board" x="122" y="8" width="76" height="22" rx="5" />
        <g clipPath="url(#gwp-win)">
          <g className="gwp-roll">
            {creds.map((c, i) => (
              <g key={c} transform={`translate(0 ${i * 18})`}>
                <g className="gw-ico" transform="translate(138 19) scale(.7)">{credIcon[i]()}</g>
                <text x="148" y="21.8">{c}</text>
              </g>
            ))}
            <g transform="translate(0 90)">
              {credIcon.map((icon, i) => (
                <g key={i} className="gw-ico gwp-ico-hot" transform={`translate(${134 + i * 13} 19) scale(.55)`}>
                  {icon()}
                </g>
              ))}
            </g>
          </g>
        </g>
      </g>

      {QUEUE.map((p, i) => (
        <g key={p.cls} transform="translate(0 91)">
          <g className={p.cls}>
            <g className={i === MISMATCH ? "gwp-face" : undefined}>
              <Person />
            </g>
            {p.card && <Doc cls={`gwp-card ${p.card}`} />}
            {i === MISMATCH && (
              <g className="gwp-out">
                <circle r="8" />
                <g className="gwt-me-i">
                  <circle cy="-2.6" r="2.3" />
                  <path d="M-4.2 4.6c.4-3.6 8-3.6 8.4 0" />
                </g>
              </g>
            )}
          </g>
        </g>
      ))}
      {STREAM.map((d) => (
        <g key={d} transform="translate(0 91)">
          <g className={`gwp-dash ${d}`}>
            <Person />
            <Doc cls={`gwp-dash-card ${d}`} />
          </g>
        </g>
      ))}

      <g transform="translate(108 64)">
        <g className="gwp-ask">
          <circle r="5.5" />
          <text y="2.5" textAnchor="middle">?</text>
        </g>
        <g className="gwp-ok">
          <Tick x={0} y={0} />
        </g>
        <g className="gwp-no">
          <circle r="5.5" />
          <path d="M-2-2l4 4m0-4l-4 4" />
        </g>
      </g>

      <g className="gwp-big">
        <text className="gwp-num" x="314" y="28" textAnchor="end">{s.big}</text>
        <text className="gwt-mono" x="314" y="39" textAnchor="end">{s.bigL}</text>
      </g>
    </svg>
  );
}

/** 02 · Primary Source Verification at Scale — chapter two (`./GovWhy`).

    Same kit and 12 s beat as `./GovWhyTrust`. 01 laid the layer; 02 is the
    first door, close up: nobody walks through until the source that issued
    the claim has answered, and those sources are the world.

    Rebuilt 9 Oct 2026 to show the scale itself, minimal ("show 20K
    verifications, then in 6 months 60K"). Month 1: three people, one at a
    time, each held at the gate while the check goes down to a country and
    back; the counter reads 20K. Months 2–6: people stream through without
    stopping, the counter climbs to 60K, the month bar fills and the map
    lights outward from HelloVerify. The sign rolls through the kinds of
    claim. Clock: `govwhy.css` "02 · SCALE".
    At rest: 60K, Month 6, the whole map lit. */
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
const dots = (keep: (c: number) => boolean) =>
  MAP.flatMap((row, r) => [...row].map((ch, c) => (ch === "x" && keep(c) ? `M${at(c, r).join(" ")}h0` : ""))).join("");
const MAP_D = dots(() => true);
/** One band of the map per month, outward from the column under the core. */
const MONTHS = 6;
const band = (c: number) => Math.min(MONTHS - 1, Math.floor(Math.abs(c - 32) / 5.4));
const BANDS = Array.from({ length: MONTHS }, (_, k) => dots((c) => band(c) === k));
/** From the gate's floor, down through HelloVerify, to a source. */
const route = ([x, y]: Pt) => `M160 100V148C160 158 ${x} ${y - 12} ${x} ${y}`;

/** Month 1: one at a time, held at the gate while India, the UK and the
 *  Philippines answer. `go` starts the walk; the check leaves 1.2 s in. */
const SLOW = [
  { go: "gwt-d4", down: "gwt-d16", up: "gwt-d21", ok: "gwt-d25", src: at(45, 5) },
  { go: "gwt-d20", down: "gwt-d32", up: "gwt-d37", ok: "gwt-d41", src: at(32, 2) },
  { go: "gwt-d36", down: "gwt-d48", up: "gwt-d53", ok: "gwt-d57", src: at(53, 6) },
];
/** Months 2–6: a stream, each one's check fired as they cross (0.8 s in). */
const FAST = [
  [23, 10], [56, 4], [11, 2], [38, 8], [58, 12], [34, 2], [14, 6], [52, 3], [36, 11], [41, 5], [21, 12],
].map(([c, r], i) => ({ go: `gwt-d${54 + i * 4}`, down: `gwt-d${62 + i * 4}`, hit: `gwt-d${66 + i * 4}`, src: at(c, r) }));

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

function Gate() {
  return (
    <>
      <path className="gwt-pole" d="M114 32V11" />
      <path className="gwt-a" d="M114 11h11l-2.4 2.8 2.4 2.8H114z" />
      <rect className="gwt-o" x="118" y="32" width="84" height="6" />
      <rect className="gwt-o" x="120" y="38" width="9" height="59" />
      <rect className="gwt-o" x="191" y="38" width="9" height="59" />
      <rect className="gwt-o" x="114" y="97" width="92" height="3" />
    </>
  );
}

export function ArtScale({ s, layer }: { s: S; layer: string }) {
  const creds = Object.values(s.creds);
  const step = (s.count.to - s.count.from) / (MONTHS - 1);
  const counts = Array.from({ length: MONTHS }, (_, k) => `${Math.round(s.count.from + step * k)}${s.count.suffix}`);
  return (
    <svg className="gwt gwt-min gws" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="gws-win">
          <rect x="126" y="10" width="68" height="18" />
        </clipPath>
        <clipPath id="gws-num">
          <rect x="0" y="12" width="110" height="30" />
        </clipPath>
      </defs>

      <rect className="gwt-rock" x="-200" y="168" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="68" />
      <path className="gwt-strata" d="M-200 168H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{layer}</text>
      <g>
        <title>{s.sources}</title>
        <path className="gws-map" d={MAP_D} />
      </g>

      {/* The counter, its unit and the six months it takes. Each month
          fills its segment and its band of the map together. */}
      <g clipPath="url(#gws-num)">
        <g className="gws-roll">
          {counts.map((c, k) => (
            <text key={c} className="gws-num" x="8" y={36 + k * 28}>{c}</text>
          ))}
        </g>
      </g>
      <text className="gws-unit" x="8" y="50">{s.unit}</text>
      {BANDS.map((d, k) => <rect key={d} className="gws-seg" x={8 + k * 15} y="56" width="13" height="3" rx="1.5" />)}
      {BANDS.map((d, k) => (
        <g key={d} className={`gws-m${k}`}>
          <path className="gws-map-hot" d={d} />
          <rect className="gws-seg-on" x={8 + k * 15} y="56" width="13" height="3" rx="1.5" />
        </g>
      ))}
      <text className="gwt-mono gws-halo" x="6" y="207">{s.countries}</text>
      <text className="gwt-mono" x="8" y="68">{s.months.first}</text>
      <text className="gwt-mono" x="98" y="68" textAnchor="end">{s.months.last}</text>

      {/* The checks: Month 1's down and back, the stream's down. */}
      {SLOW.map((p) => (
        <g key={p.go}>
          <path className={`gwt-pk ${p.down}`} pathLength={1} d={route(p.src)} />
          <path className={`gwt-pk gwt-rev ${p.up}`} pathLength={1} d={route(p.src)} />
          <circle className={`gws-blip ${p.up}`} cx={p.src[0]} cy={p.src[1]} r="2.6" />
        </g>
      ))}
      {FAST.map((p) => (
        <g key={p.go}>
          <path className={`gwt-pk ${p.down}`} pathLength={1} d={route(p.src)} />
          <circle className={`gws-blip ${p.hit}`} cx={p.src[0]} cy={p.src[1]} r="2.6" />
        </g>
      ))}

      <path className="gwt-pipe" pathLength={1} d="M160 120V100" />
      <g className="gws-gate">
        <path className="gwt-live" d="M160 120V100" />
      </g>
      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>

      <g className="gwt-b"><Gate /></g>
      <g className="gwt-lit gws-gate"><Gate /></g>

      <rect className="gwp-board" x="122" y="8" width="76" height="22" rx="5" />
      <g clipPath="url(#gws-win)">
        <g className="gws-sign">
          {creds.map((c, i) => (
            <g key={c} transform={`translate(0 ${i * 18})`}>
              <g className="gw-ico" transform="translate(138 19) scale(.7)">{credIcon[i]()}</g>
              <text x="148" y="21.8">{c}</text>
            </g>
          ))}
        </g>
      </g>

      {SLOW.map((p) => (
        <g key={p.go}>
          <g transform="translate(0 91)">
            <g className={`gws-walk ${p.go}`}><Person /></g>
          </g>
          <g className={`gws-ok ${p.ok}`}>
            <Tick x={160} y={60} />
          </g>
        </g>
      ))}
      {FAST.map((p) => (
        <g key={p.go} transform="translate(0 91)">
          <g className={`gws-dash ${p.go}`}><Person /></g>
        </g>
      ))}
    </svg>
  );
}

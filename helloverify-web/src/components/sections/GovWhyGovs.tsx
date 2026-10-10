/** 04 · Governments We Work With — chapter four (`./GovWhy`).

    Same kit and 12 s beat as `./GovWhyTrust`. Rebuilt 9 Oct 2026 to tell
    the plate's own sentence ("trusted by leading enterprises and government
    authorities across Singapore, the UAE and European authority
    verification workflows"), part by part:

    - three regions, each named with the authority we work with there and
      the workflow we run for it (the authorities are the seals band's:
      Ministry of Manpower, MOHESR, the embassies of Italy and Latvia);
    - beside each authority, an enterprise tower: the "leading
      enterprises" in the same place, on the same layer;
    - a key at the bedrock naming the two kinds, so the drawing reads as
      the sentence does.

    The loop goes region by region: an application arrives at the
    authority, its check goes down into HelloVerify and comes back
    verified; the authority lights, ticked, and the enterprise beside it
    joins. When all three regions are on, HelloVerify pulses once. No
    crests: the marks are drawn, not the authorities' own. Clock:
    `govwhy.css` "04 · GOVS". At rest: every region lit. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { Tick } from "./GovWhyArt";

type G = SectionsCopy["govWhy"]["viz"]["govs"];

/** Column centres; each column's authority sits left of centre, its
 *  enterprise right, and its pipe rises between them. */
const X = [55, 160, 265];
const PIPE = [
  "M59 100V104Q59 108 63 108H132Q136 108 136 112V120",
  "M164 100V120",
  "M269 100V104Q269 108 265 108H196Q192 108 192 112V120",
];
/** Per region, in tenths of a second: the application arrives, its check
 *  goes down, reaches HelloVerify, comes back up, the authority lights. */
const FLOW = [10, 40, 70].map((t) => ({
  doc: `gwt-d${t}`,
  down: `gwt-d${t + 3}`,
  ring: `gwt-d${t + 7}`,
  up: `gwt-d${t + 9}`,
  lit: `gwt-d${t + 13}`,
}));

/** Singapore's ministry: a portico. */
function Ministry({ c }: { c: number }) {
  return (
    <>
      <path className="gwt-o" d={`M${c - 16} 72L${c} 63L${c + 16} 72Z`} />
      <rect className="gwt-o" x={c - 15} y="72" width="30" height="3" />
      {[-12, -5, 2, 9].map((dx) => <rect key={dx} className="gwt-o" x={c + dx} y="75" width="3" height="21" />)}
      <rect className="gwt-o" x={c - 17} y="96" width="34" height="4" />
    </>
  );
}
/** The UAE's ministry: a dome. */
function Dome({ c }: { c: number }) {
  return (
    <>
      <path className="gwt-pole" d={`M${c} 67V61`} />
      <circle className="gwt-a" cx={c} cy="60" r="1.4" />
      <path className="gwt-o" d={`M${c - 9} 76a9 9 0 0 1 18 0z`} />
      <rect className="gwt-o" x={c - 15} y="76" width="30" height="24" />
      <rect className="gwt-w" x={c - 11} y="82" width="4" height="5" />
      <rect className="gwt-w" x={c + 7} y="82" width="4" height="5" />
      <path className="gwt-w" d={`M${c - 3} 100v-7a3 3 0 0 1 6 0v7z`} />
    </>
  );
}
/** Europe's embassies: a flag over a chancery. */
function Embassy({ c }: { c: number }) {
  return (
    <>
      <path className="gwt-pole" d={`M${c - 11} 66V52`} />
      <path className="gwt-a" d={`M${c - 11} 52h9l-2 2.5 2 2.5h-9z`} />
      <rect className="gwt-o" x={c - 16} y="66" width="32" height="3" />
      <rect className="gwt-o" x={c - 15} y="69" width="30" height="31" />
      {[-11, -2, 7].flatMap((dx) => [74, 83].map((y) => (
        <rect key={`${dx}-${y}`} className="gwt-w" x={c + dx} y={y} width="4" height="5" />
      )))}
      <rect className="gwt-w" x={c - 3} y="92" width="6" height="8" />
    </>
  );
}
const AUTHORITY = [Ministry, Dome, Embassy];

function Tower({ c }: { c: number }) {
  return (
    <>
      <rect className="gwt-o" x={c - 8} y="58" width="16" height="42" />
      {[-5, 1].flatMap((dx) => [62, 70, 78, 86].map((y) => (
        <rect key={`${dx}-${y}`} className="gwt-w" x={c + dx} y={y} width="4" height="4" />
      )))}
    </>
  );
}

function Hall() {
  return <path d="M-8.5-3L0-8l8.5 5zM-6-1v6M-2-1v6M2-1v6M6-1v6M-8.5 7h17" />;
}
function Office() {
  return <path d="M-5.5 7V-7h8v14M2.5-2h4V7M-8 7h16M-3-4h3M-3-1h3M-3 2h3" />;
}

/** Region, the authority there, the workflow we run for it. */
function Label({ x, r }: { x: number; r: G["regions"][keyof G["regions"]] }) {
  return (
    <>
      <text className="gwb-reg" x={x} y="14" textAnchor="middle">{r.n}</text>
      <text className="gwb-auth" x={x} y="23.5" textAnchor="middle">{r.a}</text>
      <text className="gwt-mono gwb-wf" x={x} y="32" textAnchor="middle">{r.w}</text>
    </>
  );
}

export function ArtGovs({ layer, g }: { layer: string; g: G }) {
  const regions = Object.values(g.regions);
  return (
    <svg className="gwt gwt-min gwb" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <rect className="gwt-rock" x="-200" y="160" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="60" />
      <path className="gwt-strata" d="M-200 160H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{layer}</text>

      {PIPE.map((d) => <path key={d} className="gwt-pipe" pathLength={1} d={d} />)}
      {PIPE.map((d, i) => (
        <g key={d} className={`gwb-a${i}`}>
          <path className="gwt-live" d={d} />
        </g>
      ))}
      {FLOW.map((f, i) => (
        <g key={f.doc}>
          <path className={`gwt-pk ${f.down}`} pathLength={1} d={PIPE[i]} />
          <path className={`gwt-pk gwt-rev ${f.up}`} pathLength={1} d={PIPE[i]} />
        </g>
      ))}

      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      {[...FLOW.map((f) => f.ring), "gwt-d100"].map((d) => (
        <rect key={d} className={`gwt-ring ${d}`} x="114" y="120" width="92" height="28" rx="14" />
      ))}

      {/* The key: the sentence's two kinds of client. */}
      <g transform="translate(16 185)">
        <g className="gw-ico" transform="scale(.6)"><Hall /></g>
        <text className="gwb-key" x="11" y="3">{g.key.a}</text>
      </g>
      <g transform="translate(176 185)">
        <g className="gw-ico" transform="scale(.6)"><Office /></g>
        <text className="gwb-key" x="11" y="3">{g.key.e}</text>
      </g>

      {X.map((x, i) => {
        const Auth = AUTHORITY[i];
        return (
          <g key={x}>
            <g className="gwt-b">
              <Label x={x} r={regions[i]} />
              <Auth c={x - 13} />
              <Tower c={x + 14} />
            </g>
            <g className={`gwt-lit gwb-a${i}`}>
              <Label x={x} r={regions[i]} />
              <Auth c={x - 13} />
              <g className={`gwt-pop ${FLOW[i].lit}`}>
                <Tick x={x - 1} y={62} />
              </g>
            </g>
            <g className={`gwt-lit gwb-e${i}`}>
              <Tower c={x + 14} />
            </g>
            <g transform={`translate(${x - 13} 45)`}>
              <g className={`gwb-doc ${FLOW[i].doc}`}>
                <rect x="-4" y="-5" width="8" height="10" rx="1.2" />
                <path d="M-2-2h4M-2 .5h4M-2 3h2.5" />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

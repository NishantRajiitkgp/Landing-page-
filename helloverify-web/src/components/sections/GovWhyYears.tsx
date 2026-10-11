/** 05 · Long-Term Digital Infrastructure — chapter five (`./GovWhy`).

    Same kit, same 12 s beat. Rebuilt 9 Oct 2026 (the years piling into
    the rock "has no meaning"): infrastructure is what you build once and
    keep plugging into, so this is the roadmap on one rail.

    HelloVerify and its AI stand on 20M+ checks since 2018. What is live
    today is wired straight in: source checks, AI document reading. The
    rail runs right, past the card's edge, into the years to come, with
    four empty sockets on it — reusable credentials, continuous
    monitoring, digital ID wallets, 50+ more countries (`sections`'
    `future` says where each comes from). One by one a module drops into
    its socket, the current runs out along the rail to it, the AI pulses,
    and it lights. Clock: `govwhy.css` "05 · FUTURE". At rest: everything
    plugged in and lit. */
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { lines, Tick } from "./GovWhyArt";

type F = SectionsCopy["govWhy"]["viz"]["future"];

const ICO: Record<keyof F["mods"], () => ReactNode> = {
  source: () => (
    <>
      <circle r="7" />
      <path d="M-7 0h14M0-7c-3.2 2.4-3.2 11.6 0 14M0-7c3.2 2.4 3.2 11.6 0 14" />
    </>
  ),
  read: () => <path d="M-4.5-7h6l3.5 3.5V7h-9.5zM1.5-7v3.5H5M-7.5.5h15" />,
  reuse: () => (
    <>
      <rect x="-7" y="-5" width="14" height="10" rx="1.6" />
      <path d="M-3.4 0l2 2 4-4" />
    </>
  ),
  watch: () => <path d="M-8 0h3.6l2-5 3 10 2-5H8" />,
  wallet: () => <path d="M-4.5-7.5h9a1.8 1.8 0 0 1 1.8 1.8V5.7a1.8 1.8 0 0 1-1.8 1.8h-9a1.8 1.8 0 0 1-1.8-1.8V-5.7a1.8 1.8 0 0 1 1.8-1.8zM-1.6 4.6h3.2M-3-3.6h6v4h-6z" />,
  reach: () => <path d="M0 7.5S-5.5 2.6-5.5-1.4a5.5 5.5 0 0 1 11 0C5.5 2.6 0 7.5 0 7.5zM-2.4-1.6h4.8M0-4v4.8" />,
};
const LIVE = [
  { k: "source", x: 30 },
  { k: "read", x: 80 },
] as const;
/** The sockets, and when each module plugs in (tenths of a second): it
 *  drops, the current is sent, it lights. */
const NEXT = [
  { k: "reuse", x: 140, send: "gwt-d28", lit: "gwt-d33" },
  { k: "watch", x: 190, send: "gwt-d48", lit: "gwt-d53" },
  { k: "wallet", x: 240, send: "gwt-d68", lit: "gwt-d73" },
  { k: "reach", x: 290, send: "gwt-d88", lit: "gwt-d93" },
] as const;
const RAIL_Y = 134;
const feed = (x: number) => `M100 ${RAIL_Y}H${x - 4}Q${x} ${RAIL_Y} ${x} ${RAIL_Y - 4}V72`;
const HEX = "M114 123l9.5 5.5v11l-9.5 5.5-9.5-5.5v-11z";

function Token({ k, lit }: { k: keyof F["mods"]; lit?: boolean }) {
  return (
    <g className={lit ? "gwy-tok gwy-tok-on" : "gwy-tok"}>
      <rect x="-13" y="-13" width="26" height="26" rx="7" />
      <g className="gw-ico" transform="scale(.8)">{ICO[k]()}</g>
    </g>
  );
}

function Name({ x, s }: { x: number; s: string }) {
  const ls = lines(s);
  return (
    <text className="gwy-name" textAnchor="middle">
      {ls.map((l, j) => (
        <tspan key={j} x={x} y={36 - (ls.length - 1 - j) * 8}>{l}</tspan>
      ))}
    </text>
  );
}

export function ArtYears({ core, f }: { core: string; f: F }) {
  return (
    <svg className="gwt gwt-min gwy" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <rect className="gwt-rock" x="-200" y="160" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="60" />
      <path className="gwt-strata" d="M-200 160H520" />
      <path className="gwt-ground" d="M-200 100H520" />

      {/* Today and next, along the top. */}
      <text className="gwt-mono gwt-mono-hot" x="55" y="9" textAnchor="middle">{f.live}</text>
      <text className="gwt-mono" x="215" y="9" textAnchor="middle">{f.next}</text>
      <path className="gwy-axis-live" d="M10 16H100" />
      <path className="gwy-axis-next" d="M120 16H304M300 13l4 3-4 3" />

      {/* The rail, out past the edge, and every stem up from it. */}
      <path className="gwt-pipe" pathLength={1} d={`M100 ${RAIL_Y}H340`} />
      {LIVE.map((m) => <path key={m.k} className="gwt-pipe" pathLength={1} d={`M${m.x} 72V120`} />)}
      {NEXT.map((m) => <path key={m.k} className="gwt-pipe" pathLength={1} d={`M${m.x} 72V${RAIL_Y}`} />)}
      <g className="gwy-on-l">
        {LIVE.map((m) => <path key={m.k} className="gwt-live" d={`M${m.x} 72V120`} />)}
      </g>
      {NEXT.map((m, i) => (
        <g key={m.k} className={`gwy-on-${i}`}>
          <path className="gwt-live" d={feed(m.x)} />
        </g>
      ))}
      {NEXT.map((m) => <path key={m.k} className={`gwt-pk ${m.send}`} pathLength={1} d={feed(m.x)} />)}

      <g className="gwt-core-g">
        <rect className="gwt-core" x="8" y="120" width="92" height="28" rx="14" />
        <g transform="translate(21 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      <g className="gwa-ai">
        <title>{core}</title>
        <path className="gwa-hex" d={HEX} />
        <text className="gwa-ai-t" x="114" y="136.5" textAnchor="middle">{core}</text>
      </g>
      {[...NEXT.map((m) => m.send), "gwt-d102"].map((d) => (
        <path key={d} className={`gwt-ring ${d}`} d={HEX} />
      ))}
      <text className="gwt-mono gwy-cap gwy-l" x="128" y="153">{f.ai}</text>

      {/* Underneath: what it stands on, and where the rail is going. */}
      <text className="gwt-mono gwy-l" x="8" y="180">{f.base}</text>
      <text className="gwt-mono gwy-r" x="298" y="180" textAnchor="end">{f.ahead}</text>
      <path className="gwy-axis-next" d="M302 177.5H312M309 175l3 2.5-3 2.5" />

      {/* Live today: wired in from the start. */}
      {LIVE.map((m) => (
        <g key={m.k}>
          <Name x={m.x} s={f.mods[m.k]} />
          <g transform={`translate(${m.x} 59)`}>
            <Token k={m.k} />
            <g className="gwy-on-l">
              <Token k={m.k} lit />
              <g className="gwt-pop gwt-d10">
                <Tick x={11} y={-11} />
              </g>
            </g>
          </g>
        </g>
      ))}

      {/* Next: an empty socket, then the module dropping into it. */}
      {NEXT.map((m, i) => (
        <g key={m.k}>
          <Name x={m.x} s={f.mods[m.k]} />
          <g transform={`translate(${m.x} 59)`}>
            <rect className="gwy-slot" x="-13" y="-13" width="26" height="26" rx="7" />
            <g className={`gwy-in-${i}`}>
              <Token k={m.k} />
            </g>
            <g className={`gwy-on-${i}`}>
              <Token k={m.k} lit />
              <g className={`gwt-pop ${m.lit}`}>
                <Tick x={11} y={-11} />
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

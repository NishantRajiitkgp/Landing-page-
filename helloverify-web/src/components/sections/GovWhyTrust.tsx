/** 01 · Trust Infrastructure — the nation in cross-section (`./GovWhy`).

    Rebuilt 3 Oct 2026 on the founder's review: the record-and-pills drawing
    "doesn't tell any story". The copy's point is a contrast — a report is
    bought once per case; infrastructure is built once, sits underneath, and
    every regulated interaction runs on it. "Underpins" is taken literally:

    - above ground, four places a person passes through in a regulated life:
      the manpower ministry, immigration, the health authority, an employer;
    - under them, HelloVerify, the trust layer, piped up to every one;
    - at the bedrock, the primary sources: university, licensing council,
      identity registry.

    Pared back 9 Oct 2026 ("too much is going on"): no worker, plane, side
    record or finale. The ticks sit under the sources, because that is
    where a check is passed: the ministry asks, the check goes down through
    HelloVerify, each source is checked and ticked, and the pass comes back
    up. Immigration, the health authority and the employer are then cleared
    straight from the layer, without going back to the sources. The clock
    is in `govwhy.css` ("01 · TRUST"); this file only draws and names the
    parts.

    At rest — before the band is near, or under reduced motion — it is the
    last frame: all four lit, every source ticked. Decorative (`aria-hidden`):
    the plate's title and sentence say it in words. No inline styles: a
    one-shot's start is a `gwt-dNN` class (NN = tenths of a second). */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { lines, Tick } from "./GovWhyArt";

type T = SectionsCopy["govWhy"]["viz"]["trust"];

/** The pipes up, core to each building's footing, and down, core to each
 *  source. Two levels of bends so no pipe crosses another. */
const UP = [
  "M136 120V113Q136 109 132 109H50Q46 109 46 105V100",
  "M152 120V108Q152 104 148 104H126Q122 104 122 100",
  "M168 120V108Q168 104 172 104H194Q198 104 198 100",
  "M184 120V113Q184 109 188 109H270Q274 109 274 105V100",
];
const DOWN = [
  "M144 148V151Q144 155 140 155H114Q110 155 110 159V169",
  "M160 148V169",
  "M176 148V151Q176 155 180 155H206Q210 155 210 159V169",
];
/** When each building's question goes down, and its answer comes up. */
const ASK = ["gwt-d21", "gwt-d56", "gwt-d77", "gwt-d98"];
const ANSWER = ["gwt-d38", "gwt-d61", "gwt-d82", "gwt-d103"];
const LIT = ["gwt-d43", "gwt-d65", "gwt-d86", "gwt-d107"];
/** Each source's tick, one after another once the check reaches them. */
const PASS = ["gwt-d31", "gwt-d32", "gwt-d33"];

const BUILDINGS = [
  {
    x: 46,
    badge: [70, 50],
    body: (
      <>
        <path className="gwt-pole" d="M46 47V35" />
        <path className="gwt-a" d="M46 35h9l-2 2.5 2 2.5h-9z" />
        <path className="gwt-o" d="M22 60L46 47L70 60Z" />
        <rect className="gwt-o" x="24" y="60" width="44" height="4" />
        {[29, 39, 49, 59].map((x) => <rect key={x} className="gwt-o" x={x} y="64" width="4" height="31" />)}
        <rect className="gwt-o" x="18" y="95" width="56" height="5" />
      </>
    ),
  },
  {
    x: 122,
    badge: [100, 57],
    body: (
      <>
        <rect className="gwt-o" x="133" y="46" width="6" height="16" />
        <path className="gwt-a" d="M129 40h14l-2 6h-10z" />
        <rect className="gwt-o" x="94" y="62" width="50" height="4" />
        <rect className="gwt-o" x="96" y="66" width="46" height="34" />
        <rect className="gwt-w" x="101" y="72" width="8" height="7" rx="1" />
        <rect className="gwt-w" x="130" y="72" width="8" height="7" rx="1" />
        <path className="gwt-w" d="M114 100V88a8 8 0 0 1 16 0v12z" />
      </>
    ),
  },
  {
    x: 198,
    badge: [224, 50],
    body: (
      <>
        <rect className="gwt-o" x="172" y="54" width="52" height="4" />
        <rect className="gwt-o" x="174" y="58" width="48" height="42" />
        <circle className="gwt-o" cx="198" cy="73" r="9" />
        <path className="gwt-a" d="M196 67h4v4h4v4h-4v4h-4v-4h-4v-4h4z" />
        <rect className="gwt-w" x="193" y="89" width="10" height="11" />
      </>
    ),
  },
  {
    x: 274,
    badge: [293, 35],
    body: (
      <>
        <rect className="gwt-o" x="262" y="34" width="24" height="4" />
        <rect className="gwt-o" x="256" y="38" width="36" height="62" />
        {Array.from({ length: 12 }, (_, k) => (
          <rect key={k} className="gwt-w" x={262 + (k % 3) * 9} y={45 + Math.floor(k / 3) * 11} width="6" height="6" />
        ))}
        <rect className="gwt-w" x="269" y="90" width="10" height="10" />
      </>
    ),
  },
];

/** The three sources, as pictograms centred on 0,0: a mortarboard, a
 *  sealed certificate, an identity card. In `rows` order. */
const SOURCES = [
  {
    x: 110,
    icon: (
      <>
        <path d="M-8-1.5L0-5.5l8 4-8 4z" />
        <path d="M-4.5.5v3.2c0 1.4 2 2.3 4.5 2.3s4.5-.9 4.5-2.3V.5M8-1.5V3" />
      </>
    ),
  },
  {
    x: 160,
    icon: (
      <>
        <path d="M-7-6.5h14v9H-7zM-4-3.5h8M-4-.8h4.5" />
        <circle cx="3.5" cy="4.3" r="2.2" />
        <path d="M2.4 6.2L1.8 8.6l1.7-.8 1.7.8-.6-2.4" />
      </>
    ),
  },
  {
    x: 210,
    icon: (
      <>
        <rect x="-8" y="-5.5" width="16" height="11" rx="2" />
        <circle cx="-3.4" cy="-1.3" r="1.9" />
        <path d="M-6.4 3.3c.4-2.2 5.6-2.2 6 0M1.5-2h4.5M1.5 1h3.5" />
      </>
    ),
  },
];

/** Bottom-aligned, so every name sits the same height above its roof;
 *  two-word names take two lines to fit over their building. */
function Name({ x, s }: { x: number; s: string }) {
  const ls = lines(s);
  return (
    <text className="gwt-name" textAnchor="middle">
      {ls.map((l, k) => (
        <tspan key={k} x={x} y={23 - (ls.length - 1 - k) * 10}>{l}</tspan>
      ))}
    </text>
  );
}

export function ArtTrust({ t }: { t: T }) {
  const to = Object.values(t.to);
  const rows = Object.values(t.rows);
  return (
    <svg className="gwt gwt-min" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      {/* The ground, the soil the layer runs through, the bedrock. Wider
          than the frame, so any width of plate is filled edge to edge. */}
      <rect className="gwt-rock" x="-200" y="160" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="60" />
      <path className="gwt-strata" d="M-200 160H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{t.layer}</text>
      <text className="gwt-mono" x="6" y="183">{t.sources}</text>

      {/* The pipes, laid; lit once they have carried a check. */}
      {[...UP, ...DOWN].map((d) => <path key={d} className="gwt-pipe" pathLength={1} d={d} />)}
      {UP.map((d, i) => (
        <g key={d} className={`gwt-on-${i}`}>
          <path className="gwt-live" d={d} />
        </g>
      ))}
      <g className="gwt-on-s">
        {DOWN.map((d) => <path key={d} className="gwt-live-s" d={d} />)}
      </g>

      {/* The checks in flight: each building's question down, its answer
          up; the first one's trip on to the sources and back. */}
      {UP.map((d, i) => (
        <g key={d}>
          <path className={`gwt-pk gwt-rev ${ASK[i]}`} pathLength={1} d={d} />
          <path className={`gwt-pk ${ANSWER[i]}`} pathLength={1} d={d} />
        </g>
      ))}
      {DOWN.map((d) => (
        <g key={d}>
          <path className="gwt-pk gwt-d27" pathLength={1} d={d} />
          <path className="gwt-pk gwt-rev gwt-d33" pathLength={1} d={d} />
        </g>
      ))}

      {/* Each source, checked, and its tick underneath: the pass that goes
          back up. */}
      {SOURCES.map((s, i) => (
        <g key={s.x} transform={`translate(${s.x} 180)`}>
          <title>{rows[i]}</title>
          <circle className="gwt-src-o" r="11" />
          <g className="gw-ico">{s.icon}</g>
          <g className="gwt-on-s">
            <g className="gwt-pop gwt-d31 gwt-src-on">
              <circle r="11" />
              <g className="gw-ico">{s.icon}</g>
            </g>
            <g className={`gwt-pop ${PASS[i]}`}>
              <title>{t.k}</title>
              <Tick x={0} y={19} />
            </g>
          </g>
        </g>
      ))}

      {/* HelloVerify, and the pulse each time a check reaches it. */}
      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      {["gwt-d26", "gwt-d37", "gwt-d60", "gwt-d81", "gwt-d102"].map((c) => (
        <rect key={c} className={`gwt-ring ${c}`} x="114" y="120" width="92" height="28" rx="14" />
      ))}

      {BUILDINGS.map((b, i) => (
        <g key={b.x}>
          <g className="gwt-b">
            {b.body}
            <Name x={b.x} s={to[i]} />
          </g>
          <g className={`gwt-lit gwt-on-${i}`}>
            {b.body}
            <Name x={b.x} s={to[i]} />
            <g className={`gwt-pop ${LIT[i]}`}>
              <Tick x={b.badge[0]} y={b.badge[1]} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

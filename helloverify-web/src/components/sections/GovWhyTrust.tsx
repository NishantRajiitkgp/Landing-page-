/** 01 · Trust Infrastructure — the nation in cross-section (`./GovWhy`).

    Rebuilt 3 Oct 2026 on the founder's review: the record-and-pills drawing
    "doesn't tell any story". The copy's point is a contrast — a report is
    bought once per case; infrastructure is built once, sits underneath, and
    every regulated interaction runs on it. "Underpins" is taken literally:

    - above ground, four places a person passes through in a regulated life:
      the labour ministry, immigration, the health regulator, an employer;
    - under them, HelloVerify, the trust layer, piped up to every one;
    - at the bedrock, the primary sources: university, licensing council,
      identity registry.

    The 12 s loop: the layer is laid; a worker reaches the labour ministry
    and the check goes down through HelloVerify to the sources and back,
    which takes a while — and the verified record now lives in the layer.
    So at immigration (a plane leaves), the health regulator and the
    employer the same worker is cleared in a blink each, without going back
    to the sources. Then every pipe runs at once. The clock is in
    `govwhy.css` ("01 · TRUST"); this file only draws and names the parts.

    At rest — before the band is near, or under reduced motion — it is the
    last frame: all four lit, every pipe live. Decorative (`aria-hidden`):
    the plate's title and sentence say it in words. No inline styles: a
    one-shot's start is a `gwt-dNN` class (NN = tenths of a second). */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { Tick } from "./GovWhyArt";

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
  "M144 148V156Q144 160 140 160H114Q110 160 110 164V177",
  "M160 148V177",
  "M176 148V156Q176 160 180 160H206Q210 160 210 164V177",
];
/** When each building's question goes down, and its answer comes up. */
const ASK = ["gwt-d21", "gwt-d56", "gwt-d77", "gwt-d98"];
const ANSWER = ["gwt-d38", "gwt-d61", "gwt-d82", "gwt-d103"];
const LIT = ["gwt-d43", "gwt-d65", "gwt-d86", "gwt-d107"];

const BUILDINGS = [
  {
    x: 46,
    badge: [70, 53],
    body: (
      <>
        <path className="gwt-pole" d="M46 49V33" />
        <path className="gwt-a" d="M46 33h11l-2.5 3 2.5 3H46z" />
        <path className="gwt-o" d="M20 62L46 49L72 62Z" />
        <rect className="gwt-o" x="22" y="62" width="48" height="5" />
        {[26, 35, 44, 53, 62].map((x) => <rect key={x} className="gwt-o" x={x} y="67" width="4" height="27" />)}
        <rect className="gwt-o" x="18" y="94" width="56" height="3" />
        <rect className="gwt-o" x="15" y="97" width="62" height="3" />
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
        <rect className="gwt-w" x="100" y="71" width="9" height="7" rx="1" />
        <rect className="gwt-w" x="131" y="71" width="7" height="7" rx="1" />
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
        <circle className="gwt-o" cx="198" cy="72" r="9" />
        <path className="gwt-a" d="M196 66h4v4h4v4h-4v4h-4v-4h-4v-4h4z" />
        {[[178, 64], [211, 64], [178, 86], [211, 86]].map(([x, y]) => (
          <rect key={`${x}-${y}`} className="gwt-w" x={x} y={y} width="7" height="6" rx="1" />
        ))}
        <rect className="gwt-w" x="193" y="88" width="10" height="12" />
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
        {Array.from({ length: 18 }, (_, k) => (
          <rect key={k} className="gwt-w" x={261 + (k % 3) * 10} y={43 + Math.floor(k / 3) * 8} width="6" height="5" />
        ))}
        <rect className="gwt-w" x="269" y="91" width="10" height="9" />
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

export function ArtTrust({ t }: { t: T }) {
  const to = Object.values(t.to);
  const rows = Object.values(t.rows);
  return (
    <svg className="gwt" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="gwt-soil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path className="gwt-hatch" d="M0 0V7" />
        </pattern>
        <radialGradient id="gwt-glow">
          <stop offset="0" className="gwt-glow-a" />
          <stop offset="1" className="gwt-glow-b" />
        </radialGradient>
      </defs>

      {/* The ground, the soil the layer runs through, the bedrock. Wider
          than the frame, so any width of plate is filled edge to edge. */}
      <rect className="gwt-rock" x="-200" y="168" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="68" />
      <rect x="-200" y="100" width="720" height="68" fill="url(#gwt-soil)" />
      <path className="gwt-strata" d="M-200 168H520" />
      <path className="gwt-ground" d="M-200 100H520" />
      <circle cx="160" cy="134" r="78" fill="url(#gwt-glow)" />
      <text className="gwt-mono gwt-mono-hot" x="6" y="137">{t.layer}</text>
      <text className="gwt-mono" x="6" y="191">{t.sources}</text>

      {/* The pipes, laid; the current in each once it has carried a check;
          every pipe at once for the finale. */}
      {[...UP, ...DOWN].map((d) => (
        <g key={d}>
          <path className="gwt-pipe" pathLength={1} d={d} />
          <path className="gwt-pipe-in" pathLength={1} d={d} />
        </g>
      ))}
      {UP.map((d, i) => (
        <g key={d} className={`gwt-on-${i}`}>
          <path className="gwt-live" d={d} />
        </g>
      ))}
      <g className="gwt-on-s">
        {DOWN.map((d) => <path key={d} className="gwt-live-s" d={d} />)}
      </g>
      <g className="gwt-fin">
        {[...UP, ...DOWN].map((d) => <path key={d} className="gwt-rush" d={d} />)}
        <path className="gwt-glowline" d="M-200 100H520" />
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

      {SOURCES.map((s, i) => (
        <g key={s.x} transform={`translate(${s.x} 188)`}>
          <title>{rows[i]}</title>
          <circle className="gwt-src-o" r="11" />
          <g className="gw-ico">{s.icon}</g>
          <g className="gwt-on-s">
            <g className="gwt-pop gwt-d31 gwt-src-on">
              <circle r="11" />
              <g className="gw-ico">{s.icon}</g>
            </g>
          </g>
        </g>
      ))}

      {/* HelloVerify, the pulse each time a check reaches it, and the
          record it holds once the sources have answered. */}
      <g className="gwt-core-g">
        <rect className="gwt-core" x="114" y="120" width="92" height="28" rx="14" />
        <g transform="translate(127 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>
      {["gwt-d26", "gwt-d37", "gwt-d60", "gwt-d81", "gwt-d102"].map((c) => (
        <rect key={c} className={`gwt-ring ${c}`} x="114" y="120" width="92" height="28" rx="14" />
      ))}
      <g className="gwt-on-r">
        <path className="gwt-link" d="M206 134H216" />
        <g className="gwt-pop gwt-d37 gwt-rec">
          <title>{t.k}</title>
          <rect x="216" y="125" width="48" height="18" rx="6" />
          {[226, 240, 254].map((x) => <Tick key={x} x={x} y={134} />)}
        </g>
        {["gwt-d60", "gwt-d81", "gwt-d102"].map((c) => (
          <rect key={c} className={`gwt-ring ${c}`} x="216" y="125" width="48" height="18" rx="6" />
        ))}
      </g>

      {BUILDINGS.map((b, i) => (
        <g key={b.x}>
          <g className="gwt-b">
            {b.body}
            <text x={b.x} y="24" textAnchor="middle">{to[i]}</text>
          </g>
          <g className={`gwt-lit gwt-on-${i}`}>
            {b.body}
            <text x={b.x} y="24" textAnchor="middle">{to[i]}</text>
            <g className={`gwt-pop ${LIT[i]}`}>
              <Tick x={b.badge[0]} y={b.badge[1]} />
            </g>
          </g>
        </g>
      ))}

      <g transform="translate(146 44) rotate(-28)">
        <path
          className="gwt-plane"
          d="M-6.5-.9h9.2l3.3-.9c.9 0 1.5.4 1.5.9s-.6 1.1-1.5 1.1l-3.3-.2h-9.2zM-1.6-.9L-4.8-6h1.9l4.2 5.1zM-1.6.9L-4.8 6h1.9l4.2-5.1zM-6.5-.9l-1.4-2.6h1.3l2 2.6zM-6.5.9l-1.4 2.6h1.3l2-2.6z"
        />
      </g>

      {/* The worker: asked at each door, verified at the first and carrying
          it from then on. */}
      <g transform="translate(0 91)">
        <g className="gwt-me">
          <circle className="gwt-me-o" r="8" />
          <g className="gwt-me-i">
            <circle cy="-2.6" r="2.3" />
            <path d="M-4.2 4.6c.4-3.6 8-3.6 8.4 0" />
          </g>
          <g className="gwt-on-0">
            <circle className="gwt-me-ring" r="8" />
          </g>
          <g transform="translate(0 -16)">
            <g className="gwt-ask">
              <circle r="5.5" />
              <text y="2.5" textAnchor="middle">?</text>
            </g>
            <g className="gwt-ok">
              <Tick x={0} y={0} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

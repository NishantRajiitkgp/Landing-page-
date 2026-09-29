/** The six pictures of "Why governments … work with HelloVerify"
    (`./GovWhy`), one per reason, each a 280×140 line drawing on a light
    plate. Decorative: every one is `aria-hidden`, because the reason's title
    and body beside it say the same thing in words.

    EACH ONE LOOPS (29 Sep 2026, on review: "animation should be continuous").
    A picture builds, holds, and resets on a 6 s cycle, or — where the idea is
    flow rather than assembly — keeps moving: packets out along the AI
    platform's spokes, the thread through the authorities' marks, the dashes
    of the years to come. `govwhy.css` owns every keyframe; this file only
    places the parts and hands each its stagger on `--i`.

    STATIC BY DEFAULT. The resting markup is the finished drawing; the loops
    exist only under `.gw-go`, which `./GovWhyStage` adds once the grid is
    near the viewport, and they pause with the band's "Pause motion", when
    the grid is off screen, and under `prefers-reduced-motion` (which shows
    this final frame instead).

    `pathLength={1}` on every drawn stroke so one dash rule draws any of
    them, whatever its real length. */
import type { CSSProperties } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

type Viz = SectionsCopy["govWhy"]["viz"];
const d = (i: number) => ({ "--i": i }) as CSSProperties;

/** 01 · Trust Infrastructure — a civic portico: the steps, five columns
 *  rising in turn, the entablature and pediment drawn over them. */
export function ArtTrust() {
  const cols = [80, 107, 134, 161, 188];
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <path className="gw-build gw-dim" pathLength={1} d="M40 132h200M48 124h184M56 116h168" style={d(0)} />
      {cols.map((x, i) => (
        <rect key={x} className="gw-col" x={x} y="58" width="12" height="56" rx="1.5" style={d(i + 1)} />
      ))}
      <path className="gw-build" pathLength={1} d="M66 58h148v-8H66zM62 50 140 18l78 32z" style={d(6)} />
      <circle className="gw-beacon" cx="140" cy="38" r="4" style={d(8)} />
    </svg>
  );
}

/** 02 · Primary Source Verification at Scale — an applicant travels the
 *  line; each gate lights as they reach it, and the run starts over. Each
 *  gate has its own keyframes (`gwGate0`…`gwGate4` in the CSS) so all five
 *  reset together at the end of the run. */
export function ArtGates({ g }: { g: Viz["gates"] }) {
  const gates = Object.values(g);
  // 36–244, not 30–250: "Regulated role", centred on the last gate, touched
  // the edge of the 275px tablet box.
  const xs = [36, 88, 140, 192, 244];
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <path className="gw-line" d="M10 70h260" />
      <path className="gw-trail" pathLength={1} d="M36 70h208" />
      {xs.map((x, i) => (
        <g key={x} className="gw-gate">
          <circle className="gw-gate-o" cx={x} cy="70" r="11" />
          {/* One class per gate, not `.gw-gateN .gw-gate-on`: every loop
              rule stays at two classes, so the pause rule outranks it. */}
          <g className={`gw-gate-on gw-on${i}`}>
            <circle cx={x} cy="70" r="11" />
            <path d={`M${x - 4.5} 70.4l3 3 6-6.4`} />
          </g>
          <text x={x} y={i % 2 ? 104 : 44} textAnchor="middle">{gates[i]}</text>
        </g>
      ))}
      <circle className="gw-runner" cx="36" cy="70" r="5" />
    </svg>
  );
}

/** 03 · AI Powered Trust Platform — one core wired to the four kinds of
 *  party the body names, with packets flowing out along every spoke. */
export function ArtPlatform({ core, nodes }: { core: string; nodes: Viz["nodes"] }) {
  const n = Object.values(nodes);
  const at = [
    [48, 28],
    [232, 28],
    [232, 112],
    [48, 112],
  ];
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      {at.map(([x, y], i) => (
        <g key={i}>
          <path className="gw-spoke" d={`M140 70L${x} ${y}`} />
          <path className="gw-packet" pathLength={1} d={`M140 70L${x} ${y}`} style={d(i)} />
        </g>
      ))}
      {at.map(([x, y], i) => (
        <g key={n[i]} className="gw-node" style={d(i)}>
          <rect className="gw-pill" x={x - 44} y={y - 12} width="88" height="24" rx="12" />
          <text x={x} y={y + 4} textAnchor="middle">{n[i]}</text>
        </g>
      ))}
      <circle className="gw-ping" cx="140" cy="70" r="24" />
      <path className="gw-core" d="M140 44l22.5 13v26L140 96l-22.5-13V57z" />
      <text className="gw-core-t" x="140" y="75" textAnchor="middle">{core}</text>
    </svg>
  );
}

/** 04 · Governments We Work With — the four authorities' own marks (the
 *  seals band's files) floating on a flowing thread, a spotlight passing
 *  from one to the next. */
export function ArtGovs({ logos }: { logos: readonly string[] }) {
  const xs = [44, 108, 172, 236];
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <path className="gw-thread" pathLength={1} d="M4 82C40 60 70 60 108 72S200 88 276 60" />
      {xs.map((x, i) => (
        <g key={x} className="gw-float" style={d(i)}>
          <circle className="gw-spot" cx={x} cy="70" r="31" style={d(i)} />
          <circle className="gw-well" cx={x} cy="70" r="25" />
          <image href={logos[i]} x={x - 17} y="53" width="34" height="34" preserveAspectRatio="xMidYMid meet" />
        </g>
      ))}
    </svg>
  );
}

/** 05 · Long-Term Digital Infrastructure — a year axis: the record grows
 *  from 2018 to today, today's mark ripples, and the dashes of the years to
 *  come keep moving on. */
export function ArtTimeline({ since, today, ahead }: { since: string; today: string; ahead: string }) {
  const ticks = Array.from({ length: 13 }, (_, i) => 20 + i * 20);
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      {ticks.map((x, i) => (
        <path key={x} className="gw-tick" d={`M${x} ${i % 4 ? 66 : 60}v${i % 4 ? 8 : 20}`} />
      ))}
      <path className="gw-line" d="M20 70h240" />
      <path className="gw-grow" d="M20 70h160" />
      <path className="gw-ahead" pathLength={1} d="M188 70h72" />
      <circle className="gw-ripple" cx="180" cy="70" r="6" style={d(0)} />
      <circle className="gw-ripple" cx="180" cy="70" r="6" style={d(1)} />
      <circle className="gw-now" cx="180" cy="70" r="6" />
      <text className="gw-lab" x="20" y="104">{since}</text>
      {/* Above the axis: below it, "Today" ran into "Years to come". */}
      <text className="gw-lab gw-lab-hot" x="180" y="46" textAnchor="middle">{today}</text>
      <text className="gw-lab" x="260" y="104" textAnchor="end">{ahead}</text>
    </svg>
  );
}

/** 06 · Evidence-Backed Reports — the report writes its lines, the stamp
 *  lands on its corner, the three proofs arrive; then a fresh report. */
export function ArtReport({ stamp, proofs }: { stamp: string; proofs: Viz["proofs"] }) {
  const p = Object.values(proofs);
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <rect className="gw-doc" x="16" y="10" width="104" height="120" rx="7" />
      {[30, 44, 58, 72, 86].map((y, i) => (
        <path key={y} className="gw-write" pathLength={1} d={`M30 ${y}h${i === 0 ? 48 : i % 2 ? 76 : 64}`} style={d(i)} />
      ))}
      <g className="gw-stamp">
        <circle cx="100" cy="104" r="22" />
        <circle cx="100" cy="104" r="17.5" />
        <text x="100" y="106" textAnchor="middle">{stamp}</text>
      </g>
      {p.map((t, i) => (
        <g key={t} className="gw-proof" style={d(i)}>
          <rect x="138" y={22 + i * 36} width="130" height="26" rx="13" />
          <circle cx="152" cy={35 + i * 36} r="5" />
          <text x="164" y={39 + i * 36}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

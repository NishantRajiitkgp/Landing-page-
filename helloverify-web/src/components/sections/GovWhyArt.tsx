/** The six pictures of "Why governments … work with HelloVerify"
    (`./GovWhy`), one per reason, each a 280×140 line drawing on a light
    plate. Decorative: every one is `aria-hidden`, because the reason's title
    and body beside it say the same thing in words.

    EACH PICTURE SHOWS ITS REASON LITERALLY (1 Oct 2026, on the founder's
    review: the portico, the gates and the empty page were "just for the
    sake of having it"). Trust infrastructure is one verified record that
    every agency relies on; scale is the company's own numbers; the
    governments are their own official marks, untouched, beside their full
    names; the long
    term is the checks piling up since 2018; the report has a source, a
    result and remarks in it.

    EACH ONE LOOPS on a 6 s cycle, or keeps flowing. `govwhy.css` owns every
    keyframe; this file only places the parts and hands each its stagger on
    `--i`. STATIC BY DEFAULT: the resting markup is the finished drawing; the
    loops exist only under `.gw-go` (`./GovWhyStage`), pause with the band's
    control and off screen, and give way to this final frame under
    `prefers-reduced-motion`.

    `pathLength={1}` on every drawn stroke so one dash rule draws any of
    them, whatever its real length. */
import Image from "next/image";
import type { CSSProperties } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";

type Viz = SectionsCopy["govWhy"]["viz"];
const d = (i: number) => ({ "--i": i }) as CSSProperties;

function Tick({ x, y }: { x: number; y: number }) {
  return (
    <g className="gw-tickmark">
      <circle cx={x} cy={y} r="5.5" />
      <path d={`M${x - 2.4} ${y + 0.2}l1.6 1.6 3.2-3.4`} />
    </g>
  );
}

/** 01 · Trust Infrastructure — one verified record (degree, licence,
 *  identity) and the agencies that rely on it: the record is checked once,
 *  and the same answer flows out to every one of them. */
export function ArtTrust({ t }: { t: Viz["trust"] }) {
  const rows = Object.values(t.rows);
  const to = Object.values(t.to);
  const ys = [30, 70, 110];
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      {ys.map((y, i) => (
        <g key={y}>
          <path className="gw-spoke" d={`M112 70C140 70 140 ${y} 166 ${y}`} />
          <path className="gw-packet" pathLength={1} d={`M112 70C140 70 140 ${y} 166 ${y}`} style={d(i)} />
        </g>
      ))}
      <rect className="gw-doc" x="4" y="18" width="108" height="104" rx="9" />
      <text className="gw-lab gw-lab-hot gw-lab-s" x="14" y="38">{t.k}</text>
      {rows.map((r, i) => (
        <g key={r}>
          <Tick x={25} y={58 + i * 22} />
          <text x="36" y={61.5 + i * 22}>{r}</text>
        </g>
      ))}
      {to.map((a, i) => (
        <g key={a} className="gw-node" style={d(i)}>
          <rect className="gw-pill" x="166" y={ys[i] - 13} width="106" height="26" rx="13" />
          <text x="219" y={ys[i] + 3.5} textAnchor="middle">{a}</text>
        </g>
      ))}
    </svg>
  );
}

/** 02 · Primary Source Verification at Scale — the scale as the numbers:
 *  20M+ checks, 120+ countries, and a field of sources lighting up as each
 *  one confirms. */
export function ArtScale({ s }: { s: Viz["scale"] }) {
  const cols = 11;
  const dots = Array.from({ length: cols * 5 }, (_, k) => ({ x: 150 + (k % cols) * 11.5, y: 34 + Math.floor(k / cols) * 13, c: k % cols }));
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <text className="gw-big" x="10" y="64">{s.big}</text>
      <text x="12" y="84">{s.bigL}</text>
      <text className="gw-lab gw-lab-hot" x="12" y="102">{s.countries}</text>
      <text className="gw-small" x="12" y="120">{s.sources}</text>
      {dots.map((p, k) => (
        <circle key={k} className="gw-src" cx={p.x} cy={p.y} r="3.2" style={d(p.c)} />
      ))}
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

/** 04 · Governments We Work With — each authority's official mark beside
 *  its full name (the seals band's `name`). The marks are shown exactly as
 *  issued: whole, at their own proportions (`object-fit: contain`), full
 *  colour, never cropped to a circle, filtered or animated — 1 Oct 2026, on
 *  review: "don't mess with their logos". This one picture is HTML, not
 *  SVG, so the long names wrap. */
export function ArtGovs({ govs }: { govs: readonly { name: string; logo: string; w: number; h: number }[] }) {
  return (
    <ul className="gw-govs" aria-hidden="true">
      {govs.map((g) => (
        <li key={g.logo}>
          <span className="gw-govs-m">
            <Image src={g.logo} alt="" width={g.w} height={g.h} unoptimized />
          </span>
          <span className="gw-govs-n">{g.name}</span>
        </li>
      ))}
    </ul>
  );
}

/** 05 · Long-Term Digital Infrastructure — checks piling up since 2018:
 *  the curve climbs to today's 20M+, and the years to come keep going. */
export function ArtTimeline({ since, today, ahead }: { since: string; today: string; ahead: string }) {
  const curve = "M20 112C70 111 110 104 140 88S178 52 196 34";
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <path className="gw-line" d="M20 112h240" />
      <path className="gw-area" d={`${curve}V112H20Z`} />
      <path className="gw-build" pathLength={1} d={curve} />
      <path className="gw-ahead" pathLength={1} d="M200 31C222 18 240 12 262 8" />
      <circle className="gw-ripple" cx="196" cy="34" r="6" style={d(0)} />
      <circle className="gw-ripple" cx="196" cy="34" r="6" style={d(1)} />
      <circle className="gw-now" cx="196" cy="34" r="6" />
      <text className="gw-lab" x="20" y="130">{since}</text>
      <text className="gw-lab gw-lab-hot" x="184" y="30" textAnchor="end">{today}</text>
      <text className="gw-lab" x="260" y="130" textAnchor="end">{ahead}</text>
    </svg>
  );
}

/** 06 · Evidence-Backed Reports — a report with its source, result and
 *  remarks written in, the stamp landing on its corner, and the three
 *  proofs that come with it. */
export function ArtReport({ r, stamp, proofs }: { r: Viz["report"]; stamp: string; proofs: Viz["proofs"] }) {
  const p = Object.values(proofs);
  const rows = [r.r1, r.r2, r.r3];
  return (
    <svg className="gw-art" viewBox="0 0 280 140" aria-hidden="true" focusable="false">
      <rect className="gw-doc" x="4" y="8" width="154" height="124" rx="8" />
      <text className="gw-lab gw-lab-hot" x="16" y="28">{r.k}</text>
      <path className="gw-line" d="M16 36h130" />
      {rows.map((t, i) => (
        <g key={t} className="gw-row" style={d(i)}>
          <Tick x={21} y={52 + i * 19} />
          <text className="gw-small" x="32" y={55.5 + i * 19}>{t}</text>
        </g>
      ))}
      <g className="gw-stamp">
        <circle cx="134" cy="112" r="16" />
        <circle cx="134" cy="112" r="12.5" />
        <text x="134" y="114" textAnchor="middle">{stamp}</text>
      </g>
      {p.map((t, i) => (
        <g key={t} className="gw-proof" style={d(i)}>
          <rect x="166" y={22 + i * 36} width="108" height="26" rx="13" />
          <circle cx="179" cy={35 + i * 36} r="4.5" />
          <text x="189" y={38.5 + i * 36}>{t}</text>
        </g>
      ))}
    </svg>
  );
}

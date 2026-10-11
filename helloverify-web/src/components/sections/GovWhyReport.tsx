/** 06 · Evidence-Backed Reports — the last chapter (`./GovWhy`).

    Same kit, same 12 s beat. Rebuilt 11 Oct 2026 to land as the film's
    ending. The paragraph names three proofs and what they are for, and
    each is drawn as itself. The auditable trail is the line HelloVerify
    runs underground, every step on it stamped with a time, down to the
    registrar at the bedrock and back. The verification artifact is the
    certificate on the report, scanned until its seal is found. The clear
    remarks write themselves in, row by row. When the trail reaches the
    report, VERIFIED slams down and the sheet takes the blow. Then the
    reason it was all for: the client's cursor comes in and approves —
    confident decision making. Clock: `govwhy.css` "06 · REPORT". At
    rest: every step lit, the report full, stamped, approved. */
import { Logo } from "@/components/brand/Logo";
import type { SectionsCopy } from "@/lib/copy/sections";

import { Tick } from "./GovWhyArt";

type V = SectionsCopy["govWhy"]["viz"];

const Y = 134;
const TRAIL = `M100 ${Y}H292Q296 ${Y} 296 ${Y - 4}V93`;
const DIP = `M200 ${Y}V173`;
/** The trail's steps, each with the time it was logged. */
const STEPS = [
  { x: 140, k: "s1", at: "09:12" },
  { x: 200, k: "s2", at: "14:05" },
  { x: 260, k: "s3", at: "14:20" },
] as const;
const ROWS = ["r1", "r3", "r2"] as const;
const ROW_Y = [48, 62, 76];
const ROW_TICK = ["gwt-d47", "gwt-d53", "gwt-d58"];
const STAMP = { x: 262, y: 46 };
const RAYS = Array.from({ length: 8 }, (_, k) => {
  const a = ((22.5 + k * 45) * Math.PI) / 180;
  const p = (r: number) => `${(STAMP.x + r * Math.cos(a)).toFixed(1)} ${(STAMP.y + r * Math.sin(a)).toFixed(1)}`;
  return `M${p(25)}L${p(31)}`;
});
const BTN = { x: 226, y: 70, w: 72, h: 16 };

function Registry() {
  return <path d="M-6 5.2H6M-5 3V-1.6M-1.7 3V-1.6M1.7 3V-1.6M5 3V-1.6M-6-3.2 0-6.4 6-3.2z" />;
}

function Certificate() {
  return (
    <g className="gwr-cert">
      <rect x="22" y="40" width="62" height="46" rx="2" />
      <rect className="gwr-cert-in" x="25" y="43" width="56" height="40" rx="1" />
      <path className="gwr-cert-h" d="M38 51H68" />
      <path d="M32 58H74M32 64H66M30 77c2.4-3.6 4.2 1.6 6.4-.8s3.4.8 5.6-.4" />
      <circle cx="72" cy="75" r="5.6" />
      <circle cx="72" cy="75" r="3.2" />
    </g>
  );
}

export function ArtReport({ report, stamp, proofs, audit }: {
  report: V["report"];
  stamp: string;
  proofs: V["proofs"];
  audit: V["audit"];
}) {
  return (
    <svg className="gwt gwt-min gwr" viewBox="0 0 320 210" aria-hidden="true" focusable="false">
      <rect className="gwt-rock" x="-200" y="160" width="720" height="240" />
      <rect className="gwt-soil" x="-200" y="100" width="720" height="60" />
      <path className="gwt-strata" d="M-200 160H520" />
      <path className="gwt-ground" d="M-200 100H520" />

      {/* The auditable trail: out of HelloVerify, down to the issuer and
          back, every step logged, and up into the report. */}
      <text className="gwt-mono gwt-mono-hot" x="8" y="113">{proofs.p3}</text>
      <path className="gwt-pipe" pathLength={1} d={TRAIL} />
      <path className="gwt-pipe" pathLength={1} d={DIP} />
      <g className="gwr-on-1"><path className="gwt-live" d="M100 134H140" /></g>
      <g className="gwr-on-i">
        <path className="gwt-live" d="M140 134H200" />
        <path className="gwt-live" d={DIP} />
      </g>
      <g className="gwr-on-3"><path className="gwt-live" d="M200 134H260" /></g>
      <g className="gwr-on-4"><path className="gwt-live" d="M260 134H292Q296 134 296 130V93" /></g>
      <path className="gwt-pk gwt-d12" pathLength={1} d="M100 134H140" />
      <path className="gwt-pk gwt-d18" pathLength={1} d="M140 134H200V173" />
      <path className="gwt-pk gwt-rev gwt-d26" pathLength={1} d={DIP} />
      <path className="gwt-pk gwt-d62" pathLength={1} d="M200 134H260" />
      <path className="gwt-pk gwt-d68" pathLength={1} d="M260 134H292Q296 134 296 130V93" />

      {STEPS.map((s, i) => (
        <g key={s.k}>
          <text className="gwr-step" x={s.x} y="121" textAnchor="middle">{audit[s.k]}</text>
          <text className="gwt-mono gwr-time" x={s.x} y="128.5" textAnchor="middle">{s.at}</text>
          <circle className="gwr-dot" cx={s.x} cy={Y} r="3.2" />
          <circle className={`gwr-dot gwr-dot-on gwr-on-${i + 1}`} cx={s.x} cy={Y} r="3.2" />
        </g>
      ))}

      <g className="gwt-core-g">
        <rect className="gwt-core" x="8" y="120" width="92" height="28" rx="14" />
        <g transform="translate(21 124.5)">
          <Logo width={66} height={19} />
        </g>
      </g>

      {/* The primary source, at the bedrock. */}
      <circle className="gwt-src-o" cx="200" cy="184" r="11" />
      <g className="gw-ico" transform="translate(200 184)"><Registry /></g>
      <g className="gwt-src-on gwr-on-i">
        <circle cx="200" cy="184" r="11" />
        <g className="gw-ico" transform="translate(200 184)"><Registry /></g>
      </g>
      <path className="gwt-ring gwt-d23" d="M200 173a11 11 0 1 1 0 22a11 11 0 1 1 0-22z" />
      <text className="gwr-step" x="216" y="187">{audit.issuer}</text>

      {/* The report. */}
      <g className="gwr-sheet">
        <rect className="gwr-paper" x="10" y="5" width="300" height="88" rx="6" />
        <text className="gwr-title" x="22" y="18">{report.k}</text>
        <path className="gwr-rule" d="M22 24H298" />

        {/* The artifact: scanned, and its seal found. */}
        <text className="gwt-mono gwr-head" x="22" y="34">{proofs.p2}</text>
        <Certificate />
        <g className="gwr-scan">
          <rect x="22" y="40" width="62" height="4" />
          <path d="M22 44H84" />
        </g>
        <g className="gwr-find">
          <rect x="63.5" y="66" width="17" height="18" rx="3" />
          <g className="gwt-pop gwt-d42">
            <Tick x={84} y={66} />
          </g>
        </g>

        {/* The remarks, written in. */}
        <text className="gwt-mono gwr-head" x="106" y="34">{proofs.p1}</text>
        {ROWS.map((r, i) => (
          <g key={r}>
            <text className="gwr-line" x="120" y={ROW_Y[i]}>{report[r]}</text>
            <rect className={`gwr-wipe gwr-w${i}`} x="116" y={ROW_Y[i] - 8} width="106" height="11" />
            <g className={`gwr-r${i}`}>
              <g className={`gwt-pop ${ROW_TICK[i]}`}>
                <Tick x={110} y={ROW_Y[i] - 2.6} />
              </g>
            </g>
          </g>
        ))}

        {/* The decision. */}
        <rect className="gwr-btn" x={BTN.x} y={BTN.y} width={BTN.w} height={BTN.h} rx="8" />
        <text className="gwr-btn-t" x={BTN.x + BTN.w / 2} y={BTN.y + 10.8} textAnchor="middle">{audit.ask}</text>
        <g className="gwr-ok">
          <rect x={BTN.x} y={BTN.y} width={BTN.w} height={BTN.h} rx="8" />
          <text x={BTN.x + BTN.w / 2} y={BTN.y + 10.8} textAnchor="middle">{audit.done}</text>
        </g>
        <rect className="gwt-ring gwt-d93" x={BTN.x} y={BTN.y} width={BTN.w} height={BTN.h} rx="8" />

        {/* VERIFIED. */}
        <g className="gwr-rays">
          {RAYS.map((d) => <path key={d} d={d} />)}
        </g>
        <circle className="gwt-ring gwt-d73" cx={STAMP.x} cy={STAMP.y} r="21" />
        <g className="gwr-stamp">
          <circle cx={STAMP.x} cy={STAMP.y} r="20" />
          <circle cx={STAMP.x} cy={STAMP.y} r="16.5" />
          <text x={STAMP.x} y={STAMP.y + 1.8} textAnchor="middle">{stamp}</text>
        </g>
      </g>

      {/* The client's hand. */}
      <g transform={`translate(${BTN.x + BTN.w / 2 + 6} ${BTN.y + 9})`}>
        <g className="gwr-cur">
          <path d="M0 0V11.5l3-2.7 2.1 4.7 2.1-.9-2.1-4.6H9.2z" />
        </g>
      </g>
    </svg>
  );
}

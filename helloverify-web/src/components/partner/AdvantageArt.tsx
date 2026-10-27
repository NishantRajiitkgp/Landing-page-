/** `/partner-with-us`: one small drawing per programme advantage, all on the
 *  same 200 × 120 stage so no advantage outweighs another. Artwork only —
 *  the card's heading and paragraph carry the meaning. Motion lives in
 *  `app/v2/partner.css` under `.pw-advs[data-in]`; every drawing's resting
 *  state is its finished state, so no-JS and reduced motion see it whole. */
import type { ReactNode } from "react";
import { d, type PartnerCopy } from "./partnerParts";

type Art = PartnerCopy["advantages"]["art"];
export type AdvKey = keyof PartnerCopy["advantages"]["items"];

function Stage({ k, flip, children }: { k: AdvKey; flip?: boolean; children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 120" className={`pa pa-${k}${flip ? " pa-flip" : ""}`} aria-hidden="true">
      {children}
    </svg>
  );
}

/** A client's fee as a whole, and the partner's 15% slice pulled out of it. */
function Commission({ a }: { a: Art }) {
  return (
    <Stage k="commission">
      <path className="pa-sheet" d="M88 62 117.1 40.8A36 36 0 1 1 88 26z" />
      <path className="pa-slice" d="M88 62V26a36 36 0 0 1 29.1 14.8z" />
      <path className="pa-lead" d="M118 30h18" />
      <text className="pa-num pa-num-s" x="142" y="37">{a.rate}</text>
    </Stage>
  );
}

/** Three of a client's checks orbiting, each pass another credit. */
function Recurring() {
  return (
    <Stage k="recurring">
      <circle className="pa-ring" cx="100" cy="60" r="38" />
      <g className="pa-orbit">
        <circle className="pa-dot" cx="100" cy="22" r="7" />
        <circle className="pa-dot pa-dot-2" cx="133" cy="79" r="7" />
        <circle className="pa-dot pa-dot-3" cx="67" cy="79" r="7" />
      </g>
      <circle className="pa-hub" cx="100" cy="60" r="17" />
      <path className="pa-plus" d="M100 52v16M92 60h16" />
    </Stage>
  );
}

/** Earnings climbing through a ceiling that is not there. */
function Unlimited() {
  return (
    <Stage k="unlimited" flip>
      <path className="pa-cap" d="M18 44h104M146 44h36" />
      <path className="pa-rise" pathLength={1} d="M22 100 58 90l30-12 30-24 30-26 26-14" />
      <path className="pa-tip" d="M164 12h14v14" />
    </Stage>
  );
}

/** A price tag that reads nothing to pay. */
function Zero({ a }: { a: Art }) {
  return (
    <Stage k="zero">
      <path className="pa-string" d="M128 56c6-18 14-28 30-36" />
      <g className="pa-tag">
        <path className="pa-sheet" d="M62 34h62l22 26-22 26H62a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8z" />
        <circle className="pa-hole" cx="128" cy="60" r="4" />
        <text className="pa-num" x="90" y="71" textAnchor="middle">{a.free}</text>
      </g>
    </Stage>
  );
}

/** Referrals ticked off at an uneven pace, and the target struck out. */
function Minimum() {
  const at = [34, 62, 112];
  return (
    <Stage k="minimum" flip>
      <path className="pa-track" d="M20 76h124" />
      <path className="pa-track pa-track-off" d="M150 76h30" />
      {at.map((x, i) => (
        <g key={x} className="pa-step" style={d(i)}>
          <circle className="pa-dot" cx={x} cy="76" r="9" />
          <path className="pa-tick" d={`M${x - 4} 76l3 3 5-6`} />
        </g>
      ))}
      <g className="pa-flag">
        <path className="pa-line" d="M166 76V36" />
        <path className="pa-pennant" d="M166 36h18l-6 7 6 7h-18z" />
      </g>
      <path className="pa-strike" pathLength={1} d="M152 30l36 52" />
    </Stage>
  );
}

/** One statement: every row ticked, the total underneath. */
function Transparent() {
  const rows = [32, 48, 64];
  return (
    <Stage k="transparent" flip>
      <rect className="pa-sheet" x="54" y="12" width="92" height="96" rx="10" />
      {rows.map((y, i) => (
        <g key={y} className="pa-row" style={d(i)}>
          <path className="pa-line" pathLength={1} d={`M68 ${y}h46`} />
          <path className="pa-tick pa-tick-ink" d={`M124 ${y}l3 3 6-7`} />
        </g>
      ))}
      <path className="pa-rule" d="M68 80h64" />
      <rect className="pa-total" x="68" y="88" width="38" height="7" rx="3.5" />
      <rect className="pa-total pa-total-ink" x="116" y="88" width="16" height="7" rx="3.5" />
    </Stage>
  );
}

/** A catalogue lighting up, cell by cell. */
function Wider({ a }: { a: Art }) {
  const cells = Array.from({ length: 18 }, (_, i) => i);
  return (
    <Stage k="wider">
      {cells.map((i) => (
        <rect
          key={i}
          className={`pa-cell${i % 4 === 1 ? " pa-cell-on" : ""}`}
          style={d(i)}
          x={43 + (i % 6) * 20}
          y={14 + Math.floor(i / 6) * 20}
          width="14"
          height="14"
          rx="4"
        />
      ))}
      <text className="pa-num pa-num-s" x="100" y="106" textAnchor="middle">{a.more}</text>
    </Stage>
  );
}

/** A shield the four kinds of client already stand behind. */
function Credibility() {
  const sats: readonly [number, number][] = [[36, 30], [164, 30], [36, 90], [164, 90]];
  return (
    <Stage k="credibility">
      {sats.map(([x, y], i) => (
        <path key={`l${i}`} className="pa-link" pathLength={1} style={d(i)} d={`M${x} ${y}L${x < 100 ? 78 : 122} ${y < 60 ? 46 : 74}`} />
      ))}
      {sats.map(([x, y], i) => (
        <g key={`s${i}`} className="pa-sat" style={d(i)}>
          <circle className="pa-sheet" cx={x} cy={y} r="11" />
          <circle className="pa-dot" cx={x} cy={y} r="4" />
        </g>
      ))}
      <path className="pa-shield" d="M100 28l26 10v20c0 16-11 26-26 31-15-5-26-15-26-31V38z" />
      <path className="pa-tick pa-tick-ink pa-seal" pathLength={1} d="M89 59l8 8 15-16" />
    </Stage>
  );
}

export function AdvantageArt({ k, a }: { k: AdvKey; a: Art }) {
  switch (k) {
    case "commission": return <Commission a={a} />;
    case "recurring": return <Recurring />;
    case "unlimited": return <Unlimited />;
    case "zero": return <Zero a={a} />;
    case "minimum": return <Minimum />;
    case "transparent": return <Transparent />;
    case "wider": return <Wider a={a} />;
    case "credibility": return <Credibility />;
  }
}

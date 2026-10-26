/** The parts the `/technology` future-of-trust scene is drawn from
    (`./TechFuture`): a place on its 800 × 700 board, a word over it, a
    ride along a curve, the four organisations' buildings and a node of
    the network. Shading is the trust road's (`./TechRoadKit`'s `gr`, its
    gradients drawn once by `./TechRoad`), and parts arrive and follow the
    build as the road's do (`on`, `run`), against the act they sit in. */
import type { CSSProperties, ReactNode } from "react";
import { Glyph, n } from "./TechPillarKit";
import { Coin, Tick, gr, on, run } from "./TechRoadKit";
import { pc, type Pt, type Quad } from "./techFuturePlan";

/** Something placed at board point `p`, centred there, `w` units wide, bobbing on phase `ph`. */
export function At({ p, w, ph = 0, cls = "", vars, children }: { p: Pt; w?: number; ph?: number; cls?: string; vars?: Record<string, number | string>; children: ReactNode }) {
  const style: Record<string, number | string> = { ...pc(p), "--ph": ph, ...vars };
  if (w) style["--pw"] = n(w / 8);
  return (
    <div className={`tk-ft-at ${cls}`} style={style as CSSProperties}>
      {children}
    </div>
  );
}

/** A word over the board at `p`, arriving once the build passes `at`. */
export function Word({ p, at, tone, children }: { p: Pt; at: number; tone?: "ok"; children: ReactNode }) {
  return (
    <span className={`tk-rd-p tk-rd-pop tk-rd-chip${tone ? ` tk-rd-chip-${tone}` : ""}`} style={on(at, pc(p))}>
      {tone && (
        <svg className="tk-rd-mk" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="8" />
          <path d="M4.6 8.3l2.3 2.3 4.6-4.9" />
        </svg>
      )}
      {children}
    </span>
  );
}

/** A part riding `q` from `t0` over `td` of the build. */
export const ride = (t0: number, td: number, q: Quad) =>
  run(t0, td, { "--x0": q.x0, "--y0": q.y0, "--x1": q.x1, "--y1": q.y1, "--x2": q.x2, "--y2": q.y2 });

const COLS = [14, 32, 50, 72, 90, 108];

/** A government: a domed capitol under its flag, on a 132 × 124 box. */
export function Capitol() {
  return (
    <>
      <path className="tk-rd-post" d="M66 3v17" />
      <path d="M67 4h17l-4 5 4 5H67z" fill={gr("red")} />
      <rect x="61" y="19" width="10" height="8" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
      <path d="M38 51a28 25 0 0 1 56 0z" fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-lnh" d="M53 50c0-13 5-21 13-23M79 50c0-13-5-21-13-23M66 27v23" />
      <rect x="40" y="50" width="52" height="11" fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-ink2 tk-rd-faint" d="M47 53h4v5h-4zM57 53h4v5h-4zM71 53h4v5h-4zM81 53h4v5h-4z" />
      <rect className="tk-rd-hairf" x="12" y="70" width="108" height="36" />
      {COLS.map((x) => (
        <g key={x}>
          <rect x={x} y="70" width="10" height="36" fill={gr("card")} className="tk-rd-edge" />
          <path className="tk-rd-lnh" d={`M${x + 3.5} 72v32M${x + 6.5} 72v32`} />
        </g>
      ))}
      <rect x="6" y="61" width="120" height="10" rx="2" fill={gr("card")} className="tk-rd-edge" />
      <rect className="tk-rd-red" x="6" y="61" width="120" height="3" rx="1.5" />
      <rect x="8" y="106" width="116" height="7" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
      <rect x="3" y="113" width="126" height="8" rx="2" fill={gr("card")} className="tk-rd-edge" />
    </>
  );
}

const lit = (r: number, c: number) => (r * 3 + c * 5) % 7 === 2;

/** An enterprise: a glass tower, its side receding, on a 112 × 150 box. */
export function Tower() {
  return (
    <>
      <path className="tk-rd-post" d="M54 3v19" />
      <circle cx="54" cy="4" r="3.4" className="tk-rd-red" />
      <path className="tk-rd-ft" d="M6 32l26-12h74l-26 12z" />
      <rect x="6" y="32" width="74" height="9" fill={gr("red")} />
      <path className="tk-rd-redk" d="M80 32l26-12v9l-26 12z" />
      <rect x="6" y="41" width="74" height="105" fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-side" d="M80 41l26-12v105l-26 12z" />
      {Array.from({ length: 36 }, (_, i) => {
        const r = Math.floor(i / 4);
        const c = i % 4;
        return <rect key={i} className={lit(r, c) ? "tk-rd-tint" : undefined} fill={lit(r, c) ? undefined : gr("glass")} x={12 + c * 17} y={n(48 + r * 9.6)} width="12" height="6.4" rx="1.2" />;
      })}
      <path className="tk-rd-sidewin" d={Array.from({ length: 9 }, (_, r) => `M85 ${n(46 + r * 9.6)}l16-7.4v5.6l-16 7.4z`).join("")} />
      <rect x="29" y="128" width="28" height="4" fill={gr("red")} />
      <rect x="33" y="132" width="20" height="14" className="tk-rd-ink2" />
    </>
  );
}

/** A bank: a pediment with a coin in it, on a 132 × 112 box. */
export function Bank() {
  return (
    <>
      <rect className="tk-rd-hairf" x="10" y="45" width="112" height="47" />
      {[14, 40, 80, 106].map((x) => (
        <g key={x}>
          <rect x={x} y="45" width="12" height="47" fill={gr("card")} className="tk-rd-edge" />
          <path className="tk-rd-lnh" d={`M${x + 4} 47v43M${x + 8} 47v43`} />
        </g>
      ))}
      <rect x="57" y="60" width="18" height="32" rx="1.5" className="tk-rd-ink2" />
      <path d="M6 36 66 7l60 29z" fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-lnh" d="M26 32 66 13l40 19z" />
      <g transform="translate(55.5 13.5) scale(.52)">
        <Coin />
      </g>
      <rect x="3" y="36" width="126" height="9" rx="2" fill={gr("card")} className="tk-rd-edge" />
      <rect className="tk-rd-red" x="3" y="42" width="126" height="3" />
      <rect x="6" y="92" width="120" height="8" rx="1.5" fill={gr("card")} className="tk-rd-edge" />
      <rect x="1" y="100" width="130" height="9" rx="2" fill={gr("card")} className="tk-rd-edge" />
    </>
  );
}

/** A hospital: a block with a red cross on its face, on a 122 × 124 box. */
export function Hospital() {
  return (
    <>
      <path className="tk-rd-ft" d="M6 36l28-14h82l-28 14z" />
      <rect x="6" y="36" width="82" height="7" fill={gr("red")} />
      <path className="tk-rd-redk" d="M88 36l28-14v7l-28 14z" />
      <rect x="6" y="43" width="82" height="78" fill={gr("card")} className="tk-rd-edge" />
      <path className="tk-rd-side" d="M88 43l28-14v78l-28 14z" />
      <circle cx="47" cy="63" r="13" className="tk-rd-white tk-rd-edge" />
      <path className="tk-rd-red" d="M44 54h6v6h6v6h-6v6h-6v-6h-6v-6h6z" />
      {[0, 1, 2].flatMap((c) => [0, 1].map((r) => <rect key={`${c}${r}`} fill={gr("glass")} x={16 + c * 24} y={84 + r * 13} width="14" height="8" rx="1.2" />))}
      <path className="tk-rd-sidewin" d="M93 50l18-8.4v8l-18 8.4zM93 68l18-8.4v8l-18 8.4zM93 86l18-8.4v8l-18 8.4z" />
      <rect x="38" y="106" width="18" height="15" className="tk-rd-ink2" />
    </>
  );
}

/** A node of the network at `p`: waiting in outline until its trace
    reaches it at `t`, then lit, ticked and rippling. A `far` node stays
    in outline, out of focus. Its parts are drawn about the node, so they
    scale about themselves as they arrive. */
export function Tile({ p, g, t, far }: { p: Pt; g: string; t: number; far?: boolean }) {
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <g className={far ? "tk-rd-p tk-ft-far" : undefined} style={far ? on(t) : undefined}>
        <rect className="tk-ft-tile-off" x="-19" y="-19" width="38" height="38" rx="10" />
        <Glyph g={g} x={0} y={0} s={0.72} cls="tk-ic tk-ic-m" />
      </g>
      {!far && (
        <>
          <g className="tk-rd-p tk-rd-pop" style={on(t)}>
            <ellipse cx="0" cy="29" rx="17" ry="4" fill={gr("shade")} />
            <rect x="-19" y="-15" width="38" height="38" rx="10" className="tk-rd-hair" />
            <rect x="-19" y="-19" width="38" height="38" rx="10" fill={gr("card")} className="tk-rd-edge" />
            <Glyph g={g} x={0} y={0} s={0.72} cls="tk-ic tk-ic-r" />
          </g>
          <circle className="tk-rd-t tk-rd-ripple" style={run(t, 0.08)} r="22" />
          <Tick x={15} y={-15} r={6.5} at={t + 0.02} />
        </>
      )}
    </g>
  );
}

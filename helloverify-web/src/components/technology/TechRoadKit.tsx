/** The parts the `/technology` trust road's stops are drawn from
    (`./TechRoadPeople`, `./TechRoadTrade`, `./TechRoadWorld`).

    A stop is a board, 600 × 460 units, with nothing under it: its pieces
    float. Each `Piece` is placed in board units at a depth `z`, so pieces
    part like layers as the camera arrives and leaves (`--v`, `--w`), bob a
    little as the reader scrolls (`--fl`), and cast a soft shadow below.
    The road comes in at the board's in port, streams into the stop's hero
    at `hub` and out the far side to the out port. A part arrives once the
    stop's build, `--b`, passes its `--at` (`on`); a few follow the build
    continuously through `--t` instead (`run`). Shading comes from one set
    of gradients (`RoadDefs`, `gr`). Words are chips laid over the board, so
    they never mirror with it. All of it is decoration: each stop's copy
    sits beside it. */
import type { CSSProperties, ReactNode } from "react";
import { n } from "./TechPillarKit";

export type Pt = [number, number];
type Vars = Record<string, number | string>;

/** A part that arrives once the build passes `s`. */
export const on = (s: number, more: Vars = {}) => ({ "--at": s, ...more }) as CSSProperties;
/** A part that follows the build from `t0` over `td`, as `--t` 0…1. */
export const run = (t0: number, td: number, more: Vars = {}) => ({ "--t0": t0, "--td": td, ...more }) as CSSProperties;

type Grad = "red" | "ink" | "card" | "steel" | "disc" | "glass" | "ok" | "glow" | "okglow" | "sphere" | "shade";
/** One of the road's shared gradients. */
export const gr = (k: Grad) => `url(#tk-rd-g-${k})`;

const lin = (id: Grad, stops: [string, number][]) => (
  <linearGradient id={`tk-rd-g-${id}`} x1="0" y1="0" x2="0" y2="1">
    {stops.map(([c, o]) => (
      <stop key={c} className={c} offset={o} />
    ))}
  </linearGradient>
);
const rad = (id: Grad, stops: [string, number][], cx = 0.5, cy = 0.5, r = 0.5) => (
  <radialGradient id={`tk-rd-g-${id}`} cx={cx} cy={cy} r={r}>
    {stops.map(([c, o]) => (
      <stop key={c} className={c} offset={o} />
    ))}
  </radialGradient>
);

/** The gradients every stop shades with, once per page. Kept out of
    `display: none` so the boards can use them with no script too. */
export function RoadDefs() {
  return (
    <svg className="tk-rd-defs" aria-hidden="true" focusable="false">
      <defs>
        {lin("red", [["tk-rd-c-red0", 0], ["tk-rd-c-red1", 1]])}
        {lin("ink", [["tk-rd-c-ink0", 0], ["tk-rd-c-ink1", 1]])}
        {lin("card", [["tk-rd-c-card0", 0], ["tk-rd-c-card1", 1]])}
        {lin("steel", [["tk-rd-c-st0", 0], ["tk-rd-c-st1", 0.55], ["tk-rd-c-st2", 1]])}
        {lin("glass", [["tk-rd-c-gl0", 0], ["tk-rd-c-gl1", 1]])}
        {lin("ok", [["tk-rd-c-ok0", 0], ["tk-rd-c-ok1", 1]])}
        {rad("disc", [["tk-rd-c-st0", 0], ["tk-rd-c-st1", 0.6], ["tk-rd-c-st2", 1]], 0.38, 0.32, 0.8)}
        {rad("glow", [["tk-rd-c-glow0", 0], ["tk-rd-c-glow1", 1]])}
        {rad("okglow", [["tk-rd-c-okg0", 0], ["tk-rd-c-okg1", 1]])}
        {rad("sphere", [["tk-rd-c-sp0", 0], ["tk-rd-c-sp1", 0.45], ["tk-rd-c-sp2", 0.82], ["tk-rd-c-sp3", 1]], 0.36, 0.3, 0.8)}
        {rad("shade", [["tk-rd-c-sh0", 0], ["tk-rd-c-sh1", 1]])}
      </defs>
    </svg>
  );
}

/** A tick in a green disc, or a cross in a red one; pops in at `at`, if given. */
export function Tick({ x, y, r = 8, at, bad }: { x: number; y: number; r?: number; at?: number; bad?: boolean }) {
  const k = r / 8;
  const d = bad
    ? `M${n(x - 3 * k)} ${n(y - 3 * k)}l${n(6 * k)} ${n(6 * k)}M${n(x + 3 * k)} ${n(y - 3 * k)}l${n(-6 * k)} ${n(6 * k)}`
    : `M${n(x - 3.6 * k)} ${n(y + 0.2 * k)}l${n(2.4 * k)} ${n(2.4 * k)} ${n(4.8 * k)} ${n(-5 * k)}`;
  return (
    <g className={`${at === undefined ? "" : "tk-rd-p tk-rd-pop "}tk-rd-tick${bad ? " tk-rd-tick-bad" : ""}`} style={at === undefined ? undefined : on(at)}>
      <circle cx={n(x)} cy={n(y)} r={r} />
      <path className="tk-uf" d={d} />
    </g>
  );
}

/** A word over the board at board point (`x`, `y`). */
export function Chip({ x, y, at, tone, fixed, children }: { x: number; y: number; at: number; tone?: "ok" | "bad"; fixed?: boolean; children: string }) {
  return (
    <span className={`tk-rd-p tk-rd-pop tk-rd-chip${tone ? ` tk-rd-chip-${tone}` : ""}${fixed ? " tk-rd-fixed" : ""}`} style={on(at, { "--x": n(x / 6), "--y": n(y / 4.6) })}>
      {tone && (
        <svg className="tk-rd-mk" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="8" />
          <path d={tone === "bad" ? "M5.5 5.5l5 5M10.5 5.5l-5 5" : "M4.6 8.3l2.3 2.3 4.6-4.9"} />
        </svg>
      )}
      {children}
    </span>
  );
}

/** One floating piece: its own drawing (`vb`) placed at board point
    (`x`, `y`), `w` units wide, at depth `z` (1 is the hero's plane, more is
    nearer). It arrives as `a` once the build passes `at`, bobs on phase
    `ph`, and is turned `rot` degrees. A `fixed` piece keeps its place on
    the page under `dir="rtl"`, for things pinned to a map. */
export function Piece({ x, y, w, vb, at, z = 1, ph = 0, rot = 0, a = "rise", sh = true, bob = 5, fixed, children }: {
  x: number; y: number; w: number; vb: string; at: number; z?: number; ph?: number; rot?: number; a?: string; sh?: boolean; bob?: number; fixed?: boolean; children: ReactNode;
}) {
  return (
    <div className={fixed ? "tk-rd-pc tk-rd-fixed" : "tk-rd-pc"} style={{ "--x": n(x / 6), "--y": n(y / 4.6), "--pw": n(w / 6), "--z": z, "--ph": ph, "--rot": rot, "--bob": `${bob}px` } as CSSProperties}>
      <div className={`tk-rd-p tk-rd-${a}`} style={on(at)}>
        {sh && <i className="tk-rd-pc-sh" />}
        <svg className="tk-rd-pc-in tk-mirror" viewBox={vb} fill="none" aria-hidden="true">
          {children}
        </svg>
      </div>
    </div>
  );
}

const LANES = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
/** The ports the world's road meets, in board units. */
const IN: Pt = [14, 300];
const OUT: Pt = [586, 300];
const stream = ([px, py]: Pt, [qx, qy]: Pt, o: number) => {
  const dx = (qx - px) * 0.42;
  return `M${px} ${py}C${n(px + dx)} ${n(py + o * 7)} ${n(qx - dx)} ${n(qy + o * 5)} ${qx} ${qy}`;
};
/** A few motes of light drifting about the stop, placed from its id. */
const motes = (id: string) => {
  let s = [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 9 }, () => ({ x: n(60 + r() * 480), y: n(40 + r() * 380), r: n(1.2 + r() * 2.2), ph: n(r()) }));
};

/** A stop: the road streaming in to the hero's near side at `hub[0..1]`
    and out of its far side at `hub[2..3]`, the pieces between, and two
    sockets lighting as the case docks and as the stop lets it go. */
export function Board({ id, hub, back, front, chips, children }: { id: string; hub: [number, number, number, number]; back?: ReactNode; front?: ReactNode; chips?: ReactNode; children: ReactNode }) {
  const L: Pt = [hub[0], hub[1]];
  const R: Pt = [hub[2], hub[3]];
  return (
    <div className="tk-rd-board">
      <svg className="tk-rd-svg tk-mirror" viewBox="0 0 600 460" fill="none" aria-hidden="true">
        <ellipse className="tk-rd-halo" cx="300" cy="260" rx="300" ry="210" fill={gr("glow")} />
        {motes(id).map((m, i) => (
          <circle key={i} className="tk-rd-mote" cx={m.x} cy={m.y} r={m.r} style={{ "--ph": m.ph } as CSSProperties} />
        ))}
        {LANES.map((o, i) => (
          <path key={`i${i}`} className={`tk-rd-lane tk-rd-lane-in tk-rd-s${i}`} d={stream(IN, L, o)} pathLength={1} />
        ))}
        {LANES.map((o, i) => (
          <path key={`o${i}`} className={`tk-rd-lane tk-rd-lane-out tk-rd-s${i}`} d={stream(R, OUT, o)} pathLength={1} />
        ))}
        {back}
      </svg>
      {children}
      <svg className="tk-rd-svg tk-rd-front tk-mirror" viewBox="0 0 600 460" fill="none" aria-hidden="true">
        {front}
        <circle className="tk-rd-p tk-rd-sock" style={on(0)} cx={L[0]} cy={L[1]} r="6" />
        <circle className="tk-rd-p tk-rd-sock" style={on(0.86)} cx={R[0]} cy={R[1]} r="6" />
      </svg>
      {chips}
      <i className="tk-rd-port" data-port="in" style={{ "--px": n(IN[0] / 6), "--py": n(IN[1] / 4.6) } as CSSProperties} />
      <i className="tk-rd-port" data-port="out" style={{ "--px": n(OUT[0] / 6), "--py": n(OUT[1] / 4.6) } as CSSProperties} />
    </div>
  );
}

/** A `k`-pointed star (or, with `r` near `R`, a rosette's scalloped edge). */
export const star = (cx: number, cy: number, R: number, r: number, k: number) =>
  `M${Array.from({ length: k * 2 }, (_, i) => {
    const a = (i * Math.PI) / k - Math.PI / 2;
    const d = i % 2 ? r : R;
    return `${n(cx + Math.cos(a) * d)} ${n(cy + Math.sin(a) * d)}`;
  }).join("L")}Z`;

/* Glyphs the pieces use beyond `./TechPillarKit`'s, on the same 24 box. */
export const HOME = "M4.5 11 12 4.5l7.5 6.5M6.5 9.5V19h11V9.5M10 19v-5h4v5";
export const BOX = "M12 3.5 19.5 7.5v9L12 20.5 4.5 16.5v-9zM4.5 7.5 12 11.5l7.5-4M12 11.5v9";
export const TRUCK = "M3.5 7.5h10v9h-10zM13.5 10.5h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 .01 0M17 18.5a1.5 1.5 0 1 0 .01 0";
export const CHART = "M4.5 19.5h15M7 16v-4M11 16V8M15 16v-6M19 16V5";
export const PLANE = "M16 0c0 1.6-1.4 2.4-3 2.4H4.5L-3 14h-4l3.5-11.6H-10L-13 6h-3l1.8-6-1.8-6h3l3 3.6h6L-7-14h4l7.5 11.6H13c1.6 0 3 .8 3 2.4z";

/** A professional with a rolling case, on a 64 × 120 box. */
export function Professional() {
  return (
    <>
      <path className="tk-rd-ink2" d="M24 74h6.5l-.5 38h-6zM33.5 74H40l.5 38h-6z" />
      <ellipse className="tk-rd-ink" cx="27" cy="113" rx="5.5" ry="2.6" />
      <ellipse className="tk-rd-ink" cx="37.5" cy="113" rx="5.5" ry="2.6" />
      <rect x="13.5" y="44" width="6.5" height="30" rx="3.2" fill={gr("ink")} />
      <path d="M18 44c0-7 6.5-11.5 14-11.5S46 37 46 44v32H18z" fill={gr("ink")} />
      <path className="tk-rd-white" d="M27.5 32.6 32 43l4.5-10.4z" />
      <path className="tk-rd-red" d="M31.1 36.2h1.8l1.2 4.2-2.1 9.6-2.1-9.6z" />
      <path className="tk-rd-lnw tk-rd-faint" d="M27.5 33 24.6 46M36.5 33l2.9 13" />
      <rect x="44" y="44" width="6.5" height="26" rx="3.2" fill={gr("ink")} transform="rotate(-14 47 44)" />
      <circle className="tk-rd-skin" cx="32" cy="20" r="9.5" />
      <path className="tk-rd-ink" d="M22.6 19c0-6.4 4.2-10 9.4-10s9.4 3.6 9.4 9.2c-2.2-2.6-5.6-3.6-9.6-3.6-3.6 0-6.8 1.4-9.2 4.4z" />
      <path className="tk-rd-ln2" d="M53 70V54h7v16" />
      <rect x="49" y="70" width="15" height="34" rx="3.5" fill={gr("red")} />
      <path className="tk-rd-lnw tk-rd-faint" d="M53 76v22M60 76v22" />
      <circle className="tk-rd-ink" cx="52.5" cy="106.5" r="2.2" />
      <circle className="tk-rd-ink" cx="60.5" cy="106.5" r="2.2" />
    </>
  );
}

/** A coin with a currency mark, on a 40 × 40 box. */
export function Coin() {
  return (
    <>
      <circle cx="20" cy="21.5" r="18" className="tk-rd-redk" />
      <circle cx="20" cy="20" r="18" fill={gr("red")} />
      <circle className="tk-rd-lnw tk-rd-faint" cx="20" cy="20" r="13.5" />
      <path className="tk-rd-lnw tk-uf" d="M20 10.5v19M24.6 14.6c-1.3-1.6-3-2.3-4.8-2.3-2.7 0-4.6 1.4-4.6 3.5 0 5 10 2.7 10 7.8 0 2.2-2.1 3.7-5 3.7-2.3 0-4.3-.9-5.6-2.7" />
    </>
  );
}

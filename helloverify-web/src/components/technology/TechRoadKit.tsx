/** The parts the `/technology` trust road's stops are drawn from
    (`./TechRoadPeople`, `./TechRoadTrade`, `./TechRoadWorld`). Every stop is
    a small isometric diorama on the same slab, a 600 × 460 board in a 2:1
    isometric (`iso`), so the road meets each one at the same two corners
    (the `.tk-rd-port`s) and runs across it between them. Parts arrive once
    the stop's build, `--b`, passes their `--at` (`on`); a few follow it
    continuously through `--t` instead (`run`). Words are chips laid over the
    board, so they never mirror with it. All of it is decoration: each
    stop's copy sits beside it. */
import type { CSSProperties, ReactNode } from "react";
import { n } from "./TechPillarKit";

export type Pt = [number, number];
type Vars = Record<string, number | string>;

export const FINGER = "M7.5 18.5c-1.2-1.7-1.9-3.8-1.9-6a6.4 6.4 0 0 1 12.8 0M12 12.5c0 3-.8 5.6-2.2 7.6M9.2 12.5a2.8 2.8 0 0 1 5.6 0c0 2.6-.5 5-1.5 7M18.4 15.5c-.2 1.4-.6 2.8-1.2 4";

/** Half the slab's side. Its top face is the plane z = 0. */
export const S = 125;
export const iso = (x: number, y: number, z = 0): Pt => [300 + x - y, 300 + (x + y) / 2 - z];
const xy = ([a, b]: Pt) => `${n(a)} ${n(b)}`;
export const poly = (...p: Pt[]) => `M${p.map(xy).join("L")}Z`;
export const line = (...p: Pt[]) => `M${p.map(xy).join("L")}`;
/** A part that arrives once the build passes `s`. */
export const on = (s: number, more: Vars = {}) => ({ "--at": s, ...more }) as CSSProperties;
/** A part that follows the build from `t0` over `td`, as `--t` 0…1. */
export const run = (t0: number, td: number, more: Vars = {}) => ({ "--t0": t0, "--td": td, ...more }) as CSSProperties;
/** Draw flat on a face of a box, from that corner: `u` along the face and
    `v` down it, or on the top, `u` along x and `v` along y. */
export const face = (k: "l" | "r" | "t", x: number, y: number, z: number) => {
  const [X, Y] = iso(x, y, z);
  return `matrix(${k === "l" ? "1 .5 0 1" : k === "r" ? "1 -.5 0 1" : "1 .5 -1 .5"} ${n(X)} ${n(Y)})`;
};

export function Box({ x, y, z = 0, w, d, h, t = "tk-rd-ft", l = "tk-rd-fl", r = "tk-rd-fr" }: { x: number; y: number; z?: number; w: number; d: number; h: number; t?: string; l?: string; r?: string }) {
  const T = z + h;
  return (
    <>
      <path className={l} d={poly(iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, T), iso(x, y + d, T))} />
      <path className={r} d={poly(iso(x + w, y + d, z), iso(x + w, y, z), iso(x + w, y, T), iso(x + w, y + d, T))} />
      <path className={t} d={poly(iso(x, y, T), iso(x + w, y, T), iso(x + w, y + d, T), iso(x, y + d, T))} />
    </>
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
export function Chip({ x, y, at, tone, children }: { x: number; y: number; at: number; tone?: "ok" | "bad"; children: string }) {
  return (
    <span className={`tk-rd-p tk-rd-pop tk-rd-chip${tone ? ` tk-rd-chip-${tone}` : ""}`} style={on(at, { "--x": n(x / 6), "--y": n(y / 4.6) })}>
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

export function Person({ x, y, bag }: { x: number; y: number; bag?: boolean }) {
  return (
    <>
      <ellipse className="tk-rd-shade" cx={x} cy={y} rx="13" ry="4.5" />
      <path className="tk-rd-body" d={`M${x - 11} ${y - 2}C${x - 11} ${y - 21} ${x - 8} ${y - 30} ${x} ${y - 30}S${x + 11} ${y - 21} ${x + 11} ${y - 2}Z`} />
      <circle className="tk-rd-body" cx={x} cy={y - 39} r="7.5" />
      {bag && (
        <>
          <path className="tk-rd-ln" d={`M${x + 16} ${y - 15}v-3.5h7v3.5`} />
          <rect className="tk-rd-red" x={x + 13} y={y - 15} width="13" height="13" rx="2.5" />
        </>
      )}
    </>
  );
}

export function Pin({ x, y, at }: { x: number; y: number; at: number }) {
  return (
    <g className="tk-rd-p tk-rd-drop" style={on(at)}>
      <ellipse className="tk-rd-shade" cx={x} cy={y} rx="9" ry="3" />
      <path className="tk-rd-red" d={`M${x} ${y}C${x - 4} ${y - 9} ${x - 13} ${y - 17} ${x - 13} ${y - 27}a13 13 0 1 1 26 0c0 10-9 18-13 27z`} />
      <circle className="tk-rd-hole" cx={x} cy={y - 27} r="5" />
    </g>
  );
}

/** A stack of `k` coins standing at (`x`, `y`), rising from the slab at `at`. */
export function Coins({ x, y, k, at }: { x: number; y: number; k: number; at: number }) {
  return (
    <g className="tk-rd-p tk-rd-grow" style={on(at)}>
      {Array.from({ length: k }, (_, i) => {
        const cy = y - i * 6;
        return (
          <g key={i}>
            <ellipse className="tk-rd-coin" cx={x} cy={cy} rx="15" ry="7.5" />
            <rect className="tk-rd-coin-s" x={x - 15} y={cy - 6} width="30" height="6" />
            <path className="tk-rd-ln" d={`M${x - 15} ${cy - 6}v6M${x + 15} ${cy - 6}v6`} />
            <ellipse className={i === k - 1 ? "tk-rd-coin tk-rd-coin-t" : "tk-rd-coin"} cx={x} cy={cy - 6} rx="15" ry="7.5" />
          </g>
        );
      })}
    </g>
  );
}

const LANES = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
const GRID = [-75, -25, 25, 75].map((v) => `${line(iso(v, -S), iso(v, S))}${line(iso(-S, v), iso(S, v))}`).join("");

/** The slab every stop stands on, with the road across it from the in
    corner to the out corner, laid as the stop builds. */
export function Board({ id, floor, chips, children }: { id: string; floor?: ReactNode; chips?: ReactNode; children: ReactNode }) {
  return (
    <div className="tk-rd-board">
      <svg className="tk-rd-svg tk-mirror" viewBox="0 0 600 460" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id={`tk-rd-glow-${id}`}>
            <stop className="tk-rd-glow0" offset="0" />
            <stop className="tk-rd-glow1" offset="1" />
          </radialGradient>
        </defs>
        <ellipse className="tk-rd-halo" cx="300" cy="270" rx="310" ry="200" fill={`url(#tk-rd-glow-${id})`} />
        <Box x={-S} y={-S} z={-12} w={2 * S} d={2 * S} h={12} t="tk-rd-floor" />
        {floor}
        <path className="tk-rd-grid" d={GRID} />
        {LANES.map((o, i) => (
          <path key={i} className={`tk-rd-lane tk-rd-s${i}`} d={`M50 300Q300 ${n(300 + o * 9)} 550 300`} pathLength={1} />
        ))}
        <circle className="tk-rd-p tk-rd-sock" style={on(0)} cx="50" cy="300" r="5.5" />
        <circle className="tk-rd-p tk-rd-sock" style={on(0.2)} cx="550" cy="300" r="5.5" />
        {children}
      </svg>
      {chips}
      <i className="tk-rd-port" data-port="in" style={{ "--px": 8.333, "--py": 65.217 } as CSSProperties} />
      <i className="tk-rd-port" data-port="out" style={{ "--px": 91.667, "--py": 65.217 } as CSSProperties} />
    </div>
  );
}

/** The parts the pillar drawings (`./TechPillarArt`) are built from: beat
    timing, the glyphs on a 24 box, and the status dot. */
import type { CSSProperties } from "react";

export const d = (s: number, more: Record<string, string> = {}) => ({ "--d": `${s.toFixed(2)}s`, ...more }) as CSSProperties;
export const n = (v: number) => +v.toFixed(2);

export const PERSON = "M12 11.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5zM5 20c1.1-3.4 3.8-5.2 7-5.2s5.9 1.8 7 5.2";
export const HASH = "M10 4.5 8.5 19.5M15.5 4.5 14 19.5M5 9.5h14.5M4.5 14.5h14.5";
export const CAP = "M2.5 9.5 12 5.5l9.5 4L12 13.5zM6.5 11.3v4.4c1.5 1.4 3.4 2.1 5.5 2.1s4-.7 5.5-2.1v-4.4M21.5 9.5v5";
export const CAL = "M5 6.5h14v13H5zM5 10.5h14M9 4.5v4M15 4.5v4";
export const CASE = "M4.5 8.5h15v10.5h-15zM9.5 8.5V6h5v2.5M4.5 13h15";
export const UPLOAD = "M12 15.5V5.5M8 9.5l4-4 4 4M5.5 15v3.5h13V15";
export const INST = "M3.5 9.5 12 5l8.5 4.5zM5.5 10.5v6M9.8 10.5v6M14.2 10.5v6M18.5 10.5v6M3.5 19h17";
export const SHIELD = "M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z";
export const GLOBE = "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.6 2.5 3.8 5.5 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.5-3.8-9S9.4 5.5 12 3z";

export function Glyph({ g, x, y, s = 0.62, cls = "tk-ic" }: { g: string; x: number; y: number; s?: number; cls?: string }) {
  return <path className={cls} d={g} transform={`translate(${n(x - 12 * s)} ${n(y - 12 * s)}) scale(${s})`} vectorEffect="non-scaling-stroke" />;
}

/** A status dot: a tick for verified, a cross for fraud. Pops in at `at`. */
export function Ok({ x, y, r = 8, at, bad }: { x: number; y: number; r?: number; at: number; bad?: boolean }) {
  const k = r / 8;
  const mark = bad
    ? `M${n(x - 3 * k)} ${n(y - 3 * k)}l${n(6 * k)} ${n(6 * k)}M${n(x + 3 * k)} ${n(y - 3 * k)}l${n(-6 * k)} ${n(6 * k)}`
    : `M${n(x - 3.6 * k)} ${n(y + 0.2 * k)}l${n(2.4 * k)} ${n(2.4 * k)} ${n(4.8 * k)} ${n(-5 * k)}`;
  return (
    <g className={bad ? "tk-ok tk-ok-bad tk-a-pop" : "tk-ok tk-a-pop"} style={d(at)}>
      <circle cx={x} cy={y} r={r} />
      <path className="tk-uf" d={mark} />
    </g>
  );
}

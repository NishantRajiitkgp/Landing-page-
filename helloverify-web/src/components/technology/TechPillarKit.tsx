/** The parts the `/technology` drawings are built from: rounding and the
    glyphs on a 24 box. */
import type { PlatformCopy } from "@/lib/copy/platform";

/** `technology.art`: the few words drawn inside the boards. */
export type TechArt = PlatformCopy["technology"]["art"];

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
export const SPARK = "M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2-5.2-1.8 5.2-1.8z";
export const SEARCH = "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5 20 20";
export const PHONE = "M7.5 3.5h9v17h-9zM10.5 17.5h3";
export const MAIL = "M3.5 6.5h17v11h-17zM3.5 7l8.5 6 8.5-6";
export const DOC = "M6.5 3.5h8l3 3v14h-11zM9 10h6M9 13.5h6M9 17h4";
export const ID = "M3.5 5.5h17v13h-17zM8.5 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.5 16a3 3 0 0 1 6 0M14 10h4M14 13h3";
export const LOCK = "M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9.5h-13zM12 15v2.5";
export const KEY = "M8 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM11.5 12H20M17 12v3M20 12v2.5";
export const SEAL = "M12 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM9 13.8 7.8 20.5l4.2-2 4.2 2-1.2-6.7";
export const HAND = "M8 12V6.5a1.5 1.5 0 0 1 3 0V11M11 10V5a1.5 1.5 0 0 1 3 0v6M14 10.5V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a6 6 0 0 1-5-2.7L3.8 14.5a1.5 1.5 0 0 1 2.4-1.8L8 15";
export const OFFICE = "M5 20V5.5h9V20M14 9.5h5V20M3.5 20h17M8 8.5h3M8 11.5h3M8 14.5h3";
export const REFRESH = "M19 8a7.5 7.5 0 0 0-13.5 1M5 16a7.5 7.5 0 0 0 13.5-1M19 4v4h-4M5 20v-4h4";
export const CARD = "M3.5 6.5h17v11h-17zM3.5 10h17M7 14.5h4";
export const PULSE = "M3 12h4l2-5 4 10 2-5h6";
export const DB = "M5 6c0-1.4 3.1-2.5 7-2.5s7 1.1 7 2.5-3.1 2.5-7 2.5S5 7.4 5 6zM5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5";

export function Glyph({ g, x, y, s = 0.62, cls = "tk-ic" }: { g: string; x: number; y: number; s?: number; cls?: string }) {
  return <path className={cls} d={g} transform={`translate(${n(x - 12 * s)} ${n(y - 12 * s)}) scale(${s})`} vectorEffect="non-scaling-stroke" />;
}

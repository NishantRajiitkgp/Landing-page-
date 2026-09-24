/** The trust perimeter's geometry and simulation state
 *  (`sections/EnterprisePerimeter.tsx`): what the eager island needs to lay
 *  out the ring pills and hit-test the pointer before the drawing code
 *  (`./enWave`) arrives. Split from it so a static import of these does not
 *  pull the renderer into the page's first-load JS; `./enWave` imports them
 *  from here. Constants are the Business board's, unchanged. */

/** Canvas geometry, in the board's 640-unit canvas that overhangs the
 *  540 px perimeter box by 50 px each side. */
export const SIZE = 640;
export const C = SIZE / 2;
export const RS = [96, 170, 244];
/** Each pill sits on its ring's 12 o'clock: `270 − r − 17` in the 540 box
 *  (17 = half the 34 px pill). */
export const PILL_TOP = RS.map((r) => 270 - r - 17);

/** Which ring (if any) a canvas-space point is over: within 24 units of it. */
export function ringAt(x: number, y: number): number {
  const d = Math.hypot(x - C, y - C);
  let hov = -1;
  RS.forEach((R, i) => {
    if (Math.abs(d - R) < 24) hov = i;
  });
  return hov;
}

export type Sim = {
  A: number[];
  H: number[];
  P: { x: number; y: number; in: boolean; e: number };
  hov: number;
  last: number;
  rip: { t0: number; s: number }[];
  nextRip: number;
  th0: number;
  t0: number;
  ts: number;
};

export function newSim(): Sim {
  return { A: [1, 0, 0], H: [0, 0, 0], P: { x: 0, y: 0, in: false, e: 0 }, hov: -1, last: -1, rip: [], nextRip: 0, th0: -Math.PI / 2, t0: 0, ts: 0 };
}

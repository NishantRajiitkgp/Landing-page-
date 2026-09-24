/** The few globe values the eager island (`sections/GlobeStage.tsx`) renders
 *  with before the engine loads: the canvas box, the starting view and the
 *  HUD's coordinate text. Kept apart from `./globeDraw` and `./globeEngine`
 *  so a static import of them does not pull the renderer into the page's
 *  first-load JS; both engine modules import them from here. */

type Compass = { n: string; s: string; e: string; w: string };

/** The stage's drawing box, in CSS px. The canvas is this size at every
 *  desktop width; the stage clips it (see `globe.css`). */
export const W = 1200;
export const H = 720;

/** The resting tilt, in degrees of latitude. */
export const TILT = 22;
export const START = { lon: -52, lat: TILT };

export function hudText(lon: number, lat: number, c: Compass) {
  const l = (((-lon % 360) + 540) % 360) - 180;
  return `${Math.abs(l).toFixed(1)}° ${l >= 0 ? c.e : c.w} · ${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? c.n : c.s}`;
}

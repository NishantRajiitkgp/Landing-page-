/** The field case's loupe (`./fieldLoop`): under a mouse, a round window
 *  that shows the survey map from above — the same town as a satellite
 *  capture, twice as close. The capture is painted by `./fieldWorld`'s
 *  `paintCapture` in 128 m tiles as the loupe needs them (one new tile a
 *  frame, so a sweep never stalls the page) and kept for the visit. */
import * as W from "./fieldWorld";

const T = 128;
const MAG = 2;
const R = 92;

export function makeLoupe(sheet: W.Sheet, pal: W.FieldPalette) {
  const tiles = new Map<string, HTMLCanvasElement>();
  const tile = (tx: number, ty: number, budget: { n: number }) => {
    const key = `${tx},${ty}`;
    const got = tiles.get(key);
    if (got || budget.n <= 0) return got;
    budget.n--;
    const cv = document.createElement("canvas");
    cv.width = T; cv.height = T;
    W.paintCapture(cv, sheet, pal, [tx * T + T / 2, ty * T + T / 2], T);
    tiles.set(key, cv);
    return cv;
  };

  /** Draws the loupe at (mx, my) over a map whose camera is `cam` at
   *  `scale` px per metre; `label` names it, in `mono`. */
  return (ctx: CanvasRenderingContext2D, dpr: number, w: number, h: number, mx: number, my: number, cam: { x: number; y: number }, scale: number, label: string, mono: string) => {
    const s2 = scale * MAG;
    const wx = cam.x + (mx - w / 2) / scale, wy = cam.y + (my - h / 2) / scale;
    const e = R / s2;
    const budget = { n: 1 };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.save();
    ctx.shadowColor = W.rgba(pal.ink, 0.35); ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2);
    ctx.fillStyle = W.rgba(pal.earth, 1); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.clip();
    for (let ty = Math.floor((wy - e) / T); ty <= Math.floor((wy + e) / T); ty++) {
      for (let tx = Math.floor((wx - e) / T); tx <= Math.floor((wx + e) / T); tx++) {
        if (tx < 0 || ty < 0 || tx * T > W.MAP_W || ty * T > W.MAP_H) continue;
        const cv = tile(tx, ty, budget);
        if (cv) ctx.drawImage(cv, mx + (tx * T - wx) * s2, my + (ty * T - wy) * s2, T * s2 + 0.5, T * s2 + 0.5);
      }
    }
    // A fine reticle at the centre.
    ctx.strokeStyle = W.rgba(pal.white, 0.8); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mx - 10, my); ctx.lineTo(mx - 3, my); ctx.moveTo(mx + 3, my); ctx.lineTo(mx + 10, my);
    ctx.moveTo(mx, my - 10); ctx.lineTo(mx, my - 3); ctx.moveTo(mx, my + 3); ctx.lineTo(mx, my + 10); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = W.rgba(pal.white, 1); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = W.rgba(pal.ink, 0.2); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(mx, my, R + 2, 0, Math.PI * 2); ctx.stroke();
    // Its label, and where it is.
    const { lat, lon } = W.toLatLon(wx, wy);
    ctx.font = `10px ${mono}`;
    const lines = [label.toUpperCase(), `${lat.toFixed(5)}° N  ${lon.toFixed(5)}° E`];
    const tw = Math.max(...lines.map((t) => ctx.measureText(t).width)) + 16;
    const bx = mx - tw / 2, by = my + R + 10;
    ctx.fillStyle = W.rgba(pal.white, 0.94);
    ctx.beginPath(); ctx.roundRect(bx, by, tw, 34, 8); ctx.fill();
    ctx.fillStyle = W.rgba(pal.ink, 0.9); ctx.textBaseline = "middle";
    lines.forEach((t, i) => ctx.fillText(t, bx + 8, by + 11 + i * 13));
  };
}

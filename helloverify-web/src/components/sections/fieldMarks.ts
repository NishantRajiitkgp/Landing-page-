/** The marks the field case draws over its survey map (`./fieldLoop`), in
 *  screen space: the crosshair on the town, the two locations and the AI's
 *  measure between them, and the verifier's walk. `S` maps sheet metres to
 *  the screen; `p` is the scroll (0-6), `m` how far the verifier has
 *  walked, `time` the loop's clock (frozen when paused), `al` the map's
 *  own fade. Colour comes through the palette, as everywhere in the case. */
import * as W from "./fieldWorld";

type Pt = readonly [number, number];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function drawMarks(ctx: CanvasRenderingContext2D, pal: W.FieldPalette, S: (p: Pt) => Pt, p: number, m: number, time: number, al: number) {
  if (al <= 0) return;
  const G = W.rgba, P = W.PLACES;
  const ring = (pt: Pt, r: number, c: W.RGB, a: number, lw = 1.5) => { const [x, y] = S(pt); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = G(c, a * al); ctx.lineWidth = lw; ctx.stroke(); };
  const dot = (pt: Pt, r: number, c: W.RGB, a = 1) => { const [x, y] = S(pt); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = G(c, a * al); ctx.fill(); };

  // The crosshair on the town, as the dive lands.
  if (p > 0.55 && p < 1) {
    const a = clamp((p - 0.55) / 0.15) * (1 - clamp((p - 0.8) / 0.2)), ph = (time * 0.45) % 1;
    ring([3000, 2150], 18 + ph * 60, pal.green, a * 0.6 * (1 - ph), 1.2);
  }
  // Act 1: the two locations, the measure between them, the AI's scan.
  if (p > 1.12 && p < 2.05) {
    const a = clamp((p - 1.12) / 0.12) * clamp((2.05 - p) / 0.1);
    const [ax, ay] = S(P.declared), [bx, by] = S(P.shared);
    ctx.setLineDash([6, 6]); ctx.lineDashOffset = -time * 18;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
    ctx.strokeStyle = G(pal.red, 0.8 * a * al); ctx.lineWidth = 1.6; ctx.stroke();
    ctx.setLineDash([]);
    for (const pt of [P.declared, P.shared]) for (let i = 0; i < 3; i++) {
      const ph = (time * 0.5 + i / 3) % 1;
      ring(pt, 10 + ph * 70, pal.red, a * 0.5 * (1 - ph), 1.2);
    }
  }
  // Act 2: the verifier's walk: the path so far, the way still to go.
  if (p > 1.8) {
    const a = clamp((p - 1.8) / 0.15);
    ctx.beginPath();
    W.ROUTE.forEach((pt, i) => { const [x, y] = S(pt); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    ctx.setLineDash([2, 5]); ctx.strokeStyle = G(pal.green, 0.45 * a * al); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
    if (m > 0) {
      ctx.beginPath();
      let acc = 0; const [sx, sy] = S(W.ROUTE[0]); ctx.moveTo(sx, sy);
      for (let i = 1; i < W.ROUTE.length && acc < m; i++) {
        const L = W.dist(W.ROUTE[i - 1], W.ROUTE[i]);
        const [x, y] = S(acc + L <= m ? W.ROUTE[i] : W.along(m)); ctx.lineTo(x, y); acc += L;
      }
      ctx.strokeStyle = G(pal.green, 0.25 * a * al); ctx.lineWidth = 9; ctx.stroke();
      ctx.strokeStyle = G(pal.green, a * al); ctx.lineWidth = 3; ctx.stroke();
    }
    if (p < 3.3) {
      const v = W.along(m), ph = (time * 0.8) % 1;
      ring(v, 8 + ph * 22, pal.green, 0.6 * (1 - ph) * a, 2);
      dot(v, 7, pal.white, a); dot(v, 4.5, pal.green, a);
    }
    dot(P.partner, 4, pal.ink, a * 0.8);
  }
  // The two places, once they are known.
  const pinA = clamp((p - 0.9) / 0.15), pinB = clamp((p - 1.05) / 0.15);
  if (pinA > 0) { ring(P.declared, 11, pal.red, pinA * (p > 2.5 ? 0.35 : 0.9), 2); dot(P.declared, 4.5, pal.red, pinA); }
  if (pinB > 0) { ring(P.shared, 11, pal.green, pinB, 2); dot(P.shared, 4.5, pal.green, pinB); }
}

/** The field case's middle distance (`./fieldLoop`): between the globe and
 *  the survey sheet — roughly 1,500 km down to 8 km across — the dive
 *  passes over the real towns of Cameroon's west and the main roads that
 *  join them to Foumban, so the eye always has somewhere to land.
 *
 *  Town positions are real (to about a kilometre); the roads are drawn
 *  town to town, as a route map draws them, not surveyed. Colour comes
 *  through `./fieldWorld`'s palette. */
import { rgba, type FieldPalette } from "./fieldWorld";

type Town = readonly [string, number, number, 1 | 2 | 3];
/** Name, lat, lon, rank (1 the largest). */
const TOWNS: Town[] = [
  ["Douala", 4.0511, 9.7679, 1],
  ["Yaoundé", 3.848, 11.5021, 1],
  ["Bafoussam", 5.4781, 10.4176, 2],
  ["Bamenda", 5.9597, 10.146, 2],
  ["Nkongsamba", 4.9547, 9.9404, 3],
  ["Dschang", 5.4497, 10.0533, 3],
  ["Bafang", 5.1583, 10.1826, 3],
  ["Bangangté", 5.1426, 10.5241, 3],
  ["Koutaba", 5.65, 10.7833, 3],
  ["Foumban", 5.727, 10.9004, 2],
];
const T = Object.fromEntries(TOWNS.map((t) => [t[0], t])) as Record<string, Town>;
const ROADS: string[][] = [
  ["Douala", "Nkongsamba", "Bafang", "Bafoussam"],
  ["Bafoussam", "Bamenda"],
  ["Bafoussam", "Dschang"],
  ["Bafoussam", "Koutaba", "Foumban"],
  ["Yaoundé", "Bangangté", "Bafoussam"],
  ["Foumban", "Bamenda"],
];
const M = 111320;

/** Paints the towns and roads at `alpha` for a camera at (lat, lon) with
 *  `s` px per metre, on a local flat projection (fine at these scales). */
export function drawRegion(ctx: CanvasRenderingContext2D, pal: FieldPalette, fonts: { mono: string; sans: string }, lat: number, lon: number, s: number, w: number, h: number, dpr: number, alpha: number, region: string) {
  if (alpha <= 0) return;
  const cos = Math.cos((lat * Math.PI) / 180);
  const P = (la: number, lo: number): [number, number] => [w / 2 + (lo - lon) * M * cos * s, h / 2 - (la - lat) * M * s];
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round"; ctx.lineJoin = "round";

  for (const r of ROADS) {
    ctx.beginPath();
    r.forEach((n, i) => { const [x, y] = P(T[n][1], T[n][2]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    ctx.strokeStyle = rgba(pal.white, 0.9); ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = rgba(pal.road, 0.75); ctx.lineWidth = 2.2; ctx.stroke();
  }
  // The region's name, spaced wide, across the view.
  const [rx, ry] = P(5.35, 10.35);
  ctx.font = `11px ${fonts.mono}`;
  ctx.fillStyle = rgba(pal.ink, 0.28);
  ctx.textAlign = "center";
  ctx.fillText(region.split("").join(" "), rx, ry);
  ctx.textAlign = "start";

  ctx.textBaseline = "middle";
  for (const [name, la, lo, rank] of TOWNS) {
    const [x, y] = P(la, lo);
    if (x < -80 || y < -40 || x > w + 80 || y > h + 40) continue;
    const r = rank === 1 ? 5 : rank === 2 ? 4 : 3;
    const here = name === "Foumban";
    ctx.fillStyle = rgba(here ? pal.green : pal.ink, here ? 1 : 0.75);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba(pal.white, 1); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = `${rank === 1 ? 600 : 500} ${rank === 3 ? 11 : 12.5}px ${fonts.sans}`;
    ctx.fillStyle = rgba(pal.ink, here ? 1 : 0.7);
    ctx.fillText(name, x + r + 6, y + 0.5);
  }
  ctx.restore();
}

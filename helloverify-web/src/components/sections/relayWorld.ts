/** The relay map's terrain, used only by `./relayPaint.ts`: the 24 hour
 *  meridians, the night side (a real terminator from the solar declination
 *  on that date), the land dots graded green-by-day to graphite-by-night,
 *  and the sun. Ported unchanged from the follow-the-sun painter it replaced
 *  — same maths and alphas — so the map keeps its day and night.
 *
 *  COLOUR COMES FROM CSS. Canvas 2D cannot take `var()`, so `readPalette()`
 *  reads the tokens and the `--v2-su-*` tints (`app/v2/presence.css`) off the
 *  stage with `getComputedStyle` once, and `rgba()` recombines them with the
 *  alphas here. No colour is typed in this file. */
import { landDots } from "@/lib/sunLand";
import { MAP_H, MAP_W } from "@/lib/sunMap";

export type RGB = [number, number, number];
const TOKENS = {
  green: "--green",
  greenLight: "--green-light",
  ink: "--ink",
  white: "--white",
  glow: "--v2-su-glow",
  sun: "--v2-su-sun",
  coreHi: "--v2-su-core-hi",
  coreLo: "--v2-su-core-lo",
  amber: "--v2-su-amber",
  night: "--v2-su-night",
  dusk: "--v2-su-dusk",
};
export type Palette = Record<keyof typeof TOKENS, RGB>;

function hexRgb(v: string): RGB {
  const h = v.trim().replace("#", "");
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function readPalette(el: Element): { pal: Palette; mono: string } {
  const cs = getComputedStyle(el);
  const pal = Object.fromEntries(Object.entries(TOKENS).map(([k, v]) => [k, hexRgb(cs.getPropertyValue(v))])) as Palette;
  return { pal, mono: cs.getPropertyValue("--mono").trim() || "monospace" };
}

export const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
export const TAU = Math.PI * 2;

export class World {
  private pts = landDots();
  private night: HTMLCanvasElement;
  private nctx: CanvasRenderingContext2D;
  private img: ImageData;

  constructor(private pal: Palette) {
    // The night side is computed at 120 x 44 and drawn smoothed up to the
    // map: the terminator comes out soft, and it is 5,280 cosines a frame.
    this.night = document.createElement("canvas");
    this.night.width = 120;
    this.night.height = 44;
    this.nctx = this.night.getContext("2d")!;
    this.img = this.nctx.createImageData(120, 44);
  }

  /** Paints the terrain for instant `t`; `ts` (seconds) turns the rays;
   *  `hair` is one CSS px in map px, so hairlines stay hairlines when zoomed.
   *  Returns how dark each point is (0 day, 1 night), for the painter to
   *  dim what sleeps. */
  draw(ctx: CanvasRenderingContext2D, t: number, ts: number, hair = 1): (x: number, y: number) => number {
    const { pal } = this;
    const W = MAP_W;
    const H = MAP_H;
    const d = new Date(t);
    const u = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
    const doy = (t - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86400000;
    const dec = ((-23.44 * Math.cos((TAU / 365) * (doy + 10))) * Math.PI) / 180;
    let lon0 = (12 - u) * 15;
    lon0 = ((((lon0 + 180) % 360) + 360) % 360) - 180;
    const L0 = (lon0 * Math.PI) / 180;
    const sd = Math.sin(dec);
    const cd = Math.cos(dec);
    const sx = ((lon0 + 180) / 360) * W;
    const sy = ((74 - (dec * 180) / Math.PI) / 130) * H;
    const nightOf = (sa: number) => {
      const v = (0.03 - sa) / 0.24;
      return v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v);
    };
    const darkAt = (x: number, y: number) => {
      const lat = ((74 - (y / H) * 130) * Math.PI) / 180;
      const lon = (((x / W) * 360 - 180) * Math.PI) / 180;
      return nightOf(Math.sin(lat) * sd + Math.cos(lat) * cd * Math.cos(lon - L0));
    };

    for (const x of [sx - W, sx, sx + W]) {
      const g = ctx.createRadialGradient(x, sy, 0, x, sy, 420);
      g.addColorStop(0, rgba(pal.glow, 0.22));
      g.addColorStop(0.5, rgba(pal.coreHi, 0.08));
      g.addColorStop(1, rgba(pal.coreHi, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - 420, 0, 840, H);
    }
    ctx.strokeStyle = rgba(pal.ink, 0.04);
    ctx.lineWidth = hair;
    for (let k = 0; k <= 24; k++) {
      const x = k * 50 + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    const px = this.img.data;
    const [nr, ng, nb] = pal.night;
    for (let j = 0; j < 44; j++) {
      const lat = ((74 - ((j + 0.5) / 44) * 130) * Math.PI) / 180;
      const sl = Math.sin(lat);
      const cl = Math.cos(lat);
      for (let i = 0; i < 120; i++) {
        const lon = ((((i + 0.5) / 120) * 360 - 180) * Math.PI) / 180;
        const o = (j * 120 + i) * 4;
        px[o] = nr;
        px[o + 1] = ng;
        px[o + 2] = nb;
        px[o + 3] = Math.round(nightOf(sl * sd + cl * cd * Math.cos(lon - L0)) * 22);
      }
    }
    this.nctx.putImageData(this.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.night, 0, 0, W, H);

    // Land: eight bands from day to night, one Path2D each.
    const B = 7;
    const paths = Array.from({ length: B + 1 }, () => new Path2D());
    const P = this.pts;
    for (let i = 0; i < P.length; i += 4) {
      const nf = nightOf(Math.sin(P[i + 2]) * sd + Math.cos(P[i + 2]) * cd * Math.cos(P[i + 3] - L0));
      const p = paths[Math.round(nf * B)];
      p.moveTo(P[i] + 1.7, P[i + 1]);
      p.arc(P[i], P[i + 1], 1.7, 0, TAU);
    }
    for (let b = 0; b <= B; b++) {
      const f = b / B;
      const mix = pal.green.map((c, i) => Math.round(c + (pal.dusk[i] - c) * f)) as RGB;
      ctx.fillStyle = rgba(mix, 0.5 - 0.3 * f);
      ctx.fill(paths[b]);
    }

    for (const x of [sx - W, sx, sx + W]) {
      if (x < -60 || x > W + 60) continue;
      let g = ctx.createRadialGradient(x, sy, 0, x, sy, 56);
      g.addColorStop(0, rgba(pal.sun, 0.5));
      g.addColorStop(1, rgba(pal.sun, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, sy, 56, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = rgba(pal.amber, 0.65);
      ctx.lineWidth = 1.3;
      ctx.lineCap = "round";
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * TAU + ts * 0.25;
        const r1 = k % 2 ? 21 : 24;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 15, sy + Math.sin(a) * 15);
        ctx.lineTo(x + Math.cos(a) * r1, sy + Math.sin(a) * r1);
        ctx.stroke();
      }
      g = ctx.createRadialGradient(x - 3, sy - 3, 1, x, sy, 10);
      g.addColorStop(0, rgba(pal.coreHi, 1));
      g.addColorStop(1, rgba(pal.coreLo, 1));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, sy, 10, 0, TAU);
      ctx.fill();
    }
    return darkAt;
  }
}

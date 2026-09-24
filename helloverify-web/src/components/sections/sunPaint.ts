/** The follow-the-sun canvas painter, used only by `./SunStage.tsx`.
 *
 *  One `draw()` per frame paints, back to front: a warm wash round the sun,
 *  the 24 hour meridians, the night side (a real terminator from the solar
 *  declination on that date), the land dots graded green-by-day to
 *  graphite-by-night, the noon and midnight meridians, the sun, then each
 *  office's leader line, the relay arc with its travelling document, and the
 *  office lamps. A port of the board's `suFrame()`, same maths and alphas.
 *
 *  COLOUR COMES FROM CSS. Canvas 2D cannot take `var()`, so `readPalette()`
 *  reads the tokens and the `--v2-su-*` tints (`app/v2/presence.css`) off the
 *  stage with `getComputedStyle` once, on mount, and `rgba()` recombines them
 *  with the board's alphas. No colour is typed in this file.
 *
 *  `still` freezes the ambient motion (the turning rays, the marching arc,
 *  the travelling document, the breathing lamps) for `prefers-reduced-motion`
 *  and for the "Pause motion" control; time itself still moves on drag,
 *  play and the live clock. */
import { landDots } from "@/lib/sunLand";
import { CARD_H, CARD_W, MAP_H, MAP_W, OFFICES, type World } from "@/lib/sunMap";

type RGB = [number, number, number];
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
  amberInk: "--v2-su-amber-ink",
  night: "--v2-su-night",
  dusk: "--v2-su-dusk",
};
type Palette = Record<keyof typeof TOKENS, RGB>;

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

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const TAU = Math.PI * 2;

export class SunPainter {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private pts = landDots();
  private night: HTMLCanvasElement;
  private nctx: CanvasRenderingContext2D;
  private img: ImageData;
  private pulse = new Map<string, number>();
  private prevOn = new Map<string, boolean>();
  private pal: Palette;
  private mono: string;

  constructor(cv: HTMLCanvasElement, theme: { pal: Palette; mono: string }) {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = MAP_W * this.dpr;
    cv.height = MAP_H * this.dpr;
    this.ctx = cv.getContext("2d")!;
    // The night side is computed at 120 x 44 and drawn smoothed up to the
    // map: the terminator comes out soft, and it is 5,280 cosines a frame
    // rather than 520,800.
    this.night = document.createElement("canvas");
    this.night.width = 120;
    this.night.height = 44;
    this.nctx = this.night.getContext("2d")!;
    this.img = this.nctx.createImageData(120, 44);
    this.pal = theme.pal;
    this.mono = theme.mono;
  }

  draw(t: number, tt: number, w: World, still: boolean, labels: { noon: string; midnight: string }) {
    const { ctx, pal } = this;
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
    const ts = still ? 0 : tt / 1000;

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // Warm daylight round the sun, repeated a map-width either side so it
    // wraps at the date line.
    for (const x of [sx - W, sx, sx + W]) {
      const g = ctx.createRadialGradient(x, sy, 0, x, sy, 420);
      g.addColorStop(0, rgba(pal.glow, 0.26));
      g.addColorStop(0.5, rgba(pal.coreHi, 0.1));
      g.addColorStop(1, rgba(pal.coreHi, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - 420, 0, 840, H);
    }
    ctx.strokeStyle = rgba(pal.ink, 0.045);
    ctx.lineWidth = 1;
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
        px[o + 3] = Math.round(nightOf(sl * sd + cl * cd * Math.cos(lon - L0)) * 28);
      }
    }
    this.nctx.putImageData(this.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.night, 0, 0, W, H);

    // Land: eight bands from day to night, one Path2D each, so 3,711 dots
    // cost eight fills rather than 3,711.
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
      ctx.fillStyle = rgba(mix, 0.62 - 0.36 * f);
      ctx.fill(paths[b]);
    }

    const mx = (((sx + W / 2) % W) + W) % W;
    ctx.save();
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = rgba(pal.amber, 0.55);
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, H);
    ctx.stroke();
    ctx.strokeStyle = rgba(pal.night, 0.35);
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, H);
    ctx.stroke();
    ctx.restore();
    ctx.font = `500 10px ${this.mono}`;
    ctx.textBaseline = "alphabetic";
    const label = (txt: string, x: number, col: string) => {
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = col;
      ctx.fillText(txt, Math.max(8, Math.min(W - tw - 8, x + 8)), H - 14);
    };
    label(labels.noon, sx, rgba(pal.amberInk, 0.9));
    label(labels.midnight, mx, rgba(pal.night, 0.7));

    for (const x of [sx - W, sx, sx + W]) {
      if (x < -60 || x > W + 60) continue;
      let g = ctx.createRadialGradient(x, sy, 0, x, sy, 64);
      g.addColorStop(0, rgba(pal.sun, 0.55));
      g.addColorStop(1, rgba(pal.sun, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, sy, 64, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = rgba(pal.amber, 0.7);
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * TAU + ts * 0.25;
        const r1 = k % 2 ? 23 : 27;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 17, sy + Math.sin(a) * 17);
        ctx.lineTo(x + Math.cos(a) * r1, sy + Math.sin(a) * r1);
        ctx.stroke();
      }
      g = ctx.createRadialGradient(x - 3, sy - 3, 1, x, sy, 12);
      g.addColorStop(0, rgba(pal.coreHi, 1));
      g.addColorStop(1, rgba(pal.coreLo, 1));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, sy, 12, 0, TAU);
      ctx.fill();
    }

    const byK = new Map(w.rows.map((r) => [r.o.k, r]));
    for (const o of OFFICES) {
      const r = byK.get(o.k)!;
      if (r.on && this.prevOn.get(o.k) === false) this.pulse.set(o.k, tt);
      this.prevOn.set(o.k, r.on);
      const ax = Math.max(o.cl, Math.min(o.cl + CARD_W, o.x));
      const ay = Math.max(o.ct, Math.min(o.ct + CARD_H, o.y));
      ctx.strokeStyle = r.on ? rgba(pal.green, 0.55) : rgba(pal.ink, 0.18);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(ax, ay);
      ctx.stroke();
    }
    if (w.from && w.to) this.relay(w.from.o, w.to.o, ts, still);
    for (const o of OFFICES) {
      const r = byK.get(o.k)!;
      if (r.on) {
        const br = still ? 0.5 : 0.5 + 0.5 * Math.sin(ts * 2.4 + o.x * 0.01);
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, 22);
        g.addColorStop(0, rgba(pal.greenLight, 0.55 + 0.25 * br));
        g.addColorStop(1, rgba(pal.greenLight, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 22, 0, TAU);
        ctx.fill();
        ctx.fillStyle = rgba(pal.green, 1);
        ctx.beginPath();
        ctx.arc(o.x, o.y, 5, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = rgba(pal.white, 1);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = rgba(pal.white, 1);
        ctx.strokeStyle = rgba(pal.ink, 0.35);
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 4.5, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
      // A ring goes out from a desk the moment it opens. Skipped when
      // still: it is motion, and a paused map should not flash.
      const p0 = this.pulse.get(o.k);
      if (!still && p0 !== undefined && r.on && tt - p0 < 1200) {
        const f = (tt - p0) / 1200;
        ctx.strokeStyle = rgba(pal.green, 0.6 * (1 - f));
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(o.x, o.y, 6 + f * 30, 0, TAU);
        ctx.stroke();
      }
    }
  }

  /** The hand-off: a dashed arc from the office that just closed to the one
   *  that just opened, and a document riding it every 2.6 seconds. */
  private relay(A: { x: number; y: number }, Bo: { x: number; y: number }, ts: number, still: boolean) {
    const { ctx, pal } = this;
    const cx = (A.x + Bo.x) / 2;
    const cy = Math.min(A.y, Bo.y) - Math.max(40, Math.abs(Bo.x - A.x) * 0.28);
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.lineDashOffset = -ts * 20;
    ctx.strokeStyle = rgba(pal.green, 0.55);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.quadraticCurveTo(cx, cy, Bo.x, Bo.y);
    ctx.stroke();
    ctx.restore();
    const k = still ? 0.5 : (ts % 2.6) / 2.6;
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const qx = (1 - e) * (1 - e) * A.x + 2 * (1 - e) * e * cx + e * e * Bo.x;
    const qy = (1 - e) * (1 - e) * A.y + 2 * (1 - e) * e * cy + e * e * Bo.y;
    const g = ctx.createRadialGradient(qx, qy, 0, qx, qy, 16);
    g.addColorStop(0, rgba(pal.greenLight, 0.7));
    g.addColorStop(1, rgba(pal.greenLight, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(qx, qy, 16, 0, TAU);
    ctx.fill();
    ctx.fillStyle = rgba(pal.white, 1);
    ctx.strokeStyle = rgba(pal.green, 1);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(qx - 5, qy - 6.5, 10, 13, 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(qx - 2.5, qy - 2);
    ctx.lineTo(qx + 2.5, qy - 2);
    ctx.moveTo(qx - 2.5, qy + 1.5);
    ctx.lineTo(qx + 1, qy + 1.5);
    ctx.stroke();
  }
}

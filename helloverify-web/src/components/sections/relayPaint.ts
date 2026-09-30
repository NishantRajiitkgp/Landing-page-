/** The relay map painter, used only by `./relayLoop.ts`. One `draw()` per
 *  frame paints, through the camera (`lib/relayData` `Cam`: the map point at
 *  the view's centre and CSS px per map px), back to front:
 *
 *  1. the terrain (`./relayWorld`) at the JOURNEY's instant, not now — so
 *     day and night sweep across the map as the journey's hours pass;
 *  2. the network, faint: every corridor a hairline, every city a dot, and
 *     now and then a city pinging (calm, not traffic);
 *  3. the desks' glow while their office is open (their flags are HTML pins
 *     over these points, `RelayStage`);
 *  4. the journey: the request's two flights, hirer to our desk and desk to
 *     the source (dashed ink); the answer, source back to the hirer (green,
 *     glowing); a gold pulse while the source checks its records; a burst
 *     when the answer lands; and a glow under the document, which is the
 *     real specimen, drawn in HTML over the canvas.
 *
 *  `still` (paused, or reduced motion) stops the pings and the sun's rays. */
import { LEGS, NODES, STEP_AT, WEB, arcOf, at, clamp01, legAt, legsOf, on, type Arc, type Cam, type Ends, type Pt } from "@/lib/relayData";
import type { World as Desks } from "@/lib/sunMap";
import { World, rgba, TAU, type Palette, type RGB } from "./relayWorld";

export { readPalette } from "./relayWorld";

export class RelayPainter {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private world: World;
  private web = WEB.map(([a, b]) => arcOf(at(a), at(b), 22, 0.3));
  private nodes = NODES.map(at);
  private pings: { p: Pt; t0: number }[] = [];
  private lastPing = 0;
  private vw = 1;
  private vh = 1;

  constructor(
    private cv: HTMLCanvasElement,
    private theme: { pal: Palette; mono: string },
  ) {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.ctx = cv.getContext("2d")!;
    this.world = new World(theme.pal);
  }

  /** The view's size in CSS px; the backing store follows it. */
  resize(vw: number, vh: number) {
    this.vw = Math.max(1, vw);
    this.vh = Math.max(1, vh);
    this.cv.width = Math.round(this.vw * this.dpr);
    this.cv.height = Math.round(this.vh * this.dpr);
  }

  draw(t: number, tt: number, desks: Desks, still: boolean, ends: Ends, p: number, deskKey: string, cam: Cam, doc: Pt) {
    const { ctx } = this;
    const { pal } = this.theme;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    const z = this.dpr * cam.k;
    ctx.setTransform(z, 0, 0, z, (this.vw / 2 - cam.x * cam.k) * this.dpr, (this.vh / 2 - cam.y * cam.k) * this.dpr);
    // Strokes and dots are sized in CSS px, whatever the zoom.
    const u = 1 / cam.k;
    this.world.draw(ctx, t, still ? 0 : tt / 1000, u);

    ctx.lineWidth = 0.9 * u;
    ctx.strokeStyle = rgba(pal.ink, 0.07);
    for (const r of this.web) {
      ctx.beginPath();
      ctx.moveTo(r.a.x, r.a.y);
      ctx.quadraticCurveTo(r.c.x, r.c.y, r.b.x, r.b.y);
      ctx.stroke();
    }
    ctx.fillStyle = rgba(pal.ink, 0.3);
    for (const n of this.nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2 * u, 0, TAU);
      ctx.fill();
    }
    if (!still) this.ping(tt, u);

    for (const r of desks.rows) {
      const { x, y } = r.o;
      if (r.on) this.glow({ x, y }, pal.greenLight, 0.5, 28 * u);
      if (r.o.k === deskKey && p >= STEP_AT[1] - 0.02 && p < STEP_AT[4]) {
        ctx.strokeStyle = rgba(pal.green, 0.8);
        ctx.lineWidth = 1.6 * u;
        ctx.beginPath();
        ctx.arc(x, y, 20 * u, 0, TAU);
        ctx.stroke();
      }
    }

    this.journey(ends, p, tt, still, u, doc);
  }

  private ping(tt: number, u: number) {
    const { ctx } = this;
    const { pal } = this.theme;
    if (tt - this.lastPing > 650) {
      this.lastPing = tt;
      this.pings.push({ p: this.nodes[Math.floor(Math.random() * this.nodes.length)], t0: tt });
    }
    this.pings = this.pings.filter((g) => tt - g.t0 < 1600);
    for (const g of this.pings) {
      const f = (tt - g.t0) / 1600;
      ctx.strokeStyle = rgba(pal.green, 0.4 * (1 - f));
      ctx.lineWidth = 1.2 * u;
      ctx.beginPath();
      ctx.arc(g.p.x, g.p.y, (3 + f * 14) * u, 0, TAU);
      ctx.stroke();
    }
  }

  private journey(ends: Ends, p: number, tt: number, still: boolean, u: number, doc: Pt) {
    const { ctx } = this;
    const { pal } = this.theme;
    const { src, dst } = ends;
    const legs = legsOf(ends);
    const path = (arc: Arc, e1: number) => {
      ctx.beginPath();
      ctx.moveTo(arc.a.x, arc.a.y);
      for (let i = 1; i <= 40; i++) {
        const q = on(arc, (e1 * i) / 40);
        ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    };
    const ts = still ? 0 : tt / 1000;
    ctx.lineCap = "round";

    // The request: hirer to desk, desk to source, dashed ink.
    ctx.save();
    ctx.setLineDash([5 * u, 5 * u]);
    ctx.lineDashOffset = -ts * 20 * u;
    ctx.strokeStyle = rgba(pal.ink, 0.65);
    ctx.lineWidth = 1.8 * u;
    for (const i of [0, 1] as const) {
      const e = legAt(p, i);
      if (e > 0) path(legs[i], e);
    }
    ctx.restore();

    // The answer: source back to the hirer, green, glowing.
    const back = legAt(p, 2);
    if (back > 0) {
      ctx.strokeStyle = rgba(pal.greenLight, 0.5);
      ctx.lineWidth = 9 * u;
      path(legs[2], back);
      ctx.strokeStyle = rgba(pal.green, 1);
      ctx.lineWidth = 3 * u;
      path(legs[2], back);
    }

    const asked = p >= STEP_AT[2];
    const confirmed = p >= STEP_AT[3];
    if (asked && !confirmed) {
      for (const k of [0, 0.5]) {
        const f = still ? 0.5 : (tt / 1300 + k) % 1;
        ctx.strokeStyle = rgba(pal.amber, 0.7 * (1 - f));
        ctx.lineWidth = 2 * u;
        ctx.beginPath();
        ctx.arc(src.x, src.y, (10 + f * 50) * u, 0, TAU);
        ctx.stroke();
      }
    }
    this.end(src, confirmed ? pal.green : asked ? pal.amber : pal.ink, confirmed, u);
    const landed = p >= STEP_AT[4];
    if (landed) {
      const f = clamp01((p - STEP_AT[4]) / 0.05);
      ctx.strokeStyle = rgba(pal.green, 0.6 * (1 - f));
      ctx.lineWidth = 2.5 * u;
      ctx.beginPath();
      ctx.arc(dst.x, dst.y, (10 + f * 60) * u, 0, TAU);
      ctx.stroke();
    }
    this.end(dst, landed ? pal.green : pal.ink, landed, u);

    // A glow under the flying document, gold on the way out, mint on the way back.
    const flying = (p >= LEGS[0][0] && p < LEGS[1][1]) || (p >= LEGS[2][0] && p < LEGS[2][1]);
    if (flying) this.glow(doc, p >= LEGS[2][0] ? pal.greenLight : pal.glow, 0.7, 34 * u);
  }

  private glow(c: Pt, col: RGB, a: number, r: number) {
    const g = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
    g.addColorStop(0, rgba(col, a));
    g.addColorStop(1, rgba(col, 0));
    this.ctx.fillStyle = g;
    this.ctx.beginPath();
    this.ctx.arc(c.x, c.y, r, 0, TAU);
    this.ctx.fill();
  }

  /** A journey's end: a ring, filled with a tick once done. */
  private end(c: Pt, col: RGB, done: boolean, u: number) {
    const { ctx } = this;
    const { pal } = this.theme;
    this.glow(c, col, done ? 0.45 : 0.25, 26 * u);
    ctx.fillStyle = rgba(done ? col : pal.white, 1);
    ctx.strokeStyle = rgba(done ? pal.white : col, done ? 1 : 0.8);
    ctx.lineWidth = 2.2 * u;
    ctx.beginPath();
    ctx.arc(c.x, c.y, (done ? 9 : 6) * u, 0, TAU);
    ctx.fill();
    ctx.stroke();
    if (done) {
      ctx.strokeStyle = rgba(pal.white, 1);
      ctx.lineWidth = 2.2 * u;
      ctx.beginPath();
      ctx.moveTo(c.x - 3.8 * u, c.y + 0.3 * u);
      ctx.lineTo(c.x - 1 * u, c.y + 3.2 * u);
      ctx.lineTo(c.x + 4.2 * u, c.y - 3 * u);
      ctx.stroke();
    }
  }
}

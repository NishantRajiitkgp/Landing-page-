/** The homepage globe's motion (`sections/GlobeStage.tsx`): rotation,
    drag and inertia, the ease toward a chosen country, and the frame loop
    that draws with `./globeDraw` and places the HTML pins.

    A plain class rather than hooks, because every one of these values
    changes every frame and none of them is something React renders; the
    island creates one engine on mount, forwards its events to it, and
    destroys it on unmount. The physics constants are the canvas board's.

    THE LOOP RUNS ONLY WHILE SOMETHING MOVES — the auto-spin, a drag, inertia,
    an ease still settling — and only while the stage is on screen. Otherwise
    it stops, and `kick()` restarts it. The spin speed at 0 ("Still") and
    `prefers-reduced-motion` both stop the spin and freeze the pulses' clock;
    reduced motion also snaps to a chosen country instead of easing. */

import { CX, H, W, arc, drawFrame, landPoints, readPalette, vec, type Palette, type Scene } from "./globeDraw";
import { START, TILT, hudText } from "./globeFrame";

type Compass = { n: string; s: string; e: string; w: string };

/** The six offices, head office first (it is drawn filled). */
const OFFICES: [number, number][] = [[28.5, 77.4], [25.2, 55.3], [1.35, 103.8], [14.6, 121.0], [30.0, 31.2], [40.7, -74.0]];

export class GlobeEngine {
  private rot = { ...START };
  private vel = 0;
  private drag: null | { x: number; y: number; lon: number; lat: number; lx: number } = null;
  private target: null | { lon: number; lat: number } = null;
  private raf = 0;
  private last = 0;
  private clock = 0;
  private scene: Scene | null = null;
  private pal: Palette | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private dpr = 1;
  /** The canvas's CSS width over `W`: 1 on desktop, about 0.63 at 390px,
   *  where `globe.css` shrinks the whole 1200×720 box to fit the phone. */
  private s = 1;
  private visible = false;
  private io: IntersectionObserver;
  private ro: ResizeObserver;
  private mq: MediaQueryList;
  private dead = false;
  speed = 35;
  sel = -1;

  constructor(
    private stage: HTMLElement,
    private canvas: HTMLCanvasElement,
    private pinEls: (HTMLElement | null)[],
    private hud: HTMLElement | null,
    private pinsAt: [number, number][],
    private compass: Compass,
  ) {
    this.mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.mq.addEventListener("change", this.kick);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) {
        if (this.scene) this.kick();
        else void import("./globeLand").then(({ LAND }) => this.init(LAND));
      }
    }, { rootMargin: "300px 0px" });
    this.io.observe(stage);
    this.ro = new ResizeObserver(() => {
      this.s = canvas.clientWidth / W || 1;
      if (this.scene) { this.size(); this.kick(); }
    });
    this.ro.observe(canvas);
  }

  /** The backing store follows the drawn size, not the 1200px box: at 390px
   *  a full-resolution buffer would be 2.5× the pixels actually shown, filled
   *  every frame of the spin. */
  private size() {
    const d = Math.min(2, window.devicePixelRatio || 1) * this.s;
    if (Math.abs(d - this.dpr) < 0.01 && this.ctx) return;
    this.dpr = d;
    this.canvas.width = Math.round(W * d);
    this.canvas.height = Math.round(H * d);
  }

  private init(land: string) {
    if (this.dead || this.scene) return;
    this.s = this.canvas.clientWidth / W || 1;
    this.dpr = 0;
    this.size();
    this.ctx = this.canvas.getContext("2d");
    this.pal = readPalette(this.stage);
    const pv = this.pinsAt.map(([la, lo]) => vec(la, lo));
    this.scene = {
      pts: landPoints(land),
      pins: pv,
      offices: OFFICES.map(([la, lo]) => vec(la, lo)),
      // Every route starts at the first pin, India.
      arcs: pv.slice(1).map((v) => arc(pv[0], v)),
      // The card sits at the inline end, so under RTL the orb moves to the
      // other side of the (unmirrored) canvas with it.
      cx: getComputedStyle(this.stage).direction === "rtl" ? W - CX : CX,
    };
    this.kick();
  }

  destroy() {
    this.dead = true;
    this.io.disconnect();
    this.ro.disconnect();
    this.mq.removeEventListener("change", this.kick);
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  kick = () => {
    if (!this.raf && this.visible && this.scene) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  /** Turn to face pin `i` (a click, or keyboard focus reaching it). */
  face(i: number) {
    const [lat, lon] = this.pinsAt[i];
    this.target = { lon: -lon, lat };
    this.vel = 0;
    this.kick();
  }

  /** Back to the chosen country if there is one, otherwise free spin. */
  release() {
    if (this.sel >= 0) this.face(this.sel);
    else { this.target = null; this.kick(); }
  }

  down(x: number, y: number) {
    this.drag = { x, y, lon: this.rot.lon, lat: this.rot.lat, lx: x };
    this.target = null;
    this.vel = 0;
    this.kick();
  }

  /** `k` converts screen px to layout px, in case the page is zoomed; over
   *  `s`, so a smaller globe turns as far under the finger as a big one. */
  move(x: number, y: number, k: number) {
    const d = this.drag;
    if (!d) return;
    k /= this.s;
    this.rot.lon = d.lon + (x - d.x) * k * 0.32;
    this.rot.lat = Math.max(-65, Math.min(65, d.lat + (y - d.y) * k * 0.26));
    this.vel = (x - d.lx) * k * 0.32 * 0.6;
    d.lx = x;
  }

  up() {
    if (!this.drag) return;
    this.drag = null;
    // Let go with a card open and the globe swings back to that country.
    if (this.sel >= 0) this.face(this.sel);
    this.kick();
  }

  private tick = (t: number) => {
    this.raf = 0;
    if (!this.scene || !this.ctx || !this.pal) return;
    const r = this.rot;
    const reduce = this.mq.matches;
    const ambient = !reduce && this.speed > 0;
    let moving = ambient || !!this.drag;
    if (!this.drag) {
      if (this.target) {
        const dl = ((this.target.lon - r.lon + 540) % 360) - 180;
        const dt = this.target.lat - r.lat;
        const k = reduce ? 1 : 0.07;
        r.lon += dl * k;
        r.lat += dt * k;
        moving ||= Math.abs(dl) > 0.02 || Math.abs(dt) > 0.02;
      } else {
        r.lon += (ambient ? (this.speed / 100) * 0.42 : 0) + this.vel;
        this.vel *= 0.955;
        r.lat += (TILT - r.lat) * 0.01;
        moving ||= Math.abs(this.vel) > 0.005 || Math.abs(TILT - r.lat) > 0.05;
      }
    }
    if (ambient && this.last) this.clock += Math.min(0.1, (t - this.last) / 1000);
    this.last = t;

    const at = drawFrame(this.ctx, this.dpr, this.scene, r, this.pal, this.clock, this.sel);
    at.forEach((p, i) => {
      const el = this.pinEls[i];
      if (!el) return;
      // A focused pin always shows, even mid-turn from the far side.
      const focused = el === document.activeElement;
      const fade = p[2] > 0.12 ? Math.min(1, (p[2] - 0.12) * 4) : 0;
      el.style.transform = `translate(${(p[0] * this.s).toFixed(1)}px,${(p[1] * this.s).toFixed(1)}px) translate(-50%,-50%) scale(${(0.78 + Math.max(0, p[2]) * 0.28).toFixed(3)})`;
      el.style.opacity = String(focused ? 1 : fade);
      el.style.pointerEvents = focused || p[2] > 0.12 ? "auto" : "none";
      el.style.zIndex = String(Math.round(Math.max(0, p[2]) * 100));
    });
    if (this.hud) this.hud.textContent = hudText(r.lon, r.lat, this.compass);
    if (moving && this.visible) this.raf = requestAnimationFrame(this.tick);
  };
}

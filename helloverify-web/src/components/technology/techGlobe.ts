/** The `/technology` hero globe's loop and drawing (`./TechHeroGlobe`).

    One case, round and round: it is filed, handed to HelloVerify's AI at
    the hub, and carried along great circles to the four authorities its
    checks belong to (a company in Singapore, a regulator in Dubai, a
    medical authority in London, a university in Boston), each confirming
    before it moves on. Then the answer flies home and the case closes. The
    globe turns to follow it, and fainter routes to other cities keep
    running underneath: this case is one of many.

    The globe and the routes are canvas; the words are the island's HTML,
    which this places over their points each frame and whose `data-s` it
    sets as the case reaches them: an authority's card is `check`, then
    `ok`, then `past` (a badge) once the case has moved on. Colour is read
    from the stylesheet.

    It runs only while on screen, with the tab visible, and not paused
    (WCAG 2.2.2). Under reduced motion it draws the closed case once. */
import { cssRgb, type RGB } from "@/lib/cssColour";
import { arc, landPoints, vec, type Vec } from "@/lib/globeDraw";
import { LAND } from "@/lib/globeLand";

/** The board, in its own units; the island scales it to fit. The globe is
    wider than the board is tall below it, so its foot runs off the bottom
    (the stylesheet fades it out there). */
export const BW = 560;
export const BH = 540;
const CX = 292;
const CY = 356;
const R = 252;
/** How far the canvas runs past the board on either side, so the halo is
    never cut by the board's edge. */
const PAD = 70;
const TAU = Math.PI * 2;

type Place = readonly [lat: number, lon: number];
const HUB: Place = [28.57, 77.32];
/** The case's four stops, in the order it visits them. */
const STOPS: Place[] = [
  [1.35, 103.82],
  [25.2, 55.27],
  [51.5, -0.13],
  [42.36, -71.06],
];
/** Where other cases are going while this one travels. */
const ELSEWHERE: Place[] = [
  [-33.87, 151.2], [35.68, 139.69], [-1.29, 36.82], [-23.55, -46.63], [43.65, -79.38],
  [50.11, 8.68], [-26.2, 28.05], [14.6, 121.0], [24.71, 46.68], [19.43, -99.13],
];

/** The timeline, in seconds. */
const FEED = { at: 0.6, dur: 0.9 };
const LEGS = (() => {
  let at = 1.7;
  return STOPS.map((_, k) => {
    const start = at;
    const arrive = start + (k === STOPS.length - 1 ? 1.5 : 1.3);
    const ok = arrive + 0.85;
    at = ok + 0.25;
    return { start, arrive, ok };
  });
})();
const HOME = { start: LEGS[LEGS.length - 1].ok + 0.3, dur: 1.9 };
const DONE = HOME.start + HOME.dur;
const LOOP = DONE + 3.3;
const FADE = LOOP - 0.8;

type Parts = { hub: HTMLElement; pins: HTMLElement[]; card: HTMLElement; rows: HTMLElement[] };
type Pal = Record<"ink" | "white" | "paper" | "red" | "redLight" | "ok", RGB>;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${clamp(a, 0, 1).toFixed(3)})`;
/** The view that puts a place just below the middle of the globe. */
const look = ([lat, lon]: Place) => ({ lon: -lon, lat: clamp(lat * 0.6 + 6, 0, 32) });

export class TechGlobe {
  private ctx: CanvasRenderingContext2D;
  private pal: Pal;
  private pts = landPoints(LAND);
  private hub = vec(...HUB);
  private stops = STOPS.map((p) => vec(...p));
  private legs: Vec[][];
  private home: Vec[];
  private far: Vec[][];
  private rot = look(HUB);
  private t = 0;
  private raf = 0;
  private last = 0;
  private s = 1;
  private dpr = 1;
  private rtl: boolean;
  private visible = false;
  private paused = false;
  private reduce: MediaQueryList;
  private io: IntersectionObserver;
  private ro: ResizeObserver;
  private states = new Map<HTMLElement, string>();

  constructor(
    private board: HTMLElement,
    private canvas: HTMLCanvasElement,
    private parts: Parts,
  ) {
    this.ctx = canvas.getContext("2d")!;
    const cs = getComputedStyle(board);
    const tok = (n: string) => cssRgb(cs.getPropertyValue(n));
    this.pal = { ink: tok("--ink"), white: tok("--white"), paper: tok("--paper"), red: tok("--primary"), redLight: tok("--primary-light"), ok: tok("--tk-ok") };
    this.rtl = cs.direction === "rtl";
    const from = [this.hub, ...this.stops];
    this.legs = this.stops.map((v, k) => arc(from[k], v));
    this.home = arc(this.stops[this.stops.length - 1], this.hub);
    this.far = ELSEWHERE.map((p) => arc(this.hub, vec(...p)));

    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reduce.addEventListener("change", this.kick);
    document.addEventListener("visibilitychange", this.kick);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.kick();
    });
    this.io.observe(board);
    this.ro = new ResizeObserver(() => {
      this.size();
      this.kick(true);
    });
    this.ro.observe(board);
    this.size();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.ro.disconnect();
    this.reduce.removeEventListener("change", this.kick);
    document.removeEventListener("visibilitychange", this.kick);
  }

  setPaused(on: boolean) {
    this.paused = on;
    this.kick();
  }

  private size() {
    this.s = this.board.clientWidth / BW || 1;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round((BW + 2 * PAD) * this.s * this.dpr);
    this.canvas.height = Math.round(BH * this.s * this.dpr);
  }

  /** Starts the loop if it may run; otherwise draws one still frame. */
  private kick = (redraw: unknown = false) => {
    const run = this.visible && !this.paused && !this.reduce.matches && !document.hidden;
    if (run && !this.raf) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.tick);
    } else if (!run) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (this.reduce.matches) {
        this.t = DONE + 0.8;
        this.rot = look(HUB);
        this.frame(0);
      } else if (redraw === true) this.frame(0);
    }
  };

  private tick = (now: number) => {
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
    this.last = now;
    this.t = (this.t + dt) % LOOP;
    this.frame(dt);
    this.raf = requestAnimationFrame(this.tick);
  };

  /** Where the case is now, and which way the globe should face. */
  private target() {
    if (this.t >= HOME.start) return look(HUB);
    for (let k = LEGS.length - 1; k >= 0; k--) if (this.t >= LEGS[k].start) return look(STOPS[k]);
    return look(HUB);
  }

  private frame(dt: number) {
    const aim = this.target();
    const k = 1 - Math.exp(-dt / 0.42);
    this.rot.lon += ((((aim.lon - this.rot.lon + 540) % 360) - 180) * k);
    this.rot.lat += (aim.lat - this.rot.lat) * k;
    this.draw();
    this.place();
  }

  private project() {
    const lam = (this.rot.lon * Math.PI) / 180;
    const phi = (this.rot.lat * Math.PI) / 180;
    const cl = Math.cos(lam), sl = Math.sin(lam), cp = Math.cos(phi), sp = Math.sin(phi);
    return (v: Vec): Vec => {
      const x = v[0] * cl + v[2] * sl;
      const z0 = -v[0] * sl + v[2] * cl;
      return [CX + R * x, CY - R * (v[1] * cp - z0 * sp), v[1] * sp + z0 * cp];
    };
  }

  private draw() {
    const { ctx, pal, t } = this;
    const P = this.project();
    const fade = t >= FADE ? 1 - (t - FADE) / (LOOP - FADE) : Math.min(1, t / 0.4);
    const disc = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
    };
    const m = this.dpr * this.s;
    ctx.setTransform(m, 0, 0, m, PAD * m, 0);
    ctx.clearRect(-PAD, 0, BW + 2 * PAD, BH);

    let g = ctx.createRadialGradient(CX, CY, R * 0.9, CX, CY, R * 1.34);
    g.addColorStop(0, rgba(pal.redLight, 0.32));
    g.addColorStop(0.4, rgba(pal.redLight, 0.1));
    g.addColorStop(1, rgba(pal.redLight, 0));
    ctx.fillStyle = g;
    disc(CX, CY, R * 1.34);
    ctx.fill();
    g = ctx.createRadialGradient(CX - R * 0.38, CY - R * 0.42, R * 0.05, CX, CY, R);
    g.addColorStop(0, rgba(pal.white, 1));
    g.addColorStop(0.62, rgba(pal.white, 1));
    g.addColorStop(1, rgba(pal.paper, 1));
    ctx.fillStyle = g;
    disc(CX, CY, R);
    ctx.fill();

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = rgba(pal.red, 0.07);
    const line = (at: (d: number) => Vec, a: number, b: number) => {
      ctx.beginPath();
      let on = false;
      for (let d = a; d <= b; d += 4) {
        const p = P(at(d));
        if (p[2] > 0 && on) ctx.lineTo(p[0], p[1]);
        else if (p[2] > 0) ctx.moveTo(p[0], p[1]);
        on = p[2] > 0;
      }
      ctx.stroke();
    };
    for (let la = -60; la <= 60; la += 30) line((lo) => vec(la, lo), -180, 180);
    for (let lo = -180; lo < 180; lo += 30) line((la) => vec(la, lo), -84, 84);

    // Land, inlined rather than through `P`: 4,000 points a frame.
    const pts = this.pts;
    const ink = `rgba(${pal.ink[0]},${pal.ink[1]},${pal.ink[2]},`;
    const lam = (this.rot.lon * Math.PI) / 180;
    const phi = (this.rot.lat * Math.PI) / 180;
    const cl = Math.cos(lam), sl = Math.sin(lam), cp = Math.cos(phi), sp = Math.sin(phi);
    for (let i = 0; i < pts.length; i += 3) {
      const z0 = -pts[i] * sl + pts[i + 2] * cl;
      const z = pts[i + 1] * sp + z0 * cp;
      if (z <= 0) continue;
      const sz = 1.2 + z * 1.7;
      ctx.fillStyle = ink + (0.1 + z * 0.3).toFixed(3) + ")";
      ctx.fillRect(CX + R * (pts[i] * cl + pts[i + 2] * sl) - sz / 2, CY - R * (pts[i + 1] * cp - z0 * sp) - sz / 2, sz, sz);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(pal.red, 0.18);
    disc(CX, CY, R);
    ctx.stroke();

    const shown = (p: Vec) => p[2] > -0.05 || Math.hypot(p[0] - CX, p[1] - CY) > R;
    const path = (a: Vec[], upTo: number) => {
      ctx.beginPath();
      let on = false;
      const n = Math.floor(upTo * (a.length - 1));
      for (let i = 0; i <= n; i++) {
        const p = P(a[i]);
        const see = shown(p);
        if (see && on) ctx.lineTo(p[0], p[1]);
        else if (see) ctx.moveTo(p[0], p[1]);
        on = see;
      }
      ctx.stroke();
    };
    const along = (a: Vec[], f: number) => P(a[Math.round(clamp(f, 0, 1) * (a.length - 1))]);
    const glow = (p: Vec, c: RGB, r = 10) => {
      if (!shown(p)) return;
      const pg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
      pg.addColorStop(0, rgba(pal.white, fade));
      pg.addColorStop(0.3, rgba(c, 0.95 * fade));
      pg.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = pg;
      disc(p[0], p[1], r);
      ctx.fill();
    };

    // Other cases, elsewhere: faint routes out of the hub, each with a pulse.
    const clock = this.reduce.matches ? 0 : performance.now() / 1000;
    ctx.lineWidth = 0.8;
    this.far.forEach((a, j) => {
      ctx.strokeStyle = rgba(pal.red, 0.14);
      path(a, 1);
      const p = along(a, (clock * 0.16 + j * 0.31) % 1);
      if (shown(p)) {
        ctx.fillStyle = rgba(pal.red, 0.4);
        disc(p[0], p[1], 1.8);
        ctx.fill();
      }
    });

    // This case's route: legs drawn as far as it has got.
    const legAt = LEGS.map((l) => clamp((t - l.start) / (l.arrive - l.start), 0, 1));
    this.legs.forEach((a, k) => {
      const f = ease(legAt[k]);
      if (!f) return;
      const live = t < LEGS[k].ok;
      if (live) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = rgba(pal.redLight, 0.32 * fade);
        path(a, f);
      }
      ctx.lineWidth = live ? 2.2 : 1.6;
      ctx.strokeStyle = rgba(pal.red, (live ? 1 : 0.6) * fade);
      path(a, f);
    });
    const homeAt = ease(clamp((t - HOME.start) / HOME.dur, 0, 1));
    if (homeAt) {
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = rgba(pal.ok, (t < DONE ? 1 : 0.7) * fade);
      path(this.home, homeAt);
    }

    // The authorities: grey until reached, red while they check, green once confirmed.
    this.stops.forEach((v, k) => {
      const p = P(v);
      if (p[2] <= 0) return;
      const l = LEGS[k];
      if (t < l.arrive) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = rgba(pal.ink, 0.28 * fade + 0.1);
        disc(p[0], p[1], 3.2);
        ctx.stroke();
        return;
      }
      const c = t < l.ok ? pal.red : pal.ok;
      if (t < l.ok) {
        for (let q = 0; q < 2; q++) {
          const pr = ((t - l.arrive) * 1.4 + q / 2) % 1;
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = rgba(c, 0.6 * (1 - pr));
          disc(p[0], p[1], 6 + pr * 18);
          ctx.stroke();
        }
      }
      ctx.fillStyle = rgba(c, fade);
      disc(p[0], p[1], 4.6);
      ctx.fill();
      ctx.fillStyle = rgba(pal.white, fade);
      disc(p[0], p[1], 1.6);
      ctx.fill();
    });

    // The hub: HelloVerify, breathing; it rings green when the case closes.
    const h = P(this.hub);
    if (h[2] > 0) {
      const pr = (clock * 0.7) % 1;
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = rgba(pal.red, 0.45 * (1 - pr));
      disc(h[0], h[1], 7 + pr * 16);
      ctx.stroke();
      if (t >= DONE && t < DONE + 1.2) {
        const d = (t - DONE) / 1.2;
        ctx.lineWidth = 2;
        ctx.strokeStyle = rgba(pal.ok, 0.7 * (1 - d));
        disc(h[0], h[1], 8 + d * 46);
        ctx.stroke();
      }
      ctx.fillStyle = rgba(t >= DONE ? pal.ok : pal.red, 1);
      disc(h[0], h[1], 5.5);
      ctx.fill();
      ctx.fillStyle = rgba(pal.white, 1);
      disc(h[0], h[1], 2);
      ctx.fill();
    }

    // The case itself: filed into the hub, then along the route, then home.
    const feed = clamp((t - FEED.at) / FEED.dur, 0, 1);
    if (feed > 0 && feed < 1 && h[2] > 0) {
      const a: [number, number] = [this.rtl ? BW - 270 : 270, 196];
      const f = ease(feed);
      const cx = h[0], cy = a[1];
      const x = (1 - f) ** 2 * a[0] + 2 * (1 - f) * f * cx + f * f * h[0];
      const y = (1 - f) ** 2 * a[1] + 2 * (1 - f) * f * cy + f * f * h[1];
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = rgba(pal.red, 0.7);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo(cx, cy, h[0], h[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      glow([x, y, 1], pal.red, 11);
    }
    LEGS.forEach((l, k) => {
      if (t >= l.start && t < l.arrive) glow(along(this.legs[k], ease(legAt[k])), pal.red, 12);
    });
    if (homeAt > 0 && homeAt < 1) glow(along(this.home, homeAt), pal.ok, 12);
  }

  /** Puts the hub and the four authority cards over their points, and moves
      every HTML part to the state the case has reached. */
  private place() {
    const P = this.project();
    const t = this.t;
    const w = this.board.clientWidth;
    const put = (el: HTMLElement, p: Vec, show: boolean) => {
      const x = p[0] * this.s - (this.rtl ? w : 0);
      el.style.transform = `translate(${x.toFixed(1)}px,${(p[1] * this.s).toFixed(1)}px)`;
      el.style.opacity = show ? String(clamp((p[2] - 0.12) * 8, 0, 1)) : "0";
    };
    // The hub's name shows while the case is handed over and when it comes
    // home; on the way, the authorities' cards have the globe to themselves.
    put(this.parts.hub, P(this.hub), t < LEGS[0].start + 0.3 || t >= HOME.start + HOME.dur * 0.6);
    this.parts.pins.forEach((el, k) => {
      const l = LEGS[k];
      const next = k + 1 < LEGS.length ? LEGS[k + 1].start : HOME.start;
      put(el, P(this.stops[k]), t >= l.arrive && t < FADE);
      this.set(el, t < l.ok ? "check" : t < next ? "ok" : "past");
    });
    this.parts.rows.forEach((el, k) => {
      const l = LEGS[k];
      this.set(el, t < l.start ? "wait" : t < l.arrive ? "go" : t < l.ok ? "check" : "ok");
    });
    this.set(this.parts.card, t >= FADE ? "out" : t >= DONE ? "done" : "in");
  }

  private set(el: HTMLElement, s: string) {
    if (this.states.get(el) === s) return;
    this.states.set(el, s);
    el.dataset.s = s;
  }
}

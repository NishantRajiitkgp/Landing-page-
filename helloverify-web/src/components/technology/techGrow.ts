/** The drawing of the `/technology` compounding story (`./TechGrowBoard`).

    `render(t)` puts the board at story time `t` (`./techGrowPlan`). Acts
    one and two are the island's HTML, which this places in board units
    and whose `data-s` it sets: a card is `scan` while it is read and
    `read` after; a chip is `raw`, `found` once its card is read, `bond`
    while it bonds to HelloVerify and then `trusted`, or `fraud`. Act
    three is the canvas: the view pulls back over a field of checks
    (ink), institutions (green) and fraud (red), each check joining its
    institution as it comes in, until every dot flies to its place in the
    HelloVerify mark, sampled from the hub's own logo.

    Nothing here runs on its own: `./TechCompoundStage` calls `render` as
    the page scrolls. Colour is read from the stylesheet. */
import { cssRgb, type RGB } from "@/lib/cssColour";
import {
  ACT, BOND, CAPTION, CARDS, CONVERGE, COUNT, DB, DB_AT, ENTER, FADE, FLY, FOUND, FRAUDS, HC, HUB, HUB_AT, INSTS,
  LEAVE, LW, MARKED, MARK_Y, ROWS, SAFE, SCAN, SLOTS, SW, SWEEP, TRAVEL, YEAR, ZMIN, ZOOM, bondAt, cardAt, enterAt, fraudAt1,
  instAt1, leaveAt, rowAt, rowTime, scanAt, travelAt,
} from "./techGrowPlan";

const TAU = Math.PI * 2;
const c01 = (n: number) => Math.min(1, Math.max(0, n));
const seg = (t: number, a: number, d: number) => c01((t - a) / d);
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const out = (x: number) => 1 - (1 - x) ** 3;
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const rand = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;

/** A figure counted up to `f` of itself: each number in it scales, the
    rest of it stays ("20M+" at a half is "10M+"). */
const countUp = (v: string, f: number) =>
  f >= 1 ? v : v.replace(/\d[\d,]*/g, (n) => Math.round(Number(n.replace(/,/g, "")) * f).toLocaleString("en-US"));

/** The field once the view has pulled back: an ellipse round the hub, its
    middle left to the network itself. */
const RX = 262;
const RY = 182;
const HOLE = 0.17;
/** Radii, in board units: a check, an institution, a fraud, HelloVerify. */
const KIND_R = [1.05, 1.75, 1.35, 3.4];
const KIND_A = [0.5, 0.95, 0.9, 1];
const MARK_R = 1.18;
/** The mark's sampling pitch, in board units. */
const PITCH = 2.5;
const STEPS = 8;

type Dot = {
  k: 0 | 1 | 2 | 3;
  /** World offset from the hub at full size. */
  x: number;
  y: number;
  /** The institution a check joins, or -1. */
  p: number;
  /** When its line starts to grow. */
  g: number;
  /** One of the network's own nodes, which show as its HTML fades. */
  net: boolean;
  tx: number;
  ty: number;
  red: boolean;
  /** When it sets off for the mark, and how far it swings on the way. */
  c: number;
  curl: number;
};

type Mark = { x: number; y: number; red: boolean };

/** The mark as dots: the logo's paths filled offscreen and read back on a
    staggered grid, `LW` units wide and centred on the hub. */
function sampleMark(svg: SVGSVGElement): Mark[] {
  const vb = svg.viewBox.baseVal;
  const scale = LW / vb.width;
  const lh = vb.height * scale;
  const res = 6;
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(vb.width * res);
  cv.height = Math.ceil(vb.height * res);
  const c = cv.getContext("2d", { willReadFrequently: true });
  if (!c) return [];
  c.scale(res, res);
  svg.querySelectorAll("path").forEach((p) => {
    const fill = p.getAttribute("fill");
    if (!fill) return;
    c.fillStyle = fill;
    c.fill(new Path2D(p.getAttribute("d") ?? ""));
  });
  const px = c.getImageData(0, 0, cv.width, cv.height).data;
  const ox = HC.x - LW / 2;
  const oy = MARK_Y - lh / 2;
  const marks: Mark[] = [];
  for (let row = 0, y = PITCH / 2; y < lh; y += PITCH * 0.866, row++) {
    for (let x = row % 2 ? PITCH : PITCH / 2; x < LW; x += PITCH) {
      const i = (Math.floor((y / scale) * res) * cv.width + Math.floor((x / scale) * res)) * 4;
      if (px[i + 3] < 128) continue;
      marks.push({ x: ox + x, y: oy + y, red: px[i] > 150 && px[i + 1] < 110 });
    }
  }
  return marks;
}

export class TechGrow {
  private ctx: CanvasRenderingContext2D;
  private pal: { ink: RGB; red: RGB; ok: RGB };
  private k = 1;
  private dpr = 1;
  private flip = 1;
  private t = 0;
  private painted = false;
  private dots: Dot[] = [];
  private X = new Float32Array(0);
  private Y = new Float32Array(0);
  private U = new Float32Array(0);
  private styles = new Map<number, string>();
  private wrote = new WeakMap<Element, Record<string, string>>();
  private ro: ResizeObserver;

  private cards: HTMLElement[];
  private insts: HTMLElement[];
  private frauds: HTMLElement[];
  private rows: HTMLElement[];
  private bonds: SVGElement[];
  private pulses: SVGElement[];
  private tally: HTMLElement[];
  private figs: HTMLElement[];
  private one: Record<"world" | "hub" | "db" | "link" | "year", Element | null>;
  private today: string;

  constructor(
    private art: HTMLElement,
    private canvas: HTMLCanvasElement,
  ) {
    this.ctx = canvas.getContext("2d")!;
    const all = <E extends Element>(s: string) => [...art.querySelectorAll<E>(s)];
    this.cards = all("[data-card]");
    this.insts = all("[data-inst]");
    this.frauds = all("[data-fraud]");
    this.rows = all("[data-row]");
    this.bonds = all(".tk-cx-bond");
    this.pulses = all(".tk-cx-pulse");
    this.tally = all("[data-tally]");
    this.figs = all("[data-fig]");
    const one = (s: string) => art.querySelector(s);
    this.one = { world: one(".tk-cx-world"), hub: one(".tk-cx-hub"), db: one(".tk-cx-db"), link: one(".tk-cx-dblink"), year: one(".tk-cx-year") };
    this.today = this.one.year?.textContent ?? "";

    const cs = getComputedStyle(art);
    const tok = (n: string) => cssRgb(cs.getPropertyValue(n));
    this.pal = { ink: tok("--ink"), red: tok("--primary"), ok: tok("--tk-ok") };
    this.flip = cs.direction === "rtl" ? -1 : 1;
    const logo = art.querySelector<SVGSVGElement>(".tk-cx-hub svg");
    this.build(logo ? sampleMark(logo) : []);

    this.ro = new ResizeObserver(() => {
      this.size();
      this.render(this.t);
    });
    this.ro.observe(art);
    this.size();
  }

  destroy() {
    this.ro.disconnect();
  }

  render(t: number) {
    this.t = t;
    this.place(t);
    this.paint(t);
  }

  private size() {
    this.k = this.art.clientWidth / SW || 1;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.art.clientWidth * this.dpr);
    this.canvas.height = Math.round(this.art.clientHeight * this.dpr);
    this.painted = true;
  }

  /* ── The HTML, acts one and two ───────────────────────────────────── */

  private set(el: Element | null, key: string, val: string) {
    if (!el) return;
    let w = this.wrote.get(el);
    if (!w) this.wrote.set(el, (w = {}));
    if (w[key] === val) return;
    w[key] = val;
    const s = (el as HTMLElement).style;
    if (key.startsWith("--")) s.setProperty(key, val);
    else if (key.startsWith("@")) el.setAttribute(key.slice(1), val);
    else if (key.startsWith("#")) el.textContent = val;
    else if (key.startsWith("data-")) {
      if (val === "\0") el.removeAttribute(key);
      else el.setAttribute(key, val);
    } else s.setProperty(key, val);
  }

  private move(el: Element | null, x: number, y: number, s: number, o: number) {
    const tx = `translate(${(this.flip * x * this.k).toFixed(1)}px,${(y * this.k).toFixed(1)}px)`;
    this.set(el, "transform", s === 1 ? tx : `${tx} scale(${s.toFixed(3)})`);
    this.set(el, "opacity", o.toFixed(3));
  }

  private place(t: number) {
    const found = (card: number) => t >= scanAt(card) + SCAN * FOUND;

    CARDS.forEach((_, i) => {
      const el = this.cards[i];
      const at = cardAt(i);
      const e = out(seg(t, enterAt(i), ENTER));
      const l = io(seg(t, leaveAt(i), LEAVE));
      this.move(el, at.x, at.y + 34 * (1 - e) + 22 * l, 0.94 + 0.06 * e - 0.1 * l, e * (1 - l));
      const sc = seg(t, scanAt(i), SCAN);
      this.set(el, "--scan", sc.toFixed(3));
      this.set(el, "data-s", sc <= 0 ? "wait" : sc < 1 ? "scan" : "read");
    });

    INSTS.forEach((c, k) => {
      const el = this.insts[k];
      const a = instAt1(k);
      const b = SLOTS[k];
      const e = out(seg(t, enterAt(c.card), ENTER));
      const m = io(seg(t, travelAt(k), TRAVEL));
      const bond = seg(t, bondAt(k), BOND);
      this.move(el, lerp(a.x, b.x, m), lerp(a.y, b.y, m) + 34 * (1 - e) - Math.sin(Math.PI * m) * 26, 1, e);
      this.set(el, "data-s", !found(c.card) ? "raw" : bond >= 1 ? "trusted" : t >= bondAt(k) ? "bond" : "found");
      this.set(el, "--trust", c01((bond - 0.25) / 0.75).toFixed(3));
      this.set(this.bonds[k], "--b", bond.toFixed(3));
      const u = (((t - bondAt(k)) * 1.6 + k * 0.23) % 1 + 1) % 1;
      const p = this.pulses[k];
      this.set(p, "@cx", lerp(HC.x, b.cx, u).toFixed(1));
      this.set(p, "@cy", lerp(HC.y, b.cy, u).toFixed(1));
      this.set(p, "opacity", (bond > 0.3 && t < ACT[2] ? Math.sin(Math.PI * u) : 0).toFixed(2));
    });

    FRAUDS.forEach((f, r) => {
      const el = this.frauds[r];
      const seal = f.kind === "seal";
      const a = fraudAt1(r);
      const b = rowAt(r);
      const j = INSTS.length + r;
      const at = scanAt(f.card) + SCAN * FOUND;
      const e = seal ? out(seg(t, at, 0.3)) : out(seg(t, enterAt(f.card), ENTER));
      const m = io(seg(t, travelAt(j), TRAVEL));
      const gone = seg(t, travelAt(j) + TRAVEL * 0.8, 0.15);
      const y = lerp(a.y, b.y - 8, m) + (seal ? 0 : 34 * (1 - e)) - Math.sin(Math.PI * m) * 26;
      this.move(el, lerp(a.x, b.x, m), y, (seal ? 0.8 + 0.2 * e : 1) * (1 - 0.12 * m), e * (1 - gone));
      this.set(el, "data-s", t >= at ? "fraud" : "raw");
    });

    const h = out(seg(t, HUB_AT, 0.4));
    this.move(this.one.hub, HUB.x, HUB.y, 0.7 + 0.3 * h, h);
    const d = out(seg(t, DB_AT, 0.45));
    this.move(this.one.db, DB.x, DB.y + 18 * (1 - d), 1, d);
    this.set(this.one.db, "data-safe", t >= SAFE ? "" : "\0");
    this.set(this.one.link, "opacity", d.toFixed(3));
    for (let r = 0; r < ROWS; r++) {
      const a = rowTime(r);
      this.set(this.rows[r], "--o", seg(t, a, 0.15).toFixed(3));
      this.set(this.rows[r], "--m", io(seg(t, a + 0.1, 0.35)).toFixed(3));
    }
    const du = (((t - 4.3) * 1.3) % 1 + 1) % 1;
    const dp = this.pulses[INSTS.length];
    this.set(dp, "@cy", lerp(HC.y, DB.y, du).toFixed(1));
    this.set(dp, "opacity", (t > 4.3 && t < 6.3 ? Math.sin(Math.PI * du) : 0).toFixed(2));

    const z = 1 - (1 - ZMIN) * io(seg(t, ZOOM[0], ZOOM[1]));
    this.set(this.one.world, "transform", z === 1 ? "none" : `scale(${z.toFixed(4)})`);
    this.set(this.one.world, "opacity", (1 - seg(t, FADE[0], FADE[1])).toFixed(3));

    const yr = seg(t, YEAR[0], YEAR[1]);
    this.set(this.one.year, "#", yr >= 1 ? this.today : String(2018 + Math.min(7, Math.floor(yr * 8))));
    const counts = [
      CARDS.filter((_, i) => t >= scanAt(i) + SCAN).length,
      INSTS.filter((c) => found(c.card)).length,
      FRAUDS.filter((f) => found(f.card)).length,
    ];
    this.tally.forEach((el, i) => this.set(el, "#", String(counts[i])));
    const f = io(seg(t, COUNT[0], COUNT[1]));
    this.figs.forEach((el) => this.set(el, "#", countUp(el.dataset.fig ?? "", f)));

    this.set(this.art, "data-act", t < ACT[1] ? "0" : t < ACT[2] ? "1" : "2");
    this.set(this.art, "data-mark", t >= MARKED ? "" : "\0");
    this.set(this.art, "data-cap", t >= CAPTION ? "" : "\0");
  }

  /* ── The field and the mark, act three ────────────────────────────── */

  private build(marks: Mark[]) {
    const r = rand(20181);
    const dots: Dot[] = [];
    const add = (d: Partial<Dot>) => dots.push({ k: 0, x: 0, y: 0, p: -1, g: 0, net: false, tx: 0, ty: 0, red: false, c: 0, curl: 0, ...d });
    const ring = () => {
      for (;;) {
        const x = r() * 2 - 1;
        const y = r() * 2 - 1;
        const e = x * x + y * y;
        if (e <= 1 && e >= HOLE * HOLE) return [(x * RX) / ZMIN, (y * RY) / ZMIN];
      }
    };

    // The network on the board, which the HTML hands over to.
    add({ k: 3, net: true });
    SLOTS.forEach((s) => add({ k: 1, x: this.flip * (s.cx - HC.x), y: s.cy - HC.y, net: true }));
    for (let i = 0; i < ROWS; i++) {
      const w = rowAt(i);
      add({ k: 2, x: this.flip * (w.x + 130 - HC.x), y: w.y + 12 - HC.y, net: true });
    }
    // Everything else: institutions, fraud, and the checks round each institution.
    const insts: number[] = [];
    for (let i = 0; i < 110; i++) {
      const [x, y] = ring();
      insts.push(dots.length);
      add({ k: 1, x, y, g: 6.95 + r() * 0.8 });
    }
    for (let i = 0; i < 150; i++) {
      const [x, y] = ring();
      add({ k: 2, x, y });
    }
    const total = Math.max(2100, Math.round(marks.length * 1.15));
    while (dots.length < total) {
      const p = insts[Math.floor(r() * insts.length)];
      const a = r() * TAU;
      const m = Math.sqrt(-2 * Math.log(1 - r() * 0.999)) * 15;
      const x = dots[p].x * ZMIN + Math.cos(a) * m;
      const y = dots[p].y * ZMIN + Math.sin(a) * m * 0.8;
      const e = (x / RX) ** 2 + (y / RY) ** 2;
      if (e > 1 || e < HOLE * HOLE) continue;
      add({ k: 0, x: x / ZMIN, y: y / ZMIN, p, g: 6.9 + r() * 1.0 });
    }

    // Each dot's place in the mark: both sorted round their centres, so a
    // dot flies to the part of the mark on its own side.
    if (marks.length) {
      const ang = (x: number, y: number) => Math.atan2(y, x);
      const order = dots.map((_, i) => i).sort((a, b) => ang(dots[a].x, dots[a].y) - ang(dots[b].x, dots[b].y));
      const ms = [...marks].sort((a, b) => ang(a.x - HC.x, a.y - MARK_Y) - ang(b.x - HC.x, b.y - MARK_Y));
      order.forEach((di, rank) => {
        const mk = ms[Math.floor((rank * ms.length) / order.length)];
        const d = dots[di];
        d.tx = mk.x;
        d.ty = mk.y;
        d.red = mk.red;
        d.c = CONVERGE + SWEEP * ((mk.x - (HC.x - LW / 2)) / LW) + r() * 0.12;
        d.curl = (r() - 0.5) * 70;
      });
    } else dots.forEach((d) => (d.c = Infinity));

    this.dots = dots;
    this.X = new Float32Array(dots.length);
    this.Y = new Float32Array(dots.length);
    this.U = new Float32Array(dots.length);
  }

  /** A dot's fill: its kind's colour turning, in `STEPS`, into the mark's. */
  private style(kind: number, red: boolean, q: number) {
    const key = (kind * 2 + (red ? 1 : 0)) * (STEPS + 1) + q;
    let s = this.styles.get(key);
    if (!s) {
      const { ink, red: rd, ok } = this.pal;
      const from = [ink, ok, rd, rd][kind];
      const to = red ? rd : ink;
      const f = q / STEPS;
      const ch = (i: number) => Math.round(lerp(from[i], to[i], f));
      s = `rgba(${ch(0)},${ch(1)},${ch(2)},${lerp(KIND_A[kind], 1, f).toFixed(3)})`;
      this.styles.set(key, s);
    }
    return s;
  }

  private paint(t: number) {
    const { ctx, canvas, dots, X, Y, U } = this;
    if (t < ACT[2]) {
      if (this.painted) ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.painted = false;
      return;
    }
    this.painted = true;
    const m = this.k * this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(m, 0, 0, m, 0, 0);

    const z = 1 - (1 - ZMIN) * io(seg(t, ZOOM[0], ZOOM[1]));
    const field = seg(t, ZOOM[0], 0.25);
    const net = seg(t, FADE[0], FADE[1]);
    const lines = 1 - seg(t, CONVERGE, 0.35);
    const hx = HC.x;
    const hy = HC.y;

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      let x = hx + d.x * z;
      let y = hy + d.y * z;
      const u = io(seg(t, d.c, FLY));
      if (u > 0) {
        const dx = d.tx - x;
        const dy = d.ty - y;
        const len = Math.hypot(dx, dy) || 1;
        const bend = Math.sin(Math.PI * u) * d.curl;
        x += dx * u - (dy / len) * bend;
        y += dy * u + (dx / len) * bend;
      }
      X[i] = x;
      Y[i] = y;
      U[i] = u;
    }

    // HelloVerify's glow at the middle of the field.
    const glow = (1 - seg(t, CONVERGE, 0.5)) * net;
    if (glow > 0) {
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 46);
      const [r0, g0, b0] = this.pal.red;
      g.addColorStop(0, `rgba(${r0},${g0},${b0},${(0.22 * glow).toFixed(3)})`);
      g.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(hx - 46, hy - 46, 92, 92);
    }

    if (lines > 0) {
      ctx.lineWidth = Math.max(0.5, 0.45 / this.k);
      /** One stroke for every line `each` returns: from a dot, `f` of the way to another. */
      const line = (rgb: RGB, a: number, each: (i: number, d: Dot) => [from: number, to: number, f: number] | null) => {
        ctx.beginPath();
        for (let i = 0; i < dots.length; i++) {
          const l = each(i, dots[i]);
          if (!l) continue;
          const [from, to, f] = l;
          ctx.moveTo(X[from], Y[from]);
          ctx.lineTo(lerp(X[from], X[to], f), lerp(Y[from], Y[to], f));
        }
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
        ctx.stroke();
      };
      // A check joining its institution, as it comes in.
      line(this.pal.ink, 0.11 * lines * field, (i, d) => {
        if (d.k !== 0) return null;
        const g = seg(t, d.g, 0.35);
        return g > 0 ? [d.p, i, g] : null;
      });
      // Every institution, joined to HelloVerify.
      line(this.pal.red, 0.08 * lines * field, (i, d) => {
        if (d.k !== 1 || d.net) return null;
        const g = seg(t, d.g, 0.4);
        return g > 0 ? [0, i, g] : null;
      });
      line(this.pal.ok, 0.5 * lines * net, (i, d) => (d.net && d.k === 1 ? [0, i, 1] : null));
    }

    // The dots, a path per colour.
    const buckets = new Map<number, number[]>();
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if ((d.net ? net : field) <= 0 && U[i] <= 0) continue;
      const q = Math.round(U[i] * STEPS);
      const key = ((d.k * 2 + (d.red ? 1 : 0)) * (STEPS + 1) + q) * 2 + (d.net ? 1 : 0);
      let b = buckets.get(key);
      if (!b) buckets.set(key, (b = []));
      b.push(i);
    }
    const min = 0.7 / this.k;
    buckets.forEach((list, key) => {
      const isNet = key % 2 === 1;
      const rest = (key - (isNet ? 1 : 0)) / 2;
      const q = rest % (STEPS + 1);
      const kr = Math.floor(rest / (STEPS + 1));
      const kind = Math.floor(kr / 2);
      ctx.fillStyle = this.style(kind, kr % 2 === 1, q);
      ctx.globalAlpha = q > 0 ? 1 : isNet ? net : field;
      ctx.beginPath();
      for (const i of list) {
        const rr = Math.max(min, lerp(KIND_R[kind], MARK_R, U[i]));
        ctx.moveTo(X[i] + rr, Y[i]);
        ctx.arc(X[i], Y[i], rr, 0, TAU);
      }
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}

/** The drawing of the `/technology` compounding story (`./TechGrowBoard`).

    `render(t)` puts the scene at story time `t` (`./techGrowPlan`). Acts
    one and two are the island's HTML, which this places in scene units
    and whose `data-s` it sets: a card is `scan` while it is read and
    `read` after; a chip is `raw`, `found` once its card is read, `bond`
    while it bonds to HelloVerify and then `trusted`, or `fraud`. Act
    three is the canvas behind the whole frame: the view pulls back over a
    field of checks (ink), institutions (green) and fraud (red), each check
    joining its institution as it comes in, until every dot flies to its
    place in the HelloVerify mark, sampled from the hub's own logo.

    Nothing here runs on its own: `./TechCompoundStage` calls `render` as
    the page scrolls. Colour is read from the stylesheet. */
import { cssRgb, type RGB } from "@/lib/cssColour";
import {
  ACT, BOND, CAPTION, CARDS, CHIP, CHIP_IN, CONVERGE, COUNT, DB_AT, DRIFT, ENTER, FADE, FLOAT_IN, FLY, FOUND, HUB_AT,
  INSTS, LEAVE, MARKED, MARK_Y, MESH, ROWS, SAFE, SCAN, SH, SWEEP, TALL, TRAVEL, WIDE, WIDER, WIDER_AT, YEAR, ZMIN,
  ZOOM, along, away, bondAt, curveD, enterAt, hubOf, leaveAt, rowAt, rowTime, scanAt, slotAt, strands, tieOf,
  travelAt, type Layout,
} from "./techGrowPlan";

const TAU = Math.PI * 2;
const c01 = (n: number) => Math.min(1, Math.max(0, n));
const seg = (t: number, a: number, d: number) => c01((t - a) / d);
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const out = (x: number) => 1 - (1 - x) ** 3;
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const rand = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const frac = (n: number) => ((n % 1) + 1) % 1;

/** A figure counted up to `f` of itself: each number in it scales, the
    rest of it stays ("20M+" at a half is "10M+"). */
const countUp = (v: string, f: number) =>
  f >= 1 ? v : v.replace(/\d[\d,]*/g, (n) => Math.round(Number(n.replace(/,/g, "")) * f).toLocaleString("en-US"));

/** The field once the view has pulled back is an ellipse round the hub as
    big as the page (the layout's `field`), its middle left to the network. */
const HOLE = 0.17;
/** Radii, in scene units: a check, an institution, a fraud, HelloVerify. */
const KIND_R = [1.0, 1.7, 1.3, 3.4];
const KIND_A = [0.5, 0.95, 0.9, 1];
const MARK_R = 1.18;
/** The mark's sampling pitch, in scene units. */
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
    staggered grid, `lw` units wide and centred on `cx`. */
function sampleMark(svg: SVGSVGElement, lw: number, cx: number): Mark[] {
  const vb = svg.viewBox.baseVal;
  const scale = lw / vb.width;
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
  const ox = cx - lw / 2;
  const oy = MARK_Y - lh / 2;
  const marks: Mark[] = [];
  for (let row = 0, y = PITCH / 2; y < lh; y += PITCH * 0.866, row++) {
    for (let x = row % 2 ? PITCH : PITCH / 2; x < lw; x += PITCH) {
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
  private L: Layout | null = null;
  private hub = hubOf(WIDE);
  private logo: SVGSVGElement | null;
  private k = 1;
  private dpr = 1;
  private flip = 1;
  /** Where the scene's corner sits on the canvas, in CSS pixels. */
  private ox = 0;
  private oy = 0;
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
  private chips: HTMLElement[];
  private rows: HTMLElement[];
  private ties: { g: Element; a: Element | null; b: Element | null; out: Element | null; back: Element | null }[];
  private mesh: Element[];
  private aura: Element[];
  private far: Element[];
  private crowd: HTMLElement[];
  private wider: HTMLElement[];
  private figs: HTMLElement[];
  private one: Record<"world" | "hub" | "db" | "link" | "dbpulse" | "far" | "year", Element | null>;
  private today: string;

  constructor(
    private art: HTMLElement,
    private canvas: HTMLCanvasElement,
  ) {
    this.ctx = canvas.getContext("2d")!;
    const all = <E extends Element>(s: string) => [...art.querySelectorAll<E>(s)];
    this.cards = all("[data-card]");
    this.chips = all("[data-chip]");
    this.rows = all("[data-row]");
    this.ties = all("[data-tie]").map((g) => ({
      g,
      a: g.querySelector(".tk-cx-tie-a"),
      b: g.querySelector(".tk-cx-tie-b"),
      out: g.querySelector(".tk-cx-pulse:not(.tk-cx-pulse-back)"),
      back: g.querySelector(".tk-cx-pulse-back"),
    }));
    this.mesh = all("[data-mesh]");
    this.aura = all("[data-aura]");
    this.far = all(".tk-cx-far line");
    this.crowd = all("[data-ghost]");
    this.wider = all("[data-wider]");
    this.figs = all("[data-fig]");
    const one = (s: string) => art.querySelector(s);
    this.one = {
      world: one(".tk-cx-world"), hub: one(".tk-cx-hub"), db: one(".tk-cx-db"), link: one(".tk-cx-dblink"),
      dbpulse: one("[data-dbpulse]"), far: one(".tk-cx-far"), year: one(".tk-cx-year"),
    };
    this.today = this.one.year?.textContent ?? "";

    const cs = getComputedStyle(art);
    const tok = (n: string) => cssRgb(cs.getPropertyValue(n));
    this.pal = { ink: tok("--ink"), red: tok("--primary"), ok: tok("--tk-ok") };
    this.flip = cs.direction === "rtl" ? -1 : 1;
    this.logo = art.querySelector<SVGSVGElement>(".tk-cx-hub svg");

    this.ro = new ResizeObserver(() => {
      this.size();
      this.render(this.t);
    });
    this.ro.observe(art);
    this.ro.observe(canvas);
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
    const L = Number.parseFloat(getComputedStyle(this.art).getPropertyValue("--sw")) < WIDE.sw ? TALL : WIDE;
    if (L !== this.L) this.layout(L);
    this.k = this.art.clientWidth / L.sw || 1;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(c.width * this.dpr);
    this.canvas.height = Math.round(c.height * this.dpr);
    this.painted = true;
  }

  /** Moves the parts that are not placed each frame onto `L`'s plan, and
      lays the field out for it. */
  private layout(L: Layout) {
    this.L = L;
    this.hub = hubOf(L);
    const h = this.hub;
    this.art.querySelector(".tk-cx-bonds")?.setAttribute("viewBox", `0 0 ${L.sw} ${SH}`);
    const line = (el: Element | null | undefined, x1: number, y1: number, x2: number, y2: number) => {
      el?.setAttribute("x1", String(x1));
      el?.setAttribute("y1", String(y1));
      el?.setAttribute("x2", String(x2));
      el?.setAttribute("y2", String(y2));
    };
    line(this.one.link, h.cx, h.cy, h.cx, L.db.y);
    this.one.dbpulse?.setAttribute("cx", String(h.cx));
    MESH.forEach(([a, b], i) => line(this.mesh[i], L.insts[a][0], L.insts[a][1], L.insts[b][0], L.insts[b][1]));
    this.far.forEach((el, i) => line(el, h.cx, h.cy, L.wider[i].x + CHIP.w / 2, L.wider[i].y + CHIP.h / 2));
    this.aura.forEach((el) => el.setAttribute("cx", String(h.cx)));
    this.ties.forEach(({ g }, k) => g.querySelector(".tk-cx-tie-glow")?.setAttribute("d", curveD(tieOf(L, k))));
    this.wrote = new WeakMap();
    this.build(this.logo ? sampleMark(this.logo, L.lw, h.cx) : []);
  }

  /** Where the scene's corner sits on the canvas; read as it is painted,
      since the claims above it change height on a phone. */
  private offset() {
    const c = this.canvas.getBoundingClientRect();
    const a = this.art.getBoundingClientRect();
    this.ox = a.left - c.left;
    this.oy = a.top - c.top;
  }

  /* ── The HTML, acts one and two ───────────────────────────────────── */

  private set(el: Element | null | undefined, key: string, val: string) {
    if (!el) return;
    let w = this.wrote.get(el);
    if (!w) this.wrote.set(el, (w = {}));
    if (w[key] === val) return;
    w[key] = val;
    const s = (el as HTMLElement).style;
    if (key.startsWith("@")) el.setAttribute(key.slice(1), val);
    else if (key === "#") el.textContent = val;
    else if (key.startsWith("data-")) {
      if (val === "\0") el.removeAttribute(key);
      else el.setAttribute(key, val);
    } else s.setProperty(key, val);
  }

  private move(el: Element | null | undefined, x: number, y: number, s: number, o: number) {
    const tx = `translate(${(this.flip * x * this.k).toFixed(1)}px,${(y * this.k).toFixed(1)}px)`;
    this.set(el, "transform", s === 1 ? tx : `${tx} scale(${s.toFixed(3)})`);
    this.set(el, "opacity", o.toFixed(3));
  }

  private place(t: number) {
    const L = this.L ?? WIDE;
    const hub = this.hub;
    const found = (i: number) => t >= scanAt(i) + SCAN * FOUND;
    const bond = INSTS.map((_, k) => seg(t, bondAt(k), BOND));

    CARDS.forEach((c, i) => {
      // The card floats in from its side, drifts while it is read, and
      // drifts back out once its check has given up what it holds.
      const [cx0, cy0] = L.cards[i];
      const d = away(L, cx0, cy0);
      const e = out(seg(t, enterAt(i), ENTER));
      const l = io(seg(t, leaveAt(i), LEAVE));
      const drift = DRIFT * Math.min(t, ACT[1]);
      const bx = cx0 + d.x * FLOAT_IN * (1 - e) - d.y * drift;
      const by = cy0 + d.y * FLOAT_IN * (1 - e) + d.x * drift;
      this.move(this.cards[i], bx + d.x * 90 * l, by + d.y * 90 * l, 1 - 0.12 * l, e * (1 - l));
      const sc = seg(t, scanAt(i), SCAN);
      this.set(this.cards[i], "--scan", sc.toFixed(3));
      this.set(this.cards[i], "data-s", sc <= 0 ? "wait" : sc < 1 ? "scan" : "read");

      // Its chip rides along its foot, then flies to its node or its row.
      const bad = c.fraud !== undefined;
      const goal = bad ? { x: rowAt(L, c.fraud ?? 0).x, y: rowAt(L, c.fraud ?? 0).y - 4 } : slotAt(L, c.inst ?? 0);
      const m = io(seg(t, travelAt(i), TRAVEL));
      const gone = bad ? seg(t, travelAt(i) + TRAVEL * 0.8, 0.15) : 0;
      const x = lerp(bx + CHIP_IN.x, goal.x, m);
      const y = lerp(by + CHIP_IN.y, goal.y, m) - Math.sin(Math.PI * m) * 30;
      this.move(this.chips[i], x, y, bad ? 1 - 0.1 * m : 1, e * (1 - gone));
      const k = c.inst ?? 0;
      const b = bond[k];
      this.set(this.chips[i], "data-s", !found(i) ? "raw" : bad ? "fraud" : b >= 1 ? "trusted" : t >= bondAt(k) ? "bond" : "found");
      if (!bad) this.set(this.chips[i], "--trust", c01((b - 0.25) / 0.75).toFixed(3));
    });

    // The crowd floats in with the cards, slower and softer, is read in
    // passing, and drifts out as the candidates do.
    L.crowd.forEach((g, i) => {
      const el = this.crowd[i];
      const d = away(L, g.x, g.y);
      const e = out(seg(t, 0.1 + (i % 9) * 0.07, 0.8));
      const l = io(seg(t, ACT[1] + (i % 7) * 0.03, 0.5));
      const drift = DRIFT * 0.5 * Math.min(t, ACT[1]);
      const alpha = (0.62 - g.depth * 0.36) * (g.x + 68 < 0 ? 0.45 : 1);
      const x = g.x + d.x * (FLOAT_IN * 0.6 * (1 - e) + 70 * l) - d.y * drift;
      const y = g.y + d.y * (FLOAT_IN * 0.6 * (1 - e) + 70 * l) + d.x * drift;
      this.move(el, x, y, 0.9 - g.depth * 0.12, e * (1 - l) * alpha);
      this.set(el, "data-s", t >= g.at ? (g.bad ? "bad" : "ok") : "\0");
    });
    L.wider.forEach((g, i) => {
      const el = this.wider[i];
      const d = away(L, g.x, g.y);
      const e = out(seg(t, WIDER_AT[0] + (i % 6) * 0.07, 0.7));
      const alpha = (0.62 - g.depth * 0.36) * (g.x + 61 < 0 ? 0.45 : 1);
      this.move(el, g.x + d.x * 50 * (1 - e), g.y + d.y * 50 * (1 - e), 0.92 - g.depth * 0.1, e * alpha);
      this.set(el, "data-s", t >= WIDER_AT[0] + 0.5 + (i / WIDER) * WIDER_AT[1] ? "trusted" : "\0");
    });
    this.set(this.one.far, "opacity", (seg(t, WIDER_AT[0] + 0.3, 0.8) * 0.9).toFixed(3));

    // Each bond: the strands reach out, then braid tighter as trust grows,
    // turning as the page scrolls, with a pulse out and a pulse back.
    INSTS.forEach((_, k) => {
      const tie = this.ties[k];
      const b = bond[k];
      const c = tieOf(L, k);
      this.set(tie.g, "--b", b.toFixed(3));
      const [sa, sb] = b > 0 ? strands(c, Math.min(1, b * 3), c01((b - 0.25) / 0.75), t * 2.4 + k) : ["", ""];
      this.set(tie.a, "@d", sa);
      this.set(tie.b, "@d", sb);
      const live = b > 0.35 && t < ACT[2];
      const u = frac((t - bondAt(k)) * 1.5 + k * 0.23);
      const v = frac(u + 0.5);
      const [ox, oy] = along(c, u);
      const [bx, by] = along(c, 1 - v);
      this.set(tie.out, "@cx", ox.toFixed(1));
      this.set(tie.out, "@cy", oy.toFixed(1));
      this.set(tie.out, "opacity", (live ? Math.sin(Math.PI * u) : 0).toFixed(2));
      this.set(tie.back, "@cx", bx.toFixed(1));
      this.set(tie.back, "@cy", by.toFixed(1));
      this.set(tie.back, "opacity", (live ? Math.sin(Math.PI * v) : 0).toFixed(2));
    });
    // Trusted neighbours knit into a web, and rings of trust gather round
    // the hub as the trusted nodes add up.
    MESH.forEach(([a, b], i) => this.set(this.mesh[i], "--m", seg(t, Math.max(bondAt(a), bondAt(b)) + BOND, 0.3).toFixed(3)));
    const trusted = bond.reduce((n, b) => n + Math.min(1, b), 0);
    this.aura.forEach((el, i) => {
      this.set(el, "--a", c01((trusted - (1 + i * 3)) / 3).toFixed(3));
      this.set(el, "stroke-dashoffset", (t * (14 + i * 6) * (i % 2 ? 1 : -1)).toFixed(1));
    });

    const h = out(seg(t, HUB_AT, 0.4));
    this.move(this.one.hub, hub.x, hub.y, 0.7 + 0.3 * h, h);
    const d = out(seg(t, DB_AT, 0.45));
    this.move(this.one.db, L.db.x, L.db.y + 18 * (1 - d), 1, d);
    this.set(this.one.db, "data-safe", t >= SAFE ? "" : "\0");
    this.set(this.one.link, "opacity", d.toFixed(3));
    for (let r = 0; r < ROWS; r++) {
      const a = rowTime(r);
      this.set(this.rows[r], "--o", seg(t, a, 0.15).toFixed(3));
      this.set(this.rows[r], "--m", io(seg(t, a + 0.1, 0.35)).toFixed(3));
    }
    const du = frac((t - 4.3) * 1.3);
    this.set(this.one.dbpulse, "@cy", lerp(hub.cy, L.db.y, du).toFixed(1));
    this.set(this.one.dbpulse, "opacity", (t > 4.3 && t < 6.5 ? Math.sin(Math.PI * du) : 0).toFixed(2));

    const z = 1 - (1 - ZMIN) * io(seg(t, ZOOM[0], ZOOM[1]));
    this.set(this.one.world, "transform", z === 1 ? "none" : `scale(${z.toFixed(4)})`);
    this.set(this.one.world, "opacity", (1 - seg(t, FADE[0], FADE[1])).toFixed(3));

    const yr = seg(t, YEAR[0], YEAR[1]);
    this.set(this.one.year, "#", yr >= 1 ? this.today : String(2018 + Math.min(7, Math.floor(yr * 8))));
    const f = io(seg(t, COUNT[0], COUNT[1]));
    this.figs.forEach((el) => this.set(el, "#", countUp(el.dataset.fig ?? "", f)));

    this.set(this.art, "data-act", t < ACT[1] ? "0" : t < ACT[2] ? "1" : "2");
    this.set(this.art, "data-mark", t >= MARKED ? "" : "\0");
    this.set(this.art, "data-cap", t >= CAPTION ? "" : "\0");
  }

  /* ── The field and the mark, act three ────────────────────────────── */

  private build(marks: Mark[]) {
    const L = this.L ?? WIDE;
    const [RX, RY, n] = L.field;
    const { cx, cy } = this.hub;
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

    // The network on the scene, which the HTML hands over to.
    add({ k: 3, net: true });
    L.insts.forEach(([x, y]) => add({ k: 1, x: this.flip * (x - cx), y: y - cy, net: true }));
    for (let i = 0; i < ROWS; i++) {
      const w = rowAt(L, i);
      add({ k: 2, x: this.flip * (w.x + 131 - cx), y: w.y + 11 - cy, net: true });
    }
    // Everything else: institutions, fraud, and the checks round each institution.
    const insts: number[] = [];
    for (let i = 0; i < n * 0.05; i++) {
      const [x, y] = ring();
      insts.push(dots.length);
      add({ k: 1, x, y, g: 6.95 + r() * 0.8 });
    }
    for (let i = 0; i < n * 0.058; i++) {
      const [x, y] = ring();
      add({ k: 2, x, y });
    }
    const total = Math.max(n, Math.round(marks.length * 1.15));
    while (dots.length < total) {
      const p = insts[Math.floor(r() * insts.length)];
      const a = r() * TAU;
      const m = Math.sqrt(-2 * Math.log(1 - r() * 0.999)) * 20;
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
      const ms = [...marks].sort((a, b) => ang(a.x - cx, a.y - MARK_Y) - ang(b.x - cx, b.y - MARK_Y));
      order.forEach((di, rank) => {
        const mk = ms[Math.floor((rank * ms.length) / order.length)];
        const d = dots[di];
        d.tx = mk.x;
        d.ty = mk.y;
        d.red = mk.red;
        d.c = CONVERGE + SWEEP * ((mk.x - (cx - L.lw / 2)) / L.lw) + r() * 0.12;
        d.curl = (r() - 0.5) * 90;
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
      if (this.painted) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      this.painted = false;
      return;
    }
    this.painted = true;
    this.offset();
    const m = this.k * this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(m, 0, 0, m, this.ox * this.dpr, this.oy * this.dpr);

    const z = 1 - (1 - ZMIN) * io(seg(t, ZOOM[0], ZOOM[1]));
    const field = seg(t, ZOOM[0], 0.25);
    const net = seg(t, FADE[0], FADE[1]);
    const lines = 1 - seg(t, CONVERGE, 0.35);
    const hx = this.hub.cx;
    const hy = this.hub.cy;

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
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 60);
      const [r0, g0, b0] = this.pal.red;
      g.addColorStop(0, `rgba(${r0},${g0},${b0},${(0.22 * glow).toFixed(3)})`);
      g.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(hx - 60, hy - 60, 120, 120);
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
      line(this.pal.ink, 0.09 * lines * field, (i, d) => {
        if (d.k !== 0) return null;
        const g = seg(t, d.g, 0.35);
        return g > 0 ? [d.p, i, g] : null;
      });
      // Every institution, joined to HelloVerify.
      line(this.pal.red, 0.06 * lines * field, (i, d) => {
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

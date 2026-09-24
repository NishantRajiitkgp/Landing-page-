/** The simulation behind the homepage's live trust network
    (`components/sections/TrustNetwork.tsx`): force physics, growth by year,
    signals, pointer focus and drawing, on one 2D canvas.

    Ported from the Desktop4 board's `nwInit`/`nwFrame` (`assemble_graph.py`);
    constants, timings and drawing order are the board's. It lives here, not
    in the component, because it is imperative engine code with no React in
    it — the component owns the DOM, the slider state and the pause context,
    and hands this module three getters. (It also keeps the component under
    the 300-line cap `eslint.config.mjs` sets for `components/**`.)

    Browser-only: it is called from an effect, never during render, so the
    `Math.random()` in signal timing and growth jitter cannot reach the
    server's HTML. See the component's header for the colour, offscreen and
    reduced-motion rules this implements. */

import { GRAPH_EDGES, GRAPH_NODES } from "@/lib/platformGraph";
import { LAST } from "@/lib/trustNetworkSteps";

export { LAST };

const W = 700;
const H = 500;
const CX = 350;
const CY = 250;
/** The medallion's keep-out radius in drawing units (132px disc + dial). */
const KEEP = 92;
const TAU = 6.2832;

type Node = {
  ax: number; ay: number; x: number; y: number; vx: number; vy: number; fx: number; fy: number;
  st: number; cu: boolean; par: number; ph: number; al: number; on: boolean; born: boolean;
  due: number; fl: number; deg: number; nb: number[]; kids: number[]; r: number;
};
type Edge = { a: number; b: number; L: number; hot: number };
type Pulse = { a: number; b: number; t0: number; dur: number; chain: boolean };
type Rgb = [number, number, number];

/** `#RRGGBB` or `rgb(r, g, b)` → channels. A computed custom property is the
 *  declared text, so both spellings can arrive. */
function parse(v: string): Rgb {
  const s = v.trim();
  // The build minifies `#FFFFFF` to `#fff`, so the short form arrives too.
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = s.match(/[\d.]+/g);
  return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : [0, 0, 0];
}
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

export type NodeCopy = { institution: string; customer: string; one: string; many: string };

/** The subset of a pointer event the handlers read; a React
 *  `PointerEvent<HTMLDivElement>` satisfies it. */
type Ptr = { clientX: number; clientY: number; pointerId: number; pointerType: string; currentTarget: HTMLElement; preventDefault(): void };

export type TrustNetworkSim = {
  /** Re-read `net` and `paused`, and restart the loop if it had stopped. */
  refresh: () => void;
  down: (e: Ptr) => void;
  move: (e: Ptr) => void;
  up: (e: Ptr) => void;
  leave: (e: Ptr) => void;
  destroy: () => void;
};

export function createTrustNetwork(
  cv: HTMLCanvasElement,
  stage: HTMLElement,
  opts: { net: () => number; paused: () => boolean; copy: NodeCopy },
): TrustNetworkSim | null {
  const ctx = cv.getContext("2d");
  if (!ctx) return null;

  const css = getComputedStyle(stage);
  const tok = (name: string) => parse(css.getPropertyValue(name));
  const GREEN = tok("--green");
  const GLOW = tok("--green-light");
  const INK = tok("--ink");
  const WHITE = tok("--white");
  const DEEP = tok("--v2-tq-green-deep");
  const MINT = tok("--v2-tq-mint");
  const MONO = css.getPropertyValue("--mono").trim() || "ui-monospace, monospace";

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr;
  cv.height = H * dpr;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const N: Node[] = GRAPH_NODES.map(([ax, ay, st, cu, par], i) => ({
    ax, ay, x: CX, y: CY, vx: 0, vy: 0, fx: 0, fy: 0, st, cu: cu === 1, par, ph: i * 2.399,
    al: i ? 0 : 1, on: !i, born: !i, due: 0, fl: 0, deg: 0, nb: [], kids: [], r: 3,
  }));
  const E: Edge[] = GRAPH_EDGES.map(([a, b]) => {
    const A = N[a], B = N[b];
    A.deg++; B.deg++; A.nb.push(b); B.nb.push(a); A.kids.push(b);
    return { a, b, L: Math.hypot(A.ax - B.ax, A.ay - B.ay), hot: 0 };
  });
  N.forEach((n) => { n.r = 2.3 + Math.sqrt(n.deg) * 1.15; });

  const P = { x: -999, y: -999, in: false };
  let hov = -1, drag = -1, hub = false, pul: Pulse[] = [], next = 0, amb = 0, shown = -1;
  let auto = true, start: number | null = null, visible = false, raf = 0, running = false, busy = true;

  const send = (a: number, b: number, t: number, chain: boolean) => {
    if (pul.length > 46) return;
    pul.push({ a, b, t0: t, dur: 520 + Math.random() * 380, chain });
  };
  /** Where an edge from the hub leaves the medallion's rim, not its centre. */
  const rim = (B: Node) => {
    const d = Math.hypot(B.x - CX, B.y - CY) || 1;
    return [CX + ((B.x - CX) * 66) / d, CY + ((B.y - CY) * 66) / d];
  };

  const t_ = opts.copy;

  function frame(t: number) {
    const calm = !auto;
    const net = opts.net();
    busy = false;
    // growth: reveal or retire nodes as the year changes
    if (start !== null && net !== shown) {
      const first = shown === -1, from = first ? 0 : shown;
      for (let i = 1; i < N.length; i++) {
        const n = N[i], want = n.st <= net;
        if (want && !n.on) {
          n.on = true;
          n.due = calm ? t : t + (first ? 260 + n.st * 210 + Math.random() * 240 : Math.max(0, n.st - from) * 140 + Math.random() * 260);
        } else if (!want && n.on) {
          n.on = false;
        }
      }
      shown = net;
    }
    // physics
    const kA = drag >= 0 ? 0.005 : 0.02;
    for (let i = 1; i < N.length; i++) {
      const n = N[i];
      if (n.on && !n.born) {
        busy = true;
        if (t < n.due) continue;
        const p = N[n.par >= 0 ? n.par : 0];
        const ang = Math.atan2(n.ay - p.y, n.ax - p.x);
        n.x = p.x + Math.cos(ang) * (n.par ? 2 : 70); n.y = p.y + Math.sin(ang) * (n.par ? 2 : 50);
        n.vx = Math.cos(ang) * 2.2; n.vy = Math.sin(ang) * 2.2;
        n.born = true; n.fl = 1;
        if (n.par >= 0 && !calm) send(n.par, i, t, false);
      }
      if (!n.born) continue;
      if (n.on) n.al += (1 - n.al) * 0.1;
      else { n.al += (0 - n.al) * 0.14; if (n.al < 0.02) { n.born = false; n.al = 0; continue; } }
      let tx, ty, k = kA;
      if (n.on) {
        tx = n.ax + (calm ? 0 : Math.sin(t * 0.00052 + n.ph) * 3.4);
        ty = n.ay + (calm ? 0 : Math.cos(t * 0.00043 + n.ph * 1.3) * 3.4);
      } else {
        const p = N[n.par >= 0 ? n.par : 0]; tx = p.x; ty = p.y; k = 0.09;
      }
      n.fx = (tx - n.x) * k; n.fy = (ty - n.y) * k;
      if (P.in && drag < 0 && n.on) {
        const dx = P.x - n.x, dy = P.y - n.y, dd = Math.hypot(dx, dy);
        if (dd < 120 && dd > 0.1) { const f = (1 - dd / 120) * (1 - dd / 120) * 0.2; n.fx += (dx / dd) * f; n.fy += (dy / dd) * f; }
      }
      const cx = n.x - CX, cy = n.y - CY, cd = Math.hypot(cx, cy);
      if (cd < KEEP && cd > 0.1) { n.fx += (cx / cd) * (KEEP - cd) * 0.09; n.fy += (cy / cd) * (KEEP - cd) * 0.09; }
    }
    for (const e of E) {
      const A = N[e.a], B = N[e.b];
      if (!A.born || !B.born || !A.on || !B.on) continue;
      const dx = B.x - A.x, dy = B.y - A.y, dd = Math.hypot(dx, dy) || 0.1;
      const f = (dd - e.L) * (drag >= 0 ? 0.03 : 0.018), fx = (dx / dd) * f, fy = (dy / dd) * f;
      if (e.a) { A.fx += fx; A.fy += fy; }
      B.fx -= fx; B.fy -= fy;
    }
    for (let i = 1; i < N.length; i++) {
      const A = N[i];
      if (!A.born) continue;
      for (let j = i + 1; j < N.length; j++) {
        const B = N[j];
        if (!B.born) continue;
        const dx = B.x - A.x, dy = B.y - A.y, d2 = dx * dx + dy * dy;
        if (d2 < 484 && d2 > 0.01) { const dd = Math.sqrt(d2), f = ((22 - dd) / dd) * 0.03; A.fx -= dx * f; A.fy -= dy * f; B.fx += dx * f; B.fy += dy * f; }
      }
    }
    for (let i = 1; i < N.length; i++) {
      const n = N[i];
      if (!n.born) continue;
      if (i === drag) { n.x += (P.x - n.x) * 0.5; n.y += (P.y - n.y) * 0.5; n.vx = n.vy = 0; continue; }
      n.vx = (n.vx + n.fx) * 0.84; n.vy = (n.vy + n.fy) * 0.84;
      n.x += n.vx; n.y += n.vy;
      if (Math.abs(n.vx) + Math.abs(n.vy) > 0.02 || (n.on ? n.al < 0.99 : true) || n.fl > 0) busy = true;
    }
    // signals: verifications flowing out from the hub, and ambient traffic
    if (!calm && start !== null) {
      if (t > next) {
        const k = N[0].kids.filter((c) => N[c].on && N[c].al > 0.6);
        if (k.length) send(0, k[Math.floor(Math.random() * k.length)], t, true);
        next = t + 650 + Math.random() * 500;
      }
      if (t > amb) {
        const e = E[Math.floor(Math.random() * E.length)];
        if (N[e.a].on && N[e.b].on && N[e.a].al > 0.6 && N[e.b].al > 0.6) send(e.a, e.b, t, false);
        amb = t + 260 + Math.random() * 260;
      }
    }
    // focus
    const hv = drag >= 0 ? drag : hov;
    const hubOn = hub && drag < 0 && hv < 0;
    const focus = hv >= 0 ? N[hv] : null;
    const isNb = (i: number) => i === hv || (focus !== null && focus.nb.indexOf(i) >= 0);
    // draw
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    ctx!.save();
    ctx!.strokeStyle = rgba(GREEN, 0.1); ctx!.lineWidth = 1; ctx!.setLineDash([2, 6]);
    [128, 196, 268].forEach((r) => { ctx!.beginPath(); ctx!.ellipse(CX, CY, r * 1.32, r * 0.86, 0, 0, TAU); ctx!.stroke(); });
    ctx!.restore();
    if (P.in && drag < 0) {
      const g = ctx!.createRadialGradient(P.x, P.y, 0, P.x, P.y, 130);
      g.addColorStop(0, rgba(GLOW, 0.28)); g.addColorStop(1, rgba(GLOW, 0));
      ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(P.x, P.y, 130, 0, TAU); ctx!.fill();
    }
    const dim = focus || hubOn ? 0.28 : 1;
    ctx!.lineCap = "round";
    for (const e of E) {
      const A = N[e.a], B = N[e.b];
      if (!A.born || !B.born) continue;
      const al = Math.min(A.al, B.al);
      if (al < 0.01) continue;
      e.hot *= 0.94;
      if (e.hot > 0.02) busy = true;
      const lit = (focus && (e.a === hv || e.b === hv)) || (hubOn && e.a === 0);
      let near = 0;
      if (P.in && !focus) {
        const md = Math.hypot((A.x + B.x) / 2 - P.x, (A.y + B.y) / 2 - P.y);
        near = md < 110 ? 1 - md / 110 : 0;
      }
      const [x1, y1] = e.a ? [A.x, A.y] : rim(B);
      ctx!.beginPath(); ctx!.moveTo(x1, y1); ctx!.lineTo(B.x, B.y);
      if (lit) {
        ctx!.strokeStyle = rgba(GREEN, 0.85 * al); ctx!.lineWidth = 1.6;
        ctx!.shadowColor = rgba(GREEN, 0.45); ctx!.shadowBlur = 8; ctx!.stroke(); ctx!.shadowBlur = 0;
      } else {
        ctx!.strokeStyle = rgba(GREEN, (0.2 + near * 0.35 + e.hot * 0.45) * dim * al);
        ctx!.lineWidth = 1 + near * 0.4 + e.hot * 0.6; ctx!.stroke();
      }
    }
    // cursor feelers: the pointer reaches for the nearest nodes
    if (P.in && drag < 0 && hv < 0 && !hubOn) {
      const near: [number, Node][] = [];
      for (let i = 1; i < N.length; i++) {
        const n = N[i];
        if (!n.on || n.al < 0.5) continue;
        const dd = Math.hypot(n.x - P.x, n.y - P.y);
        if (dd < 95) near.push([dd, n]);
      }
      near.sort((a, b) => a[0] - b[0]);
      ctx!.save(); ctx!.setLineDash([2, 4]); ctx!.lineDashOffset = calm ? 0 : -t * 0.03;
      near.slice(0, 4).forEach(([dd, n]) => {
        ctx!.strokeStyle = rgba(GREEN, 0.55 * (1 - dd / 95)); ctx!.lineWidth = 1;
        ctx!.beginPath(); ctx!.moveTo(P.x, P.y); ctx!.lineTo(n.x, n.y); ctx!.stroke();
      });
      ctx!.restore();
      ctx!.fillStyle = rgba(GREEN, 0.9); ctx!.beginPath(); ctx!.arc(P.x, P.y, 2.2, 0, TAU); ctx!.fill();
    }
    // signals
    const keep: Pulse[] = [];
    for (const p of pul) {
      const A = N[p.a], B = N[p.b];
      if (!A.born || !B.born || !B.on) continue;
      const u = (t - p.t0) / p.dur;
      if (u >= 1) {
        B.fl = 1;
        const e = E.find((x) => (x.a === p.a && x.b === p.b) || (x.a === p.b && x.b === p.a));
        if (e) e.hot = 1;
        if (p.chain && !calm && Math.random() < 0.8) {
          const k = B.kids.filter((c) => N[c].on && N[c].al > 0.6);
          if (k.length) send(p.b, k[Math.floor(Math.random() * k.length)], t, true);
        }
        continue;
      }
      keep.push(p);
      const ez = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const [sx, sy] = p.a ? [A.x, A.y] : rim(B);
      const x = sx + (B.x - sx) * ez, y = sy + (B.y - sy) * ez;
      const u2 = Math.max(0, ez - 0.22), tx = sx + (B.x - sx) * u2, ty = sy + (B.y - sy) * u2;
      const g = ctx!.createLinearGradient(tx, ty, x, y);
      g.addColorStop(0, rgba(GREEN, 0)); g.addColorStop(1, rgba(GREEN, 0.75 * dim + 0.2));
      ctx!.strokeStyle = g; ctx!.lineWidth = 2; ctx!.beginPath(); ctx!.moveTo(tx, ty); ctx!.lineTo(x, y); ctx!.stroke();
      const hg = ctx!.createRadialGradient(x, y, 0, x, y, 9);
      hg.addColorStop(0, rgba(GLOW, 0.9)); hg.addColorStop(1, rgba(GLOW, 0));
      ctx!.fillStyle = hg; ctx!.beginPath(); ctx!.arc(x, y, 9, 0, TAU); ctx!.fill();
      ctx!.fillStyle = rgba(GREEN, 1); ctx!.beginPath(); ctx!.arc(x, y, 2.1, 0, TAU); ctx!.fill();
    }
    pul = keep;
    if (pul.length) busy = true;
    // nodes
    for (let i = 1; i < N.length; i++) {
      const n = N[i];
      if (!n.born || n.al < 0.01) continue;
      let prox = 0;
      if (P.in && drag < 0) { const dd = Math.hypot(n.x - P.x, n.y - P.y); prox = dd < 120 ? 1 - dd / 120 : 0; }
      const on = i === hv, nb = focus !== null && isNb(i);
      const a = n.al * (focus && !nb ? 0.22 : 1);
      const r = n.r * (1 + prox * 0.4) * (on ? 1.55 : nb ? 1.2 : 1) * (0.4 + 0.6 * n.al);
      if (n.fl > 0) {
        ctx!.strokeStyle = rgba(GREEN, n.fl * 0.55 * a); ctx!.lineWidth = 1.2;
        ctx!.beginPath(); ctx!.arc(n.x, n.y, r + (1 - n.fl) * 16, 0, TAU); ctx!.stroke();
        n.fl = Math.max(0, n.fl - 0.022);
      }
      if (on || nb) {
        const hg = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        hg.addColorStop(0, rgba(GLOW, on ? 0.7 : 0.4)); hg.addColorStop(1, rgba(GLOW, 0));
        ctx!.fillStyle = hg; ctx!.beginPath(); ctx!.arc(n.x, n.y, r * 4, 0, TAU); ctx!.fill();
      }
      ctx!.globalAlpha = a;
      ctx!.beginPath(); ctx!.arc(n.x, n.y, r, 0, TAU);
      if (n.cu) { ctx!.fillStyle = rgba(on ? DEEP : GREEN, 1); ctx!.fill(); }
      else {
        ctx!.fillStyle = rgba(on ? MINT : WHITE, 1); ctx!.fill();
        ctx!.strokeStyle = rgba(on || nb ? GREEN : INK, 1); ctx!.lineWidth = on ? 1.8 : 1.3; ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }
    // label for the focused node
    if (focus && focus.al > 0.5) {
      const txt = `${focus.cu ? t_.customer : t_.institution} · ${focus.deg} ${focus.deg === 1 ? t_.one : t_.many}`.toUpperCase();
      ctx!.font = `500 ${10.5 * ui}px ${MONO}`;
      const w = ctx!.measureText(txt).width + 20 * ui, h = 24 * ui;
      const lx = Math.max(8, Math.min(W - 8 - w, focus.x - w / 2));
      let ly = focus.y - focus.r * 1.6 - h - 10;
      if (ly < 8) ly = focus.y + focus.r * 1.6 + 10;
      // Enlarged on a phone, a label beside the hub would run under the
      // medallion (HTML, over the canvas), so it clears the medallion's
      // 84-unit dial instead, on the node's side.
      if (ui > 1 && lx < CX + 84 && lx + w > CX - 84 && ly < CY + 84 && ly + h > CY - 84) {
        ly = focus.y < CY ? CY - 90 - h : CY + 90;
      }
      ctx!.save();
      ctx!.shadowColor = rgba(INK, 0.18); ctx!.shadowBlur = 16; ctx!.shadowOffsetY = 6;
      ctx!.fillStyle = rgba(WHITE, 1); ctx!.beginPath(); ctx!.roundRect(lx, ly, w, h, h / 2); ctx!.fill();
      ctx!.restore();
      ctx!.strokeStyle = rgba(INK, 0.1); ctx!.lineWidth = 1; ctx!.beginPath();
      ctx!.roundRect(lx + 0.5, ly + 0.5, w - 1, h - 1, h / 2); ctx!.stroke();
      ctx!.fillStyle = rgba(focus.cu ? GREEN : INK, 1); ctx!.textBaseline = "middle";
      ctx!.fillText(txt, lx + 10 * ui, ly + h / 2 + 0.5);
    }
  }

  const loop = (t: number) => {
    frame(t);
    // Ambient motion keeps the loop alive; calm, it runs only until the
    // graph settles and nothing is under the pointer.
    if (visible && (auto || busy || P.in || drag >= 0)) raf = requestAnimationFrame(loop);
    else running = false;
  };
  const kick = () => {
    if (running || !visible) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const syncAuto = () => { auto = !opts.paused() && !reduce.matches; };
  syncAuto();
  const refresh = () => { syncAuto(); kick(); };

  const io = new IntersectionObserver(
    (en) => {
      for (const x of en) {
        visible = x.isIntersecting;
        if (visible) {
          if (start === null) start = performance.now();
          kick();
        } else if (running) {
          cancelAnimationFrame(raf);
          running = false;
        }
      }
    },
    { threshold: 0.2 },
  );
  io.observe(cv);
  const onReduce = refresh;
  reduce.addEventListener("change", onReduce);

  // Pointer handling lives in the same closure as the simulation it drives.
  /** How much larger than its drawing units the label and the pick radius
   *  are drawn: 1 at the desktop's 700px, up to 2.2 on a phone, where the
   *  canvas shrinks to ~320px and a 10.5-unit label would be 5px of text and
   *  an 18-unit pick an 8px target for a finger. */
  let ui = 1;
  const ro = new ResizeObserver(() => {
    ui = Math.min(2.2, Math.max(1, W / (cv.clientWidth || W)));
    kick();
  });
  ro.observe(cv);

  const pt = (e: { clientX: number; clientY: number }) => {
    const r = cv.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / (r.width || W), y: ((e.clientY - r.top) * H) / (r.height || H) };
  };
  const pick = (x: number, y: number) => {
    let best = -1, bd = (18 * ui) ** 2;
    for (let i = 1; i < N.length; i++) {
      const n = N[i];
      if (!n.on || n.al < 0.5) continue;
      const d = (n.x - x) * (n.x - x) + (n.y - y) * (n.y - y);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  };
  const down = (e: Ptr) => {
    const p = pt(e); P.x = p.x; P.y = p.y; P.in = true;
    const i = pick(p.x, p.y);
    // A tap is the phone's hover: it sets the focus, and `leave` keeps it.
    hov = i;
    if (i > 0) {
      drag = i;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* capture is a nicety */ }
      e.currentTarget.style.cursor = "grabbing";
      e.preventDefault();
    }
    kick();
  };
  const move = (e: Ptr) => {
    const p = pt(e); P.x = p.x; P.y = p.y; P.in = true;
    kick();
    if (drag >= 0) return;
    hov = pick(p.x, p.y);
    const onHub = hov < 0 && Math.hypot(p.x - CX, p.y - CY) < 70;
    if (onHub && !hub && auto) {
      N[0].kids.forEach((c, k) => { if (N[c].on) setTimeout(() => send(0, c, performance.now(), true), k * 40); });
    }
    hub = onHub;
    e.currentTarget.style.cursor = hov >= 0 ? "grab" : "";
  };
  const up = (e: Ptr) => {
    if (drag < 0) return;
    const n = N[drag]; n.fl = 1;
    if (auto) n.nb.forEach((c) => { if (N[c].on) send(drag, c, performance.now(), false); });
    drag = -1;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* released already */ }
    e.currentTarget.style.cursor = hov >= 0 ? "grab" : "";
    kick();
  };
  const leave = (e: Ptr) => {
    if (drag >= 0 || e.pointerType === "touch") return;
    P.in = false; hov = -1; hub = false;
    e.currentTarget.style.cursor = "";
    kick();
  };

  const destroy = () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    reduce.removeEventListener("change", onReduce);
  };
  return { refresh, down, move, up, leave, destroy };
}

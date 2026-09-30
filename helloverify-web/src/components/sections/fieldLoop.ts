/** The field case's engine (`./FieldCaseStage` loads it when the section
 *  comes near). One camera from orbit to the doorstep and back:
 *
 *  - The camera is a centre (lat, lon) and a scale, kept as its logarithm
 *    (`ls`, ln of px per metre) so a dive from 10,000 km to 50 m is a
 *    straight line to the damping, not a jump. Seen from high up it draws
 *    the globe (`./fieldGlobe`, radius = scale × Earth's); lower down the
 *    survey sheet fades in over it (`./fieldWorld`), and the graticule
 *    carries the eye across the gap between the two.
 *  - The scroll is read into `p`, 0-6, one unit per act; everything reads
 *    `p`, so scrolling back rewinds it all.
 *  - DOM overlays (`[data-at]`) are moved to their place on the map each
 *    frame and shown inside their `data-on` window of `p`; those with an
 *    empty `data-at` are only shown and hidden.
 *  - Under a mouse, the map carries a loupe (`./fieldLoupe`). */
import { drawGlobe, EARTH, type GlobeLabels } from "./fieldGlobe";
import { makeLoupe } from "./fieldLoupe";
import { drawMarks } from "./fieldMarks";
import { drawRegion } from "./fieldRegion";
import * as W from "./fieldWorld";

const N = 6;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const fmt = (v: number, dp: number) => v.toFixed(dp);

type Pt = readonly [number, number];
type Cam = { lat: number; lon: number; ls: number };
export type LoopLabels = { dive: GlobeLabels; finale: GlobeLabels; loupe: string; region: string };

export function run(el: HTMLDivElement, setAct: (n: number) => void, setLive: (b: boolean) => void, pausedRef: { current: boolean }, L: LoopLabels) {
  const scroller = el.querySelector<HTMLElement>(".fc-scroll");
  const map = el.querySelector<HTMLElement>(".fc-map");
  const cv = el.querySelector<HTMLCanvasElement>(".fc-cv");
  const ctx = cv?.getContext("2d");
  // The loupe has its own canvas, above the DOM cards.
  const lv = el.querySelector<HTMLCanvasElement>(".fc-lp");
  const lctx = lv?.getContext("2d");
  if (!scroller || !map || !cv || !ctx || !lv || !lctx) return;

  const { pal, mono } = W.readFieldPalette(el);
  const sans = getComputedStyle(el).getPropertyValue("--sans").trim() || "sans-serif";
  const sheet = W.buildSheet(pal);
  const loupe = makeLoupe(sheet, pal);
  const P = W.PLACES;
  const mid: Pt = [(P.declared[0] + P.shared[0]) / 2, (P.declared[1] + P.shared[1]) / 2];

  // Coordinates, Plus Codes and seals into the labels that print them.
  const ll = (p: Pt) => { const { lat, lon } = W.toLatLon(p[0], p[1]); return `${fmt(lat, 5)}° N · ${fmt(lon, 5)}° E`; };
  const where: Record<string, Pt> = { declared: P.declared, shared: P.shared };
  el.querySelectorAll<HTMLElement>("[data-ll]").forEach((n) => { n.textContent = ll(where[n.dataset.ll ?? "shared"]); });
  el.querySelectorAll<HTMLElement>("[data-plus]").forEach((n) => { const { lat, lon } = W.toLatLon(...where[n.dataset.plus ?? "shared"]); n.textContent = W.plusCode(lat, lon); });
  el.querySelectorAll<HTMLElement>("[data-hash]").forEach((n) => {
    const p = n.dataset.hash === "a" ? P.declared : P.shared;
    let h = 2166136261;
    for (const c of `${p[0]}:${p[1]}:4417`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    n.textContent = ` sha-256 ${(h >>> 0).toString(16).padStart(8, "0")}…`;
  });
  el.querySelectorAll<HTMLCanvasElement>("canvas[data-cap]").forEach((c) => W.paintCapture(c, sheet, pal, c.dataset.cap === "a" ? P.declared : P.shared, 170));

  const anchor = (key: string, m: number): Pt => {
    switch (key) {
      case "town": return [3000, 2150];
      case "declared": return P.declared;
      case "shared": return P.shared;
      case "partner": return P.partner;
      case "mid": return mid;
      default: return W.along(m);
    }
  };
  const tags = [...el.querySelectorAll<HTMLElement>("[data-on]")].map((n) => {
    const [a, b] = (n.dataset.on ?? "0,6").split(",").map(Number);
    return { n, at: n.dataset.at ?? "", a, b, on: false };
  });
  const hud = Object.fromEntries([...el.querySelectorAll<HTMLElement>("[data-hud]")].map((n) => [n.dataset.hud, n]));

  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hudEl = el.querySelector<HTMLElement>(".fc-hud");
  let w = 0, h = 0, dpr = 1, k = 1, hudBottom = 0;
  const size = () => {
    const r = map.getBoundingClientRect();
    hudBottom = hudEl ? hudEl.offsetTop + hudEl.offsetHeight + 16 : 0;
    w = r.width; h = r.height; dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = lv.width = Math.round(w * dpr); cv.height = lv.height = Math.round(h * dpr);
    k = Math.max(w / W.MAP_W, h / W.MAP_H) * 1.12;
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(map);

  // The loupe follows a mouse, never a finger.
  let mouse: { x: number; y: number } | null = null;
  const onMove = (e: PointerEvent) => { if (e.pointerType !== "mouse") return; const r = map.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const onLeave = () => { mouse = null; };
  map.addEventListener("pointermove", onMove);
  map.addEventListener("pointerleave", onLeave);

  // Where the verifier is along the route, in metres, for `p`.
  const walked = (p: number) => {
    if (p < 2) return 0;
    if (p >= 3) return W.ROUTE_LEN;
    const u = p - 2;
    if (u < 0.3) return W.AT_DECLARED * ease(u / 0.3);
    if (u < 0.45) return W.AT_DECLARED;
    return W.AT_DECLARED + (W.ROUTE_LEN - W.AT_DECLARED) * ease(clamp((u - 0.45) / 0.4));
  };
  const onMap = (x: number, y: number, z: number): Cam => { const g = W.toLatLon(x, y); return { lat: g.lat, lon: g.lon, ls: Math.log(k * z) }; };
  const inOrbit = (lat: number, lon: number, rf: number): Cam => ({ lat, lon, ls: Math.log((rf * Math.min(w, h)) / EARTH) });
  const mix = (a: Cam, b: Cam, tp: number, ts: number): Cam => ({ lat: a.lat + (b.lat - a.lat) * tp, lon: a.lon + (b.lon - a.lon) * tp, ls: a.ls + (b.ls - a.ls) * ts });
  let spin = 0;
  const target = (p: number): Cam => {
    const K1 = onMap(3330, 1860, 1.8), K3 = onMap(3380, 1880, 1.3), K4 = onMap(3380, 1980, 1.08), ZR = 2.7;
    const route = (m: number) => { const v = W.along(m); return onMap(v[0], v[1], ZR); };
    if (p < 0.42) return inOrbit(12 + p * 4, 25 + p * 12, 0.4);
    if (p < 1) {
      // Zoom to a point: the offset from the target shrinks exactly as the
      // view does, so Foumban holds its place on screen all the way down.
      const t = (p - 0.42) / 0.58, a = inOrbit(13.68, 30.04, 0.4);
      const ls = a.ls + (K1.ls - a.ls) * ease(t);
      return mix(a, { ...K1, ls }, 1 - Math.exp(a.ls - ls) * (1 - t), 1);
    }
    if (p < 2) { const t = ease(clamp((p - 1.65) / 0.35)); return mix(K1, route(0), t, t); }
    if (p < 3) return route(walked(p));
    if (p < 4) { const t = ease(clamp((p - 3) / 0.45)); return mix(route(W.ROUTE_LEN), K3, t, t); }
    if (p < 5) { const t = ease(clamp((p - 4) / 0.5)); return mix(K3, K4, t, t); }
    const t = clamp((p - 5) / 0.7);
    return mix(K4, inOrbit(16, 34 + spin, 0.44), t ** 2.4, ease(t));
  };

  const progress = () => {
    const r = scroller.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) * (N - 0.001) : 0;
  };

  let cam = target(progress());
  let last = performance.now(), clock = 0, shownAct = -1, frame = 0, visible = false, hudTxt = "";

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!still.matches && !pausedRef.current) clock += dt;
    // The stage is not laid out until `fc-live` lands (the first frames
    // measure 0 x 0); wait for a size, and seat the camera once it has one.
    if (!w || !h) return;
    const p = progress();
    if (p > 5.7 && !still.matches && !pausedRef.current) spin += dt * 4;
    const tg = target(p);
    if (!Number.isFinite(cam.ls) || !Number.isFinite(cam.lat)) cam = tg;
    const f = still.matches ? 1 : 1 - Math.exp(-dt * 6);
    cam = { lat: cam.lat + (tg.lat - cam.lat) * f, lon: cam.lon + (tg.lon - cam.lon) * f, ls: cam.ls + (tg.ls - cam.ls) * f };

    const a = Math.min(N - 1, Math.floor(p));
    if (a !== shownAct) { shownAct = a; setAct(a); }
    const back = ease(clamp((p - 5) / 0.3));
    const tilt = ease(clamp((p - 4) / 0.45)) * (1 - back);
    const wash = clamp((p - 3) / 0.35) * (1 - 0.4 * tilt) * (1 - back);
    el.style.setProperty("--tilt", fmt(tilt, 3));
    el.style.setProperty("--rep", fmt(clamp((p - 4.12) / 0.6) * (1 - clamp((p - 5) / 0.22)), 3));
    el.style.setProperty("--wash", fmt(wash, 3));

    // Scale: the globe's radius, the sheet's zoom, and how much of each shows.
    const s = Math.exp(cam.ls), R = s * EARTH, z = s / k;
    const globeA = 1 - smooth(3500, 12000, R), mapA = smooth(0.035, 0.22, z);
    const regionA = smooth(3500, 9000, R) * (1 - smooth(0.12, 0.5, z));
    const [mx, my] = W.toXY(cam.lat, cam.lon);
    const mcam = { x: mx, y: my, z };

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = W.rgba(pal.paper, 1);
    ctx.fillRect(0, 0, w, h);
    if (mapA < 1) {
      const finale = clamp((p - 5.35) / 0.4);
      drawGlobe(ctx, pal, { mono, sans }, { lat: cam.lat, lon: cam.lon, R }, w, h, dpr, globeA, ease(clamp((p - 0.04) / 0.34)), finale, clock, finale > 0 ? L.finale : L.dive);
    }
    drawRegion(ctx, pal, { mono, sans }, cam.lat, cam.lon, s, w, h, dpr, regionA, L.region);
    if (mapA > 0) W.drawSheet(ctx, sheet, pal, mcam, w, h, k, dpr, wash, mapA);
    if (R > 6000) W.drawGraticule(ctx, pal, mono, mcam, w, h, k, dpr, hudBottom, 1 - globeA * 0.7);

    const scale = k * z;
    const S = (pt: Pt): Pt => [w / 2 + (pt[0] - mx) * scale, h / 2 + (pt[1] - my) * scale];
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const m = walked(p);
    drawMarks(ctx, pal, S, p, m, clock, mapA);
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.clearRect(0, 0, lv.width, lv.height);
    if (mouse && mapA > 0.99 && tilt < 0.01 && p > 0.95 && p < 3.95) loupe(lctx, dpr, w, h, mouse.x, mouse.y, mcam, scale, L.loupe, mono);

    for (const t of tags) {
      const on = p >= t.a && p < t.b;
      if (on !== t.on) { t.on = on; t.n.classList.toggle("is-on", on); }
      if (!t.at || (!on && !t.n.classList.contains("is-on"))) continue;
      const [x, y] = S(anchor(t.at, m));
      t.n.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
    if (frame++ % 3 === 0) hudTick(mcam, scale, mapA);
  };

  // The HUD: where the camera is, how high, and the scale bar.
  const hudTick = (mc: { x: number; y: number }, scale: number, mapA: number) => {
    const view = w / scale;
    const viewTxt = view >= 10000 ? `${Math.round(view / 1000).toLocaleString("en")} km` : view >= 1000 ? `${(view / 1000).toFixed(1)} km` : `${Math.round(view)} m`;
    const alt = mapA > 0.5 && mc.x > 0 && mc.y > 0 && mc.x < W.MAP_W && mc.y < W.MAP_H ? `${Math.round(W.altAt(sheet, mc.x, mc.y)).toLocaleString("en")} m` : "—";
    const txt = `${fmt(cam.lat, 5)}|${fmt(cam.lon, 5)}|${W.plusCode(cam.lat, cam.lon)}|${alt}|${viewTxt}`;
    if (txt !== hudTxt) {
      hudTxt = txt;
      const [la, lo, pc, al, vw] = txt.split("|");
      if (hud.lat) hud.lat.textContent = `${la}° N`;
      if (hud.lon) hud.lon.textContent = `${lo}° E`;
      if (hud.plus) hud.plus.textContent = pc;
      if (hud.alt) hud.alt.textContent = al;
      if (hud.view) hud.view.textContent = vw;
      if (hud.view2) hud.view2.textContent = vw;
    }
    const mpp = 1 / scale;
    const lens = [50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000];
    const len = lens.reduce((b, v) => (v / mpp <= 110 ? v : b), 50);
    if (hud.bar) hud.bar.style.width = `${(len / mpp).toFixed(1)}px`;
    if (hud.scale) hud.scale.textContent = len >= 1000 ? `${(len / 1000).toLocaleString("en")} km` : `${len} m`;
  };

  let raf = 0;
  const loop = (now: number) => { draw(now); raf = visible ? requestAnimationFrame(loop) : 0; };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  });
  io.observe(scroller);
  setLive(true);
  draw(performance.now());

  return () => {
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
    map.removeEventListener("pointermove", onMove); map.removeEventListener("pointerleave", onLeave);
  };
}

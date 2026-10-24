"use client";

/** The scroll of the `/technology` trust road (`./TechRoad`).

    Scroll through the runway is one journey, `SEGS`: the case leaves
    HelloVerify for the first stop; at each stop it docks while the stop
    builds, rests a moment on the finished scene, then rides the road on to
    the next while the camera follows, the stop it left dissolving and the
    next rising in; and last it reaches the destination. Written each
    frame, only when changed:

    - on each frame (`.tk-rd-stop`): `--v`, how much of it is on show,
      `--w`, +1 while arriving and -1 while leaving, and `--b`, how far its
      scene has built (`./TechRoadArt`);
    - on each stretch of road: `--g`, how much of it is laid;
    - the world's transform (the camera, pulling back a little mid-ride),
      the case's, the dot field's drift, and the rail's `--rf` and stops.

    The road itself is drawn here once per layout (`./techRoadPlan`), from
    each stop's out port to the next one's in port, so it follows the
    stops wherever the stylesheet puts them. Everything follows scroll
    through a short ease. Under reduced motion none of this runs, and the
    stylesheet lays the stops out finished, one under another. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BUILD, LANES, SEGS, STOPS, TOTAL, halve, path, restAt, road, strand, type Pt } from "./techRoadPlan";

/** How far the camera pulls back mid-ride, and drifts on while a stop builds. */
const ZOOM = 0.07;
const DRIFT = 0.035;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smooth = (a: number, b: number, t: number) => {
  const u = clamp((t - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};

export function TechRoadStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const head = root.querySelector<HTMLElement>(".tk-head");
    const enter = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        enter.disconnect();
      },
      { threshold: 0.3 },
    );
    if (head) enter.observe(head);

    const runway = root.querySelector<HTMLElement>(".tk-rd-run");
    const pin = root.querySelector<HTMLElement>(".tk-rd-pin");
    const world = root.querySelector<HTMLElement>(".tk-rd-world");
    const car = root.querySelector<HTMLElement>(".tk-rd-car");
    const rail = root.querySelector<HTMLElement>(".tk-rd-rail");
    const frames = [...root.querySelectorAll<HTMLElement>(".tk-rd-stop")];
    const segs = [...root.querySelectorAll<SVGGElement>(".tk-rd-seg")];
    const hops = [...root.querySelectorAll<HTMLButtonElement>(".tk-rd-hop")];
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !runway || !pin || !world || !car || !rail ||
      frames.length !== STOPS + 1 || segs.length !== STOPS + 1
    ) {
      return () => enter.disconnect();
    }
    const phone = window.matchMedia("(max-width: 1080px)");

    /** Where `el` sits in the world, ignoring every transform on the way. */
    const within = (el: HTMLElement): Pt => {
      let x = 0;
      let y = 0;
      for (let e: HTMLElement | null = el; e && e !== world; e = e.offsetParent as HTMLElement | null) {
        x += e.offsetLeft;
        y += e.offsetTop;
      }
      return { x, y };
    };
    const port = (scope: Element, which: string) => {
      const el = scope.querySelector<HTMLElement>(`.tk-rd-port[data-port="${which}"]`);
      return el ? within(el) : { x: 0, y: 0 };
    };

    let W = 1;
    let H = 1;
    let base = 0;
    let dir = 1;
    let top = 0;
    let span = 1;
    let home: Pt = { x: 0, y: 0 };
    let at: Pt[] = [];
    let heads: SVGPathElement[] = [];
    let lens: number[] = [];

    const measure = () => {
      W = pin.clientWidth;
      H = pin.clientHeight;
      base = world.offsetLeft;
      at = frames.map((f) => ({ x: f.offsetLeft, y: f.offsetTop }));
      dir = at[1].x >= at[0].x ? 1 : -1;
      home = { x: car.offsetLeft + car.offsetWidth / 2, y: car.offsetTop + car.offsetHeight / 2 };
      const small = phone.matches;
      const gap = small ? 4.2 : 6;
      const sag = H * (small ? 0.085 : 0.15);
      const start = root.querySelector(".tk-rd-start");
      const ends: [Pt, Pt][] = [[start ? port(start, small ? "up" : "out") : at[0], port(frames[0], "in")]];
      for (let j = 0; j < STOPS; j++) ends.push([port(frames[j], "out"), port(frames[j + 1], "in")]);

      heads = [];
      lens = [];
      segs.forEach((g, r) => {
        const p = halve(road(ends[r][0], ends[r][1], r === 0, small, dir, sag));
        const centre = path(p);
        const parts = g.querySelectorAll<SVGPathElement>("path");
        parts.forEach((el, i) => el.setAttribute("d", i >= 2 && i < 2 + LANES.length ? strand(p, i - 2, gap) : centre));
        const head = parts[parts.length - 1];
        heads.push(head);
        lens.push(head.getTotalLength());
      });

      const r = runway.getBoundingClientRect();
      top = r.top + window.scrollY - H * 0.4;
      span = Math.max(1, r.height - H * 0.6);
    };

    const last = { v: [] as number[], w: [] as number[], b: [] as number[], g: [] as number[], cam: "", fx: "", car: "", co: -1, rf: -1, a: -1 };
    const apply = (p: number) => {
      let t = clamp(p, 0, 1) * TOTAL;
      let si = 0;
      while (si < SEGS.length - 1 && t > SEGS[si].w) t -= SEGS[si++].w;
      const seg = SEGS[si];
      const f = clamp(t / seg.w, 0, 1);

      frames.forEach((el, j) => {
        const b0 = BUILD[j];
        let v = 0;
        let w = 1;
        let b = 0;
        if (si === b0 - 1) v = j === 0 ? 1 : smooth(0.42, 1, f);
        else if (si === b0) [v, b] = [1, f];
        else if (si === b0 + 1) [v, b] = [1, 1];
        else if (si === b0 + 2) [v, w, b] = [1 - smooth(0.05, 0.62, f), -1, 1];
        else if (si > b0 + 2) [w, b] = [-1, 1];
        v = +v.toFixed(3);
        b = +b.toFixed(3);
        if (v !== last.v[j]) el.style.setProperty("--v", String((last.v[j] = v)));
        if (w !== last.w[j]) el.style.setProperty("--w", String((last.w[j] = w)));
        if (b !== last.b[j]) el.style.setProperty("--b", String((last.b[j] = b)));
      });

      segs.forEach((g, r) => {
        const idx = BUILD[r] - 1;
        const laid = +(si < idx ? 0 : si > idx ? 1 : ease(f)).toFixed(4);
        if (laid !== last.g[r]) g.style.setProperty("--g", String((last.g[r] = laid)));
      });

      // The camera: drifting on while a stop builds, gliding to the next on a ride.
      const D = W * DRIFT * dir;
      const dwell = (j: number, u: number) => ({ x: at[j].x + D * (u - 0.5), y: at[j].y });
      let cam = dwell(0, f - 1);
      let s = 1;
      if (seg.k === "travel") {
        const a = dwell(seg.i, 1);
        const b = dwell(seg.i + 1, 0);
        const e = ease(f);
        cam = { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
        s = 1 - ZOOM * Math.sin(Math.PI * f);
      } else if (seg.k !== "lead") {
        const wb = SEGS[BUILD[seg.i]].w;
        const wh = SEGS[BUILD[seg.i] + 1].w;
        cam = dwell(seg.i, (seg.k === "build" ? f * wb : wb + f * wh) / (wb + wh));
      }
      const tx = W / 2 - base - s * (cam.x + W / 2);
      const ty = H / 2 - s * (cam.y + H / 2);
      const tf = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      if (tf !== last.cam) world.style.transform = last.cam = tf;
      const fx = `${((-cam.x * 0.3) % 28).toFixed(1)}px ${((-cam.y * 0.3) % 28).toFixed(1)}px`;
      if (fx !== last.fx) pin.style.setProperty("--fd", (last.fx = fx));

      // The case: on the road while riding it, docking into each stop as it arrives.
      let ci = -1;
      let cg = 1;
      let co = 0;
      if (seg.k === "lead") [ci, cg, co] = [0, ease(f), 1];
      else if (seg.k === "travel") [ci, cg, co] = [seg.i + 1, ease(f), clamp(f * 14, 0, 1)];
      else if (seg.k === "build") [ci, co] = [seg.i, 1 - smooth(0, 0.12, f)];
      if (ci >= 0 && co > 0) {
        const q = heads[ci].getPointAtLength(cg * lens[ci]);
        const ct = `translate3d(${(q.x - home.x).toFixed(1)}px, ${(q.y - home.y).toFixed(1)}px, 0)`;
        if (ct !== last.car) car.style.transform = last.car = ct;
      }
      co = +co.toFixed(3);
      if (co !== last.co) car.style.opacity = String((last.co = co));

      // The rail: how far along the eight, and which one is on show.
      const prog = seg.k === "lead" ? 0 : seg.k === "travel" ? seg.i + ease(f) : seg.i;
      const rf = +clamp(prog / (STOPS - 1), 0, 1).toFixed(4);
      if (rf !== last.rf) rail.style.setProperty("--rf", String((last.rf = rf)));
      const a = seg.k === "travel" ? (f < 0.5 ? seg.i : seg.i + 1) : seg.i;
      if (a !== last.a) {
        last.a = a;
        hops.forEach((h, k) => {
          h.dataset.s = k < a ? "done" : k === a ? "now" : "next";
          if (k === a) h.setAttribute("aria-current", "step");
          else h.removeAttribute("aria-current");
        });
      }
    };

    let cur = -1;
    let target = 0;
    let raf = 0;
    let then = 0;
    const read = () => clamp((window.scrollY - top) / span, 0, 1);
    const step = (now: number) => {
      const dt = Math.min(50, now - then);
      then = now;
      cur = cur < 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / 130));
      if (Math.abs(target - cur) < 0.00002) cur = target;
      apply(cur);
      raf = cur === target ? 0 : requestAnimationFrame(step);
    };
    const kick = () => {
      target = read();
      if (raf) return;
      then = performance.now();
      raf = requestAnimationFrame(step);
    };
    const jump = () => {
      measure();
      last.cam = last.car = "";
      cur = -1;
      kick();
    };

    /** A stop on the rail takes the reader to that stop, finished. */
    const hop = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLElement>(".tk-rd-hop");
      if (!b) return;
      window.scrollTo({ top: top + (restAt(Number(b.dataset.i)) / TOTAL) * span, behavior: "smooth" });
    };

    jump();
    window.addEventListener("scroll", kick, { passive: true });
    rail.addEventListener("click", hop);
    const ro = new ResizeObserver(jump);
    ro.observe(pin);
    ro.observe(runway);
    root.querySelectorAll(".tk-rd-tx").forEach((el) => ro.observe(el));
    phone.addEventListener("change", jump);
    return () => {
      enter.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      rail.removeEventListener("click", hop);
      phone.removeEventListener("change", jump);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "tk-road tk-in" : "tk-road"}>
      {children}
    </section>
  );
}

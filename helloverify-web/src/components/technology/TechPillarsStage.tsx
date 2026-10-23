"use client";

/** The scroll logic of the `/technology` story (`./TechPillars`).

    Scroll through the runway is one timeline. The case rides the thread in,
    each card plays as the head crosses it and rests a moment finished, and
    the thread carries the case over the gap to the next card while the
    track pans there. Written each frame, only when changed:

    - `--h` on each card: the head, in card units (0…1200, -200 before the
      card, 1260 after, climbing to -20 while the case is on its way in).
      The stylesheet shows each part once it is passed.
    - `--g` on each stretch of thread outside the cards: 0…1, the pulse.
    - `--f0`…`--f2` on the section: how far each step has played.
    - `data-active`: the step whose copy is showing, switched mid-gap.
    - the track's pan. Where a card fits the stage it is held centred;
      where it does not (a phone), the view follows the head along it.

    Everything follows scroll through a short ease, so a wheel notch glides
    instead of jumping. `tk-in` still marks the first sighting, for the head.
    Under reduced motion none of this runs: the stylesheet lays the three
    cards out finished, one under another. */
import { useEffect, useRef, useState, type ReactNode } from "react";

const END = 1260;
const SEGS = [
  { k: "in", i: 0, w: 0.5 },
  { k: "card", i: 0, w: 3 },
  { k: "rest", i: 0, w: 0.45 },
  { k: "gap", i: 0, w: 1.25 },
  { k: "card", i: 1, w: 3.4 },
  { k: "rest", i: 1, w: 0.45 },
  { k: "gap", i: 1, w: 1.25 },
  { k: "card", i: 2, w: 3.2 },
  { k: "out", i: 2, w: 0.9 },
] as const;
const TOTAL = SEGS.reduce((a, s) => a + s.w, 0);
const CARD_SEG = [0, 1, 2].map((i) => SEGS.findIndex((s) => s.k === "card" && s.i === i));
const THREAD_SEG = [0, 3, 6, 8];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function TechPillarsStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
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

    const run = root.querySelector<HTMLElement>(".tk-sy-run");
    const stage = root.querySelector<HTMLElement>(".tk-sy-stage");
    const track = root.querySelector<HTMLElement>(".tk-sy-track");
    const cards = [...root.querySelectorAll<HTMLElement>(".tk-sy-card")];
    const threads = [...root.querySelectorAll<HTMLElement>(".tk-sy-lead, .tk-sy-gap")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !run || !stage || !track || cards.length !== 3) {
      return () => enter.disconnect();
    }

    let flip = 1;
    let view = 0;
    let cw = 0;
    let starts: number[] = [];
    let top = 0;
    let span = 1;
    const measure = () => {
      flip = getComputedStyle(root).direction === "rtl" ? -1 : 1;
      view = stage.clientWidth;
      cw = cards[0].offsetWidth;
      const tw = track.offsetWidth;
      starts = cards.map((c) => (flip > 0 ? c.offsetLeft : tw - c.offsetLeft - c.offsetWidth));
      const r = run.getBoundingClientRect();
      const vh = window.innerHeight;
      top = r.top + window.scrollY - vh * 0.5;
      span = Math.max(1, r.height - vh * 0.5);
    };

    /** Where the view starts on the track, for card `i` with the head at `hu`. */
    const cam = (i: number, hu: number) => {
      const lo = starts[i] - 24;
      if (cw + 48 <= view) return starts[i] + cw / 2 - view / 2;
      return clamp(starts[i] + (clamp(hu, 0, 1200) / 1200) * cw - view * 0.42, lo, starts[i] + cw + 24 - view);
    };

    const last = { h: [NaN, NaN, NaN], g: [NaN, NaN, NaN, NaN], f: [NaN, NaN, NaN], x: NaN, a: 0 };
    const apply = (p: number) => {
      let at = clamp(p, 0, 1) * TOTAL;
      let si = 0;
      while (si < SEGS.length - 1 && at > SEGS[si].w) at -= SEGS[si++].w;
      const seg = SEGS[si];
      const f = clamp(at / seg.w, 0, 1);

      cards.forEach((card, i) => {
        const ci = CARD_SEG[i];
        // While the thread before a card is crossed, its head runs -200…-20,
        // so whatever the card is handed arrives with the case.
        const h = si < ci - 1 ? -200 : si === ci - 1 ? Math.round(-200 + 180 * f) : si > ci ? END : Math.round(-20 + f * (END + 20));
        if (h !== last.h[i]) card.style.setProperty("--h", String((last.h[i] = h)));
        const fill = clamp(h / 1200, 0, 1);
        if (fill !== last.f[i]) root.style.setProperty(`--f${i}`, (last.f[i] = fill).toFixed(3));
      });
      threads.forEach((el, t) => {
        const ti = THREAD_SEG[t];
        const g = si < ti ? 0 : si > ti ? 1 : ease(f);
        if (g !== last.g[t]) el.style.setProperty("--g", (last.g[t] = g).toFixed(4));
      });

      const x =
        seg.k === "gap"
          ? cam(seg.i, END) + (cam(seg.i + 1, 0) - cam(seg.i, END)) * ease(f)
          : cam(seg.i, seg.k === "card" ? -20 + f * (END + 20) : seg.k === "in" ? 0 : END);
      if (!(Math.abs(x - last.x) <= 0.05)) track.style.transform = `translate3d(${(-(last.x = x) * flip).toFixed(2)}px, 0, 0)`;

      const a = seg.k === "gap" ? (f < 0.5 ? seg.i : seg.i + 1) : seg.i;
      if (a !== last.a) setActive((last.a = a));
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
      if (Math.abs(target - cur) < 0.00004) cur = target;
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
      last.x = NaN;
      cur = -1;
      kick();
    };

    jump();
    window.addEventListener("scroll", kick, { passive: true });
    const ro = new ResizeObserver(jump);
    ro.observe(stage);
    ro.observe(run);
    return () => {
      enter.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "tk-pil tk-in" : "tk-pil"} data-active={active}>
      {children}
    </section>
  );
}

"use client";

/** The behaviour of the `/technology` flywheel (`./TechCompound`).

    - `tk-in` is added the first time the section is on screen, for the
      head and the claims to rise in.
    - The loop: four laps of the wheel, each quicker than the last, a rest
      on the full wheel, a fade, and round again. Written to the section
      each frame, and read by the stylesheet:
        `--t`        turns so far (0…4), which draws the lap rings
        `--p`        how far round this lap is, which places the pulse
        `--lap`      which lap, which sets the pulse's ring
        `--nd` `--ni` `--nc`   dots, institutions and customers earned
        `data-at`    the station the pulse last passed (pings it)
        `data-card`  the claim that station proves
        `data-fade`  the wheel clearing before it starts again
    - Hovering a claim writes its key to `data-focus`, which lights the
      stations it is about.
    - It runs only on screen, in a visible tab, and not paused (WCAG 2.2.2).
      Under reduced motion it rests on the full wheel and never moves. */

import { useEffect, useRef, useState, type ReactNode } from "react";

const LAPS = [4.6, 3.9, 3.3, 2.8];
const SPIN = LAPS.reduce((a, b) => a + b, 0);
const HOLD = 2.4;
const FADE = 0.8;
const LOOP = SPIN + HOLD + FADE;
const PAUSE_D = "M5 3.5h2v9H5zM9 3.5h2v9H9z";
const PLAY_D = "M5 3.5v9l7-4.5z";

export function TechCompoundStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(root);

    const over = (e: PointerEvent) => {
      const k = (e.target as Element).closest?.<HTMLElement>("[data-k]")?.dataset.k;
      if (k) root.dataset.focus = k;
      else delete root.dataset.focus;
    };
    const out = () => delete root.dataset.focus;
    root.addEventListener("pointerover", over);
    root.addEventListener("pointerleave", out);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const btn = root.querySelector<HTMLButtonElement>("[data-fw-pause]");
    let clock = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let paused = false;
    const wrote: Record<string, string> = {};
    const put = (k: string, val: string) => {
      if (wrote[k] === val) return;
      wrote[k] = val;
      if (k.startsWith("--")) root.style.setProperty(k, val);
      else if (val) root.dataset[k] = val;
      else delete root.dataset[k];
    };

    const apply = (c: number) => {
      let lap = 0;
      let at = c;
      while (lap < LAPS.length && at >= LAPS[lap]) at -= LAPS[lap++];
      const p = lap < LAPS.length ? at / LAPS[lap] : 0;
      const t = lap + p;
      const past = (q: number) => lap + (lap < LAPS.length && p >= q ? 1 : 0);
      const st = lap < LAPS.length ? Math.floor(p * 4) : -1;
      put("--t", t.toFixed(4));
      put("--p", p.toFixed(4));
      put("--lap", String(Math.min(lap, 3)));
      put("--nd", String(6 * past(0.25)));
      put("--ni", String(2 * past(0.5)));
      put("--nc", String(2 * past(0.75)));
      put("--run", lap < LAPS.length ? "1" : "0");
      put("at", st < 0 ? "" : String(st));
      put("card", st < 0 ? "" : String(Math.max(0, st - 1)));
      put("fade", c >= SPIN + HOLD ? "on" : "");
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock = (clock + dt) % LOOP;
      apply(clock);
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      const run = visible && !paused && !reduce.matches && !document.hidden;
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (reduce.matches) apply(SPIN);
    };

    const watch = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    const box = root.querySelector(".tk-fw-box");
    if (box) watch.observe(box);
    apply(0);

    const toggle = () => {
      paused = !paused;
      if (paused) root.dataset.paused = "";
      else delete root.dataset.paused;
      btn?.setAttribute("aria-label", (paused ? btn.dataset.play : btn.dataset.pause) ?? "");
      btn?.querySelector("path")?.setAttribute("d", paused ? PLAY_D : PAUSE_D);
      kick();
    };
    btn?.addEventListener("click", toggle);
    reduce.addEventListener("change", kick);
    document.addEventListener("visibilitychange", kick);

    return () => {
      io.disconnect();
      watch.disconnect();
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", out);
      btn?.removeEventListener("click", toggle);
      reduce.removeEventListener("change", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "wrap tk-cmp tk-in" : "wrap tk-cmp"}>
      {children}
    </section>
  );
}

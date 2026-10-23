"use client";

/** The clock of the `/technology` race (`./TechRace`, `./techRaceData`).

    - `tk-in` is added the first time the section is on screen, for the
      head and the claims to rise in.
    - The loop: a beat, the race (both lanes on one clock), a rest on the
      result, HelloVerify's lane becoming every check since 2018 with the
      site's figures, a fade, and again. Written to the section, read by the
      stylesheet:
        `--c`          the clock, in case units (0 to `SPAN`)
        `data-st`, `data-hv`   the case each lane is on, or `end`
        `data-claim`   the claim HelloVerify's current case proves
        `data-phase`   `race`, `done`, `scale` or `fade`
    - It runs only on screen, in a visible tab, and not paused (WCAG 2.2.2).
      Under reduced motion it shows the finished race and never moves. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CLAIM, HV, SPAN, STATIC } from "./techRaceData";

const BEAT = 0.6;
const RACE = 13;
const DONE = 1.4;
const SCALE = 4.6;
const FADE = 0.8;
const LOOP = BEAT + RACE + DONE + SCALE + FADE;
const PAUSE_D = "M5 3.5h2v9H5zM9 3.5h2v9H9z";
const PLAY_D = "M5 3.5v9l7-4.5z";

const onCase = (plan: { s: number; d: number }[], c: number) => {
  const last = plan[plan.length - 1];
  if (c >= last.s + last.d) return plan.length - 1;
  let i = 0;
  while (i + 1 < plan.length && plan[i + 1].s <= c) i++;
  return i;
};

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
      { threshold: 0.2 },
    );
    io.observe(root);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const btn = root.querySelector<HTMLButtonElement>("[data-fw-pause]");
    const wrote: Record<string, string> = {};
    const put = (k: string, val: string) => {
      if (wrote[k] === val) return;
      wrote[k] = val;
      if (k.startsWith("--")) root.style.setProperty(k, val);
      else root.dataset[k] = val;
    };

    const apply = (t: number) => {
      const c = Math.min(SPAN, Math.max(0, ((t - BEAT) / RACE) * SPAN));
      const phase = t < BEAT + RACE ? "race" : t < BEAT + RACE + DONE ? "done" : t < LOOP - FADE ? "scale" : "fade";
      const late = phase === "scale" || phase === "fade";
      const hv = onCase(HV, c);
      put("--c", c.toFixed(3));
      put("phase", phase);
      put("st", late ? "end" : String(onCase(STATIC, c)));
      put("hv", late ? "end" : String(hv));
      put("claim", phase === "race" ? String(CLAIM[hv]) : "");
    };

    let clock = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let paused = false;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock = (clock + dt) % LOOP;
      apply(clock);
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (reduce.matches) {
        cancelAnimationFrame(raf);
        raf = 0;
        apply(BEAT + RACE + DONE + 0.01);
        return;
      }
      const run = visible && !paused && !document.hidden;
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const watch = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    const box = root.querySelector(".tk-rc-box");
    if (box) watch.observe(box);
    apply(0);
    kick();

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

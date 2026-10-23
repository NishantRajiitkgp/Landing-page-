"use client";

/** The scroll of the `/technology` compounding story (`./TechCompound`).

    Scroll through the runway is story time, 0 to `END` (`./techGrowPlan`),
    followed through a short ease so a wheel notch glides instead of
    jumping. It writes to the section `data-step`, the claim on show (0 to
    2), and hands the time to `./techGrow`, fetched as the section nears,
    which draws the board.
    Under reduced motion the stylesheet drops the runway and the board
    shows its last frame. */
import { useEffect, useRef, type ReactNode } from "react";
import { whenNear } from "@/lib/whenNear";
import { ACT, END } from "./techGrowPlan";
import type { TechGrow } from "./techGrow";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function TechCompoundStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    const run = root?.querySelector<HTMLElement>(".tk-cx-run");
    const art = root?.querySelector<HTMLElement>(".tk-cx-art");
    const canvas = root?.querySelector<HTMLCanvasElement>(".tk-cx-cv");
    if (!root || !run || !art || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let engine: TechGrow | null = null;
    let shown = -1;
    const show = (t: number) => {
      shown = t;
      const step = String(t < ACT[1] ? 0 : t < ACT[2] ? 1 : 2);
      if (root.dataset.step !== step) root.dataset.step = step;
      engine?.render(t);
    };

    // The story starts a little before the frame pins and ends as it lets go.
    let top = 0;
    let span = 1;
    const measure = () => {
      const r = run.getBoundingClientRect();
      const vh = window.innerHeight;
      top = r.top + window.scrollY - vh * 0.35;
      span = Math.max(1, r.height - vh * 0.65);
    };
    const read = () => (reduce.matches ? END : clamp((window.scrollY - top) / span, 0, 1) * END);

    let cur = -1;
    let target = 0;
    let raf = 0;
    let then = 0;
    const step = (now: number) => {
      const dt = Math.min(50, now - then);
      then = now;
      cur = cur < 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / 130));
      if (Math.abs(target - cur) < 0.0004) cur = target;
      show(cur);
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
      cur = -1;
      kick();
    };

    const stop = whenNear(
      art,
      () => import("./techGrow"),
      ({ TechGrow }) => {
        const e = new TechGrow(art, canvas);
        engine = e;
        art.dataset.live = "";
        e.render(shown < 0 ? read() : shown);
        return () => {
          e.destroy();
          engine = null;
        };
      },
      "1200px 0px",
    );

    jump();
    window.addEventListener("scroll", kick, { passive: true });
    const ro = new ResizeObserver(jump);
    ro.observe(run);
    reduce.addEventListener("change", jump);
    return () => {
      stop();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      reduce.removeEventListener("change", jump);
    };
  }, []);

  return (
    <section ref={ref} className="tk-cmp" data-step="0">
      {children}
    </section>
  );
}

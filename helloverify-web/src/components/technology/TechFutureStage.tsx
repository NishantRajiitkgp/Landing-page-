"use client";

/** The scroll of the `/technology` future-of-trust story (`./TechFuture`).

    Scroll through the runway is one timeline, 0…1 (`./techFuturePlan`),
    followed through a short ease so a wheel notch glides instead of
    jumping. Written to the section, only when changed:

    - `--b1`…`--b3`: how far each act has built, 0…1; the scene's parts
      arrive as their act passes their `--at`, or follow it through `--t`;
    - `--z`: the pull-back from the hub to the network, eased;
    - `--fl`: the scroll clock the sweep, the heartbeats, the current and
      the bobbing run on, so nothing moves unless the reader does;
    - `data-step`: the layer whose line is open, 0 to 2, then 3 once the
      last line has closed as the section lets go.

    A layer's name (`[data-go]`) scrolls to its act, finished. Under
    reduced motion none of this runs: the stylesheet drops the runway and
    the scene rests on its last frame, and a layer's name lights its part
    of it instead (`data-focus`). */
import { useEffect, useRef, type ReactNode } from "react";
import { ACTS, CLOCK, REST, STEPS, ZOOM } from "./techFuturePlan";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const span = (p: number, [a, b]: [number, number]) => clamp((p - a) / (b - a), 0, 1);

export function TechFutureStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    const run = root?.querySelector<HTMLElement>(".tk-ft-run");
    if (!root || !run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gos = [...root.querySelectorAll<HTMLButtonElement>("[data-go]")];

    const last: Record<string, string> = {};
    const put = (k: string, v: string) => {
      if (last[k] !== v) root.style.setProperty(k, (last[k] = v));
    };
    const show = (p: number) => {
      ACTS.forEach((w, i) => put(`--b${i + 1}`, span(p, w).toFixed(3)));
      put("--z", ease(span(p, ZOOM)).toFixed(4));
      put("--fl", (p * CLOCK).toFixed(3));
      const step = STEPS.findIndex((s) => p < s);
      const now = String(step < 0 ? 3 : step);
      if (root.dataset.step !== now) {
        root.dataset.step = now;
        gos.forEach((b, i) => (String(i) === now ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current")));
      }
    };

    // The story starts a little before the frame pins and ends as it lets go.
    let top = 0;
    let len = 1;
    const measure = () => {
      const r = run.getBoundingClientRect();
      const vh = window.innerHeight;
      top = r.top + window.scrollY - vh * 0.35;
      len = Math.max(1, r.height - vh * 0.65);
    };
    const read = () => clamp((window.scrollY - top) / len, 0, 1);

    let cur = -1;
    let target = 0;
    let raf = 0;
    let then = 0;
    const step = (now: number) => {
      const dt = Math.min(50, now - then);
      then = now;
      cur = cur < 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / 140));
      if (Math.abs(target - cur) < 0.00005) cur = target;
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

    const go = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-go]");
      if (!b) return;
      const k = Number(b.dataset.go);
      if (reduce.matches) {
        if (root.dataset.focus === String(k)) delete root.dataset.focus;
        else root.dataset.focus = String(k);
        return;
      }
      window.scrollTo({ top: top + REST[k] * len, behavior: "smooth" });
    };
    root.addEventListener("click", go);

    if (reduce.matches) return () => root.removeEventListener("click", go);

    jump();
    window.addEventListener("scroll", kick, { passive: true });
    const ro = new ResizeObserver(jump);
    ro.observe(run);
    return () => {
      root.removeEventListener("click", go);
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
    };
  }, []);

  return (
    <section ref={ref} className="tk-fut" data-step="0">
      {children}
    </section>
  );
}

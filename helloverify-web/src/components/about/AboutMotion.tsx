"use client";

/** The `/about` page's behaviours. Each writes to the DOM, never to state:

    - `Reveal`: sets `data-in` once the block's top is on screen; the
      entrances in `app/v2/about.css` key off it and play once.
    - `BeliefStage`: `--bp` (0–1) follows the scroll across the belief and
      lights its words in reading order. Without script or under reduced
      motion it is never written, and the CSS default (1) shows them all.
    - `Count`: a stat still below the fold is set to zero and counts up to
      the copy's own text the first time it is seen. */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function onSeen(el: Element, run: () => void) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      run();
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}

export function Reveal({
  as = "div",
  className,
  style,
  children,
}: {
  as?: "div" | "section" | "ul";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onSeen(el, () => {
      el.dataset.in = "";
    });
  }, []);
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

export function BeliefStage({ n, className, children }: { n: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const set = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.4 + r.height)));
      el.style.setProperty("--bp", p.toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(set);
    };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    set();
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={className} style={{ "--n": n } as CSSProperties}>
      {children}
    </div>
  );
}

export function Count({ v }: { v: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = /^(\D*)(\d[\d,]*)(.*)$/.exec(v);
    if (!el || !m || reduced() || el.getBoundingClientRect().top < window.innerHeight) return;
    const [, pre, num, post] = m;
    const to = Number(num.replace(/,/g, ""));
    el.textContent = `${pre}0${post}`;
    let raf = 0;
    const stop = onSeen(el, () => {
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1500);
        el.textContent = k < 1 ? `${pre}${Math.round(to * (1 - (1 - k) ** 4))}${post}` : v;
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      stop();
      cancelAnimationFrame(raf);
      el.textContent = v;
    };
  }, [v]);
  return (
    <span ref={ref} aria-hidden="true">
      {v}
    </span>
  );
}

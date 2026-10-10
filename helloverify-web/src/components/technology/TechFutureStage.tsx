"use client";

/** The behaviour of the `/technology` future-of-trust stack (`./TechFuture`).

    - `tk-in` once the section is on screen: the slabs drop in, once.
    - `--sp` (0…1) follows the scroll as the section rises through the
      viewport, and the stack's gaps are a function of it: the layers part
      as the reader arrives. Scroll-linked, so nothing moves on its own;
      under reduced motion it is left at its CSS default, open.
    - Hovering a row writes its `data-k` to `data-focus`, which lifts that
      layer and replays its drawing. */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function TechFutureStage({ children }: { children: ReactNode }) {
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

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      if (still) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.7)));
        root.style.setProperty("--sp", p.toFixed(4));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const over = (e: PointerEvent) => {
      const k = (e.target as Element).closest?.<HTMLElement>("[data-k]")?.dataset.k;
      if (k) root.dataset.focus = k;
      else delete root.dataset.focus;
    };
    const out = () => delete root.dataset.focus;
    root.addEventListener("pointerover", over);
    root.addEventListener("pointerleave", out);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", out);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "wrap tk-fut tk-in" : "wrap tk-fut"}>
      {children}
    </section>
  );
}

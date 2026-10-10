"use client";

/** The behaviour of the `/technology` security panel (`./TechCerts`).

    - `tk-in` once the panel is on screen: the dial draws and the seals rise.
    - `--sp` (0…1) follows the scroll and turns the dial; when it reaches 1
      the dial is aligned, `data-lock` is set and stays set: the lock closes
      once and the scroll no longer turns anything.
    - Under reduced motion the panel starts locked and `--sp` is left at its
      CSS default (aligned). */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function TechCertsStage({ children }: { children: ReactNode }) {
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

    const lock = () => {
      root.dataset.lock = "";
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lock();
      return () => io.disconnect();
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.6)));
        root.style.setProperty("--sp", p.toFixed(4));
        if (p < 1) return;
        lock();
        window.removeEventListener("scroll", onScroll);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "wrap tk-sec tk-in" : "wrap tk-sec"}>
      {children}
    </section>
  );
}

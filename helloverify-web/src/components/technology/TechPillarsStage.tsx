"use client";

/** The scroll logic of the `/technology` pillars (`./TechPillars`).

    - `data-active` is the step crossing the middle of the viewport; the
      stylesheet shows that step's drawing and plays its animation once.
    - `tk-in` is added the first time the section is on screen, so the first
      drawing plays when it can be seen rather than on page load.
    - `--prog` (0…1) is how far the reader is through the steps, for the rail.

    Children are server-rendered; this only writes attributes. */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function TechPillarsStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const steps = [...root.querySelectorAll<HTMLElement>(".tk-step")];
    const rail = root.querySelector<HTMLElement>(".tk-steps");

    // On a phone the stage pins over the top of the viewport, so the step
    // that counts as current is the one crossing the band below it.
    const phone = window.matchMedia("(max-width: 1080px)").matches;
    const pick = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(steps.indexOf(e.target as HTMLElement));
      },
      { rootMargin: phone ? "-60% 0px -34% 0px" : "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => pick.observe(s));

    const enter = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        enter.disconnect();
      },
      { threshold: 0.15 },
    );
    enter.observe(root);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!rail) return;
        const r = rail.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height));
        root.style.setProperty("--prog", p.toFixed(4));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      pick.disconnect();
      enter.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "wrap tk-pil tk-in" : "wrap tk-pil"} data-active={active}>
      {children}
    </section>
  );
}

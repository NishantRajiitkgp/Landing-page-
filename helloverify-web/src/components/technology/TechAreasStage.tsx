"use client";

/** The behaviour of the `/technology` platform-areas grid (`./TechAreas`).

    - `tk-in` the first time the grid is on screen: the tiles rise in and the
      two drawings sketch themselves, once.
    - One pointer light for the whole grid: each tile gets the pointer's
      position in its own box as `--cx`/`--cy`, so the glow on a tile's
      border is the same light that is on its neighbours'. Written through
      CSSOM, with no React render per move. Physical on purpose: they place
      a radial gradient, which is not mirrored. */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function TechAreasStage({ children }: { children: ReactNode }) {
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

    const grid = root.querySelector<HTMLElement>(".tk-bento");
    const tiles = grid ? [...grid.querySelectorAll<HTMLElement>(".tk-tile")] : [];
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const t of tiles) {
          const r = t.getBoundingClientRect();
          t.style.setProperty("--cx", `${Math.round(e.clientX - r.left)}px`);
          t.style.setProperty("--cy", `${Math.round(e.clientY - r.top)}px`);
        }
        grid?.style.setProperty("--lit", "1");
      });
    };
    const leave = () => grid?.style.setProperty("--lit", "0");
    grid?.addEventListener("pointermove", move);
    grid?.addEventListener("pointerleave", leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      grid?.removeEventListener("pointermove", move);
      grid?.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "wrap tk-areas tk-in" : "wrap tk-areas"}>
      {children}
    </section>
  );
}

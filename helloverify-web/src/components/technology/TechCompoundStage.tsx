"use client";

/** The behaviour of the `/technology` compounding network (`./TechCompound`).

    - `tk-in` is added the first time the section is on screen, which plays
      the one-shot build: core, growth rings, nodes, then every connection.
    - Hovering a card or a node writes its key to `data-focus` (via the
      `data-k` on the element), and the stylesheet lights what it touches.
      Written straight to the DOM: it changes no React output. */

import { useEffect, useRef, useState, type ReactNode } from "react";

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
    return () => {
      io.disconnect();
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", out);
    };
  }, []);

  return (
    <section ref={ref} className={seen ? "wrap tk-cmp tk-in" : "wrap tk-cmp"}>
      {children}
    </section>
  );
}

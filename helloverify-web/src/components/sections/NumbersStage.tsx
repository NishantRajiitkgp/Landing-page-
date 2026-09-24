"use client";

/** The interactive shell of the v2 Numbers band (`sections/Numbers.tsx`).
    Everything inside is server-rendered; this owns two behaviours.

    1. **Starting the pictures when they are seen.** The board plays the
       odometer roll, the grid wipe, the dial sweep and the barcode on load,
       which on a canvas is when you look at them. On a page this band sits
       ~2,000px down, so on load they would finish unseen. Each block marked
       `data-nm-go` gets `nm-go` when it comes within 200px of the viewport,
       and the CSS only animates under `nm-go`. Without JS nothing is armed,
       so the static styles show every figure at its final value.
    2. **Counting again.** The odometer is a button; clicking swaps
       `nm-odoA`↔`nm-odoB` on `.nm-odo`, two identically-keyframed classes,
       because changing `animation-name` restarts an animation and re-setting
       it does not (the hero seal's trick, `HeroStage.tsx`). By delegation, so
       the button stays in the server tree.

    REJECTED: re-rendering the odometer from React state on recount. The
    columns are static markup; a class swap on one element is the whole job. */

import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export function NumbersStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("nm-go");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px 200px 0px" },
    );
    el.querySelectorAll("[data-nm-go]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const btn = (e.target as Element).closest?.(".nm-odo-btn");
    const odo = btn?.querySelector(".nm-odo");
    if (!odo) return;
    // A recount before the band was ever armed still has to play.
    btn?.closest("[data-nm-go]")?.classList.add("nm-go");
    const next = odo.classList.contains("nm-odoA") ? "nm-odoB" : "nm-odoA";
    odo.classList.remove("nm-odoA", "nm-odoB");
    odo.classList.add(next);
  }, []);

  return (
    <div ref={ref} className="wrap nm" onClick={onClick}>
      {children}
    </div>
  );
}

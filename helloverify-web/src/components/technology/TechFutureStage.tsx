"use client";

/** The behaviour of the `/technology` future-of-trust board (`./TechFuture`).

    Nothing moves on its own or with the scroll. Pointing at one of the
    three layers, or at a part of the board marked with its layer
    (`data-hg`), writes that layer to the section's `data-focus`, which
    lights its part of the board and quiets the rest; leaving puts it back.
    A layer's name is a toggle: pressing it (a tap, where there is no
    pointer to hover with) pins its layer lit until it is pressed again, or
    another is; keyboard focus lights a layer while it is held. */
import { useEffect, useRef, type ReactNode } from "react";

export function TechFutureStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const gos = [...root.querySelectorAll<HTMLButtonElement>(".tk-ft-go")];
    let pinned: string | null = null;

    const show = (g: string | null) => {
      if (g === null) delete root.dataset.focus;
      else root.dataset.focus = g;
    };
    const layer = (t: EventTarget | null) => (t instanceof Element ? t.closest("[data-hg]")?.getAttribute("data-hg") ?? null : null);

    const over = (e: PointerEvent) => {
      if (e.pointerType !== "touch") show(layer(e.target) ?? pinned);
    };
    const leave = () => show(pinned);
    const press = (e: MouseEvent) => {
      const b = (e.target as Element).closest(".tk-ft-go");
      const g = b && layer(b);
      if (g === null || !b) return;
      pinned = pinned === g ? null : g;
      gos.forEach((x) => x.setAttribute("aria-pressed", String(pinned !== null && layer(x) === pinned)));
      show(pinned);
    };
    const enter = (e: FocusEvent) => {
      const g = layer(e.target);
      if (g !== null) show(g);
    };
    const exit = (e: FocusEvent) => {
      if (!root.contains(e.relatedTarget as Node | null)) show(pinned);
    };

    root.addEventListener("pointerover", over);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("click", press);
    root.addEventListener("focusin", enter);
    root.addEventListener("focusout", exit);
    return () => {
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("click", press);
      root.removeEventListener("focusin", enter);
      root.removeEventListener("focusout", exit);
    };
  }, []);

  return (
    <section ref={ref} className="wrap tk-fut">
      {children}
    </section>
  );
}

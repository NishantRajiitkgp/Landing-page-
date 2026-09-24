"use client";

/** The interactive shell of the v2 people strip (`sections/PeopleStrip.tsx`).

    The cards are server-rendered; this owns one rAF loop that moves them:

    1. **A curved path.** Both tracks (the greyscale one and the `aria-hidden`
       colour lane) are translated together, and each card is turned toward
       the centre by its distance from it — `rotateY` up to 26°, pushed back
       up to 150px, dropped up to 26px — so the strip reads as a drum.
    2. **Drag and fling.** Pointer drag moves the strip 1:1; release keeps the
       measured velocity (capped at 2,600px/s) and eases back to the cruise
       speed. A horizontal wheel/trackpad swipe nudges it the same way. The
       lag between velocity and target leans the cards (`skewX`, ±9°).
    3. **Cruise, slow, stop.** 38px/s at rest, 10px/s under the pointer, and 0
       when the hero's "Pause motion" is on (WCAG 2.2.2), under
       `prefers-reduced-motion`, or off screen (the loop is cancelled).

    The pause is the hero's, not a second button: the strip sits directly
    under it, and two pause controls a few pixels apart for one band of
    motion would be two answers to one question. The hero keeps its state in
    `HeroStage`, so this watches `.hv-paused` on `.hv-hero` with a
    MutationObserver rather than lifting that state into a context both
    islands would need wrapping in.

    Transforms are written through `style` (CSSOM), not React state: 16 cards
    × 60 fps through a render would be the whole cost of the effect.
    Values are the canvas's (`scripts/assemble_at2.py`, `stFrame`). */

import { useEffect, useRef, type ReactNode } from "react";

const CRUISE = 38;
const HOVER = 10;
const FLING_MAX = 2600;

export function PeopleStripStage({ checkpoint, children }: { checkpoint: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = ref.current;
    if (!strip) return;
    const tracks = strip.querySelectorAll<HTMLElement>(".track");
    if (tracks.length < 2) return;
    const [main, lane] = [tracks[0], tracks[1]];
    const a = Array.from(main.children) as HTMLElement[];
    const b = Array.from(lane.children) as HTMLElement[];
    if (!a.length) return;

    // RTL lays the track out from the right and `drift` runs the other way;
    // every horizontal quantity below goes through `flip`.
    const flip = getComputedStyle(strip).direction === "rtl" ? -1 : 1;
    const cards = a.map((el) => ({ left: el.offsetLeft, w: el.offsetWidth }));
    const half = main.scrollWidth / 2;

    // Take over from the CSS `drift` where it has got to, so hydration does
    // not jump the strip back to its first card.
    const m = new DOMMatrixReadOnly(getComputedStyle(main).transform);
    let x = -m.m41 * flip;
    let v = 0;
    let last = 0;
    let hover = false;
    let drag: { x: number; t: number; v: number } | null = null;
    let raf = 0;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector(".hv-hero");
    let heroPaused = !!hero?.classList.contains("hv-paused");
    const syncStill = () => strip.classList.toggle("hv-strip-still", heroPaused);
    syncStill();
    const mo = hero
      ? new MutationObserver(() => {
          heroPaused = hero.classList.contains("hv-paused");
          syncStill();
        })
      : null;
    mo?.observe(hero!, { attributes: true, attributeFilter: ["class"] });

    strip.classList.add("hv-js");

    const frame = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      const target = heroPaused || reduce.matches ? 0 : hover ? HOVER : CRUISE;
      if (!drag) {
        v += (target - v) * Math.min(1, dt * 1.6);
        // The ease toward 0 is exponential and never arrives; a pause has to
        // mean stopped, so under 1px/s it is.
        if (target === 0 && Math.abs(v) < 1) v = 0;
        x += v * dt;
      }
      let p = x % half;
      if (p < 0) p += half;
      const C = (strip.clientWidth || 1440) / 2;
      const tx = `translate3d(${(-p * flip).toFixed(2)}px,0,0)`;
      main.style.transform = tx;
      lane.style.transform = tx;
      const skew = Math.max(-9, Math.min(9, -(v - target) / 70)) * flip;
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        const n = Math.max(-1.6, Math.min(1.6, (c.left + c.w / 2 - p * flip - C) / C));
        const an = Math.abs(n);
        const tr =
          `perspective(1300px) translate3d(0,${(an * an * 26).toFixed(1)}px,${(-Math.pow(an, 1.4) * 150).toFixed(1)}px) ` +
          `rotateY(${(-n * 26).toFixed(2)}deg) skewX(${skew.toFixed(2)}deg)`;
        a[i].style.transform = tr;
        if (b[i]) b[i].style.transform = tr;
        a[i].style.opacity = String(Math.max(0.35, 1 - Math.max(0, an - 0.7) * 0.7));
      }
      raf = requestAnimationFrame(frame);
    };

    // Off screen, the loop is cancelled rather than idled.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(strip);

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, t: performance.now(), v: 0 };
      strip.classList.add("hv-grab");
      strip.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const now = performance.now();
      const dx = (e.clientX - drag.x) * flip;
      x -= dx;
      drag.v = drag.v * 0.6 + (-dx / Math.max(1, now - drag.t)) * 1000 * 0.4;
      v = drag.v;
      drag.x = e.clientX;
      drag.t = now;
    };
    const up = (e: PointerEvent) => {
      if (!drag) return;
      v = Math.max(-FLING_MAX, Math.min(FLING_MAX, drag.v));
      drag = null;
      strip.classList.remove("hv-grab");
      if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId);
    };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) v += e.deltaX * 6 * flip;
    };

    strip.addEventListener("pointerdown", down);
    strip.addEventListener("pointermove", move);
    strip.addEventListener("pointerup", up);
    strip.addEventListener("pointercancel", up);
    strip.addEventListener("pointerenter", enter);
    strip.addEventListener("pointerleave", leave);
    strip.addEventListener("wheel", wheel, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo?.disconnect();
      strip.removeEventListener("pointerdown", down);
      strip.removeEventListener("pointermove", move);
      strip.removeEventListener("pointerup", up);
      strip.removeEventListener("pointercancel", up);
      strip.removeEventListener("pointerenter", enter);
      strip.removeEventListener("pointerleave", leave);
      strip.removeEventListener("wheel", wheel);
      strip.classList.remove("hv-js", "hv-grab", "hv-strip-still");
      for (const el of [main, lane, ...a, ...b]) {
        el.style.transform = "";
        el.style.opacity = "";
      }
    };
  }, []);

  return (
    <div ref={ref} className="rise d6 hv-strip">
      {children}
      <div className="hv-check" aria-hidden="true">
        <div className="hv-check-k">
          <span className="dot live" />
          {checkpoint}
        </div>
        <div className="hv-scanwrap">
          <div className="hv-scan" />
        </div>
        <span className="hv-br hv-br-tl" />
        <span className="hv-br hv-br-tr" />
        <span className="hv-br hv-br-bl" />
        <span className="hv-br hv-br-br" />
      </div>
    </div>
  );
}

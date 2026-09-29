"use client";

/** The interactive shell of "Why governments … work with HelloVerify"
    (`./GovWhy`). Everything inside is server-rendered; this owns three things.

    1. **The light.** The pointer's position over the grid is written to
       `--mx`/`--my` on it (CSSOM, no React render per move — `HeroStage`'s
       reasoning), and `govwhy.css` paints a green radial there. The plates
       sit on a 1px-gapped grid whose own background is that radial, so the
       hairlines between the plates catch the light as it passes — the
       hero's UV lamp, turned into a table of reasons. A touch has no hover
       to follow, so there the light simply rests off.
    2. **Running the pictures.** Their loops (`./GovWhyArt`) start the first
       time the grid comes within 200px of the viewport (`gw-go`), and are
       held (`gw-still`) whenever it is off screen, so six looping drawings
       cost nothing while the reader is elsewhere on the page.
    3. **Pausing motion** (WCAG 2.2.2). The loops run indefinitely, so the
       band carries the hero's own pause control, with the hero's words
       (`hero.motion`) — the seals band's reasoning.

    Also here: the band's still rosette, because `Rosette` computes its
    paths after mount (`./GovArt`). */

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

import { Rosette } from "./GovArt";

export function GovWhyStage({ children, pauseLabel, playLabel }: { children: ReactNode; pauseLabel: string; playLabel: string }) {
  const grid = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  // State, not `classList.add`: React owns `className` and would drop a class
  // added behind its back on the next render (it did — `seen` re-renders).
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = grid.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setArmed(true);
        setSeen(e.isIntersecting);
      },
      { rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = grid.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
    el.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
    el.style.setProperty("--gl", "1");
  }, []);

  const onLeave = useCallback(() => grid.current?.style.setProperty("--gl", "0"), []);

  return (
    <>
      <Rosette className="gw-rose" />
      <div className="gw-ctl">
        <button type="button" className="gw-motion" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            {paused ? (
              <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
            ) : (
              <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
          <span>{paused ? playLabel : pauseLabel}</span>
        </button>
      </div>
      <div
        ref={grid}
        className={["gw-grid", armed ? "gw-go" : "", paused || !seen ? "gw-still" : ""].filter(Boolean).join(" ")}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {children}
      </div>
    </>
  );
}

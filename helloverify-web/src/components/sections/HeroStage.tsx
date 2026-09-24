"use client";

/** The interactive shell of the v2 hero (`sections/Hero.tsx`).

    Everything inside is server-rendered and static; this component owns only
    the three behaviours the canvas board gave the stage:

    1. **The UV lamp.** Pointer position is written to `--mx`/`--my` and the
       lamp's visibility to `--uv`, as custom properties on this element. Set
       through `style.setProperty` — CSSOM, not an attribute — so it needs no
       `style-src-attr` allowance and costs no React render per mouse move.
       The board measured the offset against `offsetWidth / rect.width`
       because the canvas is zoomed; a real page is not, but the ratio is 1
       there and keeps the maths honest if the page ever is.
    2. **Replaying the seal.** The seal button lives in the server tree, so
       this listens by delegation and swaps `hv-stampA`↔`hv-stampB` on the
       button itself. Two identically-keyframed classes, because changing
       `animation-name` restarts an animation and re-setting it does not
       (see `v2.css`).
    3. **Pausing motion** (WCAG 2.2.2). The guilloche turns, the microtext
       runs and the doors peek for longer than five seconds, so the page
       offers a pause. `hv-paused` sets `animation-play-state: paused` on those
       loops only; one-shot entrances are left to finish.

    REJECTED: making the whole hero a Client Component. The guilloche is
    ~30 KB of SVG computed at build time (`lib/heroArt.ts`); shipping it as a
    client payload to re-render it on hydration buys nothing. */

import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from "react";

export function HeroStage({
  children,
  pauseLabel,
  playLabel,
}: {
  children: ReactNode;
  pauseLabel: string;
  playLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const k = r.width ? el.offsetWidth / r.width : 1;
    el.style.setProperty("--mx", `${Math.round((e.clientX - r.left) * k)}px`);
    el.style.setProperty("--my", `${Math.round((e.clientY - r.top) * k)}px`);
    el.style.setProperty("--uv", "1");
  }, []);

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty("--uv", "0");
  }, []);

  const onClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const seal = (e.target as Element).closest?.(".hv-seal-btn");
    if (!seal) return;
    const next = seal.classList.contains("hv-stampA") ? "hv-stampB" : "hv-stampA";
    seal.classList.remove("hv-stampA", "hv-stampB");
    seal.classList.add(next);
  }, []);

  return (
    <div
      ref={ref}
      className={paused ? "hv-hero hv-paused" : "hv-hero"}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
      <button
        type="button"
        className="hv-motion"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
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
  );
}

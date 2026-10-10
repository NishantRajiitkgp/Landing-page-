"use client";

/** The old Certifier carousels: How Certifier Works' image slider (advances
 *  every 6 s, pauses on hover, still under reduced motion) and the API
 *  platform's two card slides (dots, arrow keys while focused). Every slide
 *  stays in the DOM (`hidden`); the arrow and dot labels are the old
 *  hard-coded English. */
import { useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from "react";

export function CertSlider({
  slides,
  autoplay,
  dots,
  label,
  className,
}: {
  slides: readonly ReactNode[];
  autoplay?: boolean;
  dots?: boolean;
  label?: string;
  className?: string;
}) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    if (!autoplay || paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(t);
  }, [autoplay, paused, n, go]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    go((e.key === "ArrowRight") !== rtl ? 1 : -1);
  };

  return (
    <div
      className={`cert3-slider${className ? ` ${className}` : ""}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={n > 1 ? 0 : undefined}
      onKeyDown={n > 1 ? onKey : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="frame" aria-live="polite">
        {slides.map((s, k) => (
          <div key={k} className="slide" hidden={k !== i}>
            {s}
          </div>
        ))}
      </div>
      {n > 1 && !dots && (
        <div className="bar">
          <button type="button" className="nav prev" aria-label="Previous slide" onClick={() => go(-1)}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3 5 8l5 5" />
            </svg>
          </button>
          <ol className="track" aria-hidden="true">
            {slides.map((_, k) => (
              <li key={k} className={k === i ? "on" : undefined} />
            ))}
          </ol>
          <button type="button" className="nav next" aria-label="Next slide" onClick={() => go(1)}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m6 3 5 5-5 5" />
            </svg>
          </button>
        </div>
      )}
      {dots && n > 1 && (
        <div className="dots">
          {slides.map((_, k) => (
            <button key={k} type="button" aria-pressed={k === i} aria-label={`Show slide ${k + 1} of ${n}`} className={k === i ? "on" : undefined} onClick={() => setI(k)} />
          ))}
        </div>
      )}
    </div>
  );
}

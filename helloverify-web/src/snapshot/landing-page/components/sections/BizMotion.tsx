"use client";

/** "Pause motion" for the v2 business bands (`Enterprises.tsx`,
    `Diligence.tsx`), the pattern `HeroStage.tsx` set for the hero.

    Both bands loop for longer than five seconds — the perimeter canvas and
    the letters that shuffle every 8 s, the 10 s risk scan — so WCAG 2.2.2
    wants a way to stop them. `MotionStage` owns the flag, puts a class on
    its own element for the CSS loops, and shares the flag through context
    for the client islands that run their own clocks (the canvas `rAF`, the
    letters' timer). The server tree between them stays server-rendered.

    REJECTED: one page-level pause. It would have to live in `page.tsx`,
    which the sections do not own, and a control far from the motion it
    stops is one nobody finds. */

import { createContext, useContext, useState, type ReactNode } from "react";

type Motion = { paused: boolean; toggle: () => void };

const MotionContext = createContext<Motion>({ paused: false, toggle: () => {} });

export function useMotionPaused(): boolean {
  return useContext(MotionContext).paused;
}

export function MotionStage({
  className,
  pausedClassName,
  children,
}: {
  className: string;
  pausedClassName: string;
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <MotionContext.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>
      <div className={paused ? `${className} ${pausedClassName}` : className}>{children}</div>
    </MotionContext.Provider>
  );
}

export function MotionButton({
  className,
  pauseLabel,
  playLabel,
}: {
  className: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const { paused, toggle } = useContext(MotionContext);
  return (
    <button type="button" className={className} aria-pressed={paused} onClick={toggle}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        {paused ? (
          <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
        ) : (
          <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
      <span>{paused ? playLabel : pauseLabel}</span>
    </button>
  );
}

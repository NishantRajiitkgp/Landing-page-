"use client";

/** The shell of the v2 Trust Platform section (`./TrustPlatform`): the
    masthead, and the section's one "Pause motion" control (WCAG 2.2.2).

    The network canvas animates without end, and so do the flywheel, the
    medallion's dial and ripples, the engine icons and the domains marquee.
    `tq-paused` sets `animation-play-state: paused` on every CSS loop, and
    `MotionPaused` tells the canvas island (`./TrustNetwork`) to stop its
    ambient motion. A context rather than a prop because the canvas sits
    inside server-rendered children; a client provider passes through them.

    Same control, words and placement logic as the hero's (`./HeroStage`),
    so a reader who found one knows the other. REJECTED: one page-level
    pause shared by both — the hero is 3,000px away and a control that
    stops something off-screen is not discoverable from here. */

import { createContext, useState, type ReactNode } from "react";

export const MotionPaused = createContext(false);

export function TrustPlatformStage({
  children,
  kicker,
  sheet,
  pauseLabel,
  playLabel,
}: {
  children: ReactNode;
  kicker: string;
  sheet: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={paused ? "wrap tq tq-paused" : "wrap tq"}>
      <div className="tq-mast">
        <span className="k">{kicker}</span>
        <span className="tq-mast-r">
          <button type="button" className="tq-motion" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              {paused ? (
                <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
              ) : (
                <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
            <span>{paused ? playLabel : pauseLabel}</span>
          </button>
          <span className="tq-sheet">{sheet}</span>
        </span>
      </div>
      <MotionPaused.Provider value={paused}>{children}</MotionPaused.Provider>
    </div>
  );
}

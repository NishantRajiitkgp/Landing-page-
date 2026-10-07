"use client";

import { useState, type ReactNode } from "react";

/** The WhatsApp phone loops, so it needs the same pause control as the
 *  landing-page storefront (WCAG 2.2.2). */
export function HelloVAskPhone({
  pause,
  play,
  children,
}: {
  pause: string;
  play: string;
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <div className="cx-phonecol">
      <div className={paused ? "fm-phone cx-paused" : "fm-phone"} key={run}>
        {children}
      </div>
      <button
        type="button"
        className="cx-motion"
        aria-pressed={paused}
        onClick={() => {
          if (paused) setRun((n) => n + 1);
          setPaused((on) => !on);
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          {paused ? (
            <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
          ) : (
            <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
        <span>{paused ? play : pause}</span>
      </button>
    </div>
  );
}

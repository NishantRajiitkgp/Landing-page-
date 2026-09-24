"use client";

/** The pace strip on the v2 Numbers band: "N checks verified since you
    opened this page", a bar that fills every 14 seconds, and the pause.

    THE COUNT IS DRIVEN BY THE BAR, not by its own timer. Each
    `animationiteration` of the 14s bar adds one, so the number and the bar
    can never drift apart, and pausing the bar (`animation-play-state`)
    pauses the count with it — one switch, not two to keep in step. Under
    `prefers-reduced-motion` the bar does not run, so a plain 14s interval
    keeps the count honest instead.

    THE PAUSE BUTTON IS NOT ON THE BOARD. The bar and the live dot move for
    as long as the page is open, and WCAG 2.2.2 wants a way to stop anything
    that moves for more than five seconds. It reuses the hero's "Pause
    motion" / "Play motion" wording and look (`HeroStage.tsx`), so the site
    has one pause control, not two dialects of it.

    The count is 0 on the server and on first paint; it only changes after
    mount, so there is nothing time-dependent to mismatch on hydration. */

import { useEffect, useState } from "react";

export function NumbersPace({
  lead,
  note,
  pauseLabel,
  playLabel,
}: {
  lead: string;
  note: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!reduce || paused) return;
    const id = setInterval(() => setCount((n) => n + 1), 14000);
    return () => clearInterval(id);
  }, [reduce, paused]);

  // `nm-popA`/`nm-popB` alternate so each new number replays the pop; none
  // at 0, so nothing animates before the first real tick.
  const pop = count === 0 ? undefined : count % 2 ? "nm-popB" : "nm-popA";

  return (
    <div className={paused ? "nm-pace nm-paused" : "nm-pace"}>
      <div className="nm-pace-l">
        <span className="dot live" />
        <b className={pop}>{count}</b>
        <span className="nm-pace-t">{lead}</span>
      </div>
      <div className="nm-pace-bar" aria-hidden="true">
        <i onAnimationIteration={() => setCount((n) => n + 1)} />
      </div>
      <div className="nm-pace-r">
        <span>{note}</span>
        <button type="button" className="nm-motion" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
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
    </div>
  );
}

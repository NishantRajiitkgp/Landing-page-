"use client";

/** "Letters from our clients" (`sections/Enterprises.tsx`): three testimonial
    letters stacked like paper, the front one shuffling to the back every 8 s,
    and a selector whose progress bar is the clock.

    THE PROGRESS BAR IS THE TIMER. The board ran a `setInterval` beside a CSS
    transition and let the two drift — hovering froze the rotation but snapped
    the bar full, so after a hover the bar and the shuffle disagreed. Here the
    bar is a CSS animation and `animationend` advances the letter, so the two
    cannot disagree: hover, keyboard focus and "Pause motion" pause the
    animation (`animation-play-state`), and the shuffle waits with it.
    Reduced motion sets `animation: none`, so nothing ends and nothing
    auto-advances; picking a letter still works.

    A reader who picks a letter has taken over: rotation stops for good and
    the picked letter's bar shows full, as on the board.

    The seal in each letterhead is one `<symbol>`, drawn from its formula here
    and `<use>`d three times — ~6 KB of path data once, not three times over
    in both the HTML and the flight payload. */

import { useState, type ReactNode } from "react";

import { useMotionPaused } from "./BizMotion";

export type Letter = { role: string; co: string; q: ReactNode };

/** Six offset rosettes of 14 lobes, r = 34 ± 5, and a plain ring at 24: the
 *  faint guilloche seal of the canvas letterhead (88-unit box). */
const SEAL = Array.from({ length: 6 }, (_, l) => {
  const pts: string[] = [];
  for (let k = 0; k <= 180; k++) {
    const t = (2 * Math.PI * k) / 180;
    const r = 34 + 5 * Math.sin(14 * t + (l * Math.PI) / 3);
    pts.push(`${(44 + r * Math.cos(t)).toFixed(1)} ${(44 + r * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join(" L")}Z`;
});

export function ClientLetters({
  kicker,
  heading,
  from,
  letters,
}: {
  kicker: string;
  heading: ReactNode;
  from: string;
  letters: Letter[];
}) {
  const n = letters.length;
  const [lt, setLt] = useState(0);
  const [hold, setHold] = useState(false);
  const [manual, setManual] = useState(false);
  const paused = useMotionPaused();

  // `lt-letters`, not the board's bare `lt`: `design.css` already has an
  // `.lt` (the licence mock's label, `.lic .lt`), and a bare `.lt` rule here
  // laid out every one of those spans as this grid.
  const cls = ["lt-letters", hold || paused ? "lt-hold" : "", manual ? "lt-manual" : ""].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
      }}
    >
      <svg width="0" height="0" className="lt-defs" aria-hidden="true" focusable="false">
        <symbol id="lt-seal" viewBox="0 0 88 88">
          {SEAL.map((d) => (
            <path key={d} d={d} />
          ))}
          <circle cx="44" cy="44" r="24" />
        </symbol>
      </svg>
      <div className="lt-left">
        <span className="k">{kicker}</span>
        <h3 className="lt-h">{heading}</h3>
        <div className="lt-sel">
          {letters.map((l, k) => (
            <button
              key={l.role}
              type="button"
              className={k === lt ? "lt-s lt-on" : "lt-s"}
              aria-pressed={k === lt}
              onClick={() => {
                setLt(k);
                setManual(true);
              }}
            >
              <span className="lt-sn">{String(k + 1).padStart(2, "0")}</span>
              <span className="lt-sx">
                <b>{l.role}</b>
                <em>{l.co}</em>
              </span>
              <i className="lt-sbar" aria-hidden="true">
                <i onAnimationEnd={() => setLt((cur) => (cur + 1) % n)} />
              </i>
            </button>
          ))}
        </div>
      </div>
      <div className="lt-right">
        <div className="lt-stack">
          {letters.map((l, k) => {
            const rel = (k - lt + n) % n;
            return (
              <figure key={l.role} className={`lt-l lt-f${rel}`} aria-hidden={rel !== 0}>
                <div className="lt-top">
                  <span>
                    {from} · {l.role}
                  </span>
                  <span>{l.co}</span>
                </div>
                <svg className="lt-seal" aria-hidden="true" focusable="false">
                  <use href="#lt-seal" />
                </svg>
                <span className="lt-qm" aria-hidden="true">
                  “
                </span>
                <blockquote className="lt-q">{l.q}</blockquote>
                <figcaption className="lt-sig">
                  <b>{l.role}</b>
                  <span>{l.co}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}

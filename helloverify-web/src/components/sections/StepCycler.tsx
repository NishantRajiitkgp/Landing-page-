"use client";

/** A walk-through that plays itself: N server-rendered screens, the N steps
    that name them, and which one is current (`sections/Enterprises.tsx` —
    the Customers phone and the Businesses certificate).

    The island owns only the step number and its clock. Every screen and
    label arrives as server-rendered children; each is wrapped here in an
    element carrying `is-on` (current) or `is-done` (passed), and the panel's
    CSS decides what those look like — the phone shows one screen at a time,
    the certificate keeps what earlier steps filled in.

    - **Clock.** One `setTimeout` per step; the last step can hold longer
      (`holdLast`) so the finished state is seen before it loops.
    - **Hands on.** Pointing at or focusing the steps holds the clock; picking
      a step jumps there. Each step is a real `<button>` with
      `aria-current="step"` on the current one.
    - **Stopping** (WCAG 2.2.2). The clock runs only while on screen and
      stops outright under "Pause motion" (`BizMotion`) and
      `prefers-reduced-motion`; the steps still work by hand. Server HTML is
      `start`, with no clock.

    REJECTED: one island per panel. The two differ only in markup and CSS,
    which the server already renders, so a second copy of the clock would be
    bytes for nothing on a page at its script budget. */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

import { useMotionPaused } from "./BizMotion";

export function StepCycler({
  className,
  screens,
  steps,
  every,
  holdLast = 1,
  start = 0,
  stepsLabel,
}: {
  className: string;
  screens: ReactNode[];
  steps: ReactNode[];
  /** Milliseconds per step. */
  every: number;
  /** The last step lasts `every * holdLast`. */
  holdLast?: number;
  start?: number;
  /** The step list's accessible name. */
  stepsLabel: string;
}) {
  const [step, setStep] = useState(start);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const paused = useMotionPaused();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const running = !paused && !reduce && seen && !held;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dur = step === n - 1 ? every * holdLast : every;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % n), dur);
    return () => clearTimeout(t);
  }, [running, step, dur, n]);

  const state = (i: number) => (i === step ? " is-on" : i < step ? " is-done" : "");

  return (
    <div
      ref={ref}
      className={`cy ${className}${running ? " cy-run" : ""}`}
      data-step={step}
      style={{ "--cy-dur": `${dur}ms` } as CSSProperties}
    >
      <div className="cy-stage" aria-hidden="true">
        {screens.map((s, i) => (
          <div key={i} className={`cy-scr cy-scr-${i}${state(i)}`}>
            {s}
          </div>
        ))}
      </div>
      <ol
        className="cy-steps"
        aria-label={stepsLabel}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        {steps.map((s, i) => (
          <li key={i} className={`cy-st${state(i)}`}>
            <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)}>
              <span className="cy-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="cy-l">{s}</span>
              <span className="cy-bar" aria-hidden="true">
                <i />
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

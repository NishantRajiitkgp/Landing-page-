"use client";

/** The "trusted by" tabs. The panels are server-rendered children; this
 *  writes only which one shows (`data-tab`) and which word the heading
 *  ends on. It advances on its own every few seconds, pauses while the
 *  pointer or focus is inside, stops for good once a tab is chosen, and
 *  never moves under reduced motion. Without script every panel shows. */
import { useEffect, useRef, useState, type ReactNode } from "react";

const EVERY = 3500;

export function TrustTabs({
  labels,
  aria,
  head,
  children,
}: {
  labels: readonly string[];
  aria: string;
  /** The heading, split around the rotating word. */
  head: { id: string; before: string; after: string };
  children: ReactNode;
}) {
  const [on, setOn] = useState(0);
  const held = useRef(false);
  const chosen = useRef(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!held.current && !chosen.current) setOn((n) => (n + 1) % labels.length);
    }, EVERY);
    return () => clearInterval(t);
  }, [labels.length]);

  return (
    <div
      className="pw-trust-in"
      data-tab={on}
      onPointerEnter={() => {
        held.current = true;
      }}
      onPointerLeave={() => {
        held.current = false;
      }}
      onFocus={() => {
        held.current = true;
      }}
      onBlur={() => {
        held.current = false;
      }}
    >
      {/* Every word is laid out, stacked in one cell, so the slot is the
          widest word's size and the fixed text never moves when it changes. */}
      <h2 className="h2" id={head.id}>
        <span className="pw-fix">{head.before.trim()}</span>{" "}
        <span className="pw-rot">
          {labels.map((l, i) => (
            <span key={l} data-on={i === on ? "" : undefined} aria-hidden={i !== on}>{l}</span>
          ))}
        </span>
        {head.after}
      </h2>
      <div className="pw-tabs" role="group" aria-label={aria}>
        {labels.map((l, i) => (
          <button
            key={l}
            type="button"
            aria-pressed={i === on}
            onClick={() => {
              chosen.current = true;
              setOn(i);
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

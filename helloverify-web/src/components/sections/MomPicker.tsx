"use client";

/** The COMPASS C2 points picker in the MOM case (`sections/GovMom.tsx`): three
    qualification outcomes as toggle buttons, and the points each scores shown
    large beside them with a bar.

    The figure re-enters on every choice by swapping `mw-ptsA`/`mw-ptsB` —
    two identical keyframes, because changing `animation-name` restarts an
    animation and re-setting it does not (`hero.css` has the same pair). No
    class on first render, so the prerendered figure does not animate. It is
    a polite live region, so the new score is read out after a choice. */

import { useState } from "react";

export function MomPicker({
  heading,
  unit,
  options,
}: {
  heading: string;
  unit: string;
  options: { t: string; label: string; pts: number }[];
}) {
  const [on, setOn] = useState(0);
  const [picks, setPicks] = useState(0);
  const max = Math.max(...options.map((o) => o.pts)) || 1;
  const pts = options[on].pts;
  const anim = picks ? (picks % 2 ? " mw-ptsA" : " mw-ptsB") : "";

  return (
    <div className="mw-c2">
      <div className="mw-c2-l">
        <div className="mw-c2-k">{heading}</div>
        <div className="mw-opts">
          {options.map((o, i) => (
            <button
              key={o.t}
              type="button"
              className={on === i ? "mw-opt mw-on" : "mw-opt"}
              aria-pressed={on === i}
              onClick={() => {
                setOn(i);
                setPicks((n) => n + 1);
              }}
            >
              <i aria-hidden="true" />
              <span>{o.t}</span>
              <b>{o.label}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="mw-c2-r">
        <div className={`mw-pts${anim}`} aria-live="polite">
          <span>{pts}</span>
          <em>{unit}</em>
        </div>
        <div className="mw-bar" aria-hidden="true">
          <i style={{ width: `${(pts / max) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

"use client";

/** `/products/certifier` — the old How Certifier Works tabs
 *  (`CertifierHowItWorksSection`): four tabs swap the left column only; the
 *  image slider on the right runs on its own. Panels are rendered by the
 *  server and passed in; all four stay in the DOM (`hidden`). */
import { useState, type ReactNode } from "react";

export function CertifierHow({
  tabs,
  panels,
  slider,
}: {
  tabs: readonly { k: string; label: string }[];
  panels: readonly ReactNode[];
  slider: ReactNode;
}) {
  const [on, setOn] = useState(0);
  return (
    <div className="body3">
      <div className="cert3-how-tabs" role="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.k}
            type="button"
            role="tab"
            id={`cert3-how-tab-${t.k}`}
            aria-selected={on === i}
            aria-controls={`cert3-how-panel-${t.k}`}
            className={on === i ? "on" : undefined}
            onClick={() => setOn(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="cert3-how">
        <div className="cert3-how-left">
          {tabs.map((t, i) => (
            <div key={t.k} role="tabpanel" id={`cert3-how-panel-${t.k}`} aria-labelledby={`cert3-how-tab-${t.k}`} hidden={on !== i}>
              {panels[i]}
            </div>
          ))}
        </div>
        {slider}
      </div>
    </div>
  );
}

"use client";

/** The client voices on `/about` as one featured quote: the three clients
    are tabs, and the chosen client's words are set large beside them. All
    three quotes stay in the page; the panels share one grid cell, so the
    card is as tall as the longest and does not jump on a change. */
import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

export type Voice = {
  key: string;
  role: string;
  company: string;
  quote: string;
  logo: { src: string; alt: string; w: number; h: number };
};

const STEP: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };

export function AboutVoicesTabs({ items }: { items: Voice[] }) {
  const [on, setOn] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;

  const onKey = (e: KeyboardEvent) => {
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? n - 1 : e.key in STEP ? (on + STEP[e.key] + n) % n : -1;
    if (next < 0) return;
    e.preventDefault();
    setOn(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="ab-vc">
      <div className="ab-tabs" role="tablist" aria-orientation="vertical">
        {items.map((it, i) => (
          <button
            key={it.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`ab-tab-${it.key}`}
            aria-selected={i === on}
            aria-controls={`ab-panel-${it.key}`}
            tabIndex={i === on ? 0 : -1}
            className="ab-tab"
            onClick={() => setOn(i)}
            onKeyDown={onKey}
          >
            <Image src={it.logo.src} alt={it.logo.alt} width={it.logo.w} height={it.logo.h} sizes="140px" />
            <span className="ab-tab-r">{it.role}</span>
            <span className="ab-tab-c">{it.company}</span>
          </button>
        ))}
      </div>
      <div className="ab-panels">
        {items.map((it, i) => (
          <figure
            key={it.key}
            role="tabpanel"
            id={`ab-panel-${it.key}`}
            aria-labelledby={`ab-tab-${it.key}`}
            tabIndex={i === on ? 0 : -1}
            className="ab-panel"
            data-on={i === on ? "" : undefined}
          >
            <svg className="ab-qm" viewBox="0 0 41 32" aria-hidden="true">
              <path d="M0 32V20C0 9 5.5 2.5 15 0l2 4.2C11.6 6 9.2 9.6 9 15h8v17zM24 32V20c0-11 5.5-17.5 15-20l2 4.2C35.6 6 33.2 9.6 33 15h8v17z" />
            </svg>
            <blockquote className="ab-q">{it.quote}</blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}

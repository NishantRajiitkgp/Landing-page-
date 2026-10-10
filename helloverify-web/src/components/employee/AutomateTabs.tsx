"use client";

/** `/employee-verification` — the old Automated Workforce Onboarding tabs
 *  (`EmployeesAutomateOnboarding`): labels down the side, the selected tab's
 *  screenshot and description beside them. Every panel stays in the DOM
 *  (`hidden`); the screenshots are rendered by the server and passed in.
 *
 *  Keyboard: the WAI-ARIA tabs pattern with automatic activation — one tab
 *  stop, arrows move and select, Home/End jump. Up/Down where the list is a
 *  column, and Left/Right too for the phone's sideways row (swapped under
 *  `dir="rtl"`). */
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type AutomateTab = { k: string; t: string; p: string; img: ReactNode };

export function AutomateTabs({ items }: { items: readonly AutomateTab[] }) {
  const [on, setOn] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const n = items.length;

  const go = (i: number) => {
    const next = (i + n) % n;
    setOn(next);
    const tab = list.current?.querySelectorAll<HTMLElement>("[role=tab]")[next];
    tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKey = (e: KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const fwd = ["ArrowDown", rtl ? "ArrowLeft" : "ArrowRight"];
    const back = ["ArrowUp", rtl ? "ArrowRight" : "ArrowLeft"];
    if (fwd.includes(e.key)) go(on + 1);
    else if (back.includes(e.key)) go(on - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(n - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="emp4-auto">
      <div className="emp4-auto-tabs" role="tablist" aria-orientation="vertical" ref={list} onKeyDown={onKey}>
        {items.map((t, i) => (
          <button
            key={t.k}
            type="button"
            role="tab"
            id={`emp4-auto-tab-${t.k}`}
            aria-selected={on === i}
            aria-controls={`emp4-auto-panel-${t.k}`}
            tabIndex={on === i ? 0 : -1}
            className={on === i ? "on" : undefined}
            onClick={() => setOn(i)}
          >
            {t.t}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div
          key={t.k}
          role="tabpanel"
          id={`emp4-auto-panel-${t.k}`}
          aria-labelledby={`emp4-auto-tab-${t.k}`}
          className="emp4-auto-panel"
          hidden={on !== i}
        >
          <div className="frame">{t.img}</div>
          <p>{t.p}</p>
        </div>
      ))}
    </div>
  );
}

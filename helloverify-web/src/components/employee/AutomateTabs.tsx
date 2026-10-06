"use client";

/** `/employee-verification` — the old Automated Workforce Onboarding tabs
 *  (`EmployeesAutomateOnboarding`): labels down the side, the selected tab's
 *  screenshot and description beside them. Every panel stays in the DOM
 *  (`hidden`); the screenshots are rendered by the server and passed in. */
import { useState, type ReactNode } from "react";

export type AutomateTab = { k: string; t: string; p: string; img: ReactNode };

export function AutomateTabs({ items }: { items: readonly AutomateTab[] }) {
  const [on, setOn] = useState(items[0]?.k);
  return (
    <div className="body3 emp3-auto">
      <div className="emp3-auto-tabs" role="tablist" aria-orientation="vertical">
        {items.map((t) => (
          <button
            key={t.k}
            type="button"
            role="tab"
            id={`emp3-auto-tab-${t.k}`}
            aria-selected={on === t.k}
            aria-controls={`emp3-auto-panel-${t.k}`}
            className={on === t.k ? "on" : undefined}
            onClick={() => setOn(t.k)}
          >
            {t.t}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div
          key={t.k}
          role="tabpanel"
          id={`emp3-auto-panel-${t.k}`}
          aria-labelledby={`emp3-auto-tab-${t.k}`}
          className="emp3-auto-panel"
          hidden={on !== t.k}
        >
          <div className="shot">{t.img}</div>
          <p>{t.p}</p>
        </div>
      ))}
    </div>
  );
}

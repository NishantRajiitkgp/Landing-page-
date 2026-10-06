"use client";

/** `/employee-verification` — the old split panel's checks card
 *  (`EmployeesWhiteCollarVerification`): the check names as a vertical tab
 *  list, the selected one's name and description beside it. Every
 *  definition stays in the DOM (`hidden`). */
import { useState } from "react";

export type EmployeeCheck = { k: string; n: string; p: string };

export function EmployeeChecks({ id, items }: { id: string; items: readonly EmployeeCheck[] }) {
  const [on, setOn] = useState(items[0]?.k);
  return (
    <div className="emp3-checks">
      <div className="emp3-list" role="tablist" aria-orientation="vertical">
        {items.map((c) => (
          <button
            key={c.k}
            type="button"
            role="tab"
            id={`${id}-tab-${c.k}`}
            aria-selected={on === c.k}
            aria-controls={`${id}-panel-${c.k}`}
            className={on === c.k ? "on" : undefined}
            onClick={() => setOn(c.k)}
          >
            {c.n}
          </button>
        ))}
      </div>
      {items.map((c) => (
        <div
          key={c.k}
          role="tabpanel"
          id={`${id}-panel-${c.k}`}
          aria-labelledby={`${id}-tab-${c.k}`}
          className="emp3-def"
          hidden={on !== c.k}
        >
          <h4>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" />
              <path d="M6 10.2 8.8 13 14 7.4" />
            </svg>
            {c.n}
          </h4>
          <p>{c.p}</p>
        </div>
      ))}
    </div>
  );
}

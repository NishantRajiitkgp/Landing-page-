"use client";

/** The Large ↔ Small & Medium toggle over the business band (`./Smb`).

    Both panels are server-rendered and both stay in the DOM; the one not
    chosen is `hidden`, so every word of both is in the prerendered HTML and
    un-hiding replays the panel's CSS entrance as a remount would — the seals
    band's reasoning (`GovSealsStage`).

    A WAI-ARIA tabs pattern: `role="tablist"`, one tab per segment, roving
    `tabIndex`, Left/Right (and Home/End) move and select. The sliding thumb
    is one element whose position is a class, so the segmented control reads
    as a switch rather than two buttons. */

import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type Segment = { key: string; label: string; panel: ReactNode };

export function SmbSegments({ label, segments, initial = 0 }: { label: string; segments: Segment[]; initial?: number }) {
  const [on, setOn] = useState(initial);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const n = segments.length;
      const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
      const map: Record<string, number> = {
        ArrowRight: rtl ? -1 : 1,
        ArrowLeft: rtl ? 1 : -1,
      };
      let next = on;
      if (e.key in map) next = (on + map[e.key] + n) % n;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = n - 1;
      else return;
      e.preventDefault();
      setOn(next);
      tabs.current[next]?.focus();
    },
    [on, segments.length],
  );

  return (
    <>
      <div className="sg-bar">
        <div className={`sg-tabs sg-at-${on}`} role="tablist" aria-label={label} onKeyDown={onKey}>
          <span className="sg-thumb" aria-hidden="true" />
          {segments.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-t${i}`}
              aria-selected={on === i}
              aria-controls={`${id}-p${i}`}
              tabIndex={on === i ? 0 : -1}
              className={on === i ? "sg-tab sg-tab-on" : "sg-tab"}
              onClick={() => setOn(i)}
            >
              <b>{s.label}</b>
            </button>
          ))}
        </div>
      </div>
      {segments.map((s, i) => (
        <div key={s.key} id={`${id}-p${i}`} role="tabpanel" aria-labelledby={`${id}-t${i}`} className="sg-panel" hidden={on !== i}>
          {s.panel}
        </div>
      ))}
    </>
  );
}

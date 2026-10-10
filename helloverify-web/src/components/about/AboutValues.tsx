/** "Our Values" on `/about`: six ruled cells, each with a line mark of the
    value and one red stroke in it for the part that matters: the check in
    the shield, the centre of the target, the keyhole, the beam of the
    scales, the stopwatch's hand, the arrow up. The marks draw in once as
    the grid arrives. Decoration, `aria-hidden`; the titles carry it. */
import type { CSSProperties } from "react";
import { Reveal } from "./AboutMotion";

type Key = "integrity" | "accuracy" | "privacy" | "fairness" | "speed" | "improvement";

const MARK: Record<Key, { ink: string; red: string }> = {
  integrity: {
    ink: "M12 3l7 3v5c0 4.4-3 8.1-7 9.5C8 19.1 5 15.4 5 11V6z",
    red: "M9 11.8l2.2 2.2 3.9-4.2",
  },
  accuracy: {
    ink: "M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16zM12 1.5v3.5M12 19v3.5M1.5 12H5M19 12h3.5",
    red: "M12 10a2 2 0 1 1 0 4a2 2 0 1 1 0-4z",
  },
  privacy: {
    ink: "M7 10.5h10a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 7 10.5zM8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",
    red: "M12 14.2v2.6",
  },
  fairness: {
    ink: "M12 4.5V20M8.5 20h7M5 7l-2.5 6a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z",
    red: "M4.5 7h15",
  },
  speed: {
    ink: "M12 6.5a7 7 0 1 1 0 14a7 7 0 1 1 0-14zM10 3h4M12 3v3.5M18.2 7.3l1.3-1.3",
    red: "M12 13.5l3-3",
  },
  improvement: {
    ink: "M3.5 20.5h4.5V17h4.5v-3.5H17V10h3.5",
    red: "M14 3.5h6v6M20 3.5l-6.5 6.5",
  },
};

export function AboutValues({ h, items }: { h: string; items: Record<Key, { t: string; p: string }> }) {
  return (
    <section className="wrap ab-val">
      <div className="ab-head">
        <h2 className="h2">{h}</h2>
      </div>
      <Reveal as="ul" className="ab-vals">
        {(Object.keys(MARK) as Key[]).map((key, i) => {
          const v = items[key];
          const m = MARK[key];
          return (
            <li key={key} className="ab-v" style={{ "--d": `${(0.08 * i).toFixed(2)}s` } as CSSProperties}>
              <div className="ab-v-top">
                <span className="ab-v-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path className="ab-v-ink" d={m.ink} pathLength="1" />
                    <path className="ab-v-red" d={m.red} pathLength="1" />
                  </svg>
                </span>
                <span className="ab-v-n" aria-hidden="true">{`0${i + 1}`}</span>
              </div>
              <h3>{v.t}</h3>
              <p>{v.p}</p>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}

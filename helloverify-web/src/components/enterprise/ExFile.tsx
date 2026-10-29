"use client";

/** The hero's screening file. Rows tick through on a timer; with no script
 *  or reduced motion every row is already done, which is the still frame. */
import { useEffect, useState } from "react";
import { Tick } from "@/components/brand/Tick";

export function ExFile({
  kicker,
  title,
  rows,
  stats,
}: {
  kicker: string;
  title: string;
  rows: readonly string[];
  stats: readonly { a: string; b: string }[];
}) {
  const doneAt = rows.length;
  const [step, setStep] = useState(doneAt);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    setStep(0);
    const id = window.setInterval(() => {
      n = (n + 1) % (doneAt + 3);
      setStep(n);
    }, 900);
    return () => window.clearInterval(id);
  }, [doneAt]);

  return (
    <div className="ex-file">
      <p className="k">{kicker}</p>
      <p className="ttl">{title}</p>
      <ol>
        {rows.map((name, i) => {
          const done = step >= doneAt || i < step;
          const on = i === step;
          return (
            <li key={name} className={done ? "is-done" : on ? "is-on" : undefined}>
              <span className="mk">{done ? <Tick tone="inverse" /> : null}</span>
              <span>{name}</span>
            </li>
          );
        })}
      </ol>
      <ul className="st">
        {stats.map((s) => (
          <li key={s.b}>
            <b>{s.a}</b>
            <span>{s.b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

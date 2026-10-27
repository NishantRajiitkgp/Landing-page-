"use client";

/** The hero's moving case: the phone plays the six steps and the decision,
 *  and the case card ticks each check as its step finishes, then shows the
 *  result. Runs only while on screen; under reduced motion, and in the
 *  server HTML, it rests on the finished case. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Tick } from "@/components/brand/Tick";

type Row = { t: string; s: string };

const EVERY = 1900;
const HOLD = 4200;

export function KycHeroStage({
  photo,
  screens,
  id,
  time,
  name,
  rows,
  result,
  passed,
}: {
  photo: ReactNode;
  screens: ReactNode[];
  id: string;
  time: string;
  name: string;
  rows: readonly Row[];
  result: string;
  passed: string;
}) {
  const last = screens.length - 1;
  const [step, setStep] = useState(last);
  const [seen, setSeen] = useState(false);
  const reduce = useReducedMotion();
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const running = seen && !reduce;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (!started.current) {
      started.current = true;
      setStep(0);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => (s + 1) % screens.length), step === last ? HOLD : EVERY);
    return () => clearTimeout(t);
  }, [running, step, last, screens.length]);

  const done = step === last;

  return (
    <div ref={ref} className={`kh-stage${done ? " is-done" : ""}`} data-step={step}>
      <div className="kh-photo">{photo}</div>
      <div className="kp kh-phone" aria-hidden="true">
        <div className="kp-scr">
          {screens.map((s, i) => (
            <div key={i} className={`kp-s${i === step ? " is-on" : ""}`}>
              {s}
            </div>
          ))}
        </div>
      </div>
      <aside className="kh-case" aria-label={id}>
        <div className="meta">
          <p>{id}</p>
          <p>{time}</p>
        </div>
        <p className="nm">{name}</p>
        <ol>
          {rows.map((row, i) => (
            <li key={row.t} className={done || i < step ? "is-done" : i === step ? "is-on" : ""}>
              <span className="kh-dot"><Tick tone="inverse" /></span>
              <span className="t">{row.t}</span>
              <span className="st">{row.s}</span>
            </li>
          ))}
        </ol>
        <div className="ok">
          <b>{result}</b>
          <span>{passed}</span>
        </div>
      </aside>
    </div>
  );
}

"use client";

/** "Six steps on the customer's phone", told by scrolling: the phone holds
 *  still while the steps pass it, and shows whichever step is at the middle
 *  of the screen. Under 1080px the phone steps aside and each step carries
 *  its own small phone. Without script the first step is shown. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Step = { n: string; t: string; p: string };

export function KycScrolly({ screens, steps }: { screens: ReactNode[]; steps: readonly Step[] }) {
  const [on, setOn] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("[data-i]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="kw" style={{ "--p": (on + 1) / steps.length } as CSSProperties}>
      <div className="kw-side">
        <div className="kw-sticky">
          <div className="kp kw-phone" aria-hidden="true">
            <div className="kp-scr">
              {screens.map((s, i) => (
                <div key={i} className={`kp-s${i === on ? " is-on" : ""}`}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <span className="kw-rail" aria-hidden="true"><i /></span>
        </div>
      </div>
      <ol ref={list} className="kw-steps">
        {steps.map((st, i) => (
          <li key={st.n} data-i={i} className={i === on ? "is-on" : i < on ? "is-done" : ""}>
            <span className="n">{st.n}</span>
            <h3>{st.t}</h3>
            <p>{st.p}</p>
            <div className="kp kp-mini" aria-hidden="true">
              <div className="kp-scr">
                <div className="kp-s is-on">{screens[i]}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

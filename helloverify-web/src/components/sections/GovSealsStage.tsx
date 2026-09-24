"use client";

/** The interactive part of "Governments we work with" (`sections/GovSeals.tsx`):
    the linked names in the lede, the five seals and the record under them.

    WHAT IT OWNS, and what the board did differently.

    1. **Which authority is shown.** One index drives the seal (`sv-on`), the
       lede name (`sv-ln-on`) and the record. All five records are in the DOM
       and four are `hidden`, rather than only the active one being mounted:
       unhiding restarts their CSS entrances exactly as a remount would, and
       every authority's facts are in the prerendered HTML.
    2. **The auto-cycle.** The board advanced on a 7 s `setInterval` beside a
       7 s CSS ring (`sv-prog`) that only looked in step. Here the ring's
       `animationend` IS the advance, so pausing the animation pauses the
       cycle, `prefers-reduced-motion` (which removes the ring) stops it, and
       the two cannot drift. It starts the first time the row is on screen —
       the board started on mount, so a visitor arriving later landed on
       whichever seal the clock had reached — and stops for good on any
       choice, on keyboard focus, or when the pointer enters the record.
    3. **Pausing motion** (WCAG 2.2.2). The rosette and the microtext rings
       turn indefinitely, so this band carries the hero's own pause control,
       with the hero's words (`hero.motion`), rather than a second phrasing.
    4. **The tilt.** Pointer position becomes `--rx/--ry` (tilt) and
       `--lx/--ly/--fx` (sheen and foil) on the disc, through `style.setProperty`
       so a pointer move costs no React render — `HeroStage`'s reasoning. */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { Rosette, SealRim } from "./GovArt";
import { Inlay, Stamp, type SealItem } from "./GovSealParts";

/** The canvas's lede order, not the seal order: the sentence names India
 *  first and Singapore fourth. `tail` is the punctuation inside the no-wrap
 *  span, so a comma never starts a line. */
const LEDE: { i: number; tail: string }[] = [
  { i: 1, tail: "," },
  { i: 2, tail: "," },
  { i: 3, tail: "," },
  { i: 0, tail: "" },
  { i: 4, tail: "." },
];

const TILT = ["--rx", "--ry", "--lx", "--ly", "--fx"];

export function GovSealsStage({
  items,
  thread,
  ledeLead,
  ledeAnd,
  stamp,
  pauseLabel,
  playLabel,
  children,
}: {
  items: SealItem[];
  thread: string;
  ledeLead: string;
  ledeAnd: string;
  stamp: string;
  pauseLabel: string;
  playLabel: string;
  /** The closing line, server-rendered. */
  children: ReactNode;
}) {
  const [on, setOn] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const [paused, setPaused] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = row.current;
    const root = box.current;
    if (!el || !root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (e.target === el) setSeen(true);
          else e.target.classList.remove("sv-wait");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    // The record's entrance and the closing underline are one-shot and sit
    // a screen or more below the seals: held until each is on screen, or
    // they would have finished before anyone scrolled to them. Held from
    // here rather than in the markup, so without script they simply play.
    root.querySelectorAll(".sv-recs, .sv-close").forEach((t) => {
      t.classList.add("sv-wait");
      io.observe(t);
    });
    return () => io.disconnect();
  }, []);

  const pick = useCallback((i: number) => {
    setOn(i);
    setAuto(false);
  }, []);
  const hold = useCallback(() => setAuto(false), []);

  const onRingEnd = useCallback((e: AnimationEvent) => {
    if (e.animationName === "svProg") setOn((n) => (n + 1) % items.length);
  }, [items.length]);

  // A keyboard user landing on a seal is choosing; the pointer's focus-on-click
  // is already a `pick`.
  const onFocus = useCallback((e: FocusEvent) => {
    if ((e.target as Element).matches?.(":focus-visible")) setAuto(false);
  }, []);

  const tilt = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget.querySelector<HTMLElement>(".sv-disc");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1)));
    const y = Math.max(0, Math.min(1, (e.clientY - r.top) / (r.height || 1)));
    el.style.setProperty("--ry", `${((x - 0.5) * 18).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 18).toFixed(2)}deg`);
    el.style.setProperty("--lx", `${Math.round(x * 100)}%`);
    el.style.setProperty("--ly", `${Math.round(y * 100)}%`);
    el.style.setProperty("--fx", `${Math.round(x * 100)}%`);
  }, []);

  const untilt = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget.querySelector<HTMLElement>(".sv-disc");
    TILT.forEach((k) => el?.style.removeProperty(k));
  }, []);

  const cls = ["sv-live", auto && seen ? "sv-auto" : "", paused ? "sv-paused" : ""].filter(Boolean).join(" ");

  return (
    <div className={cls} ref={box} onFocus={onFocus}>
      <p className="sv-lede">
        {ledeLead}{" "}
        {LEDE.map(({ i, tail }, j) => (
          <span key={i}>
            {j === LEDE.length - 1 && <>{ledeAnd} </>}
            <span className="sv-nw">
              <button
                type="button"
                className={on === i ? "sv-ln sv-ln-on" : "sv-ln"}
                aria-pressed={on === i}
                onClick={() => pick(i)}
              >
                {items[i].ledeName}
              </button>
              {tail}
            </span>
            {j < LEDE.length - 1 && " "}
          </span>
        ))}
      </p>

      <div className="sv-stage">
        <Rosette />
        <svg className="sv-thread" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={thread} />
        </svg>
        <div className="sv-row" ref={row} onAnimationEnd={onRingEnd}>
          {items.map((g, i) => (
            <button
              key={g.name}
              type="button"
              className={on === i ? "sv-seal sv-on" : "sv-seal"}
              style={{ "--lift": `${g.lift}px` } as React.CSSProperties}
              aria-pressed={on === i}
              aria-label={`${g.name}, ${g.where}`}
              onClick={() => pick(i)}
              onPointerMove={tilt}
              onPointerLeave={untilt}
            >
              <span className="sv-disc">
                <SealRim k={g.k} />
                <svg className="sv-micro" viewBox="0 0 208 208" aria-hidden="true" focusable="false">
                  <defs>
                    <path id={`svmp${i}`} d="M104 104 m-76 0 a76 76 0 1 1 152 0 a76 76 0 1 1 -152 0" />
                  </defs>
                  <text>
                    <textPath href={`#svmp${i}`} textLength="474" lengthAdjust="spacing">{`${g.micro} `}</textPath>
                  </text>
                </svg>
                <Inlay item={g} />
                <span className="sv-foil" aria-hidden="true" />
                <span className="sv-sheen" aria-hidden="true" />
              </span>
              <span className="sv-name">{g.name}</span>
              <span className="sv-where">{g.where}</span>
            </button>
          ))}
        </div>
        <button type="button" className="sv-motion" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            {paused ? (
              <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" />
            ) : (
              <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
          <span>{paused ? playLabel : pauseLabel}</span>
        </button>
      </div>

      <div className="sv-recs" onPointerEnter={hold}>
        {items.map((g, i) => (
          <div key={g.name} className="sv-rec" hidden={on !== i}>
            <div className="sv-rec-l">
              <div className="sv-rec-k"><span>{g.record}</span><span>{g.role}</span></div>
              <p className="sv-rec-h">{g.h}</p>
              <p className="sv-rec-p">{g.p}</p>
              <dl className="sv-facts">
                {g.facts.map((f, j) => (
                  <div key={f.k} className="sv-fact" style={{ animationDelay: `${(0.25 + j * 0.07).toFixed(2)}s` }}>
                    <dt>{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="sv-rec-r">
              <div className="sv-emb"><Inlay item={g} small /></div>
              <ol className="sv-chain">
                {g.chain.map((c, j) => (
                  <li key={c} style={{ "--d": `${(0.35 + j * 0.32).toFixed(2)}s` } as React.CSSProperties}>
                    <i aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
              <p className="sv-cap">{g.cap}</p>
              <div className="sv-stamp-w"><Stamp id={`svst${i}`} ring={stamp} /></div>
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

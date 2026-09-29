"use client";

/** The hero's live ledger: the four figures of the Numbers band on one
    counterfoil under the buttons. Every figure rolls in on an odometer; the
    checks figure then keeps counting, one more about every 14 seconds — the
    average pace `numbers.pace.note` states — so the page reads as work in
    progress, not a poster. The other three stay put once they land: clients
    and countries do not change by the second, and a count that pretended to
    would be invented.

    THE COUNT IS DRIVEN BY THE RING, as `./NumbersPace`'s is by its bar: each
    `animationiteration` of the 14s ring adds one, so the hero's "Pause
    motion" (`hv-paused`, `./HeroStage`) stops ring and count together. The
    ring starts part-way round, so the first tick lands within seconds rather
    than a full 14 — when it falls is a phase, not the pace. Under
    `prefers-reduced-motion` the ring does not run, and a 14s interval that
    checks for `hv-paused` keeps the count honest instead.

    THE ODOMETER. Each digit is a column whose strip holds 0-9 five times
    (generated content, `hero.css`) and rests on the fourth pass, `30 + d`,
    so the entrance (a `from`-only keyframe) spins it three turns. A live
    change transitions forward; 9 -> 0 rolls on to the fifth pass, `40`, and
    snaps back to `30` without a transition once it lands. Columns are keyed
    from the right, so a new leading digit does not remount the others.

    The server renders every figure at its resting value, so without JS, and
    to a crawler, the ledger reads 20,000,000+ / 2,000+ / 120+ / 33+. The
    rolling digits are `aria-hidden`; each figure has a static `sr-only`
    twin, so a screen reader is not read a number that changes every 14s. */

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Groups `n` the way `like` is grouped ("20,000,000"): a locale that
 *  writes another separator edits the copy string, not this. */
function group(n: number, like: string) {
  const sep = like.match(/\D/)?.[0];
  const s = String(n);
  return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;
}

function Col({ d, n }: { d: number; n: number }) {
  // `at` is the digit `p` was last moved for; a new `d` moves `p` during
  // render (React's "adjusting state when a prop changes"), forward only.
  const [{ at, p }, setPos] = useState({ at: d, p: 30 + d });
  const [snap, setSnap] = useState(false);
  if (at !== d) setPos({ at: d, p: 30 + d < p ? 40 + d : 30 + d });

  useEffect(() => {
    if (!snap) return;
    // Two frames: the first paints the snapped position with no
    // transition, the second gives the transition back.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setSnap(false));
    });
    return () => cancelAnimationFrame(id);
  }, [snap]);

  const vars = { "--p": p, "--dur": `${(1.9 + n * 0.12).toFixed(2)}s`, "--del": `${(0.9 + n * 0.05).toFixed(2)}s` };
  return (
    <span className="hv-od-c">
      <span
        className={snap ? "hv-od-s hv-od-snap" : "hv-od-s"}
        style={vars as CSSProperties}
        onTransitionEnd={() => {
          if (p < 40) return;
          setSnap(true);
          setPos({ at, p: p - 10 });
        }}
      />
    </span>
  );
}

function Odometer({ value }: { value: string }) {
  let di = 0;
  return (
    <span className="hv-od" aria-hidden="true">
      {[...value].map((ch, i) => {
        const key = value.length - i;
        if (!/[0-9]/.test(ch)) return <span key={key} className="hv-od-sep">{ch}</span>;
        return <Col key={key} d={Number(ch)} n={di++} />;
      })}
    </span>
  );
}

export function HeroLedger({
  checks,
  plus,
  cells,
  live,
  checksLabel,
  pace,
}: {
  /** The checks figure as the copy prints it, "20,000,000". */
  checks: string;
  plus: string;
  cells: { k: string; v: string; l: string }[];
  live: string;
  checksLabel: string;
  pace: string;
}) {
  const [ticks, setTicks] = useState(0);
  const ringRef = useRef<SVGCircleElement>(null);
  const base = Number(checks.replace(/\D/g, ""));

  useEffect(() => {
    // Start the ring 0-9s into its 14s turn: the first tick lands in 5-14s.
    ringRef.current?.style.setProperty("animation-delay", `-${(Math.random() * 9).toFixed(1)}s`);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) return;
    const id = setInterval(() => {
      if (!ringRef.current?.closest(".hv-paused")) setTicks((t) => t + 1);
    }, 14000);
    return () => clearInterval(id);
  }, []);

  return (
    <dl className="hv-lg">
      <div className="hv-lg-cell hv-lg-live">
        <dt className="hv-lg-k">
          <span className="dot live" />
          <b>{live}</b>
          <span>{checksLabel}</span>
        </dt>
        <dd className="hv-lg-n">
          <Odometer value={group(base + ticks, checks)} />
          <i aria-hidden="true">{plus}</i>
          {/* Keyed on the count, so each tick remounts it and replays the float. */}
          {ticks > 0 && <span key={ticks} className="hv-lg-bump" aria-hidden="true">+1</span>}
          <span className="sr-only">{`${checks}${plus}`}</span>
        </dd>
        <dd className="hv-lg-pace">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <circle cx="7" cy="7" r="5.5" className="hv-lg-track" />
            <circle
              ref={ringRef}
              cx="7"
              cy="7"
              r="5.5"
              pathLength={1}
              className="hv-lg-ring"
              onAnimationIteration={() => setTicks((t) => t + 1)}
            />
          </svg>
          {pace}
        </dd>
      </div>
      {cells.map((c) => (
        <div key={c.k} className="hv-lg-cell">
          <dt className="hv-lg-k">{c.l}</dt>
          <dd className="hv-lg-n">
            <Odometer value={c.v} />
            <i aria-hidden="true">{plus}</i>
            <span className="sr-only">{`${c.v}${plus}`}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

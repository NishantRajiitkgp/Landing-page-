"use client";

/** The hero's live ledger: the four figures of the Numbers band on one
    counterfoil under the buttons. Every figure rolls in on an odometer; the
    checks figure then keeps counting, so the page reads as work in
    progress, not a poster. The other three stay put once they land: clients
    and countries do not change by the second, and a count that pretended to
    would be invented.

    THE COUNT RUNS FROM A CLOCK, not from the page load (30 Sep 2026). It
    reads `checks` (20,000,000) at `ANCHOR` and one more for every `PACE` ms
    since — the average pace `numbers.pace.note` states — so it opens on an
    unround figure (20,4xx,xxx in autumn 2026), every visitor sees the same
    one, and a reload never winds it back. After that it ticks at random
    gaps (`gap()`, exponential about the same mean), the way finished checks
    actually arrive, and catches up with the clock when a hidden tab comes
    back. The figure is illustrative of that pace; a live feed would replace
    `since()` and nothing else.

    The hero's "Pause motion" (`hv-paused`, `./HeroStage`) holds the count:
    a tick that falls while paused is skipped, not banked.

    THE ODOMETER. Each digit is a column whose strip holds 0-9 five times
    (generated content, `hero.css`) and rests on the fourth pass, `30 + d`,
    so the entrance (a `from`-only keyframe) spins it three turns. A live
    change transitions forward; 9 -> 0 rolls on to the fifth pass, `40`, and
    snaps back to `30` without a transition once it lands. Columns are keyed
    from the right, so a new leading digit does not remount the others.

    The server renders every figure at its resting value, so without JS, and
    to a crawler, the ledger reads 20,000,000+ / 2,000+ / 120+ / 33+; the
    clock's figure is read through `useSyncExternalStore`, whose client
    snapshot replaces the server's before the first paint, so the entrance
    spins straight to it. The rolling digits are `aria-hidden`;
    each figure has a static `sr-only` twin, so a screen reader is not read
    a number that keeps changing. */

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

/** When the count read exactly `checks`, and the average pace since. */
const ANCHOR = Date.UTC(2026, 6, 19, 7, 23);
const PACE = 14000;
const since = (base: number) => base + Math.max(0, Math.floor((Date.now() - ANCHOR) / PACE));
/** The wait before the next check lands: exponential about `PACE`, so
 *  bursts and lulls both happen, held between 2.5s and 40s. */
const gap = () => Math.min(40000, Math.max(2500, -Math.log(1 - Math.random()) * PACE));
/** The clock's figure when this page opened, read once: after that the
 *  random ticks carry the count, so the two never add up to twice the pace. */
let opened: number | undefined;
const openedAt = (base: number) => (opened ??= since(base));
const still = () => () => {};

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
}: {
  /** The checks figure as the copy prints it, "20,000,000". */
  checks: string;
  plus: string;
  cells: { k: string; v: string; l: string }[];
  live: string;
  checksLabel: string;
}) {
  const base = Number(checks.replace(/\D/g, ""));
  // The server's snapshot is the copy's figure, so hydration matches; the
  // client's is the clock's, swapped in before the first paint.
  const start = useSyncExternalStore(still, () => openedAt(base), () => base);
  /** `n` counts ticks, to key the "+1" float; `add` is how far past `start`. */
  const [{ n, add }, setCount] = useState({ n: 0, add: 0 });
  const v = start + add;
  const cell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!document.hidden && !cell.current?.closest(".hv-paused")) setCount((c) => ({ n: c.n + 1, add: c.add + 1 }));
      id = setTimeout(tick, gap());
    };
    // The first one lands soon, so the figure is seen to move.
    id = setTimeout(tick, 2500 + Math.random() * 3500);
    const back = () => {
      if (!document.hidden) setCount((c) => ({ n: c.n, add: Math.max(c.add, since(base) - openedAt(base)) }));
    };
    document.addEventListener("visibilitychange", back);
    return () => {
      clearTimeout(id);
      document.removeEventListener("visibilitychange", back);
    };
  }, [base]);

  return (
    <dl className="hv-lg">
      <div ref={cell} className="hv-lg-cell hv-lg-live">
        <dt className="hv-lg-k">
          <span className="dot live" />
          <b>{live}</b>
          <span>{checksLabel}</span>
        </dt>
        <dd className="hv-lg-n">
          <Odometer value={group(v, checks)} />
          <i aria-hidden="true">{plus}</i>
          {/* Keyed on the tick, so each one remounts it and replays the float. */}
          {n > 0 && <span key={n} className="hv-lg-bump" aria-hidden="true">+1</span>}
          <span className="sr-only">{`${checks}${plus}`}</span>
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

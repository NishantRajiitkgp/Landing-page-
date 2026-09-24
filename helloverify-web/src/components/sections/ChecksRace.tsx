"use client";

/** The v2 "33 checks" race (`./Checks.tsx`): a chronograph whose hand sweeps
 *  an hour and then three days while 17 tiles flip from "Checking…" to
 *  ticked as it passes their turnaround.
 *
 *  TIME IS VIRTUAL. A run lasts 9s: the first 5s is one hour, the last 4s is
 *  the remaining 71 hours — the board's own split, so an hour of green reads
 *  as most of the race and the days go by in a blur. The hand is a 9s CSS
 *  animation started by a class; the tiles follow a 120ms JS tick measured
 *  from `performance.now()`. Both run from the same start, so they agree to
 *  within a tick.
 *
 *  HYDRATION. `t` is null until a run starts, and null renders the finished
 *  state: every tile ticked, the hand at rest, "13 of 17" in the readout. The
 *  server sends exactly that, and a run starts only after mount — once, when
 *  the stage is 35% in view (never under `prefers-reduced-motion`), or from
 *  the button. The readout is not a live region: it changes eight times a
 *  second, and the finished state it settles on is already the page's
 *  static text. */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { Tick } from "@/components/brand/Tick";
import { ChecksDial } from "./ChecksDial";

export type RaceTile = { name: ReactNode; group: string; time: string; min: number };

export type RaceCopy = {
  checking: string;
  elapsed: string;
  zone: string;
  min: string;
  hour: string;
  hours: string;
  day: string;
  days: string;
  ofTotal: string;
  done: string;
  keyFast: string;
  keySlow: string;
  run: string;
  restart: string;
  again: string;
  dialMin: string;
  dialDays: string;
};

const RUN_MS = 9000;
const HOUR_MS = 5000;
const END_MIN = 3 * 24 * 60;

/** Virtual minutes at `t` ms into a run. */
const virtual = (t: number) =>
  t <= HOUR_MS ? (t / HOUR_MS) * 60 : 60 + ((t - HOUR_MS) / (RUN_MS - HOUR_MS)) * (END_MIN - 60);

const fill = (tpl: string, n: number, total?: number) =>
  tpl.replace("{n}", String(n)).replace("{total}", String(total ?? ""));

export function ChecksRace({ tiles, t, more }: { tiles: RaceTile[]; t: RaceCopy; more: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const [ms, setMs] = useState<number | null>(null);
  const [runs, setRuns] = useState(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    const t0 = performance.now();
    setMs(0);
    setRuns((r) => r + 1);
    tick.current = setInterval(() => {
      const el = performance.now() - t0;
      if (el >= RUN_MS) {
        if (tick.current) clearInterval(tick.current);
        tick.current = null;
        setMs(null);
      } else setMs(el);
    }, 120);
  }, []);

  useEffect(() => {
    const el = stage.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | undefined;
    if (el && !reduce && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            io?.disconnect();
            start();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      if (tick.current) clearInterval(tick.current);
    };
  }, [start]);

  const running = ms !== null;
  const vm = running ? virtual(ms) : END_MIN;
  const passed = (m: number) => vm >= m - 0.01;
  const done = tiles.filter((x) => passed(x.min)).length;
  const fast = tiles.filter((x) => x.min <= 60).length;
  const hand = running ? (runs % 2 ? "cz-hA" : "cz-hB") : "";
  const arc = running ? (runs % 2 ? "cz-arcA" : "cz-arcB") : "";

  let phase = t.zone;
  let value = fill(t.ofTotal, fast, tiles.length);
  if (running) {
    phase = t.elapsed;
    if (vm < 60) value = fill(t.min, Math.max(0, Math.round(vm)));
    else if (vm < 1440) {
      const h = Math.round(vm / 60);
      value = fill(h === 1 ? t.hour : t.hours, h);
    } else {
      const d = Math.floor(vm / 1440);
      value = fill(d === 1 ? t.day : t.days, d);
    }
  }

  return (
    <div ref={stage} className={running ? "cz-stage cz-on" : "cz-stage"}>
      <div className="cz-left">
        <div className="cz-watch">
          <ChecksDial
            hand={hand}
            arc={arc}
            unitMin={t.dialMin}
            unitDays={t.dialDays}
            marks={{ m15: passed(15), m30: passed(30), m60: passed(60), d2: vm >= 2880, d3: passed(END_MIN) }}
          />
        </div>
        <div className="cz-read">
          <span className="cz-read-k">{phase}</span>
          <span className="cz-read-v">{value}</span>
          <span className="cz-read-c"><b>{done}</b> {fill(t.done, done, tiles.length)}</span>
        </div>
        <div className="cz-keys">
          <span><i className="cz-key-g" />{t.keyFast}</span>
          <span><i className="cz-key-i" />{t.keySlow}</span>
        </div>
        <button type="button" className="cz-run" onClick={start}>
          <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4.5 3.2v9.6L12.6 8z" fill="currentColor" />
          </svg>
          {running ? t.restart : runs ? t.again : t.run}
        </button>
      </div>
      <ul className="cz-grid">
        {tiles.map((x, i) => {
          const ok = passed(x.min);
          // A tile "lands" (a small bounce) for the first few virtual minutes
          // after the hand passes it — hours, for the slow ones, because the
          // days go by 18x faster.
          const land = running && ok && vm - x.min < (x.min > 60 ? 400 : 6);
          const cls = ["cz-tile", x.min > 60 ? "cz-slow" : "cz-fast", ok ? (land ? "cz-land" : "") : "cz-pend"];
          return (
            <li key={i} className={cls.filter(Boolean).join(" ")}>
              <span className="cz-g">{x.group}</span>
              <b className="cz-n">{x.name}</b>
              <span className="cz-st">
                <span className="cz-ic"><Tick /></span>
                <span className="cz-wait">{t.checking}<i /><i /><i /></span>
                <span className="cz-time">{x.time}</span>
              </span>
              <span className="cz-scan" />
            </li>
          );
        })}
        <li className="cz-tile cz-more">{more}</li>
      </ul>
    </div>
  );
}

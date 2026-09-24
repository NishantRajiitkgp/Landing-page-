"use client";

/** Follow the sun: the interactive half of the v2 Presence band.

    A canvas world map with the real day/night terminator, a card per office
    with its local time and whether anyone is at a desk, the hand-off arc
    between the office that just closed and the one that just opened, and a
    24-column strip of who covers each UTC hour. Drag the sun (or pick an
    hour) to scrub time; "Play 24 hours" runs a 14-second day, once on its
    own the first time the map is seen; "Back to now" returns to live. The
    clock and the loop are `./sunLoop`, the drawing `./sunPaint`.

    HYDRATION. Nothing on the server knows the reader's clock or zone, so the
    first render (server and hydration alike) has `now === null`: times read
    `clock` ("--:--"), the open count, statuses and hand-off sentence are held
    invisible (`su-wait`), and the hour strip is drawn from standard-time
    offsets. The real values arrive in the mount effect.

    MOTION (WCAG 2.2.2). The rays, the marching arc, the travelling document
    and the breathing lamps move for as long as the map is visible, so the
    band carries the hero's "Pause motion" control. It freezes them and stops
    a running time-lapse; `prefers-reduced-motion` does the same from the
    start and skips the auto-play.

    KEYBOARD. Dragging has a single-pointer, keyboard-reachable equivalent
    (WCAG 2.5.7): each hour of the strip is a button that sets the map to it. */

import { useEffect, useRef, useState, type PointerEvent } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";
import { OFFICES, MAP_W, MAP_H, STD_OFFSETS, coverage, hhmm, nextOpen, offsetsAt, worldAt } from "@/lib/sunMap";
import { SunLoop } from "./sunLoop";

type Copy = SectionsCopy["presence"];
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
/** Fills `{name}` slots: the copy's templates cannot be functions, because a
 *  function cannot cross from the server parent to this island. */
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(v[k] ?? ""));
const pad = (h: number) => String(h).padStart(2, "0");

function Flag({ k }: { k: string }) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <use href={`#su-fl-${k}`} />
    </svg>
  );
}

function PauseGlyph({ paused, size }: { paused: boolean; size: number }) {
  // Two bars while running, a triangle while paused. The board drew the
  // triangle on its "Pause" button too.
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      {paused ? <path d="M2.5 1.5v7l6-3.5z" fill="currentColor" /> : <path d="M2.5 1.5v7M7.5 1.5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
    </svg>
  );
}

export function SunStage({
  sun,
  cities,
  hours,
  motion,
}: {
  sun: Copy["sun"];
  cities: Copy["offices"];
  hours: Copy["hours"];
  motion: { pause: string; play: string };
}) {
  const [now, setNow] = useState<number | null>(null);
  const [scrub, setScrub] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [still, setStill] = useState(false);
  const [reduce, setReduce] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const loop = useRef<SunLoop | null>(null);
  const { noon, midnight } = sun;

  useEffect(() => {
    const stage = stageRef.current;
    const map = mapRef.current;
    const cv = cvRef.current;
    if (!stage || !map || !cv) return;
    const l = new SunLoop(cv, stage, { noon, midnight }, { scrub: setScrub, playing: setPlaying, now: setNow, reduce: setReduce });
    loop.current = l;
    const detach = l.attach(stage, map);
    return () => {
      detach();
      loop.current = null;
    };
  }, [noon, midnight]);

  // Every rendered change repaints the map once; the loop decides whether
  // to keep going.
  useEffect(() => {
    loop.current?.kick();
  }, [now, scrub, playing, still]);

  const onPointer = (kind: "down" | "move" | "up", e: PointerEvent<HTMLDivElement>) => {
    const l = loop.current;
    if (!l) return;
    if (kind === "down") e.currentTarget.setPointerCapture(e.pointerId);
    if (kind === "up" && e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    l.pointer(kind, e.clientX);
  };

  const mounted = now !== null;
  const shownT = scrub ?? now ?? 0;
  const off = mounted ? offsetsAt(shownT) : STD_OFFSETS;
  const w = mounted ? worldAt(shownT, off) : null;
  const cov = coverage(off);
  const d = new Date(shownT);
  const hourNow = mounted ? d.getUTCHours() : -1;
  const isLive = scrub === null;
  const wait = mounted ? "" : " su-wait";
  const hourKeys = Object.keys(hours) as (keyof Copy["hours"])[];

  let relay = "";
  if (w?.from && w.to) {
    relay = fill(sun.relay, { from: sun.countriesIn[w.from.o.k], fromTime: hhmm(w.from.m), to: sun.countriesIn[w.to.o.k], toTime: hhmm(w.to.m) });
  } else if (w && !w.open.length) {
    const nx = nextOpen(w);
    relay = fill(sun.allClosed, { office: sun.countries[nx.row.o.k], h: Math.floor(nx.wait / 60), m: nx.wait % 60 });
  } else if (w) {
    relay = sun.allOpen;
  }

  return (
    <div className={still || reduce ? "su su-still" : "su"}>
      <div className="su-top">
        <div className="su-clock">
          <span className="su-big">{mounted ? hhmm(d.getHours() * 60 + d.getMinutes()) : sun.clock}</span>
          <span className={`su-sub${wait}`}>
            {/* `getDay()` is the reader's zone, so it waits for mount too. */}
            <b>{fill(sun.yourTime, { day: mounted ? sun.days[DAYS[d.getDay()]] : "" })}</b>
            <span>{fill(sun.utc, { time: mounted ? hhmm(d.getUTCHours() * 60 + d.getUTCMinutes()) : sun.clock })}</span>
          </span>
        </div>
        <div className={`su-open${wait}`}>
          <span className="su-open-d" />
          {fill(isLive ? sun.openNow : sun.open, { n: w?.open.length ?? 0 })}
        </div>
        <div className="su-ctl">
          <span className="su-hint">{sun.hint}</span>
          {!isLive && (
            <button type="button" className="su-btn" onClick={() => loop.current?.back()}>
              {sun.back}
            </button>
          )}
          <button
            type="button"
            className={playing ? "su-btn su-play su-playing" : "su-btn su-play"}
            onClick={() => loop.current?.play(!playing)}
            disabled={!mounted}
          >
            <PauseGlyph paused={!playing} size={14} />
            {playing ? sun.pause : sun.play}
          </button>
        </div>
      </div>
      <div
        ref={stageRef}
        className="su-stage"
        onPointerDown={(e) => onPointer("down", e)}
        onPointerMove={(e) => onPointer("move", e)}
        onPointerUp={(e) => onPointer("up", e)}
        onPointerCancel={(e) => onPointer("up", e)}
      >
        <div ref={mapRef} className="su-map">
          <canvas ref={cvRef} className="su-cv" width={MAP_W} height={MAP_H} role="img" aria-label={sun.map} />
          {OFFICES.map((o) => {
            const r = w?.rows.find((x) => x.o.k === o.k);
            return (
              <div key={o.k} className={r?.on ? "su-card su-on" : "su-card"} style={{ insetInlineStart: o.cl, top: o.ct }}>
                <span className="fl su-fl"><Flag k={o.k} /></span>
                <div className="su-cx">
                  <b>{sun.countries[o.k]}</b>
                  <span className="su-meta">{cities[o.k]} · <em>{r ? hhmm(r.m) : sun.clock}</em></span>
                  <span className={`su-st${wait}`}><i />{r?.on ? sun.atDesk : sun.closed}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="su-relay">
        <span className="su-doc" aria-hidden="true" />
        {/* Quiet while the time-lapse rewrites it several times a second. */}
        <span aria-live={playing ? "off" : "polite"}>{relay}</span>
        <button
          type="button"
          className="su-motion"
          aria-pressed={still}
          onClick={() => {
            loop.current?.setStill(!still);
            setStill(!still);
          }}
        >
          <PauseGlyph paused={still} size={10} />
          <span>{still ? motion.play : motion.pause}</span>
        </button>
      </div>
      <div className="su-cov">
        <div className="su-cov-h">
          <span className="su-cov-k">{fill(sun.coverage, { n: cov.hours })}</span>
          <span className="su-cov-l">{hourKeys.map((h) => <span key={h}>{hours[h]}</span>)}</span>
        </div>
        <div className="su-cols">
          {cov.on.map((row, h) => (
            <button
              key={h}
              type="button"
              className={h === hourNow ? "su-col su-h-on" : "su-col"}
              aria-label={fill(sun.hour, { h: pad(h) })}
              aria-current={h === hourNow ? "time" : undefined}
              onClick={() => loop.current?.pickHour(h)}
            >
              <span className="su-stack">
                {OFFICES.map((o, i) => (row[i] ? <span key={o.k} className="su-cf"><Flag k={o.k} /></span> : null))}
              </span>
              <span className="su-hr">{pad(h)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

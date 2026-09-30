"use client";

/** The relay: the interactive half of the v2 Presence band.

    The visitor picks where their candidate's papers are (`Chips`) and
    watches that one request travel — and the document is the real thing:
    the specimen scan, with the holder's name on it, flies from the hirer to
    our desk and on to the office that issued it, grows there while a scan
    line reads it, takes the green "verified at the source" stamp, and flies
    back. A camera follows it — close on the hirer, each flight whole, close
    on the source — while five plain captions tell it and a clock counts the
    hours since upload. The map's day and night, and the six desks' clocks
    and open signs, run on the journey's time: the world turns while the
    request travels. The timeline scrubs it; today's counts sit above.

    The loop is `./relayLoop`, the drawing `./relayPaint`, the controls
    `./RelayParts`, the data and the camera `lib/relayData`. Pins, tags and
    the document are HTML over the canvas, placed through the camera's CSS
    variables (`presence.css`).

    HYDRATION. The server does not know the time: counters and clocks render
    `pending`/`clock`, the map shows the first journey complete.

    MOTION (WCAG 2.2.2). Nothing moves while paused, and the play button is
    always there; reduced motion never plays on its own and holds the camera
    on the whole network. */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";
import { JOURNEYS, JOURNEY_ORDER, at, duration, today, type Pt } from "@/lib/relayData";
import { OFFICES, offsetsAt, worldAt, type World } from "@/lib/sunMap";
import { Seal } from "./HowWeKnowDocs";
import { RelayLoop } from "./relayLoop";
import { Chips, Desks, Flag, Timeline } from "./RelayParts";

type P = SectionsCopy["presence"];
const STATS = ["checks", "borders", "forged", "countries"] as const;
const SAY = ["filed", "desk", "reached", "confirmed", "verified"] as const;
/** Which side of its flag pin each desk's name sits, clear of the journeys. */
const PIN: Record<string, "r" | "l" | "t" | "b"> = { newYork: "r", cairo: "l", dubai: "r", noida: "t", singapore: "b", manila: "r" };
const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k: string) => v[k] ?? "");
/** A map point, for the camera maths in `presence.css`. */
const onMap = (p: Pt) => ({ "--rl-mx": p.x.toFixed(1), "--rl-my": p.y.toFixed(1) }) as CSSProperties;

export function RelayStage({ r, cities }: { r: P["relay"]; cities: P["offices"] }) {
  const [now, setNow] = useState<number | null>(null);
  const [j, setJ] = useState(0);
  const [step, setStep] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [world, setWorld] = useState<World | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loop = useRef<RelayLoop | null>(null);
  const units = r.units;

  useEffect(() => {
    const stage = stageRef.current;
    const map = mapRef.current;
    const cv = cvRef.current;
    if (!stage || !map || !cv) return;
    const l = new RelayLoop(cv, map, {
      journey: setJ,
      step: setStep,
      playing: setPlaying,
      desks: (t) => setWorld(worldAt(t, offsetsAt(t))),
      now: setNow,
      // Progress goes to the DOM directly: sixty renders a second otherwise.
      frame: (p, mins) => {
        stage.parentElement?.style.setProperty("--rl-p", String(p));
        if (clockRef.current) clockRef.current.textContent = duration(mins, units);
        const tr = trackRef.current;
        if (tr) {
          tr.setAttribute("aria-valuenow", String(Math.round(p * 100)));
          tr.setAttribute("aria-valuetext", duration(mins, units));
        }
      },
    });
    loop.current = l;
    const detach = l.attach(stage);
    return () => {
      detach();
      loop.current = null;
    };
  }, [units]);

  const id = JOURNEY_ORDER[j];
  const J = JOURNEYS[id];
  const jr = r.journeys[id];
  const vars = { who: jr.who, doc: jr.doc, source: jr.source, from: jr.from, client: jr.client, to: jr.to, desk: cities[J.desk] };
  const counts = now === null ? null : today(now);
  const fmt = new Intl.NumberFormat("en");
  const open = (k: string) => !!world?.rows.find((x) => x.o.k === k)?.on;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    const d = k === "ArrowRight" || k === "ArrowUp" ? 0.02 : k === "ArrowLeft" || k === "ArrowDown" ? -0.02 : 0;
    if (!d && k !== "Home" && k !== "End") return;
    e.preventDefault();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl" && (k === "ArrowRight" || k === "ArrowLeft");
    if (d) loop.current?.nudge(rtl ? -d : d);
    else loop.current?.scrub(k === "Home" ? 0 : 1);
  };

  return (
    <div className={playing ? "rl" : "rl rl-still"}>
      <div className="rl-stats">
        <p className="rl-live">
          <i className="rl-live-d" />
          {r.live}
        </p>
        <dl>
          {STATS.map((k) => (
            <div key={k} className="rl-stat">
              <dt>{r.stats[k]}</dt>
              <dd key={counts ? counts[k] : "p"}>{counts ? fmt.format(counts[k]) : r.pending}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Chips r={r} j={j} onPick={(i) => loop.current?.pick(i)} />

      <div ref={stageRef} className="rl-stage">
        <div ref={mapRef} className="rl-map">
          <canvas ref={cvRef} className="rl-cv" role="img" aria-label={r.map} />
          {OFFICES.map((o) => (
            <span
              key={o.k}
              className={`rl-on rl-pin rl-pin-${PIN[o.k]}${open(o.k) ? " is-open" : ""}${o.k === J.desk && step >= 1 && step < 4 ? " is-busy" : ""}`}
              style={onMap(o)}
              aria-hidden="true"
            >
              <Flag id={o.k} />
              <em>{cities[o.k]}</em>
            </span>
          ))}
          <span className={`rl-on rl-tag rl-tag-src rl-tag-${J.tag[0]}${step >= 2 ? " is-on" : ""}${step >= 3 ? " is-ok" : ""}`} style={onMap(at(J.src))} aria-hidden="true" key={`s-${id}`}>
            <i>{r.tags.source}</i>
            <b>{jr.source}</b>
            <span>
              {jr.from}, {r.countries[id]}
            </span>
          </span>
          <span className={`rl-on rl-tag rl-tag-dst rl-tag-${J.tag[1]}${step >= 4 ? " is-on is-ok" : ""}`} style={onMap(at(J.dst))} aria-hidden="true" key={`d-${id}`}>
            <i>{step >= 4 ? r.tags.verified : r.tags.hirer}</i>
            <b>{jr.client}</b>
            <span>{jr.to}</span>
          </span>
          {/* The document itself: the specimen, riding the flights. */}
          <span className={`rl-doc${step === 2 ? " is-check" : ""}${step >= 3 ? " is-stamped" : ""}`} style={{ "--ar": `${J.doc.w} / ${J.doc.h}` } as CSSProperties} aria-hidden="true" key={`doc-${id}`}>
            <span className="rl-doc-page">
              <Image src={`/img/docs/${J.doc.f}`} alt="" fill sizes="180px" />
              <i className="rl-doc-scan" />
            </span>
            <span className="rl-doc-seal">
              <Seal id="rl-seal" ring={r.seal} />
            </span>
          </span>
        </div>
        <div className="rl-say">
          <span className="rl-say-n" aria-hidden="true">
            {step + 1}
            <small>/5</small>
          </span>
          {/* Polite, and only five times a journey: a step, not a frame. */}
          <p aria-live="polite" key={`${id}-${step}`}>
            {fill(r.say[SAY[step]], vars)}
          </p>
          <span className="rl-clock">
            <b ref={clockRef}>{duration(J.mins[4], units)}</b>
            <span>{r.since}</span>
          </span>
        </div>
      </div>

      <Timeline
        ref={trackRef}
        r={r}
        step={step}
        playing={playing}
        label={fill(r.scrub, { doc: jr.doc, country: r.countries[id] })}
        onToggle={() => loop.current?.toggle()}
        onScrub={(p) => loop.current?.scrub(p)}
        onKey={onKey}
      />

      <Desks r={r} world={world} cities={cities} working={step >= 1 && step < 4 ? J.desk : ""} />

      <p className="rl-fn">{r.fn}</p>
    </div>
  );
}

/** The relay's controls and its desk cards (`./RelayStage`), split out to
    keep the stage under the 300-line cap; imported by that client island.

    - `Chips`: "Your candidate's papers are in" — one flag per country the
      journeys start from. Toggle buttons, one pressed.
    - `Timeline`: the journey's five steps on a track with a play button.
      The track is a slider (arrow keys, Home, End; drag or click); its
      thumb, fill and value are written by the loop, not rendered.
    - `Desks`: the six desks as cards — flag, country, city, local time on
      the JOURNEY's clock, and whether someone is at a desk — the one
      working the request marked. */
import Image from "next/image";
import { forwardRef, type KeyboardEvent, type PointerEvent } from "react";

import type { SectionsCopy } from "@/lib/copy/sections";
import { JOURNEY_ORDER, STEP_AT } from "@/lib/relayData";
import type { World } from "@/lib/sunMap";

type R = SectionsCopy["presence"]["relay"];
const STEPS = ["filed", "desk", "reached", "confirmed", "verified"] as const;

/** A desk's or a journey's country, as its flag-icons code. */
const CODE: Record<string, string> = { manila: "ph", singapore: "sg", noida: "in", dubai: "ae", cairo: "eg", newYork: "us" };

/** A country's own flag, whole — never cropped to a circle — from the
 *  flag-icons set (`public/flags`, MIT, `LICENSE.txt` beside them). The
 *  country's name is always next to it, so the image is decorative. */
export function Flag({ id }: { id: string }) {
  return <Image className="rl-flag" src={`/flags/${CODE[id] ?? id}.svg`} alt="" width={24} height={18} unoptimized />;
}

export function Chips({ r, j, onPick }: { r: R; j: number; onPick(i: number): void }) {
  return (
    <div className="rl-pick">
      <span className="rl-pick-k" id="rl-pick-k">
        {r.pick}
      </span>
      <div className="rl-chips" role="group" aria-labelledby="rl-pick-k">
        {JOURNEY_ORDER.map((k, i) => (
          <button key={k} type="button" className={i === j ? "rl-chip is-on" : "rl-chip"} aria-pressed={i === j} onClick={() => onPick(i)}>
            <Flag id={k} />
            {r.countries[k]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Glyph({ playing, done }: { playing: boolean; done: boolean }) {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
      {playing ? (
        <path d="M3 2v8M9 2v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : done ? (
        <path d="M9.6 4.2A4.2 4.2 0 1 0 10.2 7M9.8 1.6v2.8H7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
      )}
    </svg>
  );
}

type TimelineProps = {
  r: R;
  step: number;
  playing: boolean;
  label: string;
  onToggle(): void;
  onScrub(p: number): void;
  onKey(e: KeyboardEvent<HTMLDivElement>): void;
};

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(function Timeline({ r, step, playing, label, onToggle, onScrub, onKey }, ref) {
  const done = step === 4 && !playing;
  const at = (e: PointerEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / (b.width || 1);
    // The track is drawn in the reading direction: in Arabic, 0 is at the right.
    onScrub(getComputedStyle(e.currentTarget).direction === "rtl" ? 1 - x : x);
  };
  return (
    <div className="rl-tl">
      <button type="button" className={playing ? "rl-play is-on" : "rl-play"} onClick={onToggle}>
        <Glyph playing={playing} done={done} />
        {playing ? r.pause : done ? r.replay : r.play}
      </button>
      <div
        ref={ref}
        className="rl-track"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        // The server renders the finished journey; the loop keeps it current.
        aria-valuenow={100}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          at(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) at(e);
        }}
      >
        <i className="rl-rail" aria-hidden="true">
          <i className="rl-fill" />
        </i>
        {STEPS.map((s, i) => (
          <span key={s} className={i <= step ? "rl-mk is-done" : "rl-mk"} style={{ insetInlineStart: `${STEP_AT[i] * 100}%` }} aria-hidden="true">
            <i />
            <em>{r.steps[s]}</em>
          </span>
        ))}
        <i className="rl-thumb" aria-hidden="true" />
      </div>
    </div>
  );
});

export function Desks({ r, world, cities, working }: { r: R; world: World | null; cities: SectionsCopy["presence"]["offices"]; working: string }) {
  const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m) % 60).padStart(2, "0")}`;
  return (
    <div className="rl-desks">
      <p className="rl-desks-k">{r.desks.k}</p>
      <ul>
        {(Object.keys(r.desks.country) as (keyof R["desks"]["country"])[]).map((k) => {
          const row = world?.rows.find((x) => x.o.k === k);
          const on = !!row?.on;
          const busy = k === working;
          return (
            <li key={k} className={`rl-desk${on ? " is-open" : ""}${busy ? " is-busy" : ""}`}>
              <Flag id={k} />
              <span className="rl-desk-t">
                <b>{r.desks.country[k]}</b>
                <span>
                  {cities[k]} · <em>{row ? hhmm(row.m) : r.clock}</em>
                </span>
                <span className="rl-desk-st">
                  <i />
                  {busy && on ? r.desks.working : on ? r.desks.open : r.desks.closed}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

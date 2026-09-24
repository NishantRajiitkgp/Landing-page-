import { Fragment } from "react";
import Image from "next/image";

import { SIZES_PERSON, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type PersonSrc } from "@/lib/copy/sections";
// Homepage v2 styles: one sheet per section, imported by the section itself
// (see the header of `app/v2/hero.css`). The behaviour is the island.
import "@/app/v2/strip.css";
import { PeopleStripStage } from "./PeopleStripStage";

/** Drifting strip of verified people; the track is duplicated so the loop is
 *  seamless.
 *
 *  Homepage v2: the cards, in colour, on a curved path you can drag and
 *  fling, under an "At the source" label — `./PeopleStripStage` and
 *  `app/v2/strip.css`.
 *
 *  ONE TRACK AT EVERY WIDTH (phone pass, Sep 2026). There used to be a
 *  second, six-card mobile track with its own copy table ("Licence · 30 min"
 *  where desktop says "Driving licence · 30 min"). The phone now shows the
 *  same eight people and the same words; the cards are scaled by `--ps` in
 *  `strip.css` (1 on desktop, .66 on the phone — 300×420 → 198×277, the old
 *  mobile card's size). The longest chip still fits the narrowest card:
 *  "Global database · 15 min" at the phone's 10px mono measures ~175px of
 *  a 205px card.
 *
 *  The seam is `[...PEOPLE, ...PEOPLE]`: one component over one record list,
 *  where there were once 28 hand-written cards.
 */

/** The words on a card, keyed by photograph in `lib/copy/sections`. */
type Words = {
  readonly role: string;
  readonly city: string;
  readonly chip: string;
  /** The small caption over the photograph; `design.css` hides it once the
   *  photograph is there (`.ph:has(.pimg) .note`). */
  readonly note?: string;
};

type Person = {
  readonly src: PersonSrc;
  /** The desktop box in px; `strip.css` scales it per breakpoint. */
  readonly w: number;
  readonly h: number;
  /** The one card mid-check: a pulsing dot and the progress bar. */
  readonly live?: boolean;
};

const PEOPLE: readonly Person[] = [
  { src: "/img/01-rider-bengaluru.jpg", w: 300, h: 420 },
  { src: "/img/02-nurse-abudhabi.jpg", w: 340, h: 470 },
  { src: "/img/03-engineer-manila.jpg", w: 290, h: 390 },
  { src: "/img/04-nanny-gurugram.jpg", w: 320, h: 440 },
  { src: "/img/05-warehouse-pune.jpg", w: 300, h: 400, live: true },
  { src: "/img/06-supplier-cairo.jpg", w: 330, h: 460 },
  { src: "/img/07-tenant-singapore.jpg", w: 290, h: 410 },
  { src: "/img/08-cfo-london.jpg", w: 310, h: 430 },
];

function PersonCard({ p, w, loading }: { p: Person; w: Words; loading: "eager" | "lazy" }) {
  /** The caption inverts because `/img/05-warehouse-pune.jpg`'s tint is dark
   *  (`#6E6C63`, relative luminance 0.1494), not because that card is the
   *  live one — keyed by photograph beside the tint in `lib/img.ts`, so a
   *  reshuffle of which card is live cannot leave a white caption on a pale
   *  tile. The ternary keeps its `undefined` branch rather than becoming a
   *  spread: both render the same HTML, but they differ in the flight
   *  payload (see the note in `sections/Packages.tsx`). */
  const noteColour = noteInk(p.src);
  return (
    <div
      className="person ph"
      // The box as unitless custom properties, so one card serves both
      // breakpoints: `strip.css` multiplies them by `--ps`.
      style={{ "--pw": p.w, "--ph": p.h, background: tint(p.src) } as React.CSSProperties}
    >
      <div className="light"></div>
      <Image className="pimg" src={p.src} alt="" fill sizes={SIZES_PERSON} loading={loading} />
      {w.note !== undefined && (
        <div className="note" style={noteColour !== undefined ? { color: noteColour } : undefined}>
          {w.note}
        </div>
      )}
      <div className="scrim"></div>
      <div className="chip">
        <span className={p.live ? "dot live" : "dot"}></span>
        {w.chip}
      </div>
      <div className="who">
        <div className="role">{w.role}</div>
        <div className="city">{w.city}</div>
        {p.live && (
          <div className="progress">
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
}

/** The track, doubled. Each card is preceded by a space and the run ends with
 *  one, exactly as the hand-written markup did - those are real text nodes
 *  between inline-block cards, not formatting.
 *
 *  THE SECOND COPY LOADS LAZILY. It exists only so the loop wraps
 *  seamlessly, so it is off-screen at load by construction - and Lighthouse's
 *  first genuine mobile run named one of its cards as the homepage's LCP
 *  element, at `left -621, right -401`, with LCP 5,042 ms against a 2,000 ms
 *  budget. The largest contentful paint was an image nobody could see.
 *
 *  The visible half stays eager on purpose: the strip animates from first
 *  paint, and a lazy first card pops in under the reader's eye. */
function Track({ words }: { words: Readonly<Record<PersonSrc, Words>> }) {
  return (
    <div className="track">
      {[...PEOPLE, ...PEOPLE].map((p, i) => (
        <Fragment key={i}>
          {" "}
          <PersonCard p={p} w={words[p.src]} loading={i < PEOPLE.length ? "eager" : "lazy"} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

export async function PeopleStrip() {
  const t = (await copy(SECTIONS)).peopleStrip;

  return (
    <>
      {/* The canvas also had a greyscale track with a colour copy clipped
          under a scanning "checkpoint"; the owner dropped it as gimmicky
          (24 Sep 2026), which also removed that second, `aria-hidden` copy
          of every card. */}
      <PeopleStripStage checkpoint={t.checkpoint}>
        {" "}
        <Track words={t.people} />{" "}
      </PeopleStripStage>{" "}
      <div className="wrap hv-strip-cap">
        <span>{t.strip}</span>
        <span className="mono">{t.times}</span>
      </div>
    </>
  );
}

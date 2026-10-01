import { Fragment } from "react";
import Image from "next/image";

import { AppLink } from "@/components/chrome/AppLink";
import { SIZES_PERSON, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type PersonSrc } from "@/lib/copy/sections";
// Homepage v2 styles: one sheet per section, imported by the section itself
// (see the header of `app/v2/hero.css`). The behaviour is the island.
import "@/app/v2/strip.css";
import { PeopleStripStage } from "./PeopleStripStage";

/** Individual Checks: a drifting strip of six single checks, one per card,
 *  each with its turnaround, what it verifies, its price and a Buy button
 *  (30 Sep 2026 — the strip used to show people and places but not what
 *  was being sold). The track is duplicated so the loop is seamless.
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
 *  "Driving licence verified" (24 characters, as long as the old "Global
 *  database · 15 min") at the phone's 10px mono.
 *
 *  The seam is `[...PEOPLE, ...PEOPLE]`: one component over one record list,
 *  where there were once 28 hand-written cards.
 */

/** The words on a card, keyed by photograph in `lib/copy/sections`: the
 *  check's name (`role`), what it verifies (`city`), its turnaround
 *  (`chip`) and its price. */
type Words = {
  readonly role: string;
  readonly city: string;
  readonly chip: string;
  readonly price: string;
  /** The small caption over the photograph; `design.css` hides it once the
   *  photograph is there (`.ph:has(.pimg) .note`). */
  readonly note?: string;
};
type Chrome = { per: string; buy: string };

/** Single checks are bought where the site sells à-la-carte checks. */
const BUY_HREF = "/business/smb";

type Person = {
  readonly src: PersonSrc;
  /** The desktop box in px; `strip.css` scales it per breakpoint. */
  readonly w: number;
  readonly h: number;
  /** The one card mid-check: a pulsing dot and the progress bar. */
  readonly live?: boolean;
};

/** Six checks, the old home page's order: identity-type checks between the
 *  longer ones so neighbouring cards differ. Heights vary so the drum keeps
 *  its rhythm; every card is tall enough for the name, line and price row. */
const PEOPLE: readonly Person[] = [
  { src: "/img/v2/ic-age.jpg", w: 310, h: 450 },
  { src: "/img/v2/ic-licence.jpg", w: 300, h: 430 },
  { src: "/img/v2/ic-employment.jpg", w: 320, h: 460 },
  { src: "/img/v2/ic-pan.jpg", w: 300, h: 430, live: true },
  { src: "/img/v2/ic-criminal.jpg", w: 320, h: 460 },
  { src: "/img/v2/ic-address.jpg", w: 310, h: 440 },
];

function PersonCard({ p, w, c, loading }: { p: Person; w: Words; c: Chrome; loading: "eager" | "lazy" }) {
  /** The caption inverts because the photograph's tint is dark (all six
   *  check photographs of 1 Oct 2026, <= 0.1390 relative luminance), not
   *  because a card is the live one — keyed by photograph beside the tint in
   *  `lib/img.ts`, so a reshuffle of which card is live cannot leave a white
   *  caption on a pale tile. The ternary keeps its `undefined` branch rather than becoming a
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
        <svg className="ic-bolt" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M7 1 2.5 7H6l-1 4L9.5 5H6z" fill="currentColor" />
        </svg>
        {w.chip}
      </div>
      <div className="who">
        <h3 className="role">{w.role}</h3>
        <p className="city">{w.city}</p>
        {p.live && (
          <div className="progress">
            <span></span>
          </div>
        )}
        <div className="ic-buy">
          <span className="ic-price">
            <b>{w.price}</b>
            <i>{c.per}</i>
          </span>
          <AppLink href={BUY_HREF} className="ic-btn" aria-label={`${c.buy}: ${w.role}, ${w.price}`}>
            {c.buy}
          </AppLink>
        </div>
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
function Track({ words, c }: { words: Readonly<Record<PersonSrc, Words>>; c: Chrome }) {
  return (
    <div className="track">
      {[...PEOPLE, ...PEOPLE].map((p, i) => (
        <Fragment key={i}>
          {" "}
          {/* The second copy exists only for the seamless loop: hidden from
              assistive tech so each check is announced once, and its Buy
              links are out of the tab order. */}
          {i < PEOPLE.length ? (
            <PersonCard p={p} w={words[p.src]} c={c} loading="eager" />
          ) : (
            <div className="ic-dupe" aria-hidden="true" inert>
              <PersonCard p={p} w={words[p.src]} c={c} loading="lazy" />
            </div>
          )}
        </Fragment>
      ))}{" "}
    </div>
  );
}

export async function PeopleStrip() {
  const t = (await copy(SECTIONS)).peopleStrip;
  const c: Chrome = { per: t.per, buy: t.buy };

  return (
    <section className="ic" aria-labelledby="ic-h">
      <div className="wrap sec-head ic-head">
        <h2 className="h2" id="ic-h">
          {t.headingA}
          <br />
          <em className="ic-it">{t.headingEm}</em>
        </h2>
        <p className="lede">{t.lede}</p>
      </div>
      {/* The canvas also had a greyscale track with a colour copy clipped
          under a scanning "checkpoint"; the owner dropped it as gimmicky
          (24 Sep 2026), which also removed that second, `aria-hidden` copy
          of every card. */}
      <PeopleStripStage checkpoint={t.checkpoint}>
        {" "}
        <Track words={t.people} c={c} />{" "}
      </PeopleStripStage>{" "}
      <div className="wrap hv-strip-cap">
        <span>{t.strip}</span>
        <span className="mono">{t.times}</span>
      </div>
    </section>
  );
}

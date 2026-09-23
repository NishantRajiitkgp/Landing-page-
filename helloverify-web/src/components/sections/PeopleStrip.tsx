import { Fragment } from "react";
import Image from "next/image";

import { SIZES_PERSON, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type PersonSrcDsk, type PersonSrcMob } from "@/lib/copy/sections";

/** Drifting strip of verified people; the track is duplicated so the loop is
 *  seamless.
 *
 *  That duplication used to be literal: 28 hand-written cards for 14 people,
 *  each person's markup appearing twice in the desktop track and twice again in
 *  the mobile one. 684 lines, and editing a caption meant finding both copies.
 *  The cards are now one component over two record lists, and the seam is
 *  `[...PEOPLE, ...PEOPLE]` - which is what the comment above always claimed.
 *
 *  Desktop and mobile are separate lists rather than one list with size
 *  overrides, because the copy genuinely differs: desktop says "Driving licence
 *  · 30 min" where mobile says "Licence · 30 min", and mobile drops the `note`
 *  caption entirely. Collapsing them would have meant inventing a shared string.
 */

/** The words on a card. Handed down from `Track` rather than looked up in
 *  `PersonCard`, because the two tracks read two different tables and only
 *  the caller knows which: `note` exists on the desktop table and on no row
 *  of the mobile one. */
type Words = {
  readonly role: string;
  readonly city: string;
  readonly chip: string;
  /** Desktop only - the small caption over the photograph. */
  readonly note?: string;
};

type Person<S extends string> = {
  readonly src: S;
  readonly w: number;
  readonly h: number;
  /** The one card mid-check: a pulsing dot, and a dimmed caption where there is
   *  one to dim. Both breakpoints show it. */
  readonly live?: boolean;
  /** The progress bar under the role. DESKTOP ONLY - the mobile card is live
   *  but has no bar, which is why this is not folded into `live`. */
  readonly progress?: boolean;
};

/** The two tracks: which photographs, at what box. The role, the city and the
 *  chip are keyed by photograph in `lib/copy/sections`, in TWO tables rather
 *  than one - see the header, and that file's note on the same decision. */
const DESKTOP: readonly Person<PersonSrcDsk>[] = [
  { src: "/img/01-rider-bengaluru.jpg", w: 300, h: 420 },
  { src: "/img/02-nurse-abudhabi.jpg", w: 340, h: 470 },
  { src: "/img/03-engineer-manila.jpg", w: 290, h: 390 },
  { src: "/img/04-nanny-gurugram.jpg", w: 320, h: 440 },
  { src: "/img/05-warehouse-pune.jpg", w: 300, h: 400, live: true, progress: true },
  { src: "/img/06-supplier-cairo.jpg", w: 330, h: 460 },
  { src: "/img/07-tenant-singapore.jpg", w: 290, h: 410 },
  { src: "/img/08-cfo-london.jpg", w: 310, h: 430 },
];

const MOBILE: readonly Person<PersonSrcMob>[] = [
  { src: "/img/01-rider-bengaluru.jpg", w: 200, h: 270 },
  { src: "/img/02-nurse-abudhabi.jpg", w: 220, h: 300 },
  { src: "/img/03-engineer-manila.jpg", w: 190, h: 250 },
  { src: "/img/04-nanny-gurugram.jpg", w: 200, h: 280 },
  { src: "/img/05-warehouse-pune.jpg", w: 200, h: 260, live: true },
  { src: "/img/06-supplier-cairo.jpg", w: 210, h: 290 },
];

function PersonCard({ p, w, loading }: { p: Person<string>; w: Words; loading: "eager" | "lazy" }) {
  /** Was `p.live ? { color: "rgba(255,255,255,0.4)" } : undefined` inline - the
   *  `rgba()` that TASKS Part 5 carried as the hole in `hv/no-color-literal`,
   *  which matched hex only and is extended as of 22 Sep 2026.
   *
   *  `p.live` was the wrong cause as well as the wrong place. The caption
   *  inverts because `/img/05-warehouse-pune.jpg`'s tint is dark (`#6E6C63`,
   *  relative luminance 0.1494) and not because that card is the live one; the
   *  two coincided on exactly one of the eight photographs. Keyed by photograph
   *  now, beside the tint in `lib/img.ts`, so a reshuffle of which card is live
   *  cannot leave a white caption on a pale tile. The ternary keeps its
   *  `undefined` branch rather than becoming a spread: both render the same
   *  HTML, but they differ in the flight payload (see the note in
   *  `sections/Packages.tsx`), and this change is a colour move, not a payload
   *  one. */
  const noteColour = noteInk(p.src);
  return (
    <div
      className="person ph"
      style={{ width: `${p.w}px`, height: `${p.h}px`, background: tint(p.src) }}
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
        {p.progress && (
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
 *  THE SECOND COPY LOADS LAZILY. It exists only so `drift`'s -50% wraps
 *  seamlessly, so it is off-screen at load by construction - and Lighthouse's
 *  first genuine mobile run named one of its cards as the homepage's LCP
 *  element, at `left -621, right -401`, with LCP 5,042 ms against a 2,000 ms
 *  budget. The largest contentful paint was an image nobody could see.
 *
 *  The visible half stays eager on purpose: the strip animates from first
 *  paint, and a lazy first card pops in under the reader's eye. */
function Track<S extends string>({
  people,
  words,
}: {
  people: readonly Person<S>[];
  words: Readonly<Record<S, Words>>;
}) {
  return (
    <div className="track">
      {[...people, ...people].map((p, i) => (
        <Fragment key={i}>
          {" "}
          <PersonCard p={p} w={words[p.src]} loading={i < people.length ? "eager" : "lazy"} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

export async function PeopleStrip() {
  const t = (await copy(SECTIONS)).peopleStrip;

  return (
    <>
      <div className="dsk">
        <div className="rise d6" style={{ padding: "40px 0 8px", overflow: "hidden" }}>
          {" "}
          <Track people={DESKTOP} words={t.dsk} />{" "}
        </div>{" "}
        {/* Desktop only - the mobile block is the track alone. */}
        <div
          className="wrap"
          style={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            color: "var(--muted)",
          }}
        >
          {" "}
          <span>
            {t.strip}
          </span>{" "}
          <span className="mono" style={{ color: "var(--muted)" }}>
            {t.times}
          </span>{" "}
        </div>
      </div>
      <div className="mob">
        <div style={{ padding: "12px 0 0", overflow: "hidden" }}>
          {" "}
          <Track people={MOBILE} words={t.mob} />{" "}
        </div>
      </div>
    </>
  );
}

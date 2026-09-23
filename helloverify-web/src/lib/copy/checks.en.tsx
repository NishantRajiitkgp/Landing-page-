/** English copy for `app/[locale]/checks/**` — the page SHELL of the
 *  programmatic check page, and nothing else.
 *
 *  THE BOUNDARY. `lib/content/checks.ts` is NOT copy and nothing from it is
 *  here: no `name`, `group`, `source`, `time`, `countries`, `answers`,
 *  `caveat`, `fields[]` or `usedBy[]`. That catalogue is the one this repo
 *  already cites as the precedent for data that stays put — `lib/seo/copy.ts`
 *  derives all twelve check routes' titles and descriptions from it rather
 *  than restating them, and the page's `Service` node, its `.strip3` and its
 *  answer block are all built from the same records so that the citeable
 *  sentence and the page cannot disagree. Putting any of it here would create
 *  the second copy that arrangement exists to prevent.
 *
 *  WHAT IS HERE is the frame: kickers, question-shaped headings, button text,
 *  the three-verdict aside, and the connective words around a catalogue value.
 *  Eight of the 25 leaves take a node or a string for that last reason — the
 *  function shape `./index` describes, so a locale may put the check's name
 *  where its grammar wants it.
 *
 *  `tools/test/answer-blocks.test.ts` ASSERTS TWO OF THESE LEAVES and does it
 *  by rendering the page, so it keeps working through this move: `closing.h`
 *  says "Run the {name} check", with the article "the" and the name verbatim,
 *  because "Run a identity check" and "Run a directors & gst check" both
 *  shipped. The page's own comment above the answer block has the full trace
 *  and is deliberately left there — it describes a section, not a string.
 *
 *  MEASURED: **16 matched nodes, 25 leaves — 1.56x** (`tools/test/copy.test.ts`
 *  §7; 16 is this agent's re-run of the matcher, against the 12 the slice was
 *  briefed with — see `./about.en.tsx` on why the two disagree).
 */
import type { ReactNode } from "react";

export const en = {
  /** Two rungs. The third is `c.name`, from the catalogue. */
  crumbs: {
    resources: "Resources",
    library: "Check library",
  },

  closing: {
    /** "the", and the name VERBATIM — see the header. This is the leaf
     *  `answer-blocks.test.ts` failed on; the JSX comment that used to carry
     *  that note sat inside the fragment and is now this one, because the
     *  fragment moved here. */
    heading: (name: ReactNode) => (
      <>
        Run the {name} check <em>this week.</em>
      </>
    ),
    sub: (source: string, time: string) => `Confirmed with ${source}, typically in ${time}.`,
  },

  hero: {
    kicker: (group: ReactNode) => <>Check · {group}</>,
    h1: (name: ReactNode) => <>{name} verification</>,
    talkToSales: "Talk to sales",
    /** The only outbound link on the page that is not an `AppLink` — it goes
     *  to the app origin, so it is a plain `<a>`. The label is copy all the
     *  same. */
    buy: "Buy a single check",
  },

  /** The `.strip3` figures. `<b>` travels with each leaf for the reason
   *  `about.en.tsx#strip` sets out. The fourth item, `<b>{c.countries}</b>`,
   *  has no literal in it at all and so has no leaf: it is a catalogue value
   *  with no frame around it. `fast` carries its `<span className="dot" />`
   *  for the reason `countries.en.tsx#strip.inCountry` sets out. */
  strip: {
    turnaround: (time: ReactNode) => <><b>{time}</b> typical turnaround</>,
    confirmedWith: (source: ReactNode) => <>confirmed with <b>{source}</b></>,
    fast: <><span className="dot" /> usually within the hour</>,
  },

  /** The answer block (BUILD-SPEC §11a.2). Its lede is ELEVEN children — five
   *  catalogue values and six literal fragments, one of which is an explicit
   *  `{" "}`. Reproduced here child for child, including the line break the
   *  page had, because React writes a `<!-- -->` between every adjacent pair
   *  of them and `.next/server/app/en/checks/identity.html` shows all nine.
   *  Merging any two into one interpolated string would delete a separator —
   *  the exact failure `tools/port/html-identity.mjs` caught on
   *  `sections/Packages.tsx`. */
  answer: {
    kicker: "In short",
    h2: (name: ReactNode) => (
      <>
        How long does {name} verification take?
      </>
    ),
    lede: (
      name: ReactNode,
      source: ReactNode,
      time: ReactNode,
      countries: ReactNode,
      answers: ReactNode,
    ) => (
      <>
        {name} is confirmed against {source}, with a typical turnaround of {time}.
        {" "}Coverage: {countries}. {answers}
      </>
    ),
  },

  fields: {
    kicker: "What comes back",
    /** A STRING leaf, not JSX: `SecHead`'s `h` takes a `ReactNode` but this
     *  call site passes a template literal today, and `./index`'s "a leaf's
     *  TYPE is whatever English uses" says to keep it one. A locale needing
     *  markup here changes the leaf's type and `tsc` will say so at the call
     *  site. */
    h: (name: string) => `What is in the ${name} report?`,
    lede: "Every field carries the source that confirmed it and the date it was confirmed.",
  },

  caveat: {
    kicker: "What it can't tell you",
    h2: (name: ReactNode) => (
      <>
        What can the {name} check not confirm?
      </>
    ),
    /** The three-verdict aside — the page's one piece of prose that is the
     *  same on all twelve check pages and comes from no record. Line breaks
     *  kept where the author put them: JSX folds a newline plus indentation to
     *  one space, so re-wrapping it cannot change the emitted text, but
     *  keeping them makes the leaf diff against the page it came from. */
    aside: (
      <>
        A result is one of three things, never a score: <em>verified</em> — the source confirmed
        it; <em>not verified</em> — the source has no such record; <em>unverifiable</em> — the
        source could not be reached, and the report names the route tried.
      </>
    ),
  },

  who: {
    kicker: "Who orders it",
    h2: "Who needs this check?",
  },

  related: {
    kicker: "Related",
    h2: "Which checks are usually ordered with it?",
    all: "The whole check library",
  },
};

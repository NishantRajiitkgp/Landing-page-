/** English copy for `components/templates/**` — one file, `VerticalPage.tsx`,
 *  the Template 3 workhorse behind six pages.
 *
 *  The reasoning for the shape — why the English object is the schema, why an
 *  `aria-label` stays a `string`, why rich text is real JSX — is in
 *  `./index`'s header and is not repeated here.
 *
 *  MEASURED: 10 JSX text nodes by a comment-stripped `>text<` matcher (9 by
 *  the brief's), 11 leaves. A 1.1x ratio, against 3.0x on `chrome` — and the
 *  LOW number is the interesting one, because it is the same rule read from
 *  the other end. `./index` says the matcher undercounts in proportion to how
 *  much of a file is already tables; this template has NO tables. Every word
 *  it renders that is not one of these eleven arrives as a prop from one of
 *  the six pages, so a `>text<` count is nearly exact here and 2.3x short on
 *  `business`. The multiplier is a property of the file, not of the matcher,
 *  which is why "multiply by ~3" is a ceiling and not an estimate.
 *
 *  SIX PAGES, AND NONE OF THEM IS IN `business`. The brief for this slice
 *  placed `templates` with the business subtree on the grounds that the
 *  business pages are this template's heaviest consumers; they are not its
 *  consumers at all. `grep -rln VerticalPage src` returns
 *  `governments/{health,immigration,manpower-education,trade}` and
 *  `individuals/{home-family,immigration}`. Nothing here changed its props or
 *  its rendering contract, so those six are untouched — but whoever migrates
 *  them should know the eleven leaves below are already gone.
 *
 *  THE THREE COLUMN HEADINGS ARE DUPLICATED FROM `chrome.checkTable`, not
 *  shared, and that is a decision rather than an oversight. `chrome/CheckTable`
 *  is a separate component with its own `.tbl3`; this template writes its own.
 *  Importing `CHROME` here to borrow three strings would make one namespace's
 *  keyset a dependency of another's, which is the "fourth structural rule to
 *  explain for one string" that `chrome.en.tsx` rejects for `nav.logoHome` and
 *  `footer.logoHome`. A translator gets two tables and may head them
 *  identically; nothing forces them apart and nothing binds them together.
 *  The day the template adopts `chrome/CheckTable` these three leaves go, and
 *  that is a markup change with an HTML diff, not a copy move.
 *
 *  NO `as const`, per the recipe.
 */

export const en = {
  /** The hero's primary button when a page passes no `primary` — a PARAMETER
   *  DEFAULT, not a text node, which is why the matcher cannot see it. The
   *  same shape `chrome.closingCta` is entirely made of. */
  talkToSales: "Talk to sales",

  /** The four band eyebrows. Literal in the template and identical on all six
   *  pages by design — the anatomy is fixed (DESIGN.md §7), so these are the
   *  template's own words and not a page's.
   *
   *  Plain `&`, NOT `&amp;`. Two of the four read `Turnaround &amp; coverage`
   *  and `Compliance &amp; security` in the JSX this replaced; JSX decodes the
   *  entity before React sees it, so a literal `&amp;` here would emit
   *  `&amp;amp;`. Second corollary in `./index`'s byte-identity section. */
  bands: {
    verify: "What we verify",
    steps: "How it works",
    table: "Turnaround & coverage",
    compliance: "Compliance & security",
  },

  /** `.tbl3`'s three column headings — see the note in this file's header on
   *  why these are not `chrome.checkTable`'s. */
  table: {
    check: "Check",
    turnaround: "Turnaround",
    confirmedWith: "Confirmed with",
  },

  /** The compliance band's two PROP DEFAULTS. A page may override either, and
   *  `/platform/security-compliance` does; these are the words for the band
   *  when nobody says otherwise. */
  compliance: {
    /** The one rich-text leaf here, and the reason the file is `.tsx`.
     *  Written exactly as the `??` default was: a text node, a `<br />`, and
     *  a second text node — the same three children React saw before, with
     *  the newline-plus-indent between the `<br />` and "done properly."
     *  folding away as it did in the original. */
    head: (
      <>
        The unexciting part,<br />done properly.
      </>
    ),
    lede:
      "Every check involves someone's most personal documents. Consent comes first, " +
      "retention has limits, and all of it is auditable.",
  },

  /** The band-closing link to `/platform/security-compliance`. The href is
   *  routing and stays in the component; only the words are here. */
  securityInFull: "Security & compliance, in full — DPA, residency, conformance",
};

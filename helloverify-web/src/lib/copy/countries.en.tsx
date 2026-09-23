/** English copy for `app/[locale]/countries/**` — the page SHELL of the
 *  programmatic country guide, and nothing else.
 *
 *  THE BOUNDARY, because this is a templated route and getting it wrong is how
 *  a catalogue ends up half in two places. `lib/content/countries.ts` is NOT
 *  copy and nothing from it is here: no country name, region, summary,
 *  turnaround, office, `watchOut`, or `notes[]` row. That is the precedent
 *  `lib/content/checks.ts` and `lib/content/company.ts` set — a catalogue is
 *  the site's claims, reviewed as data — and `lib/seo/copy.ts` already relies
 *  on it, deriving all 28 programmatic routes' titles and descriptions from
 *  those same records rather than listing them. What IS here is the frame the
 *  template wraps around a record: headings, kickers, column labels, button
 *  text and the connective words between two catalogue values.
 *
 *  THAT LAST CATEGORY IS WHY HALF THIS FILE IS FUNCTIONS. "Verifying in
 *  {c.name}?" is one sentence with a catalogue value inside it, and `./index`
 *  names the shape: a leaf that takes the component-owned node and may put it
 *  anywhere, so a locale whose word order differs is a dictionary edit and not
 *  a page edit. The chrome slice had one candidate for this and declined it
 *  (`chrome.consent`, for byte reasons that do not apply here); this namespace
 *  is where the shape earns its place, with 9 of 25 leaves taking a node.
 *
 *  BYTE-IDENTITY, checked against `.next/server/app/en/countries/india.html`:
 *  React writes `<!-- -->` between two adjacent text children, and the built
 *  page shows it — `Country guide · <!-- -->South &amp; Southeast Asia` and
 *  `<em>India<!-- -->.</em>`. Every leaf below reproduces its original child
 *  array element for element, so the separators land in the same places.
 *  Proved with `react-dom/server`'s `renderToString` rather than argued: a
 *  Fragment leaf standing in for a parent's inline children emits the same
 *  bytes, because `lastPushedText` is tracked per SEGMENT and a fragment opens
 *  no segment.
 *
 *  MEASURED: **19 matched nodes, 25 leaves — 1.32x** (`tools/test/copy.test.ts`
 *  §7; 19 is this agent's re-run of the matcher, against the 13 the slice was
 *  briefed with — see `./about.en.tsx` on why the two disagree).
 */
import type { ReactNode } from "react";

export const en = {
  /** The two rungs this page owns. The third is `c.name`, from the
   *  catalogue, and stays in the page. */
  crumbs: {
    resources: "Resources",
    countries: "Country guides",
  },

  closing: {
    heading: (name: ReactNode) => (
      <>
        Verifying in {name}? <em>Tell us what you need.</em>
      </>
    ),
    sub: "Including when the honest answer involves a caveat.",
  },

  hero: {
    kicker: (region: ReactNode) => <>Country guide · {region}</>,
    h1: (name: ReactNode) => (
      <>
        Verification in <em>{name}.</em>
      </>
    ),
    ask: (name: ReactNode) => <>Ask about {name}</>,
    allCountries: "All 120+ countries",
  },

  /** The four `.strip3` figures. Each carries its own `<b>` for the reason
   *  `about.en.tsx#strip` sets out: the alternative is a label leaf beginning
   *  with a space, which `tools/test/copy.test.ts` §3 rejects.
   *
   *  `inCountry` CARRIES A `<span className="dot" />`, which is markup and not
   *  copy, and it is here anyway. The three ways out are all worse: a leaf of
   *  `" checked in-country"` fails the edge-whitespace guard; a `{" "}` added
   *  between the dot and the text splits one text node into two and changes
   *  the bytes; and leaving the whole item a literal leaves one of four
   *  siblings untranslatable. The dot travels with the phrase, and a locale
   *  that needs it on the other side can move it. */
  strip: {
    sourceConfirmed: (turnaround: ReactNode) => <><b>{turnaround}</b> source-confirmed</>,
    localOffice: (office: ReactNode) => <>local office in <b>{office}</b></>,
    partnerNetwork: <>covered by <b>partner network</b></>,
    checkTypes: (count: ReactNode) => <><b>{count}</b> check types documented</>,
    inCountry: <><span className="dot" /> checked in-country</>,
  },

  /** The per-check table. Its three column headings are NOT
   *  `chrome.checkTable`'s, deliberately: that component's header argues that
   *  the other `.tbl3` sites head their columns differently and are not it,
   *  and this is one of them — "Local note" against its "Confirmed with". Two
   *  tables, two sets of headings, two namespaces. */
  table: {
    kicker: "What runs here",
    heading: <>Checks, times,<br />and the local reality.</>,
    lede: (name: ReactNode) => (
      <>
        Indicative timings for checks confirmed at their source in {name}.
      </>
    ),
    cols: {
      check: "Check",
      turnaround: "Turnaround",
      note: "Local note",
    },
  },

  trap: {
    kicker: "Watch out for",
    heading: <>What trips<br />people up here.</>,
  },

  /** The sibling index. Its `<h2>` is `{c.region}.` and its `<small>` is
   *  `{s.summary.split(".")[0]}.` — both a catalogue value with a full stop
   *  re-attached, and both left in the page. A terminal full stop on a value
   *  the dictionary does not own is punctuation, which `./index` puts in the
   *  same "not copy" box as an href; pulling it in would mean a leaf whose
   *  entire content is ".". Recorded because it is a judgement, not an
   *  oversight. The `→` in the row's `.xa` cell is left for the same reason
   *  `chrome/Breadcrumb.tsx` leaves its `/` separator a literal. */
  nearby: {
    kicker: "Nearby",
    officeIn: (office: string) => `office in ${office}`,
    partnerNetwork: "partner network",
    all: "All country guides",
  },
};

/** English copy for `app/[locale]/legal/**` — the page SHELL of the long-form
 *  legal document template, and nothing else.
 *
 *  THE BOUNDARY, and on this route it is not a style question. `LEGAL` in
 *  `lib/content/legal.ts` holds **61,068 characters** of policy text ported
 *  verbatim from the production site, awaiting counsel's review of this one.
 *  None of it is here and none of it may come here: `d.title`, `d.summary`,
 *  `d.effective`, every `section.h` and every paragraph of `section.body`
 *  stay in that module. Two reasons, both hard. A verbatim port is production
 *  text that was approved elsewhere, and a dictionary is a file handed to a
 *  translator — the one thing legal copy may not be is translated by anyone
 *  but counsel. And `lib/seo/copy.ts` already derives all nine legal routes'
 *  titles and descriptions from those same records, so moving them would
 *  create the second copy that table exists to collapse.
 *
 *  WHAT IS HERE is the frame the template draws around a document: the
 *  breadcrumb rung, the kicker, the section-nav's two labels, the effective
 *  date's prefix, the disclosure banner, the placeholder for an undrafted
 *  section, and the index at the foot.
 *
 *  THE BANNER IS FOUR LEAVES, not one sentence. Its markup is
 *  `<b>…</b>{" "}{ternary}{" "}text` — five children, and
 *  `.next/server/app/en/legal/privacy-policy.html` shows React's `<!-- -->`
 *  between three pairs of them. `counted` stays a function of the two counts
 *  for the reason the page's own comment gives: the claim is conditional on
 *  the numbers, and a locale that pluralises differently needs the numbers,
 *  not a rendered sentence.
 *
 *  MEASURED: **4 matched nodes, 14 leaves — 3.5x**, the HIGHEST ratio of the
 *  six route namespaces and the only one near chrome's 3.2x
 *  (`tools/test/copy.test.ts` §7; 4 is this agent's re-run of the matcher,
 *  against the 6 the slice was briefed with — see `./about.en.tsx` on why the
 *  two disagree). It is high for exactly the reason `./index` gives: this
 *  page is almost entirely `d.sections.map(…)` over a catalogue, so the copy
 *  it does own sits in an `aria-label`, in a ternary, or beside an
 *  interpolation — the three places a `>text<` count cannot look.
 */
import type { ReactNode } from "react";

export const en = {
  /** The first rung. The second is `d.title`, from the catalogue. */
  crumb: "Legal",

  closing: {
    heading: (
      <>
        Questions about this? <em>Ask a person.</em>
      </>
    ),
    sub: "Privacy, data protection and contract questions go to a named contact.",
  },

  /** Word-for-word `crumb`, and deliberately a second leaf. They are two
   *  controls a translator sees in two places — the same argument
   *  `chrome.nav.logoHome` and `chrome.footer.logoHome` are kept apart by,
   *  and sharing would be a structural rule to explain for one word. */
  kicker: "Legal",

  /** The section index. `label` is the `<nav>`'s accessible name and
   *  `heading` is the visible `.lk` above the list — same word, two surfaces,
   *  same reasoning as `kicker` above. `label` is a plain `string` because
   *  `./index` derives a leaf's type from what English uses and an
   *  `aria-label` cannot take a `ReactNode`. */
  nav: {
    label: "Sections",
    heading: "Sections",
  },

  doc: {
    effective: (date: ReactNode) => <>Effective · {date}</>,
    /** BUILD-SPEC §4 disclosure. See the header for why this is four leaves
     *  and the page's own comment for why the claim is conditional on the
     *  counts. */
    pending: {
      title: "Awaiting legal copy.",
      counted: (drafted: number, total: number) =>
        `${drafted} of ${total} sections carry the text the current site ` +
        `publishes, ported verbatim; the remaining ${total - drafted} are ` +
        `not drafted here.`,
      blank:
        "The structure, navigation and typography of this document are final; the " +
        "operative text is not drafted here.",
      note:
        "Per the build spec, legal copy ports verbatim from the existing site and is " +
        "published only after review by counsel — a port restores parity with " +
        "production, it is not that review.",
    },
    /** The placeholder for one of the 35 sections `LEGAL` has not been filled
     *  for. The square brackets are part of the string: it is deliberately
     *  not prose, and a locale should be able to keep it looking that way. */
    sectionPending: "[ Section text pending legal review ]",
  },

  /** The index of the other documents at the foot. `sections` takes the count
   *  rather than being spliced into a sentence, because it is already
   *  `{n}` + `" sections"` in the markup — two children with a `<!-- -->`
   *  between them in the built page, and merging them would delete it. */
  other: {
    heading: "Other legal documents",
    sections: (count: ReactNode) => <>{count} sections</>,
  },
};

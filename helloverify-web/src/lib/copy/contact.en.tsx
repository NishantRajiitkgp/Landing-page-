/** English copy for `app/[locale]/contact` — one route subtree, one namespace.
 *
 *  The shape arguments are in `./index` and are not repeated.
 *
 *  MEASURED: **34 matched nodes, 39 leaves — 1.15x** (`tools/test/copy.test.ts`
 *  §7; 34 is this agent's re-run of the matcher, against the 32 the slice was
 *  briefed with — see `./about.en.tsx` on why the two disagree). The lowest
 *  ratio of the six route namespaces, and for a reason worth recording:
 *  `/contact`'s densest surface is `forms/ContactForm.tsx`, which holds every
 *  field label, placeholder, `aria-label` and option string on the page and is
 *  NOT migrated. It is the tree's only `"use client"` file, and `./index`'s
 *  "Zero client bytes" section is explicit that nothing in this layer may be
 *  reachable from it. The page passes the form exactly one prop, `locale`, and
 *  no copy, so the boundary needed no negotiation — but the ratio here is low
 *  because the interesting half of this page is behind that boundary.
 *
 *  THE SIDE CARD DUPLICATES `chrome.closingCta`. `side.h` and `side.p` are
 *  word-for-word `chrome.closingCta.heading` and `.sub`. They are NOT shared:
 *  `components/chrome/**` is another agent's namespace, a cross-namespace
 *  import would make one translator's edit move copy on a page they were not
 *  given, and this card is a page-level decorative panel rather than the
 *  closing band. Recorded rather than resolved — folding them is a content
 *  decision about whether the repetition is deliberate.
 */

export const en = {
  crumb: "Contact",

  closing: {
    heading: (
      <>
        Prefer to just <em>see it working?</em>
      </>
    ),
    sub: "Ask for a walkthrough with your own sample documents.",
    ctaLabel: "Request a walkthrough",
  },

  hero: {
    kicker: "Contact",
    h1: (
      <>
        Talk to a person <em>who runs checks.</em>
      </>
    ),
    sub:
      "Not a queue. Tell us what you need verified, for whom, and roughly how many — you will " +
      "get a real answer, including when the honest answer is that something takes days.",
  },

  /** The image panel beside the form. See the header note on the duplication. */
  side: {
    h: (
      <>
        Every great journey deserves a <em>verified</em> beginning.
      </>
    ),
    p: "Take the first step. We'll handle the rest.",
  },

  /** The four routing rows. Keyed by who the row is for, not by the href in
   *  its `.s3` cell: three of the four end in an `AppLink` and the fourth ends
   *  in a plain `<span className="s3 req">`, so there is no href to key on for
   *  all four and the component writes them out longhand with no `key` prop.
   *  Same situation and same answer as `chrome.footer.legal`.
   *
   *  `link` carries its own `→`. The arrow is inside the anchor text today and
   *  moving it out would split one text node into two, which is the one thing
   *  `./index`'s byte-identity rule forbids. */
  ways: {
    kicker: "Other ways in",
    heading: <>Depending on<br />who you are.</>,
    lede:
      "Sales, support, security reviews and individual purchases go to different places — " +
      "here is which is which.",
    rows: {
      individual: {
        t: "Buying a single check as an individual",
        p: "You don't need us at all — HelloV runs in WhatsApp and takes about a minute to start.",
        link: "HelloV →",
      },
      smb: {
        t: "Small business, ready to buy",
        p: "Prices are public and you can start without talking to anyone.",
        link: "SMB packages →",
      },
      security: {
        t: "Security review, DPA or questionnaire",
        p: "Artefacts are listed with their status; most are sent within two working days.",
        link: "Compliance pack →",
      },
      support: {
        t: "Existing customer needing support",
        p: "Use the form above and pick your service — support enquiries are routed, not queued behind sales.",
        /** Not a link: the fourth row's `.s3` is a plain badge. Kept a
         *  sibling of the three `link`s rather than given a different key
         *  name, so the four rows stay the same shape for a translator. */
        link: "Same working day",
      },
    },
  },

  /** Six offices, city and hours. `noida.hours` is the only rich-text leaf of
   *  the six — its span carries a `<br />` — so it is JSX and the other five
   *  are strings, which is `./index`'s "a leaf's TYPE is whatever English
   *  uses" working as intended rather than an inconsistency. */
  offices: {
    kicker: "Offices",
    heading: <>Six of them,<br />twelve hours apart.</>,
    lede:
      "Someone is at a desk for 21 of every 24 hours, which is why a request filed at night is " +
      "usually answered by morning somewhere.",
    list: {
      noida: { city: "Noida", hours: <>India · 09–18 IST<br />Head office</> },
      manila: { city: "Manila", hours: "Philippines · 09–18 PHT" },
      singapore: { city: "Singapore", hours: "Singapore · 09–18 SGT" },
      dubai: { city: "Dubai", hours: "UAE · 09–18 GST" },
      cairo: { city: "Cairo", hours: "Egypt · 09–18 EET" },
      newYork: { city: "New York", hours: "United States · 09–18 ET" },
    },
  },
};

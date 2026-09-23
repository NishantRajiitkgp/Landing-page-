/** English copy for `components/blocks/**` — the lead-form mock the closing
 *  band renders, the HelloV WhatsApp phone, and the four scenes of the
 *  homepage process animation.
 *
 *  Every shape argument — why the English object is the schema, why a label is
 *  keyed by the thing it names, why rich text is real JSX, why `&` and not
 *  `&amp;` — is in `./index`'s header and is not repeated here.
 *
 *  NO `as const`, per the recipe.
 *
 *  MEASURED: 27 JSX text nodes across these three files by the `>text<`
 *  matcher in `./index`'s opening paragraph, comments stripped first; it
 *  reproduces that header's `blocks 27` exactly. This file holds **77
 *  leaves** for them — 2.85x, against the 3.2x chrome measured.
 *
 *  THE UNDERCOUNT IS THE HEADER'S OWN RULE AT ITS LIMIT. `LeadMock.tsx`
 *  scores ZERO for 17 leaves: it has no JSX text node at all, because
 *  every string it renders already lived as a property in `MOCK_HEAD`,
 *  `MOCK_FIELDS_*` and `SEGMENTS`. `HowItWorksPanels.tsx` scores 12 for 38
 *  because `FIELDS`, `DOC_CHECKS`, `EVENTS` and `REPORT_ROWS` are tuple
 *  tables. Only `HelloVPhone.tsx`, which is hand-written markup end to
 *  end, comes close to being readable by the matcher at 15 for 22. The
 *  three ratios are asserted per file in `tools/test/copy.test.ts` §10 so
 *  they stay measurements.
 *
 *  WHY `LeadMock`'S FIELD LABELS ARE HERE AND NOT IN `sections`. They are the
 *  one set of leaves the two namespaces could both have claimed:
 *  `sections/Contact.tsx` renders the rows. It renders them by handing
 *  `MOCK_FIELDS_DSK` / `MOCK_FIELDS_MOB` to `MockFields`, and never touches a
 *  string — the label and the mock value are read inside `blocks/LeadMock.tsx`
 *  by `MockRow`, which is also the component whose `key={label}` depends on
 *  them. A namespace is the unit one agent owns and one translator receives
 *  (`./index`, "Adding a namespace"), so splitting a row's label from the
 *  component that renders it would have put half a table in each of two
 *  translator files and made `Contact.tsx` import a `blocks` key union to say
 *  nothing about it. Rejected: `sections.contact.form.*`, which reads better
 *  from the page and worse from everywhere else.
 */

export const en = {
  /** `blocks/LeadMock.tsx`. `fields` is keyed by row id: the component owns
   *  the ORDER, which rows each breakpoint shows, and the box metrics
   *  (`inp`, `inpStyle`, `wide`, `select`) — all of which are layout. */
  leadMock: {
    fields: {
      fullName: { label: "Full name", value: "Priya Menon" },
      company: { label: "Company", value: "Company name" },
      email: { label: "Business email", value: "name@company.com" },
      /** THE ONE RICH-TEXT LEAF HERE, and it carries a `style`. That is
       *  deliberate and it is the reason this file is `.tsx`: the row's
       *  `<span>` has three children — an element, a `{' '}` and a text node —
       *  and `LeadMock`'s own header records that it was moved as a NODE
       *  rather than re-expressed, because React's SSR `<!-- -->` separators
       *  depend on that children array exactly. Splitting the ink colour out
       *  into the component would mean re-expressing it, which is the thing
       *  that file measured and refused. Proved again for this migration with
       *  `renderToString` before the edit: the node renders the same bytes
       *  standing here as it did standing there. */
      mobile: {
        label: "Mobile",
        value: (
          <span>
            <span style={{ color: 'var(--ink)' }}>
              +91
            </span>
            {' '}· 98··· ·····
          </span>
        ),
      },
      /** Two ids for one label because the two breakpoints genuinely name a
       *  different number of services — `LeadMock`'s header measured that as
       *  one of the three fields that differ. `message` needs no second id:
       *  its label and its value are identical at both, and only the box
       *  height differs, which is layout and stays in the component. */
      services: { label: "Services of interest", value: "Employee verification, KYC, Certifier, Consumer…" },
      servicesMob: { label: "Services of interest", value: "Employee verification, KYC…" },
      message: { label: "Message", value: "How many checks a month, and where?" },
    },
    /** Which audience the mock is set to. Keyed by segment, not an array:
     *  an array leaf derives to `string[]`, so a locale could ship two chips
     *  where English ships three — the argument in `./index`. `on` stays in
     *  the component: which chip is selected is state, not words. */
    segments: {
      business: "Business",
      government: "Government",
      individual: "Individual",
    },
  },

  /** `blocks/HelloVPhone.tsx` — a WhatsApp thread, so the leaves are keyed by
   *  message. The timestamps are copy and not structure: they are rendered
   *  text, and a locale that writes 24-hour clocks differently has to be able
   *  to move them. */
  helloVPhone: {
    name: "HelloV",
    status: "online · WhatsApp",
    /** The licence card inside the fourth bubble. Duplicated from
     *  `panels.licence` rather than shared, for the reason `chrome` gives for
     *  duplicating `logoHome`: they are two drawings a translator meets in two
     *  places, and one shared leaf would be a structural rule to explain for
     *  two words. */
    licence: { title: "Driving licence", region: "IND" },
    msgs: {
      m1: { text: "Hi Priya — who are we verifying today?", ts: "09:12" },
      m2: { text: "A driver for the school run. Advanced please.", ts: "09:13" },
      m3: { text: "Send a photo of his driving licence, front and back.", ts: "09:13" },
      /** The image bubble: its only words are the timestamp and the licence
       *  card above. */
      m4: { ts: "09:15" },
      /** Three text nodes around a `<b>`, so three leaves, and the split is
       *  an artefact of the bold rather than a translator's idea of a
       *  sentence. The function-leaf shape `./index` describes for a sentence
       *  wrapping a component-owned node would fix that and would also fold
       *  the three children into one — different bytes on every page that
       *  renders the phone. Deferred for the same reason `chrome.consent.body`
       *  was: the day a locale needs it is the day the HTML is allowed to
       *  move. */
      m5: {
        lead: "Read in 1.2 s ·",
        plate: "MH12 •••• 3391",
        tail: ", valid till 2031. Checking with RTO Pune and the courts now.",
        ts: "09:15",
      },
      m6: { ts: "09:42" },
    },
    report: {
      verdict: "Verified",
      elapsed: "27 min",
      rows: {
        licence: "Driving licence · valid",
        criminal: "Criminal record · none found",
        address: "Current address · confirmed",
      },
      file: "Report PDF · 2 pages",
    },
  },

  /** `blocks/HowItWorksPanels.tsx`, one object per scene. What stays in the
   *  component is everything the animation owns: the keyframe names, the
   *  `steps(n)` typewriter lengths, the box sizes and the `ok` flag. Those
   *  read as data next to the words and are not — `steps(14)` is a count of
   *  glyphs in the ENGLISH value, and pinning it to a translated one would
   *  need a second measurement per locale, which is a real decision and not
   *  this migration's. Recorded, not fixed. */
  panels: {
    licence: { title: "Driving licence", region: "IND" },
    upload: {
      captured: "Captured",
      quality: "sharp · no glare · all edges",
    },
    read: {
      fields: {
        name: { l: "Name", v: "A. RAMESH" },
        licence: { l: "Licence", v: "KA05 •••• 4812" },
        vehicleClass: { l: "Class", v: "LMV · MCWG" },
        valid: { l: "Valid till", v: "13 · 03 · 2039" },
      },
      checks: {
        /** Real JSX, because the artboard exporter split the title around the
         *  `&amp;` and React emits those five children with `<!-- -->`
         *  between them. A plain `"Template & fonts"` would collapse them to
         *  one — the first corollary of the byte-identity rule, and the exact
         *  note `Packages.tsx` carries about its own two. Written as a
         *  fragment so the whole run is ONE leaf a translator can reorder;
         *  five leaves would not be reorderable at all. */
        c1: { l: <>Template{" "}&amp;{" "}fonts</>, v: "match" },
        c2: { l: "Face vs. selfie", v: "98%" },
        c3: { l: "Issuer", v: "RTO Karnataka" },
      },
    },
    confirm: {
      office: "Regional Transport Office",
      officeSub: "Karnataka · issuing authority",
      /** Two leaves because the artboard put a `<br />` between them, and a
       *  line break inside the ring is layout the words cannot carry. */
      waitingA: "waiting for",
      waitingB: "the RTO",
      events: {
        e1: { ts: "09:41", text: "Request filed with the issuing office" },
        e2: { ts: "10:08", text: "Record matched · licence valid" },
      },
    },
    report: {
      person: "A. Ramesh",
      personSub: "Delivery rider · Bengaluru",
      /** These four times are the animation's own story and are NOT the
       *  catalogue in `lib/content/checks.ts` — that disagreement is carried
       *  in TASKS.md and the component's header, and moving the strings here
       *  does not settle it. */
      rows: {
        r1: { n: "PAN", t: "15 min" },
        r2: { n: "Registration certificate", t: "28 min" },
        r3: { n: "Driving licence", t: "30 min" },
        r4: { n: "Criminal", t: "30 min" },
      },
      foot: "30 min · 4 sources",
      seal: "Verified",
    },
  },
};

/** English copy for `components/sections/**` — the fifteen homepage bands.
 *
 *  The reasoning for every shape below — why the English object is the
 *  schema, why a label is keyed by the thing it names, why rich text is real
 *  JSX, why an `alt` or an `aria-label` stays a `string`, why `&` and not
 *  `&amp;` — is in `./index`'s header and is not repeated here. What IS here
 *  is the per-decision note that only makes sense with this content in front
 *  of you.
 *
 *  NO `as const`, per the recipe.
 *
 *  MEASURED: 152 JSX text nodes across these fifteen files by the `>text<`
 *  matcher in `./index`'s opening paragraph, comments stripped first. It
 *  reproduces that header's `components/sections/** 152` exactly, which is
 *  worth saying: the two slices before this one each had to record a
 *  matcher that disagreed with the brief it was given. This file holds
 *  **438 leaves** for them — 2.88x, against chrome's 3.2x and the ~3x the
 *  header tells the next agent to budget. Asserted per file in
 *  `tools/test/copy.test.ts` §10.
 *
 *  THE PER-FILE SPREAD IS THE FINDING, and 2.88x hides it: the ratio runs
 *  from 0.67x to 26x inside this one directory. ABOVE 3x is the header's
 *  own rule, that the multiplier tracks how much of a file is ALREADY a
 *  table — `PeopleStrip.tsx` scores 2 nodes for 52 leaves because its two
 *  person tables hold 50 of them, `Packages.tsx` 7 for 59, `Checks.tsx` 7
 *  for 58, `International.tsx` 6 for 40. BELOW 1x is new, and it is a fact
 *  about THIS tree: the homepage is a two-tree port, so a band writes its
 *  heading once per breakpoint and the matcher counts both, while the
 *  dictionary holds ONE leaf wherever the two strings are equal. `Hero`
 *  says the same six things at both widths and scores 9 nodes for 6
 *  leaves; `Numbers` 14 for 13. The `*Mob` leaves below are the places
 *  where the phone genuinely says something shorter, and there are far
 *  fewer of them than the two trees suggest.
 *
 *  ONE THING THAT DID NOT SCALE, recorded because the pattern is the
 *  deliverable. `./chrome.ts` says a component's table is gated by a key
 *  union, and that works until a table's rows are not the same SHAPE — the
 *  cell with a mobile-only tag, the lane with a zone, the plan with a
 *  "Most chosen" flash. Indexing a union of record types by a union of keys
 *  gives a union of objects, and a field present on one member is a type
 *  error on the others. Two ways out were used, and which one applies is a
 *  judgement about the field rather than a rule: `whoItsFor.cells` keeps its
 *  odd field and the component narrows with `"mobTag" in cell`, because the
 *  string belongs to that cell; `checks.zone`, `consumer.most` and
 *  `packages` keep one shared leaf and the component keeps a boolean,
 *  because the string is the same wherever it appears and the flag is a
 *  choice about a row — the shape `blocks/LeadMock.tsx`'s `on` already had.
 */

export const en = {
  /** `sections/Hero.tsx`. The first six leaves are said by both trees,
   *  string for string, so nothing is duplicated per breakpoint; everything
   *  from `headlineLead` on is the v2 desktop tree only. */
  hero: {
    backedBy: "Backed by",
    /** Two leaves, not one: `<br />` sits between them on desktop and a
     *  `{' '}` on mobile, so the two children are the unit React separates. */
    headline: "Verified at the source,",
    headlineEm: "in minutes.",
    /** v2 desktop splits `headline` once more: the last word carries the
     *  hand-drawn underline, so it is its own node. `headlineLead` +
     *  `headlineMark` joined by one space must read as `headline`; the copy test
     *  pins that. No edge whitespace — the component supplies the gap. */
    headlineLead: "Verified at the",
    headlineMark: "source,",
    lede: "AI reads the documents. Our team confirms with the issuer — the university, the employer, the registry. You get an answer in as little as 15 minutes.",
    cta: "Talk to sales",
    checks: "See all 33 checks",
    /** Homepage v2 (desktop). The corner notes of the security-print sheet
     *  are decoration — `aria-hidden` in the component — but they are words
     *  a translator must see, so they live here and not in the markup. */
    notes: {
      sheet: "Sheet 01 / 12",
      series: "Series 2026 · Est. 2018",
      uv: "Security print · move your cursor",
    },
    /** One repeat of the frame microtext; the component tiles it. Every
     *  figure in it is one `numbers` already states. */
    microtext: "VERIFIED AT THE SOURCE · 20M+ CHECKS COMPLETED SINCE 2018 · 120+ COUNTRIES · 2,000+ ENTERPRISE CLIENTS · PRIMARY SOURCE · HELLOVERIFY ·",
    /** One repeat of the ring of text revealed under the UV lamp. */
    uvRing: "VERIFIED AT THE SOURCE · HELLOVERIFY ·",
    seal: {
      replay: "Replay the verification stamp",
      ring: "VERIFIED · AT THE SOURCE · HELLOVERIFY · EST. 2018 ·",
      word: "Verified",
    },
    motion: { pause: "Pause motion", play: "Play motion" },
    /** The six doors under the headline. `name` is what a door says at rest,
     *  `line` and `time` what it shows when it opens — the audience strip's
     *  existing one-liners and turnarounds, unchanged. */
    doors: {
      kicker: "Same platform, different door.",
      label: "Solutions by audience",
      items: {
        governments: { name: "Governments", line: "Licences, visas and permits", time: "from 3 days" },
        enterprise: { name: "Enterprise & SMB", line: "Every hire, white-collar and blue", time: "from 30 min" },
        kyc: { name: "KYC", line: "Customers, verified at signup", time: "15 min" },
        vendors: { name: "Vendors", line: "Know who you buy from", time: "from 2 days" },
        premium: { name: "Premium services", line: "Visas and healthcare credentials", time: "assisted" },
        consumer: { name: "Consumer", line: "The people in your home", time: "30 min" },
      },
    },
  },

  /** `sections/Compliance.tsx`. The four cards come from `CREDENTIAL_MARKS`
   *  in `lib/content/company.ts` through `chrome/CertCard.tsx` and are NOT
   *  copy this namespace owns — the same boundary `chrome.footer.certs`
   *  draws. What is here is the two headings and the two `gloss` overrides,
   *  which are prop copy the matcher cannot see at all. */
  compliance: {
    heading: "The unexciting part, done properly.",
    lede: "Every check involves someone's most personal documents. Consent comes first, retention has limits, and all of it is audited by people whose job is to be unimpressed.",
    /** The phone drops the first sentence. Measured in the component, not
     *  assumed symmetrical — see its header. */
    ledeMob: "Consent comes first, retention has limits, and all of it is audited by people whose job is to be unimpressed.",
    glossGdpr: "Consent, retention limits and the right to be forgotten.",
    glossPbsa: "The global standards body for screening.",
  },

  /** `sections/Numbers.tsx`. The figures are copy, not data: they are
   *  rendered text, and a locale that groups digits differently ("2,000")
   *  or writes a different magnitude suffix ("20M") has to be able to. The
   *  animation delays stay in the component — those are motion. */
  numbers: {
    headingA: "Built on trust.",
    headingB: "Proven by numbers.",
    headingMob: "Built on trust. Proven by numbers.",
    lede: "Every figure here is a real count, not a target.",
    /** Its own `<span className="sfx">`, so its own text node, on all eight
     *  renderings. One leaf, used eight times. */
    plus: "+",
    figures: {
      checks: { v: "20M", l: "checks completed since 2018, every one at the primary source." },
      clients: { v: "2,000", l: "enterprise clients globally, from fleets to health ministries." },
      countries: { v: "120", l: "countries where we can reach the issuing authority." },
      catalogue: { v: "33", l: "verification checks, from a driving licence to a director's default history." },
    },
  },

  /** `sections/Why.tsx`. `reasons` is keyed by the ordinal the card prints,
   *  which is also its React `key` — the ordinal is position, not words, so
   *  it stays in the component's list and doubles as the key. `evidence` is
   *  keyed by a slug and NOT by its label, because the component keys those
   *  rows on the label text and `./index`'s third corollary requires that
   *  expression to keep resolving to the same string. */
  why: {
    heading: "Why governments work with us.",
    lede: "A ministry isn't buying reports. It's buying the trust layer under every permit, licence and clearance.",
    reasons: {
      "01": { t: "Primary source, at national scale", p: "Confirmed with the issuer — never a proxy database." },
      "02": { t: "One platform, public and private", p: "People, businesses, suppliers and institutions." },
      "03": { t: "Proven with governments", p: "India, Saudi Arabia, the UAE, Singapore, European workflows." },
      "04": { t: "Built to last", p: "Infrastructure regulators rely on for years, not a project." },
      "05": { t: "Evidence, not opinion", p: "Remarks, artefacts and an auditable trail with every result." },
    },
    card: {
      note: "photo · licensing officer at a counter, natural light",
      seal: "Verified",
      k: "One result, and how we know",
      title: "Driving licence",
    },
    evidence: {
      read: { label: "Read by", value: "HelloVerify AI · 14 fields · 1.2 s" },
      confirmed: { label: "Confirmed", value: "RTO Karnataka · 10:08" },
      artefact: { label: "Artefact", value: "Sarathi record · PDF · hashed" },
      reviewed: { label: "Reviewed", value: "K.S. · audit trail, 5 events" },
    },
  },

  /** `sections/HowItWorks.tsx`. One entry per step, and the step name is
   *  written once where the component wrote it three times — the track
   *  label, the mobile track label and the caption card all read
   *  `steps.<id>.label`, which is the deduplication that file's header
   *  already claimed and now cannot lose. The `at` percentages stay in the
   *  component: they are where the node sits on a track. */
  howItWorks: {
    headingA: "One upload.",
    headingB: "Then we get to work.",
    headingMob: "One upload. Then we get to work.",
    lede: "A driving licence in Bengaluru, start to finish. Thirty minutes, on loop.",
    clock: { start: "09:40", end: "10:10" },
    steps: {
      upload: {
        label: "Upload",
        sub: "09:40 · candidate's phone",
        cap: "Photograph the document. Edges, glare and focus are checked before the shutter fires.",
      },
      read: {
        label: "Read",
        sub: "1.2 s · HelloVerify AI",
        cap: "AI captures every field, checks the document against itself, and finds the office that issued it.",
      },
      confirm: {
        label: "Confirm",
        sub: "RTO Karnataka · the source",
        cap: "The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.",
      },
      report: {
        label: "Report",
        sub: "10:10 · shared with HR",
        cap: "One report, with the source named beside every result.",
      },
    },
  },

  /** `sections/WhoItsFor.tsx`. Keyed by photograph, which is the one field
   *  of a bento cell that is neither copy nor duplicated — the same
   *  argument `chrome.footer.links` makes for keying by href.
   *
   *  THE ONE RAGGED ROW IN EITHER NAMESPACE: only the first cell has a
   *  `mobTag`, so this table's members are not the same type and
   *  `t.cells[c.src].mobTag` is a type error on the other five. Kept ragged
   *  and narrowed at the call site with `"mobTag" in cell`, because
   *  "Governments" is that cell's own word; the alternative — five
   *  `mobTag: undefined` leaves to square the table — would put five empty
   *  rows in front of a translator to satisfy the type checker. */
  whoItsFor: {
    headingA: "For the moment you",
    headingB: "need to trust someone.",
    headingMob: "For the moment you need to trust someone.",
    lede: "A health ministry licensing ten thousand nurses and a family hiring one nanny need the same thing: a real answer, quickly. Same platform, different door.",
    cells: {
      "/img/10-ministry-hall.jpg": {
        note: "photo · ministry hall",
        /** Real JSX. The artboard exporter split these three tags around the
         *  `&amp;`, so each is five text children with React's `<!-- -->`
         *  between them; a plain `"Governments & authorities"` collapses them
         *  to one and moves the bytes. Same note as `Packages.tsx`'s `tt` and
         *  `Checks.tsx`'s lane headings. */
        tag: <>Governments{" "}&amp;{" "}authorities</>,
        mobTag: "Governments",
        from: "from 3 days",
        h: (
          <>
            Licences, visas
            <br />
            and permits
          </>
        ),
      },
      "/img/11-office-first-day.jpg": {
        note: "photo · office, first day",
        tag: <>Enterprise{" "}&amp;{" "}SMB · BGV</>,
        from: "from 30 min",
        h: "Every hire, white-collar and blue",
      },
      "/img/12-phone-signup.jpg": {
        note: "photo · phone, signup",
        tag: <>KYC · Trust{" "}&amp;{" "}Safety</>,
        from: "15 min",
        h: "Customers, verified at signup",
      },
      "/img/13-factory-floor.jpg": {
        note: "photo · factory floor",
        tag: "Vendors · Certifier",
        from: "from 2 days",
        h: "Know who you buy from",
      },
      "/img/14-visa-counter.jpg": {
        note: "photo · visa counter",
        tag: "Premium services",
        from: "assisted",
        h: "Visas and healthcare credentials",
      },
      "/img/15-home-doorway.jpg": {
        note: "photo · home, doorway",
        tag: "Consumer · HelloV",
        from: "30 min",
        h: "The people in your home",
      },
    },
  },

  /** `sections/Consumer.tsx`. `checkLines` is flat rather than nested per
   *  plan: the three lines are the same three strings in both cards, and
   *  the plans differ only in which of them they list and which one is
   *  struck through. `most` is one shared leaf with a boolean in the
   *  component for the same reason `blocks/LeadMock.tsx` keeps `on` there —
   *  which card is flashed is a choice about the card, not a word. */
  consumer: {
    k: "Consumer · HelloV",
    headingA: "Verify anyone.",
    headingB: "From your phone, in 30 minutes.",
    headingMob: "Verify anyone. From your phone, in 30 minutes.",
    lede: "Send a photo of the document over WhatsApp. We do the rest and message you back with the report.",
    ledeMob: "Send a photo of the document over WhatsApp. We message you back with the report.",
    note: "Prices are placeholders. Home staff, tenant and nanny packages priced the same way.",
    noteMob: "Prices are placeholders.",
    services: {
      driver: "Driver",
      homeStaff: "Home staff",
      tenant: "Tenant",
      nanny: "Nanny",
      verifyAnyone: "Verify anyone",
      cyberIdentity: "Cyber identity",
      knowIdentity: "Know the identity",
      knowContact: "Know your contact",
    },
    /** The currency mark is its own `<span className="cur">`, so its own
     *  text node — and it is copy, not a constant: a locale that prices in
     *  another currency changes this and the figure beside it together. */
    currency: "₹",
    per: "per check",
    most: "Most chosen",
    checkLines: {
      licence: "Driving licence check",
      criminal: "Criminal record check",
      address: "Current address check",
    },
    plans: {
      basic: { name: "Driver · Basic", price: "499", ready: "Ready in 30 min", cta: "Buy Basic" },
      advanced: { name: "Driver · Advanced", price: "799", ready: "Ready in 30 min", cta: "Buy Advanced" },
    },
  },

  /** `sections/Checks.tsx`. `items` is keyed by the ids the component
   *  already used to reference a check from two different orders, so the
   *  keyset here IS that file's existing vocabulary. The `at` positions,
   *  the `STOPS` table and the lane/bucket membership lists stay in the
   *  component: they are where a pin lands and which view shows it. */
  checks: {
    headingA: "33 checks.",
    headingB: "Most take minutes.",
    headingMob: "33 checks. Most take minutes.",
    lede: "Each check sits where it finishes. Green is an hour or less. The rest go to a registrar or a court and come back in days.",
    ledeMob: "Grouped by how long you wait, from upload to report.",
    more: "Plus 16 more — Cyber Identity, Know Your Contact, Financial Assessment, Promoter Criminal History and others.",
    /** The same words in the desktop footer's button and the mobile
     *  full-width one. One leaf; the two buttons differ only in geometry. */
    all: "All 33 checks",
    /** Rendered under the first lane only. One leaf and a boolean on that
     *  lane, rather than an optional field that would make `lanes` a ragged
     *  table — see this file's header. */
    zone: "an hour or less",
    /** Keyed by the axis position the label sits at, which is the same key
     *  the tick marks use. */
    axis: {
      "4%": "15 min",
      "26%": "1 hour",
      "62%": "1 day",
      "92%": "3 days",
    },
    items: {
      identity: { name: "Identity", time: "15 min" },
      pan: { name: "PAN", time: "15 min" },
      passport: { name: "Passport", time: "15 min" },
      age: { name: "Age", time: "15 min" },
      licence: { name: "Driving licence", time: "30 min" },
      rc: { name: "Registration certificate", time: "30 min" },
      digitalEmployment: { name: "Digital employment", time: "60 min" },
      moonlighting: { name: "Moonlighting", time: "60 min" },
      entitlement: { name: "Entitlement to work", time: "60 min" },
      employment: { name: "Employment", time: "2 days" },
      education: { name: "Education", time: "3 days" },
      credit: { name: "Credit", time: "15 min" },
      globalDatabase: { name: "Global database", time: "15 min" },
      criminal: { name: "Criminal", time: "30 min" },
      currentAddress: { name: "Current address", time: "30 min" },
      tradeLicence: { name: "Trade licence", time: "2 days" },
      /** Real JSX — the artboard split this title around the `&amp;`. The
       *  component's own comment says why in full; it is the same reason as
       *  the two lane headings below. */
      directorsGst: { name: <>Directors{" "}&amp;{" "}GST</>, time: "3 days" },
    },
    lanes: {
      l1: { k: "01 — Identity", t: "Who they are" },
      l2: { k: <>02 — Work{" "}&amp;{" "}education</>, t: "What they've done" },
      l3: { k: <>03 — Records{" "}&amp;{" "}risk</>, t: "What's on file" },
    },
    buckets: {
      fast: { big: "15–30 min", k: "Identity, documents, records" },
      hour: { big: "60 min", k: "Provident-fund and work-authorisation records" },
      slow: { big: "1–3 days", k: "Confirmed with a registrar, employer or authority" },
    },
  },

  /** `sections/International.tsx`. Keyed by photograph, as `whoItsFor` is.
   *  The flags stay in the component — they are drawings, and their hex is
   *  the `check:tokens` exemption that file's header records. `stats` is
   *  keyed by the same three ids as `statLabels` so the pairing is a type
   *  and not an index. */
  international: {
    headingA: "Verified in 120 countries.",
    headingB: "With a time you can plan around.",
    headingMob: "Verified in 120 countries. With a time you can plan around.",
    lede: "Local sources — the same courts, registries and licensing bodies a local employer would call. Start now and the report lands by the time shown.",
    courts: "Criminal records are checked across Supreme, High and District Courts and tribunals. Times are from upload, in your local time.",
    all: "All countries",
    readyBy: "Report ready by",
    statLabels: { audience: "For", count: "Checks", ready: "Ready in" },
    countries: {
      "/img/16-united-kingdom.jpg": {
        name: "United Kingdom",
        note: "photo · London street",
        stats: { audience: "Drivers", count: "2", ready: "30 min" },
        by: "Today, 4:12 PM",
      },
      "/img/17-philippines.jpg": {
        name: "Philippines",
        note: "photo · Manila, jeepney",
        stats: { audience: "Drivers", count: "3", ready: "30 min" },
        by: "Today, 4:12 PM",
      },
      "/img/18-uae.jpg": {
        name: "United Arab Emirates",
        note: "photo · Dubai skyline",
        stats: { audience: "House help", count: "3", ready: "24 hrs" },
        by: "Tomorrow, 9:00 AM",
      },
      "/img/19-singapore.jpg": {
        name: "Singapore",
        note: "photo · Singapore campus",
        stats: { audience: "Graduates", count: "1", ready: "3 days" },
        by: "Fri, 19 Sep",
      },
      "/img/20-egypt.jpg": {
        name: "Egypt",
        note: "photo · Cairo rooftops",
        stats: { audience: "Tenants", count: "3", ready: "30 min" },
        by: "Today, 4:12 PM",
      },
    },
  },

  /** `sections/Packages.tsx`. Each pack's `lines` is a keyed table and the
   *  component keeps the ORDER, which is the `COLS` shape from
   *  `chrome/SiteFooter.tsx` applied a second time. The count under the rule
   *  is still derived from that order's length, so the arithmetic the
   *  component's header defends is untouched.
   *
   *  `tot` IS A FUNCTION LEAF, the third shape `./index` lists. `{n} checks ·
   *  ready in` written as two children would emit nine `<!-- --> `separators
   *  the hand-written markup never had — that file measured it at 72 bytes —
   *  and a leaf of `" checks · ready in"` with the number concatenated at
   *  the call site would be a leaf with edge whitespace, which
   *  `tools/test/copy.test.ts` §3 rejects for the good reason that it is
   *  invisible in review. A function keeps the whole sentence in one place
   *  and lets a locale put the number anywhere in it. */
  packages: {
    headingA: "Or take a package.",
    headingB: "One upload, one answer.",
    headingMob: "Or take a package. One upload, one answer.",
    lede: "A fixed set of checks with one turnaround. Everything runs in parallel, so a package is only as slow as its slowest check.",
    ledeMob: "A fixed set of checks with one turnaround — as fast as its slowest check.",
    more: <>Trade licence, vendor risk{" "}&amp;{" "}premium packages</>,
    package: "Package",
    tot: (n: number) => `${n} checks · ready in`,
    buy: "Buy now",
    explore: "Explore",
    /** ONE FLAT TABLE for every line on every card, not a `lines` nested per
     *  pack — the shape `consumer.checkLines` already uses. Two reasons, and
     *  the first is a hard one. Nested, `PACKS` in the component is an array
     *  of six differently-shaped records and `t.packs[p.k].lines[l]` is the
     *  correlated-union problem: TypeScript cannot tie `p.k` to `p.lines`
     *  across a `.map()`, and `keyof` over the union of six `lines` objects
     *  is their INTERSECTION of keys, which is empty — the lookup does not
     *  compile. Second, three of these strings appear on two cards each
     *  ("Driving licence", "Criminal record", "Current address"), and nesting
     *  would put a translator in front of six rows where there are three
     *  decisions. */
    lines: {
      pan: "PAN card",
      rc: "Registration certificate",
      licence: "Driving licence",
      criminal: "Criminal record",
      education: "Education",
      employment: "Employment",
      moonlighting: "Moonlighting",
      address: "Current address",
      tradeLicence: "Trade licence",
      directors: "Defaulting directors",
      /** Plural, and NOT `criminal` above. The vendor card says "Criminal
       *  records" where the hiring cards say "Criminal record"; one leaf for
       *  both would have been a content change wearing a refactor's clothes. */
      criminalRecords: "Criminal records",
      /** Real JSX — another of the exporter's `&amp;` splits. */
      credit: <>Credit{" "}&amp;{" "}company</>,
      financial: "Financial assessment",
      gst: "GST screening",
      creditChecks: "Credit checks",
      promoter: "Promoter criminal history",
      form: "Application form filling",
      prescreen: "Document pre-screening",
      primary: "Primary source verification",
    },
    packs: {
      blueCollar: {
        hd: "Enterprise · SMB",
        tt: "Blue-collar hire",
        sub: "Drivers, riders, warehouse, security",
        ready: "30 minutes",
        who: "One upload from the candidate",
      },
      whiteCollar: {
        hd: "Enterprise · SMB",
        tt: "White-collar hire",
        sub: "Corporate, tech, finance, healthcare",
        ready: "3 days",
        who: "Registrar-confirmed",
      },
      driver: {
        hd: "Consumer · HelloV",
        tt: "Driver",
        sub: "For families and small fleets",
        ready: "30 minutes",
        who: "Also as Basic, without address",
      },
      tradeRisk: {
        hd: "Vendors · Certifier",
        tt: "Trade licence risk",
        sub: "Before you sign a supplier",
        ready: "2 days",
        who: "Certified vendor profile",
      },
      vendorRisk: {
        hd: "Vendors · Certifier",
        tt: "Vendor financial risk",
        sub: "Before the first purchase order",
        ready: "2 days",
        who: "Certified vendor profile",
      },
      visaHealth: {
        hd: "Premium services",
        tt: <>Visa{" "}&amp;{" "}healthcare</>,
        sub: "Applicants and licensing bodies",
        ready: "3 days",
        who: "Submission-ready file",
      },
    },
  },

  /** `sections/PeopleStrip.tsx`. TWO tables, not one with overrides, because
   *  the two breakpoints genuinely say different things — the desktop chip
   *  reads "Driving licence · 30 min" where the phone's reads
   *  "Licence · 30 min", and the phone drops the caption entirely. That is
   *  the measurement that file's header already carried; folding them here
   *  would have re-invented the shared string it refused to invent. Keyed by
   *  photograph, and `mob` is a subset of `dsk`'s keys by design. */
  peopleStrip: {
    strip: "Hires, tenants, drivers, suppliers, nannies. Anyone you need to trust.",
    times: "Times shown are from upload to report",
    dsk: {
      "/img/01-rider-bengaluru.jpg": {
        role: "Delivery rider",
        city: "Bengaluru",
        chip: "Driving licence · 30 min",
        note: "photo · delivery rider",
      },
      "/img/02-nurse-abudhabi.jpg": {
        role: "Nurse",
        city: "Abu Dhabi",
        chip: "Degree · 3 days",
        note: "photo · nurse",
      },
      "/img/03-engineer-manila.jpg": {
        role: "Software engineer",
        city: "Manila",
        chip: "Employment · 60 min",
        note: "photo · engineer",
      },
      "/img/04-nanny-gurugram.jpg": {
        role: "Nanny",
        city: "Gurugram",
        chip: "Criminal · 30 min",
        note: "photo · nanny",
      },
      "/img/05-warehouse-pune.jpg": {
        role: "Warehouse associate",
        city: "Pune · identity check, 00:41 elapsed",
        chip: "Reading Aadhaar…",
        note: "photo · warehouse",
      },
      "/img/06-supplier-cairo.jpg": {
        role: "Textile supplier",
        city: "Cairo",
        chip: "Trade licence · 2 days",
        note: "photo · supplier",
      },
      "/img/07-tenant-singapore.jpg": {
        role: "Tenant",
        city: "Singapore",
        chip: "Identity · 15 min",
        note: "photo · tenant",
      },
      "/img/08-cfo-london.jpg": {
        role: "Chief financial officer",
        city: "London",
        chip: "Global database · 15 min",
        note: "photo · executive",
      },
    },
    mob: {
      "/img/01-rider-bengaluru.jpg": {
        role: "Delivery rider",
        city: "Bengaluru",
        chip: "Licence · 30 min",
      },
      "/img/02-nurse-abudhabi.jpg": {
        role: "Nurse",
        city: "Abu Dhabi",
        chip: "Degree · 3 days",
      },
      "/img/03-engineer-manila.jpg": {
        role: "Software engineer",
        city: "Manila",
        chip: "Employment · 60 min",
      },
      "/img/04-nanny-gurugram.jpg": {
        role: "Nanny",
        city: "Gurugram",
        chip: "Criminal · 30 min",
      },
      "/img/05-warehouse-pune.jpg": {
        role: "Warehouse associate",
        city: "Pune · 00:41 elapsed",
        chip: "Reading Aadhaar…",
      },
      "/img/06-supplier-cairo.jpg": {
        role: "Textile supplier",
        city: "Cairo",
        chip: "Trade licence · 2 days",
      },
    },
  },

  /** `sections/Contact.tsx`.
   *
   *  THE CONSENT PARAGRAPH IS FIVE LEAVES ON DESKTOP, and that is the same
   *  deferral `chrome.consent.body` records rather than a different one. The
   *  markup is `{lead}{' '}<AppLink>{policy}</AppLink>{mid}{' '}<a>{email}</a>{end}`
   *  — seven children, with React's `<!-- -->` between every adjacent pair.
   *  A function leaf taking the two anchors as `ReactNode`s (the shape
   *  `./index` describes) would give a locale one sentence and let it put
   *  the links anywhere; it would also fold seven children into one, which
   *  is different bytes on every page carrying the closing band. `end` is a
   *  full stop on its own for exactly that reason, and it is the strongest
   *  argument in either namespace for making that change the day a second
   *  locale lands. */
  contact: {
    headingA: "Every great journey deserves a",
    headingEm: "verified",
    headingB: "beginning.",
    note: "photo · warm, people at work",
    sub: "Take the first step. We'll handle the rest.",
    k: "Talk to sales",
    consent: {
      lead: "By submitting, you consent to HelloVerify processing your data for lead generation and related communications, per our",
      policy: "Privacy Policy",
      mid: ". Withdraw any time at",
      email: "privacy@helloverify.com",
      end: ".",
      /** The phone says less and does not link the address, so its tail is
       *  ONE text node where desktop has three. Two leaves, not a slice of
       *  the desktop ones. */
      leadMob: "By submitting, you consent to HelloVerify processing your data for lead generation, per our",
      tailMob: ". Withdraw any time at privacy@helloverify.com.",
    },
    submit: "Submit",
  },

  /** `sections/CustomerStory.tsx`, which renders NOTHING today:
   *  `STORY_IS_ATTRIBUTABLE` is false and the component returns null before
   *  it reads any of this. The copy is migrated anyway — the layout is the
   *  shell a real story will reuse, and leaving one file in the directory
   *  outside the namespace is how a second migration pass gets forgotten.
   *  Every leaf below is about a person who does not exist; see that file's
   *  header before making any of it true. */
  customerStory: {
    kicker: "Customer story",
    pill: "SAMPLE — REPLACE",
    pillMob: "SAMPLE",
    quote: "“We onboard four hundred riders a week. Verification used to be the thing that slowed us down. Now it finishes before the induction video does.”",
    role: "Head of Fleet Operations",
    org: "Quick-commerce company, Bengaluru",
    /** The phone runs the role and the company into one line with a middot,
     *  so the middot is part of this node and not a separator the component
     *  adds. */
    orgMob: "· Quick-commerce company, Bengaluru",
    stats: {
      ridersValue: "1,600",
      ridersPlus: "+",
      ridersLabel: "riders verified a month",
      ridersMob: "1,600+",
      timeA: "5 days",
      timeTo: "to",
      timeB: "30 min",
      timeLabel: "time to a completed report, before and after",
      timeMob: "5 days to 30 min",
      timeLabelMob: "time to a report",
    },
    readStory: "Read the story",
  },

  /** `sections/Demo2.tsx`. The only band with no `.mob` tree — it is one
   *  `.wrap` at both widths — so nothing here is duplicated per breakpoint.
   *  Every row is written out longhand in the component with its own
   *  animation delay, so the leaves are keyed to be read beside it rather
   *  than iterated. */
  demo2: {
    kicker: "HelloVerify AI",
    headingA: "Watch it read",
    headingB: "a licence.",
    lede: "Every document starts here. Fields, forgery checks and the issuing office — in about a second, before a person touches it.",
    tabs: {
      licence: "Driving licence",
      degree: "Degree certificate",
      pan: "PAN card",
      passport: "Passport",
      more: "+29",
    },
    licence: { title: "Driving licence", region: "IND" },
    scan: { reading: "Reading · 0.9 s", sample: "sample document" },
    extracted: { heading: "Extracted · 14 fields", time: "0.9 s" },
    fields: {
      name: { l: "Name", v: "A. Ramesh" },
      dob: { l: "Date of birth", v: "14 Mar 1994" },
      licence: { l: "Licence no.", v: "KA03 2019 0041782" },
      vehicleClass: { l: "Class", v: "LMV · MCWG" },
      valid: { l: "Valid till", v: "13 Mar 2039" },
    },
    checksHeading: "Checks",
    checksVerdict: "All clear",
    checks: {
      /** Two more of the exporter's `&amp;` splits — real JSX, one leaf per
       *  title, for the reason given at `whoItsFor.cells`. */
      template: { l: <>Template{" "}&amp;{" "}fonts</>, s: "against Karnataka 2019 series", v: "match" },
      hologram: { l: <>Hologram{" "}&amp;{" "}microtext</>, s: "tamper scan", v: "clear" },
      face: { l: "Face vs. selfie", s: "liveness passed", v: "98%" },
      issuer: { l: "Issuer located", s: "registry reachable", v: "RTO Karnataka" },
    },
    foot: {
      msg: "Route: confirm at the source",
      sub: "a person takes it from here — RTO Karnataka",
      readyIn: "Ready in",
      time: "30 min",
    },
  },

  /** `sections/Presence.tsx`. `hours` is keyed rather than an array because
   *  an array leaf derives to `string[]` and a locale could then ship four
   *  axis labels where English ships five, which would silently mis-space
   *  the band — the component positions them at `i * 25%`. The offsets, the
   *  flags and the stagger stay in the component. */
  presence: {
    headingA: "Six offices.",
    headingB: "Twelve hours apart.",
    headingMob: "Six offices. Twelve hours apart.",
    lede: "From Manila to New York, office hours overlap so a request filed at night in one place is picked up in the morning somewhere else. Working hours shown in UTC; the green line is now.",
    ledeMob: "Working hours in UTC. The line is now.",
    hours: {
      h00: "00:00",
      h06: "06:00",
      h12: "12:00",
      h18: "18:00",
      h24: "24:00 UTC",
    },
    coverage: "Someone at a desk · 21 of 24 hours",
    /** Desktop only — the phone's row is the flag and the city, which that
     *  file's header names as the kind of omission a symmetrical rewrite
     *  invents. */
    local: "09–18 local",
    offices: {
      manila: "Manila",
      singapore: "Singapore",
      noida: "Noida",
      dubai: "Dubai",
      cairo: "Cairo",
      newYork: "New York",
    },
    govsHeading: "Governments we work with",
    govs: {
      mom: { name: "Ministry of Manpower", sub: "Singapore" },
      india: { name: "Government of India", sub: "Authorities" },
      ksa: { name: "Kingdom of Saudi Arabia", sub: "Authorities" },
      uae: { name: "United Arab Emirates", sub: "Authorities" },
      eu: { name: "European authorities", sub: "Verification workflows" },
    },
  },

  /** `sections/GovSeals.tsx` — homepage v2 "Governments we work with", the
   *  seals of state (desktop only). Every sentence is the canvas's, which took
   *  it verbatim from the old site and the MOM page; the five `name`/`where`
   *  pairs are `presence.govs` word for word. `micro` is one repeat of the
   *  ring of microtext a seal turns, `stamp` one repeat of the stamp's. The
   *  component supplies the joining spaces, so no leaf has edge whitespace. */
  govSeals: {
    kicker: "Governments we work with",
    kickerEnd: "Trust Infrastructure",
    heading: "Governments",
    headingEm: "We Work With",
    ledeLead: "Trusted by leading enterprises and government authorities across",
    ledeAnd: "and",
    closeLead: "Governments are not simply buying verification reports they are investing in",
    closeMark: "national trust infrastructure",
    closeTail: "that underpins every regulated interaction.",
    stamp: "PRIMARY SOURCE VERIFICATION · HELLOVERIFY ·",
    items: {
      mom: {
        name: "Ministry of Manpower",
        where: "Singapore",
        ledeName: "Singapore",
        micro: "MINISTRY OF MANPOWER · SINGAPORE · COMPASS FRAMEWORK · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 01 / 05",
        role: "Our Client — Ministry of Manpower (Singapore)",
        h: "HelloVerify is officially empanelled by Singapore’s Ministry of Manpower (MOM) to provide Primary Source Verification (PSV) for educational qualifications under the COMPASS framework.",
        p: "Empaneled PSV partner for Singapore Ministry of Manpower — EP, S Pass and COMPASS framework qualification verification.",
        facts: {
          f1: { k: "Framework", v: "COMPASS" },
          f2: { k: "Work passes", v: "All Work Pass Types Supported" },
          f3: { k: "Qualifications", v: "Degrees · Diplomas · Transcripts · Marksheets" },
          f4: { k: "Reach", v: "Degree equivalency assessments for 120+ countries" },
        },
        chain: { c1: "Institution", c2: "Accreditation body", c3: "Qualification record", c4: "Authority" },
        cap: "PSV verifies qualifications directly at the source, ensuring accurate, tamper-proof validation that strengthens fraud detection, protects reputation, and supports compliance.",
      },
      india: {
        name: "Government of India",
        where: "Authorities",
        ledeName: "India",
        micro: "GOVERNMENT OF INDIA · AUTHORITIES · TRUST INFRASTRUCTURE · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 02 / 05",
        role: "Government of India · Authorities",
        h: "Verify individuals before they receive a work permit, immigration approval, professional licence, security clearance, or access to regulated professions.",
        p: "Governments are not simply buying verification reports they are investing in national trust infrastructure that underpins every regulated interaction.",
        facts: {
          f1: { k: "Head office", v: "Noida" },
          f2: { k: "Coverage", v: "30+ checks across 120+ countries" },
          f3: { k: "Reports", v: "Evidence-Backed Reports" },
          f4: { k: "Platform", v: "AI Powered Trust Platform" },
        },
        chain: { c1: "Source of issue", c2: "Primary Source Verification", c3: "Verification artefacts", c4: "Authority" },
        cap: "Every verification is supported with clear remarks, verification artefacts and an auditable trail for confident decision making.",
      },
      ksa: {
        name: "Kingdom of Saudi Arabia",
        where: "Authorities",
        ledeName: "the Kingdom of Saudi Arabia",
        micro: "KINGDOM OF SAUDI ARABIA · HEALTH AUTHORITY · HEALTHCARE WORKFORCE · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 03 / 05",
        role: "Health Authorities · Kingdom of Saudi Arabia",
        h: "HelloVerify is a globally recognised verification partner trusted by health authority in Saudi Arabia.",
        p: "In the GCC’s fast-growing, highly regulated healthcare landscape, credentials are non-negotiable.",
        facts: {
          f1: { k: "Programme", v: "Primary Source Verification for Healthcare Workforce" },
          f2: { k: "Practitioners", v: "Doctor Practitioners · Non-physician · Pharmacists · Nurses and Midwives" },
          f3: { k: "Accreditation", v: "Each issuing authority’s accreditation is verified from government regulatory organisation/ministry." },
          f4: { k: "Reports", v: "Audit-ready reports that enable fast, defensible licensing decisions for government authorities." },
        },
        chain: { c1: "University", c2: "Accreditation body", c3: "Licensing authority", c4: "Health authority" },
        cap: "Primary Source Verification (PSV) - each record is verified from the source of issue.",
      },
      uae: {
        name: "United Arab Emirates",
        where: "Authorities",
        ledeName: "the United Arab Emirates",
        micro: "UNITED ARAB EMIRATES · AUTHORITIES · LONG-TERM DIGITAL INFRASTRUCTURE · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 04 / 05",
        role: "United Arab Emirates · Authorities",
        h: "The long-term value lies in trusted digital infrastructure that governments and regulators can rely on for years to come.",
        p: "The same platform verifies businesses, suppliers, contractors, and institutions unifying trust across public and private ecosystems.",
        facts: {
          f1: { k: "Office", v: "Dubai" },
          f2: { k: "Checks", v: "Criminal Records · Passport Check · Entitlement to Work" },
          f3: { k: "Reports", v: "Evidence-Backed Reports" },
          f4: { k: "Platform", v: "AI Powered Trust Platform" },
        },
        chain: { c1: "Source of issue", c2: "Primary Source Verification", c3: "Verification artefacts", c4: "Authority" },
        cap: "Every verification is supported with clear remarks, verification artefacts and an auditable trail for confident decision making.",
      },
      eu: {
        name: "European authorities",
        where: "Verification workflows",
        ledeName: "European authority verification workflows",
        micro: "EUROPEAN AUTHORITIES · EMBASSY OF LATVIA · EMBASSY OF ITALY · VERIFICATION WORKFLOWS ·",
        record: "Record 05 / 05",
        role: "Our Partners — Embassy of Latvia · Embassy of Italy",
        h: "AI-Powered Verification for Faster, Safer Immigration Decisions.",
        p: "Enable secure, compliant applicant screening with advanced fraud detection and real-time verification.",
        facts: {
          f1: { k: "Partners", v: "Embassy of Latvia · Embassy of Italy" },
          f2: { k: "Visas", v: "Tourist · Student · Work visa" },
          f3: { k: "Process", v: "Digital & Paperless Process" },
          f4: { k: "Alerts", v: "Clear Fraud Alerts" },
        },
        chain: { c1: "Applicant", c2: "Document pre-screening", c3: "Issuing sources", c4: "Embassy" },
        cap: "Real time verification of identity, education, employment, financial, criminal, and supporting records.",
      },
    },
  },

  /** `sections/GovDossiers.tsx` and `blocks/GovMom.tsx` — homepage v2
   *  "Government & International Authorities": four tabbed dossiers, the MOM
   *  COMPASS case and the premium services band (desktop only). Verbatim from
   *  the old site's government pages, the MOM page and the old "Premium
   *  Services" menu, as the canvas carries them. The canvas's per-dossier
   *  verdict and chain caption are hidden by its own final "minimal read"
   *  pass, so they are not ported and have no leaves here. */
  govDossiers: {
    kicker: "Solutions",
    sheet: "Sheet 05 / 12",
    heading: "Government &",
    headingEm: "International Authorities",
    lede: "Verify individuals before they receive a work permit, immigration approval, professional licence, security clearance, or access to regulated professions.",
    tabsLabel: "Government solutions",
    prev: "Previous dossier",
    next: "Next dossier",
    explore: "Explore More",
    talk: "Talk to Sales",
    selectAuthority: "Select Authority",
    authorities: { latvia: "Embassy of Latvia", italy: "Embassy of Italy" },
    momCta: "Ministry of Manpower (Singapore)",
    items: {
      health: {
        tab: "Health Authorities",
        n: "Dossier 01 / 04",
        count: "01 / 04",
        title: "Primary Source Verification for Healthcare Workforce",
        sub: "Ensure credential accuracy and regulatory compliance by verifying doctors, nurses, and allied professionals directly from issuing authorities.",
        chips: { c1: "Doctor Practitioners", c2: "Non-physician", c3: "Pharmacists", c4: "Nurses and Midwives" },
        proof: "HelloVerify is a globally recognised verification partner trusted by health authority in Saudi Arabia.",
        k: "Primary Source Verification",
        rows: {
          r1: { t: "Education Verification", p: "Direct verification with universities, colleges, or boards to confirm degree, field of study and complete status." },
          r2: { t: "Institute Accreditation Check", p: "Ensures the issuing institution is recognized and in good standing both domestically and internationally." },
          r3: { t: "Health License", p: "Verification with licensing authorities, medical councils, or equivalents to confirm license details." },
          r4: { t: "Certificate Of Good Standing", p: "Verification of the practitioner's standing, including any sanctions, suspensions, or disciplinary actions." },
          r5: { t: "Employment Verification", p: "Confirmation from previous or current employers regarding designation, department, employment type and dates." },
        },
        chain: { c1: "University", c2: "Accreditation body", c3: "Licensing authority", c4: "Health authority" },
        stamp: { big: "PSV", small: "VERIFIED AT SOURCE · TAMPER-PROOF VALIDATION ·" },
      },
      immigration: {
        tab: "Immigration Authorities",
        n: "Dossier 02 / 04",
        count: "02 / 04",
        title: "AI-Powered Verification for Faster, Safer Immigration Decisions.",
        sub: "Enable secure, compliant applicant screening with advanced fraud detection and real-time verification.",
        chips: { c1: "Tourist", c2: "Student", c3: "Work visa" },
        proof: "Our Partners — Embassy of Latvia · Embassy of Italy",
        k: "Why We Stand Out",
        rows: {
          r1: { t: "Digital & Paperless Process", p: "End to end digital verification from application to final decision." },
          r2: { t: "Clear Fraud Alerts", p: "AI driven fraud detection for forged documents and high risk applicants." },
          r3: { t: "Insightful and Informative Reports", p: "Audit-ready reports with complete traceability and compliance support." },
          r4: { t: "Customized Solutions", p: "We meticulously tailor our services in precise accordance with the embassy's specific requirements from the Applicant." },
          r5: { t: "Real-time Dashboards", p: "Real-time dashboards provide comprehensive visibility for efficient operational oversight." },
        },
        chain: { c1: "Applicant", c2: "Document pre-screening", c3: "Issuing sources", c4: "Embassy" },
        stamp: { big: "PRE-SCREENED", small: "APPLICANT VERIFICATION" },
      },
      manpower: {
        tab: "Manpower & Education",
        n: "Dossier 03 / 04",
        count: "03 / 04",
        title: "AI-Powered Education Equivalency & Qualification Checks",
        sub: "HelloVerify verifies educational qualifications for work-visa applicants including degree equivalency assessments for 120+ countries.",
        chips: { c1: "Degrees", c2: "Diplomas", c3: "Transcripts", c4: "Marksheets" },
        proof: "Our Client — Ministry of Manpower (Singapore)",
        k: "Our Verification Services",
        rows: {
          r1: { t: "Qualification Verification", p: "Verify degrees or diplomas awarded, graduation dates, transcripts and marksheets." },
          r2: { t: "Institution Accreditation", p: "Our accreditation check confirms that the institution is a legitimate and approved provider of degree programs, not a diploma or degree mill." },
          r3: { t: "Primary Source Verification", p: "PSV verifies qualifications directly at the source, ensuring accurate, tamper-proof validation that strengthens fraud detection, protects reputation, and supports compliance." },
          r4: { t: "Proactive Fraud Intelligence", p: "We flag fraudulent documents before approval." },
        },
        chain: { c1: "Institution", c2: "Accreditation body", c3: "Qualification record", c4: "Authority" },
        stamp: { big: "ACCREDITED", small: "INSTITUTION ACCREDITATION" },
      },
      trade: {
        tab: "Business & Trade",
        n: "Dossier 04 / 04",
        count: "04 / 04",
        title: "Authentication of credentials for foreign workers & business entities.",
        sub: "Empowering Business & Trade Authorities with comprehensive verification solutions that support visa compliance through accurate validation of identity, education, employment, and criminal records—helping reduce fraud and operational risk.",
        chips: { c1: "For Government and Diplomatic Missions", c2: "For Companies and Enterprises", c3: "For Hiring Agents and Recruitment Intermediaries" },
        proof: "Verifying business entities & directors for regulatory compliance",
        k: "For Government and Diplomatic Missions",
        rows: {
          r1: { t: "Strengthen National and Cross-Border Security", p: "Authenticate the credentials of foreign workers, applicants, or business entities engaging with institutions." },
          r2: { t: "Promote Transparent Mobility", p: "Support the safe, compliant migration of talent into the country especially amid growing employment inflows." },
          r3: { t: "Ensure Full Regulatory Compliance", p: "All verifications are aligned international due diligence standards." },
          r4: { t: "Scalable Integration", p: "API-ready infrastructure to seamlessly integrate into existing hiring or visa processing systems." },
        },
        chain: { c1: "Company registry", c2: "Directors", c3: "Workforce credentials", c4: "Authority" },
        stamp: { big: "AUTHENTICATED", small: "BUSINESS ENTITIES · DIRECTORS" },
      },
    },
    mom: {
      logoAlt: "Ministry of Manpower, Singapore",
      kicker: "Ministry of Manpower",
      sg: "(Singapore)",
      headingA: "Verify Your Qualifications.",
      headingB: "Get Your Work Pass.",
      intro: "HelloVerify is officially empanelled by Singapore’s Ministry of Manpower (MOM) to provide Primary Source Verification (PSV) for educational qualifications under the COMPASS framework.",
      passesK: "All Work Pass Types Supported",
      passes: { ep: "Employment Pass (EP)", s: "S Pass", one: "ONE Pass", pep: "PEP", tep: "TEP" },
      compassK: "Compass Framework · Two-Stage EP Eligibility",
      compassP: "From 1 September 2023, MOM requires all Employment Pass (EP) candidates (from any country) to pass a 2-stage eligibility framework.",
      stage1: { b: "Stage 1", t: "Meet the qualifying salary for your sector." },
      stage2: { b: "Stage 2", t: "Pass COMPASS with ≥ 40 points across salary, qualifications, diversity and support." },
      c2K: "Qualification Scoring (C2)",
      c2: {
        top: { t: "Top-tier institution degree", pts: "20 pts" },
        any: { t: "Any recognized institution degree", pts: "10 pts" },
        none: { t: "No degree / unverified", pts: "0 pts" },
      },
      unit: "pts",
      noteLead: "Under criterion C2, all post-secondary qualifications must be verified by an",
      noteMark: "empaneled vendor",
      pricingK: "Transparent pricing",
      pricingTag: "MOM · COMPASS",
      priceTitle: "Education Verification",
      priceSub: "Primary Source Verification conducted directly with issuing institutions worldwide.",
      currency: "SGD",
      amount: "108",
      per: "per qualification · SGD 99 +9% GST",
      addons: {
        acc: { t: "Accreditation", base: "SGD 30 +9% GST", total: "SGD 33" },
        express: { t: "Express Delivery ≤ 7 working days", base: "SGD 54 +9% GST", total: "SGD 59" },
      },
      cta: "Start Verification",
      who: "Receive Your Verification Report",
    },
    premium: {
      kicker: "Premium Services",
      heading: "Dedicated one-to-one support for seamless verification and application submission.",
      rows: {
        health: { t: "Doctor, Dentist & Other Health Practitioners", p: "Services designed to ensure accurate submission for healthcare professionals applying to authorities" },
        immigration: { t: "Immigration Documents Pre-Screening", p: "Personalized support to ensure accurate & hassle free visa pre-screening process" },
      },
    },
  },
};

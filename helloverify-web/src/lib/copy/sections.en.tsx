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
    lede: "Every figure here is a real count, not a target.",
    /** After the odometer and each card's figure: one leaf, four uses. */
    plus: "+",
    figures: {
      checks: { l: "checks completed since 2018, every one at the primary source." },
      clients: { v: "2,000", l: "enterprise clients globally, from fleets to health ministries." },
      countries: { v: "120", l: "countries where we can reach the issuing authority." },
      catalogue: { v: "33", l: "verification checks, from a driving licence to a director's default history." },
    },
    /** Homepage v2 from here. The figures, captions and `plus` above are
     *  reused as they are; these are the words the v2 board adds around
     *  them. The odometer prints the checks' figure, so it has no `v`. */
    kicker: "Proof",
    sheet: "Sheet 02 / 12",
    /** The odometer's digits, one rolling column per digit. The component
     *  rolls every character that is a digit and prints the rest (the group
     *  separators) as is, so a locale that groups differently only edits
     *  this string. */
    odometer: "20,000,000",
    recount: "Count again",
    pace: {
      lead: "checks verified since you opened this page",
      note: "About one every 14 seconds · our average pace since 2018",
    },
    /** The legend under each card: what one mark in its picture stands for. */
    keys: {
      clients: "One mark, one client",
      countries: "One tick, one country",
      catalogue: "One bar, one check",
    },
    /** Inside the dial, in the SVG. Decorative (`aria-hidden`) but visible. */
    dial: { a: "ISSUING", b: "AUTHORITIES" },
    /** The barcode's two ends: green bars are the fast checks. */
    code: { fast: "An hour or less", slow: "Days · registrar or court" },
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
    /** Homepage v2: the deck of eight cards beside the reasons (under them
     *  on a phone). The card copy is the canvas board's, word for word,
     *  including its capitalisation. `cardOf` is a template the client island
     *  fills (`{k}`, `{n}`) — a function cannot cross the server/client
     *  boundary as a prop. The motion labels repeat the hero's on purpose. */
    deck: {
      kicker: "What we do for governments",
      more: "Explore More",
      cardOf: "Card {k} of {n}",
      motion: { pause: "Pause motion", play: "Play motion" },
      cards: {
        health: {
          tag: "Health Authorities",
          title: "Primary Source Verification for Healthcare Workforce",
          line: "Verify healthcare professionals credentials from primary source",
          chips: ["Doctor Practitioners", "Non-physician", "Pharmacists", "Nurses and Midwives"],
        },
        immigration: {
          tag: "Immigration Authorities",
          title: "AI-Powered Verification for Faster, Safer Immigration Decisions.",
          line: "Streamlining pre-screening & verification of Visa Application process",
          chips: ["Tourist", "Student", "Work visa"],
        },
        manpower: {
          tag: "Manpower & Education",
          title: "AI-Powered Education Equivalency & Qualification Checks",
          line: "Verifying education qualification from primary source",
          chips: ["Degrees", "Diplomas", "Transcripts", "Marksheets"],
        },
        trade: {
          tag: "Business & Trade",
          title: "Authentication of credentials for foreign workers & business entities.",
          line: "Verifying business entities & directors for regulatory compliance",
          chips: ["Company registry", "Directors", "Workforce credentials"],
        },
        fraud: {
          tag: "Why We Stand Out",
          title: "Clear Fraud Alerts",
          line: "AI driven fraud detection for forged documents and high risk applicants.",
          chips: [],
        },
        dashboards: {
          tag: "Why We Stand Out",
          title: "Real-time Dashboards",
          line: "Real-time dashboards provide comprehensive visibility for efficient operational oversight.",
          chips: [],
        },
        reports: {
          tag: "Why We Stand Out",
          title: "Insightful and Informative Reports",
          line: "Audit-ready reports with complete traceability and compliance support.",
          chips: [],
        },
        integration: {
          tag: "For Government and Diplomatic Missions",
          title: "Scalable Integration",
          line: "API-ready infrastructure to seamlessly integrate into existing hiring or visa processing systems.",
          chips: [],
        },
      },
      /** Words inside the eight illustrations. The illustrations are
       *  `aria-hidden`, but a translator still has to see them. */
      art: {
        doctor: "Dr",
        licence: "Health License",
        verified: "Verified",
        rows: ["Education Verification", "Health License", "Certificate Of Good Standing"],
        flow: ["Applicant", "Document pre-screening", "Issuing sources", "Embassy"],
        countries: "120+",
        countriesUnit: "countries",
        degree: "Degree",
        registry: "Company registry",
        director: "Director",
        workforce: "Workforce credentials",
        risk: "High risk",
        live: "Real-time",
        audit: "Audit-ready",
        api: "API-ready",
        systems: ["Hiring", "Visa processing"],
      },
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
    /** Homepage v2 desktop — `sections/HowWeKnow.tsx`, which replaces this
     *  band's desktop tree and `demo2`'s (canvas sheet 04). It reuses
     *  `headingA`, `headingB`, every `steps.*.label` and `steps.*.cap`, and
     *  `lede` as the licence route's caption, all verbatim; what is new is
     *  below. `kicker` and `lede2` are `demo2`'s own words, repeated here so
     *  this band does not depend on one the lead will retire.
     *
     *  The two cases are SPECIMENS — fictional holders and case numbers,
     *  said so on the page (`specimen`) and on the documents. */
    v2: {
      kicker: "HelloVerify AI",
      sheet: "Sheet 04 / 12",
      lede2: "Every document starts here. Fields, forgery checks and the issuing office — in about a second, before a person touches it.",
      switchLabel: "Choose a route through the same machine",
      specimen: "Specimen document · illustrative",
      run: "Run · 16s loop",
      custody: "Chain of custody",
      verifying: "Verifying…",
      verified: "Verified",
      /** The ring of text on the stamp that lands on the document. */
      sealRing: "VERIFIED AT THE SOURCE · HELLOVERIFY ·",
      evKicker: "One result, and how we know",
      promiseA: "Accuracy is not our feature.",
      promiseEm: "It's our promise.",
      ev: { read: "Read by", confirmed: "Confirmed", artefact: "Artefact", reviewed: "Reviewed" },
      routes: {
        licence: {
          chip: "Driving licence · 30 min",
          role: "Delivery rider",
          city: "Bengaluru",
          caseNo: "CASE HV-0417 · DRIVING LICENCE · KARNATAKA",
          from: "09:40",
          to: "10:10",
          source: "RTO Karnataka · the source",
          verdict: "Verified · 30 min · 4 sources",
          hash: "SHA-256 · 4f9c…a21e",
          tiles: {
            t0: { k: "Template & fonts", v: "match" },
            t1: { k: "Face vs. selfie", v: "98%" },
            t2: { k: "Issuer located", v: "RTO Karnataka" },
          },
          logs: {
            l0: { t: "09:40:02", kind: "Upload", what: "Captured on the candidate's phone · sharp, no glare, all edges", who: "Candidate" },
            l1: { t: "09:40:03", kind: "Read", what: "14 fields extracted in 1.2 s", who: "HelloVerify AI" },
            l2: { t: "09:40:03", kind: "Check", what: "Template & fonts · match", who: "HelloVerify AI" },
            l3: { t: "09:40:04", kind: "Check", what: "Face vs. selfie · 98%", who: "HelloVerify AI" },
            l4: { t: "09:41:00", kind: "Route", what: "Request filed with the issuing office", who: "RTO Karnataka" },
            l5: { t: "10:08:12", kind: "Confirm", what: "Record matched · licence valid", who: "RTO Karnataka" },
            l6: { t: "10:09:40", kind: "Review", what: "Audit trail, 5 events", who: "K.S. · reviewer" },
            l7: { t: "10:10:00", kind: "Report", what: "Sarathi record · PDF · hashed · shared with HR", who: "HelloVerify" },
          },
          evTitle: "Driving licence",
          evRead: "HelloVerify AI · 14 fields · 1.2 s",
          evConfirmed: "RTO Karnataka · 10:08",
          evArtefact: "Sarathi record · PDF · hashed",
          evReviewed: "K.S. · audit trail, 5 events",
          /** The words printed on the specimen licence, and the tags on the
           *  four fields the scan boxes. Decorative (`aria-hidden`). */
          doc: {
            title: "DRIVING LICENCE",
            specimen: "SPECIMEN",
            micro: "SAMPLE DOCUMENT · ILLUSTRATIVE · NOT A REAL LICENCE · SAMPLE DOCUMENT · ILLUSTRATIVE",
            f1: { l: "NAME", v: "A. RAMESH", tag: "NAME" },
            f2: { l: "LICENCE NO.", v: "KA05 •••• 4812", tag: "LICENCE" },
            f3: { l: "CLASS", v: "LMV · MCWG", tag: "CLASS" },
            f4: { l: "VALID TILL", v: "13 · 03 · 2039", tag: "VALID" },
            sign: "HOLDER SIGNATURE",
          },
        },
        degree: {
          chip: "Degree · 3 days",
          role: "Nurse",
          city: "Abu Dhabi",
          cap: "A nurse's degree, start to finish. Three days, on loop.",
          caseNo: "CASE HV-2291 · DEGREE · PRIMARY SOURCE",
          from: "Mon 09:40",
          to: "Wed 14:20",
          source: "University registrar · the source",
          verdict: "Verified · 3 days · 4 sources",
          hash: "SHA-256 · 7b1d…09c4",
          tiles: {
            t0: { k: "Template & fonts", v: "match" },
            t1: { k: "Institution", v: "accredited" },
            t2: { k: "Issuer located", v: "Registrar" },
          },
          logs: {
            l0: { t: "Mon 09:40", kind: "Upload", what: "Degree, transcripts and passport · applicant portal", who: "Applicant" },
            l1: { t: "Mon 09:40", kind: "Read", what: "11 fields extracted in 1.4 s", who: "HelloVerify AI" },
            l2: { t: "Mon 09:41", kind: "Check", what: "Template & fonts · match", who: "HelloVerify AI" },
            l3: { t: "Mon 09:41", kind: "Check", what: "Institution · accredited", who: "HelloVerify AI" },
            l4: { t: "Mon 09:42", kind: "Route", what: "Request filed with the registrar", who: "Office of the Registrar" },
            l5: { t: "Wed 14:18", kind: "Confirm", what: "Record matched · degree conferred", who: "Office of the Registrar" },
            l6: { t: "Wed 14:19", kind: "Review", what: "Audit trail, 9 events", who: "M.A. · reviewer" },
            l7: { t: "Wed 14:20", kind: "Report", what: "Registrar letter · PDF · hashed · to the authority", who: "HelloVerify" },
          },
          evTitle: "Degree certificate",
          evRead: "HelloVerify AI · 11 fields · 1.4 s",
          evConfirmed: "University registrar · Wed 14:20",
          evArtefact: "Registrar letter · PDF · hashed",
          evReviewed: "M.A. · audit trail, 9 events",
          doc: {
            specimen: "SPECIMEN",
            issuer: "ISSUING UNIVERSITY · ILLUSTRATIVE",
            certify: "This is to certify that",
            f1: { v: "S. Mathew", tag: "NAME" },
            f2: { v: "Bachelor of Science in Nursing", tag: "DEGREE" },
            f3: { v: "REG · 2291", tag: "REF." },
            f4: { v: "AWARDED 12 · 06 · 2016", tag: "AWARDED" },
            sign: "REGISTRAR",
          },
        },
      },
    },
  },

  /** `sections/WhoItsFor.tsx`. Keyed by photograph, which is the one field
   *  of a bento cell that is neither copy nor duplicated — the same
   *  argument `chrome.footer.links` makes for keying by href.
   *
   *  PHONE ONLY since the Sep 2026 perf pass, which deleted the band's
   *  never-shown desktop tree (homepage v2 gave its audiences their own
   *  bands). The leaves only that tree read went with it: `headingA`,
   *  `headingB`, `lede`, the six placeholder `note`s, and the first cell's
   *  desktop tag "Governments & authorities" — whose phone tag
   *  "Governments" was the ragged `mobTag` field and is now plain `tag`, so
   *  the table is square again. */
  whoItsFor: {
    headingMob: "For the moment you need to trust someone.",
    cells: {
      "/img/10-ministry-hall.jpg": {
        tag: "Governments",
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
        /** Real JSX. The artboard exporter split these two tags around the
         *  `&amp;`, so each is five text children with React's `<!-- -->`
         *  between them; a plain `"Enterprise & SMB · BGV"` collapses them
         *  to one and moves the bytes. Same note as `Packages.tsx`'s `tt` and
         *  `Checks.tsx`'s lane headings. */
        tag: <>Enterprise{" "}&amp;{" "}SMB · BGV</>,
        from: "from 30 min",
        h: "Every hire, white-collar and blue",
      },
      "/img/12-phone-signup.jpg": {
        tag: <>KYC · Trust{" "}&amp;{" "}Safety</>,
        from: "15 min",
        h: "Customers, verified at signup",
      },
      "/img/13-factory-floor.jpg": {
        tag: "Vendors · Certifier",
        from: "from 2 days",
        h: "Know who you buy from",
      },
      "/img/14-visa-counter.jpg": {
        tag: "Premium services",
        from: "assisted",
        h: "Visas and healthcare credentials",
      },
      "/img/15-home-doorway.jpg": {
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
    /** Homepage v2 (desktop): the HelloV storefront — eight photo panels,
     *  a price card, the QR steps and the phone. `k`, `headingA`, `headingB`
     *  and `lede` above are said again by this tree, string for string, so
     *  they are not repeated here. The product names, one-liners and check
     *  lists are the old homepage tabs and `/products/hellov`, verbatim; a
     *  service without `price` shows the placeholder, which is deliberate
     *  until the founder confirms the figure. */
    shop: {
      sheet: "Sheet 08 / 12",
      lede: "The nannies, house staff, drivers, and tenants you trust with your home deserve thorough verification. 100% digital, fast and accurate — so you never have to wonder about the people closest to your family.",
      whatsapp: "WhatsApp",
      eta: "30 mins",
      tiers: { basic: "Basic", advanced: "Advanced" },
      tierNames: { basic: "Basic", advanced: "Advanced Package" },
      popular: "MOST POPULAR",
      currency: "INR",
      tbc: { mark: "₹ —", note: "price to confirm" },
      buy: "Buy Now",
      /** Prefixes the Advanced price on a closed panel: "from ₹1799". */
      from: "from",
      groups: { home: "In your home", online: "Online" },
      qr: "QR code: verify on WhatsApp",
      steps: {
        s1: { k: "STEP 01", t: "Scan QR Code using Whatsapp Camera" },
        s2: { k: "STEP 02", t: "Select who you want to verify" },
        s3: { k: "STEP 03", t: "The Person being verified using Whatsapp Camera" },
      },
      /** The phone replays its chat on a loop, so it carries the hero's pause
       *  (WCAG 2.2.2) — the same two words. */
      motion: { pause: "Pause motion", play: "Play motion" },
      services: {
        driver: {
          short: "Driver",
          title: "Driver Verification",
          line: "Comprehensive driver verification ensures safe and reliable hiring.",
          basic: ["Driving License Check", "Criminal Check"],
          advanced: ["Driving License Check", "Criminal Check", "Voter Id Check", "Address Check"],
          price: "₹1799",
        },
        homeStaff: {
          short: "Home Staff",
          title: "Home Staff Verification",
          line: "End to end home staff verification ensures safe and trustworthy hiring.",
          basic: ["Identity Check", "Criminal Check"],
          advanced: ["Voter Id Check", "Criminal Check", "Address Check"],
          price: "₹1399",
        },
        tenant: {
          short: "Tenant",
          title: "Tenant Verification",
          line: "End-to-end tenant checks including credit, criminal, and identity signals.",
          basic: ["Identity Check", "Criminal Check"],
          advanced: ["Credit Check", "Criminal Check", "Aadhaar Check"],
          price: "₹1799",
        },
        nanny: {
          short: "Nanny",
          title: "Nanny Verification",
          line: "Trusted nanny verification covering identity, criminal, and address checks for your family.",
          basic: ["Identity Check", "Criminal Check"],
          advanced: ["Identity Check", "Criminal Check", "Address Check"],
          price: "₹1399",
        },
        verifyAnyone: {
          short: "Verify Anyone",
          title: "Verify Anyone",
          line: "Know your tenant, tutor, caretaker, or anyone else with fast identity and background checks.",
          basic: ["Identity Check", "Criminal Check"],
          advanced: ["Identity Check", "Criminal Check", "Current Address Check"],
        },
        cyberIdentity: {
          short: "Cyber Identity",
          title: "Cyber Identity Verification",
          line: "Comprehensive cyber identity verification to protect against online fraud and impersonation.",
          basic: ["Identity Check", "Criminal Check"],
          advanced: ["Identity Check", "Criminal Check", "Social Media Check"],
        },
        knowIdentity: {
          short: "Know The Identity",
          title: "Know The Identity",
          line: "Protect yourself from online identity fraud with fast document and database verification.",
          basic: ["Identity Check"],
          advanced: ["Identity Check", "Criminal Check"],
        },
        knowContact: {
          short: "Know Your Contact",
          title: "Know Your Contact",
          line: "Protect yourself from frauds — verify picture, ID, and location before you trust a contact.",
          basic: ["Identity Check", "Criminal Check"],
          advanced: ["Identity Check", "Criminal Check", "Email Verification Check"],
        },
      },
      /** The chat the phone plays for each service. The driver's is
       *  `blocks.helloVPhone` itself; these four swap the lines that name the
       *  person and the document, in the same bubbles, so the timing is shared.
       *  All four online services play `online`. */
      chats: {
        homeStaff: {
          ask: "Our new cook starts Monday. Advanced please.",
          request: "Send a photo of her Voter ID, front and back.",
          doc: "Voter ID",
          read: { lead: "Read in 1.1 s ·", plate: "ABC •••• 4417", tail: ". Checking with the courts and her address now." },
          rows: ["Voter ID · valid", "Criminal record · none found", "Address · confirmed"],
          elapsed: "26 min",
        },
        tenant: {
          ask: "A tenant for our flat. Advanced please.",
          request: "Send a photo of his Aadhaar, front and back.",
          doc: "Aadhaar",
          read: { lead: "Read in 1.0 s ·", plate: "XXXX •••• 5720", tail: ". Running credit and court checks now." },
          rows: ["Aadhaar · valid", "Criminal record · none found", "Credit · checked"],
          elapsed: "29 min",
        },
        nanny: {
          ask: "A nanny for our daughter. Advanced please.",
          request: "Send a photo of her ID, front and back.",
          doc: "Identity card",
          read: { lead: "Read in 1.2 s ·", plate: "identity matched", tail: ". Checking with the courts and her address now." },
          rows: ["Identity · matched", "Criminal record · none found", "Address · confirmed"],
          elapsed: "28 min",
        },
        online: {
          ask: "Someone I met online. Can you check them?",
          request: "Send their photo and their ID.",
          doc: "Identity card",
          read: { lead: "Read in 1.3 s ·", plate: "photo matched", tail: ". Checking picture, ID and location now." },
          rows: ["Identity · matched", "Criminal record · none found", "Email · verified"],
          elapsed: "22 min",
        },
      },
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
    lede: "Each check sits where it finishes. Green is an hour or less. The rest go to a registrar or a court and come back in days.",
    more: "Plus 16 more — Cyber Identity, Know Your Contact, Financial Assessment, Promoter Criminal History and others.",
    /** The link in the race's last tile. */
    all: "All 33 checks",
    /** The readout's resting label, over "13 of 17". */
    zone: "an hour or less",
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
      /** Real JSX — the artboard split this title around the `&amp;`, and
       *  the port kept its five text nodes rather than retype the string. */
      directorsGst: { name: <>Directors{" "}&amp;{" "}GST</>, time: "3 days" },
    },
    /** Homepage v2: the chronograph race. The tiles reuse `items`
     *  above; the readout's resting label reuses `zone`. The `{n}`/`{total}`
     *  strings are templates the client island fills, because a function leaf
     *  cannot be passed to a Client Component as a prop. */
    race: {
      groups: { identity: "Identity", work: "Work & education", records: "Records & risk" },
      checking: "Checking",
      elapsed: "Elapsed",
      min: "{n} min",
      hour: "{n} hour",
      hours: "{n} hours",
      day: "{n} day",
      days: "{n} days",
      ofTotal: "{n} of {total}",
      done: "of {total} done",
      keyFast: "An hour or less",
      keySlow: "Days · registrar or court",
      run: "Run the clock",
      restart: "Restart the clock",
      again: "Run it again",
      dialMin: "MIN",
      dialDays: "DAYS",
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
    /** Homepage v2 (desktop): the globe. `headingA`, `headingB`, `lede`,
     *  `courts` and `all` above are said again by this tree. Each pin's card
     *  quotes what the site already says about that country — the Saudi
     *  health-authority programme, the MOM empanelment, the embassy
     *  partners, the office pages — and its `rows` are ragged on purpose:
     *  a card lists what there is to say, so they are an array, not a table. */
    globe: {
      kicker: "Global Verification",
      sheet: "Sheet 09 / 12",
      canvas: "Interactive globe showing HelloVerify countries",
      hud: "HelloVerify network",
      /** The HUD's live read-out and each card's coordinates. */
      compass: { n: "N", s: "S", e: "E", w: "W" },
      legend: { hq: "Head office", office: "Office", route: "Verification route" },
      spin: "Spin",
      speeds: { still: "Still", slow: "Slow", steady: "Steady", fast: "Fast" },
      close: "Back to the world view",
      world: {
        k: "International Background Verification",
        big: "120",
        plus: "+",
        line: "countries where we can reach the issuing authority.",
        officesK: "Our Offices",
        offices: ["Egypt", "India", "Philippines", "Singapore", "United Arab Emirates", "United States"],
        tip: "Drag the globe · click a flag",
      },
      pins: {
        in: {
          name: "India",
          role: "Head office · Noida",
          head: "Trusted by India’s top IT/ITES companies for Background Verification",
          rows: [
            { k: "Checks", v: "20M+ completed since 2018" },
            { k: "Clients", v: "India’s largest IT company · India’s largest Fintech company" },
            { k: "Registry", v: "National Skills Registry" },
            { k: "Government", v: "Government of India · Authorities" },
          ],
        },
        sa: {
          name: "Saudi Arabia",
          /** The pin has no flag drawing; it shows this code instead. */
          code: "KSA",
          role: "Health authority · Primary Source Verification",
          head: "HelloVerify is a globally recognised verification partner trusted by health authority in Saudi Arabia.",
          rows: [
            { k: "Programme", v: "Primary Source Verification for Healthcare Workforce" },
            { k: "Categories", v: "Doctor Practitioners · Non-physician · Pharmacists · Nurses and Midwives" },
            { k: "Reports", v: "Audit-ready, for fast, defensible licensing decisions" },
          ],
        },
        ae: {
          name: "United Arab Emirates",
          role: "Office · Dubai",
          head: "Ensure safe hiring in the United Arab Emirates with trusted house help verification including identity, criminal history and work eligibility.",
          rows: [
            { k: "Checks", v: "Criminal Records · Passport Check · Entitlement to Work" },
            { k: "Ready in", v: "24 hrs" },
            { k: "Government", v: "United Arab Emirates · Authorities" },
          ],
        },
        sg: {
          name: "Singapore",
          role: "Office · Ministry of Manpower",
          head: "HelloVerify is officially empanelled by Singapore’s Ministry of Manpower (MOM) to provide Primary Source Verification (PSV) for educational qualifications under the COMPASS framework.",
          rows: [
            { k: "Work passes", v: "Employment Pass (EP) · S Pass · ONE Pass · PEP · TEP" },
            { k: "Education check", v: "SGD 108 per qualification" },
            { k: "Express", v: "≤ 7 working days" },
          ],
        },
        ph: {
          name: "Philippines",
          role: "Office · Manila",
          head: "Trusted driver verification in the Philippines including criminal and driving license verification checks.",
          rows: [
            { k: "Checks", v: "Criminal Records · Driving License Check · Global Database Check" },
            { k: "Ready in", v: "30 min" },
          ],
        },
        eg: {
          name: "Egypt",
          role: "Office · Cairo",
          head: "Comprehensive tenant verification in Egypt, including identity, criminal history and financial status.",
          rows: [
            { k: "Checks", v: "Criminal Records · Identity Check · Credit Check" },
            { k: "Ready in", v: "30 min" },
          ],
        },
        gb: {
          name: "United Kingdom",
          role: "Local sources",
          head: "Hire drivers you can trust.",
          rows: [
            { k: "For", v: "Drivers" },
            { k: "Checks", v: "2" },
            { k: "Ready in", v: "30 min" },
          ],
        },
        it: {
          name: "Italy",
          role: "Embassy partner · immigration",
          head: "Our Partners — Embassy of Italy. Streamlining pre-screening and applicant verification.",
          rows: [
            { k: "Programme", v: "Immigration documents pre-screening" },
            { k: "Visas", v: "Tourist · Student · Work" },
          ],
        },
        lv: {
          name: "Latvia",
          role: "Embassy partner · immigration",
          head: "Our Partners — Embassy of Latvia. Streamlining pre-screening and applicant verification.",
          rows: [
            { k: "Programme", v: "Immigration documents pre-screening" },
            { k: "Visas", v: "Tourist · Student · Work" },
          ],
        },
        us: {
          name: "United States",
          role: "Office · New York",
          head: "From Manila to New York, office hours overlap so a request filed at night in one place is picked up in the morning somewhere else.",
          rows: [
            { k: "Offices", v: "Six offices. Twelve hours apart." },
            { k: "Coverage", v: "Someone at a desk · 21 of 24 hours" },
          ],
        },
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
    lede: "A fixed set of checks with one turnaround. Everything runs in parallel, so a package is only as slow as its slowest check.",
    /** The count over a card's check list, and the label on the
     *  photograph's glass chip. Server-rendered, so the count can be a
     *  function leaf. */
    count: (n: number) => `${n} checks`,
    readyIn: "Ready in",
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
    /** v2 desktop: the label over the checkpoint the photographs pass
     *  through. Decorative (`aria-hidden`), but a word a translator sees. */
    checkpoint: "At the source",
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

  /** `sections/OneInEight.tsx` (homepage v2, desktop only — a new band with
   *  no phone tree yet). The canvas's wording, verbatim. The two figures
   *  (`1 in 8`, `12–14%`) carry footnote `1`, whose own text says the source
   *  is still to be confirmed; they are the authority pages' claims, not new
   *  ones.
   *
   *  The eight certificates are SYNTHETIC — fictional institutions and people,
   *  said so in `bar` — and the sixth (`westmarch`) is the forgery. Their
   *  words are here because they are words on the page; which one is forged
   *  is the component's decision, not copy. */
  oneInEight: {
    sheet: "Sheet 03 / 12",
    flag: "Fraud",
    /** `headingEm` + " " + `heading` is the sentence; the italic figure is its
     *  own node. `fn` is the footnote mark both figures carry. */
    headingEm: "1 in 8",
    heading: "applicants misrepresent their academic credentials.",
    lede: "We flag fraudulent documents before approval. Our system detects fraud in 12–14% of applications.",
    fn: "1",
    footnote: "Figures as published on HelloVerify’s authority pages. Source and period to be confirmed before launch.",
    bar: "Evidence table · 8 applications · illustrative, synthetic documents",
    /** The live status reads `${n} ${checked}` until the forgery is found. */
    checked: "of 8 checked",
    found: "7 verified · 1 referred",
    certify: "This is to certify that",
    /** `${checkCert} ${inst}` — the accessible name of each certificate. */
    checkCert: "Check the certificate from",
    certs: {
      aldermoor: { inst: "Aldermoor University", deg: "Bachelor of Science in Nursing", name: "A. Rahman", yr: "2018" },
      kestrel: { inst: "Kestrel Institute of Technology", deg: "Bachelor of Technology", name: "P. Iyer", yr: "2017" },
      meridia: { inst: "University of Meridia", deg: "Master of Business Administration", name: "L. Santos", yr: "2020" },
      lindenfield: { inst: "Lindenfield College of Health", deg: "Diploma in Pharmacy", name: "M. Haddad", yr: "2016" },
      harbourline: { inst: "Harbourline University", deg: "Bachelor of Commerce", name: "S. Tan", yr: "2019" },
      westmarch: { inst: "Westmarch International University", deg: "Bachelor of Science in Nursing", name: "R. Menon", yr: "2019" },
      crestvale: { inst: "Crestvale School of Medicine", deg: "Doctor of Medicine", name: "N. Farouk", yr: "2015" },
      aurelian: { inst: "St. Aurelian College", deg: "Bachelor of Arts", name: "J. Cruz", yr: "2021" },
    },
    /** What the UV lamp shows. Decorative (`aria-hidden`); `uvTop` is
     *  followed by the certificate's institution, upper-cased by CSS. */
    uv: {
      top: "VERIFIED AT SOURCE ·",
      bottom: "PRIMARY SOURCE · HELLOVERIFY · PRIMARY SOURCE ·",
      none: "no UV features",
      loupe: "UV · 365 nm",
    },
    referred: "REFERRED",
    notVerified: "NOT VERIFIED",
    nakedA: "Identifies hidden inconsistencies",
    nakedEm: "invisible to the naked eye.",
    hint: "Move the lamp over the documents, or",
    reveal: "Show me the forgery",
    reset: "Reset the table",
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
    /** v2 swapped the last sentence, which described the old day band, for
     *  the map's instruction. */
    lede: "From Manila to New York, office hours overlap so a request filed at night in one place is picked up in the morning somewhere else. Drag the sun to see who is at a desk.",
    hours: {
      h00: "00:00",
      h06: "06:00",
      h12: "12:00",
      h18: "18:00",
      h24: "24:00 UTC",
    },
    offices: {
      manila: "Manila",
      singapore: "Singapore",
      /** Labelled New Delhi on the homepage map on review (24 Sep 2026); the
       *  key stays `noida`, which the sun map and the flag defs share. The
       *  head office everywhere else (schema, llms.txt, /about, /contact) is
       *  still Noida. */
      noida: "New Delhi",
      dubai: "Dubai",
      cairo: "Cairo",
      newYork: "New York",
    },
    /** Homepage v2: the follow-the-sun map (`sections/SunStage.tsx`,
     *  a client island, so every string reaches it as a prop). A `{name}` is
     *  filled in by the island; a function leaf cannot cross the server/client
     *  boundary. The cities are `offices` above and the axis is `hours`. */
    sun: {
      hint: "Drag the sun",
      back: "Back to now",
      play: "Play 24 hours",
      pause: "Pause",
      map: "World map showing day and night over the six HelloVerify offices",
      /** Drawn on the canvas, which is `role="img"` with `map` as its name. */
      noon: "NOON",
      midnight: "MIDNIGHT",
      /** What the clock and the office times show before the page knows the
       *  time: the server cannot, and must not guess (hydration). */
      clock: "--:--",
      yourTime: "{day} · your time",
      days: { sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat" },
      utc: "{time} UTC",
      open: "{n} of 6 offices open",
      openNow: "{n} of 6 offices open now",
      atDesk: "at a desk now",
      closed: "closed",
      countries: {
        manila: "Philippines",
        singapore: "Singapore",
        noida: "India",
        dubai: "UAE",
        cairo: "Egypt",
        newYork: "USA",
      },
      /** The same countries as they read after "in": "filed in the USA". */
      countriesIn: {
        manila: "the Philippines",
        singapore: "Singapore",
        noida: "India",
        dubai: "the UAE",
        cairo: "Egypt",
        newYork: "the USA",
      },
      relay: "A request filed in {from} at {fromTime} is picked up in {to} at {toTime}.",
      allClosed: "Every desk is closed. {office} opens in {h}h {m}m.",
      allOpen: "Every office is at a desk.",
      coverage: "Someone at a desk · {n} of 24 hours",
      hour: "{h}:00 UTC",
    },
  },

  /** `sections/Enterprises.tsx` — homepage v2, desktop only (the "trust
   *  perimeter" board, Sep 2026). Every string is the canvas's, which took
   *  them word for word from the old enterprise, employee-verification, KYC
   *  and Certifier pages — capitalisation and spellings included
   *  ("Liveliness Check", "What Our Client Speak"). Chips, steps and rows are
   *  keyed by what they name, so a reorder is a component change. */
  enterprises: {
    kicker: "Large Enterprises",
    sheet: "Sheet 06 / 12",
    headingA: "Background Checks For",
    headingB: "Every Part of Your Organization",
    lede: "Our combination of AI-powered automation and dedicated in-house verification experts helps detect fraud while delivering a seamless experience for genuine applicants.",
    select: "Select who you're screening",
    core: "Your organization",
    stopA: "Stop Bad Hires",
    stopB: "Before They Happen",
    explore: "Explore More",
    sales: "Talk to Sales",
    rings: { employees: "Employees", customers: "Customers", businesses: "Businesses" },
    employees: {
      k: "01 · Employees",
      tag: "Large Enterprises",
      h: "Unified verification for large-scale white-collar and blue-collar hiring with custom workflows, speed, accuracy, and compliance.",
      white: {
        t: "White-Collar Employee Verification",
        p: "Verify professional credentials, employment history and identity to ensure trustworthy corporate hiring.",
        chips: {
          education: "Education Check",
          employment: "Employment Check",
          identity: "Identity Check",
          criminal: "Criminal Record Check",
          reference: "Reference Check",
          global: "Global Database Check",
        },
      },
      blue: {
        t: "Blue-Collar Employee Verification",
        p: "Fast and reliable blue-collar verification to reduce hiring risks and onboard trusted talent with confidence.",
        chips: {
          pan: "Pan Card Check",
          rc: "Registration Certificate Check",
          licence: "Driving License Verification",
          criminal: "Criminal Records Check",
          pennyDrop: "Penny Drop Check",
          liveness: "Liveness Check",
        },
      },
      /** NEW MICROCOPY (24 Sep 2026), not from the old site: the button on
       *  each ID badge that turns it to the description on its back. */
      turn: "Turn over",
      intK: "Automated Workforce Onboarding",
      ints: {
        hrms: "HRMS API & Integration",
        rules: "Automated Rules Engine",
        tracking: "Real Time Tracking",
        security: "Enterprise Grade Security",
      },
    },
    customers: {
      k: "02 · Customers",
      tag: "KYC Platform",
      hA: "Onboard faster.",
      hB: "Detect fraud earlier.",
      lead: "Our comprehensive KYC solution brings every step of the digital onboarding process together creating a seamless experience that keeps fraudsters out and genuine customers moving forward.",
      /** NEW MICROCOPY (24 Sep 2026): the heading over the phone's step list,
       *  taken from the lead's own "every step of the digital onboarding". */
      stepsK: "Every step of digital onboarding",
      steps: {
        upload: "The user uploads a photo of their ID",
        selfie: "User takes a Selfie",
        face: "Facial Recognition",
        liveliness: "Liveliness Check",
        decision: "Get Decision",
        onboard: "Onboard the Customer",
      },
      grid: {
        kyc: { b: "KYC", s: "Identity Verification · Location Confirmation · Liveliness Check · Facial Recognition" },
        kyb: { b: "KYB", s: "GST Verification · MCA Verification · Udyog/Udyam Aadhaar · Company PAN" },
        underwriting: { b: "Underwriting", s: "GST-Lite & Advanced · Bank Statement Analysis · ITR Check · MCA Data Pull" },
        fraud: { b: "Fraud & Risk", s: "Court Record Check · PAN Aadhaar Link · Email Risk Analysis · 1:N Face-Match" },
        execute: { b: "Execute", s: "Bank Account Validation · E-sign · Device Fingerprinting · E-stamp" },
        aml: { b: "AML", s: "Perform real-time screening · Monitor transactions continuously · Conduct comprehensive risk assessments" },
      },
    },
    businesses: {
      k: "03 · Businesses",
      tag: "Certifier",
      h: "We are redefining third-party verification for B2B businesses delivering fast, reliable authentication of identities and documents that modern enterprises demand.",
      stepsK: "Verified in 4 steps, no paperwork",
      steps: {
        invite: "Send Invite",
        info: "Enter Personal Information",
        location: "Location Captured",
        selfie: "Upload Selfie & ID Proof",
      },
      pts: {
        blacklist: {
          b: "Stop Previously Blacklisted vendors",
          s: "Certifier raises the bar on vendor qualification identifying only those entities that are fully compliant, genuinely reliable and perfectly aligned with your company's standards.",
        },
        monitoring: { b: "Reduce Risk with Continuous Monitoring", s: "Never be caught off guard." },
        brand: { b: "Protect Your Brand Integrity", s: "Bad actors don't stand a chance." },
      },
      chips: {
        trade: "Trade License Check",
        directors: "Defaulting Directors Check",
        criminal: "Criminal Records Check",
        credit: "Credit & Company Check",
        gst: "GST Screening",
        financial: "Financial Assessment",
      },
    },
    stats: {
      checks: { b: "30+", s: "Checks" },
      countries: { b: "120+", s: "Countries" },
      tat: { b: "1 to 7", s: "Working Days TAT" },
      api: { b: "REST API", s: "+ bulk upload" },
    },
    /** The three client letters. The quotes are the old site's "What Our
     *  Client Speak" cards (`about.base.json` → `sections[5].cards[]`),
     *  verbatim including their punctuation, and de-identified as the old
     *  site had them — role and company line, no name, no logo. `q` is rich
     *  text because the canvas highlights one phrase per letter with `<mark>`. */
    letters: {
      kicker: "What Our Client Speak",
      hA: "Trusted by India’s top IT/ITES companies for",
      hB: "Background Verification",
      from: "From",
      items: {
        hrShared: {
          role: "HR Shared Services",
          co: "@India’s largest IT company",
          q: <>We are happy to be availing the services of HelloVerify and it&apos;s been a very fruitful journey so far. They are <mark>fast and accurate in running background checks</mark>, which have always helped us to make better hiring decisions. we wish to continue working with them in the future.</>,
        },
        people: {
          role: "People Function",
          co: "@ India’s largest IT company.",
          q: <>I would like to extend my appreciation for the effort Helloverify has put into successfully closing critical verification cases across our key accounts. Their <mark>responsiveness, commitment, and turnaround time have been exceptional</mark> , the closure of the BGV on time has helped me get appreciations. Please keep it up as we require the same support in the coming future as well.</>,
        },
        associate: {
          role: "Associate Lead",
          co: "@India’s largest Fintech company.",
          q: <>Thank you HelloVerify for your <mark>continuous assistance and support</mark>. Looking forward for the same support in upcoming days.</>,
        },
      },
    },
  },

  /** `sections/Smb.tsx` — homepage v2, desktop only. Package names, prices,
   *  descriptions and the à-la-carte list are the old SMB tab and
   *  `/products/bgv-smb`, verbatim. `lines` is one flat table for every
   *  receipt line, the shape `packages.lines` uses and for its reason. A
   *  package price is a string because it is printed as written; the
   *  à-la-carte prices are numbers in the component because the receipt adds
   *  them up. */
  smb: {
    kicker: "Small and Medium Enterprises",
    sheet: "Sheet 07 / 12",
    headingA: "Background Checks For",
    headingB: "Small & Medium Businesses",
    lede: "Pick the plan, customize your checks and get full verification details on any individual.",
    mins: "60 mins",
    tot: (n: number) => `${n} checks · 60 mins`,
    /** NEW MICROCOPY (conversion pass, 24 Sep 2026), not from the old site:
     *  the stamp on the spotlit package and the per-check line under each
     *  price (the amount is computed from the package price). "Checks
     *  Included", the old filler beside the button, was dropped. */
    best: "Best value",
    perCheck: (amount: string) => `≈ ${amount} per check`,
    buy: "Buy Now",
    lines: {
      identity: "Identity Check",
      criminal: "Criminal Check",
      global: "Global Database Check",
      address: "Current Address Check",
      moonlighting: "Moonlighting Check",
    },
    packs: {
      basic: {
        name: "Basic Package",
        tt: "Basic",
        sub: "Verifies government-issued ID, screens criminal records, and cross-checks global watchlists for hidden risks.",
        price: "₹1,799",
      },
      standard: {
        name: "Standard Package",
        tt: "Standard",
        sub: "All Basic checks plus address verification, giving you a more complete background picture.",
        price: "₹2,199",
      },
      premium: {
        name: "Premium Package",
        tt: "Premium",
        sub: "All Standard checks plus a moonlighting detection to uncover any undisclosed secondary employment.",
        price: "₹2,399",
      },
    },
    steps: {
      select: { b: "Select Checks", p: "Customize your order as per your requirement from our wide range of Checks" },
      fill: { b: "Fill Information", p: "Provide Consent of Individual & relevant information for verification" },
      result: { b: "Get Result", p: "Get intuitive reports for decision making" },
    },
    build: {
      kicker: "Customize Your Package",
      h: "Select Your Checks",
      options: {
        identity: "Identity Check",
        employment: "Employment Check",
        education: "Education Check-Highest Education",
        address: "Address Check",
        reference: "Professional Reference Check",
      },
      eduExtra: "Extra University Charges applicable",
      quoteB: "Instant Checks. Confident Hires.",
      quote: "Every hire carries risk. HelloVerify's instant background checks eliminate the guesswork—uncovering red flags before they ever walk through your door.",
      printer: "HelloVerify",
      receipt: "Custom package",
      count: (n: number) => (n === 1 ? "1 check" : `${n} checks`),
      empty: "Select a check to start your receipt",
      total: "Total",
      eduNote: "Education Check · Extra University Charges applicable",
      /** The running total. The component groups the digits itself (Indian
       *  grouping, no `Intl`), so the server and the browser print the same. */
      rupees: (amount: string) => `₹${amount}`,
    },
  },

  /** `sections/Diligence.tsx` — homepage v2, desktop only. Card copy is the
   *  old Certifier product cards, verbatim; "Before you sign a supplier" and
   *  "Before the first purchase order" are `packages.packs.*.sub`, and
   *  "2 days" / "Certified vendor profile" that band's `ready` and `who`. */
  diligence: {
    kicker: "Vendor and Supplier",
    sheet: "Certifier",
    headingA: "Business Due",
    headingB: "Diligence",
    lede: "With Certifier, offered by HelloVerify, clients can enhance their profiling experience by accessing certified profiles.",
    chip: "Vendors · Certifier",
    included: "Checks Included",
    scanning: "Scanning…",
    low: "Low risk",
    eta: "2 days",
    etaLabel: "Certified vendor profile",
    explore: "Explore More",
    /** One repeat of the stamp's ring text. Decorative (`aria-hidden`). */
    stamp: "CERTIFIED VENDOR PROFILE · CERTIFIER ·",
    cards: {
      trade: {
        when: "Before you sign a supplier",
        t: "Trade License Risk Assessment",
        p: "Comprehensive business verification covering trade license validation and promoter background checks.",
        checks: {
          trade: "Trade License Check",
          directors: "Defaulting Directors Check",
          criminal: "Criminal Records Check",
          credit: "Credit & Company Check",
        },
      },
      vendor: {
        when: "Before the first purchase order",
        t: "Vendor Financial Risk Assessment",
        p: "One platform you can trust. Vendor checks, credit evaluations, and financial assessments built for smarter decisions.",
        checks: {
          financial: "Financial Assessment",
          gst: "GST Screening",
          creditChecks: "Credit Checks",
          promoter: "Promoter Criminal History Check",
        },
      },
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

  /** `sections/TrustPlatform.tsx` — homepage v2, desktop only (the canvas's
   *  "Sheet 10 / 12"). Every string is the founder's canvas wording, verbatim,
   *  including "Every Connected institution" and "better outcome"; do not
   *  tidy them here without the owner. The years on the rewind slider are
   *  numerals the component counts (2018 + step); only `today` is copy. */
  trustPlatform: {
    kicker: "The Trust Technology Platform",
    sheet: "Sheet 10 / 12",
    headline: "Most verification systems are static.",
    headlineEm: "Ours compound.",
    lede: "HelloVerify's Trust Technology Platform performs Primary Source Verification directly from authorised sources, orchestrating complex workflows across countries, institutions, and regulatory ecosystems. Powered by AI and trained on millions of verifications.",
    motion: { pause: "Pause motion", play: "Play motion" },
    net: {
      title: "A platform that gets stronger with every verification.",
      legend: { institutions: "Institutions", customers: "Customers", verifications: "Verifications" },
      canvas: "A live network of institutions and customers connected through HelloVerify",
      hint: "Hover the network · drag a node",
      rewind: "Rewind the network",
      today: "Today",
      /** The hover label drawn on the canvas: "Institution · 6 connections". */
      node: { institution: "Institution", customer: "Customer", one: "connection", many: "connections" },
    },
    wheel: {
      lead: "Ours",
      em: "compound",
      words: {
        trust: "Trust",
        verifications: "Verifications",
        intelligence: "Intelligence",
        institutions: "Institutions",
        customers: "Customers",
        ecosystem: "Ecosystem",
      },
    },
    fly: {
      intelligence: {
        title: "Every verification enriches our intelligence",
        body: "Each completed check adds to our understanding of institutions, documents and fraud patterns",
      },
      network: {
        title: "Every Connected institution expands our network",
        body: "Each new issuing authority becomes a permanent, trusted node in our verification infrastructure",
      },
      ecosystem: {
        title: "Every new customer strengthens the ecosystem",
        body: "More customers means more verifications, more data, more connections and better outcome for everyone.",
      },
    },
    engines: {
      onboarding: {
        title: "Seamless Applicant Onboarding",
        body: "Our AI automatically captures, structures, and validates information directly from uploaded documents, creating clean, verification ready data without manual intervention.",
      },
      research: {
        title: "AI-Powered Research Intelligence",
        body: "Our AI research engine connects with the right authorised contacts, leverages a proprietary database of fraudulent institutions, and continuously learns from every verification to strengthen fraud detection.",
      },
      workflow: {
        title: "ML-Driven Workflow Orchestration",
        body: "Our ML based automation engine intelligently orchestrates every verification routing cases, automating decision making, and managing complex cross-border workflows across global institutions and regulatory environments.",
      },
    },
    domains: {
      kicker: "From verification provider to global trust platform.",
      items: {
        mobility: "Workforce Mobility",
        business: "Business verification",
        procurement: "Procurement & vendor trust",
        compliance: "Compliance & regulatory",
        financial: "Financial onboarding",
        identity: "Digital identity",
        crossBorder: "Cross-border economic activity",
        credentials: "Verified credentials",
      },
    },
    belief: {
      kicker: "Our Belief",
      first: "Trust is becoming the world's next critical digital infrastructure.",
      /** `lead` + one space + `move` is the sentence; `move` carries the
       *  hand-drawn underline, so it is its own node. */
      lead: "HelloVerify is building the platform through which",
      move: "trust will move.",
    },
  },
};

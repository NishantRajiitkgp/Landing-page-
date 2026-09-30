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
    /** The headline in four nodes: the last word of the first line carries
     *  the hand-drawn underline, and the italic second line carries the seal
     *  on its last word (`headlineEmEnd`), which never wraps away from it.
     *  They read "Trust Infrastructure platform for Instant AI-Powered
     *  Background Checks." No edge whitespace — the component supplies the
     *  gaps. (The whole first line was once its own `headline` leaf for the
     *  phone tree; one tree since Sep 2026.) */
    headlineEm: "for Instant AI-Powered Background",
    headlineEmEnd: "Checks.",
    headlineLead: "Trust Infrastructure",
    headlineMark: "platform",
    lede: "Streamline background verification with AI-powered checks that ensure accuracy, speed, and fraud prevention.",
    cta: "Talk to sales",
    checks: "See all 33 checks",
    /** Homepage v2. The corner notes of the security-print sheet
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
    /** The live ledger under the buttons (`sections/HeroLedger.tsx`). Only
     *  the labels: the figures are `numbers.odometer` and `numbers.figures`.
     *  The count keeps the pace `numbers.pace.note` states, at random gaps;
     *  the line that said so under it went on 30 Sep 2026. */
    ledger: {
      live: "Live",
      checks: "Checks completed since 2018",
      clients: "Enterprise clients",
      countries: "Countries covered",
      catalogue: "Verification checks",
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
    sheet: "Sheet 08 / 12",
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
    lede: "A driving licence in Bengaluru, start to finish. Thirty minutes, on loop.",
    steps: {
      upload: {
        label: "Upload",
        cap: "Photograph the document. Edges, glare and focus are checked before the shutter fires.",
      },
      read: {
        label: "Read",
        cap: "AI captures every field, checks the document against itself, and finds the office that issued it.",
      },
      confirm: {
        label: "Confirm",
        cap: "The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.",
      },
      report: {
        label: "Report",
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
      sheet: "Sheet 03 / 12",
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
      promiseA: "Verified at the source,",
      promiseEm: "in minutes.",
      ev: { read: "Read by", confirmed: "Confirmed", artefact: "Artefact", reviewed: "Reviewed" },
      routes: {
        licence: {
          chip: "Licence verified · 30\u00a0min",
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
          /** The tags on the four fields the scan boxes. The words on the
           *  specimen itself are in the scan. Decorative (`aria-hidden`). */
          doc: {
            f1: { tag: "NAME" },
            f2: { tag: "LICENCE" },
            f3: { tag: "CLASS" },
            f4: { tag: "VALID" },
          },
        },
        degree: {
          chip: "Degree verified · 3\u00a0days",
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
            f1: { tag: "NAME" },
            f2: { tag: "DEGREE" },
            f3: { tag: "REF." },
            f4: { tag: "AWARDED" },
          },
        },
      },
    },
  },


  /** `sections/ConsumerShop.tsx` (composed as `Consumer`). */
  consumer: {
    k: "Consumer · HelloV",
    headingA: "Consumer Services",
    headingB: "Verify anyone, from your phone, in 30 minutes.",
    lede: "Send a photo of the document over WhatsApp. We do the rest and message you back with the report.",
    /** Homepage v2: the HelloV storefront, at every width — eight photo panels,
     *  a price card, the QR steps and the phone. `k`, `headingA`, `headingB`
     *  and `lede` above are this tree's too, so they are not repeated
     *  here. The product names, one-liners and check
     *  lists are the old homepage tabs and `/products/hellov`, verbatim; a
     *  service without `price` shows the placeholder, which is deliberate
     *  until the founder confirms the figure. */
    shop: {
      sheet: "Sheet 07 / 12",
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

  /** `sections/Globe.tsx` (composed as `International`). The flags stay in
   *  the component — they are drawings, and their hex is the `check:tokens`
   *  exemption. */
  international: {
    /** Sales pass (30 Sep 2026): the band sells the cross-border check —
     *  the problem, the proof and the ask — instead of describing the map.
     *  Every figure below is one the live site states: 20M+ and 120+ (the
     *  hero), 12–14% (the manpower & education page), 3× (the immigration
     *  page). */
    headingA: "Hire from anywhere.",
    headingB: "Verified at the source, in 120+ countries.",
    lede: "Cross-border hires are where fraud hides — a degree from another country, an employer you can’t call. We verify with the issuer in their own country, and you get an evidence-backed report on a turnaround you can plan around.",
    courts: "Criminal records are checked across Supreme, High and District Courts and tribunals. Times are from upload, in your local time.",
    all: "All countries",
    /** Homepage v2: the globe, at every width. Each pin's card
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
      /** The two actions on every country's card. */
      pinCta: "Verify a hire from here",
      guide: "Country guide",
      world: {
        k: "International Background Verification",
        big: "120",
        plus: "+",
        line: "countries where we can reach the issuing authority.",
        impact: {
          i1: { v: "20M+", l: "checks completed since 2018" },
          i2: { v: "12–14%", l: "of applications flagged for fraud" },
          i3: { v: "3×", l: "faster than the industry average" },
        },
        cta: "Start an international check",
        ctaAlt: "Turnaround by country",
        officesK: "Our Offices",
        offices: ["Egypt", "India", "Philippines", "Singapore", "United Arab Emirates", "United States"],
        tip: "Drag the globe · click a flag",
      },
      pins: {
        in: {
          name: "India",
          role: "Head office · New Delhi",
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
    headingA: "Key Verification Solutions",
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

  /** `sections/PeopleStrip.tsx` — "Individual Checks" (30 Sep 2026). The
   *  drum of photo cards now sells the old home page's six single checks
   *  (`home.base.json` → `key-verification-solutions`, the 3-column grid):
   *  each card is one check, with its name and line verbatim, its
   *  turnaround and its price, and a Buy button. Keyed by photograph; the
   *  photograph is someone that check is typically run on. */
  peopleStrip: {
    headingA: "Individual Checks",
    headingEm: "Get verified in minutes, not days!",
    lede: "Need just one check? Pick it, pay per check, and get the result on your dashboard. No package, no contract.",
    strip: "Pay per check. Anyone you need to trust.",
    times: "Times shown are from upload to report",
    /** The label over the strip the cards pass through. Decorative
     *  (`aria-hidden`), but a word a translator sees. */
    checkpoint: "Single checks",
    /** Above each price: "₹199 / per check". */
    per: "per check",
    buy: "Buy now",
    /** `chip` is the turnaround; the no-break space keeps "15 min"
     *  together on the phone's narrow card. */
    people: {
      "/img/people/01-rider-bengaluru.jpg": {
        role: "Driving License Check",
        city: "Verifies driver name, license number and validity of license instantly.",
        chip: "Verified in 30\u00a0min",
        price: "₹299",
        note: "photo · delivery rider",
      },
      "/img/people/03-engineer-manila.jpg": {
        role: "Digital Employment Check",
        city: "Verifies applicant’s previous employer name, dates of joining and relieving instantly.",
        chip: "Verified in 60\u00a0min",
        price: "₹299",
        note: "photo · engineer",
      },
      "/img/people/04-nanny-gurugram.jpg": {
        role: "Criminal Record Check",
        city: "Checks court records for any cases against the candidate.",
        chip: "Verified in 30\u00a0min",
        price: "₹899",
        note: "photo · nanny",
      },
      "/img/people/05-warehouse-pune.jpg": {
        role: "PAN Card Check",
        city: "Authenticate PAN card information to confirm identity and prevent fraud.",
        chip: "Verified in 15\u00a0min",
        price: "₹299",
        note: "photo · warehouse",
      },
      "/img/people/07-tenant-singapore.jpg": {
        role: "Digital Address Check",
        city: "Verifies address digitally through documents & live geo location.",
        chip: "Verified in 60\u00a0min",
        price: "₹299",
        note: "photo · tenant",
      },
      "/img/people/02-nurse-abudhabi.jpg": {
        role: "Age Verification",
        city: "Establishes candidate’s age by verifying government-issued documents containing date of birth.",
        chip: "Verified in 15\u00a0min",
        price: "₹199",
        note: "photo · nurse",
      },
    },
  },

  /** `sections/IntlGrid.tsx` — "International Background Verification"
   *  (30 Sep 2026), the old home page's `internationalGrid` block, which the
   *  v2 homepage had dropped. The country names and the five lines are the
   *  old site's, verbatim; each card's turnaround is its country guide's
   *  (`lib/content/countries.ts`), not copy. */
  intlGrid: {
    heading: "International Background Verification",
    lede: "Five of the 120+ countries where we confirm records with the authority that issued them — each with its own guide to what to expect.",
    turnK: "Typical turnaround",
    cta: "Explore More",
    items: {
      uk: { name: "United Kingdom", p: "Hire drivers you can trust." },
      ph: { name: "Philippines", p: "Know your tenant before you rent." },
      ae: { name: "United Arab Emirates", p: "Screen for criminal records with confidence." },
      sg: { name: "Singapore", p: "Verify education credentials in minutes." },
      eg: { name: "Egypt", p: "Confirm employment history before you hire." },
    },
  },

  /** `sections/OneInEight.tsx` (homepage v2). The lede keeps the canvas's
   *  wording and its figure (`12–14%`) carries footnote `1`, whose own text
   *  says the source is still to be confirmed.
   *
   *  NEW COPY (30 Sep 2026, not founder-verbatim): `headingEm` + `heading`,
   *  `reveal`, the status line and every case file but application 06's.
   *  The heading used to be "1 in 8 applicants misrepresent their academic
   *  credentials."; the table now shows eight forgeries, one trick each, so
   *  the sentence changed with it.
   *
   *  The eight certificates are SYNTHETIC — fictional institutions and people,
   *  said so in `bar` — and every one is forged (`tools/img/specimens/`).
   *  Every finding below is true of its image. */
  oneInEight: {
    sheet: "Sheet 02 / 12",
    flag: "Fraud",
    /** `headingEm` + " " + `heading` is the sentence; the italic figure is its
     *  own node. `fn` is the footnote mark the lede's figure carries. */
    headingEm: "8 of 8",
    heading: "documents here are forged, each a different way.",
    lede: "We flag fraudulent documents before approval. Our system detects fraud in 12–14% of applications.",
    fn: "1",
    footnote: "Figures as published on HelloVerify’s authority pages. Source and period to be confirmed before launch.",
    bar: "Evidence table · 8 applications · 7 countries · illustrative, synthetic documents",
    /** The live status reads `${n} ${checked} · ${n} ${flagged}` until all
     *  eight are checked, then `found`. */
    checked: "of 8 checked",
    flagged: "flagged",
    found: "8 of 8 flagged · 0 verified",
    /** `${checkCert} ${kind}, ${where}` — the accessible name of each
     *  document. `kind` and `where` are also its caption on the table. The
     *  eight are SYNTHETIC scans (Higgsfield, 29 Sep 2026): fictional
     *  institutions and people, no state emblems. */
    checkCert: "Check the",
    certs: {
      be: { kind: "B.E. degree", where: "India" },
      ae: { kind: "Grade 12 transcript, Arabic", where: "UAE" },
      ph: { kind: "Transcript of records", where: "Philippines" },
      eg: { kind: "Pharmacy degree, Arabic", where: "Egypt" },
      uk: { kind: "MBA degree", where: "UK" },
      xii: { kind: "Class XII marksheet", where: "India" },
      sg: { kind: "Polytechnic diploma", where: "Singapore" },
      pk: { kind: "MBBS degree", where: "Pakistan" },
    },
    /** What the UV lamp shows. Decorative (`aria-hidden`): the fibres, UV-ink
     *  emblems and glowing alterations are in the photographs; `tags` are the
     *  callouts the lens draws on them — what was done, and to which figure;
     *  the security paper, where the sheet is on it. */
    uv: {
      loupe: "UV · 365 nm",
      tags: {
        renamed: { t: "Name retyped", d: "Over cloned paper" },
        copied: { t: "No UV emblem ✗", d: "Office paper, no fibres" },
        inked: { t: "Second ink", d: "64 → 84 · 61 → 81" },
        fluid: { t: "Correction fluid", d: "Pharmacology 5.00 → 2.00" },
        deadSeal: { t: "Seal: no UV ink ✗", d: "Printed, not stamped" },
        revenue: { t: "Revenue stamp ✓", d: "Its UV print glows" },
        sticker: { t: "Adhesive ring", d: "The seal is a sticker" },
        bare: { t: "No UV emblem ✗", d: "No security fibres" },
        lifted: { t: "Tape-lifted", d: "Year 2021 → 2019" },
        serial: { t: "Serial HP21", d: "Issued 2021, not 2019" },
        pencil: { t: "Pencil guide", d: "Signature traced" },
        scraped: { t: "Scraped, retyped", d: "Maths 062 → 092" },
        washed: { t: "Chemical wash", d: "Physics 058 → 088" },
        pasted: { t: "Pasted-over slip", d: "Total 415 → 475" },
        genuine: { t: "UV emblem ✓", d: "Genuine paper, altered" },
      },
    },
    referred: "FLAGGED",
    notVerified: "NOT VERIFIED",
    nakedA: "Identifies hidden inconsistencies",
    nakedEm: "invisible to the naked eye.",
    hint: "Move the lamp over the documents, or",
    reveal: "Show me every forgery",
    reset: "Reset the table",
    /** `sections/OneInEightCase.tsx`: the case file that opens under the
     *  table for the document last checked. `k` is followed by the
     *  application number and the document's caption. Every finding is true
     *  of its specimen — each was altered the way a forger would
     *  (`tools/img/specimens/forge.cjs`, `forge-all.cjs`), and each heatmap
     *  is its edits' own mask. */
    case: {
      k: "Case file · application",
      verdict: "Flagged · not approved",
      viewsLabel: "How to look at the document",
      views: { scan: "Scan", uv: "UV · 365 nm", heat: "Heatmap" },
      navLabel: "Case files",
      prev: "Previous case",
      next: "Next case",
      files: {
        be: {
          title: "Why this degree was flagged",
          alt: "Synthetic B.E. degree from application 01: a colour copy with the holder's name replaced",
          zoomAlt: "The holder's name at twice size: the letters sit low and spaced wider than the print around them",
          findings: {
            f1: { t: "The name was replaced", d: "PRANAV K. IYER is retyped over cloned paper. It sits 2px low and is spaced wider than every other line on the sheet.", by: "Image forensics" },
            f2: { t: "It is a colour copy", d: "Under UV the paper glows blue-white like office stock, with no security fibres and no UV emblem. A copier cannot reproduce UV ink.", by: "UV · 365 nm" },
            f3: { t: "The USN belongs to someone else", d: "The university's register lists USN 2DT13CS047 under a different graduate.", by: "Source · the issuing university" },
          },
        },
        ae: {
          title: "Why this transcript was flagged",
          alt: "Synthetic Grade 12 transcript from application 02, with two marks altered in pen",
          zoomAlt: "The Mathematics mark at four times size: the upper loop of the 8 is a second, bluer ink",
          findings: {
            f1: { t: "Two 6s were closed into 8s", d: "Mathematics 64 → 84 and Physics 61 → 81. One pen stroke each, drawn over the printed digit.", by: "Image forensics" },
            f2: { t: "The new strokes are a second ink", d: "Under UV the added loops fluoresce orange. The school's printed figures stay dark.", by: "UV · 365 nm" },
            f3: { t: "The school's record disagrees", d: "Mariam Khalid Al Hosani, 2019–2020: Mathematics 64, Physics 61.", by: "Source · the issuing school" },
          },
        },
        ph: {
          title: "Why this transcript was flagged",
          alt: "Synthetic transcript of records from application 03, with one grade under correction fluid",
          zoomAlt: "The Pharmacology grade at three times size: a raised white blot under a 2 that sits off true",
          findings: {
            f1: { t: "A failing grade is under correction fluid", d: "Pharmacology read 5.00, a fail. The fluid is a dead-black blot under UV, where the paper around it glows.", by: "UV · 365 nm" },
            f2: { t: "The retyped 2 does not match", d: "It is a size larger than every other grade on the sheet and sits a degree off true.", by: "HelloVerify AI · read" },
            f3: { t: "The registrar's record disagrees", d: "NCM 106 Pharmacology: 5.00, failed.", by: "Source · the registrar" },
          },
        },
        eg: {
          title: "Why this certificate was flagged",
          alt: "Synthetic pharmacy graduation certificate from application 04, with a printed faculty seal",
          zoomAlt: "The faculty seal at three times size: a screen of even violet dots, with none of a rubber stamp's pooling",
          findings: {
            f1: { t: "The seal is printed, not stamped", d: "Magnified, it is a dot screen of one flat violet. A rubber stamp pools ink at its edges and fades where it lifts.", by: "Image forensics" },
            f2: { t: "The seal has no UV ink", d: "It stays dark under the lamp, while the revenue stamp beside it glows as a genuine one should.", by: "UV · 365 nm" },
            f3: { t: "No such graduate", d: "The faculty has no record of Nour Mohamed Farouk in the May 2015 session.", by: "Source · the issuing faculty" },
          },
        },
        uk: {
          title: "Why this degree was flagged",
          alt: "Synthetic MBA degree from application 05, from an unrecognised institution, with a sticker seal",
          zoomAlt: "The edge of the gold seal under UV, enlarged: a bright ring of adhesive round the sticker",
          findings: {
            f1: { t: "The seal is a stationery sticker", d: "A ring of adhesive glows round its edge under UV, and a hairline in the scan shows where it lifts.", by: "UV · 365 nm" },
            f2: { t: "No security features at all", d: "No fibres and no UV emblem. The paper is plain stock that anyone can buy.", by: "UV · 365 nm" },
            f3: { t: "The university is not recognised", d: "University of Aldermoor is not on the UK's register of recognised degree-awarding bodies.", by: "Source · UK register" },
          },
        },
        xii: {
          title: "Why this marksheet was flagged",
          alt: "Synthetic Class XII statement of marks from application 06, with two altered marks",
          zoomAlt: "The marks column at three times size: the retyped 9 and 8 print thinner and sit low, the 8 in a bleached halo",
          findings: {
            f1: { t: "Maths was scraped and retyped", d: "062 → 092. The 9 prints thinner and sits low, and the scraped paper glows under UV.", by: "Image forensics · UV" },
            f2: { t: "Physics was washed and retyped", d: "058 → 088. A solvent bleached a halo round the digit: dark under UV, with a bright tide line where it dried.", by: "UV · 365 nm" },
            f3: { t: "The total is a pasted-over slip", d: "A slip printed 475 is glued over the figure. Its paper and glue fluoresce; the sheet's own paper does not.", by: "UV · 365 nm" },
            f4: { t: "Figures and words disagree", d: "“092” sits beside “SIXTY TWO”, “088” beside “FIFTY EIGHT”, and “475” beside “FOUR HUNDRED FIFTEEN”.", by: "HelloVerify AI · read" },
            f5: { t: "The board's record disagrees", d: "Roll No. 4127033: Mathematics 62, Physics 58, total 415.", by: "Source · the issuing board" },
          },
        },
        sg: {
          title: "Why this diploma was flagged",
          alt: "Synthetic polytechnic diploma from application 07, with its year altered",
          zoomAlt: "The date at three times size: the 19 prints a hair heavier and lower than the 20 beside it",
          findings: {
            f1: { t: "The year was lifted and reprinted", d: "2021 → 2019. Tape lifted the printed 21 and took paper fibres with it; they glow under UV. The 19 is a hair heavier and sits 2px low.", by: "Image forensics · UV" },
            f2: { t: "The serial number disagrees", d: "HP21-PHS-00318 is a 2021 serial. The date above it says 2019.", by: "HelloVerify AI · read" },
            f3: { t: "The polytechnic's record disagrees", d: "Tan Wei Ling, Diploma in Pharmaceutical Science with Merit, awarded 2 May 2021.", by: "Source · the issuing polytechnic" },
          },
        },
        pk: {
          title: "Why this degree was flagged",
          alt: "Synthetic MBBS degree from application 08, with a traced signature",
          zoomAlt: "The Controller's signature, enlarged: the strokes tremble and a grey pencil line runs beside them",
          findings: {
            f1: { t: "The Controller's signature is traced", d: "Drawn slowly over a copy: every stroke trembles, starts and stops bluntly, and never tapers the way a signed line does.", by: "Image forensics" },
            f2: { t: "A pencil guide sits under the ink", d: "Under UV the graphite outline shows a few pixels off every stroke.", by: "UV · 365 nm" },
            f3: { t: "The registration number is not on the roll", d: "MUHS-2011-0827 is not in the university's register of graduates.", by: "Source · the issuing university" },
          },
        },
      },
    },
  },

  /** `sections/FieldCase.tsx` (homepage v2, 30 Sep 2026): one address check
   *  in Foumban, Cameroon, followed across five acts on a survey map.
   *
   *  NEW COPY, NOT FOUNDER-VERBATIM, except `outro.line`, which is the
   *  founder's core message word for word. The case is ILLUSTRATIVE: the
   *  candidate, the employer, the times and both statements are a composed
   *  example, and the section says so in `note` (shortened to "Example case"
   *  on 30 Sep 2026, when the copy was rewritten in plain English as a case
   *  file; the French quotes are now given in English). The in-country claims in
   *  `acts.a3` and `chips` (local processing, encryption, retention) and the
   *  field partner's languages must be confirmed before launch. */
  fieldCase: {
    k: "Evidence · anywhere",
    headingA: "Some checks end at a database.",
    headingEm: "Ours go to the door.",
    lede: "Follow one address check in Foumban, Cameroon, from the request to a report built on coordinates, satellite captures and what the neighbourhood says.",
    /** Kept, short: the case is an example (see this block's header), and a
     *  page pitching governments must not pass it off as a client file. */
    note: "Example case",
    hint: "Scroll to follow the case",
    railLabel: "Steps of the case",
    caseK: "Case 4417 · address + site visit",
    caseWhere: "Foumban, West Region, Cameroon",
    caseFor: "For a hospital group in Riyadh · workforce mobility",
    hud: { lat: "Latitude", lon: "Longitude", plus: "Plus code", alt: "Altitude", view: "Map width" },
    pins: {
      declared: "Declared address",
      declaredSub: "Behind the central market",
      shared: "Location she shared",
      sharedSub: "Over WhatsApp",
      partner: "Field partner",
      partnerSub: "Foumban desk",
    },
    distance: "1.7 km apart",
    anomalies: {
      far: "Locations 1.7 km apart",
      bill: "Utility bill in another name",
      exif: "Photo metadata stripped",
    },
    evidence: {
      sat: "Satellite capture",
      sealed: "Sealed in-country",
      tr: "Recorded in French · translated",
      a: { k: "Declared address · 10:58 WAT", quote: "She moved out of this house in 2024.", en: "The landlord" },
      b: { k: "Current address · 11:36 WAT", quote: "She has lived here since March 2024.", en: "The quarter head (local community leader)" },
    },
    jurisdiction: "Processed in Cameroon",
    acts: {
      a0: { k: "Request", clock: "00:00:00", t: "The check is opened.", d: "A hospital group in Riyadh is hiring a nurse who lives in Foumban, Cameroon, 4,358 km away. HR opens an address check with a site visit, from the dashboard or over WhatsApp." },
      a1: { k: "AI review", clock: "00:00:04", t: "Three things don’t match.", d: "Our AI puts the address she declared on the map and compares it with the live location she shared. They are 1.7 km apart, the utility bill is in someone else’s name, and her photo carries no location data." },
      a2: { k: "Site visit", clock: "Day 1 · 10:42 WAT", t: "A local verifier visits both addresses.", d: "Our field partner in Foumban speaks French, English and Bamum, the local language. At the declared address, the landlord says she moved out in 2024. At the new address, the quarter head confirms she lives there. Every visit is time-stamped and geotagged." },
      a3: { k: "Data protection", clock: "Day 1 · 14:10 WAT", t: "The evidence stays in Cameroon.", d: "Photos, statements and coordinates are processed in Cameroon, encrypted, and kept only as long as local law allows. Her consent was recorded before the check began." },
      a4: { k: "Report", clock: "Day 1 · 16:05 WAT", t: "Not just a tick. Full evidence.", d: "A seven-section report, from the coordinates to the chain of custody. Result: verified, with the address corrected, and HR can see exactly how we got there." },
      a5: { k: "At scale", clock: "Right now", t: "One check out of 20 million.", d: "Case 4417 closed the same day, at 16:05. Right now the same platform is running the next check, in 120+ countries, through six offices and local experts who work in their own languages." },
    },
    /** The orbit the case opens on and pulls back out to. The offices are
     *  the relay's six (`presence.offices`). */
    globe: {
      riyadh: "Riyadh",
      foumban: "Foumban",
      region: "WEST REGION · CAMEROON",
      offices: { manila: "Manila", singapore: "Singapore", newDelhi: "New Delhi", dubai: "Dubai", cairo: "Cairo", newYork: "New York" },
      big: "20,000,000+",
      bigLabel: "checks completed since 2018",
    },
    loupe: { label: "Satellite · 2×", hint: "Move the pointer over the map to see it from above" },
    chips: { consent: "Consent on record", local: "Processed in-country", enc: "Encrypted at rest", keep: "Retention by local law" },
    report: {
      k: "Verification report · case 4417",
      verdict: "Verified",
      verdictSub: "Address corrected",
      resolved: "Resolved",
      pages: {
        summary: "Summary",
        location: "Location",
        visit: "Site visit",
        statements: "Statements",
        ai: "AI anomaly log",
        custody: "Chain of custody",
        compliance: "Compliance",
      },
      rows: {
        identity: "Identity matched",
        address: "Current address confirmed",
        visit: "Two doors visited",
        flags: "3 flags raised, 3 resolved",
      },
    },
    outro: {
      /** Verbatim; the hyphen in "AI‑powered" is U+2011, the non-breaking
       *  one, so the line never breaks inside the word. */
      line: "Global scale, local expertise, AI‑powered intelligence and deep evidence—delivered through one verification platform.",
      scale: "20M+ checks of sources, research and field knowledge stand behind every new one.",
      also: "The same platform, elsewhere today",
      places: {
        sd: { city: "Khartoum", what: "Degree, from the university" },
        sy: { city: "Aleppo", what: "Employment, from the employer" },
        eg: { city: "Cairo", what: "Pharmacy licence" },
        ph: { city: "Davao", what: "Site visit" },
        sa: { city: "Riyadh", what: "Professional licence" },
      },
    },
    motion: { pause: "Pause motion", play: "Play motion" },
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


  /** `sections/Presence.tsx`. `hours` is keyed rather than an array because
   *  an array leaf derives to `string[]` and a locale could then ship four
   *  axis labels where English ships five, which would silently mis-space
   *  the band — the component positions them at `i * 25%`. The offsets, the
   *  flags and the stagger stay in the component. */
  presence: {
    /** The relay (29 Sep 2026) replaced "Six offices. Twelve hours apart.":
     *  the founder's brief was to show what the offices DO — the requests
     *  crossing borders to the source and back, and what that is worth to a
     *  hirer — not that they exist. */
    headingA: "Hire from 120 countries.",
    headingB: "Never wait for their morning.",
    lede: "People cross borders; their papers stay with the university, the police and the registrar that issued them. Six HelloVerify desks, awake around the clock, go back to that source for you — so a nurse from Kochi starts in Abu Dhabi in a day, not a quarter.",
    offices: {
      manila: "Manila",
      singapore: "Singapore",
      /** Labelled New Delhi on the homepage map on review (24 Sep 2026); the
       *  key stays `noida`, which the relay map and the flag defs share. The
       *  head office everywhere else (schema, llms.txt, /about, /contact) is
       *  still Noida. */
      noida: "New Delhi",
      dubai: "Dubai",
      cairo: "Cairo",
      newYork: "New York",
    },
    /** Homepage v2: the relay (`sections/RelayStage.tsx`, a client island,
     *  so every string reaches it as a prop; `{name}` slots are filled
     *  there). The visitor picks where their candidate's papers are and
     *  watches that one request travel, told in five captions, while the
     *  world turns under it. PLACEHOLDER FIGURES: the counters are modelled
     *  and the journeys and their times are illustrative (`lib/relayData.ts`)
     *  until the founder's numbers replace them — `fn` says so on the page. */
    relay: {
      live: "Live · today so far, UTC",
      /** Shown in a counter or a clock before the page knows the time. */
      pending: "—",
      clock: "--:--",
      stats: {
        checks: "checks completed",
        borders: "crossed a border to reach the source",
        forged: "forgeries stopped before a hire",
        countries: "countries sending or receiving",
      },
      pick: "Your candidate's papers are in",
      countries: { in: "India", ph: "Philippines", eg: "Egypt", pk: "Pakistan", ae: "UAE", gb: "UK" },
      map: "World map following one verification request from a hirer to the office that issued the document and back, over the six HelloVerify desks as day and night pass",
      /** The five steps: short on the timeline, told in full on the map. */
      steps: { filed: "Uploaded", desk: "Our desk", reached: "The source", confirmed: "Confirmed", verified: "Verified" },
      say: {
        filed: "A {client} in {to} uploads {who}'s {doc}.",
        desk: "Our {desk} desk takes it straight to the source.",
        reached: "The {source} in {from}, which issued it, checks its own records.",
        confirmed: "Confirmed genuine. The answer goes back to {to}.",
        verified: "Verified at the source. {who} is cleared.",
      },
      /** The running clock: time since the upload, in the journey's hours. */
      since: "since upload",
      units: { d: "d", h: "h", m: "m" },
      tags: { source: "Issued it", hirer: "Asked for it", verified: "Verified" },
      /** Each holder is the name printed on the specimen that flies
       *  (`lib/relayData.ts` `doc`): Sneha Mathew's nursing degree, Jerome
       *  Cruz's transcript, Nour Farouk's pharmacy degree, Hamza Ali
       *  Qureshi's MBBS, Mariam Al Hosani's Grade 12 transcript, Laura
       *  Santos's MBA. `to` is the hirer's city; the UAE journey's "hirer"
       *  is a university's admissions office. */
      journeys: {
        in: { who: "Sneha", doc: "nursing degree", source: "university registrar", from: "Thrissur", client: "hospital group", to: "Abu Dhabi" },
        ph: { who: "Jerome", doc: "transcript of records", source: "college registrar", from: "Iloilo", client: "hospital", to: "Riyadh" },
        eg: { who: "Nour", doc: "pharmacy degree", source: "university registrar", from: "Asyut", client: "pharmacy chain", to: "Kuwait City" },
        pk: { who: "Hamza", doc: "MBBS degree", source: "medical university", from: "Islamabad", client: "health authority", to: "Doha" },
        ae: { who: "Mariam", doc: "Grade 12 transcript", source: "school", from: "Abu Dhabi", client: "university admissions office", to: "London" },
        gb: { who: "Laura", doc: "MBA degree", source: "university registrar", from: "Manchester", client: "bank", to: "Tokyo" },
      },
      /** The ring of text on the stamp that lands on the document. */
      seal: "VERIFIED AT THE SOURCE · HELLOVERIFY ·",
      /** The six desks under the map, on the journey's clock. */
      desks: {
        k: "Our six desks, on this journey's clock",
        open: "at a desk",
        closed: "closed",
        working: "on this request",
        country: { manila: "Philippines", singapore: "Singapore", noida: "India", dubai: "UAE", cairo: "Egypt", newYork: "USA" },
      },
      play: "Play",
      pause: "Pause",
      replay: "Replay",
      scrub: "Journey progress: {doc} from {country}",
      fn: "Illustrative. Today's counts are modelled on 20M+ checks since 2018; the journeys and their times are examples. Live figures to be connected before launch.",
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
    sheet: "Sheet 05 / 12",
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
      /** Split 28 Sep 2026: the founder's sentence was the heading and read as
       *  a wall of serif. The short line is the heading; the sentence, verbatim,
       *  is the lede under it. */
      h: "A wrong vendor costs more than a check.",
      lede: "We are redefining third-party verification for B2B businesses delivering fast, reliable authentication of identities and documents that modern enterprises demand.",
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
        trade: "Trade licence",
        directors: "Defaulting directors",
        criminal: "Criminal records",
        credit: "Credit & company",
        gst: "GST screening",
        financial: "Financial assessment",
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
    sheet: "Sheet 06 / 12",
    /** The Large ↔ SMB toggle (29 Sep 2026): the old home page's
     *  `solutionsShowcase`, whose two segments were "Large Enterprise" and
     *  "Small and Medium Enterprises". The Large panel's cards are that
     *  segment's four; White- and Blue-Collar read `enterprises.employees`
     *  (the same sentences), so only KYC's and Vendor's are here, verbatim
     *  from `home.base.json`. `from` precedes the Basic package's price. */
    seg: {
      kicker: "Background checks for business",
      label: "Choose your business size",
      large: "Large Enterprises",
      small: "Small & Medium Businesses",
      /** The client logos under the Large panel, as the old enterprise page
       *  (`/products/bgv-enterprise`) shows them; each is its logo's alt. */
      clients: { cognizant: "Cognizant", infosys: "Infosys", accenture: "Accenture", reliance: "Reliance Retail", wipro: "Wipro", hcl: "HCL" },
      headingA: "Background Checks For",
      headingB: "Large Enterprises",
      kyc: { t: "KYC Services", p: "Comprehensive KYC solution to help streamline processes involved in digital onboarding and fraud detection." },
      vendor: { t: "Vendor and Supplier", p: "With Certifier, offered by HelloVerify, clients can enhance their profiling experience by accessing certified profiles." },
    },
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
   *  seals of state. Four authorities since 29 Sep 2026: MOM, the embassies
   *  of Latvia and Italy, and the UAE's MOHESR (India, KSA, the UAE and the
   *  combined "European authorities" seal went).
   *
   *  EACH RECORD IS A PITCH, in the order a buyer reads one: the challenge
   *  the authority faces, what HelloVerify is to it, what we deliver step by
   *  step, the impact, and why it chose us. Every claim and figure is on the
   *  live site's two authority pages (helloverify.com/en/solutions/
   *  manpower-and-education-authorities and …/immigration-authorities) or
   *  the old site's per-authority content (`Application Frontend HV`). The
   *  relationship words are theirs, not upgraded: MOM "officially
   *  empanelled"; Latvia "has partnered with HelloVerify"; Italy's
   *  applicants "are recommended to undertake … verification with service
   *  provider HelloVerify", listed under "Our Partners"; MOHESR "authorized
   *  verification partner", a featured client on the live education page.
   *  `impactK` says when a figure is a page-wide one (the education page's
   *  "12–14% of applications", the immigration page's "3×" and "99.2%")
   *  rather than pinning it on one authority.
   *
   *  `micro` is one repeat of the ring of microtext a seal turns, `stamp` one
   *  repeat of the stamp's. The component supplies the joining spaces, so no
   *  leaf has edge whitespace. */
  govSeals: {
    kicker: "Governments we work with",
    kickerEnd: "Trust Infrastructure",
    heading: "Governments",
    headingEm: "We Work With",
    ledeLead: "Trusted by government authorities and embassies, including",
    ledeAnd: "and",
    stamp: "PRIMARY SOURCE VERIFICATION · HELLOVERIFY ·",
    /** The record's four section labels, shared by every authority. */
    problemK: "The challenge",
    deliverK: "What we deliver",
    whyK: "Why they chose HelloVerify",
    items: {
      mom: {
        name: "Ministry of Manpower Singapore",
        ledeName: "Singapore’s Ministry of Manpower",
        micro: "MINISTRY OF MANPOWER · SINGAPORE · COMPASS FRAMEWORK · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 01 / 04",
        role: "Our Client — Ministry of Manpower (Singapore)",
        problem: { v: "1 in 8", l: "applicants misrepresent their academic credentials — and a forged certificate can look exactly like a real one." },
        h: "Officially empanelled by Singapore’s Ministry of Manpower to verify the qualifications behind work pass applications.",
        p: "Under the COMPASS framework, a work pass is only as sound as the qualification behind it. HelloVerify confirms the institution is accredited, verifies the qualification with the institution that issued it, and flags fraudulent documents before approval — so every decision rests on evidence, not paper.",
        facts: {
          f1: { k: "Framework", v: "COMPASS" },
          f2: { k: "Work passes", v: "EP · S Pass · ONE Pass · PEP · TEP" },
          f3: { k: "Qualifications", v: "Degrees · Diplomas · Transcripts · Marksheets" },
          f4: { k: "Per application", v: "Up to 7 educational qualifications" },
        },
        deliver: {
          d1: { t: "Accreditation check", p: "The institution is confirmed as accredited — a legitimate provider, not a diploma or degree mill." },
          d2: { t: "Primary source verification", p: "Each degree, diploma, transcript and marksheet is confirmed directly with the institution that issued it." },
          d3: { t: "Fraud flagged before approval", p: "Forged documents and discrepancies are caught before a work pass is decided." },
          d4: { t: "MOM-compliant report", p: "An evidence-backed verification report, ready for the work pass submission." },
        },
        impactK: "Impact · across our manpower & education work",
        impact: {
          i1: { v: "12–14%", l: "of applications flagged for fraud" },
          i2: { v: "≤ 7", l: "working days, express verification" },
          i3: { v: "120+", l: "countries with degree equivalency assessments" },
        },
        why: {
          w1: { t: "Officially recognised", p: "Recognised by Singapore’s Ministry of Manpower for qualification verification under the COMPASS framework, across eligible work pass categories." },
          w2: { t: "Global verification network", p: "Operating across 120+ countries with direct access to thousands of universities and accredited institutions." },
          w3: { t: "ISO 27001 information security", p: "Personal data, academic records and passport information are protected by enterprise-grade security and privacy controls." },
        },
      },
      latvia: {
        name: "Embassy of the Republic of Latvia",
        ledeName: "the Embassy of the Republic of Latvia",
        micro: "EMBASSY OF THE REPUBLIC OF LATVIA · STUDENT & WORK VISAS · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 02 / 04",
        role: "Our Partner — Embassy of the Republic of Latvia",
        problem: { v: "10–15%", l: "of complex fraudulent cases are often missed by traditional checks." },
        h: "The Embassy of the Republic of Latvia has partnered with HelloVerify to screen its student and work visa applicants before they apply.",
        p: "Applicants from India, Sri Lanka, Nepal and Bangladesh complete HelloVerify’s screening first. Identity, education or employment and financial records are verified, forged documents are flagged, and the embassy decides on a verified file — not a stack of paper.",
        facts: {
          f1: { k: "Visas", v: "Student Visa · D‑Work Visa" },
          f2: { k: "Applicants from", v: "India · Sri Lanka · Nepal · Bangladesh" },
          f3: { k: "Documents", v: "Passport · Education or employment · Income tax return · Bank statements" },
          f4: { k: "Turnaround", v: "Typically 14 business days" },
        },
        deliver: {
          d1: { t: "Screened before the visa", p: "Applicants complete HelloVerify’s screening before they file with the embassy." },
          d2: { t: "Verified at the source", p: "Identity, education or employment, income tax and bank records are checked with their issuers." },
          d3: { t: "Clear fraud alerts", p: "Forged documents, discrepancies, duplicate identities and high-risk applicants are flagged." },
          d4: { t: "Audit-ready report", p: "A clear, traceable report that supports a faster, more confident visa decision." },
        },
        impactK: "Impact · across our embassy screening",
        impact: {
          i1: { v: "3×", l: "faster than the industry average" },
          i2: { v: "99.2%", l: "verified report rate" },
          i3: { v: "14", l: "business days, typical turnaround" },
        },
        why: {
          w1: { t: "Customised to the embassy", p: "Our services are tailored in precise accordance with the embassy’s specific requirements from the applicant." },
          w2: { t: "Data sovereignty", p: "Secure local data storage and processing, in line with data localisation laws, regulatory mandates and government security requirements." },
          w3: { t: "Trusted compliance", p: "Certified under ISO/IEC 27001 and ISO/IEC 27701 and fully GDPR compliant, with complete audit traceability." },
        },
      },
      italy: {
        name: "Embassy of Italy",
        ledeName: "the Embassy of Italy",
        micro: "EMBASSY OF ITALY · NEW DELHI · NATIONAL VISA VERIFICATION · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 03 / 04",
        role: "Our Partner — Embassy of Italy (New Delhi)",
        problem: { v: "Tampered documents", l: "Counterfeit papers and fraudulent company submissions compromise immigration integrity and security." },
        h: "Italian National Visa applicants are recommended to verify their documents with HelloVerify — to increase their credibility and ease visa processing.",
        p: "For work, study, business and family visas across the Embassy of Italy’s New Delhi jurisdiction, HelloVerify verifies identity, education or employment, financial and company records before the application is filed — so the embassy receives documents it can trust, and genuine applicants move faster.",
        facts: {
          /** Non-breaking hyphens (U+2011): "D-" alone at a line end reads as a typo. */
          f1: { k: "Visas", v: "D‑Work · D‑Student · D‑General · D‑Business" },
          f2: { k: "Jurisdiction", v: "New Delhi, Haryana, Punjab, Rajasthan, Uttar Pradesh and five more" },
          f3: { k: "Checks", v: "Identity · Education or employment · Bank statements · Company details" },
          f4: { k: "Turnaround", v: "Typically 14 business days" },
        },
        deliver: {
          d1: { t: "Verified before filing", p: "Visa support documents are verified before the application reaches the embassy." },
          d2: { t: "Checked at the source", p: "Identity, education or employment, bank and company records are confirmed with their issuers." },
          d3: { t: "Fraud caught early", p: "Tampered documents and fraudulent company submissions are flagged before a decision." },
          d4: { t: "A credible application", p: "Genuine applicants arrive with verified documents, easing visa processing." },
        },
        impactK: "Impact · across our embassy screening",
        impact: {
          i1: { v: "3×", l: "faster than the industry average" },
          i2: { v: "99.2%", l: "verified report rate" },
          i3: { v: "14", l: "business days, typical turnaround" },
        },
        why: {
          w1: { t: "Digital & paperless", p: "Application, document collection, verification, reporting and decision run through one secure, paperless workflow." },
          w2: { t: "Audit-ready reports", p: "Clear, comprehensive and audit-ready reports enable faster, more confident decision making." },
          w3: { t: "Clear fraud alerts", p: "Fraud intelligence and advanced document analysis detect forged documents, discrepancies and high-risk applicants." },
        },
      },
      mohesr: {
        name: "Ministry of Higher Education & Scientific Research (UAE)",
        ledeName: "the UAE’s Ministry of Higher Education and Scientific Research",
        micro: "MOHESR · UNITED ARAB EMIRATES · DEGREE RECOGNITION · PRIMARY SOURCE VERIFICATION ·",
        record: "Record 04 / 04",
        role: "Authorized Verification Partner — MOHESR (UAE)",
        problem: { v: "Degree mills", l: "sell certificates that pass a visual check. Recognition has to be earned at the source." },
        h: "An authorized verification partner for the UAE’s Ministry of Higher Education and Scientific Research.",
        p: "MOHESR requires Primary Source Verification before it recognises any degree earned outside the UAE. HelloVerify confirms the university is accredited, verifies the degree with the university that awarded it, and delivers the Degree Verification Document the applicant needs for their Certificate of Recognition.",
        facts: {
          f1: { k: "Requirement", v: "PSV for any degree earned outside the UAE" },
          f2: { k: "Outcome", v: "Degree Verification Document for MOHESR" },
          f3: { k: "Documents", v: "Degree certificate · Passport · Emirates ID (UAE residents)" },
          f4: { k: "Sign-in", v: "UAE PASS" },
        },
        deliver: {
          d1: { t: "Accreditation check", p: "The university is confirmed as accredited and legitimate — not a diploma or degree mill." },
          d2: { t: "Verified with the university", p: "The degree is confirmed directly with the institution that awarded it." },
          d3: { t: "Degree Verification Document", p: "An evidence-backed document, issued for MOHESR." },
          d4: { t: "Certificate of Recognition", p: "The applicant proceeds to MOHESR’s official recognition of their qualification." },
        },
        impactK: "Impact · across our manpower & education work",
        impact: {
          i1: { v: "15", l: "calendar days, standard turnaround" },
          i2: { v: "12–14%", l: "of applications flagged for fraud" },
          i3: { v: "8+", l: "years of primary source verification" },
        },
        why: {
          w1: { t: "Proven expertise", p: "8+ years of expertise in primary source verification, trusted by government authorities worldwide." },
          w2: { t: "Global verification company", p: "Operating across 120+ countries with direct access to thousands of universities and accredited institutions." },
          w3: { t: "Real-time tracking", p: "Applicants follow their application’s progress at every stage using their case number." },
        },
      },
    },
  },

  /** `sections/GovWhy.tsx` — "Why Governments, Authorities or Large
   *  Enterprise Customers Work With HelloVerify", straight after the seals
   *  (29 Sep 2026). The six titles and bodies are the old site's card grid
   *  word for word, with one edit: `govs` no longer names India and the
   *  Kingdom of Saudi Arabia, which the seals above dropped. `trust`'s body
   *  was the seals band's closing line until this band took it, so the page
   *  says it once.
   *
   *  `viz` holds the words drawn inside each reason's picture
   *  (`GovWhyArt.tsx`): visible text a translator must see, though the
   *  pictures themselves are `aria-hidden` — the title and body say it. */
  govWhy: {
    kicker: "Why HelloVerify",
    kickerEnd: "Six reasons · One infrastructure",
    headingA: "Why Governments, Authorities & Large Enterprises",
    headingB: "Work With HelloVerify",
    items: {
      trust: {
        t: "Trust Infrastructure",
        p: "Governments are not simply buying verification reports they are investing in national trust infrastructure that underpins every regulated interaction.",
      },
      psv: {
        t: "Primary Source Verification at Scale",
        p: "Verify individuals before they receive a work permit, immigration approval, professional licence, security clearance, or access to regulated professions.",
      },
      platform: {
        t: "AI Powered Trust Platform",
        p: "The same platform verifies businesses, suppliers, contractors, and institutions unifying trust across public and private ecosystems.",
      },
      govs: {
        t: "Governments We Work With",
        p: "Trusted by leading enterprises and government authorities across Singapore, the United Arab Emirates and European authority verification workflows.",
      },
      longTerm: {
        t: "Long-Term Digital Infrastructure",
        p: "The long-term value lies in trusted digital infrastructure that governments and regulators can rely on for years to come.",
      },
      evidence: {
        t: "Evidence-Backed Reports",
        p: "Every verification is supported with clear remarks, verification artefacts and an auditable trail for confident decision making.",
      },
    },
    viz: {
      gates: { g1: "Work permit", g2: "Immigration", g3: "Licence", g4: "Clearance", g5: "Regulated role" },
      core: "AI",
      nodes: { n1: "Businesses", n2: "Suppliers", n3: "Contractors", n4: "Institutions" },
      since: "2018",
      today: "Today",
      ahead: "Years to come",
      stamp: "VERIFIED",
      proofs: { p1: "Clear remarks", p2: "Verification artefacts", p3: "Auditable trail" },
    },
    /** The band's foot: the certifications the immigration page states, and
     *  the ask. */
    certs: "ISO/IEC 27001 · ISO/IEC 27701 · GDPR compliant",
    cta: "Talk to our team",
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
    sheet: "Sheet 04 / 12",
    heading: "Government &",
    headingEm: "International Authorities",
    lede: "Verify individuals before they receive a work permit, immigration approval, professional licence, security clearance, or access to regulated professions.",
    tabsLabel: "Government solutions",
    prev: "Previous dossier",
    next: "Next dossier",
    explore: "Explore More",
    talk: "Talk to Sales",
    /** Over the authority cards at the foot of the Immigration and the
     *  Manpower & Education dossiers (30 Sep 2026: the "Select Authority"
     *  dropdown and the lone MOM pill became visible logo cards, as on the
     *  old site's solution cards). */
    selectAuthority: "Authorities we work with",
    authorities: {
      latvia: "Embassy of the Republic of Latvia",
      italy: "Embassy of Italy",
      mohesr: "Ministry of Higher Education & Scientific Research (UAE)",
    },
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

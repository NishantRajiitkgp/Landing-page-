/** English copy for `app/[locale]/individuals/**` — the consumer audience hub,
 *  the HelloV product page, and the two vertical pages built on
 *  `components/templates/VerticalPage.tsx`. Four files, one namespace, per the
 *  rule at the end of `./index`'s recipe.
 *
 *  The reasoning for every shape — why the English object is the schema, why a
 *  label is keyed by its destination, why rich text is real JSX, why the
 *  dictionary holds almost no arrays — is in `./index`'s header and is not
 *  repeated here.
 *
 *  MEASURED: **105 matched nodes, 367 leaves**, asserted in
 *  `tools/test/copy.test.ts` §15. 105 is the pre-migration `>text<` matcher
 *  (unchanged — only the leaf side is asserted). HelloV grew from 77 to 135
 *  leaves when Part 1 of the content restore replaced the invented Basic /
 *  Advanced plans with the live old catalogue (8 packages, 6 singles, 4
 *  advanced). The other three files did not move.
 *
 *      individuals/page.tsx       22 nodes ->  52 leaves
 *      individuals/hellov         59       -> 135
 *      individuals/home-family    11       ->  86
 *      individuals/immigration    13       ->  93
 *
 *  (plus `crumb`, the one leaf all four share, which is why the four rows
 *  sum to 366 and the namespace holds 367.)
 *
 *  The two ends have one cause each. `hellov` is 300 lines of hand-written
 *  markup and the matcher reads most of it, so its ratio is near one; the two
 *  VerticalPage clients are almost entirely PROPS — `lanes`, `pills`, `rows`,
 *  `steps`, `faqs`, four answer-block head/lede pairs and a `closing` object
 *  — and a `>text<` matcher cannot see a single one of them. That is the
 *  header's "the more a component is ALREADY data-driven, the more of its copy
 *  a `>text<` count misses", arriving through a template rather than through a
 *  local `const`. An agent sizing a VerticalPage client by ~3x under-buys by
 *  nearly half.
 *
 *  WHAT DID NOT MOVE, and why:
 *
 *  - **`generateMetadata`.** Nothing to move: all four pages call
 *    `pageMetadata(locale, PATH)` and every title and description already
 *    lives in `lib/seo/copy.ts`, which `check:sitemap` compares against the
 *    built pages. §8.1's table owns the `<head>`; this one owns the `<body>`.
 *
 *  - **`SERVICE` on the three pages that carry one** — `name`, `serviceType`,
 *    and `hellov`'s two `offers`. `./business.en.tsx` made this call for the
 *    same object and the argument is unchanged: `description` is already
 *    `copyFor(PATH).description`, so moving `name` here would make one
 *    JSON-LD node read from two copy sources, and `serviceType` is a
 *    schema.org classification — structure in the sense an href is.
 *
 *    RECORDED RATHER THAN RESOLVED: `hellov`'s `offers[].name`/`description`
 *    repeat two live catalogue titles and their check lists
 *    (`plans.packages.driver.tt` and `plans.packages.homeStaff.tt`). They
 *    cannot be shared: `SERVICE` is a module-level `const` evaluated outside
 *    the component, so it cannot `await copy()`. The same posture
 *    `./contact.en.tsx` takes for the side card that duplicates
 *    `chrome.closingCta`.
 *
 *  - **`VerticalPage`'s own eleven leaves.** Already gone; see
 *    `./templates.en.tsx`. Its props and rendering contract are untouched by
 *    this slice, which is why `governments/**` can be migrated independently.
 *
 *  - **`fast`, `laneCols`, `span`, `img`, every `href`.** Structure. `fast`
 *    picks a CSS modifier from a fact about turnaround; it stays beside the
 *    `className` it drives, exactly as `./business.en.tsx` left `pl3 fast` in
 *    the page.
 *
 *  REACT KEYS. Five iterated surfaces in this subtree key on a string that is
 *  now a leaf: the hub's four `.ph` path cards key on `c.h`, and
 *  `VerticalPage` keys lanes on `l.gt`, pills on `p.n`, steps on `s.t` and
 *  table rows on `r.nm`. Third corollary in `./index`'s byte-identity
 *  section — a rename in any of those leaves is a changed React key and a
 *  changed flight payload. `tools/test/copy.test.ts` §15 pins the
 *  pre-migration strings, typed out from the snapshots rather than read back
 *  out of this file, which is the shape §10 uses for the same guard.
 *
 *  NO `as const`, per the recipe.
 */
import type { ReactNode } from "react";

export const en = {
  /** The subtree's own breadcrumb rung: the hub's, and the parent rung on all
   *  three pages below it. One leaf, four renderings — the call
   *  `./business.en.tsx` makes for its `crumb`. */
  crumb: "Individuals",

  /** `/individuals` — the audience hub (Template 2). */
  hub: {
    closing: {
      heading: (
        <>
          Trust is lovely. <em>Proof is better.</em>
        </>
      ),
      sub: "One photo, thirty minutes, and you know.",
      ctaLabel: "Start a check",
    },
    hero: {
      /** Plain `&`, NOT `&amp;`. The JSX read `For individuals &amp; families`;
       *  JSX decodes the entity before React sees it and React re-escapes on
       *  the way out, so a literal `&amp;` in a STRING leaf emits
       *  `&amp;amp;`. Second corollary in `./index`, and the trap
       *  `tools/test/copy.test.ts` §3 exists for. Same for `plans` below. */
      k: "For individuals & families",
      h1: (
        <>
          Verify anyone. <em>From your phone.</em>
        </>
      ),
      sub:
        "The same verification ministries use, for the people in your life. Send a photo of the " +
        "document over WhatsApp, and the report comes back to the same chat — often in half an hour.",
      cta: "Start a check",
      plans: "See plans & prices",
    },
    /** The four `.strip3` figures. Each carries its own `<b>` for the reason
     *  `./countries.en.tsx#strip` sets out: the alternative is a label leaf
     *  beginning with a space, which §3 of the test rejects. `consent` carries
     *  a `<span className="dot" />` — markup travelling with the phrase, for
     *  the reason that file gives for `inCountry`. */
    strip: {
      thirtyMin: <><b>30 min</b> for most checks</>,
      noApp: <><b>No</b> app to install</>,
      since2018: <><b>20M+</b> checks since 2018</>,
      consent: <><span className="dot" /> consent-first, always</>,
    },
    /** The four `.ph` path cards, keyed by what they point at rather than by
     *  position — the shape `./index`'s "Where the keys come from" section
     *  argues for, with the href, the image and the grid span left in the
     *  page. `individuals.ts` exports the key union so a fifth card added
     *  without a label is TS2322 at the page's own array.
     *
     *  TWO OF THESE POINT AT THE SAME ROUTE (`hellov` and `tenants` both link
     *  to `/products/hellov`), which is why the key is an id and not the
     *  href: keying by destination would have collapsed two cards into one.
     *  `h` is also the React key the page renders with — see the header. */
    paths: {
      hellov: {
        tag: "HelloV",
        from: "30 minutes",
        h: "Verify anyone",
        p: "A driver, a maid, a tenant, a date. Send a photo of the document over WhatsApp — the report comes back to the same chat.",
      },
      immigration: {
        tag: "Visa & immigration",
        from: "before you file",
        h: "Screen your own papers",
        p: "Find the problem in your documents before an embassy does — and before the application fee is spent.",
      },
      homeFamily: {
        tag: "Home & family",
        from: "30 minutes",
        h: "The people in your home",
        p: "Nannies, drivers, cooks, carers, tutors. The people you trust with your children and your keys.",
      },
      tenants: {
        tag: "Tenants & deals",
        from: "30 minutes",
        h: "Before you hand over keys",
        p: "A tenant, a buyer, a business partner — identity and record checked before money or property moves.",
      },
    },
    whatPeopleCheck: {
      k: "What people check",
      h: "Who can I run a background check on?",
      lede:
        "HelloVerify checks anyone you are about to trust: a driver for the school run, a " +
        "nanny, a tenant, a buyer, a business partner — or your own documents before a visa " +
        "interview. Most checks come back in about 30 minutes, over WhatsApp.",
    },
    howItWorks: {
      k: "How it works",
      /** Read TWICE: as this band's `<h2>` and as the `HowTo` node's `name`,
       *  which §17 condition 18 requires to be the heading verbatim and
       *  `check:schema` compares on the built page. One leaf rather than two
       *  identical literals a translation could part — the call
       *  `business/employee-verification` already made. */
      h: "How do I run a background check from my phone?",
      lede:
        "You message HelloV on WhatsApp and photograph the person's document; they consent on " +
        "their own phone. HelloVerify then asks the transport authority, court or registry that " +
        "issued it, and the plain-language report returns to the same chat — no app, no account.",
    },
    /** `Steps` keys each card on `s.t`; the ORDER stays in the page. */
    steps: {
      you: {
        n: "01 · You",
        t: "Send a photo",
        p: "Message HelloV on WhatsApp and photograph the person's document. They consent on their own phone.",
      },
      us: {
        n: "02 · Us",
        t: "We check the source",
        p: "Not a database of copies — the transport authority, the court, the registry that issued it.",
      },
      chat: {
        n: "03 · The chat",
        t: "The report",
        p: "A plain-language result with the source named, back in the same conversation.",
      },
    },
    consent: {
      k: "Your responsibility, and ours",
      h: "Can I check someone without telling them?",
      lede:
        "No. Every HelloVerify check needs the consent of the person being verified, given on " +
        "their own phone before anything runs — every time. You can't check someone behind their " +
        "back, and HelloVerify won't help you try.",
    },
    /** The two `.cert` cards. Deliberately NOT `CREDENTIAL_MARKS` records —
     *  the page's own comment explains at length that these are a STANCE in
     *  `.cert` markup rather than credential cards, which is why their words
     *  are copy and live here. `alt` is a plain `string` leaf for the reason
     *  `./index` gives: a leaf's type is whatever English uses, and an
     *  attribute cannot take a node. */
    certs: {
      consent: {
        alt: "GDPR",
        h: "They consent, then we check",
        p: "The person sees what is being verified and agrees to it before anything runs.",
      },
      retention: {
        alt: "ISO 27001",
        h: "Documents deleted on schedule",
        p: "ISO 27001 certified storage, encrypted, with retention limits — not kept forever.",
      },
    },
  },

  /** `/products/hellov` — the consumer product page (Template 4).
   *  Catalogue, prices and hero line are the live old CMS
   *  (`hellov.base.json`), not the invented Basic / Advanced pair. */
  hellov: {
    crumb: "HelloV",
    closing: {
      heading: (
        <>
          Verify anyone instantly <em>on WhatsApp.</em>
        </>
      ),
      sub: "Verification made easy on WhatsApp by HelloVerify.",
      ctaLabel: "Start verification",
    },
    hero: {
      k: "Individuals · HelloV",
      /** Three children — a text node, a `<br />`, and an `<em>` — written on
       *  the same lines the `<h1>` used, so the newline-plus-indent after the
       *  `<br />` folds away exactly as it did before. The shape
       *  `./templates.en.tsx#compliance.head` documents. Old CMS title:
       *  "Make Sure You and Your Family Are Safe!". */
      h1: (
        <>
          Make sure you and your family<br />
          <em>are safe.</em>
        </>
      ),
      sub:
        "Verification made easy on WhatsApp by HelloVerify. From nannies and house staff to " +
        "drivers and tenants — our verification is 100% digital, fast and accurate.",
      cta: "Start verification",
      plans: "See packages & prices",
    },
    strip: {
      thirtyMin: <><b>30 min</b> typical turnaround</>,
      noApp: <><b>WhatsApp</b> — no app to install</>,
      price: <><b>₹499</b> packages from</>,
      consent: <><span className="dot" /> they consent first, always</>,
    },
    chat: {
      k: "In one conversation",
      h: "Can I run a background check over WhatsApp?",
      lede:
        "Yes. HelloV runs entirely inside WhatsApp — scan the QR with the WhatsApp camera, " +
        "select who you want to verify, and the person being verified consents on their own " +
        "phone. Families use it for drivers, home staff, nannies and tenants. Single checks " +
        "start at ₹199; household packages start at ₹499.",
    },
    /** The four `.when3` cards, written out longhand in the page, so each is
     *  three text-node swaps and the card keeps its three children. Subjects
     *  and included checks are the old HelloV packages. */
    when: {
      driver: {
        wt: "A driver",
        wp: "Driving License Check and Address Check — the Driver Verification package.",
        wm: "₹499",
      },
      maid: {
        wt: "Home staff or nanny",
        wp: "Criminal Check and Identity Check, before they are alone in your home.",
        wm: "₹549–₹599",
      },
      tenant: {
        wt: "A tenant",
        wp: "Identity Check and Address Check, before the keys and the deposit change hands.",
        wm: "₹549",
      },
      online: {
        wt: "Someone you met online",
        wp: "Identity Check and Criminal Check — Verify Anyone or Know Your Contact.",
        wm: "₹1099",
      },
    },
    plans: {
      k: "Packages",
      h: "How is a HelloV background check priced?",
      lede:
        "HelloV is priced per person rather than by subscription. Household packages start at " +
        "₹499. Single checks start at ₹199. Advanced packages add more checks from ₹1399. " +
        "Every check needs the person's consent.",
      /** The `.rc` card's invariant chrome, hoisted because every receipt
       *  says it — one decision for a translator. The shape
       *  `sections.packages` already uses for `package`/`buy`. */
      card: {
        hd: "Package",
        perPerson: "Per person",
        perCheck: "Per check",
        inclGst: "incl. GST",
        readyIn: "Ready in",
        buy: "Buy now",
      },
      /** ONE FLAT TABLE for every check pill on any receipt. The page holds
       *  which SKU includes which key; the translator sees each check once.
       *  Names are the old CMS `checkPills` / `checks[].label` strings. */
      checks: {
        drivingLicense: "Driving License Check",
        address: "Address Check",
        criminal: "Criminal Check",
        identity: "Identity Check",
        voterId: "Voter Id Check",
        aadhaar: "Aadhaar Check",
        credit: "Credit Check",
      },
      packages: {
        driver: {
          tt: "Driver Verification",
          sub:
            "Quickly verify a driver's licence and identity to confirm authenticity and " +
            "eligibility, helping you make safer, more confident decisions with a fast, " +
            "secure, and easy-to-use digital check.",
          price: "₹499",
        },
        homeStaff: {
          tt: "Home Staff",
          sub:
            "Verify domestic help and security staff before hiring. Build a safer environment " +
            "for your family with trusted, digital checks you can act on quickly.",
          price: "₹599",
        },
        tenant: {
          tt: "Tenant Verification",
          sub:
            "Before you take a decision, know who you're letting in. Verify your tenant, " +
            "tutor, caretaker, or anyone else with identity and location clarity you can rely on.",
          price: "₹549",
        },
        nanny: {
          tt: "Nanny Verification",
          sub:
            "Ensure your child is in safe hands. Verify nannies and caregivers so your kids " +
            "are protected by checks that match how much trust you're placing in someone.",
          price: "₹549",
        },
        verifyAnyone: {
          tt: "Verify Anyone",
          sub:
            "Before you take a decision, verify anyone you need to trust. Confirm identity " +
            "and criminal background with fast, secure digital checks you can rely on.",
          price: "₹1099",
        },
        cyberIdentity: {
          tt: "Cyber Identity Verification",
          sub:
            "Stay protected from online fraud and impersonation. Verify cyber identity with " +
            "fast, secure checks that help you trust digital interactions with confidence.",
          price: "₹1099",
        },
        knowIdentity: {
          tt: "Know The Identity",
          sub:
            "Protect yourself from online identity fraud. Validate documents and databases " +
            "with fast, accurate checks that confirm who someone really is.",
          price: "₹1099",
        },
        knowContact: {
          tt: "Know Your Contact",
          sub:
            "Before you trust a new contact, know who you are dealing with. Verify picture, " +
            "ID, and background with fast, reliable checks you can act on quickly.",
          price: "₹1099",
        },
      },
      note:
        "Prices are the live HelloV catalogue · the person being verified consents before any " +
        "check runs",
    },
    singles: {
      k: "Single checks",
      h: "What if I only need one check?",
      lede:
        "Try our single checks for individual needs. Get a verified report against your chosen " +
        "background check — from ₹199.",
      cards: {
        age: {
          tt: "Age Verification",
          sub: "Establishes candidate's age by verifying government-issued documents containing date of birth.",
          price: "₹199",
          ready: "30 minutes",
        },
        employment: {
          tt: "Digital Employment Check",
          sub: "Verifies applicant's previous employer name, dates of joining and relieving instantly",
          price: "₹299",
          ready: "60 minutes",
        },
        licence: {
          tt: "Driving License Check",
          sub: "Verifies driver name, license number and validity of license instantly",
          price: "₹299",
          ready: "30 minutes",
        },
        pan: {
          tt: "Pan Card Check",
          sub: "Authenticate PAN card information to confirm identity and prevent fraud",
          price: "₹299",
          ready: "30 minutes",
        },
        criminal: {
          tt: "Criminal Record Check",
          sub: "Checks court records for any cases against the candidate",
          price: "₹899",
          ready: "30 minutes",
        },
        address: {
          tt: "Digital Address Check",
          sub: "Verifies address digitally through documents & live geo location",
          price: "₹299",
          ready: "30 minutes",
        },
      },
    },
    advanced: {
      k: "Advanced packages",
      h: "What is in an advanced HelloV package?",
      lede:
        "Advanced packages add more checks for the same household roles. Home staff and nanny " +
        "are ₹1399; driver and tenant are ₹1799.",
      badge: "Most popular",
      packages: {
        homeStaff: {
          tt: "Home Staff Verification",
          sub: "Voter Id Check, Criminal Check and Address Check.",
          price: "₹1399",
        },
        nanny: {
          tt: "Nanny Verification",
          sub: "Identity Check, Criminal Check and Address Check.",
          price: "₹1399",
        },
        driver: {
          tt: "Driver Verification",
          sub: "Driving License Check, Criminal Check, Voter Id Check and Address Check.",
          price: "₹1799",
        },
        tenant: {
          tt: "Tenant Verification",
          sub: "Credit Check, Criminal Check and Aadhaar Check.",
          price: "₹1799",
        },
      },
    },
    rule: {
      k: "The rule",
      /** Read twice — `<h2>` and `HowTo` name. See `hub.howItWorks.h`. */
      h: "Is it legal to check someone yourself?",
      lede:
        "Yes — with consent, which is the law rather than a HelloV policy. The person receives a " +
        "message showing exactly what will be checked and consents on their own phone; without " +
        "that no check runs and you aren't charged. Documents are deleted on schedule.",
    },
    steps: {
      agree: {
        n: "01",
        t: "They agree",
        p: "The person receives a message, sees exactly what will be checked, and consents on their own phone.",
      },
      check: {
        n: "02",
        t: "We check",
        p: "Only the checks they agreed to, only at the authority that issued the document.",
      },
      deleted: {
        n: "03",
        t: "Then it's deleted",
        p: "Documents are kept for a bounded period, encrypted, then removed on schedule.",
      },
    },
    faqHead: <>Before you start.</>,
    /** `<FaqSection>` renders these AND emits the matching `FAQPage` node from
     *  the same records, which is what Google requires (BUILD-SPEC §8.2). The
     *  ORDER is structure and stays in the page. */
    faqs: {
      knows: {
        q: "Does the person know I'm checking them?",
        a: "Yes — always. They get a message explaining what is being verified and must consent on their own phone before anything runs. A check without consent isn't something we can do, or would.",
      },
      refuse: {
        q: "What if they refuse?",
        a: "Then no check runs and you aren't charged. How you read a refusal is your judgement — plenty of people simply want to know what's being collected before they agree.",
      },
      search: {
        q: "How is this different from searching their name online?",
        a: "A search finds what someone published. We ask the authority that issued the document whether the record is real — the transport office for a licence, the courts for a criminal record. The report names that source beside every result.",
      },
      receive: {
        q: "What do I actually receive?",
        a: "A short report in plain language: what was checked, what came back, and who confirmed it. No risk scores, no opinions about the person — facts with sources.",
      },
      thirty: {
        q: "Is 30 minutes realistic?",
        a: "For licence, criminal and address checks, usually yes — those registries answer digitally. If something needs a slower route, the chat tells you before you pay.",
      },
    },
  },

  /** `/individuals/home-family` — a `VerticalPage` client. Facts are the
   *  live HelloV catalogue from Part 1, not a second household price list. */
  homeFamily: {
    crumb: "Home & family",
    eyebrow: "Individuals · Home & family",
    h1: (
      <>
        Make sure you and your family<br />
        <em>are safe.</em>
      </>
    ),
    sub:
      "Verification made easy on WhatsApp by HelloVerify. From nannies and house staff to " +
      "drivers and tenants — our verification is 100% digital, fast and accurate.",
    primary: "See HelloV packages",
    secondary: "See single checks",
    strip: {
      thirtyMin: <><b>30 min</b> typical turnaround</>,
      price: <><b>₹499</b> packages from</>,
      whatsapp: <><b>WhatsApp</b> — no app to install</>,
      consent: <><span className="dot" /> they consent first, always</>,
    },
    verifyHead: "What HelloV packages cover a nanny or driver?",
    verifyLede:
      "HelloV household packages start at ₹499: Driver Verification is Driving License Check " +
      "and Address Check; Home Staff is ₹599 for Criminal Check and Identity Check; Nanny and " +
      "Tenant are ₹549. Single checks start at ₹199.",
    /** `VerticalPage` keys a lane on `gt`, so these three are React keys. */
    lanes: {
      identity: { gt: "01 — Identity", gh: "Identity Check" },
      record: { gt: "02 — Record", gh: "Criminal Check" },
      address: { gt: "03 — Where they live", gh: "Address Check" },
    },
    /** ONE FLAT TABLE for the eight pills across the three lanes. Names and
     *  times are the live HelloV singles / package checks — no invented
     *  15-minute or two-day figures. `n` is the pill's React key. */
    pills: {
      identity: { n: "Identity Check", t: "₹1099" },
      photoMatch: { n: "Pan Card Check", t: "30 min" },
      age: { n: "Age Verification", t: "30 min" },
      licence: { n: "Driving License Check", t: "30 min" },
      criminal: { n: "Criminal Record Check", t: "30 min" },
      globalDatabase: { n: "Credit Check", t: "in package" },
      currentAddress: { n: "Digital Address Check", t: "30 min" },
      previousEmployment: { n: "Digital Employment Check", t: "60 min" },
    },
    stepsHead: "How do I check a nanny or driver on HelloV?",
    stepsLede:
      "A HelloV home-and-family check runs on WhatsApp: scan the QR with the WhatsApp camera, " +
      "select who you want to verify, and the person consents on their own phone before any " +
      "check runs.",
    steps: {
      you: {
        n: "01 · You",
        t: "Scan the QR",
        p: "Scan the HelloV QR code using the WhatsApp camera.",
      },
      them: {
        n: "02 · You",
        t: "Select who",
        p: "Select who you want to verify — driver, home staff, nanny or tenant.",
      },
      report: {
        n: "03 · Them",
        t: "They consent",
        p: "The person being verified consents on their own phone. Then the check runs.",
      },
    },
    tableHead: "How much do HelloV household checks cost?",
    tableLede:
      "HelloV single checks are priced and timed in the live catalogue: Age Verification ₹199 " +
      "in 30 minutes, Digital Employment Check ₹299 in 60 minutes, Driving License, PAN and " +
      "Digital Address ₹299 in 30 minutes, Criminal Record Check ₹899 in 30 minutes.",
    /** `VerticalPage` keys a row on `nm`. */
    rows: {
      identity: { nm: "Age Verification", sub: "₹199 · government ID with date of birth", tm: "30 min", src: "issuing registry" },
      globalDatabase: { nm: "Pan Card Check", sub: "₹299 · authenticate PAN details", tm: "30 min", src: "income-tax records" },
      licence: { nm: "Driving License Check", sub: "₹299 · name, number, validity", tm: "30 min", src: "state transport authority" },
      criminal: { nm: "Criminal Record Check", sub: "₹899 · court records", tm: "30 min", src: "court records" },
      address: { nm: "Digital Address Check", sub: "₹299 · documents and live geo location", tm: "30 min", src: "address records" },
      previousEmployment: { nm: "Digital Employment Check", sub: "₹299 · employer name, joining and relieving", tm: "60 min", src: "previous employer" },
    },
    tableNote: "Prices and times are the live HelloV catalogue · the person being verified consents before any check runs",
    complianceHead: "Is verification fair to the person being checked?",
    complianceLede:
      "The person being checked is usually looking for work: they see exactly what is being " +
      "verified, consent to it on their own phone, and no HelloV check runs without that. " +
      "Documents are held under retention limits rather than forever.",
    faqHead: <>From families.</>,
    faqs: {
      awkward: {
        q: "Isn't it awkward to ask?",
        a: "Less than you'd expect — verification is now normal for household staff, and many candidates prefer it, because a verified record is portable proof for the next family too. The request comes from us, not you.",
      },
      noDocuments: {
        q: "What if they have no formal documents?",
        a: "Most people have at least one government ID, which anchors Identity Check and Criminal Check. If nothing can be verified, the report says so plainly — that's information too, and it's better than assuming.",
      },
      clean: {
        q: "Does a clean report mean they're safe?",
        a: "It means the records confirm what they told you. That's a floor, not a guarantee — keep doing the human things: references, a trial period, meeting the family. Verification removes a specific risk, not all of them.",
      },
      agency: {
        q: "Can I check an agency's staff?",
        a: "Yes, with the individual's consent, on the same HelloV packages. Agencies often say staff are 'verified' without saying by whom or against what — the report names the check.",
      },
    },
    closing: {
      heading: (
        <>
          Verify anyone instantly <em>on WhatsApp.</em>
        </>
      ),
      sub: "Verification made easy on WhatsApp by HelloVerify.",
      ctaLabel: "Start verification",
    },
  },

  /** `/products/immigration` — the second `VerticalPage` client. */
  immigration: {
    crumb: "Visa & immigration",
    eyebrow: "Individuals · Visa & immigration screening",
    h1: <>Find the problem <em>before the embassy does.</em></>,
    sub: "A visa refusal over an unverifiable degree costs the fee, the wait and sometimes the job offer. Screen your own documents first, at the same sources an authority would use.",
    primary: "Screen my documents",
    secondary: "See what gets checked",
    strip: {
      countries: <><b>120+</b> countries of documents</>,
      sources: <><b>Same</b> sources an authority uses</>,
      degree: <><b>3 days</b> for a registrar-confirmed degree</>,
      yours: <><span className="dot" /> your documents, your report</>,
    },
    verifyHead: "Which documents should I check before a visa application?",
    verifyLede:
      "HelloVerify's visa screening covers the documents an embassy questions: passport and " +
      "identity, your criminal and global-database record, and above all the degree and " +
      "employment claims you are relying on. Identity and passport confirm in 15 minutes; a " +
      "registrar-confirmed degree takes three days.",
    lanes: {
      documents: { gt: "01 — Identity", gh: "Your documents" },
      claims: { gt: "02 — Your claims", gh: "What you're relying on" },
      record: { gt: "03 — Your record", gh: "What they'll find" },
    },
    pills: {
      identity: { n: "Identity", t: "15 min" },
      passport: { n: "Passport", t: "15 min" },
      age: { n: "Age", t: "15 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      education: { n: "Education", t: "3 days" },
      employment: { n: "Employment", t: "2 days" },
      digitalEmployment: { n: "Digital employment", t: "60 min" },
      entitlementToWork: { n: "Entitlement to work", t: "60 min" },
      criminal: { n: "Criminal", t: "30 min" },
      globalDatabase: { n: "Global database", t: "15 min" },
      credit: { n: "Credit", t: "15 min" },
    },
    stepsHead: "How do I check my own documents before applying for a visa?",
    stepsLede:
      "Upload your own documents to HelloVerify by photographing them on your phone — no " +
      "appointment, no agent, no courier. Each is confirmed with the institution that issued it, " +
      "in the country it came from, and the report says which claims will fail before you file.",
    steps: {
      upload: {
        n: "01 · You",
        t: "Upload",
        p: "Photograph your documents on your phone. No appointment, no agent, no courier.",
      },
      check: {
        n: "02 · HelloVerify",
        t: "Check",
        p: "Each document confirmed with the institution that issued it, in the country it came from.",
      },
      fix: {
        n: "03 · Your report",
        t: "Fix",
        p: "You see which claims confirm cleanly and which won't — with the reason, before you file.",
      },
    },
    tableHead: "How long does visa document screening take?",
    tableLede:
      "HelloVerify measures visa screening from upload to result: identity, passport and a " +
      "global database screen in 15 minutes, a criminal record in 30, and digital employment in " +
      "60 minutes from provident-fund records. Education is the slow one at three days, " +
      "employment at two.",
    rows: {
      identity: { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", src: "issuing registry" },
      globalDatabase: { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", src: "global databases" },
      criminal: { nm: "Criminal record", sub: "court & police databases", tm: "30 min", src: "court records" },
      digitalEmployment: { nm: "Digital employment", sub: "contribution-backed work history", tm: "60 min", src: "provident fund records" },
      employment: { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
      education: { nm: "Education", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
    },
    /** The one FUNCTION leaf in this namespace, and the shape `./index`
     *  describes for a sentence that wraps something the COMPONENT owns: the
     *  `<AppLink>` carries an href and an inline style, both routing and
     *  presentation. Written on ONE line on purpose — the text child ends in
     *  a space before the node, and a line break there would fold into a
     *  separate `{" "}` child, putting two adjacent text children where one
     *  sits today and a `<!-- -->` between them. */
    tableNote: (coverage: ReactNode) => (
      <>Times shown are from upload to result · documents verified in the country of issue — see {coverage}</>
    ),
    globalCoverage: "global coverage",
    complianceHead: "Who sees my screening report?",
    complianceLede:
      "Only you. A HelloVerify screening report is not shared with an embassy, an employer or an " +
      "agent unless you send it yourself. The documents you upload are held under retention " +
      "limits, and the same evidence often satisfies a new employer's background check later.",
    faqHead: <>From applicants.</>,
    faqs: {
      accept: {
        q: "Will an embassy accept your report?",
        a: "Treat it as preparation, not a substitute. Authorities run their own verification — the point of screening first is to discover a problem while you can still correct it, rather than after a refusal.",
      },
      closed: {
        q: "My university has closed. Now what?",
        a: "Closed institutions usually transfer records to a successor body or a state authority, and we check there. If no record survives anywhere, the report says unverifiable rather than failed — a distinction that matters when you explain it to a consulate.",
      },
      abroad: {
        q: "Can you check documents from a country I've left?",
        a: "Yes — that's the normal case. The check runs in the country that issued the document, through our own offices and partner network across 120+ countries.",
      },
      employer: {
        q: "Does this help with the employer's checks too?",
        a: "Often, yes. The same evidence that satisfies a consulate usually satisfies a new employer's background check, and you already know what it will say.",
      },
    },
    closing: {
      heading: <>Fix the paperwork <em>while you still can.</em></>,
      sub: "Screen your documents before the application fee is spent.",
      ctaLabel: "Screen my documents",
    },
  },
};

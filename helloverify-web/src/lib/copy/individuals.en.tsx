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

  /** `/products/hellov` — the old `hellov.base.json`, word for word, in its
   *  order: hero, intro, the Packages / Single Checks tabs (the AI Travel tab
   *  was switched off, `showAi: false`), the Advanced Package cards.
   *  `checksInclude` is the old `common.checksInclude` label; `stepLabel`,
   *  `banner` and `mins` were hard-coded English in the old components and
   *  stay English in every locale, as the old page showed them. `pager` is
   *  the old pager's aria labels. */
  hellov: {
    crumb: "HelloV",
    hero: {
      h1: (<>Make Sure You and Your Family Are <em>Safe!</em></>),
      sub: "Verification made easy on WhatsApp by HelloVerify.",
      cta: "Talk to Sales",
    },
    intro: "From nannies and house staff to drivers and tenants - our verification is 100% digital, fast and accurate. Because everyone in your home deserves to be thoroughly verified.",
    tabs: { packages: "Packages", single: "Single Checks" },
    packages: {
      h: "Packages",
      sub: "Process is so easy, you can do it yourself",
      stepLabel: "STEP",
      steps: {
        scan: { t: "Scan QR Code", p: "using Whatsapp Camera" },
        select: { t: "Select", p: "who you want to verify" },
        person: { t: "The Person being verified", p: "using Whatsapp Camera" },
      },
      checksInclude: "Checks Include",
      buy: "Buy Now",
      items: {
        driver: {
          t: "Driver Verification",
          p: "Quickly verify a driver's licence and identity to confirm authenticity and eligibility, helping you make safer, more confident decisions with a fast, secure, and easy-to-use digital check.",
          pills: ["Driving License Check", "Address Check"],
        },
        homeStaff: {
          t: "Home Staff",
          p: "Verify domestic help and security staff before hiring. Build a safer environment for your family with trusted, digital checks you can act on quickly.",
          pills: ["Criminal Check", "Identity Check"],
        },
        tenant: {
          t: "Tenant Verification",
          p: "Before you take a decision, know who you're letting in. Verify your tenant, tutor, caretaker, or anyone else with identity and location clarity you can rely on.",
          pills: ["Identity Check", "Address Check"],
        },
        nanny: {
          t: "Nanny Verification",
          p: "Ensure your child is in safe hands. Verify nannies and caregivers so your kids are protected by checks that match how much trust you're placing in someone.",
          pills: ["Criminal Check", "Identity Check"],
        },
        verifyAnyone: {
          t: "Verify Anyone",
          p: "Before you take a decision, verify anyone you need to trust. Confirm identity and criminal background with fast, secure digital checks you can rely on.",
          pills: ["Identity Check", "Criminal Check"],
        },
        cyberIdentity: {
          t: "Cyber Identity Verification",
          p: "Stay protected from online fraud and impersonation. Verify cyber identity with fast, secure checks that help you trust digital interactions with confidence.",
          pills: ["Identity Check", "Criminal Check"],
        },
        knowIdentity: {
          t: "Know The Identity",
          p: "Protect yourself from online identity fraud. Validate documents and databases with fast, accurate checks that confirm who someone really is.",
          pills: ["Identity Check"],
        },
        knowContact: {
          t: "Know Your Contact",
          p: "Before you trust a new contact, know who you are dealing with. Verify picture, ID, and background with fast, reliable checks you can act on quickly.",
          pills: ["Identity Check", "Criminal Check"],
        },
      },
      promo: {
        brand: "HelloV",
        tagline: "Verify Anyone Instantly on WhatsApp",
        qrAlt: "Scan to open HelloV on WhatsApp",
        caption: "Verification made easy on WhatsApp by HelloVerify.",
        cta: "Start Verification",
      },
    },
    singles: {
      intro: "Try Our Single Checks for your Individual needs. Get a verified report against your chosen background check",
      banner: "Verification in just",
      mins: "mins",
      buy: "Buy Now",
      cards: {
        age: {
          t: "Age Verification",
          p: "Establishes candidate's age by verifying government-issued documents containing date of birth.",
          imgAlt: "Age verification: confirming eligibility and preventing misuse with a digital check",
        },
        employment: {
          t: "Digital Employment Check",
          p: "Verifies applicant's previous employer name, dates of joining and relieving instantly",
          imgAlt: "Digital employment check: verifying applicant date of joining and relieving",
        },
        licence: {
          t: "Driving License Check",
          p: "Verifies driver name, license number and validity of license instantly",
          imgAlt: "Driving licence check: detecting invalid licences before onboarding drivers",
        },
        pan: {
          t: "Pan Card Check",
          p: "Authenticate PAN card information to confirm identity and prevent fraud",
          imgAlt: "PAN card check: authenticating PAN details to confirm identity and prevent fraud",
        },
        criminal: {
          t: "Criminal Record Check",
          p: "Checks court records for any cases against the candidate",
          imgAlt: "Criminal record check: reviewing court records for cases against a candidate",
        },
        address: {
          t: "Digital Address Check",
          p: "Verifies address digitally through documents & live geo location",
          imgAlt: "Digital location check: verifying addresses for accurate and trustworthy location details",
        },
      },
      pager: { prev: "Previous single checks", next: "Next single checks" },
    },
    advanced: {
      h: "Advanced Package",
      buy: "Buy Now",
      badge: "MOST POPULAR",
      cards: {
        homeStaff: {
          t: "Home Staff Verification",
          price: "INR ₹1399",
          checks: ["Voter Id Check", "Criminal Check", "Address Check"],
        },
        nanny: {
          t: "Nanny Verification",
          price: "INR ₹1399",
          checks: ["Identity Check", "Criminal Check", "Address Check"],
        },
        driver: {
          t: "Driver Verification",
          price: "INR ₹1799",
          checks: ["Driving License Check", "Criminal Check", "Voter Id Check", "Address Check"],
        },
        tenant: {
          t: "Tenant Verification",
          price: "INR ₹1799",
          checks: ["Credit Check", "Criminal Check", "Aadhaar Check"],
        },
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
      globalDatabase: { n: "Credit Check", t: "₹1799" },
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

  /** `/products/immigration` - the old `immigrationMigrationService.base.json`
   *  applicant tab, word for word, in its order. The guide's extras - the FAQ
   *  categories past "process", the per-embassy How to Apply accordions, the
   *  Latvia Premium Service packages, the second-level labels - are the old
   *  SPA's `immigrationApplicantGuideExtras.ts`, which that page merged into the
   *  CMS guide; its UI lines are the old `i18n/<locale>.json`. The Latvia link
   *  labels were the English ones in every locale. The CMS embassy names are the
   *  fallback list the old page showed until the visa back office answered;
   *  cities and visa types only ever came from that back office. Document
   *  checklists differ in length per locale, so they are `lib/immigration/checklists`. */
  immigration: {
    crumb: "Immigration Authorities",
    h1: (<>Pre Screening Of <em>Applicant</em></>),
    sub: "We Help Make Your Entire Visa Application Process Smooth, Secure, and Free from Delays",
    steps: {
      h: "Get Started in 3 Simple Steps",
      items: {
        upload: { t: "Easy upload", p: "Applicants can digitally upload & update the information required for background verification in just a few minutes. We will take care of the rest." },
        reminders: { t: "Smart Reminders", p: "Timely reminders via email and message will be shared with the applicants to remind them to update and submit any pending documents." },
        dashboard: { t: "Real time dashboard", p: "Applicant can check the status of their visa screening process on the dashboard in real time anywhere, anytime." },
      },
    },
    partners: {
      h: "Our Partners",
      cta: "Start your Visa Screening",
      logos: {
        latvia: "Embassy of Latvia",
        italy: "Embassy of Italy",
        britain: "British High Commission",
        switzerland: "Embassy of Switzerland",
        zambia: "Zambia Qualifications Authority",
      },
    },
    guide: {
      h: "Information Guide",
      sub: "For your Visa Application.",
      tabs: { how: "How to Apply", docs: "Documents Required", faq: "FAQs" },
      fields: { applyingTo: "Applying To *", applyingFrom: "Applying From", visaType: "Visa Type", category: "Application Category" },
      placeholders: { embassy: "Select Embassy", country: "Select Country", visaType: "Select Type", visaChild: "Select a Visa Type Child" },
      cta: "Start Visa Screen",
      how: { t: "User Guide", p: "Please select from below drop-down menu to get Step-by-Step user guide." },
      docs: { t: "Check below mentioned required document to process VISA Screening.", p: "Please select from below drop-down menu to know the documents required." },
      destinations: {
        latvia: { name: "Embassy of Latvia" },
        italy: { name: "Embassy of Italy" },
        canada: { name: "High Commission Of Canada" },
        britain: { name: "British High Commission" },
        switzerland: { name: "Embassy of Switzerland" },
        zambia: { name: "Zambia Qualifications Authority" },
      },
      loading: "Loading…",
      errors: { embassies: "Failed to load embassies", countries: "Failed to load countries", visas: "Failed to load visa types" },
      docsHeading: "Document Required:",
      linksIntro: "Please refer to the following links for more details:",
      accordions: {
        italy: {
          who: { t: "Who can apply for Italy visa screening?", p: "Applicants from India North Jurisdiction willing to prove their reliability applying for an Italian National Visa (Work, Study, Family Reunion, etc.) are recommended to undertake visa support document verification with service provider HelloVerify to increase credibility and ease Visa processing. Residents of New Delhi, Haryana, Himachal Pradesh, Jammu & Kashmir, Punjab, Rajasthan, Uttar Pradesh, Uttarakhand and Chandigarh fall within the jurisdiction of Embassy of Italy in New Delhi." },
        },
        latvia: {
          who: { t: "Who can apply for Latvia visa screening?", p: "The Embassy has partnered with HelloVerify India Private Limited for background screening of applicants from India and Sri Lanka who are applying for Higher Studies or Work purposes (India, Sri Lanka, Nepal, Bangladesh)." },
          dependents: { t: "Does applicant need to submit application to HelloVerify for dependents (children, spouse, parents)?", p: "Please reach out directly to the Embassy for clarification on Dependent Application. HelloVerify only processes the application applied under “Student Visa” and/or “D-Work Visa”." },
        },
      },
      latviaLinks: { indian: "Indian Nationals", srilankan: "Sri Lankan Nationals", nepalese: "Nepalese Nationals", bangladeshi: "Bangladeshi Nationals" },
      premium: {
        h: "Premium Service",
        cta: "Select Your Services",
        disclaimer: "Disclaimer - The verification process is conducted strictly based on the documents submitted. Insufficiency Premium services are limited to assistance with application filing and do not influence the outcome of the visa decision.",
        clearance: {
          t: "Insufficiency Clearance",
          sub: "(Post application Filling Help)",
          price: "21 €",
          features: ["Helping with Each insufficiency raised", "Priority Support (Call & WhatsApp Support) on Insufficiency", "Document check assistance", "Hassel free Case update (Call & WhatsApp Support)"],
        },
        premium: {
          t: "Premium",
          sub: "(Application Filling)",
          price: "42 €",
          disclaimer: "Disclaimer - The verification process is conducted strictly based on the documents submitted. Premium services are limited to assistance with application filing and do not influence the outcome of the visa decision.",
          features: ["Step-by-step guidance", "Form filling assistance", "Form Document Checklist", "1 Premium Support – 1 Application", "30 Min Premium Support/session", "Video Call", "Max 2 sessions"],
        },
      },
      faqNav: {
        process: "Process",
        documents: "Documents",
        download: "Download Receipt",
        status: "Status of Application",
        payment: "Payment",
        terms: "Terms & Conditions",
      },
      faqs: {
        process: [
          { q: "Kindly educate me about the process done by HelloVerify?", a: "HelloVerify is an empanelled partner with various embassies for visa screening purposes. The candidate needs to submit and upload all information as per the process. Visa background verification will commence after submission of documents and payment by the candidate. We provide the final status of the visa application to the embassy only." },
          { q: "How do I submit my information and documents to HelloVerify?", a: "You may submit your information and documents through the online portal https://visa.HelloVerify.com and click on “How to apply” to know the steps further." },
          { q: "Why do I need to submit my documents to HelloVerify?", a: "The embassy has partnered with HelloVerify to screen the authenticity of all documents presented by the candidate for the visa screening process. Please refer to the link: https://www.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students" },
          { q: "Is it mandatory to do the visa screening at HelloVerify before applying for visa services at VFS?", a: "Yes, it is mandatory to apply first at HelloVerify and then at VFS. HelloVerify has empanelled with embassies to conduct the document screening before applying for a visa." },
          { q: "Candidate has already submitted the documents at HelloVerify, does he/she still need to re-submit the same at VFS?", a: "Yes, it is mandatory to apply first at HelloVerify and then at VFS. HelloVerify has empanelled with embassies to conduct the document screening before applying for a visa." },
          { q: "I have already taken attestation Human Resource Development(HRD)and Sub Divisional Magistrate(SDM) apostle on my educational documents and on police clearance certificate still I have to follow the above process? is it compulsory?", a: "Yes, HelloVerify screening process is still mandatory for applying for a visa application." },
          { q: "Should I attest my documents from the embassy in my country or from any other authority?", a: "You do not require document attestation for background screening from the embassy. Ensure that document scans are clear, legible and complete, to assure timely processing of your application. Please note that the documents submitted to HelloVerify should be the same as submitted to VFS." },
          { q: "I am Unable to schedule an appointment after making the payment?", a: "Once the payment has been successfully made, the “Thank You” page contains a link which directs you to the VFS Global website to schedule an appointment. Alternatively, an email will be shared to your registered email ID, with a link to schedule an appointment with VFS." },
          { q: "How to clear your insufficiency?", a: "Once you have logged in with your credentials (registered email ID & password), please follow the steps below to clear the insufficiency:", b: ["Click on Clear Insufficiency.", "Click on Browse to upload the required documents / information.", "Click on Submit to clear the insufficiency."] },
          { q: "I am facing appointment related issues with VFS Global services?", a: "For VFS appointment scheduling problems, please use the reschedule or contact links on the Thank You confirmation page after payment, check the email sent to your registered address, or contact VFS Global support through their official channels. HelloVerify completes document screening separately from VFS scheduling." },
        ],
        documents: [
          { q: "What information and documents are required to be submitted?", a: "The documents which you need to submit depend on your application category and location. Please follow the Embassy guidance and the portal instructions for your case." },
          { q: "What document to be submitted if the candidate has blocked funds in Fund Transfer Scheme with University?", a: "You can submit the FTS agreement in place of ITR and upload it on the portal." },
          { q: "What needs to be submitted for ITR document if in-case your Legal Guardian's/Sponsor's is a Farmer or a Government employee?", a: "If the sponsor is a Government employee: provide ID proof and an income letter from the department. If the sponsor is a farmer: provide proof of occupation (Ration Card/ID)." },
          { q: "What if I’m a Minor, what documents should I submit?", a: "Provide one ID proof (PAN / Driving License / Voter ID). If you do not have any, apply for PAN and share the PAN application acknowledgement number." },
          { q: "I’m self-sponsored, I do not have the ITR.", a: "ITR is generally mandatory. It may be exempted for certain cases (Government employee, farmer, non-resident sponsor, or FTS agreement)." },
        ],
        download: [
          { q: "What is HelloVerify Receipt?", a: "After successful submission of the application on the HelloVerify Visa portal, a transaction receipt will be generated and shared to the registered email ID. The receipt can also be downloaded from the portal." },
          { q: "Why is HelloVerify Receipt important?", a: "It contains payment confirmation and the transaction number as proof of payment made to HelloVerify for the visa application." },
          { q: "How do I download my payment receipt?", a: "Visit https://visa.HelloVerify.com → Visa Screening → login with your email & password → Download your payment receipt." },
        ],
        status: [
          { q: "How can I check the status of my application?", a: "Visit https://visa.HelloVerify.com → Candidate Login → enter your credentials → status is visible on the dashboard." },
          { q: "What is the turnaround time for the applications submitted to HelloVerify?", a: "HelloVerify typically takes 14 business days; this may extend as results are gathered from multiple resources. Excludes weekends and public holidays." },
        ],
        payment: [
          { q: "My payment got deducted, but no confirmation received from your end?", a: "You will receive a receipt on your email ID once payment completes. You can also download the receipt from https://visa.helloverify.com." },
          { q: "I would like to know what are the charges for background checks and for the whole process?", a: "Charges differ depending on the visa check services opted at a particular geographical location." },
          { q: "Why should I pay to HelloVerify or is it mandatory to pay to HelloVerify?", a: "If the background screening process is mandated by the authorities, payment is mandatory to process the application." },
          { q: "If you face any difficulties while filling the application form online?", a: "Check your internet connectivity and retry. You can email visascreening@helloverify.com with a screenshot of the error message." },
        ],
        terms: [
          { q: "What are the Terms & Conditions intended for?", a: "This agreement sets the rules and guidelines users must agree to and grants permission to HelloVerify to conduct the visa screening process." },
          { q: "The documents were uploaded at HelloVerify online portal however VFS is unaware of the update on HelloVerify services", a: "HelloVerify is empanelled as per Embassy guidance; please refer to: https://www.mfa.gov.lv/en/newdelhi/consular-section/applying-for-a-long-stay-visa/students" },
          { q: "How can I be sure that my documents and data is secured with HelloVerify?", a: "HelloVerify follows privacy and security standards and aims to comply with applicable data privacy laws (including IT Act 2000 and GDPR where applicable)." },
        ],
      },
    },
    easy: {
      h: "How HelloVerify makes it easy for Applicants?",
      cards: {
        trust: { t: "Visa Screening You Can Trust", p: "Centralised verification. Automated tasks. Actionable insights. Faster, smarter, data-driven decisions — for every authority, mission, and organisation that demands the best." },
        onboarding: { t: "Digital Onboarding", p: "HelloVerify offers a Digital Onboarding platform, enabling seamless one-click document intake, eliminating the need for manual work." },
        queues: { t: "No more waiting in long queues!", p: "Easily upload your documents digitally at your convenience. No more physical visits required to submit the documents." },
        reminders: { t: "Get Smart Reminders", p: "Timely reminders via email and message will be shared with the applicants to remind them to update and submit any pending documents." },
        dashboards: { t: "Real Time Dashboards", p: "Applicants can check the status of their visa screening process on the dashboard in real time anywhere, anytime." },
        secure: { t: "Secure and Compliant", p: "Stay informed at every stage of your verification journey with Secure, Compliant and Real-Time Updates." },
      },
    },
    testimonials: {
      h: "What Customer Say About Us",
      cards: {
        rohit: { name: "Rohit Sharma", quote: "Hiring staff usded to be risky, but HelloVerify made it simple and reliable. We now onboard with complete confidence.,," },
        anjali: { name: "Anjali Mehta", quote: "Fast, accurate, and seamless verification. HelloVerify helped us scale hiring without delays.,," },
        neha: { name: "Neha Verma", quote: "Finding trustworthy help is crucial With HelloVerify, I feel safe and assured every time I hire.,," },
      },
    },
  },
};

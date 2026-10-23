/** English copy for `app/[locale]/platform/**` — the hub and its three proof
 *  pages, one namespace per route subtree (the rule at the end of `./index`'s
 *  recipe).
 *
 *  Every shape argument — why the English object is the schema, why rich text
 *  is real JSX, why there is no `as const`, why the dictionary holds almost no
 *  arrays — is in `./index` and is not repeated here. What follows is the
 *  per-decision note.
 *
 *  MEASURED: **156 JSX text nodes** across the four pre-migration files by a
 *  comment-stripped `>text<` matcher (`scratchpad/pg_count_nodes.py`, the
 *  procedure `./index`'s header describes); this file holds **290 leaves**, a
 *  **1.86x** undercount, asserted in `tools/test/copy.test.ts` §13 so the ratio
 *  stays a measurement. Two other runs of "the same matcher" disagree and both
 *  are recorded rather than reconciled, the posture §7 and §9 already take:
 *  restricting a node to one SOURCE LINE scores 121 (2.40x), and the brief that
 *  commissioned this slice counted 93 (3.12x). Three implementations of "a text
 *  node" spread by 68%. The PROPORTION is the claim; the numerator is not.
 *
 *  Per file, by the 156-node run, because the spread inside the subtree is the
 *  part that is new information:
 *
 *      platform/page.tsx                 28 nodes ->  26 leaves   0.93x
 *      platform/coverage                 33       ->  99          3.0x
 *      platform/technology               52       ->  53          1.02x   (old CMS copy, 5 Oct 2026)
 *      platform/security-compliance      43       ->  99          2.3x
 *                                        (+1: the shared `crumb` leaf)
 *
 *  `./index`'s rule predicts the shape and gets it right in both directions.
 *  `/international` is 3.0x because 51 of its 99 leaves are the region
 *  table — three region headings and 24 country/time pairs living as string
 *  properties, which a `>text<` matcher cannot see at all. The hub is BELOW 1x
 *  for the opposite reason and it is the same reason §10 records for `Hero`:
 *  its three path cards are written out longhand, so the matcher counts every
 *  word of them, and nothing on the page is a table.
 *
 *  WHAT DID NOT MOVE, and why:
 *
 *  - **`generateMetadata`.** Nothing to move. All four pages read
 *    `pageMetadata(locale, PATH)` and every title and description already
 *    lives in `lib/seo/copy.ts`, which `check:sitemap` compares. §8.1's table
 *    owns what the `<head>` says; this one owns the `<body>`.
 *
 *  - **The credential names and status words** on
 *    `/platform/security-compliance`. `CREDENTIAL_MARKS` in
 *    `lib/content/company.ts` owns those (BUILD-SPEC §11a.3) and
 *    `tools/test/credentials.test.ts` holds nine surfaces to them. Only the
 *    GLOSSES are here — the page's own procurement-length overrides, which
 *    `chrome/CertCard.tsx` documents as editorial rather than claims.
 *
 *  NO `as const`, per the recipe.
 */

export const en = {
  /** The subtree's own name: the hub's single breadcrumb rung AND the parent
   *  rung on all three sub-pages. One leaf per destination — the argument
   *  `business.crumb` makes for its six renderings of one rung. */
  crumb: "Platform",

  /** `/platform` — the proof-layer hub (Template 2, lighter). */
  hub: {
    /** The `ClosingCta` overrides. Prop overrides of `chrome.closingCta`'s
     *  defaults, so they are this page's copy and not chrome's. */
    closing: {
      heading: (
        <>
          Ask us the hard questions. <em>We have files for them.</em>
        </>
      ),
      sub: "Security reviews, DPAs, conformance statements — usually within two working days.",
    },

    hero: {
      /** The same word as `crumb`, and a SECOND leaf on purpose: this is the
       *  `.k` eyebrow over the `<h1>`, a different control in a different
       *  band, and a locale may want the eyebrow to read differently from a
       *  breadcrumb rung. The split `chrome.en.tsx` makes for `nav.logoHome`
       *  and `footer.logoHome`, for the same reason. */
      k: "Platform",
      h1: (
        <>
          The machine <em>under the answer.</em>
        </>
      ),
      sub:
        "Every result on this site rests on three things: a pipeline that reads documents and " +
        "reaches issuers, controls that keep personal data safe, and a network that covers the " +
        "countries those documents come from.",
      /** Plain `&`, NOT `&amp;`. The JSX read `Security &amp; compliance`;
       *  JSX decodes the entity before React sees it and React re-escapes on
       *  the way out, so a literal `&amp;` in a STRING leaf emits
       *  `&amp;amp;`. Second corollary in `./index`'s byte-identity section.
       *  Proven again for ATTRIBUTE position while writing this file — `tsc`
       *  emits `k: "a & b"` for `k="a &amp; b"` — which is what the four
       *  `SecHead k=` leaves below depend on. */
      cta: "Security & compliance",
      seeTech: "See the technology",
    },

    /** The proof strip. Each item is `<b>figure</b> tail` — TWO children, so
     *  ONE rich-text leaf rather than two string leaves: splitting them would
     *  put two adjacent text children where one sits today and React's SSR
     *  writes `<!-- -->` between those. The fourth carries the `.dot` span for
     *  the same reason. `business.hub.strip` is the same shape. */
    strip: {
      read: (<><b>1.2 s</b> to read a document</>),
      countries: (<><b>120+</b> countries reachable</>),
      offices: (<><b>6</b> offices, twelve hours apart</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR · PBSA · NSR</>),
    },

    layers: {
      k: "Three layers",
      h: "How does the HelloVerify platform work?",
      lede:
        "The HelloVerify platform has three layers: a pipeline that reads a document in 1.2 " +
        "seconds and reaches the issuer that holds the record, controls that keep personal data " +
        "safe, and a network of six offices, twelve hours apart, covering 120+ countries.",
    },

    /** The three path cards, KEYED BY DESTINATION — `chrome.footer.links` and
     *  `lib/seo/copy.ts`'s shape. The page keeps the order, the hrefs, the
     *  images and the grid spans; those are routing and layout. Unlike
     *  `business.hub.paths` these three are written out LONGHAND in the page
     *  rather than mapped, so no `key=` is involved at all. */
    paths: {
      "/technology": {
        tag: "Technology",
        from: "API & pipeline",
        h: "Technology & APIs",
        p: "How documents are read, how issuers are reached, and how to wire it all into your systems.",
      },
      "/platform/security-compliance": {
        tag: "Security & compliance",
        from: "procurement",
        h: "Security & compliance",
        p: "Certifications, data residency, sub-processors, accessibility conformance — the file your committee asks for.",
      },
      "/international": {
        tag: "Coverage",
        from: "120+ countries",
        h: "Global coverage",
        p: "Where a document can be confirmed with the authority that issued it — and how long it takes there.",
      },
    },
  },

  /** `/international` — the old SPA's `international.base.json`, word for word.
   *  The four countries' package cards share a title and tag list per card
   *  type; the line under the title is per country (hi and ar name it).
   *  Prices and which checks each country lists are the page's. */
  coverage: {
    crumb: "International Checks",

    hero: {
      h1: (<>International Background <em>Verification</em></>),
      sub: "HelloVerify provides accurate and timely international background verification across 120+ countries and territories worldwide.",
    },

    countries: {
      uk: { name: "United Kingdom", flagAlt: "United Kingdom flag", checksFlagAlt: "United Kingdom flag" },
      uae: { name: "United Arab Emirates", flagAlt: "United Arab Emirates flag", checksFlagAlt: "United Arab Emirates flag" },
      philippines: { name: "Philippines", flagAlt: "Philippines flag", checksFlagAlt: "Philippines flag" },
      egypt: { name: "Egypt", flagAlt: "Egypt flag", checksFlagAlt: "Egypt flag" },
    },

    packages: {
      h: (<>Verify <em>Domestic Staff, Drivers, and Tenants</em> with Fast, Reliable Background Checks.</>),
      includes: "Checks Include",
      buy: "Buy Now",
      cards: {
        homeStaff: {
          t: "Home Staff Verification",
          tags: ["Criminal Check", "Passport Check", "Entitlement to Work"],
          p: {
            uk: "Quick, hassle-free background checks so you can ensure your family is in safe",
            uae: "Quick, hassle-free background checks so you can ensure your family is in safe",
            philippines: "Quick, hassle-free background checks so you can ensure your family is in safe",
            egypt: "Quick, hassle-free background checks so you can ensure your family is in safe",
          },
        },
        driver: {
          t: "Driver Verification",
          tags: ["Criminal Check", "Driving License Check", "Current Address Check"],
          p: {
            uk: "Verify your driver’s identity, licensing status, and background before entrusting them with your vehicle.",
            uae: "Verify your driver’s identity, licensing status, and background before entrusting them with your vehicle.",
            philippines: "Verify your driver’s identity, licensing status, and background before entrusting them with your vehicle.",
            egypt: "Verify your driver’s identity, licensing status, and background before entrusting them with your vehicle.",
          },
        },
        tenant: {
          t: "Tenant Verification",
          tags: ["Criminal Check", "Identity Check", "Credit Check"],
          p: {
            uk: "Verify prospective tenants quickly and confidently before finalizing a tenancy agreement.",
            uae: "Verify prospective tenants quickly and confidently before finalizing a tenancy agreement.",
            philippines: "Verify prospective tenants quickly and confidently before finalizing a tenancy agreement.",
            egypt: "Verify prospective tenants quickly and confidently before finalizing a tenancy agreement.",
          },
        },
      },
    },

    checks: {
      h: "International Checks",
      lede: "Whether you're hiring domestic staff, renting out property, or screening a potential business partner, our international verification services have you covered.",
      cols: {
        name: "Name",
        price: "Price",
        tat: "Turnaround",
      },
      empty: "No checks are available for the selected country.",
      none: "No countries match your search.",
      search: "Search country…",
      pick: "Select country",
      available: "{{count}} checks available",
      sortBy: "Sort by",
      sort: "Sort by {{column}}",
      up: "sorted ascending",
      down: "sorted descending",
      select: "Select {{name}}",
      summary: {
        h: "Your request",
        empty: "Tick the checks you need. Prices add up here as you go, in {{currency}}.",
        count: "{{count}} selected",
        total: "Estimated total",
        lines: "Checks ({{count}})",
        readyBy: "Results by {{date}}",
        cta: "Request these checks",
        clear: "Clear all",
        remove: "Remove {{name}}",
        note: "Prices are per check, in US $.",
        review: "Review",
        fast: {
          t: "Fast track",
          p: "Half the turnaround on this request.",
          extra: "+30%",
        },
        /** 13 Oct 2026: local currency, the high-risk fee, the delivery
         *  choice and the turnaround disclaimer. `{{currency}}` is the
         *  browser's own name for the code, in the page's language. */
        fx: {
          rate: "Prices per check in {{code}} · 1 US $ = {{rate}} {{code}} on {{date}}",
          charge: "Currency conversion charge",
        },
        risk: {
          tag: "Extended coverage",
          h: "{{country}} is covered through our extended verification network.",
          p: "Additional local coordination is built into every check.",
          fee: "fee per check, already included in the prices below",
          row: "incl. extended coverage fee",
          menuB: "Extended coverage:",
          menuP: "verified through our extended local network. An extended coverage fee applies to each check.",
        },
        moved: {
          one: "1 check isn’t offered in {{country}} and was removed: {{names}}.",
          many: "{{count}} checks aren’t offered in {{country}} and were removed: {{names}}.",
        },
        delivery: {
          h: "How would you like your reports?",
          each: { t: "As reports are finalised", p: "Results arrive separately", when: "from {{date}}" },
          together: { t: "All in one report", p: "One combined report", when: "on {{date}}" },
        },
        tatNote: {
          b: "Turnaround times are for reference only.",
          p: "HelloVerify delivers 99% of verifications within the stated time. Events beyond our control, such as natural disasters, war or political unrest, can extend it, and HelloVerify is not liable for such delays. If your request is affected, we’ll let you know in advance.",
        },
        feeNote: {
          b: "Third-party fees",
          p: "Courts, universities and official registries sometimes charge their own access fees. Where they apply, HelloVerify passes them on at actual cost, with no markup.",
        },
      },
      rows: {
        education: {
          nm: "Education Check",
          sub: "This check involves verifying a candidate's educational and professional qualifications, along with confirming the authenticity of the university, college, or academic institution from which the qualifications were obtained.",
          price: "$50/check",
          tat: "10-15 Days",
        },
        resume: {
          nm: "Resume Validation Check",
          sub: "Resume Validation Check involves verifying the accuracy of information provided in a candidate's resume, including education, employment, skills, and other credentials.",
          price: "$35/check",
          tat: "10-15 days",
        },
        passport: {
          nm: "Passport Check",
          sub: "This check validates the candidate's passport details, including identity information, document authenticity, and validity for international verification purposes.",
          price: "$25/check",
          tat: "10-15 days",
        },
        criminal: {
          nm: "Criminal Check",
          sub: "This check involves searching court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the candidate. We search e-court records to provide accurate results, supporting case details if any are shared with the client.",
          price: "$35/check",
          tat: "10-15 days",
        },
        reference: {
          nm: "Reference Checks",
          sub: "A reference check is a background verification process where previous employers or professional contacts are consulted to confirm a candidate's employment history, job performance and professional conduct. This helps organizations make informed hiring decisions.",
          price: "$55/check",
          tat: "10-15 days",
        },
        globalDb: {
          nm: "Global Database check",
          sub: "Global database verification involves searching international databases, including sanctions lists, watchlists, and regulatory records, to identify any adverse information related to a candidate or business entity. This check helps organizations ensure compliance and mitigate potential risks.",
          price: "$10/check",
          tat: "10-15 days",
        },
        etw: {
          nm: "Eligibility To Work Check",
          sub: "This check confirms the candidate's legal right to work in the selected country, including visa status, work permits, and compliance with local employment regulations.",
          price: "$40/check",
          tat: "10-15 days",
        },
        criminalUae: {
          nm: "Criminal Records",
          sub: "This check involves searching court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the candidate. We search e-court records to provide accurate results, supporting case details if any are shared with the client.",
          price: "$45/check",
          tat: "10-15 Days",
        },
        passportUae: {
          nm: "Passport Check",
          sub: "This check validates the candidate's passport details, including identity information, document authenticity, and validity for international verification purposes.",
          price: "$30/check",
          tat: "10-15 days",
        },
        etwUae: {
          nm: "Entitlement to Work",
          sub: "This check confirms the candidate's legal right to work in the selected country, including visa status, work permits, and compliance with local employment regulations.",
          price: "$40/check",
          tat: "10-15 days",
        },
        criminalPh: {
          nm: "Criminal Records",
          sub: "This check involves searching court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the candidate. We search e-court records to provide accurate results, supporting case details if any are shared with the client.",
          price: "$40/check",
          tat: "10-15 Days",
        },
        licensePh: {
          nm: "Driving License Check",
          sub: "This check verifies the validity and authenticity of the candidate's driving licence, including issue details, class of vehicle permitted, and entitlement status.",
          price: "$35/check",
          tat: "10-15 days",
        },
        globalPh: {
          nm: "Global Database Check",
          sub: "Global database verification involves searching international databases, including sanctions lists, watchlists, and regulatory records, to identify any adverse information related to a candidate or business entity. This check helps organizations ensure compliance and mitigate potential risks.",
          price: "$25/check",
          tat: "10-15 days",
        },
        criminalEg: {
          nm: "Criminal Records",
          sub: "This check involves searching court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the candidate. We search e-court records to provide accurate results, supporting case details if any are shared with the client.",
          price: "$40/check",
          tat: "10-15 Days",
        },
        identityEg: {
          nm: "Identity Check",
          sub: "This check involves validation of the candidate's passport, national ID, and other government-issued identity documents. We verify the identity by matching the name, date of birth, and ID number with the document provided.",
          price: "$30/check",
          tat: "10-15 days",
        },
        creditEg: {
          nm: "Credit Check",
          sub: "The credit check involves verifying the candidate's credit score and risk parameters through a Credit Bureau. A credit report is generated based on the individual's credit history. If the candidate's details are not available in the database, additional information may be required as per the Credit Bureau's guidelines.",
          price: "$45/check",
          tat: "10-15 days",
        },
      },
    },

    /** The band under the check builder, above the footer. */
    soon: {
      kicker: "Coming soon",
      before: "in",
      n: "50+",
      after: "more countries.",
      p: "The same source check, opening in the places we don’t reach yet.",
    },
  },

  /** `/technology` — the old SPA's `technology.base.json`, word for word. */
  technology: {
    crumb: "Technology",

    hero: {
      h1: (<>The Trust Technology <em>Platform</em></>),
      sub: "HelloVerify's Trust Technology Platform performs Primary Source Verification directly from authorised sources, orchestrating complex workflows across countries, institutions, and regulatory ecosystems. Powered by AI and trained on millions of verifications.",
      cta: "Contact Sales",
    },

    pillars: {
      h: "Global Workforce & Business Trust Infrastructure platform",
      sub: "The future growth engine. The next Journey",
      cards: {
        onboarding: {
          t: "Seamless Applicant Onboarding",
          p: "Our AI automatically captures, structures, and validates information directly from uploaded documents, creating clean, verification ready data without manual intervention.",
        },
        research: {
          t: "AI-Powered Research Intelligence",
          p: "Our AI research engine connects with the right authorised contacts, leverages a proprietary database of fraudulent institutions, and continuously learns from every verification to strengthen fraud detection.",
        },
        orchestration: {
          t: "ML-Driven Workflow Orchestration",
          p: "Our ML based automation engine intelligently orchestrates every verification routing cases, automating decision making, and managing complex cross-border workflows across global institutions and regulatory environments.",
        },
      },
    },

    compound: {
      h: (<>A platform that gets stronger with <em>every verification.</em></>),
      sub: "Most verification systems are static. Ours compound",
      cards: {
        intelligence: {
          t: "Every verification enriches our intelligence",
          p: "Each completed check adds to our understanding of institutions, documents and fraud patterns",
        },
        network: {
          t: "Every Connected institution expands our network",
          p: "Each new issuing authority becomes a permanent, trusted node in our verification infrastructure",
        },
        ecosystem: {
          t: "Every new customer strengthens the ecosystem",
          p: "More customers means more verifications, more data, more connections and better outcome for everyone.",
        },
      },
      /** The race beside the claims: the same eight cases, from three
       *  customers, run by a static system and by HelloVerify on one clock.
       *  `say*` narrate HelloVerify's lane case by case; `keep*` are what it
       *  keeps. The scale figures are the site's own (`/about`, the homepage
       *  fraud band); none is new here. */
      race: {
        clock: "Same cases · same clock",
        staticName: "A static system",
        staticTag: "Starts from zero, every time",
        hvTag: "Compounds with every check",
        keeps: "What it keeps",
        nothing: "Nothing. The next case starts from zero.",
        customer: "Customer",
        degree: "Degree",
        employment: "Employment",
        licence: "Medical licence",
        iit: "IIT Delhi",
        abc: "ABC Tech",
        uae: "UAE",
        checking: "Checking",
        verified: "Verified",
        caught: "Forgery caught",
        missed: "Forgery missed",
        again: "From zero, again.",
        passed: "A forged degree passes: there is nothing to compare it with.",
        still: "Still starting from zero.",
        say1: "New institution: researched once, its registrar kept.",
        say2: "New employer: its verified HR contact joins the network.",
        say3: "A new customer's check goes to a source we already know.",
        say4: "The forged seal matches a learned pattern. Caught.",
        say5: "Known employer, verified contact on file.",
        say6: "A new country, reached through the authority network.",
        say7: "Every answer makes the next one faster.",
        keepRegistrar: "IIT Delhi registrar",
        keepHr: "ABC Tech HR contact",
        keepB: "Customer B joined",
        keepPattern: "Forged seal pattern",
        keepC: "Customer C joined",
        keepUae: "UAE medical council",
        scale: "Now multiply it by every check since 2018.",
        checks: { v: "20M+", l: "checks completed since 2018" },
        fraud: { v: "12–14%", l: "of applications flagged for fraud" },
        countries: { v: "120+", l: "countries, checked at the source" },
        clients: { v: "2,000+", l: "enterprise clients" },
        pause: "Pause animation",
        play: "Play animation",
      },
    },

    platform: {
      h: "From verification provider to global trust platform.",
      sub: "HelloVerify is evolving into a global trust platform the infrastructure layer for trusted economic activity across borders.",
      cards: {
        workforceMobility: {
          t: "Workforce Mobility",
          p: "Professionals carrying verified credentials across borders.",
        },
        businessVerification: {
          t: "Business verification",
          p: "Corporate due diligence and counterparty trust.",
        },
        procurementVendor: {
          t: "Procurement & vendor trust",
          p: "Verified supply chains and vendor onboarding.",
        },
        complianceRegulatory: {
          t: "Compliance & regulatory",
          p: "Meeting the standards of regulators worldwide.",
        },
        financialOnboarding: {
          t: "Financial onboarding",
          p: "KYC and trust for financial institutions.",
        },
        digitalIdentity: {
          t: "Digital identity",
          p: "Verified credentials as the foundation of digital trust.",
        },
        crossBorder: {
          t: "Cross-border economic activity",
          p: "The trust rails for a borderless economy.",
        },
        verifiedCredentials: {
          t: "Verified credentials",
          p: "Portable, tamper evident proof of skills and qualifications.",
        },
      },
    },

    future: {
      h: "Building the Future of Digital Trust.",
      cards: {
        persistentTrust: {
          t: "Persistent Trust Layer",
          p: "Securely store verified identities, businesses, and credentials as living digital assets that remain continuously monitored and updated throughout their lifecycle",
        },
        trustedAccess: {
          t: "Trusted Access",
          p: "Governments and enterprises access continuously validated credentials instead of repeating the same verification process.",
        },
        digitalTrustInfra: {
          t: "Digital Trust Infrastructure",
          p: "This transforms HelloVerify from a verification provider into the trusted infrastructure that powers digital trust across organizations.",
        },
      },
    },

    certs: {
      h: "Enterprise-Grade Security & Compliance",
      lede: "Your data security is our top priority with multiple layers of protection and global compliance standards.",
      logos: { nsr: "NSR — Credible Data, Credible People", pbsa: "PBSA — Professional Background Screening Association", iso9001: "ISO 9001", gdpr: "GDPR — General Data Protection Regulation" },
    },

    /** The short labels drawn inside the page's illustrations. Not part of the
     *  old SPA copy, and never read out: every drawing is `aria-hidden`.
     *  `story` is the three pillar cards: one applicant's case, onboarded,
     *  researched and routed abroad, so the specimen values recur card to card. */
    art: {
      ai: "AI",
      ready: "Verification-ready",
      manual: "No manual entry",
      registrar: "Registrar",
      fraudDb: "Fraud database",
      learns: "Learns",
      router: "ML router",
      consent: "Consent",
      legalised: "Legalisation",
      residency: "Data residency",
      monitored: "Monitored",
      once: "Verified once",
      /** The hero globe: one case routed through four authorities abroad.
       *  `pause`/`play` label its motion control, the one part read out. */
      globe: {
        routing: "Routing to primary sources",
        done: "Verification complete",
        employment: "Employment Institution",
        standing: "Regulatory Body",
        licence: "Medical Authorities",
        degree: "Educational Authorities",
        corporate: "Corporate company",
        regulator: "Regulatory body",
        medical: "Medical authority",
        education: "Education institution",
        singapore: "Singapore",
        dubai: "Dubai",
        london: "London",
        boston: "Boston",
        trained: "Trained on millions of verifications",
        checking: "Checking",
        verified: "Verified",
        more: "Authorised sources worldwide",
        pause: "Pause animation",
        play: "Play animation",
      },
      story: {
        upload: "Upload documents",
        extract: "AI extracts",
        structure: "Structured profile",
        validate: "Verified data",
        profile: "Candidate profile",
        sources: "Research sources",
        intel: "AI research intelligence",
        checks: "Institution checks",
        result: "Research result",
        requests: "Verification requests",
        ml: "ML orchestration",
        routing: "Intelligent routing",
        institutions: "Global institutions",
        done: "Verification complete",
        doneSub: "Every check consolidated into a single, verified record.",

        passport: "Passport",
        degree: "University Degree",
        letter: "Employment Letter",
        republic: "Republic of India",
        fieldCheck: "Data validation",

        name: "Full name",
        passportNo: "Passport No.",
        idNo: "ID number",
        dob: "Date of birth",
        education: "Education",
        employment: "Employment",
        person: "Rohan Mehta",
        dobValue: "12 Jan 1992",
        eduValue: "B.Tech, IIT Delhi",
        jobValue: "Software Engineer at ABC Tech",

        contacts: "Authorised contacts",
        contactsSub: "University registrars, employers, government bodies",
        database: "Institution database",
        databaseSub: "Verified global institution records",
        signals: "Fraud signals",
        signalsSub: "Known fraudulent institutions and risk indicators",
        learned: "+1 learned",

        real: "IIT Delhi",
        verified: "Verified",
        status: "Status",
        recognised: "Recognised",
        degreeKey: "Degree",
        degreeValue: "B.Tech",
        fake: "ABC Tech Academy",
        flagged: "Flagged",
        highRisk: "High fraud risk",
        reason: "Reason",
        blacklisted: "Blacklisted look-alike",
        found1: "Authentic institution records",
        found2: "Authorised contacts confirmed",
        found3: "Look-alike blocked and learned",

        kyc: "Identity / KYC",
        kycSub: "Passport, national ID",
        edu: "Education verification",
        eduSub: "Degree, university records",
        job: "Employment check",
        jobSub: "Employment history",
        toUae: "Route to UAE (MOE)",
        toUsa: "Route to USA (NSC)",
        toUk: "Route to UK (HESA)",
        toSg: "Route to Singapore (MOM)",
        degreeCheck: "Degree verification",
        jobCheck: "Employment verification",
        moe: "UAE Ministry of Education",
        nsc: "National Student Clearinghouse",
        hesa: "HESA (Higher Education)",
        mom: "MOM (Ministry of Manpower)",
      },
    },
  },

  /** `/platform/security-compliance` — the procurement page.
   *
   *  ITS CO-LOCATED `./content.ts` WAS RULED COPY, and the ruling is
   *  `business/enterprise/content.ts`'s verbatim: four page-local record lists
   *  — seven credential glosses, six artefact rows, four residency rows and
   *  five FAQ pairs — on ONE route, gated by nothing, each a paragraph a
   *  translator translates. That is the opposite of `lib/content/checks.ts`
   *  and `company.ts`, which are the catalogues SEVERAL routes read and the
   *  register of the site's CLAIMS, held to agreement by
   *  `tools/test/credentials.test.ts`: change "20M+" there and a fact moves on
   *  nine surfaces. That module's own header already drew the line — it argued
   *  for living beside the page rather than in `lib/content/` precisely
   *  because "every record below is copy for one route".
   *
   *  What stayed behind is the STRUCTURE: which credentials in which order,
   *  the artefact rows' `req` flag (a CSS class, not a word) and their order,
   *  and the order of the residency rows and the questions. The file keeps its
   *  headroom argument — `page.tsx` measured 383 lines against the 300 limit
   *  before it existed — and the words it held are here. */
  security: {
    crumb: "Security & compliance",

    closing: {
      heading: (
        <>
          Send us the questionnaire. <em>We'll send the file.</em>
        </>
      ),
      sub: "Security reviews and DPAs usually answered within two working days.",
    },

    /** ONE LEAF FOR THREE BUTTONS — the hero's primary, the `ClosingCta`
     *  override and the one under the artefact table. All three are the same
     *  call to action to the same route on the same page; three leaves would
     *  let a translator make the page ask for three different things, which is
     *  the drift this layer exists to stop rather than a freedom worth having.
     *  The `/international` `hours` leaf is the same judgement. */
    requestPack: "Request the compliance pack",

    hero: {
      k: "Platform · Security & compliance",
      h1: (
        <>
          The file your <em>committee asks for.</em>
        </>
      ),
      sub:
        "We sell verification to ministries and regulated industries. That means procurement " +
        "reviews our security posture before anyone reviews our product — so the artefacts live " +
        "here, not in a sales deck.",
      available: "See what's available",
    },

    strip: {
      iso: (<><b>ISO 27001</b> certified</>),
      gdpr: (<><b>GDPR</b> aligned, DPA available</>),
      pbsa: (<><b>PBSA</b> member</>),
      answer: (<><span className="dot" /> 2 working days to answer a review</>),
    },

    /** `k` was written `Certifications &amp; memberships` in ATTRIBUTE
     *  position and is stored decoded, for the reason `hub.hero.cta` records:
     *  measured with `tsc --jsx react-jsx`, `k="a &amp; b"` emits
     *  `k: "a & b"`, so the entity never reaches React either way and a stored
     *  `&amp;` would emit `&amp;amp;`. `h` is a JSX leaf and keeps its
     *  `<br />` — the opposite rule, because there the markup IS the leaf. */
    certs: {
      k: "Certifications & memberships",
      h: (<>What we hold,<br />stated precisely.</>),
      lede:
        "Certified, compliant, aligned and member are four different claims. We don't blur " +
        "them — a reviewer who catches a vendor overstating one stops trusting the rest.",
    },

    /** THE PROCUREMENT-LENGTH GLOSSES, keyed by `CredentialId` so an id
     *  renamed in `lib/content/company.ts` is a type error here. The cards
     *  themselves — logo, credential name, status word — come from
     *  `CREDENTIAL_MARKS`, are NOT overridable, and are not in this file: those
     *  are claims about the company and are identical wherever they appear.
     *  Length is editorial; claims are not (`chrome/CertCard.tsx`).
     *
     *  All seven are overridden, which is why the override exists: this is the
     *  page a security reviewer is sent, so each card has to say what the
     *  artefact IS and whether it can be ordered. The reasoning for each
     *  individual gloss — why ISO 9001 states what it does NOT cover, why
     *  ISO 27701, SOC 2 and ISO 9001 rest on weaker evidence — stayed with
     *  `./content.ts`'s header where it was written, because it is about the
     *  CLAIMS and the claims did not move. */
    glosses: {
      iso27001:
        "Information security management, independently audited. Certificate and scope statement available on request.",
      iso27701:
        "Privacy information management: the extension of ISO 27001 that governs how personal data is handled, as controller and as processor.",
      soc2:
        "Service-organisation controls for security, availability and confidentiality. Compliant rather than certified — a SOC 2 engagement produces an attestation report, not a certificate.",
      iso9001:
        "Quality management systems: how service delivery is documented, measured and improved. It certifies the management system, not the outcome of any individual verification — and unlike everything else on this list, it is not an information-security, privacy or data-protection standard.",
      gdpr:
        "Lawful basis, consent capture, retention limits, erasure and subject-access handling built into every workflow. DPA available.",
      pbsa:
        "Member of the Professional Background Screening Association, the global standards body for the screening industry.",
      nsr: "India's National Skills Registry, the registry of verified IT and ITeS professionals.",
    },

    data: {
      k: "Data protection",
      h: "How is candidate data protected?",
      lede:
        "Four controls apply to every HelloVerify verification, on every plan: consent on the " +
        "person's own device per verification, TLS in transit and encryption at rest with keys " +
        "held separately, role-based access scoped to the verification with an audit log, and " +
        "retention bounded by your DPA.",
    },

    steps: {
      lawful: {
        n: "01 · Lawful basis",
        t: "Consent first",
        p: "The person being verified consents on their own device before capture, per verification — not once, forever.",
      },
      encrypted: {
        n: "02 · In transit & at rest",
        t: "Encrypted",
        p: "TLS in transit, encryption at rest, keys managed separately from the data they protect.",
      },
      access: {
        n: "03 · Access",
        t: "Least privilege",
        p: "Role-based access, scoped to the verification being worked on, with an audit log per access.",
      },
      retention: {
        n: "04 · Retention",
        t: "Bounded, then gone",
        p: "Documents deleted on the schedule in your DPA. Zero-retention available where you hold the files.",
      },
    },

    residencyBand: {
      k: "Residency & sub-processors",
      h: "Where is verification data stored?",
      lede:
        "Candidate documents and verification results sit in the region of your contract, with " +
        "India and EU regions available. The source confirmation itself runs in the country that " +
        "issued the document, because that is where the record is. Sub-processors are registered " +
        "and listed in the DPA.",
    },

    /** The `.tbl3` column headings. NOT `chrome.checkTable`'s and NOT
     *  `templates.table`'s — this table's columns are Data / Residency /
     *  Notes, three different words for three different columns, and the
     *  reason those other two are duplicated rather than shared is in
     *  `templates.en.tsx`'s header. */
    residencyTable: {
      data: "Data",
      residency: "Residency",
      notes: "Notes",
    },

    /** The four residency rows. `nm` is the rendered `key=`, so the third
     *  corollary applies: a rename here is a changed React key.
     *  `tools/test/copy.test.ts` §13 pins all four against the pre-migration
     *  strings. */
    residency: {
      documents: {
        nm: "Candidate documents",
        sub: "images and extracted fields",
        tm: "Region of contract",
        src: "India or EU regions available",
      },
      results: {
        nm: "Verification results",
        sub: "status, source, timestamps",
        tm: "Region of contract",
        src: "exported to you by webhook",
      },
      confirmation: {
        nm: "Source confirmation",
        sub: "the request to the issuing authority",
        tm: "Country of issue",
        src: "by necessity — that's where the record is",
      },
      subProcessors: {
        nm: "Sub-processors",
        sub: "infrastructure and comms providers",
        tm: "Registered",
        src: "full list in the DPA",
      },
    },

    residencyNote:
      "Transfers are covered by the DPA's international transfer terms. Region options are set " +
      "per contract — ask before signing, not after.",

    accessibility: {
      k: "Accessibility",
      h: "What is your accessibility conformance status?",
      lede:
        "The HelloVerify site is being built to WCAG 2.2 Level AA, and the claim is checked on " +
        "every build: an axe-core audit runs across all 56 pages, blocking on any critical or " +
        "serious violation. The formal conformance statement and VPAT are in progress.",
    },

    /** The prose block. Two of the four are RICH TEXT because they carry
     *  `<strong>` mid-sentence — moved as JSX so the markup a translator moves
     *  is the markup that renders, and so no run of text is split into two
     *  adjacent children. The other two are plain text nodes and are strings. */
    prose: {
      audit: (
        <>
          This site is being built to <strong>WCAG 2.2 Level AA</strong>, and the claim is
          checked on every build rather than asserted. An automated audit runs the axe-core
          ruleset across all 56 pages and blocks the build on any critical or serious
          violation; it currently reports none at any severity. Colour contrast is computed
          from the design tokens themselves rather than sampled from screenshots, which means
          no text is skipped for sitting on a photograph or a gradient.
        </>
      ),
      measured: (
        <>
          Measured: body text <strong>16.8:1</strong>, secondary text <strong>4.8:1</strong>,
          and the confirmation green <strong>5.9:1</strong>, against a 4.5:1 requirement.
          <strong>No exception is outstanding.</strong> Two colours had one: the lightest
          label tone, used for small uppercase captions, measured 2.4:1, and a placeholder
          grey measured 3.95:1. Both were fixed rather than excused — the label tone was
          deleted as a token, because no type size rescues 2.4:1 and the lightest passing
          colour on that hue is indistinguishable from the secondary text it would sit
          beside. Both gates now carry an empty allowlist, so either colour reappearing
          anywhere fails a build.
        </>
      ),
      status:
        "Status — what is automated today: the axe audit across all 56 pages, the " +
        "contrast computation from the tokens, pointer target sizes (2.5.8) in a real " +
        "browser at two viewports, right-to-left rendering on every page, and a " +
        "post-deploy check that the live origin serves what was built. Not yet automated: " +
        "a manual keyboard and screen-reader pass, which is the one that finds whether a " +
        "focus order is confusing. Right-to-left is verified as layout rather than as " +
        "Arabic — every page is rendered mirrored and checked for anything the flip pushes " +
        "out of the viewport, but the Arabic locale itself is not published yet, so the " +
        "typography half is not claimed. The formal conformance statement and VPAT cover " +
        "both this site and the candidate capture flow and are in progress. We would " +
        "rather publish a dated, accurate statement than a confident one — ask where it " +
        "stands and you will get the real answer.",
      capture:
        "The candidate capture flow matters most: it is used by people on low-end phones, in " +
        "poor light, sometimes with limited literacy. Accessibility there is not a compliance " +
        "exercise — it decides whether someone can get a job.",
    },

    artefactsBand: {
      k: "Artefacts",
      h: "What can you send a security reviewer?",
      lede:
        "HelloVerify sends artefacts by name: the DPA with its international transfer terms, the " +
        "security whitepaper, the penetration-test summary under NDA, and the sub-processor " +
        "register. Most arrive within two working days; anything under NDA needs the NDA, which " +
        "goes out the same day.",
    },

    /** The six artefact rows. `t` is the rendered `key=` — third corollary
     *  again, pinned in `tools/test/copy.test.ts` §13. `req` is NOT here: it
     *  is the `.req` CSS class on the status pill, structure in the sense
     *  `fast` is on `business.enterprise.rows`, and it stayed in
     *  `./content.ts` with the order. */
    artefacts: {
      isoCert: {
        t: "ISO 27001 certificate & scope",
        p: "The certificate, the statement of applicability, and the audit body.",
        s: "On request",
      },
      dpa: {
        t: "Data Processing Agreement (DPA)",
        p: "Standard DPA including sub-processor list and international transfer terms.",
        s: "On request",
      },
      whitepaper: {
        t: "Security whitepaper",
        p: "Architecture, encryption, access control, logging, incident response and business continuity.",
        s: "On request",
      },
      pentest: {
        t: "Penetration test summary",
        p: "Most recent third-party test, executive summary under NDA.",
        s: "Under NDA",
      },
      accessibility: {
        t: "Accessibility conformance statement",
        p: "WCAG 2.2 AA conformance claim for this site and the candidate capture flow.",
        s: "In progress",
      },
      subProcessors: {
        t: "Sub-processor register",
        p: "Every third party that may process personal data, with purpose and location.",
        s: "On request",
      },
    },

    faqHead: (<>From security<br />reviewers.</>),

    faqs: {
      questionnaire: {
        q: "Will you complete our security questionnaire?",
        a:
          "Yes — including long-form vendor assessments and public-sector templates. Send it to your contact or through the contact form; two working days is typical, and we'll tell you immediately if something in it needs a longer answer.",
      },
      jurisdiction: {
        q: "Can data stay inside our jurisdiction?",
        a:
          "Storage region is set per contract. The one thing that cannot stay local is the source confirmation itself — verifying a Philippine degree requires contacting a Philippine institution. That transfer is documented in the DPA rather than hidden.",
      },
      breach: {
        q: "What happens in a breach?",
        a:
          "Notification timelines are contractual and align with GDPR's 72-hour requirement. The incident response process — detection, containment, notification, post-incident review — is described in the security whitepaper.",
      },
      retention: {
        q: "How long are candidate documents kept?",
        a:
          "For the period set in your DPA, then deleted on schedule. Zero-retention is available where you keep the originals and send only what a check requires. Deletion can be evidenced on request.",
      },
      resale: {
        q: "Do you sell or reuse the data you verify?",
        a:
          "No. Verification data is processed for the verification you requested and nothing else — not for model training on identifiable documents, not for enrichment, not for resale.",
      },
    },
  },
};

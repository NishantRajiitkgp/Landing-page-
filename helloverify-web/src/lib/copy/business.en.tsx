/** English copy for `app/[locale]/business/**` — the hub and its five product
 *  pages, the largest route subtree on the site.
 *
 *  The reasoning for every shape — why the English object is the schema, why a
 *  label is keyed by its destination, why rich text is real JSX, why the
 *  dictionary holds almost no arrays — is in `./index`'s header and is not
 *  repeated here. What IS here is the per-decision note that only makes sense
 *  with this content in front of you.
 *
 *  MEASURED: 206 JSX text nodes by a comment-stripped `>text<` matcher across
 *  the six pre-migration files; this file holds 560 leaves (505 after the
 *  enterprise restore, 475 before the SMB catalogue). A 2.3x undercount,
 *  against 3.0x on `chrome` and 1.1x on `templates` — the spread is the point
 *  `./index` makes, since the multiplier tracks how much of a file is ALREADY
 *  a table. (The brief that commissioned this slice counted 181 with a
 *  different matcher. Both runs are recorded rather than reconciled, which is
 *  the posture §7 of `tools/test/copy.test.ts` already takes for chrome's
 *  24-versus-26; the honest statement is the ratio, not the numerator.)
 *
 *  Itemised, the 269 the matcher cannot see: `LANES`, `ROWS`, `PACKS`,
 *  `PATHS`, `FAQS`, the `Steps` item records and the `when3` records are
 *  string properties inside const arrays, not text nodes; `SecHead`'s `k` and
 *  `h` and `Steps`' `name` are attribute strings; the `ClosingCta` overrides
 *  and the `CertCards` glosses are object properties; and one `alt`. Asserted
 *  in `tools/test/copy.test.ts` §9 so the ratio stays a measurement.
 *
 *  WHAT DID NOT MOVE, and why, because both are decisions a reader will
 *  otherwise re-litigate:
 *
 *  - **`generateMetadata`.** Nothing to move. All six pages read
 *    `pageMetadata(locale, PATH)`, and every title and description already
 *    lives in `lib/seo/copy.ts` — lifted there verbatim by script so that
 *    centralising them was not a copy review (see that file's header). The
 *    copy layer and the SEO copy table are two tables with one boundary:
 *    §8.1's table owns what the `<head>` and `llms.txt` say, this one owns
 *    what the `<body>` says.
 *
 *  - **`SERVICE.name` and `SERVICE.serviceType`** on the five product pages.
 *    The third field of that same object, `description`, is
 *    `copyFor(PATH).description` — the §8.1 table again. Moving `name` here
 *    would make one JSON-LD node read from two copy sources, which is exactly
 *    the drift `lib/seo/copy.ts` exists to close. `serviceType` is a
 *    schema.org classification besides, structure in the sense an href is.
 *
 *  NO `as const`, per the recipe: it would pin every leaf to its literal type
 *  and force a second locale to repeat the English bytes to typecheck.
 */

export const en = {
  /** The subtree's own name: the hub's breadcrumb rung AND the parent rung on
   *  all five product pages. One leaf per destination, which is the argument
   *  `chrome.footer.cols` makes — `chrome.nav.logoHome`/`footer.logoHome` are
   *  duplicated instead because those are two different controls in two
   *  components; these are six renderings of one rung pointing at one page. */
  crumb: "Business",

  /** `/business` — the audience hub (Template 2). */
  hub: {
    hero: {
      k: "For business",
      /** Rich text, so it is real JSX and the markup a translator moves is the
       *  markup that renders. Written on its own lines exactly as the `<h1>`
       *  children were: JSX folds the leading and trailing newline-plus-indent
       *  away, leaving the two children React saw before. */
      h1: (
        <>
          Every hire, verified <em>before day one.</em>
        </>
      ),
      sub:
        "One pipeline for every role you hire — riders to directors. AI reads the documents, " +
        "our team confirms with the issuer, and the answer lands before the induction video ends.",
      cta: "Talk to sales",
      /** Plain `&`, NOT `&amp;`. The JSX read `See plans &amp; pricing`; JSX
       *  decodes the entity before React sees it and React re-escapes on the
       *  way out, so a literal `&amp;` in a STRING leaf emits `&amp;amp;`.
       *  Second corollary in `./index`'s byte-identity section, and the trap
       *  `tools/test/copy.test.ts` §3 exists for. (A JSX leaf below keeps
       *  `&amp;` exactly as written — there the entity IS decoded, so copying
       *  the original markup verbatim is the correct move and the opposite
       *  rule applies.) */
      plans: "See plans & pricing",
    },

    /** The proof strip. Each item is `<b>figure</b> tail` — TWO children, and
     *  splitting them into `{t.a}` and `{t.b}` would put two adjacent text
     *  children where one text child sits today, which React's SSR separates
     *  with `<!-- -->`. So each item is one rich-text leaf and the `<span>`
     *  renders a single expression. Measured with `renderToString` before
     *  writing this file: wrapping an element-plus-text child pair in a
     *  Fragment is byte-identical, while joining the two texts is not. */
    strip: {
      checks: (<><b>20M+</b> checks since 2018</>),
      clients: (<><b>2,000+</b> business clients</>),
      package: (<><b>30 min</b> blue-collar package</>),
      countries: (<><b>120+</b> countries</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR · PBSA</>),
    },

    /** The five cards, KEYED BY DESTINATION — the shape `chrome.footer.links`
     *  and `lib/seo/copy.ts` both use. The page keeps the order, the hrefs,
     *  the grid spans and the images; those are routing and layout. It also
     *  keeps `key={c.href}`, so no rendered key changes. */
    paths: {
      "/products/bgv-enterprise": {
        tag: "Enterprise",
        from: "2,000+ clients",
        h: "Enterprise BGV",
        p: "High-volume hiring with an SLA. API, bulk upload, and a team that answers.",
      },
      "/products/bgv-smb": {
        tag: "Small & medium business",
        from: "from 30 min",
        h: "SMB packages",
        p: "Pick a package, upload documents, get answers. Public pricing, no sales call needed.",
      },
      "/employee-verification": {
        tag: "HR & operations",
        from: "60 min",
        h: "Employee verification",
        p: "Existing staff, contractors and gig workforces — verified and re-verified.",
      },
      "/products/customer-kyc": {
        tag: "Trust & safety",
        from: "at signup",
        h: "Customer KYC",
        p: "Verify customers the moment they sign up, before they can do harm.",
      },
      "/products/certifier": {
        tag: "Procurement",
        from: "2 days",
        h: "Vendor due diligence",
        p: "Certifier: trade licences, directors, credit and criminal records — before you sign a supplier.",
      },
    },

    fiveWays: {
      k: "Five ways in",
      h: "Which background verification product does your business need?",
      lede:
        "HelloVerify runs five business pipelines on one platform: enterprise BGV with an " +
        "SLA, SMB packages from 30 minutes, employee re-verification, customer KYC at " +
        "signup, and Certifier vendor due diligence in two days. One upload, one report — " +
        "what changes is only which checks run.",
    },

    /** ONE leaf for the heading, read twice. The page's own comment says the
     *  `HowTo` node's `name` IS this band's `SecHead` `h`; before the copy
     *  layer that invariant was two identical literals eleven lines apart, and
     *  a translator would have had two chances to break it. Now there is one
     *  string and `check-schema.mjs`'s per-page comparison cannot go red on a
     *  translation. */
    pipeline: {
      k: "One pipeline",
      h: "How does background verification work?",
      lede:
        "Every HelloVerify check runs the same four stages: the candidate photographs the " +
        "document, AI captures each field and finds the issuing office, the request goes to " +
        "that issuer, and one report comes back with the source named beside every result.",
    },

    /** The four `Steps` records. Keyed rather than an array, per `./index`:
     *  an array leaf derives to `T[]`, so a locale could ship three steps
     *  where English ships four and `tsc` would agree. The ORDER stays in the
     *  page, which is where a sequence belongs. `t` is still the `key=` the
     *  `Steps` component uses, and still resolves to the same English word. */
    steps: {
      upload: {
        n: "01",
        t: "Upload",
        p: "Photograph the document. Edges, glare and focus are checked before the shutter fires.",
      },
      read: {
        n: "02",
        t: "Read",
        p: "AI captures every field, checks the document against itself, and finds the office that issued it.",
      },
      confirm: {
        n: "03",
        t: "Confirm",
        p: "The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.",
      },
      report: {
        n: "04",
        t: "Report",
        p: "One report, with the source named beside every result. Wired to your ATS or inbox.",
      },
    },

    integrate: {
      k: "Integrate once",
      h: "How does HelloVerify integrate with our hiring tools?",
      lede:
        "HelloVerify integrates through a REST API, webhooks, bulk CSV upload, ATS " +
        "integrations and SSO/SAML. Candidates upload over WhatsApp or a link, and results " +
        "come back wherever your hiring team already works — the same pipeline whichever " +
        "business product you buy.",
    },

    /** The six `.svc` chips. The page's answer block quotes them verbatim
     *  ("ATS integrations", not "ATS connectors") and says so in a comment, so
     *  these six and `integrate.lede` are a pair a translator must keep in
     *  step — recorded here because nothing in the type system can. */
    services: {
      api: "REST API",
      webhooks: "Webhooks",
      csv: "Bulk CSV upload",
      ats: "ATS integrations",
      whatsapp: "WhatsApp candidate flow",
      sso: "SSO / SAML",
    },
    explore: "Explore the platform",

    /** The two per-page `CertCards` glosses. The card HEADINGS and status
     *  words are not here: they come from `CREDENTIAL_MARKS` in
     *  `lib/content/company.ts`, which is the site's one register of claims
     *  and is deliberately not copy — the same boundary `chrome.footer.certs`
     *  draws. A gloss is per-page prose; a credential is a fact.
     *
     *  `pbsa` is a plain string and the link after it is NOT folded in. The
     *  markup is `{pbsa}{" "}<AppLink>…</AppLink>` — three children, with
     *  React's `<!-- -->` between the first two. A function leaf taking the
     *  anchor would collapse them to two and move a byte on this page. Same
     *  call, same reason, as `chrome.consent.body`. */
    certs: {
      iso27001:
        "Information security management, independently audited. Reports available under NDA.",
      pbsa: "Member of the global standards body for the screening industry.",
      pbsaLink: "Security & compliance →",
    },
  },

  /** `/products/bgv-enterprise` — the old `enterprise.base.json`, word for
   *  word, in its order: hero, trust strip (title, subtitle, six partner
   *  logos), the Employees / Businesses / Customers screening tabs. The old
   *  `titleBold` was empty in every locale and is not carried. */
  enterprise: {
    crumb: "Enterprise",
    hero: {
      h1: (<>AI-Powered Background Screening Trusted by India’s Leading Enterprises <br /><em>Stop Bad Hires Before They Happen</em></>),
      cta: "Talk to Sales",
    },
    trust: {
      before: "Trusted by India’s top",
      after: "IT/ITES companies for",
      second: "Background Verification",
      sub: "Our combination of AI-powered automation and dedicated in-house verification experts helps detect fraud while delivering a seamless experience for genuine applicants.",
    },
    partners: {
      cognizant: "Cognizant",
      infosys: "Infosys",
      accenture: "Accenture",
      reliance: "Reliance Retail",
      wipro: "Wipro",
      hcl: "HCL",
    },
    screening: {
      h: (<>Background Checks For Every Part of Your Organization <br /><em>Select who you're screening</em></>),
      tabs: { employees: "Employees", businesses: "Businesses", customers: "Customers" },
    },
    employees: {
      h: "Background Checks for everyone",
      p: "HelloVerify automates the background screening process to reduce fraud, accelerate onboarding, and improve hiring confidence.",
      values: {
        fast: { t: "Fast", tag: "3× faster than industry average", p: "Helloverify uses artificial intelligence & machine learning capabilities to provide fastest background screening service." },
        accurate: { t: "Accurate", tag: "99.2% verified report rate", p: "Our background verification process helps identify fraudulent documents and supports better hiring decisions." },
        compliant: { t: "Compliant", tag: "ISO 27001 + GDPR certified", p: "HelloVerify follows stringent compliance standards and enterprise-grade security practices." },
      },
      explore: "Explore More",
      checksH: "Checks We Offer",
      stats: {
        checks: { a: "30+", b: "Checks" },
        countries: { a: "120+", b: "Countries" },
        tat: { a: "1 to 7", b: "Working Days TAT" },
        api: { a: "REST API + bulk", b: "upload" },
      },
      groups: {
        enterprise: {
          h: "Enterprise Checks",
          a: ["ID Check", "Education Check", "Education Institution Check", "Employment Check", "Bank Statement Check", "Business Registration Certificate", "3D Profiling & Facial Recognition"],
          b: ["Professional License Check", "Criminal Check", "Address Check", "Global Database Check", "Company Check", "All Drug Panels"],
        },
        tampering: {
          h: "Document Tampering",
          a: ["License Verification", "Certificate", "Documents", "Bank Statement"],
        },
      },
    },
    businesses: {
      h: "Business verification and due diligence\nto partner with the right vendors",
      p: "With Certifier, offered by HelloVerify, clients can enhance their profiling experience by accessing certified profiles that encompass various aspects such as selfies, location confirmation, premises visuals, screening, clearances, agreements, and digital signatures.",
      features: {
        dueDiligence: "Comprehensive Vendor\nDue Diligence",
        kyc: "Vendor KYC &\nDocument Verification",
        criminal: "Criminal & Court\nRecord Check",
        financial: "Financial Risk &\nCredit Assessment",
        compliance: "Compliance &\nRegulatory Check",
        reference: "Personal & Professional\nReference Verification",
      },
      explore: "Explore More",
    },
    customers: {
      brand: "Trust & Safety",
      sub: "Trust Infrastructure for your Fast, Accurate & Compliant Business Growth",
      pillar: "Trusted Partner to Stay Ahead of Financial Frauds for all Stakeholders",
      body: ["Trust & Safety Platform is a comprehensive KYC solution to help streamline processes involved in digital onboarding and fraud detection.", "Strengthen your business with regulatory-compliant solutions designed to build trust across every stage of your digital onboarding and verification journey. From Politically Exposed Person (PEP) screening and due diligence to reputation analysis, regulatory compliance, and criminal watchlist checks — ensure every onboarding is secure and trustworthy."],
      explore: "Explore More",
      advH: "Some of the key advantages our customers have seen are",
      adv: {
        cost: { v: "90%", sub: "Cost Reduction in Onboarding." },
        time: "Reduce time for onboarding from hours to minutes.",
        fraud: "Upto 90% increase in fraud detection with the help of our proprietary 3D Profiling, Face Match and AML checks.",
        paperless: "Paperless and automated processes to help comply with legal requirements and regulations in a hassle-free manner.",
      },
    },
  },
  /** `/products/bgv-smb` — the old `bgvSmb.base.json`, word for word, in its
   *  order: hero, How it Works?, the packages with the Select Your Checks
   *  table and its summary, Trusted by, Solutions We Offer. `exploreLess` and
   *  `stars` were hard-coded English in the old components and stay English.
   *  `trust` / `clients` are the SMB client logos added on request (5 Oct
   *  2026); the old page had no logo strip. `strip`, `hero.talkFirst` and
   *  `closing.ctaLabel` are read by the homepage only (`sections/SmbPacks.tsx`). */
  smb: {
    crumb: "SMB",
    hero: {
      h1: (<>Background Checks For <br /><em>Small &amp; Medium Businesses</em></>),
      sub: "Our AI-powered screening platform provides startups and small & medium businesses with a fast, reliable, and scalable background verification solution.",
      cta: "Talk to Sales",
      talkFirst: "Talk to Sales",
    },
    strip: {
      checks: (<><b>1200+</b> SMBs trust HelloVerify</>),
      subscription: (<><b>60 min</b> for Basic, Standard and Premium</>),
      invoice: (<><span className="dot" /> 9 day average TAT</>),
    },
    closing: {
      ctaLabel: "See packages",
    },
    trust: { h: "Trusted by 1,200+ small & medium businesses for background verification" },
    clients: {
      akcelerator: "Akmazo Akcelerator",
      aidenai: "Aiden AI",
      lucid: "Lucid Technology Services",
      midfin: "Midfin Wealth",
      lnp: "LNP Infotech",
      itekpeople: "iTek People Technology",
      appxcelerate: "AppXcelerate Solutions",
      ditstek: "DITSTEK Innovations",
      caone: "CA-One India",
      ibirds: "iBirds Software Services",
    },
    how: {
      h: "How it Works?",
      steps: {
        select: { n: "01", t: "Select Checks", p: "Customize your order as per your requirement from our wide range of Checks" },
        fill: { n: "02", t: "Fill Information", p: "Provide Consent of Individual & relevant information for verification" },
        fast: { n: "03", t: "As fast as 24 hours", p: "Get intuitive reports for decision making" },
      },
    },
    packages: {
      h: "Select Or Customize Verification Package",
      checksInclude: "Checks Included",
      buy: "Buy Now",
      items: {
        basic: {
          t: "Basic Package",
          price: "₹1799",
          ready: "60 mins",
          p: "Verifies government-issued ID, screens criminal records, and cross-checks global watchlists for hidden risks.",
          checks: ["Identity Check", "Criminal Check", "Global Database Check"],
        },
        standard: {
          t: "Standard Package",
          price: "₹2199",
          ready: "60 mins",
          p: "All Basic checks plus address verification, giving you a more complete background picture.",
          checks: ["Identity Check", "Criminal Check", "Global Database Check", "Current Address Check"],
        },
        premium: {
          t: "Premium Package",
          price: "₹2399",
          ready: "60 mins",
          p: "All Standard checks plus a moonlighting detection to uncover any undisclosed secondary employment.",
          checks: ["Identity Check", "Current Address Check", "Criminal Check", "Global Database Check", "Moonlighting Check"],
        },
      },
      customize: "Customize Your Package",
    },
    table: {
      h: "Select Your Checks",
      cols: { check: "Check Include", pricing: "Pricing", action: "Action" },
      rows: {
        identity: {
          n: "Identity Check",
          price: "₹349",
          info: "This check involves validation of Passport or PAN card or Driving License or Voter ID or Aadhaar Card used by candidate. For Aadhaar, only number validation will only be done. We match the name, DOB, father's name of the candidate, ID Number to document provided (Govt. restrictions incase of Aadhaar) • Screening of passport through MRZ (Machine Readable Zone) format passports. For International candidates' passport screening will only be conducted.",
        },
        employment: {
          n: "Employment Check",
          price: "₹499",
          info: "It includes verifying the candidate's claims about his/her tenure, etc. and establishment with respective employer. Hello Verify will reach out to the HR using automated email / telephone. Mode: Email/Database Additional Options for Verifications We also have verification methods via. PF/Form 16/Supervisor /UAN. These all are chargeable at an additional charge per check per method.",
        },
        education: {
          n: "Education Check-Highest Education (Extra University Charges applicable)",
          price: "₹999",
          info: "This check involves verifying the authenticity of candidate's educational & professional qualifications from the respective universities/colleges / trusted database. The names are run through Hello Verify's proprietary database of both known (trusted) and unknown (suspect) universities/institutes and organizations. Herein, TAT may vary subject to university/college (TAT) process. Mode: Database/Email Scope: 12th, Bachelors, Masters, Professional",
        },
        address: {
          n: "Address Check",
          price: "₹499",
          info: "The address is matched using a candidates documents which are either verified or eyeballed for details using original color photocopies. We accept all address proof related documents such as Aadhaar OKYC, Driving License, Voter ID, Electricity Bills, Credit Card Statement, Bank Passbook, Govt Issued Cards and other documents containing the candidates address details. We also provide latitude / longitude in the address where the candidate is actively staying. In case the candidate does not have a valid address proof we do ask for a self declaration of address or a visit can be done to the stated location (only if required). It is recommended that only current / active stay address be checked as the candidate would be residing there. Mode: Digital",
        },
        professionalReference: {
          n: "Professional Reference Check",
          price: "₹499",
          info: "An automated voice command IVR verification or email link will be conducted to obtain reference confirmation about the candidate's personal integrity, educational and professional backgrounds from professional references provided by the candidate. For fresher's, verification is taken from personal references provided by the candidate. We will attempt to reach the candidate 3 times as per defined scope . Mode: Automated IVR/ Telephonic/Email Scope: Personal / Professional",
        },
        indianDatabase: {
          n: "Indian Database Check",
          price: "₹699",
          info: "This Check includes enhanced due diligence using most comprehensive database. Some are listed below: * Central Bureau of Investigation (CBI) Most Wanted List * India Courts * Central Vigilance Commission (CVC) Corrupt Officers Database * Securities and Exchange Board of India * Most Wanted Criminals *Other Indian Databases Mode: Database",
        },
        globalDatabase: {
          n: "Global Database Check",
          price: "₹999",
          info: "This Check includes enhanced due diligence using most comprehensive database. Some are listed below: * Serious and Organized Crimes - Interpol Most Wanted. - Most Wanted Lists * Regulatory Authorities * Compliance Authorities - Office of Foreign Assets Control - Proprietary Databases * Web and Media Searches - Internet Searches - Media Searches * Bankruptcy Checks - Board of Industries and Financial Reconstruction (BIFR) Companies Mode: Database",
        },
        criminalEcourt: {
          n: "Criminal Check via E-Court",
          price: "₹799",
          info: "Search for negative records/charges against the applicant through online e-Court records of the jurisdiction, covering Magistrate Court, Session Court, District Court and High Court. Checks for any negative history or adverse records for the last 7 years. (Subject to availability of information in public or online domain). Mode: Database Scope: Criminal/Civil or Both",
        },
        criminalPolice: {
          n: "Criminal Check via Police and law Firm",
          price: "₹899",
          info: "Search for criminal records against the applicant at the police station of the stated jurisdiction, along with a court record search conducted through Certified Legal Consultants/Advocates. Checks for any negative history or adverse records for the last 7 years. TAT may vary subject to the police station and court process. (Subject to availability of information in public or online domain). Mode: Police Station/Database Scope: Criminal/Civil or Both",
        },
        criminalLawFirm: {
          n: "Criminal check via law firm",
          price: "₹999",
          info: "Search for negative records/charges against the applicant in the civil court, High Court, Magistrate Court & Session Court of the jurisdiction. Checks for any negative history or any adverse records (Civil proceeding: Original Suit /Miscellaneous Suit / Execution/ Arbitration cases for last 7 Years. Screenings are conducted via Certified Legal Consultants/ Advocates. They use their own access via legal databases to perform these checks. (Subject to availability of information in public or online domain). Mode: Database Scope: Criminal/Civil or Both",
        },
        rightToWork: {
          n: "Right/Eligibility to work",
          price: "₹359",
          info: "This check verifies whether the candidate is legally eligible to work in India, matching identity, nationality/visa status and work-authorisation documents against the details declared by the candidate. Mode: Database/Document",
        },
        uan: {
          n: "UAN Check",
          price: "₹400",
          info: "This check validates the candidate's Universal Account Number (UAN) against EPFO records, matching name, employment history and contributing establishments with the details declared by the candidate. Mode: Database",
        },
        bankAccount: {
          n: "Bank Account check (Penny Drop)",
          price: "₹199",
          info: "This check validates the candidate's bank account through a penny-drop (name-match) verification, confirming that the account number, IFSC and account-holder name match the details provided by the candidate. Mode: Database",
        },
        credit: {
          n: "Credit Check",
          price: "₹899",
          info: "This check retrieves the candidate's credit report from authorised bureaus to identify outstanding loans, defaults, write-offs or other adverse credit history recorded against the candidate. Mode: Database",
        },
        creditSuit: {
          n: "Credit suit defaulter Check",
          price: "₹699",
          info: "This check screens the candidate against defaulter and credit-suit databases to identify any civil suit, recovery proceeding or wilful-defaulter listing recorded against the candidate. Mode: Database",
        },
        resume: {
          n: "Resume Check Validation",
          price: "₹299",
          info: "Information contained in resume is used to hire a candidate. Once an offer is placed, and a background screening request is placed a candidate has to submit a Screening form along with documentation. Thus a check on validating of details on the resume submitted at time of interview and application form submitted at the time of Screening must be check for inconsistencies and highlighted back to the candidate. Mode: Online",
        },
        finra: {
          n: "FINRA Fingerprint(Pan India)",
          price: "₹10000",
          info: "To verify fingerprint, the template created from the captured fingerprint is compared with templates stored in a database. This comparison can be done using algorithms that measure the similarity between templates.",
        },
        ofac: {
          n: "OFAC Check",
          price: "₹999",
          info: "The Office of Foreign Assets Control, or OFAC, of the U.S. Department of the Treasury administers and enforces economic and trade sanctions based on US foreign policy and national security goals against targeted foreign countries, terrorists, international narcotics traffickers, and those engaged in activities related to the proliferation of weapons of mass destruction. The most recent, master list of Specially Designated Nationals and Blocked Persons that is made available by OFAC will be searched. Mode: Database",
        },
        form16: {
          n: "Form-16 Check",
          price: "₹500",
          info: "This check verifies the Form-16 issued to the candidate, matching employer name, PAN, assessment year and reported income against the employment details declared by the candidate. Mode: Document/Database",
        },
        professionalLicense: {
          n: "Professional license Check (Extra cost on actuals)",
          price: "₹799",
          info: "This check involves verifying the authenticity and current status of the professional licence, registration or membership claimed by the candidate with the issuing council, board or regulatory body. The licence number, holder name, category and validity/expiry are matched against the document provided by the candidate. Charges levied by the issuing authority are extra on actuals. Mode: Database/Email",
        },
        socialMedia: {
          n: "Social Media Check",
          price: "₹749",
          info: "This check reviews publicly available social-media profiles associated with the candidate to identify any adverse, discriminatory or reputational content relevant to employment screening. Mode: Online",
        },
        directorship: {
          n: "Directorship Check",
          price: "₹649",
          info: "This refers to a search based on matching credential of a candidate with MCA (Company) database whether candidate is a Director or not in the company where he/she has worked. If he/she is a Director, then the company name is checked against on the MCA black listed company. Mode: Database",
        },
        financialRegulatory: {
          n: "Financial Regulatory Search",
          price: "₹500",
          info: "This check screens the candidate against financial-regulatory databases, including FFIEC records, to identify any enforcement action, prohibition or adverse finding recorded by banking and financial regulators. Mode: Database",
        },
        bankStatement: {
          n: "Bank Statement - Online or PDF",
          price: "₹100",
          info: "This check validates the authenticity of the candidate's bank statement (online fetch or uploaded PDF), confirming account details and flagging signs of tampering or inconsistency with the declared information. Mode: Online/Document",
        },
        gsa: {
          n: "General Service Administration",
          price: "₹499",
          info: "This check screens the candidate against the U.S. General Services Administration (GSA) excluded-parties lists to identify any debarment, suspension or ineligibility for federal programmes. Mode: Database",
        },
        oig: {
          n: "Office of Inspector General",
          price: "₹499",
          info: "This check screens the candidate against the U.S. Office of Inspector General (OIG) exclusions database to identify any exclusion from federal healthcare programmes or related adverse listing. Mode: Database",
        },
        adverseMedia: {
          n: "Adverse Media Search",
          price: "₹1299",
          info: "This Check includes enhanced due diligence using most comprehensive database. Some are listed below: * Serious and Organized Crimes - Interpol Most Wanted. - Most Wanted Lists * Regulatory Authorities * Compliance Authorities - Office of Foreign Assets Control - Proprietary Databases * Web and Media Searches - Internet Searches - Media Searches * Bankruptcy Checks - Board of Industries and Financial Reconstruction (BIFR) Companies Mode: Database",
        },
        gap: {
          n: "Gap Check",
          price: "₹649",
          info: "This check involves identification of GAP between employment, education and address details. Mode: Online",
        },
        drug: {
          n: "Drug Test",
          price: "₹1350",
          info: "Upon receipt of request/Documents for Drug Test from client/customer, HelloVerify, with prior consent of candidate, will fix an appointment with candidate for collection of sample for Drug Test. After collection, sample for Drug test will be sent to the laboratory or Drug Test will be conducted via instant drug kits onsite. Prior notice of 48 hours must be given to arrange for visits/sample collection. Availability of visit is subject to confirmation from the lab, once Hello Verify has been informed. A date of visit | candidate name | email | phone number | Drug Test Type | must be provided in order to perform the check. Component under below-mentioned Drug Test- Panel are subject to change. Client/customer may choose specific component as per their requirements.",
        },
        alcohol: {
          n: "Alcohol Test",
          price: "₹2300",
          info: "Upon receipt of request from the client, HelloVerify, with prior consent of the candidate, will arrange collection of a sample for alcohol testing. Prior notice of 48 hours must be given to arrange visits/sample collection. Availability is subject to confirmation from the lab. A date of visit, candidate name, email, phone number and test type must be provided. Mode: Lab/Onsite",
        },
        company: {
          n: "Company Check",
          price: "₹599",
          info: "It authenticates the existence of a company, its reputation and regulatory compliances of the Company wherein the candidate has previously worked. Note: Visit may not be possible due to COVID-19 and entry Restriction. Mode: Database only/visit (Subject to COVID-19)",
        },
        faceMatch: {
          n: "Face match",
          price: "₹0",
          info: "This check captures a live selfie and matches it against the photograph on the candidate's identity document, including a liveness check to confirm the person is physically present. Mode: Online",
        },
        fda: {
          n: "Food and Drug Administration Database Verification",
          price: "₹1350",
          info: "This check screens the candidate against Food and Drug Administration (FDA) databases, including the debarment list and the disqualified/restricted investigators list, to identify any regulatory action, prohibition or adverse finding recorded against the candidate. Mode: Database",
        },
        nsr: {
          n: "National Skill of Registry",
          price: "₹799",
          info: "This check validates the candidate's profile against the National Skills Registry (NSR), confirming the ITPIN/NSR record and matching the personal, education and employment details registered against it with the details declared by the candidate. Mode: Database",
        },
        gapValidation: {
          n: "Gap Check validation",
          price: "₹900",
          info: "This is an advanced gap check that identifies unexplained gaps between employment, education and address timelines and validates supporting documents or declarations provided for those periods. Mode: Online/Document",
        },
      },
      more: "Explore More",
      exploreLess: "Explore Less",
    },
    summary: {
      h: "Customize Your Package",
      p: "Check for the genuineness of the people you employ to safeguard your house/child/car from the risk of any crime.",
      checksInclude: "Checks Include",
      empty: "Select checks from the table to build your package.",
      buy: "Buy Now",
      /** The package's name in checkout, the cart and My Orders. */
      cartName: "Custom Package",
    },
    trusted: {
      h: "Trusted by Businesses & Individuals",
      stats: {
        smbs: { v: "1200+", l: "SMBs trust HelloVerify" },
        tat: { v: "9 Day TAT", l: "Average TAT" },
        start: { v: "₹649", l: "Starting per check" },
      },
      stars: "4 out of 5 stars",
      people: {
        rohit: {
          name: "Rohit Sharma",
          role: "Restaurant Owner",
          quote: "“Hiring staff usded to be risky, but HelloVerify made it simple and reliable. We now onboard with complete confidence„",
          alt: "Rohit Sharma",
        },
        anjali: {
          name: "Anjali Mehta",
          role: "Startup Founder",
          quote: "“Fast, accurate and seamless verification. HelloVerify helped us scale hiring without delays„",
          alt: "Anjali Mehta",
        },
        neha: {
          name: "Neha Verma",
          role: "Domestic Employer",
          quote: "“Finding trustworthy help is crucial With HelloVerify, I feel safe and assured every time I hire„",
          alt: "Neha Verma",
        },
      },
    },
    solutions: {
      h: "Solutions We Offer",
      sub: "Catering to the needs of the small and medium businesses for our following offerings",
      tabs: { employee: "Employee Verification", vendor: "Vendor Screening" },
      employee: {
        trust: { t: "Trust Build into Every Hire", p: "From first click to final hire—our AI-driven onboarding and automated workflows deliver speed and accuracy at every step." },
        decision: { t: "Every Decision. Backed by Trust.", p: "The nannies, house staff, drivers, and tenants you trust with your home deserve thorough verification. 100% digital, fast and accurate — so you never have to wonder about the people closest to your family." },
        instant: { t: "Instant Checks. Confident Hires", p: "Every hire carries risk. HelloVerify's instant background checks eliminate the guesswork—uncovering red flags before they ever walk through your door." },
      },
      vendor: {
        h: "Business verification and due diligence to partner with the right vendors",
        p: "With Certifier, offered by HelloVerify, clients can enhance their profiling experience by accessing certified profiles that encompass various aspects such as selfies, location confirmation, premises visuals, screening, clearances, agreements, and digital signatures.",
        features: {
          dueDiligence: "Comprehensive Vendor\nDue Diligence",
          kyc: "Vendor KYC & Document\nVerification",
          criminal: "Criminal & Court\nRecord Check",
          financial: "Financial Risk & Credit\nAssessment",
          compliance: "Compliance &\nRegulatory Check",
          reference: "Personal & Professional\nReference Verification",
        },
        offer: {
          h: "What We Offer",
          cards: {
            fast: { t: "Onboard Vendors 10x Faster", p: "The platform can facilitate data-driven decision-making on vendor performance, enabling real estate companies to identify top-performing vendors and optimise their vendor selection processes." },
            regulatory: { t: "Maintain regulatory adherence", p: "Certifier helps identify reliable and qualified entities that align with the company & compliance requirements, thereby reducing the likelihood of engaging with non-compliant or high-risk vendors." },
            monitoring: { t: "Reduce Risk with Continuous Monitoring", p: "Real-time updates on vendor activities progress (via photos, videos, voice notes), and adherence to contractual obligations, allowing for better project management and proactive issue resolution." },
            reputation: { t: "Protect your business reputation", p: "Certifier's advanced AI-ML capabilities continually evolve along with human intervention, ensuring authentic Vendor verification while keeping bad actors away" },
          },
        },
      },
    },
  },

  /** `/employee-verification` — the old `employees.base.json`, word for word,
   *  in its order. The two sections the CMS marks `hidden` (blue-collar
   *  workforce stats, the White & Blue-Collar benefits) never rendered and are
   *  not carried; nor are the white / blue `exploreMore` labels, which the old
   *  split panel did not render. Stat values live in the page. */
  employeeVerification: {
    crumb: "Employee Verification",
    hero: {
      h1: (<>All-in-One Background Verification <br /><em>for Every Workforce Segment</em></>),
      cta: "Talk to Sales",
    },
    banner: "Employee Verification Solutions",
    white: {
      h: "White-Collar Verification",
      p: "White collar verification is a comprehensive process designed to validate the credentials, background and identity of professionals in roles that demand specialized knowledge, expertise and trust. HelloVerify delivers a streamlined solution that helps businesses mitigate hiring risks, ensure compliance and build a workforce they can truly rely on.",
      checks: {
        education: { n: "Education Check", p: "Verify an applicant's educational and professional qualifications including the authenticity of the issuing institution." },
        identity: { n: "Identity Check", p: "Verify applicant's identity by validating government-issued documents matching name, DOB, father's name & ID number." },
        employment: { n: "Employment Check", p: "Verify applicants employment history including company name, tenure & designation." },
        criminalRecords: { n: "Criminal Record Check", p: "Verify court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the applicant." },
        reference: { n: "Reference Check", p: "Verifies an applicant's professional conduct, performance, and other competencies through references from previous employers." },
        drugTest: { n: "Drug Test Check", p: "Perform drug test ranging across all panels, from Panel-1 to Panel-10." },
        globalDatabase: { n: "Global Database Check", p: "Verify international sanctions lists, watchlists, and regulatory records through global database to flag adverse information and mitigate risk." },
        address: { n: "Address Check", p: "Verify an applicant's address digitally by validating eligible address proof documents and matching them with the applicant's live geolocation. No physical site visit required." },
        company: { n: "Company Check", p: "Verifies the legitimacy of an applicant's previous employer by validating the organization's registration, operational status, and key business details." },
        credit: { n: "Credit Check", p: "Verifies an applicant's credit profile through a Credit Bureau by assessing their credit score, credit history, and associated risk parameters." },
        criminalLawFirm: { n: "Criminal Check through Law Firm", p: "Identifies criminal records by verifying court records through trusted law firm partners." },
        directorship: { n: "Directorship Check", p: "Identifies whether an applicant currently holds or has previously held directorship positions in registered companies." },
        form16: { n: "Form 16 Check", p: "Verifies an applicant's salary, tax deductions, and employment details by validating the employer-issued Form 16." },
        resume: { n: "Resume Validation", p: "Validates the information provided in an applicant's resume, including education, employment, skills, and other credentials." },
      },
      cta: "Talk to Sales",
      alt: "Professionals representing white collar verification and compliance",
    },
    whiteWhy: {
      h: "Why White-Collar Verification Matters",
      cards: {
        integrity: { t: "Enhance Workforce Integrity", p: "Identify and eliminate the risk of fraudulent academic, professional or identity claims among applicants. This ensures accurate hiring decisions, reduces risk and builds a reliable and compliant workforce." },
        hiring: { t: "Accelerate Hiring with Confidence", p: "Our AI-driven onboarding and automated workflows streamline the hiring process from start to finish. This reduce manual effort, minimize errors and ensure faster turnaround times." },
        compliance: { t: "Ensure Full Regulatory Compliance", p: "Our integrated framework aligns with global standards to protect data privacy and security. It ensures that all information is handled securely through robust protocols and controlled access." },
      },
    },
    results: {
      h: "HR's & Staffing organizations see improved results with HelloVerify",
      stats: {
        workflow: "Have experienced a simplified screening workflow",
        accuracy: "Have seen improved accuracy on background checks",
        experience: "Have seen an improved candidate experience",
      },
    },
    blue: {
      h: "Blue-Collar Verification",
      p: "Manufacturing, Logistics, Construction, Food & Beverage as small chips to help buyers see themselves explicitly.",
      checks: {
        pan: { n: "Pan Card Check", p: "PAN Card Verification validates an applicant's Permanent Account Number (PAN) through official databases to confirm identity, detect discrepancies, and support compliance." },
        registration: { n: "Registration Certificate Check", p: "Verifies the authenticity of a vehicle's registration details, including ownership and registration status." },
        drivingLicense: { n: "Driving License Verification", p: "Validates the authenticity of a candidate's driving license, including license number, validity, and issuing authority through official databases." },
        criminalRecords: { n: "Criminal Records Check", p: "Court Record Check searches official e-court records across multiple jurisdictions to identify criminal cases against the candidate. Supporting case details, if available, are shared with the client." },
        pennyDrop: { n: "Penny Drop Check", p: "Penny Drop Verification confirms the validity of a bank account by transferring a nominal amount and matching the account holder's name with the provided details." },
        liveness: { n: "Liveness Check", p: "Liveness Check verifies that the individual is physically present during identity verification, preventing fraud from photos, videos, or masks." },
      },
      cta: "Talk to Sales",
      alt: "Blue collar workers in safety gear representing field and operational verification",
    },
    blueWhy: {
      h: "Why Blue-Collar worker Verification Matters",
      cards: {
        trust: { t: "Trust in Minutes, not Days", p: "Our platform turns verification into velocity, delivering accurate, timely reports that transform raw data into genuine trust, so every hiring decision your business makes is backed by proof and built on confidence." },
        smart: { t: "Verify smart, Trust faster", p: "Our AI-driven onboarding and automated workflows eliminate delays, reduce errors, and deliver the right hire faster and more accurately than ever before." },
        compliance: { t: "Maintaining Compliance", p: "Many industries are subject to regulatory requirements that necessitate thorough background checks and verification, protecting both the organization and its stakeholders." },
      },
    },
    automate: {
      h: "Automated Workforce Onboarding",
      p: "As a global provider of background screening solutions, we help organizations of all sizes hire the right people for the right opportunities. Join us to Modernize the way you hire & scale heights.",
      tabs: {
        smooth: { t: "Smooth Experience", p: "Hire faster through our platforms that turn data into trust through accurate reports with speed. Trust without compromise, backed by proof.", alt: "HelloVerify dashboard showing applicant details and a smooth onboarding experience" },
        hrms: { t: "HRMS API & Integration", p: "Effortlessly integrate HelloVerify's powerful HRMS API into your existing systems to automate background checks, employee verification, and compliance tasks. Enhance efficiency and accuracy in managing your HR operations with seamless, real-time data synchronization.", alt: "HelloVerify integrated with HRMS workflows and API-driven data exchange" },
        rules: { t: "Automated Rules Engine", p: "Leverage HelloVerify's Rule Engine to automate and optimize decision-making processes. Customize verification workflows, set criteria, and enforce compliance standards, ensuring consistent and accurate results tailored to your organization's specific needs.", alt: "Rule engine configuration for verification packages by role and policy" },
        tracking: { t: "Real Time Tracking", p: "Stay informed with HelloVerify's real-time tracking feature, providing instant updates on the status of your verifications. Monitor progress and receive notifications, ensuring you’re always in the loop and never miss a critical update.", alt: "Real-time tracking of verification requests and completion status" },
        support: { t: "Excellent Support", p: "HelloVerify offers top-notch customer support to assist you with any questions or challenges. Our dedicated team is always ready to provide quick and effective solutions, ensuring a smooth and hassle-free experience.", alt: "Customer support and specialist assistance for verification programs" },
        security: { t: "Enterprise Grade Security", p: "HelloVerify ensures the highest level of data protection with enterprise-grade security measures. Safeguard sensitive information with robust encryption, compliance with industry standards, and proactive monitoring, giving you peace of mind.", alt: "Enterprise-grade security controls for sensitive verification data" },
      },
    },
    psv: {
      h: "Primary Source Verification",
      items: {
        education: "Education Verification",
        institute: "Institute Accreditation Check",
        employment: "Employment Verification",
        dualEmployment: "Dual Employment Verification",
        criminal: "Criminal Record Verification",
        identity: "Identity Verification",
        address: "Address Verification",
        bank: "Bank Account Verification",
      },
    },
  },

  /** `/products/customer-kyc` — copy from the Customer KYC redesign, in its
   *  order. Step numbers, the case layout and the two sales links live in
   *  the page. `[YOUR PRICE]` and `[API · SDK · HOSTED LINK]` are the
   *  redesign’s own placeholders. */
  customerKyc: {
    crumb: "Customer KYC",
    hero: {
      k: "Customer KYC · India",
      h1: "Know who’s on the other side of the screen.",
      sub: "Consent, selfie, PAN, face match and DigiLocker — in one flow, with one decision at the end.",
      cta: "Get the KYC bundle",
      cta2: "See how it works",
      points: ["Instant verification", "Auto-approval", "No ops overhead"],
      case: {
        id: "Case HV-24817",
        time: "14:02 → 14:05",
        name: "Ananya Mehta",
        rows: [
          { t: "Consent", s: "logged" },
          { t: "Name", s: "captured" },
          { t: "Selfie", s: "live person" },
          { t: "PAN", s: "valid · name matches" },
          { t: "Face match", s: "selfie ↔ PAN" },
          { t: "DigiLocker", s: "Aadhaar · signed" },
        ],
        pending: "Checking",
        result: "Auto-approved",
        passed: "{n} of 6 checks passed",
      },
    },
    why: {
      k: "Why KYC",
      h: "Online, anyone can type a name. KYC proves who it is.",
      cards: {
        law: {
          t: "It’s the law",
          p: "Banks, lenders, insurers, brokers and other regulated businesses must verify every customer before they serve them.",
        },
        fraud: {
          t: "It stops fraud at sign-up",
          p: "Fake, borrowed and rented identities get in through weak online checks. In December 2025, several large banks paused fully digital account opening over mule-account fraud.",
          source: "Source:",
          sourceName: "Business Standard",
          sourceHref: "https://www.business-standard.com/finance/news/bank-accounts-digital-onboarding-fraud-prevention-mule-accounts-rbi-kyc-125121200255_1.html",
        },
        trust: {
          t: "It builds trust",
          p: "Customers, partners and regulators trust a platform that knows exactly who is on it.",
        },
      },
    },
    how: {
      k: "How it works",
      h: "Six steps on the customer’s phone.",
      sub: "Each check runs the moment its step is done.",
      steps: {
        consent: { t: "Consent", p: "The customer sees what will be checked and agrees. We log it before anything is fetched." },
        name: { t: "Name", p: "The customer enters their name. Every document that follows must match it." },
        selfie: { t: "Selfie", p: "One guided selfie. A liveness check confirms a real person is present — not a photo, screen or mask." },
        pan: { t: "PAN capture", p: "The customer photographs their PAN card. We verify the PAN is valid and the name matches." },
        face: { t: "Face match", p: "We compare the live selfie with the photo on the PAN card. Nothing for the customer to do." },
        digilocker: { t: "DigiLocker", p: "The customer shares Aadhaar from DigiLocker. It arrives digitally signed by the issuer — no uploads to fake." },
      },
      decision: {
        k: "Then",
        h: "One decision",
        approved: { t: "Approved", p: "All checks pass. Approved instantly, no one in the loop." },
        flagged: { t: "Flagged", p: "Something doesn’t match. The case comes to you with the reason." },
      },
    },
    ops: {
      k: "No ops overhead",
      h: "No KYC desk to run.",
      without: {
        k: "Without it",
        items: ["Four vendors for four checks", "A team reviewing every selfie and card", "Customers waiting days for approval"],
      },
      with: {
        k: "With HelloVerify",
        items: ["One integration for every check", "Clean cases approve themselves", "Your team sees only the exceptions"],
      },
    },
    bundle: {
      k: "The bundle",
      h: "Every check, one package.",
      name: "Instant KYC Bundle",
      price: "[YOUR PRICE]",
      per: "per completed KYC",
      items: [
        "Consent capture and log",
        "Name capture",
        "Selfie with liveness check",
        "PAN capture and verification",
        "Face match: selfie ↔ PAN",
        "Aadhaar via DigiLocker",
        "Auto-decision with reasons",
        "Audit trail per customer",
      ],
      plug: "Plugs in via [API · SDK · HOSTED LINK]",
      buy: "Buy the bundle",
      sales: "Talk to sales",
      traits: {
        instant: { t: "Instant", p: "The customer finishes in minutes. The decision follows the last step." },
        automatic: { t: "Automatic", p: "Clean cases never reach a person." },
        audit: { t: "Audit-ready", p: "Consent, checks and decision in one record." },
      },
    },
    who: {
      k: "Where KYC is needed",
      h: "Who needs KYC.",
      law: {
        h: "Mandatory by law",
        p: "These are reporting entities under the Prevention of Money Laundering Act, 2002, which requires them to verify the identity of every client (Section 11A).",
        cards: {
          banks: { t: "Banks", tag: "RBI", p: "Every account holder.", src: "RBI KYC Directions, 2025" },
          nbfc: { t: "NBFCs and lenders", tag: "RBI", p: "Every borrower.", src: "RBI KYC Directions for NBFCs, 2025" },
          payments: { t: "Payments and wallets", tag: "RBI", p: "Every merchant a payment aggregator onboards. Every full-KYC wallet holder.", src: "RBI Payment Aggregator Directions, 2025 · PPI Master Directions" },
          insurance: { t: "Insurance", tag: "IRDAI", p: "Every customer, when the relationship begins.", src: "IRDAI AML/CFT Master Guidelines, 2022" },
          markets: { t: "Stockbroking and mutual funds", tag: "SEBI", p: "Every investor, recorded with a KYC Registration Agency.", src: "SEBI KRA Regulations, 2011" },
          crypto: { t: "Crypto (VDA) platforms", tag: "FIU-IND", p: "Every user, since VDA providers came under PMLA.", src: "Finance Ministry notification, 7 March 2023" },
        },
      },
      platforms: {
        h: "Recommended for platforms that onboard people",
        cards: {
          gig: { t: "Gig and delivery", p: "Riders and partners" },
          marketplaces: { t: "Marketplaces", p: "Sellers and buyers" },
          rentals: { t: "Rentals and co-living", p: "Tenants and hosts" },
          workforce: { t: "Workforce", p: "New joiners and contractors" },
          agents: { t: "Agent networks", p: "Field agents and resellers" },
        },
      },
    },
    rbi: {
      k: "For RBI-regulated entities",
      h: "What we do, and what RBI leaves to you.",
      sub: "RBI counts DigiLocker as a digital mode for onboarding customers who don’t visit a branch — a “non-face-to-face” mode. It allows this with extra conditions.",
      does: {
        k: "The bundle does",
        items: [
          "Takes the customer’s consent",
          "Verifies the PAN",
          "Fetches Aadhaar from DigiLocker as a signed e-document",
          "Checks liveness and matches the face",
          "Keeps the evidence in one record",
        ],
      },
      asks: {
        k: "RBI also asks banks to",
        items: [
          "Offer Video KYC (V-CIP) first, if they provide it",
          "Make the first transaction a credit from the customer’s own KYC-complied bank account",
          "Classify these customers as high-risk, with enhanced monitoring",
        ],
        source: "Source:",
        sourceName: "RBI (Commercial Banks – KYC) Directions, 2025",
        sourceHref: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13141",
        sourceTail: ", para 44. Other entities should check the Directions that apply to them.",
      },
    },
    faq: {
      h: "Common questions.",
      items: [
        { q: "Is this “Full KYC” or “Minimum KYC”?", a: "Neither. Both are defined terms in RBI rules, so we don’t use them as labels. This is a consent-based, non-face-to-face KYC. Whether it meets the requirement for your product is your compliance team’s call." },
        { q: "How long does it take?", a: "A few minutes for the customer. Each check runs as its step finishes, so the decision is ready as soon as DigiLocker is shared." },
        { q: "What if a check fails?", a: "The case is flagged with the reason — a name mismatch or a failed liveness check, for example — and sent to your team." },
        { q: "Does the customer upload Aadhaar?", a: "No. It comes from DigiLocker, signed by the issuer. The customer only takes a selfie and a photo of their PAN card." },
        { q: "Can non-regulated businesses use it?", a: "Yes. Marketplaces, gig, rental and staffing platforms use it to know who they’re onboarding." },
      ],
    },
    close: {
      h: "Verify your next customer in minutes.",
      sub: "Six checks. One decision. No ops desk.",
      cta: "Get the KYC bundle",
      cta2: "Talk to sales",
    },
  },

  /** `/products/certifier` — the old `certifier.base.json`, word for word, in
   *  its order: hero, We Verify What Matters Most (two tabs of four checks),
   *  How Certifier Works For Businesses? (image slider beside four tabs),
   *  Industries We Serve, Why Businesses Should Consider Certifier?, the
   *  API-Driven Counterparty Platform (two slides of four). Bold runs in the
   *  Vendor Monitoring lines are the old CMS `bold` parts. */
  certifier: {
    crumb: "Certifier",
    hero: {
      h1: (<><em>Certifier</em></>),
      sub: "We are redefining third-party verification for B2B businesses delivering fast, reliable authentication of identities and documents that modern enterprises demand.",
      cta: "Talk to Sales",
    },
    checks: {
      h: "We Verify What Matters Most",
      sub: "Our advance verification checks help you to onboard trustworthy vendors and minimise the risk across your supply chain.",
      tabs: {
        business: {
          label: "Business License & Promoter Verification",
          cards: {
            tradeLicense: { t: "Trade License Check", p: "This check involves verifying a candidate's educational and professional qualifications, along with confirming the authenticity of the university, college, or academic institution from which the qualifications were obtained." },
            defaultingDirectors: { t: "Defaulting Directors Check", p: "Defaulting Directors Check identifies whether a candidate has been listed as a defaulting director in any company due to non compliance, financial defaults or regulatory violations." },
            criminalRecords: { t: "Criminal Records Check", p: "This check involves searching court records across jurisdictions, including the Supreme Court, High Court, District Courts and tribunals to identify any criminal charges against the candidate." },
            creditCompany: { t: "Credit & Company Check", p: "A Credit & Company Check in background verification evaluates a candidate's credit profile and verifies the legitimacy and status of associated companies through official and financial records." },
          },
        },
        vendor: {
          label: "Vendor, Credit & Financial Verification",
          cards: {
            financialAssessment: { t: "Financial\nAssessment Check", p: "Financial Assessment in business due diligence involves evaluating a company's financial health by reviewing its financial statements, credit profile, and key financial indicators to assess stability and risk." },
            gstScreening: { t: "GST\nScreening Check", p: "GST Screening in business due diligence involves verifying a company's GST registration, status, and compliance through official records." },
            creditCheck: { t: "Credit\nCheck", p: "The credit check involves verifying the candidate's credit score and risk parameters through a Credit Bureau. A credit score is generated based on the individual's credit history." },
            promoterCriminal: { t: "Promoter Criminal\nHistory Check", p: "A Promoter Criminal History Check in business due diligence involves verifying whether company promoters have any criminal records through court and legal databases." },
          },
        },
      },
    },
    how: {
      h: "How Certifier Works For Businesses?",
      intro: ["Start Free, Trial Certifier is HelloVerify's vendor screening platform.", "Onboard vendors 10X faster while monitoring compliance in real time."],
      slides: ["Vendor verification workflow", "Team collaborating on vendor screening", "Professional reviewing verification details", "Business planning and compliance"],
      tabs: { onboarding: "Virtual onboarding", monitoring: "Vendor Monitoring", statutory: "Statutory Screenings", agreement: "Virtual Agreement & E-Sign" },
      onboarding: {
        h: "Verified in 4 steps, no paperwork",
        sub: "Customize and Upload all your vendor details virtually.",
        steps: ["Send Invite", "Enter Personal Information", "Location Captured", "Upload Selfie & ID Proof"],
      },
      monitoring: {
        h: "Vendor Monitoring — automatic alerts for risk changes",
        items: [
          (<><b>{"Upload virtually"}</b>{" – Upload virtually any picture of the site you wish to see or keep as a record."}</>),
          (<>{"Receive voice notes to "}<b>{"get instant feedback."}</b></>),
          (<>{"Receive videos of the existing sites/projects to "}<b>{"stay informed "}</b>{"on the current progress."}</>),
        ],
      },
      statutory: {
        h: "Statutory Screenings — stay compliant automatically",
        intro: ["Upload all the required documents and verify instantly.", "We use artificial intelligence & machine learning capabilities to provide fastest screening service."],
        items: ["Global WatchList", "Company Screening", "Identity Screening", "GST Screening", "Financial Screening", "Credit Suit Default Screening"],
      },
      agreement: {
        h: "Go digital securely and reliably",
        intro: "Go digital with us and move your business securely & reliably.",
        items: ["Create New Agreement", "Add Digital Signature", "Sign and Share Agreement"],
      },
    },
    industries: {
      h: "Industries We Serve",
      p: "One platform powering verification, validation and compliance across industries. Designed to adapt to the customized requirements of every industry we serve.",
      cards: {
        realEstate: { t: "Real Estate, Construction & Manufacturing companies", alt: "Professional in a hard hat with architectural building models" },
        ecommerce: { t: "E-commerce & Vendor Discovery Platforms", alt: "Person using smartphone and laptop for online shopping and vendor discovery" },
        it: { t: "IT & Healthcare Companies", alt: "Healthcare professionals reviewing documents together" },
        retail: { t: "FMCG & Retail Chains", alt: "Retail associate with shopping cart in a store aisle" },
      },
    },
    why: {
      h: "Why Businesses Should Consider Certifier?",
      p: "Reliable, secure and efficient verification—built for modern businesses. Designed to help you stay compliant while saving time and operational effort.",
      cards: {
        fast: { t: "Fast-Track Vendor Onboarding by 10x", p: "From vendor evaluation to final selection, our platform transforms raw performance data into decisions that matter helping companies consistently identify their strongest vendors and build a selection process built on facts, not assumptions." },
        blacklist: { t: "Stop Previously Blacklisted vendors", p: "Certifier raises the bar on vendor qualification identifying only those entities that are fully compliant, genuinely reliable and perfectly aligned with your company's standards. Because the cost of a wrong vendor is one your business should never have to pay." },
        monitoring: { t: "Reduce Risk with Continuous Monitoring", p: "Never be caught off guard. Real time vendor updates photos, videos, voice notes give you complete visibility into every activity, every obligation and every potential issue before it becomes a problem." },
        brand: { t: "Protect Your Brand Integrity", p: "Bad actors don't stand a chance. Certifier's AI and ML capabilities grow smarter with every verification combining machine intelligence with human judgment to ensure only authentic vendors make it through." },
      },
    },
    api: {
      h: "API-Driven Counterparty Platform",
      p: "Let a third party perform all compliance checks on your behalf. Businesses can safeguard their reputation, mitigate potential legal repercussions and maintain compliance with both legal and ethical guidelines.",
      cards: {
        mca: { t: "Ministry of Corporate Affairs", p: "Deliver a better employee experience with faster, high-efficiency verifications—reducing onboarding time and lowering operational costs by up to 75%." },
        gst: { t: "Goods and Services Tax (GST)", p: "GST verification confirms the validity of a GSTIN and provides key business details such as legal name, entity type and registration status—helping identify and prevent fraudulent GST record" },
        owner: { t: "Owner & Director Verification", p: "This verification confirms the identity of company owners or directors using official documents such as PAN, Aadhaar, Voter ID, or Driving License by validating document copies against issuing authority databases." },
        company: { t: "Company Check", p: "This verification includes a site visit to the company and cross-referencing through our Rolodex (Fake Company List), MoCA, NASSCOM and reverse domain lookups, followed by decoy calls, mystery shopping and on-site verification to confirm authenticity." },
        bank: { t: "Bank Statement Verification", p: "This check verifies the authenticity and ownership of a specified bank account." },
        global: { t: "Global Database", p: "This check screens individuals and entities against global databases to identify potential risks, watchlists, or adverse records." },
        directorship: { t: "Directorship Check", p: "This check verifies candidate details through the MCA database portal using identifiers such as Name, Date of Birth, or Father's Surname to validate records against the official Ministry of Corporate Affairs database." },
        credit: { t: "Company Credit Check", p: "The credit report is obtained from a credit bureau and includes the Credit/CIBIL score and key risk parameters, along with verification of the applicant's name and PAN, and details of total active and closed loans." },
      },
    },
  },
};

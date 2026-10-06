/** English copy for `app/[locale]/governments/**` — the hub, its four vertical
 *  pages and the Ministry of Manpower case study, one namespace per route
 *  subtree (the rule at the end of `./index`'s recipe).
 *
 *  Every shape argument — why the English object is the schema, why a label is
 *  keyed by its destination, why rich text is real JSX, why the dictionary
 *  holds almost no arrays — is in `./index` and is not repeated here.
 *
 *  MEASURED: **150 JSX text nodes** across the six pre-migration files by a
 *  comment-stripped `>text<` matcher (`scratchpad/pg_count_nodes.py`); this
 *  file holds **495 leaves**, a **3.3x** undercount, asserted in
 *  `tools/test/copy.test.ts` §13. The brief that commissioned this slice
 *  counted 83 (6.0x) and a same-line variant of the matcher scores 127 (3.9x);
 *  all three are recorded rather than reconciled, the posture §7 and §9 already
 *  take.
 *
 *  Per file, by the 150-node run, and the spread is the whole finding:
 *
 *      governments/page.tsx        46 nodes ->  65 leaves   1.4x
 *      governments/health          15       ->  95          6.3x
 *      governments/immigration     15       ->  97          6.5x
 *      governments/manpower-educ.  15       ->  95          6.3x
 *      governments/trade           15       ->  93          6.2x
 *      .../ministry-of-manpower    44       ->  48          1.1x
 *                                  (+2: `crumb` and `coverageLink`)
 *
 *  **THIS SUBTREE IS THE EXTREME OF `./index`'S RULE, NOT AN EXCEPTION TO IT.**
 *  The header says the undercount tracks how much of a file is ALREADY a table
 *  and tells the next agent to budget ~3x; the four vertical pages come in at
 *  over 6x, which is twice the ceiling, and the reason is structural rather
 *  than accidental. Each of them is one JSX element — a `<VerticalPage …/>`
 *  call — whose 90-odd words arrive as ATTRIBUTES and as `lanes` / `pills` /
 *  `rows` / `steps` / `faqs` object properties. A `>text<` matcher can see
 *  fifteen things on such a page: the four `<b>` strip fragments, the `<em>` in
 *  the `h1` and the closing heading, the `<br />` in the FAQ head, and the word
 *  before the link in the table note. Everything else is invisible to it. The
 *  two pages that are ordinary markup — the hub and the case study — score 1.4x
 *  and 1.1x on the same run, inside the range the header predicts.
 *
 *  So the honest generalisation, and the one worth carrying forward: the
 *  multiplier is a property of HOW A PAGE IS WRITTEN, and "a page built on a
 *  props-driven template" is the highest-multiplier shape found so far —
 *  higher than `sections/PeopleStrip.tsx`'s 26x only because that file had two
 *  tables and no prose at all. `components/templates/VerticalPage.tsx` itself
 *  scores 1.1x for the mirror-image reason `templates.en.tsx` records: every
 *  word it renders beyond its own eleven arrives from one of these six pages,
 *  and they are the pages it arrives from.
 *
 *  WHAT DID NOT MOVE, and why:
 *
 *  - **`VerticalPage`'s props and rendering contract.** That component is
 *    already migrated — its eleven leaves are `templates.en.tsx` — and nothing
 *    here changes its shape. The four pages still pass `lanes`, `rows`, `steps`
 *    and `faqs` in exactly the types it declares; only the strings inside them
 *    are read from this file now. `laneCols` is untouched (none of the four
 *    sets it).
 *
 *  - **`generateMetadata`.** Nothing to move. All six pages read
 *    `pageMetadata(locale, PATH)` and every title and description already lives
 *    in `lib/seo/copy.ts`, which `check:sitemap` compares.
 *
 *  - **`SERVICE.name` and `SERVICE.serviceType`** on the four vertical pages.
 *    The third field of that object is `copyFor(PATH).description` — §8.1's
 *    table — and moving `name` here would make one JSON-LD node read from two
 *    copy sources, the drift `lib/seo/copy.ts` exists to close. `serviceType`
 *    is a schema.org classification, structure in the sense an href is.
 *    `business.en.tsx` records the same two exclusions.
 *
 *  - **The `k` eyebrows over the four vertical bands** ("What we verify", "How
 *    it works", "Turnaround & coverage", "Compliance & security"). Those are
 *    `templates.bands` and belong to the template, not to a page; each page's
 *    own comment already said they were untouched.
 *
 *  NO `as const`, per the recipe.
 */

export const en = {
  /** The subtree's own name: the hub's breadcrumb rung AND the parent rung on
   *  all five inner pages. One leaf per destination — `business.crumb`'s
   *  argument for its six renderings of one rung. */
  crumb: "Governments",

  /** The link text in all four vertical pages' table notes. ONE leaf, because
   *  it is the name of a destination rather than a sentence: the four
   *  preambles around it genuinely differ ("qualifications", "documents",
   *  "credentials", "company records" verified in the country of issue) and
   *  are four leaves below, while this is the label on a link to
   *  `/international` — the shape `chrome.footer.links` uses, a label per
   *  destination. Four identical leaves would let a translator give one page a
   *  different name for the same page. */
  coverageLink: "global coverage",

  /** `/governments` — the audience hub (Template 2). Evidence-first: this
   *  buyer converts on artefacts (IA §4.1). */
  hub: {
    closing: {
      heading: (
        <>
          Bring us the mandate. <em>We'll bring the proof.</em>
        </>
      ),
      sub: "A named contact, not a form queue — pilots scoped within two weeks.",
    },

    hero: {
      /** Plain `&`, NOT `&amp;`. The JSX read `For governments &amp;
       *  authorities`; JSX decodes the entity before React sees it and React
       *  re-escapes on the way out, so a literal `&amp;` in a STRING leaf
       *  emits `&amp;amp;`. Second corollary in `./index`'s byte-identity
       *  section, and the trap `tools/test/copy.test.ts` §3 exists for. */
      k: "For governments & authorities",
      h1: (
        <>
          Verified at <em>national scale.</em>
        </>
      ),
      sub:
        "A ministry isn't buying reports. It's buying the trust layer under every permit, " +
        "licence and clearance — confirmed with the issuer, never a proxy database, at the " +
        "volume a nation runs on.",
      cta: "Talk to sales",
      artefacts: "Procurement & compliance artefacts",
    },

    /** The proof strip. Each item is `<b>figure</b> tail` — TWO children, so
     *  ONE rich-text leaf: splitting them would put two adjacent text children
     *  where one sits today and React's SSR writes `<!-- -->` between those. */
    strip: {
      checks: (<><b>20M+</b> checks since 2018, at the primary source</>),
      countries: (<><b>120+</b> countries reachable</>),
      offices: (<><b>6</b> offices, twelve hours apart</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR · PBSA · NSR</>),
    },

    /** The named-authority strip. Five `.g3` cards written out longhand, each
     *  `<b>name</b><span>sub</span>` — two elements with one text child each,
     *  so two string leaves per card and no rich text. These are CLAIMS about
     *  real government clients, which is why the answer block below restates
     *  them rather than inventing a list. */
    authorities: {
      k: "Governments we work with",
      mom: { n: "Ministry of Manpower", s: "Singapore" },
      india: { n: "Government of India", s: "Authorities" },
      saudi: { n: "Kingdom of Saudi Arabia", s: "Authorities" },
      uae: { n: "United Arab Emirates", s: "Authorities" },
      europe: { n: "European authorities", s: "Verification workflows" },
    },

    mandates: {
      k: "Four mandates",
      h: "What does HelloVerify verify for government authorities?",
      lede:
        "HelloVerify covers four kinds of authority: health, immigration, manpower and " +
        "education, and trade and business. One primary-source pipeline confirms medical " +
        "credentials, visa documents, work-pass qualifications and trade licences with the " +
        "issuer that holds each record, across 120+ reachable countries.",
    },

    /** The four vertical cards, KEYED BY DESTINATION — `chrome.footer.links`
     *  and `lib/seo/copy.ts`'s shape. The page keeps the order, the hrefs, the
     *  images and the grid spans, and keeps `key={c.href}`, so no rendered key
     *  changes. */
    paths: {
      "/solutions/health-authorities": {
        tag: "Health authorities",
        from: "medical credentials",
        h: "Health",
        p: "Every nurse and doctor's degree, licence and history — confirmed with the issuing council before they touch a patient.",
      },
      "/solutions/immigration-authorities": {
        tag: "Immigration authorities",
        from: "visas & permits",
        h: "Immigration",
        p: "Applicant documents screened at the source, in the country that issued them — before the stamp.",
      },
      "/solutions/manpower-and-education-authorities": {
        tag: "Manpower & education",
        from: "work passes",
        h: "Manpower & education",
        p: "Foreign-worker credentials verified for work-pass decisions — the workflow running with Singapore's Ministry of Manpower.",
      },
      "/solutions/trade-authorities": {
        tag: "Trade & business",
        from: "licences & registries",
        h: "Trade & business",
        p: "Company registrations, trade licences and the people behind them — verified for licensing decisions.",
      },
    },

    /** The five `.rz` reasons. `n` is here rather than in the page although it
     *  is an ornament: "01"–"05" are rendered text, and a locale that does not
     *  write Western digits would have to change them. The same call
     *  `chrome/Steps`' records make everywhere else in this repo. */
    why: {
      k: "Why governments work with us",
      h: "Why do governments choose HelloVerify?",
      lede:
        "Governments choose HelloVerify because every fact is confirmed with the issuer " +
        "rather than a proxy database, one platform covers people and businesses, " +
        "authorities in India, Saudi Arabia, the UAE, Singapore and Europe already work " +
        "with HelloVerify, and every result carries an auditable trail.",
      rows: {
        primarySource: {
          n: "01",
          t: "Primary source, at national scale",
          p: "Confirmed with the issuer — never a proxy database.",
        },
        onePlatform: {
          n: "02",
          t: "One platform, public and private",
          p: "People, businesses, suppliers and institutions on the same rails.",
        },
        proven: {
          n: "03",
          t: "Proven with governments",
          p: "India, Saudi Arabia, the UAE, Singapore, European workflows.",
        },
        builtToLast: {
          n: "04",
          t: "Built to last",
          p: "Infrastructure regulators rely on for years, not a project.",
        },
        evidence: {
          n: "05",
          t: "Evidence, not opinion",
          p: "Remarks, artefacts and an auditable trail with every result.",
        },
      },
    },

    procurement: {
      k: "Procurement-ready",
      h: "What procurement artefacts does HelloVerify provide?",
      lede:
        "A procurement review gets one page carrying every HelloVerify artefact: ISO 27001 " +
        "certification, independently audited, GDPR-aligned data handling, PBSA membership, " +
        "data residency, sub-processors and accessibility conformance. Work-pass verification " +
        "in production with Singapore's Ministry of Manpower is the reference.",
      /** The MOM card's gloss, which is genuinely per-page: the same card on
       *  `/about` ends "the story →" where this one ends "read the story →".
       *  `chrome/CertCard.tsx` records that as the reason `gloss` is a
       *  `ReactNode` and overridable at all.
       *
       *  TWO LEAVES AND A `{" "}` LEFT IN THE PAGE, not one function leaf. The
       *  markup is `text—{" "}` then the `<AppLink>`, i.e. THREE children, and
       *  the `{" "}` between them is CONTENT (`./index`, first corollary). A
       *  string leaf could not carry the trailing space either — an
       *  edge-whitespace leaf is what `tools/test/copy.test.ts` §3 rejects —
       *  and the space is a separate child here rather than part of the text,
       *  so the page writes `{t…}{" "}` and the three children are the three
       *  that were there. */
      momGloss: "Work-pass credential verification with Singapore's Ministry of Manpower —",
      momLink: "read the story →",
      securityInFull: "Security & compliance, in full",
    },
  },

  /** `/solutions/health-authorities` — the old `healthAuthorities.base.json`,
   *  word for word, in its section order. The hidden "Our Client" card is not
   *  carried. */
  health: {
    crumb: "Health Authorities",
    h1: (<>Primary Source Verification for Healthcare <em>Workforce</em></>),
    sub: "Ensure credential accuracy and regulatory compliance by verifying doctors, nurses, and allied professionals directly from issuing authorities.",
    overview: {
      h: "Overview",
      p: "In the GCC's fast-growing, highly regulated healthcare landscape, credentials are non-negotiable. HelloVerify is a globally recognised verification partner trusted by health authority in Saudi Arabia.",
      imgAlt: "Healthcare professional verifying credentials",
      bullets: ["Primary Source Verification (PSV) - each record is verified from the source of issue.", "Each issuing authority’s accreditation is verified from government regulatory organisation/ministry.", "Audit-ready reports that enable fast, defensible licensing decisions for government authorities."],
    },
    categories: {
      h: "Practitioner Categories",
      sub: "The PSV program encompasses all practitioner categories defined by regulators",
      items: {
        doctor: "Doctor",
        practitioners: "Practitioners",
        nonPhysician: "Non-physician",
        pharmacists: "Pharmacists",
        nurses: "Nurses and Midwives",
      },
    },
    psv: {
      h: "Primary Source Verification",
      cards: {
        education: { t: "Education Verification", p: "Direct verification with universities, colleges, or boards to confirm degree, field of study and complete status." },
        accreditation: { t: "Institute Accreditation Check", p: "Ensures the issuing institution is recognized and in good standing both domestically and internationally." },
        license: { t: "Health License", p: "Verification with licensing authorities, medical councils, or equivalents to confirm license details." },
        standing: { t: "Certificate Of Good Standing", p: "Verification of the practitioner's standing, including any sanctions, suspensions, or disciplinary actions." },
        registration: { t: "Business Registration Certificate", p: "Validate company authenticity through registration, licensing and regulatory compliance checks." },
        employment: { t: "Employment Verification", p: "Confirmation from previous or current employers regarding designation, department, employment type and dates." },
      },
    },
    easy: {
      h: "How HelloVerify Makes It Easy For Authorities",
      cards: {
        trust: {
          t: "Building Trust within Healthcare",
          p: "Empowering healthcare authorities across the world in their mission to onboard verified and competent healthcare professionals with flexible reporting mechanisms.",
          b: ["Empowers authorities to onboard healthcare professionals", "Flexible reporting for competency assurance"],
        },
        regulators: {
          t: "Delivering Trust for Health Regulators",
          p: "Evidence backed primary source verification through official confirmations from authorized institutions. Ensures accurate and reliable results for informed decision making.",
          b: ["Primary source verification via official institutional confirmations", "Accurate results for informed decision-making"],
        },
        tech: {
          t: "Powered by Tech, Built on Trust",
          p: "Providing a technology enabled an end-to-end screening ecosystem for Healthcare Professionals with fast & accurate verifications through our proprietary portal.",
          b: ["End-to-end screening ecosystem for health professionals", "Fast, accurate verifications via our proprietary portal"],
        },
        applicant: {
          t: "Seamless Applicant Experience",
          p: "Assistance through our Candidate Support features across the journey to handhold you in your verification journey. Our support ensures a smooth & hassle-free experience at every step.",
          b: ["Dedicated support provided throughout verification journey", "Smooth, hassle-free experience at every step"],
        },
      },
    },
    promise: {
      h: "Accuracy Is Not Our Feature. It's Our Promise.",
      intro: ["While technology is our backbone, results are our benchmark.", "We deliver a distinct competitive edge through"],
      cards: {
        psv: {
          t: "Primary Source Verification",
          p: "PSV verifies qualifications at source, ensuring accurate, tamper-proof validation that strengthens fraud detection, protects reputation, and ensures compliance.",
          b: ["Verified at source", "Tamper-proof validation", "Fraud detection & compliance"],
        },
        speed: {
          t: "Unmatched Speed & Accuracy",
          p: "High-speed turnaround times backed by industry-leading SLAs and evidence backed reporting.",
          b: ["Industry-leading SLAs", "High-speed turnaround", "Evidence-backed reporting"],
        },
        fraud: {
          t: "Proactive Fraud Intelligence",
          p: "We flag fake documents before they're approved — our system detected fraud in 12–14% of applications.",
          b: ["Flags fake documents pre-approval", "Fraud detected in 12–14% of applications", "Enhances trust and reduces risk"],
        },
        intelligence: {
          t: "Actionable Business Intelligence",
          p: "Customizable, analytics-driven dashboards provide real-time tracking and management insights.",
          b: ["Customizable dashboards", "Real-time tracking", "Analytics-driven insights"],
        },
        compliance: {
          t: "Trusted Compliance",
          p: "HelloVerify is certified under ISO/IEC 27001 & ISO/IEC 27701 and is fully GDPR compliant. Our integrated, standards-driven framework ensures strong data protection, privacy & security you can trust.",
          b: ["ISO/IEC 27001 & 27701 certified", "Fully GDPR compliant", "Strong data privacy & security"],
        },
        sovereignty: {
          t: "Data Sovereignty - Local Assurance",
          p: "We ensure data is stored and processed locally in accordance with applicable data localisation laws and regulatory mandates.",
          b: ["Data stored & processed locally", "Compliant with localisation laws", "Meets regulatory mandates"],
        },
      },
    },
  },

  /** `/solutions/immigration-authorities` — the old
   *  `immigrationMigrationService.base.json` authorities tab, word for word,
   *  in its order. `tabs` are the old hero's two tab labels, shared with
   *  `/products/immigration`; `crumb` is also the parent rung on the Latvia
   *  and Italy pages. The hidden "Transforming" band is not carried. */
  immigration: {
    crumb: "Immigration Authorities",
    tabs: { authorities: "Solutions For Authorities", applicant: "Solutions For Applicants" },
    h1: (<>Immigration Solutions <em>Authorities</em></>),
    sub: "AI-Powered Verification for Faster, Safer Immigration Decisions. Enable secure, compliant applicant screening with advanced fraud detection and real-time verification.",
    overview: {
      h: "Overview",
      imgAlt: "Immigration authority overview",
      bullets: [
        "AI powered background verification and applicant screening for immigration and government authorities.",
        "End to end digital verification from application to final decision.",
        "Real time verification of identity, education, employment, financial, criminal, and supporting records.",
        "AI driven fraud detection for forged documents and high risk applicants.",
        "Fast, standardized verification with minimal manual intervention.",
        "Audit-ready reports with complete traceability and compliance support.",
        "Centralized dashboards with real-time insights and operational visibility.",
        "Secure, scalable platform for high-volume application processing",
      ],
    },
    standOut: {
      h: "Why We Stand Out",
      sub: "Technology powers us, but results define us. We provide a clear competitive edge through.",
      cards: {
        digital: { t: "Digital & Paperless Process", p: "Digitize the complete verification lifecycle from application submission and document collection to verification, reporting, and final decision making through a secure, paperless workflow." },
        reports: { t: "Insightful and Informative Reports", p: "Our proprietary technology, AI capabilities, and deep verification expertise deliver clear, comprehensive, and audit ready reports that enable faster, more confident decision making." },
        customized: { t: "Customized Solutions", p: "We meticulously tailor our services in precise accordance with the embassy's specific requirements from the Applicant." },
        fraudAlerts: { t: "Clear Fraud Alerts", p: "Our continuously evolving fraud intelligence, combined with advanced document analysis and verification expertise, helps detect forged documents, discrepancies, duplicate identities, and high-risk applicants with greater accuracy." },
        compliance: { t: "Trusted Compliance", p: "HelloVerify is certified under ISO/IEC 27001 and ISO/IEC 27701 and is fully GDPR compliant, ensuring robust information security, privacy protection, regulatory compliance, and complete audit traceability." },
        sovereignty: { t: "Data Sovereignty - Local Assurance", p: "Support secure local data storage and processing while complying with data localization laws, regulatory mandates, and government security requirements." },
      },
    },
    partners: {
      h: "Our Partners",
      cta: "Partner with Us",
      logos: {
        latvia: "Embassy of Latvia",
        italy: "Embassy of Italy",
        britain: "British High Commission",
        switzerland: "Embassy of Switzerland",
        zambia: "Zambia Qualifications Authority",
      },
    },
    advantage: {
      h: "The HelloVerify Advantage",
      cards: {
        fast: { t: "Fast", tag: "3× faster than industry average", p: "HelloVerify uses artificial intelligence & machine learning capabilities to provide fastest background screening service." },
        accurate: { t: "Accurate", tag: "99.2% verified report rate", p: "Our instant background check process helps you to eliminate fraudulent document for better decision making." },
        compliant: { t: "Compliant", tag: "ISO 27001 + GDPR certified", p: "HelloVerify follows high level of compliance and ensures bank level security." },
      },
    },
    ai: {
      h: "AI-Powered Immigration Verification Solution, transforming the way you screen and verify applicants.",
      sub: "The future of verification is here. Powered by AI and real-time data, HelloVerify delivers the speed, scale, and accuracy that legacy systems can't match.",
      cols: {
        challenges: {
          t: "Understanding Your Challenges",
          items: [
            { t: "Tampered Documents", p: "Counterfeit passports and visas compromise global immigration integrity and security." },
            { t: "Document Credibility Issues", p: "Educational and professional credentials verify qualifications, credibility, and suitability." },
            { t: "Compliance & Regulatory Risk", p: "Ensuring hiring meets legal and industry regulations." },
            { t: "Identity Manipulation", p: "Fraudulent company submissions compromise the credibility of organizational information." },
          ],
        },
        future: {
          t: "HelloVerify the Future of Verification",
          items: [
            { t: "Modern vs Legacy Systems", p: "Automates verification, reduces human error and delivers actionable insights in real time." },
            { t: "Advanced Fraud Detection", p: "Proactively identifies bad actors, flags tampered documents and detects suspicious activity early." },
            { t: "Audit-Ready Reporting", p: "Generates secure, audit-ready reports, ensuring compliance, transparency and accountability." },
            { t: "Real-time Dashboards", p: "Real-time dashboards provide comprehensive visibility for efficient operational oversight." },
          ],
        },
        advantages: {
          t: "Key Advantages Over Conventional Methods",
          items: [
            { t: "Detects Complex & Fraudulent case", p: "10–15% of complex fraudulent cases often missed by traditional checks." },
            { t: "Identifies inconsistencies", p: "Identifies hidden inconsistencies invisible to the naked eye." },
            { t: "Digital verification", p: "End-to-end digital applicant verification and screening." },
            { t: "AI-driven fraud detection", p: "Fraud detection tailored for visas, work permits, residency and labour mobility programs." },
          ],
        },
      },
    },
  },

  /** `/solutions/manpower-and-education-authorities` — the old
   *  `educationAuthorities.base.json`, word for word, in its section order.
   *  `crumb` is also the parent rung on the MOM and MOHESR pages. The second client card
   *  is MOHESR, as on the live site (the repo's `main` still hid it as "Client AE"). */
  manpowerEducation: {
    crumb: "Education Authorities",
    h1: (<>AI-Powered Education Equivalency &amp; <br /><em>Qualification Checks</em></>),
    sub: "1 in 8 applicants misrepresent their academic credentials, creating risks that undermine organizational integrity. Our AI-driven onboarding and automated workflows support faster, more informed hiring decisions.",
    client: {
      h: "Our Client",
      sub: (<>HelloVerify verifies educational qualifications for work-visa applicants including degree equivalency assessments for <strong>120+</strong> countries.</>),
      mom: {
        name: "Ministry of Manpower\n(Singapore)",
        logoAlt: "Ministry of Manpower (Singapore)",
        cta: "Start Your Primary Source Verification",
      },
      mohesr: {
        name: "Ministry of Higher Education and Scientific Research\n(MOHESR)",
        logoAlt: "Ministry of Higher Education and Scientific Research (MOHESR)",
        cta: "Start Your Primary Source Verification",
      },
    },
    overview: {
      h: "Overview",
      p: "Trusted qualifications are the foundation of global education and workforce mobility. As students and professionals move across borders, authorities must verify whether international credentials are authentic, issued by recognised institutions, and aligned with local qualification frameworks. HelloVerify combines primary source verification, institutional intelligence, automated fraud detection, and standardized reporting into a unified workflow, enabling authorities to:",
      imgAlt: "Education equivalency overview",
      bullets: [
        { t: "Enable global talent mobility", p: "by making international qualifications easier to understand, validate, and assess against local requirements." },
        { t: "Protect the integrity of education and workforce systems", p: "by verifying institutions, programmes, degrees, and certifications while identifying forged documents and discrepancies." },
        { t: "Make consistent, evidence-based decisions at scale", p: "with structured reports and clear audit trails that support recognition, employment, licensing, and workforce planning." },
        { t: "Promote fairness and transparency", p: "by ensuring applicants are assessed using reliable information while authorities retain control over final recognition and eligibility decisions" },
      ],
      closing: "The result is a more trusted connection between education, employment, and economic development allowing countries to attract qualified talent while protecting national standards.",
    },
    services: {
      h: "Our Verification Services",
      sub: "HelloVerify ensures educational institutions are genuine and accredited through a robust validation framework.",
      cards: {
        qualification: {
          t: "Qualification Verification",
          imgAlt: "Qualification verification",
          p: ["Verify degrees or diplomas awarded, graduation dates, transcripts and marksheets.", "Additional fees charged by universities, professional organizations, or third parties may apply."],
          cta: "Talk to Sales",
        },
        accreditation: {
          t: "Institution Accreditation",
          imgAlt: "Institution accreditation",
          p: ["We verify that the institution is accredited by an authorised and recognized accreditation body before conducting the education verification.", "Our accreditation check confirms that the institution is a legitimate and approved provider of degree programs, not a diploma or degree mill."],
          cta: "Talk to Sales",
        },
      },
    },
    promise: {
      h: "Accuracy Is Not Our Feature. It's Our Promise.",
      sub: ["While technology is our backbone, results are our benchmark. We deliver a competitive edge through:"],
      cards: {
        psv: { t: "Primary Source Verification", p: "PSV verifies qualifications directly at the source, ensuring accurate, tamper-proof validation that strengthens fraud detection, protects reputation, and supports compliance." },
        speed: { t: "Unmatched Speed & Accuracy", p: "Fast turnaround times backed by industry-leading SLAs and evidence-backed reporting." },
        fraud: { t: "Proactive Fraud Intelligence", p: "We flag fraudulent documents before approval. Our system detects fraud in 12–14% of applications." },
        intelligence: { t: "Actionable Business Intelligence", p: "Customizable, analytics-driven dashboards provide real-time tracking and management insights." },
        compliance: { t: "Guaranteed Compliance", p: "HelloVerify is ISO 9001 and 27701 certified and GDPR compliant." },
        sovereignty: { t: "Data Sovereignty - Local Assurance", p: "We ensure data is stored and processed locally in compliance with applicable data localization laws and regulatory requirements." },
      },
    },
  },

  /** `/solutions/trade-authorities` — the old `businessTradeAuthorities.base.json`,
   *  word for word: the hero, then its three audience rows. */
  trade: {
    crumb: "Business & Trade Authorities",
    h1: (<>Business &amp; Trade <em>Authorities</em></>),
    sub: "Empowering Business & Trade Authorities with comprehensive verification solutions that support visa compliance through accurate validation of identity, education, employment, and criminal records—helping reduce fraud and operational risk.",
    cta: "Talk to Sales",
    rows: {
      government: {
        h: "For Government and Diplomatic Missions",
        imgAlt: "Government and diplomatic missions",
        points: {
          security: { t: "Strengthen National and Cross-Border Security", p: "Authenticate the credentials of foreign workers, applicants, or business entities engaging with institutions." },
          mobility: { t: "Promote Transparent Mobility", p: "Support the safe, compliant migration of talent into the country especially amid growing employment inflows." },
        },
      },
      companies: {
        h: "For Companies and Enterprises",
        imgAlt: "Companies and enterprises",
        points: {
          integrity: { t: "Enhance Workforce Integrity", p: "Identify and eliminate the risk of fraudulent academic, professional, or identity claims among applicants." },
          hiring: { t: "Accelerate Hiring with Confidence", p: "Our AI-driven onboarding and automated workflows enable faster, more accurate talent acquisition." },
          compliance: { t: "Ensure Full Regulatory Compliance", p: "All verifications are aligned international due diligence standards." },
        },
      },
      agents: {
        h: "For Hiring Agents and Recruitment Intermediaries",
        imgAlt: "Hiring agents and recruitment intermediaries",
        points: {
          streamlined: { t: "Streamlined Verification Processes", p: "A single platform to verify credentials across multiple jurisdictions with real-time analytics and global screening coverage. Conduct real-time verifications across 80+ countries, with built-in regional compliance logic." },
          credibility: { t: "Credibility & Trust", p: "Bolster agency reputation by placing candidates who meet verified skill, education and legal thresholds." },
          integration: { t: "Scalable Integration", p: "API-ready infrastructure to seamlessly integrate into existing hiring or visa processing systems." },
        },
      },
    },
  },
  /** `/solutions/manpower-and-education-authorities/ministry-of-manpower` —
   *  the old `ministryOfManpower.base.json` overview, word for word (5 Oct
   *  2026). `closing` is NOT this page's: `sections/AuthorityPage.tsx`
   *  (Latvia, Italy, MOHESR) renders it, so it stays as it was; this page
   *  closes on `support`. */
  mom: {
    crumb: "Ministry of Manpower",
    closing: {
      heading: (<>Your ministry, <em>next.</em></>),
      sub: "Tell us the pass categories and intake volume. We'll scope a pilot.",
    },

    logo: "Ministry of Manpower (Singapore)",
    hero: {
      h1: (<>Verify Your Qualifications. <em>Get Your Work Pass.</em></>),
      sub: "HelloVerify is officially empanelled by Singapore’s Ministry of Manpower (MOM) to provide Primary Source Verification (PSV) for educational qualifications under the COMPASS framework.",
    },
    prices: {
      education: { label: "Education Check", value: "SGD 99", foot: "+9% GST = SGD 108" },
      accreditation: { label: "Accreditation", value: "SGD 30", foot: "+9% GST = SGD 33" },
      express: { label: "Express Delivery ≤ 7 working days", value: "SGD 54", foot: "+9% GST = SGD 59" },
    },
    why: {
      h: "Why Choose HelloVerify?",
      lede: "Officially empanelled by Ministry of Manpower. Built for speed, compliance and trust.",
      recognised: { t: "Educational Qualification Verification", p: "Officially recognized by Singapore’s Ministry of Manpower for qualification verification under the COMPASS framework across eligible work pass categories." },
      network: { t: "Global Verification Network", p: "Operating across 120+ countries with direct access to thousands of universities and accredited institutions." },
      security: { t: "ISO 27001 Information Security", p: "Your personal data, academic records, and passport information are protected by enterprise-grade security and privacy controls." },
    },
    services: {
      h: "Our Services",
      lede: "Everything you need for Ministry of Manpower compliant qualification verification.",
      education: { t: "Education Verification", p: "Primary Source Verification conducted directly with issuing institutions worldwide." },
      accreditation: { t: "Accreditation Check", p: "Confirms that the institution is recognized by relevant government and accreditation authorities." },
      express: { t: "Express Processing", p: "≤ 7 working days turnaround. Priority queue with dedicated case handler for urgent applications." },
      passes: {
        t: "All Work Pass Types Supported",
        tags: ["Employment Pass (EP)", "S Pass", "ONE Pass", "PEP", "TEP"],
      },
    },
    how: {
      h: "How it works",
      lede: "Simple 4-step process to get COMPASS-ready.",
      start: "Start Verification",
      sales: "Talk to Sales",
      register: { t: "Register & Upload", p: "Create account and upload passport for identity verification." },
      qualifications: { t: "Add Qualifications", p: "Enter education details and upload degree, transcripts, marksheets." },
      loa: { t: "Sign LOA & Pay", p: "Digitally sign Letter of Authorization and complete payment." },
      report: { t: "Receive Your Verification Report", p: "Get MOM-compliant verification report for work pass submission." },
    },
    docs: {
      h: "Required Documents",
      list: ["Valid passport (for identity verification)", "Degree certificate / diploma", "Marksheets / grade sheets", "Official transcripts", "Authorized English translation (for non-English documents)", "Letter of Authorization (generated during application)"],
      translationNote: "For non-English documents, you must submit the original document and an English translation. The translation can be done by a translation service provider.",
      accreditation: {
        h: "When is Accreditation Needed?",
        inList: { lead: "Institution in MOM's list?", rest: "Only education check needed." },
        notInList: { lead: "Not in the list?", rest: "Both education + accreditation checks required." },
      },
      nonEnglish: { h: "Non-English Documents", p: "Non-English documents must be accompanied by an authorized English translation." },
    },
    compass: {
      k: "Compass Framework",
      h: "Two-Stage EP Eligibility",
      intro: "From 1 September 2023, MOM requires all Employment Pass (EP) candidates (from any country) to pass a 2-stage eligibility framework. This applies to new EP applications from 1 September 2023 and renewals from 1 September 2024.",
      one: { t: "Stage 1", p: "Meet the qualifying salary for your sector." },
      two: { t: "Stage 2", p: "Pass COMPASS with ≥ 40 points across salary, qualifications, diversity and support." },
      scoring: {
        h: "Qualification Scoring (C2)",
        p: "From September 2023, all new EP applications must pass COMPASS with at least 40 points. Under criterion C2, all post-secondary qualifications must be verified by an empaneled vendor.",
        top: { v: "20 pts", l: "Top-tier institution degree" },
        recognised: { v: "10 pts", l: "Any recognized institution degree" },
        none: { v: "0 pts", l: "No degree / unverified" },
      },
      links: {
        h: "Useful MOM Links",
        documents: "EP Documents Required",
        selfAssessment: "Self-Assessment Tool",
      },
    },
    faqHead: "Frequently Asked Questions",
    faqs: {
      compass: {
        q: "What is COMPASS and how does it affect my EP application?",
        a: "COMPASS (Complementarity Assessment Framework) is a points-based framework by Singapore's Ministry of Manpower for evaluating Employment Pass applications. From 1 September 2023, all new EP applications must pass COMPASS with at least 40 points across four foundational criteria. This applies to new applications from September 2023, and renewals from September 2024. Qualification verification under criterion C2 is mandatory.",
      },
      twoStage: {
        q: "What is the two-stage EP eligibility framework?",
        a: "MOM requires EP candidates to pass two stages: Stage 1 — meet the qualifying salary for their sector. Stage 2 — pass the COMPASS framework with at least 40 points across criteria covering salary, qualifications, diversity, and local employment support. Post-secondary qualifications declared must be supported with verification proof.",
      },
      psv: {
        q: "Why do I need primary source verification?",
        a: "MOM requires that all educational qualifications (post-secondary diploma and above) declared in work pass applications be verified through an independent background screening company. Primary source verification involves directly contacting the issuing institution to confirm the authenticity of your qualification. Educational certificates certified by notary public and school letters are NOT accepted as verification proof.",
      },
      accreditation: {
        q: "When is an accreditation check required?",
        a: "If your awarding institution is found in MOM's dropdown list, only an authenticity check (education verification) is needed. If the institution is NOT in MOM's dropdown list, you must carry an authenticity check and an accreditation check to confirm the institution is recognized by the country's local government authorities.",
      },
      passTypes: {
        q: "Which work pass types require verification?",
        a: "Verification is required for Employment Pass (EP), S Pass, Training Employment Pass (TEP), ONE Pass, and Personalized Employment Pass (PEP) applications where educational qualifications are declared to MOM.",
      },
      duration: {
        q: "How long does the verification process take?",
        a: "Standard verification takes 10–15 working days depending on the institution's response time. Express service is available at SGD 54 + 9% GST (SGD 58.86), reducing turnaround to ≤ 7 working days.",
      },
      cost: {
        q: "How much does verification cost?",
        a: "Education verification costs SGD 99 + 9% GST (SGD 108) per qualification. Accreditation check is SGD 30 + 9% GST (SGD 33) per check (optional, only if institution is not in MOM's list). Express service is SGD 54 + 9% GST (SGD 58.86) per application. Some universities may charge an additional verification fee which will be converted to SGD.",
      },
      howMany: {
        q: "How many qualifications can I verify in one application?",
        a: "You can verify up to 7 educational qualifications in a single application. Each qualification is charged separately at SGD 99 + GST. Accreditation checks are optional and charged at SGD 30 + GST per check.",
      },
      documents: {
        q: "What documents do I need to submit?",
        a: "You'll need: (1) Valid passport for identity verification; (2) Degree certificate or diploma; (3) Marksheets or grade sheets; (4) Official transcripts. For non-English documents, the original document and an authorized English translation. All documents must be uploaded digitally. You'll also need the address, contact, and person details of your awarding institution.",
      },
      nameDiffers: {
        q: "What if my name on the passport differs from my degree?",
        a: "If your name on the passport differs from that on your educational documents, please upload an explanation letter and supporting documents (e.g., deed poll, marriage certificate, or name change certificate or affidavit) during the application process.",
      },
      universityFees: {
        q: "Do some universities charge additional verification fees?",
        a: "Yes, some universities charge their own verification fee. If applicable, we will inform you of the amount during the application. This fee will be converted to SGD and added to your total before payment. Externally charged change processing or transaction surcharges may apply for this fee for non-SGD settlement.",
      },
      payment: {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express). Payment is collected at the end of the application process after you review and digitally sign the Letter of Authorization (LOA). All prices are subject to 9% GST.",
      },
      invoice: {
        q: "Will I receive a tax invoice?",
        a: "Yes, upon payment you will receive a detailed tax invoice showing the breakdown of: education verification charges (SGD 99 + GST per qualification), accreditation charges (SGD 30 + GST if opted), university verification fees (if any), express service charges (SGD 54 + GST if opted), and total GST amount.",
      },
      loa: {
        q: "What is the Letter of Authorization (LOA)?",
        a: "The LOA is a legal document authorizing HelloVerify to contact your educational institution to verify your qualifications. It is similar to a Letter of Consent used by other employment agencies. You will digitally sign this document before proceeding with payment.",
      },
      employer: {
        q: "Can my employer submit the verification on my behalf?",
        a: "Both candidates and employers or agencies can submit verification requests. Candidates can use our self-service portal, while employers can contact our sales team for bulk verification requests and dedicated account support.",
      },
      report: {
        q: "What's included in the verification report?",
        a: "Your verification report includes a summary, identity details, authenticity status, each qualification, accreditation status for each institution (if applicable), direct confirmation from issuing institutions, and a forgery-protected, MOM-compliant report ready for work pass submission.",
      },
      after: {
        q: "What happens after verification is complete?",
        a: "Once verification is complete, you will receive a final verification report that can be submitted as part of your work pass application to MOM. The report confirms the authenticity (and accreditation, if opted) of your educational qualifications.",
      },
      unverifiable: {
        q: "What if my qualification cannot be verified?",
        a: "If an institution is unresponsive or unable to verify, we will provide a detailed report explaining the verification attempt and outcome. In some cases, alternative verification methods may be explored. We make unlimited attempts to contact the institution.",
      },
      empanelled: {
        q: "Is HelloVerify an MOM-empaneled vendor?",
        a: "Yes, HelloVerify is an empaneled background screening company recognized by Singapore's Ministry of Manpower for work pass qualification verification. MOM selects vendors based on customer support capabilities, geographical coverage, cost efficiency, and quality of verification processes.",
      },
    },
    support: {
      heading: (<>Support &amp; <em>Appeal</em></>),
      sub: "Our team is here to assist you with document preparation or questions about eligibility.",
      cta: "Contact Now",
    },
  },
};

/**
 * Blog posts. Real content lives here until a CMS lands (BUILD-SPEC G7) — the
 * shape is deliberately CMS-ready: one record per post, body as sections.
 */

export type Post = {
  slug: string;
  title: string;
  standfirst: string;
  date: string;
  readMins: number;
  category: string;
  author: { name: string; role: string; img: string };
  /** Body as H2-anchored sections — each independently citable (AEO, BUILD-SPEC §11a). */
  sections: { id: string; h: string; paras: string[]; quote?: string }[];
};

export const POSTS: Post[] = [
  {
    slug: "primary-source-vs-database",
    title: "Primary source vs. database: the difference that decides everything",
    standfirst:
      "Two products can offer the same list of checks and give you opposite answers. The difference isn't features — it's who you asked.",
    date: "2026-09-02",
    readMins: 6,
    category: "Verification",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "the-same-list",
        h: "Two vendors, the same feature list",
        paras: [
          "Put two background verification proposals side by side and they will look interchangeable. Both offer identity, education, employment, criminal records. Both quote turnaround times. Both have logos of certifications along the bottom.",
          "The difference is invisible on the feature list and total in practice: one of them asks the university whether the degree exists, and the other asks a database that once recorded that it did.",
        ],
      },
      {
        id: "what-a-database-knows",
        h: "What a database actually knows",
        paras: [
          "An aggregated database knows what someone typed into it, at some point, from some source. That is genuinely useful for sanctions lists and watchlists, because there the list is the authority — being on it is the fact being checked.",
          "It is close to useless against a competent forgery of a degree certificate. The forger is not trying to fool the database; the database has no record of that graduate either way. A name-based match returns a plausible-looking result, and everyone moves on.",
        ],
        quote: "The credential either exists at the institution that issued it, or it doesn't. Everything else is opinion.",
      },
      {
        id: "the-third-answer",
        h: "The third answer nobody wants to give",
        paras: [
          "Primary source verification produces three outcomes, not two. Verified: the registrar confirmed the record. Not verified: the registrar has no such record. And unverifiable: the registrar could not be reached at all.",
          "That third state is where the industry quietly misleads. A system built to return pass or fail has to put unverifiable somewhere, and it almost always lands on pass. The employer sees a green tick that means nothing was actually confirmed.",
          "Reporting it honestly is uncomfortable — it makes a vendor look slower and less complete. It is also the only version that protects both the employer and the candidate, because a person from a country with damaged record-keeping is not a person who lied.",
        ],
      },
      {
        id: "what-it-costs",
        h: "What honesty costs, in days",
        paras: [
          "Asking the source takes longer. A registrar answers in days, not milliseconds — which is why our education check is quoted at three days while a database lookup is instant.",
          "The right response to that gap is not to pretend it doesn't exist. It is to run everything that can be digital in parallel — identity, licence, provident-fund history, court records, most of which come back inside an hour — so the only thing you are waiting on is the thing that genuinely requires a human at an institution.",
        ],
      },
      {
        id: "how-to-tell",
        h: "How to tell which one you're buying",
        paras: [
          "Ask three questions. First: for each check, who exactly confirms it — name the institution, not the category. Second: what do you return when the source cannot be reached, and where does that appear in the report. Third: can I see the evidence behind a result, with a date on it.",
          "A vendor doing primary source verification answers all three immediately, because those answers are the product. A vendor reselling database access will answer the first vaguely, the second not at all, and the third with a screenshot of their dashboard.",
        ],
      },
    ],
  },
  {
    slug: "what-30-minutes-actually-means",
    title: "What “30 minutes” actually means in a verification quote",
    standfirst:
      "Turnaround times are quoted from wildly different starting points. Here's how to read one honestly — and what we measure.",
    date: "2026-08-14",
    readMins: 4,
    category: "Operations",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "the-clock",
        h: "Where the clock starts",
        paras: [
          "Most quoted turnaround times begin when the vendor starts work, which can be hours after the candidate uploaded anything — or days, if a document was rejected for quality and nobody chased it.",
          "We measure from upload to report, including the queue. It makes our numbers look worse against vendors who measure from their own convenience, and it is the only number that describes the experience of the person waiting for a job.",
        ],
      },
      {
        id: "parallel",
        h: "Why parallel matters more than fast",
        paras: [
          "A package with four checks is not four times slower than one check, because the checks run simultaneously. A package is only as slow as its slowest member.",
          "That is also why mixing one slow check into an otherwise fast package is expensive in time: adding an education check to a 30-minute blue-collar package makes it a three-day package. Knowing that in advance lets you stage the decision — hire on the fast checks, confirm the slow one before confirmation of employment.",
        ],
      },
      {
        id: "the-honest-caveat",
        h: "The caveat we put in writing",
        paras: [
          "Times assume the issuer responds normally. Registries close for holidays, courts have backlogs, and some institutions still confirm by post. When that happens the report shows the request as pending with the route being used, rather than stalling silently.",
          "If a time is going to be missed, the useful moment to know is before you ordered the check — which is why country-level timings are published rather than quoted on request.",
        ],
      },
    ],
  },
  /* ── Ported from the old site, 22 Sep 2026 ──────────────────────────────
   *
   *  The four posts below are the four URLs the old site had indexed under
   *  `/blog/*`. Until this change `lib/seo/legacy-urls.ts` 308'd each of them
   *  to whichever live page was topically nearest, and said so in a comment:
   *  "This is second-best and should be revisited. Porting the posts is
   *  strictly better." This is that port; those four rows now point here.
   *
   *  PROVENANCE, because none of this copy is new. Each post's prose came out
   *  of two files in `D:\Projects\Application Frontend HV`, by script rather
   *  than by hand:
   *    - `src/i18n/en.json` -> `blog.posts.<slug>.{title,excerpt,category,
   *      readTime,sections.*}` — the headings and the long paragraphs.
   *    - `src/pages/blog/<Post>Page.tsx` — the card, stat and list copy, which
   *      was hardcoded in English there on purpose (`hooks/useBlogPost.ts`:
   *      "body copy remains English in article TSX").
   *  Dates are `useBlogPost.ts#BLOG_POST_DATES`, all four 2025-10-24.
   *
   *  STRUCTURE IS TRANSLATED, COPY IS NOT. The old template had cards, stat
   *  tiles, badge rows and two-column comparisons; `Post` has H2 sections of
   *  paragraphs. So a card's own title and body are joined with ": " (or " — "
   *  where the title already contains a colon), a tag row with ", ", a bullet
   *  list with "; ". Those joiners are the only
   *  characters added anywhere — the extractor asserts every source string
   *  still appears here verbatim, whitespace-normalised and entity-decoded.
   *
   *  THE BYLINE IS THE ORGANISATION, and that is sourced: the old repo's
   *  `components/StructuredData.tsx` emitted `author: { '@type':
   *  'Organization', name: SITE_NAME }` on every article route. `role` and
   *  `img` have no source at all (the old layout rendered no byline), so they
   *  reuse the record the two 2026 posts already carry rather than inventing a
   *  per-post role — the rejected alternative was blocking all four posts on a
   *  UI sub-label, which would have kept four indexed URLs on a subject-based
   *  redirect to save a string that is already on the site.
   *
   *  WHAT WAS DROPPED, deliberately, and it is not body copy:
   *    - Four outbound citation links (two news articles, the UIDAI valid-
   *      documents PDF, the RBI KYC PDF). `Post` has no link field and adding
   *      one needs `resources/blog/[slug]/page.tsx`, which is outside this
   *      change. Worth restoring; the URLs are in the old
   *      `DigitalAddressVerificationPage.tsx`.
   *    - Each post's `cta.*` block and the "View Complete Penalty Structure"
   *      button label. Template 6 owns its own closing CTA in `PageShell`, so
   *      a second one has nowhere to render.
   *    - ONE claim: "GDPR and SOC 2 compliant data handling processes", from
   *      the penalties post's feature list. `lib/content/company.ts`
   *      CREDENTIALS reviewed that claim and publishes it as "GDPR-aligned
   *      data protection practices"; republishing "GDPR compliant" here would
   *      reintroduce exactly the disagreement that file exists to stop. The
   *      other seven features in that list are ported verbatim.
   *
   *  AND THE FIGURES ARE OF THEIR DATE. The FIR post's coverage numbers
   *  (15,000+ stations, 21 live states, "Go Live Q4'25 / Q1'26") were true on
   *  2025-10-24 and are published under that date. They are an article, not
   *  the product page — `/checks/criminal` is where a current claim belongs.
   */
  {
    slug: "data-privacy-bill-compliance",
    title: "Data Privacy Bill Compliance Guide for Background Verification",
    standfirst:
      "Essential compliance requirements for conducting background checks under the new Data Privacy Bill — from consent management to candidate rights.",
    date: "2025-10-24",
    readMins: 8,
    category: "Compliance & Legal",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "compliance-overview",
        h: "Compliance Overview",
        paras: [
          "The new Data Privacy Bill introduces comprehensive requirements for organizations conducting background verification. This guide outlines the key compliance points that every organization must implement to ensure lawful data processing.",
          "Background verification processes involve handling sensitive personal data, making compliance with the Data Privacy Bill critical. Organizations must implement robust systems for consent management, candidate rights, and data protection to avoid penalties and maintain trust.",
        ],
      },
      {
        id: "key-compliance-requirements",
        h: "Key Compliance Requirements",
        paras: [
          "1. Candidate Notification Requirement: It is required that all companies inform their candidates that HelloVerify will be conducting their background checks.",
          "2. Consent Manager Implementation: A consent manager needs to be in place in case you are collecting the background check forms.",
          "3. Candidate Rights Documentation: Rights of the candidate to obtain their report, delete report, and withdraw consent need to be a documented procedure.",
          "4. Transparency Requirements: Display the details of the Data Protection Officer on the website, list of sub-processors, and have the necessary rights of the data principal published on the platform.",
          "5. Data Deletion Procedures: Clearly establish data deletion requests from candidates and deletion procedures.",
          "6. Data Breach Notification: In case of a data breach, the Data Fiduciary and the Data Processor need to inform the candidate.",
        ],
      },
      {
        id: "candidate-rights-under-the-data-privacy-bill",
        h: "Candidate Rights Under the Data Privacy Bill",
        paras: [
          "Consent: Right to provide informed consent before data collection",
          "Online OTP Verification: Secure verification through OTP for sensitive operations",
          "Deletion: Right to request deletion of personal data",
          "Access: Right to access and obtain a copy of their data",
          "Withdraw: Right to withdraw consent at any time",
        ],
      },
      {
        id: "otp-based-consent-verification",
        h: "OTP-Based Consent Verification",
        paras: [
          "Consent is verified through OTP across multiple platforms to ensure security and authenticity:",
          "DigiLocker: Education verification with OTP authentication",
          "Credit Checks: OTP-based authorization for credit reports",
          "Aadhaar: Secure OTP verification for identity checks",
        ],
      },
      {
        id: "common-implementation-challenges",
        h: "Common Implementation Challenges",
        paras: [
          "Customer rights implementation (Consent, Online OTP, Deletion, Access, Withdraw) needs careful integration",
          "Mandatory document list not being available can lead to high insufficiencies",
          "Data receipt for links will not work, as candidates may not know who HelloVerify is",
        ],
      },
      {
        id: "critical-compliance-gap",
        h: "Critical Compliance Gap",
        paras: [
          "Data Receipt for Links Will Not Work: When using external links, candidates may not know who HelloVerify is, leading to confusion and potential non-compliance with transparency requirements. Proper consent cannot be obtained if the candidate doesn't understand who is processing their data.",
        ],
      },
      {
        id: "helloverify-s-compliant-solution",
        h: "HelloVerify's Compliant Solution",
        paras: [
          "Recommendation: Use HelloVerify's Complete Application",
          "It is recommended that the client utilize the entire HelloVerify background check application and use our Invite feature to obtain the background check forms. Our entire application has the required features to run a fully compliant background checks process as stated above.",
          "Built-in Consent Manager: Comprehensive consent management with OTP verification and audit trails",
          "Candidate Portal: Dedicated portal where candidates can exercise all their rights",
          "Transparent Communication: Clear identification of HelloVerify as the data processor from the start",
          "Automated Rights Management: Streamlined processes for access, deletion, and consent withdrawal requests",
          "DPO Information Display: All required transparency information readily available",
          "Documented Procedures: Complete documentation of all data processing activities",
        ],
      },
      {
        id: "essential-transparency-disclosures",
        h: "Essential Transparency Disclosures",
        paras: [
          "Required Public Information",
          "Data Protection Officer Details: Name, contact information, and responsibilities must be prominently displayed on the website.",
          "List of Sub-Processors: Complete list of all third-party processors involved in data handling must be published and kept updated.",
          "Data Principal Rights: Clear documentation of all candidate rights including procedures to exercise them.",
        ],
      },
      {
        id: "non-compliance-consequences",
        h: "Non-Compliance Consequences",
        paras: [
          "Failure to comply with these requirements can result in severe penalties under the Data Privacy Bill. Organizations can face fines ranging from ₹10,000 to ₹250 crore depending on the nature and severity of the violation.",
        ],
      },
    ],
  },
  {
    slug: "data-privacy-bill-penalties",
    title: "New Data Privacy Bill Penalties: What Organizations Need to Know",
    standfirst:
      "Understanding the significant penalties under India's new Data Privacy Bill — from ₹250 crore for security breaches to compliance obligations.",
    date: "2025-10-24",
    readMins: 7,
    category: "Compliance & Legal",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "critical-compliance-alert",
        h: "Critical Compliance Alert",
        paras: [
          "The new Data Privacy Bill introduces substantial penalties for non-compliance, with fines reaching up to ₹250 crore for serious violations. Organizations handling personal data must ensure strict adherence to the new regulations.",
          "The Gazette of India (Friday, 11th August 2023, Reference: CG-DL-E-12082023-248045) has outlined comprehensive penalty structures for violations under the new Data Privacy Bill. This legislation marks a significant shift in India's data protection landscape, bringing it in line with global standards like GDPR.",
        ],
      },
      {
        id: "penalty-structure-overview",
        h: "Penalty Structure Overview",
        paras: [
          "Maximum Penalty: ₹250 Cr — Security breach violations",
          "High-Risk Violations: ₹200 Cr — Children's data & breach notices",
          "General Violations: ₹50 Cr — Other provisions & rules",
        ],
      },
      {
        id: "detailed-penalty-breakdown",
        h: "Detailed Penalty Breakdown",
        paras: [
          "1. Breach in observing the obligation of a Data Fiduciary to take reasonable security safeguards to prevent a personal data breach. Legal Reference: Sub-section (5) of Section 8. Maximum Penalty: ₹250 Crore. Severity: Critical.",
          "2. Breach in observing the obligation to give the Board or affected Data Principal notice of a personal data breach. Legal Reference: Sub-section (6) of Section 8. Maximum Penalty: ₹200 Crore. Severity: Critical.",
          "3. Breach in observance of additional obligations in relation to children. Legal Reference: Section 9. Maximum Penalty: ₹200 Crore. Severity: Critical.",
          "4. Breach in observance of additional obligations of a Significant Data Fiduciary. Legal Reference: Section 10. Maximum Penalty: ₹150 Crore. Severity: High.",
          "5. Breach in observance of the duties. Legal Reference: Section 15. Maximum Penalty: ₹10,000. Severity: Low.",
          "6. Breach of any term of voluntary undertaking accepted by the Board. Legal Reference: Section 32. Maximum Penalty: Up to the extent applicable for the breach in respect of which the proceedings under Section 28 were instituted. Severity: Medium.",
          "7. Breach of any other provision of this Act or the rules made thereunder. Legal Reference: General. Maximum Penalty: ₹50 Crore. Severity: High.",
        ],
      },
      {
        id: "key-compliance-requirements",
        h: "Key Compliance Requirements",
        paras: [
          "Data Security Safeguards: Organizations must implement reasonable security safeguards to prevent personal data breaches. This includes: Encryption of sensitive data; Access control mechanisms; Regular security audits; Data breach response plans.",
          "Breach Notification: Immediate notification requirements when a breach occurs: Notify the Data Protection Board; Inform affected individuals; Document the breach details; Take corrective measures.",
          "Children's Data Protection: Enhanced protection for children's personal data: Parental consent requirements; Age verification mechanisms; Restricted data processing; No profiling or tracking.",
          "Significant Data Fiduciary: Additional obligations for large-scale data handlers: Appoint a Data Protection Officer; Conduct data audits; Data impact assessments; Enhanced transparency measures.",
        ],
      },
      {
        id: "official-reference-document",
        h: "Official Reference Document",
        paras: [
          "Publication: Gazette of India. Date: Friday, 11th August 2023. Reference: CG-DL-E-12082023-248045.",
        ],
      },
      {
        id: "how-helloverify-ensures-compliance",
        h: "How HelloVerify Ensures Compliance",
        paras: [
          "At HelloVerify, we understand the critical importance of data privacy and compliance. Our background verification services are designed with robust data protection measures that align with the new Data Privacy Bill requirements:",
          "ISO 27001 & ISO 27701 certified security infrastructure; Encrypted data storage and transmission; Regular security audits and vulnerability assessments; Immediate breach notification protocols; Comprehensive data protection impact assessments; Dedicated Data Protection Officer; Transparent data processing practices.",
        ],
      },
    ],
  },
  {
    slug: "digital-address-verification",
    title: "Why Physical Address Visits Are Now a Thing of the Past",
    standfirst:
      "Adoption of digital address verification through documents and GPS technology. Discover how HelloVerify is leading the digital transformation.",
    date: "2025-10-24",
    readMins: 6,
    category: "Industry Insights",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "new-features",
        h: "New Features",
        paras: [
          "We constantly work towards innovating and bringing you the latest digital products, keeping in mind the Digital India initiative, new technology, process enhancements, and privacy laws. Address checks have become digital in nature, marking a significant shift in how background verification is conducted across industries.",
          "White Collar Address Checks: We now support over 20 documents that can be submitted as address proofs, as suggested by the UIDAI authority. All other sectors such as insurance, telecom, and banking are using these guidelines.",
          "Accepted Documents Include: Passport, Voter ID, Driving License, Bank Statements, Utility Bills, Property Documents, and 14+ more documents as per UIDAI guidelines.",
          "Blue Collar Address Checks: We recommend using Aadhaar as the preferred document, as it serves as an ID, Photo, and Address Proof all in one, and is available with all Indian citizens.",
        ],
      },
      {
        id: "benefits-of-moving-from-physical-to-digital-verification",
        h: "Benefits of Moving from Physical to Digital Verification",
        paras: [
          "Faster & Safer Closures: Non-contact option that cuts dependency on site visits and reduces turnaround time drastically.",
        ],
      },
      {
        id: "problems-eliminated-by-digital-verification",
        h: "Problems Eliminated by Digital Verification",
        paras: [
          "Denied entry to housing units — no one is aware of the verification agent",
          "Candidate is at work or not available while the verification agent is at the location",
          "Interior locations which may be unserviceable (Tehsils, Chauls, Villages, Remote Areas)",
          "Agent asking for a service fee which is non-payable / unprofessional behavior",
          "Agent asking for payment or conducting verification through WhatsApp without visiting",
          "Safety concerns for field agents in unfamiliar or high-risk areas",
        ],
      },
      {
        id: "industry-wide-digital-adoption",
        h: "Industry-Wide Digital Adoption",
        paras: [
          "Telecom Industry: Eliminating Physical Verification (Government Initiative) — India is revolutionizing the telecom sector by eliminating physical verification processes for SIM cards. This digital transformation aligns with the Digital India initiative and enhances customer convenience while maintaining security standards.",
          "Passport Services: No More Physical Police Verification (Police Department) — The government has moved passport verification to digital and online methods, eliminating the need for physical police verification. This reduces processing time and improves citizen experience.",
        ],
      },
      {
        id: "regulatory-framework-compliance",
        h: "Regulatory Framework & Compliance",
        paras: [
          "UIDAI Accepted Document Formats: As per UIDAI guidelines, all these document formats are now applicable as address proof, ensuring standardization across industries including insurance, banking, and telecom sectors.",
          "RBI Guidelines: Self-Declaration Option — According to Reserve Bank of India (RBI) guidelines, self-declaration is also an accepted option for address verification, further simplifying the KYC process while maintaining compliance.",
        ],
      },
      {
        id: "the-future-is-digital",
        h: "The Future is Digital",
        paras: [
          "The shift from physical to digital address verification represents a major leap forward in background verification services. By leveraging document verification and GPS technology, we're not only improving efficiency and reducing turnaround time, but also ensuring better privacy, security, and compliance with evolving regulations.",
          "HelloVerify remains committed to innovation and bringing you the latest digital solutions that align with the Digital India initiative while respecting privacy laws and regulatory requirements.",
        ],
      },
    ],
  },
  {
    slug: "fir-check-api",
    title: "New Check Addition: Police FIR Check — FIR Details API",
    standfirst:
      "Introducing our advanced FIR Details API that provides structured access to FIR data across 15,000+ police stations covering 3+ crore records.",
    date: "2025-10-24",
    readMins: 5,
    category: "Product Updates",
    author: { name: "HelloVerify", role: "Verification operations", img: "/img/21-portrait-ramesh.jpg" },
    sections: [
      {
        id: "overview",
        h: "Overview",
        paras: [
          "The FIR Details API provides structured access to FIR data published across state police portals (CCTNS). With intelligent extraction, enrichment, and translation, the API transforms scattered FIR PDFs and public records into actionable, searchable information.",
        ],
      },
      {
        id: "key-features",
        h: "Key Features",
        paras: [
          "Confidence Level Matching: Search results ranked and segregated by confidence levels based on input parameter matching.",
          "English Translation: Converts regional language FIR data into English for seamless consumption.",
          "Advanced PDF Extraction: Extracts and normalizes FIR details such as DOB, address, vehicle number, relatives' names, and contact details.",
          "Fuzzy & Phonetic Search: Proprietary algorithms support fuzzy matching, phonetic variations, and gender-specific name recognition.",
          "Risk Analysis Engine: Segments results by risk level based on offense nature and acts / sections classification.",
        ],
      },
      {
        id: "fir-data-stats",
        h: "FIR Data Stats",
        paras: [
          "Police Stations Covered: 15,000+ (frequently refreshed); Records Extracted: 3+ crore (from 15+ states); Enriched Fields: Multiple (address, relatives, DOB, vehicle, contact); Vehicle Data: 30+ lakh (vehicle numbers extracted); Acts Analyzed: 50+ (categorized for risk analysis); Coverage: 70%+ (of states, expanding rapidly).",
        ],
      },
      {
        id: "live-coverage",
        h: "Live Coverage",
        paras: [
          "Live States: Goa, Meghalaya, Telangana, Bihar, Karnataka, Delhi, Maharashtra, Madhya Pradesh, Rajasthan, Himachal Pradesh, Chhattisgarh, Andhra Pradesh, Tamil Nadu, Uttar Pradesh, Punjab, Puducherry, Kerala, Assam, Chandigarh, Gujarat, Odisha.",
          "In Migration Pipeline: Final Testing — Go Live Q4'25 / Q1'26",
          "Manipur, Arunachal Pradesh, Nagaland, Sikkim, Tripura, Jharkhand, West Bengal, Haryana, Uttarakhand.",
        ],
      },
      {
        id: "how-fir-data-differs-from-court-records",
        h: "How FIR Data Differs from Court Records",
        paras: [
          "FIR will give an initial assessment and signs of any issue that may have arisen. Court records only happen once a case is filed, and there may be a lag in time period.",
          "An FIR is also only filed after an initial investigation, thus is a key and vital component in the background check process alongside court records.",
          "Stage of Proceedings: FIRs: Initial report filed at the police station when a cognizable offense is reported. It indicates allegations and early warning signals. Court Records: Contain proceedings after police investigation, charge sheet filing, and judicial hearings.",
          "Data Richness: FIRs: Rich in personal identifiers (address, relatives, DOB, contact info, issue at hand). Court Records: Structured around case status, hearings, judgments, and orders — fewer personal details.",
        ],
        quote:
          "Together, FIR + Court records provide a 360° view: from allegation → investigation → trial → judgment.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

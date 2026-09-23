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
import type { ReactNode } from "react";

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
   *  `/platform/coverage` — the shape `chrome.footer.links` uses, a label per
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
      "/governments/health": {
        tag: "Health authorities",
        from: "medical credentials",
        h: "Health",
        p: "Every nurse and doctor's degree, licence and history — confirmed with the issuing council before they touch a patient.",
      },
      "/governments/immigration": {
        tag: "Immigration authorities",
        from: "visas & permits",
        h: "Immigration",
        p: "Applicant documents screened at the source, in the country that issued them — before the stamp.",
      },
      "/governments/manpower-education": {
        tag: "Manpower & education",
        from: "work passes",
        h: "Manpower & education",
        p: "Foreign-worker credentials verified for work-pass decisions — the workflow running with Singapore's Ministry of Manpower.",
      },
      "/governments/trade": {
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

  /** `/governments/health` — Template 3 via `components/templates/VerticalPage`.
   *
   *  THE FOUR VERTICAL PAGES ALL HAVE THIS SHAPE, and the split between what is
   *  here and what stays in the page is the one `business/enterprise/page.tsx`
   *  made: the dictionary holds a record per lane, per pill, per row, per step
   *  and per question, keyed; the page holds WHICH of them, in WHAT ORDER, and
   *  the `fast` flag, which is a CSS class and not a word. A lane or a pill
   *  added without copy is TS2322 on that page's array, in every locale at
   *  once. `rows`' `nm` is also the rendered `key=` and `lanes`' `gt` and
   *  `pills`' `n` are too (see `VerticalPage`), so the third corollary applies
   *  to 3 + 12 + 6 strings on each page; `tools/test/copy.test.ts` §13 pins
   *  them against the pre-migration literals. */
  health: {
    crumb: "Health authorities",
    eyebrow: "Governments · Health authorities",
    h1: (<>No one practises <em>on an unchecked degree.</em></>),
    sub: "Medical degrees, council registrations, licences and practice history — confirmed with the university and the council that issued them, in the country they were issued in.",
    secondary: "See turnaround times",
    strip: {
      countries: (<><b>120+</b> countries of qualifications</>),
      degree: (<><b>3 days</b> degree at the registrar</>),
      checks: (<><b>20M+</b> checks at the primary source</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR</>),
    },
    verifyHead: "What does a health authority verify before licensing a clinician?",
    verifyLede: "A health authority verifies three things about a clinician: identity, qualification and standing. Identity, criminal and watchlist checks return in 15 to 30 minutes; council registration takes two days at the medical council and a medical degree three days at the university registrar.",
    lanes: {
      identity: { gt: "01 — Identity", gh: "Who they are" },
      qualification: { gt: "02 — Qualification", gh: "What they trained in" },
      standing: { gt: "03 — Standing", gh: "Whether they may practise" },
    },
    pills: {
      identity: { n: "Identity", t: "15 min" },
      passport: { n: "Passport", t: "15 min" },
      age: { n: "Age", t: "15 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      medicalDegree: { n: "Medical degree", t: "3 days" },
      postGraduate: { n: "Post-graduate specialty", t: "3 days" },
      councilRegistration: { n: "Council registration", t: "2 days" },
      internship: { n: "Internship completion", t: "3 days" },
      globalDatabase: { n: "Global database", t: "15 min" },
      criminal: { n: "Criminal", t: "30 min" },
      employmentHistory: { n: "Employment history", t: "2 days" },
      disciplinary: { n: "Disciplinary record", t: "3 days" },
    },
    stepsHead: "How does a health authority verify applicant documents?",
    stepsLede: "A health authority verifies clinician documents in four steps: the applicant photographs them on a phone and consents, HelloVerify AI locates the issuing institution in about a second, the university registrar and medical council confirm directly, and one dated file per applicant follows.",
    steps: {
      submit: { n: "01 · The applicant", t: "Submit", p: "Documents photographed on a phone, consent captured, quality checked before upload." },
      read: { n: "02 · HelloVerify AI", t: "Read", p: "Every field extracted and the issuing institution identified — in about a second." },
      confirm: { n: "03 · The institution", t: "Confirm", p: "The university registrar and the medical council confirm directly. Not a database that resembles them." },
      decide: { n: "04 · The authority", t: "Decide", p: "One file per applicant, each result carrying its source and date, ready for the licensing decision." },
    },
    tableHead: "How long does clinician verification take?",
    tableLede: "Clinician verification takes 15 minutes for identity and a global database screen, 30 minutes for a criminal record, two days for council registration, and three days for a medical degree at the university registrar or a disciplinary record on the council's register.",
    rows: {
      identity: { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", src: "issuing registry" },
      criminal: { nm: "Criminal record", sub: "court & police databases", tm: "30 min", src: "court records" },
      globalDatabase: { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", src: "global databases" },
      councilRegistration: { nm: "Council registration", sub: "licence number, status, expiry", tm: "2 days", src: "the medical council" },
      medicalDegree: { nm: "Medical degree", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
      disciplinary: { nm: "Disciplinary record", sub: "sanctions, suspensions, conditions", tm: "3 days", src: "the council's register" },
    },
    /** A FUNCTION leaf taking the anchor — the shape `./index` describes for a
     *  sentence wrapping something the component owns. A plain string would
     *  have had to END IN A SPACE to keep the byte, which
     *  `tools/test/copy.test.ts` §3 rejects. */
    note: (link: ReactNode) => (
      <>Times shown are from submission to result · qualifications verified in the country of issue — see {link}</>
    ),
    complianceHead: "How is clinician data protected during verification?",
    complianceLede: "Health records are the most sensitive data a person has, so clinician verification runs under independently audited ISO 27001 certification and GDPR-aligned handling: consent captured per applicant, bounded retention, and every access logged. HelloVerify is a PBSA member.",
    faqHead: (<>From licensing<br />boards.</>),
    faqs: {
      abroad: {
        q: "Can you verify qualifications earned abroad?",
        a: "Yes — that's the common case. A nurse trained in Manila and applying in Abu Dhabi has her degree confirmed with the Philippine institution that issued it, by our team in that country. 120+ countries are reachable through the same pipeline.",
      },
      offline: {
        q: "What if the issuing institution is slow or offline?",
        a: "The file shows the request as pending with a date and the route being used — courier, in-person, or official channel — rather than silently stalling. Authorities see exactly where each applicant stands.",
      },
      forgery: {
        q: "Do you detect forged medical degrees?",
        a: "Document forensics run first — template, fonts, security features — but a clean forgery still fails the source check, because the registrar simply has no record of the graduate. That's the point of verifying at the source.",
      },
      volume: {
        q: "Can this run at national volume?",
        a: "Yes. The pipeline is parallel, so a licensing round of ten thousand applicants runs at the same per-file speed as one. Six offices across twelve time zones keep the queue moving overnight.",
      },
    },
    closing: {
      heading: (<>Every licence you issue, <em>backed by proof.</em></>),
      sub: "Tell us the licensing round and the volume. We'll scope a pilot.",
    },
  },

  /** `/governments/immigration`. */
  immigration: {
    crumb: "Immigration authorities",
    eyebrow: "Governments · Immigration authorities",
    h1: (<>Check the document <em>where it was issued.</em></>),
    sub: "A visa decision rests on papers from somewhere else. We verify them in the country that issued them — with the registry, the university, the employer — before the stamp.",
    secondary: "See turnaround times",
    strip: {
      countries: (<><b>120+</b> countries, checked in-country</>),
      /** A JSX leaf keeps `&amp;` EXACTLY as written — the opposite of the
       *  string rule above, because here the entity is decoded by the same JSX
       *  pass that decoded it in the page. Copying the original markup
       *  verbatim is the correct move. */
      screen: (<><b>15 min</b> identity &amp; watchlist screen</>),
      offices: (<><b>6</b> offices across twelve hours</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR</>),
    },
    verifyHead: "What does an immigration authority verify about a visa applicant?",
    verifyLede: "An immigration authority verifies three things about a visa applicant: identity, the grounds they qualify on, and what the record says. Identity, watchlist and credit screens return in 15 minutes; education, employment and trade licences are confirmed abroad in two or three days.",
    lanes: {
      identity: { gt: "01 — Identity", gh: "Who is applying" },
      grounds: { gt: "02 — Grounds", gh: "Why they qualify" },
      admissibility: { gt: "03 — Admissibility", gh: "What the record says" },
    },
    pills: {
      identity: { n: "Identity", t: "15 min" },
      passport: { n: "Passport", t: "15 min" },
      age: { n: "Age", t: "15 min" },
      face: { n: "Face vs. selfie", t: "seconds" },
      education: { n: "Education", t: "3 days" },
      employment: { n: "Employment", t: "2 days" },
      digitalEmployment: { n: "Digital employment", t: "60 min" },
      entitlementToWork: { n: "Entitlement to work", t: "60 min" },
      tradeLicence: { n: "Trade licence", t: "2 days" },
      globalDatabase: { n: "Global database", t: "15 min" },
      criminal: { n: "Criminal", t: "30 min" },
      credit: { n: "Credit", t: "15 min" },
      currentAddress: { n: "Current address", t: "30 min" },
    },
    stepsHead: "How are a visa applicant's documents verified in the country that issued them?",
    stepsLede: "A visa applicant submits documents through a one-time link on any phone, with consent. HelloVerify AI runs forgery checks and returns identity and watchlist screens in minutes, then a HelloVerify team in the issuing country confirms each record with the registrar or employer holding it.",
    steps: {
      submit: { n: "01 · The applicant", t: "Submit", p: "A one-time link, consent, and photographs of the documents — no appointment, no courier." },
      screen: { n: "02 · HelloVerify AI", t: "Screen", p: "Fields extracted, forgery checks run, identity and watchlist screens returned in minutes." },
      confirm: { n: "03 · In-country", t: "Confirm", p: "Our team in the issuing country confirms with the registrar, employer or authority that holds the record." },
      decide: { n: "04 · The authority", t: "Decide", p: "A single file per applicant — each result with its source, date and evidence attached." },
    },
    tableHead: "How long does visa applicant verification take?",
    tableLede: "Visa applicant verification returns identity, passport and global database screens in 15 minutes and a criminal record in 30. Digital employment, confirmed from provident-fund records, takes 60 minutes; employment two days at the employer's HR; education three days at the university registrar.",
    rows: {
      identity: { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", src: "issuing registry" },
      globalDatabase: { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", src: "global databases" },
      criminal: { nm: "Criminal record", sub: "court & police databases", tm: "30 min", src: "court records" },
      digitalEmployment: { nm: "Digital employment", sub: "contribution-backed work history", tm: "60 min", src: "provident fund records" },
      employment: { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
      education: { nm: "Education", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
    },
    note: (link: ReactNode) => (
      <>Times shown are from submission to result · documents verified in the country of issue — see {link}</>
    ),
    complianceHead: "How is cross-border applicant data handled lawfully?",
    complianceLede: "Cross-border verification means cross-border data, so HelloVerify captures consent per applicant, documents every transfer, and bounds retention in the data processing agreement. Handling is GDPR-aligned and security management is ISO 27001 certified, independently audited. HelloVerify is also a PBSA member.",
    faqHead: (<>From immigration<br />departments.</>),
    faqs: {
      noPresence: {
        q: "How do you verify a document from a country we have no presence in?",
        a: "Six offices and a partner network reach 120+ countries. The check is executed in the issuing country by people who know that registry's process — an Egyptian trade licence is confirmed in Cairo, not inferred from a scan.",
      },
      remote: {
        q: "Can applicants submit without travelling to a centre?",
        a: "Yes. A one-time link works on any phone — consent, capture and quality checks happen in the applicant's hand, wherever they are.",
      },
      file: {
        q: "What does the authority actually receive?",
        a: "One file per applicant: every check, its result, the source that confirmed it, the date, and the supporting evidence. It is built to be defended in an appeal, not just read.",
      },
      integration: {
        q: "Does this integrate with our case management system?",
        a: "Yes — REST API and webhooks push results into an existing case file, or officers can work from the HelloVerify console. Bulk submission handles seasonal application waves.",
      },
    },
    closing: {
      heading: (<>Decide on evidence, <em>not on paperwork.</em></>),
      sub: "Tell us the visa categories and the volume. We'll scope a pilot.",
    },
  },

  /** `/governments/manpower-education`. */
  manpowerEducation: {
    crumb: "Manpower & education",
    eyebrow: "Governments · Manpower & education",
    h1: (<>Work passes, issued <em>on verified facts.</em></>),
    sub: "Foreign workers arrive with credentials from everywhere. We confirm each one with the institution that issued it — the workflow already running with Singapore's Ministry of Manpower.",
    secondary: "Read the Ministry of Manpower story",
    strip: {
      mom: (<><b>Ministry of Manpower</b> · Singapore</>),
      countries: (<><b>120+</b> countries of credentials</>),
      degree: (<><b>3 days</b> degree at the registrar</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR · PBSA</>),
    },
    verifyHead: "What does a manpower ministry verify before issuing a work pass?",
    verifyLede: "Before issuing a work pass, a ministry verifies identity, credentials and records. Identity and a global database screen take 15 minutes, a criminal record 30; employment is confirmed with the employer in two days, education or trade certification with the issuing institution in three.",
    lanes: {
      identity: { gt: "01 — Identity", gh: "Who arrived" },
      credentials: { gt: "02 — Credentials", gh: "What they can do" },
      records: { gt: "03 — Records", gh: "What's on file" },
    },
    pills: {
      identity: { n: "Identity", t: "15 min" },
      passport: { n: "Passport", t: "15 min" },
      age: { n: "Age", t: "15 min" },
      entitlementToWork: { n: "Entitlement to work", t: "60 min" },
      education: { n: "Education", t: "3 days" },
      tradeCertification: { n: "Trade certification", t: "3 days" },
      employment: { n: "Employment", t: "2 days" },
      digitalEmployment: { n: "Digital employment", t: "60 min" },
      moonlighting: { n: "Moonlighting", t: "60 min" },
      criminal: { n: "Criminal", t: "30 min" },
      globalDatabase: { n: "Global database", t: "15 min" },
      currentAddress: { n: "Current address", t: "30 min" },
    },
    stepsHead: "How does work-pass verification run at ministry scale?",
    stepsLede: "Work-pass verification captures documents in the worker's origin country before travel, with consent. HelloVerify AI locates the issuing institution, the registrar, board or employer confirms in-country, and results land in the ministry's work-pass workflow with exceptions flagged for an officer.",
    steps: {
      submit: { n: "01 · The worker", t: "Submit", p: "Documents captured on a phone in the origin country, with consent, before travel." },
      read: { n: "02 · HelloVerify AI", t: "Read", p: "Fields extracted, forgery checks run, the issuing institution located automatically." },
      confirm: { n: "03 · The institution", t: "Confirm", p: "The registrar, board or employer confirms directly — in the country that holds the record." },
      decide: { n: "04 · The ministry", t: "Decide", p: "Results land in the work-pass workflow, with exceptions flagged for an officer to judge." },
    },
    tableHead: "How long does work-pass credential verification take?",
    tableLede: "Work-pass credential verification returns identity in 15 minutes, a criminal record in 30, and digital employment from provident-fund records in 60. Employment is confirmed with the employer's HR in two days; education and trade certification with the issuing institution in three.",
    rows: {
      identity: { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", src: "issuing registry" },
      criminal: { nm: "Criminal record", sub: "court & police databases", tm: "30 min", src: "court records" },
      entitlementToWork: { nm: "Entitlement to work", sub: "permit status and conditions", tm: "60 min", src: "labour records" },
      digitalEmployment: { nm: "Digital employment", sub: "contribution-backed work history", tm: "60 min", src: "provident fund records" },
      employment: { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
      education: { nm: "Education & trade certification", sub: "qualification, year, institution", tm: "3 days", src: "the issuing institution" },
    },
    note: (link: ReactNode) => (
      <>Times shown are from submission to result · credentials verified in the country of issue — see {link}</>
    ),
    complianceHead: "How is foreign worker data protected in a ministry workflow?",
    complianceLede: "Worker data crosses borders before the worker does, so HelloVerify captures consent in the origin country, documents each transfer, and bounds retention. Security management is ISO 27001 certified and independently audited, handling is GDPR-aligned, and HelloVerify is a PBSA member.",
    faqHead: (<>From manpower<br />ministries.</>),
    faqs: {
      mom: {
        q: "What exactly runs with Singapore's Ministry of Manpower?",
        a: "Credential verification supporting work-pass decisions: foreign qualifications and employment history confirmed with the issuing institutions abroad, returned into the ministry's workflow. The case study page covers the shape of it.",
      },
      beforeTravel: {
        q: "Can workers be verified before they travel?",
        a: "That's the design. Capture happens in the origin country on the worker's own phone, so a failed credential surfaces before a flight is booked rather than at a counter after arrival.",
      },
      diplomaMills: {
        q: "How do you handle diploma mills and fake institutions?",
        a: "An institution that cannot be located in the national register of recognised bodies is flagged as unrecognised rather than silently passed. The file distinguishes 'not verified' from 'verified as false' — they are different decisions.",
      },
      volume: {
        q: "What volume can this absorb?",
        a: "Checks run in parallel, so a seasonal intake of tens of thousands moves at the same per-file speed as a single application. Six offices twelve hours apart mean a file submitted at night in Manila is worked on before morning in Singapore.",
      },
    },
    closing: {
      heading: (<>Issue the pass. <em>Keep the proof.</em></>),
      sub: "Tell us the pass categories and intake volume. We'll scope a pilot.",
    },
  },

  /** `/governments/trade`. */
  trade: {
    crumb: "Trade & business",
    eyebrow: "Governments · Trade & business authorities",
    h1: (<>Licence the business. <em>Know the people.</em></>),
    sub: "A company is a filing and a group of humans. Before a trade licence is granted or renewed, we confirm both — at the registry that holds the record, not the applicant's letterhead.",
    secondary: "See turnaround times",
    strip: {
      profile: (<><b>2 days</b> to a certified entity profile</>),
      countries: (<><b>120+</b> countries of company records</>),
      checks: (<><b>20M+</b> checks at the primary source</>),
      certs: (<><span className="dot" /> ISO 27001 · GDPR</>),
    },
    verifyHead: "What does a licensing authority verify about a business?",
    verifyLede: "A licensing authority verifies the entity, the people behind it and the risk on record. Credit, identity and watchlist screens return in 15 minutes, a criminal record in 30; trade licence, company registration, defaulting directors and financial assessment each take two days.",
    lanes: {
      entity: { gt: "01 — The entity", gh: "What is filed" },
      people: { gt: "02 — The people", gh: "Who stands behind it" },
      risk: { gt: "03 — Risk", gh: "What the record says" },
    },
    pills: {
      tradeLicence: { n: "Trade licence", t: "2 days" },
      companyRegistration: { n: "Company registration", t: "2 days" },
      directorsGst: { n: "Directors & GST", t: "3 days" },
      credit: { n: "Credit", t: "15 min" },
      identity: { n: "Identity", t: "15 min" },
      criminal: { n: "Criminal", t: "30 min" },
      defaultingDirectors: { n: "Defaulting directors", t: "2 days" },
      promoterCriminal: { n: "Promoter criminal history", t: "2 days" },
      globalDatabase: { n: "Global database", t: "15 min" },
      financialAssessment: { n: "Financial assessment", t: "2 days" },
      gstScreening: { n: "GST screening", t: "2 days" },
    },
    stepsHead: "How does a licensing authority verify a company and its directors?",
    stepsLede: "Company documents and director identities arrive through a link or the authority's portal. HelloVerify AI parses the filings and resolves registration numbers, then licence registers, company registries, courts and credit bureaus each confirm the facts they hold. The authority receives a certified entity profile.",
    steps: {
      file: { n: "01 · The applicant", t: "File", p: "Company documents and director identities submitted through a link or your own portal." },
      read: { n: "02 · HelloVerify AI", t: "Read", p: "Filings parsed, registration numbers resolved, the holding registry identified automatically." },
      confirm: { n: "03 · The registries", t: "Confirm", p: "Licence registers, company registries, courts and credit bureaus — each fact checked where it is filed." },
      decide: { n: "04 · The authority", t: "Decide", p: "A certified entity profile with sources, dates, and renewal reminders before anything goes stale." },
    },
    tableHead: "How long does business and trade licence verification take?",
    tableLede: "Business verification returns credit and global database screens in 15 minutes and a director or promoter criminal record in 30 minutes. Two days confirm a trade licence at the licence register and a financial assessment from tax and filing records.",
    rows: {
      credit: { nm: "Credit screen", sub: "ratings, defaults, exposure", tm: "15 min", src: "credit bureaus" },
      globalDatabase: { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", src: "global databases" },
      criminal: { nm: "Criminal record", sub: "directors and promoters", tm: "30 min", src: "court records" },
      tradeLicence: { nm: "Trade licence", sub: "number, status, validity", tm: "2 days", src: "the licence register" },
      financialAssessment: { nm: "Financial assessment", sub: "filings, GST behaviour, solvency", tm: "2 days", src: "tax & filing records" },
      directorsGst: { nm: "Directors & GST", sub: "beneficial owners, disqualifications", tm: "3 days", src: "the company registry" },
    },
    note: (link: ReactNode) => (
      <>Times shown are from filing to result · company records verified in the country of registration — see {link}</>
    ),
    complianceHead: "Does a verification profile hold up on appeal?",
    complianceLede: "A licensing refusal can be appealed, so every fact in a HelloVerify entity profile carries its source, its date and the artefact behind it. Security management is ISO 27001 certified and independently audited, handling is GDPR-aligned, and HelloVerify is a PBSA member.",
    faqHead: (<>From licensing<br />authorities.</>),
    faqs: {
      parents: {
        q: "Can you verify foreign parent companies?",
        a: "Yes — a local subsidiary's foreign parent is checked in its own country of registration, through the same pipeline that covers 120+ countries. Cross-border ownership chains are shown as a chain, not a footnote.",
      },
      renewals: {
        q: "How do you handle renewals?",
        a: "Every certified profile carries expiry dates for each underlying fact. Renewals re-run automatically before a licence, rating or director record goes stale, so enforcement isn't working from last year's picture.",
      },
      conflicts: {
        q: "What happens when registries disagree?",
        a: "The profile shows both records and flags the conflict for an officer rather than picking a winner. Reconciling contradictory filings is a judgement the authority makes, not a vendor.",
      },
      book: {
        q: "Can this run across our whole licence book?",
        a: "Yes. Batch runs process an entire register in parallel — thousands of entities in days — which is how authorities move from application-time checks to continuous oversight.",
      },
    },
    closing: {
      heading: (<>Grant the licence. <em>Keep the file.</em></>),
      sub: "Tell us the licence categories and register size. We'll scope a pilot.",
    },
  },

  /** `/governments/manpower-education/ministry-of-manpower` — the case study,
   *  the single strongest proof artefact for the government buyer (IA §4.1).
   *  Real facts only; nothing here is a figure awaiting sign-off. */
  mom: {
    crumb: "Ministry of Manpower",

    closing: {
      heading: (<>Your ministry, <em>next.</em></>),
      sub: "Tell us the pass categories and intake volume. We'll scope a pilot.",
    },

    hero: {
      k: "Case study · Singapore",
      h1: (
        <>
          A ministry's standard, <em>at a ministry's scale.</em>
        </>
      ),
      sub:
        "Singapore's Ministry of Manpower decides who may work in the country. That decision " +
        "rests on credentials issued thousands of kilometres away — which is exactly the " +
        "problem primary-source verification exists to solve.",
    },

    strip: {
      passes: (<><b>Work passes</b> credential verification</>),
      countries: (<><b>120+</b> countries of qualifications</>),
      before: (<><b>Before</b> arrival, not after</>),
      live: (<><span className="dot" /> in production</>),
    },

    /** The company's own position, rendered in a `<p className="q">`. It was a
     *  `<blockquote>` attributed to an invented "Verification programme lead"
     *  until that attribution was withdrawn; the words stayed. Copy either
     *  way — one route, gated by nothing. */
    quote: "The credential either exists at the institution that issued it, or it doesn't. Everything else is opinion.",

    /** The three `.s` stats. `v` is RICH TEXT in all three — `120<em>+</em>`,
     *  `3 <em>days</em>`, `Before <em>arrival</em>` — so one leaf each rather
     *  than a number and a word, for the adjacent-text-children reason the
     *  strips give. `l` is the caption under it. These three are sourced and
     *  stay, which is why this page is not gated the way `CustomerStory` is. */
    stats: {
      countries: {
        v: (<>120<em>+</em></>),
        l: "countries where a qualification can be confirmed with its issuing institution",
      },
      days: {
        v: (<>3 <em>days</em></>),
        l: "typical time to a registrar-confirmed degree, anywhere in that network",
      },
      before: {
        v: (<>Before <em>arrival</em></>),
        l: "when a failed credential surfaces — not at a counter after a flight",
      },
    },

    /** Both `sec-head` blocks on this page were headings with NO lede — one of
     *  the 21 shapes `chrome/SecHead.tsx` deliberately does not own — so the
     *  page writes the markup itself and a `.lede` was added in Part 8 to give
     *  the answer somewhere to live (§11a.2). Three leaves each, the same
     *  k/h/lede the `SecHead` bands elsewhere have. */
    problem: {
      k: "The problem",
      h: "Why does a work-pass decision need primary-source verification?",
      lede:
        "A work-pass decision rests on credentials issued thousands of kilometres away. " +
        "Accepting one in error puts an unqualified person into a regulated job; rejecting " +
        "one in error keeps a qualified person out and invites an appeal the ministry must " +
        "defend with evidence.",
    },

    /** The prose block. Four `<p>`s, three `<h3>`s and one `.aside`. The aside
     *  is the only rich-text leaf — three `<br />`s carrying a bulleted list
     *  the markup makes out of line breaks — and it is moved as JSX so the
     *  breaks travel with the words. */
    prose: {
      claims:
        "A work-pass application arrives with a degree from one country, an employment record " +
        "from another, and an identity document from a third. Each is a claim. Traditionally " +
        "each is checked against a database that aggregates such claims — which verifies that " +
        "somebody once typed it in, not that it is true.",
      gap:
        "For a ministry, that gap matters twice. A credential accepted in error puts an " +
        "unqualified person into a regulated job. A credential rejected in error keeps a " +
        "qualified person out of the country, and invites an appeal the authority must defend " +
        "with evidence it may not have.",
      changedH: "What changed",
      changed:
        "Every qualification is confirmed with the institution that issued it, by people in the " +
        "country where that institution sits. A Philippine nursing degree is confirmed with the " +
        "Philippine school's registrar. An Indian diploma is confirmed with the Indian board. " +
        "The answer that comes back isn't a probability — it's a registrar saying yes or no, " +
        "with a date attached.",
      outcomes: (
        <>
          The file distinguishes three outcomes that are usually collapsed into one:
          <br />· verified — the institution confirmed the record
          <br />· not verified — the institution has no such record
          <br />· unverifiable — the institution could not be reached, and by which route
        </>
      ),
      thirdState:
        "That third state is the one authorities care about most, because it is the one that " +
        "gets silently reported as a pass by systems built to return a binary.",
      runsH: "How it runs",
      capture:
        "Capture happens in the origin country, on the worker's own phone, before travel — with " +
        "consent recorded at the point of capture. AI reads the document and locates the issuing " +
        "institution in about a second. The confirmation request goes out through the local team, " +
        "and results return into the ministry's work-pass workflow, where officers see the " +
        "exceptions rather than the thousands of clean files.",
      offices:
        "Six offices spread across twelve hours of time zones mean a submission made at night in " +
        "Manila is being worked before the morning shift starts in Singapore — which is how the " +
        "turnaround stays measured in days rather than weeks at national volume.",
      holdsH: "Why it holds up",
      holds:
        "Every result in the file carries its source, the date it was confirmed and the artefact " +
        "behind it. When a refusal is appealed, the authority is not defending a score from a " +
        "vendor's model — it is presenting a registrar's answer. That is a materially different " +
        "conversation.",
    },

    gets: {
      k: "What a ministry gets",
      h: "What does a ministry get from primary-source credential verification?",
      lede:
        "A ministry gets four things in the contract: each credential confirmed with its " +
        "issuing institution, named and dated; unverifiable reported as unverifiable with " +
        "the route tried; parallel processing and twelve hours of office coverage holding " +
        "turnaround at intake volume; and an auditable trail per applicant.",
    },

    steps: {
      proof: { n: "01", t: "Source proof", p: "Each credential confirmed with its issuing institution, named and dated in the file." },
      gaps: { n: "02", t: "Honest gaps", p: "Unverifiable is reported as unverifiable, with the route tried — never quietly passed." },
      scale: { n: "03", t: "Scale", p: "Parallel processing and twelve hours of office coverage hold turnaround at intake volume." },
      appeal: { n: "04", t: "Appeal-ready", p: "An auditable trail per applicant, built to be defended rather than merely read." },
    },

    verification: "Manpower & education verification",
    artefacts: "Procurement & compliance artefacts",
  },
};

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
 *  the six pre-migration files; this file holds 475 leaves. A 2.3x undercount,
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
import type { ReactNode } from "react";

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
      "/business/enterprise": {
        tag: "Enterprise",
        from: "2,000+ clients",
        h: "Enterprise BGV",
        p: "High-volume hiring with an SLA. API, bulk upload, and a team that answers.",
      },
      "/business/smb": {
        tag: "Small & medium business",
        from: "from 30 min",
        h: "SMB packages",
        p: "Pick a package, upload documents, get answers. Public pricing, no sales call needed.",
      },
      "/business/employee-verification": {
        tag: "HR & operations",
        from: "60 min",
        h: "Employee verification",
        p: "Existing staff, contractors and gig workforces — verified and re-verified.",
      },
      "/business/customer-kyc": {
        tag: "Trust & safety",
        from: "at signup",
        h: "Customer KYC",
        p: "Verify customers the moment they sign up, before they can do harm.",
      },
      "/business/certifier": {
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

  /** `/business/enterprise` — Template 3, the workhorse. */
  enterprise: {
    crumb: "Enterprise BGV",
    closing: {
      heading: (
        <>
          Four hundred riders a week? <em>Before lunch.</em>
        </>
      ),
      sub: "Tell us your volume and your roles. You'll have a pilot running this week.",
    },
    hero: {
      k: "Business · Enterprise BGV",
      h1: (
        <>
          Verification that keeps up <em>with hiring.</em>
        </>
      ),
      sub:
        "High-volume background checks with an SLA. AI reads every document, our team " +
        "confirms with the issuer, and your ATS gets the answer back — from 15 minutes.",
      cta: "Talk to sales",
      turnaround: "See turnaround times",
    },
    strip: {
      clients: (<><b>2,000+</b> enterprise clients</>),
      checks: (<><b>20M+</b> checks, every one at the source</>),
      riders: (<><b>1,600+</b> riders verified a month, one client</>),
      certs: (<><span className="dot" /> ISO 27001 · PBSA</>),
    },
    verify: {
      k: "What we verify",
      h: "What does an enterprise background check include?",
      lede:
        "HelloVerify's enterprise catalogue runs 33 checks against three questions: who the " +
        "candidate is, what they have done, and what is on file. Identity answers in 15 " +
        "minutes, criminal records in 30, digital employment in 60; education takes three " +
        "days at the registrar.",
    },
    /** The three `.lanes3` groups. `lanes` and `pills` are separate tables
     *  keyed differently on purpose, the same split `chrome.footer` makes
     *  between `cols` and `links`: a lane has an id, a pill has a name that
     *  several lanes and several pages would otherwise repeat. */
    lanes: {
      identity: { gt: "01 — Identity", gh: "Who they are" },
      work: { gt: "02 — Work & education", gh: "What they've done" },
      records: { gt: "03 — Records & risk", gh: "What's on file" },
    },
    /** The 17 pills. `fast` stays in the page: it is a CSS class, not a word.
     *  `n` is still `Lanes`' `key=`, and still the same English string. */
    pills: {
      identity: { n: "Identity", t: "15 min" },
      pan: { n: "PAN", t: "15 min" },
      passport: { n: "Passport", t: "15 min" },
      age: { n: "Age", t: "15 min" },
      drivingLicence: { n: "Driving licence", t: "30 min" },
      registrationCertificate: { n: "Registration certificate", t: "30 min" },
      digitalEmployment: { n: "Digital employment", t: "60 min" },
      moonlighting: { n: "Moonlighting", t: "60 min" },
      entitlementToWork: { n: "Entitlement to work", t: "60 min" },
      employment: { n: "Employment", t: "2 days" },
      education: { n: "Education", t: "3 days" },
      credit: { n: "Credit", t: "15 min" },
      globalDatabase: { n: "Global database", t: "15 min" },
      criminal: { n: "Criminal", t: "30 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      tradeLicence: { n: "Trade licence", t: "2 days" },
      directorsGst: { n: "Directors & GST", t: "3 days" },
    },
    allChecks: "All 33 checks",
    howItWorks: {
      k: "How it works",
      h: "How does enterprise background verification work?",
      lede:
        "Enterprise verification starts with one upload: the candidate photographs documents " +
        "over WhatsApp or a link, with no app and no account. HelloVerify's AI reads every " +
        "field, the request goes to the issuer, and the report reaches your ATS with each " +
        "source named.",
    },
    steps: {
      upload: {
        n: "01 · Candidate's phone",
        t: "Upload",
        p: "Photograph the document. Edges, glare and focus are checked before the shutter fires.",
      },
      read: {
        n: "02 · HelloVerify AI",
        t: "Read",
        p: "Every field extracted, the document checked against itself, the issuing office located — in about a second.",
      },
      confirm: {
        n: "03 · The source",
        t: "Confirm",
        p: "The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.",
      },
      report: {
        n: "04 · Your ATS",
        t: "Report",
        p: "One report, the source named beside every result, with an auditable trail behind it.",
      },
    },
    turnaroundBand: {
      k: "Turnaround & coverage",
      h: "How long does an enterprise background check take?",
      lede:
        "Enterprise turnaround is measured from upload to report: identity and PAN in 15 " +
        "minutes, driving licence and criminal records in 30, digital employment in 60, " +
        "employment in two days, education in three — across 120+ countries, and stated in " +
        "the contract HelloVerify signs.",
    },
    /** The six `.tbl3` rows. `nm` is `CheckTable`'s `key=` and still resolves
     *  to the same string. `fast` stays in the page with the order. */
    rows: {
      identityPan: {
        nm: "Identity & PAN",
        sub: "name, DOB, number, validity",
        tm: "15 min",
        src: "issuing registry",
      },
      drivingLicence: {
        nm: "Driving licence",
        sub: "class, validity, endorsements",
        tm: "30 min",
        src: "state transport authority",
      },
      criminal: {
        nm: "Criminal record",
        sub: "court & police databases",
        tm: "30 min",
        src: "court records",
      },
      digitalEmployment: {
        nm: "Digital employment",
        sub: "EPFO-backed work history",
        tm: "60 min",
        src: "provident fund records",
      },
      employment: {
        nm: "Employment",
        sub: "role, tenure, exit remarks",
        tm: "2 days",
        src: "the employer's HR",
      },
      education: {
        nm: "Education",
        sub: "degree, year, institution",
        tm: "3 days",
        src: "the university registrar",
      },
    },
    /** A FUNCTION LEAF — the shape `./index` describes for a sentence that
     *  wraps a node the component owns. The anchor's href and its inline style
     *  are routing and layout and stay in the page; a locale may put the link
     *  anywhere in the sentence. Function rather than a plain string because
     *  the string would have to end in a space to keep the byte, and an
     *  edge-whitespace leaf is exactly what `copy.test.ts` §3 rejects. */
    note: (link: ReactNode) => (
      <>
        Times shown are from upload to report · 120+ countries via the same pipeline — see {link}
      </>
    ),
    noteLink: "global coverage",
    compliance: {
      k: "Compliance & security",
      h: "How does HelloVerify handle data protection and compliance?",
      lede:
        "HelloVerify is ISO 27001 certified and independently audited, GDPR-aligned — " +
        "consent, retention limits and the right to be forgotten in every workflow — and a " +
        "member of the PBSA, the screening industry's global standards body. Every check " +
        "begins with consent and leaves an auditable trail.",
    },
    securityInFull: "Security & compliance, in full — DPA, residency, conformance",
    faqHead: (<>Asked before<br />every pilot.</>),
    /** The FAQ copy that was `business/enterprise/content.ts`. That module's
     *  own header called itself "copy for one route" and contrasted itself
     *  with `lib/content/`, "the catalogues several routes read" — which is
     *  the same line this layer draws, so the strings belong here and the
     *  module's remaining job is the ORDER. `lib/seo/schema/faq.ts`'s "exactly
     *  one home" rule is about copies, not about files: still one array, still
     *  one render site, and `FaqSection` still emits the `FAQPage` node from
     *  the same records it renders. */
    faqs: {
      volume: {
        q: "How fast is \"fast\" at real volume?",
        a:
          "The times on this page hold at volume because the pipeline is parallel — a thousand driving licences take about as long as one. Identity-class checks come back in 15–60 minutes; anything that needs a registrar or a court is quoted in days, and the SLA we sign reflects your actual mix of checks.",
      },
      source: {
        q: "What does \"confirmed at the source\" actually mean?",
        a:
          "No proxy databases as the final word. A degree is confirmed with the university registrar, a licence with the issuing authority, employment with the employer or provident-fund records. The report names the source beside every result.",
      },
      submit: {
        q: "How do candidates submit documents?",
        a:
          "Over WhatsApp or a one-time link — no app to install, no account to create. Consent is captured first, and the capture flow checks focus, edges and glare before upload.",
      },
      ats: {
        q: "Can this plug into our ATS?",
        a:
          "Yes — REST API and webhooks, bulk CSV for batch drives, and connectors for common ATS platforms. Results post back automatically; your recruiters never leave their queue.",
      },
      failure: {
        q: "What happens when a check fails?",
        a:
          "The report shows exactly what didn't match and where it was checked, with the evidence attached. Candidates get a dispute path, and re-verification after a correction is free.",
      },
    },
  },

  /** `/business/smb` — Template 4, the page with public pricing. */
  smb: {
    crumb: "SMB packages",
    closing: {
      heading: (
        <>
          Your first hire deserves the <em>same certainty.</em>
        </>
      ),
      sub: "No contract, no minimums. Pay per candidate, answer in minutes.",
      ctaLabel: "Buy a package",
    },
    hero: {
      /** `Business · Small &amp; medium` in the JSX this replaced. An ATTRIBUTE
       *  and a text node are both entity-decoded by JSX, so the string leaf
       *  spells the ampersand plainly either way. */
      k: "Business · Small & medium",
      /** Three children — text, `<br />`, `<em>` — and the newline-plus-indent
       *  between the `<br />` and the `<em>` folds away exactly as it did in
       *  the `<h1>`. */
      h1: (
        <>
          Pick a package.<br />
          <em>See the price.</em>
        </>
      ),
      sub:
        "No sales call, no quote by email. Choose the checks, pay per candidate, and send one " +
        "WhatsApp link — the report comes back the same morning.",
      buy: "Buy a package",
      talkFirst: "Or talk to us first",
    },
    strip: {
      package: (<><b>30 min</b> blue-collar package</>),
      checks: (<><b>20M+</b> checks since 2018</>),
      subscription: (<><b>No</b> subscription, pay per candidate</>),
      invoice: (<><span className="dot" /> GST invoice on every order</>),
    },
    packages: {
      k: "Packages & pricing",
      h: "What background check packages can a small business buy?",
      lede:
        "HelloVerify's SMB packages cover three hiring shapes, priced per candidate: a " +
        "blue-collar hire in 30 minutes, a white-collar hire — education, employment, " +
        "moonlighting and current address — in three days, and a driver package in 30 " +
        "minutes. No subscription, and a GST invoice on every order.",
    },
    /** The three rack cards. `lines` does NOT live here: the checks inside a
     *  package are keys in the page, and their names are the `checks` table
     *  below. Two reasons, both from `./index` — an array leaf derives to
     *  `string[]`, so a locale could ship a five-check blue-collar package and
     *  `tsc` would agree, and the rendered `{p.lines.length} checks · ready in`
     *  would then print a different number than the price was set for. */
    packs: {
      blue: {
        hd0: "Package",
        hd1: "Blue-collar · SMB",
        tt: "Blue-collar hire",
        sub: "Drivers, riders, warehouse, security",
        price: "₹349",
        ready: "30 minutes",
        who: "One upload from the candidate",
      },
      white: {
        hd0: "Package",
        hd1: "White-collar · SMB",
        tt: "White-collar hire",
        sub: "Corporate, tech, finance, healthcare",
        price: "₹999",
        ready: "3 days",
        who: "Registrar-confirmed",
      },
      driver: {
        hd0: "Package",
        hd1: "Consumer · SMB",
        tt: "Driver",
        sub: "For families and small fleets",
        price: "₹499",
        ready: "30 minutes",
        who: "Also on HelloV, without address",
      },
    },
    /** The check names a package line can carry. Eight leaves for eleven
     *  rendered lines, because three names appear in two packages — and the
     *  `key={l}` on each line resolves through this table to the same string
     *  it did before, which is the third corollary of the byte-identity
     *  rule. */
    checks: {
      pan: "PAN card",
      registrationCertificate: "Registration certificate",
      drivingLicence: "Driving licence",
      criminalRecord: "Criminal record",
      education: "Education",
      employment: "Employment",
      moonlighting: "Moonlighting",
      currentAddress: "Current address",
    },
    /** The card frame — one leaf each, rendered three times. Shared rather
     *  than per-card because these are three instances of ONE card shape; a
     *  locale that translated "Per candidate" differently on the driver card
     *  would have a bug, not a choice. `chrome`'s duplicated `logoHome` is
     *  the opposite case and says so: two different controls, two components.
     *
     *  `readyIn` is a function leaf because the count is the page's — it is
     *  `p.lines.length`, and the markup is `{4}{" checks · ready in"}`, two
     *  adjacent text children with React's `<!-- -->` between them. The
     *  function keeps both children and lets a locale put the number
     *  elsewhere in the phrase. */
    card: {
      perCandidate: "Per candidate",
      inclGst: "incl. GST",
      readyIn: (n: ReactNode) => (<>{n} checks · ready in</>),
      buyNow: "Buy now",
    },
    /** Same function-leaf shape as `enterprise.note`, and for the same
     *  reason: the sentence ends in a space before the anchor. */
    pricenote: (link: ReactNode) => (
      <>
        Prices shown are placeholders pending commercial sign-off · every order gets a GST invoice ·
        volume rates from 50 candidates/month — {link}
      </>
    ),
    pricenoteLink: "talk to sales",
    alacarte: {
      k: "À la carte",
      h: "Can I buy a single background check?",
      lede:
        "Any of HelloVerify's 33 checks can be bought on its own inside the app, at the same " +
        "sources and in the same report as a package. Identity and PAN return in 15 minutes, " +
        "criminal and current address in 30, and education in three days.",
    },
    /** The eight `.pl3` chips. Written out longhand in the page (no array),
     *  so these swap one text node each and the chip keeps its three
     *  children. */
    chips: {
      identity: { n: "Identity", t: "15 min" },
      pan: { n: "PAN", t: "15 min" },
      drivingLicence: { n: "Driving licence", t: "30 min" },
      criminal: { n: "Criminal", t: "30 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      digitalEmployment: { n: "Digital employment", t: "60 min" },
      employment: { n: "Employment", t: "2 days" },
      education: { n: "Education", t: "3 days" },
    },
    allChecks: "All 33 checks",
    /** A bare `sec-head`, not a `SecHead` — this band has never carried a
     *  lede, which the page's comment argues at length. Two leaves, and `h`
     *  is read twice: by the `<h2>` and by `Steps`' `name`. */
    howItWorks: {
      k: "How it works",
      h: "How does a small-business background check work?",
    },
    steps: {
      pick: {
        n: "01 · Two minutes",
        t: "Pick & pay",
        p: "Choose a package, pay per candidate. No subscription, no minimum order.",
      },
      link: {
        n: "02 · The candidate",
        t: "One link",
        p: "They get a WhatsApp link, photograph their documents, and consent on their own phone.",
      },
      report: {
        n: "03 · Your inbox",
        t: "The report",
        p: "One PDF, the source named beside every result. Blue-collar packages land in about 30 minutes.",
      },
    },
    faqHead: (<>Before you buy.</>),
    faqs: {
      consent: {
        q: "Do I need the candidate's permission?",
        a:
          "Yes, and the flow handles it: the candidate consents on their own phone before any document is captured. No consent, no check — that's a legal requirement, not a setting.",
      },
      subscription: {
        q: "Is there a subscription?",
        a:
          "No. You pay per candidate, per package. If you verify fifty people a month or more, volume pricing kicks in — talk to sales for a rate card.",
      },
      unverifiable: {
        q: "What if a document can't be verified?",
        a:
          "The report says exactly what could not be confirmed and why — issuer offline, record not found, mismatch — and what it would take to resolve it. You're never charged twice for a re-run after a correction.",
      },
      invoice: {
        q: "Do you send a proper invoice?",
        a:
          "Every order comes with a GST invoice, automatically, to the email on the account.",
      },
    },
  },

  /** `/business/employee-verification` — Template 3. */
  employeeVerification: {
    crumb: "Employee verification",
    closing: {
      heading: (
        <>
          The people you already trust, <em>on the record.</em>
        </>
      ),
      sub: "Roll out re-verification without disrupting a single shift.",
    },
    hero: {
      k: "Business · Employee verification",
      h1: (
        <>
          Know your workforce. <em>Still.</em>
        </>
      ),
      sub:
        "Verification isn't only for new hires. Contractors, gig fleets and staff moving into " +
        "sensitive roles — re-verified in the background, from provident-fund records to courts.",
      cta: "Talk to sales",
      when: "When to re-verify",
    },
    strip: {
      digital: (<><b>60 min</b> digital employment check</>),
      epfo: (<><b>EPFO</b>-backed work history</>),
      zero: (<><b>Zero</b> forms for the employee</>),
      consent: (<><span className="dot" /> consent captured every run</>),
    },
    whatWeCheck: {
      k: "What we check",
      h: "What does employee re-verification check?",
      lede:
        "Employee re-verification covers digital employment, moonlighting, entitlement to " +
        "work, a criminal refresh and current address. Provident-fund and court records " +
        "answer digitally — digital employment in 60 minutes. Where a former employer has " +
        "to be called, HelloVerify calls, and the report names who picked up.",
    },
    chips: {
      digitalEmployment: { n: "Digital employment", t: "60 min" },
      moonlighting: { n: "Moonlighting", t: "60 min" },
      entitlementToWork: { n: "Entitlement to work", t: "60 min" },
      criminalRefresh: { n: "Criminal refresh", t: "30 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      employmentManual: { n: "Employment (manual)", t: "2 days" },
      education: { n: "Education", t: "3 days" },
    },
    whenItMatters: {
      k: "When it matters",
      h: "When should you re-verify an employee?",
      lede:
        "Re-verify at four moments: joining, a role change into finance, security or " +
        "childcare-adjacent work, an annual refresh across the workforce, and after an " +
        "incident. A check is a snapshot of the day it ran, and these are the four points " +
        "where the picture changes — and the ones auditors ask about.",
    },
    /** The four `.when3` cards. Written out longhand in the page, so these are
     *  three text-node swaps each and the card keeps its three children. */
    when: {
      joining: {
        wt: "Joining",
        wp: "The baseline: identity, work history and records confirmed before access is granted.",
        wm: "same day",
      },
      roleChange: {
        wt: "Role change",
        wp: "Moving into finance, security or childcare-adjacent work triggers the checks that role demands.",
        wm: "60 min",
      },
      annual: {
        wt: "Annual refresh",
        wp: "Criminal and moonlighting refresh across the workforce, batched so HR does nothing manually.",
        wm: "runs overnight",
      },
      incident: {
        wt: "Incident",
        wp: "A targeted re-run with an auditable trail, ready for legal the same day.",
        wm: "30 min",
      },
    },
    howItWorks: {
      k: "How it works",
      h: "How does re-verification work without disrupting staff?",
      lede:
        "Employees consent once on their own phone. After that, re-verification runs from a " +
        "roster upload or an HRMS sync, checks statutory and court records digitally, and " +
        "reports only the changes — a new court record, a second employer — rather than " +
        "every clean result. Nobody fills in a form again.",
    },
    steps: {
      enroll: {
        n: "01 · One CSV or API call",
        t: "Enroll",
        p: "Upload the roster or sync from your HRMS. Each employee gets a consent link.",
      },
      verify: {
        n: "02 · On schedule",
        t: "Verify",
        p: "Checks run digitally against provident-fund, court and registry records. Humans handle the exceptions.",
      },
      alert: {
        n: "03 · Only the changes",
        t: "Alert",
        p: "You hear about the deltas — a new court record, a second employer — not five hundred clean results.",
      },
    },
    faqHead: (<>Fair questions.</>),
    faqs: {
      legal: {
        q: "Is re-verifying existing employees even legal?",
        a:
          "Yes, with consent — which the flow captures per run, not as a blanket signature from five years ago. Scope is limited to what the role justifies, and employees can see what was checked.",
      },
      digital: {
        q: "What is a \"digital employment\" check?",
        a:
          "Work history reconstructed from provident-fund contribution records — employer names, overlaps and gaps — confirmed at the source in about an hour, without calling anyone's current employer.",
      },
      moonlighting: {
        q: "Can it detect moonlighting?",
        a:
          "Concurrent PF contributions from a second employer show up in the same 60-minute check. The report shows the overlap period, not an accusation — what you do with it is policy.",
      },
      contacted: {
        q: "Will employees be contacted?",
        a:
          "Only for consent, on their own phone. Digital checks never touch their employer or colleagues; manual employment checks do, and are marked clearly before you order one.",
      },
    },
  },

  /** `/business/customer-kyc` — Template 3. Absorbs legacy /kyc and
   *  /products/trust-safety. */
  customerKyc: {
    crumb: "Customer KYC",
    closing: {
      heading: (
        <>
          Trust at signup, <em>not after the loss.</em>
        </>
      ),
      sub: "One API call between a stranger and a customer.",
    },
    hero: {
      k: "Business · Trust & safety",
      h1: (
        <>
          Customers, verified <em>at signup.</em>
        </>
      ),
      sub:
        "Marketplaces, rentals, lending, care platforms — verify the person behind the account " +
        "before the first transaction, not after the first complaint.",
      cta: "Talk to sales",
      api: "See the API",
    },
    strip: {
      identity: (<><b>15 min</b> identity check</>),
      inFlow: (<><b>In-flow</b> — API or hosted page</>),
      countries: (<><b>120+</b> countries, same pipeline</>),
      consent: (<><span className="dot" /> consent-first, GDPR-clean</>),
    },
    whatWeVerify: {
      k: "What we verify",
      h: "What does customer KYC verify at signup?",
      lede:
        "HelloVerify's customer KYC confirms the person first — identity, PAN and age in 15 " +
        "minutes, a selfie-to-face match in seconds — then screens the record: global " +
        "database and credit in 15 minutes, criminal in 30, trade licence in two days. Depth " +
        "is set per signup tier.",
    },
    lanes: {
      identity: { lgt: "01 — Identity", lgh: "Are they who they claim?" },
      risk: { lgt: "02 — Risk", lgh: "Should they be here?" },
    },
    chips: {
      identity: { n: "Identity", t: "15 min" },
      pan: { n: "PAN", t: "15 min" },
      face: { n: "Face vs. selfie", t: "seconds" },
      age: { n: "Age", t: "15 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      globalDatabase: { n: "Global database", t: "15 min" },
      criminal: { n: "Criminal", t: "30 min" },
      credit: { n: "Credit", t: "15 min" },
      tradeLicence: { n: "Trade licence", t: "2 days" },
    },
    inFlow: {
      k: "In your flow",
      h: "How does KYC verification fit into our signup flow?",
      lede:
        "Customer KYC reaches HelloVerify three ways: an API call from your own UI, a " +
        "HelloVerify-hosted capture page, or a WhatsApp link for sellers and partners who " +
        "sign up by phone. Each returns one webhook — verified, failed, or needs a human — " +
        "with the evidence attached.",
    },
    steps: {
      api: {
        n: "01 · Embed",
        t: "API",
        p: "Your UI, our pipeline. Send the document image, get structured fields and a verdict back.",
      },
      hosted: {
        n: "02 · Or redirect",
        t: "Hosted flow",
        p: "A HelloVerify-hosted capture page in your colours — consent, capture and quality checks handled.",
      },
      whatsapp: {
        n: "03 · Or async",
        t: "WhatsApp",
        p: "For sellers and partners who sign up by phone — the same link flow candidates use.",
      },
    },
    compliance: {
      k: "Compliance & privacy",
      h: "How does HelloVerify handle customer KYC data?",
      lede:
        "A HelloVerify KYC check begins with the customer's consent, before any capture, with " +
        "scope and retention stated in plain language. Documents are encrypted in transit and " +
        "at rest, deleted on the DPA's retention schedule, and stored nowhere if you bring " +
        "your own storage.",
    },
    /** NOT a credential card — the page's comment argues this at length. It is
     *  `.cert` markup around a STANCE, it names no credential and carries no
     *  status word, so `CREDENTIAL_MARKS` owns nothing here and all three
     *  strings are ordinary page copy. `alt` is a plain `string` leaf, which
     *  is why leaf types are derived rather than declared `ReactNode`. */
    stance: {
      alt: "GDPR",
      h: "Consent first, always",
      p: "The customer consents before capture; scope and retention are stated in plain language.",
    },
    /** The per-page gloss on the ISO card. The heading and the status word
     *  still come from `CREDENTIAL_MARKS`; only this sentence is the page's. */
    isoGloss: "Documents encrypted in transit and at rest; deletion on schedule, verifiable on request.",
    securityInFull: "Security & compliance, in full",
    /** `&amp;` KEPT, and this is the one place the ampersand rule inverts.
     *  In a JSX leaf the entity is decoded by JSX exactly as it was in the
     *  page, so copying the markup verbatim is what preserves the byte; it is
     *  only a STRING leaf that must spell the bare `&`. */
    faqHead: (<>From trust &amp;<br />safety teams.</>),
    faqs: {
      friction: {
        q: "How much friction does this add to signup?",
        a:
          "The capture flow takes under a minute on a phone, and identity verdicts return in minutes. Most platforms gate features, not signup — the account exists immediately, the risky action waits for the verdict.",
      },
      tiering: {
        q: "Can we tier the checks by risk?",
        a:
          "Yes — per API call. A buyer might get identity only; a seller adds criminal and global database; a high-value partner adds trade licence and directors. One integration, any mix.",
      },
      storage: {
        q: "What do we store, and what do you store?",
        a:
          "You receive the verdict and the fields you asked for. Documents stay in HelloVerify's encrypted store on the retention schedule in the DPA — or zero-retention if you bring your own storage.",
      },
      international: {
        q: "Does this work outside India?",
        a:
          "Yes — 120+ countries through the same API, with the check running in the country that issued the document. See global coverage for the country-by-country picture.",
      },
    },
  },

  /** `/business/certifier` — vendor due diligence. Descriptive name leads,
   *  brand follows (IA §10.2), which is why the crumb is the category and the
   *  product name only appears inside the copy. */
  certifier: {
    crumb: "Vendor due diligence",
    closing: {
      heading: (
        <>
          Sign the supplier, <em>not the risk.</em>
        </>
      ),
      sub: "Send us the vendor list before the quarter closes.",
    },
    hero: {
      k: "Business · Vendor due diligence — Certifier",
      h1: (
        <>
          Know who <em>you buy from.</em>
        </>
      ),
      sub:
        "Before the first purchase order: is the trade licence real, who are the directors, " +
        "what do the courts and credit bureaus say? Certifier answers from the registry, not " +
        "the vendor's brochure.",
      cta: "Talk to sales",
      packages: "See the two packages",
    },
    strip: {
      profile: (<><b>2 days</b> to a certified profile</>),
      registry: (<><b>Registry</b>-confirmed, not self-declared</>),
      countries: (<><b>120+</b> countries of suppliers</>),
      renewals: (<><span className="dot" /> renewal reminders built in</>),
    },
    whatWeCheck: {
      k: "What we check",
      h: "What does vendor due diligence check?",
      lede:
        "Certifier checks a vendor as a legal entity and as the people behind it: trade " +
        "licence in two days, directors and GST, credit and global-database screening in 15 " +
        "minutes, plus identity, promoter criminal history and a financial assessment. " +
        "Licences expire, so it keeps checking.",
    },
    lanes: {
      entity: { lgt: "01 — The entity", lgh: "On paper" },
      people: { lgt: "02 — The people", lgh: "Behind it" },
    },
    chips: {
      tradeLicence: { n: "Trade licence", t: "2 days" },
      directorsGst: { n: "Directors & GST", t: "3 days" },
      credit: { n: "Credit", t: "15 min" },
      globalDatabase: { n: "Global database", t: "15 min" },
      identity: { n: "Identity", t: "15 min" },
      criminal: { n: "Criminal", t: "30 min" },
      promoter: { n: "Promoter criminal history", t: "2 days" },
      financial: { n: "Financial assessment", t: "2 days" },
    },
    packagesBand: {
      k: "Packages",
      h: "What is in a vendor due diligence package?",
      lede:
        "Certifier ships two four-check vendor packages: trade licence risk, before you sign " +
        "a supplier, and vendor financial risk, before the first big order. Both are " +
        "registry-confirmed rather than self-declared, and both end in a certified vendor " +
        "profile in two days.",
    },
    /** The frame both `.rc` cards render, one leaf each. Shared for the same
     *  reason as `smb.card`: two instances of one card shape, where divergent
     *  translations would be a bug. Unlike `smb`, the count and the turnaround
     *  are literals in the markup here rather than derived from a list, so
     *  `readyIn` is a plain string and not a function. */
    card: {
      label: "Package",
      vendors: "Vendors · Certifier",
      readyIn: "4 checks · ready in",
      ready: "2 days",
      who: "Certified vendor profile",
      cta: "Talk to sales",
    },
    packs: {
      licence: {
        tt: "Trade licence risk",
        sub: "Before you sign a supplier",
        lines: {
          tradeLicence: "Trade licence",
          defaultingDirectors: "Defaulting directors",
          criminalRecords: "Criminal records",
          creditCompany: "Credit & company",
        },
      },
      financial: {
        tt: "Vendor financial risk",
        sub: "Before the first big order",
        lines: {
          financialAssessment: "Financial assessment",
          gstScreening: "GST screening",
          creditChecks: "Credit checks",
          promoterCriminal: "Promoter criminal history",
        },
      },
    },
    howItWorks: {
      k: "How it works",
      h: "How does vendor due diligence work?",
    },
    steps: {
      list: {
        n: "01 · Procurement",
        t: "The list",
        p: "Vendor names and GST numbers — a CSV or an API call from your procurement system.",
      },
      digging: {
        n: "02 · The registries",
        t: "The digging",
        p: "Licence registers, ministry records, courts, credit bureaus — each fact confirmed where it's filed.",
      },
      profile: {
        n: "03 · Two days later",
        t: "The profile",
        p: "A certified profile per vendor: what was checked, where, what was found — and when it expires.",
      },
    },
    faqHead: (<>From procurement.</>),
    faqs: {
      cooperate: {
        q: "Does the vendor have to cooperate?",
        a:
          "Mostly no — registries, courts and bureaus answer without the vendor's involvement. Where a document must come from the vendor, they get the same one-link upload flow candidates use.",
      },
      certified: {
        q: "What does \"certified\" mean here?",
        a:
          "Every fact in the profile carries its source and check date. Certification isn't our opinion of the vendor — it's proof that each claim was verified at the registry that holds it.",
      },
      wholeBase: {
        q: "Can this run on our whole vendor base?",
        a:
          "Yes — batches run in parallel, so a thousand vendors take days, not quarters. Renewals re-run automatically before a licence or rating goes stale.",
      },
      international: {
        q: "International suppliers too?",
        a:
          "120+ countries, checked in-country: an Egyptian textile supplier's trade licence is confirmed in Cairo, not translated from a scan.",
      },
    },
  },
};

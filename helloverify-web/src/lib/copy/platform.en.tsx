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
 *      platform/technology               52       ->  65          1.25x
 *      platform/security-compliance      43       ->  99          2.3x
 *                                        (+1: the shared `crumb` leaf)
 *
 *  `./index`'s rule predicts the shape and gets it right in both directions.
 *  `/platform/coverage` is 3.0x because 51 of its 99 leaves are the region
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
 *  - **The two `<pre>` samples on `/platform/technology`.** A JSON request
 *    body and a webhook payload are CODE, not copy: `"driving_licence"`,
 *    `"callback_url"` and `"2026-09-16T10:08Z"` are the API's own spelling and
 *    are identical in every locale, exactly as an href is. They stay as the
 *    template literals they were. The same line puts the method and the path
 *    (`POST`, `/v1/verifications`) and the webhook's event name
 *    (`verification.completed`) in the page and the `<small>` description and
 *    the `→ …` return blurb beside them in here — one is API surface, the
 *    other is a sentence a translator translates.
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
import type { ReactNode } from "react";

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
      "/platform/technology": {
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
      "/platform/coverage": {
        tag: "Coverage",
        from: "120+ countries",
        h: "Global coverage",
        p: "Where a document can be confirmed with the authority that issued it — and how long it takes there.",
      },
    },
  },

  /** `/platform/coverage` — where a document can be confirmed at its source. */
  coverage: {
    crumb: "Global coverage",

    closing: {
      heading: (
        <>
          Tell us the country. <em>We'll tell you the truth.</em>
        </>
      ),
      sub: "Including when the honest answer is that a registry still works on paper.",
    },

    hero: {
      k: "Platform · Global coverage",
      h1: (
        <>
          Verified in <em>120+ countries.</em>
        </>
      ),
      sub:
        "A document is only properly verified in the country that issued it. Our own offices and " +
        "partner network reach the registries, universities, courts and employers that hold the " +
        "records — locally, in language, to local process.",
      cta: "Ask about a country",
      times: "See country times",
    },

    strip: {
      countries: (<><b>120+</b> countries reachable</>),
      offices: (<><b>6</b> offices, twelve hours apart</>),
      hours: (<><b>21 of 24</b> hours with someone at a desk</>),
      live: (<><span className="dot live" /> someone is working now</>),
    },

    offices: {
      k: "Six offices",
      h: "Where are HelloVerify's offices?",
      lede:
        "HelloVerify works from six offices — Manila, Singapore, Noida, Dubai, Cairo and New " +
        "York — each open 09–18 local, which puts someone at a desk for 21 of 24 hours. A " +
        "request filed at night in one place is picked up in the morning elsewhere.",
    },

    /** The six `.o3` cards. Each is `<b>city</b><span>hours</span>` — two
     *  elements with one text child each, so two leaves and not one rich-text
     *  leaf; nothing here is an element-plus-text PAIR inside one node.
     *
     *  ONE `hours` LEAF READ SIX TIMES, not six identical leaves, and the band
     *  above is the reason: its lede says the offices are "each open 09–18
     *  local", so the six rendering the same string is a property of the copy
     *  rather than a coincidence, and six leaves would let a locale break the
     *  sentence that describes them. The same move
     *  `business/enterprise/page.tsx` makes for the `Steps` `name` it shares
     *  with its own `SecHead` `h`. */
    officeRows: {
      manila: "Manila",
      singapore: "Singapore",
      noida: "Noida",
      dubai: "Dubai",
      cairo: "Cairo",
      newYork: "New York",
      hours: "09–18 local",
    },

    countryTimes: {
      k: "Country times",
      h: "How long does verification take in each country?",
      lede:
        "HelloVerify's indicative times for source-confirmed checks vary by country: India 15 " +
        "minutes to 3 days, the United States, Germany and Saudi Arabia 1–3 days, Nigeria 3–6 " +
        "days. Digital registries answer in minutes; where a registrar works on paper, the " +
        "estimate says days.",
    },

    /** THE REGION TABLE, and the 51 leaves that make this page 3.0x.
     *
     *  Keyed rather than an array, per `./index`: an array leaf derives to
     *  `T[]`, so a second locale could ship six countries where English ships
     *  eight and `tsc` would agree. The page keeps the ORDER — which regions,
     *  which countries, in which order — as `readonly { r: RegionKey; list:
     *  readonly CountryKey[] }[]`, so a country listed without a name is
     *  TS2322 there, in every locale at once.
     *
     *  FLAT, not nested inside the region. The obvious shape puts each
     *  region's eight countries under it, and it does not survive contact with
     *  the page: `t.coverage.regions[g.r].countries[k]` indexes a UNION of
     *  three objects by a union of their key sets, which is TS2536 unless the
     *  page casts it away — and a cast in the one place the type gate is
     *  supposed to bite is worse than no gate. Which region a country belongs
     *  to is the page's ordered list either way, the same thing `LANES` is on
     *  `/business/enterprise`. All 24 keys are distinct, which is what makes
     *  one record legal.
     *
     *  BOTH HALVES RENDER AS `key=`. `key={g.r}` is the region title and
     *  `key={x.c}` the country name, so these 27 leaves are the third
     *  corollary's case: a rename here is a changed React key and a changed
     *  flight payload. `tools/test/copy.test.ts` §13 pins the three region
     *  titles and all 24 names against the pre-migration strings.
     *
     *  IT DELIBERATELY DOES NOT READ `lib/content/countries.ts`, which holds
     *  six of these 24 names. That module is the catalogue behind
     *  `/countries/[country]` — 28 programmatic routes whose titles
     *  `lib/seo/copy.ts` derives from it — and this is a page-local table of
     *  indicative times on one route, gated by nothing. `business.enterprise`
     *  already set that precedent in the harder direction: its pill names
     *  overlap `lib/content/checks.ts`, and §8's boundary guard deliberately
     *  does not run over `business`. Importing the catalogue here would cover
     *  a quarter of the table and leave 18 names hand-written beside them,
     *  which is worse than either. */
    regions: {
      southSoutheastAsia: "South & Southeast Asia",
      middleEastAfrica: "Middle East & Africa",
      europeAmericas: "Europe & the Americas",
    },

    countries: {
      india: { c: "India", t: "15 min – 3 days" },
      philippines: { c: "Philippines", t: "Tomorrow, 9:00 AM" },
      singapore: { c: "Singapore", t: "Fri, 10:30 AM" },
      indonesia: { c: "Indonesia", t: "2 – 4 days" },
      vietnam: { c: "Vietnam", t: "2 – 4 days" },
      sriLanka: { c: "Sri Lanka", t: "2 – 5 days" },
      nepal: { c: "Nepal", t: "2 – 5 days" },
      bangladesh: { c: "Bangladesh", t: "3 – 5 days" },
      uae: { c: "United Arab Emirates", t: "Today, 4:00 PM" },
      saudiArabia: { c: "Saudi Arabia", t: "1 – 3 days" },
      egypt: { c: "Egypt", t: "Today, 4:00 PM" },
      qatar: { c: "Qatar", t: "1 – 3 days" },
      kuwait: { c: "Kuwait", t: "2 – 4 days" },
      kenya: { c: "Kenya", t: "3 – 5 days" },
      nigeria: { c: "Nigeria", t: "3 – 6 days" },
      southAfrica: { c: "South Africa", t: "2 – 4 days" },
      uk: { c: "United Kingdom", t: "Today, 4:00 PM" },
      germany: { c: "Germany", t: "1 – 3 days" },
      france: { c: "France", t: "1 – 3 days" },
      netherlands: { c: "Netherlands", t: "1 – 3 days" },
      poland: { c: "Poland", t: "2 – 4 days" },
      us: { c: "United States", t: "1 – 3 days" },
      canada: { c: "Canada", t: "1 – 3 days" },
      brazil: { c: "Brazil", t: "3 – 5 days" },
    },

    /** A FUNCTION leaf taking the anchor, the shape `./index` describes for a
     *  sentence wrapping something the component owns — here an href and an
     *  inline style. A plain string would have had to END IN A SPACE to keep
     *  the byte, and an edge-whitespace leaf is what
     *  `tools/test/copy.test.ts` §3 rejects. `business.enterprise.note` is the
     *  same construction. */
    note: (link: ReactNode) => (
      <>
        Indicative times for source-confirmed checks · a further 90+ countries are covered through
        the partner network — {link}
      </>
    ),
    noteLink: "ask about a specific country",

    means: {
      k: "What coverage means",
      h: "What does global coverage actually mean?",
      lede:
        "Coverage at HelloVerify means someone can reach the office that holds the record — a " +
        "court, a university, a transport authority — in the country that issued the document, " +
        "not a database licence. If nobody can, the report says unverifiable and names the " +
        "route tried.",
    },

    /** The three `Steps` cards. `n` is the ornament number, `t` the card
     *  heading, `p` its line — all three are rendered words, so all three are
     *  here; the ORDER is the page's. NO `name` is passed, so no HowTo node
     *  reads any of this (§17 condition 18); the page comment says why. */
    steps: {
      inCountry: {
        n: "01",
        t: "In-country",
        p: "The check runs where the document was issued, by people who know that registry's process and language.",
      },
      atSource: {
        n: "02",
        t: "At the source",
        p: "The university, the court, the transport authority — not an aggregator that once copied their data.",
      },
      honest: {
        n: "03",
        t: "Honestly reported",
        p: "If a registry can't be reached, the report says unverifiable and names the route tried. Never a silent pass.",
      },
    },

    /** Kept as a FRAGMENT, exactly as written, although it holds one text
     *  child and no markup. `FaqSection`'s `head` is a `ReactNode` because
     *  three of this subtree's four carry a `<br />`; a string leaf here would
     *  swap a fragment for a raw string in the same slot for no gain.
     *  `business`'s five are all fragments for the same reason. */
    faqHead: (<>About reach.</>),

    faqs: {
      count120: {
        q: "What does \"120+ countries\" actually count?",
        a:
          "Countries where we can confirm at least one check type with the authority that issued the document, through our own offices or a named partner. It does not count countries where all we could do is search a commercial database.",
      },
      everywhere: {
        q: "Is every check available everywhere?",
        a:
          "No, and any vendor claiming otherwise is describing a database. Criminal record access in particular varies by jurisdiction — some require the individual to request their own certificate. The catalogue shows what is possible per country before you order.",
      },
      crisis: {
        q: "How do you handle countries in crisis?",
        a:
          "Where institutions are closed or records are destroyed, we say so. The report distinguishes unverifiable from failed, which protects applicants who did nothing wrong but happen to come from somewhere with broken record-keeping.",
      },
      addCountry: {
        q: "Can you add a country for us?",
        a:
          "Often, yes — for a committed volume we will establish a route into a new jurisdiction, typically a matter of weeks. Tell us the country and the check types you need.",
      },
    },
  },

  /** `/platform/technology` — how it works, for a technical evaluator. */
  technology: {
    crumb: "Technology & APIs",

    closing: {
      heading: (
        <>
          Read the docs, <em>then send one request.</em>
        </>
      ),
      sub: "Sandbox keys the same day you ask.",
    },

    hero: {
      k: "Platform · Technology & APIs",
      h1: (
        <>
          AI reads it. <em>People confirm it.</em>
        </>
      ),
      sub:
        "The model extracts fields and spots forgeries in about a second. The part that makes the " +
        "answer worth having is what comes next — reaching the office that issued the document.",
      cta: "Request sandbox access",
      endpoints: "See the endpoints",
    },

    strip: {
      read: (<><b>1.2 s</b> document read</>),
      types: (<><b>33</b> check types, one API</>),
      webhooks: (<><b>Webhooks</b> — no polling</>),
      uptime: (<><span className="dot" /> 99.9% uptime target</>),
    },

    /** `h` IS THE HowTo NODE'S NAME (§17 condition 18). The page passed the
     *  same sentence twice — once as `SecHead h=`, once as `Steps name=` — and
     *  now reads ONE leaf twice, so a translation cannot break the equality
     *  `check-schema.mjs` compares per page. `business.enterprise.howItWorks`
     *  made the same move for the same reason. */
    pipeline: {
      k: "The pipeline",
      h: "How does the verification pipeline work?",
      lede:
        "You post one document and a list of checks. HelloVerify then runs four stages: an " +
        "on-device capture quality gate, field extraction and forgery checks in about 1.2 " +
        "seconds, routing to the office that issued the document, and a signed result delivered " +
        "by webhook.",
    },

    steps: {
      capture: {
        n: "01 · Capture",
        t: "Quality gate",
        p: "Edges, glare, focus and resolution checked on-device before upload — bad captures never enter the queue.",
      },
      extract: {
        n: "02 · Extract",
        t: "Read & verify",
        p: "Fields extracted, template and fonts matched against the issuer's known series, security features and face compared.",
      },
      route: {
        n: "03 · Route",
        t: "Find the issuer",
        p: "The issuing office is resolved from the document itself, then the request is routed to the team or API that can reach it.",
      },
      ret: {
        n: "04 · Return",
        t: "Signed result",
        p: "A structured result with the source, timestamp and evidence — delivered by webhook, not discovered by polling.",
      },
    },

    shape: {
      k: "Shape of it",
      h: "What does a verification request look like?",
      lede:
        "A verification is one POST to /v1/verifications carrying the candidate, the check types " +
        "and a callback URL. Completion arrives as a verification.completed webhook naming the " +
        "result, the source and the timestamp. The shapes shown are illustrative; the published " +
        "reference ships with sandbox credentials.",
    },

    /** The two `.ch` labels only. The `<b>` beside each — `POST
     *  /v1/verifications` and `verification.completed` — is API surface and
     *  stays in the page, with the two `<pre>` bodies. These two words are
     *  also what `aria-labelledby` names the scrollable regions with, so they
     *  are copy in the fullest sense: a screen reader reads them. */
    code: {
      request: "Request",
      webhook: "Webhook",
    },

    endpoints: {
      k: "Endpoints",
      h: "Which endpoints does the HelloVerify API expose?",
      lede:
        "Five endpoints cover every HelloVerify product: start a verification, read one back, " +
        "submit a batch for a hiring drive, list the available check types, and fetch the signed " +
        "evidence behind a result. All 33 check types are parameters, not separate integrations.",
    },

    /** The five `.e` rows. `d` is the `<small>` description and `ret` the
     *  `→ …` blurb; the method and the path are the page's, for the reason in
     *  this file's header. Keyed by what the endpoint DOES rather than by its
     *  path, because two rows share a path prefix and one of them is a POST to
     *  the same collection the GET reads. */
    api: {
      start: { d: "Start a verification for one candidate", ret: "→ id, status" },
      read: { d: "Current state and per-check results", ret: "→ full record" },
      batch: { d: "Bulk submission for hiring drives", ret: "→ batch id" },
      checks: { d: "Available check types, times and coverage", ret: "→ catalogue" },
      evidence: { d: "Signed artefact behind a result", ret: "→ signed URL" },
    },

    integrate: {
      k: "Ways to integrate",
      h: "How can we integrate HelloVerify?",
      lede:
        "HelloVerify integrates eight ways: REST API, webhooks, bulk CSV upload, a hosted " +
        "capture page, the WhatsApp candidate flow, ATS connectors, SSO/SAML, and a console for " +
        "non-technical teams. That spans a link pasted into an email to results posted straight " +
        "back into your ATS.",
    },

    /** The eight `.svc` chips. Written out longhand in the page today, so no
     *  `key=` is involved; the page keeps the order. */
    svc: {
      rest: "REST API",
      webhooks: "Webhooks",
      csv: "Bulk CSV upload",
      capture: "Hosted capture page",
      whatsapp: "WhatsApp candidate flow",
      ats: "ATS connectors",
      sso: "SSO / SAML",
      console: "Console for non-technical teams",
    },

    faqHead: (<>From engineers.</>),

    faqs: {
      sync: {
        q: "Is the result synchronous?",
        a:
          "The document read is — fields and forgery signals return in about a second. Source confirmation is asynchronous by nature, because a registrar answers on their own schedule, so completion arrives by webhook with the source named.",
      },
      unsure: {
        q: "What happens if your model is unsure?",
        a:
          "Low-confidence extractions go to a human reviewer rather than being returned as confident guesses. The record shows that a person intervened, which matters when a result is later challenged.",
      },
      storage: {
        q: "Do you store our candidates' documents?",
        a:
          "On the retention schedule in your DPA, encrypted at rest — or zero-retention if you hold the files yourself and send us only what a check needs. Both are configured per account, not per request.",
      },
      limits: {
        q: "Rate limits and volume spikes?",
        a:
          "Batch submission is built for hiring drives and seasonal intakes; the pipeline parallelises across checks, so a thousand candidates take roughly as long as one plus queue time. Limits are set per contract rather than per plan tier.",
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
     *  The `/platform/coverage` `hours` leaf is the same judgement. */
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

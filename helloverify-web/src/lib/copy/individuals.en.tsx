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
 *  MEASURED: **105 matched nodes, 309 leaves — 2.94x**, asserted in
 *  `tools/test/copy.test.ts` §15. 105 is this agent's re-run of the
 *  comment-stripped `>text<` matcher, calibrated against the one figure in
 *  `./index`'s header that no migration has moved (`components/forms/** 10`,
 *  reproduced exactly); the brief that commissioned this slice counted 71.
 *  Both runs are recorded rather than reconciled — §7 and §9 of that test file
 *  already take that posture for chrome's 24-versus-26 and business's
 *  206-versus-181.
 *
 *  THE PER-FILE SPREAD IS THE FINDING, and it is `./index`'s own rule read
 *  twice over:
 *
 *      individuals/page.tsx       22 nodes ->  52 leaves   2.4x
 *      individuals/hellov         59       ->  77          1.3x
 *      individuals/home-family    11       ->  86          7.8x
 *      individuals/immigration    13       ->  93          7.2x
 *
 *  (plus `crumb`, the one leaf all four share, which is why the four rows
 *  sum to 308 and the namespace holds 309.)
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
 *    RECORDED RATHER THAN RESOLVED, because `hellov` makes it sharper than
 *    `business` did: its `offers[].name`/`description` are "Basic" / "The
 *    essentials, in half an hour" and "Advanced" / "For the people inside your
 *    home", which are word for word `hellov.plans.basic.tt`/`.sub` and
 *    `.advanced.tt`/`.sub` below. Four strings, two copies, no type between
 *    them. They cannot be shared: `SERVICE` is a module-level `const`
 *    evaluated outside the component, so it cannot `await copy()`. The same
 *    posture `./contact.en.tsx` takes for the side card that duplicates
 *    `chrome.closingCta` — folding them is a content decision, and the
 *    alternative (moving `SERVICE` inside the render) is a markup-adjacent
 *    change this slice has no mandate for.
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
     *  to `/individuals/hellov`), which is why the key is an id and not the
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

  /** `/individuals/hellov` — the consumer product page (Template 4). */
  hellov: {
    crumb: "HelloV",
    closing: {
      heading: (
        <>
          Thirty minutes now, or <em>years of wondering.</em>
        </>
      ),
      sub: "Message HelloV on WhatsApp. That's the whole setup.",
      ctaLabel: "Start on WhatsApp",
    },
    hero: {
      k: "Individuals · HelloV",
      /** Three children — a text node, a `<br />`, and an `<em>` — written on
       *  the same lines the `<h1>` used, so the newline-plus-indent after the
       *  `<br />` folds away exactly as it did before. The shape
       *  `./templates.en.tsx#compliance.head` documents. */
      h1: (
        <>
          Verify anyone.<br />
          <em>From your phone, in 30 minutes.</em>
        </>
      ),
      sub:
        "Send a photo of the document over WhatsApp. We check it with the authority that issued " +
        "it — the transport office, the court, the registry — and send the report back to the " +
        "same chat.",
      cta: "Start on WhatsApp",
      plans: "See the two plans",
    },
    strip: {
      thirtyMin: <><b>30 min</b> typical turnaround</>,
      noApp: <><b>No</b> app, no account</>,
      price: <><b>₹499</b> to start</>,
      consent: <><span className="dot" /> they consent first, always</>,
    },
    chat: {
      k: "In one conversation",
      h: "Can I run a background check over WhatsApp?",
      lede:
        "Yes. HelloV runs entirely inside WhatsApp — no download, no dashboard, no password. " +
        "Families use it before hiring a driver, a maid or nanny, before handing a tenant the " +
        "keys, and before believing someone they met online. Each check takes about 30 minutes.",
    },
    /** The four `.when3` cards, written out longhand in the page, so each is
     *  three text-node swaps and the card keeps its three children. */
    when: {
      driver: {
        wt: "A driver",
        wp: "For the school run, the night shift, the family car. Licence, record, address.",
        wm: "30 min",
      },
      maid: {
        wt: "A maid or nanny",
        wp: "The person alone in your home with your children. Identity, criminal record, address.",
        wm: "30 min",
      },
      tenant: {
        wt: "A tenant",
        wp: "Before the keys and the deposit change hands. Identity, criminal, credit.",
        wm: "30 min",
      },
      online: {
        wt: "Someone you met online",
        wp: "Before dinner, before an investment, before you believe the profile.",
        wm: "30 min",
      },
    },
    plans: {
      k: "Plans",
      h: "How is a HelloV background check priced?",
      lede:
        "HelloV is priced per person rather than by subscription, with two plans. Basic covers " +
        "driving licence, criminal record and current address. Advanced adds identity with photo " +
        "match and a global database screen. Both return a report in 30 minutes.",
      /** The `.rc` card's invariant chrome, hoisted because both cards say it
       *  — one decision for a translator rather than two identical rows. The
       *  shape `sections.packages` already uses for `package`/`buy`. */
      card: {
        hd: "Plan",
        perPerson: "Per person",
        inclGst: "incl. GST",
        thirtyMinutes: "30 minutes",
        buy: "Buy now",
      },
      /** ONE FLAT TABLE for every `.ln` on either card, not a `lines` nested
       *  per plan — three of the five appear on both, so nesting would put a
       *  translator in front of eight rows where there are five decisions.
       *  The shape and the argument are `sections.packages.lines`'.
       *
       *  `identityPhotoMatch` is plain `&`: the JSX read
       *  `Identity &amp; photo match` inside a `<span>` with no other child,
       *  so it is one text node and therefore a string leaf — see the note on
       *  `hub.hero.k`. */
      lines: {
        licence: "Driving licence",
        criminal: "Criminal record",
        address: "Current address",
        identityPhotoMatch: "Identity & photo match",
        globalDatabase: "Global database screen",
      },
      basic: {
        hd: "HelloV · Basic",
        tt: "Basic",
        sub: "The essentials, in half an hour",
        price: "₹499",
        ready: "3 checks · ready in",
        who: "Drivers, tenants, dates",
      },
      advanced: {
        hd: "HelloV · Advanced",
        tt: "Advanced",
        sub: "For the people inside your home",
        price: "₹799",
        ready: "5 checks · ready in",
        who: "Nannies, carers, live-in staff",
      },
      note:
        "Prices shown are placeholders pending commercial sign-off · the person being verified " +
        "consents before any check runs",
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

  /** `/individuals/home-family` — a `VerticalPage` client. Every leaf below is
   *  a PROP, which is why the matcher scored this file 11 against 60 leaves;
   *  see this file's header. */
  homeFamily: {
    crumb: "Home & family",
    eyebrow: "Individuals · Home & family",
    h1: <>The people <em>in your home.</em></>,
    sub: "A nanny, a driver, a cook, a carer for your parents. They hold your keys and your children's hands — and usually arrive on a recommendation and a photocopy.",
    primary: "Check someone now",
    secondary: "See what gets checked",
    strip: {
      thirtyMin: <><b>30 min</b> typical turnaround</>,
      price: <><b>₹499</b> to start</>,
      whatsapp: <><b>WhatsApp</b> — no app to install</>,
      consent: <><span className="dot" /> they consent first, always</>,
    },
    verifyHead: "What does a background check on a nanny or driver cover?",
    verifyLede:
      "A HelloVerify household check covers three things: identity with a photo match, the " +
      "criminal and global-database record, and whether the address given is real. Identity " +
      "takes 15 minutes, driving licence and criminal record 30 minutes each; a previous " +
      "household employer takes two days.",
    /** `VerticalPage` keys a lane on `gt`, so these three are React keys. */
    lanes: {
      identity: { gt: "01 — Identity", gh: "Who they are" },
      record: { gt: "02 — Record", gh: "What's on file" },
      address: { gt: "03 — Where they live", gh: "Is it real" },
    },
    /** ONE FLAT TABLE for the eight pills across the three lanes, for the
     *  reason `sections.packages.lines` gives: nesting them under the lane
     *  makes `t.lanes[l.k].pills[p]` the correlated-union problem TypeScript
     *  cannot solve across a `.map()`. `fast` is not here — it picks a CSS
     *  modifier and stays beside the `className` it drives. `n` is the pill's
     *  React key. */
    pills: {
      identity: { n: "Identity", t: "15 min" },
      photoMatch: { n: "Photo match", t: "seconds" },
      age: { n: "Age", t: "15 min" },
      licence: { n: "Driving licence", t: "30 min" },
      criminal: { n: "Criminal", t: "30 min" },
      globalDatabase: { n: "Global database", t: "15 min" },
      currentAddress: { n: "Current address", t: "30 min" },
      previousEmployment: { n: "Previous employment", t: "2 days" },
    },
    stepsHead: "How do I check a nanny or driver before they start?",
    stepsLede:
      "A HelloVerify home-and-family check runs in a WhatsApp conversation: you photograph the " +
      "person's document, they consent on their own phone after seeing exactly what is being " +
      "checked, and the report returns to the same chat in about 30 minutes.",
    steps: {
      you: {
        n: "01 · You",
        t: "Send a photo",
        p: "Message HelloV and photograph their document. Takes about a minute.",
      },
      them: {
        n: "02 · Them",
        t: "They agree",
        p: "They get a message showing exactly what's being checked, and consent on their own phone.",
      },
      report: {
        n: "03 · The report",
        t: "You know",
        p: "Plain language, sources named, back in the same chat — usually in about 30 minutes.",
      },
    },
    tableHead: "How long does a nanny or driver background check take?",
    tableLede:
      "Most HelloVerify household checks finish inside 30 minutes, measured from upload to " +
      "report: identity and a global database screen in 15 minutes, driving licence, criminal " +
      "record and current address in 30. Only a previous household employer is slow, at two days.",
    /** `VerticalPage` keys a row on `nm`. */
    rows: {
      identity: { nm: "Identity", sub: "name, DOB, photo match", tm: "15 min", src: "issuing registry" },
      globalDatabase: { nm: "Global database screen", sub: "watchlists, adverse media", tm: "15 min", src: "global databases" },
      licence: { nm: "Driving licence", sub: "class, validity, endorsements", tm: "30 min", src: "state transport authority" },
      criminal: { nm: "Criminal record", sub: "court & police databases", tm: "30 min", src: "court records" },
      address: { nm: "Current address", sub: "residence confirmation", tm: "30 min", src: "address records" },
      previousEmployment: { nm: "Previous employment", sub: "household or agency reference", tm: "2 days", src: "the previous employer" },
    },
    tableNote: "Times shown are from upload to report · all checks require the person's consent",
    complianceHead: "Is verification fair to the person being checked?",
    complianceLede:
      "The person being checked is usually looking for work: they see exactly what is being " +
      "verified, consent to it, and their documents are held under retention limits rather than " +
      "forever. A verified record is also portable proof for the next family.",
    faqHead: <>From families.</>,
    faqs: {
      awkward: {
        q: "Isn't it awkward to ask?",
        a: "Less than you'd expect — verification is now normal for household staff, and many candidates prefer it, because a verified record is portable proof for the next family too. The request comes from us, not you.",
      },
      noDocuments: {
        q: "What if they have no formal documents?",
        a: "Most people have at least one government ID, which anchors identity and criminal checks. If nothing can be verified, the report says so plainly — that's information too, and it's better than assuming.",
      },
      clean: {
        q: "Does a clean report mean they're safe?",
        a: "It means the records confirm what they told you. That's a floor, not a guarantee — keep doing the human things: references, a trial period, meeting the family. Verification removes a specific risk, not all of them.",
      },
      agency: {
        q: "Can I check an agency's staff?",
        a: "Yes, with the individual's consent. Agencies often say staff are 'verified' without saying by whom or against what — this tells you which authority confirmed it and when.",
      },
    },
    closing: {
      heading: <>Peace of mind, <em>in half an hour.</em></>,
      sub: "One photo, their consent, and a report you can rely on.",
      ctaLabel: "Check someone now",
    },
  },

  /** `/individuals/immigration` — the second `VerticalPage` client. */
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

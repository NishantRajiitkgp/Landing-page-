/** English copy for `app/[locale]/resources/**` — the organic-growth surface:
 *  a hub, the blog index and post template, the check and country indexes, and
 *  the glossary. Six files, one namespace, per the rule at the end of
 *  `./index`'s recipe.
 *
 *  The reasoning for every shape — why the English object is the schema, why a
 *  leaf that wraps a component-owned node is a function, why rich text is real
 *  JSX — is in `./index`'s header and is not repeated here.
 *
 *  MEASURED: **90 matched nodes, 98 leaves — 1.09x**, asserted in
 *  `tools/test/copy.test.ts` §15. 90 is this agent's re-run of the
 *  comment-stripped `>text<` matcher, calibrated against the one figure in
 *  `./index`'s header that no migration has moved (`components/forms/** 10`,
 *  reproduced exactly); the brief that commissioned this slice counted 44.
 *  Both runs are recorded rather than reconciled, which is the posture §7 and
 *  §9 of that test file already take for chrome's 24-versus-26 and business's
 *  206-versus-181. The ratio is the claim; the numerator is not.
 *
 *  THE CATALOGUE BOUNDARY, and it is the whole reason this namespace is small.
 *  Four of these six pages iterate `lib/content/{posts,checks,countries}.ts`,
 *  and NOTHING from those records is here: no post title, standfirst,
 *  category, author, section heading, paragraph or quote; no check name,
 *  `answers`, `time`, `source` or group; no country name, region, summary,
 *  turnaround or office. `./countries.en.tsx` states the argument for the
 *  templated country route and it applies unchanged to the index that links
 *  to it — a catalogue is the site's claims, reviewed as data, and
 *  `lib/seo/copy.ts` already derives all 28 programmatic routes' titles and
 *  descriptions from those same records so that there is one copy of them.
 *  `posts.ts` is the sharpest case: it now holds four verbatim-ported
 *  articles, which is the same "text awaiting review, not text awaiting a
 *  translator" category `lib/content/legal.ts` is in. The boundary is
 *  ASSERTED, not commented — `tools/test/copy.test.ts` §8 compares every
 *  string in all three catalogues against every string leaf here.
 *
 *  WHAT IS ON THIS SIDE OF IT: the page shells. Breadcrumb rungs, hero
 *  kickers and headings, section eyebrows, card titles and blurbs, the
 *  `.pricenote` footnotes, and — the category that made nine of these leaves
 *  functions — the CONNECTIVE WORDS BETWEEN TWO CATALOGUE VALUES. `{n} checks
 *  documented →`, `{p.readMins} min read` and `{p.category} · {date} ·
 *  {mins} min read` are one text node each sitting beside an interpolation,
 *  and the built page shows the `<!-- -->` React writes between them
 *  (`.next/server/app/en/resources.html`: `12<!-- --> checks documented →`).
 *  A leaf of `" checks documented →"` would also fail §3's edge-whitespace
 *  guard. Both problems have the same answer and `./countries.en.tsx` already
 *  took it: a function leaf returning a FRAGMENT whose children reproduce the
 *  parent's inline children element for element.
 *
 *  `row.min` IS SHARED between the blog index and the post page, which is the
 *  only sharing in this file. They render the same `.x3` row markup with the
 *  same words; two leaves would be one string a translator could part in a
 *  place nobody would look. `checks` and `countries` render `.x3` too and are
 *  NOT included — their `.xt` cell is a raw catalogue value with no connective
 *  word at all.
 *
 *  `crumb: "Resources"` IS READ FIVE TIMES — once as the hub's own rung and
 *  four times as the parent rung on the pages below it. The same call
 *  `./business.en.tsx` makes for its `crumb`, and for the same reason: these
 *  are five renderings of one rung pointing at one page, not five controls.
 *
 *  THE GLOSSARY TERMS ARE A MODULE-LEVEL `const`, AT THE EXACT INDENTATION
 *  THEY HAD IN THE PAGE, and that is load-bearing rather than tidy. Measured
 *  on the built page: two of the twelve `dd`s emit a RUN OF SPACES —
 *  `“background screening”,` + 7 spaces + `though`, and `“trusted partners”.`
 *  + 5 spaces before `</dd>`. Both are JSX text lines that END IN AN HTML
 *  ENTITY with the sentence continuing on the next line, and Turbopack's JSX
 *  text folding leaves (indent − 1) spaces where tsc and standalone
 *  `@swc/core` both fold to one — verified by compiling the same fragment at
 *  four indentations through each (`scratchpad/jsx_ws_probe{,_swc}.mjs`) and
 *  finding neither reproduces it. So the emitted byte count of that run is a
 *  function of the SOURCE COLUMN. Nesting these twelve records inside
 *  `en.glossary.terms` would have moved them two levels deeper and silently
 *  grown both runs by four spaces. A module-level record with one level of
 *  keys puts `t:` at column 4 and the text at column 8 — exactly where the
 *  page's array-of-objects had them, byte for byte.
 *
 *  NO `as const`, per the recipe.
 */
import type { ReactNode } from "react";

/** The twelve glossary entries. See this file's header: the indentation here
 *  is the page's indentation and must stay that way, because two of these
 *  `d` fragments emit a whitespace run whose length is (source column − 1).
 *  `d` is rich text in every one of them, so all twelve are JSX leaves and
 *  every `&apos;`/`&ldquo;`/`&rdquo;` is kept EXACTLY as the page wrote it —
 *  inside JSX the entity is decoded before React sees it, which is the
 *  opposite of the rule for a string leaf. */
const TERMS = {
  primarySource: {
    t: "Primary source verification",
    d: (
      <>
        Confirming a claim with the organisation that originally issued the record — the university
        registrar, the transport authority, the court. <em>Not</em> a database that once copied that
        record. It is slower, and it is the only thing that survives a well-made forgery.
      </>
    ),
  },
  databaseScreening: {
    t: "Database screening",
    d: (
      <>
        Searching aggregated records for a name or number. Fast, and genuinely correct for sanctions
        and watchlists — where the list <em>is</em> the source. Misleading when sold as verification
        of a degree or a licence.
      </>
    ),
  },
  attestation: {
    t: "Attestation",
    d: (
      <>
        Official certification of a document&apos;s form, usually through embassies or foreign
        ministries. <em>Different from verification:</em> attestation says the paper is properly
        certified; verification asks the issuer whether the record exists. Gulf employers often
        need both.
      </>
    ),
  },
  bgv: {
    t: "BGV",
    d: (
      <>
        Background verification — the umbrella term for checking a person&apos;s identity, history
        and records before employment. Used interchangeably with &ldquo;background screening&rdquo;,
        though screening more often implies the database-only variety.
      </>
    ),
  },
  adverseMedia: {
    t: "Adverse media",
    d: (
      <>
        Negative news coverage associated with a person or company, searched as part of risk
        screening. Produces false positives on common names, so every hit should be reviewed by a
        person before it reaches a report.
      </>
    ),
  },
  unverifiable: {
    t: "Unverifiable",
    d: (
      <>
        A result meaning the source could not be reached — institution closed, records destroyed,
        registry offline. <em>Critically different from &ldquo;failed&rdquo;.</em> Systems built to
        return a binary often report this as a pass, which is the most common way verification
        misleads the person relying on it.
      </>
    ),
  },
  turnaround: {
    t: "Turnaround time (TAT)",
    d: (
      <>
        Time from submission to result. Worth asking what it is measured between — some vendors
        quote from when <em>they</em> start work, excluding the queue the candidate sat in.
      </>
    ),
  },
  consent: {
    t: "Consent",
    d: (
      <>
        The person&apos;s informed agreement to a specific check for a specific purpose. Legally
        required in most jurisdictions, and scope-bound: consent to verify a licence is not consent
        to pull a credit report.
      </>
    ),
  },
  dataResidency: {
    t: "Data residency",
    d: (
      <>
        Where personal data is stored and processed. Contractually fixable for storage; inherently
        cross-border for source confirmation, because the record lives where it was issued.
      </>
    ),
  },
  moonlighting: {
    t: "Moonlighting",
    d: (
      <>
        Holding concurrent employment, visible through overlapping statutory contributions. The
        overlap is a fact; whether it is a problem is a policy question for the employer, not a
        verdict from a vendor.
      </>
    ),
  },
  subProcessor: {
    t: "Sub-processor",
    d: (
      <>
        A third party that processes personal data on a processor&apos;s behalf — infrastructure,
        messaging, in-country partners. Should be named in a register, not described as
        &ldquo;trusted partners&rdquo;.
      </>
    ),
  },
  reVerification: {
    t: "Re-verification",
    d: (
      <>
        Running checks again on someone already verified — at role change, on a schedule, or after
        an incident. A check is a snapshot; re-verification is what stops it going stale.
      </>
    ),
  },
};

export const en = {
  /** The subtree's own breadcrumb rung: the hub's, and the parent rung on all
   *  five pages below it. One leaf, five renderings. */
  crumb: "Resources",

  /** The `.x3` index row's one connective word, shared by the blog index and
   *  the post page. See this file's header on why `checks` and `countries`
   *  are not in it. */
  row: {
    min: (mins: ReactNode) => <>{mins} min</>,
  },

  /** `/resources` — the hub. */
  hub: {
    closing: {
      heading: (
        <>
          Can't find your check <em>or your country?</em>
        </>
      ),
      sub: "Ask us directly — the answer is usually yes, with a caveat worth hearing.",
    },
    hero: {
      k: "Resources",
      h1: (
        <>
          How verification <em>actually works.</em>
        </>
      ),
      sub:
        "What each check answers, how long it takes where, and the vocabulary the industry uses " +
        "carelessly. Written to be useful before you buy anything.",
    },
    /** The three `.rcard3` destinations. Keyed by what they point at, which is
     *  the shape `./index`'s "Where the keys come from" section argues for —
     *  the href stays in the page. `m` is a function on two of the three
     *  because the card's last line is a count the page owns followed by this
     *  namespace's words; see the header. */
    cards: {
      checks: {
        k: "Library",
        t: "The check library",
        p: "Every check: what it answers, who confirms it, how long it takes, and what it cannot tell you.",
        m: (n: ReactNode) => <>{n} checks documented →</>,
      },
      countries: {
        k: "Guides",
        t: "Country guides",
        p: "What verification is like in a given country — the registries, the timelines, the local trap.",
        m: (n: ReactNode) => <>{n} countries documented →</>,
      },
      glossary: {
        k: "Reference",
        t: "Glossary",
        p: "Attestation, screening, primary source, adverse media — terms used loosely, defined precisely.",
        m: "Plain definitions →",
      },
    },
    /** The blog band. Its two cards are hand-written rather than read from
     *  `POSTS`: the first names one post BY ROUTE, which is an editorial
     *  choice about what to feature and therefore structure, and its kicker
     *  restates that post's category and read time as the page's own words.
     *  Pulling them from the catalogue would be a markup change with an HTML
     *  diff, not a copy move — recorded because it is a judgement. */
    blog: {
      k: "Writing",
      h: "From the blog.",
      lede: "Occasional, specific, and written by people who run these checks rather than a content team.",
      featured: {
        k: "Verification · 6 min",
        t: "Primary source vs. database",
        p: "Why two products that look identical on a feature list give you completely different answers.",
        m: "Read →",
      },
      all: {
        k: "Index",
        t: "All writing",
        p: "Everything we've published, newest first.",
        m: "Browse →",
      },
    },
  },

  /** `/resources/blog` — the editorial index. */
  blog: {
    crumb: "Blog",
    closing: {
      heading: (
        <>
          Something you want <em>written about?</em>
        </>
      ),
      sub: "We write what people actually ask us in sales calls.",
    },
    hero: {
      k: "Resources · Blog",
      h1: (
        <>
          Written by people who <em>run the checks.</em>
        </>
      ),
      sub:
        "Occasional and specific. No thought leadership, no listicles about the future of hiring — " +
        "just the things we end up explaining twice a week anyway.",
    },
    /** The lead card's `.from` cell. A separate leaf from `row.min` because
     *  the words differ ("6 min read" against "4 min"), not because the two
     *  markups do. */
    readMins: (mins: ReactNode) => <>{mins} min read</>,
    more: "More writing",
  },

  /** `/resources/blog/[slug]` — the post template (Template 6). Everything
   *  the article itself says is `lib/content/posts.ts`; these are the frame. */
  post: {
    closing: {
      heading: (
        <>
          Questions this raises? <em>Ask them.</em>
        </>
      ),
      sub: "We would rather answer awkward questions than avoid them.",
    },
    /** The byline strip: three catalogue values and two separators, as ONE
     *  node with six children. Splitting it into leaves either side of each
     *  `·` would put the separators in the page and the connective "min read"
     *  in the dictionary, which is the merge/split `./index` forbids. */
    meta: (category: ReactNode, date: ReactNode, mins: ReactNode) => (
      <>
        {category} · {date} · {mins} min read
      </>
    ),
    /** The in-page table of contents. `onThisPage` is read TWICE — as the
     *  `<nav>`'s `aria-label` and as its visible `.tk` heading — which is why
     *  it is a plain `string` and not JSX: a leaf's type is whatever English
     *  uses, and an `aria-label` cannot take a node. */
    onThisPage: "On this page",
    readNext: "Read next",
  },

  /** `/resources/checks` — the check library index. */
  checks: {
    crumb: "Check library",
    closing: {
      heading: (
        <>
          Need a check <em>that isn't listed?</em>
        </>
      ),
      sub: "We run more than we've documented. Ask, and we'll tell you the real timeline.",
    },
    hero: {
      k: "Resources · Check library",
      h1: (
        <>
          What each check <em>actually answers.</em>
        </>
      ),
      sub:
        "Not a feature list. Each entry states the question the check answers, who confirms it, " +
        "how long that takes, and — the part vendors skip — what it cannot tell you.",
    },
    /** The four `.strip3` figures, each carrying its own `<b>` for the reason
     *  `./countries.en.tsx#strip` sets out: the alternative is a label leaf
     *  beginning with a space, which §3 of the test rejects. `documented` is
     *  a function because its figure is `CHECKS.length`, which the page owns.
     *  `green` carries a `<span className="dot" />` — markup, travelling with
     *  the phrase for the reason that file gives for `inCountry`. */
    strip: {
      offered: <><b>33</b> checks offered</>,
      documented: (n: ReactNode) => <><b>{n}</b> documented here</>,
      fastest: <><b>15 min</b> fastest turnaround</>,
      green: <><span className="dot" /> green = usually within the hour</>,
    },
    note:
      "Times are measured from upload to report and assume the issuer responds normally · the " +
      "remaining checks in the catalogue of 33 are documented as their pages are written, rather " +
      "than published as templated stubs",
  },

  /** `/resources/countries` — the country guide index. */
  countries: {
    crumb: "Country guides",
    closing: {
      heading: (
        <>
          Your country <em>not here yet?</em>
        </>
      ),
      sub: "We reach 120+. Ask about yours and we'll tell you what's genuinely possible.",
    },
    hero: {
      k: "Resources · Country guides",
      h1: (
        <>
          Verification is <em>local.</em>
        </>
      ),
      sub:
        "A document is only properly verified where it was issued — so the process, the timeline " +
        "and the pitfalls change with the border. These are the countries we have written up so far.",
    },
    strip: {
      reachable: <><b>120+</b> countries reachable</>,
      written: (n: ReactNode) => <><b>{n}</b> guides written</>,
      offices: <><b>6</b> offices</>,
      inCountry: <><span className="dot" /> in-country, in language</>,
    },
    /** The `.xs` cell, which is a sentence built around a catalogue value or
     *  a fixed phrase when there is none. DUPLICATED word for word from
     *  `./countries.en.tsx#nearby`, deliberately and for the reason
     *  `./templates.en.tsx` gives for repeating `chrome.checkTable`'s column
     *  headings: that namespace is the country PAGE's, this one is the
     *  index's, and importing one to borrow two strings would make one
     *  keyset a dependency of another's. Two surfaces, two namespaces; a
     *  translator may render them differently and nothing breaks. */
    officeIn: (office: string) => `office in ${office}`,
    partnerNetwork: "partner network",
    /** The footnote ends in a link the page owns, so the `{" "}` between the
     *  text and the `<AppLink>` stays in the page — it is CONTENT, first
     *  corollary in `./index`'s byte-identity section — and this leaf stops
     *  short of it rather than carrying a trailing space §3 would reject. */
    note:
      "Guides are written where we have something specific to say · the remaining countries are " +
      "listed with indicative times on",
    globalCoverage: "global coverage",
  },

  /** `/resources/glossary`. */
  glossary: {
    crumb: "Glossary",
    closing: {
      heading: (
        <>
          Ask us to define <em>anything here.</em>
        </>
      ),
      sub: "Including the terms our own industry would rather keep vague.",
    },
    hero: {
      k: "Resources · Glossary",
      h1: (
        <>
          Words used loosely, <em>defined precisely.</em>
        </>
      ),
      /** The page wrote `industry&apos;s`. This is a STRING leaf, so it holds
       *  the DECODED character: JSX decodes the entity before React sees it
       *  and React re-escapes on the way out, so `&apos;` here would emit
       *  `&amp;apos;`. Second corollary in `./index`, and the exact mistake
       *  §3's widened entity guard exists for. */
      sub:
        "Much of this industry's vocabulary is deliberately soft, because precision would make " +
        "two very different products look different. These are the definitions we hold ourselves to.",
    },
    /** See the module-level `TERMS` above, and this file's header on why it is
     *  module-level. The page keys each row on `x.t`, so these twelve `t`
     *  leaves are React keys as well as copy — asserted in
     *  `tools/test/copy.test.ts` §15. */
    terms: TERMS,
  },
};

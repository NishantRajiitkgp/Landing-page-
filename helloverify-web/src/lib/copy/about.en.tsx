/** English copy for `app/[locale]/about` — one page, one route subtree, one
 *  namespace, per the rule at the end of `./index`'s recipe.
 *
 *  Every shape argument — why the English object is the schema, why rich text
 *  is real JSX, why there is no `as const` — is in `./index` and is not
 *  repeated. What is here is the per-decision note.
 *
 *  MEASURED: **47 matched nodes, 57 leaves — 1.21x**, against chrome's 3.2x.
 *  Asserted in `tools/test/copy.test.ts` §7 so it stays a measurement. The
 *  ratio is the lowest of the six route namespaces, for the reason `./index`
 *  gives in reverse — "the more a component is ALREADY data-driven, the more
 *  of its copy a `>text<` count misses". `/about` is the least data-driven
 *  page in this slice: two `alt=""`s (decorative, so not copy at all), no
 *  `aria-label`, no label arrays, 200 lines of hand-written prose the matcher
 *  reads almost completely. The 10 it misses all span lines or sit beside an
 *  element.
 *
 *  47 IS THIS AGENT'S RE-RUN, not the 39 the slice was briefed with. Same
 *  procedure — comments stripped first, `scratchpad/count_nodes.py` — and a
 *  20% disagreement, which is `./index`'s own warning that "the two matchers
 *  are not identical and the older number is not reproducible". The
 *  proportion is the claim.
 *
 *  ENTITIES ARE STORED DECODED — `Singapore's`, not `Singapore&apos;s`;
 *  `“Unverifiable”`, not `&ldquo;Unverifiable&rdquo;`; `&`, not `&amp;`. The
 *  second corollary of `./index`'s byte-identity section, verified against
 *  `.next/server/app/en/about.html`, which emits `Singapore&#x27;s` and a
 *  literal `“` — React escapes the apostrophe on the way out either way, and
 *  re-escapes a stored `&amp;` into `&amp;amp;`.
 */

export const en = {
  /** The single breadcrumb rung this page passes to `PageShell`. "Home" is
   *  `chrome.breadcrumb.home` and is rendered by `chrome/Breadcrumb.tsx`. */
  crumb: "About",

  /** The `ClosingCta` overrides. Both are prop overrides of the defaults in
   *  `chrome.closingCta`, so they are this page's copy, not chrome's. */
  closing: {
    heading: (
      <>
        Work with us, <em>or come work here.</em>
      </>
    ),
    sub: "Six offices, twelve hours apart, and always hiring people who like getting it right.",
  },

  hero: {
    kicker: "About us",
    h1: (
      <>
        We ask the people <em>who actually know.</em>
      </>
    ),
    sub:
      "HelloVerify confirms that a claim is true by asking the organisation that issued it — " +
      "the university, the employer, the registry, the court. Since 2018, twenty million times.",
    /** Label for the YC badge pill. A `<span>` of its own in the markup, so a
     *  string leaf; the badge itself is artwork the component owns. */
    backedBy: "Backed by",
  },

  /** The five figures in `.strip3`. Each is ONE leaf carrying its own `<b>`,
   *  not a `{figure, label}` pair, for two reasons that point the same way:
   *  the label half would be `" founded"` with a leading space, which
   *  `tools/test/copy.test.ts` §3 rejects and which `./index`'s `{" "}`
   *  corollary independently argues against; and a locale that puts the unit
   *  before the number needs the `<b>` to move with it. The figures are the
   *  canvas annotation's REAL list and the page header says so. */
  strip: {
    founded: <><b>2018</b> founded</>,
    checks: <><b>20M+</b> checks completed</>,
    clients: <><b>2,000+</b> clients</>,
    countries: <><b>120+</b> countries</>,
    offices: <><b>6</b> offices</>,
  },

  believe: {
    kicker: "What we believe",
    heading: <>Three opinions,<br />held firmly.</>,
    lede:
      "They are why the product is slower than some competitors in exactly one place, and " +
      "better everywhere it matters.",
    /** `n` is in the dictionary with the prose it numbers. It looks like
     *  structure and is not: `routing.ts` names `ar` as a locale this site
     *  expects to serve, and Arabic renders these as ٠١ ٠٢ ٠٣. Keeping the
     *  numeral with the item is what lets that happen without editing the
     *  page. Keyed by word rather than by "01" so the key survives a
     *  renumbering. */
    items: {
      one: {
        n: "01",
        t: "A copy of a record is not the record",
        p: "Aggregated databases tell you what someone once typed. We ask the institution that issued the document, which is the only thing a forgery cannot survive.",
      },
      two: {
        n: "02",
        t: "“Unverifiable” must be said out loud",
        p: "When a registry cannot be reached, we report that — rather than letting it quietly become a pass. It is the single most common way verification misleads.",
      },
      three: {
        n: "03",
        t: "Consent is not paperwork",
        p: "The person being verified sees what is being checked and agrees to it, every time. The alternative is surveillance with an invoice attached.",
      },
    },
  },

  /** The three path cards. Keyed by audience, NOT by href — the component
   *  writes all three `AppLink`s out longhand with no `key` prop, which is the
   *  same situation `chrome.footer.legal` is in and the same answer it took:
   *  keying by destination buys nothing when nothing is mapped. */
  serve: {
    kicker: "Who we serve",
    heading: <>Ministries and<br />mothers, same rails.</>,
    lede:
      "The same pipeline that supports work-pass decisions for a national ministry runs a " +
      "₹499 check on a school-run driver. That is deliberate.",
    cards: {
      governments: {
        tag: "Governments",
        h: "Authorities",
        p: "Work passes, licences, visas and trade registries — including Singapore's Ministry of Manpower.",
      },
      business: {
        tag: "Business",
        h: "Employers",
        p: "From 2,000+ enterprise clients to a first hire at a five-person company.",
      },
      individuals: {
        tag: "Individuals",
        h: "Families",
        p: "The driver, the nanny, the tenant — verification that used to be only for corporations.",
      },
    },
  },

  /** The six offices. A city and its line, two leaves each, because the
   *  markup is `<b>{city}</b><span>{where}</span>` — two elements, each with
   *  one text child, so no leading-space problem and no `<b>` to carry. */
  offices: {
    kicker: "Where we are",
    heading: <>Six offices,<br />on purpose.</>,
    lede:
      "Verification has to happen where the document was issued. Offices in the places our " +
      "clients' people come from is not a growth story — it is the product working.",
    list: {
      noida: { city: "Noida", where: "India · head office" },
      manila: { city: "Manila", where: "Philippines" },
      singapore: { city: "Singapore", where: "Singapore" },
      dubai: { city: "Dubai", where: "UAE" },
      cairo: { city: "Cairo", where: "Egypt" },
      newYork: { city: "New York", where: "United States" },
    },
  },

  credentials: {
    kicker: "Credentials",
    heading: <>Checked,<br />ourselves.</>,
    lede: "A verification company that cannot evidence its own claims is telling on itself.",
    /** The per-page gloss on the Ministry of Manpower card, SPLIT INTO TWO
     *  LEAVES rather than made a `(link: ReactNode) => …` function.
     *
     *  `./index` describes the function shape for exactly this — a sentence
     *  wrapping a link whose href the component owns — and `chrome.consent`
     *  records why the chrome slice declined it: folding the three children
     *  (`text`, `{" "}`, `<a>`) into one changes the bytes React writes,
     *  because it writes a `<!-- -->` between the first two. Confirmed on this
     *  page's own build output. Same decision, same reason; a locale that
     *  needs the link mid-sentence gets the function on the day the HTML is
     *  allowed to move.
     *
     *  The card body itself is `CREDENTIAL_MARKS` in `lib/content/company.ts`
     *  and stays there — that table is the site's claims, not its copy. */
    momGloss: "Work-pass credential verification with Singapore's Ministry of Manpower —",
    momStory: "the story →",
    securityCta: "Security & compliance, in full",
  },
};

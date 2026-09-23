/** The copy layer's runtime half (BUILD-SPEC §7, §3.4).
 *
 *  WHAT THIS FILE IS FOR, given that the guarantee is a COMPILE-time one.
 *  `src/lib/copy/index.ts` argues that a missing key is `tsc`'s job and this
 *  file does not try to re-do it — `tsc` is better at it and `npm run
 *  typecheck` already runs. What a type cannot check is everything the type
 *  is derived FROM, and that is what is here:
 *
 *    - `Dictionary<T>` is `Record<Locale, T>`, so it gates the KEYS of the
 *      registry. It cannot notice that the `hi` object is `en` copy-pasted,
 *      because that typechecks perfectly. Loop 2 compares key PATHS, which
 *      is the same check, and it is the one that survives someone writing
 *      `hi: en` to make the build go green.
 *    - the `&amp;` trap in the byte-identity section. A dictionary leaf
 *      spelling `&amp;` emits `&amp;amp;` and is a `string` either way, so
 *      nothing in the type system sees it. Section 3.
 *    - step 1b of the recipe. A non-default locale module that forgets its
 *      `: <Ns>Copy` annotation still typechecks and silently loses the
 *      stray-key half of the guarantee — measured, see that header. Section 5
 *      is the only thing that can catch it, and it is a source assertion for
 *      the same reason `locales.test.ts` §7 is one.
 *    - the `breadcrumbs.ts` coupling, which is two modules agreeing on a
 *      string with no type between them. Section 4.
 *
 *  `pick()` rather than `copy()` throughout, and that is the whole reason the
 *  two are in different modules: `copy()` reaches `next-intl/server` ->
 *  `next/headers`, which does not resolve outside a Next runtime. Importing
 *  it here fails at collection with `Cannot find module 'next/headers'` —
 *  `locales.test.ts` records the same failure for the root layout.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";

import { pick, type Dictionary } from "../../src/lib/copy/index.ts";
import { CHROME } from "../../src/lib/copy/chrome.ts";
import { BUSINESS } from "../../src/lib/copy/business.ts";
import { TEMPLATES } from "../../src/lib/copy/templates.ts";
import { SECTIONS } from "../../src/lib/copy/sections.ts";
import { BLOCKS } from "../../src/lib/copy/blocks.ts";
import { FAQ_ORDER } from "../../src/app/[locale]/business/enterprise/content.ts";
import { ABOUT } from "../../src/lib/copy/about.ts";
import { CONTACT } from "../../src/lib/copy/contact.ts";
import { CHECKS_COPY } from "../../src/lib/copy/checks.ts";
import { COUNTRIES_COPY } from "../../src/lib/copy/countries.ts";
import { LEGAL_COPY } from "../../src/lib/copy/legal.ts";
import { ROOT } from "../../src/lib/copy/root.ts";
import { PLATFORM } from "../../src/lib/copy/platform.ts";
import { GOVERNMENTS } from "../../src/lib/copy/governments.ts";
import { INDIVIDUALS } from "../../src/lib/copy/individuals.ts";
import { RESOURCES } from "../../src/lib/copy/resources.ts";
import {
  ARTEFACT_ORDER,
  CERT_IDS,
  FAQ_ORDER as SEC_FAQ_ORDER,
  RESIDENCY_ORDER,
} from "../../src/app/[locale]/platform/security-compliance/content.ts";
import { CHECKS } from "../../src/lib/content/checks.ts";
import { CREDENTIAL_MARKS, type CredentialMark } from "../../src/lib/content/company.ts";
import { COUNTRIES } from "../../src/lib/content/countries.ts";
import { LEGAL } from "../../src/lib/content/legal.ts";
import { POSTS } from "../../src/lib/content/posts.ts";
import { routing } from "../../src/lib/i18n/routing.ts";
import { breadcrumbList } from "../../src/lib/seo/schema/breadcrumbs.ts";

import { check } from "./harness.ts";

/** THE REGISTRY THE TWO LOOPS RUN OVER. Recipe step 4 is adding one line
 *  here, and that is deliberately the only bookkeeping a new namespace costs
 *  — anything more and it would be skipped. `Dictionary<unknown>` because
 *  every namespace has a different `T` and the loops only look at shape. */
const NAMESPACES: readonly { name: string; dict: Dictionary<unknown> }[] = [
  { name: "chrome", dict: CHROME },
  { name: "business", dict: BUSINESS },
  { name: "templates", dict: TEMPLATES },
  { name: "sections", dict: SECTIONS },
  { name: "blocks", dict: BLOCKS },
  /** The ten `app/[locale]/**` route subtrees, one namespace each per the
   *  rule at the end of `lib/copy/index.ts`'s recipe. `checks`, `countries`
   *  and `legal` export `*_COPY` because their page files already import a
   *  `CHECKS` / `COUNTRIES` / `LEGAL` from `lib/content/**` — two modules with
   *  one name would be the first step toward the merge section 8 exists to
   *  prevent. */
  { name: "about", dict: ABOUT },
  { name: "contact", dict: CONTACT },
  { name: "checks", dict: CHECKS_COPY },
  { name: "countries", dict: COUNTRIES_COPY },
  { name: "legal", dict: LEGAL_COPY },
  { name: "root", dict: ROOT },
  { name: "platform", dict: PLATFORM },
  { name: "governments", dict: GOVERNMENTS },
  { name: "individuals", dict: INDIVIDUALS },
  { name: "resources", dict: RESOURCES },
];

/** Dotted paths to every LEAF. A leaf is anything that is not a plain object:
 *  a string, a function (the `(link: ReactNode) => …` shape the header
 *  describes), or a React element — which is an object, hence the
 *  `$$typeof` guard. Without it a `<>a <em>b</em> c</>` leaf would be walked
 *  into and compared as `props.children[1].type`, so two locales whose rich
 *  text puts the `<em>` in different places would be reported as drift when
 *  moving it is exactly what a translator is for. */
function leafPaths(value: unknown, prefix = ""): string[] {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.prototype.hasOwnProperty.call(value, "$$typeof")
  ) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([k, v]) => leafPaths(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

/** Every string leaf, with its path, for the content assertions. */
function stringLeaves(value: unknown, prefix = ""): [string, string][] {
  if (typeof value === "string") return [[prefix, value]];
  if (value === null || typeof value !== "object") return [];
  if (Object.prototype.hasOwnProperty.call(value, "$$typeof")) return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    stringLeaves(v, prefix ? `${prefix}.${k}` : k),
  );
}

const DEFAULT = routing.defaultLocale;

/** ANY HTML entity, not the five this file started with.
 *
 *  WIDENED 23 SEP 2026, and the widening is a measurement rather than
 *  tidiness. The original was `/&(amp|lt|gt|quot|#\d+|nbsp);/`, written for
 *  the four `&amp;` leaves the `chrome` slice had to decode. The
 *  `app/[locale]` slice that followed had to decode `&ldquo;`, `&rdquo;` and
 *  seven `&apos;` as well — `/about` alone carried all three — and NONE of
 *  them match that pattern. A leaf spelling `&apos;` emits `&amp;apos;` in the
 *  page exactly as `&amp;` emits `&amp;amp;`, so the narrow guard would have
 *  passed nine leaves it exists to catch.
 *
 *  Safe against the copy actually shipped: an entity needs `&`, then letters
 *  or a numeric reference, then `;` with no space between. Every ampersand in
 *  this repo's dictionaries is a free-standing "&" with spaces around it
 *  ("Contact & support", "Security & compliance, in full"), and section 9
 *  asserts the widened pattern still does not fire on them. */
const ENTITY = /&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]{1,31});/;

/** A string leaf holding a tag. `./index` says rich text is REAL JSX in a
 *  `.tsx` dictionary, which means a `<` or `>` inside a `string` leaf is
 *  either markup that was stringified by mistake — in which case React
 *  escapes it and the page shows the angle brackets — or prose that should
 *  have been a JSX leaf. Nothing in this repo's copy legitimately contains
 *  one; the arrows are `→` and the separators are `·` and `/`. */
const TAGGISH = /[<>]/;

console.log("1. loop one — every namespace serves every locale in routing.locales");

/** THE FIRST LOOP. `Dictionary<T>` makes a missing locale TS2741 on the
 *  registry (measured; see the header of `lib/copy/index.ts`), so this is the
 *  runtime twin of a check that has already passed by the time it runs. It is
 *  worth running anyway for one reason: `pick()` does the lookup the app does,
 *  and a registry built by spread or by a helper — which the next namespace
 *  might be — can satisfy the type and still not answer. */
/** `pick()` THROWS on an unserved locale, which is the right posture for the
 *  app and the wrong one for a loop whose whole job is to report which locale
 *  is missing: an uncaught throw here fails COLLECTION, so Vitest reports one
 *  broken file instead of one red assertion naming the locale. Caught, so the
 *  loop below survives to report every namespace. */
function safePick(dict: Dictionary<unknown>, locale: string): unknown {
  try {
    return pick(dict, locale);
  } catch {
    return null;
  }
}

for (const ns of NAMESPACES) {
  for (const locale of routing.locales) {
    const got = safePick(ns.dict, locale);
    check(
      `${ns.name}: pick() answers for ${locale}`,
      typeof got === "object" && got !== null,
      Object.keys(ns.dict),
    );
  }
  check(
    `${ns.name}: the registry declares exactly routing.locales, no extras`,
    [...Object.keys(ns.dict)].sort().join(",") === [...routing.locales].sort().join(","),
    Object.keys(ns.dict),
  );
}

console.log("2. loop two — every locale has the same leaf paths as the default");

/** THE SECOND LOOP, and the one that earns its keep. With `en` the only
 *  served locale this compares `en` to itself and cannot fail — that is
 *  stated rather than hidden, and section 6 constructs the drifted state so
 *  the assertion is shown to be capable of failing before `hi` exists. */
for (const ns of NAMESPACES) {
  const reference = leafPaths(safePick(ns.dict, DEFAULT)).join("\n");
  for (const locale of routing.locales) {
    if (locale === DEFAULT) continue;
    const got = leafPaths(safePick(ns.dict, locale)).join("\n");
    check(
      `${ns.name}: ${locale} has the same leaf paths as ${DEFAULT}`,
      got === reference,
      { missing: reference.split("\n").filter((p) => !got.includes(p)) },
    );
  }
  check(
    `${ns.name}: ${DEFAULT} has at least one leaf (the walker is not silently empty)`,
    leafPaths(pick(ns.dict, DEFAULT)).length > 0,
  );
}

console.log("3. the &amp; trap, and other things a `string` type cannot see");

for (const ns of NAMESPACES) {
  for (const locale of routing.locales) {
    const leaves = stringLeaves(pick(ns.dict, locale));

    /** THE SECOND COROLLARY of the byte-identity rule. JSX decodes `&amp;`
     *  before React sees it and React re-escapes on the way out, so a
     *  dictionary leaf carrying the entity emits `&amp;amp;` on every page
     *  that renders it. Four leaves in `chrome` replaced JSX that DID spell
     *  it `&amp;` (`Contact &amp; support` twice, `See plans &amp; pricing`,
     *  and the footer's `Manpower & education` family), so this is the exact
     *  mistake this migration had four chances to make. */
    const entities = leaves.filter(([, v]) => ENTITY.test(v));
    check(
      `${ns.name}/${locale}: no leaf carries an HTML entity`,
      entities.length === 0,
      entities,
    );

    /** See `TAGGISH`. Added with the `app/[locale]` slice, where nine leaves
     *  are JSX fragments carrying `<em>`, `<br />` or `<b>` and the mistake
     *  of writing one as a quoted string is one keystroke away. */
    const tagged = leaves.filter(([, v]) => TAGGISH.test(v));
    check(
      `${ns.name}/${locale}: no string leaf contains a tag — rich text is JSX`,
      tagged.length === 0,
      tagged,
    );

    /** A leaf that is empty, or padded, renders as a changed byte. Neither is
     *  ever what a translator meant. */
    const blank = leaves.filter(([, v]) => v.trim() !== v || v === "");
    check(
      `${ns.name}/${locale}: no leaf is empty or has edge whitespace`,
      blank.length === 0,
      blank,
    );

    /** JSX folds any run of whitespace to one space, so a double space in a
     *  dictionary leaf is a space the pre-migration markup could not have
     *  emitted. This caught nothing; it is here because the two multi-line
     *  leaves in `chrome` (`footer.blurb`, `consent.body`) are joined by hand
     *  and a trailing space on the wrong fragment is invisible in review. */
    const doubled = leaves.filter(([, v]) => v.includes("  "));
    check(
      `${ns.name}/${locale}: no leaf contains a double space`,
      doubled.length === 0,
      doubled,
    );
  }
}

console.log("4. the breadcrumbs.ts coupling, held by an assertion instead of a comment");

/** `lib/seo/schema/breadcrumbs.ts` prepends `{ label: "Home", href: "/" }` to
 *  mirror what `chrome/Breadcrumb.tsx` renders, and `check-schema.mjs`
 *  compares the two PER PAGE — on the built output, which means a
 *  disagreement costs a full build to discover and shows up on all 31 inner
 *  pages at once. Now that the visible rung is `chrome.breadcrumb.home`, the
 *  two sides are a dictionary leaf and a literal in another module with no
 *  type between them.
 *
 *  Running the real builder rather than reading its source: the source scan
 *  is `locales.test.ts` §7's tool of last resort, justified there because the
 *  layout cannot be imported. This module can be, so the honest assertion is
 *  the emitted node. */
const trail = breadcrumbList([{ label: "Business", href: "/business" }, { label: "SMB" }], DEFAULT);

check(
  "breadcrumbList() prepends a Home rung at all",
  trail !== null && trail.itemListElement.length === 3,
  trail?.itemListElement.length,
);
check(
  "that rung's name IS chrome.breadcrumb.home — change one side and this fails",
  trail !== null &&
    // @ts-expect-error schema-dts types `itemListElement` as a union; the
    // builder only ever pushes `ListItem`, and `schema.test.ts` indexes it
    // the same way.
    trail.itemListElement[0].name === pick(CHROME, DEFAULT).breadcrumb.home,
  {
    // @ts-expect-error see above
    schema: trail?.itemListElement[0]?.name,
    dictionary: pick(CHROME, DEFAULT).breadcrumb.home,
  },
);

console.log("5. recipe step 1b — a non-default locale module must be annotated");

/** THE ONE SOURCE ASSERTION HERE, and it needs the justification
 *  `locales.test.ts` §7 sets the bar for.
 *
 *  Measured while writing this layer: `export const hi = { … }` WITHOUT a
 *  `: ChromeCopy` annotation still typechecks with a stray key, because
 *  excess-property checking only applies to a fresh object literal assigned
 *  to a typed target and `hi` reaches the registry as a variable. The
 *  missing-key half still fires; the typo half silently does not. There is no
 *  way to express "this module's export is annotated" in the type system —
 *  that is the point — so the only available gate is the text.
 *
 *  It is scoped to NON-DEFAULT locales. `<ns>.en.tsx` must NOT be annotated:
 *  it is the schema, and annotating it would check it against itself and pin
 *  nothing. With `en` the only locale this loop has no files to read, which
 *  is stated rather than disguised — section 6 runs it against a constructed
 *  module so it is known to work the day the first one lands.
 */
const ANNOTATION = /export const \w+\s*:\s*\w+Copy\s*=/;

function annotationVerdict(source: string): boolean {
  return ANNOTATION.test(source);
}

/** `<ns>.<locale>.tsx`, or `.ts` if the locale needs no JSX.
 *
 *  COMMENTS STRIPPED, and that is not tidying — it is the same trap
 *  `locales.test.ts` §7 records, hit again on the first run of this
 *  assertion. `chrome.en.tsx`'s header says "NO `as const`, per the recipe",
 *  so the raw scan matched the prose that documents the rule and reported the
 *  file as breaking it. */
function localeModule(ns: string, locale: string): { path: string; source: string } | null {
  for (const ext of [".tsx", ".ts"]) {
    const url = new URL(`../../src/lib/copy/${ns}.${locale}${ext}`, import.meta.url);
    if (!existsSync(url)) continue;
    const source = readFileSync(url, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    return { path: `${ns}.${locale}${ext}`, source };
  }
  return null;
}

for (const ns of NAMESPACES) {
  for (const locale of routing.locales) {
    if (locale === DEFAULT) continue;
    const mod = localeModule(ns.name, locale);
    check(
      `${ns.name}: a module exists on disk for ${locale}`,
      mod !== null,
      `src/lib/copy/${ns.name}.${locale}.{tsx,ts}`,
    );
    check(
      `${ns.name}.${locale}: annotated \`: ${ns.name[0].toUpperCase()}${ns.name.slice(1)}Copy\` (recipe step 1b)`,
      mod !== null && annotationVerdict(mod.source),
      mod?.source.split("\n").find((l) => l.startsWith("export const")),
    );
  }

  /** The default locale's module must NOT be annotated: it is the schema.
   *  This one CAN fail today, and it is the only assertion in section 5 that
   *  can while `en` stands alone. */
  const def = localeModule(ns.name, DEFAULT);
  check(
    `${ns.name}.${DEFAULT}: NOT annotated — the English object is the schema`,
    def !== null && !annotationVerdict(def.source) && !/\bas const\b/.test(def.source),
    def?.source.split("\n").find((l) => l.startsWith("export const")),
  );
}

console.log("6. breaking each guard on purpose — a check that cannot fail is not one");

/** Sections 2 and 5 are no-ops with one locale served. Rather than ship two
 *  assertions that have never been red, the drifted states are constructed
 *  here and the PREDICATES are run against them directly. This is the shape
 *  `locales.test.ts` uses for `localeContractDrift`: the guard takes its
 *  inputs as parameters, so a failing world can be built without editing a
 *  source file. */

const EN = pick(CHROME, DEFAULT);

/** Loop 2's predicate, against a `hi` missing one leaf. */
const short = { ...EN, nav: { ...EN.nav, cta: undefined } } as unknown;
delete (short as { nav: { cta?: unknown } }).nav.cta;
check(
  "loop 2 WOULD fail on a locale missing a leaf",
  leafPaths(short).join("\n") !== leafPaths(EN).join("\n"),
  leafPaths(EN).filter((p) => !leafPaths(short).includes(p)),
);

/** Loop 2's predicate, against a `hi` with a leaf the default does not have. */
const long = { ...EN, nav: { ...EN.nav, ctaa: "Talk to sales" } };
check(
  "loop 2 WOULD fail on a locale with a leaf the default lacks",
  leafPaths(long).join("\n") !== leafPaths(EN).join("\n"),
  leafPaths(long).filter((p) => !leafPaths(EN).includes(p)),
);

/** …and that it does NOT fire on rich text whose markup moved, which is the
 *  false positive the `$$typeof` guard in `leafPaths` exists to prevent. */
const moved = { ...EN, closingCta: { ...EN.closingCta, heading: "beginning verified" } };
check(
  "loop 2 does NOT fire when only a rich-text leaf's markup differs",
  leafPaths(moved).join("\n") === leafPaths(EN).join("\n"),
  leafPaths(moved).filter((p) => !leafPaths(EN).includes(p)),
);

/** Section 3's predicate, against the exact mistake it is for. */
check(
  "the &amp; guard WOULD fire on a leaf spelling the entity",
  ENTITY.test("See plans &amp; pricing"),
);
check(
  "…and does not fire on the plain ampersand that is actually shipped",
  !ENTITY.test(EN.closingCta.plans) && EN.closingCta.plans === "See plans & pricing",
  EN.closingCta.plans,
);

/** THE WIDENING, broken on purpose. These three are the entities the
 *  `app/[locale]` slice actually had to decode and the OLD pattern passed:
 *  `/about` shipped `&ldquo;Unverifiable&rdquo;` and `Singapore&apos;s` in
 *  its JSX, so a copy-paste into the dictionary was the live failure mode.
 *  The old pattern is written out here rather than kept as a constant, so
 *  that deleting it cannot make this assertion vacuous. */
const NARROW = /&(amp|lt|gt|quot|#\d+|nbsp);/;
for (const spelt of ["&ldquo;Unverifiable&rdquo;", "Singapore&apos;s", "09&ndash;18 IST"]) {
  check(
    `the widened entity guard fires on ${spelt}, and the narrow one did not`,
    ENTITY.test(spelt) && !NARROW.test(spelt),
    spelt,
  );
}
check(
  "…and the widened guard still passes the plain ampersands that ship",
  ["Contact & support", "See plans & pricing", "Security & compliance, in full"].every(
    (s) => !ENTITY.test(s),
  ),
);

/** Section 3's new tag predicate, against a rich-text leaf written as a
 *  string — which typechecks, because `string` is a valid leaf type. */
check(
  "the tag guard WOULD fire on rich text quoted as a string",
  TAGGISH.test("We ask the people <em>who actually know.</em>"),
);
check(
  "…and does not fire on the arrows and separators that do ship",
  !TAGGISH.test("the story →") && !TAGGISH.test("Country guide · x"),
);

/** Section 5's predicate, against a module with and without the annotation. */
check(
  "the step-1b guard WOULD fail on an unannotated locale module",
  !annotationVerdict('import { en } from "./chrome.en";\nexport const hi = {\n};\n'),
);
check(
  "…and passes on an annotated one",
  annotationVerdict(
    'import type { ChromeCopy } from "./chrome";\nexport const hi: ChromeCopy = {\n};\n',
  ),
);

/** `pick()`'s own posture: loud on a locale that is not served. `"zz"` rather
 *  than `"hi"` deliberately — `hi` is the locale this repo is expected to add,
 *  and an assertion that turns red the day it ships is an assertion that gets
 *  deleted. `zz` is a reserved private-use code that will never be served. */
let threw = "";
try {
  pick(CHROME, "zz");
} catch (e) {
  threw = (e as Error).message;
}
check(
  "pick() throws on an unserved locale, and names the two edits",
  threw.includes("no dictionary for locale") && threw.includes("routing.locales"),
  threw,
);

console.log("7. the numbers this slice is measured by");

/** Recorded so the next namespace has a baseline rather than a feeling. The
 *  `>text<` matcher in `lib/copy/index.ts`'s header is a 3x undercount — see
 *  that header — and this is the arithmetic behind it. */
check(
  "chrome/en holds 76 string leaves plus the one rich-text leaf",
  stringLeaves(EN).length === 76 && leafPaths(EN).length === 77,
  { strings: stringLeaves(EN).length, all: leafPaths(EN).length },
);

/** 24 of those 77 are what the `>text<` matcher found. The other 53 are the
 *  undercount, itemised: 10 `aria-label`s, 5 `alt`s, 2 `ClosingCta` prop
 *  defaults that were parameter defaults rather than JSX, 35 labels already
 *  living as string properties in `SiteNav`'s `LINKS` and `SiteFooter`'s
 *  `COLS`/`CERTS`, and `consent.body` — a real text node the matcher drops
 *  because the node contains a `{" "}`. */
check(
  "the >text< matcher saw 24 of them; 53 is the undercount",
  10 + 5 + 2 + 35 + 1 === 53 && 24 + 53 === leafPaths(EN).length,
  leafPaths(EN).length,
);

/** THE `app/[locale]` SLICE, per namespace. Same purpose as the two chrome
 *  assertions above and the same posture: a number that has been measured,
 *  written down, and made to fail if it moves.
 *
 *  `matched` is the `>text<` matcher re-run over the pre-migration files with
 *  comments stripped, the procedure `lib/copy/index.ts`'s header describes
 *  (`scratchpad/count_nodes.py`, `git show` of the four files no other agent
 *  had open). It does NOT agree with the counts the slice was briefed with —
 *  47/34/19/16/4/4 here against 39/32/13/12/6/6 there — which is the header's
 *  own warning about this matcher restated with fresh numbers: two
 *  implementations of "a text node" disagree by up to 46%, so the PROPORTION
 *  is the claim and the absolute count is not.
 *
 *  The ratio is therefore lower than chrome's 3.2x on every namespace, and
 *  the header predicts exactly that in reverse: the multiplier tracks how
 *  much of an area is ALREADY tables, and these six route files iterate
 *  catalogues rather than carrying label arrays of their own. `root` inverts
 *  it — one leaf against four matched nodes — because four of its five nodes
 *  are in `opengraph-image.tsx`, which is deliberately not migrated. See
 *  `lib/copy/root.en.tsx` for the content-hash measurement behind that.
 */
/** ONE CORRECTION TO `lib/copy/index.ts`'s TABLE OF CODES, measured while
 *  breaking these guards and recorded here rather than by editing that header
 *  under three concurrent agents. It lists "a key missing from a non-default
 *  locale -> TS2741 (confirmed)". Re-run against these namespaces
 *  (`scratchpad/prove_type_gate.py`, a throwaway `src/lib/copy/__probe.ts`
 *  rather than an edit to `routing.locales`), an `AboutCopy`-annotated module
 *  missing SEVERAL keys is **TS2740**, not TS2741 — TypeScript switches codes
 *  at one missing property versus many. Same check, same failure, different
 *  number, and the same kind of condition the header already attaches to its
 *  TS2561/TS2353 entry. The other three fired exactly as documented: TS2741
 *  on a registry short a locale, TS2561 on a stray key in an ANNOTATED
 *  module, and NO ERROR AT ALL on a stray key in an unannotated one — which
 *  is the hole section 5 exists to close, reproduced on `contact`. */
const SLICE: readonly { name: string; dict: Dictionary<unknown>; matched: number; leaves: number }[] = [
  { name: "about", dict: ABOUT, matched: 47, leaves: 57 },
  { name: "contact", dict: CONTACT, matched: 34, leaves: 39 },
  { name: "checks", dict: CHECKS_COPY, matched: 16, leaves: 25 },
  { name: "countries", dict: COUNTRIES_COPY, matched: 19, leaves: 25 },
  { name: "legal", dict: LEGAL_COPY, matched: 4, leaves: 14 },
  { name: "root", dict: ROOT, matched: 4, leaves: 1 },
];

for (const ns of SLICE) {
  check(
    `${ns.name}/en holds ${ns.leaves} leaves (matcher saw ${ns.matched})`,
    leafPaths(pick(ns.dict, DEFAULT)).length === ns.leaves,
    { measured: leafPaths(pick(ns.dict, DEFAULT)).length, expected: ns.leaves },
  );
}

/** 161 for 124 is 1.30x, against chrome's 3.2x, and the spread inside the six
 *  is the interesting part: `legal` is 3.5x and `about` is 1.21x. The header's
 *  rule predicts it — `legal`'s page is almost entirely `d.sections.map(…)`
 *  over a catalogue, so what little copy it has is in attributes and next to
 *  interpolations where the matcher cannot see it, while `/about` is 200 lines
 *  of hand-written prose that the matcher reads almost completely. */
check(
  "the six route namespaces total 161 leaves for 124 matched nodes",
  SLICE.reduce((a, b) => a + b.leaves, 0) === 161 &&
    SLICE.reduce((a, b) => a + b.matched, 0) === 124,
  { leaves: SLICE.reduce((a, b) => a + b.leaves, 0), matched: SLICE.reduce((a, b) => a + b.matched, 0) },
);

console.log("8. the boundary between page-shell copy and the content catalogues");

/** THE ASSERTION THAT KEEPS A CATALOGUE OUT OF THE DICTIONARY.
 *
 *  Three of this slice's six namespaces sit on templated routes whose pages
 *  render `lib/content/{checks,countries,legal}.ts`, and the failure mode is
 *  not a missing key — it is a well-meaning agent moving `c.name`, a check's
 *  `caveat`, or a paragraph of ported privacy policy into a dictionary
 *  because it is, after all, words on a page. `lib/seo/copy.ts` derives all
 *  28 programmatic routes' titles and descriptions from those same records
 *  precisely so there is one copy of them; `lib/content/legal.ts` in
 *  particular holds text ported verbatim from production and awaiting
 *  counsel, which is the one category that must not reach a translator.
 *
 *  A comment cannot hold that line. This can: every string anywhere in the
 *  three catalogues, against every string leaf in the three namespaces.
 *  Equality rather than containment, because containment would fire on
 *  "Resources" appearing inside a sentence and a guard that cries wolf is a
 *  guard that gets deleted.
 */
function allStrings(value: unknown, out: Set<string>): Set<string> {
  if (typeof value === "string") {
    out.add(value);
  } else if (Array.isArray(value)) {
    for (const v of value) allStrings(v, out);
  } else if (value !== null && typeof value === "object") {
    for (const v of Object.values(value)) allStrings(v, out);
  }
  return out;
}

const CATALOGUES: readonly {
  name: string;
  dict: Dictionary<unknown>;
  data: unknown;
  /** The module `data` came from, when it is not `lib/content/<name>.ts`.
   *  Added with the two `resources` rows below: that namespace is checked
   *  against two different catalogues, so the row name and the file name
   *  stopped being the same string and the failure message named a path
   *  that does not exist. Found by breaking the guard and reading what it
   *  said, which is the point of breaking it. */
  file?: string;
}[] = [
  { name: "checks", dict: CHECKS_COPY, data: CHECKS },
  { name: "countries", dict: COUNTRIES_COPY, data: COUNTRIES },
  { name: "legal", dict: LEGAL_COPY, data: LEGAL },
  /** `resources` against TWO of the three catalogues its six pages iterate,
   *  and the missing third is the finding rather than an oversight.
   *
   *  `/resources/blog`, `/resources/blog/[slug]` and `/resources/countries`
   *  bleed NOTHING — 0 of 198 post strings and 0 of 84 country strings appear
   *  as a leaf — so the exact-equality guard applies to them at full strength,
   *  and `posts.ts` is the one this slice most needed it for: four
   *  verbatim-ported articles, the same "awaiting review, not awaiting a
   *  translator" category as `lib/content/legal.ts`.
   *
   *  `CHECKS` is NOT here because it would fire on one leaf that is not a
   *  boundary violation: `resources.glossary.terms.moonlighting.t` is
   *  "Moonlighting", and so is a check name. The glossary entry is a
   *  definition of an industry term that happens to share a word with a
   *  product; absorbing it was never possible, because the glossary page does
   *  not read `CHECKS` at all. A guard that cries wolf is a guard that gets
   *  deleted, which is the reason this loop compares by equality in the first
   *  place — so the check-library index is covered by section 15's
   *  sentence-shaped guard instead, which is blind to shared labels and
   *  catches exactly the prose this one exists to keep out. */
  { name: "resources/posts", dict: RESOURCES, data: POSTS, file: "posts" },
  { name: "resources/countries", dict: RESOURCES, data: COUNTRIES, file: "countries" },
];

for (const c of CATALOGUES) {
  const catalogue = allStrings(c.data, new Set<string>());
  const bled = stringLeaves(pick(c.dict, DEFAULT)).filter(([, v]) => catalogue.has(v));
  check(
    `${c.name}: no dictionary leaf repeats a value from lib/content/${c.file ?? c.name}.ts`,
    bled.length === 0,
    { bled, catalogueStrings: catalogue.size },
  );
}

/** The same guard, broken. A dictionary that has absorbed one check name is
 *  constructed and run through the predicate, so the assertion above is known
 *  to be capable of failing rather than merely green. `CHECKS[0].name` rather
 *  than a hand-written string: a literal would keep passing the day someone
 *  renames the check. */
const catalogue = allStrings(CHECKS, new Set<string>());
const merged = { ...pick(CHECKS_COPY, DEFAULT), oops: CHECKS[0].name };
check(
  "the boundary guard WOULD fire on a dictionary that absorbed a check name",
  stringLeaves(merged).filter(([, v]) => catalogue.has(v)).length === 1,
  CHECKS[0].name,
);
check(
  "…and the catalogues it compares against are not empty",
  catalogue.size > 50 && allStrings(LEGAL, new Set<string>()).size > 50,
  { checks: catalogue.size, legal: allStrings(LEGAL, new Set<string>()).size },
);

console.log("9. the numbers for `business` and `templates`");

/** RE-MEASURED on the two namespaces added 23 Sep 2026, and recorded for the
 *  same reason section 7 records `chrome`'s: the multiplier in
 *  `lib/copy/index.ts`'s header ("multiply by ~3") is what the next agent
 *  will size their work with, and it is only useful as a range taken from
 *  real slices rather than one number taken from one.
 *
 *  It IS a range, and the spread is the finding. A comment-stripped `>text<`
 *  run over the pre-migration sources scored 206 nodes across the six
 *  `app/[locale]/business/**` files and 10 in `components/templates/**`; the
 *  dictionaries hold 475 and 11:
 *
 *      chrome     26 nodes -> 77 leaves   3.0x   (24 by the run in §7)
 *      business  206 nodes -> 475 leaves  2.3x
 *      templates  10 nodes -> 11 leaves   1.1x
 *
 *  `lib/copy/index.ts` predicts exactly that shape: the undercount tracks how
 *  much of a file is ALREADY a table, and `VerticalPage` has none — every
 *  word it renders beyond these eleven arrives as a prop from one of its six
 *  pages. So ~3x is the ceiling for a hand-written component directory, ~1x
 *  the floor for a template, and a route subtree full of
 *  `LANES`/`ROWS`/`PACKS`/`FAQS` arrays lands between. The brief that
 *  commissioned `business` counted 181 and 9 with a different matcher; both
 *  runs are stated rather than reconciled, which is the posture §7 already
 *  takes for chrome's 24-versus-26.
 *
 *  Only the LEAF side is asserted. The node counts came from a script over
 *  snapshots that no longer exist, so an assertion on them would be an
 *  assertion against nothing — the same reason §7 states 24 as arithmetic. */
const BIZ = pick(BUSINESS, DEFAULT);
const TPL = pick(TEMPLATES, DEFAULT);

check(
  "business/en holds 431 string leaves and 44 rich-text or function leaves",
  stringLeaves(BIZ).length === 431 && leafPaths(BIZ).length === 475,
  { strings: stringLeaves(BIZ).length, all: leafPaths(BIZ).length },
);

/** The 44, itemised, so changing one of them has to change this line. Six
 *  `<h1>`s and five `ClosingCta` headings carry an `<em>`; the 25 trust-strip
 *  items are `<b>figure</b> tail`, which is TWO children and therefore one
 *  rich-text leaf rather than two string leaves — splitting them would put
 *  two adjacent text children where one sits today, and React's SSR writes
 *  `<!-- -->` between those (measured with `renderToString` before the move);
 *  five `FaqSection` heads carry a `<br />`; and three are FUNCTION leaves
 *  taking a node the page owns — the two link sentences that would otherwise
 *  need a leaf ending in a space, and the `{n} checks · ready in` label whose
 *  count is `p.lines.length`. */
check(
  "…and the 44 are 6 h1 + 5 closing + 25 strip + 5 faqHead + 3 functions",
  6 + 5 + 25 + 5 + 3 === leafPaths(BIZ).length - stringLeaves(BIZ).length,
  leafPaths(BIZ).length - stringLeaves(BIZ).length,
);

check(
  "templates/en holds 10 string leaves plus the one rich-text leaf",
  stringLeaves(TPL).length === 10 && leafPaths(TPL).length === 11,
  { strings: stringLeaves(TPL).length, all: leafPaths(TPL).length },
);

/** The three column headings are DUPLICATED between `templates.table` and
 *  `chrome.checkTable`, on purpose: `components/chrome/CheckTable.tsx` and
 *  `components/templates/VerticalPage.tsx` each write their own `.tbl3`, and
 *  importing one namespace into the other to share three strings would make
 *  one keyset a dependency of another's — the "fourth structural rule to
 *  explain for one string" `chrome.en.tsx` rejects for `logoHome`. Asserted
 *  rather than commented so that the day the template adopts
 *  `chrome/CheckTable`, this line is what says the two became one. It is NOT
 *  a claim that they must agree in a second locale: both sides read `en`,
 *  where they are the same words by construction. */
check(
  "templates.table repeats chrome.checkTable's three headings in en",
  TPL.table.check === EN.checkTable.check &&
    TPL.table.turnaround === EN.checkTable.turnaround &&
    TPL.table.confirmedWith === EN.checkTable.confirmedWith,
  [TPL.table.check, TPL.table.turnaround, TPL.table.confirmedWith],
);

/** THE ONE COUPLING THIS SLICE ADDED, and section 4's argument applies
 *  unchanged: two modules agreeing with no type between them.
 *  `app/[locale]/business/enterprise/content.ts` now holds the ORDER of the
 *  five questions and `business.enterprise.faqs` holds the words. A key
 *  renamed on one side IS a tsc error — `FAQ_ORDER` is typed
 *  `keyof …["faqs"]`. What tsc cannot say is that the order is COMPLETE:
 *  dropping an entry typechecks perfectly and silently stops rendering a
 *  question, and `<FaqSection>` builds the `FAQPage` node from the same
 *  array, so the page and the structured data would go quiet together. */
check(
  "every enterprise FAQ is in the render order, and none is asked twice",
  FAQ_ORDER.length === Object.keys(BIZ.enterprise.faqs).length &&
    new Set(FAQ_ORDER).size === FAQ_ORDER.length,
  { order: FAQ_ORDER, dictionary: Object.keys(BIZ.enterprise.faqs) },
);

/** …and the guard shown capable of failing, the shape section 6 uses: the
 *  predicate run against a tuple with one question dropped, and against one
 *  that asks the same question twice. */
const shortOrder = FAQ_ORDER.slice(0, -1);
const dupOrder = [...FAQ_ORDER.slice(0, -1), FAQ_ORDER[0]];
check(
  "…and it WOULD fail on an order that drops a question",
  shortOrder.length !== Object.keys(BIZ.enterprise.faqs).length,
  { order: shortOrder.length, dictionary: Object.keys(BIZ.enterprise.faqs).length },
);
check(
  "…and on one that asks the same question twice",
  new Set(dupOrder).size !== dupOrder.length,
  dupOrder,
);

console.log("10. the numbers for `sections` and `blocks`, and the keys they had to keep");

/** RE-MEASURED for the two component directories migrated 23 Sep 2026, and
 *  recorded per FILE rather than per namespace, because the per-file spread
 *  is the only part of this that is new information.
 *
 *  `matched` is the comment-stripped `>text<` run from `lib/copy/index.ts`'s
 *  header, over the pre-migration sources. It reproduces that header's own
 *  `components/sections/** 152` and `components/blocks/** 27` exactly, which
 *  is worth stating: §7 and §9 both had to record a matcher disagreement
 *  with the brief they were given, and this run did not.
 *
 *  THE FINDING IS THAT THE MULTIPLIER IS NOT A MULTIPLIER. Overall it is
 *  2.88x, almost exactly the ~3x the header tells the next agent to budget.
 *  Per file it runs from 0.67x to 29.5x:
 *
 *      Hero          9 nodes ->  6 leaves   0.67x
 *      Numbers      14 ->  13                0.93x
 *      Demo2        39 ->  43                1.10x
 *      Checks        7 ->  58                8.3x
 *      Packages      7 ->  59                8.4x
 *      PeopleStrip   2 ->  52               26x
 *      LeadMock      0 ->  17                infinite
 *
 *  Both tails have one cause each and neither is noise. ABOVE 3x is the
 *  header's own rule — the more of a file is already a table, the less a
 *  `>text<` matcher can see — and `PeopleStrip`'s two person tables, at 50
 *  of its 52 leaves, are the extreme of it; `LeadMock` scores literally zero
 *  because it has no JSX text node at all. BELOW 1x is new, and it is a fact
 *  about THIS tree rather than about matchers: the homepage is a two-tree
 *  port, so a band writes its heading once per breakpoint, the matcher
 *  counts both, and the dictionary holds ONE leaf wherever the two strings
 *  are equal. `Hero` says the same six things at both widths and therefore
 *  has fewer leaves than nodes. An agent sizing a two-tree area by ~3x will
 *  over-buy; one sizing a table-driven area by it will under-buy by 8x.
 */
const EN_SECTIONS = pick(SECTIONS, DEFAULT);
const EN_BLOCKS = pick(BLOCKS, DEFAULT);

const BANDS: Record<string, readonly [number, number]> = {
  hero: [9, 6],
  compliance: [4, 5],
  numbers: [14, 13],
  why: [8, 24],
  howItWorks: [5, 18],
  whoItsFor: [7, 29],
  consumer: [10, 30],
  checks: [7, 58],
  international: [6, 40],
  packages: [7, 59],
  peopleStrip: [2, 52],
  contact: [11, 14],
  customerStory: [15, 18],
  demo2: [39, 43],
  presence: [8, 29],
};

const BLOCK_FILES: Record<string, readonly [number, number]> = {
  leadMock: [0, 17],
  helloVPhone: [15, 22],
  panels: [12, 38],
};

for (const [k, v] of Object.entries(EN_SECTIONS)) {
  const row = BANDS[k];
  check(
    `sections.${k}: ${row ? row[1] : "?"} leaves (the matcher saw ${row ? row[0] : "?"})`,
    row !== undefined && leafPaths(v).length === row[1],
    { measured: leafPaths(v).length, expected: row },
  );
}

for (const [k, v] of Object.entries(EN_BLOCKS)) {
  const row = BLOCK_FILES[k];
  check(
    `blocks.${k}: ${row ? row[1] : "?"} leaves (the matcher saw ${row ? row[0] : "?"})`,
    row !== undefined && leafPaths(v).length === row[1],
    { measured: leafPaths(v).length, expected: row },
  );
}

check(
  "sections holds 438 leaves for 152 nodes and blocks 77 for 27 — 2.88x over both",
  leafPaths(EN_SECTIONS).length === 438 &&
    leafPaths(EN_BLOCKS).length === 77 &&
    Object.values(BANDS).reduce((a, b) => a + b[0], 0) === 152 &&
    Object.values(BLOCK_FILES).reduce((a, b) => a + b[0], 0) === 27,
  { sections: leafPaths(EN_SECTIONS).length, blocks: leafPaths(EN_BLOCKS).length },
);

/** The 13 non-string leaves in `sections`, itemised so moving one has to
 *  move this line. Twelve are rich text the artboard exporter left split
 *  around an `&amp;` or a `<br />` — three `whoItsFor` tags, one `whoItsFor`
 *  heading, `checks.items.directorsGst.name`, two `checks.lanes` headings,
 *  `packages.more`, `packages.lines.credit`, `packages.packs.visaHealth.tt`
 *  and two `demo2.checks` labels — and the thirteenth is `packages.tot`, the
 *  one FUNCTION leaf in either namespace. */
check(
  "sections: 425 string leaves, 12 rich-text leaves and 1 function leaf",
  stringLeaves(EN_SECTIONS).length === 425 &&
    leafPaths(EN_SECTIONS).length - stringLeaves(EN_SECTIONS).length === 13 &&
    typeof EN_SECTIONS.packages.tot === "function",
  { strings: stringLeaves(EN_SECTIONS).length, all: leafPaths(EN_SECTIONS).length },
);

/** The 2 in `blocks`: `panels.read.checks.c1.l` (another `&amp;` split) and
 *  `leadMock.fields.mobile.value`, which is a whole `<span>` carrying a
 *  `style` — moved as a node rather than re-expressed, because its three
 *  children are what React's separators depend on. */
check(
  "blocks: 75 string leaves and 2 rich-text leaves, one of them a whole node",
  stringLeaves(EN_BLOCKS).length === 75 &&
    leafPaths(EN_BLOCKS).length - stringLeaves(EN_BLOCKS).length === 2,
  { strings: stringLeaves(EN_BLOCKS).length, all: leafPaths(EN_BLOCKS).length },
);

/** THE THIRD COROLLARY, held by an assertion for the first time.
 *
 *  `lib/copy/index.ts` says a `key=` expression must keep resolving to the
 *  string it resolved to before, and until now that was a comment and a
 *  careful diff. This slice moved five of them into dictionaries —
 *  `Why`'s evidence rows key on the label, `HowItWorks`' four steps key on
 *  the step name in three separate maps, `LeadMock`'s six rows key on the
 *  field label and its three chips key on the chip label — so a rename in
 *  any of those leaves is now a changed React key and a changed flight
 *  payload on every page that renders the band. The literals below are the
 *  PRE-MIGRATION strings, typed out from the snapshots, which is the point:
 *  reading them back out of the dictionary would assert nothing.
 */
check(
  "Why's four evidence rows still key on the labels they keyed on",
  [
    EN_SECTIONS.why.evidence.read.label,
    EN_SECTIONS.why.evidence.confirmed.label,
    EN_SECTIONS.why.evidence.artefact.label,
    EN_SECTIONS.why.evidence.reviewed.label,
  ].join("|") === "Read by|Confirmed|Artefact|Reviewed",
  Object.values(EN_SECTIONS.why.evidence).map((e) => e.label),
);

check(
  "HowItWorks' four steps still key on Upload/Read/Confirm/Report",
  [
    EN_SECTIONS.howItWorks.steps.upload.label,
    EN_SECTIONS.howItWorks.steps.read.label,
    EN_SECTIONS.howItWorks.steps.confirm.label,
    EN_SECTIONS.howItWorks.steps.report.label,
  ].join("|") === "Upload|Read|Confirm|Report",
  Object.values(EN_SECTIONS.howItWorks.steps).map((s) => s.label),
);

check(
  "LeadMock's six desktop rows still key on the labels they keyed on",
  [
    EN_BLOCKS.leadMock.fields.fullName.label,
    EN_BLOCKS.leadMock.fields.company.label,
    EN_BLOCKS.leadMock.fields.email.label,
    EN_BLOCKS.leadMock.fields.mobile.label,
    EN_BLOCKS.leadMock.fields.services.label,
    EN_BLOCKS.leadMock.fields.message.label,
  ].join("|") === "Full name|Company|Business email|Mobile|Services of interest|Message",
  Object.values(EN_BLOCKS.leadMock.fields).map((f) => f.label),
);

check(
  "…and the phone's two differing rows carry the same two labels",
  EN_BLOCKS.leadMock.fields.servicesMob.label === "Services of interest" &&
    EN_BLOCKS.leadMock.fields.message.label === "Message",
  [EN_BLOCKS.leadMock.fields.servicesMob.label, EN_BLOCKS.leadMock.fields.message.label],
);

check(
  "LeadMock's three segment chips still key on Business/Government/Individual",
  Object.values(EN_BLOCKS.leadMock.segments).join("|") === "Business|Government|Individual",
  Object.values(EN_BLOCKS.leadMock.segments),
);

/** The function leaf, against the template literal it replaced. Nine cards
 *  render this and `Packages.tsx`'s header measured the alternative spelling
 *  at 72 bytes of `<!-- -->`, so the string has to be identical and it has to
 *  arrive as ONE child. */
check(
  "packages.tot(n) reproduces the template literal it replaced",
  EN_SECTIONS.packages.tot(4) === "4 checks · ready in" &&
    EN_SECTIONS.packages.tot(3) === "3 checks · ready in",
  EN_SECTIONS.packages.tot(4),
);

/** …and `leafPaths` counts it as one leaf rather than walking it, which is
 *  what makes the 438 above comparable with chrome's 77. */
check(
  "leafPaths treats the function leaf as one leaf",
  leafPaths(EN_SECTIONS.packages.tot).join("|") === "",
  leafPaths(EN_SECTIONS.packages.tot),
);

console.log("11. breaking the section 10 guards on purpose");

/** Every predicate above, run against a world where it should be red. Same
 *  shape as section 6: the guard takes its input as a value, so a failing
 *  world is built rather than a source file edited. */
check(
  "the per-file leaf count WOULD fail on a band that gained a leaf",
  leafPaths({ ...EN_SECTIONS.hero, extra: "Backed by" }).length !== BANDS.hero[1],
  leafPaths({ ...EN_SECTIONS.hero, extra: "Backed by" }).length,
);

check(
  "…and on one that lost one",
  leafPaths({ backedBy: EN_SECTIONS.hero.backedBy }).length !== BANDS.hero[1],
  leafPaths({ backedBy: EN_SECTIONS.hero.backedBy }).length,
);

/** THE KEY GUARD, broken. A renamed label is the exact mistake it exists for
 *  — it typechecks, it renders the same words in a different place, and it
 *  silently changes a React key. */
const renamed = { ...EN_SECTIONS.why.evidence, read: { label: "Read", value: "x" } };
check(
  "the key guard WOULD fail on a renamed evidence label",
  [renamed.read.label, renamed.confirmed.label, renamed.artefact.label, renamed.reviewed.label].join(
    "|",
  ) !== "Read by|Confirmed|Artefact|Reviewed",
  renamed.read.label,
);

/** SECTION 3's `&amp;` guard, pointed at these namespaces. Eleven leaves in
 *  `sections` and one in `blocks` replaced JSX that spelled the entity, and
 *  every one of them is rich text rather than a string — which is precisely
 *  why the guard cannot see them and why they had to be moved as JSX. This
 *  shows it firing on the mistake that WAS available: writing one of them
 *  out as a flat string with the entity still in it. */
check(
  "the &amp; guard WOULD fire on packages.more written as a flat string",
  stringLeaves({ more: "Trade licence, vendor risk &amp; premium packages" }).some(([, v]) =>
    /&(amp|lt|gt|quot|#\d+|nbsp);/.test(v),
  ),
);

check(
  "…and does not fire on the JSX leaf actually shipped, because it is not a string",
  stringLeaves({ more: EN_SECTIONS.packages.more }).length === 0 &&
    typeof EN_SECTIONS.packages.more !== "string",
  typeof EN_SECTIONS.packages.more,
);

/** The `tot` guard, broken on the spelling that would put the number and the
 *  words in two children. It is a STRING comparison here, so what it catches
 *  is the wording drifting; the two-children mistake is caught by
 *  `html-identity.mjs` and by the comment at the call site. */
check(
  "the tot guard WOULD fail if the label's wording drifted",
  ((n: number) => `${n} checks, ready in`)(4) !== EN_SECTIONS.packages.tot(4),
  EN_SECTIONS.packages.tot(4),
);

console.log("12. the fourth corollary — `await copy()` in a fragment that ends in text");

/** THE GUARD FOR THE MISTAKE THAT COST A BUILD.
 *
 *  `lib/copy/index.ts`'s fourth corollary: an async Server Component opens a
 *  Fizz segment, and React closes a segment whose output ends in a TEXT node
 *  with a `<!-- -->`, because it must assume the suspension split a text
 *  node. So `<>{…}{" "}</>` gains a separator the day the component takes an
 *  await, and `<div>{…}{" "}</div>` does not — the wrapper's close tag clears
 *  the flag first.
 *
 *  Nothing in the type system can see this and nothing short of a full build
 *  can either: it cost 62 pages of comparison to find three separators. A
 *  SOURCE SCAN is therefore the only gate available, which is the same
 *  justification §5 gives for the step-1b assertion and `locales.test.ts` §7
 *  for its own.
 *
 *  SCOPED TO THE TWO DIRECTORIES THIS SLICE OWNS, and that is a concurrency
 *  decision rather than a claim about where the rule applies — the rule is
 *  general, four other namespaces are in flight as this is written, and a
 *  guard that goes red on someone else's half-finished file is a guard that
 *  gets deleted. Widening it is adding a string to `TAIL_DIRS`.
 */
const TAIL_DIRS = ["sections", "blocks"];

function fragmentTextTails(source: string): string[] {
  const clean = source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const out: string[] = [];
  for (const m of clean.matchAll(/^(?:export )?async function (\w+)/gm)) {
    const open = clean.indexOf("return (", m.index ?? 0);
    if (open < 0) continue;
    let i = open + "return (".length;
    let depth = 1;
    while (i < clean.length && depth > 0) {
      if (clean[i] === "(") depth += 1;
      else if (clean[i] === ")") depth -= 1;
      i += 1;
    }
    const body = clean.slice(open + "return (".length, i - 1).trim();
    /** Only a FRAGMENT can end in a text node at the top level. When the
     *  outermost node is an element its own close tag is the last thing
     *  pushed, and that is what makes the eleven other async components in
     *  this slice byte-neutral despite their trailing `{" "}`. */
    if (!body.startsWith("<>") || !body.endsWith("</>")) continue;
    const inner = body.slice(2, -3).replace(/\s+$/, "");
    if (/(\{['"] ['"]\}|[A-Za-z0-9.,!?…·])$/.test(inner)) out.push(m[1]);
  }
  return out;
}

/** ONE ALLOWED ENTRY, and the measurement that buys it.
 *
 *  `sections/Demo2.tsx` matches the detector and is NOT a defect. The
 *  coordinator ran five real builds: `Demo2` async, `Demo2` behind a sync
 *  wrapper, `Demo2` reverted to HEAD, `Numbers` reverted to HEAD, and both
 *  reverted. All five put `<main>` at 88 separators. The wrapper that
 *  silenced this detector bought nothing and cost nine lines on a file two
 *  from the `max-lines` cap, so it was reverted and this entry written
 *  instead. The separator that band's junction DID lose is a located,
 *  unattributed deviation recorded in `lib/copy/index.ts`.
 *
 *  A value, not a bare list, because an allowlist without the reason beside
 *  it is how a guard turns into a rubber stamp. And it is checked for
 *  STALENESS below: an entry that no longer matches is an entry to delete,
 *  which is the failure mode an allowlist normally hides. */
const TAIL_ALLOW: Record<string, string> = {
  "sections/Demo2.tsx:Demo2":
    "five real builds measured this one byte-neutral; see the dated deviation " +
    "in lib/copy/index.ts",
};

const tailOffenders: string[] = [];
for (const dir of TAIL_DIRS) {
  const base = new URL(`../../src/components/${dir}/`, import.meta.url);
  for (const file of readdirSync(base)) {
    if (!file.endsWith(".tsx")) continue;
    for (const fn of fragmentTextTails(readFileSync(new URL(file, base), "utf8"))) {
      tailOffenders.push(`${dir}/${file}:${fn}`);
    }
  }
}

check(
  "no UNALLOWED async component in sections/ or blocks/ ends a fragment in text",
  tailOffenders.filter((o) => TAIL_ALLOW[o] === undefined).length === 0,
  tailOffenders.filter((o) => TAIL_ALLOW[o] === undefined),
);

check(
  "…and every allowlisted entry still matches, so none is stale",
  Object.keys(TAIL_ALLOW).every((k) => tailOffenders.includes(k)),
  { allowed: Object.keys(TAIL_ALLOW), found: tailOffenders },
);

/** The detector, against the two states it has to tell apart. The first is
 *  `Demo2` and `MockFields` as they shipped for one round; the second is the
 *  shape they were fixed into, and the third is the eleven that were never
 *  wrong. Transcribed rather than read off disk: reading the fixed files back
 *  would assert that the detector agrees with itself. */
check(
  "…and it WOULD name an async component whose fragment ends in `{\" \"}`",
  fragmentTextTails(
    'export async function Demo2() {\n  return (\n    <>\n      <Band />\n      {" "}\n    </>\n  );\n}',
  ).join("|") === "Demo2",
  fragmentTextTails('export async function Demo2() {\n  return (\n    <>\n      <Band />\n      {" "}\n    </>\n  );\n}'),
);

check(
  "…and does NOT name the sync wrapper it was fixed into",
  fragmentTextTails(
    'export function Demo2() {\n  return (\n    <>\n      <Band />\n      {" "}\n    </>\n  );\n}\n' +
      "async function Band() {\n  return (\n    <div className=\"wrap\">\n      <b />\n    </div>\n  );\n}",
  ).length === 0,
);

check(
  "…and does NOT name an async component whose trailing text is inside its wrapper",
  fragmentTextTails(
    'async function PackCard() {\n  return (\n    <div className="rc">\n      <b />\n      {" "}\n    </div>\n  );\n}',
  ).length === 0,
);

/** The allowlist's own two failure modes, both shown. An unlisted offender
 *  must still fail, and a listed one that has been fixed must be reported as
 *  stale rather than sitting there forever granting an exemption nobody
 *  needs. */
const pretendOffenders = ["sections/Demo2.tsx:Demo2", "blocks/LeadMock.tsx:MockFields"];
check(
  "the allowlist WOULD still fail on an offender that is not listed",
  pretendOffenders.filter((o) => TAIL_ALLOW[o] === undefined).join("|") ===
    "blocks/LeadMock.tsx:MockFields",
  pretendOffenders.filter((o) => TAIL_ALLOW[o] === undefined),
);
check(
  "…and the staleness check WOULD fail once the allowed one is fixed",
  !Object.keys(TAIL_ALLOW).every((k) => ([] as string[]).includes(k)),
  Object.keys(TAIL_ALLOW),
);

console.log("13. the numbers for `platform` and `governments`, and the keys they had to keep");

/** RE-MEASURED for the two route subtrees migrated 23 Sep 2026, per FILE, for
 *  the reason §10 gives: the per-file spread is the only part of this that is
 *  new information.
 *
 *  `matched` is the comment-stripped `>text<` run from `lib/copy/index.ts`'s
 *  header, over the pre-migration sources (`scratchpad/pg_count_nodes.py`). It
 *  does NOT agree with the counts the slice was briefed with — 156/150 here
 *  against 93/83 there — and a same-line variant of the same matcher scores
 *  121/127. Three implementations of "a text node" spread by 68%, which is §7's
 *  finding restated with fresh numbers: the PROPORTION is the claim.
 *
 *      platform/page.tsx                 28 nodes ->  26 leaves   0.93x
 *      platform/coverage                 33       ->  99          3.0x
 *      platform/technology               52       ->  65          1.25x
 *      platform/security-compliance      43       ->  99          2.3x
 *      governments/page.tsx              46       ->  65          1.41x
 *      governments/health                15       ->  95          6.3x
 *      governments/immigration           15       ->  97          6.5x
 *      governments/manpower-education    15       ->  95          6.3x
 *      governments/trade                 15       ->  93          6.2x
 *      .../ministry-of-manpower          44       ->  48          1.09x
 *
 *  Over both subtrees: 785 leaves for 306 matched nodes, 2.57x — inside the
 *  2.88x §10 measured for `sections`/`blocks` and well above `templates`' 1.1x,
 *  with the whole spread coming from the four vertical pages.
 *
 *  **THE FOUR VERTICAL PAGES ARE A NEW HIGH, AND THEY ARE THE RULE RATHER THAN
 *  AN EXCEPTION TO IT.** `lib/copy/index.ts` says the undercount tracks how
 *  much of a file is ALREADY a table and tells the next agent to budget ~3x;
 *  these four come in over 6x, twice that ceiling. The cause is structural:
 *  each of them is ONE JSX element — a `<VerticalPage …/>` call — whose ninety
 *  words arrive as attributes and as `lanes`/`pills`/`rows`/`steps`/`faqs`
 *  object properties. A `>text<` matcher can see exactly fifteen things on such
 *  a page: four `<b>` strip fragments, the `<em>` in the `h1` and in the
 *  closing heading, the `<br />` in the FAQ head, and the word before the link
 *  in the table note. The two pages in the same subtree that are ordinary
 *  markup score 1.4x and 1.1x on the same run.
 *
 *  So the sizing advice that comes out of this round, stated as a shape rather
 *  than a number: a props-driven template's CALL SITES are the
 *  highest-multiplier files found so far, and `components/templates/
 *  VerticalPage.tsx` itself is 1.1x for the mirror-image reason — every word it
 *  renders beyond its own eleven arrives from one of these six pages.
 *
 *  Only the LEAF side is asserted, per §9: the node counts came from a script
 *  over sources the working tree has since moved past, so an assertion on them
 *  would be an assertion against nothing. They are stated as arithmetic below
 *  so that the ratio in the comment cannot drift from the table. */
const EN_PLATFORM = pick(PLATFORM, DEFAULT);
const EN_GOVERNMENTS = pick(GOVERNMENTS, DEFAULT);

const PLATFORM_FILES: Record<string, readonly [number, number]> = {
  hub: [28, 26],
  coverage: [33, 99],
  technology: [52, 65],
  security: [43, 99],
};

const GOVERNMENT_FILES: Record<string, readonly [number, number]> = {
  hub: [46, 65],
  health: [15, 95],
  immigration: [15, 97],
  manpowerEducation: [15, 95],
  trade: [15, 93],
  mom: [44, 48],
};

for (const [k, v] of Object.entries(PLATFORM_FILES)) {
  check(
    `platform.${k}: ${v[1]} leaves (the matcher saw ${v[0]})`,
    leafPaths(EN_PLATFORM[k as keyof typeof EN_PLATFORM]).length === v[1],
    { measured: leafPaths(EN_PLATFORM[k as keyof typeof EN_PLATFORM]).length, expected: v },
  );
}

for (const [k, v] of Object.entries(GOVERNMENT_FILES)) {
  check(
    `governments.${k}: ${v[1]} leaves (the matcher saw ${v[0]})`,
    leafPaths(EN_GOVERNMENTS[k as keyof typeof EN_GOVERNMENTS]).length === v[1],
    { measured: leafPaths(EN_GOVERNMENTS[k as keyof typeof EN_GOVERNMENTS]).length, expected: v },
  );
}

/** The totals, and the ONE leaf each namespace holds outside its per-page
 *  tables: `platform.crumb`, the "Platform" rung all four pages render, and
 *  `governments.crumb` plus `governments.coverageLink`, the label on the link
 *  into `/platform/coverage` that all four vertical pages share. Both are the
 *  "a label per destination" shape `chrome.footer.links` uses, which is why
 *  they sit above the pages rather than inside four of them. */
check(
  "platform holds 290 leaves for 156 matched nodes — four pages plus the shared crumb",
  leafPaths(EN_PLATFORM).length === 290 &&
    Object.values(PLATFORM_FILES).reduce((a, b) => a + b[0], 0) === 156 &&
    Object.values(PLATFORM_FILES).reduce((a, b) => a + b[1], 0) + 1 === leafPaths(EN_PLATFORM).length,
  { measured: leafPaths(EN_PLATFORM).length },
);

check(
  "governments holds 495 leaves for 150 matched nodes — six pages plus crumb and coverageLink",
  leafPaths(EN_GOVERNMENTS).length === 495 &&
    Object.values(GOVERNMENT_FILES).reduce((a, b) => a + b[0], 0) === 150 &&
    Object.values(GOVERNMENT_FILES).reduce((a, b) => a + b[1], 0) + 2 ===
      leafPaths(EN_GOVERNMENTS).length,
  { measured: leafPaths(EN_GOVERNMENTS).length },
);

/** The rich-text and function leaves, itemised so moving one has to move this
 *  line — §9's shape for `business`. BOTH ITEMISATIONS WERE WRONG BY ONE ON
 *  THE FIRST RUN and are corrected here rather than rounded to: `platform` was
 *  written as 4 `FaqSection` heads when the hub has no FAQ band at all, and
 *  `governments` as 10 `<em>` headings when six pages carry two each. The
 *  arithmetic is in the assertion so that neither can drift again.
 *
 *  `platform`: 8 `<em>` headings (four `h1`s and four `ClosingCta`s), 16
 *  trust-strip items (`<b>figure</b> tail`, which is TWO children and therefore
 *  one leaf — splitting them would put two adjacent text children where one
 *  sits today), 3 `FaqSection` heads — the hub has none —
 *  `security.certs.h`'s `<br />`, the two accessibility paragraphs carrying a
 *  mid-sentence `<strong>`, and ONE function leaf, `coverage.note`, which takes
 *  the anchor the page owns because a string leaf would have had to end in a
 *  space. */
check(
  "platform: 259 string leaves and 31 rich-text or function leaves",
  stringLeaves(EN_PLATFORM).length === 259 &&
    leafPaths(EN_PLATFORM).length - stringLeaves(EN_PLATFORM).length === 31 &&
    8 + 16 + 3 + 1 + 2 + 1 === 31 &&
    typeof EN_PLATFORM.coverage.note === "function",
  { strings: stringLeaves(EN_PLATFORM).length, all: leafPaths(EN_PLATFORM).length },
);

/** `governments`: 12 `<em>` headings (six `h1`s and six `ClosingCta`
 *  headings — every page in the subtree has both), 24 trust-strip items, 4
 *  `FaqSection` heads (the hub and the case study have no FAQ band), the three
 *  `mom.stats` values (`120<em>+</em>` and friends), `mom.prose.outcomes`'
 *  three `<br />`s, and FOUR function leaves — one table note per vertical
 *  page. */
check(
  "governments: 447 string leaves and 48 rich-text or function leaves",
  stringLeaves(EN_GOVERNMENTS).length === 447 &&
    leafPaths(EN_GOVERNMENTS).length - stringLeaves(EN_GOVERNMENTS).length === 48 &&
    12 + 24 + 4 + 3 + 1 + 4 === 48 &&
    [
      EN_GOVERNMENTS.health.note,
      EN_GOVERNMENTS.immigration.note,
      EN_GOVERNMENTS.manpowerEducation.note,
      EN_GOVERNMENTS.trade.note,
    ].every((f) => typeof f === "function"),
  { strings: stringLeaves(EN_GOVERNMENTS).length, all: leafPaths(EN_GOVERNMENTS).length },
);

/** The four function leaves, against the text they replaced. Each renders as a
 *  FRAGMENT whose last child is the anchor, so the sentence keeps its trailing
 *  space as JSX rather than as an edge-whitespace string leaf — which §3
 *  rejects — and the page still passes the same two children to `.note`. Only
 *  the preamble is asserted: the anchor is the page's. */
for (const [page, fn] of [
  ["health", EN_GOVERNMENTS.health.note],
  ["immigration", EN_GOVERNMENTS.immigration.note],
  ["manpowerEducation", EN_GOVERNMENTS.manpowerEducation.note],
  ["trade", EN_GOVERNMENTS.trade.note],
] as const) {
  const rendered = fn("LINK");
  check(
    `governments.${page}.note() is a fragment, not a string that ends in a space`,
    typeof rendered === "object" && rendered !== null && !("trim" in (rendered as object)),
    typeof rendered,
  );
}

/** THE THIRD COROLLARY, pinned for this slice. `lib/copy/index.ts` says a
 *  `key=` expression must keep resolving to the string it resolved to before,
 *  and these two subtrees moved 79 of them into dictionaries:
 *
 *    - `/platform/coverage` keys its three region blocks on the region heading
 *      and its 24 country rows on the country name;
 *    - `/platform/security-compliance` keys four residency rows on `nm` and six
 *      artefact rows on `t`;
 *    - all four vertical pages reach `VerticalPage`, which keys lanes on `gt`,
 *      pills on `n` and table rows on `nm` — 12 + 48 + 24 across the four.
 *      (Its `strip` keys on the ARRAY INDEX and is therefore untouched.)
 *
 *  The literals below are the PRE-MIGRATION strings, typed out from the
 *  pre-change build's `.next/server/app/en/**.html`, which is the point:
 *  reading them back out of the dictionary would assert nothing. */
check(
  "coverage's three region blocks still key on the headings they keyed on",
  Object.values(EN_PLATFORM.coverage.regions).join("|") ===
    "South & Southeast Asia|Middle East & Africa|Europe & the Americas",
  Object.values(EN_PLATFORM.coverage.regions),
);

check(
  "…and its 24 country rows still key on the 24 names they keyed on",
  Object.values(EN_PLATFORM.coverage.countries).map((x) => x.c).join("|") ===
    "India|Philippines|Singapore|Indonesia|Vietnam|Sri Lanka|Nepal|Bangladesh|" +
      "United Arab Emirates|Saudi Arabia|Egypt|Qatar|Kuwait|Kenya|Nigeria|South Africa|" +
      "United Kingdom|Germany|France|Netherlands|Poland|United States|Canada|Brazil",
  Object.values(EN_PLATFORM.coverage.countries).map((x) => x.c),
);

check(
  "security-compliance's four residency rows still key on the names they keyed on",
  Object.values(EN_PLATFORM.security.residency).map((r) => r.nm).join("|") ===
    "Candidate documents|Verification results|Source confirmation|Sub-processors",
  Object.values(EN_PLATFORM.security.residency).map((r) => r.nm),
);

check(
  "…and its six artefact rows still key on the titles they keyed on",
  Object.values(EN_PLATFORM.security.artefacts).map((a) => a.t).join("|") ===
    "ISO 27001 certificate & scope|Data Processing Agreement (DPA)|Security whitepaper|" +
      "Penetration test summary|Accessibility conformance statement|Sub-processor register",
  Object.values(EN_PLATFORM.security.artefacts).map((a) => a.t),
);

/** The four vertical pages' lane, pill and row keys. One assertion per page per
 *  kind rather than one joined monster, so a failure names the page and the
 *  table rather than a 600-character diff. */
const VERTICAL_KEYS: Record<string, { lanes: string; pills: string; rows: string }> = {
  health: {
    lanes: "01 — Identity|02 — Qualification|03 — Standing",
    pills:
      "Identity|Passport|Age|Current address|Medical degree|Post-graduate specialty|" +
      "Council registration|Internship completion|Global database|Criminal|" +
      "Employment history|Disciplinary record",
    rows:
      "Identity & passport|Criminal record|Global database screen|Council registration|" +
      "Medical degree|Disciplinary record",
  },
  immigration: {
    lanes: "01 — Identity|02 — Grounds|03 — Admissibility",
    pills:
      "Identity|Passport|Age|Face vs. selfie|Education|Employment|Digital employment|" +
      "Entitlement to work|Trade licence|Global database|Criminal|Credit|Current address",
    rows:
      "Identity & passport|Global database screen|Criminal record|Digital employment|" +
      "Employment|Education",
  },
  manpowerEducation: {
    lanes: "01 — Identity|02 — Credentials|03 — Records",
    pills:
      "Identity|Passport|Age|Entitlement to work|Education|Trade certification|Employment|" +
      "Digital employment|Moonlighting|Criminal|Global database|Current address",
    rows:
      "Identity & passport|Criminal record|Entitlement to work|Digital employment|" +
      "Employment|Education & trade certification",
  },
  trade: {
    lanes: "01 — The entity|02 — The people|03 — Risk",
    pills:
      "Trade licence|Company registration|Directors & GST|Credit|Identity|Criminal|" +
      "Defaulting directors|Promoter criminal history|Global database|" +
      "Financial assessment|GST screening",
    rows:
      "Credit screen|Global database screen|Criminal record|Trade licence|" +
      "Financial assessment|Directors & GST",
  },
};

for (const [page, want] of Object.entries(VERTICAL_KEYS)) {
  const d = EN_GOVERNMENTS[page as keyof typeof VERTICAL_KEYS];
  check(
    `governments.${page}: its lanes still key on the three \`gt\` strings they keyed on`,
    Object.values(d.lanes).map((l) => l.gt).join("|") === want.lanes,
    Object.values(d.lanes).map((l) => l.gt),
  );
  check(
    `governments.${page}: its pills still key on the names they keyed on`,
    Object.values(d.pills).map((p) => p.n).join("|") === want.pills,
    Object.values(d.pills).map((p) => p.n),
  );
  check(
    `governments.${page}: its table rows still key on the \`nm\` strings they keyed on`,
    Object.values(d.rows).map((r) => r.nm).join("|") === want.rows,
    Object.values(d.rows).map((r) => r.nm),
  );
}

/** THE FOUR COUPLINGS THIS SLICE ADDED, and §4's argument applies unchanged to
 *  each: two modules agreeing with no type between them.
 *
 *  `app/[locale]/platform/security-compliance/content.ts` now holds the ORDER
 *  of the artefact rows, the residency rows and the questions, and `CERT_IDS`
 *  — which credentials the page cards. A key renamed on either side IS a tsc
 *  error, because all three orders are typed `keyof PlatformCopy["security"][…]`.
 *  What tsc cannot say is that an order is COMPLETE: dropping an entry
 *  typechecks perfectly and silently stops rendering a row, and for the FAQ
 *  `<FaqSection>` builds the `FAQPage` node from the same array, so the page and
 *  the structured data would go quiet together — §9 records exactly that for
 *  `/business/enterprise`.
 *
 *  `CERT_IDS` is the fourth and is a different shape: it is `CredentialId[]`,
 *  so tsc gates it against `lib/content/company.ts` and NOT against the seven
 *  glosses beside it. An id dropped from one side leaves a card with
 *  `CREDENTIAL_MARKS`' short default gloss on the page a security reviewer is
 *  sent — a silent downgrade of reviewed procurement copy, which is the one
 *  failure here a reader would not notice. */
check(
  "every security artefact is in the render order, and none is laid out twice",
  ARTEFACT_ORDER.length === Object.keys(EN_PLATFORM.security.artefacts).length &&
    new Set(ARTEFACT_ORDER.map((a) => a.k)).size === ARTEFACT_ORDER.length,
  { order: ARTEFACT_ORDER.map((a) => a.k), dictionary: Object.keys(EN_PLATFORM.security.artefacts) },
);

check(
  "every residency row is in the render order, and none is laid out twice",
  RESIDENCY_ORDER.length === Object.keys(EN_PLATFORM.security.residency).length &&
    new Set(RESIDENCY_ORDER).size === RESIDENCY_ORDER.length,
  { order: RESIDENCY_ORDER, dictionary: Object.keys(EN_PLATFORM.security.residency) },
);

check(
  "every security FAQ is in the render order, and none is asked twice",
  SEC_FAQ_ORDER.length === Object.keys(EN_PLATFORM.security.faqs).length &&
    new Set(SEC_FAQ_ORDER).size === SEC_FAQ_ORDER.length,
  { order: SEC_FAQ_ORDER, dictionary: Object.keys(EN_PLATFORM.security.faqs) },
);

check(
  "every credential this page cards has its own procurement-length gloss",
  [...CERT_IDS].sort().join("|") ===
    Object.keys(EN_PLATFORM.security.glosses).sort().join("|"),
  { ids: CERT_IDS, glosses: Object.keys(EN_PLATFORM.security.glosses) },
);

/** The other half of that last one, and the reason it is worth having: the
 *  standfirst rendered over these cards reads "Certified, compliant, aligned
 *  and member are four different claims", which is a COUNT of the status words
 *  in `CREDENTIAL_MARKS`. `content.ts` records that "NSR — empanelled" once
 *  made it five. The gloss table cannot reintroduce a status word — the name
 *  and the status are not overridable — so this only asserts the count the
 *  sentence makes is still the count the type allows. */
const CERT_STATUSES = CERT_IDS.map((id) => (CREDENTIAL_MARKS[id] as CredentialMark).status).filter(
  (s): s is string => typeof s === "string",
);

check(
  "…and the standfirst's count of four status words is still four",
  new Set(CERT_STATUSES).size === 4,
  CERT_STATUSES,
);

console.log("14. breaking the section 13 guards on purpose");

/** Every predicate above, run against a world where it should be red — §6 and
 *  §11's shape: the guard takes its input as a value, so a failing world is
 *  built rather than a source file edited. */
check(
  "the per-file leaf count WOULD fail on a page that gained a leaf",
  leafPaths({ ...EN_PLATFORM.hub, extra: "Platform" }).length !== PLATFORM_FILES.hub[1],
  leafPaths({ ...EN_PLATFORM.hub, extra: "Platform" }).length,
);

check(
  "…and on one that lost one",
  leafPaths({ closing: EN_GOVERNMENTS.mom.closing }).length !== GOVERNMENT_FILES.mom[1],
  leafPaths({ closing: EN_GOVERNMENTS.mom.closing }).length,
);

/** THE KEY GUARD, broken, on the exact mistake it exists for: a renamed row
 *  typechecks, renders the same words in the same place, and silently changes a
 *  React key in the flight payload. */
const renamedRow = {
  ...EN_GOVERNMENTS.health.rows,
  criminal: { ...EN_GOVERNMENTS.health.rows.criminal, nm: "Criminal records" },
};
check(
  "the key guard WOULD fail on a renamed vertical-table row",
  Object.values(renamedRow).map((r) => r.nm).join("|") !== VERTICAL_KEYS.health.rows,
  renamedRow.criminal.nm,
);

const renamedRegion = { ...EN_PLATFORM.coverage.regions, europeAmericas: "Europe and the Americas" };
check(
  "…and on a renamed coverage region heading",
  Object.values(renamedRegion).join("|") !==
    "South & Southeast Asia|Middle East & Africa|Europe & the Americas",
  renamedRegion.europeAmericas,
);

/** §3's `&amp;` guard, pointed at the trap THIS slice had to avoid, which is a
 *  new position for it. The four entities these pages spelled were not text
 *  nodes but JSX ATTRIBUTES — `<SecHead k="Certifications &amp; memberships">`
 *  and `k="Residency &amp; sub-processors"` on `/platform/security-compliance`,
 *  and the two `.k` eyebrows. Measured with `tsc --jsx react-jsx` while writing
 *  this slice: `k="a &amp; b"` emits `k: "a & b"`, so JSX decodes an attribute
 *  exactly as it decodes a text child and the stored leaf must carry the plain
 *  `&`. Storing the entity would emit `&amp;amp;` on the page a security
 *  reviewer is sent. */
check(
  "the &amp; guard WOULD fire on an ATTRIBUTE leaf stored with the entity still in it",
  stringLeaves({ k: "Certifications &amp; memberships" }).some(([, v]) => ENTITY.test(v)),
);

check(
  "…and does not fire on the four leaves actually shipped, which carry a plain &",
  [
    EN_PLATFORM.security.certs.k,
    EN_PLATFORM.security.residencyBand.k,
    EN_PLATFORM.technology.hero.k,
    EN_GOVERNMENTS.hub.hero.k,
  ].every((v) => v.includes("&") && !ENTITY.test(v)),
  [EN_PLATFORM.security.certs.k, EN_PLATFORM.security.residencyBand.k],
);

/** The four order guards, broken. Same two failure modes §9 shows for the
 *  enterprise FAQ — an order that drops an entry and one that repeats it — plus
 *  the gloss coupling, whose failure mode is a card silently falling back to
 *  `CREDENTIAL_MARKS`' one-line default. */
check(
  "the artefact-order guard WOULD fail on an order that drops a row",
  ARTEFACT_ORDER.slice(0, -1).length !== Object.keys(EN_PLATFORM.security.artefacts).length,
  ARTEFACT_ORDER.length - 1,
);

check(
  "the residency-order guard WOULD fail on one that lays the same row out twice",
  new Set([...RESIDENCY_ORDER.slice(0, -1), RESIDENCY_ORDER[0]]).size !== RESIDENCY_ORDER.length,
  [...RESIDENCY_ORDER.slice(0, -1), RESIDENCY_ORDER[0]],
);

check(
  "the FAQ-order guard WOULD fail on an order that asks the same question twice",
  new Set([...SEC_FAQ_ORDER.slice(0, -1), SEC_FAQ_ORDER[0]]).size !== SEC_FAQ_ORDER.length,
  [...SEC_FAQ_ORDER.slice(0, -1), SEC_FAQ_ORDER[0]],
);

check(
  "the gloss guard WOULD fail on a card whose gloss was dropped",
  [...CERT_IDS].sort().join("|") !==
    Object.keys(EN_PLATFORM.security.glosses).filter((k) => k !== "soc2").sort().join("|"),
  "soc2 would silently fall back to CREDENTIAL_MARKS' default gloss",
);

console.log("15. the numbers for `individuals` and `resources`, and the keys they kept");

/** RE-MEASURED for the last two `app/[locale]/**` route subtrees, 23 Sep 2026.
 *
 *  `matched` is the comment-stripped `>text<` run from `lib/copy/index.ts`'s
 *  header, over the pre-migration sources. Calibrated rather than asserted on
 *  faith: run over `components/forms/**`, the one figure in that header no
 *  migration has moved, it reproduces its `10` exactly
 *  (`scratchpad/ind_res_count_nodes.py`). The brief that commissioned this
 *  slice counted 71 and 44 against this run's 105 and 90 — the same
 *  disagreement §7 and §9 record, stated rather than reconciled.
 *
 *      individuals  105 nodes -> 309 leaves  2.94x
 *      resources     90       ->  98        1.09x
 *
 *  AND THE SPREAD IS INSIDE `individuals`, not between the two:
 *
 *      individuals/page.tsx       22 nodes ->  52 leaves   2.4x
 *      individuals/hellov         59       ->  77          1.3x
 *      individuals/home-family    11       ->  86          7.8x
 *      individuals/immigration    13       ->  93          7.2x
 *
 *  `home-family` and `immigration` are `VerticalPage` clients: their copy is
 *  almost entirely PROPS — `lanes`, `pills`, `rows`, `steps`, `faqs`, four
 *  answer-block head/lede pairs and a `closing` object — and a `>text<`
 *  matcher cannot see one of them. That is `lib/copy/index.ts`'s own rule
 *  ("the more a component is ALREADY data-driven, the more of its copy a
 *  `>text<` count misses") arriving through a TEMPLATE rather than through a
 *  local `const`, which is a shape §9 and §10 had no example of. `resources`
 *  sits at the other end for the opposite reason: four of its six pages
 *  iterate `lib/content/**`, so most of what the matcher sees on them is
 *  catalogue and deliberately not copy.
 *
 *  Only the LEAF side is asserted, per §9: the node counts came from a script
 *  over sources that have now changed, so an assertion on them would be an
 *  assertion against nothing. */
const EN_IND = pick(INDIVIDUALS, DEFAULT);
const EN_RES = pick(RESOURCES, DEFAULT);

const IND_FILES: Record<string, readonly [number, number]> = {
  crumb: [0, 1],
  hub: [22, 52],
  hellov: [59, 77],
  homeFamily: [11, 86],
  immigration: [13, 93],
};

const RES_FILES: Record<string, readonly [number, number]> = {
  crumb: [0, 1],
  row: [0, 1],
  hub: [25, 28],
  blog: [7, 8],
  post: [5, 5],
  checks: [13, 11],
  countries: [12, 14],
  glossary: [28, 30],
};

for (const [k, v] of Object.entries(EN_IND)) {
  const row = IND_FILES[k];
  check(
    `individuals.${k}: ${row ? row[1] : "?"} leaves (the matcher saw ${row ? row[0] : "?"})`,
    row !== undefined && leafPaths(v).length === row[1],
    { measured: leafPaths(v).length, expected: row },
  );
}

for (const [k, v] of Object.entries(EN_RES)) {
  const row = RES_FILES[k];
  check(
    `resources.${k}: ${row ? row[1] : "?"} leaves (the matcher saw ${row ? row[0] : "?"})`,
    row !== undefined && leafPaths(v).length === row[1],
    { measured: leafPaths(v).length, expected: row },
  );
}

check(
  "individuals holds 309 leaves for 105 nodes and resources 98 for 90",
  leafPaths(EN_IND).length === 309 &&
    leafPaths(EN_RES).length === 98 &&
    Object.values(IND_FILES).reduce((a, b) => a + b[0], 0) === 105 &&
    Object.values(RES_FILES).reduce((a, b) => a + b[0], 0) === 90,
  { individuals: leafPaths(EN_IND).length, resources: leafPaths(EN_RES).length },
);

/** The non-string leaves, itemised so moving one has to move this line.
 *
 *  `individuals`: 28. Four `<h1>`s and four `closing.heading`s carry an
 *  `<em>`; three `faqHead`s are `<>…</>`; sixteen `.strip3` figures are
 *  `<b>figure</b> tail` or a `<span className="dot" />` plus a phrase, which
 *  is TWO children and therefore one rich-text leaf rather than two string
 *  leaves — splitting them would put two adjacent text children where one
 *  sits today; and one is the FUNCTION leaf `immigration.tableNote`.
 *
 *  `resources`: 37. Twelve glossary `d` fragments, six `closing.heading`s,
 *  six `hero.h1`s, eight `.strip3` figures (two of them functions), and five
 *  more functions — `row.min`, `blog.readMins`, `post.meta`, the two
 *  `hub.cards.*.m`, and `countries.officeIn`, which returns a STRING rather
 *  than a node because it replaced a template literal in an attribute-shaped
 *  position. */
check(
  "individuals: 281 string leaves and 28 rich-text or function leaves",
  stringLeaves(EN_IND).length === 281 &&
    leafPaths(EN_IND).length - stringLeaves(EN_IND).length === 28,
  { strings: stringLeaves(EN_IND).length, all: leafPaths(EN_IND).length },
);

check(
  "resources: 61 string leaves and 37 rich-text or function leaves",
  stringLeaves(EN_RES).length === 61 &&
    leafPaths(EN_RES).length - stringLeaves(EN_RES).length === 37,
  { strings: stringLeaves(EN_RES).length, all: leafPaths(EN_RES).length },
);

console.log("15a. the third corollary — every key= expression these pages still resolve");

/** THE KEY GUARD, the shape §10 uses. Eight iterated surfaces in these two
 *  subtrees key on a string that is now a leaf: the hub's four `.ph` cards on
 *  `c.h`, `VerticalPage`'s lanes on `l.gt`, pills on `p.n`, rows on `r.nm`,
 *  `Steps`' cards on `s.t`, and the glossary's twelve `.g3r` rows on `x.t`.
 *  The literals below are the PRE-MIGRATION strings, typed out from the
 *  snapshots — reading them back out of the dictionary would assert nothing.
 */
const joinKeys = (o: object, f: string) =>
  Object.values(o as Record<string, Record<string, string>>)
    .map((x) => x[f])
    .join("|");

check(
  "the hub's four path cards still key on the headings they keyed on",
  joinKeys(EN_IND.hub.paths, "h") ===
    "Verify anyone|Screen your own papers|The people in your home|Before you hand over keys",
  joinKeys(EN_IND.hub.paths, "h"),
);

check(
  "home-family's three lanes still key on 01 — Identity/02 — Record/03 — Where they live",
  joinKeys(EN_IND.homeFamily.lanes, "gt") === "01 — Identity|02 — Record|03 — Where they live",
  joinKeys(EN_IND.homeFamily.lanes, "gt"),
);

check(
  "immigration's three lanes still key on 01 — Identity/02 — Your claims/03 — Your record",
  joinKeys(EN_IND.immigration.lanes, "gt") === "01 — Identity|02 — Your claims|03 — Your record",
  joinKeys(EN_IND.immigration.lanes, "gt"),
);

check(
  "home-family's eight pills still key on the names they keyed on",
  joinKeys(EN_IND.homeFamily.pills, "n") ===
    "Identity|Photo match|Age|Driving licence|Criminal|Global database|Current address|Previous employment",
  joinKeys(EN_IND.homeFamily.pills, "n"),
);

check(
  "immigration's eleven pills still key on the names they keyed on",
  joinKeys(EN_IND.immigration.pills, "n") ===
    "Identity|Passport|Age|Current address|Education|Employment|Digital employment|" +
      "Entitlement to work|Criminal|Global database|Credit",
  joinKeys(EN_IND.immigration.pills, "n"),
);

check(
  "home-family's six table rows still key on the names they keyed on",
  joinKeys(EN_IND.homeFamily.rows, "nm") ===
    "Identity|Global database screen|Driving licence|Criminal record|Current address|Previous employment",
  joinKeys(EN_IND.homeFamily.rows, "nm"),
);

check(
  "immigration's six table rows still key on the names they keyed on",
  joinKeys(EN_IND.immigration.rows, "nm") ===
    "Identity & passport|Global database screen|Criminal record|Digital employment|Employment|Education",
  joinKeys(EN_IND.immigration.rows, "nm"),
);

check(
  "the four Steps decks still key on the step names they keyed on",
  [
    joinKeys(EN_IND.hub.steps, "t"),
    joinKeys(EN_IND.hellov.steps, "t"),
    joinKeys(EN_IND.homeFamily.steps, "t"),
    joinKeys(EN_IND.immigration.steps, "t"),
  ].join(" / ") ===
    "Send a photo|We check the source|The report / They agree|We check|Then it's deleted / " +
      "Send a photo|They agree|You know / Upload|Check|Fix",
  [
    joinKeys(EN_IND.hub.steps, "t"),
    joinKeys(EN_IND.hellov.steps, "t"),
    joinKeys(EN_IND.homeFamily.steps, "t"),
    joinKeys(EN_IND.immigration.steps, "t"),
  ],
);

check(
  "the glossary's twelve rows still key on the terms they keyed on, in order",
  joinKeys(EN_RES.glossary.terms, "t") ===
    "Primary source verification|Database screening|Attestation|BGV|Adverse media|Unverifiable|" +
      "Turnaround time (TAT)|Consent|Data residency|Moonlighting|Sub-processor|Re-verification",
  joinKeys(EN_RES.glossary.terms, "t"),
);

/** THE ORDER, not just the keys. `/resources/glossary` renders
 *  `Object.values(t.glossary.terms)`, so the dictionary's insertion order IS
 *  the render order — the one place in either namespace where that is true,
 *  and `lib/copy/resources.ts` argues for it against `FAQ_ORDER`'s shape.
 *  The assertion above is a `.join("|")` for exactly this reason: it would
 *  fail on a reorder, where `leafPaths` (which sorts) would not. */
check(
  "…and Object.values preserves that order, which is what the page renders",
  Object.values(EN_RES.glossary.terms)[0].t === "Primary source verification" &&
    Object.values(EN_RES.glossary.terms)[11].t === "Re-verification",
  Object.values(EN_RES.glossary.terms).length,
);

console.log("15b. one leaf read twice, and the HowTo `name` that depends on it");

/** `SecHead h` and `Steps name` were two identical literals on three of these
 *  pages; they are now ONE leaf read twice, which is the call
 *  `business/employee-verification` made. §17 condition 18 requires the
 *  `HowTo` node's `name` to be the heading VERBATIM and `check:schema`
 *  compares them on the built page, so the two could not be allowed to drift.
 *
 *  `VerticalPage` guards the same coupling differently and that guard is the
 *  one worth asserting here: it emits the node only when `stepsHead` is a
 *  plain STRING, because a heading carrying a `<br />` cannot be stated
 *  verbatim in JSON-LD. A leaf rewritten as JSX would silently emit no node
 *  at all, and `check-schema.mjs` lists the pages that must have one. */
check(
  "both VerticalPage clients' stepsHead is a plain string, so the HowTo node still emits",
  typeof EN_IND.homeFamily.stepsHead === "string" &&
    typeof EN_IND.immigration.stepsHead === "string",
  { homeFamily: typeof EN_IND.homeFamily.stepsHead, immigration: typeof EN_IND.immigration.stepsHead },
);

check(
  "…and so is every heading a `Steps name=` reads on the two hand-written pages",
  typeof EN_IND.hub.howItWorks.h === "string" && typeof EN_IND.hellov.rule.h === "string",
  [EN_IND.hub.howItWorks.h, EN_IND.hellov.rule.h],
);

console.log("15c. the function leaves, against the children they have to reproduce");

/** THE BYTE-IDENTITY RULE AS AN ASSERTION, and the first time this file has
 *  one. `lib/copy/index.ts`: never merge two children into one, never split
 *  one into two — React's SSR writes `<!-- -->` between adjacent text
 *  children, and the built page shows them
 *  (`.next/server/app/en/resources.html` reads `12<!-- --> checks documented
 *  →`). Nine leaves in `resources` and one in `individuals` stand in for a
 *  parent's inline children, so what has to hold is the CHILD ARRAY: its
 *  length, and the exact connective text including the leading space that
 *  §3's edge-whitespace guard would have rejected as a string leaf.
 *
 *  Reaching into `props.children` rather than rendering: `react-dom/server`
 *  does not resolve under `vitest.config.ts`'s `react-server` condition —
 *  `lib/copy/index.ts`'s instruments paragraph records that in full — and
 *  the child array is the thing the rule is actually about. */
function childArray(node: unknown): unknown[] {
  const kids = (node as { props?: { children?: unknown } }).props?.children;
  return Array.isArray(kids) ? kids : [kids];
}

check(
  "resources.hub.cards.checks.m yields TWO children: the count, then ` checks documented →`",
  JSON.stringify(childArray(EN_RES.hub.cards.checks.m(12))) ===
    JSON.stringify([12, " checks documented →"]),
  childArray(EN_RES.hub.cards.checks.m(12)),
);

check(
  "…and countries.m the same shape with its own words",
  JSON.stringify(childArray(EN_RES.hub.cards.countries.m(6))) ===
    JSON.stringify([6, " countries documented →"]),
  childArray(EN_RES.hub.cards.countries.m(6)),
);

check(
  "resources.row.min and blog.readMins are ` min` and ` min read`, two children each",
  JSON.stringify(childArray(EN_RES.row.min(4))) === JSON.stringify([4, " min"]) &&
    JSON.stringify(childArray(EN_RES.blog.readMins(6))) === JSON.stringify([6, " min read"]),
  [childArray(EN_RES.row.min(4)), childArray(EN_RES.blog.readMins(6))],
);

check(
  "resources.post.meta keeps all SIX children — three values and three connectives",
  JSON.stringify(childArray(EN_RES.post.meta("Verification", "14 August 2025", 4))) ===
    JSON.stringify(["Verification", " · ", "14 August 2025", " · ", 4, " min read"]),
  childArray(EN_RES.post.meta("Verification", "14 August 2025", 4)),
);

check(
  "resources.countries.officeIn returns a STRING, because it replaced a template literal",
  EN_RES.countries.officeIn("Noida") === "office in Noida" &&
    typeof EN_RES.countries.officeIn("Noida") === "string",
  EN_RES.countries.officeIn("Noida"),
);

check(
  "individuals.immigration.tableNote keeps its text child's TRAILING space before the link",
  childArray(EN_IND.immigration.tableNote("LINK")).length === 2 &&
    childArray(EN_IND.immigration.tableNote("LINK"))[0] ===
      "Times shown are from upload to result · documents verified in the country of issue — see " &&
    childArray(EN_IND.immigration.tableNote("LINK"))[1] === "LINK",
  childArray(EN_IND.immigration.tableNote("LINK")),
);

console.log("15d. the catalogue boundary where equality cannot hold it");

/** SECTION 8's GUARD IS THE WRONG SHAPE FOR `individuals`, and saying so is
 *  more useful than quietly leaving the namespace out of that loop.
 *
 *  Measured (`scratchpad/ind_res_catalogue_collide.mjs`): 62 of `individuals`'
 *  281 string leaves equal a string in `lib/content/checks.ts` and 49 equal
 *  one in `lib/content/countries.ts`. NONE of them is an absorbed catalogue
 *  value. They are the per-page turnaround tables on the two `VerticalPage`
 *  clients — `rows`, `pills`, `plans.lines`, the four `when3` chips — which
 *  were hand-written literals in those page files before this migration and
 *  are still the page's own claim about its own audience. Neither page reads
 *  `CHECKS` or `COUNTRIES`. What they share with the catalogue is the English
 *  for a check ("Criminal record") and a turnaround ("30 min"), and an
 *  equality guard over two-word labels is a guard that cries wolf.
 *
 *  So the boundary is held by a predicate that is blind to a shared LABEL and
 *  fires on shared PROSE: a catalogue string that contains a space and ends
 *  in a full stop, question mark or exclamation. That is the shape of every
 *  value this boundary actually protects — a check's `answers` and `caveat`,
 *  a country's `summary` and `watchOut`, a post's `standfirst`, paragraphs
 *  and quotes — and of none of the 111 collisions above. Measured: 136 of the
 *  three catalogues' strings are sentence-shaped.
 *
 *  It is applied to BOTH new namespaces, so `/resources/checks` keeps a
 *  boundary guard despite the `Moonlighting` collision that kept it out of
 *  section 8's loop. */
const CATALOGUE_PROSE = new Set(
  [...allStrings(CHECKS, new Set<string>()), ...allStrings(COUNTRIES, new Set<string>()), ...allStrings(POSTS, new Set<string>())].filter(
    (v) => v.includes(" ") && /[.?!]$/.test(v),
  ),
);

check(
  "the three catalogues really do hold prose for this guard to compare against",
  CATALOGUE_PROSE.size > 100,
  CATALOGUE_PROSE.size,
);

for (const [name, dict] of [
  ["individuals", EN_IND],
  ["resources", EN_RES],
] as const) {
  const prose = stringLeaves(dict).filter(([, v]) => CATALOGUE_PROSE.has(v));
  check(
    `${name}: no leaf repeats a SENTENCE from posts.ts, checks.ts or countries.ts`,
    prose.length === 0,
    prose,
  );
}

console.log("16. breaking the section 15 guards on purpose");

/** Every predicate above, run against a world where it should be red — the
 *  shape §6 and §11 use, so a failing world is built rather than a source
 *  file edited. */
check(
  "the per-file leaf count WOULD fail on a band that gained a leaf",
  leafPaths({ ...EN_IND.hub, extra: "Start a check" }).length !== IND_FILES.hub[1],
  leafPaths({ ...EN_IND.hub, extra: "Start a check" }).length,
);

check(
  "…and on one that lost one",
  leafPaths({ crumb: EN_RES.crumb }).length !== RES_FILES.glossary[1],
  leafPaths({ crumb: EN_RES.crumb }).length,
);

/** THE KEY GUARD, broken. A renamed label is the exact mistake it exists for:
 *  it typechecks, it renders the same words in a different place, and it
 *  silently changes a React key and the flight payload with it. */
const renamedLane = { ...EN_IND.homeFamily.lanes, record: { gt: "02 - Record", gh: "What's on file" } };
check(
  "the key guard WOULD fail on a lane heading whose em dash became a hyphen",
  joinKeys(renamedLane, "gt") !== "01 — Identity|02 — Record|03 — Where they live",
  joinKeys(renamedLane, "gt"),
);

const reordered = {
  databaseScreening: EN_RES.glossary.terms.databaseScreening,
  primarySource: EN_RES.glossary.terms.primarySource,
};
check(
  "…and the glossary's order guard WOULD fail on two entries swapped",
  joinKeys(reordered, "t") !== "Primary source verification|Database screening",
  joinKeys(reordered, "t"),
);

check(
  "…while leafPaths, which sorts, would NOT — which is why the join is the assertion",
  leafPaths(reordered).join("\n") ===
    leafPaths({
      primarySource: EN_RES.glossary.terms.primarySource,
      databaseScreening: EN_RES.glossary.terms.databaseScreening,
    }).join("\n"),
  leafPaths(reordered),
);

/** THE CHILD-ARRAY GUARD, broken on the exact mutation `lib/copy/index.ts`
 *  forbids: the two children folded into one interpolated string. It renders
 *  the same words and loses a `<!-- -->` — the mistake `html-identity.mjs`
 *  caught on `Packages.tsx`, nine separators on one page. */
const oneChild = (n: number) => `${n} checks documented →`;
check(
  "the child-array guard WOULD fail on a leaf that merged its two children",
  JSON.stringify(childArray(oneChild(12))) !== JSON.stringify([12, " checks documented →"]),
  childArray(oneChild(12)),
);

/** …and on the opposite mistake: a split that turns one text child into two,
 *  which ADDS a separator. */
check(
  "…and on one that split its text child in two",
  JSON.stringify(childArray({ props: { children: [12, " checks", " documented →"] } })) !==
    JSON.stringify([12, " checks documented →"]),
);

/** The trailing space `immigration.tableNote` depends on, deleted. The page
 *  would then need a `{" "}` of its own, which is a THIRD child and a
 *  separator that is not there today. */
check(
  "the tableNote guard WOULD fail if the space before the link were dropped",
  childArray({
    props: {
      children: [
        "Times shown are from upload to result · documents verified in the country of issue — see",
        "LINK",
      ],
    },
  })[0] !==
    "Times shown are from upload to result · documents verified in the country of issue — see ",
);

/** The HowTo coupling, broken: a `stepsHead` rewritten as rich text still
 *  typechecks (`ReactNode`), still renders, and silently stops emitting the
 *  node that `check-schema.mjs` requires. */
check(
  "the stepsHead guard WOULD fail on a heading rewritten as JSX",
  typeof EN_IND.homeFamily.h1 !== "string",
  typeof EN_IND.homeFamily.h1,
);

/** The sentence-shaped catalogue guard, against a dictionary that has
 *  absorbed a real one. `CHECKS[0].answers` rather than a hand-written
 *  string: a literal would keep passing the day someone rewrites the check. */
const absorbed = { ...EN_RES.checks, oops: CHECKS[0].answers };
check(
  "the prose guard WOULD fire on a dictionary that absorbed a check's `answers`",
  stringLeaves(absorbed).filter(([, v]) => CATALOGUE_PROSE.has(v)).length === 1,
  CHECKS[0].answers,
);

check(
  "…and does NOT fire on the two-word labels these pages legitimately share",
  !CATALOGUE_PROSE.has("Criminal record") &&
    !CATALOGUE_PROSE.has("30 min") &&
    CATALOGUE_PROSE.has(CHECKS[0].answers),
  { answers: CHECKS[0].answers },
);

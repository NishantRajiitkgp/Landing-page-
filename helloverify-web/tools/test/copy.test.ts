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
import { hi as chromeHi } from "../../src/lib/copy/chrome.hi.tsx";
import { ar as chromeAr } from "../../src/lib/copy/chrome.ar.tsx";
import { BUSINESS } from "../../src/lib/copy/business.ts";
import { hi as businessHi } from "../../src/lib/copy/business.hi.tsx";
import { ar as businessAr } from "../../src/lib/copy/business.ar.tsx";
import { TEMPLATES } from "../../src/lib/copy/templates.ts";
import { hi as templatesHi } from "../../src/lib/copy/templates.hi.tsx";
import { ar as templatesAr } from "../../src/lib/copy/templates.ar.tsx";
import { SECTIONS } from "../../src/lib/copy/sections.ts";
import { hi as sectionsHi } from "../../src/lib/copy/sections.hi.tsx";
import { ar as sectionsAr } from "../../src/lib/copy/sections.ar.tsx";
import { BLOCKS } from "../../src/lib/copy/blocks.ts";
import { hi as blocksHi } from "../../src/lib/copy/blocks.hi.tsx";
import { ar as blocksAr } from "../../src/lib/copy/blocks.ar.tsx";
import { ABOUT } from "../../src/lib/copy/about.ts";
import { hi as aboutHi } from "../../src/lib/copy/about.hi.tsx";
import { ar as aboutAr } from "../../src/lib/copy/about.ar.tsx";
import { CONTACT } from "../../src/lib/copy/contact.ts";
import { hi as contactHi } from "../../src/lib/copy/contact.hi.tsx";
import { ar as contactAr } from "../../src/lib/copy/contact.ar.tsx";
import { CHECKS_COPY } from "../../src/lib/copy/checks.ts";
import { hi as checksHi } from "../../src/lib/copy/checks.hi.tsx";
import { ar as checksAr } from "../../src/lib/copy/checks.ar.tsx";
import { COUNTRIES_COPY } from "../../src/lib/copy/countries.ts";
import { hi as countriesHi } from "../../src/lib/copy/countries.hi.tsx";
import { ar as countriesAr } from "../../src/lib/copy/countries.ar.tsx";
import { LEGAL_COPY } from "../../src/lib/copy/legal.ts";
import { hi as legalHi } from "../../src/lib/copy/legal.hi.tsx";
import { ar as legalAr } from "../../src/lib/copy/legal.ar.tsx";
import { ROOT } from "../../src/lib/copy/root.ts";
import { hi as rootHi } from "../../src/lib/copy/root.hi.tsx";
import { ar as rootAr } from "../../src/lib/copy/root.ar.tsx";
import { PLATFORM } from "../../src/lib/copy/platform.ts";
import { hi as platformHi } from "../../src/lib/copy/platform.hi.tsx";
import { ar as platformAr } from "../../src/lib/copy/platform.ar.tsx";
import { GOVERNMENTS } from "../../src/lib/copy/governments.ts";
import { hi as governmentsHi } from "../../src/lib/copy/governments.hi.tsx";
import { ar as governmentsAr } from "../../src/lib/copy/governments.ar.tsx";
import { INDIVIDUALS } from "../../src/lib/copy/individuals.ts";
import { hi as individualsHi } from "../../src/lib/copy/individuals.hi.tsx";
import { ar as individualsAr } from "../../src/lib/copy/individuals.ar.tsx";
import { RESOURCES } from "../../src/lib/copy/resources.ts";
import { hi as resourcesHi } from "../../src/lib/copy/resources.hi.tsx";
import { ar as resourcesAr } from "../../src/lib/copy/resources.ar.tsx";
import { FORMS } from "../../src/lib/copy/forms.ts";
import { ACCOUNT } from "../../src/lib/copy/account.ts";
import { AUTHORITY } from "../../src/lib/copy/authority.ts";
import { ITALY_PARTNER } from "../../src/lib/copy/italyPartner.ts";
import { MOM_APPLY } from "../../src/lib/copy/momApply.ts";
import { MOM_ORG } from "../../src/lib/copy/momOrg.ts";
import { MOM_STEPS } from "../../src/lib/copy/momSteps.ts";
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
  { name: "forms", dict: FORMS },
  { name: "account", dict: ACCOUNT },
  { name: "authority", dict: AUTHORITY },
  { name: "italyPartner", dict: ITALY_PARTNER },
  { name: "momApply", dict: MOM_APPLY },
  { name: "momSteps", dict: MOM_STEPS },
  { name: "momOrg", dict: MOM_ORG },
];

/** Dotted paths to every LEAF. A leaf is anything that is not a plain object:
 *  a string, a function (the `(link: ReactNode) => …` shape the header
 *  describes), or a React element — which is an object, hence the
 *  `$$typeof` guard. Without it a `<>a <em>b</em> c</>` leaf would be walked
 *  into and compared as `props.children[1].type`, so two locales whose rich
 *  text puts the `<em>` in different places would be reported as drift when
 *  moving it is exactly what a translator is for.
 *
 *  Array items share one path, `list[]`, so a list still counts one leaf per
 *  item but its LENGTH is not part of the shape: the old CMS's locales do not
 *  always carry the same number of bullets, and each page shows its own
 *  locale's list word for word. `shape` is what the locales are compared on. */
function leafPaths(value: unknown, prefix = ""): string[] {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.prototype.hasOwnProperty.call(value, "$$typeof")
  ) {
    return [prefix];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v) => leafPaths(v, `${prefix}[]`)).sort();
  }
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([k, v]) => leafPaths(v, prefix ? `${prefix}.${k}` : k))
    .sort();
}

/** A dictionary's leaf paths with list items collapsed — see `leafPaths`. */
function shape(value: unknown): string {
  return [...new Set(leafPaths(value))].join("\n");
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
  const reference = shape(safePick(ns.dict, DEFAULT));
  for (const locale of routing.locales) {
    if (locale === DEFAULT) continue;
    const got = shape(safePick(ns.dict, locale));
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

/** Sections 2 and 5 now run for real — `hi` and `ar` are served (Part 9b.7).
 *  The drifted states below still construct a failing world without editing
 *  a source file, so a check that cannot fail is still not one. */

const EN = pick(CHROME, DEFAULT);

/** Loop 2's predicate, against a `hi` missing one leaf. */
const short = { ...EN, nav: { ...EN.nav, cta: undefined } } as unknown;
delete (short as { nav: { cta?: unknown } }).nav.cta;
check(
  "loop 2 WOULD fail on a locale missing a leaf",
  shape(short) !== shape(EN),
  leafPaths(EN).filter((p) => !leafPaths(short).includes(p)),
);

/** Loop 2's predicate, against a `hi` with a leaf the default does not have. */
const long = { ...EN, nav: { ...EN.nav, ctaa: "Talk to sales" } };
check(
  "loop 2 WOULD fail on a locale with a leaf the default lacks",
  shape(long) !== shape(EN),
  leafPaths(long).filter((p) => !leafPaths(EN).includes(p)),
);

/** …and that it does NOT fire on rich text whose markup moved, which is the
 *  false positive the `$$typeof` guard in `leafPaths` exists to prevent. */
const moved = { ...EN, closingCta: { ...EN.closingCta, heading: "beginning verified" } };
check(
  "loop 2 does NOT fire when only a rich-text leaf's markup differs",
  shape(moved) === shape(EN),
  leafPaths(moved).filter((p) => !leafPaths(EN).includes(p)),
);

/** …nor on a list of a different length, while a list item with a different
 *  key still does. */
check(
  "loop 2 does NOT fire when only a list's length differs",
  shape({ b: ["x", "y", "z"] }) === shape({ b: ["x"] }),
);
check(
  "loop 2 WOULD fail on a list item with a key the default lacks",
  shape({ b: [{ t: "x" }] }) !== shape({ b: [{ t: "x", p: "y" }] }),
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

console.log("6b. chrome + root hi/ar exist before those locales are served (Part 9b.2)");

/** The files have to land BEFORE `"hi"` is added to `routing.locales`.
 *  Section 5 only reads modules for served locales, so without this block
 *  a missing `chrome.hi.tsx` is invisible until the switch, at which point
 *  fifteen namespaces fail at once and the cause is lost. */
const PENDING: readonly { ns: string; locale: "hi" | "ar"; dict: unknown }[] = [
  { ns: "chrome", locale: "hi", dict: chromeHi },
  { ns: "chrome", locale: "ar", dict: chromeAr },
  { ns: "root", locale: "hi", dict: rootHi },
  { ns: "root", locale: "ar", dict: rootAr },
];
const PENDING_EN: Record<string, unknown> = {
  chrome: pick(CHROME, DEFAULT),
  root: pick(ROOT, DEFAULT),
};

for (const row of PENDING) {
  const mod = localeModule(row.ns, row.locale);
  check(
    `${row.ns}.${row.locale} exists on disk`,
    mod !== null,
    `src/lib/copy/${row.ns}.${row.locale}.{tsx,ts}`,
  );
  check(
    `${row.ns}.${row.locale} is annotated (recipe step 1b)`,
    mod !== null && annotationVerdict(mod.source),
    mod?.source.split("\n").find((l) => l.startsWith("export const")),
  );
  check(
    `${row.ns}.${row.locale} has the same leaf paths as en`,
    shape(row.dict) === shape(PENDING_EN[row.ns]),
  );
  const leaves = stringLeaves(row.dict);
  const entities = leaves.filter(([, v]) => ENTITY.test(v));
  check(`${row.ns}.${row.locale} spells no HTML entities`, entities.length === 0, entities);
}

check(
  "chrome.hi.nav.cta is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(chromeHi.nav.cta) && chromeHi.nav.cta !== pick(CHROME, DEFAULT).nav.cta,
  chromeHi.nav.cta,
);
check(
  "chrome.ar.nav.cta is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(chromeAr.nav.cta) && chromeAr.nav.cta !== pick(CHROME, DEFAULT).nav.cta,
  chromeAr.nav.cta,
);
check(
  "chrome.hi.nav.signUp is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(chromeHi.nav.signUp) && chromeHi.nav.signUp !== pick(CHROME, DEFAULT).nav.signUp,
  chromeHi.nav.signUp,
);
check(
  "chrome.ar.nav.signUp is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(chromeAr.nav.signUp) && chromeAr.nav.signUp !== pick(CHROME, DEFAULT).nav.signUp,
  chromeAr.nav.signUp,
);
check(
  "root.hi.skipToContent is Devanagari",
  /[\u0900-\u097F]/.test(rootHi.skipToContent),
  rootHi.skipToContent,
);
check(
  "root.ar.skipToContent is Arabic",
  /[\u0600-\u06FF]/.test(rootAr.skipToContent),
  rootAr.skipToContent,
);
check(
  "both chrome locales keep the {open} placeholder the clocks fill",
  chromeHi.footer.v2.openNow.includes("{open}") && chromeAr.footer.v2.openNow.includes("{open}"),
  { hi: chromeHi.footer.v2.openNow, ar: chromeAr.footer.v2.openNow },
);

console.log("6c. sections hi/ar exist before those locales are served (Part 9b.3)");

for (const row of [
  { locale: "hi" as const, dict: sectionsHi },
  { locale: "ar" as const, dict: sectionsAr },
]) {
  const mod = localeModule("sections", row.locale);
  check(
    `sections.${row.locale} exists on disk`,
    mod !== null,
    `src/lib/copy/sections.${row.locale}.tsx`,
  );
  check(
    `sections.${row.locale} is annotated (recipe step 1b)`,
    mod !== null && annotationVerdict(mod.source),
    mod?.source.split("\n").find((l) => l.startsWith("export const")),
  );
  check(
    `sections.${row.locale} has the same leaf paths as en`,
    shape(row.dict) === shape(pick(SECTIONS, DEFAULT)),
  );
  const leaves = stringLeaves(row.dict);
  const entities = leaves.filter(([, v]) => ENTITY.test(v));
  check(`sections.${row.locale} spells no HTML entities`, entities.length === 0, entities);
}

check(
  "sections.hi.hero.cta is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(sectionsHi.hero.cta) && sectionsHi.hero.cta !== pick(SECTIONS, DEFAULT).hero.cta,
  sectionsHi.hero.cta,
);
check(
  "sections.ar.hero.cta is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(sectionsAr.hero.cta) && sectionsAr.hero.cta !== pick(SECTIONS, DEFAULT).hero.cta,
  sectionsAr.hero.cta,
);
check(
  "both sections locales keep the client-island placeholders",
  sectionsHi.why.deck.cardOf.includes("{k}") &&
    sectionsHi.why.deck.cardOf.includes("{n}") &&
    sectionsAr.why.deck.cardOf.includes("{k}") &&
    sectionsAr.why.deck.cardOf.includes("{n}") &&
    sectionsHi.presence.relay.say.filed.includes("{who}") &&
    sectionsAr.presence.relay.say.filed.includes("{who}"),
  { hi: sectionsHi.why.deck.cardOf, ar: sectionsAr.why.deck.cardOf },
);
check(
  "both sections locales keep the five function leaves",
  [sectionsHi.smb.perCheck, sectionsHi.packages.count, sectionsHi.smb.tot, sectionsHi.smb.build.count, sectionsHi.smb.build.rupees, sectionsAr.smb.perCheck, sectionsAr.packages.count, sectionsAr.smb.tot, sectionsAr.smb.build.count, sectionsAr.smb.build.rupees].every(
    (f) => typeof f === "function",
  ),
);

console.log("6d. business hi/ar exist before those locales are served (Part 9b.4)");

for (const row of [
  { locale: "hi" as const, dict: businessHi },
  { locale: "ar" as const, dict: businessAr },
]) {
  const mod = localeModule("business", row.locale);
  check(
    `business.${row.locale} exists on disk`,
    mod !== null,
    `src/lib/copy/business.${row.locale}.tsx`,
  );
  check(
    `business.${row.locale} is annotated (recipe step 1b)`,
    mod !== null && annotationVerdict(mod.source),
    mod?.source.split("\n").find((l) => l.startsWith("export const")),
  );
  check(
    `business.${row.locale} has the same leaf paths as en`,
    shape(row.dict) === shape(pick(BUSINESS, DEFAULT)),
  );
  const leaves = stringLeaves(row.dict);
  const entities = leaves.filter(([, v]) => ENTITY.test(v));
  check(`business.${row.locale} spells no HTML entities`, entities.length === 0, entities);
}

check(
  "business.hi.hub.hero.cta is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(businessHi.hub.hero.cta) &&
    businessHi.hub.hero.cta !== pick(BUSINESS, DEFAULT).hub.hero.cta,
  businessHi.hub.hero.cta,
);
check(
  "business.ar.hub.hero.cta is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(businessAr.hub.hero.cta) &&
    businessAr.hub.hero.cta !== pick(BUSINESS, DEFAULT).hub.hero.cta,
  businessAr.hub.hero.cta,
);
check(
  "business crumbs match the chrome nav label for /business",
  businessHi.crumb === chromeHi.nav.links["/business"] &&
    businessAr.crumb === chromeAr.nav.links["/business"],
  { hi: businessHi.crumb, ar: businessAr.crumb },
);
/** 6 Oct 2026: the last function leaf, `enterprise.note`, went with the
 *  enterprise rebuild — the old page had no such sentence. */
check(
  "neither business locale keeps the invented enterprise note",
  !("note" in businessHi.enterprise) && !("note" in businessAr.enterprise),
);
/** 6 Oct 2026: the `&amp;` faqHead this used to pin was KYC's, and the KYC
 *  rebuild from `customerKyc.base.json` dropped its invented FAQ. What has
 *  to hold now is the old shape: six steps, six solution cards, no FAQ. */
check(
  "both business locales carry the old KYC shape: six steps, six cards, no FAQ",
  [businessHi, businessAr].every(
    (b) =>
      !("faqs" in b.customerKyc) &&
      Object.keys(b.customerKyc.how.steps).length === 6 &&
      Object.keys(b.customerKyc.solutions.cards).length === 6,
  ),
);

/** `/products/certifier`, rebuilt from `certifier.base.json`, likewise:
 *  two check tabs of four, four onboarding steps, three monitoring lines,
 *  six screenings, three agreement features, four slider alts, four
 *  industries, four why-consider cards, eight API cards, no FAQ. */
check(
  "both business locales carry the old Certifier shape and no FAQ",
  [businessHi, businessAr].every(
    (b) =>
      !("faqs" in b.certifier) &&
      Object.values(b.certifier.checks.tabs).every((t) => Object.keys(t.cards).length === 4) &&
      b.certifier.how.onboarding.steps.length === 4 &&
      b.certifier.how.monitoring.items.length === 3 &&
      b.certifier.how.statutory.items.length === 6 &&
      b.certifier.how.agreement.items.length === 3 &&
      b.certifier.how.slides.length === 4 &&
      Object.keys(b.certifier.industries.cards).length === 4 &&
      Object.keys(b.certifier.why.cards).length === 4 &&
      Object.keys(b.certifier.api.cards).length === 8,
  ),
);

console.log("6e. governments + individuals + platform hi/ar exist before those locales are served (Part 9b.5)");

const PENDING_9B5: readonly {
  ns: "governments" | "individuals" | "platform";
  locale: "hi" | "ar";
  dict: unknown;
  en: unknown;
}[] = [
  { ns: "governments", locale: "hi", dict: governmentsHi, en: pick(GOVERNMENTS, DEFAULT) },
  { ns: "governments", locale: "ar", dict: governmentsAr, en: pick(GOVERNMENTS, DEFAULT) },
  { ns: "individuals", locale: "hi", dict: individualsHi, en: pick(INDIVIDUALS, DEFAULT) },
  { ns: "individuals", locale: "ar", dict: individualsAr, en: pick(INDIVIDUALS, DEFAULT) },
  { ns: "platform", locale: "hi", dict: platformHi, en: pick(PLATFORM, DEFAULT) },
  { ns: "platform", locale: "ar", dict: platformAr, en: pick(PLATFORM, DEFAULT) },
];

for (const row of PENDING_9B5) {
  const mod = localeModule(row.ns, row.locale);
  check(
    `${row.ns}.${row.locale} exists on disk`,
    mod !== null,
    `src/lib/copy/${row.ns}.${row.locale}.tsx`,
  );
  check(
    `${row.ns}.${row.locale} is annotated (recipe step 1b)`,
    mod !== null && annotationVerdict(mod.source),
    mod?.source.split("\n").find((l) => l.startsWith("export const")),
  );
  check(
    `${row.ns}.${row.locale} has the same leaf paths as en`,
    shape(row.dict) === shape(row.en),
  );
  const leaves = stringLeaves(row.dict);
  const entities = leaves.filter(([, v]) => ENTITY.test(v));
  check(`${row.ns}.${row.locale} spells no HTML entities`, entities.length === 0, entities);
}

check(
  "governments.hi.hub.hero.cta is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(governmentsHi.hub.hero.cta) &&
    governmentsHi.hub.hero.cta !== pick(GOVERNMENTS, DEFAULT).hub.hero.cta,
  governmentsHi.hub.hero.cta,
);
check(
  "governments.ar.hub.hero.cta is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(governmentsAr.hub.hero.cta) &&
    governmentsAr.hub.hero.cta !== pick(GOVERNMENTS, DEFAULT).hub.hero.cta,
  governmentsAr.hub.hero.cta,
);
check(
  "9b.5 crumbs match the chrome nav labels",
  governmentsHi.crumb === chromeHi.nav.links["/governments"] &&
    governmentsAr.crumb === chromeAr.nav.links["/governments"] &&
    individualsHi.crumb === chromeHi.nav.links["/individuals"] &&
    individualsAr.crumb === chromeAr.nav.links["/individuals"] &&
    platformHi.crumb === chromeHi.nav.links["/platform"] &&
    platformAr.crumb === chromeAr.nav.links["/platform"],
  {
    hi: { g: governmentsHi.crumb, i: individualsHi.crumb, p: platformHi.crumb },
    ar: { g: governmentsAr.crumb, i: individualsAr.crumb, p: platformAr.crumb },
  },
);
check(
  "both individuals locales keep a bare & on hub.hero.k",
  individualsHi.hub.hero.k.includes("&") &&
    !individualsHi.hub.hero.k.includes("&amp;") &&
    individualsAr.hub.hero.k.includes("&") &&
    !individualsAr.hub.hero.k.includes("&amp;"),
  {
    hi: individualsHi.hub.hero.k,
    ar: individualsAr.hub.hero.k,
  },
);
check(
  "both platform locales keep coverage's 16 check rows in the English order",
  Object.keys(platformHi.coverage.checks.rows).join() ===
    Object.keys(PLATFORM.en.coverage.checks.rows).join() &&
    Object.keys(platformAr.coverage.checks.rows).join() ===
      Object.keys(PLATFORM.en.coverage.checks.rows).join() &&
    Object.keys(PLATFORM.en.coverage.checks.rows).length === 16,
);
check(
  "both platform locales keep a bare & on hub.hero.cta",
  platformHi.hub.hero.cta.includes("&") &&
    !platformHi.hub.hero.cta.includes("&amp;") &&
    platformAr.hub.hero.cta.includes("&") &&
    !platformAr.hub.hero.cta.includes("&amp;"),
  { hi: platformHi.hub.hero.cta, ar: platformAr.hub.hero.cta },
);

console.log("6f. remaining namespaces hi/ar exist before those locales are served (Part 9b.6)");

const PENDING_9B6: readonly {
  ns: string;
  locale: "hi" | "ar";
  dict: unknown;
  en: unknown;
}[] = [
  { ns: "resources", locale: "hi", dict: resourcesHi, en: pick(RESOURCES, DEFAULT) },
  { ns: "resources", locale: "ar", dict: resourcesAr, en: pick(RESOURCES, DEFAULT) },
  { ns: "checks", locale: "hi", dict: checksHi, en: pick(CHECKS_COPY, DEFAULT) },
  { ns: "checks", locale: "ar", dict: checksAr, en: pick(CHECKS_COPY, DEFAULT) },
  { ns: "countries", locale: "hi", dict: countriesHi, en: pick(COUNTRIES_COPY, DEFAULT) },
  { ns: "countries", locale: "ar", dict: countriesAr, en: pick(COUNTRIES_COPY, DEFAULT) },
  { ns: "about", locale: "hi", dict: aboutHi, en: pick(ABOUT, DEFAULT) },
  { ns: "about", locale: "ar", dict: aboutAr, en: pick(ABOUT, DEFAULT) },
  { ns: "contact", locale: "hi", dict: contactHi, en: pick(CONTACT, DEFAULT) },
  { ns: "contact", locale: "ar", dict: contactAr, en: pick(CONTACT, DEFAULT) },
  { ns: "legal", locale: "hi", dict: legalHi, en: pick(LEGAL_COPY, DEFAULT) },
  { ns: "legal", locale: "ar", dict: legalAr, en: pick(LEGAL_COPY, DEFAULT) },
  { ns: "blocks", locale: "hi", dict: blocksHi, en: pick(BLOCKS, DEFAULT) },
  { ns: "blocks", locale: "ar", dict: blocksAr, en: pick(BLOCKS, DEFAULT) },
  { ns: "templates", locale: "hi", dict: templatesHi, en: pick(TEMPLATES, DEFAULT) },
  { ns: "templates", locale: "ar", dict: templatesAr, en: pick(TEMPLATES, DEFAULT) },
];

for (const row of PENDING_9B6) {
  const mod = localeModule(row.ns, row.locale);
  check(
    `${row.ns}.${row.locale} exists on disk`,
    mod !== null,
    `src/lib/copy/${row.ns}.${row.locale}.tsx`,
  );
  check(
    `${row.ns}.${row.locale} is annotated (recipe step 1b)`,
    mod !== null && annotationVerdict(mod.source),
    mod?.source.split("\n").find((l) => l.startsWith("export const")),
  );
  check(
    `${row.ns}.${row.locale} has the same leaf paths as en`,
    shape(row.dict) === shape(row.en),
  );
  const leaves = stringLeaves(row.dict);
  const entities = leaves.filter(([, v]) => ENTITY.test(v));
  check(`${row.ns}.${row.locale} spells no HTML entities`, entities.length === 0, entities);
}

check(
  "resources crumbs match chrome nav /resources",
  resourcesHi.crumb === chromeHi.nav.links["/resources"] &&
    resourcesAr.crumb === chromeAr.nav.links["/resources"],
  { hi: resourcesHi.crumb, ar: resourcesAr.crumb },
);
check(
  "checks and countries resource crumbs match resources.crumb",
  checksHi.crumbs.resources === resourcesHi.crumb &&
    checksAr.crumbs.resources === resourcesAr.crumb &&
    countriesHi.crumbs.resources === resourcesHi.crumb &&
    countriesAr.crumbs.resources === resourcesAr.crumb,
);
check(
  "about crumbs match chrome about labels",
  aboutHi.crumb === chromeHi.nav.about && aboutAr.crumb === chromeAr.nav.about,
  { hi: aboutHi.crumb, ar: aboutAr.crumb },
);
check(
  "resources.hi.hub.hero.k is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(resourcesHi.hub.hero.k) &&
    resourcesHi.hub.hero.k !== pick(RESOURCES, DEFAULT).hub.hero.k,
  resourcesHi.hub.hero.k,
);
check(
  "resources.ar.hub.hero.k is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(resourcesAr.hub.hero.k) &&
    resourcesAr.hub.hero.k !== pick(RESOURCES, DEFAULT).hub.hero.k,
  resourcesAr.hub.hero.k,
);
check(
  "9b.6 function leaves stay functions",
  [
    resourcesHi.row.min,
    resourcesHi.hub.cards.checks.m,
    resourcesHi.countries.officeIn,
    resourcesAr.row.min,
    resourcesAr.hub.cards.checks.m,
    resourcesAr.countries.officeIn,
    checksHi.closing.heading,
    checksHi.closing.sub,
    checksHi.fields.h,
    checksHi.answer.lede,
    checksAr.closing.heading,
    checksAr.closing.sub,
    checksAr.fields.h,
    checksAr.answer.lede,
    countriesHi.hero.h1,
    countriesHi.nearby.officeIn,
    countriesAr.hero.h1,
    countriesAr.nearby.officeIn,
    legalHi.doc.effective,
    legalHi.doc.pending.counted,
    legalHi.other.sections,
    legalAr.doc.effective,
    legalAr.doc.pending.counted,
    legalAr.other.sections,
  ].every((f) => typeof f === "function"),
);
check(
  "both templates locales keep a bare & on bands.table",
  templatesHi.bands.table.includes("&") &&
    !templatesHi.bands.table.includes("&amp;") &&
    templatesAr.bands.table.includes("&") &&
    !templatesAr.bands.table.includes("&amp;"),
  { hi: templatesHi.bands.table, ar: templatesAr.bands.table },
);
check(
  "resources glossary TERMS stay JSX with the inverted entities",
  localeModule("resources", "hi")!.source.includes("&ldquo;") &&
    localeModule("resources", "ar")!.source.includes("&ldquo;"),
);

console.log("6g. Arabic go-cues do not keep an unmirrored → (After 9b)");

/** U+2192 in Arabic copy. Unicode does not mirror it, so a "go" cue that
 *  still uses it points backwards. Isolated markup arrows (`.xa`, `.nv-ml
 *  .k`, `.fwd`) are flipped in CSS with `--flip`; these leaves cannot be,
 *  because the glyph sits inside a text node. One population keeps `→`:
 *  the One-in-Eight UV tags (`64 → 84`) are from-to ranges. Everything
 *  else is a nav cue and is `←` in `ar`. */
function arrowLeaves(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return value.includes("→") ? [prefix] : [];
  if (typeof value === "function") return String(value).includes("→") ? [prefix] : [];
  if (value === null || typeof value !== "object") return [];
  if (Object.prototype.hasOwnProperty.call(value, "$$typeof")) {
    return arrowLeaves(
      (value as { props?: { children?: unknown } }).props?.children,
      prefix,
    );
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => arrowLeaves(v, `${prefix}[${i}]`));
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    arrowLeaves(v, prefix ? `${prefix}.${k}` : k),
  );
}

/** The specimen ranges, and two old immigration-guide FAQ answers that use
 *  → between portal steps ("visa.HelloVerify.com → Visa Screening → …"),
 *  kept as the old Arabic copy wrote them. */
function allowedArArrow(path: string): boolean {
  return (
    (path.includes(".uv.tags.") && path.endsWith(".d")) ||
    path === "individuals.immigration.guide.faqs.download[2].a" ||
    path === "individuals.immigration.guide.faqs.status[0].a"
  );
}

const arArrows = NAMESPACES.flatMap((ns) => arrowLeaves(pick(ns.dict, "ar"), ns.name));
const strayArArrows = arArrows.filter((p) => !allowedArArrow(p));
check("Arabic go-cues do not keep U+2192", strayArArrows.length === 0, strayArArrows);
check(
  "the allowlist is not vacuous — the specimen ranges and the two FAQ answers still use →",
  arArrows.filter(allowedArArrow).length === 8,
  arArrows.filter(allowedArArrow),
);

console.log("7. the numbers this slice is measured by");

/** Recorded so the next namespace has a baseline rather than a feeling. The
 *  `>text<` matcher in `lib/copy/index.ts`'s header is a 3x undercount — see
 *  that header — and this is the arithmetic behind it. */
/** 104 -> 158 strings (105 -> 159 leaves) with the old site's mega-menu in the nav (54 leaves); hero 37 -> 17 with its doors removed (Sep 2026). */
/** 76 -> 104 strings (77 -> 105 leaves) with homepage v2's footer
 *  (`chrome.footer.v2`: the sheet band, office clocks, seal captions and
 *  microtext — 28 leaves, all plain strings). */
/** 158 -> 199 strings (159 -> 200 leaves) with OTP login + Sign Up / user menu
 *  (41 leaves: nav.signUp, nav.account, four userMenu rows, login + errors). */
/** 199 -> 197 strings (200 -> 198 leaves, 10 Oct 2026): the Ministry of
 *  Manpower mark left the footer's certifications, taking its `alt` and its
 *  seal caption. */
check(
  "chrome/en holds 197 string leaves plus the one rich-text leaf",
  stringLeaves(EN).length === 197 && leafPaths(EN).length === 198,
  { strings: stringLeaves(EN).length, all: leafPaths(EN).length },
);

check(
  "account/en holds 87 string leaves (cart pay + orders + candidate invite)",
  stringLeaves(pick(ACCOUNT, DEFAULT)).length === 87 &&
    leafPaths(pick(ACCOUNT, DEFAULT)).length === 87,
  {
    strings: stringLeaves(pick(ACCOUNT, DEFAULT)).length,
    all: leafPaths(pick(ACCOUNT, DEFAULT)).length,
  },
);

/** 24 of those 77 are what the `>text<` matcher found. The other 53 are the
 *  undercount, itemised: 10 `aria-label`s, 5 `alt`s, 2 `ClosingCta` prop
 *  defaults that were parameter defaults rather than JSX, 35 labels already
 *  living as string properties in `SiteNav`'s `LINKS` and `SiteFooter`'s
 *  `COLS`/`CERTS`, and `consent.body` — a real text node the matcher drops
 *  because the node contains a `{" "}`. */
check(
  "the >text< matcher saw 24 of them; 53 is the undercount (+28 v2 footer leaves, +54 nav mega-menu leaves, +41 login, -2 MOM mark)",
  10 + 5 + 2 + 35 + 1 === 53 && 24 + 53 + 28 + 54 + 41 - 2 === leafPaths(EN).length,
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
  { name: "about", dict: ABOUT, matched: 47, leaves: 47 },
  { name: "contact", dict: CONTACT, matched: 34, leaves: 46 },
  /* 25 -> 24 (6 Oct 2026): `hero.buy` went with the unpriced buy button. */
  { name: "checks", dict: CHECKS_COPY, matched: 16, leaves: 24 },
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

/** 158 for 124 is 1.27x (155 / 1.25x before about's certification logos took
 *  their old alts and lost the hero eyebrow the old page never had, 6 Oct 2026; 168 / 1.35x before about took the old CMS copy and
 *  188 / 1.52x before contact did, both 5 Oct 2026; 161 / 1.30x before the
 *  contact tabs). Against
 *  chrome's 3.2x, and the spread inside the six is the interesting part:
 *  `legal` is 3.5x and `about` is 0.94x. The header's rule predicts it —
 *  `legal`'s page is almost entirely `d.sections.map(…)` over a catalogue, so
 *  what little copy it has is in attributes and next to interpolations where
 *  the matcher cannot see it, while `/about` is 200 lines of hand-written
 *  prose that the matcher reads almost completely. */
/* 158 -> 157 (6 Oct 2026): `checks.hero.buy`. */
check(
  "the six route namespaces total 157 leaves for 124 matched nodes",
  SLICE.reduce((a, b) => a + b.leaves, 0) === 157 &&
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
 *  dictionaries hold 560 and 11:
 *
 *      chrome     26 nodes -> 77 leaves   3.0x   (24 by the run in §7)
 *      business  206 nodes -> 560 leaves
 *
 *  475 -> 526 (5 Oct 2026): SMB content restore. Eight invented checks and
 *  eight timed chips became five package lines and 35 priced custom checks.
 *  526 -> 505 the same day: enterprise restore. The invented turnaround table
 *  and timed pills came out; partner names, three audiences and the named
 *  checks went in. Rich leaves stayed 44.
 *  505 -> 566 the same day: employee verification. Invented re-verification
 *  times came out; white-collar and blue-collar checks, why-it-matters,
 *  onboarding and primary-source names went in.
 *  566 -> 560 the same day: KYC and Certifier in the old CMS wording. Timed
 *  chips became name-only, the KYC ISO gloss fell back to the default, and
 *  Certifier's three steps became the old page's four tabs.
 *      templates  10 nodes -> 11 leaves   1.1x
 *  11 -> 9 (5 Oct 2026): the compliance band's default heading and lede
 *  came out; trade, the last page that fell back to them, has no compliance
 *  copy in the old CMS, so the band shows its eyebrow and cards only.
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

/** 516 -> 527 strings (5 Oct 2026): `/products/bgv-smb`'s client strip —
 *  its heading and ten client names (`smb.trust`, `smb.clients`).
 *  527 -> 600 (6 Oct 2026): `/products/bgv-smb` rebuilt from `bgvSmb.base.json`
 *  — the 35-row checks table with its info lines, the summary panel, Trusted
 *  by and Solutions We Offer in; the invented rack, chips, FAQ and closing
 *  out. Rich and function leaves 44 -> 39: its closing heading, one strip
 *  item, its faqHead and both function leaves went.
 *  600 -> 590 strings (6 Oct 2026): `/products/bgv-enterprise` rebuilt from
 *  `enterprise.base.json` — trust strip, partners and the three screening
 *  tabs in; the invented lanes, pills, qualities, FAQ, note and closing out.
 *  Rich and function leaves 39 -> 33: its closing heading, four strip items,
 *  its faqHead and the `note` function went; the two-line screening heading
 *  came in.
 *  590 -> 569 strings (6 Oct 2026): `/employee-verification` rebuilt from
 *  `employees.base.json` — the banner, image alts, onboarding tabs and the
 *  HR results in; the invented eyebrows, ledes, industry chips, four FAQs
 *  and closing out. Rich leaves 33 -> 27: its closing heading, four strip
 *  items and its faqHead went.
 *  569 -> 568 strings (6 Oct 2026): `/products/customer-kyc` rebuilt from
 *  `customerKyc.base.json` — six steps and six solution cards in; the lanes,
 *  chips, flow steps, privacy stance, four FAQs and closing out. Rich leaves
 *  27 -> 21: its closing heading, four strip items and its faqHead went.
 *  568 -> 597 strings (6 Oct 2026): `/products/certifier` rebuilt from
 *  `certifier.base.json` — the two check tabs, the four how-it-works tabs
 *  and slider alts, industries, why-consider and API cards in; the lanes,
 *  chips, two package receipts, steps strip, FAQs and closing out. Rich
 *  leaves 21 -> 18: its closing heading, four strip items and its faqHead
 *  went; the three Vendor Monitoring lines (old CMS `bold` parts) came.
 *  597 -> 598 strings (6 Oct 2026): `smb.summary.cartName`, the custom
 *  package's name in checkout, the cart and My Orders. */
check(
  "business/en holds 598 string leaves and 18 rich-text leaves",
  stringLeaves(BIZ).length === 598 && leafPaths(BIZ).length === 616,
  { strings: stringLeaves(BIZ).length, all: leafPaths(BIZ).length },
);

/** The 18, itemised, so changing one of them has to change this line. Six
 *  `<h1>`s and the enterprise screening heading carry an `<em>`; the 8
 *  trust-strip items are `<b>figure</b> tail`, which is TWO children and
 *  therefore one rich-text leaf rather than two string leaves — splitting
 *  them would put two adjacent text children where one sits today, and
 *  React's SSR writes `<!-- -->` between those (measured with
 *  `renderToString` before the move); and the three certifier Vendor
 *  Monitoring lines carry the old `<b>` runs. No function leaf is left. */
check(
  "…and the 18 are 6 h1 + 1 screening heading + 3 monitoring lines + 8 strip",
  6 + 1 + 3 + 8 === leafPaths(BIZ).length - stringLeaves(BIZ).length,
  leafPaths(BIZ).length - stringLeaves(BIZ).length,
);

check(
  "templates/en holds 9 string leaves and no rich-text leaf",
  stringLeaves(TPL).length === 9 && leafPaths(TPL).length === 9,
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

/** 6 Oct 2026: `/products/bgv-enterprise` was rebuilt from
 *  `enterprise.base.json`, which has no FAQ, so its five invented questions
 *  (and `content.ts`'s `FAQ_ORDER`, and the FAQPage node) went. The old
 *  screening tabs are in their CMS order instead. */
check(
  "the enterprise copy has no FAQ, and the three screening tabs are in the old order",
  !("faqs" in BIZ.enterprise) &&
    Object.keys(BIZ.enterprise.screening.tabs).join() === "employees,businesses,customers",
  Object.keys(BIZ.enterprise),
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

/** THE PHONE PASS (25 Sep 2026) made every v2 band one tree at every width,
 *  so the leaves only the deleted `.mob` trees read went with them (hero
 *  38 -> 37, numbers 26 -> 24, why 89 -> 77, howItWorks 168 -> 161, consumer
 *  162 -> 136, checks 77 -> 59, international 152 -> 117, packages 61 -> 56,
 *  peopleStrip 53 -> 35, presence 67 -> 52), and the three phone-only bands
 *  — `whoItsFor` [7, 19] and `demo2` [39, 43] here, `blocks.panels` [12, 38]
 *  below — were deleted outright. Their matcher figures leave the historical
 *  sums with them: 152 -> 106 nodes in `sections`, 27 -> 15 in `blocks`. */
const BANDS: Record<string, readonly [number, number]> = {
  /** 6 -> 38 with homepage v2 (Sep 2026): the desktop tree gained the
   *  security-print notes, microtext, seal, motion labels and six doors (3
   *  leaves each). The matcher figure stays the migration-time 9 — it is the
   *  historical count the 152 below sums, not a re-measurement. 17 -> 18
   *  (29 Sep 2026): the "Trust Infrastructure platform" headline splits its
   *  italic line so the seal rides on the last word, `headlineEmEnd`.
   *  18 -> 24: the live ledger's six labels (`hero.ledger`); its figures
   *  are `numbers`' own. 24 -> 23 (30 Sep 2026): `ledger.pace`, the "About
   *  one every 14 seconds" line under the count, went. */
  hero: [9, 23],
  compliance: [4, 5],
  numbers: [14, 24],
  why: [8, 77],
  /** 161 -> 141 (29 Sep 2026): the two specimens are scans now, so the
   *  words the SVG drew on them (title, microtext, field labels and values,
   *  issuer, signature line) went; each route keeps its four box tags. */
  /* 141 -> 143 (4 Oct 2026): the licence route names its two shift clients. */
  /* 143 -> 141 (10 Oct 2026): and stops naming them (`houses`). */
  howItWorks: [5, 141],
  /* 136 -> 137 (6 Oct 2026): the WhatsApp ask's button, `shop.cta`. 136 -> 139
   *  (14 Oct 2026): a detail line under each QR step (`shop.steps.s*.d`); the
   *  band measured 136 when they were added. 139 -> 143 (16 Oct 2026): a
   *  Basic price for each home service (`shop.services.*.basicPrice`).
   *  143 -> 151 (21 Oct 2026): Basic and Advanced prices on the four
   *  online services, the same ₹699 / ₹1499 as Hello Staff. */
  consumer: [10, 151],
  checks: [7, 59],
  /* 117 -> 127 (30 Sep 2026): sales pass: impact figures and actions. */
  /* 127 -> 126 (30 Sep 2026): the KSA code went: Saudi Arabia shows its flag. */
  international: [6, 126],
  /* 56 -> 55 (30 Sep 2026): one-line heading, "Key Verification Solutions". */
  /* 55 -> 62 (6 Oct 2026): the blue-collar client rail — "Trusted by" and six names. */
  /* 62 -> 152 (6 Oct 2026): the two-workforce redesign — heading, jump
   *  links, stamp, and per collar its promise, sectors, figures, checks,
   *  example case and client heading (+91); "Trusted by" went (-1). */
  /* 126 -> 133 (7 Oct 2026): the white-collar client rail's seven names. */
  packages: [7, 133],
  /** New 30 Sep 2026: the old site's country grid — heading, lede, the
   *  turnaround label, the CTA and five countries' name and line. */
  /* 14 -> 13 (1 Oct 2026): the lede under the heading went. */
  /* 13 -> 8 (13 Oct 2026): the five lines under the country names went. */
  intlGrid: [0, 8],
  /** 35 -> 38 (30 Sep 2026): the strip became "Individual Checks" — six
   *  checks (name, line, turnaround, price) and its heading, lede and
   *  price-row labels, in place of eight people. */
  peopleStrip: [2, 38],
  /** New 5 Oct 2026: the nav's three premium services, under Individual
   *  Checks. Kicker, two heading lines, the link label, and three cards.
   *  10 -> 14 (5 Oct 2026, the redesign): the lede and each card's `who`. */
  premiumServices: [0, 14],
  contact: [11, 12],
  customerStory: [15, 18],
  /** 52 -> 45 (29 Sep 2026): the hour-coverage strip under the map went,
   *  with its five axis labels, `sun.coverage` and `sun.hour`. */
  /** 45 -> 108 (29 Sep 2026): the relay replaced the follow-the-sun map —
   *  the `sun` strings (clock, controls, statuses, countries) went, and the
   *  counters, the country chips, six journeys told in five captions, the
   *  timeline, the desk cards and the stamp's ring (`seal`) came. */
  /* 93 -> 100 (30 Sep 2026): Nigeria replaced Pakistan and Bangladesh joined
   *  the relay: one country name and six journey words each. */
  presence: [8, 100],
  /** Bands homepage v2 added (Sep 2026). The first number is the migration-
   *  time `>text<` matcher count, which never saw them, so it is 0 and the
   *  152 sum below still describes the migration. The second is measured. */
  /** 55 -> 60 (29 Sep 2026): eight scans replace the drawn certificates
   *  (`inst`/`deg`/`name`/`yr` -> `kind`/`where`, the `certify` line and the
   *  UV microtext gone: -36, +17) and the case file adds 24 strings.
   *  60 -> 69: the lens names what it rings — `uv.erasure` gave way to five
   *  two-line `uv.tags` (three alterations, two emblem callouts).
   *  69 -> 177 (30 Sep 2026): every document on the table is forged. Eight
   *  case files (title, alt, zoom alt and 3-5 findings each) in place of
   *  one, ten more lens callouts, `flagged`, and the case file's previous /
   *  next (`navLabel`, `prev`, `next`); the shared `case.k` became a prefix. */
  oneInEight: [0, 177],
  /** 115 -> 147 (29 Sep 2026): five seals became four (MOM, Latvia, Italy,
   *  MOHESR), and each record gained an impact label, three figures and
   *  three reasons (+13 each), with one shared `whyK`. 147 -> 169: each
   *  record became a pitch — a challenge (+2) and four delivery steps with
   *  their benefits (+8) in place of the four-word chain and its caption
   *  (-5) — with two more shared labels, `problemK` and `deliverK`. 169 ->
   *  166: its closing line (three leaves) moved to `govWhy.items.trust.p`. */
  /* 166 -> 162 (30 Sep 2026): the seals' sub-lines (`where`) went; the
   *  country now sits in the name where it is needed. */
  /* 162 -> 174 (30 Sep 2026): the partner pitch closing every record. */
  /* 174 -> 129 (1 Oct 2026): the client's wording — each record's four
   *  delivery steps (-8) and its impact label and figures (-7) became one
   *  to two call-to-action cards (+14 in all), three sub-lines went (-3),
   *  `deliverK` became `startK`, and the four button labels came (+4). */
  /* 129 -> 104 (1 Oct 2026): each record's three reasons (-6 each) and
   *  the shared `whyK` went. 104 -> 106: Latvia's employers & agencies card. 106 -> 94: the partner
   *  pitch closing every record (12) went. */
  govSeals: [0, 94],
  /** New 29 Sep 2026: six reasons (12), the words inside their pictures
   *  (17), the heading block (5), the certifications and the ask (2). */
  /* 36 -> 35 (30 Sep 2026): the lede under the heading went. */
  /* 35 -> 53 (1 Oct 2026): the pictures show their reasons literally — the
   *  five gates went; the verified record, the numbers, the four authorities
   *  in words and the report's contents came. */
  /* 53 -> 45 (1 Oct 2026): the governments plate reads the seals' names,
   *  so its eight country words went. */
  /* 45 -> 44 (1 Oct 2026): the certifications line by the ask went. */
  /* 44 -> 47 (3 Oct 2026): plate 01 became the nation in cross-section —
   *  a fourth institution (the employer) and the names of its two strata. */
  /* 47 -> 52 (3 Oct 2026): plate 02 became the checkpoint — the five
   *  things its gate's sign rolls through. */
  /* 52 -> 54 (3 Oct 2026): plate 03 named the two ecosystems it unifies. */
  /* 54 -> 56 (4 Oct 2026): plate 04 names the two kinds of seat. The
   *  crests went; a mark does not survive a longer list. */
  /* 56 -> 90 (10-11 Oct 2026): the band became a 12-second clock of six
   *  steps, steps 05 and 06 redrawn; two of the new leaves are numbers, the
   *  scale counter's `viz.scale.count.from` and `.to`. */
  govWhy: [0, 90],
  /* 165 -> 166 (30 Sep 2026): authority cards add MOHESR. */
  govDossiers: [0, 166],
  /* 105 -> 117 (1 Oct 2026): the sales pass — each panel's three figures
   *  and their caption (+7 a panel, +21) for Employees' onboarding rail
   *  (-5) and Certifier's benefit cards (-6); Employees' heading split in
   *  two and gained a lede (+2). */
  enterprises: [0, 117],
  /** 50 -> 62 (29 Sep 2026): the Large ↔ Small & Medium toggle, `smb.seg` —
   *  its labels and heading (8) and the KYC and Vendor cards (4). */
  /* 62 -> 60 (30 Sep 2026): the toggle sub-lines went. */
  /* 60 -> 66 (30 Sep 2026): client logo names added. */
  /* 66 -> 69 (1 Oct 2026): `smb.demo`, the how-it-works screen's step-list
   *  name and two lines drawn on it. */
  /* 69 -> 70 (1 Oct 2026): `smb.seg.lede`, the Large panel's lede, which
   *  had been `enterprises.employees.h`. */
  /* 70 -> 75 (4 Oct 2026): the blue-collar punch clock — 30, min,
   *  onboarded, and the two shift clients. */
  /* 75 -> 87 (5 Oct 2026): the SMB panel's client strip — its two-part
   *  heading and ten client names. */
  /* 87 -> 82 (6 Oct 2026): the blue-collar punch clock went. */
  smb: [0, 82],
  diligence: [0, 27],
  trustPlatform: [0, 52],
  /** New 30 Sep 2026: the field case — heading block and rail label (7),
   *  the case card (3), HUD and pins (10), the distance and three AI flags
   *  (4), two pieces of evidence (8), the in-country frame and four chips
   *  (5), five acts (20), the report (15), the outro and its five places
   *  (13), the pause (2). 87 -> 106 (30 Sep 2026): the orbit — a sixth act
   *  (4), the globe's places, region, six offices and counter (11), the
   *  loupe (2), the HUD's view (1) and the translation label (1). */
  fieldCase: [0, 106],
  /** New 30 Sep 2026: the field case moved to `/ai`; the page's crumb and
   *  closing band. */
  aiPage: [0, 3],
};

/** helloVPhone 22 -> 47 (14 Oct 2026): the phone plays the real bot's
 *  flow — the menu's seven options, the pick and the Razorpay message —
 *  instead of the licence-photo chat. */
const BLOCK_FILES: Record<string, readonly [number, number]> = {
  helloVPhone: [15, 47],
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

/** 1592 -> 1582: `whoItsFor`'s ten desktop-only leaves (see `BANDS`).
 *  1582 -> 1557: `oneInEight.compare`, the claimed-vs-verified card dropped
 *  on review (24 Sep 2026) — 25 string leaves. 1557 -> 1558: the ID badges'
 *  `enterprises.employees.turn`. 1558 -> 1559: the SMB conversion pass
 *  added `smb.best` and `smb.perCheck` and dropped `smb.included`.
 *  1559 -> 1557 and blocks 77 -> 60: the closing band's form is the real
 *  `ContactForm` now, so `contact.k`, `contact.submit` and the whole
 *  `blocks.leadMock` mock (17 leaves) went. 1557 -> 1558: the KYC phone's
 *  step heading, `enterprises.customers.stepsK`. 1558 -> 1357 and blocks
 *  60 -> 22: the phone pass (see `BANDS`). 1337 -> 1322: the specimen
 *  scans (howItWorks -20, oneInEight +5, see `BANDS`). 1322 -> 1331: the
 *  lens callouts (oneInEight +9). 1332 -> 1333: `hero.headlineEmEnd`. 1333 -> 1326:
 *  the presence hour strip (see `BANDS`). 1326 -> 1332: `hero.ledger`. 1332 -> 1364: the
 *  four-seal governments band (see `BANDS`); 1364 -> 1386: its records
 *  rewritten as pitches. 1386 -> 1419: the `govWhy` band (+36) and the
 *  seals' closing line it took over (-3). 1419 -> 1431: `smb.seg`. 1431 -> 1479:
 *  the presence relay (+48, see `BANDS`). 1479 -> 1587: eight forgeries on
 *  the evidence table (`oneInEight`, see `BANDS`). 1587 -> 1586:
 *  `hero.ledger.pace`. 1586 -> 1673: the field case (`fieldCase`); 1673 -> 1692: its orbit; 1692 -> 1688: the seals' `where` lines; 1688 -> 1691: Individual Checks; 1691 -> 1690: packages' one-line heading; 1690 -> 1704: `intlGrid`; 1749 -> 1752: `smb.demo`; 1752 -> 1765: the Enterprises sales pass; 1765 -> 1764: `govWhy.certs`; 1764 -> 1719: the authority records' CTA cards; 1719 -> 1694: their "Why HelloVerify" reasons; 1694 -> 1696: Latvia's employers & agencies card; 1696 -> 1684: the records' partner pitch; 1684 -> 1683: `intlGrid.lede`; 1683 -> 1686: `govWhy` plate 01's cross-section; 1686 -> 1691: plate 02's checkpoint; 1691 -> 1693: plate 03's ecosystems; 1693 -> 1695: plate 04's seats; 1695 -> 1700: the blue-collar punch clock; 1700 -> 1702: the licence route's two clients; 1702 -> 1712: `premiumServices`; 1712 -> 1724: the SMB client strip; 1724 -> 1728: the premium redesign's lede and audiences. 1728 -> 1735: the blue-collar client rail; 1735 -> 1825: the two-workforce redesign; 1825 -> 1815: dropping its "Hiring both?" band; 1815 -> 1799: four named checks a collar, no descriptions; 1799 -> 1794: dropping the blue-collar punch clock; 1794 -> 1795: the WhatsApp ask's button; 1795 -> 1802: the white-collar client rail's seven names; 1802 -> 1831: `govWhy`'s clock (+34), `howItWorks` dropping its shift clients (-2), the WhatsApp steps' lines (`consumer` +2) and the country cards' pitches (`intlGrid` -5). 1831 -> 1835: the four home services' Basic prices (`shop.services.*.basicPrice`). 1835 -> 1843: Basic and Advanced prices on the four online services. */
check(
  "sections holds 1843 leaves for 106 nodes and blocks 47 for 15 (438 before homepage v2)",
  leafPaths(EN_SECTIONS).length === 1843 &&
    leafPaths(EN_BLOCKS).length === 47 &&
    Object.values(BANDS).reduce((a, b) => a + b[0], 0) === 106 &&
    Object.values(BLOCK_FILES).reduce((a, b) => a + b[0], 0) === 15,
  { sections: leafPaths(EN_SECTIONS).length, blocks: leafPaths(EN_BLOCKS).length },
);

/** The 13 non-string leaves in `sections`, itemised so moving one has to
 *  move this line. Twelve are rich text the artboard exporter left split
 *  around an `&amp;` or a `<br />` — three `whoItsFor` tags, one `whoItsFor`
 *  heading, `checks.items.directorsGst.name`, two `checks.lanes` headings,
 *  `packages.more`, `packages.lines.credit`, `packages.packs.visaHealth.tt`
 *  and two `demo2.checks` labels — and the thirteenth is `packages.tot`, the
 *  one FUNCTION leaf in either namespace. */
/** Homepage v2 added seven more: three rich-text `enterprises.letters` quotes
 *  (the highlighted phrase is a `<mark>`) and four function leaves that
 *  format a number into a label — `packages.count`, `smb.tot`,
 *  `smb.build.count`, `smb.build.rupees`. So 15 rich-text + 5 functions. */
/** The Sep 2026 perf pass removed one rich-text leaf and nine strings: the
 *  first `whoItsFor` tag ("Governments & authorities", desktop only — two
 *  `whoItsFor` tags remain rich) and the band's `headingA`, `headingB`,
 *  `lede` and six `note`s. So 1563 strings, 14 rich-text + 5 functions.
 *  Dropping `oneInEight.compare` took 25 more strings: 1538; the badges'
 *  "Turn over" added one: 1539. The SMB conversion pass swapped one string
 *  for another (`smb.best` for `smb.included`) and added a sixth function,
 *  `smb.perCheck`. The real closing-band form dropped two strings: 1537;
 *  the KYC step heading added one: 1538. The phone pass took the strings
 *  to 1346 and removed eight rich-text leaves (the `whoItsFor` and `demo2`
 *  ones, both `checks.lanes` headings, `packages.more`) and one function
 *  (`packages.tot`, with the receipt tree it labelled). What is left: six
 *  rich-text — `checks.items.directorsGst.name`, `packages.lines.credit`,
 *  `packages.packs.visaHealth.tt` and the three letter quotes — and five
 *  functions. The specimen scans (29 Sep 2026) took the strings to 1311,
 *  and the lens callouts to 1320; `hero.headlineEmEnd` to 1322; the presence hour strip to 1315; `hero.ledger` to 1321; the four-seal governments band to 1353, and its pitch records to 1375; `govWhy` to 1408; `smb.seg` to 1420; the presence relay to 1468; eight forgeries on the evidence table to 1576; dropping `hero.ledger.pace` to 1575; the field case to 1662, and its orbit to 1681; the seals' `where` lines to 1677; Individual Checks to 1680; packages' one-line heading to 1679; `intlGrid` to 1693; `smb.demo` to 1741; the Enterprises sales pass (three figures a panel, `smb.seg.lede`) to 1754; dropping `govWhy.certs` to 1753; the authority records' CTA cards to 1708; dropping their "Why HelloVerify" reasons to 1683; Latvia's employers & agencies card to 1685; dropping the records' partner pitch to 1673; dropping `intlGrid.lede` to 1672; `govWhy` plate 01's cross-section to 1675; plate 02's checkpoint to 1680; plate 03's ecosystems to 1682; plate 04's seats to 1684; the blue-collar punch clock to 1689; the licence route's two clients to 1691; `premiumServices` to 1701; the SMB client strip to 1713; the premium redesign to 1717; the blue-collar client rail to 1724; the two-workforce redesign to 1814; dropping its "Hiring both?" band to 1804; four named checks a collar to 1788; dropping the blue-collar punch clock to 1783; the WhatsApp ask's button to 1784; the white-collar client rail to 1791; the leaf moves above to 1818; the home services' Basic prices to 1822; the four online services' prices to 1830. `govWhy`'s clock also brought the first two number leaves, `govWhy.viz.scale.count.from` and `.to`. */
check(
  "sections: 1830 string leaves, 6 rich-text, 5 function and 2 number leaves",
  stringLeaves(EN_SECTIONS).length === 1830 &&
    leafPaths(EN_SECTIONS).length - stringLeaves(EN_SECTIONS).length === 13 &&
    typeof EN_SECTIONS.govWhy.viz.scale.count.from === "number" &&
    [EN_SECTIONS.smb.perCheck, EN_SECTIONS.packages.count, EN_SECTIONS.smb.tot, EN_SECTIONS.smb.build.count, EN_SECTIONS.smb.build.rupees].every((f) => typeof f === "function"),
  { strings: stringLeaves(EN_SECTIONS).length, all: leafPaths(EN_SECTIONS).length },
);

/** `blocks` is all strings now: its two rich-text leaves went with the mock
 *  form (`leadMock.fields.mobile.value`) and the phone-only process panels
 *  (`panels.read.checks.c1.l`). */
check(
  "blocks: 47 string leaves and no rich-text leaf",
  stringLeaves(EN_BLOCKS).length === 47 &&
    leafPaths(EN_BLOCKS).length - stringLeaves(EN_BLOCKS).length === 0,
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
  "HowItWorks' four steps still key on Upload/Read/Confirm/Report",
  [
    EN_SECTIONS.howItWorks.steps.upload.label,
    EN_SECTIONS.howItWorks.steps.read.label,
    EN_SECTIONS.howItWorks.steps.confirm.label,
    EN_SECTIONS.howItWorks.steps.report.label,
  ].join("|") === "Upload|Read|Confirm|Report",
  Object.values(EN_SECTIONS.howItWorks.steps).map((s) => s.label),
);

/** A function leaf, against the label it prints. This pinned
 *  `packages.tot` until the phone pass deleted the receipt tree it labelled;
 *  `smb.tot` is the same shape — a number formatted into ONE child. */
check(
  "smb.tot(n) prints the receipt's count line",
  EN_SECTIONS.smb.tot(4) === "4 checks · 60 mins" && EN_SECTIONS.smb.tot(3) === "3 checks · 60 mins",
  EN_SECTIONS.smb.tot(4),
);

/** …and `leafPaths` counts it as one leaf rather than walking it, which is
 *  what makes the 438 above comparable with chrome's 77. */
check(
  "leafPaths treats the function leaf as one leaf",
  leafPaths(EN_SECTIONS.smb.tot).join("|") === "",
  leafPaths(EN_SECTIONS.smb.tot),
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
const renamed = { ...EN_SECTIONS.howItWorks.steps, read: { ...EN_SECTIONS.howItWorks.steps.read, label: "Reading" } };
check(
  "the key guard WOULD fail on a renamed step label",
  [renamed.upload.label, renamed.read.label, renamed.confirm.label, renamed.report.label].join("|") !==
    "Upload|Read|Confirm|Report",
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
  stringLeaves({ credit: EN_SECTIONS.packages.lines.credit }).length === 0 &&
    typeof EN_SECTIONS.packages.lines.credit !== "string",
  typeof EN_SECTIONS.packages.lines.credit,
);

/** The `tot` guard, broken on the spelling that would put the number and the
 *  words in two children. It is a STRING comparison here, so what it catches
 *  is the wording drifting; the two-children mistake is caught by
 *  `html-identity.mjs` and by the comment at the call site. */
check(
  "the tot guard WOULD fail if the label's wording drifted",
  ((n: number) => `${n} checks, 60 mins`)(4) !== EN_SECTIONS.smb.tot(4),
  EN_SECTIONS.smb.tot(4),
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
  // Empty since the phone pass (25 Sep 2026) deleted `sections/Demo2.tsx`,
  // its one entry ("five real builds measured this one byte-neutral"). The
  // self-tests below build their own allowlist, so they still prove the
  // mechanism with nothing listed here.
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
const fakeAllow: Record<string, string> = { "sections/Allowed.tsx:Allowed": "measured byte-neutral" };
const pretendOffenders = ["sections/Allowed.tsx:Allowed", "blocks/Unlisted.tsx:Unlisted"];
check(
  "the allowlist WOULD still fail on an offender that is not listed",
  pretendOffenders.filter((o) => fakeAllow[o] === undefined).join("|") === "blocks/Unlisted.tsx:Unlisted",
  pretendOffenders.filter((o) => fakeAllow[o] === undefined),
);
check(
  "…and the staleness check WOULD fail once the allowed one is fixed",
  !Object.keys(fakeAllow).every((k) => ([] as string[]).includes(k)),
  Object.keys(fakeAllow),
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
 *      platform/coverage                 33       -> 106          3.2x   (old CMS copy, 5 Oct 2026)
 *      platform/technology               52       ->  53          1.02x  (old CMS copy, 5 Oct 2026)
 *      platform/security-compliance      43       ->  99          2.3x
 *      governments/page.tsx              46       ->  65          1.41x
 *      governments/health                15       ->  80          5.3x   (old CMS copy and order, 6 Oct 2026; hero CTA)
 *      governments/immigration           15       ->  75          5.0x   (old CMS copy and order, 6 Oct 2026)
 *      governments/manpower-education    15       ->  49          3.3x   (old CMS copy and order + the live MOHESR card, 6 Oct 2026)
 *      governments/trade                 15       ->  26          1.7x   (old CMS copy and order, 6 Oct 2026)
 *      .../ministry-of-manpower          44       -> 124          2.8x   (old CMS copy, 5 Oct 2026)
 *
 *  Over both subtrees: 818 leaves for 306 matched nodes, 2.67x — inside the
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
  /* 124 -> 131 (6 Oct 2026): the check builder — the count, sort label and
   *  ten summary labels in (+12); Add, Explore More, View Less, Add Multiple
   *  and the Action column out (-5). */
  /* 131 -> 160 (7-13 Oct 2026): the builder's local currency, extended
   *  coverage fee, removed-check notices, delivery choice and turnaround
   *  disclaimer. All plain strings. */
  /* 160 -> 162 (15 Oct 2026): the third-party fees note under the receipt. */
  coverage: [33, 162],
  /* 57 -> 73 (22 Oct 2026): sixteen short labels drawn inside the page's
   *  illustrations (`technology.art`). All plain strings.
   *  73 -> 75: "Research" and "Fraud", the two words on the research board.
   *  75 -> 77: "Routed" and "Abroad", the two words on the orchestration board.
   *  77 -> 97: the orchestration map's captions (`technology.art.orch`).
   *  97 -> 139 (23 Oct 2026): the three pillar boards became one story on
   *  one thread. Out: the 20 `orch` captions and the five words only the
   *  old boards drew (Uploaded, Research, Fraud, Routed, Abroad). In: the
   *  67 labels of `technology.art.story`. All plain strings.
   *  139 -> 159: the hero globe's 20 (`technology.art.globe`), two of them
   *  the pause control's labels. The case itself is the pillar story's
   *  applicant, so it is not counted again. 159 -> 158: the globe's caption
   *  is one phrase, so `art.sources` is no longer drawn. All plain strings.
   *  158 -> 194: the compounding section became a race. Out: `trust`, the
   *  five `orbit` words and `art.static`/`art.compounding` (-8). In:
   *  `compound.race` (+44): its lanes, narration and keeps, four figures
   *  already on `/about` or the homepage (a value and a label each) and its
   *  pause control's two labels. All plain strings.
   *  194 -> 196: the race became a scroll story. Out: `compound.race`
   *  (-44). In: `compound.grow` (+46): fourteen candidates, two check
   *  types, four kinds of institution and six cities, the frauds and the
   *  database's words, the hub's year, the same four figures and the
   *  caption under the mark. All plain strings. */
  technology: [52, 196],
  security: [43, 99],
};

const GOVERNMENT_FILES: Record<string, readonly [number, number]> = {
  hub: [46, 65],
  health: [15, 80],
  immigration: [15, 75],
  manpowerEducation: [15, 49],
  trade: [15, 26],
  mom: [44, 124],
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
 *  into `/international` that all four vertical pages share. Both are the
 *  "a label per destination" shape `chrome.footer.links` uses, which is why
 *  they sit above the pages rather than inside four of them. */
check(
  "platform holds 484 leaves for 156 matched nodes — four pages plus the shared crumb",
  leafPaths(EN_PLATFORM).length === 484 &&
    Object.values(PLATFORM_FILES).reduce((a, b) => a + b[0], 0) === 156 &&
    Object.values(PLATFORM_FILES).reduce((a, b) => a + b[1], 0) + 1 === leafPaths(EN_PLATFORM).length,
  { measured: leafPaths(EN_PLATFORM).length },
);

check(
  "governments holds 421 leaves for 150 matched nodes — six pages plus crumb and coverageLink",
  leafPaths(EN_GOVERNMENTS).length === 421 &&
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
 *  `platform`: 8 `<em>` headings (four `h1`s, two `ClosingCta`s — coverage
 *  and technology close on the chrome default — coverage's packages heading
 *  and technology's compound heading), 8 trust-strip items (`<b>figure</b>
 *  tail`, which is TWO children and therefore one leaf — splitting them would
 *  put two adjacent text children where one sits today), 1 `FaqSection` head —
 *  security's —, `security.certs.h`'s `<br />`, and the two accessibility
 *  paragraphs carrying a mid-sentence `<strong>`. Coverage and technology lost
 *  their strips, FAQs and closing copy to the old CMS copy on 5 Oct 2026.
 *
 *  323 -> 341 (22 Oct 2026): sixteen illustration labels in `technology.art`,
 *  all plain strings, plus two string leaves the tree already held above the
 *  written 323 before that addition. 341 -> 343: Research and Fraud.
 *  343 -> 345: Routed and Abroad. 345 -> 365: the orchestration map's
 *  captions. 365 -> 407 (23 Oct 2026): the pillar story, 67 labels in for
 *  25 out (see `technology` above). 407 -> 426: the hero globe's 20, less
 *  the `art.sources` label the caption no longer draws. 426 -> 462: the
 *  compounding race (see `technology` above). 462 -> 464: the race became
 *  the scroll story. Rich text is unchanged at 20. */
check(
  "platform: 464 string leaves and 20 rich-text leaves",
  stringLeaves(EN_PLATFORM).length === 464 &&
    leafPaths(EN_PLATFORM).length - stringLeaves(EN_PLATFORM).length === 20 &&
    8 + 8 + 1 + 1 + 2 === 20,
  { strings: stringLeaves(EN_PLATFORM).length, all: leafPaths(EN_PLATFORM).length },
);

/** `governments`: 9 `<em>` headings (six `h1`s, the hub's closing heading,
 *  `mom.closing.heading` — `sections/AuthorityPage.tsx`'s — and
 *  `mom.support.heading`, the MOM page's own closing), the hub's 4
 *  trust-strip items, and the education page's client line, whose "120+" is
 *  the old CMS emphasis. Health, immigration, education and trade were
 *  rebuilt on the old section order on 6 Oct 2026 and close on their last old
 *  section, so they carry no closing copy, strips or function leaves. */
check(
  "governments: 407 string leaves and 14 rich-text leaves",
  stringLeaves(EN_GOVERNMENTS).length === 407 &&
    leafPaths(EN_GOVERNMENTS).length - stringLeaves(EN_GOVERNMENTS).length === 14 &&
    9 + 4 + 1 === 14,
  { strings: stringLeaves(EN_GOVERNMENTS).length, all: leafPaths(EN_GOVERNMENTS).length },
);

/** THE THIRD COROLLARY, pinned for this slice. `lib/copy/index.ts` says a
 *  `key=` expression must keep resolving to the string it resolved to before,
 *  and these two subtrees hold 61 of them in dictionaries:
 *
 *    - `/international` keys each package card's check lines on the tag text
 *      (the old CMS `tags`, 5 Oct 2026; its tabs, cards and table rows key on
 *      ids);
 *    - `/platform/security-compliance` keys four residency rows on `nm` and six
 *      artefact rows on `t`;
 *
 *  The literals below are the PRE-MIGRATION strings, typed out from the
 *  pre-change build's `.next/server/app/en/**.html`, which is the point:
 *  reading them back out of the dictionary would assert nothing. */
const COVERAGE_TAG_KEYS =
  "Criminal Check|Passport Check|Entitlement to Work/" +
  "Criminal Check|Driving License Check|Current Address Check/" +
  "Criminal Check|Identity Check|Credit Check";
check(
  "coverage's package cards key their check lines on the old CMS tags",
  Object.values(EN_PLATFORM.coverage.packages.cards).map((x) => x.tags.join("|")).join("/") ===
    COVERAGE_TAG_KEYS,
  Object.values(EN_PLATFORM.coverage.packages.cards).map((x) => x.tags),
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

// Health carries the old practitioner categories and primary-source cards,
// in the CMS order.
check(
  "governments.health: practitioner categories and PSV cards are the old ones, in order",
  Object.values(EN_GOVERNMENTS.health.categories.items).join("|") ===
    "Doctor|Practitioners|Non-physician|Pharmacists|Nurses and Midwives" &&
    Object.values(EN_GOVERNMENTS.health.psv.cards).map((c) => c.t).join("|") ===
      "Education Verification|Institute Accreditation Check|Health License|" +
        "Certificate Of Good Standing|Business Registration Certificate|Employment Verification",
  [Object.values(EN_GOVERNMENTS.health.categories.items), Object.values(EN_GOVERNMENTS.health.psv.cards).map((c) => c.t)],
);

// Trade is the old page's three audience rows, in the CMS order.
check(
  "governments.trade: its rows are the old three audiences, in order",
  Object.values(EN_GOVERNMENTS.trade.rows).map((r) => r.h).join("|") ===
    "For Government and Diplomatic Missions|For Companies and Enterprises|For Hiring Agents and Recruitment Intermediaries",
  Object.values(EN_GOVERNMENTS.trade.rows).map((r) => r.h),
);

// Immigration authorities carries the old "AI-Powered Immigration
// Verification Solution" bullets, three columns of four, in order.
check(
  "governments.immigration: the AI-solution bullets are the old twelve, in order",
  Object.values(EN_GOVERNMENTS.immigration.ai.cols).flatMap((c) => c.items).map((r) => r.t).join("|") ===
    "Tampered Documents|Document Credibility Issues|Compliance & Regulatory Risk|Identity Manipulation|" +
      "Modern vs Legacy Systems|Advanced Fraud Detection|Audit-Ready Reporting|Real-time Dashboards|" +
      "Detects Complex & Fraudulent case|Identifies inconsistencies|Digital verification|AI-driven fraud detection",
  Object.values(EN_GOVERNMENTS.immigration.ai.cols).flatMap((c) => c.items).map((r) => r.t),
);

// Manpower & education carries the old "Our Verification Services" cards, in
// order.
check(
  "governments.manpowerEducation: its service cards are the old two, in order",
  Object.values(EN_GOVERNMENTS.manpowerEducation.services.cards).map((c) => c.t).join("|") ===
    "Qualification Verification|Institution Accreditation",
  Object.values(EN_GOVERNMENTS.manpowerEducation.services.cards).map((c) => c.t),
);

// The MOM page's HowTo is the old "How it works", in its order, and its FAQ
// band is the old 19 questions (5 Oct 2026).
const MOM_HOW = EN_GOVERNMENTS.mom.how;
check(
  "governments.mom: the HowTo steps are the old four, in order",
  [MOM_HOW.register, MOM_HOW.qualifications, MOM_HOW.loa, MOM_HOW.report].map((s) => s.t).join("|") ===
    "Register & Upload|Add Qualifications|Sign LOA & Pay|Receive Your Verification Report",
);
check(
  "governments.mom: 19 FAQs, opening on COMPASS and closing on empanelment",
  Object.values(EN_GOVERNMENTS.mom.faqs).length === 19 &&
    EN_GOVERNMENTS.mom.faqs.compass.q === "What is COMPASS and how does it affect my EP application?" &&
    EN_GOVERNMENTS.mom.faqs.empanelled.q === "Is HelloVerify an MOM-empaneled vendor?",
  Object.values(EN_GOVERNMENTS.mom.faqs).map((f) => f.q),
);

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
 *  `/products/bgv-enterprise`.
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

/** THE KEY GUARD, broken, on the exact mistake it exists for: a renamed tag
 *  typechecks, renders the same words in the same place, and silently changes a
 *  React key in the flight payload. */
const coverageCards = EN_PLATFORM.coverage.packages.cards;
const renamedTag = {
  ...coverageCards,
  tenant: { ...coverageCards.tenant, tags: ["Criminal Check", "Identity Check", "Credit check"] },
};
check(
  "the key guard WOULD fail on a renamed coverage package tag",
  Object.values(renamedTag).map((x) => x.tags.join("|")).join("/") !== COVERAGE_TAG_KEYS,
  renamedTag.tenant.tags,
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
    EN_PLATFORM.technology.pillars.h,
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
 *      individuals  105 nodes -> 373 leaves
 *      resources     90       ->  98
 *
 *  AND THE SPREAD IS INSIDE `individuals`, not between the two:
 *
 *      individuals/page.tsx       22 nodes ->  52 leaves
 *      individuals/hellov         59       -> 102
 *      individuals/home-family    11       ->  86
 *      individuals/immigration    13       -> 161
 *
 *  HelloV's leaf count moved in the content-restore Part 1 (old CMS
 *  catalogue), immigration's in Part 9 (old CMS visa copy) and again on
 *  6 Oct 2026 (the old applicant tab in its order, with the guide's FAQs, then
 *  the guide's extras in and the CMS city / visa lists - never shown - out). The node counts are still the pre-migration matcher.
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
  /* 102 -> 101 (16 Oct 2026): the Advanced driver card lists Hello Staff's
   * three checks, not four. 101 -> 73 (16 Oct 2026): the Packages tab lost
   * its WhatsApp step pills, QR card and per-package check pills (28); its
   * tiers are `sections.consumer.shop`'s. */
  hellov: [59, 73],
  homeFamily: [11, 86],
  immigration: [13, 161],
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
  "individuals holds 373 leaves for 105 nodes and resources 98 for 90",
  leafPaths(EN_IND).length === 373 &&
    leafPaths(EN_RES).length === 98 &&
    Object.values(IND_FILES).reduce((a, b) => a + b[0], 0) === 105 &&
    Object.values(RES_FILES).reduce((a, b) => a + b[0], 0) === 90,
  { individuals: leafPaths(EN_IND).length, resources: leafPaths(EN_RES).length },
);

/** The non-string leaves, itemised so moving one has to move this line.
 *
 *  `individuals`: 15. Four `<h1>`s and two `closing.heading`s carry an
 *  `<em>`; one `faqHead` is `<>…</>`; eight `.strip3` figures are
 *  `<b>figure</b> tail` or a `<span className="dot" />` plus a phrase, which
 *  is TWO children and therefore one rich-text leaf rather than two string
 *  leaves — splitting them would put two adjacent text children where one
 *  sits today. Immigration's strip, rich FAQ head and `tableNote` function
 *  leaf went with the old CMS copy on 5 Oct 2026, and its closing heading on
 *  6 Oct 2026, when the page took the old applicant tab's order. HelloV's
 *  four strip figures, FAQ head and closing heading went the same day, with
 *  the old `hellov.base.json`.
 *
 *  `resources`: 37. Twelve glossary `d` fragments, six `closing.heading`s,
 *  six `hero.h1`s, eight `.strip3` figures (two of them functions), and five
 *  more functions — `row.min`, `blog.readMins`, `post.meta`, the two
 *  `hub.cards.*.m`, and `countries.officeIn`, which returns a STRING rather
 *  than a node because it replaced a template literal in an attribute-shaped
 *  position. */
check(
  "individuals: 358 string leaves and 15 rich-text or function leaves",
  stringLeaves(EN_IND).length === 358 &&
    leafPaths(EN_IND).length - stringLeaves(EN_IND).length === 15,
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

// Re-keyed on 5 Oct 2026 to the old information guide's destinations.
check(
  "immigration's six lanes head on the old information guide's embassies",
  joinKeys(EN_IND.immigration.guide.destinations, "name") ===
    "Embassy of Latvia|Embassy of Italy|High Commission Of Canada|British High Commission|" +
      "Embassy of Switzerland|Zambia Qualifications Authority",
  joinKeys(EN_IND.immigration.guide.destinations, "name"),
);

check(
  "home-family's eight pills still key on the HelloV check names",
  joinKeys(EN_IND.homeFamily.pills, "n") ===
    "Identity Check|Pan Card Check|Age Verification|Driving License Check|Criminal Record Check|Credit Check|Digital Address Check|Digital Employment Check",
  joinKeys(EN_IND.homeFamily.pills, "n"),
);

/** The old guide only ever showed the CMS embassy names (until the visa back
 *  office answered); its cities and visa types came from the back office, so
 *  the CMS `fromCountries` / `visaTypes` are not carried. What it did carry
 *  from `immigrationApplicantGuideExtras.ts`: the six FAQ categories, the
 *  Italy and Latvia accordions and the two Latvia Premium Service packages. */
check(
  "immigration's guide carries the old extras, and no CMS city or visa lists",
  Object.values(EN_IND.immigration.guide.destinations).every((d) => Object.keys(d).join() === "name") &&
    Object.values(EN_IND.immigration.guide.faqs).map((f) => f.length).join() === "10,5,3,2,4,3" &&
    Object.keys(EN_IND.immigration.guide.accordions.latvia).join() === "who,dependents" &&
    EN_IND.immigration.guide.premium.clearance.features.length === 4 &&
    EN_IND.immigration.guide.premium.premium.features.length === 7,
  Object.values(EN_IND.immigration.guide.faqs).map((f) => f.length),
);

check(
  "home-family's six table rows still key on the HelloV single-check names",
  joinKeys(EN_IND.homeFamily.rows, "nm") ===
    "Age Verification|Pan Card Check|Driving License Check|Criminal Record Check|Digital Address Check|Digital Employment Check",
  joinKeys(EN_IND.homeFamily.rows, "nm"),
);

check(
  "immigration's how-we-make-it-easy cards are the old six, in order",
  joinKeys(EN_IND.immigration.easy.cards, "t") ===
    "Visa Screening You Can Trust|Digital Onboarding|No more waiting in long queues!|Get Smart Reminders|" +
      "Real Time Dashboards|Secure and Compliant",
  joinKeys(EN_IND.immigration.easy.cards, "t"),
);

check(
  "the three Steps decks still key on the step names they keyed on",
  [
    joinKeys(EN_IND.hub.steps, "t"),
    joinKeys(EN_IND.homeFamily.steps, "t"),
    joinKeys(EN_IND.immigration.steps.items, "t"),
  ].join(" / ") ===
    "Send a photo|We check the source|The report / Scan the QR|Select who|They consent / " +
      "Easy upload|Smart Reminders|Real time dashboard",
  [
    joinKeys(EN_IND.hub.steps, "t"),
    joinKeys(EN_IND.homeFamily.steps, "t"),
    joinKeys(EN_IND.immigration.steps.items, "t"),
  ],
);

// HelloV took the old hellov.base.json on 6 Oct 2026: the eight packages,
// the six single checks and the four Advanced cards, in order. Its WhatsApp
// STEP pills went on 16 Oct 2026 with the QR card.
check(
  "HelloV's packages, single checks and Advanced cards are the old ones, in order",
  [
    joinKeys(EN_IND.hellov.packages.items, "t"),
    joinKeys(EN_IND.hellov.singles.cards, "t"),
    joinKeys(EN_IND.hellov.advanced.cards, "t"),
  ].join(" / ") ===
    "Driver Verification|Home Staff|Tenant Verification|Nanny Verification|Verify Anyone|" +
      "Cyber Identity Verification|Know The Identity|Know Your Contact / " +
      "Age Verification|Digital Employment Check|Driving License Check|Pan Card Check|" +
      "Criminal Record Check|Digital Address Check / " +
      "Home Staff Verification|Nanny Verification|Driver Verification|Tenant Verification",
  [
    joinKeys(EN_IND.hellov.packages.items, "t"),
    joinKeys(EN_IND.hellov.singles.cards, "t"),
    joinKeys(EN_IND.hellov.advanced.cards, "t"),
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
  "home-family's stepsHead is a plain string, so its HowTo node still emits",
  typeof EN_IND.homeFamily.stepsHead === "string",
  typeof EN_IND.homeFamily.stepsHead,
);

check(
  "…and so is the heading the hub's `Steps name=` reads",
  typeof EN_IND.hub.howItWorks.h === "string",
  EN_IND.hub.howItWorks.h,
);

console.log("15c. the function leaves, against the children they have to reproduce");

/** THE BYTE-IDENTITY RULE AS AN ASSERTION, and the first time this file has
 *  one. `lib/copy/index.ts`: never merge two children into one, never split
 *  one into two — React's SSR writes `<!-- -->` between adjacent text
 *  children, and the built page shows them
 *  (`.next/server/app/en/resources.html` reads `12<!-- --> checks documented
 *  →`). Nine leaves in `resources` stand in for a
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
  shape(reordered) ===
    shape({
      primarySource: EN_RES.glossary.terms.primarySource,
      databaseScreening: EN_RES.glossary.terms.databaseScreening,
    }),
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

const driftedArrow = {
  ...aboutAr,
  hero: { ...aboutAr.hero, k: `${aboutAr.hero.k} →` },
};
check(
  "the Arabic go-cue guard WOULD fail on a leftover →",
  arrowLeaves(driftedArrow, "about").filter((p) => !allowedArArrow(p)).length === 1,
  arrowLeaves(driftedArrow, "about"),
);

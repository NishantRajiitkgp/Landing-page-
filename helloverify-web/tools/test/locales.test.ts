/** Adding a locale must be ONE safe edit, and this file is the proof.
 *
 *  WHY THIS FILE EXISTS. Three lists describe the same fact in two modules:
 *  `routing.locales` (`lib/i18n/routing.ts`), and `SERVED_LOCALES` +
 *  `DEFAULT_LOCALE` (`lib/seo/legacy-urls.ts`), which are deliberate copies
 *  because that module has to stay loadable from `next.config.ts`. A fourth,
 *  `LEGACY_LOCALES`, is the set Google has indexed.
 *
 *  Declare `hi` in `routing.locales` alone and the build looks perfect: 168
 *  pages prerender, every canonical is self-referencing, the sitemap grows,
 *  `check:sitemap`, `check:schema` and `check:llms` all pass. And every Hindi
 *  page 308s to its English equivalent, because `legacyRedirects()` still
 *  emits `/hi/:path*` -> `/en/:path*` for a locale it does not think is
 *  served. A 308 is cached by the browser forever, so the 56 new pages would
 *  redirect away from themselves permanently. No build-output gate can see
 *  it — `probe:redirects` can, and it needs a running server and a deploy.
 *
 *  So the invariant is enforced at module load (`lib/seo/canonical.ts` throws,
 *  which fails `next build`) and exercised here (which fails `npm test`).
 *  This file is the half that can prove the guard is capable of failing:
 *  `localeContractDrift` takes both sides as parameters, so a drifted state
 *  can be constructed without editing a source file.
 *
 *  AND IT DOES NOT STOP AT THE LISTS. Sections 3 and 4 run the REAL redirect
 *  emitter — `lib/seo/redirects.ts`, unmodified, with `SERVED_LOCALES` swapped
 *  by `vi.doMock` — over a shipped `["en","hi","ar"]` world, and assert that
 *  no emitted rule captures a page that world serves. That is the property
 *  the comments have been asserting in prose since item 3.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { vi } from "vitest";

import { openGraphLocales, routing, scriptStackOf } from "../../src/lib/i18n/routing.ts";
import {
  DEFAULT_LOCALE,
  LEGACY_LOCALES,
  LEGACY_ROUTES,
  PENDING_DECISIONS,
  SERVED_LOCALES,
  localeContractDrift,
} from "../../src/lib/seo/legacy-urls.ts";
import { copyFor } from "../../src/lib/seo/copy.ts";
import { allRoutes, localePath } from "../../src/lib/seo/routes.ts";

import { check } from "./harness.ts";

const LEGACY_URLS_MODULE = "../../src/lib/seo/legacy-urls.ts";

type Rule = { source: string; destination: string; permanent: boolean };

/** The real `legacyRedirects()`, run against a hypothetical served set.
 *
 *  `vi.doMock` + `vi.resetModules()` rather than a test-only parameter on
 *  `legacyRedirects()`: the point of the exercise is that the emitter SHIPPING
 *  TODAY produces safe rules once the locale lists move, so adding a parameter
 *  for the test to drive would be testing a different function from the one
 *  `next.config.ts` calls. `redirects.ts` imports `./legacy-urls`, which
 *  resolves to the same file this mocks.
 */
async function emitWithServed(served: readonly string[]): Promise<Rule[]> {
  vi.resetModules();
  vi.doMock(LEGACY_URLS_MODULE, async () => {
    const actual = await vi.importActual<Record<string, unknown>>(LEGACY_URLS_MODULE);
    return { ...actual, SERVED_LOCALES: served };
  });
  const { legacyRedirects } = await import("../../src/lib/seo/redirects.ts");
  const rules = legacyRedirects() as Rule[];
  vi.doUnmock(LEGACY_URLS_MODULE);
  vi.resetModules();
  return rules;
}

/** Does a Next redirect `source` capture this URL? Only the two shapes this
 *  table emits are handled: an exact path, and a `/:path*` suffix. */
function captures(source: string, url: string): boolean {
  if (source.endsWith("/:path*")) {
    const prefix = source.slice(0, -"/:path*".length);
    return url === prefix || url.startsWith(prefix + "/");
  }
  return source === url;
}

/** Every URL the site serves in `locale`, in the form a redirect source is
 *  written in. */
function livePages(locale: string): string[] {
  return allRoutes().map((r) => localePath(r.path, locale));
}

const SHIP = ["en", "hi", "ar"] as const;
/** The world before Part 9b.7 — only English served. Kept so section 3 can
 *  still measure the catch-all hazard after the ship. */
const before = await emitWithServed(["en"]);
const today = await emitWithServed(SERVED_LOCALES);
const shipped = await emitWithServed(SHIP);

console.log("1. the mirror, as it stands");

check(
  "SERVED_LOCALES is the same sequence as routing.locales",
  SERVED_LOCALES.length === routing.locales.length &&
    SERVED_LOCALES.every((l, i) => l === routing.locales[i]),
  { SERVED_LOCALES, routing: routing.locales },
);
check(
  "DEFAULT_LOCALE mirrors routing.defaultLocale",
  DEFAULT_LOCALE === routing.defaultLocale,
  { DEFAULT_LOCALE, routing: routing.defaultLocale },
);
check(
  "localeContractDrift reports nothing on the live pair",
  localeContractDrift(routing.locales, routing.defaultLocale).length === 0,
  localeContractDrift(routing.locales, routing.defaultLocale),
);
// LEGACY_LOCALES is append-only history, not a mirror. The one thing it must
// contain is the locale everything consolidates onto.
check(
  "LEGACY_LOCALES contains the default locale",
  LEGACY_LOCALES.includes(DEFAULT_LOCALE),
  LEGACY_LOCALES,
);

console.log("2. the detector fires — one drifted state per assertion");

// routing.ts edited, legacy-urls.ts forgotten. THE failure this whole file is
// about: /hi is served and the catch-all still 308s it onto /en.
check(
  "locale served but not mirrored -> reported",
  localeContractDrift(["en", "hi"], "en", ["en"]).length === 1,
  localeContractDrift(["en", "hi"], "en", ["en"]),
);
// The inverse. Harmless-looking and worse: legacy 308s would point /hi/... at
// pages that do not exist.
check(
  "locale mirrored but not served -> reported",
  localeContractDrift(["en"], "en", ["en", "hi"]).length === 1,
  localeContractDrift(["en"], "en", ["en", "hi"]),
);
// Same set, different order. Deliberately a failure: the mirror is a copy and
// a reviewer should be able to diff it in one line.
check(
  "same set, different order -> reported",
  localeContractDrift(["en", "hi"], "en", ["hi", "en"]).length === 1,
  localeContractDrift(["en", "hi"], "en", ["hi", "en"]),
);
check(
  "the message names SERVED_LOCALES and both lists",
  localeContractDrift(["en", "hi"], "en", ["en"])[0].includes("SERVED_LOCALES") &&
    localeContractDrift(["en", "hi"], "en", ["en"])[0].includes('"hi"'),
  localeContractDrift(["en", "hi"], "en", ["en"]),
);
check(
  "default locale drifted -> reported",
  localeContractDrift(["en"], "en", ["en"], "hi").length === 1,
  localeContractDrift(["en"], "en", ["en"], "hi"),
);
check(
  "default locale not in the locale list -> reported",
  localeContractDrift(["hi"], "en", ["hi"], "en").length === 1,
  localeContractDrift(["hi"], "en", ["hi"], "en"),
);
// And the shape of the edit that ships a locale: both files moved together.
check(
  "the three-locale ship is clean once both files move",
  localeContractDrift(SHIP, "en", SHIP, "en").length === 0,
  localeContractDrift(SHIP, "en", SHIP, "en"),
);

console.log("3. the hazard when only en is served — measured, not argued");

const catchAll = (rules: Rule[], locale: string) =>
  rules.find((r) => r.source === `/${locale}/:path*`);

check(
  "en-only /hi/:path* -> /en/:path* is emitted",
  catchAll(before, "hi")?.destination === "/en/:path*",
  catchAll(before, "hi"),
);
check(
  "en-only /ar/:path* -> /en/:path* is emitted",
  catchAll(before, "ar")?.destination === "/en/:path*",
  catchAll(before, "ar"),
);
// If `hi` were declared in routing.ts alone, THESE pages would be the ones
// redirecting away from themselves. Counted rather than described.
{
  const wouldBeCaptured = livePages("hi").filter((url) =>
    before.some((r) => captures(r.source, url)),
  );
  check(
    `all ${livePages("hi").length} /hi pages are captured by en-only rules`,
    wouldBeCaptured.length === livePages("hi").length,
    { captured: wouldBeCaptured.length, routes: livePages("hi").length },
  );
  check(
    "every one of them is captured by a rule whose destination is /en",
    livePages("hi").every((url) => {
      const rule = before.find((r) => captures(r.source, url));
      return rule !== undefined && rule.destination.startsWith("/en");
    }),
    "a served /hi page would 308 to English",
  );
}

console.log("4. the ship — the real emitter over a served en/hi/ar");

for (const locale of SHIP) {
  check(
    `shipped: no /${locale}/:path* catch-all remains`,
    catchAll(shipped, locale) === undefined,
    catchAll(shipped, locale),
  );
  check(
    `shipped: no rule captures a live /${locale} page`,
    livePages(locale).every((url) => !shipped.some((r) => captures(r.source, url))),
    livePages(locale).filter((url) => shipped.some((r) => captures(r.source, url))).slice(0, 5),
  );
}
check(
  "shipped: no rule redirects to itself",
  shipped.every((r) => r.source !== r.destination),
  shipped.filter((r) => r.source === r.destination).slice(0, 5),
);
check(
  "shipped: every relative destination is in a served locale",
  shipped
    .filter((r) => r.destination.startsWith("/") && r.destination !== "/" && !r.destination.startsWith("/:"))
    .every((r) => SHIP.some((l) => r.destination === `/${l}` || r.destination.startsWith(`/${l}/`))),
  shipped
    .filter(
      (r) =>
        r.destination.startsWith("/") &&
        r.destination !== "/" &&
        !r.destination.startsWith("/:") &&
        !SHIP.some((l) => r.destination === `/${l}` || r.destination.startsWith(`/${l}/`)),
    )
    .slice(0, 5),
);
// The reason LEGACY_LOCALES does NOT have to shrink when a locale ships: a
// legacy path in a NOW-SERVED locale keeps its own prefix instead of being
// consolidated onto English.
check(
  "shipped: /hi/platform/technology keeps its prefix -> /hi/technology",
  shipped.find((r) => r.source === "/hi/platform/technology")?.destination === "/hi/technology",
  shipped.find((r) => r.source === "/hi/platform/technology"),
);
check(
  "shipped: /ar/platform/technology keeps its prefix -> /ar/technology",
  shipped.find((r) => r.source === "/ar/platform/technology")?.destination === "/ar/technology",
  shipped.find((r) => r.source === "/ar/platform/technology"),
);
// Shipping does not abandon a single indexed URL: the only sources that
// disappear are the four catch-alls per newly served locale.
{
  const beforeSources = new Set(before.map((r) => r.source));
  const after = new Set(shipped.map((r) => r.source));
  const dropped = [...beforeSources].filter((s) => !after.has(s)).sort();
  const gained = [...after].filter((s) => !beforeSources.has(s)).sort();
  check(
    "shipped: the only sources dropped are the 8 unserved-locale catch-alls",
    dropped.join("|") ===
      ["/ar", "/ar/:path*", "/ar/:path*/index.html", "/ar/index.html", "/hi", "/hi/:path*", "/hi/:path*/index.html", "/hi/index.html"].join("|"),
    dropped,
  );
  check("shipped: no source is gained", gained.length === 0, gained);
}

console.log("5. /support/track — closed, with the old repo as the evidence");

const track = LEGACY_ROUTES.find((r) => r.from === "/support/track");
check("/support/track has a row", track !== undefined);
check("/support/track -> /contact", track?.to === "/contact", track);
// web.config's "Redirect Obsolete Contact Paths" matched all four in one rule
// and sent every one of them to /contact?tab=enquiry. They must not disagree.
check(
  "its three web.config siblings share the destination",
  ["/support", "/support/enquiry", "/premium"].every(
    (from) => LEGACY_ROUTES.find((r) => r.from === from)?.to === "/contact",
  ),
  ["/support", "/support/enquiry", "/premium"].map((from) => LEGACY_ROUTES.find((r) => r.from === from)),
);
check("PENDING_DECISIONS is empty", PENDING_DECISIONS.length === 0, PENDING_DECISIONS);
// A legacy source that is also a live route is a self-redirect; a legacy
// target that is not a live route is a 308 into a 404.
check(
  "/support/track is not itself a route",
  !allRoutes().some((r) => r.path === "/support/track"),
);
check(
  "/contact is a route, so this is not a 308 into a 404",
  allRoutes().some((r) => r.path === "/contact"),
);

console.log("6. og:locale is derived, not written down");

check(
  "openGraphLocales('en') today -> locale en, alternates hi and ar",
  openGraphLocales("en").locale === "en" &&
    openGraphLocales("en").alternateLocale.join(",") === "hi,ar",
  openGraphLocales("en"),
);
check(
  "live SERVED_LOCALES emits the same rules as the three-locale ship",
  today.length === shipped.length &&
    today.every((r, i) => r.source === shipped[i]?.source && r.destination === shipped[i]?.destination),
  { today: today.length, shipped: shipped.length },
);
check(
  "the default argument is routing.locales",
  routing.locales.every(
    (l) =>
      openGraphLocales(l).alternateLocale.join(",") ===
      routing.locales.filter((o) => o !== l).join(","),
  ),
  routing.locales.map((l) => openGraphLocales(l)),
);
check(
  "shipped: hi -> og:locale hi, alternates en and ar",
  openGraphLocales("hi", SHIP).locale === "hi" &&
    openGraphLocales("hi", SHIP).alternateLocale.join(",") === "en,ar",
  openGraphLocales("hi", SHIP),
);
check(
  "shipped: ar -> og:locale ar, alternates en and hi",
  openGraphLocales("ar", SHIP).locale === "ar" &&
    openGraphLocales("ar", SHIP).alternateLocale.join(",") === "en,hi",
  openGraphLocales("ar", SHIP),
);
check(
  "self is never listed as its own alternate",
  SHIP.every((l) => !openGraphLocales(l, SHIP).alternateLocale.includes(l)),
  SHIP.map((l) => openGraphLocales(l, SHIP)),
);

console.log("7. the layout actually calls it — a source assertion, and why");

/** READING THE FILE AS TEXT, which needs justifying because it is the crudest
 *  gate in this repo.
 *
 *  The honest test is to import `app/[locale]/layout.tsx` and call its
 *  `generateMetadata({ params })` with `hi`. That is not possible here, and
 *  the reason is measured rather than assumed: the layout imports
 *  `next-intl/server`, whose `RequestLocale.js` imports `next/headers`, which
 *  does not resolve outside a Next runtime — `ERR_MODULE_NOT_FOUND ... Did you
 *  mean to import "next/headers.js"?`. Aliasing it in `vitest.config.ts` would
 *  change resolution for all six suites to gate one line.
 *
 *  And the line needs a gate, because reverting it is INVISIBLE today.
 *  `tools/seo/check-sitemap.mjs` now asserts each page's `og:locale` equals
 *  its path locale, which is the real guard — but with `routing.locales` at
 *  `["en"]` a hardcoded `"en"` and the derived value are the same string, so
 *  that assertion cannot fail until a second locale ships. Between now and
 *  then this is the only thing standing between the fix and a silent revert.
 *  It goes away the day the layout becomes importable, or the day `hi` ships.
 */
const layoutSource = readFileSync(
  new URL("../../src/app/[locale]/layout.tsx", import.meta.url),
  "utf8",
);

check(
  "the layout exports generateMetadata, not a static metadata object",
  layoutSource.includes("export async function generateMetadata(") &&
    !layoutSource.includes("export const metadata"),
);
check(
  "its openGraph block spreads openGraphLocales(locale)",
  layoutSource.includes("...openGraphLocales(locale),"),
);
/** Comments stripped first, and that is not tidying: the header above the
 *  function quotes `{ locale: "en", alternateLocale: [] }` as the value
 *  `openGraphLocales("en")` returns, so a naive scan matches the prose that
 *  documents the fix and reports it as the defect. Caught on the first run of
 *  this assertion. */
const layoutCode = layoutSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

check(
  "no hardcoded og:locale is left in the code",
  !/\blocale:\s*"[a-z]{2}"/.test(layoutCode),
  layoutCode.match(/\blocale:\s*"[a-z]{2}"/g),
);

console.log("8. script faces — English does not pay, hi/ar can render");

check("en loads no script stack", scriptStackOf("en") === null);
check("hi loads the Devanagari stack", scriptStackOf("hi") === "deva");
check("ar loads the Arabic stack", scriptStackOf("ar") === "arab");
check("fa/ur share the Arabic stack (same script, later locales)", scriptStackOf("fa") === "arab" && scriptStackOf("ur") === "arab");
check("he is RTL but not Arabic-script — no Noto Arabic", scriptStackOf("he") === null);

check(
  "the layout asks scriptStackOf(locale) rather than inlining the map",
  layoutCode.includes("scriptStackOf(locale)"),
);
check(
  "every Noto localFont call disables preload — /en must not fetch them",
  (layoutCode.match(/preload:\s*false/g) || []).length >= 4,
  layoutCode.match(/preload:\s*false/g),
);
check(
  "the four Noto files are the ones under src/fonts/",
  ["/noto-sans-devanagari.woff2", "/noto-serif-devanagari.woff2", "/noto-sans-arabic.woff2", "/noto-naskh-arabic.woff2"].every(
    (f) => layoutSource.includes(f),
  ),
);

const subsetSource = readFileSync(new URL("../perf/subset-fonts.mjs", import.meta.url), "utf8");
/** Comments name the rejected `.next/static/media` path on purpose — same
 *  trap as the og:locale assertion above. Strip them before judging. */
const subsetCode = subsetSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
check(
  "every FACES src lives under design-src/fonts/",
  (subsetCode.match(/src:\s*"design-src\/fonts\//g) || []).length >= 8,
  subsetCode.match(/src:\s*"[^"]+"/g),
);
check(
  "no FACES src points at the build output",
  !/src:\s*"[^"]*\.next\//.test(subsetCode),
);
check(
  "a path under .next is a hard fail, not a fallback",
  subsetCode.includes('face.src.includes(".next/")'),
);

const FONT_ROOT = new URL("../../src/fonts/", import.meta.url);
const SOURCE_ROOT = new URL("../../design-src/fonts/", import.meta.url);
for (const name of [
  "noto-sans-devanagari.woff2",
  "noto-serif-devanagari.woff2",
  "noto-sans-arabic.woff2",
  "noto-naskh-arabic.woff2",
]) {
  check(`source ${name} is vendored`, existsSync(new URL(name, SOURCE_ROOT)));
  check(`shipped ${name} is in src/fonts`, existsSync(new URL(name, FONT_ROOT)));
}

console.log("9. isolated → glyphs sit in a box --flip mirrors (After 9b)");

/** Isolated U+2192 in markup. Unicode does not mirror the glyph, so the
 *  box is flipped with the same `--flip` the SVG arrow uses. Copy-embedded
 *  go-cues are the other half — `copy.test.ts` §6g, `←` in `ar`. Ranges
 *  (`64 → 84`, the How-we-know clock) stay. */
const glyphCss = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);
check(
  "isolated → boxes use scaleX(var(--flip))",
  /\.idx3 \.xa,\s*\.nv-ml \.k,\s*\.fwd\s*\{\s*transform:\s*scaleX\(var\(--flip\)\)/.test(glyphCss),
);

const ALLOWED_MARKUP_ARROW = [
  /className="xa">→<\/span>/g,
  /className="k">→<\/span>/g,
  /className="fwd">→<\/span>/g,
  /<\/b> → <b>/g,
];

function leftoverMarkupArrows(src: string): boolean {
  let rest = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  for (const re of ALLOWED_MARKUP_ARROW) rest = rest.replace(re, "");
  return rest.includes("→");
}

function walkTsx(dir: URL, acc: string[] = []): string[] {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.name === "snapshot" || name.name === "copy") continue;
    const next = new URL(name.name + (name.isDirectory() ? "/" : ""), dir);
    if (name.isDirectory()) walkTsx(next, acc);
    else if (name.name.endsWith(".tsx")) acc.push(fileURLToPath(next));
  }
  return acc;
}

const strayMarkup = walkTsx(new URL("../../src/", import.meta.url)).filter((file) => {
  const src = readFileSync(file, "utf8");
  return src.includes("→") && leftoverMarkupArrows(src);
});
check("every painted → in markup sits in a flipped box or a range", strayMarkup.length === 0, strayMarkup);

check(
  "the isolated-arrow scan WOULD fail on a bare → in JSX",
  leftoverMarkupArrows("<span>next →</span>"),
);
check(
  "…and does not fire on the three isolated boxes or a clock range",
  !leftoverMarkupArrows('<span className="xa">→</span><span className="k">→</span></b> → <b>'),
);

console.log("10. SEO copy is keyed by locale (After 9b)");

check("English about title is unchanged", copyFor("/about").title === "About HelloVerify");
check(
  "Hindi about title is Hindi, not a paste of English",
  /[\u0900-\u097F]/.test(copyFor("/about", "hi").title) &&
    copyFor("/about", "hi").title !== copyFor("/about").title,
  copyFor("/about", "hi").title,
);
check(
  "Arabic about title is Arabic, not a paste of English",
  /[\u0600-\u06FF]/.test(copyFor("/about", "ar").title) &&
    copyFor("/about", "ar").title !== copyFor("/about").title,
  copyFor("/about", "ar").title,
);
check(
  "llms stays on the English table — copyFor(path) ignores the request locale",
  copyFor("/contact").title === "Lets Build the Business Together — HelloVerify",
);

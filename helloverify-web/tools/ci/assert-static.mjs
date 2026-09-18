/** "`next build` emits zero dynamic routes" (BUILD-SPEC §17, §14.2, §5).
 *
 *  §5 makes every page statically prerendered. That is not a performance
 *  preference — it is the precondition for every other gate in this repo:
 *  `check-sitemap`, `check-schema`, `check-llms` and `check-budgets` all read
 *  the emitted HTML, and a route that turns dynamic emits none. The failure mode
 *  is silent: the page still works, the checkers just stop seeing it.
 *
 *  The usual way a route goes dynamic here is a component reaching for request
 *  state — `headers()`, `cookies()`, `searchParams`, or a `next-intl` call in a
 *  subtree where `setRequestLocale` was not called (§5, and the note in every
 *  page file about why that call is there).
 *
 *  Run after `next build`:
 *      node tools/ci/assert-static.mjs
 */
import { readFile } from "node:fs/promises";

import { routing } from "../../src/lib/i18n/routing.ts";
import { allRoutes, localePath } from "../../src/lib/seo/routes.ts";

const root = new URL("../../", import.meta.url);

const manifest = JSON.parse(
  await readFile(new URL(".next/prerender-manifest.json", root), "utf8").catch(() => "null"),
);
if (!manifest) {
  console.log("FAIL - no prerender-manifest.json. Run `npm run build` first.");
  process.exit(1);
}

const prerendered = Object.keys(manifest.routes ?? {});
/** `dynamicRoutes` here means route PATTERNS with a fallback — `/checks/[check]`
 *  is listed even though all 12 of its pages prerendered, so the count alone
 *  proves nothing. What matters is the fallback: `false` means "these are the
 *  only pages and anything else 404s", which is what `dynamicParams = false`
 *  gives us. Anything else means Next will render a page on demand. */

/** Metadata file conventions are assets of a page, not pages. Next lists
 *  `/[locale]/opengraph-image` with `fallback: null`, which reads like an
 *  on-demand route and is not one here: measured against a running server,
 *  `/xx/opengraph-image` answers **307**, not a render — `src/proxy.ts` rewrites
 *  an unrecognised first segment before the route is ever reached, and the
 *  result 404s. (That 307-instead-of-404 is the pre-existing §6.1 deviation the
 *  redirect probe already reports for `/xx/about`; it is not this gate's to
 *  re-report.) Excluding them keeps this check on the thing it can actually
 *  prove: that every PAGE is prerendered with no fallback. */
const NOT_PAGES = /\/(opengraph-image|icon|apple-icon|twitter-image|sitemap\.xml|robots\.txt|llms\.txt|manifest\.webmanifest)$/;

const onDemand = Object.entries(manifest.dynamicRoutes ?? {}).filter(
  ([pattern, cfg]) => cfg.fallback !== false && !NOT_PAGES.test(pattern),
);

console.log(`prerendered pages:      ${prerendered.length}`);
console.log(`routes expected:        ${allRoutes().length * routing.locales.length}`);
console.log(`route patterns:         ${Object.keys(manifest.dynamicRoutes ?? {}).length}`);
console.log(`with on-demand fallback: ${onDemand.length}`);

const problems = [];

/** EXACT, against the route manifest — not a floor.
 *
 *  This started as `prerendered.length < 50`, and a mutation walked straight
 *  through it: adding `await headers()` to `/about` took the count from 64 to
 *  63 and the gate still passed. One page going dynamic is precisely the case
 *  worth catching, because that page silently drops out of every build-output
 *  checker while the site still appears to work.
 *
 *  So it compares against the same `allRoutes()` manifest the sitemap, the
 *  canonicals, the JSON-LD and llms.txt are all built from — the fifth consumer
 *  of that one list. */
const expected = allRoutes().flatMap((r) =>
  routing.locales.map((l) => localePath(r.path, l)),
);
const missing = expected.filter((path) => !new Set(prerendered).has(path));
if (missing.length) {
  problems.push(
    `${missing.length} route(s) in the manifest did not prerender: ${missing.join(", ")}. ` +
      `Something made them dynamic — usually headers(), cookies(), searchParams, ` +
      `or a next-intl call in a subtree without setRequestLocale (\u00a75).`,
  );
}

for (const [pattern, cfg] of onDemand) {
  problems.push(
    `${pattern} has fallback ${JSON.stringify(cfg.fallback)} — it renders on demand. ` +
      `§5 and \`dynamicParams = false\` require the full set at build time.`,
  );
}

if (problems.length) {
  console.log("");
  for (const p of problems) console.log(`  x ${p}`);
  console.log(`\nFAIL - ${problems.length} problem(s)`);
  process.exit(1);
}

console.log("\nPASS - every route prerendered, none render on demand");
process.exit(0);

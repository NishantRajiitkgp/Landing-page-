/** The CSP `script-src` origin list is written twice. This is the drift check.
 *
 *  `next.config.ts` builds the response HEADER; `tools/ci/inject-csp.mjs`
 *  builds the per-page `<meta http-equiv>`. A document's effective policy is
 *  the INTERSECTION of the two — which is the whole basis of Part 7's argument
 *  that §17 condition 11 is met in enforcement while the header still carries
 *  `'unsafe-inline'`. An origin granted by one and not the other is therefore
 *  not granted at all.
 *
 *  THAT IS NOT HYPOTHETICAL. Measured 23 Sep by building with
 *  `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TESTONLY123` and reading the emitted
 *  `/en.html`: the header gained `https://www.googletagmanager.com`
 *  (`next.config.ts`'s `const ga = …`) and the meta did not, so GA4's remote
 *  tag was refused on all 62 pages while the header said it was allowed.
 *  §17 condition 19 had a blocker nobody had found, because nothing compared
 *  these two files.
 *
 *  WHY DUPLICATED RATHER THAN IMPORTED. `next.config.ts` is TypeScript
 *  compiled by Next; `inject-csp.mjs` is plain `.mjs` run by node after the
 *  build. Sharing a constant means either a TS import inside a node script or
 *  an `.mjs` import inside the build config, and the config is the one file
 *  whose failure mode is "nothing builds at all".
 *  `src/lib/seo/legacy-urls.ts` already took this trade for the same reason —
 *  `SERVED_LOCALES` is a hand-kept mirror of `routing.locales`, "duplicated
 *  rather than imported so this module stays loadable from next.config.ts" —
 *  and the answer there was a drift check, not an import. This is that.
 *
 *  READ AS TEXT, not by importing either module. Importing `next.config.ts`
 *  evaluates `legacyRedirects()` and the whole next-intl plugin; importing the
 *  injector runs it over `.next`. Both files are the artefact under test, so
 *  reading their source is the honest instrument — and it is the only one that
 *  works when the two disagree about a literal.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { check } from "./harness";

const root = fileURLToPath(new URL("../../", import.meta.url));
const config = readFileSync(`${root}next.config.ts`, "utf8");
const injector = readFileSync(`${root}tools/ci/inject-csp.mjs`, "utf8");

/** Comments are stripped first. Both files explain the GA origin at length in
 *  prose, and the first version of this check matched those sentences — the
 *  same trap `check-logical-css.mjs` records, and the one that made an earlier
 *  guard in `tools/test/locales.test.ts` fail on correct code. */
const strip = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const configCode = strip(config);
const injectorCode = strip(injector);

/** Every `https://` origin either file names in code, deduplicated. */
function origins(code: string): string[] {
  return [...new Set(code.match(/https:\/\/[A-Za-z0-9.*-]+/g) ?? [])].sort();
}

const GA_SCRIPT_ORIGIN = "https://www.googletagmanager.com";

check(
  "next.config.ts grants GA4's script origin when the measurement id is set",
  configCode.includes(GA_SCRIPT_ORIGIN),
  origins(configCode),
);

check(
  "inject-csp.mjs grants the same origin to the per-page meta",
  injectorCode.includes(GA_SCRIPT_ORIGIN),
  origins(injectorCode),
);

/** The two must agree about WHEN, not only about WHAT. A meta that granted the
 *  origin unconditionally would widen every page's policy for a tag that is
 *  not there — which is the reason `next.config.ts` gates its own copy, and
 *  §9.4 measures zero third-party origins today. */
const GATE = "NEXT_PUBLIC_GA_MEASUREMENT_ID";

check(
  "next.config.ts gates that origin on the measurement id",
  configCode.includes(GATE),
  GATE,
);

check(
  "inject-csp.mjs gates it on the same variable, so neither grants it alone",
  injectorCode.includes(GATE) &&
    injectorCode.indexOf(GATE) < injectorCode.indexOf(GA_SCRIPT_ORIGIN),
  { hasGate: injectorCode.includes(GATE) },
);

/** The injector must grant NOTHING beyond `'self'`, the page's own hashes and
 *  the gated GA origin. Every other directive belongs to the single header
 *  §13 asks for; a second origin appearing here is a policy written in two
 *  places, which is how they come to disagree. */
check(
  "inject-csp.mjs names no origin other than GA4's",
  origins(injectorCode).every((o) => o === GA_SCRIPT_ORIGIN),
  origins(injectorCode),
);

/** WHAT THIS DOES NOT COVER, stated rather than implied by a green run.
 *
 *  Two richer checks were written and both were wrong, so neither is here:
 *
 *  1. "the header has exactly three non-script origins" — trivia, not an
 *     invariant, and it failed on correct code because `gaConnect`
 *     interpolates `googletagmanager` a second time and the set deduplicates.
 *  2. "the header's `script-src` line and the meta grant the same origins" —
 *     impossible to read this way. The header's origin is not a literal on
 *     that line; it arrives as `${ga}`, interpolated from the `const` above.
 *     Comparing the rendered directive means evaluating `next.config.ts`,
 *     which runs `legacyRedirects()` and the next-intl plugin.
 *
 *  So the guarantee here is narrow and worth naming: **the GA4 script origin
 *  is present in both files and gated on the same variable in both.** That is
 *  the exact drift that shipped — the header granted it, the meta did not, and
 *  the intersection refused GA4 on all 62 pages. A NEW origin added to the
 *  header's `script-src` and not to the meta would still slip past, and the
 *  check that would catch it is a build with the id set plus a browser, which
 *  is `tools/e2e/csp.spec.ts`'s territory, not a unit test's. */

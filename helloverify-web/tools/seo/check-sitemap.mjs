/** The §8.3 invariant, enforced rather than asserted in prose.
 *
 *      "A page cannot exist without being in the sitemap, and a sitemap entry
 *       cannot exist without a page."
 *
 *  This is the check that makes AUDIT A2 unrepeatable. The old site kept its
 *  route list in `seo-routes.json` and its routes in `App.tsx`, nothing
 *  compared them, and the two drifted until all 84 sitemap URLs pointed at
 *  redirects. Here the sitemap is diffed against what Next actually
 *  prerendered, so drift is a failed build rather than a slow ranking decline.
 *
 *  It also asserts the two lists that must stay DISJOINT: nothing in
 *  `lib/seo/legacy-urls.ts` (URLs that must 308) may appear in the sitemap
 *  (URLs that must 200). Advertising a redirect for crawling is precisely what
 *  the audit found.
 *
 *  And it asserts §6.1's byte-identity rule across all three places a URL is
 *  written: the `<link rel="canonical">` in the page, the `<link
 *  rel="alternate" hreflang>` set in the page, and the `<loc>` plus
 *  `<xhtml:link>` set in the sitemap. `lib/seo/metadata.ts` cannot check the
 *  one that matters most — that a page's canonical names ITS OWN url — because
 *  `generateMetadata` is handed no pathname, so a page naming another page's
 *  route is caught here, in the build output, or not at all.
 *
 *  Reads the build output, so run it after `next build`:
 *      node tools/seo/check-sitemap.mjs
 */
import { readFile } from "node:fs/promises";

import { LEGACY_ROUTES, LEGACY_LOCALES } from "../../src/lib/seo/legacy-urls.ts";
import { htmlPages } from "./build-output.mjs";

const root = new URL("../../", import.meta.url);

/** Routes Next prerendered but that are not pages a person can visit. */
const NOT_PAGES = new Set(["/_global-error", "/_not-found", "/favicon.ico"]);
const NOT_PAGE_SUFFIXES = [
  "/opengraph-image", // an asset of a page, not a page
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  /** Generated navigation for AI crawlers (§11a.4), not a page. It is
   *  verified by `check-llms.mjs`, which asserts the stronger property:
   *  that its URL list equals the sitemap's, both ways. */
  "/llms.txt",
];

const failures = [];
const note = [];

function fail(msg, detail) {
  failures.push(`${msg}\n      ${detail}`);
}

// ---------------------------------------------------------------- the inputs
const prerender = JSON.parse(await readFile(new URL(".next/prerender-manifest.json", root), "utf8"));
const built = new Set(
  Object.keys(prerender.routes ?? {}).filter(
    (p) => !NOT_PAGES.has(p) && !NOT_PAGE_SUFFIXES.some((s) => p.endsWith(s)),
  ),
);

// The sitemap Next actually emitted, not the one the source intends.
const xml = await readFile(new URL(".next/server/app/sitemap.xml.body", root), "utf8").catch(
  () => null,
);
if (xml === null) {
  console.log("FAIL - no sitemap in the build output. Run `npm run build` first.");
  process.exit(1);
}

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(locs.map((u) => new URL(u).pathname));

console.log(`prerendered pages: ${built.size}`);
console.log(`sitemap entries:   ${sitemapPaths.size}`);

// --------------------------------------------------- the invariant, both ways
const missingFromSitemap = [...built].filter((p) => !sitemapPaths.has(p)).sort();
const missingFromBuild = [...sitemapPaths].filter((p) => !built.has(p)).sort();

if (missingFromSitemap.length) {
  fail(
    `${missingFromSitemap.length} page(s) exist but are NOT in the sitemap`,
    missingFromSitemap.join("\n      "),
  );
}
if (missingFromBuild.length) {
  fail(
    `${missingFromBuild.length} sitemap entr(ies) have NO page`,
    `these would return 404 or a redirect to a crawler:\n      ${missingFromBuild.join("\n      ")}`,
  );
}

// ------------------------------------------------ sitemap vs redirect map
// A URL cannot be both "must 200" and "must 308".
const legacyPaths = new Set();
for (const locale of LEGACY_LOCALES) {
  for (const { from } of LEGACY_ROUTES) {
    legacyPaths.add(from === "/" ? `/${locale}` : `/${locale}${from}`);
  }
}
const overlap = [...sitemapPaths].filter((p) => legacyPaths.has(p)).sort();
if (overlap.length) {
  fail(
    `${overlap.length} sitemap URL(s) are also in the redirect map`,
    `the sitemap advertises these for crawling while next.config 308s them away:\n      ${overlap.join("\n      ")}`,
  );
}

// ------------------------------------------------------------ §6.1 URL shape
const badShape = locs.filter(
  (u) => u.endsWith("/") || u.includes("index.html") || !u.startsWith("https://"),
);
if (badShape.length) {
  fail(`${badShape.length} sitemap URL(s) violate the §6.1 URL shape`, badShape.join("\n      "));
}

// hreflang must be reciprocal: every alternate a URL declares must itself be a
// <loc> in this sitemap, or Google discards the whole cluster.
const alternates = [...xml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
const danglingAlt = alternates
  .filter(([, , href]) => !sitemapPaths.has(new URL(href).pathname))
  .map(([, lang, href]) => `${lang} -> ${href}`);
if (danglingAlt.length) {
  fail(
    `${danglingAlt.length} hreflang alternate(s) point outside the sitemap`,
    [...new Set(danglingAlt)].join("\n      "),
  );
}
note.push(`hreflang alternates checked: ${alternates.length}`);

// ------------------------------------------- canonical + hreflang, per page
// Everything above reads the sitemap. This reads the HTML Next actually wrote
// to disk, which is the only artefact that proves what a crawler receives.

/** The sitemap split per `<url>`, so each `<loc>` keeps its own alternates
 *  rather than being flattened into one list. */
const sitemapEntries = new Map();
for (const block of xml.split("<url>").slice(1)) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) continue;
  const alts = [
    ...block.matchAll(/<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g),
  ].map((m) => `${m[1]} ${m[2]}`);
  sitemapEntries.set(new URL(loc).pathname, { loc, alts: alts.sort() });
}

const pageFiles = await htmlPages(root);

/** Attribute soup, not a parser: React emits `<link rel="canonical" href="…"/>`
 *  with attributes in declaration order, but nothing guarantees that order, so
 *  each tag is read as a bag of attributes.
 *
 *  Keys are LOWERCASED, which is not cosmetic. Next's own docs show the head
 *  output as `hreflang="en-US"`; this build writes `hrefLang="en"` — React's
 *  JSX prop name reaches the serialized HTML. Harmless to crawlers (HTML
 *  attribute names are case-insensitive) and invisible to anyone grepping the
 *  output for `hreflang`, which is exactly how a checker comes to report that
 *  56 correct pages have no alternates. */
function links(html, rel) {
  return [...html.matchAll(/<link\s([^>]*?)\/?>/g)]
    .map(([, attrs]) =>
      Object.fromEntries(
        [...attrs.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)].map((a) => [a[1].toLowerCase(), a[2]]),
      ),
    )
    .filter((a) => a.rel === rel);
}

function meta(html, property) {
  return html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1] ?? null;
}

let canonicalsChecked = 0;
const noCanonical = [];
const wrongCanonical = [];
const hreflangMismatch = [];
const ogMismatch = [];

for (const [path, entry] of sitemapEntries) {
  const file = pageFiles.get(path);
  if (!file) continue; // already reported above as a sitemap entry with no page
  const html = await readFile(new URL(file, root), "utf8");

  const canonical = links(html, "canonical").map((l) => l.href);
  if (canonical.length !== 1) {
    noCanonical.push(`${path} (found ${canonical.length})`);
    continue;
  }
  canonicalsChecked++;

  // Self-referencing, and byte-identical to the sitemap <loc> (§6.1). String
  // comparison on purpose: a URL that only matches after normalisation is a URL
  // Google will treat as a different page.
  if (canonical[0] !== entry.loc) {
    wrongCanonical.push(`${path}\n        page:    ${canonical[0]}\n        sitemap: ${entry.loc}`);
  }

  const pageAlts = links(html, "alternate")
    .filter((l) => l.hreflang)
    .map((l) => `${l.hreflang} ${l.href}`)
    .sort();
  if (pageAlts.join("|") !== entry.alts.join("|")) {
    hreflangMismatch.push(
      `${path}\n        page:    ${pageAlts.join(", ") || "(none)"}\n        sitemap: ${entry.alts.join(", ") || "(none)"}`,
    );
  }

  // The social card is inherited, not restated — see the long note in
  // `lib/seo/metadata.ts`. A page-level `openGraph` REPLACES the object the
  // layout resolved, and the generated card is attached to THAT object, so the
  // day someone adds `openGraph: { url }` to a page "for completeness",
  // `og:image` silently disappears from every page at once. These five
  // assertions are what makes that a failed build instead of a dead card.
  const problems = [];
  for (const tag of ["og:image", "og:site_name", "og:type", "og:title", "og:description"]) {
    if (!meta(html, tag)) problems.push(`${tag} missing`);
  }
  // `og:url` is optional here (nothing emits it) but it is a second canonical
  // to any scraper that prefers it, so if it ever appears it must agree.
  const ogUrl = meta(html, "og:url");
  if (ogUrl !== null && ogUrl !== canonical[0]) {
    problems.push(`og:url ${ogUrl} != canonical ${canonical[0]}`);
  }
  if (!/<meta name="twitter:card"/.test(html)) problems.push("twitter:card missing");
  if (problems.length) ogMismatch.push(`${path}: ${problems.join("; ")}`);
}

if (noCanonical.length) {
  fail(
    `${noCanonical.length} page(s) do not carry exactly one canonical`,
    noCanonical.join("\n      "),
  );
}
if (wrongCanonical.length) {
  fail(
    `${wrongCanonical.length} canonical(s) do not match the sitemap entry for that URL`,
    `a page whose canonical names another URL asks Google to drop it:\n      ${wrongCanonical.join("\n      ")}`,
  );
}
if (hreflangMismatch.length) {
  fail(
    `${hreflangMismatch.length} page(s) disagree with the sitemap about hreflang`,
    hreflangMismatch.join("\n      "),
  );
}
if (ogMismatch.length) {
  fail(
    `${ogMismatch.length} page(s) lost a social tag that is supposed to be inherited`,
    ogMismatch.join("\n      "),
  );
}
note.push(`page canonicals checked: ${canonicalsChecked}`);

// A 404 must never carry a canonical: it would invite Google to index the error
// page. Measured on Next 16.3.5, nothing currently reaches these routes — even
// an `alternates` declared on the root layout does not — so this is a tripwire
// rather than a live constraint: it is what would catch a `not-found.tsx` that
// grows metadata of its own, or a change in how Next resolves inherited
// `alternates`. Cheap enough to keep on that basis alone.
const nonPages = [...pageFiles].filter(([path]) => !sitemapEntries.has(path));
const canonicalOnNonPage = [];
for (const [path, file] of nonPages) {
  const html = await readFile(new URL(file, root), "utf8");
  const found = links(html, "canonical").length + links(html, "alternate").filter((l) => l.hreflang).length;
  if (found) canonicalOnNonPage.push(`${path} (${found} tag(s))`);
}
if (canonicalOnNonPage.length) {
  fail(
    `${canonicalOnNonPage.length} non-page route(s) carry canonical/hreflang tags`,
    `these are not pages and must not be indexable:\n      ${canonicalOnNonPage.join("\n      ")}`,
  );
}
note.push(`non-page routes checked for stray canonicals: ${nonPages.length}`);

// ---------------------------------------------------------------- report
console.log("");
for (const n of note) console.log(`  - ${n}`);
console.log("");
if (failures.length === 0) {
  console.log("PASS - sitemap, canonicals and hreflang agree with the build, and none of them\n       overlap the redirect map");
  process.exit(0);
}
for (const f of failures) console.log(`  x ${f}\n`);
console.log(`FAIL - ${failures.length} problem(s)`);
process.exit(1);

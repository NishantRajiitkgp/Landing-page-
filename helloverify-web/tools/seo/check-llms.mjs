/** BUILD-SPEC §11a.4's `llms.txt`, enforced against the build output.
 *
 *  §11a.4 states the property this file has to prove: the list is "regenerated
 *  from the same route manifest that feeds `sitemap.ts` — it can never drift".
 *  `lib/seo/llms.ts` does derive it from `allRoutes()`, but "derived from the
 *  same source" is a claim about code; what a crawler receives is the only
 *  thing that settles it. So this reads the emitted text file and the emitted
 *  HTML, and compares them.
 *
 *  The central assertion is the §8.3 invariant, extended to a fourth file: a
 *  page cannot exist without appearing in `llms.txt`, and an `llms.txt` entry
 *  cannot exist without a page. That is the same both-ways diff
 *  `check-sitemap.mjs` runs between the sitemap and the prerender manifest, and
 *  it is what made AUDIT A2 — 84 sitemap URLs pointing at redirects —
 *  unrepeatable.
 *
 *  It also asserts the thing the copy table was built for: every title and
 *  description in `llms.txt` is byte-identical to that page's own `<title>` and
 *  `<meta name="description">`. If those ever disagree, the "one table" claim
 *  in `lib/seo/copy.ts` is false and this is where it shows.
 *
 *  Reads the build output, so run it after `next build`:
 *      node tools/seo/check-llms.mjs
 */
import { readFile } from "node:fs/promises";

import { COMPANY_FACTS, CONTACT, SAME_AS } from "../../src/lib/content/company.ts";
import { LEGACY_ROUTES, LEGACY_LOCALES } from "../../src/lib/seo/legacy-urls.ts";
import { htmlPages, decodeEntities } from "./build-output.mjs";

const root = new URL("../../", import.meta.url);

const failures = [];
const note = [];

function fail(msg, detail) {
  failures.push(`${msg}\n      ${detail}`);
}

// ---------------------------------------------------------------- the inputs
/** The PRERENDERED body. Its existence is itself an assertion: Next 16 does not
 *  cache Route Handlers by default (`next/dist/docs/01-app/01-getting-started/
 *  15-route-handlers.md:51`), so without `export const dynamic = "force-static"`
 *  in `app/llms.txt/route.ts` there is no body here at all — the file would be
 *  rendered per request, 56 `canonicalOf` calls at a time, and nothing in the
 *  build output would prove it was even correct. */
const txt = await readFile(new URL(".next/server/app/llms.txt.body", root), "utf8").catch(
  () => null,
);
if (txt === null) {
  console.log(
    "FAIL - no prerendered llms.txt in the build output.\n" +
      "       Either `npm run build` has not run, or app/llms.txt/route.ts lost its\n" +
      '       `export const dynamic = "force-static"` and is now rendering per request.',
  );
  process.exit(1);
}

const meta = JSON.parse(
  await readFile(new URL(".next/server/app/llms.txt.meta", root), "utf8").catch(() => "{}"),
);

const xml = await readFile(new URL(".next/server/app/sitemap.xml.body", root), "utf8").catch(
  () => null,
);
if (xml === null) {
  console.log("FAIL - no sitemap in the build output. Run `npm run build` first.");
  process.exit(1);
}
const sitemapPaths = new Set(
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
);

const pageFiles = await htmlPages(root);

// ------------------------------------------------------------------ parsing
/** `- [Title](https://…): description` — the llmstxt.org entry shape. The title
 *  may itself contain brackets-free punctuation and an em dash; the URL is
 *  matched non-greedily up to the closing paren, and the description is the
 *  rest of the line. */
const ENTRY = /^- \[(?<title>.+?)\]\((?<url>https:\/\/[^)]+)\): (?<description>.+)$/;

const entries = [];
const optional = [];
const malformed = [];
{
  /** Section-aware, because the final "## Optional" block links the sitemap and
   *  robots.txt — which are real URLs but NOT pages, and counting them as
   *  routes makes the both-ways invariant below report two phantom entries.
   *  Tracking the heading is more honest than special-casing two filenames:
   *  anything added to that block is excluded by where it is, not by what it
   *  is called. */
  let section = "";
  for (const line of txt.split("\n")) {
    if (line.startsWith("## ")) {
      section = line.slice(3).trim();
      continue;
    }
    if (!line.startsWith("- [")) continue;
    const m = ENTRY.exec(line);
    if (!m) {
      malformed.push(line);
      continue;
    }
    (section === "Optional" ? optional : entries).push(m.groups);
  }
}
if (malformed.length) {
  fail(`${malformed.length} malformed entr(ies)`, malformed.join("\n      "));
}

/** The Optional block is a fixed pair, and both must be routes this site really
 *  serves — pointing an engine at a 404 sitemap is worse than omitting it. */
{
  const want = ["/sitemap.xml", "/robots.txt"];
  const got = optional.map((o) => new URL(o.url).pathname).sort();
  if (got.join(",") !== [...want].sort().join(",")) {
    fail(
      "the Optional block does not link exactly the sitemap and robots.txt",
      `got ${JSON.stringify(got)}, want ${JSON.stringify(want.sort())}`,
    );
  }
}

// ------------------------------------------------------- format (llmstxt.org)
const lines = txt.split("\n");
if (!lines[0]?.startsWith("# ")) fail("no H1 on the first line", lines[0] ?? "(empty file)");
const quote = lines.find((l) => l.startsWith("> "));
if (!quote) {
  fail("no blockquote summary", "§11a.4: must lead with a one-paragraph, quotable definition");
} else if (quote.length < 120) {
  fail("the quotable definition is suspiciously short", quote);
}
if (!txt.endsWith("\n") || txt.endsWith("\n\n")) {
  fail("file does not end with exactly one newline", JSON.stringify(txt.slice(-4)));
}
if (meta.headers?.["content-type"] !== "text/plain; charset=utf-8") {
  fail("wrong content-type", JSON.stringify(meta.headers?.["content-type"] ?? null));
}

// --------------------------------------------- §8.3's invariant, both ways
const llmsPaths = new Set(entries.map((e) => new URL(e.url).pathname));

const missingFromLlms = [...sitemapPaths].filter((p) => !llmsPaths.has(p)).sort();
const missingFromSitemap = [...llmsPaths].filter((p) => !sitemapPaths.has(p)).sort();

if (missingFromLlms.length) {
  fail(
    `${missingFromLlms.length} page(s) are in the sitemap but NOT in llms.txt`,
    `§11a.4 says the list can never drift from the manifest:\n      ${missingFromLlms.join("\n      ")}`,
  );
}
if (missingFromSitemap.length) {
  fail(
    `${missingFromSitemap.length} llms.txt entr(ies) have no sitemap page`,
    `these point a crawler at a 404 or a redirect:\n      ${missingFromSitemap.join("\n      ")}`,
  );
}
if (entries.length !== llmsPaths.size) {
  fail(
    `llms.txt lists ${entries.length} entries for ${llmsPaths.size} distinct URLs`,
    "a page listed twice is a page an engine will weight twice",
  );
}

// ------------------------------------------------ llms.txt vs the redirect map
const legacyPaths = new Set();
for (const locale of LEGACY_LOCALES) {
  for (const { from } of LEGACY_ROUTES) {
    legacyPaths.add(from === "/" ? `/${locale}` : `/${locale}${from}`);
  }
}
const overlap = [...llmsPaths].filter((p) => legacyPaths.has(p)).sort();
if (overlap.length) {
  fail(
    `${overlap.length} llms.txt URL(s) are also in the redirect map`,
    `a URL cannot be both "must 200" and "must 308":\n      ${overlap.join("\n      ")}`,
  );
}

// ------------------------------- llms.txt copy vs the page's own head tags
// This is the assertion the copy table exists to make true. `lib/seo/copy.ts`
// feeds both `pageMetadata` and `renderLlmsTxt`; if the two ever disagree, the
// "one table" claim is false and it shows here rather than in a crawler's index.
let copyChecked = 0;
const copyMismatch = [];
for (const e of entries) {
  const path = new URL(e.url).pathname;
  const file = pageFiles.get(path);
  if (!file) continue; // already reported above
  const html = await readFile(new URL(file, root), "utf8");

  const title = decodeEntities(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = decodeEntities(
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "",
  );
  copyChecked++;

  if (title !== e.title) {
    copyMismatch.push(`${path} title\n        page:     ${title}\n        llms.txt: ${e.title}`);
  }
  if (description !== e.description) {
    copyMismatch.push(
      `${path} description\n        page:     ${description}\n        llms.txt: ${e.description}`,
    );
  }
}
if (copyMismatch.length) {
  fail(
    `${copyMismatch.length} page(s) disagree with llms.txt about their own copy`,
    `both read lib/seo/copy.ts, so this means something bypassed the table:\n      ${copyMismatch.join("\n      ")}`,
  );
}
note.push(`llms.txt entries checked against page head tags: ${copyChecked}`);

// ------------------------------------------- the hard numbers (§11a.4, §11a.3)
// `lib/content/company.ts` restates figures that `/about` renders as JSX. That
// duplication is deliberate and bounded — rewiring DESIGN-complete markup was
// not worth it — so it is CHECKED rather than trusted, the same way the HelloV
// offer catalogue is.
const aboutFile = pageFiles.get("/en/about");
if (!aboutFile) {
  fail("no /en/about in the build output", "cannot verify the company facts");
} else {
  const about = decodeEntities(await readFile(new URL(aboutFile, root), "utf8"));
  const missingFacts = COMPANY_FACTS.filter((f) => !about.includes(f.value)).map(
    (f) => `${f.value} ${f.label}`,
  );
  if (missingFacts.length) {
    fail(
      `${missingFacts.length} company fact(s) in llms.txt are not on /about`,
      `/about is the reviewed source for these (§11a.3 entity consistency):\n      ${missingFacts.join("\n      ")}`,
    );
  }
  const notInLlms = COMPANY_FACTS.filter((f) => !txt.includes(f.value)).map((f) => f.value);
  if (notInLlms.length) {
    fail(
      `${notInLlms.length} hard number(s) missing from llms.txt`,
      `§11a.4 requires them:\n      ${notInLlms.join("\n      ")}`,
    );
  }
  note.push(`company facts cross-checked against /about: ${COMPANY_FACTS.length}`);
}

// ------------------------------- llms.txt vs the Organization entity (§11a.3)
// "The Organization block must be byte-identical across every page and match
// external profiles exactly." llms.txt states the same company in prose, and a
// crawler reading both must not be told two different things. Both read
// lib/content/company.ts, so this asserts the reading actually happened.
{
  const problems = [];
  for (const url of SAME_AS) {
    if (!txt.includes(url)) problems.push(`profile URL missing: ${url}`);
  }
  for (const email of [CONTACT.salesEmail, CONTACT.supportEmail]) {
    if (!txt.includes(email)) problems.push(`contact email missing: ${email}`);
  }
  if (!txt.includes("Noida")) problems.push("headquarters city missing");
  if (txt.includes("linkedin.com/in/")) {
    problems.push("links a personal LinkedIn profile rather than the company page");
  }
  // Claims the reviewed /about credentials list does not support. The old site
  // asserted both; neither is evidenced here (see lib/content/company.ts).
  for (const overclaim of ["27701", "SOC 2"]) {
    if (txt.includes(overclaim)) {
      problems.push(`unevidenced certification claim: ${overclaim}`);
    }
  }
  if (problems.length) {
    fail(
      `${problems.length} problem(s) with the company block in llms.txt`,
      problems.join("\n      "),
    );
  }
  note.push(`entity fields cross-checked against the Organization node: ${SAME_AS.length + 2}`);
}

// ------------------------------------------------------------------- report
console.log(`llms.txt entries:  ${entries.length}`);
console.log(`sitemap entries:   ${sitemapPaths.size}`);
console.log("");
for (const n of note) console.log(`  - ${n}`);
console.log("");

if (failures.length === 0) {
  console.log(
    "PASS - llms.txt lists exactly the pages the sitemap does, states each one's\n" +
      "       own title and description, and carries the reviewed company facts",
  );
  process.exit(0);
}
for (const f of failures) console.log(`  x ${f}\n`);
console.log(`FAIL - ${failures.length} problem(s)`);
process.exit(1);

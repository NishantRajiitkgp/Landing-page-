/** `llms.txt`, generated from the route manifest (BUILD-SPEC §8.3, §11a.4).
 *
 *  §11a.4's four requirements, and how each is met here:
 *
 *    1. "Regenerated from the same route manifest that feeds `sitemap.ts` — it
 *       can never drift." Every URL below comes from `allRoutes()` and
 *       `canonicalOf`, the same two calls `app/sitemap.ts` and
 *       `lib/seo/metadata.ts` make. There is no second list, so §8.3's
 *       invariant — a page cannot exist without being in the sitemap, and a
 *       sitemap entry cannot exist without a page — now covers this file too.
 *       `tools/seo/check-llms.mjs` diffs the two URL sets both ways anyway.
 *    2. "Leads with a one-paragraph, quotable company definition." See
 *       `COMPANY_DEFINITION` in `lib/content/company.ts`, and the note there
 *       about why it is assembled from already-reviewed sentences.
 *    3. "Includes the hard numbers." `COMPANY_FACTS`, `OFFICES`,
 *       `CREDENTIALS` — checked against the rendered `/en/about`.
 *    4. "Lists key pages with a one-line description each." Every route, with
 *       the description from `lib/seo/copy.ts` — the same string that page's
 *       `<meta name="description">` carries. This is the requirement that
 *       forced the copy table: before item 7 those 32 strings lived only inside
 *       the page files and nothing outside a React render could read them.
 *
 *  ON "KEY PAGES" vs ALL 56. §11a.4 says "key pages", which pulls against "can
 *  never drift" in the same list. All 56 are emitted, grouped by section: the
 *  12 check pages and 8 country guides are the specific, extractable material
 *  an engine is most likely to want (§11a.2 rates statistics and per-topic
 *  pages highest), and any hand-curated subset is a second list that goes stale
 *  the first time a page is added. "Key" is expressed as ORDER — the manifest's
 *  own priority ordering, commercial pages first — not as omission.
 *
 *  FORMAT is llmstxt.org's: an H1 name, a blockquote summary, free prose, then
 *  H2 sections of `- [Title](url): description`. It is a proposed standard, not
 *  a ratified one (§11a.4 says so), which is another reason not to invent a
 *  shape of our own.
 *
 *  ONE FILE, AT THE ROOT, IN ENGLISH. There is no `/hi/llms.txt`: no consumer
 *  looks for one, and the file names absolute `/en/…` URLs which are the pages
 *  that exist today. It sits beside `robots.txt` and `sitemap.xml`, outside
 *  `[locale]`, and the proxy matcher excludes it by the same rule it excludes
 *  those two — `/((?!api|_next|_vercel|.*\..*).*)` skips any path containing a
 *  dot. Verified against a running server rather than read off the regex: see
 *  `npm run probe:redirects`.
 */
import {
  COMPANY_DEFINITION,
  COMPANY_FACTS,
  COMPANY_INTRO,
  CONTACT,
  CORE_SERVICES,
  CREDENTIALS,
  OFFICES,
  PROFILES,
} from "@/lib/content/company";
import { routing } from "@/lib/i18n/routing";
import { canonicalOf } from "@/lib/seo/canonical";
import { copyFor } from "@/lib/seo/copy";
import { allRoutes } from "@/lib/seo/routes";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

/** The sections, in the order they appear in the file, each claiming a prefix
 *  of the route manifest.
 *
 *  Order is the whole editorial judgement in this file: an engine reading top
 *  to bottom should meet the commercial pages before the reference material,
 *  which is the same ordering `routes.ts` already encodes as `priority`.
 *
 *  `match` is checked for EXHAUSTIVENESS below — a route matching no section is
 *  a build error, not a silently dropped line. That is what stops a new
 *  top-level section from being invisible to every AI crawler until someone
 *  notices.
 */
const SECTIONS: readonly { heading: string; match: (path: string) => boolean }[] = [
  { heading: "Start here", match: (p) => p === "/" },
  { heading: "For business", match: (p) => p === "/business" || p.startsWith("/business/") },
  { heading: "For governments", match: (p) => p === "/governments" || p.startsWith("/governments/") },
  { heading: "For individuals and families", match: (p) => p === "/individuals" || p.startsWith("/individuals/") },
  { heading: "The platform", match: (p) => p === "/platform" || p.startsWith("/platform/") },
  { heading: "Verification checks", match: (p) => p.startsWith("/checks/") },
  { heading: "Country guides", match: (p) => p.startsWith("/countries/") },
  { heading: "Resources", match: (p) => p === "/resources" || p.startsWith("/resources/") },
  { heading: "Company", match: (p) => p === "/about" || p === "/contact" },
  { heading: "Legal", match: (p) => p.startsWith("/legal/") },
];

/** The file, as a string. Pure — no request, no clock, no filesystem — which is
 *  what lets the route handler prerender it (see `app/llms.txt/route.ts`). */
export function renderLlmsTxt(): string {
  const locale = routing.defaultLocale;
  const routes = allRoutes();

  /** Exhaustiveness, both ways: every route lands in exactly one section, and
   *  no section is empty. The first catches a new top-level path silently
   *  vanishing from the file; the second catches a heading left behind after
   *  its pages were removed — an empty section in a navigation file is worse
   *  than no section, because it tells a crawler there is nothing there. */
  const grouped = SECTIONS.map((s) => ({
    heading: s.heading,
    routes: routes.filter((r) => s.match(r.path)),
  }));

  const claimed = new Set(grouped.flatMap((g) => g.routes.map((r) => r.path)));
  const orphans = routes.filter((r) => !claimed.has(r.path)).map((r) => r.path);
  if (orphans.length) {
    throw new Error(
      `renderLlmsTxt: ${orphans.length} route(s) match no section in llms.ts ` +
        `and would be invisible to every AI crawler: ${orphans.join(", ")}. ` +
        `Add a section, or widen an existing match.`,
    );
  }
  const doubleClaimed = routes.filter(
    (r) => grouped.filter((g) => g.routes.some((x) => x.path === r.path)).length > 1,
  );
  if (doubleClaimed.length) {
    throw new Error(
      `renderLlmsTxt: route(s) claimed by more than one section: ` +
        `${doubleClaimed.map((r) => r.path).join(", ")}`,
    );
  }
  const empty = grouped.filter((g) => g.routes.length === 0).map((g) => g.heading);
  if (empty.length) {
    throw new Error(`renderLlmsTxt: section(s) with no pages: ${empty.join(", ")}`);
  }

  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`, "");
  lines.push(`> ${COMPANY_DEFINITION}`, "");
  lines.push(COMPANY_INTRO, "");

  /** The old file's "Company" block, regenerated. Its shape is ported; its
   *  values now come from `lib/content/company.ts` so they cannot drift from
   *  the `Organization` node, which reads the same constants. */
  lines.push("## Company", "");
  lines.push(`- Name: ${SITE_NAME}`);
  lines.push(`- Website: ${absoluteUrl("/" + routing.defaultLocale)}`);
  lines.push("- Industry: Background verification, KYC, primary source verification");
  lines.push(`- Headquarters: Noida, India (operations in 120+ countries)`);
  lines.push(`- Contact: ${CONTACT.salesEmail} | ${CONTACT.supportEmail}`);
  for (const p of PROFILES) lines.push(`- ${p.label}: ${p.url}`);
  lines.push(`- ${COMPANY_FACTS.map((f) => `${f.value} ${f.label}`).join(" · ")}`);
  lines.push("");

  lines.push("## Core services", "");
  for (const s of CORE_SERVICES) lines.push(`- ${s}`);
  lines.push("");

  lines.push("## Trust & compliance", "");
  for (const c of CREDENTIALS) lines.push(`- ${c}`);
  lines.push("");

  lines.push("## Offices", "");
  lines.push(OFFICES.join(" · "), "");

  for (const g of grouped) {
    lines.push(`## ${g.heading}`, "");
    for (const r of g.routes) {
      const copy = copyFor(r.path);
      /** The URL is `canonicalOf`, so it is byte-identical to that page's
       *  `<link rel="canonical">` and to its `<loc>` in the sitemap — §6.1's
       *  rule, now holding across four files instead of three. */
      lines.push(`- [${copy.title}](${canonicalOf(locale, r.path)}): ${copy.description}`);
    }
    lines.push("");
  }

  /** The old file closed with these and they are worth keeping: an engine that
   *  wants the exhaustive list should be pointed at the sitemap rather than
   *  left to infer that this file is exhaustive. Both are real routes. */
  lines.push("## Optional", "");
  lines.push(`- [Sitemap](${absoluteUrl("/sitemap.xml")}): every public URL`);
  lines.push(`- [Robots](${absoluteUrl("/robots.txt")}): crawler directives`);
  lines.push("");

  /** Trailing newline, single. A text file without one is a lint error in most
   *  toolchains and a diff nuisance in all of them. */
  return lines.join("\n").replace(/\n+$/, "") + "\n";
}

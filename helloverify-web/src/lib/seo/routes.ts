/** The route manifest — the one list of pages this site has.
 *
 *  BUILD-SPEC §8.3 states the invariant this file exists to make true:
 *
 *      "A page cannot exist without being in the sitemap, and a sitemap entry
 *       cannot exist without a page."
 *
 *  That is what makes AUDIT A2 impossible to reintroduce. The old site
 *  generated its sitemap from `seo-routes.json`, a hand-maintained list that
 *  had drifted from the router — which is how 84 sitemap URLs came to point at
 *  redirects. Here the dynamic half is derived from the same content modules
 *  that `generateStaticParams` fans out over, so those cannot drift at all,
 *  and the static half is checked against the build output by
 *  `tools/seo/check-sitemap.mjs` rather than trusted.
 *
 *  Paths here are LOCALE-RELATIVE and have no trailing slash. `"/"` means the
 *  locale home, which renders at `/en`, not at `/`.
 */
import { CHECKS } from "@/lib/content/checks";
import { COUNTRIES } from "@/lib/content/countries";
import { LEGAL } from "@/lib/content/legal";
import { POSTS } from "@/lib/content/posts";

/** Sitemap hints. `priority` is relative within this site only — it says
 *  nothing to Google about ranking, it only orders our own crawl preference.
 *  The values follow the old `seo-routes.json`, which was reviewed, rather
 *  than being re-invented: commercial verticals above hubs, hubs above
 *  utility, legal at the bottom. */
export type RouteEntry = {
  readonly path: string;
  readonly changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  readonly priority: number;
};

const r = (
  path: string,
  changeFrequency: RouteEntry["changeFrequency"],
  priority: number,
): RouteEntry => ({ path, changeFrequency, priority });

/** Every page with its own file under `app/[locale]`. Hand-maintained, and
 *  hand-maintenance is exactly why `check-sitemap.mjs` diffs it against what
 *  Next actually prerendered. */
export const STATIC_ROUTES: readonly RouteEntry[] = [
  r("/", "weekly", 1.0),

  // Audience hubs — new in this IA, and the strongest commercial keywords on
  // the site (IA §10 decision 1: real content, not link lists).
  r("/business", "monthly", 0.9),
  r("/governments", "monthly", 0.9),
  r("/individuals", "monthly", 0.9),
  r("/platform", "monthly", 0.8),
  r("/resources", "weekly", 0.7),

  // Business verticals
  r("/business/enterprise", "monthly", 0.9),
  r("/business/smb", "monthly", 0.9),
  r("/business/employee-verification", "monthly", 0.9),
  r("/business/customer-kyc", "monthly", 0.8),
  r("/business/certifier", "monthly", 0.8),

  // Government verticals
  r("/governments/health", "monthly", 0.8),
  r("/governments/immigration", "monthly", 0.8),
  r("/governments/manpower-education", "monthly", 0.8),
  r("/governments/manpower-education/ministry-of-manpower", "monthly", 0.8),
  r("/governments/trade", "monthly", 0.8),

  // Individual verticals
  r("/individuals/hellov", "monthly", 0.8),
  r("/individuals/immigration", "monthly", 0.9),
  r("/individuals/home-family", "monthly", 0.7),

  // Platform
  r("/platform/technology", "monthly", 0.8),
  r("/platform/coverage", "monthly", 0.9),
  r("/platform/security-compliance", "monthly", 0.8),

  // Resources
  r("/resources/blog", "weekly", 0.8),
  r("/resources/checks", "monthly", 0.7),
  r("/resources/countries", "monthly", 0.7),
  r("/resources/glossary", "monthly", 0.6),

  // Utility
  r("/about", "monthly", 0.7),
  r("/contact", "monthly", 0.6),
];

/** The programmatic layer (IA §7) and the other dynamic segments, derived from
 *  the SAME arrays their `generateStaticParams` iterates. Adding a check, a
 *  country, a post or a policy puts it in the sitemap with no second edit —
 *  the drift the old `seo-routes.json` suffered is not expressible here. */
export function dynamicRoutes(): RouteEntry[] {
  return [
    ...CHECKS.map((c) => r(`/checks/${c.slug}`, "monthly", 0.7)),
    ...COUNTRIES.map((c) => r(`/countries/${c.slug}`, "monthly", 0.7)),
    ...POSTS.map((p) => r(`/resources/blog/${p.slug}`, "monthly", 0.6)),
    ...LEGAL.map((d) => r(`/legal/${d.slug}`, "yearly", 0.3)),
  ];
}

/** Every locale-relative path on the site, deduplicated and ordered. */
export function allRoutes(): RouteEntry[] {
  const all = [...STATIC_ROUTES, ...dynamicRoutes()];
  const seen = new Set<string>();
  for (const e of all) {
    if (seen.has(e.path)) throw new Error(`duplicate route in manifest: ${e.path}`);
    seen.add(e.path);
  }
  return all;
}

/** `"/about"` + `"en"` -> `"/en/about"`; `"/"` -> `"/en"`.
 *
 *  Same rule as `lib/i18n/href.ts#localise`. The root special case is the one
 *  that matters: `/en/` would 308 to `/en`, and a sitemap entry that redirects
 *  is AUDIT A2 in miniature.
 */
export function localePath(path: string, locale: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

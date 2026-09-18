/** "What is this page's URL?", answered in one place (BUILD-SPEC §6.1, §8.1).
 *
 *  This was the private opening of `lib/seo/metadata.ts` until the JSON-LD work
 *  needed the same answer: `Service.@id`, `Service.url` and
 *  `BlogPosting.mainEntityOfPage` all have to be the page's canonical, and a
 *  second `absoluteUrl(localePath(…))` call somewhere else is exactly the
 *  three-places-one-URL drift §6.1 exists to forbid. `metadata.ts` now calls
 *  this too, so the canonical tag and every node in the graph are the same
 *  string by construction rather than by review.
 *
 *  Both guards moved with it, and both still earn their place:
 *
 *  - an unknown LOCALE would put a canonical on a URL the site does not serve;
 *  - an unknown PATH would put a canonical outside the sitemap, which is the
 *    §8.3 drift that let all 84 of the old site's sitemap URLs rot onto
 *    redirects (AUDIT A2).
 *
 *  Neither catches the case that matters most — a page naming ANOTHER page's
 *  real route — because both strings are valid in isolation. That one is caught
 *  in the build output by `tools/seo/check-sitemap.mjs` (canonical equals its
 *  own `<loc>`) and now also by `tools/seo/check-schema.mjs` (`Service.@id`
 *  equals this page's canonical plus a fragment).
 */
import { hasLocale } from "next-intl";

import { routing } from "@/lib/i18n/routing";
import { allRoutes, localePath } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

/** Built once per build. `allRoutes()` already throws on a duplicate path, so
 *  this set is the full route manifest with no further checking. */
const KNOWN_PATHS: ReadonlySet<string> = new Set(allRoutes().map((r) => r.path));

/** `canonicalOf("en", "/about")` → `"https://www.helloverify.com/en/about"`.
 *
 *  `path` is LOCALE-RELATIVE and must be a route in `lib/seo/routes.ts` —
 *  `"/about"`, `"/checks/credit"`, `"/"` for the locale home.
 */
export function canonicalOf(locale: string, path: string): string {
  if (!hasLocale(routing.locales, locale)) {
    throw new Error(
      `canonicalOf: unknown locale ${JSON.stringify(locale)}. ` +
        `A canonical in a locale the site does not serve points at a 404.`,
    );
  }
  if (!KNOWN_PATHS.has(path)) {
    throw new Error(
      `canonicalOf: ${JSON.stringify(path)} is not in the route manifest ` +
        `(lib/seo/routes.ts). A canonical that is not in the sitemap is the ` +
        `drift §8.3 exists to prevent — add the route there, or fix the path.`,
    );
  }

  return absoluteUrl(localePath(path, locale));
}

/** The same URL in every locale, plus `x-default`, for an `alternates` block.
 *  Split from `canonicalOf` only so that a caller wanting one URL does not have
 *  to build the whole matrix. */
export function alternatesOf(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, canonicalOf(l, path)])),
    "x-default": canonicalOf(routing.defaultLocale, path),
  };
}

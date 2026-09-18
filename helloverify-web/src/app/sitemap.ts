/** sitemap.xml (BUILD-SPEC §8.3, §6.1).
 *
 *  Replaces the old `scripts/generate-seo-files.mjs` (203 lines) and, more to
 *  the point, replaces the hand-maintained `seo-routes.json` it read. Every URL
 *  here comes from `lib/seo/routes.ts`, whose dynamic half is the same array
 *  `generateStaticParams` fans out over.
 *
 *  Three properties this file must hold, all of which the old site broke:
 *
 *   1. **Every entry returns 200.** Not a redirect. All 84 of the old site's
 *      entries 301'd into `/index.html` (AUDIT A2) while the page they landed
 *      on declared a canonical pointing back at the sitemap URL.
 *   2. **Every entry is byte-identical to that page's canonical tag and to its
 *      own hreflang entry.** Same origin constant, same locale-prefixing
 *      function, no trailing slash anywhere.
 *   3. **No legacy URL appears.** `lib/seo/legacy-urls.ts` is the complement of
 *      this list: 53 routes that must 308, and none of them may be advertised
 *      for crawling. `tools/seo/check-sitemap.mjs` asserts the two sets are
 *      disjoint.
 *
 *  It lives at `app/sitemap.ts`, not under `[locale]`, because there is one
 *  sitemap for the site and it is served at `/sitemap.xml` with no prefix.
 */
import type { MetadataRoute } from "next";

import { routing } from "@/lib/i18n/routing";
import { allRoutes, localePath } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";

/** Static, like every other route on this site (§5). Without this the sitemap
 *  is generated per request, which costs nothing visible and quietly breaks the
 *  "zero dynamic routes" property the build asserts. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allRoutes().flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(entry.path, locale)),
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      /** hreflang. Reciprocal by construction — every locale lists every
       *  locale, including itself, which is what "self-referencing" means for
       *  an alternate (§8.1). `x-default` points at `en`: it is the neutral
       *  fallback, not a country-targeted page.
       *
       *  With one locale live this emits `en` + `x-default` for each URL. That
       *  is correct rather than redundant — it tells Google the page is not
       *  language-ambiguous — and it grows to the full matrix the moment
       *  `routing.locales` does, with no edit here. */
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, absoluteUrl(localePath(entry.path, l))]),
          ),
          "x-default": absoluteUrl(localePath(entry.path, routing.defaultLocale)),
        },
      },
    })),
  );
}

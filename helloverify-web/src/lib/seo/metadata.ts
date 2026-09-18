/** Canonical + hreflang for every page (BUILD-SPEC §8.1, §6.1).
 *
 *  §6.1 requires the canonical tag, the sitemap entry and the hreflang entry
 *  for a page to be BYTE-IDENTICAL. The only way to guarantee that is to
 *  generate all three from one function — `lib/seo/canonical.ts#canonicalOf`,
 *  which wraps the same `absoluteUrl(localePath(…))` pair `app/sitemap.ts`
 *  calls. Neither file formats a URL of its own, so the two cannot disagree
 *  about `www`, about the locale prefix, or about the trailing slash. Since the
 *  JSON-LD work (§8.2) the graph's `Service.url` and
 *  `BlogPosting.mainEntityOfPage` come from that same function, so a page's
 *  canonical and its structured data cannot disagree either.
 *
 *  Since item 7 the title and description come from `lib/seo/copy.ts`,
 *  looked up by the same `path` the canonical is built from — so a page's
 *  `<title>`, its canonical, its `Service` node and its `llms.txt` line are
 *  all keyed off one string and read from one table.
 *
 *  AUDIT C2 is the failure this replaces: the old site mutated `<link
 *  rel="canonical">` from `PageMetaManager.tsx` after hydration, so every
 *  crawler that does not run JS saw the homepage canonical on all 84 URLs.
 *  Nothing here runs in the browser — it is a build-time string.
 *
 *  THE PATH ARGUMENT IS THE WEAK POINT, and is guarded twice. Next gives
 *  `generateMetadata` no pathname, so each page has to name its own route, and
 *  a page that names the wrong one silently tells Google it is a duplicate of
 *  another page. So:
 *
 *    1. `path` is checked against the route manifest in `canonicalOf`. A path
 *       that is not a real route throws during `next build` — canonical ⊆
 *       sitemap holds by construction, not by review.
 *    2. `tools/seo/check-sitemap.mjs` reads the emitted HTML and asserts each
 *       page's canonical equals its OWN URL. That is the half this file cannot
 *       see: `/business/smb` passing `"/business/enterprise"` is a valid
 *       manifest path, so only the build output can catch it.
 */
import type { Metadata } from "next";

import { alternatesOf, canonicalOf } from "@/lib/seo/canonical";
import { copyFor } from "@/lib/seo/copy";

/**
 * `pageMetadata("en", "/about")` -> the title, description and `alternates`
 * block for `https://www.helloverify.com/en/about`.
 *
 * `path` is LOCALE-RELATIVE and must be a route in `lib/seo/routes.ts` —
 * `"/about"`, `"/checks/credit"`, `"/"` for the locale home.
 *
 * THE COPY ARGUMENT IS GONE, and that is the point of item 7. Pages used to
 * pass their own `{ title, description }`, which made the page file the only
 * place that copy existed — fine for a `<title>`, useless for `llms.txt`
 * (§11a.4), which has to state a line per route from the route manifest.
 * `lib/seo/copy.ts` is now the one table, keyed by the same path this function
 * already validates, so a page cannot state a title that `llms.txt` disagrees
 * with: there is no second string to disagree with.
 */
export function pageMetadata(locale: string, path: string): Metadata {
  const copy = copyFor(path);

  return {
    title: copy.title,
    description: copy.description,

    alternates: {
      /** Self-referencing, absolute, and identical to this page's own entry in
       *  `languages` below and to its `<loc>` in the sitemap. Absolute rather
       *  than relative-via-`metadataBase`: §8.1 requires protocol and host, and
       *  resolving it here rather than in Next's serializer is what lets the
       *  checker compare it to the sitemap as a plain string. */
      canonical: canonicalOf(locale, path),

      /** Reciprocal by construction — every locale lists every locale,
       *  including itself. Never point a non-`en` page at the `en` one: that
       *  tells Google to drop it (§8.1).
       *
       *  With one locale live this is `en` + `x-default`, both self. That is
       *  correct rather than redundant, matches what the sitemap already
       *  emits, and grows to the full matrix the moment `routing.locales`
       *  does — no edit in any page file. */
      languages: alternatesOf(path),
    },

    /** NO `openGraph` HERE, and this is a deviation from the §8.1 sketch, which
     *  has each page set `openGraph: { type, url, locale, siteName }`.
     *
     *  Measured, not assumed. Next merges metadata shallowly, so a page-level
     *  `openGraph` REPLACES the object the layout resolved rather than
     *  extending it — and the generated OG card is attached to that object.
     *  `next/dist/lib/metadata/resolve-metadata.js#mergeStaticMetadata` only
     *  attaches an `opengraph-image` file to the segment that OWNS the file,
     *  which is `app/[locale]/`, the layout. A page that defines `openGraph`
     *  therefore drops `og:image` — verified on the build output: setting it
     *  here removed `og:image` from all 56 prerendered pages at once.
     *
     *  So the trade is `og:url` against `og:image`, and `og:image` wins. A
     *  missing `og:url` costs nothing here — every page is reachable at exactly
     *  one URL (§6.1; the alternatives 308), so a scraper's fetched URL and the
     *  canonical are the same string — while a missing `og:image` breaks the
     *  card on every shared link.
     *
     *  Rejected alternative: keep `openGraph` and restate `images` as
     *  `/${locale}/opengraph-image`. That hardcodes the file convention's own
     *  route into 32 pages and silently emits a 404 image the day the file is
     *  renamed. The checker asserts `og:image` survives instead.
     *
     *  What still reaches the page, unaided: `og:title` and `og:description`
     *  auto-fill from the `title`/`description` above
     *  (`resolve-metadata.js#inheritFromMetadata`), and `og:type`,
     *  `og:site_name`, `og:locale` and `og:image` inherit from the layout.
     *  `twitter.card` inherits the same way. All four are asserted in
     *  `tools/seo/check-sitemap.mjs`, so this reasoning fails the build if it
     *  ever stops being true. */
  };
}

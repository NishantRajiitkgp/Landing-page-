/** Locale routing (BUILD-SPEC §7, §6.1).
 *
 *  `localePrefix: "always"` is the load-bearing setting: every URL carries its
 *  locale, including English, so there is never an unprefixed duplicate of a
 *  prefixed page. AUDIT A2 exists because nobody wrote that rule down.
 *
 *  ON THE LOCALE LIST — `hi` and `ar` are NOT here yet, deliberately.
 *
 *  §7 makes a missing translation key a type error rather than a runtime
 *  fallback, and that rule is doing exactly what it should: declaring a locale
 *  whose copy does not exist would publish a full route tree of English pages
 *  under /hi and /ar. That is not a partial translation, it is duplicate
 *  content at three times the scale, and it would be actively worse for search
 *  than those URLs not existing.
 *
 *  The old site has real translated copy (33,609 Devanagari and 15,806 Arabic
 *  characters, AUDIT §F) and it is recoverable from the old repo — but it is
 *  written against the OLD information architecture, so it maps onto these
 *  pages only in part. Adding a locale here is one array entry, which is the
 *  §3.4 requirement; it is gated on copy, not on code.
 *
 *  ONE ARRAY ENTRY IS NOW ENFORCED, NOT ASSERTED. The list below is mirrored
 *  by `SERVED_LOCALES` in `lib/seo/legacy-urls.ts`, which cannot import this
 *  file (it has to stay loadable from `next.config.ts`). Editing one and not
 *  the other used to be silent and permanent: `legacyRedirects()` emits
 *  `/hi/:path*` -> `/en/:path*` for every locale it does not think is served,
 *  so a `hi` declared HERE alone would serve 56 Hindi pages that each 308 to
 *  their English equivalent, cached forever. `localeContractDrift()` in
 *  `legacy-urls.ts` compares the two and `lib/seo/canonical.ts` throws on a
 *  mismatch at module load, so that state fails `next build` instead.
 */
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

/** Arabic is the reason this exists; keeping it a lookup rather than an
 *  inline ternary means adding `ur` or `fa` later is a data change. */
const RTL_LOCALES = new Set<string>(["ar", "he", "fa", "ur"]);

export function directionOf(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

/** `og:locale` and `og:locale:alternate`, derived rather than written down
 *  (BUILD-SPEC §8.1).
 *
 *  The root layout carried `locale: "en"` as a literal until this change. It
 *  was CORRECT — `en` is the only served locale — and it was correct by
 *  coincidence: nothing tied it to the list above, so the first `/hi` page
 *  would have shipped `og:locale` of `en`, telling every scraper that a Hindi
 *  page is English. Reading it off `routing.locales` makes the tag move with
 *  the list instead of needing to be remembered.
 *
 *  `alternateLocale` is the rest of the list with SELF EXCLUDED: Open Graph's
 *  `og:locale:alternate` means "the other locales this page exists in", so
 *  listing self would claim the page is an alternate of itself. With one
 *  locale served that array is empty and Next emits nothing for it —
 *  `next/dist/lib/metadata/metadata.js` L836 guards with `if
 *  (og.alternateLocale)` and then iterates, so an empty array produces zero
 *  tags. Measured consequence: today's HTML does not change by one byte, and
 *  the tags appear on their own the day a second locale is declared.
 *
 *  REJECTED — `language_TERRITORY`. Open Graph's own example is `en_US` and
 *  Next's doc uses it, but the tag this site emits today is `en` and widening
 *  it needs a territory decided per locale (`en_IN` or `en_AE`? `ar_AE` or
 *  `ar_SA`?). That is a market decision with a visible output change, and it
 *  is not being taken as a side effect of un-hardcoding a string.
 *
 *  `locales` is a parameter with a default so the `hi`/`ar` output can be
 *  asserted before either ships — `tools/test/locales.test.ts`.
 */
export function openGraphLocales(
  locale: string,
  locales: readonly string[] = routing.locales,
): { locale: string; alternateLocale: string[] } {
  return { locale, alternateLocale: locales.filter((l) => l !== locale) };
}

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

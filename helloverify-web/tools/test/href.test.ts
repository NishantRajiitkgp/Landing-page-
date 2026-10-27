/** Locale-prefix swapping for the language menu.
 *
 *  `LocaleSwitch` used to send every language link to that locale's home.
 *  `switchLocaleHref` is the rule the menu now uses: keep the path, swap
 *  the prefix, and carry a query or hash when the page has one.
 */
import { routing } from "../../src/lib/i18n/routing.ts";
import { switchLocaleHref, unlocalise } from "../../src/lib/i18n/href.ts";

import { check } from "./harness.ts";

const locales = routing.locales;

console.log("locale href");

check(
  "a subpage keeps its path",
  switchLocaleHref("/en/products/customer-kyc", "hi", locales) === "/hi/products/customer-kyc",
  switchLocaleHref("/en/products/customer-kyc", "hi", locales),
);

check(
  "home stays home",
  switchLocaleHref("/en", "ar", locales) === "/ar",
  switchLocaleHref("/en", "ar", locales),
);

check(
  "a query survives the swap",
  switchLocaleHref("/en/products/immigration", "hi", locales, "?tab=applicant") ===
    "/hi/products/immigration?tab=applicant",
  switchLocaleHref("/en/products/immigration", "hi", locales, "?tab=applicant"),
);

check(
  "a hash on the home page does not grow a trailing slash",
  switchLocaleHref("/hi", "en", locales, "#consumer-services") === "/en#consumer-services",
  switchLocaleHref("/hi", "en", locales, "#consumer-services"),
);

check(
  "a non-locale first segment is not stripped",
  unlocalise("/ai", locales) === "/ai",
  unlocalise("/ai", locales),
);

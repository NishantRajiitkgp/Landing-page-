/** The legacy URL contract — the data (BUILD-SPEC §6.2, IA §9).
 *
 *  `./redirects` turns this into Next rules; the two are split only because
 *  together they exceed BUILD-SPEC §4 rule 2's 300 lines. This half is the one
 *  worth reviewing line by line.
 *
 *
 *  Every URL the old site ever served, mapped to its successor on this one.
 *  AUDIT A5 is that all of this lived in a `web.config` that was never
 *  executed, so the old "redirects" were client-side JS that search engines
 *  saw as a 200 on a thin page. Here they are real server 308s.
 *
 *  ON DEPENDENCIES — this module imports NOTHING, deliberately. `next.config.ts`
 *  loads outside the app graph, so `@/` does not resolve here and `server-only`
 *  would break the config load outright. Keep it plain data, the same way
 *  `lib/leads/constraints.ts` stays free of zod.
 *
 *  ON PROVENANCE — nothing in this table is invented. Every `from` came from
 *  one of four authoritative sources in the old repo:
 *    - `web.config`                  8 rewrite rules, all `^(en|hi|ar)/.../?$`
 *    - `src/App.tsx` L49-128         20 <Navigate> routes — 6 more than above
 *    - `src/config/seo-routes.json`  the 28 paths that are in the sitemap
 *    - `public/sitemap.xml`          84 indexed URLs (28 paths x 3 locales)
 *
 *  ON §6.2 — that spec block predates the audience-first IA and its targets
 *  point at routes that do not exist (`/products/bgv-smb`, `/products/hellov`,
 *  `/solutions/trade-authorities`, ...). Targets below follow IA §9, which is
 *  newer. Where the two disagree on the hubs — §6.2 sends `/solutions` and
 *  `/products` to the homepage, IA §9 sends them to `/governments` and
 *  `/business` — IA wins: those are real hub pages now, and dumping the
 *  strongest commercial keyword on the site onto `/` throws the signal away.
 */

/** A legacy path and its successor, both written WITHOUT a locale prefix and
 *  without a trailing slash. `"/"` means the locale home. */
export type LegacyRoute = {
  readonly from: string;
  readonly to: string;
  /** Why this row exists. Read by the Part 3 probe when a rule fails. */
  readonly why: string;
};

/** The locales whose URLs are in Google's index today.
 *
 *  NOT the same set as `lib/i18n/routing.ts` — that one is the locales we
 *  SERVE. This one is the locales we are REDEEMING, and the difference is the
 *  whole point: the old sitemap carries 84 URLs across en/hi/ar, so 56 of them
 *  are Hindi and Arabic pages that this site does not have.
 *
 *  Those 56 are consolidated onto their English equivalents rather than left
 *  to 404. It is the lesser of two bad options — it answers a request for
 *  Hindi with English — but the alternative discards two thirds of the indexed
 *  base, and a 404 does not serve a Hindi speaker either. The debt is real and
 *  named: when `hi` ships it has to reclaim URLs that were 308'd away, which
 *  means removing the locale from this list in the same change that adds it to
 *  `routing.ts`.
 */
export const LEGACY_LOCALES: readonly string[] = ["en", "hi", "ar"];

/** Mirror of `routing.ts#routing.locales`. Duplicated rather than imported so
 *  this module stays loadable from `next.config.ts` — and deliberately
 *  compared against `LEGACY_LOCALES` in `unservedLocales()` so the two cannot
 *  drift silently. */
export const SERVED_LOCALES: readonly string[] = ["en"];

/** Where an unprefixed or unserved-locale path lands. */
export const DEFAULT_LOCALE = "en";

/** The old React SPA, which moves to its own host (BUILD-SPEC decision 1:
 *  "Marketing only. Old SPA -> app.helloverify.com").
 *
 *  These are the only cross-host rules on the site. Two of them carry live
 *  state rather than ranking equity — `passwordrecovery` holds a one-time
 *  token in the path, and `PaymentSuccess1` is a payment gateway's return URL,
 *  which is also why every rule here is a 308 rather than a 302: 308 preserves
 *  the request method, so a POSTed payment callback stays a POST.
 *
 *  NOTE — this host must be live before cutover. A 308 is cached by the
 *  browser forever, so shipping these against a host that does not resolve
 *  yet makes them permanently dead for anyone who hits one first. */
export const APP_HOST = "https://app.helloverify.com";

/** Locale-prefixed SPA routes (they lived under `/:lang` in the old App.tsx).
 *  The locale is preserved rather than consolidated onto `en` — the app has
 *  its own locale handling and none of this is indexed (robots.txt disallows
 *  all of it), so there is no consolidation to do. */
export const APP_ROUTES: readonly LegacyRoute[] = [
  { from: "/cart", to: "/cart", why: "App.tsx ProtectedRoute" },
  { from: "/cartlist", to: "/cart", why: "App.tsx LocaleRedirect to /cart" },
  { from: "/orders", to: "/orders", why: "App.tsx ProtectedRoute" },
  { from: "/orders/:path*", to: "/orders/:path*", why: "App.tsx — candidate, smb-candidates, profile-settings" },
  { from: "/profile-settings", to: "/profile-settings", why: "App.tsx ProtectedRoute" },
];

/** SPA routes the old server handled WITHOUT a locale prefix — these were
 *  `<rewrite>` rules in web.config matching `^consumer/...`, not React routes,
 *  so inventing locale-prefixed variants of them would be inventing URLs. */
export const APP_ROUTES_UNPREFIXED: readonly LegacyRoute[] = [
  {
    from: "/consumer/passwordrecovery/:path*",
    to: "/consumer/passwordrecovery/:path*",
    why: "web.config rule Password Recovery Consumer Rewrite Rule — one-time token in the path",
  },
  {
    from: "/consumer/PayUPayment/PaymentSuccess1",
    to: "/consumer/PayUPayment/PaymentSuccess1",
    why: "web.config rule Allow PayUPayment PaymentSuccess1 — payment gateway return URL",
  },
];

export const LEGACY_ROUTES: readonly LegacyRoute[] = [
  // Business
  { from: "/enterprise", to: "/business/enterprise", why: "IA §9 — duplicate of /products/bgv-enterprise, consolidate" },
  { from: "/products/bgv-enterprise", to: "/business/enterprise", why: "IA §9 — same component, two URLs" },
  { from: "/products/bgv-smb", to: "/business/smb", why: "IA §9 — moved under audience hub" },
  { from: "/smb", to: "/business/smb", why: "web.config rule Redirect Obsolete SMB Hub" },
  { from: "/employee-verification", to: "/business/employee-verification", why: "IA §9 — moved under audience hub" },
  { from: "/products/customer-kyc", to: "/business/customer-kyc", why: "IA §9 — moved under audience hub" },
  { from: "/kyc", to: "/business/customer-kyc", why: "web.config rule Redirect Obsolete Kyc Paths" },
  { from: "/products/trust-safety", to: "/business/customer-kyc", why: "web.config rule Redirect Obsolete Kyc Paths" },
  { from: "/products/certifier", to: "/business/certifier", why: "IA §9 — moved under audience hub" },

  // Governments
  { from: "/solutions/health-authorities", to: "/governments/health", why: "IA §9 — moved under audience hub" },
  { from: "/solutions/immigration-authorities", to: "/governments/immigration", why: "IA §9 — moved under audience hub" },
  { from: "/solutions/manpower-and-education-authorities", to: "/governments/manpower-education", why: "IA §9 — shorter, same meaning" },
  {
    from: "/solutions/manpower-and-education-authorities/ministry-of-manpower",
    to: "/governments/manpower-education/ministry-of-manpower",
    why: "IA §9 — deepest indexed URL on the old site",
  },
  { from: "/solutions/trade-authorities", to: "/governments/trade", why: "IA §9 — moved under audience hub" },
  { from: "/solutions/business-trade", to: "/governments/trade", why: "web.config rule Redirect Obsolete Trade Authorities" },

  // Individuals
  { from: "/products/hellov", to: "/individuals/hellov", why: "IA §9 — moved under audience hub" },
  { from: "/consumer", to: "/individuals/hellov", why: "web.config rule Redirect Obsolete Consumer Paths" },
  { from: "/consumer/basic", to: "/individuals/hellov", why: "web.config rule Redirect Obsolete Consumer Paths" },
  { from: "/consumer/premium", to: "/individuals/hellov", why: "web.config rule Redirect Obsolete Consumer Paths" },
  { from: "/premium/consumer-service", to: "/individuals/hellov", why: "web.config rule Redirect Obsolete Consumer Paths" },
  { from: "/products/immigration", to: "/individuals/immigration", why: "IA §9 — moved under audience hub" },
  { from: "/visa-screening", to: "/individuals/immigration", why: "web.config rule Redirect Obsolete Visa Screening" },
  {
    from: "/premium/immigration-applicant",
    to: "/individuals/immigration",
    why: "web.config rule Redirect Obsolete Immigration Applicant; its ?tab=applicant has no equivalent — the new page is not tabbed",
  },

  // Platform
  { from: "/technology", to: "/platform/technology", why: "IA §9 — moved under platform hub" },
  { from: "/international", to: "/platform/coverage", why: "IA §9 — renamed, same subject" },

  // Resources
  { from: "/blog", to: "/resources/blog", why: "IA §9 — blog becomes resources" },

  // The four indexed posts, whose copy did not come across (posts.ts has two
  // unrelated slugs). Each goes to the live page that covers the SAME SUBJECT,
  // not to the blog index: Google treats a redirect to a generic index as a
  // soft 404 and drops the URL, so the index is the option that looks safe and
  // loses the equity. A topically-equivalent target is the one thing that
  // actually consolidates.
  //
  // This is second-best and should be revisited. Porting the posts is strictly
  // better — "Data Privacy Bill compliance" is high-intent commercial search in
  // India and we are giving it to a page that is about our controls rather than
  // about the law. These targets are one line to change once the copy exists.
  { from: "/blog/fir-check-api", to: "/checks/criminal", why: "An FIR check IS the criminal record check — same subject, live page" },
  { from: "/blog/digital-address-verification", to: "/checks/current-address", why: "Same subject, live page" },
  { from: "/blog/data-privacy-bill-penalties", to: "/platform/security-compliance", why: "DPDP Act — nearest live page; port the post to beat this" },
  { from: "/blog/data-privacy-bill-compliance", to: "/platform/security-compliance", why: "DPDP Act — nearest live page; port the post to beat this" },

  // Contact
  { from: "/signup", to: "/contact", why: "App.tsx LocaleRedirect; §6.2" },
  { from: "/support", to: "/contact", why: "web.config rule Redirect Obsolete Contact Paths" },
  { from: "/support/enquiry", to: "/contact", why: "web.config rule Redirect Obsolete Contact Paths" },
  { from: "/premium", to: "/contact", why: "web.config rule Redirect Obsolete Contact Paths" },

  // Hubs
  { from: "/solutions", to: "/governments", why: "IA §9 overrides §6.2's '-> /' — real hub page now" },
  { from: "/products", to: "/business", why: "IA §9 overrides §6.2's '-> /' — real hub page now" },

  // Legal
  { from: "/privacy-policy", to: "/legal/privacy-policy", why: "IA §9 — grouped under /legal" },
  { from: "/cookie-policy", to: "/legal/cookie-policy", why: "IA §9 — grouped under /legal" },
  { from: "/refund-policy", to: "/legal/refund-policy", why: "IA §9 — grouped under /legal" },
  {
    from: "/terms-and-conditions",
    to: "/legal/terms-of-service",
    why: "IA §9 — grouped under /legal AND renamed; same document",
  },
  // These two had no successor until now. Rather than 308 an indexed policy
  // URL into a 404 or onto an unrelated policy, the documents were added to
  // `lib/content/legal.ts` as skeletons with the old pages' own section ids,
  // so the verbatim port is a paste per section.
  { from: "/equal-opportunities", to: "/legal/equal-opportunities", why: "IA §9 — grouped under /legal" },
  { from: "/criminal-convictions-policy", to: "/legal/criminal-convictions-policy", why: "IA §9 — grouped under /legal" },

  // Pages the old site hid behind a redirect to home. Not dead URLs — live
  // routes whose component was withheld pending a client go-live. Keeping
  // their existing behaviour rather than inventing a target.
  { from: "/premium/saudi", to: "/", why: "App.tsx — temporarily hidden, redirect direct access to home" },
  { from: "/premium/health-practitioners", to: "/", why: "App.tsx — temporarily hidden, redirect direct access to home" },
  {
    from: "/solutions/manpower-and-education-authorities/educationae",
    to: "/",
    why: "App.tsx — keep path, redirect direct access to home until Client AE go-live",
  },
];

/** Legacy URLs that are indexed today and have NO correct destination yet.
 *
 *  Deliberately not emitted: each one is a decision, and a 308 into a 404 is
 *  worse than the 404 alone — it burns crawl budget to arrive at the same
 *  place. They are listed rather than deleted so the choice stays visible and
 *  is one line of code away.
 */
export const PENDING_DECISIONS: readonly {
  readonly from: string;
  readonly blockedOn: string;
}[] = [
  {
    from: "/support/track",
    blockedOn:
      "No verification-tracking page exists. The old site already contradicted itself — web.config AND App.tsx both send this to /contact?tab=enquiry, never ?tab=track, so the tracking destination was dead in production already.",
  },
];


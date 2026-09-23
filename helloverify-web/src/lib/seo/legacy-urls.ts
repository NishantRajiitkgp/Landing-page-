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
 *  base, and a 404 does not serve a Hindi speaker either.
 *
 *  THIS LIST NEVER SHRINKS, and the note that used to stand here — "when `hi`
 *  ships it has to be removed from this list in the same change" — was wrong.
 *  Traced through `./redirects` with `hi` in BOTH lists:
 *  `destinationLocaleFor("hi")` returns `"hi"`, so `/hi/technology` 308s to
 *  `/hi/platform/technology`, which is the RIGHT answer and a better one than
 *  deleting the row (that hands an indexed URL a 404); and `unservedLocales()`
 *  already filters `hi` out of the `/hi/:path*` catch-all. So this is a
 *  historical fact about Google's index, it is append-only, and the only list
 *  that has to move in lockstep with `routing.ts` is `SERVED_LOCALES` below.
 *  Asserted by running the real emitter over a served `["en","hi","ar"]` in
 *  `tools/test/locales.test.ts`, not by reading the code again.
 */
export const LEGACY_LOCALES: readonly string[] = ["en", "hi", "ar"];

/** Mirror of `routing.ts#routing.locales`. Duplicated rather than imported so
 *  this module stays loadable from `next.config.ts`, where `@/` does not
 *  resolve. Checked against the original by `localeContractDrift()` below —
 *  the previous version of this comment claimed `unservedLocales()` kept the
 *  two from drifting, which was false: that function compares this list to
 *  `LEGACY_LOCALES` and never sees `routing.locales` at all. */
export const SERVED_LOCALES: readonly string[] = ["en"];

/** Where an unprefixed or unserved-locale path lands. Mirror of
 *  `routing.ts#routing.defaultLocale`, same reason, same guard. */
export const DEFAULT_LOCALE = "en";

/** Has the mirror above drifted from the list it mirrors?
 *
 *  Returns one string per disagreement and an empty array when the contract
 *  holds. `lib/seo/canonical.ts` calls it at module load and throws, so an
 *  inconsistent state fails `next build`; the call cannot live in this file
 *  because this file must not import `routing.ts` (see the note above).
 *
 *  WHAT IT DEFENDS, read off `./redirects`: `legacyRedirects()` emits
 *  `/${l}/:path*` -> `/${DEFAULT_LOCALE}/:path*` for every locale in
 *  `LEGACY_LOCALES` that is NOT in `SERVED_LOCALES`. Declare `hi` in
 *  `routing.locales` alone and all 56 Hindi pages prerender, carry the right
 *  canonical, appear in the sitemap — and every one of them 308s to its
 *  English equivalent, permanently, because a 308 is cached by the browser
 *  forever. Nothing in the build output can see it. `probe:redirects` can, and
 *  it needs a running server, so it is the wrong gate for a mistake this
 *  cheap to make.
 *
 *  REJECTED — a comment saying "remember to edit both". That is what the
 *  previous version of this file had, in three places, and it is what left the
 *  `unservedLocales()` claim above standing while it was false.
 *
 *  REJECTED — deriving `SERVED_LOCALES` from `routing.locales`. That is the
 *  import this module exists to avoid: `next.config.ts` loads outside the app
 *  graph, so `@/` does not resolve and `next-intl/routing` would be pulled
 *  into the config load. The duplication is deliberate; only the silence
 *  about it was the defect.
 *
 *  BOTH SIDES ARE PARAMETERS, with this module's own constants as defaults.
 *  The call site passes two arguments and reads as if the other two were
 *  closed over; the test passes four. That is not a convenience — a guard
 *  that closes over the value it checks can only ever be exercised by editing
 *  the file it defends, which means it is exercised once and never again.
 *  `tools/test/locales.test.ts` drives seven drifted states through it.
 */
export function localeContractDrift(
  routingLocales: readonly string[],
  routingDefaultLocale: string,
  servedLocales: readonly string[] = SERVED_LOCALES,
  legacyDefaultLocale: string = DEFAULT_LOCALE,
): readonly string[] {
  const problems: string[] = [];

  /** Sequence equality, not set equality. `SERVED_LOCALES` is a copy of
   *  `routing.locales`, and requiring the same ORDER keeps "is this still a
   *  copy?" a one-line diff for a reviewer. Reordering changes no behaviour —
   *  every use is `.includes()` — so the stricter rule costs one more line in
   *  an edit that is already touching both files. */
  if (
    servedLocales.length !== routingLocales.length ||
    servedLocales.some((l, i) => l !== routingLocales[i])
  ) {
    problems.push(
      `SERVED_LOCALES ${JSON.stringify(servedLocales)} != routing.locales ` +
        `${JSON.stringify(routingLocales)} — a locale served but not mirrored here ` +
        `is 308'd onto ${JSON.stringify(legacyDefaultLocale)} by the legacy catch-all; ` +
        `a locale mirrored here but not served points legacy 308s at a 404.`,
    );
  }

  if (legacyDefaultLocale !== routingDefaultLocale) {
    problems.push(
      `DEFAULT_LOCALE ${JSON.stringify(legacyDefaultLocale)} != routing.defaultLocale ` +
        `${JSON.stringify(routingDefaultLocale)} — every unserved-locale redirect ` +
        `would land in a different locale from the one the proxy negotiates to.`,
    );
  }

  if (!routingLocales.includes(routingDefaultLocale)) {
    problems.push(
      `routing.defaultLocale ${JSON.stringify(routingDefaultLocale)} is not in ` +
        `routing.locales ${JSON.stringify(routingLocales)} — x-default and every ` +
        `legacy destination would point at a locale with no pages.`,
    );
  }

  return problems;
}

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

  // The four indexed posts, now pointing at THE ARTICLE rather than at the
  // nearest live page on the same subject. This block previously read "this is
  // second-best and should be revisited — porting the posts is strictly
  // better", and the copy was ported on 22 Sep 2026 (see the provenance note
  // in `lib/content/posts.ts`): 2,490–4,009 characters of body each, out of
  // the old repo's `src/i18n/en.json` and `src/pages/blog/*.tsx`. A crawler
  // asking for an article now gets that article, not a product page.
  //
  // THESE ROWS STAY, and deleting them would be the mistake. The ported post
  // does not live at `/blog/<slug>` — it lives at `/resources/blog/<slug>`,
  // because IA §9 moved the whole blog under `/resources` (the `/blog` row
  // above is the same move for the index). So there is no self-redirect to
  // avoid here: removing a row would hand four URLs that Google holds today a
  // 404, which is strictly worse than the subject-based 308 it replaces.
  //
  // One consequence worth stating: this is the only place on the site where a
  // legacy 308 lands on a page whose content came from the SAME old URL. If a
  // post is ever unpublished, its row here has to move back to a subject
  // target in the same change, or `probe:redirects` reports a 308 into a 404.
  { from: "/blog/fir-check-api", to: "/resources/blog/fir-check-api", why: "Post ported — same slug under the /resources IA" },
  { from: "/blog/digital-address-verification", to: "/resources/blog/digital-address-verification", why: "Post ported — same slug under the /resources IA" },
  { from: "/blog/data-privacy-bill-penalties", to: "/resources/blog/data-privacy-bill-penalties", why: "Post ported — same slug under the /resources IA" },
  { from: "/blog/data-privacy-bill-compliance", to: "/resources/blog/data-privacy-bill-compliance", why: "Post ported — same slug under the /resources IA" },

  // Contact
  { from: "/signup", to: "/contact", why: "App.tsx LocaleRedirect; §6.2" },
  { from: "/support", to: "/contact", why: "web.config rule Redirect Obsolete Contact Paths" },
  { from: "/support/enquiry", to: "/contact", why: "web.config rule Redirect Obsolete Contact Paths" },
  {
    from: "/support/track",
    to: "/contact",
    why:
      "web.config rule Redirect Obsolete Contact Paths matched `support/track` and sent it to " +
      "?tab=enquiry with appendQueryString=false; App.tsx L80 sends it to the same place. The " +
      "?tab=track destination was unreachable from this URL in production, so nothing is lost.",
  },
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
 *
 *  EMPTY, and the type stays so the next one has a home.
 *
 *  `/support/track` was the last entry and it is closed, not deleted. The
 *  blocker recorded here was "no verification-tracking page exists", which is
 *  true and turned out to be irrelevant: the old site did not send this URL to
 *  a tracking page either. Both authorities agree, and they are the only two
 *  that ever ran — `web.config`'s "Redirect Obsolete Contact Paths" matches
 *  `^(en|hi|ar)/(signup|premium|support|support/enquiry|support/track)/?$` and
 *  redirects to `/{R:1}/contact?tab=enquiry` with `appendQueryString="false"`,
 *  and `src/App.tsx` L80 renders `<LocaleRedirect to="/contact?tab=enquiry"/>`.
 *  Neither ever emitted `?tab=track`.
 *
 *  The tracking tab was real — `ContactUsUnified.tsx` L738-L879 has an
 *  `'enquiry' | 'track'` tab pair — but it was reachable only from
 *  `/contact?tab=track`, never from `/support/track`. So there is no
 *  destination to invent: this URL's production behaviour was "go to the
 *  contact page", the new contact page is not tabbed (same reason the
 *  `/premium/immigration-applicant` row drops its `?tab=applicant`), and the
 *  row above states exactly that. Closed 23 Sep 2026.
 */
export const PENDING_DECISIONS: readonly {
  readonly from: string;
  readonly blockedOn: string;
}[] = [];


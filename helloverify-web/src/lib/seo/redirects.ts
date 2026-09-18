/** Turning the legacy URL table into Next redirect rules.
 *
 *  Split from `./legacy-urls` (the data) so neither file outgrows BUILD-SPEC
 *  §4 rule 2's 300 lines. The data is the part people review; this is the part
 *  that has to be right about Next's matching order.
 *
 *  Like its data module this imports nothing outside `./legacy-urls`, because
 *  `next.config.ts` loads it from outside the app graph.
 */
import {
  APP_HOST,
  APP_ROUTES,
  APP_ROUTES_UNPREFIXED,
  DEFAULT_LOCALE,
  LEGACY_LOCALES,
  LEGACY_ROUTES,
  SERVED_LOCALES,
} from "./legacy-urls";

export type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

/** Legacy locales we do not serve. Each needs a catch-all onto the default
 *  locale for the pages that did NOT move — `/hi/about` has no entry in
 *  `LEGACY_ROUTES` because `/about` never changed, but it is still an indexed
 *  URL with no page behind it. */
function unservedLocales(): string[] {
  return LEGACY_LOCALES.filter((l) => !SERVED_LOCALES.includes(l));
}

/** `"/about"` + `"en"` -> `"/en/about"`; `"/"` -> `"/en"`.
 *
 *  The root case is load-bearing: `/en/` would 308 again under
 *  `trailingSlash: false`, turning a one-hop redirect into a chain. Same rule
 *  as `lib/i18n/href.ts#localise`, reimplemented rather than imported so this
 *  module stays loadable from `next.config.ts`.
 */
function withLocale(locale: string, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** An indexed locale we serve keeps its own prefix; one we do not serve is
 *  consolidated onto the default. */
function destinationLocaleFor(locale: string): string {
  return SERVED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

/** Every legacy rule, in match order. Next takes the FIRST match, so the
 *  specific `.../index.html` rules must precede the generic strip.
 *
 *  ON ORDER AND THE PROXY — `next.config` redirects run at step 2 of Next 16's
 *  pipeline and the proxy at step 3 (node_modules/next/dist/docs, proxy.md
 *  "Execution order"), so every rule here fires BEFORE locale negotiation.
 *  Three consequences, all of which this function exists to handle, because
 *  getting any of them wrong produces the redirect chains §6.1 forbids:
 *
 *   1. Destinations are locale-prefixed. An unprefixed destination would 308
 *      here and then 307 again in the proxy.
 *   2. Unprefixed SOURCES are declared explicitly. Bare `/smb` matches nothing
 *      otherwise, so the proxy 307s it to `/en/smb` and only then does the
 *      legacy 308 fire — two hops. These are backlink and typed traffic only
 *      (the old site never served an unprefixed URL canonically), so pinning
 *      them to the default locale costs nothing that a dead URL can lose.
 *   3. `.../index.html` is generated PER RULE, not stripped generically. AUDIT
 *      A2 means all 84 sitemap URLs are indexed in their `/index.html` form
 *      too, and `/en/smb/index.html` -> `/en/smb` -> `/en/business/smb` would
 *      be a chain on exactly the URLs Google already holds.
 */
export function legacyRedirects(): RedirectRule[] {
  const rules: RedirectRule[] = [];

  /** The SPA leaves the site entirely. First, because these are the most
   *  specific sources on the list — `/en/orders/:path*` must be matched before
   *  the `/hi/:path*` style catch-alls further down, and `/consumer/…` before
   *  anything generic. */
  for (const locale of LEGACY_LOCALES) {
    for (const { from, to } of APP_ROUTES) {
      rules.push({
        source: withLocale(locale, from),
        destination: `${APP_HOST}${withLocale(locale, to)}`,
        permanent: true,
      });
    }
  }
  for (const { from, to } of APP_ROUTES_UNPREFIXED) {
    rules.push({ source: from, destination: `${APP_HOST}${to}`, permanent: true });
  }

  /** Every legacy path, in every indexed locale.
   *
   *  The destination locale is NOT the source locale: `/hi/technology` lands on
   *  `/en/platform/technology`, because `/hi/platform/technology` does not
   *  exist. Consolidating in one hop is the point — routing it to a Hindi URL
   *  that 404s would be worse than not redirecting at all. */
  for (const locale of LEGACY_LOCALES) {
    for (const { from, to } of LEGACY_ROUTES) {
      const destination = withLocale(destinationLocaleFor(locale), to);
      const source = withLocale(locale, from);
      rules.push({ source: `${source}/index.html`, destination, permanent: true });
      rules.push({ source, destination, permanent: true });
    }
  }

  for (const { from, to } of LEGACY_ROUTES) {
    const destination = withLocale(DEFAULT_LOCALE, to);
    rules.push({ source: `${from}/index.html`, destination, permanent: true });
    rules.push({ source: from, destination, permanent: true });
  }

  /** Root `/index.html` is the ONE deliberate two-hop on the site: it lands on
   *  `/`, which the proxy then negotiates to `/en` with a 307. Sending it
   *  straight to `/en` would be one hop but would permanently cache one
   *  visitor's language for everybody — the exact reason §6.1 makes `/` a 307
   *  rather than a 308. One extra hop on one URL is the cheaper error.
   *
   *  It must precede the generic rule below, which would otherwise match it. */
  rules.push({ source: "/index.html", destination: "/", permanent: true });

  /** Pages that did NOT move, in a locale we no longer serve.
   *
   *  `/hi/about` is an indexed URL with no entry in `LEGACY_ROUTES` — `/about`
   *  never changed, so there was nothing to remap — and with no page behind it
   *  either. Without this it 307s to `/en/hi/about` (next-intl reads `hi` as a
   *  path segment, not a locale) and 404s two hops later on a nonsense URL.
   *
   *  Ordering is load-bearing in both directions: this must come AFTER the
   *  specific rules above, so `/hi/technology` reaches
   *  `/en/platform/technology` rather than a dead `/en/technology`, and BEFORE
   *  the generic `/index.html` strip below, which would otherwise turn
   *  `/hi/about/index.html` into a three-hop path to a 404. */
  for (const locale of unservedLocales()) {
    // Both exact forms first: `/:path*` with an empty match would produce
    // `/en/`, and that trailing slash is another hop.
    rules.push({ source: `/${locale}/index.html`, destination: `/${DEFAULT_LOCALE}`, permanent: true });
    rules.push({ source: `/${locale}`, destination: `/${DEFAULT_LOCALE}`, permanent: true });
    rules.push({
      source: `/${locale}/:path*/index.html`,
      destination: `/${DEFAULT_LOCALE}/:path*`,
      permanent: true,
    });
    rules.push({ source: `/${locale}/:path*`, destination: `/${DEFAULT_LOCALE}/:path*`, permanent: true });
  }

  /** Every REMAINING `/index.html` — the live pages that simply did not move
   *  (`/en/about`, `/en/contact`) plus anything the old site served that this
   *  table has not enumerated. §6.2's "additional required redirect". */
  rules.push({ source: "/:path*/index.html", destination: "/:path*", permanent: true });

  return rules;
}

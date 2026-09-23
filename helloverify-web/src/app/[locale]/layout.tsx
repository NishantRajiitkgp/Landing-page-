/** Root layout. It lives under [locale] rather than at app/ because every URL
 *  carries its locale (BUILD-SPEC §6.1, §7) — there is no unprefixed page for a
 *  layout above this one to wrap. Next treats the topmost layout it finds as the
 *  root, so this is the only place <html> and <body> are rendered.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { directionOf, openGraphLocales, routing } from "@/lib/i18n/routing";
import { Analytics } from "@/components/analytics/Analytics";
import { ConsentBanner, ConsentSettings } from "@/components/chrome/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION, WEBSITE } from "@/lib/seo/schema/organization";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo/site";
import { ROOT } from "@/lib/copy/root";
import { copy } from "@/lib/copy/request";
import "../globals.css";

/** SELF-HOSTED AND SUBSET, not `next/font/google` (BUILD-SPEC §9.3).
 *
 *  §9.3 asks for "`next/font/local` with self-hosted variable WOFF2, subset to
 *  the glyphs actually used per script". The files come from
 *  `npm run build:fonts` (`tools/perf/subset-fonts.mjs`), which takes a census
 *  of every character the 56 prerendered pages emit and cuts the faces down to
 *  it.
 *
 *  Measured, homepage font transfer: **324.1 KB -> 241.9 KB**, a 25% cut, with
 *  no change to the type itself. The §9.1 budget is 60 KB and this does NOT
 *  reach it — see the note in `tools/perf/check-budgets.mjs` for the full
 *  measured curve and why closing the rest needs a design decision rather than
 *  a build step.
 *
 *  BOTH VARIABLE AXES SURVIVE. Newsreader carries `wght` 200-800 and `opsz`,
 *  and the canvas depends on the latter: the serif runs from 15px captions to a
 *  176px display number, so `font-optical-sizing: auto` is doing real work
 *  across that range. harfbuzz keeps the axes through a subset — only glyphs
 *  are removed — so this is byte-smaller, not visually different.
 *
 *  Self-hosting also removes the last third-party origin from the critical path
 *  (§9.4), though `next/font/google` had already inlined these at build time,
 *  so that part was already true.
 */
const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  /** `weight` is the RANGE the variable axis covers, not a static instance;
   *  `next/font/local` passes it through to `font-weight` in the `@font-face`,
   *  which is how a browser knows it may interpolate. */
  src: [
    { path: "../../fonts/newsreader-roman.woff2", weight: "200 800", style: "normal" },
    { path: "../../fonts/newsreader-italic.woff2", weight: "200 800", style: "italic" },
  ],
});

const instrumentSans = localFont({
  variable: "--font-instrument",
  display: "swap",
  src: [{ path: "../../fonts/instrument-sans.woff2", weight: "400 700", style: "normal" }],
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [{ path: "../../fonts/geist-mono.woff2", weight: "400 500", style: "normal" }],
});

/** WAS a static `metadata` export, and had to stop being one (BUILD-SPEC §8.1,
 *  §7).
 *
 *  The object below is per-locale data — `og:locale` names the language of the
 *  document — and a static export cannot see which locale it is rendering. It
 *  therefore said `"en"`, which is right for as long as `routing.locales` is
 *  `["en"]` and wrong on the first `/hi` page: a Hindi document declaring
 *  itself English to every scraper that reads Open Graph. This layout sits
 *  under `[locale]`, so `generateMetadata` gets the answer from `params` for
 *  free (`node_modules/next/dist/docs/.../generate-metadata.md`: params run
 *  "from the root segment down to the segment generateMetadata is called
 *  from").
 *
 *  THE GENERATED OG CARD SURVIVES THE CONVERSION, which is the thing worth
 *  checking rather than assuming, because `lib/seo/metadata.ts` has a long note
 *  on how easily `og:image` disappears. It is attached by
 *  `next/dist/lib/metadata/resolve-metadata.js#mergeStaticMetadata`, which
 *  fires on `openGraph && !source.openGraph.hasOwnProperty("images")` — a
 *  condition about the OBJECT, not about how it was exported.
 *  `collectMetadata` (same file, L415) resolves `staticFilesMetadata` from the
 *  segment's file tree and `getDefinedMetadata` (L363) accepts either export
 *  shape, so `opengraph-image.tsx` in this folder still attaches. This function
 *  sets no `images`, exactly as the static object did not.
 *
 *  `params` is always a served locale here: `dynamicParams = false` below
 *  closes the set to what `generateStaticParams` returns, which is
 *  `routing.locales` itself. Verified against the build output rather than
 *  argued — `.next/server/app/_not-found.html` renders `<html>` with no `lang`,
 *  so Next's own error documents do NOT pass through this layout and there is
 *  no call with an absent locale to defend against.
 *
 *  EMITTED OUTPUT IS UNCHANGED FOR `en`. `openGraphLocales("en")` returns
 *  `{ locale: "en", alternateLocale: [] }`, and Next emits no tag for an empty
 *  `alternateLocale`. The diff is what happens NEXT: `/hi` gets
 *  `og:locale=hi` plus `og:locale:alternate` for `en` and `ar`, with no edit
 *  here.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    /** Every relative URL in any page's metadata resolves against this — the OG
     *  image, and the OG card's own URL. Without it Next emits a relative
     *  `og:image`, which scrapers reject outright. The canonical and hreflang
     *  hrefs do not rely on it: `lib/seo/metadata.ts` builds them absolute from
     *  the same `absoluteUrl()` the sitemap uses, so the two are comparable as
     *  plain strings rather than after Next's resolution.
     *  One origin constant for the whole site so the canonical tag, the sitemap
     *  entry and the hreflang entry cannot disagree (§6.1). */
    metadataBase: new URL(SITE_URL),

    /** NO `template` here, deliberately. §8.1 would have page titles supply only
     *  their own half and let a `%s — HelloVerify` template add the brand — which
     *  is the better structure, and is not what this codebase does: all 32 pages
     *  already carry "— HelloVerify" in their own reviewed title, so a template
     *  renders "About HelloVerify — HelloVerify" (measured, not assumed).
     *
     *  Converting to a template means re-writing 32 reviewed copy strings, and
     *  three of them do not mechanically strip: "Certifier by HelloVerify" and
     *  "HelloV by HelloVerify" carry the brand inside a product name, and
     *  "The HelloVerify platform …" carries it mid-sentence with no suffix at
     *  all. That is a copy review, not a refactor, so it is not being done as a
     *  side effect of adding a sitemap. */
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,

    /** NO `alternates` here, deliberately. Canonical and hreflang are per-page,
     *  via `lib/seo/metadata.ts`.
     *
     *  The reason is narrower than it looks, and was measured rather than
     *  reasoned: adding `alternates: { canonical: "/en" }` here changes nothing
     *  in the emitted HTML today. All 32 pages define their own `alternates`,
     *  which REPLACES the parent's (Next merges metadata shallowly), and
     *  `/_not-found` and `/_global-error` emit no canonical either way.
     *
     *  What it would do is worse than visible breakage: it would silently supply
     *  `/en` as the canonical for any FUTURE page that forgets to call
     *  `pageMetadata`. That page would then claim to be a duplicate of the
     *  homepage — and it would pass the "every page has exactly one canonical"
     *  check in `tools/seo/check-sitemap.mjs`, because it would have one. An
     *  inherited canonical does not fix a missing canonical, it hides it. */

    /** Site-wide social defaults. `opengraph-image.tsx` in this segment is picked
     *  up automatically, so `images` is deliberately not set here — declaring it
     *  would override the generated card with whatever was hardcoded, which is
     *  precisely the old site's failure: default OG tags pinned to the homepage
     *  in `index.html`, overridden client-side per route, so any scraper that
     *  does not run JS got homepage metadata on every page. */
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      ...openGraphLocales(locale),
    },
    twitter: { card: "summary_large_image" },

    /** Dropped deliberately: `<meta name="keywords">`, which the old site still
     *  carried. Ignored by every search engine since ~2009 (§8.1). */
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** An unknown locale is a 404, never a soft 200 rendering the default language
 *  (BUILD-SPEC §7). A page that answers 200 for /xx/about is a page search
 *  engines will index under every typo anyone ever links. */
export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts this subtree into static rendering: without it next-intl resolves
  // the locale from request headers, which makes every route dynamic.
  setRequestLocale(locale);
  // AFTER `setRequestLocale`, not before: `copy()` awaits next-intl's
  // `getLocale()`, which reads request headers — and so makes this subtree
  // dynamic — unless the static locale is already set. Same ordering
  // constraint every page in this tree documents.
  const t = await copy(ROOT);

  return (
    <html
      lang={locale}
      dir={directionOf(locale)}
      className={`${newsreader.variable} ${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body>
        {/* WCAG 2.4.1. First focusable element on every page, visible only
            when focused. Targets #main-content, which `PageShell` puts on
            its <main> and the homepage puts on its own. */}
        <a className="skip-link" href="#main-content">
          {t.skipToContent}
        </a>
        {/* The consent bar, in flow, directly after the bypass link — so the
            tab order is skip link, consent, nav. It carries its own inline
            boot script, which must be parsed before the bar it governs; see
            the file. Costs 0.0 KB of `/_next/static` script. */}
        <ConsentBanner locale={locale} />
        {/* The entity graph's root, emitted once per page from two module
            constants (BUILD-SPEC §8.2, §11a.3). It lives in the layout rather
            than in any page precisely because §11a.3 requires the Organization
            block to be BYTE-IDENTICAL everywhere: one render site, no
            per-page parameters, nothing to keep in sync.
            `check-schema.mjs` string-compares the emitted block across all 56
            pages rather than trusting that argument. */}
        <JsonLd data={ORGANIZATION} />
        <JsonLd data={WEBSITE} />
        {/* No NextIntlClientProvider: nothing on this site calls a next-intl
            hook from a Client Component yet, and mounting the provider ships
            the client runtime plus the message catalogue to every visitor for
            nothing. Measured at 11.3 KB brotli on a page already over the
            §9.1 budget. Add it back the moment a Client Component needs
            translations — and scope it to that subtree, not the root. */}
        {children}
        {/* "Cookie preferences", below the footer, visible only once a choice
            exists. The copy promises it IN the footer; `SiteFooter.tsx` is
            being edited concurrently, so it is a strip of its own for now and
            `href="#cookie-settings"` already works from anywhere. */}
        <ConsentSettings />
        {/* GA4, and it renders NOTHING unless NEXT_PUBLIC_GA_MEASUREMENT_ID is
            set at build time — no script, no request, no cookie. See the file:
            the id is the small half of turning it on, and the cookie policy
            and a consent banner are the other half. */}
        <Analytics />
      </body>
    </html>
  );
}

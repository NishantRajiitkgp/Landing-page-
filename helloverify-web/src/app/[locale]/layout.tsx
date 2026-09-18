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

import { directionOf, routing } from "@/lib/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION, WEBSITE } from "@/lib/seo/schema/organization";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo/site";
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

export const metadata: Metadata = {
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
    locale: "en",
  },
  twitter: { card: "summary_large_image" },

  /** Dropped deliberately: `<meta name="keywords">`, which the old site still
   *  carried. Ignored by every search engine since ~2009 (§8.1). */
};

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
          Skip to main content
        </a>
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
      </body>
    </html>
  );
}

/** Root layout. It lives under [locale] rather than at app/ because every URL
 *  carries its locale (BUILD-SPEC §6.1, §7) — there is no unprefixed page for a
 *  layout above this one to wrap. Next treats the topmost layout it finds as the
 *  root, so this is the only place <html> and <body> are rendered.
 */
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { directionOf, openGraphLocales, routing, scriptStackOf } from "@/lib/i18n/routing";
import { Analytics } from "@/components/analytics/Analytics";
import { ConsentBanner } from "@/components/chrome/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION, WEBSITE } from "@/lib/seo/schema/organization";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { copyFor } from "@/lib/seo/copy";
import { ROOT } from "@/lib/copy/root";
import { ACCOUNT } from "@/lib/copy/account";
import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";
import { AuthPortal } from "@/components/auth/AuthPortal";
import {
  geistMono,
  instrumentSans,
  newsreader,
  notoNaskh,
  notoSansArab,
  notoSansDeva,
  notoSerifDeva,
} from "./fonts";
import "../globals.css";

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
    title: copyFor("/", locale).title,
    description: copyFor("/", locale).description,

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
  const login = (await copy(CHROME)).login;
  const checkout = (await copy(ACCOUNT)).checkout;
  const script = scriptStackOf(locale);
  const scriptVars =
    script === "deva"
      ? `${notoSansDeva.variable} ${notoSerifDeva.variable}`
      : script === "arab"
        ? `${notoSansArab.variable} ${notoNaskh.variable}`
        : "";

  return (
    // The consent boot script writes `data-hv-consent` here before hydration.
    <html
      lang={locale}
      dir={directionOf(locale)}
      className={`${newsreader.variable} ${instrumentSans.variable} ${geistMono.variable}${scriptVars ? ` ${scriptVars}` : ""}`}
      suppressHydrationWarning
    >
      <body>
        {/* WCAG 2.4.1. First focusable element on every page, visible only
            when focused. Targets #main-content, which `PageShell` puts on
            its <main> and the homepage puts on its own. */}
        <a className="skip-link" href="#main-content">
          {t.skipToContent}
        </a>
        {/* The consent bar, fixed to the viewport bottom but directly after
            the bypass link in source — so the tab order is skip link, consent,
            nav. It carries its own inline
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
        {/* No NextIntlClientProvider: auth copy is passed as props. A next-intl
            client provider would ship the runtime plus the message catalogue
            to every visitor. AuthPortal is the client boundary for OTP login.
            `/landing-page` has its own layout and does not mount this. */}
        <AuthPortal login={login} checkout={checkout} locale={locale}>
          {children}
        </AuthPortal>
        {/* GA4, and it renders NOTHING unless NEXT_PUBLIC_GA_MEASUREMENT_ID is
            set at build time — no script, no request, no cookie. See the file:
            the id is the small half of turning it on, and the cookie policy
            and a consent banner are the other half. */}
        <Analytics />
      </body>
    </html>
  );
}

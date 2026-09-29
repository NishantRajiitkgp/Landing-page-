/** FROZEN SNAPSHOT of the homepage — its own root layout, deliberately.
 *
 *  `/landing-page` keeps the homepage exactly as it stood on 28 Sep 2026
 *  (commit 187daec plus the uncommitted Enterprises edits of that day) while
 *  the live homepage at `/en` is reworked. Every section, its copy, its CSS and
 *  its photographs are copies under `src/snapshot/landing-page/` and
 *  `public/snapshot-landing-page/`, so editing the live ones cannot reach it.
 *
 *  A separate ROOT layout rather than a page under `[locale]`: the frozen CSS
 *  uses the same class names as the live CSS, and two root layouts force a
 *  full page load when navigating between them, so the two stylesheets are
 *  never on one document. `proxy.ts` excludes this path from locale
 *  negotiation. Not indexed, not in the sitemap.
 *
 *  To drop the snapshot: delete this folder, `src/snapshot/landing-page/`,
 *  `public/snapshot-landing-page/` and the `landing-page` exclusion in
 *  `proxy.ts`. See `src/snapshot/landing-page/README.md`.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/lib/i18n/routing";
import { ConsentBanner, ConsentSettings } from "@/snapshot/landing-page/components/chrome/ConsentBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORGANIZATION, WEBSITE } from "@/lib/seo/schema/organization";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/seo/site";
import { ROOT } from "@/snapshot/landing-page/lib/copy/root";
import { copy } from "@/lib/copy/request";
import "@/snapshot/landing-page/app/globals.css";

const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  src: [
    { path: "../../fonts/newsreader-roman.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/newsreader-italic.woff2", weight: "400", style: "italic" },
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
  metadataBase: new URL(SITE_URL),
  title: `Snapshot · ${SITE_TITLE}`,
  description: SITE_DESCRIPTION,
  /** A frozen internal copy of the homepage — never a search result. */
  robots: { index: false, follow: false },
};

const LOCALE = routing.defaultLocale;

export default async function LandingPageSnapshotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No `[locale]` segment here, so the locale is set by hand; same ordering
  // constraint as `app/[locale]/layout.tsx` — before `copy()`.
  setRequestLocale(LOCALE);
  const t = await copy(ROOT);

  return (
    <html
      lang={LOCALE}
      dir="ltr"
      className={`${newsreader.variable} ${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          {t.skipToContent}
        </a>
        <ConsentBanner locale={LOCALE} />
        <JsonLd data={ORGANIZATION} />
        <JsonLd data={WEBSITE} />
        {children}
        <ConsentSettings />
        {/* No <Analytics />: a frozen internal copy must not count as traffic. */}
      </body>
    </html>
  );
}

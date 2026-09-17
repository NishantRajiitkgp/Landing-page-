/** Root layout. It lives under [locale] rather than at app/ because every URL
 *  carries its locale (BUILD-SPEC §6.1, §7) — there is no unprefixed page for a
 *  layout above this one to wrap. Next treats the topmost layout it finds as the
 *  root, so this is the only place <html> and <body> are rendered.
 */
import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, Geist_Mono } from "next/font/google";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { directionOf, routing } from "@/lib/i18n/routing";
import "../globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  // Newsreader is variable on the optical-size axis; the canvas relies on it
  // (the 112px hero sets far wider letterforms than the default 14pt master).
  axes: ["opsz"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelloVerify — Verified at the source, in minutes",
  description:
    "AI reads the documents. Our team confirms with the issuer — the university, the employer, the registry. You get an answer in as little as 15 minutes.",
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

import { SiteNav } from "@/components/chrome/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { PeopleStrip } from "@/components/sections/PeopleStrip";
import { Demo2 } from "@/components/sections/Demo2";
import { Numbers } from "@/components/sections/Numbers";
import { Presence } from "@/components/sections/Presence";
import { Why } from "@/components/sections/Why";
import { Checks } from "@/components/sections/Checks";
import { Packages } from "@/components/sections/Packages";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhoItsFor } from "@/components/sections/WhoItsFor";
import { International } from "@/components/sections/International";
import { Consumer } from "@/components/sections/Consumer";
import { CustomerStory } from "@/components/sections/CustomerStory";
import { Compliance } from "@/components/sections/Compliance";
import { Contact } from "@/components/sections/Contact";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
// Homepage v2's stylesheet is imported HERE, not in `globals.css`, so only
// this route downloads it. Measured: from globals it put `/en/about` at
// 16.1 KB of CSS against `check-budgets.mjs`'s 16 KB ceiling — every page
// paying for a hero it does not render. Imported after the root layout's
// `globals.css`, so it still follows `design.css` and wins on equal
// specificity.
import "../v2.css";

/** The homepage inherited its title and description from the root layout and
 *  needed no export of its own — until §8.1, because a canonical cannot be
 *  inherited: a layout-level `alternates` would stamp `/en` onto all 32 pages.
 *  The copy is the same constant the layout uses, not a second literal. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/");
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);

  return (
    <div className="page">
      <SiteNav />
      {/* The homepage does not use PageShell, so it carries its own <main>.
          Without it this is the one page of 56 with no main landmark, and the
          site-wide skip link has nothing to skip to (WCAG 2.4.1, 1.3.1). */}
      <main id="main-content">
        <Hero />
        <PeopleStrip />
        <Demo2 />
        <Numbers />
        <Presence />
        <Why />
        <Checks />
        <Packages />
        <HowItWorks />
        <WhoItsFor />
        <International />
        <Consumer />
        <CustomerStory />
        <Compliance />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

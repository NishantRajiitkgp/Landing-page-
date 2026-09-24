import { SiteNav } from "@/components/chrome/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { PeopleStrip } from "@/components/sections/PeopleStrip";
import { OneInEight } from "@/components/sections/OneInEight";
import { HowWeKnow } from "@/components/sections/HowWeKnow";
import { Demo2 } from "@/components/sections/Demo2";
import { Numbers } from "@/components/sections/Numbers";
import { Presence } from "@/components/sections/Presence";
import { GovSeals } from "@/components/sections/GovSeals";
import { GovDossiers } from "@/components/sections/GovDossiers";
import { Why } from "@/components/sections/Why";
import { Checks } from "@/components/sections/Checks";
import { Packages } from "@/components/sections/Packages";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhoItsFor } from "@/components/sections/WhoItsFor";
import { Enterprises } from "@/components/sections/Enterprises";
import { Smb } from "@/components/sections/Smb";
import { Diligence } from "@/components/sections/Diligence";
import { International } from "@/components/sections/International";
import { Consumer } from "@/components/sections/Consumer";
import { CustomerStory } from "@/components/sections/CustomerStory";
import { TrustPlatform } from "@/components/sections/TrustPlatform";
import { Compliance } from "@/components/sections/Compliance";
import { Contact } from "@/components/sections/Contact";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

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
        <OneInEight />
        <HowWeKnow />
        {/* Homepage v2 is desktop-first (TASKS.md Part 12). Three bands the
            v2 desktop no longer shows stay on the phone, wrapped in `.mob`,
            until the v2 phone pass: Demo2 and HowItWorks (both folded into
            HowWeKnow) and WhoItsFor (its audiences now have their own bands —
            GovSeals/GovDossiers, Enterprises, Smb, Diligence, Consumer).
            The `.mob` here is their ONLY breakpoint switch: HowItWorks and
            WhoItsFor render just their phone tree now, having carried a
            never-shown `.dsk` copy into the HTML and the flight payload
            (Sep 2026 perf pass). Demo2 is one tree at both widths. */}
        <div className="mob">
          <Demo2 />
        </div>
        <Numbers />
        <Presence />
        <GovSeals />
        <GovDossiers />
        <Why />
        <Checks />
        <Packages />
        <div className="mob">
          <HowItWorks />
        </div>
        <div className="mob">
          <WhoItsFor />
        </div>
        <Enterprises />
        <Smb />
        <Diligence />
        <International />
        <Consumer />
        <CustomerStory />
        <TrustPlatform />
        <Compliance />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

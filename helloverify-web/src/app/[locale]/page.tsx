import { SiteNav } from "@/components/chrome/SiteNav";
import { Hero } from "@/components/sections/Hero";
import { PeopleStrip } from "@/components/sections/PeopleStrip";
import { OneInEight } from "@/components/sections/OneInEight";
import { HowWeKnow } from "@/components/sections/HowWeKnow";
import { FieldCase } from "@/components/sections/FieldCase";
import { Presence } from "@/components/sections/Presence";
import { GovSeals } from "@/components/sections/GovSeals";
import { GovWhy } from "@/components/sections/GovWhy";
import { GovDossiers } from "@/components/sections/GovDossiers";
// import { Why } from "@/components/sections/Why"; — hidden, see below.
// import { Checks } from "@/components/sections/Checks"; — hidden, see below.
import { Packages } from "@/components/sections/Packages";
import { IntlGrid } from "@/components/sections/IntlGrid";
import { Enterprises } from "@/components/sections/Enterprises";
import { Smb } from "@/components/sections/Smb";
import { Diligence } from "@/components/sections/Diligence";
import { International } from "@/components/sections/International";
import { Consumer } from "@/components/sections/Consumer";
import { CustomerStory } from "@/components/sections/CustomerStory";
import { TrustPlatform } from "@/components/sections/TrustPlatform";
import { Contact } from "@/components/sections/Contact";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
// One CTA system for the homepage (`.hv-home`), after every section sheet.
import "@/app/v2/ctas.css";

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
    <div className="page hv-home">
      <SiteNav />
      {/* The homepage does not use PageShell, so it carries its own <main>.
          Without it this is the one page of 56 with no main landmark, and the
          site-wide skip link has nothing to skip to (WCAG 2.4.1, 1.3.1). */}
      <main id="main-content">
        {/* The order is the one set on 30 Sep 2026 (sections 1–10 below),
            replacing the 28 Sep B2B arc. The "Sheet NN / 12" labels in
            `sections.en.tsx` still follow the old order — renumber them once
            the rest is arranged. */}
        {/* 1–10: the order set on 30 Sep 2026. */}
        <Hero />
        <GovWhy />
        <GovSeals />
        <GovDossiers />
        <Smb />
        <Consumer />
        <Packages />
        {/* Individual Checks, then the old home page's country grid,
            restored (30 Sep 2026). */}
        <PeopleStrip />
        <IntlGrid />
        <Diligence />
        <Presence />
        {/* The rest, in their previous order, to be arranged later. */}
        <OneInEight />
        <HowWeKnow />
        {/* One address check in Foumban, from request to report: evidence
            gathered at the door, processed in-country (30 Sep 2026). */}
        <FieldCase />
        {/* "33 checks. Most take minutes." hidden from the homepage
            (30 Sep 2026), not deleted: restore <Checks /> here. */}
        {/* "Why governments work with us." hidden from the homepage
            (30 Sep 2026), not deleted: restore <Why /> here. */}
        <Enterprises />
        {/* Renders nothing until a real, attributable story exists; this is
            its slot: proof straight after the pitch, before the numbers. */}
        <CustomerStory />
        {/* The Numbers band ("Built on trust. Proven by numbers.") came off
            the homepage on 29 Sep 2026: its four figures, live checks count
            included, now open the page in the hero's ledger. The component
            and its copy remain — `numbers` is what the ledger reads. */}
        <International />
        <TrustPlatform />
        {/* The Compliance band ("The unexciting part, done properly.") came
            off the homepage on 30 Sep 2026. The component and its copy
            remain. */}
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

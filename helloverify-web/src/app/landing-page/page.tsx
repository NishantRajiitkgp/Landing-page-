/** FROZEN SNAPSHOT of the homepage as of 28 Sep 2026 — see `./layout.tsx`.
 *  Every import below comes from `src/snapshot/landing-page/`; do not point
 *  any of them back at the live `@/components/...`, or live edits leak in. */
import { SiteNav } from "@/snapshot/landing-page/components/chrome/SiteNav";
import { Hero } from "@/snapshot/landing-page/components/sections/Hero";
import { PeopleStrip } from "@/snapshot/landing-page/components/sections/PeopleStrip";
import { OneInEight } from "@/snapshot/landing-page/components/sections/OneInEight";
import { HowWeKnow } from "@/snapshot/landing-page/components/sections/HowWeKnow";
import { Numbers } from "@/snapshot/landing-page/components/sections/Numbers";
import { Presence } from "@/snapshot/landing-page/components/sections/Presence";
import { GovSeals } from "@/snapshot/landing-page/components/sections/GovSeals";
import { GovDossiers } from "@/snapshot/landing-page/components/sections/GovDossiers";
import { Why } from "@/snapshot/landing-page/components/sections/Why";
import { Checks } from "@/snapshot/landing-page/components/sections/Checks";
import { Packages } from "@/snapshot/landing-page/components/sections/Packages";
import { Enterprises } from "@/snapshot/landing-page/components/sections/Enterprises";
import { Smb } from "@/snapshot/landing-page/components/sections/Smb";
import { Diligence } from "@/snapshot/landing-page/components/sections/Diligence";
import { International } from "@/snapshot/landing-page/components/sections/International";
import { Consumer } from "@/snapshot/landing-page/components/sections/Consumer";
import { CustomerStory } from "@/snapshot/landing-page/components/sections/CustomerStory";
import { TrustPlatform } from "@/snapshot/landing-page/components/sections/TrustPlatform";
import { Compliance } from "@/snapshot/landing-page/components/sections/Compliance";
import { Contact } from "@/snapshot/landing-page/components/sections/Contact";
import { SiteFooter } from "@/snapshot/landing-page/components/chrome/SiteFooter";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/lib/i18n/routing";

export default function LandingPageSnapshot() {
  setRequestLocale(routing.defaultLocale);

  return (
    <div className="page">
      <SiteNav />
      <main id="main-content">
        <Hero />
        <PeopleStrip />
        <GovSeals />
        <Presence />
        <OneInEight />
        <HowWeKnow />
        <Checks />
        <GovDossiers />
        <Why />
        <Enterprises />
        <Diligence />
        <Smb />
        <Packages />
        <Consumer />
        <CustomerStory />
        <Numbers />
        <International />
        <TrustPlatform />
        <Compliance />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

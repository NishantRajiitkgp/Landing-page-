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
      <SiteFooter />
    </div>
  );
}

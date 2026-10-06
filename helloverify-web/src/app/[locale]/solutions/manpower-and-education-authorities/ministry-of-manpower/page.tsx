/** Ministry of Manpower — `ministryOfManpower.base.json` hero + screening.
 *  Tab labels, then every panel (overview, track, COMPASS, pricing,
 *  resources, FAQs). Hidden panels stay in the document. The applicant
 *  dialog opens from "Start Verification" and is not in the initial HTML. */
import type { Metadata } from "next";
import { Suspense } from "react";

import { MomCompass } from "@/components/mom/MomCompass";
import { MomHero } from "@/components/mom/MomHero";
import { MomHub, MomHubBound } from "@/components/mom/MomHub";
import { MomOverview } from "@/components/mom/MomOverview";
import { MomPricing } from "@/components/mom/MomPricing";
import { MomFaqs, MomResources, MomTrack } from "@/components/mom/MomRest";
import { PageShell } from "@/components/chrome/PageShell";
import { AUTHORITY } from "@/lib/copy/authority";
import type { AuthorityCopy } from "@/lib/copy/authority";
import { momDoc, type MomDoc } from "@/lib/mom/doc";
import { pageMetadata } from "@/lib/seo/metadata";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/solutions/manpower-and-education-authorities/ministry-of-manpower");
}

function panels(doc: MomDoc, locale: string, authority: AuthorityCopy) {
  const screening = doc.screening;
  return [
    <MomOverview key="overview" overview={screening.overview} locale={locale} authority={authority} />,
    <MomTrack key="track" track={screening.track} locale={locale} />,
    <MomCompass key="compass" compass={screening.compass} locale={locale} />,
    <MomPricing key="pricing" band={screening.pricing.packagesBand} locale={locale} />,
    <MomResources key="resources" resources={screening.resources} locale={locale} />,
    <MomFaqs key="faqs" faqs={screening.faqs} />,
  ];
}

export default async function MinistryOfManpower({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = momDoc(locale);
  const authority = AUTHORITY[locale as "en" | "hi" | "ar"] ?? AUTHORITY.en;
  const tabs = doc.screening.tabs.map((tab) => ({ id: tab.id, label: tab.label }));
  const hero = <MomHero hero={doc.hero} locale={locale} />;

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label }]} closing={false}>
      <Suspense fallback={<MomHub tabs={tabs} initial={null} hero={hero}>{panels(doc, locale, authority)}</MomHub>}>
        <MomHubBound tabs={tabs} hero={hero}>
          {panels(doc, locale, authority)}
        </MomHubBound>
      </Suspense>
    </PageShell>
  );
}

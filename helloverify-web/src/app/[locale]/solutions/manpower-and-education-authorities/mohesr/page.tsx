/** MOHESR — live `mohesr.base.json`. The education card opens this page.
 *  Tab labels, then every panel. The login dialog is not in the first HTML. */
import type { Metadata } from "next";
import { Suspense } from "react";

import { MomHub, MomHubBound } from "@/components/mom/MomHub";
import { MohesrHero } from "@/components/mohesr/MohesrHero";
import { MohesrOverview, MohesrSupport } from "@/components/mohesr/MohesrOverview";
import { MohesrAppeal, MohesrFaqs, MohesrRequirements, MohesrTrack } from "@/components/mohesr/MohesrRest";
import { PageShell } from "@/components/chrome/PageShell";
import { mohesrDoc, type MohesrDoc } from "@/lib/mohesr/doc";
import { pageMetadata } from "@/lib/seo/metadata";
import { setRequestLocale } from "next-intl/server";

const PATH = "/solutions/manpower-and-education-authorities/mohesr";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

function panels(doc: MohesrDoc, locale: string) {
  const screening = doc.screening;
  return [
    <MohesrOverview key="overview" screening={screening} locale={locale} />,
    <MohesrRequirements key="documents" screening={screening} />,
    <MohesrTrack key="track" screening={screening} />,
    <MohesrAppeal key="appeal" screening={screening} />,
    <MohesrSupport key="support" screening={screening} locale={locale} />,
    <MohesrFaqs key="faqs" screening={screening} />,
  ];
}

export default async function MohesrPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = mohesrDoc(locale);
  const tabs = doc.screening.tabs.map((tab) => ({ id: tab.id, label: tab.label }));
  const hero = <MohesrHero hero={doc.hero} />;

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label }]} closing={false}>
      <Suspense fallback={<MomHub className="mom3 mohesr" tabs={tabs} initial={null} hero={hero}>{panels(doc, locale)}</MomHub>}>
        <MomHubBound className="mom3 mohesr" tabs={tabs} hero={hero}>
          {panels(doc, locale)}
        </MomHubBound>
      </Suspense>
    </PageShell>
  );
}

/** /technology — the old SPA's Technology page (`technology.base.json`) on the
 *  new design, in the CMS order: the three AI pillars, the compounding
 *  platform and its Trust orbit, the trust-platform areas, the future of
 *  digital trust and the shared certifications block. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { setRequestLocale } from "next-intl/server";
import { PLATFORM } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";
import { TechHero } from "@/components/technology/TechHero";
import { TechPillars } from "@/components/technology/TechPillars";
import { TechCompound } from "@/components/technology/TechCompound";
import { TechAreas } from "@/components/technology/TechAreas";
import { TechFuture } from "@/components/technology/TechFuture";
import { TechCerts } from "@/components/technology/TechCerts";

const ENQUIRY = "/contact?tab=enquiry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/technology");
}

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(PLATFORM);
  const d = t.technology;

  return (
    <PageShell
      crumbs={[{ label: d.crumb }]}
      closing={false}
    >
      <TechHero
        kicker={d.crumb}
        h1={d.hero.h1}
        sub={d.hero.sub}
        cta={d.hero.cta}
        href={ENQUIRY}
        art={d.art}
      />

      <TechPillars h={d.pillars.h} sub={d.pillars.sub} cards={Object.values(d.pillars.cards)} art={d.art} />

      <TechCompound h={d.compound.h} cards={Object.values(d.compound.cards)} grow={d.compound.grow} art={d.art} />

      <TechAreas
        h={d.platform.h}
        sub={d.platform.sub}
        areas={Object.entries(d.platform.cards).map(([key, c]) => ({ key, ...c }))}
        art={d.art}
      />

      <TechFuture h={d.future.h} cards={Object.values(d.future.cards)} art={d.art} />

      <TechCerts h={d.certs.h} lede={d.certs.lede} alts={d.certs.logos} />
    </PageShell>
  );
}

/** /about — the old SPA's About Us page (`about.base.json`) on the new design:
 *  vision and mission, belief, investor, numbers, values, client voices and
 *  the shared certifications block, in the CMS order. Sections live in
 *  `components/about/`, styled by `app/v2/about.css`. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { setRequestLocale } from "next-intl/server";
import { ABOUT } from "@/lib/copy/about";
import { copy } from "@/lib/copy/request";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutBelief } from "@/components/about/AboutBelief";
import { AboutNumbers } from "@/components/about/AboutNumbers";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutVoices } from "@/components/about/AboutVoices";
import { TechCerts } from "@/components/technology/TechCerts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree falls back to reading request headers, which makes the route
  // dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(ABOUT);

  return (
    <PageShell crumbs={[{ label: t.crumb }]} closing={false}>
      <AboutHero h1={t.hero.h1} />
      <AboutStory vision={t.story.vision} mission={t.story.mission} imgAlt={t.story.imgAlt} />
      <AboutBelief k={t.belief.h} q={t.belief.q} inv={t.investor} />
      <AboutNumbers h={t.numbers.h} stats={t.numbers.stats} />
      <AboutValues h={t.values.h} items={t.values.items} />
      <AboutVoices h={t.clients.h} items={t.clients.items} />
      <TechCerts h={t.certs.h} lede={t.certs.lede} alts={t.certs.logos} />
    </PageShell>
  );
}

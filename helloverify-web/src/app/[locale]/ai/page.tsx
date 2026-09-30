/** /ai — HelloVerify AI at work: the field case (one address check in
 *  Foumban, followed on a survey map) on a page of its own. It left the
 *  homepage on 30 Sep 2026, and the globe ("Hire from anywhere") followed
 *  it on 1 Oct 2026. The case's heading is the page's h1. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PageShell } from "@/components/chrome/PageShell";
import { FieldCase } from "@/components/sections/FieldCase";
import { International } from "@/components/sections/International";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/ai");
}

export default async function AiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = (await copy(SECTIONS)).aiPage;

  return (
    <PageShell crumbs={[{ label: t.crumb }]} closing={{ heading: t.closingH, sub: t.closingSub }}>
      <FieldCase heading="h1" />
      {/* The globe, moved here from the homepage on 1 Oct 2026. */}
      <International sheet={false} />
    </PageShell>
  );
}

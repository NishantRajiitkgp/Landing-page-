/** Italy visa partner: create an account. Static; the session is checked in
 *  the browser. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";

import { PageShell } from "@/components/chrome/PageShell";
import { JoinForm } from "@/components/italypartner/JoinForm";
import { PartnerAside } from "@/components/italypartner/PartnerAside";
import { PartnerTabs } from "@/components/italypartner/PartnerTabs";
import { pick } from "@/lib/copy";
import { ITALY_PARTNER } from "@/lib/copy/italyPartner";
import { copy } from "@/lib/copy/request";
import { italyPartnerMetadata } from "@/lib/italy/metadata";
import { ITALY_JOIN_PATH, ITALY_PATH } from "@/lib/italy/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return italyPartnerMetadata(locale, ITALY_JOIN_PATH, pick(ITALY_PARTNER, locale).meta.join);
}

export default async function ItalyPartnerJoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ITALY_PARTNER);

  return (
    <PageShell crumbs={[{ label: t.crumbs.italy, href: ITALY_PATH }, { label: t.crumbs.join }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <div className="ma-grid">
          <JoinForm t={t} locale={locale} tabs={<PartnerTabs t={t} locale={locale} current="join" />} />
          <PartnerAside t={t} />
        </div>
      </div>
    </PageShell>
  );
}

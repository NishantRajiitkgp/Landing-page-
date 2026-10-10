/** Italy visa partner: the account, then the agency. Static shell; the browser
 *  loads the session. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/italypartner.css";
import "@/app/v2/momapply.css";
import "@/app/v2/momflow.css";

import { PageShell } from "@/components/chrome/PageShell";
import { PartnerHome } from "@/components/italypartner/PartnerHome";
import { pick } from "@/lib/copy";
import { ITALY_PARTNER } from "@/lib/copy/italyPartner";
import { copy } from "@/lib/copy/request";
import { italyPartnerMetadata } from "@/lib/italy/metadata";
import { ITALY_PARTNERS_PATH, ITALY_PATH } from "@/lib/italy/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return italyPartnerMetadata(locale, ITALY_PARTNERS_PATH, pick(ITALY_PARTNER, locale).meta.home);
}

export default async function ItalyPartnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ITALY_PARTNER);

  return (
    <PageShell crumbs={[{ label: t.crumbs.italy, href: ITALY_PATH }, { label: t.crumbs.home }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <PartnerHome t={t} locale={locale} />
      </div>
    </PageShell>
  );
}

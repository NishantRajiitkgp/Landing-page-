/** Italy visa partner: sign in. Static; the session is checked in the browser.
 *  noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";

import { PageShell } from "@/components/chrome/PageShell";
import { PartnerAside } from "@/components/italypartner/PartnerAside";
import { PartnerTabs } from "@/components/italypartner/PartnerTabs";
import { SignInForm } from "@/components/italypartner/SignInForm";
import { pick } from "@/lib/copy";
import { ITALY_PARTNER } from "@/lib/copy/italyPartner";
import { copy } from "@/lib/copy/request";
import { italyPartnerMetadata } from "@/lib/italy/metadata";
import { ITALY_PATH, ITALY_SIGN_IN_PATH } from "@/lib/italy/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return italyPartnerMetadata(locale, ITALY_SIGN_IN_PATH, pick(ITALY_PARTNER, locale).meta.signIn);
}

export default async function ItalyPartnerSignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(ITALY_PARTNER);

  return (
    <PageShell crumbs={[{ label: t.crumbs.italy, href: ITALY_PATH }, { label: t.crumbs.signIn }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <div className="ma-grid">
          <SignInForm t={t} locale={locale} tabs={<PartnerTabs t={t} locale={locale} current="signIn" />} />
          <PartnerAside t={t} />
        </div>
      </div>
    </PageShell>
  );
}

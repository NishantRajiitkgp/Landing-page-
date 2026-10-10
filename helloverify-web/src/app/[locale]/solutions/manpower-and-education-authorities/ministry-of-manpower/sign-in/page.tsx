/** MOM applicant: sign in (password, then an emailed code) and password reset.
 *  Static; noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";

import { PageShell } from "@/components/chrome/PageShell";
import { AccountTabs } from "@/components/momapply/AccountTabs";
import { SignInForm } from "@/components/momapply/SignInForm";
import { pick } from "@/lib/copy";
import { MOM_APPLY } from "@/lib/copy/momApply";
import { copy } from "@/lib/copy/request";
import { momDoc } from "@/lib/mom/doc";
import { momFlowMetadata } from "@/lib/mom/metadata";
import { MOM_PATH, MOM_SIGN_IN_PATH } from "@/lib/mom/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return momFlowMetadata(locale, MOM_SIGN_IN_PATH, pick(MOM_APPLY, locale).meta.signIn);
}

export default async function MomSignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(MOM_APPLY);
  const doc = momDoc(locale);

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label, href: MOM_PATH }, { label: t.crumbs.signIn }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page ma-page-solo">
        <SignInForm t={t} locale={locale} tabs={<AccountTabs t={t} locale={locale} current="signIn" />} />
      </div>
    </PageShell>
  );
}

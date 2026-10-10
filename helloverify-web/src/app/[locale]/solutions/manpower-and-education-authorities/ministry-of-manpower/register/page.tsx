/** MOM applicant: create account. Static; the session is checked in the
 *  browser. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";

import { PageShell } from "@/components/chrome/PageShell";
import { AccountTabs } from "@/components/momapply/AccountTabs";
import { ApplyAside } from "@/components/momapply/ApplyAside";
import { RegisterForm } from "@/components/momapply/RegisterForm";
import { pick } from "@/lib/copy";
import { MOM_APPLY } from "@/lib/copy/momApply";
import { copy } from "@/lib/copy/request";
import { momDoc } from "@/lib/mom/doc";
import { momFlowMetadata } from "@/lib/mom/metadata";
import { MOM_PATH, MOM_REGISTER_PATH } from "@/lib/mom/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return momFlowMetadata(locale, MOM_REGISTER_PATH, pick(MOM_APPLY, locale).meta.register);
}

export default async function MomRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(MOM_APPLY);
  const doc = momDoc(locale);

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label, href: MOM_PATH }, { label: t.crumbs.register }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <div className="ma-grid">
          <RegisterForm t={t} locale={locale} tabs={<AccountTabs t={t} locale={locale} current="register" />} />
          <ApplyAside t={t} doc={doc} />
        </div>
      </div>
    </PageShell>
  );
}

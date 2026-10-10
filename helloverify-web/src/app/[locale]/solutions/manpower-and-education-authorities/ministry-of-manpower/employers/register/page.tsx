/** MOM employers and agencies: create an organisation account. Static; the
 *  session is checked in the browser. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";
import "@/app/v2/momflow.css";

import { PageShell } from "@/components/chrome/PageShell";
import { AccountTabs } from "@/components/momapply/AccountTabs";
import { OrgAside } from "@/components/momorg/OrgAside";
import { OrgRegisterForm } from "@/components/momorg/OrgRegisterForm";
import { pick } from "@/lib/copy";
import { MOM_ORG } from "@/lib/copy/momOrg";
import { copy } from "@/lib/copy/request";
import { momDoc } from "@/lib/mom/doc";
import { momFlowMetadata } from "@/lib/mom/metadata";
import { MOM_ORG_REGISTER_PATH, MOM_ORG_SIGN_IN_PATH, MOM_PATH } from "@/lib/mom/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return momFlowMetadata(locale, MOM_ORG_REGISTER_PATH, pick(MOM_ORG, locale).meta.register);
}

export default async function MomOrgRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(MOM_ORG);
  const doc = momDoc(locale);
  const paths = { register: MOM_ORG_REGISTER_PATH, signIn: MOM_ORG_SIGN_IN_PATH };

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label, href: MOM_PATH }, { label: t.crumbs.register }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <div className="ma-grid">
          <OrgRegisterForm t={t} locale={locale} tabs={<AccountTabs t={t} locale={locale} current="register" paths={paths} />} />
          <OrgAside t={t} doc={doc} />
        </div>
      </div>
    </PageShell>
  );
}

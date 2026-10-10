/** MOM employers and agencies: the batch. Static shell; the browser loads the
 *  session and the batch. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";
import "@/app/v2/momflow.css";
import "@/app/v2/momorg.css";

import { PageShell } from "@/components/chrome/PageShell";
import { OrgHome } from "@/components/momorg/OrgHome";
import { pick } from "@/lib/copy";
import { MOM_ORG } from "@/lib/copy/momOrg";
import { MOM_STEPS } from "@/lib/copy/momSteps";
import { copy } from "@/lib/copy/request";
import { pricesFrom } from "@/lib/mom/apply/pricing";
import { momDoc } from "@/lib/mom/doc";
import { momFlowMetadata } from "@/lib/mom/metadata";
import { MOM_ORG_PATH, MOM_PATH } from "@/lib/mom/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return momFlowMetadata(locale, MOM_ORG_PATH, pick(MOM_ORG, locale).meta.home);
}

export default async function MomOrgHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(MOM_ORG);
  const s = await copy(MOM_STEPS);
  const doc = momDoc(locale);

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label, href: MOM_PATH }, { label: t.crumbs.home }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page">
        <OrgHome t={t} s={s} locale={locale} prices={pricesFrom(doc)} />
      </div>
    </PageShell>
  );
}

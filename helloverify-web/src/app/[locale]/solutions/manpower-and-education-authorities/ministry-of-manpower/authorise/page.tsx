/** MOM employers and agencies: a candidate signs their Letter of
 *  Authorisation from the link in their email. Static; the link's token is
 *  read in the browser. noindex, not in the sitemap. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import "@/app/v2/momapply.css";
import "@/app/v2/momflow.css";
import "@/app/v2/momorg.css";

import { PageShell } from "@/components/chrome/PageShell";
import { LoaSign } from "@/components/momorg/loa/LoaSign";
import { pick } from "@/lib/copy";
import { MOM_ORG } from "@/lib/copy/momOrg";
import { MOM_STEPS } from "@/lib/copy/momSteps";
import { copy } from "@/lib/copy/request";
import { momDoc } from "@/lib/mom/doc";
import { momFlowMetadata } from "@/lib/mom/metadata";
import { MOM_LOA_PATH, MOM_PATH } from "@/lib/mom/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return momFlowMetadata(locale, MOM_LOA_PATH, pick(MOM_ORG, locale).meta.loa);
}

export default async function MomLoaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(MOM_ORG);
  const s = await copy(MOM_STEPS);
  const doc = momDoc(locale);

  return (
    <PageShell crumbs={[{ label: doc.hero.breadcrumb[1].label, href: MOM_PATH }, { label: t.crumbs.loa }]} closing={false} showSignUp={false}>
      <div className="wrap ma-page ma-page-solo">
        <LoaSign t={t} s={s} locale={locale} />
      </div>
    </PageShell>
  );
}

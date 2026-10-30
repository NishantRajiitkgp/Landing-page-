/** /partner-with-us — the HelloVerify Partner Programme
 *  (`helloverify-partner-programme-final.html`), its words on the site's
 *  paper and ink: the join form in the hero, who already trusts the name,
 *  the advantages, the services and their commission, the calculator, the
 *  five steps and the FAQ. The form posts into the contact form's lead
 *  pipeline (`./actions`). Sections are `components/partner/*`, styled by
 *  `app/v2/partner.css`. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { FaqSection } from "@/components/chrome/FaqSection";
import { PartnerForm } from "@/components/partner/PartnerForm";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { PartnerTrust } from "@/components/partner/PartnerTrust";
import { PartnerAdvantages, PartnerProof } from "@/components/partner/PartnerValue";
import { PartnerServices, PartnerWho } from "@/components/partner/PartnerOffer";
import { PartnerEarnings, PartnerSupport } from "@/components/partner/PartnerFlow";
import { PartnerClose, PartnerKit, PartnerProcess } from "@/components/partner/PartnerSteps";
import { Phone } from "@/components/partner/partnerParts";
import { PARTNER, type PartnerFormUi, type PartnerTypeKey } from "@/lib/copy/partner";
import { copy } from "@/lib/copy/request";
import { pageMetadata } from "@/lib/seo/metadata";
import "@/app/v2/partner.css";

const PATH = "/partner-with-us";
const PRIVACY = "Privacy@helloverify.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

export default async function PartnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = await copy(PARTNER);

  const { notice, talk, ...fields } = c.form;
  const { p2, ...noticeUi } = notice;
  const formUi: PartnerFormUi = { ...fields, notice: noticeUi };
  const types = Object.keys(fields.type.options) as PartnerTypeKey[];

  const form = (
    <PartnerForm
      locale={locale}
      t={formUi}
      types={types}
      notice={p2(<a href={`mailto:${PRIVACY}`}>{PRIVACY}</a>, <AppLink href="/legal/privacy-policy">{notice.policy}</AppLink>)}
      talk={talk(<Phone c={c.phone} />)}
    />
  );

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="pw">
        <PartnerHero c={c} form={form} />
        <PartnerTrust c={c.trust} />
        <PartnerAdvantages c={c.advantages} join={c.hero.join} />
        <PartnerProof c={c.proof} join={c.hero.join} call={c.phone.call} />
        <PartnerServices c={c.services} />
        <PartnerWho c={c.who} />
        <PartnerSupport c={c} />
        <PartnerEarnings c={c.earnings} />
        <PartnerProcess c={c.process} phone={c.phone} />
        <PartnerKit c={c.included} />
        <div id="faqs" className="pw-faq">
          <FaqSection head={c.faq.h} faqs={c.faq.items} />
        </div>
        <PartnerClose c={c.close} phone={c.phone} />
      </div>
    </PageShell>
  );
}

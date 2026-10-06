/** /products/customer-kyc — the old SPA's KYC page in its order: hero
 *  (title, subtitle, Talk to Sales), the six-step How it Works grid, Solutions
 *  We Offer. Copy is `customerKyc.base.json` word for word
 *  (`business.customerKyc`). */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { KycIcon, type KycIconId } from "@/components/kyc/KycIcons";
import { BUSINESS, type BusinessCopy } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

const PATH = "/products/customer-kyc";

type C = BusinessCopy["customerKyc"];

/** Old CMS step numbers and images (`public/img/kyc/tsstep<n>.png`, 623×572). */
const STEPS: readonly [keyof C["how"]["steps"], string][] = [
  ["upload", "01"],
  ["selfie", "02"],
  ["face", "03"],
  ["liveness", "04"],
  ["decision", "05"],
  ["onboard", "06"],
];
const CARDS: readonly [keyof C["solutions"]["cards"], KycIconId][] = [
  ["kyc", "rocket"],
  ["kyb", "scales"],
  ["underwriting", "shield"],
  ["fraud", "shield"],
  ["execute", "shieldTall"],
  ["aml", "listChecks"],
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

const SERVICE: ServiceFacts = {
  path: PATH,
  name: "KYC platform",
  description: copyFor(PATH).description,
  serviceType: "Identity verification",
};

export default async function CustomerKycPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = (await copy(BUSINESS)).customerKyc;

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="wrap hero3">
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact?tab=enquiry" className="btn btn-ink">
            {c.hero.cta}
          </AppLink>
        </div>
      </div>

      <div className="wrap sec3" id="how-it-works">
        <div className="sec-head smb3-head">
          <h2 className="h2 kyc3-h">{c.how.h}</h2>
        </div>
        <ol className="body3 kyc3-steps">
          {STEPS.map(([k, n], i) => {
            const st = c.how.steps[k];
            return (
              <li key={k} tabIndex={0}>
                <span className="ph">
                  <Image src={`/img/kyc/tsstep${i + 1}.png`} alt={st.alt} width={623} height={572} sizes="120px" />
                </span>
                <span className="badge">
                  <span>STEP</span>
                  <b>{n}</b>
                </span>
                <h3>{st.t}</h3>
                {st.body.map((x) => (
                  <p key={x}>{x}</p>
                ))}
              </li>
            );
          })}
        </ol>
        <div className="emp3-cta">
          <AppLink href="/contact" className="btn btn-ink">
            {c.how.cta}
          </AppLink>
        </div>
      </div>

      <div className="wrap sec3" id="solutions-we-offer">
        <div className="sec-head smb3-head">
          <h2 className="h2">{c.solutions.h}</h2>
          <p className="lede">{c.solutions.sub}</p>
        </div>
        <ul className="body3 smb3-cards kyc3-sol">
          {CARDS.map(([k, icon]) => (
            <li key={k}>
              <span className="ic">
                <KycIcon id={icon} />
              </span>
              <h3>{c.solutions.cards[k].t}</h3>
              <ol>
                {c.solutions.cards[k].items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </div>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

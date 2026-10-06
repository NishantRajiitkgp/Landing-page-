/** /products/bgv-enterprise — the old SPA's Enterprise page in its order:
 *  hero, the trust strip (title, subtitle, partner logos), the Employees /
 *  Businesses / Customers screening tabs. Copy is `enterprise.base.json` word
 *  for word (`business.enterprise`). */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { EnterpriseTabs } from "@/components/enterprise/EnterpriseTabs";
import { BUSINESS, type BusinessCopy } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

const PATH = "/products/bgv-enterprise";

/** Old CMS partner order; each logo is `public/img/clients/<key>.png`. */
const PARTNERS: readonly (keyof BusinessCopy["enterprise"]["partners"])[] = ["cognizant", "infosys", "accenture", "reliance", "wipro", "hcl"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

/** No priced packages on the old enterprise page, so no OfferCatalog. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "AI-powered background screening",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function EnterprisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const e = (await copy(BUSINESS)).enterprise;

  return (
    <PageShell crumbs={[{ label: e.crumb }]} closing={false}>
      <div className="wrap hero3">
        <h1 className="h1">{e.hero.h1}</h1>
        <div className="hrow">
          <AppLink href="/contact?tab=enquiry" className="btn btn-ink">
            {e.hero.cta}
          </AppLink>
        </div>
      </div>

      <div className="wrap sec3 ent3-trust">
        <div className="sec-head smb3-head">
          <h2 className="h2">
            {e.trust.before} {e.trust.after}{" "}
            <br />
            <em>{e.trust.second}</em>
          </h2>
          <p className="lede">{e.trust.sub}</p>
        </div>
        <ul className="body3 logos3">
          {PARTNERS.map((k) => (
            <li key={k}>
              <Image src={`/img/clients/${k}.png`} alt={e.partners[k]} width={150} height={40} />
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap sec3" id="screening">
        <div className="sec-head smb3-head">
          <h2 className="h2">{e.screening.h}</h2>
        </div>
        <EnterpriseTabs
          tabs={e.screening.tabs}
          employees={e.employees}
          businesses={e.businesses}
          customers={e.customers}
          explore={{
            employees: (
              <AppLink href="/employee-verification#employees-white-collar" className="btn btn-ink">
                {e.employees.explore}
              </AppLink>
            ),
            businesses: (
              <AppLink href="/products/certifier" className="btn btn-ink">
                {e.businesses.explore}
              </AppLink>
            ),
            customers: (
              <AppLink href="/products/customer-kyc" className="btn btn-ink">
                {e.customers.explore}
              </AppLink>
            ),
          }}
        />
      </div>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

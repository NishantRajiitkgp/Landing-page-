/** /products/bgv-enterprise — enterprise screening, restaged. Same copy
 *  (`business.enterprise`): the hero line, the partner strip, then Employees /
 *  Businesses / Customers. Layout lives in `app/v2/enterprise.css`. */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { setRequestLocale } from "next-intl/server";
import { EnterpriseTabs } from "@/components/enterprise/EnterpriseTabs";
import { ExFile } from "@/components/enterprise/ExFile";
import { BUSINESS, type BusinessCopy } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";
import "@/app/v2/enterprise.css";

const PATH = "/products/bgv-enterprise";
const TALK = "/contact?tab=enquiry";

/** Old CMS partner order; each logo is `public/img/clients/<key>.png`. */
const PARTNERS: readonly (keyof BusinessCopy["enterprise"]["partners"])[] = ["cognizant", "infosys", "accenture", "reliance", "wipro", "hcl"];

const PROOF = ["fast", "accurate", "compliant"] as const;

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
  const em = e.employees;
  const g = em.groups.enterprise;
  /** A hire, in the order a screener actually runs it. */
  const fileRows = [g.a[0], g.a[1], g.a[3], g.b[1], g.b[2]];

  return (
    <PageShell crumbs={[{ label: e.crumb }]} closing={false}>
      <div className="ex">
        <div className="wrap">
          <section className="ex-hero" aria-labelledby="ent-h1">
            <span className="ex-grid" aria-hidden="true" />
            <div className="ex-hero-copy">
              <p className="k">{e.crumb}</p>
              <h1 className="ex-punch" id="ent-h1">{e.hero.h1}</h1>
              <div className="hrow">
                <AppLink href={TALK} className="btn ex-btn">
                  {e.hero.cta}
                  <Arrow />
                </AppLink>
              </div>
              <ul className="ex-pts">
                {PROOF.map((k) => (
                  <li key={k}>
                    <span className="pip"><Tick tone="inverse" /></span>
                    {em.values[k].tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ex-stage" aria-hidden="true">
              <div className="ex-photo">
                <Image
                  src="/img/11-office-first-day.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1080px) 92vw, 520px"
                />
              </div>
              <ExFile
                kicker={em.checksH}
                title={g.h}
                rows={fileRows}
                stats={[em.stats.checks, em.stats.countries, em.stats.tat]}
              />
            </div>
          </section>
        </div>

        <section className="wrap ex-sec ex-trust" aria-labelledby="ent-trust">
          <h2 className="ex-trust-h" id="ent-trust">
            {e.trust.before} {e.trust.after} <em>{e.trust.second}</em>
          </h2>
          <p className="ex-trust-sub">{e.trust.sub}</p>
          <ul className="ex-logos">
            {PARTNERS.map((k) => (
              <li key={k}>
                <Image src={`/img/clients/${k}.png`} alt={e.partners[k]} width={150} height={40} />
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap ex-sec" id="screening" aria-labelledby="ent-screen">
          <div className="ex-head">
            <h2 className="h2" id="ent-screen">{e.screening.h}</h2>
          </div>
          <EnterpriseTabs
            tabs={e.screening.tabs}
            employees={em}
            businesses={e.businesses}
            customers={e.customers}
            explore={{
              employees: (
                <AppLink href="/employee-verification#employees-white-collar" className="btn ex-btn">
                  {em.explore}
                  <Arrow />
                </AppLink>
              ),
              businesses: (
                <AppLink href="/products/certifier" className="btn ex-btn">
                  {e.businesses.explore}
                  <Arrow />
                </AppLink>
              ),
              customers: (
                <AppLink href="/products/customer-kyc" className="btn ex-btn">
                  {e.customers.explore}
                  <Arrow />
                </AppLink>
              ),
            }}
          />
        </section>
      </div>
      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

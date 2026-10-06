/** /products/bgv-smb — the old SPA's SMB page in its order: hero, How it
 *  Works?, Select Or Customize Verification Package (the three packages, then
 *  the Select Your Checks table and its summary), Trusted by Businesses &
 *  Individuals, Solutions We Offer. Copy is `bgvSmb.base.json` word for word
 *  (`business.smb`). The client-logo strip under the hero was added on
 *  request (5 Oct 2026); the old page had none. */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { Steps } from "@/components/chrome/Steps";
import { CommerceCta } from "@/components/commerce/CommerceCta";
import { SmbCustomize, type SmbRow } from "@/components/smb/SmbCustomize";
import { SmbSolutions } from "@/components/smb/SmbSolutions";
import { SmbIcon } from "@/components/smb/SmbIcons";
import { BUSINESS, type SmbPackKey } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";
import { SMB_CLIENTS, smbLogo } from "@/lib/smbClients";

const PATH = "/products/bgv-smb";
const SALES = "/contact?tab=enquiry&role=business&contact=business-support";

/** Structure, not copy: the old CMS package ids and amounts; Standard is the
 *  featured card. */
const PACKS: readonly { k: SmbPackKey; unitAmount: number; featured?: true }[] = [
  { k: "basic", unitAmount: 1799 },
  { k: "standard", unitAmount: 2199, featured: true },
  { k: "premium", unitAmount: 2399 },
];

/** Structure, not copy: the old CMS `customizableRows` in order — the API
 *  check code each row posts, its amount, and the one ticked on load. */
const ROWS: readonly SmbRow[] = [
  { key: "identity", code: "1CIC", amount: 349 },
  { key: "employment", code: "ALLEMP", amount: 499 },
  { key: "education", code: "ALLEDU", amount: 999, checked: true },
  { key: "address", code: "ALLADD", amount: 499 },
  { key: "professionalReference", code: "PREF", amount: 499 },
  { key: "indianDatabase", code: "IDC", amount: 699 },
  { key: "globalDatabase", code: "GDC", amount: 999 },
  { key: "criminalEcourt", code: "ALLADDCCVEC", amount: 799 },
  { key: "criminalPolice", code: "ALLADDCCVPAF", amount: 899 },
  { key: "criminalLawFirm", code: "ALLCCVLF", amount: 999 },
  { key: "rightToWork", code: "RTW", amount: 359 },
  { key: "uan", code: "UAN", amount: 400 },
  { key: "bankAccount", code: "BV", amount: 199 },
  { key: "credit", code: "CC", amount: 899 },
  { key: "creditSuit", code: "Credit suit defaulter check", amount: 699 },
  { key: "resume", code: "ResumeCV", amount: 299 },
  { key: "finra", code: "1FINGER-PRINT-COLLECTION", amount: 10000 },
  { key: "ofac", code: "OFAC", amount: 999 },
  { key: "form16", code: "FORM16", amount: 500 },
  { key: "professionalLicense", code: "PLC", amount: 799 },
  { key: "socialMedia", code: "1SMC", amount: 749 },
  { key: "directorship", code: "DIR", amount: 649 },
  { key: "financialRegulatory", code: "FFIEC", amount: 500 },
  { key: "bankStatement", code: "BSV", amount: 100 },
  { key: "gsa", code: "GSA", amount: 499 },
  { key: "oig", code: "OIG", amount: 499 },
  { key: "adverseMedia", code: "AMC", amount: 1299 },
  { key: "gap", code: "GCB", amount: 649 },
  { key: "drug", code: "DRUG5P", amount: 1350 },
  { key: "alcohol", code: "1Alcohol-Test", amount: 2300 },
  { key: "company", code: "COMC", amount: 599 },
  { key: "faceMatch", code: "SELFIE", amount: 0 },
  { key: "fda", code: "FADA", amount: 1350 },
  { key: "nsr", code: "NSRC", amount: 799 },
  { key: "gapValidation", code: "GCACCVEC", amount: 900 },
];

const PEOPLE = [
  { k: "rohit", src: "/img/smb/rohit.png", w: 409, h: 280 },
  { k: "anjali", src: "/img/smb/anjali.jpg", w: 240, h: 210 },
  { k: "neha", src: "/img/smb/neha.jpg", w: 275, h: 183 },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

/** BUILD-SPEC §8.2. `offers` are the three package cards as rendered. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Background checks for small and medium businesses",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function SmbPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = (await copy(BUSINESS)).smb;
  const service: ServiceFacts = {
    ...SERVICE,
    offers: PACKS.map((p) => ({ name: c.packages.items[p.k].t, description: c.packages.items[p.k].p })),
  };
  const st = c.how.steps;

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="wrap hero3">
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <AppLink href={SALES} className="btn btn-ink">
            {c.hero.cta}
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <p className="logos3-h">{c.trust.h}</p>
        <ul className="logos3 logos3-many">
          {SMB_CLIENTS.map((x) => (
            <li key={x.id} className={x.fit && `logos3-${x.fit}`}>
              <Image src={smbLogo(x.id)} alt={c.clients[x.id]} width={150} height={40} />
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap sec3" id="bgv-smb-how-it-works">
        <div className="sec-head smb3-head">
          <h2 className="h2">{c.how.h}</h2>
        </div>
        <Steps name={c.how.h} items={[st.select, st.fill, st.fast]} />
      </div>

      <div className="wrap sec3" id="bgv-smb-verification-packages">
        <div className="sec-head smb3-head">
          <h2 className="h2">{c.packages.h}</h2>
        </div>
        <ul className="body3 smb3-packs">
          {PACKS.map((p) => {
            const it = c.packages.items[p.k];
            return (
              <li key={p.k} className={p.featured ? "on" : undefined}>
                <div className="hd">
                  <h3>{it.t}</h3>
                  <span className="tat">
                    <SmbIcon id="clock" />
                    {it.ready}
                  </span>
                </div>
                <p className="pr">{it.price}</p>
                <p className="ds">{it.p}</p>
                <p className="lb">{c.packages.checksInclude}</p>
                <ul className="pills">
                  {it.checks.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <CommerceCta
                  className={p.featured ? "btn btn-ink" : "btn btn-line"}
                  label={c.packages.buy}
                  loginRedirect="products/bgv-smb"
                  packageDetails={{
                    packageType: "smb",
                    packageId: p.k,
                    packageName: it.t,
                    description: it.p,
                    priceDisplay: it.price,
                    unitAmount: p.unitAmount,
                    includedChecks: [...it.checks],
                  }}
                />
              </li>
            );
          })}
        </ul>
        <div className="smb3-czl">
          <a href="#bgv-smb-select-checks" className="btn btn-line">
            {c.packages.customize}
          </a>
        </div>
        <SmbCustomize table={c.table} summary={c.summary} rows={ROWS} />
      </div>

      <div className="wrap sec3" id="bgv-smb-trusted-by">
        <div className="sec-head smb3-head">
          <h2 className="h2">{c.trusted.h}</h2>
        </div>
        <div className="body3 smb3-stats">
          {(["smbs", "tat", "start"] as const).map((k) => (
            <div key={k}>
              <p className="v">{c.trusted.stats[k].v}</p>
              <p className="l">{c.trusted.stats[k].l}</p>
            </div>
          ))}
        </div>
        <ul className="smb3-quotes">
          {PEOPLE.map((x) => {
            const t = c.trusted.people[x.k];
            return (
              <li key={x.k}>
                <Image src={x.src} alt={t.alt} width={x.w} height={x.h} className="ph" />
                <p className="nm">{t.name}</p>
                <p className="rl">{t.role}</p>
                <blockquote>{t.quote}</blockquote>
                <span className="stars" role="img" aria-label={c.trusted.stars}>
                  {[0, 1, 2, 3].map((i) => (
                    <svg key={i} viewBox="0 0 15 14" aria-hidden="true">
                      <path d="M6.69533 0.487005L4.86449 4.10687L0.768236 4.68922C0.0336581 4.79311 -0.260734 5.67621 0.271975 6.182L3.23552 8.99806L2.53459 12.9761C2.40842 13.6951 3.18505 14.2337 3.83552 13.8975L7.5 12.0192L11.1645 13.8975C11.8149 14.231 12.5916 13.6951 12.4654 12.9761L11.7645 8.99806L14.728 6.182C15.2607 5.67621 14.9663 4.79311 14.2318 4.68922L10.1355 4.10687L8.30467 0.487005C7.97664 -0.158228 7.02617 -0.16643 6.69533 0.487005Z" />
                    </svg>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <SmbSolutions c={c.solutions} />

      <JsonLd data={serviceNode(locale, service)} />
    </PageShell>
  );
}

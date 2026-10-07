/** /products/hellov — the old SPA's HelloV page in its order: hero, intro,
 *  the Packages / Single Checks tabs, the Advanced Package cards. Copy is
 *  `hellov.base.json` word for word (`individuals.hellov`). */
import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { CommerceCta } from "@/components/commerce/CommerceCta";
import { HelloVTabs, HelloVTabsBound, type Single } from "@/components/hellov/HelloVTabs";
import { HeaderIcon, CheckIcon, type HeaderIconId, type CheckIconId } from "@/components/hellov/HelloVIcons";
import type { IndividualsCopy } from "@/lib/copy/individuals";
import { INDIVIDUALS } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";
import { HELLOV_WHATSAPP } from "@/lib/hellov";

const PATH = "/products/hellov";
const SALES = "/contact?tab=enquiry&role=consumer&contact=general-queries";
type AdvancedKey = keyof IndividualsCopy["hellov"]["advanced"]["cards"];

/** Structure, not copy: the old CMS `unitAmount`, `verificationMinutes` and
 *  `checkoutPackageName` per single check, in the CMS order. */
const SINGLES: readonly Single[] = [
  { key: "age", id: "age", unitAmount: 199, minutes: 30, checkoutName: "Age Verification Check", img: { src: "/img/hellov/single-age.jpg", w: 900, h: 672 } },
  { key: "employment", id: "digital-employment", unitAmount: 299, minutes: 60, checkoutName: "Digital Employment Checks", img: { src: "/img/hellov/single-employment.jpg", w: 900, h: 600 } },
  { key: "licence", id: "driving-license", unitAmount: 299, minutes: 30, checkoutName: "Driving License Checks", img: { src: "/img/hellov/single-licence.jpg", w: 900, h: 600 } },
  { key: "pan", id: "pan", unitAmount: 299, minutes: 30, checkoutName: "Pan Card Check", img: { src: "/img/hellov/single-pan.jpg", w: 900, h: 759 } },
  { key: "criminal", id: "criminal-record", unitAmount: 899, minutes: 30, checkoutName: "Criminal Record Check", img: { src: "/img/hellov/single-criminal.jpg", w: 900, h: 600 } },
  { key: "address", id: "digital-address", unitAmount: 299, minutes: 30, checkoutName: "Digital Location Check", img: { src: "/img/hellov/single-address.jpg", w: 900, h: 600 } },
];

const ADVANCED: readonly {
  key: AdvancedKey;
  id: string;
  unitAmount: number;
  checkoutName: string;
  icon: HeaderIconId;
  checks: readonly CheckIconId[];
  popular?: true;
}[] = [
  { key: "homeStaff", id: "advanced-home-staff", unitAmount: 1399, checkoutName: "Home Staff Advanced Package", icon: "homeStaff", checks: ["voterId", "criminal", "address"] },
  { key: "nanny", id: "advanced-nanny", unitAmount: 1399, checkoutName: "Nanny Verification Advanced Package", icon: "nanny", checks: ["identity", "criminal", "address"] },
  { key: "driver", id: "advanced-driver", unitAmount: 1799, checkoutName: "Driver Verification Advanced Package", icon: "driver", checks: ["drivingLicense", "criminal", "voterId", "address"], popular: true },
  { key: "tenant", id: "advanced-tenant", unitAmount: 1799, checkoutName: "Tenant Verification Advanced Package", icon: "tenant", checks: ["creditCheck", "criminal", "aadhaar"] },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

/** BUILD-SPEC §8.2. `offers` name two Advanced cards and a check each shows,
 *  so `check-schema` finds both on the page. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "HelloV — verification on WhatsApp",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
  offers: [
    { name: "Driver Verification", description: "Driving License Check" },
    { name: "Home Staff Verification", description: "Criminal Check" },
  ],
};

export default async function HelloVPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = (await copy(INDIVIDUALS)).hellov;

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

      <div className="wrap sec3">
        <p className="hv3-lead">{c.intro}</p>
      </div>

      <Suspense fallback={<HelloVTabs c={c} whatsapp={HELLOV_WHATSAPP} singles={SINGLES} />}>
        <HelloVTabsBound c={c} whatsapp={HELLOV_WHATSAPP} singles={SINGLES} />
      </Suspense>

      <div className="wrap sec3" id="hellov-premium">
        <div className="sec-head">
          <h2 className="h2">{c.advanced.h}</h2>
        </div>
        <ul className="body3 hv3-adv">
          {ADVANCED.map((a) => {
            const it = c.advanced.cards[a.key];
            return (
              <li key={a.key}>
                {a.popular ? <span className="bdg">{c.advanced.badge}</span> : null}
                <div className="hd">
                  <span className="ic">
                    <HeaderIcon id={a.icon} />
                  </span>
                  <h3>{it.t}</h3>
                </div>
                <p className="pr">{it.price}</p>
                <ul className="ck">
                  {it.checks.map((label, i) => (
                    <li key={label}>
                      <span className="ic">
                        <CheckIcon id={a.checks[i]} />
                      </span>
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                <CommerceCta
                  className="btn btn-ink btn-sm"
                  label={c.advanced.buy}
                  loginRedirect="products/hellov"
                  packageDetails={{
                    packageType: "home",
                    packageId: a.id,
                    packageName: a.checkoutName,
                    priceDisplay: it.price,
                    unitAmount: a.unitAmount,
                    includedChecks: [...it.checks],
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

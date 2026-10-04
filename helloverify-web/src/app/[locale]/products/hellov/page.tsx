/** /products/hellov — consumer product page (Template 4: receipts + the phone).
 *  Catalogue, prices and hero line are the live old CMS (`hellov.base.json`). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { HelloVPhone } from "@/components/blocks/HelloVPhone";
import { setRequestLocale } from "next-intl/server";
import { Tick } from "@/components/brand/Tick";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { CommerceCta } from "@/components/commerce/CommerceCta";
import type { PackageCheckoutDetails } from "@/lib/auth/types";
import type { IndividualsCopy } from "@/lib/copy/individuals";
import { INDIVIDUALS } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/products/hellov";

type HelloV = IndividualsCopy["hellov"];
type CheckId = keyof HelloV["plans"]["checks"];
type PackageKey = keyof HelloV["plans"]["packages"];
type SingleKey = keyof HelloV["singles"]["cards"];
type AdvancedKey = keyof HelloV["advanced"]["packages"];

/** Order and included checks are structure — the old CMS tab order — and
 *  stay beside the `.map()`. Copy leaves are the titles, blurbs and ₹. */
const PACKAGES: readonly {
  key: PackageKey;
  id: string;
  unitAmount: number;
  checks: readonly CheckId[];
}[] = [
  { key: "driver", id: "driver", unitAmount: 499, checks: ["drivingLicense", "address"] },
  { key: "homeStaff", id: "home-staff", unitAmount: 599, checks: ["criminal", "identity"] },
  { key: "tenant", id: "tenant", unitAmount: 549, checks: ["identity", "address"] },
  { key: "nanny", id: "nanny", unitAmount: 549, checks: ["criminal", "identity"] },
  { key: "verifyAnyone", id: "verify-anyone", unitAmount: 1099, checks: ["identity", "criminal"] },
  { key: "cyberIdentity", id: "cyber-identity", unitAmount: 1099, checks: ["identity", "criminal"] },
  { key: "knowIdentity", id: "know-identity", unitAmount: 1099, checks: ["identity"] },
  { key: "knowContact", id: "know-contact", unitAmount: 1099, checks: ["identity", "criminal"] },
];

const SINGLES: readonly { key: SingleKey; id: string; unitAmount: number }[] = [
  { key: "age", id: "age", unitAmount: 199 },
  { key: "employment", id: "digital-employment", unitAmount: 299 },
  { key: "licence", id: "driving-license", unitAmount: 299 },
  { key: "pan", id: "pan", unitAmount: 299 },
  { key: "criminal", id: "criminal-record", unitAmount: 899 },
  { key: "address", id: "digital-address", unitAmount: 299 },
];

const ADVANCED: readonly {
  key: AdvancedKey;
  id: string;
  unitAmount: number;
  popular?: true;
  checks: readonly CheckId[];
}[] = [
  { key: "homeStaff", id: "advanced-home-staff", unitAmount: 1399, checks: ["voterId", "criminal", "address"] },
  { key: "nanny", id: "advanced-nanny", unitAmount: 1399, checks: ["identity", "criminal", "address"] },
  {
    key: "driver",
    id: "advanced-driver",
    unitAmount: 1799,
    popular: true,
    checks: ["drivingLicense", "criminal", "voterId", "address"],
  },
  { key: "tenant", id: "advanced-tenant", unitAmount: 1799, checks: ["credit", "criminal", "aadhaar"] },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}


/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here.
 *
 *  `offers` repeat two live catalogue titles and their check lists. They
 *  cannot `await copy()`: this object is evaluated at module scope. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "HelloV — verification on WhatsApp",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
  offers: [
    { name: "Driver Verification", description: "Driving License Check" },
    { name: "Home Staff", description: "Criminal Check" },
  ],
};

function ReceiptCard({
  hd,
  badge,
  tt,
  sub,
  checks,
  priceLabel,
  price,
  inclGst,
  readyLabel,
  readyValue,
  buy,
  packageDetails,
}: {
  hd: string;
  badge?: string;
  tt: string;
  sub: string;
  checks: readonly string[];
  priceLabel: string;
  price: string;
  inclGst: string;
  readyLabel?: string;
  readyValue?: string;
  buy: string;
  packageDetails: PackageCheckoutDetails;
}) {
  return (
    <div className="rc">
      <div className="hd">
        <span>{hd}</span>
        <span>{badge ?? ""}</span>
      </div>
      <div className="tt">{tt}</div>
      <div className="sub">{sub}</div>
      <div className="sep" />
      {checks.map((label) => (
        <div className="ln" key={label}>
          <Tick />
          <span>{label}</span>
        </div>
      ))}
      <div className="sep" />
      <div className="price">
        <span className="lb">{priceLabel}</span>
        <span className="v">
          {price}
          <small>{inclGst}</small>
        </span>
      </div>
      {readyLabel && readyValue ? (
        <div className="ready">
          <span className="lb">{readyLabel}</span>
          <span className="v">{readyValue}</span>
        </div>
      ) : null}
      <div className="bc" />
      <div className="buy">
        <CommerceCta
          className="btn btn-ink btn-sm"
          label={buy}
          loginRedirect="products/hellov"
          packageDetails={packageDetails}
        />
      </div>
    </div>
  );
}

export default async function HelloVPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(INDIVIDUALS);
  const c = t.hellov;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/individuals" }, { label: c.crumb }]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        ctaLabel: c.closing.ctaLabel,
        ctaHref: "#plans",
        img: "/img/15-home-doorway.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <a href="#plans" className="btn btn-ink">{c.hero.cta}</a>
          <a href="#plans" className="btn btn-ghost">
            <span>{c.hero.plans}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.thirtyMin}</span>
          <span className="it">{c.strip.noApp}</span>
          <span className="it">{c.strip.price}</span>
          <span className="it">{c.strip.consent}</span>
        </div>
      </div>

      {/* the chat, and who people check */}
      <div className="wrap sec3">
        <SecHead k={c.chat.k} h={c.chat.h}>
          {c.chat.lede}
        </SecHead>
        <div className="body3 split3">
          <div>
            <div className="when3 tight">
              <div className="w">
                <div className="wt">{c.when.driver.wt}</div>
                <p className="wp">{c.when.driver.wp}</p>
                <span className="wm">{c.when.driver.wm}</span>
              </div>
              <div className="w">
                <div className="wt">{c.when.maid.wt}</div>
                <p className="wp">{c.when.maid.wp}</p>
                <span className="wm">{c.when.maid.wm}</span>
              </div>
              <div className="w">
                <div className="wt">{c.when.tenant.wt}</div>
                <p className="wp">{c.when.tenant.wp}</p>
                <span className="wm">{c.when.tenant.wm}</span>
              </div>
              <div className="w">
                <div className="wt">{c.when.online.wt}</div>
                <p className="wp">{c.when.online.wp}</p>
                <span className="wm">{c.when.online.wm}</span>
              </div>
            </div>
          </div>
          <div className="fig">
            <HelloVPhone />
          </div>
        </div>
      </div>

      {/* household packages — old CMS `basicPackage.packages` */}
      <div className="wrap sec3" id="plans">
        <SecHead k={c.plans.k} h={c.plans.h}>
          {c.plans.lede}
        </SecHead>
        <div className="body3 rack3">
          {PACKAGES.map((p) => {
            const item = c.plans.packages[p.key];
            const checks = p.checks.map((id) => c.plans.checks[id]);
            return (
              <ReceiptCard
                key={p.id}
                hd={c.plans.card.hd}
                tt={item.tt}
                sub={item.sub}
                checks={checks}
                priceLabel={c.plans.card.perPerson}
                price={item.price}
                inclGst={c.plans.card.inclGst}
                buy={c.plans.card.buy}
                packageDetails={{
                  packageType: "home",
                  packageId: p.id,
                  packageName: item.tt,
                  description: item.sub,
                  priceDisplay: item.price,
                  unitAmount: p.unitAmount,
                  includedChecks: [...checks],
                }}
              />
            );
          })}
        </div>
        <div className="pricenote">{c.plans.note}</div>
      </div>

      {/* single checks — old CMS `miniChecks` */}
      <div className="wrap sec3" id="singles">
        <SecHead k={c.singles.k} h={c.singles.h}>
          {c.singles.lede}
        </SecHead>
        <div className="body3 rack3">
          {SINGLES.map((p) => {
            const item = c.singles.cards[p.key];
            return (
              <ReceiptCard
                key={p.id}
                hd={c.plans.card.hd}
                tt={item.tt}
                sub={item.sub}
                checks={[item.tt]}
                priceLabel={c.plans.card.perCheck}
                price={item.price}
                inclGst={c.plans.card.inclGst}
                readyLabel={c.plans.card.readyIn}
                readyValue={item.ready}
                buy={c.plans.card.buy}
                packageDetails={{
                  packageType: "home",
                  packageId: p.id,
                  packageName: item.tt,
                  description: item.sub,
                  priceDisplay: item.price,
                  unitAmount: p.unitAmount,
                  includedChecks: [item.tt],
                }}
              />
            );
          })}
        </div>
      </div>

      {/* advanced packages — old CMS `hellovPremium` */}
      <div className="wrap sec3" id="advanced">
        <SecHead k={c.advanced.k} h={c.advanced.h}>
          {c.advanced.lede}
        </SecHead>
        <div className="body3 rack3">
          {ADVANCED.map((p) => {
            const item = c.advanced.packages[p.key];
            const checks = p.checks.map((id) => c.plans.checks[id]);
            return (
              <ReceiptCard
                key={p.id}
                hd={c.plans.card.hd}
                badge={p.popular ? c.advanced.badge : undefined}
                tt={item.tt}
                sub={item.sub}
                checks={checks}
                priceLabel={c.plans.card.perPerson}
                price={item.price}
                inclGst={c.plans.card.inclGst}
                buy={c.plans.card.buy}
                packageDetails={{
                  packageType: "home",
                  packageId: p.id,
                  packageName: item.tt,
                  description: item.sub,
                  priceDisplay: item.price,
                  unitAmount: p.unitAmount,
                  includedChecks: [...checks],
                }}
              />
            );
          })}
        </div>
      </div>

      {/* consent */}
      <div className="wrap sec3">
        <SecHead k={c.rule.k} h={c.rule.h}>
          {c.rule.lede}
        </SecHead>
        <Steps
          name={c.rule.h}
          items={[c.steps.agree, c.steps.check, c.steps.deleted]}
        />
      </div>

      <FaqSection
        head={c.faqHead}
        faqs={[c.faqs.knows, c.faqs.refuse, c.faqs.search, c.faqs.receive, c.faqs.thirty]}
      />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

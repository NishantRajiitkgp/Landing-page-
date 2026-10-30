/** /products/hellov — the old SPA's HelloV page: hero, intro, the Packages /
 *  Single Checks tabs. The Advanced Package cards came off on 16 Oct 2026;
 *  those tiers now sit inside the Packages widgets. */
import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { setRequestLocale } from "next-intl/server";
import { HelloVTabs, HelloVTabsBound, type Offer, type OfferLabels, type PackageKey, type Single } from "@/components/hellov/HelloVTabs";
import { INDIVIDUALS } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
import { liveBuyUrl, type LiveServiceKey } from "@/lib/hellostaff/live";

const PATH = "/products/hellov";

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

/** Every package tier buys on the Hello Staff storefront, the same
 *  `/buy/<package>-<tier>` links the homepage uses. */
const BUY_KEYS: Record<PackageKey, LiveServiceKey> = {
  driver: "driver",
  homeStaff: "homeStaff",
  tenant: "tenant",
  nanny: "nanny",
  verifyAnyone: "verifyAnyone",
  cyberIdentity: "cyberIdentity",
  knowIdentity: "knowIdentity",
  knowContact: "knowContact",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

/** BUILD-SPEC §8.2. No `offers`: the package names are translated per locale,
 *  so an English catalogue would fail the "name is on the page" check. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "HelloV — verification on WhatsApp",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function HelloVPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = (await copy(INDIVIDUALS)).hellov;
  const shop = (await copy(SECTIONS)).consumer.shop;
  const keys = Object.keys(c.packages.items) as PackageKey[];
  const offers: Offer[] = keys.map((key) => {
    const s = shop.services[key];
    const prices = { basic: "basicPrice" in s ? s.basicPrice : undefined, advanced: "price" in s ? s.price : undefined };
    const tier = (tk: "basic" | "advanced") => ({
      checks: s[tk],
      price: prices[tk],
      href: liveBuyUrl(BUY_KEYS[key], tk),
      external: true,
    });
    return { key, popular: key === "driver", basic: tier("basic"), advanced: tier("advanced") };
  });
  const labels: OfferLabels = {
    tiers: shop.tiers,
    popular: shop.popular,
    currency: shop.currency,
  };

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="wrap hero3 hv3-hero">
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="hv3-lead">{c.intro}</p>
      </div>

      <Suspense fallback={<HelloVTabs c={c} offers={offers} labels={labels} singles={SINGLES} />}>
        <HelloVTabsBound c={c} offers={offers} labels={labels} singles={SINGLES} />
      </Suspense>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

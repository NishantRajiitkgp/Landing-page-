/** /products/certifier — the old SPA's Certifier page in its order: hero
 *  (title, subtitle, Talk to Sales), We Verify What Matters Most (two tabs of
 *  four checks), How Certifier Works For Businesses? (four tabs beside an
 *  image slider), Industries We Serve, Why Businesses Should Consider
 *  Certifier?, the API-Driven Counterparty Platform (two slides of four).
 *  Copy is `certifier.base.json` word for word (`business.certifier`). */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
import { setRequestLocale } from "next-intl/server";
import { CertifierIcon, type CertifierIconId } from "@/components/certifier/CertifierIcons";
import { CertifierChecks, CHECKS_ID } from "@/components/certifier/CertifierChecks";
import { CertifierHow } from "@/components/certifier/CertifierHow";
import { CertSlider } from "@/components/certifier/CertSlider";
import { howPanels } from "@/components/certifier/HowPanels";
import { BUSINESS, type BusinessCopy } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

const PATH = "/products/certifier";

type C = BusinessCopy["certifier"];

/** Old CMS tab ids (the homepage deep-links them) and card icons. */
const CHECK_TABS = [
  ["business", "business-license-promoter", ["tradeLicense", "defaultingDirectors", "criminalRecords", "creditCompany"]],
  ["vendor", "vendor-credit-financial", ["financialAssessment", "gstScreening", "creditCheck", "promoterCriminal"]],
] as const satisfies readonly (readonly [keyof C["checks"]["tabs"], string, readonly CertifierIconId[]])[];

/** Old slider images, `public/img/certifier/`. */
const SLIDES = [
  ["Certifier_flow_slider1.jpg", 4096, 2731],
  ["Certifier_flow_slider2.jpg", 4096, 2730],
  ["Certifier_flow_slider3.png", 1480, 986],
  ["Certifier_flow_slider4.jpg", 4096, 2731],
] as const;

const INDUSTRIES: readonly [keyof C["industries"]["cards"], string, number, number][] = [
  ["realEstate", "real_state_industries.jpg", 4096, 2728],
  ["ecommerce", "e-commerce_industries.png", 740, 494],
  ["it", "it_industries.png", 1480, 833],
  ["retail", "retail_industries.jpg", 1480, 987],
];

const WHY: readonly [keyof C["why"]["cards"], CertifierIconId][] = [
  ["fast", "rocket"],
  ["blacklist", "scales"],
  ["monitoring", "userShield"],
  ["brand", "shield"],
];

const API: readonly (readonly [keyof C["api"]["cards"], CertifierIconId][])[] = [
  [
    ["mca", "mcaBuilding"],
    ["gst", "gstDocument"],
    ["owner", "ownerDirectorId"],
    ["company", "companyHighrise"],
  ],
  [
    ["bank", "bankClipboard"],
    ["global", "globePassport"],
    ["directorship", "directorshipChecklist"],
    ["credit", "companyCreditCard"],
  ],
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
  name: "Certifier — vendor due diligence",
  description: copyFor(PATH).description,
  serviceType: "Vendor due diligence",
};

export default async function CertifierPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = (await copy(BUSINESS)).certifier;
  const h = c.how;

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="cf4">
        <div className="wrap cf4-hero">
          <h1 className="h1">{c.hero.h1}</h1>
          <p className="sub">{c.hero.sub}</p>
          <div className="hrow">
            <AppLink href="/contact?tab=enquiry" className="btn btn-ink">
              {c.hero.cta}
              <Arrow />
            </AppLink>
          </div>
        </div>

        <section className="wrap sec3" id={CHECKS_ID} aria-labelledby="cf4-checks-h">
          <div className="cf4-head">
            <h2 className="h2" id="cf4-checks-h">{c.checks.h}</h2>
            <p className="lede">{c.checks.sub}</p>
          </div>
          <CertifierChecks
            tabs={CHECK_TABS.map(([k, id, icons]) => ({
              id,
              label: c.checks.tabs[k].label,
              cards: icons.map((icon) => {
                const card = (c.checks.tabs[k].cards as Record<string, { t: string; p: string }>)[icon];
                return { icon, t: card.t, p: card.p };
              }),
            }))}
          />
        </section>

        <section className="wrap sec3" id="certifier-how-it-works" aria-labelledby="cf4-how-h">
          <div className="cf4-head cf4-how-head">
            <h2 className="h2" id="cf4-how-h">{h.h}</h2>
            <div>
              {h.intro.map((x) => (
                <p key={x} className="lede">{x}</p>
              ))}
            </div>
          </div>
          <CertifierHow
            tabs={(["onboarding", "monitoring", "statutory", "agreement"] as const).map((k) => ({ k, label: h.tabs[k] }))}
            panels={howPanels(h)}
            slider={
              <CertSlider
                key="slider"
                autoplay
                className="cert3-shots"
                slides={SLIDES.map(([f, w, ht], i) => (
                  <Image key={f} src={`/img/certifier/${f}`} alt={h.slides[i]} width={w} height={ht} sizes="(max-width: 900px) 100vw, 640px" />
                ))}
              />
            }
          />
        </section>

        <section className="wrap sec3" id="certifier-industries-we-serve" aria-labelledby="cf4-ind-h">
          <div className="cf4-head">
            <h2 className="h2" id="cf4-ind-h">{c.industries.h}</h2>
            <p className="lede">{c.industries.p}</p>
          </div>
          <ul className="cf4-ind">
            {INDUSTRIES.map(([k, f, w, ht]) => (
              <li key={k}>
                <span className="ph">
                  <Image src={`/img/certifier/${f}`} alt={c.industries.cards[k].alt} width={w} height={ht} sizes="(max-width: 900px) 50vw, 320px" />
                </span>
                <h3>{c.industries.cards[k].t}</h3>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap sec3" id="certifier-why-consider" aria-labelledby="cf4-why-h">
          <div className="cf4-head">
            <h2 className="h2" id="cf4-why-h">{c.why.h}</h2>
            <p className="lede">{c.why.p}</p>
          </div>
          <ul className="cf4-grid">
            {WHY.map(([k, icon]) => (
              <li key={k}>
                <span className="glyph" aria-hidden="true">
                  <CertifierIcon id={icon} />
                </span>
                <h3>{c.why.cards[k].t}</h3>
                <p>{c.why.cards[k].p}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap sec3" id="certifier-api-counterparty-platform" aria-labelledby="cf4-api-h">
          <div className="cf4-head">
            <h2 className="h2" id="cf4-api-h">{c.api.h}</h2>
            <p className="lede">{c.api.p}</p>
          </div>
          <CertSlider
            dots
            className="cert3-api"
            slides={API.map((slide, i) => (
              <ul key={i} className="cf4-grid">
                {slide.map(([k, icon]) => (
                  <li key={k}>
                    <span className="glyph" aria-hidden="true">
                      <CertifierIcon id={icon} />
                    </span>
                    <h3>{c.api.cards[k].t}</h3>
                    <p>{c.api.cards[k].p}</p>
                  </li>
                ))}
              </ul>
            ))}
          />
        </section>
      </div>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import type { ServiceFacts } from "@/lib/seo/schema/service";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { setRequestLocale } from "next-intl/server";
import { INDIVIDUALS } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/individuals/home-family";


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
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. `name` and `serviceType` stay here rather than in the dictionary —
 *  see `lib/copy/individuals.en.tsx`, and `lib/copy/business.en.tsx` before
 *  it, on why a schema.org node is not a copy surface. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Home and family background checks",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  /** Almost every prop below is now a leaf: this file is a `VerticalPage`
   *  client, so its copy arrives as props rather than as JSX text, and
   *  `VerticalPage`'s own eleven words are `lib/copy/templates` and unchanged.
   *  What stays HERE is structure — the order of the lanes, pills, steps, rows
   *  and FAQs, every href, and `fast`, which picks a CSS modifier from a fact
   *  about turnaround. */
  const t = await copy(INDIVIDUALS);
  const c = t.homeFamily;

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: t.crumb, href: "/individuals" }, { label: c.crumb }]}
      eyebrow={c.eyebrow}
      h1={c.h1}
      sub={c.sub}
      primary={{ label: c.primary, href: "/products/hellov#hellov-product-tabs" }}
      secondary={{ label: c.secondary, href: "/products/hellov?tab=single#hellov-product-tabs" }}
      strip={[c.strip.thirtyMin, c.strip.price, c.strip.whatsapp, c.strip.consent]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2). Figures are the live HelloV
         catalogue — same SKUs as `/products/hellov`. No second household
         package is invented here; CTAs go to that page. */
      verifyHead={c.verifyHead}
      verifyLede={c.verifyLede}
      laneCols={3}
      lanes={[
        {
          ...c.lanes.identity,
          pills: [
            { ...c.pills.identity, fast: true },
            { ...c.pills.photoMatch, fast: true },
            { ...c.pills.age, fast: true },
            { ...c.pills.licence, fast: true },
          ],
        },
        {
          ...c.lanes.record,
          pills: [
            { ...c.pills.criminal, fast: true },
            { ...c.pills.globalDatabase, fast: true },
          ],
        },
        {
          ...c.lanes.address,
          pills: [
            { ...c.pills.currentAddress, fast: true },
            { ...c.pills.previousEmployment, fast: true },
          ],
        },
      ]}
      stepsHead={c.stepsHead}
      stepsLede={c.stepsLede}
      steps={[c.steps.you, c.steps.them, c.steps.report]}
      tableHead={c.tableHead}
      tableLede={c.tableLede}
      rows={[
        { ...c.rows.identity, fast: true },
        { ...c.rows.globalDatabase, fast: true },
        { ...c.rows.licence, fast: true },
        { ...c.rows.criminal, fast: true },
        { ...c.rows.address, fast: true },
        { ...c.rows.previousEmployment, fast: true },
      ]}
      tableNote={c.tableNote}
      /* This section renders `VerticalPage`'s certification cards, so the
         answer deliberately says nothing about which credentials are held:
         that list lives in `lib/content/company.ts` and on
         `/platform/security-compliance`, and `check:llms` gates it. Restating
         it in a lede on six vertical pages is how those copies drift. The
         answer takes the consent-and-retention half, as the old lede did. */
      complianceHead={c.complianceHead}
      complianceLede={c.complianceLede}
      faqHead={c.faqHead}
      faqs={[c.faqs.awkward, c.faqs.noDocuments, c.faqs.clean, c.faqs.agency]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        ctaLabel: c.closing.ctaLabel,
        ctaHref: "/products/hellov#hellov-product-tabs",
        img: "/img/people/04-nanny-gurugram.jpg",
      }}
    />
  );
}

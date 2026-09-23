import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import type { ServiceFacts } from "@/lib/seo/schema/service";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { INDIVIDUALS } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/individuals/immigration";


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
 *  see `lib/copy/individuals.en.tsx`. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Visa and immigration document screening",
  description: copyFor(PATH).description,
  serviceType: "Document verification",
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
  /** As on `/individuals/home-family`: a `VerticalPage` client, so its copy is
   *  props and the order of every list, each href and `fast` stay here. */
  const t = await copy(INDIVIDUALS);
  const c = t.immigration;

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: t.crumb, href: "/individuals" }, { label: c.crumb }]}
      eyebrow={c.eyebrow}
      h1={c.h1}
      sub={c.sub}
      primary={{ label: c.primary, href: "https://app.helloverify.com" }}
      secondary={{ label: c.secondary, href: "#turnaround" }}
      strip={[c.strip.countries, c.strip.sources, c.strip.degree, c.strip.yours]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2). Four head/lede pairs, which
         `VerticalPage` renders as the section H2 and lede: each heading is now
         the question an applicant types, each lede a self-contained answer at
         42, 45, 43 and 43 words that names visa screening rather than saying
         "all three" or "the whole thing" (§11a.2 rule 3).

         Numbers come from this page's own strip, `lanes` and `rows`. One is
         deliberately absent: entitlement to work carries no turnaround here,
         because its time is one side of the three-way disagreement TASKS.md
         records between `lib/content/checks.ts`, the homepage and the
         enterprise page — a citeable sentence is the worst place to pick a
         side by accident. Same omission as `/business/employee-verification`. */
      verifyHead={c.verifyHead}
      verifyLede={c.verifyLede}
      lanes={[
        {
          ...c.lanes.documents,
          pills: [
            { ...c.pills.identity, fast: true },
            { ...c.pills.passport, fast: true },
            { ...c.pills.age, fast: true },
            { ...c.pills.currentAddress, fast: true },
          ],
        },
        {
          ...c.lanes.claims,
          pills: [
            { ...c.pills.education },
            { ...c.pills.employment },
            { ...c.pills.digitalEmployment, fast: true },
            { ...c.pills.entitlementToWork, fast: true },
          ],
        },
        {
          ...c.lanes.record,
          pills: [
            { ...c.pills.criminal, fast: true },
            { ...c.pills.globalDatabase, fast: true },
            { ...c.pills.credit, fast: true },
          ],
        },
      ]}
      stepsHead={c.stepsHead}
      stepsLede={c.stepsLede}
      steps={[c.steps.upload, c.steps.check, c.steps.fix]}
      tableHead={c.tableHead}
      tableLede={c.tableLede}
      rows={[
        { ...c.rows.identity, fast: true },
        { ...c.rows.globalDatabase, fast: true },
        { ...c.rows.criminal, fast: true },
        { ...c.rows.digitalEmployment, fast: true },
        { ...c.rows.employment },
        { ...c.rows.education },
      ]}
      /* The one function leaf in this namespace: the sentence ends in a link
         whose href and inline style the page owns, so the leaf takes the node
         and may put it anywhere a locale needs it. The text child still ends
         in a space before the node, which is why the leaf is written on one
         line — see `lib/copy/individuals.en.tsx`. */
      tableNote={c.tableNote(
        <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>{c.globalCoverage}</AppLink>,
      )}
      /* As on `/individuals/home-family`, this section renders the template's
         certification cards and the answer stays off that subject: which
         credentials are held is owned by `lib/content/company.ts` and
         `/platform/security-compliance`, and gated by `check:llms`. */
      complianceHead={c.complianceHead}
      complianceLede={c.complianceLede}
      faqHead={c.faqHead}
      faqs={[c.faqs.accept, c.faqs.closed, c.faqs.abroad, c.faqs.employer]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        ctaLabel: c.closing.ctaLabel,
        ctaHref: "https://app.helloverify.com",
        img: "/img/14-visa-counter.jpg",
      }}
    />
  );
}

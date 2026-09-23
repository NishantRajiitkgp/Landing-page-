import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import type { ServiceFacts } from "@/lib/seo/schema/service";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { GOVERNMENTS, type Lanes, type Rows } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/governments/trade";


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
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Verification for trade and business authorities",
  description: copyFor(PATH).description,
  serviceType: "Business registry verification",
};

/** Which lanes, which pills, in which order, and which render `.fast` —
 *  structure, and it stays; the names and the times are the dictionary's,
 *  keyed by `LaneKey<"trade">` and `PillKey<"trade">`. See
 *  `/governments/health` for the full argument. */
const LANES: Lanes<"trade"> = [
  {
    k: "entity",
    pills: [
      { p: "tradeLicence" },
      { p: "companyRegistration" },
      { p: "directorsGst" },
      { p: "credit", fast: true },
    ],
  },
  {
    k: "people",
    pills: [
      { p: "identity", fast: true },
      { p: "criminal", fast: true },
      { p: "defaultingDirectors" },
      { p: "promoterCriminal" },
    ],
  },
  {
    k: "risk",
    pills: [
      { p: "globalDatabase", fast: true },
      { p: "financialAssessment" },
      { p: "gstScreening" },
    ],
  },
];

const ROWS: Rows<"trade"> = [
  { k: "credit", fast: true },
  { k: "globalDatabase", fast: true },
  { k: "criminal", fast: true },
  { k: "tradeLicence" },
  { k: "financialAssessment" },
  { k: "directorsGst" },
];

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
  const t = await copy(GOVERNMENTS);
  const d = t.trade;

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: t.crumb, href: "/governments" }, { label: d.crumb }]}
      eyebrow={d.eyebrow}
      h1={d.h1}
      sub={d.sub}
      secondary={{ label: d.secondary, href: "#turnaround" }}
      strip={[d.strip.profile, d.strip.countries, d.strip.checks, d.strip.certs]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2), all four sections of this template.
         Each `*Head` is the question a licensing authority types and each
         `*Lede` a self-contained answer of 35-45 words naming the business and
         the authority, rather than "Company filings and screening return
         quickly" — "quickly" is not a number and the sentence names no
         subject, so it cannot be cited once lifted (§11a.2 rule 3). The
         template owns the `k` eyebrows and they are untouched.

         Times and sources are the `lanes` pills and the `rows` table on this
         page. **"Directors & GST" is deliberately quoted nowhere**, although
         it is a 3-day pill and a 3-day row here: TASKS.md records that check
         as disputed between `lib/content/checks.ts` and enterprise (3 days)
         and the homepage (2 days), and a citeable sentence is the worst place
         to pick a side by accident. */
      verifyHead={d.verifyHead}
      verifyLede={d.verifyLede}
      lanes={LANES.map((l) => ({
        ...d.lanes[l.k],
        pills: l.pills.map((p) => ({ ...d.pills[p.p], fast: p.fast })),
      }))}
      stepsHead={d.stepsHead}
      stepsLede={d.stepsLede}
      steps={[d.steps.file, d.steps.read, d.steps.confirm, d.steps.decide]}
      tableHead={d.tableHead}
      tableLede={d.tableLede}
      rows={ROWS.map((r) => ({ ...d.rows[r.k], fast: r.fast }))}
      tableNote={d.note(
        <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>{t.coverageLink}</AppLink>,
      )}
      complianceHead={d.complianceHead}
      complianceLede={d.complianceLede}
      faqHead={d.faqHead}
      faqs={[d.faqs.parents, d.faqs.renewals, d.faqs.conflicts, d.faqs.book]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
        img: "/img/06-supplier-cairo.jpg",
      }}
    />
  );
}

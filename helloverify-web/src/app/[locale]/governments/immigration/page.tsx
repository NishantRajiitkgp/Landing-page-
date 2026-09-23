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
const PATH = "/governments/immigration";


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
  name: "Verification for immigration authorities",
  description: copyFor(PATH).description,
  serviceType: "Document verification",
};

/** Which lanes, which pills, in which order, and which render `.fast` —
 *  structure, and it stays; the names and the times are the dictionary's,
 *  keyed by `LaneKey<"immigration">` and `PillKey<"immigration">`. See
 *  `/governments/health`'s copy of this note for the full argument. */
const LANES: Lanes<"immigration"> = [
  {
    k: "identity",
    pills: [
      { p: "identity", fast: true },
      { p: "passport", fast: true },
      { p: "age", fast: true },
      { p: "face", fast: true },
    ],
  },
  {
    k: "grounds",
    pills: [
      { p: "education" },
      { p: "employment" },
      { p: "digitalEmployment", fast: true },
      { p: "entitlementToWork", fast: true },
      { p: "tradeLicence" },
    ],
  },
  {
    k: "admissibility",
    pills: [
      { p: "globalDatabase", fast: true },
      { p: "criminal", fast: true },
      { p: "credit", fast: true },
      { p: "currentAddress", fast: true },
    ],
  },
];

const ROWS: Rows<"immigration"> = [
  { k: "identity", fast: true },
  { k: "globalDatabase", fast: true },
  { k: "criminal", fast: true },
  { k: "digitalEmployment", fast: true },
  { k: "employment" },
  { k: "education" },
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
  const d = t.immigration;

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: t.crumb, href: "/governments" }, { label: d.crumb }]}
      eyebrow={d.eyebrow}
      h1={d.h1}
      sub={d.sub}
      secondary={{ label: d.secondary, href: "#turnaround" }}
      strip={[d.strip.countries, d.strip.screen, d.strip.offices, d.strip.certs]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2), all four sections of this template.
         Each `*Head` is now the question an immigration official types and
         each `*Lede` a self-contained answer of 35-45 words naming visa
         applicants and the authority, rather than opening on "Screening" with
         no subject — a lede that depends on the heading above it stops being
         an answer the moment an engine lifts it away (§11a.2 rule 3). The
         template owns the `k` eyebrows and they are untouched.

         Times and sources come from the `lanes` pills and the `rows` table on
         this page. One is deliberately absent: **entitlement to work**, whose
         turnaround TASKS.md records as disputed three ways between
         `lib/content/checks.ts`, the homepage and the enterprise page. It is a
         pill in lane 02 here, but a citeable sentence is the worst place to
         pick a side of that disagreement by accident. */
      verifyHead={d.verifyHead}
      verifyLede={d.verifyLede}
      lanes={LANES.map((l) => ({
        ...d.lanes[l.k],
        pills: l.pills.map((p) => ({ ...d.pills[p.p], fast: p.fast })),
      }))}
      stepsHead={d.stepsHead}
      stepsLede={d.stepsLede}
      steps={[d.steps.submit, d.steps.screen, d.steps.confirm, d.steps.decide]}
      tableHead={d.tableHead}
      tableLede={d.tableLede}
      rows={ROWS.map((r) => ({ ...d.rows[r.k], fast: r.fast }))}
      tableNote={d.note(
        <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>{t.coverageLink}</AppLink>,
      )}
      complianceHead={d.complianceHead}
      complianceLede={d.complianceLede}
      faqHead={d.faqHead}
      faqs={[d.faqs.noPresence, d.faqs.remote, d.faqs.file, d.faqs.integration]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
        img: "/img/14-visa-counter.jpg",
      }}
    />
  );
}

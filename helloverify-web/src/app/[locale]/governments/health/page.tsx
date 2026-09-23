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
const PATH = "/governments/health";


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
  name: "Verification for health authorities",
  description: copyFor(PATH).description,
  serviceType: "Credential verification",
};

/** Which lanes, which pills, in which order, and which render `.fast` —
 *  structure, and it stays. The names and the times are
 *  `lib/copy/governments`'s, keyed by `LaneKey<"health">` and
 *  `PillKey<"health">`, so a lane or a pill added without copy is TS2322 on
 *  this array in every locale at once. `fast` is a CSS class, not a word. The
 *  shape is `LANES` on `/business/enterprise`, for the reason
 *  `lib/copy/index.ts` argues under "Where the keys come from". */
const LANES: Lanes<"health"> = [
  {
    k: "identity",
    pills: [
      { p: "identity", fast: true },
      { p: "passport", fast: true },
      { p: "age", fast: true },
      { p: "currentAddress", fast: true },
    ],
  },
  {
    k: "qualification",
    pills: [
      { p: "medicalDegree" },
      { p: "postGraduate" },
      { p: "councilRegistration" },
      { p: "internship" },
    ],
  },
  {
    k: "standing",
    pills: [
      { p: "globalDatabase", fast: true },
      { p: "criminal", fast: true },
      { p: "employmentHistory" },
      { p: "disciplinary" },
    ],
  },
];

/** Same split as `LANES`: the six rows' order and their `.fast` flag here,
 *  their four strings in the dictionary under the same keys. */
const ROWS: Rows<"health"> = [
  { k: "identity", fast: true },
  { k: "criminal", fast: true },
  { k: "globalDatabase", fast: true },
  { k: "councilRegistration" },
  { k: "medicalDegree" },
  { k: "disciplinary" },
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
  const d = t.health;

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: t.crumb, href: "/governments" }, { label: d.crumb }]}
      eyebrow={d.eyebrow}
      h1={d.h1}
      sub={d.sub}
      secondary={{ label: d.secondary, href: "#turnaround" }}
      strip={[d.strip.countries, d.strip.degree, d.strip.checks, d.strip.certs]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2), all four sections of this template.
         Each `*Head` is now the question a licensing official types and each
         `*Lede` is a self-contained answer of 35-45 words that names health
         authorities and clinicians rather than saying "green means" or "this
         check" — a lede that points outside itself is unciteable once an
         engine lifts it off the page (§11a.2 rule 3). The template owns the
         `k` eyebrows ("What we verify", "How it works", "Turnaround &
         coverage", "Compliance & security") and they are untouched — they are
         `templates.bands` in the copy layer, not this page's.

         Every figure below is already on this page: the times come from the
         `lanes` pills and the `rows` table beneath each block, and the sources
         ("the medical council", "the university registrar") are the `src`
         column verbatim. Nothing new is asserted about a clinician or an
         institution. */
      verifyHead={d.verifyHead}
      verifyLede={d.verifyLede}
      lanes={LANES.map((l) => ({
        ...d.lanes[l.k],
        pills: l.pills.map((p) => ({ ...d.pills[p.p], fast: p.fast })),
      }))}
      stepsHead={d.stepsHead}
      stepsLede={d.stepsLede}
      steps={[d.steps.submit, d.steps.read, d.steps.confirm, d.steps.decide]}
      tableHead={d.tableHead}
      tableLede={d.tableLede}
      rows={ROWS.map((r) => ({ ...d.rows[r.k], fast: r.fast }))}
      /* `note` is a FUNCTION leaf taking the anchor — the shape
         `lib/copy/index.ts` describes for a sentence wrapping something the
         component owns. A plain string would have had to end in a space to
         keep the byte, and an edge-whitespace leaf is what
         `tools/test/copy.test.ts` §3 rejects. */
      tableNote={d.note(
        <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>{t.coverageLink}</AppLink>,
      )}
      complianceHead={d.complianceHead}
      complianceLede={d.complianceLede}
      faqHead={d.faqHead}
      faqs={[d.faqs.abroad, d.faqs.offline, d.faqs.forgery, d.faqs.volume]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
        img: "/img/02-nurse-abudhabi.jpg",
      }}
    />
  );
}

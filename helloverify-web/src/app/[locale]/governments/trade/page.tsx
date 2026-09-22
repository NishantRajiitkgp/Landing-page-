import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import type { ServiceFacts } from "@/lib/seo/schema/service";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

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

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: "Governments", href: "/governments" }, { label: "Trade & business" }]}
      eyebrow="Governments · Trade & business authorities"
      h1={<>Licence the business. <em>Know the people.</em></>}
      sub="A company is a filing and a group of humans. Before a trade licence is granted or renewed, we confirm both — at the registry that holds the record, not the applicant's letterhead."
      secondary={{ label: "See turnaround times", href: "#turnaround" }}
      strip={[
        <><b>2 days</b> to a certified entity profile</>,
        <><b>120+</b> countries of company records</>,
        <><b>20M+</b> checks at the primary source</>,
        <><span className="dot" /> ISO 27001 · GDPR</>,
      ]}
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
      verifyHead="What does a licensing authority verify about a business?"
      verifyLede="A licensing authority verifies the entity, the people behind it and the risk on record. Credit, identity and watchlist screens return in 15 minutes, a criminal record in 30; trade licence, company registration, defaulting directors and financial assessment each take two days."
      lanes={[
        {
          gt: "01 — The entity",
          gh: "What is filed",
          pills: [
            { n: "Trade licence", t: "2 days" },
            { n: "Company registration", t: "2 days" },
            { n: "Directors & GST", t: "3 days" },
            { n: "Credit", t: "15 min", fast: true },
          ],
        },
        {
          gt: "02 — The people",
          gh: "Who stands behind it",
          pills: [
            { n: "Identity", t: "15 min", fast: true },
            { n: "Criminal", t: "30 min", fast: true },
            { n: "Defaulting directors", t: "2 days" },
            { n: "Promoter criminal history", t: "2 days" },
          ],
        },
        {
          gt: "03 — Risk",
          gh: "What the record says",
          pills: [
            { n: "Global database", t: "15 min", fast: true },
            { n: "Financial assessment", t: "2 days" },
            { n: "GST screening", t: "2 days" },
          ],
        },
      ]}
      stepsHead="How does a licensing authority verify a company and its directors?"
      stepsLede="Company documents and director identities arrive through a link or the authority's portal. HelloVerify AI parses the filings and resolves registration numbers, then licence registers, company registries, courts and credit bureaus each confirm the facts they hold. The authority receives a certified entity profile."
      steps={[
        { n: "01 · The applicant", t: "File", p: "Company documents and director identities submitted through a link or your own portal." },
        { n: "02 · HelloVerify AI", t: "Read", p: "Filings parsed, registration numbers resolved, the holding registry identified automatically." },
        { n: "03 · The registries", t: "Confirm", p: "Licence registers, company registries, courts and credit bureaus — each fact checked where it is filed." },
        { n: "04 · The authority", t: "Decide", p: "A certified entity profile with sources, dates, and renewal reminders before anything goes stale." },
      ]}
      tableHead="How long does business and trade licence verification take?"
      tableLede="Business verification returns credit and global database screens in 15 minutes and a director or promoter criminal record in 30 minutes. Two days confirm a trade licence at the licence register and a financial assessment from tax and filing records."
      rows={[
        { nm: "Credit screen", sub: "ratings, defaults, exposure", tm: "15 min", fast: true, src: "credit bureaus" },
        { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Criminal record", sub: "directors and promoters", tm: "30 min", fast: true, src: "court records" },
        { nm: "Trade licence", sub: "number, status, validity", tm: "2 days", src: "the licence register" },
        { nm: "Financial assessment", sub: "filings, GST behaviour, solvency", tm: "2 days", src: "tax & filing records" },
        { nm: "Directors & GST", sub: "beneficial owners, disqualifications", tm: "3 days", src: "the company registry" },
      ]}
      tableNote={<>Times shown are from filing to result · company records verified in the country of registration — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></>}
      complianceHead="Does a verification profile hold up on appeal?"
      complianceLede="A licensing refusal can be appealed, so every fact in a HelloVerify entity profile carries its source, its date and the artefact behind it. Security management is ISO 27001 certified and independently audited, handling is GDPR-aligned, and HelloVerify is a PBSA member."
      faqHead={<>From licensing<br />authorities.</>}
      faqs={[
        {
          q: "Can you verify foreign parent companies?",
          a: "Yes — a local subsidiary's foreign parent is checked in its own country of registration, through the same pipeline that covers 120+ countries. Cross-border ownership chains are shown as a chain, not a footnote.",
        },
        {
          q: "How do you handle renewals?",
          a: "Every certified profile carries expiry dates for each underlying fact. Renewals re-run automatically before a licence, rating or director record goes stale, so enforcement isn't working from last year's picture.",
        },
        {
          q: "What happens when registries disagree?",
          a: "The profile shows both records and flags the conflict for an officer rather than picking a winner. Reconciling contradictory filings is a judgement the authority makes, not a vendor.",
        },
        {
          q: "Can this run across our whole licence book?",
          a: "Yes. Batch runs process an entire register in parallel — thousands of entities in days — which is how authorities move from application-time checks to continuous oversight.",
        },
      ]}
      closing={{
        heading: <>Grant the licence. <em>Keep the file.</em></>,
        sub: "Tell us the licence categories and register size. We'll scope a pilot.",
        img: "/img/06-supplier-cairo.jpg",
      }}
    />
  );
}

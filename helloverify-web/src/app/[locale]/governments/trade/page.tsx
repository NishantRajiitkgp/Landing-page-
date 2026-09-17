import type { Metadata } from "next";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Verification for trade & business authorities — HelloVerify",
  description:
    "Company registrations, trade licences and the people behind them — verified at the registry for licensing and enforcement decisions.",
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
      verifyHead={<>The entity,<br />and its humans.</>}
      verifyLede="Company filings and screening return quickly; director histories and financial assessments take days, because they're assembled from several registries."
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
      stepsHead={<>From application<br />to licence, evidenced.</>}
      stepsLede="Applicants submit once. The authority receives a profile that states what was checked, where, and when it expires."
      steps={[
        { n: "01 · The applicant", t: "File", p: "Company documents and director identities submitted through a link or your own portal." },
        { n: "02 · HelloVerify AI", t: "Read", p: "Filings parsed, registration numbers resolved, the holding registry identified automatically." },
        { n: "03 · The registries", t: "Confirm", p: "Licence registers, company registries, courts and credit bureaus — each fact checked where it is filed." },
        { n: "04 · The authority", t: "Decide", p: "A certified entity profile with sources, dates, and renewal reminders before anything goes stale." },
      ]}
      tableHead={<>Times, and the<br />registry behind them.</>}
      tableLede="Measured from filing to result. Entity checks are quoted in days because several registries must agree before a profile is certified."
      rows={[
        { nm: "Credit screen", sub: "ratings, defaults, exposure", tm: "15 min", fast: true, src: "credit bureaus" },
        { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Criminal record", sub: "directors and promoters", tm: "30 min", fast: true, src: "court records" },
        { nm: "Trade licence", sub: "number, status, validity", tm: "2 days", src: "the licence register" },
        { nm: "Financial assessment", sub: "filings, GST behaviour, solvency", tm: "2 days", src: "tax & filing records" },
        { nm: "Directors & GST", sub: "beneficial owners, disqualifications", tm: "3 days", src: "the company registry" },
      ]}
      tableNote={<>Times shown are from filing to result · company records verified in the country of registration — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></>}
      complianceHead={<>Enforcement-grade<br />evidence.</>}
      complianceLede="A licensing refusal can be appealed. Every fact in a profile carries its source, its date and the artefact behind it — built to hold up."
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

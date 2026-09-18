import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { VerticalPage } from "@/components/templates/VerticalPage";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

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
      crumbs={[{ label: "Governments", href: "/governments" }, { label: "Immigration authorities" }]}
      eyebrow="Governments · Immigration authorities"
      h1={<>Check the document <em>where it was issued.</em></>}
      sub="A visa decision rests on papers from somewhere else. We verify them in the country that issued them — with the registry, the university, the employer — before the stamp."
      secondary={{ label: "See turnaround times", href: "#turnaround" }}
      strip={[
        <><b>120+</b> countries, checked in-country</>,
        <><b>15 min</b> identity &amp; watchlist screen</>,
        <><b>6</b> offices across twelve hours</>,
        <><span className="dot" /> ISO 27001 · GDPR</>,
      ]}
      verifyHead={<>The applicant,<br />and their paper trail.</>}
      verifyLede="Screening runs in minutes; anything needing a foreign registrar or employer comes back in days — with the office that answered named in the file."
      lanes={[
        {
          gt: "01 — Identity",
          gh: "Who is applying",
          pills: [
            { n: "Identity", t: "15 min", fast: true },
            { n: "Passport", t: "15 min", fast: true },
            { n: "Age", t: "15 min", fast: true },
            { n: "Face vs. selfie", t: "seconds", fast: true },
          ],
        },
        {
          gt: "02 — Grounds",
          gh: "Why they qualify",
          pills: [
            { n: "Education", t: "3 days" },
            { n: "Employment", t: "2 days" },
            { n: "Digital employment", t: "60 min", fast: true },
            { n: "Entitlement to work", t: "60 min", fast: true },
            { n: "Trade licence", t: "2 days" },
          ],
        },
        {
          gt: "03 — Admissibility",
          gh: "What the record says",
          pills: [
            { n: "Global database", t: "15 min", fast: true },
            { n: "Criminal", t: "30 min", fast: true },
            { n: "Credit", t: "15 min", fast: true },
            { n: "Current address", t: "30 min", fast: true },
          ],
        },
      ]}
      stepsHead={<>One applicant file,<br />four borders away.</>}
      stepsLede="Applicants submit from their own country on their own phone. Every check runs where the document lives, and the file assembles itself."
      steps={[
        { n: "01 · The applicant", t: "Submit", p: "A one-time link, consent, and photographs of the documents — no appointment, no courier." },
        { n: "02 · HelloVerify AI", t: "Screen", p: "Fields extracted, forgery checks run, identity and watchlist screens returned in minutes." },
        { n: "03 · In-country", t: "Confirm", p: "Our team in the issuing country confirms with the registrar, employer or authority that holds the record." },
        { n: "04 · The authority", t: "Decide", p: "A single file per applicant — each result with its source, date and evidence attached." },
      ]}
      tableHead={<>Times that hold<br />across borders.</>}
      tableLede="Measured from submission to result. Screening is immediate; source confirmation depends on the foreign institution, and the file always says which one."
      rows={[
        { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Digital employment", sub: "contribution-backed work history", tm: "60 min", fast: true, src: "provident fund records" },
        { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
        { nm: "Education", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
      ]}
      tableNote={<>Times shown are from submission to result · documents verified in the country of issue — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></>}
      complianceHead={<>Applicant data,<br />handled lawfully.</>}
      complianceLede="Cross-border verification means cross-border data. Consent is captured per applicant, transfers are documented, and retention is bounded by the DPA."
      faqHead={<>From immigration<br />departments.</>}
      faqs={[
        {
          q: "How do you verify a document from a country we have no presence in?",
          a: "Six offices and a partner network reach 120+ countries. The check is executed in the issuing country by people who know that registry's process — an Egyptian trade licence is confirmed in Cairo, not inferred from a scan.",
        },
        {
          q: "Can applicants submit without travelling to a centre?",
          a: "Yes. A one-time link works on any phone — consent, capture and quality checks happen in the applicant's hand, wherever they are.",
        },
        {
          q: "What does the authority actually receive?",
          a: "One file per applicant: every check, its result, the source that confirmed it, the date, and the supporting evidence. It is built to be defended in an appeal, not just read.",
        },
        {
          q: "Does this integrate with our case management system?",
          a: "Yes — REST API and webhooks push results into an existing case file, or officers can work from the HelloVerify console. Bulk submission handles seasonal application waves.",
        },
      ]}
      closing={{
        heading: <>Decide on evidence, <em>not on paperwork.</em></>,
        sub: "Tell us the visa categories and the volume. We'll scope a pilot.",
        img: "/img/14-visa-counter.jpg",
      }}
    />
  );
}

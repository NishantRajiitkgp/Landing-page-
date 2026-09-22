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
const PATH = "/governments/manpower-education";


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
  name: "Verification for manpower and education authorities",
  description: copyFor(PATH).description,
  serviceType: "Credential verification",
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
      crumbs={[{ label: "Governments", href: "/governments" }, { label: "Manpower & education" }]}
      eyebrow="Governments · Manpower & education"
      h1={<>Work passes, issued <em>on verified facts.</em></>}
      sub="Foreign workers arrive with credentials from everywhere. We confirm each one with the institution that issued it — the workflow already running with Singapore's Ministry of Manpower."
      secondary={{ label: "Read the Ministry of Manpower story", href: "/governments/manpower-education/ministry-of-manpower" }}
      strip={[
        <><b>Ministry of Manpower</b> · Singapore</>,
        <><b>120+</b> countries of credentials</>,
        <><b>3 days</b> degree at the registrar</>,
        <><span className="dot" /> ISO 27001 · GDPR · PBSA</>,
      ]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2), all four sections of this template.
         Each `*Head` is the question a manpower ministry types and each
         `*Lede` a self-contained answer of 35-45 words naming work passes and
         the ministry, rather than "Identity and records resolve within the
         hour" — which is true and unciteable, because nothing in it says what
         is being verified (§11a.2 rule 3). The template owns the `k` eyebrows
         and they are untouched.

         Times and sources are the `lanes` pills and the `rows` table on this
         page. **Entitlement to work's 60 minutes is deliberately not quoted**
         in any of the four answers, although it is a pill and a table row
         here: TASKS.md records that turnaround as disputed three ways between
         `lib/content/checks.ts`, the homepage and the enterprise page, and a
         citeable sentence is the worst place to pick a side by accident.

         Singapore's Ministry of Manpower is named only where the page already
         names it (the strip, the `secondary` link and the FAQ) — a wrong claim
         about a government client is worse than a bland heading. */
      verifyHead="What does a manpower ministry verify before issuing a work pass?"
      verifyLede="Before issuing a work pass, a ministry verifies identity, credentials and records. Identity and a global database screen take 15 minutes, a criminal record 30; employment is confirmed with the employer in two days, education or trade certification with the issuing institution in three."
      lanes={[
        {
          gt: "01 — Identity",
          gh: "Who arrived",
          pills: [
            { n: "Identity", t: "15 min", fast: true },
            { n: "Passport", t: "15 min", fast: true },
            { n: "Age", t: "15 min", fast: true },
            { n: "Entitlement to work", t: "60 min", fast: true },
          ],
        },
        {
          gt: "02 — Credentials",
          gh: "What they can do",
          pills: [
            { n: "Education", t: "3 days" },
            { n: "Trade certification", t: "3 days" },
            { n: "Employment", t: "2 days" },
            { n: "Digital employment", t: "60 min", fast: true },
            { n: "Moonlighting", t: "60 min", fast: true },
          ],
        },
        {
          gt: "03 — Records",
          gh: "What's on file",
          pills: [
            { n: "Criminal", t: "30 min", fast: true },
            { n: "Global database", t: "15 min", fast: true },
            { n: "Current address", t: "30 min", fast: true },
          ],
        },
      ]}
      stepsHead="How does work-pass verification run at ministry scale?"
      stepsLede="Work-pass verification captures documents in the worker's origin country before travel, with consent. HelloVerify AI locates the issuing institution, the registrar, board or employer confirms in-country, and results land in the ministry's work-pass workflow with exceptions flagged for an officer."
      steps={[
        { n: "01 · The worker", t: "Submit", p: "Documents captured on a phone in the origin country, with consent, before travel." },
        { n: "02 · HelloVerify AI", t: "Read", p: "Fields extracted, forgery checks run, the issuing institution located automatically." },
        { n: "03 · The institution", t: "Confirm", p: "The registrar, board or employer confirms directly — in the country that holds the record." },
        { n: "04 · The ministry", t: "Decide", p: "Results land in the work-pass workflow, with exceptions flagged for an officer to judge." },
      ]}
      tableHead="How long does work-pass credential verification take?"
      tableLede="Work-pass credential verification returns identity in 15 minutes, a criminal record in 30, and digital employment from provident-fund records in 60. Employment is confirmed with the employer's HR in two days; education and trade certification with the issuing institution in three."
      rows={[
        { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Entitlement to work", sub: "permit status and conditions", tm: "60 min", fast: true, src: "labour records" },
        { nm: "Digital employment", sub: "contribution-backed work history", tm: "60 min", fast: true, src: "provident fund records" },
        { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
        { nm: "Education & trade certification", sub: "qualification, year, institution", tm: "3 days", src: "the issuing institution" },
      ]}
      tableNote={<>Times shown are from submission to result · credentials verified in the country of issue — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></>}
      complianceHead="How is foreign worker data protected in a ministry workflow?"
      complianceLede="Worker data crosses borders before the worker does, so HelloVerify captures consent in the origin country, documents each transfer, and bounds retention. Security management is ISO 27001 certified and independently audited, handling is GDPR-aligned, and HelloVerify is a PBSA member."
      faqHead={<>From manpower<br />ministries.</>}
      faqs={[
        {
          q: "What exactly runs with Singapore's Ministry of Manpower?",
          a: "Credential verification supporting work-pass decisions: foreign qualifications and employment history confirmed with the issuing institutions abroad, returned into the ministry's workflow. The case study page covers the shape of it.",
        },
        {
          q: "Can workers be verified before they travel?",
          a: "That's the design. Capture happens in the origin country on the worker's own phone, so a failed credential surfaces before a flight is booked rather than at a counter after arrival.",
        },
        {
          q: "How do you handle diploma mills and fake institutions?",
          a: "An institution that cannot be located in the national register of recognised bodies is flagged as unrecognised rather than silently passed. The file distinguishes 'not verified' from 'verified as false' — they are different decisions.",
        },
        {
          q: "What volume can this absorb?",
          a: "Checks run in parallel, so a seasonal intake of tens of thousands moves at the same per-file speed as a single application. Six offices twelve hours apart mean a file submitted at night in Manila is worked on before morning in Singapore.",
        },
      ]}
      closing={{
        heading: <>Issue the pass. <em>Keep the proof.</em></>,
        sub: "Tell us the pass categories and intake volume. We'll scope a pilot.",
        img: "/img/10-ministry-hall.jpg",
      }}
    />
  );
}

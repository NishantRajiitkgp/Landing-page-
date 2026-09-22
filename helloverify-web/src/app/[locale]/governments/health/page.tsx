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
      crumbs={[{ label: "Governments", href: "/governments" }, { label: "Health authorities" }]}
      eyebrow="Governments · Health authorities"
      h1={<>No one practises <em>on an unchecked degree.</em></>}
      sub="Medical degrees, council registrations, licences and practice history — confirmed with the university and the council that issued them, in the country they were issued in."
      secondary={{ label: "See turnaround times", href: "#turnaround" }}
      strip={[
        <><b>120+</b> countries of qualifications</>,
        <><b>3 days</b> degree at the registrar</>,
        <><b>20M+</b> checks at the primary source</>,
        <><span className="dot" /> ISO 27001 · GDPR</>,
      ]}
      /* ANSWER BLOCKS (BUILD-SPEC §11a.2), all four sections of this template.
         Each `*Head` is now the question a licensing official types and each
         `*Lede` is a self-contained answer of 35-45 words that names health
         authorities and clinicians rather than saying "green means" or "this
         check" — a lede that points outside itself is unciteable once an
         engine lifts it off the page (§11a.2 rule 3). The template owns the
         `k` eyebrows ("What we verify", "How it works", "Turnaround &
         coverage", "Compliance & security") and they are untouched.

         Every figure below is already on this page: the times come from the
         `lanes` pills and the `rows` table beneath each block, and the sources
         ("the medical council", "the university registrar") are the `src`
         column verbatim. Nothing new is asserted about a clinician or an
         institution. */
      verifyHead="What does a health authority verify before licensing a clinician?"
      verifyLede="A health authority verifies three things about a clinician: identity, qualification and standing. Identity, criminal and watchlist checks return in 15 to 30 minutes; council registration takes two days at the medical council and a medical degree three days at the university registrar."
      lanes={[
        {
          gt: "01 — Identity",
          gh: "Who they are",
          pills: [
            { n: "Identity", t: "15 min", fast: true },
            { n: "Passport", t: "15 min", fast: true },
            { n: "Age", t: "15 min", fast: true },
            { n: "Current address", t: "30 min", fast: true },
          ],
        },
        {
          gt: "02 — Qualification",
          gh: "What they trained in",
          pills: [
            { n: "Medical degree", t: "3 days" },
            { n: "Post-graduate specialty", t: "3 days" },
            { n: "Council registration", t: "2 days" },
            { n: "Internship completion", t: "3 days" },
          ],
        },
        {
          gt: "03 — Standing",
          gh: "Whether they may practise",
          pills: [
            { n: "Global database", t: "15 min", fast: true },
            { n: "Criminal", t: "30 min", fast: true },
            { n: "Employment history", t: "2 days" },
            { n: "Disciplinary record", t: "3 days" },
          ],
        },
      ]}
      stepsHead="How does a health authority verify applicant documents?"
      stepsLede="A health authority verifies clinician documents in four steps: the applicant photographs them on a phone and consents, HelloVerify AI locates the issuing institution in about a second, the university registrar and medical council confirm directly, and one dated file per applicant follows."
      steps={[
        { n: "01 · The applicant", t: "Submit", p: "Documents photographed on a phone, consent captured, quality checked before upload." },
        { n: "02 · HelloVerify AI", t: "Read", p: "Every field extracted and the issuing institution identified — in about a second." },
        { n: "03 · The institution", t: "Confirm", p: "The university registrar and the medical council confirm directly. Not a database that resembles them." },
        { n: "04 · The authority", t: "Decide", p: "One file per applicant, each result carrying its source and date, ready for the licensing decision." },
      ]}
      tableHead="How long does clinician verification take?"
      tableLede="Clinician verification takes 15 minutes for identity and a global database screen, 30 minutes for a criminal record, two days for council registration, and three days for a medical degree at the university registrar or a disciplinary record on the council's register."
      rows={[
        { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Council registration", sub: "licence number, status, expiry", tm: "2 days", src: "the medical council" },
        { nm: "Medical degree", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
        { nm: "Disciplinary record", sub: "sanctions, suspensions, conditions", tm: "3 days", src: "the council's register" },
      ]}
      tableNote={<>Times shown are from submission to result · qualifications verified in the country of issue — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></>}
      complianceHead="How is clinician data protected during verification?"
      complianceLede="Health records are the most sensitive data a person has, so clinician verification runs under independently audited ISO 27001 certification and GDPR-aligned handling: consent captured per applicant, bounded retention, and every access logged. HelloVerify is a PBSA member."
      faqHead={<>From licensing<br />boards.</>}
      faqs={[
        {
          q: "Can you verify qualifications earned abroad?",
          a: "Yes — that's the common case. A nurse trained in Manila and applying in Abu Dhabi has her degree confirmed with the Philippine institution that issued it, by our team in that country. 120+ countries are reachable through the same pipeline.",
        },
        {
          q: "What if the issuing institution is slow or offline?",
          a: "The file shows the request as pending with a date and the route being used — courier, in-person, or official channel — rather than silently stalling. Authorities see exactly where each applicant stands.",
        },
        {
          q: "Do you detect forged medical degrees?",
          a: "Document forensics run first — template, fonts, security features — but a clean forgery still fails the source check, because the registrar simply has no record of the graduate. That's the point of verifying at the source.",
        },
        {
          q: "Can this run at national volume?",
          a: "Yes. The pipeline is parallel, so a licensing round of ten thousand applicants runs at the same per-file speed as one. Six offices across twelve time zones keep the queue moving overnight.",
        },
      ]}
      closing={{
        heading: <>Every licence you issue, <em>backed by proof.</em></>,
        sub: "Tell us the licensing round and the volume. We'll scope a pilot.",
        img: "/img/02-nurse-abudhabi.jpg",
      }}
    />
  );
}

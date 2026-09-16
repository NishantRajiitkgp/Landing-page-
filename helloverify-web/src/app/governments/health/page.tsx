import type { Metadata } from "next";
import { VerticalPage } from "@/components/templates/VerticalPage";

export const metadata: Metadata = {
  title: "Verification for health authorities — HelloVerify",
  description:
    "Medical degrees, council registrations and practice history confirmed with the issuing institution — before a clinician touches a patient.",
};

export default function Page() {
  return (
    <VerticalPage
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
      verifyHead={<>A clinician is<br />four questions.</>}
      verifyLede="Green means the answer usually lands within the hour. Degrees and council records go to the institution itself and come back in days — with the registrar named."
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
      stepsHead={<>From application<br />to licence decision.</>}
      stepsLede="The authority never chases a document. Applicants upload from their own phone, wherever they are, and the file arrives complete."
      steps={[
        { n: "01 · The applicant", t: "Submit", p: "Documents photographed on a phone, consent captured, quality checked before upload." },
        { n: "02 · HelloVerify AI", t: "Read", p: "Every field extracted and the issuing institution identified — in about a second." },
        { n: "03 · The institution", t: "Confirm", p: "The university registrar and the medical council confirm directly. Not a database that resembles them." },
        { n: "04 · The authority", t: "Decide", p: "One file per applicant, each result carrying its source and date, ready for the licensing decision." },
      ]}
      tableHead={<>Times, and who<br />confirms them.</>}
      tableLede="Measured from submission to result. Where an institution answers only on paper, the file says so — and says how long that route takes."
      rows={[
        { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Council registration", sub: "licence number, status, expiry", tm: "2 days", src: "the medical council" },
        { nm: "Medical degree", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
        { nm: "Disciplinary record", sub: "sanctions, suspensions, conditions", tm: "3 days", src: "the council's register" },
      ]}
      tableNote={<>Times shown are from submission to result · qualifications verified in the country of issue — see <a href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</a></>}
      complianceHead={<>Patient safety<br />starts here.</>}
      complianceLede="Health records are the most sensitive data a person has. Consent is captured per applicant, retention is bounded, and every access is logged."
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

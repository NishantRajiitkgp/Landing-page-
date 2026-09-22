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
 *  apart. */
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

  return (
    <VerticalPage
      service={SERVICE}
      crumbs={[{ label: "Individuals", href: "/individuals" }, { label: "Visa & immigration" }]}
      eyebrow="Individuals · Visa & immigration screening"
      h1={<>Find the problem <em>before the embassy does.</em></>}
      sub="A visa refusal over an unverifiable degree costs the fee, the wait and sometimes the job offer. Screen your own documents first, at the same sources an authority would use."
      primary={{ label: "Screen my documents", href: "https://app.helloverify.com" }}
      secondary={{ label: "See what gets checked", href: "#turnaround" }}
      strip={[
        <><b>120+</b> countries of documents</>,
        <><b>Same</b> sources an authority uses</>,
        <><b>3 days</b> for a registrar-confirmed degree</>,
        <><span className="dot" /> your documents, your report</>,
      ]}
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
      verifyHead="Which documents should I check before a visa application?"
      verifyLede="HelloVerify's visa screening covers the documents an embassy questions: passport and identity, your criminal and global-database record, and above all the degree and employment claims you are relying on. Identity and passport confirm in 15 minutes; a registrar-confirmed degree takes three days."
      lanes={[
        {
          gt: "01 — Identity",
          gh: "Your documents",
          pills: [
            { n: "Identity", t: "15 min", fast: true },
            { n: "Passport", t: "15 min", fast: true },
            { n: "Age", t: "15 min", fast: true },
            { n: "Current address", t: "30 min", fast: true },
          ],
        },
        {
          gt: "02 — Your claims",
          gh: "What you're relying on",
          pills: [
            { n: "Education", t: "3 days" },
            { n: "Employment", t: "2 days" },
            { n: "Digital employment", t: "60 min", fast: true },
            { n: "Entitlement to work", t: "60 min", fast: true },
          ],
        },
        {
          gt: "03 — Your record",
          gh: "What they'll find",
          pills: [
            { n: "Criminal", t: "30 min", fast: true },
            { n: "Global database", t: "15 min", fast: true },
            { n: "Credit", t: "15 min", fast: true },
          ],
        },
      ]}
      stepsHead="How do I check my own documents before applying for a visa?"
      stepsLede="Upload your own documents to HelloVerify by photographing them on your phone — no appointment, no agent, no courier. Each is confirmed with the institution that issued it, in the country it came from, and the report says which claims will fail before you file."
      steps={[
        { n: "01 · You", t: "Upload", p: "Photograph your documents on your phone. No appointment, no agent, no courier." },
        { n: "02 · HelloVerify", t: "Check", p: "Each document confirmed with the institution that issued it, in the country it came from." },
        { n: "03 · Your report", t: "Fix", p: "You see which claims confirm cleanly and which won't — with the reason, before you file." },
      ]}
      tableHead="How long does visa document screening take?"
      tableLede="HelloVerify measures visa screening from upload to result: identity, passport and a global database screen in 15 minutes, a criminal record in 30, and digital employment in 60 minutes from provident-fund records. Education is the slow one at three days, employment at two."
      rows={[
        { nm: "Identity & passport", sub: "name, DOB, number, validity", tm: "15 min", fast: true, src: "issuing registry" },
        { nm: "Global database screen", sub: "sanctions, watchlists, adverse media", tm: "15 min", fast: true, src: "global databases" },
        { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
        { nm: "Digital employment", sub: "contribution-backed work history", tm: "60 min", fast: true, src: "provident fund records" },
        { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
        { nm: "Education", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
      ]}
      tableNote={<>Times shown are from upload to result · documents verified in the country of issue — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></>}
      /* As on `/individuals/home-family`, this section renders the template's
         certification cards and the answer stays off that subject: which
         credentials are held is owned by `lib/content/company.ts` and
         `/platform/security-compliance`, and gated by `check:llms`. */
      complianceHead="Who sees my screening report?"
      complianceLede="Only you. A HelloVerify screening report is not shared with an embassy, an employer or an agent unless you send it yourself. The documents you upload are held under retention limits, and the same evidence often satisfies a new employer's background check later."
      faqHead={<>From applicants.</>}
      faqs={[
        {
          q: "Will an embassy accept your report?",
          a: "Treat it as preparation, not a substitute. Authorities run their own verification — the point of screening first is to discover a problem while you can still correct it, rather than after a refusal.",
        },
        {
          q: "My university has closed. Now what?",
          a: "Closed institutions usually transfer records to a successor body or a state authority, and we check there. If no record survives anywhere, the report says unverifiable rather than failed — a distinction that matters when you explain it to a consulate.",
        },
        {
          q: "Can you check documents from a country I've left?",
          a: "Yes — that's the normal case. The check runs in the country that issued the document, through our own offices and partner network across 120+ countries.",
        },
        {
          q: "Does this help with the employer's checks too?",
          a: "Often, yes. The same evidence that satisfies a consulate usually satisfies a new employer's background check, and you already know what it will say.",
        },
      ]}
      closing={{
        heading: <>Fix the paperwork <em>while you still can.</em></>,
        sub: "Screen your documents before the application fee is spent.",
        ctaLabel: "Screen my documents",
        ctaHref: "https://app.helloverify.com",
        img: "/img/14-visa-counter.jpg",
      }}
    />
  );
}

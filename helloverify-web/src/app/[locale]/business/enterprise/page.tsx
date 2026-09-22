/** /business/enterprise — vertical page (Template 3, the workhorse pattern). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
import Image from "next/image";
import { CERT_BOX } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/business/enterprise";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}


const LANES: { gt: string; gh: string; pills: { n: string; t: string; fast?: boolean }[] }[] = [
  {
    gt: "01 — Identity",
    gh: "Who they are",
    pills: [
      { n: "Identity", t: "15 min", fast: true },
      { n: "PAN", t: "15 min", fast: true },
      { n: "Passport", t: "15 min", fast: true },
      { n: "Age", t: "15 min", fast: true },
      { n: "Driving licence", t: "30 min", fast: true },
      // 30 min, not 60. This page was the only surface saying 60 min;
      // `sections/Checks.tsx` says 30 min. The old site defines this check
      // as "a vehicle's registration details, including ownership and
      // registration status" (`public/cms/en/employees.base.json`), i.e.
      // the RTO record - the SAME authority as Driving licence, which the
      // catalogue rates 30 min and fast. Two checks against one registry
      // cannot differ by 2x.
      { n: "Registration certificate", t: "30 min", fast: true },
    ],
  },
  {
    gt: "02 — Work & education",
    gh: "What they've done",
    pills: [
      { n: "Digital employment", t: "60 min", fast: true },
      { n: "Moonlighting", t: "60 min", fast: true },
      { n: "Entitlement to work", t: "60 min", fast: true },
      { n: "Employment", t: "2 days" },
      { n: "Education", t: "3 days" },
    ],
  },
  {
    gt: "03 — Records & risk",
    gh: "What's on file",
    pills: [
      { n: "Credit", t: "15 min", fast: true },
      { n: "Global database", t: "15 min", fast: true },
      { n: "Criminal", t: "30 min", fast: true },
      { n: "Current address", t: "30 min", fast: true },
      { n: "Trade licence", t: "2 days" },
      { n: "Directors & GST", t: "3 days" },
    ],
  },
];

const ROWS: { nm: string; sub: string; tm: string; fast?: boolean; src: string }[] = [
  { nm: "Identity & PAN", sub: "name, DOB, number, validity", tm: "15 min", fast: true, src: "issuing registry" },
  { nm: "Driving licence", sub: "class, validity, endorsements", tm: "30 min", fast: true, src: "state transport authority" },
  { nm: "Criminal record", sub: "court & police databases", tm: "30 min", fast: true, src: "court records" },
  { nm: "Digital employment", sub: "EPFO-backed work history", tm: "60 min", fast: true, src: "provident fund records" },
  { nm: "Employment", sub: "role, tenure, exit remarks", tm: "2 days", src: "the employer's HR" },
  { nm: "Education", sub: "degree, year, institution", tm: "3 days", src: "the university registrar" },
];

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "How fast is \"fast\" at real volume?",
    a:
      "The times on this page hold at volume because the pipeline is parallel — a thousand driving licences take about as long as one. Identity-class checks come back in 15–60 minutes; anything that needs a registrar or a court is quoted in days, and the SLA we sign reflects your actual mix of checks.",
  },
  {
    q: "What does \"confirmed at the source\" actually mean?",
    a:
      "No proxy databases as the final word. A degree is confirmed with the university registrar, a licence with the issuing authority, employment with the employer or provident-fund records. The report names the source beside every result.",
  },
  {
    q: "How do candidates submit documents?",
    a:
      "Over WhatsApp or a one-time link — no app to install, no account to create. Consent is captured first, and the capture flow checks focus, edges and glare before upload.",
  },
  {
    q: "Can this plug into our ATS?",
    a:
      "Yes — REST API and webhooks, bulk CSV for batch drives, and connectors for common ATS platforms. Results post back automatically; your recruiters never leave their queue.",
  },
  {
    q: "What happens when a check fails?",
    a:
      "The report shows exactly what didn't match and where it was checked, with the evidence attached. Candidates get a dispute path, and re-verification after a correction is free.",
  },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Enterprise background verification",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function EnterprisePage({
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
    <PageShell
      crumbs={[{ label: "Business", href: "/business" }, { label: "Enterprise BGV" }]}
      closing={{
        heading: (
          <>
            Four hundred riders a week? <em>Before lunch.</em>
          </>
        ),
        sub: "Tell us your volume and your roles. You'll have a pilot running this week.",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">Business · Enterprise BGV</div>
        <h1 className="h1">
          Verification that keeps up <em>with hiring.</em>
        </h1>
        <p className="sub">
          High-volume background checks with an SLA. AI reads every document, our team
          confirms with the issuer, and your ATS gets the answer back — from 15 minutes.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <a href="#turnaround" className="btn btn-ghost">
            <span>See turnaround times</span>
            <Arrow />
          </a>
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>2,000+</b> enterprise clients</span>
          <span className="it"><b>20M+</b> checks, every one at the source</span>
          <span className="it"><b>1,600+</b> riders verified a month, one client</span>
          <span className="it"><span className="dot" /> ISO 27001 · PBSA</span>
        </div>
      </div>

      {/* what we verify */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). 42 words. The three questions are
            the LANES records' own `gh` fields, the four times are their pills,
            and "33 checks" is the old heading and the button below.

            Still deliberately silent on three pills' turnarounds — Entitlement
            to work, Registration certificate and Directors & GST — even though
            all three now AGREE across every surface as of 22 Sep 2026. The
            reason has changed rather than gone: two of the three are not in
            `lib/content/checks.ts` at all, so their agreement rests on two
            pages matching rather than on a canonical entry, and a sentence
            written to be quoted away from the page should rest on the stronger
            of the two. Add them to the catalogue and these can be named. */}
        <SecHead k="What we verify" h="What does an enterprise background check include?">
          HelloVerify's enterprise catalogue runs 33 checks against three questions: who the
          candidate is, what they have done, and what is on file. Identity answers in 15
          minutes, criminal records in 30, digital employment in 60; education takes three
          days at the registrar.
        </SecHead>
        <div className="body3 lanes3">
          {LANES.map((l) => (
            <div key={l.gt}>
              <div className="lgt">{l.gt}</div>
              <div className="lgh">{l.gh}</div>
              <div className="cloud3">
                {l.pills.map((p) => (
                  <span key={p.n} className={`pl3${p.fast ? " fast" : ""}`}>
                    <span className="d" />
                    {p.n}
                    <span className="t">{p.t}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36 }}>
          <AppLink href="/resources/checks" className="btn btn-line btn-sm">All 33 checks</AppLink>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 42 words, built from the four `Steps` records
            below plus this band's own "no app, no account". */}
        <SecHead k="How it works" h="How does enterprise background verification work?">
          Enterprise verification starts with one upload: the candidate photographs documents
          over WhatsApp or a link, with no app and no account. HelloVerify's AI reads every
          field, the request goes to the issuer, and the report reaches your ATS with each
          source named.
        </SecHead>
        <Steps
          items={[
          { n: "01 · Candidate's phone", t: "Upload", p: "Photograph the document. Edges, glare and focus are checked before the shutter fires." },
          { n: "02 · HelloVerify AI", t: "Read", p: "Every field extracted, the document checked against itself, the issuing office located — in about a second." },
          { n: "03 · The source", t: "Confirm", p: "The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one." },
          { n: "04 · Your ATS", t: "Report", p: "One report, the source named beside every result, with an auditable trail behind it." },
          ]}
        />
      </div>

      {/* turnaround & coverage */}
      <div className="wrap sec3" id="turnaround">
        {/* ANSWER BLOCK (§11a.2). 42 words, and every time is a ROWS record
            rendered in the table immediately below — same six checks, same
            order — so the quotable sentence and the table cannot drift. The
            120+ countries figure is the table's own footnote. None of the
            three disputed checks appears in ROWS, so nothing had to be left
            out here. */}
        <SecHead k="Turnaround &amp; coverage" h="How long does an enterprise background check take?">
          Enterprise turnaround is measured from upload to report: identity and PAN in 15
          minutes, driving licence and criminal records in 30, digital employment in 60,
          employment in two days, education in three — across 120+ countries, and stated in
          the contract HelloVerify signs.
        </SecHead>
        <div className="body3 tbl3">
          <div className="hd">
            <span>Check</span>
            <span>Turnaround</span>
            <span>Confirmed with</span>
          </div>
          {ROWS.map((r) => (
            <div className="r" key={r.nm}>
              <span className="nm">{r.nm}<small>{r.sub}</small></span>
              <span className={`tm${r.fast ? " fast" : ""}`}>{r.tm}</span>
              <span className="src">{r.src}</span>
            </div>
          ))}
          <div className="note">Times shown are from upload to report · 120+ countries via the same pipeline — see <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink></div>
        </div>
      </div>

      {/* compliance & security */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 44 words, from the four `.cert` cards below
            and the closing step's "auditable trail".

            The NSR card is NOT folded in. It reads "National Skills Registry /
            India's registry of verified IT and ITeS professionals" — a
            description of the registry, where the ISO, GDPR and PBSA cards
            each state HelloVerify's own standing. Turning a logo into
            "HelloVerify is on the NSR" would be a new credential claim, and
            §11a.2 does not license one; credentials are Part 2b's surface. */}
        <SecHead k="Compliance &amp; security" h="How does HelloVerify handle data protection and compliance?">
          HelloVerify is ISO 27001 certified and independently audited, GDPR compliant —
          consent, retention limits and the right to be forgotten in every workflow — and a
          member of the PBSA, the screening industry's global standards body. Every check
          begins with consent and leaves an auditable trail.
        </SecHead>
        <div className="body3 certs3">
          <div className="cert">
            <Image src="/img/iso.jpg" alt="ISO 27001" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">ISO 27001 certified</div>
              <p className="p">Information security management, independently audited.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/gdpr.jpg" alt="GDPR" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">GDPR compliant</div>
              <p className="p">Consent, retention limits and the right to be forgotten, built into every workflow.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/pbsa.jpg" alt="PBSA" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">Professional Background Screening Association</div>
              <p className="p">Member of the global standards body for the screening industry.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/nsr.jpg" alt="NSR" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">National Skills Registry</div>
              <p className="p">India's registry of verified IT and ITeS professionals.</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>Security &amp; compliance, in full — DPA, residency, conformance</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>Asked before<br />every pilot.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

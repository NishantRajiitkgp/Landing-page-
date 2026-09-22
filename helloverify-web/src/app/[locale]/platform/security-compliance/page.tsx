/** /platform/security-compliance — the procurement page.
 *  IA §8: certifications are decorative logos on the current site and there is no
 *  detail page. That is a procurement blocker for the ministry buyer. This page
 *  exists to be sent to a security reviewer.
 *
 *  Status language is deliberate: "certified", "compliant", "aligned" and
 *  "member" are four different claims and are not blurred here. Items awaiting
 *  sign-off say so.
 *
 *  THIS SENTENCE USED TO NAME A FOURTH WORD THAT DOES NOT EXIST — "targeting"
 *  — where the section standfirst below says "member". Measured 22 Sep 2026:
 *  "targeting" appears nowhere else in `src/`, on this page or any other, so
 *  the file's own header and its own standfirst disagreed about what the four
 *  claims ARE while the page argued that the distinction matters. The four are
 *  now `CredentialStatus` in `lib/content/company.ts` and the type is the
 *  count. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
import { CertCards } from "@/components/chrome/CertCard";
import type { CredentialId } from "@/lib/content/company";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform/security-compliance");
}

/** THE PROCUREMENT-LENGTH GLOSSES for this page's credential cards, and only
 *  those. The cards themselves — the logo, the credential's name and its
 *  status word — come from `CREDENTIAL_MARKS` in `lib/content/company.ts`,
 *  which is the reviewed list, and are rendered by `chrome/CertCard.tsx` in
 *  its `dash` form: "ISO 27001 — certified".
 *
 *  THIS PAGE USED TO HOLD ITS OWN COPY of all seven, and that is how it came
 *  to disagree with the other eight surfaces (BUILD-SPEC §11a.3 — the entity
 *  is one entity, and two pages of the same site holding different
 *  certifications is worse for a procurement reviewer than either page
 *  alone). The full census is on `CREDENTIAL_MARKS`; the two that mattered
 *  here are below.
 *
 *  EVERY GLOSS IS OVERRIDDEN, WHICH IS WHY THE OVERRIDE EXISTS. Seven of
 *  seven run longer than the one-liners the section pages use, because this
 *  is the page a security reviewer is sent: each card has to say what the
 *  artefact IS and whether it can be ordered ("Certificate and scope
 *  statement available on request", "DPA available"). The name and the status
 *  word are not overridable and must not be — those are claims about the
 *  company and are identical wherever they appear. Length is editorial;
 *  claims are not.
 *
 *  "NSR — EMPANELLED" WAS A FIFTH STATUS WORD, and it is gone. The standfirst
 *  below reads "Certified, compliant, aligned and member are four different
 *  claims" — a COUNT of the rows in this table — and this row made it five.
 *  Worse, it was a claim the reviewed list deliberately does not make:
 *  `CREDENTIALS` gives NSR no status word at all, because NSR is a registry
 *  HelloVerify participates in rather than an accreditation, and the note
 *  there says so. The other six `.cert` surfaces all headed that card
 *  "National Skills Registry", so this page was alone. Measured 22 Sep 2026.
 *  The count is now a type — `CredentialStatus` in `lib/content/company.ts`
 *  is a union of exactly those four words — so a fifth cannot reach a card
 *  without editing a line whose comment points back at this sentence.
 *
 *  That correction is also why the 22 Sep note about the standfirst's count
 *  needed revisiting. It concluded the count was still right because ISO 9001
 *  is "certified", one of the four — which was true of ISO 9001 and missed
 *  that NSR had introduced a fifth word in the same table. Checking the new
 *  row is not the same as checking the table.
 *
 *  ISO/IEC 27701, SOC 2 AND ISO 9001 rest on weaker evidence than ISO 27001,
 *  PBSA and NSR, and the note that states that in full — sources, dates, and
 *  what to do if a certificate is produced — is on `CREDENTIALS` rather than
 *  restated here. One consequence is a property of THIS page and stays: none
 *  of the three is in `ARTEFACTS` below, because promising a reviewer a
 *  document nobody has seen is exactly the overstatement the standfirst says
 *  we do not make. **If a certificate or a SOC 2 report is produced, cite it
 *  on `CREDENTIALS` and add it to `ARTEFACTS`.**
 *
 *  ISO 9001'S SCOPE IS THE OTHER THING THE GLOSS HAS TO CARRY. It is the only
 *  row here that is not about security, privacy or data protection, so its
 *  copy says what a QMS certificate covers and, explicitly, what it does not.
 *  A procurement reviewer who reads "ISO 9001" as a security control has been
 *  misled by the company it keeps on this page, not by the claim. */
const CERT_IDS = ["iso27001", "iso27701", "soc2", "iso9001", "gdpr", "pbsa", "nsr"] as const;

const CERT_GLOSSES: Partial<Record<CredentialId, string>> = {
  iso27001:
    "Information security management, independently audited. Certificate and scope statement available on request.",
  iso27701:
    "Privacy information management: the extension of ISO 27001 that governs how personal data is handled, as controller and as processor.",
  soc2:
    "Service-organisation controls for security, availability and confidentiality. Compliant rather than certified — a SOC 2 engagement produces an attestation report, not a certificate.",
  iso9001:
    "Quality management systems: how service delivery is documented, measured and improved. It certifies the management system, not the outcome of any individual verification — and unlike everything else on this list, it is not an information-security, privacy or data-protection standard.",
  gdpr:
    "Lawful basis, consent capture, retention limits, erasure and subject-access handling built into every workflow. DPA available.",
  pbsa:
    "Member of the Professional Background Screening Association, the global standards body for the screening industry.",
  nsr: "India's National Skills Registry, the registry of verified IT and ITeS professionals.",
};

const ARTEFACTS = [
  { t: "ISO 27001 certificate & scope", p: "The certificate, the statement of applicability, and the audit body.", s: "On request", req: true },
  { t: "Data Processing Agreement (DPA)", p: "Standard DPA including sub-processor list and international transfer terms.", s: "On request", req: true },
  { t: "Security whitepaper", p: "Architecture, encryption, access control, logging, incident response and business continuity.", s: "On request", req: true },
  { t: "Penetration test summary", p: "Most recent third-party test, executive summary under NDA.", s: "Under NDA", req: true },
  { t: "Accessibility conformance statement", p: "WCAG 2.2 AA conformance claim for this site and the candidate capture flow.", s: "In progress", req: false },
  { t: "Sub-processor register", p: "Every third party that may process personal data, with purpose and location.", s: "On request", req: true },
];

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "Will you complete our security questionnaire?",
    a:
      "Yes — including long-form vendor assessments and public-sector templates. Send it to your contact or through the contact form; two working days is typical, and we'll tell you immediately if something in it needs a longer answer.",
  },
  {
    q: "Can data stay inside our jurisdiction?",
    a:
      "Storage region is set per contract. The one thing that cannot stay local is the source confirmation itself — verifying a Philippine degree requires contacting a Philippine institution. That transfer is documented in the DPA rather than hidden.",
  },
  {
    q: "What happens in a breach?",
    a:
      "Notification timelines are contractual and align with GDPR's 72-hour requirement. The incident response process — detection, containment, notification, post-incident review — is described in the security whitepaper.",
  },
  {
    q: "How long are candidate documents kept?",
    a:
      "For the period set in your DPA, then deleted on schedule. Zero-retention is available where you keep the originals and send only what a check requires. Deletion can be evidenced on request.",
  },
  {
    q: "Do you sell or reuse the data you verify?",
    a:
      "No. Verification data is processed for the verification you requested and nothing else — not for model training on identifiable documents, not for enrichment, not for resale.",
  },
];

export default async function SecurityCompliancePage({
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
      crumbs={[{ label: "Platform", href: "/platform" }, { label: "Security & compliance" }]}
      closing={{
        heading: (
          <>
            Send us the questionnaire. <em>We'll send the file.</em>
          </>
        ),
        sub: "Security reviews and DPAs usually answered within two working days.",
        ctaLabel: "Request the compliance pack",
        img: "/img/09-licensing-officer.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Platform · Security &amp; compliance</div>
        <h1 className="h1">
          The file your <em>committee asks for.</em>
        </h1>
        <p className="sub">
          We sell verification to ministries and regulated industries. That means procurement
          reviews our security posture before anyone reviews our product — so the artefacts live
          here, not in a sales deck.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Request the compliance pack</AppLink>
          <a href="#artefacts" className="btn btn-ghost">
            <span>See what's available</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>ISO 27001</b> certified</span>
          <span className="it"><b>GDPR</b> aligned, DPA available</span>
          <span className="it"><b>PBSA</b> member</span>
          <span className="it"><span className="dot" /> 2 working days to answer a review</span>
        </div>
      </div>

      {/* certifications */}
      <div className="wrap sec3">
        {/* NOT CONVERTED, deliberately (BUILD-SPEC §11a.2). "which
            certifications do you hold" is the obvious question here, and no
            answer to it can avoid restating the credentials list — which
            `CREDENTIAL_MARKS` in `lib/content/company.ts` now owns for the
            cards as well as for the machine-readable surfaces, and which
            `npm run check:llms` gates. Writing it again in a lede is how the
            copies come to disagree, which they measurably did across nine
            files before 22 Sep. The other four sections on this page are
            converted; this one stays a statement. */}
        <SecHead k="Certifications &amp; memberships" h={<>What we hold,<br />stated precisely.</>}>
          Certified, compliant, aligned and member are four different claims. We don't blur
          them — a reviewer who catches a vendor overstating one stops trusting the rest.
        </SecHead>
        <div className="body3 certs3">
          <CertCards ids={CERT_IDS} form="dash" glosses={CERT_GLOSSES} />
        </div>
      </div>

      {/* how data is handled */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2), 45 words, composed from the four
            `Steps` cards directly below. The heading is the question a security
            reviewer types and the answer names the controls rather than saying
            "these are the controls", which is unciteable once lifted off the
            page (§11a.2 rule 3). No certification is named: that list belongs
            to `CREDENTIAL_MARKS` in `company.ts` and is gated by
            `check:llms`. */}
        <SecHead k="Data protection" h="How is candidate data protected?">
          Four controls apply to every HelloVerify verification, on every plan: consent on the
          person's own device per verification, TLS in transit and encryption at rest with keys
          held separately, role-based access scoped to the verification with an audit log, and
          retention bounded by your DPA.
        </SecHead>
        {/* NO `name`, so NO HowTo (§17 condition 18). The band's own lede says
            what these four are — "four controls apply to every HelloVerify
            verification, on every plan" — so they hold concurrently rather
            than in sequence, and consent, encryption, least privilege and
            bounded retention are not things a reader performs one after
            another. The heading is a how-question, which is what makes this
            the tempting one to mark up and the reason the decision is written
            down: `check-schema.mjs` carries it in HOWTO_NOT_A_SEQUENCE. */}
        <Steps
          items={[
          { n: "01 · Lawful basis", t: "Consent first", p: "The person being verified consents on their own device before capture, per verification — not once, forever." },
          { n: "02 · In transit & at rest", t: "Encrypted", p: "TLS in transit, encryption at rest, keys managed separately from the data they protect." },
          { n: "03 · Access", t: "Least privilege", p: "Role-based access, scoped to the verification being worked on, with an audit log per access." },
          { n: "04 · Retention", t: "Bounded, then gone", p: "Documents deleted on the schedule in your DPA. Zero-retention available where you hold the files." },
          ]}
        />
      </div>

      {/* residency & sub-processors */}
      <div className="wrap sec3">
        {/* 45 words, every row of the table below and nothing else. "where is
            data stored" is one of §11a.3's procurement query shapes, so the
            heading is that question verbatim rather than "Where the data
            actually sits", which reads as a label and not as an answer. */}
        <SecHead k="Residency &amp; sub-processors" h="Where is verification data stored?">
          Candidate documents and verification results sit in the region of your contract, with
          India and EU regions available. The source confirmation itself runs in the country that
          issued the document, because that is where the record is. Sub-processors are registered
          and listed in the DPA.
        </SecHead>
        <div className="body3 tbl3">
          <div className="hd">
            <span>Data</span>
            <span>Residency</span>
            <span>Notes</span>
          </div>
          <div className="r">
            <span className="nm">Candidate documents<small>images and extracted fields</small></span>
            <span className="tm">Region of contract</span>
            <span className="src">India or EU regions available</span>
          </div>
          <div className="r">
            <span className="nm">Verification results<small>status, source, timestamps</small></span>
            <span className="tm">Region of contract</span>
            <span className="src">exported to you by webhook</span>
          </div>
          <div className="r">
            <span className="nm">Source confirmation<small>the request to the issuing authority</small></span>
            <span className="tm">Country of issue</span>
            <span className="src">by necessity — that's where the record is</span>
          </div>
          <div className="r">
            <span className="nm">Sub-processors<small>infrastructure and comms providers</small></span>
            <span className="tm">Registered</span>
            <span className="src">full list in the DPA</span>
          </div>
          <div className="note">
            Transfers are covered by the DPA's international transfer terms. Region options are set
            per contract — ask before signing, not after.
          </div>
        </div>
      </div>

      {/* accessibility */}
      <div className="wrap sec3">
        {/* 43 words. The heading asks for the STATUS rather than "are you
            conformant", because the honest answer is "being built to, statement
            in progress" — the `ARTEFACTS` row above says "In progress" and the
            prose below says the same. A question shaped as "is this site WCAG
            2.2 AA conformant?" would invite an engine to lift a yes that this
            page does not claim. */}
        <SecHead k="Accessibility" h="What is your accessibility conformance status?">
          The HelloVerify site is being built to WCAG 2.2 Level AA, and the claim is checked on
          every build: an axe-core audit runs across all 56 pages, blocking on any critical or
          serious violation. The formal conformance statement and VPAT are in progress.
        </SecHead>
        <div className="body3 prose3">
          <p>
            This site is being built to <strong>WCAG 2.2 Level AA</strong>, and the claim is
            checked on every build rather than asserted. An automated audit runs the axe-core
            ruleset across all 56 pages and blocks the build on any critical or serious
            violation; it currently reports none at any severity. Colour contrast is computed
            from the design tokens themselves rather than sampled from screenshots, which means
            no text is skipped for sitting on a photograph or a gradient.
          </p>
          <p>
            Measured: body text <strong>16.8:1</strong>, secondary text <strong>4.8:1</strong>,
            and the confirmation green <strong>5.9:1</strong>, against a 4.5:1 requirement. One
            exception is outstanding and we would rather name it than round it away — the
            lightest label tone, used for small uppercase captions such as table headers and
            chart axes, measures <strong>2.4:1</strong>. It is being resolved by changing the
            token, not by reclassifying the text.
          </p>
          <div className="aside">
            Status · what is automated today: the axe audit, the contrast computation, and a
            post-deploy check that the live origin serves what was built. Not yet automated: a
            manual keyboard and screen-reader pass, pointer target sizes (2.5.8, which needs a
            real browser), and right-to-left rendering for the Arabic locale. The formal
            conformance statement and VPAT cover both this site and the candidate capture flow
            and are in progress. We would rather publish a dated, accurate statement than a
            confident one — ask where it stands and you will get the real answer.
          </div>
          <p>
            The candidate capture flow matters most: it is used by people on low-end phones, in
            poor light, sometimes with limited literacy. Accessibility there is not a compliance
            exercise — it decides whether someone can get a job.
          </p>
        </div>
      </div>

      {/* artefacts */}
      <div className="wrap sec3" id="artefacts">
        {/* 42 words. Four of the six `ARTEFACTS` rows are named; the ISO 27001
            certificate row and the accessibility statement are deliberately
            not, the first because naming it would restate a credential from
            the list `check:llms` gates and `company.ts` owns, the second
            because its status is "In progress" and the block above already
            says so. The table itself is unchanged and lists all six. */}
        <SecHead k="Artefacts" h="What can you send a security reviewer?">
          HelloVerify sends artefacts by name: the DPA with its international transfer terms, the
          security whitepaper, the penetration-test summary under NDA, and the sub-processor
          register. Most arrive within two working days; anything under NDA needs the NDA, which
          goes out the same day.
        </SecHead>
        <div className="body3 art3">
          {ARTEFACTS.map((a) => (
            <div className="a3" key={a.t}>
              <div>
                <div className="t3">{a.t}</div>
                <p className="p3">{a.p}</p>
              </div>
              <span className={`s3${a.req ? " req" : ""}`}>{a.s}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/contact" className="btn btn-ink">Request the compliance pack</AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>From security<br />reviewers.</>} faqs={FAQS} />
    </PageShell>
  );
}

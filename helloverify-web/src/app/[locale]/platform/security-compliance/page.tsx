/** /platform/security-compliance — the procurement page.
 *  IA §8: certifications are decorative logos on the current site and there is no
 *  detail page. That is a procurement blocker for the ministry buyer. This page
 *  exists to be sent to a security reviewer.
 *
 *  Status language is deliberate: "certified" vs "aligned" vs "targeting" are
 *  different claims, and are not blurred here. Items awaiting sign-off say so. */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { CERT_BOX } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Security & compliance — HelloVerify",
  description:
    "Certifications, data residency, sub-processors, accessibility conformance and the artefacts a security review needs — in one place.",
};

const CERTS = [
  {
    img: "/img/iso.jpg",
    alt: "ISO 27001",
    h: "ISO 27001 — certified",
    p: "Information security management, independently audited. Certificate and scope statement available on request.",
  },
  {
    img: "/img/gdpr.jpg",
    alt: "GDPR",
    h: "GDPR — aligned",
    p: "Lawful basis, consent capture, retention limits, erasure and subject-access handling built into every workflow. DPA available.",
  },
  {
    img: "/img/pbsa.jpg",
    alt: "PBSA",
    h: "PBSA — member",
    p: "Member of the Professional Background Screening Association, the global standards body for the screening industry.",
  },
  {
    img: "/img/nsr.jpg",
    alt: "NSR",
    h: "NSR — empanelled",
    p: "India's National Skills Registry, the registry of verified IT and ITeS professionals.",
  },
];

const ARTEFACTS = [
  { t: "ISO 27001 certificate & scope", p: "The certificate, the statement of applicability, and the audit body.", s: "On request", req: true },
  { t: "Data Processing Agreement (DPA)", p: "Standard DPA including sub-processor list and international transfer terms.", s: "On request", req: true },
  { t: "Security whitepaper", p: "Architecture, encryption, access control, logging, incident response and business continuity.", s: "On request", req: true },
  { t: "Penetration test summary", p: "Most recent third-party test, executive summary under NDA.", s: "Under NDA", req: true },
  { t: "Accessibility conformance statement", p: "WCAG 2.2 AA conformance claim for this site and the candidate capture flow.", s: "In progress", req: false },
  { t: "Sub-processor register", p: "Every third party that may process personal data, with purpose and location.", s: "On request", req: true },
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
        <div className="sec-head">
          <div>
            <div className="k">Certifications &amp; memberships</div>
            <h2 className="h2" style={{ marginTop: 12 }}>What we hold,<br />stated precisely.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Certified, aligned and member are three different claims. We don't blur them — a
            reviewer who catches a vendor overstating one stops trusting the rest.
          </p>
        </div>
        <div className="body3 certs3">
          {CERTS.map((c) => (
            <div className="cert" key={c.alt}>
              <Image src={c.img} alt={c.alt} width={CERT_BOX} height={CERT_BOX} />
              <div>
                <div className="h">{c.h}</div>
                <p className="p">{c.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* how data is handled */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Data protection</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Someone's passport<br />is not "data".</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Every verification handles the most sensitive documents a person owns. These are the
            controls that apply to all of them, on every plan.
          </p>
        </div>
        <div className="body3 steps3">
          <div>
            <div className="n">01 · Lawful basis</div>
            <div className="t">Consent first</div>
            <p className="p">The person being verified consents on their own device before capture, per verification — not once, forever.</p>
          </div>
          <div>
            <div className="n">02 · In transit &amp; at rest</div>
            <div className="t">Encrypted</div>
            <p className="p">TLS in transit, encryption at rest, keys managed separately from the data they protect.</p>
          </div>
          <div>
            <div className="n">03 · Access</div>
            <div className="t">Least privilege</div>
            <p className="p">Role-based access, scoped to the verification being worked on, with an audit log per access.</p>
          </div>
          <div>
            <div className="n">04 · Retention</div>
            <div className="t">Bounded, then gone</div>
            <p className="p">Documents deleted on the schedule in your DPA. Zero-retention available where you hold the files.</p>
          </div>
        </div>
      </div>

      {/* residency & sub-processors */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Residency &amp; sub-processors</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Where the data<br />actually sits.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Verification is cross-border by nature: a check runs where the document was issued.
            What stays local, what moves, and who touches it is documented rather than assumed.
          </p>
        </div>
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
        <div className="sec-head">
          <div>
            <div className="k">Accessibility</div>
            <h2 className="h2" style={{ marginTop: 12 }}>A procurement<br />requirement now.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            European Accessibility Act enforcement has been active since June 2025, and EN 301 549
            makes WCAG 2.2 AA the presumed standard. Public bodies increasingly require a
            conformance statement in the tender itself.
          </p>
        </div>
        <div className="body3 prose3">
          <p>
            This site is being built to <strong>WCAG 2.2 Level AA</strong>. Every text colour in the
            design system was contrast-checked rather than eyeballed — body text sits at 16.8:1,
            secondary text at 10.2:1, and the lightest text we use for readable content at 4.8:1,
            all above the 4.5:1 threshold. Decorative meta that falls below it is redundant by
            design: it never carries information that isn't already stated elsewhere.
          </p>
          <div className="aside">
            Status · the conformance statement and VPAT for this site and the candidate capture
            flow are in progress. We would rather publish a dated, accurate statement than a
            confident one — ask us where it stands and you'll get the real answer.
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
        <div className="sec-head">
          <div>
            <div className="k">Artefacts</div>
            <h2 className="h2" style={{ marginTop: 12 }}>What we can<br />send you.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Ask for any of these by name. Most arrive within two working days; anything under NDA
            needs the NDA first, which we'll send the same day.
          </p>
        </div>
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

      {/* FAQ */}
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>From security<br />reviewers.</h2>
          </div>
        </div>
        <div className="faq3">
          <details>
            <summary>Will you complete our security questionnaire?<span className="m">+</span></summary>
            <p className="a">
              Yes — including long-form vendor assessments and public-sector templates. Send it to
              your contact or through the contact form; two working days is typical, and we'll tell
              you immediately if something in it needs a longer answer.
            </p>
          </details>
          <details>
            <summary>Can data stay inside our jurisdiction?<span className="m">+</span></summary>
            <p className="a">
              Storage region is set per contract. The one thing that cannot stay local is the source
              confirmation itself — verifying a Philippine degree requires contacting a Philippine
              institution. That transfer is documented in the DPA rather than hidden.
            </p>
          </details>
          <details>
            <summary>What happens in a breach?<span className="m">+</span></summary>
            <p className="a">
              Notification timelines are contractual and align with GDPR's 72-hour requirement. The
              incident response process — detection, containment, notification, post-incident review
              — is described in the security whitepaper.
            </p>
          </details>
          <details>
            <summary>How long are candidate documents kept?<span className="m">+</span></summary>
            <p className="a">
              For the period set in your DPA, then deleted on schedule. Zero-retention is available
              where you keep the originals and send only what a check requires. Deletion can be
              evidenced on request.
            </p>
          </details>
          <details>
            <summary>Do you sell or reuse the data you verify?<span className="m">+</span></summary>
            <p className="a">
              No. Verification data is processed for the verification you requested and nothing else
              — not for model training on identifiable documents, not for enrichment, not for resale.
            </p>
          </details>
        </div>
      </div>
    </PageShell>
  );
}

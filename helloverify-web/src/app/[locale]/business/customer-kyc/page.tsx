/** /business/customer-kyc — vertical page (Template 3). Absorbs legacy /kyc and /products/trust-safety. */
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
const PATH = "/business/customer-kyc";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "How much friction does this add to signup?",
    a:
      "The capture flow takes under a minute on a phone, and identity verdicts return in minutes. Most platforms gate features, not signup — the account exists immediately, the risky action waits for the verdict.",
  },
  {
    q: "Can we tier the checks by risk?",
    a:
      "Yes — per API call. A buyer might get identity only; a seller adds criminal and global database; a high-value partner adds trade licence and directors. One integration, any mix.",
  },
  {
    q: "What do we store, and what do you store?",
    a:
      "You receive the verdict and the fields you asked for. Documents stay in HelloVerify's encrypted store on the retention schedule in the DPA — or zero-retention if you bring your own storage.",
  },
  {
    q: "Does this work outside India?",
    a:
      "Yes — 120+ countries through the same API, with the check running in the country that issued the document. See global coverage for the country-by-country picture.",
  },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Customer KYC and trust & safety verification",
  description: copyFor(PATH).description,
  serviceType: "Identity verification",
};

export default async function CustomerKycPage({
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
      crumbs={[{ label: "Business", href: "/business" }, { label: "Customer KYC" }]}
      closing={{
        heading: (
          <>
            Trust at signup, <em>not after the loss.</em>
          </>
        ),
        sub: "One API call between a stranger and a customer.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Business · Trust &amp; safety</div>
        <h1 className="h1">
          Customers, verified <em>at signup.</em>
        </h1>
        <p className="sub">
          Marketplaces, rentals, lending, care platforms — verify the person behind the account
          before the first transaction, not after the first complaint.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <AppLink href="/platform/technology" className="btn btn-ghost">
            <span>See the API</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>15 min</b> identity check</span>
          <span className="it"><b>In-flow</b> — API or hosted page</span>
          <span className="it"><b>120+</b> countries, same pipeline</span>
          <span className="it"><span className="dot" /> consent-first, GDPR-clean</span>
        </div>
      </div>

      {/* what we verify */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). 44 words, every time a `.pl3` chip
            in the two lanes below. It names customer KYC rather than "this
            check", so the sentence still says what it is about once an engine
            quotes it off the page (§11a.2 rule 3).

            The selfie match keeps its own clause — the chip says "seconds",
            not 15 minutes, and folding it into the identity group would
            overstate the group or understate the match. */}
        <SecHead k="What we verify" h="What does customer KYC verify at signup?">
          HelloVerify's customer KYC confirms the person first — identity, PAN and age in 15
          minutes, a selfie-to-face match in seconds — then screens the record: global
          database and credit in 15 minutes, criminal in 30, trade licence in two days. Depth
          is set per signup tier.
        </SecHead>
        <div className="body3 lanes3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div>
            <div className="lgt">01 — Identity</div>
            <div className="lgh">Are they who they claim?</div>
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />Identity<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />PAN<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Face vs. selfie<span className="t">seconds</span></span>
              <span className="pl3 fast"><span className="d" />Age<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Current address<span className="t">30 min</span></span>
            </div>
          </div>
          <div>
            <div className="lgt">02 — Risk</div>
            <div className="lgh">Should they be here?</div>
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />Global database<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Criminal<span className="t">30 min</span></span>
              <span className="pl3 fast"><span className="d" />Credit<span className="t">15 min</span></span>
              <span className="pl3"><span className="d" />Trade licence<span className="t">2 days</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* how it fits the flow */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 44 words, from the three `Steps` records
            below and this band's own three verdicts. */}
        <SecHead k="In your flow" h="How does KYC verification fit into our signup flow?">
          Customer KYC reaches HelloVerify three ways: an API call from your own UI, a
          HelloVerify-hosted capture page, or a WhatsApp link for sellers and partners who
          sign up by phone. Each returns one webhook — verified, failed, or needs a human —
          with the evidence attached.
        </SecHead>
        <Steps
          items={[
          { n: "01 · Embed", t: "API", p: "Your UI, our pipeline. Send the document image, get structured fields and a verdict back." },
          { n: "02 · Or redirect", t: "Hosted flow", p: "A HelloVerify-hosted capture page in your colours — consent, capture and quality checks handled." },
          { n: "03 · Or async", t: "WhatsApp", p: "For sellers and partners who sign up by phone — the same link flow candidates use." },
          ]}
        />
      </div>

      {/* privacy stance */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 43 words, from the two `.cert` cards below
            plus the FAQ above them, which is where the DPA retention schedule
            and the zero-retention option are already stated in reviewed copy —
            this restates neither figure, it collects them. */}
        <SecHead k="Compliance &amp; privacy" h="How does HelloVerify handle customer KYC data?">
          A HelloVerify KYC check begins with the customer's consent, before any capture, with
          scope and retention stated in plain language. Documents are encrypted in transit and
          at rest, deleted on the DPA's retention schedule, and stored nowhere if you bring
          your own storage.
        </SecHead>
        <div className="body3 certs3">
          <div className="cert">
            <Image src="/img/gdpr.jpg" alt="GDPR" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">Consent first, always</div>
              <p className="p">The customer consents before capture; scope and retention are stated in plain language.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/iso.jpg" alt="ISO 27001" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">ISO 27001 certified</div>
              <p className="p">Documents encrypted in transit and at rest; deletion on schedule, verifiable on request.</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>Security &amp; compliance, in full</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>From trust &amp;<br />safety teams.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

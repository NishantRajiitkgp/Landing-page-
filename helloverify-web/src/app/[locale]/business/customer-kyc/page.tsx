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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
        <div className="sec-head">
          <div>
            <div className="k">What we verify</div>
            <h2 className="h2" style={{ marginTop: 12 }}>The person,<br />then the record.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Identity resolves in minutes; risk screens run beside it. You choose the depth per
            signup tier — a browser needs less than a seller of medical devices.
          </p>
        </div>
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
        <div className="sec-head">
          <div>
            <div className="k">In your flow</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Three ways in,<br />one decision out.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            However the documents arrive, you get one webhook back: verified, failed, or needs a
            human — with the evidence attached.
          </p>
        </div>
        <div className="body3 steps3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div>
            <div className="n">01 · Embed</div>
            <div className="t">API</div>
            <p className="p">Your UI, our pipeline. Send the document image, get structured fields and a verdict back.</p>
          </div>
          <div>
            <div className="n">02 · Or redirect</div>
            <div className="t">Hosted flow</div>
            <p className="p">A HelloVerify-hosted capture page in your colours — consent, capture and quality checks handled.</p>
          </div>
          <div>
            <div className="n">03 · Or async</div>
            <div className="t">WhatsApp</div>
            <p className="p">For sellers and partners who sign up by phone — the same link flow candidates use.</p>
          </div>
        </div>
      </div>

      {/* privacy stance */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Compliance &amp; privacy</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Their data.<br />Handled like it.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            KYC touches the most personal documents your customers own. That's a responsibility
            before it's a feature.
          </p>
        </div>
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>From trust &amp;<br />safety teams.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

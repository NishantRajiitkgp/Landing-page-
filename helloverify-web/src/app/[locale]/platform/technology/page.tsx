/** /platform/technology — how it works, for a technical evaluator. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
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
  return pageMetadata(locale, "/platform/technology");
}

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "Is the result synchronous?",
    a:
      "The document read is — fields and forgery signals return in about a second. Source confirmation is asynchronous by nature, because a registrar answers on their own schedule, so completion arrives by webhook with the source named.",
  },
  {
    q: "What happens if your model is unsure?",
    a:
      "Low-confidence extractions go to a human reviewer rather than being returned as confident guesses. The record shows that a person intervened, which matters when a result is later challenged.",
  },
  {
    q: "Do you store our candidates' documents?",
    a:
      "On the retention schedule in your DPA, encrypted at rest — or zero-retention if you hold the files yourself and send us only what a check needs. Both are configured per account, not per request.",
  },
  {
    q: "Rate limits and volume spikes?",
    a:
      "Batch submission is built for hiring drives and seasonal intakes; the pipeline parallelises across checks, so a thousand candidates take roughly as long as one plus queue time. Limits are set per contract rather than per plan tier.",
  },
];

export default async function TechnologyPage({
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
      crumbs={[{ label: "Platform", href: "/platform" }, { label: "Technology & APIs" }]}
      closing={{
        heading: (
          <>
            Read the docs, <em>then send one request.</em>
          </>
        ),
        sub: "Sandbox keys the same day you ask.",
        img: "/img/03-engineer-manila.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Platform · Technology &amp; APIs</div>
        <h1 className="h1">
          AI reads it. <em>People confirm it.</em>
        </h1>
        <p className="sub">
          The model extracts fields and spots forgeries in about a second. The part that makes the
          answer worth having is what comes next — reaching the office that issued the document.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Request sandbox access</AppLink>
          <a href="#api" className="btn btn-ghost">
            <span>See the endpoints</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>1.2 s</b> document read</span>
          <span className="it"><b>33</b> check types, one API</span>
          <span className="it"><b>Webhooks</b> — no polling</span>
          <span className="it"><span className="dot" /> 99.9% uptime target</span>
        </div>
      </div>

      {/* the pipeline */}
      <div className="wrap sec3">
        {/* ANSWER BLOCKS (BUILD-SPEC §11a.2). All four statement headings on
            this page become the questions a technical evaluator types, and each
            lede becomes the self-contained answer — 43, 43, 41 and 43 words in
            order. Each names the pipeline, the request or the API rather than
            "everything after that" or "the shapes shown", which point outside
            the block and cannot be lifted (§11a.2 rule 3).

            Every figure is already on this page: 1.2 s and 33 check types in
            the strip above, the four stages in the `Steps` list below, five
            endpoints in `api3`, eight integrations in `intg3`. */}
        <SecHead k="The pipeline" h="How does the verification pipeline work?">
          You post one document and a list of checks. HelloVerify then runs four stages: an
          on-device capture quality gate, field extraction and forgery checks in about 1.2
          seconds, routing to the office that issued the document, and a signed result delivered
          by webhook.
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`,
            so the node and the heading are the same string. */}
        <Steps
          name="How does the verification pipeline work?"
          items={[
          { n: "01 · Capture", t: "Quality gate", p: "Edges, glare, focus and resolution checked on-device before upload — bad captures never enter the queue." },
          { n: "02 · Extract", t: "Read & verify", p: "Fields extracted, template and fonts matched against the issuer's known series, security features and face compared." },
          { n: "03 · Route", t: "Find the issuer", p: "The issuing office is resolved from the document itself, then the request is routed to the team or API that can reach it." },
          { n: "04 · Return", t: "Signed result", p: "A structured result with the source, timestamp and evidence — delivered by webhook, not discovered by polling." },
          ]}
        />
      </div>

      {/* request / response */}
      <div className="wrap sec3">
        <SecHead k="Shape of it" h="What does a verification request look like?">
          A verification is one POST to /v1/verifications carrying the candidate, the check types
          and a callback URL. Completion arrives as a verification.completed webhook naming the
          result, the source and the timestamp. The shapes shown are illustrative; the published
          reference ships with sandbox credentials.
        </SecHead>
        <div className="body3" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 22 }}>
          <div className="code3">
            {/* `tabIndex` + a named `region`: `pre` sets `overflow-x: auto`,
                so at mobile width these samples scroll sideways and a keyboard
                user had no way to reach or move them (WCAG 2.1.1). Found by
                the browser axe sweep — `scrollable-region-focusable` needs a
                box model, so it had never run. The name comes from the header
                already above the block rather than from invented copy. */}
            <div className="ch" id="code-request"><span>Request</span><b>POST /v1/verifications</b></div>
            <pre tabIndex={0} role="region" aria-labelledby="code-request">{`{
  "candidate": {
    "name": "A. Ramesh",
    "phone": "+91XXXXXXXXXX"
  },
  "checks": [
    "identity",
    "driving_licence",
    "criminal"
  ],
  "consent": "whatsapp_link",
  "callback_url":
    "https://your.app/hooks/hv"
}`}</pre>
          </div>
          <div className="code3">
            <div className="ch" id="code-webhook"><span>Webhook</span><b>verification.completed</b></div>
            <pre tabIndex={0} role="region" aria-labelledby="code-webhook">{`{
  "id": "ver_01HQ…",
  "status": "verified",
  "checks": [
    {
      "type": "driving_licence",
      "result": "match",
      "source": "RTO Karnataka",
      "confirmed_at": "2026-09-16T10:08Z"
    }
  ],
  "evidence_url": "https://…"
}`}</pre>
          </div>
        </div>
      </div>

      {/* endpoints */}
      <div className="wrap sec3" id="api">
        <SecHead k="Endpoints" h="Which endpoints does the HelloVerify API expose?">
          Five endpoints cover every HelloVerify product: start a verification, read one back,
          submit a batch for a hiring drive, list the available check types, and fetch the signed
          evidence behind a result. All 33 check types are parameters, not separate integrations.
        </SecHead>
        <div className="body3 api3">
          <div className="e">
            <span className="mth">POST</span>
            <span className="pth">/v1/verifications<small>Start a verification for one candidate</small></span>
            <span className="ret">→ id, status</span>
          </div>
          <div className="e">
            <span className="mth">GET</span>
            <span className="pth">/v1/verifications/:id<small>Current state and per-check results</small></span>
            <span className="ret">→ full record</span>
          </div>
          <div className="e">
            <span className="mth">POST</span>
            <span className="pth">/v1/verifications/batch<small>Bulk submission for hiring drives</small></span>
            <span className="ret">→ batch id</span>
          </div>
          <div className="e">
            <span className="mth">GET</span>
            <span className="pth">/v1/checks<small>Available check types, times and coverage</small></span>
            <span className="ret">→ catalogue</span>
          </div>
          <div className="e">
            <span className="mth">GET</span>
            <span className="pth">/v1/evidence/:id<small>Signed artefact behind a result</small></span>
            <span className="ret">→ signed URL</span>
          </div>
        </div>
      </div>

      {/* integration options */}
      <div className="wrap sec3">
        <SecHead k="Ways to integrate" h="How can we integrate HelloVerify?">
          HelloVerify integrates eight ways: REST API, webhooks, bulk CSV upload, a hosted
          capture page, the WhatsApp candidate flow, ATS connectors, SSO/SAML, and a console for
          non-technical teams. That spans a link pasted into an email to results posted straight
          back into your ATS.
        </SecHead>
        <div className="body3 intg3">
          <span className="svc">REST API</span>
          <span className="svc">Webhooks</span>
          <span className="svc">Bulk CSV upload</span>
          <span className="svc">Hosted capture page</span>
          <span className="svc">WhatsApp candidate flow</span>
          <span className="svc">ATS connectors</span>
          <span className="svc">SSO / SAML</span>
          <span className="svc">Console for non-technical teams</span>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>From engineers.</>} faqs={FAQS} />
    </PageShell>
  );
}

/** /platform/technology — how it works, for a technical evaluator. */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";

export const metadata: Metadata = {
  title: "Technology & APIs — HelloVerify",
  description:
    "How HelloVerify reads a document in about a second, reaches the issuing authority, and returns a defensible result over REST and webhooks.",
};

export default function TechnologyPage() {
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
          <a href="/contact" className="btn btn-ink">Request sandbox access</a>
          <a href="#api" className="btn btn-ghost">
            <span>See the endpoints</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
        <div className="sec-head">
          <div>
            <div className="k">The pipeline</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Four stages,<br />one request.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            You post a document and a list of checks. Everything after that is ours, and every
            stage records what it did.
          </p>
        </div>
        <div className="body3 steps3">
          <div>
            <div className="n">01 · Capture</div>
            <div className="t">Quality gate</div>
            <p className="p">Edges, glare, focus and resolution checked on-device before upload — bad captures never enter the queue.</p>
          </div>
          <div>
            <div className="n">02 · Extract</div>
            <div className="t">Read &amp; verify</div>
            <p className="p">Fields extracted, template and fonts matched against the issuer's known series, security features and face compared.</p>
          </div>
          <div>
            <div className="n">03 · Route</div>
            <div className="t">Find the issuer</div>
            <p className="p">The issuing office is resolved from the document itself, then the request is routed to the team or API that can reach it.</p>
          </div>
          <div>
            <div className="n">04 · Return</div>
            <div className="t">Signed result</div>
            <p className="p">A structured result with the source, timestamp and evidence — delivered by webhook, not discovered by polling.</p>
          </div>
        </div>
      </div>

      {/* request / response */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Shape of it</div>
            <h2 className="h2" style={{ marginTop: 12 }}>One POST,<br />one webhook.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Illustrative shapes — the published reference is issued with sandbox credentials.
          </p>
        </div>
        <div className="body3" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 22 }}>
          <div className="code3">
            <div className="ch"><span>Request</span><b>POST /v1/verifications</b></div>
            <pre>{`{
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
            <div className="ch"><span>Webhook</span><b>verification.completed</b></div>
            <pre>{`{
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
        <div className="sec-head">
          <div>
            <div className="k">Endpoints</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Small surface,<br />on purpose.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Five endpoints cover every product on this site. Check types are parameters, not
            separate integrations.
          </p>
        </div>
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
        <div className="sec-head">
          <div>
            <div className="k">Ways to integrate</div>
            <h2 className="h2" style={{ marginTop: 12 }}>However deep<br />you want to go.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            From a link you paste into an email to a full API integration with results posted back
            into your ATS.
          </p>
        </div>
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

      {/* FAQ */}
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>From engineers.</h2>
          </div>
        </div>
        <div className="faq3">
          <details>
            <summary>Is the result synchronous?<span className="m">+</span></summary>
            <p className="a">
              The document read is — fields and forgery signals return in about a second. Source
              confirmation is asynchronous by nature, because a registrar answers on their own
              schedule, so completion arrives by webhook with the source named.
            </p>
          </details>
          <details>
            <summary>What happens if your model is unsure?<span className="m">+</span></summary>
            <p className="a">
              Low-confidence extractions go to a human reviewer rather than being returned as
              confident guesses. The record shows that a person intervened, which matters when a
              result is later challenged.
            </p>
          </details>
          <details>
            <summary>Do you store our candidates' documents?<span className="m">+</span></summary>
            <p className="a">
              On the retention schedule in your DPA, encrypted at rest — or zero-retention if you
              hold the files yourself and send us only what a check needs. Both are configured per
              account, not per request.
            </p>
          </details>
          <details>
            <summary>Rate limits and volume spikes?<span className="m">+</span></summary>
            <p className="a">
              Batch submission is built for hiring drives and seasonal intakes; the pipeline
              parallelises across checks, so a thousand candidates take roughly as long as one plus
              queue time. Limits are set per contract rather than per plan tier.
            </p>
          </details>
        </div>
      </div>
    </PageShell>
  );
}

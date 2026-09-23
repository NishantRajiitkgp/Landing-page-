/** /platform/technology — how it works, for a technical evaluator. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { PLATFORM } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform/technology");
}

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
  const t = await copy(PLATFORM);
  const d = t.technology;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/platform" }, { label: d.crumb }]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
        img: "/img/03-engineer-manila.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">{d.hero.k}</div>
        <h1 className="h1">{d.hero.h1}</h1>
        <p className="sub">{d.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{d.hero.cta}</AppLink>
          <a href="#api" className="btn btn-ghost">
            <span>{d.hero.endpoints}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{d.strip.read}</span>
          <span className="it">{d.strip.types}</span>
          <span className="it">{d.strip.webhooks}</span>
          <span className="it">{d.strip.uptime}</span>
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
        <SecHead k={d.pipeline.k} h={d.pipeline.h}>
          {d.pipeline.lede}
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`,
            so the node and the heading are the same string — now ONE leaf read
            twice rather than two identical literals, so a translation cannot
            break the equality `check-schema.mjs` compares per page. */}
        <Steps
          name={d.pipeline.h}
          items={[d.steps.capture, d.steps.extract, d.steps.route, d.steps.ret]}
        />
      </div>

      {/* request / response */}
      <div className="wrap sec3">
        <SecHead k={d.shape.k} h={d.shape.h}>
          {d.shape.lede}
        </SecHead>
        {/* THE TWO SAMPLES ARE NOT COPY and stay here as the template literals
            they were: a JSON body and a webhook payload are the API's own
            spelling, identical in every locale, structure in the sense an href
            is (`lib/copy/platform.en.tsx`'s header). So are the method, the
            path and the event name in the two `.ch` bars; the two LABELS
            beside them moved, because `aria-labelledby` reads them aloud. */}
        <div className="body3" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 22 }}>
          <div className="code3">
            {/* `tabIndex` + a named `region`: `pre` sets `overflow-x: auto`,
                so at mobile width these samples scroll sideways and a keyboard
                user had no way to reach or move them (WCAG 2.1.1). Found by
                the browser axe sweep — `scrollable-region-focusable` needs a
                box model, so it had never run. The name comes from the header
                already above the block rather than from invented copy. */}
            <div className="ch" id="code-request"><span>{d.code.request}</span><b>POST /v1/verifications</b></div>
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
            <div className="ch" id="code-webhook"><span>{d.code.webhook}</span><b>verification.completed</b></div>
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
        <SecHead k={d.endpoints.k} h={d.endpoints.h}>
          {d.endpoints.lede}
        </SecHead>
        <div className="body3 api3">
          <div className="e">
            <span className="mth">POST</span>
            <span className="pth">/v1/verifications<small>{d.api.start.d}</small></span>
            <span className="ret">{d.api.start.ret}</span>
          </div>
          <div className="e">
            <span className="mth">GET</span>
            <span className="pth">/v1/verifications/:id<small>{d.api.read.d}</small></span>
            <span className="ret">{d.api.read.ret}</span>
          </div>
          <div className="e">
            <span className="mth">POST</span>
            <span className="pth">/v1/verifications/batch<small>{d.api.batch.d}</small></span>
            <span className="ret">{d.api.batch.ret}</span>
          </div>
          <div className="e">
            <span className="mth">GET</span>
            <span className="pth">/v1/checks<small>{d.api.checks.d}</small></span>
            <span className="ret">{d.api.checks.ret}</span>
          </div>
          <div className="e">
            <span className="mth">GET</span>
            <span className="pth">/v1/evidence/:id<small>{d.api.evidence.d}</small></span>
            <span className="ret">{d.api.evidence.ret}</span>
          </div>
        </div>
      </div>

      {/* integration options */}
      <div className="wrap sec3">
        <SecHead k={d.integrate.k} h={d.integrate.h}>
          {d.integrate.lede}
        </SecHead>
        <div className="body3 intg3">
          <span className="svc">{d.svc.rest}</span>
          <span className="svc">{d.svc.webhooks}</span>
          <span className="svc">{d.svc.csv}</span>
          <span className="svc">{d.svc.capture}</span>
          <span className="svc">{d.svc.whatsapp}</span>
          <span className="svc">{d.svc.ats}</span>
          <span className="svc">{d.svc.sso}</span>
          <span className="svc">{d.svc.console}</span>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from the same array (see
          FaqSection). The four questions are `platform.technology.faqs`; the
          order is structure and stays here. */}
      <FaqSection
        head={d.faqHead}
        faqs={[d.faqs.sync, d.faqs.unsure, d.faqs.storage, d.faqs.limits]}
      />
    </PageShell>
  );
}

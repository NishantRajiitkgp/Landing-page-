/** /business/smb — product page with PUBLIC pricing (Template 4, IA §4.3).
 *  Prices are placeholders pending commercial sign-off (IA §10.4) and say so on the page. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { Tick } from "@/components/brand/Tick";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/business/smb";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}


const PACKS = [
  {
    hd: ["Package", "Blue-collar · SMB"],
    tt: "Blue-collar hire",
    sub: "Drivers, riders, warehouse, security",
    lines: ["PAN card", "Registration certificate", "Driving licence", "Criminal record"],
    price: "₹349",
    ready: "30 minutes",
    who: "One upload from the candidate",
  },
  {
    hd: ["Package", "White-collar · SMB"],
    tt: "White-collar hire",
    sub: "Corporate, tech, finance, healthcare",
    lines: ["Education", "Employment", "Moonlighting", "Current address"],
    price: "₹999",
    ready: "3 days",
    who: "Registrar-confirmed",
  },
  {
    hd: ["Package", "Consumer · SMB"],
    tt: "Driver",
    sub: "For families and small fleets",
    lines: ["Driving licence", "Criminal record", "Current address"],
    price: "₹499",
    ready: "30 minutes",
    who: "Also on HelloV, without address",
  },
];

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "Do I need the candidate's permission?",
    a:
      "Yes, and the flow handles it: the candidate consents on their own phone before any document is captured. No consent, no check — that's a legal requirement, not a setting.",
  },
  {
    q: "Is there a subscription?",
    a:
      "No. You pay per candidate, per package. If you verify fifty people a month or more, volume pricing kicks in — talk to sales for a rate card.",
  },
  {
    q: "What if a document can't be verified?",
    a:
      "The report says exactly what could not be confirmed and why — issuer offline, record not found, mismatch — and what it would take to resolve it. You're never charged twice for a re-run after a correction.",
  },
  {
    q: "Do you send a proper invoice?",
    a:
      "Every order comes with a GST invoice, automatically, to the email on the account.",
  },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Background check packages for small business",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
  offers: PACKS.map((p) => ({ name: p.tt, description: p.sub })),
};

export default async function SmbPage({
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
      crumbs={[{ label: "Business", href: "/business" }, { label: "SMB packages" }]}
      closing={{
        heading: (
          <>
            Your first hire deserves the <em>same certainty.</em>
          </>
        ),
        sub: "No contract, no minimums. Pay per candidate, answer in minutes.",
        ctaLabel: "Buy a package",
        ctaHref: "https://app.helloverify.com",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">Business · Small &amp; medium</div>
        <h1 className="h1">
          Pick a package.<br />
          <em>See the price.</em>
        </h1>
        <p className="sub">
          No sales call, no quote by email. Choose the checks, pay per candidate, and send one
          WhatsApp link — the report comes back the same morning.
        </p>
        <div className="hrow">
          <a href="https://app.helloverify.com" className="btn btn-ink">Buy a package</a>
          <AppLink href="/contact" className="btn btn-ghost">
            <span>Or talk to us first</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>30 min</b> blue-collar package</span>
          <span className="it"><b>20M+</b> checks since 2018</span>
          <span className="it"><b>No</b> subscription, pay per candidate</span>
          <span className="it"><span className="dot" /> GST invoice on every order</span>
        </div>
      </div>

      {/* pricing rack */}
      <div className="wrap sec3">
        <SecHead k="Packages &amp; pricing" h={<>One receipt.<br />No surprises.</>}>
          A fixed set of checks with one turnaround. Everything runs in parallel, so a package
          is only as slow as its slowest check.
        </SecHead>
        <div className="body3 rack3">
          {PACKS.map((p) => (
            <div className="rc" key={p.tt}>
              <div className="hd"><span>{p.hd[0]}</span><span>{p.hd[1]}</span></div>
              <div className="tt">{p.tt}</div>
              <div className="sub">{p.sub}</div>
              <div className="sep" />
              {p.lines.map((l) => (
                <div className="ln" key={l}><Tick /><span>{l}</span></div>
              ))}
              <div className="sep" />
              <div className="price">
                <span className="lb">Per candidate</span>
                <span className="v">{p.price}<small>incl. GST</small></span>
              </div>
              <div className="ready">
                <span className="lb">{p.lines.length} checks · ready in</span>
                <span className="v">{p.ready}</span>
              </div>
              <div className="bc" />
              <div className="buy">
                <span className="who">{p.who}</span>
                <a href="https://app.helloverify.com" className="btn btn-ink btn-sm">Buy now</a>
              </div>
            </div>
          ))}
        </div>
        <div className="pricenote">
          Prices shown are placeholders pending commercial sign-off · every order gets a GST invoice ·
          volume rates from 50 candidates/month — <AppLink href="/contact" style={{ color: "inherit", textDecoration: "underline" }}>talk to sales</AppLink>
        </div>
      </div>

      {/* build your own */}
      <div className="wrap sec3">
        <SecHead k="À la carte" h="Or build your own.">
          Every check can be bought alone inside the app — same sources, same report.
        </SecHead>
        <div className="body3 cloud3" style={{ marginTop: 36 }}>
          <span className="pl3 fast"><span className="d" />Identity<span className="t">15 min</span></span>
          <span className="pl3 fast"><span className="d" />PAN<span className="t">15 min</span></span>
          <span className="pl3 fast"><span className="d" />Driving licence<span className="t">30 min</span></span>
          <span className="pl3 fast"><span className="d" />Criminal<span className="t">30 min</span></span>
          <span className="pl3 fast"><span className="d" />Current address<span className="t">30 min</span></span>
          <span className="pl3 fast"><span className="d" />Digital employment<span className="t">60 min</span></span>
          <span className="pl3"><span className="d" />Employment<span className="t">2 days</span></span>
          <span className="pl3"><span className="d" />Education<span className="t">3 days</span></span>
          <AppLink href="/resources/checks" className="btn btn-line btn-sm">All 33 checks</AppLink>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">How it works</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Three steps.<br />No training required.</h2>
          </div>
        </div>
        <div className="body3 steps3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div>
            <div className="n">01 · Two minutes</div>
            <div className="t">Pick &amp; pay</div>
            <p className="p">Choose a package, pay per candidate. No subscription, no minimum order.</p>
          </div>
          <div>
            <div className="n">02 · The candidate</div>
            <div className="t">One link</div>
            <p className="p">They get a WhatsApp link, photograph their documents, and consent on their own phone.</p>
          </div>
          <div>
            <div className="n">03 · Your inbox</div>
            <div className="t">The report</div>
            <p className="p">One PDF, the source named beside every result. Blue-collar packages land in about 30 minutes.</p>
          </div>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>Before you buy.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

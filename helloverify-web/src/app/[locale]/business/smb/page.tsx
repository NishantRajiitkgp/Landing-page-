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
import { Steps } from "@/components/chrome/Steps";

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
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). 44 words, every figure taken from
            the PACKS records rendered below — three packages, their turnarounds,
            per-candidate pricing — plus the trust strip's "No subscription" and
            "GST invoice on every order".

            TWO THINGS DELIBERATELY LEFT OUT, and the reason is that an answer
            block is read AWAY from the page:

            - The rupee figures. They are placeholders pending commercial
              sign-off, and the `.pricenote` below says so — but a block built
              to survive extraction leaves that disclaimer behind, so a
              citeable "₹349" would become a firm price the moment an engine
              lifts it. The heading therefore asks what you can buy, not what
              it costs.
            - The blue-collar package's check list. It contains "Registration
              certificate", whose turnaround TASKS.md measures as 30 min on the
              homepage and 60 min on /business/enterprise, and which is not in
              the catalogue at all. Naming it inside this package's 30 minutes
              would settle that in a sentence built to be quoted, so the answer
              gives the package's turnaround and not its contents. The
              white-collar list has no such conflict and is named in full. */}
        <SecHead k="Packages &amp; pricing" h="What background check packages can a small business buy?">
          HelloVerify's SMB packages cover three hiring shapes, priced per candidate: a
          blue-collar hire in 30 minutes, a white-collar hire — education, employment,
          moonlighting and current address — in three days, and a driver package in 30
          minutes. No subscription, and a GST invoice on every order.
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
        {/* ANSWER BLOCK (§11a.2). 44 words. The times are the `.pl3` chips
            below and the count is the button's own "All 33 checks"; nothing
            here is new copy. */}
        <SecHead k="À la carte" h="Can I buy a single background check?">
          Any of HelloVerify's 33 checks can be bought on its own inside the app, at the same
          sources and in the same report as a package. Identity and PAN return in 15 minutes,
          criminal and current address in 30, and education in three days.
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
            {/* Question-shaped H2 with NO lede added (§11a.2). This band has
                never carried one — it is a bare `sec-head`, not a `SecHead` —
                and the three `Steps` cards below already read as the answer.
                Same call made on /checks/[check] for its two lede-less bands:
                converting the heading is copy, adding a paragraph where the
                design has none is a layout change. */}
            <h2 className="h2" style={{ marginTop: 12 }}>How does a small-business background check work?</h2>
          </div>
        </div>
        {/* HowTo (§17 condition 18): `name` is this band's own `<h2>`, so the
            node and the heading are the same string. */}
        <Steps
          name="How does a small-business background check work?"
          items={[
          { n: "01 · Two minutes", t: "Pick & pay", p: "Choose a package, pay per candidate. No subscription, no minimum order." },
          { n: "02 · The candidate", t: "One link", p: "They get a WhatsApp link, photograph their documents, and consent on their own phone." },
          { n: "03 · Your inbox", t: "The report", p: "One PDF, the source named beside every result. Blue-collar packages land in about 30 minutes." },
          ]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>Before you buy.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

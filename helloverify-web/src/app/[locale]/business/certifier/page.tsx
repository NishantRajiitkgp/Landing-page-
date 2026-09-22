/** /business/certifier — vendor due diligence (Template 3 + two package receipts).
 *  Descriptive name leads, brand follows (IA §10.2). */
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
const PATH = "/business/certifier";


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
    q: "Does the vendor have to cooperate?",
    a:
      "Mostly no — registries, courts and bureaus answer without the vendor's involvement. Where a document must come from the vendor, they get the same one-link upload flow candidates use.",
  },
  {
    q: "What does \"certified\" mean here?",
    a:
      "Every fact in the profile carries its source and check date. Certification isn't our opinion of the vendor — it's proof that each claim was verified at the registry that holds it.",
  },
  {
    q: "Can this run on our whole vendor base?",
    a:
      "Yes — batches run in parallel, so a thousand vendors take days, not quarters. Renewals re-run automatically before a licence or rating goes stale.",
  },
  {
    q: "International suppliers too?",
    a:
      "120+ countries, checked in-country: an Egyptian textile supplier's trade licence is confirmed in Cairo, not translated from a scan.",
  },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Certifier — vendor due diligence",
  description: copyFor(PATH).description,
  serviceType: "Vendor due diligence",
};

export default async function CertifierPage({
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
      crumbs={[{ label: "Business", href: "/business" }, { label: "Vendor due diligence" }]}
      closing={{
        heading: (
          <>
            Sign the supplier, <em>not the risk.</em>
          </>
        ),
        sub: "Send us the vendor list before the quarter closes.",
        img: "/img/06-supplier-cairo.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Business · Vendor due diligence — Certifier</div>
        <h1 className="h1">
          Know who <em>you buy from.</em>
        </h1>
        <p className="sub">
          Before the first purchase order: is the trade licence real, who are the directors,
          what do the courts and credit bureaus say? Certifier answers from the registry, not
          the vendor's brochure.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <a href="#packages" className="btn btn-ghost">
            <span>See the two packages</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>2 days</b> to a certified profile</span>
          <span className="it"><b>Registry</b>-confirmed, not self-declared</span>
          <span className="it"><b>120+</b> countries of suppliers</span>
          <span className="it"><span className="dot" /> renewal reminders built in</span>
        </div>
      </div>

      {/* what we check */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). 44 words, and it names Certifier
            rather than "a vendor check", so it still identifies the product
            once an engine quotes it away from this page (§11a.2 rule 3). Every
            check and every time is a `.pl3` chip in the two lanes below.

            "Directors & GST" is named WITHOUT its turnaround, on purpose. The
            chip below says 3 days, agreeing with `lib/content/checks.ts` and
            with /business/enterprise; the homepage says 2 (TASKS.md, Part 5).
            A sentence built to be quoted off the page is the worst place to
            pick one of those by accident. */}
        <SecHead k="What we check" h="What does vendor due diligence check?">
          Certifier checks a vendor as a legal entity and as the people behind it: trade
          licence in two days, directors and GST, credit and global-database screening in 15
          minutes, plus identity, promoter criminal history and a financial assessment.
          Licences expire, so it keeps checking.
        </SecHead>
        <div className="body3 lanes3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div>
            <div className="lgt">01 — The entity</div>
            <div className="lgh">On paper</div>
            <div className="cloud3">
              <span className="pl3"><span className="d" />Trade licence<span className="t">2 days</span></span>
              <span className="pl3"><span className="d" />Directors &amp; GST<span className="t">3 days</span></span>
              <span className="pl3 fast"><span className="d" />Credit<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Global database<span className="t">15 min</span></span>
            </div>
          </div>
          <div>
            <div className="lgt">02 — The people</div>
            <div className="lgh">Behind it</div>
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />Identity<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Criminal<span className="t">30 min</span></span>
              <span className="pl3"><span className="d" />Promoter criminal history<span className="t">2 days</span></span>
              <span className="pl3"><span className="d" />Financial assessment<span className="t">2 days</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* the two packages */}
      <div className="wrap sec3" id="packages">
        {/* ANSWER BLOCK (§11a.2). 40 words: the two package cards below, their
            four-check counts, their "ready in 2 days" and the strip's
            "Registry-confirmed, not self-declared".

            The per-package check lists are NOT enumerated here. The licence
            package's four lines include "Defaulting directors" under a
            two-day promise while the lane above it prices Directors & GST at
            three days — the same disagreement as the block before this one, so
            the answer states the package's turnaround and not which check
            inside it carries it. */}
        <SecHead k="Packages" h="What is in a vendor due diligence package?">
          Certifier ships two four-check vendor packages: trade licence risk, before you sign
          a supplier, and vendor financial risk, before the first big order. Both are
          registry-confirmed rather than self-declared, and both end in a certified vendor
          profile in two days.
        </SecHead>
        <div className="body3 rack3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", maxWidth: 900 }}>
          <div className="rc">
            <div className="hd"><span>Package</span><span>Vendors · Certifier</span></div>
            <div className="tt">Trade licence risk</div>
            <div className="sub">Before you sign a supplier</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>Trade licence</span></div>
            <div className="ln"><Tick /><span>Defaulting directors</span></div>
            <div className="ln"><Tick /><span>Criminal records</span></div>
            <div className="ln"><Tick /><span>Credit &amp; company</span></div>
            <div className="sep" />
            <div className="ready">
              <span className="lb">4 checks · ready in</span>
              <span className="v">2 days</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">Certified vendor profile</span>
              <AppLink href="/contact" className="btn btn-ink btn-sm">Talk to sales</AppLink>
            </div>
          </div>
          <div className="rc">
            <div className="hd"><span>Package</span><span>Vendors · Certifier</span></div>
            <div className="tt">Vendor financial risk</div>
            <div className="sub">Before the first big order</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>Financial assessment</span></div>
            <div className="ln"><Tick /><span>GST screening</span></div>
            <div className="ln"><Tick /><span>Credit checks</span></div>
            <div className="ln"><Tick /><span>Promoter criminal history</span></div>
            <div className="sep" />
            <div className="ready">
              <span className="lb">4 checks · ready in</span>
              <span className="v">2 days</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">Certified vendor profile</span>
              <AppLink href="/contact" className="btn btn-ink btn-sm">Talk to sales</AppLink>
            </div>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">How it works</div>
            {/* Question-shaped H2, no lede added (§11a.2) — this band is a bare
                `sec-head` that has never carried one, and the three `Steps`
                cards below are the answer. Same call as /checks/[check]'s two
                lede-less bands. */}
            <h2 className="h2" style={{ marginTop: 12 }}>How does vendor due diligence work?</h2>
          </div>
        </div>
        <Steps
          items={[
          { n: "01 · Procurement", t: "The list", p: "Vendor names and GST numbers — a CSV or an API call from your procurement system." },
          { n: "02 · The registries", t: "The digging", p: "Licence registers, ministry records, courts, credit bureaus — each fact confirmed where it's filed." },
          { n: "03 · Two days later", t: "The profile", p: "A certified profile per vendor: what was checked, where, what was found — and when it expires." },
          ]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>From procurement.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

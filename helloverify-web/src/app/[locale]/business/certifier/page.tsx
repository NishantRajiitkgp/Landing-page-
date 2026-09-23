/** /business/certifier — vendor due diligence (Template 3 + two package receipts).
 *  Descriptive name leads, brand follows (IA §10.2). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { Tick } from "@/components/brand/Tick";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { BUSINESS } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

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
  const t = await copy(BUSINESS);
  const c = t.certifier;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/business" }, { label: c.crumb }]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        img: "/img/06-supplier-cairo.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{c.hero.cta}</AppLink>
          <a href="#packages" className="btn btn-ghost">
            <span>{c.hero.packages}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.profile}</span>
          <span className="it">{c.strip.registry}</span>
          <span className="it">{c.strip.countries}</span>
          <span className="it">{c.strip.renewals}</span>
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
        <SecHead k={c.whatWeCheck.k} h={c.whatWeCheck.h}>
          {c.whatWeCheck.lede}
        </SecHead>
        <div className="body3 lanes3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div>
            <div className="lgt">{c.lanes.entity.lgt}</div>
            <div className="lgh">{c.lanes.entity.lgh}</div>
            {/* Each chip keeps its three children — the `.d` dot, the name,
                the `.t` time — so these are two text-node swaps apiece.
                `Directors &amp; GST` becomes a plain `&` in the dictionary:
                JSX decoded the entity before React saw it, and a string leaf
                spelling `&amp;` would emit `&amp;amp;`. */}
            <div className="cloud3">
              <span className="pl3"><span className="d" />{c.chips.tradeLicence.n}<span className="t">{c.chips.tradeLicence.t}</span></span>
              <span className="pl3"><span className="d" />{c.chips.directorsGst.n}<span className="t">{c.chips.directorsGst.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.credit.n}<span className="t">{c.chips.credit.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.globalDatabase.n}<span className="t">{c.chips.globalDatabase.t}</span></span>
            </div>
          </div>
          <div>
            <div className="lgt">{c.lanes.people.lgt}</div>
            <div className="lgh">{c.lanes.people.lgh}</div>
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />{c.chips.identity.n}<span className="t">{c.chips.identity.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.criminal.n}<span className="t">{c.chips.criminal.t}</span></span>
              <span className="pl3"><span className="d" />{c.chips.promoter.n}<span className="t">{c.chips.promoter.t}</span></span>
              <span className="pl3"><span className="d" />{c.chips.financial.n}<span className="t">{c.chips.financial.t}</span></span>
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
        <SecHead k={c.packagesBand.k} h={c.packagesBand.h}>
          {c.packagesBand.lede}
        </SecHead>
        <div className="body3 rack3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", maxWidth: 900 }}>
          {/* The six words both cards share are ONE leaf each (`card.*`),
              read twice. These are two instances of one card shape, so a
              locale translating "Package" differently on the second would
              have a bug, not a choice — the opposite case to
              `chrome.nav.logoHome` / `chrome.footer.logoHome`, which are
              duplicated precisely because they are two different controls.
              Unlike `/business/smb`, the check count and the turnaround are
              literals in this markup rather than derived from the list, so
              `card.readyIn` is a plain string and not a function leaf. */}
          <div className="rc">
            <div className="hd"><span>{c.card.label}</span><span>{c.card.vendors}</span></div>
            <div className="tt">{c.packs.licence.tt}</div>
            <div className="sub">{c.packs.licence.sub}</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>{c.packs.licence.lines.tradeLicence}</span></div>
            <div className="ln"><Tick /><span>{c.packs.licence.lines.defaultingDirectors}</span></div>
            <div className="ln"><Tick /><span>{c.packs.licence.lines.criminalRecords}</span></div>
            <div className="ln"><Tick /><span>{c.packs.licence.lines.creditCompany}</span></div>
            <div className="sep" />
            <div className="ready">
              <span className="lb">{c.card.readyIn}</span>
              <span className="v">{c.card.ready}</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">{c.card.who}</span>
              <AppLink href="/contact" className="btn btn-ink btn-sm">{c.card.cta}</AppLink>
            </div>
          </div>
          <div className="rc">
            <div className="hd"><span>{c.card.label}</span><span>{c.card.vendors}</span></div>
            <div className="tt">{c.packs.financial.tt}</div>
            <div className="sub">{c.packs.financial.sub}</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>{c.packs.financial.lines.financialAssessment}</span></div>
            <div className="ln"><Tick /><span>{c.packs.financial.lines.gstScreening}</span></div>
            <div className="ln"><Tick /><span>{c.packs.financial.lines.creditChecks}</span></div>
            <div className="ln"><Tick /><span>{c.packs.financial.lines.promoterCriminal}</span></div>
            <div className="sep" />
            <div className="ready">
              <span className="lb">{c.card.readyIn}</span>
              <span className="v">{c.card.ready}</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">{c.card.who}</span>
              <AppLink href="/contact" className="btn btn-ink btn-sm">{c.card.cta}</AppLink>
            </div>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{c.howItWorks.k}</div>
            {/* Question-shaped H2, no lede added (§11a.2) — this band is a bare
                `sec-head` that has never carried one, and the three `Steps`
                cards below are the answer. Same call as /checks/[check]'s two
                lede-less bands. */}
            <h2 className="h2" style={{ marginTop: 12 }}>{c.howItWorks.h}</h2>
          </div>
        </div>
        {/* HowTo (§17 condition 18): `name` is this band's own `<h2>`, so the
            node and the heading are the same string. See `chrome/Steps.tsx`. */}
        <Steps
          name={c.howItWorks.h}
          items={[c.steps.list, c.steps.digging, c.steps.profile]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from the same records (see
          FaqSection). The order is structure and stays here. */}
      <FaqSection
        head={c.faqHead}
        faqs={[c.faqs.cooperate, c.faqs.certified, c.faqs.wholeBase, c.faqs.international]}
      />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

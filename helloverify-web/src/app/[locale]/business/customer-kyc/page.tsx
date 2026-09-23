/** /business/customer-kyc — vertical page (Template 3). Absorbs legacy /kyc and /products/trust-safety. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import Image from "next/image";
import { CERT_BOX } from "@/lib/img";
import { CertCard } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { BUSINESS } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

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
  const t = await copy(BUSINESS);
  const c = t.customerKyc;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/business" }, { label: c.crumb }]}
      closing={{ heading: c.closing.heading, sub: c.closing.sub }}
    >
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{c.hero.cta}</AppLink>
          <AppLink href="/platform/technology" className="btn btn-ghost">
            <span>{c.hero.api}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.identity}</span>
          <span className="it">{c.strip.inFlow}</span>
          <span className="it">{c.strip.countries}</span>
          <span className="it">{c.strip.consent}</span>
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
        <SecHead k={c.whatWeVerify.k} h={c.whatWeVerify.h}>
          {c.whatWeVerify.lede}
        </SecHead>
        <div className="body3 lanes3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div>
            <div className="lgt">{c.lanes.identity.lgt}</div>
            <div className="lgh">{c.lanes.identity.lgh}</div>
            {/* Each chip keeps its three children — the `.d` dot, the name,
                the `.t` time — so these are two text-node swaps apiece. */}
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />{c.chips.identity.n}<span className="t">{c.chips.identity.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.pan.n}<span className="t">{c.chips.pan.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.face.n}<span className="t">{c.chips.face.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.age.n}<span className="t">{c.chips.age.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.currentAddress.n}<span className="t">{c.chips.currentAddress.t}</span></span>
            </div>
          </div>
          <div>
            <div className="lgt">{c.lanes.risk.lgt}</div>
            <div className="lgh">{c.lanes.risk.lgh}</div>
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />{c.chips.globalDatabase.n}<span className="t">{c.chips.globalDatabase.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.criminal.n}<span className="t">{c.chips.criminal.t}</span></span>
              <span className="pl3 fast"><span className="d" />{c.chips.credit.n}<span className="t">{c.chips.credit.t}</span></span>
              <span className="pl3"><span className="d" />{c.chips.tradeLicence.n}<span className="t">{c.chips.tradeLicence.t}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* how it fits the flow */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 44 words, from the three `Steps` records
            below and this band's own three verdicts. */}
        <SecHead k={c.inFlow.k} h={c.inFlow.h}>
          {c.inFlow.lede}
        </SecHead>
        {/* NO `name`, so NO HowTo (§17 condition 18). These three cards are
            mutually exclusive routes, not steps: the strip says so itself —
            "02 · Or redirect", "03 · Or async", and the band's own lede reads
            "reaches HelloVerify three ways". A `HowTo` `step` array is an
            ordered sequence a reader performs all of, so marking up a choice
            of three as a sequence of three would tell an engine to do all
            three in order. Carried in `check-schema.mjs`'s
            HOWTO_NOT_A_SEQUENCE. */}
        <Steps items={[c.steps.api, c.steps.hosted, c.steps.whatsapp]} />
      </div>

      {/* privacy stance */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 43 words, from the two `.cert` cards below
            plus the FAQ above them, which is where the DPA retention schedule
            and the zero-retention option are already stated in reviewed copy —
            this restates neither figure, it collects them. */}
        <SecHead k={c.compliance.k} h={c.compliance.h}>
          {c.compliance.lede}
        </SecHead>
        <div className="body3 certs3">
          {/* NOT A CREDENTIAL CARD, and deliberately left hand-written. It is
              `.cert` markup around a STANCE — the heading is a promise about
              how this product behaves, not a claim about what HelloVerify
              holds — and it borrows `gdpr.jpg` as illustration. It names no
              credential and carries no status word, so there is nothing here
              for `CREDENTIAL_MARKS` to own, and routing it through
              `CertCard` would need a `heading` override, which is the one
              prop that component refuses to have. Same judgement as
              `chrome/SecHead.tsx`: 49 identical blocks shared, 21 left alone
              because they were not the same shape. Measured across the 40 cards
              the nine surfaces rendered, three are this shape — this one and
              the two on `/individuals`. Note the card immediately below is NOT
              one of them, so this is a per-card judgement and not a per-file
              one. */}
          <div className="cert">
            <Image src="/img/gdpr.jpg" alt={c.stance.alt} width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">{c.stance.h}</div>
              <p className="p">{c.stance.p}</p>
            </div>
          </div>
          {/* This one IS a credential card — heading "ISO 27001 certified",
              a name and a status word — so it comes from the table, with a
              gloss of its own: on this page the ISO logo is carrying the
              encryption-and-deletion promise the answer block above states,
              not the generic audit line. */}
          <CertCard id="iso27001" gloss={c.isoGloss} />
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>{c.securityInFull}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from the same records (see
          FaqSection). The `head` leaf keeps its `&amp;` VERBATIM: in a JSX
          leaf the entity is decoded by JSX exactly as it was here, so copying
          the markup is what preserves the byte. It is only a STRING leaf that
          must spell the bare `&` — see `lib/copy/index.ts`. */}
      <FaqSection
        head={c.faqHead}
        faqs={[c.faqs.friction, c.faqs.tiering, c.faqs.storage, c.faqs.international]}
      />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

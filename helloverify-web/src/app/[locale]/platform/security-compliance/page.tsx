/** /platform/security-compliance — the procurement page.
 *  IA §8: certifications are decorative logos on the current site and there is no
 *  detail page. That is a procurement blocker for the ministry buyer. This page
 *  exists to be sent to a security reviewer.
 *
 *  Status language is deliberate: "certified", "compliant", "aligned" and
 *  "member" are four different claims and are not blurred here. Items awaiting
 *  sign-off say so.
 *
 *  THIS SENTENCE USED TO NAME A FOURTH WORD THAT DOES NOT EXIST — "targeting"
 *  — where the section standfirst below says "member". Measured 22 Sep 2026:
 *  "targeting" appears nowhere else in `src/`, on this page or any other, so
 *  the file's own header and its own standfirst disagreed about what the four
 *  claims ARE while the page argued that the distinction matters. The four are
 *  now `CredentialStatus` in `lib/content/company.ts` and the type is the
 *  count.
 *
 *  THE RECORD ORDERS LIVE IN `./content.ts` — which credentials, which artefact
 *  rows with their `.req` flag, which residency rows, which questions — because
 *  this file measured 383 lines against §17 condition 22's limit of 300 on 22
 *  Sep 2026, and 112 of those 383 were records. THE WORDS THOSE RECORDS CARRIED
 *  are `platform.security` in `lib/copy/platform.en.tsx`; that module's header
 *  states the ruling and `./content.ts`'s states the precedent it rests on. The
 *  markup, which is all of it unique, has not moved at any point. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { PLATFORM } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";
import { ARTEFACT_ORDER, CERT_IDS, FAQ_ORDER, RESIDENCY_ORDER } from "./content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform/security-compliance");
}

export default async function SecurityCompliancePage({
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
  const s = t.security;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/platform" }, { label: s.crumb }]}
      closing={{
        heading: s.closing.heading,
        sub: s.closing.sub,
        ctaLabel: s.requestPack,
        img: "/img/09-licensing-officer.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">{s.hero.k}</div>
        <h1 className="h1">{s.hero.h1}</h1>
        <p className="sub">{s.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{s.requestPack}</AppLink>
          <a href="#artefacts" className="btn btn-ghost">
            <span>{s.hero.available}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{s.strip.iso}</span>
          <span className="it">{s.strip.gdpr}</span>
          <span className="it">{s.strip.pbsa}</span>
          <span className="it">{s.strip.answer}</span>
        </div>
      </div>

      {/* certifications */}
      <div className="wrap sec3">
        {/* NOT CONVERTED, deliberately (BUILD-SPEC §11a.2). "which
            certifications do you hold" is the obvious question here, and no
            answer to it can avoid restating the credentials list — which
            `CREDENTIAL_MARKS` in `lib/content/company.ts` now owns for the
            cards as well as for the machine-readable surfaces, and which
            `npm run check:llms` gates. Writing it again in a lede is how the
            copies come to disagree, which they measurably did across nine
            files before 22 Sep. The other four sections on this page are
            converted; this one stays a statement. */}
        <SecHead k={s.certs.k} h={s.certs.h}>
          {s.certs.lede}
        </SecHead>
        <div className="body3 certs3">
          <CertCards ids={CERT_IDS} form="dash" glosses={s.glosses} />
        </div>
      </div>

      {/* how data is handled */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2), 45 words, composed from the four
            `Steps` cards directly below. The heading is the question a security
            reviewer types and the answer names the controls rather than saying
            "these are the controls", which is unciteable once lifted off the
            page (§11a.2 rule 3). No certification is named: that list belongs
            to `CREDENTIAL_MARKS` in `company.ts` and is gated by
            `check:llms`. */}
        <SecHead k={s.data.k} h={s.data.h}>
          {s.data.lede}
        </SecHead>
        {/* NO `name`, so NO HowTo (§17 condition 18). The band's own lede says
            what these four are — "four controls apply to every HelloVerify
            verification, on every plan" — so they hold concurrently rather
            than in sequence, and consent, encryption, least privilege and
            bounded retention are not things a reader performs one after
            another. The heading is a how-question, which is what makes this
            the tempting one to mark up and the reason the decision is written
            down: `check-schema.mjs` carries it in HOWTO_NOT_A_SEQUENCE. */}
        <Steps items={[s.steps.lawful, s.steps.encrypted, s.steps.access, s.steps.retention]} />
      </div>

      {/* residency & sub-processors */}
      <div className="wrap sec3">
        {/* 45 words, every row of the table below and nothing else. "where is
            data stored" is one of §11a.3's procurement query shapes, so the
            heading is that question verbatim rather than "Where the data
            actually sits", which reads as a label and not as an answer. */}
        <SecHead k={s.residencyBand.k} h={s.residencyBand.h}>
          {s.residencyBand.lede}
        </SecHead>
        <div className="body3 tbl3">
          <div className="hd">
            <span>{s.residencyTable.data}</span>
            <span>{s.residencyTable.residency}</span>
            <span>{s.residencyTable.notes}</span>
          </div>
          {/* `key={r.nm}` still resolves through the dictionary to the four
              English strings it resolved to before (third corollary,
              `lib/copy/index.ts`). */}
          {RESIDENCY_ORDER.map((k) => s.residency[k]).map((r) => (
            <div className="r" key={r.nm}>
              <span className="nm">{r.nm}<small>{r.sub}</small></span>
              <span className="tm">{r.tm}</span>
              <span className="src">{r.src}</span>
            </div>
          ))}
          <div className="note">{s.residencyNote}</div>
        </div>
      </div>

      {/* accessibility */}
      <div className="wrap sec3">
        {/* 43 words. The heading asks for the STATUS rather than "are you
            conformant", because the honest answer is "being built to, statement
            in progress" — the accessibility artefact row says "In progress"
            and the prose below says the same. A question shaped as "is this site WCAG
            2.2 AA conformant?" would invite an engine to lift a yes that this
            page does not claim. */}
        <SecHead k={s.accessibility.k} h={s.accessibility.h}>
          {s.accessibility.lede}
        </SecHead>
        {/* Two of these four are RICH TEXT leaves because they carry a
            `<strong>` mid-sentence: moved as JSX so the markup a translator
            moves is the markup that renders, and so no run of text is split
            into two adjacent children. */}
        <div className="body3 prose3">
          <p>{s.prose.audit}</p>
          <p>{s.prose.measured}</p>
          <div className="aside">{s.prose.status}</div>
          <p>{s.prose.capture}</p>
        </div>
      </div>

      {/* artefacts */}
      <div className="wrap sec3" id="artefacts">
        {/* 42 words. Four of the six artefact rows are named; the ISO 27001
            certificate row and the accessibility statement are deliberately
            not, the first because naming it would restate a credential from
            the list `check:llms` gates and `company.ts` owns, the second
            because its status is "In progress" and the block above already
            says so. The table itself is unchanged and lists all six. */}
        <SecHead k={s.artefactsBand.k} h={s.artefactsBand.h}>
          {s.artefactsBand.lede}
        </SecHead>
        {/* `key={a.t}` still resolves to the six English titles it did before.
            `req` is the `.req` CSS flag and stayed in `./content.ts` with the
            order; the three words per row are the dictionary's. */}
        <div className="body3 art3">
          {ARTEFACT_ORDER.map(({ k, req }) => ({ ...s.artefacts[k], req })).map((a) => (
            <div className="a3" key={a.t}>
              <div>
                <div className="t3">{a.t}</div>
                <p className="p3">{a.p}</p>
              </div>
              <span className={`s3${a.req ? " req" : ""}`}>{a.s}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/contact" className="btn btn-ink">{s.requestPack}</AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from the SAME array (see
          FaqSection). The five questions are `platform.security.faqs`; the
          order they are asked in is `./content`, which is structure. */}
      <FaqSection head={s.faqHead} faqs={FAQ_ORDER.map((k) => s.faqs[k])} />
    </PageShell>
  );
}

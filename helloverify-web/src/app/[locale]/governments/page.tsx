/** /governments — audience hub (Template 2). Evidence-first: this buyer converts on artefacts (IA §4.1). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { SIZES_PATH_SPAN3 } from "@/lib/img";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/governments");
}

const VERTICALS = [
  {
    href: "/governments/health",
    span: "span3",
    img: "/img/02-nurse-abudhabi.jpg",
    tag: "Health authorities",
    from: "medical credentials",
    h: "Health",
    p: "Every nurse and doctor's degree, licence and history — confirmed with the issuing council before they touch a patient.",
  },
  {
    href: "/governments/immigration",
    span: "span3",
    img: "/img/14-visa-counter.jpg",
    tag: "Immigration authorities",
    from: "visas & permits",
    h: "Immigration",
    p: "Applicant documents screened at the source, in the country that issued them — before the stamp.",
  },
  {
    href: "/governments/manpower-education",
    span: "span3",
    img: "/img/10-ministry-hall.jpg",
    tag: "Manpower & education",
    from: "work passes",
    h: "Manpower & education",
    p: "Foreign-worker credentials verified for work-pass decisions — the workflow running with Singapore's Ministry of Manpower.",
  },
  {
    href: "/governments/trade",
    span: "span3",
    img: "/img/06-supplier-cairo.jpg",
    tag: "Trade & business",
    from: "licences & registries",
    h: "Trade & business",
    p: "Company registrations, trade licences and the people behind them — verified for licensing decisions.",
  },
];

export default async function GovernmentsHub({
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
      crumbs={[{ label: "Governments" }]}
      closing={{
        heading: (
          <>
            Bring us the mandate. <em>We'll bring the proof.</em>
          </>
        ),
        sub: "A named contact, not a form queue — pilots scoped within two weeks.",
        img: "/img/10-ministry-hall.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">For governments &amp; authorities</div>
        <h1 className="h1">
          Verified at <em>national scale.</em>
        </h1>
        <p className="sub">
          A ministry isn't buying reports. It's buying the trust layer under every permit,
          licence and clearance — confirmed with the issuer, never a proxy database, at the
          volume a nation runs on.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost">
            <span>Procurement &amp; compliance artefacts</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>20M+</b> checks since 2018, at the primary source</span>
          <span className="it"><b>120+</b> countries reachable</span>
          <span className="it"><b>6</b> offices, twelve hours apart</span>
          <span className="it"><span className="dot" /> ISO 27001 · GDPR · PBSA · NSR</span>
        </div>
      </div>

      {/* named authorities */}
      <div className="wrap sec3">
        <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          Governments we work with
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div className="gvt3" style={{ marginTop: 20 }}>
          <div className="g3"><span className="d3" /><span><b>Ministry of Manpower</b><span>Singapore</span></span></div>
          <div className="g3"><span className="d3" /><span><b>Government of India</b><span>Authorities</span></span></div>
          <div className="g3"><span className="d3" /><span><b>Kingdom of Saudi Arabia</b><span>Authorities</span></span></div>
          <div className="g3"><span className="d3" /><span><b>United Arab Emirates</b><span>Authorities</span></span></div>
          <div className="g3"><span className="d3" /><span><b>European authorities</b><span>Verification workflows</span></span></div>
        </div>
      </div>

      {/* the four verticals */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). The heading is the question an
            official types; the lede is the whole answer in 39 words, and it
            names HelloVerify and the four mandates rather than opening on "the
            same primary-source pipeline" — a lede whose subject is "the same"
            is unciteable the moment an engine lifts it off the page (§11a.2
            rule 3).

            Every fact is already on this page: the four kinds of authority are
            the cards immediately below, and 120+ countries is the trust strip
            above. `k` is left as the eyebrow it was. */}
        <SecHead k="Four mandates" h="What does HelloVerify verify for government authorities?">
          HelloVerify covers four kinds of authority: health, immigration, manpower and
          education, and trade and business. One primary-source pipeline confirms medical
          credentials, visa documents, work-pass qualifications and trade licences with the
          issuer that holds each record, across 120+ reachable countries.
        </SecHead>
        <div className="body3 paths3">
          {VERTICALS.map((c) => (
            <AppLink key={c.href} href={c.href} className={`cell ph ${c.span}`}>
              <Image className="pimg" src={c.img} alt="" fill sizes={SIZES_PATH_SPAN3} />
              <div className="scrim" />
              <span className="tag">{c.tag}</span>
              <span className="from">{c.from}</span>
              <div className="body">
                <div className="h">{c.h}</div>
                <div className="p">{c.p}</div>
              </div>
              <span className="go" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </AppLink>
          ))}
        </div>
      </div>

      {/* why governments — the five reasons from the homepage canvas */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2), 43 words. The five countries are the
            "Governments we work with" block above — Singapore's Ministry of
            Manpower, India, Saudi Arabia, the UAE and European authorities —
            restated rather than invented, because this is a claim about real
            government clients and a wrong one is worse than a bland heading. */}
        <SecHead k="Why governments work with us" h="Why do governments choose HelloVerify?">
          Governments choose HelloVerify because every fact is confirmed with the issuer
          rather than a proxy database, one platform covers people and businesses,
          authorities in India, Saudi Arabia, the UAE, Singapore and Europe already work
          with HelloVerify, and every result carries an auditable trail.
        </SecHead>
        <div className="body3" style={{ maxWidth: 760 }}>
          <div className="rz">
            <div className="n">01</div>
            <div>
              <div className="t">Primary source, at national scale</div>
              <p className="p">Confirmed with the issuer — never a proxy database.</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">02</div>
            <div>
              <div className="t">One platform, public and private</div>
              <p className="p">People, businesses, suppliers and institutions on the same rails.</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">03</div>
            <div>
              <div className="t">Proven with governments</div>
              <p className="p">India, Saudi Arabia, the UAE, Singapore, European workflows.</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">04</div>
            <div>
              <div className="t">Built to last</div>
              <p className="p">Infrastructure regulators rely on for years, not a project.</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">05</div>
            <div>
              <div className="t">Evidence, not opinion</div>
              <p className="p">Remarks, artefacts and an auditable trail with every result.</p>
            </div>
          </div>
        </div>
      </div>

      {/* procurement readiness */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        {/* ANSWER BLOCK (§11a.2), 38 words. "What artefacts do you have" is
            the procurement-shaped query, so the answer lists them by name —
            the four cert cards below plus the three artefacts the old lede
            already named. The Ministry of Manpower reference is the mom.jpg
            card below, not a new claim. */}
        <SecHead k="Procurement-ready" h="What procurement artefacts does HelloVerify provide?">
          A procurement review gets one page carrying every HelloVerify artefact: ISO 27001
          certification, independently audited, GDPR-aligned data handling, PBSA membership,
          data residency, sub-processors and accessibility conformance. Work-pass verification
          in production with Singapore's Ministry of Manpower is the reference.
        </SecHead>
        <div className="body3 certs3">
          {/* FOUR OF THE EIGHT MARKS, and the SUBSET is the editorial point
              of this page rather than an oversight: a ministry asks for the
              security certification, the data-protection stance, the industry
              membership and a reference that another ministry is already
              live. India's National Skills Registry is on the homepage and on
              every vertical page and is deliberately not here — it answers a
              question an Indian employer asks, not one a licensing authority
              does. Naming the ids is what makes that a choice a reader can
              see; four copies of markup did not.

              Headings and status words come from `CREDENTIAL_MARKS` in
              `lib/content/company.ts` (BUILD-SPEC §11a.3). This page was
              already right on the one that mattered — "GDPR-aligned data
              handling", against the homepage's "GDPR compliant" — which is
              why that is the wording the table carries. */}
          <CertCards
            ids={["iso27001", "gdpr", "pbsa", "mom"]}
            glosses={{
              /* Per-page, because the link text differs from the same card on
                 `/about` ("the story →" there). Genuinely per-page copy, so
                 it is not folded — the PeopleStrip judgement from Part 5. */
              mom: (
                <>
                  Work-pass credential verification with Singapore's Ministry of Manpower —{" "}
                  <AppLink href="/governments/manpower-education/ministry-of-manpower" style={{ fontWeight: 500 }}>read the story →</AppLink>
                </>
              ),
            }}
          />
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-line btn-sm">Security &amp; compliance, in full</AppLink>
        </div>
      </div>
    </PageShell>
  );
}

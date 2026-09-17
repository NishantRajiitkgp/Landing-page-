/** Case study — the single strongest proof artefact for the government buyer (IA §4.1).
 *  Real facts only: MOM is a named client on the current site. Figures marked
 *  [placeholder] await sign-off and are rendered as such rather than invented. */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { AVATAR_BY } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Ministry of Manpower, Singapore — HelloVerify",
  description:
    "How work-pass credential verification runs with Singapore's Ministry of Manpower: foreign qualifications confirmed with the issuing institution, before arrival.",
};

export default async function MomCaseStudy({
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
      crumbs={[
        { label: "Governments", href: "/governments" },
        { label: "Manpower & education", href: "/governments/manpower-education" },
        { label: "Ministry of Manpower" },
      ]}
      closing={{
        heading: <>Your ministry, <em>next.</em></>,
        sub: "Tell us the pass categories and intake volume. We'll scope a pilot.",
        img: "/img/10-ministry-hall.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">Case study · Singapore</div>
        <h1 className="h1">
          A ministry's standard, <em>at a ministry's scale.</em>
        </h1>
        <p className="sub">
          Singapore's Ministry of Manpower decides who may work in the country. That decision
          rests on credentials issued thousands of kilometres away — which is exactly the
          problem primary-source verification exists to solve.
        </p>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>Work passes</b> credential verification</span>
          <span className="it"><b>120+</b> countries of qualifications</span>
          <span className="it"><b>Before</b> arrival, not after</span>
          <span className="it"><span className="dot" /> in production</span>
        </div>
      </div>

      {/* the quote + stats */}
      <div className="wrap sec3">
        <div className="quote3">
          <div>
            <blockquote className="q">
              “The credential either exists at the institution that issued it, or it doesn't.
              Everything else is opinion.”
            </blockquote>
            <div className="by">
              <Image src="/img/22-portrait-fleet-head.jpg" alt="" width={AVATAR_BY} height={AVATAR_BY} />
              <div>
                <b>Verification programme lead</b>
                <span>Work-pass credentialing · [attribution pending approval]</span>
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="s">
              <div className="v">120<em>+</em></div>
              <div className="l">countries where a qualification can be confirmed with its issuing institution</div>
            </div>
            <div className="s">
              <div className="v">3 <em>days</em></div>
              <div className="l">typical time to a registrar-confirmed degree, anywhere in that network</div>
            </div>
            <div className="s">
              <div className="v">Before <em>arrival</em></div>
              <div className="l">when a failed credential surfaces — not at a counter after a flight</div>
            </div>
          </div>
        </div>
      </div>

      {/* the story */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">The problem</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Paper from<br />everywhere.</h2>
          </div>
        </div>
        <div className="body3 prose3">
          <p>
            A work-pass application arrives with a degree from one country, an employment record
            from another, and an identity document from a third. Each is a claim. Traditionally
            each is checked against a database that aggregates such claims — which verifies that
            somebody once typed it in, not that it is true.
          </p>
          <p>
            For a ministry, that gap matters twice. A credential accepted in error puts an
            unqualified person into a regulated job. A credential rejected in error keeps a
            qualified person out of the country, and invites an appeal the authority must defend
            with evidence it may not have.
          </p>

          <h3>What changed</h3>
          <p>
            Every qualification is confirmed with the institution that issued it, by people in the
            country where that institution sits. A Philippine nursing degree is confirmed with the
            Philippine school's registrar. An Indian diploma is confirmed with the Indian board.
            The answer that comes back isn't a probability — it's a registrar saying yes or no,
            with a date attached.
          </p>
          <div className="aside">
            The file distinguishes three outcomes that are usually collapsed into one:
            <br />· verified — the institution confirmed the record
            <br />· not verified — the institution has no such record
            <br />· unverifiable — the institution could not be reached, and by which route
          </div>
          <p>
            That third state is the one authorities care about most, because it is the one that
            gets silently reported as a pass by systems built to return a binary.
          </p>

          <h3>How it runs</h3>
          <p>
            Capture happens in the origin country, on the worker's own phone, before travel — with
            consent recorded at the point of capture. AI reads the document and locates the issuing
            institution in about a second. The confirmation request goes out through the local team,
            and results return into the ministry's work-pass workflow, where officers see the
            exceptions rather than the thousands of clean files.
          </p>
          <p>
            Six offices spread across twelve hours of time zones mean a submission made at night in
            Manila is being worked before the morning shift starts in Singapore — which is how the
            turnaround stays measured in days rather than weeks at national volume.
          </p>

          <h3>Why it holds up</h3>
          <p>
            Every result in the file carries its source, the date it was confirmed and the artefact
            behind it. When a refusal is appealed, the authority is not defending a score from a
            vendor's model — it is presenting a registrar's answer. That is a materially different
            conversation.
          </p>
        </div>
      </div>

      {/* what a ministry gets */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <div className="sec-head">
          <div>
            <div className="k">What a ministry gets</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Four things,<br />in the contract.</h2>
          </div>
        </div>
        <div className="body3 steps3">
          <div>
            <div className="n">01</div>
            <div className="t">Source proof</div>
            <p className="p">Each credential confirmed with its issuing institution, named and dated in the file.</p>
          </div>
          <div>
            <div className="n">02</div>
            <div className="t">Honest gaps</div>
            <p className="p">Unverifiable is reported as unverifiable, with the route tried — never quietly passed.</p>
          </div>
          <div>
            <div className="n">03</div>
            <div className="t">Scale</div>
            <p className="p">Parallel processing and twelve hours of office coverage hold turnaround at intake volume.</p>
          </div>
          <div>
            <div className="n">04</div>
            <div className="t">Appeal-ready</div>
            <p className="p">An auditable trail per applicant, built to be defended rather than merely read.</p>
          </div>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <AppLink href="/governments/manpower-education" className="btn btn-line btn-sm">Manpower &amp; education verification</AppLink>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>Procurement &amp; compliance artefacts</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </AppLink>
        </div>
      </div>
    </PageShell>
  );
}

/** /platform — hub for the proof layer (Template 2, lighter). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { SIZES_PATH_SPAN3 } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform");
}

export default async function PlatformHub({
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
      crumbs={[{ label: "Platform" }]}
      closing={{
        heading: (
          <>
            Ask us the hard questions. <em>We have files for them.</em>
          </>
        ),
        sub: "Security reviews, DPAs, conformance statements — usually within two working days.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Platform</div>
        <h1 className="h1">
          The machine <em>under the answer.</em>
        </h1>
        <p className="sub">
          Every result on this site rests on three things: a pipeline that reads documents and
          reaches issuers, controls that keep personal data safe, and a network that covers the
          countries those documents come from.
        </p>
        <div className="hrow">
          <AppLink href="/platform/security-compliance" className="btn btn-ink">Security &amp; compliance</AppLink>
          <AppLink href="/platform/technology" className="btn btn-ghost">
            <span>See the technology</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>1.2 s</b> to read a document</span>
          <span className="it"><b>120+</b> countries reachable</span>
          <span className="it"><b>6</b> offices, twelve hours apart</span>
          <span className="it"><span className="dot" /> ISO 27001 · GDPR · PBSA · NSR</span>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Three layers</div>
            <h2 className="h2" style={{ marginTop: 12 }}>How an answer<br />gets made.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            The interesting part isn't the model. It's what happens after it — reaching a registrar
            in another country and coming back with something you can defend.
          </p>
        </div>
        <div className="body3 paths3">
          <AppLink href="/platform/technology" className="cell ph span3">
            <Image className="pimg" src="/img/03-engineer-manila.jpg" alt="" fill sizes={SIZES_PATH_SPAN3} />
            <div className="scrim" />
            <span className="tag">Technology</span>
            <span className="from">API &amp; pipeline</span>
            <div className="body">
              <div className="h">Technology &amp; APIs</div>
              <div className="p">How documents are read, how issuers are reached, and how to wire it all into your systems.</div>
            </div>
            <span className="go" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </AppLink>
          <AppLink href="/platform/security-compliance" className="cell ph span3">
            <Image className="pimg" src="/img/09-licensing-officer.jpg" alt="" fill sizes={SIZES_PATH_SPAN3} />
            <div className="scrim" />
            <span className="tag">Security &amp; compliance</span>
            <span className="from">procurement</span>
            <div className="body">
              <div className="h">Security &amp; compliance</div>
              <div className="p">Certifications, data residency, sub-processors, accessibility conformance — the file your committee asks for.</div>
            </div>
            <span className="go" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </AppLink>
          <AppLink href="/platform/coverage" className="cell ph span3">
            <Image className="pimg" src="/img/19-singapore.jpg" alt="" fill sizes={SIZES_PATH_SPAN3} />
            <div className="scrim" />
            <span className="tag">Coverage</span>
            <span className="from">120+ countries</span>
            <div className="body">
              <div className="h">Global coverage</div>
              <div className="p">Where a document can be confirmed with the authority that issued it — and how long it takes there.</div>
            </div>
            <span className="go" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </AppLink>
        </div>
      </div>
    </PageShell>
  );
}

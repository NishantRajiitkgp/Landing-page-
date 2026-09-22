/** /platform — hub for the proof layer (Template 2, lighter). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { SIZES_PATH_SPAN3 } from "@/lib/img";
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
            <Arrow />
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
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). The only H2 on this hub, so it
            carries the query a technical or procurement reader arrives with.
            The lede is the whole answer in 41 words and names the platform's
            three layers rather than "the interesting part" and "what happens
            after it", which pointed outside the block (§11a.2 rule 3).

            The three layers are the hero's own sentence and the three cards
            below; 1.2 s, 120+ countries and six offices are the strip above.
            Deliberately silent on the certifications the strip lists: that
            list is owned by `lib/content/company.ts` and
            `/platform/security-compliance`, and gated by `check:llms`. */}
        <SecHead k="Three layers" h="How does the HelloVerify platform work?">
          The HelloVerify platform has three layers: a pipeline that reads a document in 1.2
          seconds and reaches the issuer that holds the record, controls that keep personal data
          safe, and a network of six offices, twelve hours apart, covering 120+ countries.
        </SecHead>
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
            {/* All three `.go` arrows on this page were inline copies of
                `brand/Arrow.tsx` missing its `aria-hidden` — 3 of the 6 such
                copies TASKS Part 5 carried (§4 rule 2, §17 condition 22). They
                are shared rather than patched, so the attribute cannot go
                missing again. The defect was latent here and not audible: the
                `.go` span already carries `aria-hidden="true"`, which hides the
                whole subtree, so no screen reader announced these three. The
                other three, on `/business`, `/governments` and `/individuals`,
                sit in the same `.go` span and are the same fix. */}
            <span className="go" aria-hidden="true">
              <Arrow />
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
              <Arrow />
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
              <Arrow />
            </span>
          </AppLink>
        </div>
      </div>
    </PageShell>
  );
}

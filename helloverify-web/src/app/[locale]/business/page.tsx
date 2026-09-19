/** /business — audience hub (Template 2). Real content, not a link farm (IA §10.1). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { CERT_BOX, SIZES_PATH_SPAN2, SIZES_PATH_SPAN3 } from "@/lib/img";
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
  return pageMetadata(locale, "/business");
}

const PATHS = [
  {
    href: "/business/enterprise",
    span: "span3",
    img: "/img/11-office-first-day.jpg",
    tag: "Enterprise",
    from: "2,000+ clients",
    h: "Enterprise BGV",
    p: "High-volume hiring with an SLA. API, bulk upload, and a team that answers.",
  },
  {
    href: "/business/smb",
    span: "span3",
    img: "/img/13-factory-floor.jpg",
    tag: "Small & medium business",
    from: "from 30 min",
    h: "SMB packages",
    p: "Pick a package, upload documents, get answers. Public pricing, no sales call needed.",
  },
  {
    href: "/business/employee-verification",
    span: "span2",
    img: "/img/05-warehouse-pune.jpg",
    tag: "HR & operations",
    from: "60 min",
    h: "Employee verification",
    p: "Existing staff, contractors and gig workforces — verified and re-verified.",
  },
  {
    href: "/business/customer-kyc",
    span: "span2",
    img: "/img/12-phone-signup.jpg",
    tag: "Trust & safety",
    from: "at signup",
    h: "Customer KYC",
    p: "Verify customers the moment they sign up, before they can do harm.",
  },
  {
    href: "/business/certifier",
    span: "span2",
    img: "/img/06-supplier-cairo.jpg",
    tag: "Procurement",
    from: "2 days",
    h: "Vendor due diligence",
    p: "Certifier: trade licences, directors, credit and criminal records — before you sign a supplier.",
  },
];

export default async function BusinessHub({
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
    <PageShell crumbs={[{ label: "Business" }]}>
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">For business</div>
        <h1 className="h1">
          Every hire, verified <em>before day one.</em>
        </h1>
        <p className="sub">
          One pipeline for every role you hire — riders to directors. AI reads the documents,
          our team confirms with the issuer, and the answer lands before the induction video ends.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <AppLink href="/business/smb" className="btn btn-ghost">
            <span>See plans &amp; pricing</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* proof strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>20M+</b> checks since 2018</span>
          <span className="it"><b>2,000+</b> business clients</span>
          <span className="it"><b>30 min</b> blue-collar package</span>
          <span className="it"><b>120+</b> countries</span>
          <span className="it"><span className="dot" /> ISO 27001 · GDPR · PBSA</span>
        </div>
      </div>

      {/* the five paths */}
      <div className="wrap sec3">
        <SecHead k="Five ways in" h="Start where it hurts.">
          Hiring at scale, a first employee, a customer you've never met, or a supplier
          three borders away — each gets its own pipeline on the same platform.
        </SecHead>
        <div className="body3 paths3">
          {PATHS.map((c) => (
            <AppLink key={c.href} href={c.href} className={`cell ph ${c.span}`}>
              <Image className="pimg" src={c.img} alt="" fill sizes={c.span === "span2" ? SIZES_PATH_SPAN2 : SIZES_PATH_SPAN3} />
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

      {/* how it runs + receipt proof */}
      <div className="wrap sec3">
        <SecHead k="One pipeline" h={<>Upload once.<br />We do the rest.</>}>
          The same four stages behind every product — what changes is only which checks run.
        </SecHead>
        <div className="body3 steps3">
          <div>
            <div className="n">01</div>
            <div className="t">Upload</div>
            <p className="p">Photograph the document. Edges, glare and focus are checked before the shutter fires.</p>
          </div>
          <div>
            <div className="n">02</div>
            <div className="t">Read</div>
            <p className="p">AI captures every field, checks the document against itself, and finds the office that issued it.</p>
          </div>
          <div>
            <div className="n">03</div>
            <div className="t">Confirm</div>
            <p className="p">The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.</p>
          </div>
          <div>
            <div className="n">04</div>
            <div className="t">Report</div>
            <p className="p">One report, with the source named beside every result. Wired to your ATS or inbox.</p>
          </div>
        </div>
      </div>

      {/* integrations */}
      <div className="wrap sec3">
        <SecHead k="Integrate once" h="Fits the tools you hire with.">
          Candidates upload over WhatsApp or a link; results come back wherever your team already works.
        </SecHead>
        <div className="body3 intg3">
          <span className="svc">REST API</span>
          <span className="svc">Webhooks</span>
          <span className="svc">Bulk CSV upload</span>
          <span className="svc">ATS integrations</span>
          <span className="svc">WhatsApp candidate flow</span>
          <span className="svc">SSO / SAML</span>
          <AppLink href="/platform/technology" className="btn btn-ghost btn-sm">
            <span>Explore the platform</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* compliance hand-off */}
      <div className="wrap sec3" style={{ paddingBottom: 40 }}>
        <div className="certs3 hair-top" style={{ marginTop: 0 }}>
          <div className="cert">
            <Image src="/img/iso.jpg" alt="ISO 27001" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">ISO 27001 certified</div>
              <p className="p">Information security management, independently audited. Reports available under NDA.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/pbsa.jpg" alt="PBSA" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">PBSA member</div>
              <p className="p">
                Member of the global standards body for the screening industry.{" "}
                <AppLink href="/platform/security-compliance" style={{ fontWeight: 500 }}>Security &amp; compliance →</AppLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

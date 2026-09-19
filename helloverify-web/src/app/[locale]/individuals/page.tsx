/** /individuals — audience hub (Template 2). Surfaces what the old site hid behind /#consumer-services. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { CERT_BOX, SIZES_PATH_SPAN3 } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/individuals");
}

const PATHS = [
  {
    href: "/individuals/hellov",
    span: "span3",
    img: "/img/12-phone-signup.jpg",
    tag: "HelloV",
    from: "30 minutes",
    h: "Verify anyone",
    p: "A driver, a maid, a tenant, a date. Send a photo of the document over WhatsApp — the report comes back to the same chat.",
  },
  {
    href: "/individuals/immigration",
    span: "span3",
    img: "/img/14-visa-counter.jpg",
    tag: "Visa & immigration",
    from: "before you file",
    h: "Screen your own papers",
    p: "Find the problem in your documents before an embassy does — and before the application fee is spent.",
  },
  {
    href: "/individuals/home-family",
    span: "span3",
    img: "/img/15-home-doorway.jpg",
    tag: "Home & family",
    from: "30 minutes",
    h: "The people in your home",
    p: "Nannies, drivers, cooks, carers, tutors. The people you trust with your children and your keys.",
  },
  {
    href: "/individuals/hellov",
    span: "span3",
    img: "/img/07-tenant-singapore.jpg",
    tag: "Tenants & deals",
    from: "30 minutes",
    h: "Before you hand over keys",
    p: "A tenant, a buyer, a business partner — identity and record checked before money or property moves.",
  },
];

export default async function IndividualsHub({
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
      crumbs={[{ label: "Individuals" }]}
      closing={{
        heading: (
          <>
            Trust is lovely. <em>Proof is better.</em>
          </>
        ),
        sub: "One photo, thirty minutes, and you know.",
        ctaLabel: "Start a check",
        ctaHref: "https://app.helloverify.com",
        img: "/img/15-home-doorway.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">For individuals &amp; families</div>
        <h1 className="h1">
          Verify anyone. <em>From your phone.</em>
        </h1>
        <p className="sub">
          The same verification ministries use, for the people in your life. Send a photo of the
          document over WhatsApp, and the report comes back to the same chat — often in half an hour.
        </p>
        <div className="hrow">
          <a href="https://app.helloverify.com" className="btn btn-ink">Start a check</a>
          <AppLink href="/individuals/hellov" className="btn btn-ghost">
            <span>See plans &amp; prices</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>30 min</b> for most checks</span>
          <span className="it"><b>No</b> app to install</span>
          <span className="it"><b>20M+</b> checks since 2018</span>
          <span className="it"><span className="dot" /> consent-first, always</span>
        </div>
      </div>

      <div className="wrap sec3">
        <SecHead k="What people check" h={<>For the moment you<br />need to trust someone.</>}>
          A new driver for the school run. A tenant for the upstairs flat. Your own documents
          before a visa interview. Same pipeline, same sources.
        </SecHead>
        <div className="body3 paths3">
          {PATHS.map((c) => (
            <AppLink key={c.h} href={c.href} className={`cell ph ${c.span}`}>
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

      <div className="wrap sec3">
        <SecHead k="How it works" h={<>Three steps,<br />one chat.</>}>
          No app, no account, no forms. If you can send a photo on WhatsApp, you can run a check.
        </SecHead>
        <Steps
          items={[
          { n: "01 · You", t: "Send a photo", p: "Message HelloV on WhatsApp and photograph the person's document. They consent on their own phone." },
          { n: "02 · Us", t: "We check the source", p: "Not a database of copies — the transport authority, the court, the registry that issued it." },
          { n: "03 · The chat", t: "The report", p: "A plain-language result with the source named, back in the same conversation." },
          ]}
        />
      </div>

      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <SecHead k="Your responsibility, and ours" h={<>Consent isn't<br />a formality.</>}>
          You can't check someone behind their back, and we won't help you try. The person being
          verified consents on their own phone first — every time.
        </SecHead>
        <div className="body3 certs3">
          <div className="cert">
            <Image src="/img/gdpr.jpg" alt="GDPR" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">They consent, then we check</div>
              <p className="p">The person sees what is being verified and agrees to it before anything runs.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/iso.jpg" alt="ISO 27001" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">Documents deleted on schedule</div>
              <p className="p">ISO 27001 certified storage, encrypted, with retention limits — not kept forever.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

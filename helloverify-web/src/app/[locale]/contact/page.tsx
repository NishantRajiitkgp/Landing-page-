/** /contact — conversion page (Template 7). The canvas contact section grown to a page.
 *  Fields are real inputs now (the canvas drew styled divs); the form posts to a
 *  Server Action (BUILD-SPEC §10); see components/forms/ContactForm. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { ContactForm } from "@/components/forms/ContactForm";
import Image from "next/image";
import { SIZES_SIDE } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell
      crumbs={[{ label: "Contact" }]}
      closing={{
        heading: (
          <>
            Prefer to just <em>see it working?</em>
          </>
        ),
        sub: "Ask for a walkthrough with your own sample documents.",
        ctaLabel: "Request a walkthrough",
        img: "/img/11-office-first-day.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Contact</div>
        <h1 className="h1">
          Talk to a person <em>who runs checks.</em>
        </h1>
        <p className="sub">
          Not a queue. Tell us what you need verified, for whom, and roughly how many — you will
          get a real answer, including when the honest answer is that something takes days.
        </p>
      </div>

      {/* the form */}
      <div className="wrap" style={{ paddingTop: 20 }}>
        <div className="ct3">
          <div className="side ph">
            <Image className="pimg" src="/img/23-closing.jpg" alt="" fill sizes={SIZES_SIDE} priority />
            <div className="scrim" />
            <div className="body">
              <div className="h">
                Every great journey deserves a <em>verified</em> beginning.
              </div>
              <p className="p">Take the first step. We&apos;ll handle the rest.</p>
            </div>
          </div>

          <ContactForm locale={locale} />
        </div>
      </div>

      {/* other routes in */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Other ways in</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Depending on<br />who you are.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Sales, support, security reviews and individual purchases go to different places —
            here is which is which.
          </p>
        </div>
        <div className="body3 art3">
          <div className="a3">
            <div>
              <div className="t3">Buying a single check as an individual</div>
              <p className="p3">You don&apos;t need us at all — HelloV runs in WhatsApp and takes about a minute to start.</p>
            </div>
            <span className="s3">
              <AppLink href="/individuals/hellov" style={{ color: "inherit" }}>HelloV →</AppLink>
            </span>
          </div>
          <div className="a3">
            <div>
              <div className="t3">Small business, ready to buy</div>
              <p className="p3">Prices are public and you can start without talking to anyone.</p>
            </div>
            <span className="s3">
              <AppLink href="/business/smb" style={{ color: "inherit" }}>SMB packages →</AppLink>
            </span>
          </div>
          <div className="a3">
            <div>
              <div className="t3">Security review, DPA or questionnaire</div>
              <p className="p3">Artefacts are listed with their status; most are sent within two working days.</p>
            </div>
            <span className="s3">
              <AppLink href="/platform/security-compliance" style={{ color: "inherit" }}>Compliance pack →</AppLink>
            </span>
          </div>
          <div className="a3">
            <div>
              <div className="t3">Existing customer needing support</div>
              <p className="p3">Use the form above and pick your service — support enquiries are routed, not queued behind sales.</p>
            </div>
            <span className="s3 req">Same working day</span>
          </div>
        </div>
      </div>

      {/* offices */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <div className="sec-head">
          <div>
            <div className="k">Offices</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Six of them,<br />twelve hours apart.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Someone is at a desk for 21 of every 24 hours, which is why a request filed at night is
            usually answered by morning somewhere.
          </p>
        </div>
        <div className="body3 offices3">
          <div className="o"><b>Noida</b><span>India · 09–18 IST<br />Head office</span></div>
          <div className="o"><b>Manila</b><span>Philippines · 09–18 PHT</span></div>
          <div className="o"><b>Singapore</b><span>Singapore · 09–18 SGT</span></div>
          <div className="o"><b>Dubai</b><span>UAE · 09–18 GST</span></div>
          <div className="o"><b>Cairo</b><span>Egypt · 09–18 EET</span></div>
          <div className="o"><b>New York</b><span>United States · 09–18 ET</span></div>
        </div>
      </div>
    </PageShell>
  );
}

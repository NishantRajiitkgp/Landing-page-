/** /business/certifier — vendor due diligence (Template 3 + two package receipts).
 *  Descriptive name leads, brand follows (IA §10.2). */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Vendor due diligence — Certifier by HelloVerify",
  description:
    "Trade licences, directors, credit and criminal records — verified at the registry before you sign a supplier. Certified vendor profiles in 2 days.",
};

const Tick = () => (
  <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="#1B6B4A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

  return (
    <PageShell
      crumbs={[{ label: "Business", href: "/business" }, { label: "Vendor due diligence" }]}
      closing={{
        heading: (
          <>
            Sign the supplier, <em>not the risk.</em>
          </>
        ),
        sub: "Send us the vendor list before the quarter closes.",
        img: "/img/06-supplier-cairo.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Business · Vendor due diligence — Certifier</div>
        <h1 className="h1">
          Know who <em>you buy from.</em>
        </h1>
        <p className="sub">
          Before the first purchase order: is the trade licence real, who are the directors,
          what do the courts and credit bureaus say? Certifier answers from the registry, not
          the vendor's brochure.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <a href="#packages" className="btn btn-ghost">
            <span>See the two packages</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>2 days</b> to a certified profile</span>
          <span className="it"><b>Registry</b>-confirmed, not self-declared</span>
          <span className="it"><b>120+</b> countries of suppliers</span>
          <span className="it"><span className="dot" /> renewal reminders built in</span>
        </div>
      </div>

      {/* what we check */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">What we check</div>
            <h2 className="h2" style={{ marginTop: 12 }}>The company,<br />and its people.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            A vendor is a legal entity and the humans behind it. Certifier checks both — and keeps
            checking, because licences expire and directors change.
          </p>
        </div>
        <div className="body3 lanes3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <div>
            <div className="lgt">01 — The entity</div>
            <div className="lgh">On paper</div>
            <div className="cloud3">
              <span className="pl3"><span className="d" />Trade licence<span className="t">2 days</span></span>
              <span className="pl3"><span className="d" />Directors &amp; GST<span className="t">3 days</span></span>
              <span className="pl3 fast"><span className="d" />Credit<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Global database<span className="t">15 min</span></span>
            </div>
          </div>
          <div>
            <div className="lgt">02 — The people</div>
            <div className="lgh">Behind it</div>
            <div className="cloud3">
              <span className="pl3 fast"><span className="d" />Identity<span className="t">15 min</span></span>
              <span className="pl3 fast"><span className="d" />Criminal<span className="t">30 min</span></span>
              <span className="pl3"><span className="d" />Promoter criminal history<span className="t">2 days</span></span>
              <span className="pl3"><span className="d" />Financial assessment<span className="t">2 days</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* the two packages */}
      <div className="wrap sec3" id="packages">
        <div className="sec-head">
          <div>
            <div className="k">Packages</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Two receipts,<br />most vendors covered.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Licence risk before onboarding; financial risk before the big order. Both end in a
            certified vendor profile your whole team can cite.
          </p>
        </div>
        <div className="body3 rack3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", maxWidth: 900 }}>
          <div className="rc">
            <div className="hd"><span>Package</span><span>Vendors · Certifier</span></div>
            <div className="tt">Trade licence risk</div>
            <div className="sub">Before you sign a supplier</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>Trade licence</span></div>
            <div className="ln"><Tick /><span>Defaulting directors</span></div>
            <div className="ln"><Tick /><span>Criminal records</span></div>
            <div className="ln"><Tick /><span>Credit &amp; company</span></div>
            <div className="sep" />
            <div className="ready">
              <span className="lb">4 checks · ready in</span>
              <span className="v">2 days</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">Certified vendor profile</span>
              <AppLink href="/contact" className="btn btn-ink btn-sm">Talk to sales</AppLink>
            </div>
          </div>
          <div className="rc">
            <div className="hd"><span>Package</span><span>Vendors · Certifier</span></div>
            <div className="tt">Vendor financial risk</div>
            <div className="sub">Before the first big order</div>
            <div className="sep" />
            <div className="ln"><Tick /><span>Financial assessment</span></div>
            <div className="ln"><Tick /><span>GST screening</span></div>
            <div className="ln"><Tick /><span>Credit checks</span></div>
            <div className="ln"><Tick /><span>Promoter criminal history</span></div>
            <div className="sep" />
            <div className="ready">
              <span className="lb">4 checks · ready in</span>
              <span className="v">2 days</span>
            </div>
            <div className="bc" />
            <div className="buy">
              <span className="who">Certified vendor profile</span>
              <AppLink href="/contact" className="btn btn-ink btn-sm">Talk to sales</AppLink>
            </div>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">How it works</div>
            <h2 className="h2" style={{ marginTop: 12 }}>You send a list.<br />We send certainty.</h2>
          </div>
        </div>
        <div className="body3 steps3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div>
            <div className="n">01 · Procurement</div>
            <div className="t">The list</div>
            <p className="p">Vendor names and GST numbers — a CSV or an API call from your procurement system.</p>
          </div>
          <div>
            <div className="n">02 · The registries</div>
            <div className="t">The digging</div>
            <p className="p">Licence registers, ministry records, courts, credit bureaus — each fact confirmed where it's filed.</p>
          </div>
          <div>
            <div className="n">03 · Two days later</div>
            <div className="t">The profile</div>
            <p className="p">A certified profile per vendor: what was checked, where, what was found — and when it expires.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="wrap sec3" style={{ paddingBottom: 30 }}>
        <div className="sec-head" style={{ marginBottom: 44 }}>
          <div>
            <div className="k">Questions</div>
            <h2 className="h2" style={{ marginTop: 12 }}>From procurement.</h2>
          </div>
        </div>
        <div className="faq3">
          <details>
            <summary>Does the vendor have to cooperate?<span className="m">+</span></summary>
            <p className="a">
              Mostly no — registries, courts and bureaus answer without the vendor's involvement.
              Where a document must come from the vendor, they get the same one-link upload flow
              candidates use.
            </p>
          </details>
          <details>
            <summary>What does "certified" mean here?<span className="m">+</span></summary>
            <p className="a">
              Every fact in the profile carries its source and check date. Certification isn't our
              opinion of the vendor — it's proof that each claim was verified at the registry that
              holds it.
            </p>
          </details>
          <details>
            <summary>Can this run on our whole vendor base?<span className="m">+</span></summary>
            <p className="a">
              Yes — batches run in parallel, so a thousand vendors take days, not quarters. Renewals
              re-run automatically before a licence or rating goes stale.
            </p>
          </details>
          <details>
            <summary>International suppliers too?<span className="m">+</span></summary>
            <p className="a">
              120+ countries, checked in-country: an Egyptian textile supplier's trade licence is
              confirmed in Cairo, not translated from a scan.
            </p>
          </details>
        </div>
      </div>
    </PageShell>
  );
}

/** /about — the company page. Facts only: everything here traces to the canvas
 *  annotation's "REAL" list (YC, 20M+, 2,000+, 120+, 33+, 6 offices, MOM, certs). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { YCBadge } from "@/components/brand/YCBadge";
import Image from "next/image";
import { CERT_BOX, SIZES_PATH_SPAN2 } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about");
}

export default async function AboutPage({
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
      crumbs={[{ label: "About" }]}
      closing={{
        heading: (
          <>
            Work with us, <em>or come work here.</em>
          </>
        ),
        sub: "Six offices, twelve hours apart, and always hiring people who like getting it right.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">About us</div>
        <h1 className="h1">
          We ask the people <em>who actually know.</em>
        </h1>
        <p className="sub">
          HelloVerify confirms that a claim is true by asking the organisation that issued it —
          the university, the employer, the registry, the court. Since 2018, twenty million times.
        </p>
        <div className="hrow">
          <span
            className="rise"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, height: 38,
              padding: "0 16px 0 14px", borderRadius: 999, background: "var(--white)",
              border: "1px solid var(--hair)", fontSize: 13, fontWeight: 500, color: "var(--ink-soft)",
            }}
          >
            <span>Backed by</span>
            <YCBadge width={103} height={20} />
          </span>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>2018</b> founded</span>
          <span className="it"><b>20M+</b> checks completed</span>
          <span className="it"><b>2,000+</b> clients</span>
          <span className="it"><b>120+</b> countries</span>
          <span className="it"><b>6</b> offices</span>
        </div>
      </div>

      {/* what we believe */}
      <div className="wrap sec3">
        <SecHead k="What we believe" h={<>Three opinions,<br />held firmly.</>}>
          They are why the product is slower than some competitors in exactly one place, and
          better everywhere it matters.
        </SecHead>
        <div className="body3" style={{ maxWidth: 760 }}>
          <div className="rz">
            <div className="n">01</div>
            <div>
              <div className="t">A copy of a record is not the record</div>
              <p className="p">Aggregated databases tell you what someone once typed. We ask the institution that issued the document, which is the only thing a forgery cannot survive.</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">02</div>
            <div>
              <div className="t">&ldquo;Unverifiable&rdquo; must be said out loud</div>
              <p className="p">When a registry cannot be reached, we report that — rather than letting it quietly become a pass. It is the single most common way verification misleads.</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">03</div>
            <div>
              <div className="t">Consent is not paperwork</div>
              <p className="p">The person being verified sees what is being checked and agrees to it, every time. The alternative is surveillance with an invoice attached.</p>
            </div>
          </div>
        </div>
      </div>

      {/* who we serve */}
      <div className="wrap sec3">
        <SecHead k="Who we serve" h={<>Ministries and<br />mothers, same rails.</>}>
          The same pipeline that supports work-pass decisions for a national ministry runs a
          ₹499 check on a school-run driver. That is deliberate.
        </SecHead>
        <div className="body3 paths3">
          <AppLink href="/governments" className="cell ph span2">
            <Image className="pimg" src="/img/10-ministry-hall.jpg" alt="" fill sizes={SIZES_PATH_SPAN2} />
            <div className="scrim" />
            <span className="tag">Governments</span>
            <div className="body">
              <div className="h">Authorities</div>
              <div className="p">Work passes, licences, visas and trade registries — including Singapore&apos;s Ministry of Manpower.</div>
            </div>
          </AppLink>
          <AppLink href="/business" className="cell ph span2">
            <Image className="pimg" src="/img/11-office-first-day.jpg" alt="" fill sizes={SIZES_PATH_SPAN2} />
            <div className="scrim" />
            <span className="tag">Business</span>
            <div className="body">
              <div className="h">Employers</div>
              <div className="p">From 2,000+ enterprise clients to a first hire at a five-person company.</div>
            </div>
          </AppLink>
          <AppLink href="/individuals" className="cell ph span2">
            <Image className="pimg" src="/img/15-home-doorway.jpg" alt="" fill sizes={SIZES_PATH_SPAN2} />
            <div className="scrim" />
            <span className="tag">Individuals</span>
            <div className="body">
              <div className="h">Families</div>
              <div className="p">The driver, the nanny, the tenant — verification that used to be only for corporations.</div>
            </div>
          </AppLink>
        </div>
      </div>

      {/* offices */}
      <div className="wrap sec3">
        <SecHead k="Where we are" h={<>Six offices,<br />on purpose.</>}>
          Verification has to happen where the document was issued. Offices in the places our
          clients&apos; people come from is not a growth story — it is the product working.
        </SecHead>
        <div className="body3 off3">
          <div className="o3"><b>Noida</b><span>India · head office</span></div>
          <div className="o3"><b>Manila</b><span>Philippines</span></div>
          <div className="o3"><b>Singapore</b><span>Singapore</span></div>
          <div className="o3"><b>Dubai</b><span>UAE</span></div>
          <div className="o3"><b>Cairo</b><span>Egypt</span></div>
          <div className="o3"><b>New York</b><span>United States</span></div>
        </div>
      </div>

      {/* credentials */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <SecHead k="Credentials" h={<>Checked,<br />ourselves.</>}>
          A verification company that cannot evidence its own claims is telling on itself.
        </SecHead>
        <div className="body3 certs3">
          <div className="cert">
            <Image src="/img/iso.jpg" alt="ISO 27001" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">ISO 27001 certified</div>
              <p className="p">Information security management, independently audited.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/pbsa.jpg" alt="PBSA" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">PBSA member</div>
              <p className="p">The global standards body for the screening industry.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/nsr.jpg" alt="NSR" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">National Skills Registry</div>
              <p className="p">India&apos;s registry of verified IT and ITeS professionals.</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/mom.jpg" alt="Ministry of Manpower, Singapore" width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">In production with a ministry</div>
              <p className="p">
                Work-pass credential verification with Singapore&apos;s Ministry of Manpower —{" "}
                <AppLink href="/governments/manpower-education/ministry-of-manpower" style={{ fontWeight: 500 }}>the story →</AppLink>
              </p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-line btn-sm">Security &amp; compliance, in full</AppLink>
        </div>
      </div>
    </PageShell>
  );
}

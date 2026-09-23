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
import { SecHead } from "@/components/chrome/SecHead";
import { CONTACT } from "@/lib/copy/contact";
import { copy } from "@/lib/copy/request";

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
  const t = await copy(CONTACT);

  return (
    <PageShell
      crumbs={[{ label: t.crumb }]}
      closing={{
        heading: t.closing.heading,
        sub: t.closing.sub,
        ctaLabel: t.closing.ctaLabel,
        img: "/img/11-office-first-day.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">{t.hero.kicker}</div>
        <h1 className="h1">{t.hero.h1}</h1>
        <p className="sub">{t.hero.sub}</p>
      </div>

      {/* the form */}
      <div className="wrap" style={{ paddingTop: 20 }}>
        <div className="ct3">
          <div className="side ph">
            <Image className="pimg" src="/img/23-closing.jpg" alt="" fill sizes={SIZES_SIDE} priority />
            <div className="scrim" />
            <div className="body">
              <div className="h">{t.side.h}</div>
              <p className="p">{t.side.p}</p>
            </div>
          </div>

          <ContactForm locale={locale} />
        </div>
      </div>

      {/* other routes in */}
      <div className="wrap sec3">
        <SecHead k={t.ways.kicker} h={t.ways.heading}>{t.ways.lede}</SecHead>
        <div className="body3 art3">
          <div className="a3">
            <div>
              <div className="t3">{t.ways.rows.individual.t}</div>
              <p className="p3">{t.ways.rows.individual.p}</p>
            </div>
            <span className="s3">
              <AppLink href="/individuals/hellov" style={{ color: "inherit" }}>{t.ways.rows.individual.link}</AppLink>
            </span>
          </div>
          <div className="a3">
            <div>
              <div className="t3">{t.ways.rows.smb.t}</div>
              <p className="p3">{t.ways.rows.smb.p}</p>
            </div>
            <span className="s3">
              <AppLink href="/business/smb" style={{ color: "inherit" }}>{t.ways.rows.smb.link}</AppLink>
            </span>
          </div>
          <div className="a3">
            <div>
              <div className="t3">{t.ways.rows.security.t}</div>
              <p className="p3">{t.ways.rows.security.p}</p>
            </div>
            <span className="s3">
              <AppLink href="/platform/security-compliance" style={{ color: "inherit" }}>{t.ways.rows.security.link}</AppLink>
            </span>
          </div>
          <div className="a3">
            <div>
              <div className="t3">{t.ways.rows.support.t}</div>
              <p className="p3">{t.ways.rows.support.p}</p>
            </div>
            <span className="s3 req">{t.ways.rows.support.link}</span>
          </div>
        </div>
      </div>

      {/* offices */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <SecHead k={t.offices.kicker} h={t.offices.heading}>{t.offices.lede}</SecHead>
        <div className="body3 offices3">
          <div className="o"><b>{t.offices.list.noida.city}</b><span>{t.offices.list.noida.hours}</span></div>
          <div className="o"><b>{t.offices.list.manila.city}</b><span>{t.offices.list.manila.hours}</span></div>
          <div className="o"><b>{t.offices.list.singapore.city}</b><span>{t.offices.list.singapore.hours}</span></div>
          <div className="o"><b>{t.offices.list.dubai.city}</b><span>{t.offices.list.dubai.hours}</span></div>
          <div className="o"><b>{t.offices.list.cairo.city}</b><span>{t.offices.list.cairo.hours}</span></div>
          <div className="o"><b>{t.offices.list.newYork.city}</b><span>{t.offices.list.newYork.hours}</span></div>
        </div>
      </div>
    </PageShell>
  );
}

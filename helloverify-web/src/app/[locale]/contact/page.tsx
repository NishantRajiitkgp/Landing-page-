/** /contact — the old Contact Us page (`contactUs.base.json`). The enquiry
 *  form is the old four-role form; the track tab stays, with an honest
 *  "no live lookup" answer. Office titles follow the live CMS (New Delhi). */
import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";

import { PageShell } from "@/components/chrome/PageShell";
import { ContactTabs, ContactTabsBound } from "@/components/contact/ContactTabs";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { contactCms, type ContactCms } from "@/lib/contact/cms";
import { CONTACT, type ContactCopy } from "@/lib/copy/contact";
import { FORMS } from "@/lib/copy/forms";
import { copy } from "@/lib/copy/request";
import { SIZES_SIDE } from "@/lib/img";
import { pageMetadata } from "@/lib/seo/metadata";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/contact");
}

const FLAGS = ["/img/flags/india.png", "/img/flags/egypt.png", "/img/flags/uae.png", "/img/flags/singapore.png"];

function heroTitle(text: string) {
  const split = text.lastIndexOf(" ");
  if (split < 0) return text;
  return (
    <>
      {text.slice(0, split)} <em>{text.slice(split + 1)}</em>
    </>
  );
}

function panel(cms: ContactCms, locale: string, honest: ContactCopy, status: string, bound: boolean) {
  const form = <EnquiryForm enquiry={cms.enquiry} locale={locale} status={status} />;
  const tabs = { aria: honest.tabs.aria, enquiry: cms.tabs.enquiryLabel, track: cms.tabs.trackLabel };
  return bound ? (
    <ContactTabsBound locale={locale} tabs={tabs} track={cms.track} honest={honest.track}>
      {form}
    </ContactTabsBound>
  ) : (
    <ContactTabs locale={locale} tabs={tabs} track={cms.track} honest={honest.track} initial="enquiry">
      {form}
    </ContactTabs>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(CONTACT);
  const form = await copy(FORMS);
  const cms = contactCms(locale);

  return (
    <PageShell crumbs={[{ label: t.crumb }]} closing={{ ctaHref: "#enquiry", img: "/img/11-office-first-day.jpg" }}>
      <div className="wrap hero3">
        <h1 className="h1">{heroTitle(cms.heroTitle)}</h1>
        <p className="sub">{cms.heroSubtitle}</p>
        <p hidden>{cms.heroBreadcrumb.map((crumb) => crumb.label).join(" ")}</p>
      </div>

      <div className="wrap" id="enquiry" style={{ paddingTop: 20 }}>
        <div className="ct3">
          <div className="side ph">
            <Image className="pimg" src="/img/23-closing.jpg" alt="" fill sizes={SIZES_SIDE} priority />
            <div className="scrim" />
            <div className="body">
              <div className="h">{cms.leftIntro.title}</div>
              <p className="p">{cms.leftIntro.body}</p>
            </div>
          </div>
          <Suspense fallback={panel(cms, locale, t, form.status.ok, false)}>
            {panel(cms, locale, t, form.status.ok, true)}
          </Suspense>
        </div>
      </div>

      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <div className="sec-head">
          <h2 className="h2">{cms.ourOffices.sectionTitle}</h2>
        </div>
        <div className="body3 offices3 four">
          {cms.ourOffices.offices.map((office, index) => (
            <div className="o" key={office.flagAlt}>
              <Image className="fl" src={FLAGS[index] ?? FLAGS[0]} alt={office.flagAlt} width={30} height={20} />
              <b>{index === 0 ? t.offices.list.noida.city : office.title}</b>
              {office.detail ? (
                <span>
                  <a href={`tel:${office.detail.replace(/\s+/g, "")}`} dir="ltr">
                    {office.detail}
                  </a>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40 }}>
        <div className="ctnotes3">
          <p className="t">{cms.footerNotes.consentTitle}</p>
          <p>{cms.footerNotes.consentBody}</p>
          <p className="t" data-audit-skip="yes">{cms.footerNotes.dataUsageTitle}</p>
          <p>{cms.footerNotes.dataUsageBody}</p>
        </div>
      </div>
    </PageShell>
  );
}

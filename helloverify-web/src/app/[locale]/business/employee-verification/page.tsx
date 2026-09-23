/** /business/employee-verification — vertical page (Template 3). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { BUSINESS } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/business/employee-verification";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Employee verification",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function EmployeeVerificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(BUSINESS);
  const c = t.employeeVerification;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/business" }, { label: c.crumb }]}
      closing={{ heading: c.closing.heading, sub: c.closing.sub }}
    >
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{c.hero.cta}</AppLink>
          <a href="#when" className="btn btn-ghost">
            <span>{c.hero.when}</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.digital}</span>
          <span className="it">{c.strip.epfo}</span>
          <span className="it">{c.strip.zero}</span>
          <span className="it">{c.strip.consent}</span>
        </div>
      </div>

      {/* what we check */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). The heading is the question, the
            lede is the whole answer in ~40 words, and it names re-verification
            rather than saying "this" — a block that says "this process" is
            unciteable once an engine lifts it off the page (§11a.2 rule 3).

            Every number here is already on this page: the chip list below
            carries the per-check times, and the strip above carries the 60-min
            digital employment figure. Deliberately NOT naming entitlement to
            work's turnaround, which is one side of the three-way disagreement
            TASKS.md carries between the catalogue, this page and the homepage.
            A citeable sentence is the worst place to pick a side by accident. */}
        <SecHead k={c.whatWeCheck.k} h={c.whatWeCheck.h}>
          {c.whatWeCheck.lede}
        </SecHead>
        <div className="body3 cloud3" style={{ marginTop: 40 }}>
          {/* Each chip keeps its three children — the `.d` dot, the name, the
              `.t` time — so these are two text-node swaps apiece. */}
          <span className="pl3 fast"><span className="d" />{c.chips.digitalEmployment.n}<span className="t">{c.chips.digitalEmployment.t}</span></span>
          <span className="pl3 fast"><span className="d" />{c.chips.moonlighting.n}<span className="t">{c.chips.moonlighting.t}</span></span>
          <span className="pl3 fast"><span className="d" />{c.chips.entitlementToWork.n}<span className="t">{c.chips.entitlementToWork.t}</span></span>
          <span className="pl3 fast"><span className="d" />{c.chips.criminalRefresh.n}<span className="t">{c.chips.criminalRefresh.t}</span></span>
          <span className="pl3 fast"><span className="d" />{c.chips.currentAddress.n}<span className="t">{c.chips.currentAddress.t}</span></span>
          <span className="pl3"><span className="d" />{c.chips.employmentManual.n}<span className="t">{c.chips.employmentManual.t}</span></span>
          <span className="pl3"><span className="d" />{c.chips.education.n}<span className="t">{c.chips.education.t}</span></span>
        </div>
      </div>

      {/* when to re-verify */}
      <div className="wrap sec3" id="when">
        <SecHead k={c.whenItMatters.k} h={c.whenItMatters.h}>
          {c.whenItMatters.lede}
        </SecHead>
        <div className="body3 when3">
          <div className="w">
            <div className="wt">{c.when.joining.wt}</div>
            <p className="wp">{c.when.joining.wp}</p>
            <span className="wm">{c.when.joining.wm}</span>
          </div>
          <div className="w">
            <div className="wt">{c.when.roleChange.wt}</div>
            <p className="wp">{c.when.roleChange.wp}</p>
            <span className="wm">{c.when.roleChange.wm}</span>
          </div>
          <div className="w">
            <div className="wt">{c.when.annual.wt}</div>
            <p className="wp">{c.when.annual.wp}</p>
            <span className="wm">{c.when.annual.wm}</span>
          </div>
          <div className="w">
            <div className="wt">{c.when.incident.wt}</div>
            <p className="wp">{c.when.incident.wp}</p>
            <span className="wm">{c.when.incident.wm}</span>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <SecHead k={c.howItWorks.k} h={c.howItWorks.h}>
          {c.howItWorks.lede}
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`,
            so the node and the heading are the same string — now ONE leaf read
            twice rather than two identical literals a translation could part. */}
        <Steps
          name={c.howItWorks.h}
          items={[c.steps.enroll, c.steps.verify, c.steps.alert]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from the same records (see
          FaqSection). The order is structure and stays here. */}
      <FaqSection
        head={c.faqHead}
        faqs={[c.faqs.legal, c.faqs.digital, c.faqs.moonlighting, c.faqs.contacted]}
      />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

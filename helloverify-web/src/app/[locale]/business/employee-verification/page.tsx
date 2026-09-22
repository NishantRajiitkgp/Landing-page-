/** /business/employee-verification — vertical page (Template 3). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { Faq } from "@/lib/seo/schema/faq";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";

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

/** The FAQ copy, stated once. `<FaqSection>` renders it and emits the
 *  matching `FAQPage` node from the same array — Google requires the two to
 *  say the same words (BUILD-SPEC §8.2, and `lib/seo/schema/faq.ts`). */
const FAQS: Faq[] = [
  {
    q: "Is re-verifying existing employees even legal?",
    a:
      "Yes, with consent — which the flow captures per run, not as a blanket signature from five years ago. Scope is limited to what the role justifies, and employees can see what was checked.",
  },
  {
    q: "What is a \"digital employment\" check?",
    a:
      "Work history reconstructed from provident-fund contribution records — employer names, overlaps and gaps — confirmed at the source in about an hour, without calling anyone's current employer.",
  },
  {
    q: "Can it detect moonlighting?",
    a:
      "Concurrent PF contributions from a second employer show up in the same 60-minute check. The report shows the overlap period, not an accusation — what you do with it is policy.",
  },
  {
    q: "Will employees be contacted?",
    a:
      "Only for consent, on their own phone. Digital checks never touch their employer or colleagues; manual employment checks do, and are marked clearly before you order one.",
  },
];

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

  return (
    <PageShell
      crumbs={[{ label: "Business", href: "/business" }, { label: "Employee verification" }]}
      closing={{
        heading: (
          <>
            The people you already trust, <em>on the record.</em>
          </>
        ),
        sub: "Roll out re-verification without disrupting a single shift.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Business · Employee verification</div>
        <h1 className="h1">
          Know your workforce. <em>Still.</em>
        </h1>
        <p className="sub">
          Verification isn't only for new hires. Contractors, gig fleets and staff moving into
          sensitive roles — re-verified in the background, from provident-fund records to courts.
        </p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <a href="#when" className="btn btn-ghost">
            <span>When to re-verify</span>
            <Arrow />
          </a>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>60 min</b> digital employment check</span>
          <span className="it"><b>EPFO</b>-backed work history</span>
          <span className="it"><b>Zero</b> forms for the employee</span>
          <span className="it"><span className="dot" /> consent captured every run</span>
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
        <SecHead k="What we check" h="What does employee re-verification check?">
          Employee re-verification covers digital employment, moonlighting, entitlement to
          work, a criminal refresh and current address. Provident-fund and court records
          answer digitally — digital employment in 60 minutes. Where a former employer has
          to be called, HelloVerify calls, and the report names who picked up.
        </SecHead>
        <div className="body3 cloud3" style={{ marginTop: 40 }}>
          <span className="pl3 fast"><span className="d" />Digital employment<span className="t">60 min</span></span>
          <span className="pl3 fast"><span className="d" />Moonlighting<span className="t">60 min</span></span>
          <span className="pl3 fast"><span className="d" />Entitlement to work<span className="t">60 min</span></span>
          <span className="pl3 fast"><span className="d" />Criminal refresh<span className="t">30 min</span></span>
          <span className="pl3 fast"><span className="d" />Current address<span className="t">30 min</span></span>
          <span className="pl3"><span className="d" />Employment (manual)<span className="t">2 days</span></span>
          <span className="pl3"><span className="d" />Education<span className="t">3 days</span></span>
        </div>
      </div>

      {/* when to re-verify */}
      <div className="wrap sec3" id="when">
        <SecHead k="When it matters" h="When should you re-verify an employee?">
          Re-verify at four moments: joining, a role change into finance, security or
          childcare-adjacent work, an annual refresh across the workforce, and after an
          incident. A check is a snapshot of the day it ran, and these are the four points
          where the picture changes — and the ones auditors ask about.
        </SecHead>
        <div className="body3 when3">
          <div className="w">
            <div className="wt">Joining</div>
            <p className="wp">The baseline: identity, work history and records confirmed before access is granted.</p>
            <span className="wm">same day</span>
          </div>
          <div className="w">
            <div className="wt">Role change</div>
            <p className="wp">Moving into finance, security or childcare-adjacent work triggers the checks that role demands.</p>
            <span className="wm">60 min</span>
          </div>
          <div className="w">
            <div className="wt">Annual refresh</div>
            <p className="wp">Criminal and moonlighting refresh across the workforce, batched so HR does nothing manually.</p>
            <span className="wm">runs overnight</span>
          </div>
          <div className="w">
            <div className="wt">Incident</div>
            <p className="wp">A targeted re-run with an auditable trail, ready for legal the same day.</p>
            <span className="wm">30 min</span>
          </div>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <SecHead k="How it works" h="How does re-verification work without disrupting staff?">
          Employees consent once on their own phone. After that, re-verification runs from a
          roster upload or an HRMS sync, checks statutory and court records digitally, and
          reports only the changes — a new court record, a second employer — rather than
          every clean result. Nobody fills in a form again.
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`,
            so the node and the heading are the same string. */}
        <Steps
          name="How does re-verification work without disrupting staff?"
          items={[
          { n: "01 · One CSV or API call", t: "Enroll", p: "Upload the roster or sync from your HRMS. Each employee gets a consent link." },
          { n: "02 · On schedule", t: "Verify", p: "Checks run digitally against provident-fund, court and registry records. Humans handle the exceptions." },
          { n: "03 · Only the changes", t: "Alert", p: "You hear about the deltas — a new court record, a second employer — not five hundred clean results." },
          ]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from FAQS (see FaqSection). */}
      <FaqSection head={<>Fair questions.</>} faqs={FAQS} />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

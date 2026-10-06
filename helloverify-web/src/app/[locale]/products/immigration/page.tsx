/** Pre-screening of applicants — the old `immigrationMigrationService.base.json`
 *  applicant tab on the new design, in its order: three icon step cards, our
 *  partners, the information guide, how HelloVerify makes it easy (six icon
 *  cards), and customer voices (photo, name, quote, four stars). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ImmigrationTabQuery } from "@/components/immigration/ImmigrationTabQuery";
import { ImmigrationTabs } from "@/components/immigration/ImmigrationTabs";
import { ImmigrationPartners } from "@/components/immigration/ImmigrationPartners";
import { ImmigrationGuide } from "@/components/immigration/ImmigrationGuide";
import { ApplicantIcon, type EasyIconId, type StepIconId } from "@/components/immigration/ApplicantIcons";
import { INDIVIDUALS, type IndividualsCopy } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";
import { localise } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/routing";
import { IMMIGRATION_AUTHORITIES_HREF } from "@/lib/immigration/tab";
import { CHECKLISTS } from "@/lib/immigration/checklists";
import { VISA_HOST } from "@/lib/seo/legacy-urls";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/products/immigration";

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
 *  apart. `name` and `serviceType` stay here rather than in the dictionary —
 *  see `lib/copy/individuals.en.tsx`. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Visa and immigration document screening",
  description: copyFor(PATH).description,
  serviceType: "Document verification",
};

type C = IndividualsCopy["immigration"];

/** Old CMS icon ids. */
const STEP_ICONS: Record<keyof C["steps"]["items"], StepIconId> = {
  upload: "faBolt",
  reminders: "faClipboardCheck",
  dashboard: "faBullhorn",
};
const EASY_ICONS: Record<keyof C["easy"]["cards"], EasyIconId> = {
  trust: "faShield",
  onboarding: "faMobile",
  queues: "faClock",
  reminders: "faBell",
  dashboards: "faChartLine",
  secure: "faCheck",
};

const VOICES = {
  rohit: { src: "/img/immigration/rohit.png", w: 296, h: 280 },
  anjali: { src: "/img/immigration/anjali.jpg", w: 240, h: 210 },
  neha: { src: "/img/immigration/neha.jpg", w: 275, h: 183 },
} as const;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const c = (await copy(INDIVIDUALS)).immigration;

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <ImmigrationTabQuery authoritiesHref={localise(IMMIGRATION_AUTHORITIES_HREF, locale)} />
      <JsonLd data={serviceNode(locale, SERVICE)} />
      <div className="wrap hero3">
        <h1 className="h1">{c.h1}</h1>
        <p className="sub">{c.sub}</p>
        <ImmigrationTabs selected="applicant" />
      </div>

      <div className="wrap sec3">
        <div className="sec-head smb3-head">
          <h2 className="h2">{c.steps.h}</h2>
        </div>
        <ul className="body3 smb3-cards imm3-steps">
          {(Object.keys(STEP_ICONS) as (keyof typeof STEP_ICONS)[]).map((k) => (
            <li key={k}>
              <span className="ic">
                <ApplicantIcon id={STEP_ICONS[k]} />
              </span>
              <h3>{c.steps.items[k].t}</h3>
              <p>{c.steps.items[k].p}</p>
            </li>
          ))}
        </ul>
      </div>

      <ImmigrationPartners h={c.partners.h} logos={c.partners.logos} cta={c.partners.cta} href={VISA_HOST} />

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{c.guide.h}</h2>
          <p className="lede">{c.guide.sub}</p>
        </div>
        <ImmigrationGuide g={c.guide} checklists={CHECKLISTS[locale as Locale] ?? CHECKLISTS.en} ctaHref={VISA_HOST} />
      </div>

      <div className="wrap sec3">
        <div className="sec-head smb3-head">
          <h2 className="h2">{c.easy.h}</h2>
        </div>
        <ul className="body3 smb3-cards imm3-easy">
          {(Object.keys(EASY_ICONS) as (keyof typeof EASY_ICONS)[]).map((k) => (
            <li key={k}>
              <span className="ic">
                <ApplicantIcon id={EASY_ICONS[k]} />
              </span>
              <h3>{c.easy.cards[k].t}</h3>
              <p>{c.easy.cards[k].p}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{c.testimonials.h}</h2>
        </div>
        <ul className="body3 imm3-voices">
          {(Object.keys(VOICES) as (keyof typeof VOICES)[]).map((k) => {
            const v = c.testimonials.cards[k];
            const img = VOICES[k];
            return (
              <li key={k}>
                <Image src={img.src} alt={v.name} width={img.w} height={img.h} sizes="90px" className="ph" />
                <h3>{v.name}</h3>
                <p>“{v.quote}”</p>
                <span className="stars" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <svg key={i} viewBox="0 0 15 14">
                      <path d="M6.69533 0.487005L4.86449 4.10687L0.768236 4.68922C0.0336581 4.79311 -0.260734 5.67621 0.271975 6.182L3.23552 8.99806L2.53459 12.9761C2.40842 13.6951 3.18505 14.2337 3.83552 13.8975L7.5 12.0192L11.1645 13.8975C11.8149 14.231 12.5916 13.6951 12.4654 12.9761L11.7645 8.99806L14.728 6.182C15.2607 5.67621 14.9663 4.79311 14.2318 4.68922L10.1355 4.10687L8.30467 0.487005C7.97664 -0.158228 7.02617 -0.16643 6.69533 0.487005Z" />
                    </svg>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </PageShell>
  );
}

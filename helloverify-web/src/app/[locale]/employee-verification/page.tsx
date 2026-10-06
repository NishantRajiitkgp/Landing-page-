/** /employee-verification — the old SPA's Employee Verification page in its
 *  order: hero, "Employee Verification Solutions", White-Collar Verification,
 *  Why White-Collar Verification Matters, the HR & staffing results,
 *  Blue-Collar Verification, Why Blue-Collar worker Verification Matters,
 *  Automated Workforce Onboarding, Primary Source Verification. Copy is
 *  `employees.base.json` word for word (`business.employeeVerification`). */
import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { EmployeeChecks } from "@/components/employee/EmployeeChecks";
import { AutomateTabs } from "@/components/employee/AutomateTabs";
import { EmployeeIcon, type EmployeeIconId } from "@/components/employee/EmployeeIcons";
import { BUSINESS, type BusinessCopy } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

const PATH = "/employee-verification";
const TALK = "/contact?tab=enquiry&role=business&contact=business-support";

type E = BusinessCopy["employeeVerification"];

const WHITE_WHY: readonly [keyof E["whiteWhy"]["cards"], EmployeeIconId][] = [["integrity", "integrity"], ["hiring", "hiring"], ["compliance", "compliance"]];
const BLUE_WHY: readonly [keyof E["blueWhy"]["cards"], EmployeeIconId][] = [["trust", "trustMinutes"], ["smart", "verifySmart"], ["compliance", "complianceShield"]];
/** Old CMS stat values; identical in every locale. */
const STATS: readonly [keyof E["results"]["stats"], string][] = [["workflow", "91%"], ["accuracy", "88%"], ["experience", "81%"]];
/** Old screenshots, `public/img/employee/`, with their pixel sizes. */
const AUTOMATE: readonly [keyof E["automate"]["tabs"], string, number, number][] = [
  ["smooth", "Smooth-Experience_HRMS-API-Integration.png", 2088, 974],
  ["hrms", "api_flow.png", 2088, 961],
  ["rules", "Rule-Engine.png", 2088, 962],
  ["tracking", "Real-Time-Tracking.png", 2088, 910],
  ["support", "Excellent-Support.png", 2088, 779],
  ["security", "Enterprise-Grade-Security.jpg", 751, 422],
];
/** Old glyphs, `public/img/employee/psv/`, white on a dark disc. */
const PSV: readonly [keyof E["psv"]["items"], string, number, number][] = [
  ["education", "education-verification", 26, 27],
  ["institute", "institute-accreditation", 30, 29],
  ["employment", "employment-verification", 29, 29],
  ["dualEmployment", "dual-employment-verification", 25, 19],
  ["criminal", "criminal-record-verification", 25, 27],
  ["identity", "identity-verification", 25, 16],
  ["address", "address-verification", 26, 28],
  ["bank", "bank-account-verification", 27, 28],
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}

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
  setRequestLocale(locale);
  const e = (await copy(BUSINESS)).employeeVerification;

  return (
    <PageShell crumbs={[{ label: e.crumb }]} closing={false}>
      <div className="wrap hero3">
        <h1 className="h1">{e.hero.h1}</h1>
        <div className="hrow">
          <AppLink href={TALK} className="btn btn-ink">
            {e.hero.cta}
          </AppLink>
        </div>
      </div>

      <div className="wrap emp3-banner">
        <h2 className="h2">{e.banner}</h2>
      </div>

      <Split id="employees-white-collar" c={e.white} img={["white-caller-verification.png", 1454, 1024]} service="white-collar-verification" />
      <Why h={e.whiteWhy.h} cards={WHITE_WHY.map(([k, icon]) => ({ k, icon, ...e.whiteWhy.cards[k] }))} />

      <div className="wrap sec3">
        <div className="emp3-results">
          <h2>{e.results.h}</h2>
          <div className="smb3-stats">
            {STATS.map(([k, v]) => (
              <div key={k}>
                <p className="v">{v}</p>
                <p className="l">{e.results.stats[k]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Split id="employees-blue-collar" c={e.blue} img={["blue-caller-verification.png", 1536, 1024]} service="blue-collar-verification" />
      <Why h={e.blueWhy.h} cards={BLUE_WHY.map(([k, icon]) => ({ k, icon, ...e.blueWhy.cards[k] }))} />

      <div className="wrap sec3">
        <div className="sec-head smb3-head">
          <h2 className="h2">{e.automate.h}</h2>
          <p className="lede">{e.automate.p}</p>
        </div>
        <AutomateTabs
          items={AUTOMATE.map(([k, file, w, h]) => ({
            k,
            t: e.automate.tabs[k].t,
            p: e.automate.tabs[k].p,
            img: <Image src={`/img/employee/${file}`} alt={e.automate.tabs[k].alt} width={w} height={h} sizes="(max-width: 1080px) 92vw, 820px" />,
          }))}
        />
      </div>

      <div className="wrap sec3">
        <div className="sec-head smb3-head">
          <h2 className="h2">{e.psv.h}</h2>
        </div>
        <ul className="body3 emp3-psv">
          {PSV.map(([k, file, w, h]) => (
            <li key={k}>
              <span className="ic">
                <Image src={`/img/employee/psv/${file}.svg`} alt="" width={w} height={h} unoptimized />
              </span>
              <p>{e.psv.items[k]}</p>
            </li>
          ))}
        </ul>
      </div>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

/** The old split panel: title, intro and the checks card beside the photo,
 *  "Talk to Sales" centred below. */
function Split({
  id,
  c,
  img: [file, w, h],
  service,
}: {
  id: string;
  c: E["white"] | E["blue"];
  img: readonly [string, number, number];
  service: string;
}) {
  return (
    <div className="wrap sec3" id={id}>
      <div className="emp3-split">
        <div className="emp3-copy">
          <h2 className="h2">{c.h}</h2>
          <p className="lede">{c.p}</p>
          <EmployeeChecks id={id} items={Object.entries(c.checks).map(([k, x]) => ({ k, n: x.n, p: x.p }))} />
        </div>
        <figure className="emp3-fig">
          <Image src={`/img/employee/${file}`} alt={c.alt} width={w} height={h} sizes="(max-width: 1080px) 92vw, 520px" />
        </figure>
      </div>
      <div className="emp3-cta">
        <AppLink href={`${TALK}&service=${service}`} className="btn btn-ink">
          {c.cta}
        </AppLink>
      </div>
    </div>
  );
}

function Why({ h, cards }: { h: string; cards: readonly { k: string; icon: EmployeeIconId; t: string; p: string }[] }) {
  return (
    <div className="wrap sec3">
      <div className="sec-head smb3-head">
        <h2 className="h2">{h}</h2>
      </div>
      <ul className="body3 smb3-cards">
        {cards.map((x) => (
          <li key={x.k}>
            <span className="ic">
              <EmployeeIcon id={x.icon} />
            </span>
            <h3>{x.t}</h3>
            <p>{x.p}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

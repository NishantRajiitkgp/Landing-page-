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
import { Arrow } from "@/components/brand/Arrow";
import { setRequestLocale } from "next-intl/server";
import { EmployeeSegment, type SegmentClients } from "@/components/employee/EmployeeSegment";
import { AutomateTabs } from "@/components/employee/AutomateTabs";
import { EmployeeIcon, type EmployeeIconId } from "@/components/employee/EmployeeIcons";
import { BUSINESS, type BusinessCopy } from "@/lib/copy/business";
import { SECTIONS } from "@/lib/copy/sections";
import { copy } from "@/lib/copy/request";
import { WHITE_COLLAR_CLIENTS, whiteLogo } from "@/lib/whiteCollarClients";

const PATH = "/employee-verification";
const TALK = "/contact?tab=enquiry&role=business&contact=business-support";

type E = BusinessCopy["employeeVerification"];

const WHITE_WHY: readonly [keyof E["whiteWhy"]["cards"], EmployeeIconId][] = [["integrity", "integrity"], ["hiring", "hiring"], ["compliance", "compliance"]];
const BLUE_WHY: readonly [keyof E["blueWhy"]["cards"], EmployeeIconId][] = [["trust", "trustMinutes"], ["smart", "verifySmart"], ["compliance", "complianceShield"]];
/** The two segment sections: anchor (linked from the homepage packages and
 *  `/products/bgv-enterprise`), photo with its pixel size, and the
 *  `service` the contact form preselects. */
const SEGMENTS = {
  white: { key: "white", id: "employees-white-collar", img: ["white-caller-verification.png", 1454, 1024], service: "white-collar-verification" },
  blue: { key: "blue", id: "employees-blue-collar", img: ["blue-caller-verification.png", 1536, 1024], service: "blue-collar-verification" },
} as const;
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
  /** The client marks and their label are the homepage packages' own copy. */
  const kv = (await copy(SECTIONS)).packages;
  const whiteClients: SegmentClients = {
    h: kv.collars.white.clientsH,
    items: WHITE_COLLAR_CLIENTS.map((cl) => ({ id: cl.id, fit: cl.fit, src: whiteLogo(cl.id), alt: kv.clients[cl.id] })),
  };

  const segments = [SEGMENTS.white, SEGMENTS.blue].map((s, i, all) => ({ id: s.id, img: s.img, no: i + 1, of: all.length, tone: s.key, c: e[s.key], href: `${TALK}&service=${s.service}` }));

  return (
    <PageShell crumbs={[{ label: e.crumb }]} closing={false}>
      <div className="emp4">
        <div className="wrap emp4-hero">
          <div className="tx">
            <h1 className="h1">{e.hero.h1}</h1>
            <div className="hrow">
              <AppLink href={TALK} className="btn btn-ink">
                {e.hero.cta}
                <Arrow />
              </AppLink>
            </div>
          </div>
          <nav className="emp4-index" aria-labelledby="emp4-index-h">
            <h2 id="emp4-index-h">{e.banner}</h2>
            <ul>
              {segments.map(({ id, img: [file], c, no }) => {
                const names = Object.values(c.checks).map((x) => x.n);
                return (
                  <li key={id}>
                    <a href={`#${id}`} className="emp4-jump">
                      <span className="im">
                        <Image src={`/img/employee/${file}`} alt="" fill sizes="(max-width: 640px) 72px, 128px" />
                      </span>
                      <span className="tx">
                        <span className="no" aria-hidden="true">{String(no).padStart(2, "0")}</span>
                        <span className="t">{c.h}</span>
                        <span className="ck">
                          {names.slice(0, 2).map((n) => (
                            <span key={n}>{n}</span>
                          ))}
                          {names.length > 2 && <b>{`+${names.length - 2}`}</b>}
                        </span>
                      </span>
                      <span className="go" aria-hidden="true">
                        <svg viewBox="0 0 16 16">
                          <path d="M8 3v10M4 9l4 4 4-4" />
                        </svg>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <EmployeeSegment {...segments[0]} clients={whiteClients} />
        <Why tone="white" h={e.whiteWhy.h} cards={WHITE_WHY.map(([k, icon]) => ({ k, icon, ...e.whiteWhy.cards[k] }))} />

        <section className="wrap sec3" aria-labelledby="emp4-results-h">
          <div className="emp4-results">
            <h2 id="emp4-results-h">{e.results.h}</h2>
            <ul>
              {STATS.map(([k, v]) => (
                <li key={k}>
                  <p className="v">{v}</p>
                  <span className="bar" aria-hidden="true">
                    <i style={{ inlineSize: v }} />
                  </span>
                  <p className="l">{e.results.stats[k]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <EmployeeSegment {...segments[1]} />
        <Why tone="blue" h={e.blueWhy.h} cards={BLUE_WHY.map(([k, icon]) => ({ k, icon, ...e.blueWhy.cards[k] }))} />

        <section className="wrap sec3" aria-labelledby="emp4-auto-h">
          <div className="emp4-head">
            <h2 className="h2" id="emp4-auto-h">{e.automate.h}</h2>
            <p className="lede">{e.automate.p}</p>
          </div>
          <AutomateTabs
            items={AUTOMATE.map(([k, file, w, h]) => ({
              k,
              t: e.automate.tabs[k].t,
              p: e.automate.tabs[k].p,
              img: <Image src={`/img/employee/${file}`} alt={e.automate.tabs[k].alt} width={w} height={h} sizes="(max-width: 1080px) 92vw, 860px" />,
            }))}
          />
        </section>

        <section className="wrap sec3" aria-labelledby="emp4-psv-h">
          <div className="emp4-head">
            <h2 className="h2" id="emp4-psv-h">{e.psv.h}</h2>
          </div>
          <ul className="emp4-psv">
            {PSV.map(([k, file, w, h]) => (
              <li key={k}>
                <span className="glyph" aria-hidden="true">
                  <span className="gl" style={{ width: w, height: h, maskImage: `url(/img/employee/psv/${file}.svg)` }} />
                </span>
                <p>{e.psv.items[k]}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

function Why({ tone, h, cards }: { tone: "white" | "blue"; h: string; cards: readonly { k: string; icon: EmployeeIconId; t: string; p: string }[] }) {
  return (
    <section className={`wrap sec3 emp4-why emp4-why-${tone}`}>
      <div className="hd">
        <h2 className="h2">{h}</h2>
      </div>
      <ul>
        {cards.map((x) => (
          <li key={x.k}>
            <span className="glyph" aria-hidden="true">
              <EmployeeIcon id={x.icon} />
            </span>
            <div>
              <h3>{x.t}</h3>
              <p>{x.p}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

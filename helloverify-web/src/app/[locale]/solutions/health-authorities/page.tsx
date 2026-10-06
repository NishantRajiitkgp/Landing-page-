/** Health Authorities — the old `healthAuthorities.base.json` on the new
 *  design, in its order: overview, practitioner categories, primary source
 *  verification, how HelloVerify makes it easy, and the accuracy promise. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/solutions/health-authorities";

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
  name: "Verification for health authorities",
  description: copyFor(PATH).description,
  serviceType: "Credential verification",
};

const CATEGORY_IMAGES = {
  doctor: { src: "/img/health/doctor.png", w: 740, h: 518 },
  practitioners: { src: "/img/health/practitioners.jpg", w: 1200, h: 800 },
  nonPhysician: { src: "/img/health/non-physician.png", w: 740, h: 485 },
  pharmacists: { src: "/img/health/pharmacists.jpg", w: 1200, h: 800 },
  nurses: { src: "/img/health/nurses-and-midwives.jpg", w: 1200, h: 798 },
} as const;

const PSV_ICONS = {
  education: "/img/health/education-verification.svg",
  accreditation: "/img/health/institute-accreditation-check.svg",
  license: "/img/health/health-license.svg",
  standing: "/img/health/certificate-of-good-standing.svg",
  registration: "/img/health/business-registration-certificate.svg",
  employment: "/img/health/employment-verification.svg",
} as const;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree falls back to reading request headers, which makes the route
  // dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const d = (await copy(GOVERNMENTS)).health;

  return (
    <PageShell crumbs={[{ label: d.crumb }]} closing={false}>
      <JsonLd data={serviceNode(locale, SERVICE)} />
      <div className="wrap hero3">
        <h1 className="h1">{d.h1}</h1>
        <p className="sub">{d.sub}</p>
      </div>

      <div className="wrap sec3">
        <div className="aud3">
          <div>
            <h2 className="h2">{d.overview.h}</h2>
            <p className="lede">{d.overview.p}</p>
            <ul className="pts3 plain">
              {d.overview.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="fig">
            <Image
              src="/img/health/overview-img.png"
              alt={d.overview.imgAlt}
              width={579}
              height={335}
              sizes="(max-width: 1080px) 100vw, 560px"
            />
          </div>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.categories.h}</h2>
          <p className="lede">{d.categories.sub}</p>
        </div>
        <ul className="body3 cat3">
          {(Object.keys(CATEGORY_IMAGES) as (keyof typeof CATEGORY_IMAGES)[]).map((k) => {
            const img = CATEGORY_IMAGES[k];
            return (
              <li key={k}>
                <Image src={img.src} alt="" width={img.w} height={img.h} sizes="(max-width: 1080px) 50vw, 240px" />
                <h3>{d.categories.items[k]}</h3>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.psv.h}</h2>
        </div>
        <div className="body3 vals3">
          {(Object.keys(PSV_ICONS) as (keyof typeof PSV_ICONS)[]).map((k) => (
            <div key={k} className="v">
              <span className="ic3" aria-hidden="true">
                <Image src={PSV_ICONS[k]} alt="" width={22} height={22} unoptimized />
              </span>
              <h3>{d.psv.cards[k].t}</h3>
              <p>{d.psv.cards[k].p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.easy.h}</h2>
        </div>
        <div className="body3 vals3 four">
          {Object.entries(d.easy.cards).map(([k, c]) => (
            <div key={k} className="v">
              <h3>{c.t}</h3>
              <p>{c.p}</p>
              <ul className="chk3">
                {c.b.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.promise.h}</h2>
          <div>
            {d.promise.intro.map((p) => (
              <p key={p} className="lede">{p}</p>
            ))}
          </div>
        </div>
        <div className="body3 vals3">
          {Object.entries(d.promise.cards).map(([k, c]) => (
            <div key={k} className="v">
              <h3>{c.t}</h3>
              <p>{c.p}</p>
              <ul className="chk3">
                {c.b.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

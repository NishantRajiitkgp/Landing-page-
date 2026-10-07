/** Manpower & Education Authorities — the old `educationAuthorities.base.json`
 *  on the new design, in its order: our client, overview, our verification
 *  services, and the accuracy promise. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/solutions/manpower-and-education-authorities";

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
  name: "Verification for manpower and education authorities",
  description: copyFor(PATH).description,
  serviceType: "Credential verification",
};

/** Our Client, in the old CMS card order: logo, intrinsic size, destination. */
const CLIENTS = [
  ["mom", "/img/education/mom-logo.png", 152, 152, "/solutions/manpower-and-education-authorities/ministry-of-manpower"],
  ["mohesr", "/img/education/mohesr-logo.jpg", 800, 673, "/solutions/manpower-and-education-authorities/mohesr"],
] as const;
const SALES = "/contact?tab=enquiry&role=applicant&service=education-authority";

const SERVICE_IMAGES = {
  qualification: { src: "/img/education/qualification-verification.jpg", w: 1200, h: 643 },
  accreditation: { src: "/img/education/institution-accreditation.jpg", w: 1200, h: 675 },
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
  const d = (await copy(GOVERNMENTS)).manpowerEducation;

  return (
    <PageShell crumbs={[{ label: d.crumb }]} closing={false}>
      <JsonLd data={serviceNode(locale, SERVICE)} />
      <div className="wrap hero3">
        <h1 className="h1">{d.h1}</h1>
        <p className="sub">{d.sub}</p>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.client.h}</h2>
          <p className="lede">{d.client.sub}</p>
        </div>
        <ul className="body3 cli3-grid">
          {CLIENTS.map(([k, src, w, h, href]) => {
            const c = d.client[k];
            return (
              <li key={k} className="cli3">
                <span className={`lg lg-${k}`}>
                  <Image src={src} alt={c.logoAlt} width={w} height={h} sizes="180px" />
                </span>
                <h3>{c.name}</h3>
                <AppLink href={href} className="btn btn-ink">
                  {c.cta}
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </AppLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="wrap sec3">
        <div className="aud3">
          <div>
            <h2 className="h2">{d.overview.h}</h2>
            <p className="lede">{d.overview.p}</p>
            <ul className="pts3 plain">
              {d.overview.bullets.map((b) => (
                <li key={b.t}>
                  <b>{b.t}</b> {b.p}
                </li>
              ))}
            </ul>
            <p className="lede">{d.overview.closing}</p>
          </div>
          <div className="fig">
            <Image
              src="/img/education/overview.png"
              alt={d.overview.imgAlt}
              width={1264}
              height={848}
              sizes="(max-width: 1080px) 100vw, 560px"
            />
          </div>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.services.h}</h2>
          <p className="lede">{d.services.sub}</p>
        </div>
        <div className="body3 svc3">
          {(Object.keys(SERVICE_IMAGES) as (keyof typeof SERVICE_IMAGES)[]).map((k) => {
            const c = d.services.cards[k];
            const img = SERVICE_IMAGES[k];
            return (
              <div key={k} className="c">
                <Image src={img.src} alt={c.imgAlt} width={img.w} height={img.h} sizes="(max-width: 1080px) 100vw, 600px" />
                <div className="tx">
                  <h3>{c.t}</h3>
                  {c.p.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  <AppLink href={SALES} className="btn btn-ink">{c.cta}</AppLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.promise.h}</h2>
          <div>
            {d.promise.sub.map((p) => (
              <p key={p} className="lede">{p}</p>
            ))}
          </div>
        </div>
        <div className="body3 vals3">
          {Object.entries(d.promise.cards).map(([k, c]) => (
            <div key={k} className="v">
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

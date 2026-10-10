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

/** One 24px stroke glyph per promise card, keyed like `d.promise.cards`. */
const PROMISE_ICONS: Record<string, string> = {
  psv: "M3 10h18M5 10v8M9.67 10v8M14.33 10v8M19 10v8M3 20h18M12 3l9 5H3z",
  speed: "M13 2 4 14h7l-1 8 9-12h-7z",
  fraud:
    "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M6.5 12S8.5 8.5 12 8.5s5.5 3.5 5.5 3.5-2 3.5-5.5 3.5-5.5-3.5-5.5-3.5zM12 13.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z",
  intelligence: "M4 20h16M7 16v-4M12 16V7M17 16v-6M5 9l5-4 4 3 5-4",
  compliance: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  sovereignty:
    "M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3zM4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6",
};

const Arrow = () => (
  <svg className="arr" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

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
      <div className="edu3">
        <div className="wrap edu3-hero">
          <div className="tx">
            <h1 className="h1">{d.h1}</h1>
            <p className="sub">{d.sub}</p>
            <div className="hrow">
              <AppLink href={SALES} className="btn btn-ink">
                {d.services.cards.qualification.cta}
                <Arrow />
              </AppLink>
            </div>
          </div>
          <div className="fig">
            <Image
              src="/img/education/overview.png"
              alt={d.overview.imgAlt}
              width={1264}
              height={848}
              priority
              sizes="(max-width: 1080px) 100vw, 600px"
            />
            <span className="seal" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
          </div>
        </div>

        <div className="wrap sec3">
          <div className="sec-head">
            <h2 className="h2">{d.client.h}</h2>
            <p className="lede">{d.client.sub}</p>
          </div>
          <ul className="body3 edu3-clis">
            {CLIENTS.map(([k, src, w, h, href]) => {
              const c = d.client[k];
              return (
                <li key={k} className="edu3-cli">
                  <span className={`lg lg-${k}`}>
                    <Image src={src} alt={c.logoAlt} width={w} height={h} sizes="160px" />
                  </span>
                  <div className="tx">
                    <h3>{c.name}</h3>
                    <AppLink href={href} className="btn btn-ink btn-sm">
                      {c.cta}
                      <Arrow />
                    </AppLink>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="wrap sec3">
          <div className="edu3-ov">
            <div className="hd">
              <h2 className="h2">{d.overview.h}</h2>
              <p className="lede">{d.overview.p}</p>
            </div>
            <ol className="edu3-pts">
              {d.overview.bullets.map((b, i) => (
                <li key={b.t}>
                  <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{b.t}</h3>
                  <p>{b.p}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="edu3-quote">{d.overview.closing}</p>
        </div>

        <div className="wrap sec3">
          <div className="sec-head">
            <h2 className="h2">{d.services.h}</h2>
            <p className="lede">{d.services.sub}</p>
          </div>
          <div className="body3 edu3-svcs">
            {(Object.keys(SERVICE_IMAGES) as (keyof typeof SERVICE_IMAGES)[]).map((k, i) => {
              const c = d.services.cards[k];
              const img = SERVICE_IMAGES[k];
              return (
                <article key={k} className="edu3-svc">
                  <div className="im">
                    <Image src={img.src} alt={c.imgAlt} width={img.w} height={img.h} sizes="(max-width: 1080px) 100vw, 600px" />
                    <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="tx">
                    <h3>{c.t}</h3>
                    {c.p.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    <AppLink href={SALES} className="btn btn-ink">
                      {c.cta}
                      <Arrow />
                    </AppLink>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="wrap sec3">
          <div className="edu3-promise">
            <div className="hd">
              <h2 className="h2">{d.promise.h}</h2>
              <div>
                {d.promise.sub.map((p) => (
                  <p key={p} className="lede">{p}</p>
                ))}
              </div>
            </div>
            <ul className="grid">
              {Object.entries(d.promise.cards).map(([k, c]) => (
                <li key={k}>
                  <span className="glyph" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={PROMISE_ICONS[k] ?? PROMISE_ICONS.compliance} />
                    </svg>
                  </span>
                  <h3>{c.t}</h3>
                  <p>{c.p}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

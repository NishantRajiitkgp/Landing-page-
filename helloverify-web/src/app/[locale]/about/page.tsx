/** /about — the old SPA's About Us page (`about.base.json`) on the new design:
 *  vision and mission, belief, investor, numbers, values, client voices and
 *  the shared certifications block, in the CMS order. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { YCBadge } from "@/components/brand/YCBadge";
import Image from "next/image";
import { CertLogos } from "@/components/chrome/CertLogos";
import { setRequestLocale } from "next-intl/server";
import { ABOUT } from "@/lib/copy/about";
import { copy } from "@/lib/copy/request";

const PARTNERS = [
  { src: "/img/clients/accenture.png", alt: "Accenture", w: 300, h: 79 },
  { src: "/img/clients/wipro.png", alt: "Wipro", w: 102, h: 80 },
  { src: "/img/clients/indigo.png", alt: "IndiGo", w: 384, h: 120 },
  { src: "/img/clients/cognizant.png", alt: "Cognizant", w: 300, h: 54 },
  { src: "/img/clients/hcl.png", alt: "HCL", w: 300, h: 43 },
  { src: "/img/clients/infosys.png", alt: "Infosys", w: 204, h: 80 },
] as const;

const CLIENT_LOGOS = {
  hcl: { src: "/img/clients/hcl.png", alt: "HCL", w: 300, h: 43 },
  cognizant: { src: "/img/clients/cognizant.png", alt: "Cognizant", w: 300, h: 54 },
  heroFincorp: { src: "/img/clients/herofincorp.png", alt: "Hero Fincorp", w: 270, h: 104 },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree falls back to reading request headers, which makes the route
  // dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(ABOUT);

  return (
    <PageShell crumbs={[{ label: t.crumb }]} closing={false}>
      <div className="wrap hero3">
        <h1 className="h1">{t.hero.h1}</h1>
      </div>

      <div className="wrap sec3 about3">
        <div className="split3">
          <div className="prose3">
            <h2>{t.story.vision.h}</h2>
            <p>{t.story.vision.p}</p>
            <h2>{t.story.mission.h}</h2>
            <p>{t.story.mission.p}</p>
          </div>
          <div className="fig">
            <Image
              src="/img/about-helloverify.png"
              alt={t.story.imgAlt}
              width={1337}
              height={1122}
              sizes="(max-width: 1080px) 100vw, 520px"
            />
          </div>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="quote3">
          <div>
            <div className="k">{t.belief.h}</div>
            <p className="q">{t.belief.q}</p>
          </div>
          <div className="inv3">
            <h2>{t.investor.h}</h2>
            <span className="yc" role="img" aria-label="Y Combinator">
              <YCBadge width={164} height={32} />
            </span>
            <p>{t.investor.sub}</p>
          </div>
        </div>
      </div>

      <div className="wrap sec3 about3">
        <div className="sec-head">
          <h2 className="h2">{t.numbers.h}</h2>
        </div>
        <div className="body3">
          <ul className="logos3">
            {PARTNERS.map((l) => (
              <li key={l.alt}>
                <Image src={l.src} alt={l.alt} width={l.w} height={l.h} sizes="130px" />
              </li>
            ))}
          </ul>
          <div className="strip3">
            {Object.entries(t.numbers.stats).map(([key, s]) => (
              <span key={key} className="it">
                <b>{s.v}</b> {s.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{t.values.h}</h2>
        </div>
        <div className="body3 vals3">
          {Object.entries(t.values.items).map(([key, v]) => (
            <div key={key} className="v">
              <h3>{v.t}</h3>
              <p>{v.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{t.clients.h}</h2>
        </div>
        <div className="body3 tst3">
          {(Object.keys(CLIENT_LOGOS) as (keyof typeof CLIENT_LOGOS)[]).map((key) => {
            const c = t.clients.items[key];
            const logo = CLIENT_LOGOS[key];
            return (
              <figure key={key} className="c" style={{ margin: 0 }}>
                <Image className="lg" src={logo.src} alt={logo.alt} width={logo.w} height={logo.h} sizes="130px" />
                <figcaption className="by">
                  <b>{c.role}</b>
                  <span>{c.company}</span>
                </figcaption>
                <blockquote>{c.quote}</blockquote>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{t.certs.h}</h2>
          <p className="lede" style={{ marginBottom: 8 }}>{t.certs.lede}</p>
        </div>
        <CertLogos alts={t.certs.logos} />
      </div>
    </PageShell>
  );
}

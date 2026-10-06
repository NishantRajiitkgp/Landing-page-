/** Business & Trade Authorities — the old `businessTradeAuthorities.base.json`
 *  on the new design, in its order: the hero, then three audience rows with
 *  the image alternating sides. */
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
const PATH = "/solutions/trade-authorities";

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
  name: "Verification for trade and business authorities",
  description: copyFor(PATH).description,
  serviceType: "Business registry verification",
};

const SALES = "/contact?tab=enquiry&role=business&contact=business-support";

const IMAGES = {
  government: { src: "/img/trade-for-government.png", w: 1536, h: 1024 },
  companies: { src: "/img/trade-for-companies.png", w: 1536, h: 1024 },
  agents: { src: "/img/trade-for-agent.png", w: 1408, h: 768 },
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
  const d = (await copy(GOVERNMENTS)).trade;

  return (
    <PageShell crumbs={[{ label: d.crumb }]} closing={false}>
      <JsonLd data={serviceNode(locale, SERVICE)} />
      <div className="wrap hero3">
        <h1 className="h1">{d.h1}</h1>
        <p className="sub">{d.sub}</p>
        <div className="hrow">
          <AppLink href={SALES} className="btn btn-ink">{d.cta}</AppLink>
        </div>
      </div>

      {(Object.keys(IMAGES) as (keyof typeof IMAGES)[]).map((id, i) => {
        const row = d.rows[id];
        const img = IMAGES[id];
        return (
          <div key={id} className="wrap sec3">
            <div className={i % 2 ? "aud3 flip" : "aud3"}>
              <div>
                <h2 className="h2">{row.h}</h2>
                <ul className="pts3">
                  {Object.entries(row.points).map(([key, p]) => (
                    <li key={key}>
                      <h3>{p.t}</h3>
                      <p>{p.p}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="fig">
                <Image
                  src={img.src}
                  alt={row.imgAlt}
                  width={img.w}
                  height={img.h}
                  sizes="(max-width: 1080px) 100vw, 560px"
                />
              </div>
            </div>
          </div>
        );
      })}
    </PageShell>
  );
}

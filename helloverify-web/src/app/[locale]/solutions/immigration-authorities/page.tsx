/** Immigration Authorities — the old `immigrationMigrationService.base.json`
 *  authorities tab on the new design, in its order: overview, why we stand
 *  out, our partners, the HelloVerify advantage, and the AI-powered
 *  verification solution. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ImmigrationTabs } from "@/components/immigration/ImmigrationTabs";
import { ImmigrationPartners } from "@/components/immigration/ImmigrationPartners";
import { GOVERNMENTS } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/solutions/immigration-authorities";

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
  name: "Verification for immigration authorities",
  description: copyFor(PATH).description,
  serviceType: "Document verification",
};

const PARTNER_HREF = "/contact?tab=enquiry&role=authority";

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
  const d = (await copy(GOVERNMENTS)).immigration;

  return (
    <PageShell crumbs={[{ label: d.crumb }]} closing={false}>
      <JsonLd data={serviceNode(locale, SERVICE)} />
      <div className="wrap hero3">
        <h1 className="h1">{d.h1}</h1>
        <p className="sub">{d.sub}</p>
        <ImmigrationTabs selected="authorities" />
      </div>

      <div className="wrap sec3">
        <div className="aud3">
          <div>
            <h2 className="h2">{d.overview.h}</h2>
            <ul className="pts3 plain">
              {d.overview.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="fig">
            <Image
              src="/img/immigration/authority-overview.png"
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
          <h2 className="h2">{d.standOut.h}</h2>
          <p className="lede">{d.standOut.sub}</p>
        </div>
        <div className="body3 vals3">
          {Object.entries(d.standOut.cards).map(([k, c]) => (
            <div key={k} className="v">
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>

      <ImmigrationPartners h={d.partners.h} logos={d.partners.logos} cta={d.partners.cta} href={PARTNER_HREF} />

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.advantage.h}</h2>
        </div>
        <div className="body3 vals3">
          {Object.entries(d.advantage.cards).map(([k, c]) => (
            <div key={k} className="v">
              <h3>{c.t}</h3>
              <div className="tag">{c.tag}</div>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.ai.h}</h2>
          <p className="lede">{d.ai.sub}</p>
        </div>
        <div className="body3 vals3 aicol3">
          {Object.entries(d.ai.cols).map(([k, c], i) => (
            <div key={k} className="v">
              <div className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
              <h3>{c.t}</h3>
              <ul>
                {c.items.map((it) => (
                  <li key={it.t}>
                    <b>{it.t}</b>
                    <span>{it.p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

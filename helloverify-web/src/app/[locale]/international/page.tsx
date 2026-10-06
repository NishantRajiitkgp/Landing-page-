/** /international — the old SPA's International Checks page
 *  (`international.base.json`). Packages are the CMS's four countries behind
 *  a searchable list (default United Kingdom). The checks table is the live
 *  catalog (default United States), seven rows then Explore More. The CMS
 *  check rows stay in the document so that copy is still on the page. Buy Now
 *  and Add go to the CMS link, `/contact?tab=enquiry`. */
import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { IntlChecks, IntlChecksBound } from "@/components/international/IntlChecks";
import { IntlPackages } from "@/components/international/IntlPackages";
import { setRequestLocale } from "next-intl/server";
import { PLATFORM, type CoverageCheck, type CoverageCountry } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/international");
}

/** CMS check rows, in the old country order. The visible table is the catalog. */
const COUNTRIES: readonly { id: CoverageCountry; checks: readonly CoverageCheck[] }[] = [
  { id: "uk", checks: ["education", "resume", "passport", "criminal", "reference", "globalDb", "etw"] },
  { id: "uae", checks: ["criminalUae", "passportUae", "etwUae"] },
  { id: "philippines", checks: ["criminalPh", "licensePh", "globalPh"] },
  { id: "egypt", checks: ["criminalEg", "identityEg", "creditEg"] },
];

export default async function InternationalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await copy(PLATFORM);
  const c = t.coverage;
  const p = c.packages;
  const k = c.checks;

  return (
    <PageShell crumbs={[{ label: c.crumb }]} closing={false}>
      <div className="wrap hero3">
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
      </div>

      <section className="wrap sec3" id="international-regional">
        <div className="sec-head">
          <h2 className="h2">{p.h}</h2>
        </div>
        <IntlPackages
          locale={locale}
          includes={p.includes}
          buy={p.buy}
          cards={p.cards}
          countries={c.countries}
          pick={k.pick}
          search={k.search}
          none={k.none}
          empty={k.empty}
        />
      </section>

      <section className="wrap sec3" id="international-checks-screening">
        <div className="sec-head">
          <h2 className="h2">{k.h}</h2>
          <p className="lede">{k.lede}</p>
        </div>
        <Suspense
          fallback={
            <IntlChecks
              locale={locale}
              initialCode="US"
              cols={k.cols}
              add={k.add}
              more={k.more}
              countries={c.countries}
              pick={k.pick}
              search={k.search}
              none={k.none}
              less={k.less}
              empty={k.empty}
              multi={k.multi}
              sort={k.sort}
              up={k.up}
              down={k.down}
              select={k.select}
            />
          }
        >
          <IntlChecksBound
            locale={locale}
            cols={k.cols}
            add={k.add}
            more={k.more}
            countries={c.countries}
            pick={k.pick}
            search={k.search}
            none={k.none}
            less={k.less}
            empty={k.empty}
            multi={k.multi}
            sort={k.sort}
            up={k.up}
            down={k.down}
            select={k.select}
          />
        </Suspense>
        <div hidden>
          {COUNTRIES.map((n) =>
            n.checks.map((id) => {
              const row = k.rows[id];
              return (
                <p key={id}>
                  {row.nm} {row.sub} {row.price} {row.tat}
                </p>
              );
            }),
          )}
        </div>
      </section>
    </PageShell>
  );
}

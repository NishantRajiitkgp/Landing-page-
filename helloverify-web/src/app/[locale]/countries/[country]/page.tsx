/** /countries/[country] — programmatic country guide (Template 5, IA §7). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { COUNTRIES, getCountry } from "@/lib/content/countries";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";
/** `COUNTRIES_COPY`, not `COUNTRIES`: the catalogue above already owns that
 *  name in this file, and the two are deliberately different things — see the
 *  boundary note in `lib/copy/countries.en.tsx`. */
import { COUNTRIES_COPY } from "@/lib/copy/countries";
import { copy } from "@/lib/copy/request";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  const { locale, country } = await params;
  const c = getCountry(country);
  if (!c) return {};
  return pageMetadata(locale, `/countries/${c.slug}`);
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) notFound();

  const siblings = COUNTRIES.filter((x) => x.region === c.region && x.slug !== c.slug);
  const t = await copy(COUNTRIES_COPY);

  return (
    <PageShell
      crumbs={[
        { label: t.crumbs.resources, href: "/resources" },
        { label: t.crumbs.countries, href: "/resources/countries" },
        { label: c.name },
      ]}
      closing={{
        heading: t.closing.heading(c.name),
        sub: t.closing.sub,
        img: c.img,
      }}
    >
      <div className="wrap hero3">
        <div className="k">{t.hero.kicker(c.region)}</div>
        <h1 className="h1">{t.hero.h1(c.name)}</h1>
        <p className="sub">{c.summary}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{t.hero.ask(c.name)}</AppLink>
          <AppLink href="/platform/coverage" className="btn btn-ghost">
            <span>{t.hero.allCountries}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{t.strip.sourceConfirmed(c.turnaround)}</span>
          <span className="it">{c.office ? t.strip.localOffice(c.office) : t.strip.partnerNetwork}</span>
          <span className="it">{t.strip.checkTypes(c.notes.length)}</span>
          <span className="it">{t.strip.inCountry}</span>
        </div>
      </div>

      {/* per-check table */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{t.table.kicker}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{t.table.heading}</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>{t.table.lede(c.name)}</p>
        </div>
        <div className="body3 tbl3">
          <div className="hd">
            <span>{t.table.cols.check}</span>
            <span>{t.table.cols.turnaround}</span>
            <span>{t.table.cols.note}</span>
          </div>
          {c.notes.map((n) => (
            <div className="r" key={n.check}>
              <span className="nm">{n.check}</span>
              <span className="tm">{n.time}</span>
              <span className="src">{n.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* the local trap */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{t.trap.kicker}</div>
            <h2 className="h2" style={{ marginTop: 12 }}>{t.trap.heading}</h2>
          </div>
        </div>
        <div className="body3 prose3">
          <p>{c.watchOut}</p>
        </div>
      </div>

      {/* siblings */}
      {siblings.length > 0 && (
        <div className="wrap sec3" style={{ paddingBottom: 20 }}>
          <div className="sec-head">
            <div>
              <div className="k">{t.nearby.kicker}</div>
              <h2 className="h2" style={{ marginTop: 12 }}>{c.region}.</h2>
            </div>
          </div>
          <div className="body3 idx3">
            {siblings.map((s) => (
              <AppLink className="x3" href={`/countries/${s.slug}`} key={s.slug}>
                <span className="xn">
                  {s.name}
                  <small>{s.summary.split(".")[0]}.</small>
                </span>
                <span className="xt">{s.turnaround}</span>
                <span className="xs">{s.office ? t.nearby.officeIn(s.office) : t.nearby.partnerNetwork}</span>
                <span className="xa">→</span>
              </AppLink>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <AppLink href="/resources/countries" className="btn btn-line btn-sm">{t.nearby.all}</AppLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}

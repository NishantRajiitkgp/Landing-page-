/** /resources/countries — country guide index. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { COUNTRIES, REGIONS } from "@/lib/content/countries";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { RESOURCES } from "@/lib/copy/resources";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/resources/countries");
}

export default async function CountriesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  /** Only the shell. The region headings and every row — name, summary,
   *  turnaround, office — are `lib/content/countries.ts`, which is a
   *  catalogue and not copy; see `lib/copy/resources.en.tsx`. `d`, not `c`:
   *  the two `.map()`s below already bind `c` to a country record. */
  const t = await copy(RESOURCES);
  const d = t.countries;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/resources" }, { label: d.crumb }]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
      }}
    >
      <div className="wrap hero3">
        <div className="k">{d.hero.k}</div>
        <h1 className="h1">{d.hero.h1}</h1>
        <p className="sub">{d.hero.sub}</p>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{d.strip.reachable}</span>
          <span className="it">{d.strip.written(COUNTRIES.length)}</span>
          <span className="it">{d.strip.offices}</span>
          <span className="it">{d.strip.inCountry}</span>
        </div>
      </div>

      {REGIONS.map((r) => {
        const list = COUNTRIES.filter((c) => c.region === r);
        if (!list.length) return null;
        return (
          <div className="wrap sec3" key={r} style={{ paddingTop: 72 }}>
            <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {r}
              <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
            </div>
            <div className="idx3" style={{ marginTop: 18 }}>
              {list.map((c) => (
                <AppLink className="x3" href={`/countries/${c.slug}`} key={c.slug}>
                  <span className="xn">
                    {c.name}
                    {/* The catalogue value with its full stop re-attached, left
                        in the page for the reason `lib/copy/countries.en.tsx`
                        gives on the country page that does the same: a
                        terminal full stop on a value the dictionary does not
                        own is punctuation, and the alternative is a leaf whose
                        entire content is ".". */}
                    <small>{c.summary.split(".")[0]}.</small>
                  </span>
                  <span className="xt">{c.turnaround}</span>
                  <span className="xs">{c.office ? d.officeIn(c.office) : d.partnerNetwork}</span>
                  <span className="xa">→</span>
                </AppLink>
              ))}
            </div>
          </div>
        );
      })}

      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <div className="pricenote">
          {d.note}{" "}
          <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>{d.globalCoverage}</AppLink>
        </div>
      </div>
    </PageShell>
  );
}

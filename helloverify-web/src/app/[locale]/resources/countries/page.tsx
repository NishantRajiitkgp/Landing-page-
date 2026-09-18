/** /resources/countries — country guide index. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { COUNTRIES, REGIONS } from "@/lib/content/countries";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

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

  return (
    <PageShell
      crumbs={[{ label: "Resources", href: "/resources" }, { label: "Country guides" }]}
      closing={{
        heading: (
          <>
            Your country <em>not here yet?</em>
          </>
        ),
        sub: "We reach 120+. Ask about yours and we'll tell you what's genuinely possible.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Resources · Country guides</div>
        <h1 className="h1">
          Verification is <em>local.</em>
        </h1>
        <p className="sub">
          A document is only properly verified where it was issued — so the process, the timeline
          and the pitfalls change with the border. These are the countries we have written up so far.
        </p>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>120+</b> countries reachable</span>
          <span className="it"><b>{COUNTRIES.length}</b> guides written</span>
          <span className="it"><b>6</b> offices</span>
          <span className="it"><span className="dot" /> in-country, in language</span>
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
                    <small>{c.summary.split(".")[0]}.</small>
                  </span>
                  <span className="xt">{c.turnaround}</span>
                  <span className="xs">{c.office ? `office in ${c.office}` : "partner network"}</span>
                  <span className="xa">→</span>
                </AppLink>
              ))}
            </div>
          </div>
        );
      })}

      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <div className="pricenote">
          Guides are written where we have something specific to say · the remaining countries are
          listed with indicative times on{" "}
          <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>global coverage</AppLink>
        </div>
      </div>
    </PageShell>
  );
}

/** /countries/[country] — programmatic country guide (Template 5, IA §7). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { COUNTRIES, getCountry } from "@/lib/content/countries";
import { AppLink } from "@/components/chrome/AppLink";
import { Arrow } from "@/components/brand/Arrow";

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

  return (
    <PageShell
      crumbs={[
        { label: "Resources", href: "/resources" },
        { label: "Country guides", href: "/resources/countries" },
        { label: c.name },
      ]}
      closing={{
        heading: (
          <>
            Verifying in {c.name}? <em>Tell us what you need.</em>
          </>
        ),
        sub: "Including when the honest answer involves a caveat.",
        img: c.img,
      }}
    >
      <div className="wrap hero3">
        <div className="k">Country guide · {c.region}</div>
        <h1 className="h1">
          Verification in <em>{c.name}.</em>
        </h1>
        <p className="sub">{c.summary}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Ask about {c.name}</AppLink>
          <AppLink href="/platform/coverage" className="btn btn-ghost">
            <span>All 120+ countries</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>{c.turnaround}</b> source-confirmed</span>
          <span className="it">{c.office ? <>local office in <b>{c.office}</b></> : <>covered by <b>partner network</b></>}</span>
          <span className="it"><b>{c.notes.length}</b> check types documented</span>
          <span className="it"><span className="dot" /> checked in-country</span>
        </div>
      </div>

      {/* per-check table */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">What runs here</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Checks, times,<br />and the local reality.</h2>
          </div>
          <p className="lede" style={{ marginBottom: 8 }}>
            Indicative timings for checks confirmed at their source in {c.name}.
          </p>
        </div>
        <div className="body3 tbl3">
          <div className="hd">
            <span>Check</span>
            <span>Turnaround</span>
            <span>Local note</span>
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
            <div className="k">Watch out for</div>
            <h2 className="h2" style={{ marginTop: 12 }}>What trips<br />people up here.</h2>
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
              <div className="k">Nearby</div>
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
                <span className="xs">{s.office ? `office in ${s.office}` : "partner network"}</span>
                <span className="xa">→</span>
              </AppLink>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <AppLink href="/resources/countries" className="btn btn-line btn-sm">All country guides</AppLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}

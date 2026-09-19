/** /checks/[check] — programmatic check page (Template 5, IA §7).
 *  One route file, one page per catalogue entry, statically generated. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { CHECKS, getCheck } from "@/lib/content/checks";
import { AppLink } from "@/components/chrome/AppLink";
import { SecHead } from "@/components/chrome/SecHead";

export function generateStaticParams() {
  return CHECKS.map((c) => ({ check: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; check: string }>;
}): Promise<Metadata> {
  const { locale, check } = await params;
  const c = getCheck(check);
  // No canonical on a 404. An unknown slug renders notFound() below, and a
  // canonical tag on a 404 invites Google to index the error page.
  if (!c) return {};
  // `c.slug`, not the `check` param: the sitemap is built from the catalogue,
  // so taking the path from the same object is what makes the two byte-identical
  // even if the URL arrived percent-encoded or in a different case.
  return pageMetadata(locale, `/checks/${c.slug}`);
}

export default async function CheckPage({
  params,
}: {
  params: Promise<{ check: string }>;
}) {
  const { check } = await params;
  const c = getCheck(check);
  if (!c) notFound();

  const related = CHECKS.filter((x) => x.group === c.group && x.slug !== c.slug).slice(0, 4);

  return (
    <PageShell
      crumbs={[
        { label: "Resources", href: "/resources" },
        { label: "Check library", href: "/resources/checks" },
        { label: c.name },
      ]}
      closing={{
        heading: (
          <>
            Run a {c.name.toLowerCase()} check <em>this week.</em>
          </>
        ),
        sub: `Confirmed with ${c.source}, typically in ${c.time}.`,
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">Check · {c.group}</div>
        <h1 className="h1">{c.name} verification</h1>
        <p className="sub">{c.answers}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">Talk to sales</AppLink>
          <a href="https://app.helloverify.com" className="btn btn-line">Buy a single check</a>
        </div>
      </div>

      {/* verdict strip — the facts, up top */}
      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>{c.time}</b> typical turnaround</span>
          <span className="it">confirmed with <b>{c.source}</b></span>
          <span className="it"><b>{c.countries}</b></span>
          {c.fast && <span className="it"><span className="dot" /> usually within the hour</span>}
        </div>
      </div>

      {/* what you get */}
      <div className="wrap sec3">
        <SecHead k="What comes back" h="In the report.">
          Every field carries the source that confirmed it and the date it was confirmed.
        </SecHead>
        <div className="body3 cloud3">
          {c.fields.map((f) => (
            <span className={`pl3${c.fast ? " fast" : ""}`} key={f}>
              <span className="d" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* the honest part */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">What it can't tell you</div>
            <h2 className="h2" style={{ marginTop: 12 }}>The limit<br />of this check.</h2>
          </div>
        </div>
        <div className="body3 prose3">
          <p>{c.caveat}</p>
          <div className="aside">
            A result is one of three things, never a score: <em>verified</em> — the source confirmed
            it; <em>not verified</em> — the source has no such record; <em>unverifiable</em> — the
            source could not be reached, and the report names the route tried.
          </div>
        </div>
      </div>

      {/* who orders it */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">Who orders it</div>
            <h2 className="h2" style={{ marginTop: 12 }}>Usually for.</h2>
          </div>
        </div>
        <div className="body3 intg3">
          {c.usedBy.map((u) => (
            <span className="svc" key={u}>{u}</span>
          ))}
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="wrap sec3" style={{ paddingBottom: 20 }}>
          <div className="sec-head">
            <div>
              <div className="k">Related</div>
              <h2 className="h2" style={{ marginTop: 12 }}>Usually ordered<br />together.</h2>
            </div>
          </div>
          <div className="body3 idx3">
            {related.map((r) => (
              <AppLink className="x3" href={`/checks/${r.slug}`} key={r.slug}>
                <span className="xn">
                  {r.name}
                  <small>{r.answers}</small>
                </span>
                <span className={`xt${r.fast ? " fast" : ""}`}>{r.time}</span>
                <span className="xs">{r.source}</span>
                <span className="xa">→</span>
              </AppLink>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <AppLink href="/resources/checks" className="btn btn-line btn-sm">The whole check library</AppLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}

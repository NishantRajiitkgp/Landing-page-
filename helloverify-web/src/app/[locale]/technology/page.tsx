/** /technology — the old SPA's Technology page (`technology.base.json`) on the
 *  new design, in the CMS order: the three AI pillars, the compounding
 *  platform and its Trust orbit, the trust-platform areas, the future of
 *  digital trust and the shared certifications block. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { AppLink } from "@/components/chrome/AppLink";
import { CertLogos } from "@/components/chrome/CertLogos";
import { setRequestLocale } from "next-intl/server";
import { PLATFORM } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";

const ENQUIRY = "/contact?tab=enquiry";

/** Pill positions inside the orbit, as percentages of the diagram box. */
const ORBIT = [
  { key: "verifications", left: "44.17%", top: "4.55%", width: "19.13%" },
  { key: "intelligence", left: "78.61%", top: "30.95%", width: "21.39%" },
  { key: "institutions", left: "70.43%", top: "78.42%", width: "21.39%" },
  { key: "customers", left: "9.04%", top: "75.25%", width: "21.39%" },
  { key: "ecosystem", left: "0%", top: "30.1%", width: "21.39%" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/technology");
}

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(PLATFORM);
  const d = t.technology;

  return (
    <PageShell
      crumbs={[{ label: d.crumb }]}
      closing={false}
    >
      <div className="wrap hero3">
        <h1 className="h1">{d.hero.h1}</h1>
        <p className="sub">{d.hero.sub}</p>
        <div className="hrow">
          <AppLink href={ENQUIRY} className="btn btn-ink">{d.hero.cta}</AppLink>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.pillars.h}</h2>
          <p className="lede" style={{ marginBottom: 8 }}>{d.pillars.sub}</p>
        </div>
        <div className="body3 vals3">
          {Object.entries(d.pillars.cards).map(([key, c], i) => (
            <div key={key} className="v">
              <div className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="split3 cmp3">
          <div>
            <h2 className="h2">{d.compound.h}</h2>
            <p className="lede">{d.compound.sub}</p>
            <ul className="cl">
              {Object.entries(d.compound.cards).map(([key, c]) => (
                <li key={key}>
                  <h3>{c.t}</h3>
                  <p>{c.p}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="fig">
            <div className="orb3" aria-hidden="true">
              <span className="ring r1" />
              <span className="ring r2" />
              <span className="ring r3" />
              <span className="hub">{d.compound.trust}</span>
              {ORBIT.map((o) => (
                <span key={o.key} className="pill" style={{ insetInlineStart: o.left, top: o.top, width: o.width }}>
                  {d.compound.orbit[o.key]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.platform.h}</h2>
          <p className="lede" style={{ marginBottom: 8 }}>{d.platform.sub}</p>
        </div>
        <div className="body3 vals3 four">
          {Object.entries(d.platform.cards).map(([key, c]) => (
            <div key={key} className="v">
              <h3>{c.t}</h3>
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.future.h}</h2>
        </div>
        <div className="body3 art3 plain">
          {Object.entries(d.future.cards).map(([key, c]) => (
            <div key={key} className="a3">
              <div>
                <div className="t3">{c.t}</div>
                <p className="p3">{c.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec3">
        <div className="sec-head">
          <h2 className="h2">{d.certs.h}</h2>
          <p className="lede" style={{ marginBottom: 8 }}>{d.certs.lede}</p>
        </div>
        <CertLogos alts={d.certs.logos} />
      </div>
    </PageShell>
  );
}

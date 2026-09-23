/** /legal/[slug] — long-form legal document (Template 8). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { LEGAL, getLegal } from "@/lib/content/legal";
import { AppLink } from "@/components/chrome/AppLink";
/** `LEGAL_COPY`, not `LEGAL`: `lib/content/legal.ts` above owns that name and
 *  holds the ported policy text, which is not copy. See the boundary note in
 *  `lib/copy/legal.en.tsx`. */
import { LEGAL_COPY } from "@/lib/copy/legal";
import { copy } from "@/lib/copy/request";

export function generateStaticParams() {
  return LEGAL.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const d = getLegal(slug);
  if (!d) return {};
  return pageMetadata(locale, `/legal/${d.slug}`);
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getLegal(slug);
  if (!d) notFound();

  const drafted = d.sections.filter((x) => x.body).length;
  const t = await copy(LEGAL_COPY);

  return (
    <PageShell
      crumbs={[{ label: t.crumb }, { label: d.title }]}
      closing={{
        heading: t.closing.heading,
        sub: t.closing.sub,
      }}
    >
      <div className="wrap hero3" style={{ paddingBottom: 40 }}>
        <div className="k">{t.kicker}</div>
        <h1 className="h1" style={{ fontSize: 64 }}>{d.title}</h1>
        <p className="sub">{d.summary}</p>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="legal3">
          <nav className="lnav" aria-label={t.nav.label}>
            <div className="lk">{t.nav.heading}</div>
            <ol>
              {d.sections.map((x) => (
                <li key={x.id}>
                  <AppLink href={`#${x.id}`}>{x.h}</AppLink>
                </li>
              ))}
            </ol>
          </nav>

          <div className="doc">
            <div className="eff">{t.doc.effective(d.effective)}</div>

            {drafted < d.sections.length && (
              /** The count was already here; what changed is that the claim
               *  around it is now conditional ON it. This banner used to say
               *  flatly that "the operative text is not drafted here", which
               *  stopped being true when 49 of the 84 sections in
               *  `lib/content/legal.ts` were filled with the live site's text
               *  -- on `/legal/privacy-policy` that sentence would now be
               *  wrong about 12 of 14 sections, and wrong in the reassuring
               *  direction, which is the opposite of what a BUILD-SPEC §4
               *  disclosure is for. "Approved text" went too: a verbatim port
               *  is production text, and counsel has approved it for the old
               *  site, not this one. The rejected alternative was dropping the
               *  banner wherever any section was sourced, which would hide the
               *  35 sections that are still blank. */
              <p className="pending3">
                <b>{t.doc.pending.title}</b>{" "}
                {drafted > 0
                  ? t.doc.pending.counted(drafted, d.sections.length)
                  : t.doc.pending.blank}{" "}
                {t.doc.pending.note}
              </p>
            )}

            {d.sections.map((x) => (
              <section key={x.id} id={x.id}>
                <h2>{x.h}</h2>
                {x.body ? (
                  x.body.map((t, i) => <p key={i}>{t}</p>)
                ) : (
                  <p style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 12.5 }}>
                    {t.doc.sectionPending}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 40, paddingBottom: 20 }}>
        <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {t.other.heading}
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div className="idx3" style={{ marginTop: 18 }}>
          {LEGAL.filter((x) => x.slug !== d.slug).map((x) => (
            <AppLink className="x3" href={`/legal/${x.slug}`} key={x.slug}>
              <span className="xn">
                {x.title}
                <small>{x.summary}</small>
              </span>
              <span className="xt">{t.other.sections(x.sections.length)}</span>
              <span className="xs" />
              <span className="xa">→</span>
            </AppLink>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

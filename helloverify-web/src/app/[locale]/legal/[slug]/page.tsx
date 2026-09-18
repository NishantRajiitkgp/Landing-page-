/** /legal/[slug] — long-form legal document (Template 8). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { LEGAL, getLegal } from "@/lib/content/legal";
import { AppLink } from "@/components/chrome/AppLink";

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

  return (
    <PageShell
      crumbs={[{ label: "Legal" }, { label: d.title }]}
      closing={{
        heading: (
          <>
            Questions about this? <em>Ask a person.</em>
          </>
        ),
        sub: "Privacy, data protection and contract questions go to a named contact.",
      }}
    >
      <div className="wrap hero3" style={{ paddingBottom: 40 }}>
        <div className="k">Legal</div>
        <h1 className="h1" style={{ fontSize: 64 }}>{d.title}</h1>
        <p className="sub">{d.summary}</p>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div className="legal3">
          <nav className="lnav" aria-label="Sections">
            <div className="lk">Sections</div>
            <ol>
              {d.sections.map((x) => (
                <li key={x.id}>
                  <AppLink href={`#${x.id}`}>{x.h}</AppLink>
                </li>
              ))}
            </ol>
          </nav>

          <div className="doc">
            <div className="eff">Effective · {d.effective}</div>

            {drafted < d.sections.length && (
              <p className="pending3">
                <b>Awaiting legal copy.</b> The structure, navigation and typography of this document
                are final; the operative text is not drafted here. Per the build spec, legal copy
                ports verbatim from the existing site and is published only after review by counsel.
                {" "}
                {drafted > 0 && `${drafted} of ${d.sections.length} sections have approved text.`}
              </p>
            )}

            {d.sections.map((x) => (
              <section key={x.id} id={x.id}>
                <h2>{x.h}</h2>
                {x.body ? (
                  x.body.map((t, i) => <p key={i}>{t}</p>)
                ) : (
                  <p style={{ color: "var(--faint)", fontFamily: "var(--mono)", fontSize: 12.5 }}>
                    [ Section text pending legal review ]
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 40, paddingBottom: 20 }}>
        <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          Other legal documents
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div className="idx3" style={{ marginTop: 18 }}>
          {LEGAL.filter((x) => x.slug !== d.slug).map((x) => (
            <AppLink className="x3" href={`/legal/${x.slug}`} key={x.slug}>
              <span className="xn">
                {x.title}
                <small>{x.summary}</small>
              </span>
              <span className="xt">{x.sections.length} sections</span>
              <span className="xs" />
              <span className="xa">→</span>
            </AppLink>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

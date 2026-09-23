/** /resources/glossary — vocabulary the industry uses loosely, defined precisely. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { setRequestLocale } from "next-intl/server";
import { RESOURCES } from "@/lib/copy/resources";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/resources/glossary");
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(RESOURCES);
  const c = t.glossary;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/resources" }, { label: c.crumb }]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
      }}
    >
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
      </div>

      <div className="wrap sec3" style={{ paddingTop: 64, paddingBottom: 20 }}>
        <dl className="gl3">
          {/* `Object.values`, not a `TERMS` array and not an order tuple. The
              dictionary's key order IS the render order, so there is nothing
              here for a second locale to get out of step with, and a glossary
              whose alphabet sorts differently should be free to reorder its
              twelve entries — a different call from
              `business/enterprise`'s `FAQ_ORDER`, and `lib/copy/resources.ts`
              says why. The key is still `x.t`, the same string it was. */}
          {Object.values(c.terms).map((x) => (
            <div className="g3r" key={x.t}>
              <dt>{x.t}</dt>
              <dd>{x.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PageShell>
  );
}

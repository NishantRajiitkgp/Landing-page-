/** /resources — hub for the organic-growth surface (IA §7). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { CHECKS } from "@/lib/content/checks";
import { COUNTRIES } from "@/lib/content/countries";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { RESOURCES } from "@/lib/copy/resources";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/resources");
}

export default async function ResourcesHub({
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
  const c = t.hub;

  return (
    <PageShell
      crumbs={[{ label: t.crumb }]}
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

      <div className="wrap sec3" style={{ paddingTop: 60 }}>
        <div className="rcard3">
          <AppLink href="/resources/checks">
            <div className="rk">{c.cards.checks.k}</div>
            <div className="rt3">{c.cards.checks.t}</div>
            <p className="rp">{c.cards.checks.p}</p>
            {/* Two children, not one: the count and the words either side of
                the `<!-- -->` React writes between them. `m` is a function
                leaf returning a fragment for exactly that reason — see
                `lib/copy/resources.en.tsx`. */}
            <div className="rm">{c.cards.checks.m(CHECKS.length)}</div>
          </AppLink>
          <AppLink href="/resources/countries">
            <div className="rk">{c.cards.countries.k}</div>
            <div className="rt3">{c.cards.countries.t}</div>
            <p className="rp">{c.cards.countries.p}</p>
            <div className="rm">{c.cards.countries.m(COUNTRIES.length)}</div>
          </AppLink>
          <AppLink href="/resources/glossary">
            <div className="rk">{c.cards.glossary.k}</div>
            <div className="rt3">{c.cards.glossary.t}</div>
            <p className="rp">{c.cards.glossary.p}</p>
            <div className="rm">{c.cards.glossary.m}</div>
          </AppLink>
        </div>
      </div>

      <div className="wrap sec3">
        <SecHead k={c.blog.k} h={c.blog.h}>
          {c.blog.lede}
        </SecHead>
        <div className="body3 rcard3">
          <AppLink href="/resources/blog/primary-source-vs-database">
            <div className="rk">{c.blog.featured.k}</div>
            <div className="rt3">{c.blog.featured.t}</div>
            <p className="rp">{c.blog.featured.p}</p>
            <div className="rm">{c.blog.featured.m}</div>
          </AppLink>
          <AppLink href="/resources/blog">
            <div className="rk">{c.blog.all.k}</div>
            <div className="rt3">{c.blog.all.t}</div>
            <p className="rp">{c.blog.all.p}</p>
            <div className="rm">{c.blog.all.m}</div>
          </AppLink>
        </div>
      </div>
    </PageShell>
  );
}

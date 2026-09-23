/** /resources/blog — editorial index (legacy /blog redirects here per IA §9). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { POSTS, formatDate } from "@/lib/content/posts";
import Image from "next/image";
import { SIZES_FULL } from "@/lib/img";
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
  return pageMetadata(locale, "/resources/blog");
}

export default async function BlogIndex({
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
  const c = t.blog;

  const [lead, ...rest] = POSTS;
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

      {/* lead post — every word inside it is `lib/content/posts.ts`, which is a
          catalogue and not copy (see `lib/copy/resources.en.tsx`). The only
          leaf here is the connective " min read" beside `lead.readMins`. */}
      <div className="wrap sec3" style={{ paddingTop: 64 }}>
        <AppLink href={`/resources/blog/${lead.slug}`} className="cell ph" style={{ display: "block", minHeight: 380 }}>
          <Image className="pimg" src="/img/09-licensing-officer.jpg" alt="" fill sizes={SIZES_FULL} priority />
          <div className="scrim" />
          <span className="tag">{lead.category}</span>
          <span className="from">{c.readMins(lead.readMins)}</span>
          <div className="body">
            <div className="h">{lead.title}</div>
            <div className="p">{lead.standfirst}</div>
          </div>
        </AppLink>
      </div>

      {/* the rest */}
      <div className="wrap sec3" style={{ paddingTop: 72, paddingBottom: 20 }}>
        <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {c.more}
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div className="idx3" style={{ marginTop: 18 }}>
          {rest.map((p) => (
            <AppLink className="x3" href={`/resources/blog/${p.slug}`} key={p.slug}>
              <span className="xn">
                {p.title}
                <small>{p.standfirst}</small>
              </span>
              <span className="xt">{t.row.min(p.readMins)}</span>
              <span className="xs">{formatDate(p.date)}</span>
              <span className="xa">→</span>
            </AppLink>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

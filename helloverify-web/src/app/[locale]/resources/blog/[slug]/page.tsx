/** /resources/blog/[slug] — editorial post (Template 6). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { POSTS, getPost, formatDate } from "@/lib/content/posts";
import Image from "next/image";
import { AVATAR_BYLINE } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosting } from "@/lib/seo/schema/blog";
import { getLocale } from "next-intl/server";
import { RESOURCES } from "@/lib/copy/resources";
import { copy } from "@/lib/copy/request";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return pageMetadata(locale, `/resources/blog/${p.slug}`);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  /** Not from `params`: this component destructures only `slug`, and the
   *  locale is what `BlogPosting.mainEntityOfPage` has to be absolute in.
   *  Same server-side accessor `PageShell` uses two lines below. */
  const locale = await getLocale();

  /** The page SHELL's words. Everything the article itself says — title,
   *  standfirst, byline, section headings, paragraphs, quotes — is
   *  `lib/content/posts.ts`, which is a catalogue of four verbatim-ported
   *  articles and deliberately not copy. See `lib/copy/resources.en.tsx`. */
  const r = await copy(RESOURCES);
  const c = r.post;

  const more = POSTS.filter((x) => x.slug !== p.slug);

  return (
    <PageShell
      crumbs={[
        { label: r.crumb, href: "/resources" },
        { label: r.blog.crumb, href: "/resources/blog" },
        { label: p.category },
      ]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
      }}
    >
      <article className="wrap sec3" style={{ paddingTop: 44 }}>
        <div className="post3">
          {/* Six children — three catalogue values and three runs of the
              page's own connective text — so this is ONE fragment leaf rather
              than five, and the `<!-- -->`s React writes between them land
              where they did. */}
          <div className="meta">{c.meta(p.category, formatDate(p.date), p.readMins)}</div>
          <h1>{p.title}</h1>
          <p className="standfirst">{p.standfirst}</p>
          <div className="byline">
            <Image src={p.author.img} alt="" width={AVATAR_BYLINE} height={AVATAR_BYLINE} />
            <div>
              <b>{p.author.name}</b>
              <span>{p.author.role}</span>
            </div>
          </div>

          <nav className="toc" aria-label={c.onThisPage}>
            <div className="tk">{c.onThisPage}</div>
            <ol>
              {p.sections.map((s) => (
                <li key={s.id}>
                  <AppLink href={`#${s.id}`}>{s.h}</AppLink>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose3">
            {p.sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{s.h}</h2>
                {s.paras.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
                {s.quote && <blockquote>{s.quote}</blockquote>}
              </section>
            ))}
          </div>
        </div>
      </article>

      {/* BUILD-SPEC §8.2 (new — AUDIT.md:314 records that no blog route emitted
          article schema) and §11a.3 (Perplexity deprioritises undated content).
          Every field comes from the POSTS record this page already rendered. */}
      <JsonLd data={blogPosting(locale, p)} />

      {more.length > 0 && (
        <div className="wrap sec3" style={{ paddingBottom: 20 }}>
          <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {c.readNext}
            <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
          </div>
          <div className="idx3" style={{ marginTop: 18 }}>
            {more.map((x) => (
              <AppLink className="x3" href={`/resources/blog/${x.slug}`} key={x.slug}>
                <span className="xn">
                  {x.title}
                  <small>{x.standfirst}</small>
                </span>
                <span className="xt">{r.row.min(x.readMins)}</span>
                <span className="xs">{formatDate(x.date)}</span>
                <span className="xa">→</span>
              </AppLink>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

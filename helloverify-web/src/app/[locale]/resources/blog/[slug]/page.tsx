/** /resources/blog/[slug] — editorial post (Template 6). */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/chrome/PageShell";
import { POSTS, getPost, formatDate } from "@/lib/content/posts";
import Image from "next/image";
import { AVATAR_BYLINE } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: `${p.title} — HelloVerify`, description: p.standfirst };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const more = POSTS.filter((x) => x.slug !== p.slug);

  return (
    <PageShell
      crumbs={[
        { label: "Resources", href: "/resources" },
        { label: "Blog", href: "/resources/blog" },
        { label: p.category },
      ]}
      closing={{
        heading: (
          <>
            Questions this raises? <em>Ask them.</em>
          </>
        ),
        sub: "We would rather answer awkward questions than avoid them.",
      }}
    >
      <article className="wrap sec3" style={{ paddingTop: 44 }}>
        <div className="post3">
          <div className="meta">
            {p.category} · {formatDate(p.date)} · {p.readMins} min read
          </div>
          <h1>{p.title}</h1>
          <p className="standfirst">{p.standfirst}</p>
          <div className="byline">
            <Image src={p.author.img} alt="" width={AVATAR_BYLINE} height={AVATAR_BYLINE} />
            <div>
              <b>{p.author.name}</b>
              <span>{p.author.role}</span>
            </div>
          </div>

          <nav className="toc" aria-label="On this page">
            <div className="tk">On this page</div>
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
                <h3>{s.h}</h3>
                {s.paras.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
                {s.quote && <blockquote>{s.quote}</blockquote>}
              </section>
            ))}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <div className="wrap sec3" style={{ paddingBottom: 20 }}>
          <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            Read next
            <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
          </div>
          <div className="idx3" style={{ marginTop: 18 }}>
            {more.map((x) => (
              <AppLink className="x3" href={`/resources/blog/${x.slug}`} key={x.slug}>
                <span className="xn">
                  {x.title}
                  <small>{x.standfirst}</small>
                </span>
                <span className="xt">{x.readMins} min</span>
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

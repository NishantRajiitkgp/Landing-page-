/** /resources/blog — editorial index (legacy /blog redirects here per IA §9). */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import { POSTS, formatDate } from "@/lib/content/posts";
import Image from "next/image";
import { SIZES_FULL } from "@/lib/img";

export const metadata: Metadata = {
  title: "Blog — HelloVerify",
  description:
    "Writing about how verification actually works, by the people who run the checks.",
};

export default function BlogIndex() {
  const [lead, ...rest] = POSTS;
  return (
    <PageShell
      crumbs={[{ label: "Resources", href: "/resources" }, { label: "Blog" }]}
      closing={{
        heading: (
          <>
            Something you want <em>written about?</em>
          </>
        ),
        sub: "We write what people actually ask us in sales calls.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Resources · Blog</div>
        <h1 className="h1">
          Written by people who <em>run the checks.</em>
        </h1>
        <p className="sub">
          Occasional and specific. No thought leadership, no listicles about the future of hiring —
          just the things we end up explaining twice a week anyway.
        </p>
      </div>

      {/* lead post */}
      <div className="wrap sec3" style={{ paddingTop: 64 }}>
        <a href={`/resources/blog/${lead.slug}`} className="cell ph" style={{ display: "block", minHeight: 380 }}>
          <Image className="pimg" src="/img/09-licensing-officer.jpg" alt="" fill sizes={SIZES_FULL} priority />
          <div className="scrim" />
          <span className="tag">{lead.category}</span>
          <span className="from">{lead.readMins} min read</span>
          <div className="body">
            <div className="h">{lead.title}</div>
            <div className="p">{lead.standfirst}</div>
          </div>
        </a>
      </div>

      {/* the rest */}
      <div className="wrap sec3" style={{ paddingTop: 72, paddingBottom: 20 }}>
        <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          More writing
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div className="idx3" style={{ marginTop: 18 }}>
          {rest.map((p) => (
            <a className="x3" href={`/resources/blog/${p.slug}`} key={p.slug}>
              <span className="xn">
                {p.title}
                <small>{p.standfirst}</small>
              </span>
              <span className="xt">{p.readMins} min</span>
              <span className="xs">{formatDate(p.date)}</span>
              <span className="xa">→</span>
            </a>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

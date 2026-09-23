/** /resources/checks — the check library index. Replaces the old "All 33 checks" link target. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { CHECKS, CHECK_GROUPS } from "@/lib/content/checks";
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
  return pageMetadata(locale, "/resources/checks");
}

export default async function ChecksIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  /** Only the shell. The group headings and every row — name, `answers`,
   *  `time`, `source` — are `lib/content/checks.ts`, which is a catalogue and
   *  not copy; see `lib/copy/resources.en.tsx`. */
  const t = await copy(RESOURCES);
  const d = t.checks;

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/resources" }, { label: d.crumb }]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
      }}
    >
      <div className="wrap hero3">
        <div className="k">{d.hero.k}</div>
        <h1 className="h1">{d.hero.h1}</h1>
        <p className="sub">{d.hero.sub}</p>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{d.strip.offered}</span>
          <span className="it">{d.strip.documented(CHECKS.length)}</span>
          <span className="it">{d.strip.fastest}</span>
          <span className="it">{d.strip.green}</span>
        </div>
      </div>

      {CHECK_GROUPS.map((g) => {
        const list = CHECKS.filter((c) => c.group === g);
        if (!list.length) return null;
        return (
          <div className="wrap sec3" key={g} style={{ paddingTop: 72 }}>
            <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {g}
              <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
            </div>
            <div className="idx3" style={{ marginTop: 18 }}>
              {list.map((c) => (
                <AppLink className="x3" href={`/checks/${c.slug}`} key={c.slug}>
                  <span className="xn">
                    {c.name}
                    <small>{c.answers}</small>
                  </span>
                  <span className={`xt${c.fast ? " fast" : ""}`}>{c.time}</span>
                  <span className="xs">{c.source}</span>
                  <span className="xa">→</span>
                </AppLink>
              ))}
            </div>
          </div>
        );
      })}

      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <div className="pricenote">{d.note}</div>
      </div>
    </PageShell>
  );
}

/** /resources/checks — the check library index. Replaces the old "All 33 checks" link target. */
import type { Metadata } from "next";
import { PageShell } from "@/components/chrome/PageShell";
import { CHECKS, CHECK_GROUPS } from "@/lib/content/checks";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "The check library — HelloVerify",
  description:
    "Every verification check: what it answers, who confirms it, how long it takes, and what it cannot tell you.",
};

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

  return (
    <PageShell
      crumbs={[{ label: "Resources", href: "/resources" }, { label: "Check library" }]}
      closing={{
        heading: (
          <>
            Need a check <em>that isn't listed?</em>
          </>
        ),
        sub: "We run more than we've documented. Ask, and we'll tell you the real timeline.",
      }}
    >
      <div className="wrap hero3">
        <div className="k">Resources · Check library</div>
        <h1 className="h1">
          What each check <em>actually answers.</em>
        </h1>
        <p className="sub">
          Not a feature list. Each entry states the question the check answers, who confirms it,
          how long that takes, and — the part vendors skip — what it cannot tell you.
        </p>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it"><b>33</b> checks offered</span>
          <span className="it"><b>{CHECKS.length}</b> documented here</span>
          <span className="it"><b>15 min</b> fastest turnaround</span>
          <span className="it"><span className="dot" /> green = usually within the hour</span>
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
        <div className="pricenote">
          Times are measured from upload to report and assume the issuer responds normally · the
          remaining checks in the catalogue of 33 are documented as their pages are written, rather
          than published as templated stubs
        </div>
      </div>
    </PageShell>
  );
}

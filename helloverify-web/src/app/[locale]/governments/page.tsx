/** /governments — audience hub (Template 2). Evidence-first: this buyer converts on artefacts (IA §4.1). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { SIZES_PATH_SPAN3 } from "@/lib/img";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { GOVERNMENTS, type PathHref } from "@/lib/copy/governments";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/governments");
}

/** WHICH four destinations, in which order, with which image and grid span —
 *  routing and layout, and they stay. The four words per card are
 *  `lib/copy/governments`'s, keyed by href, which is also the rendered `key=`,
 *  so nothing in the flight payload moves. A destination added without a card
 *  is TS2322 on this array in every locale at once. */
const VERTICALS: readonly { href: PathHref; span: string; img: string }[] = [
  { href: "/governments/health", span: "span3", img: "/img/02-nurse-abudhabi.jpg" },
  { href: "/governments/immigration", span: "span3", img: "/img/14-visa-counter.jpg" },
  { href: "/governments/manpower-education", span: "span3", img: "/img/10-ministry-hall.jpg" },
  { href: "/governments/trade", span: "span3", img: "/img/06-supplier-cairo.jpg" },
];

export default async function GovernmentsHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(GOVERNMENTS);
  const d = t.hub;

  return (
    <PageShell
      crumbs={[{ label: t.crumb }]}
      closing={{
        heading: d.closing.heading,
        sub: d.closing.sub,
        img: "/img/10-ministry-hall.jpg",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{d.hero.k}</div>
        <h1 className="h1">{d.hero.h1}</h1>
        <p className="sub">{d.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{d.hero.cta}</AppLink>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost">
            <span>{d.hero.artefacts}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it">{d.strip.checks}</span>
          <span className="it">{d.strip.countries}</span>
          <span className="it">{d.strip.offices}</span>
          <span className="it">{d.strip.certs}</span>
        </div>
      </div>

      {/* named authorities */}
      <div className="wrap sec3">
        <div className="k" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {d.authorities.k}
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div className="gvt3" style={{ marginTop: 20 }}>
          <div className="g3"><span className="d3" /><span><b>{d.authorities.mom.n}</b><span>{d.authorities.mom.s}</span></span></div>
          <div className="g3"><span className="d3" /><span><b>{d.authorities.india.n}</b><span>{d.authorities.india.s}</span></span></div>
          <div className="g3"><span className="d3" /><span><b>{d.authorities.saudi.n}</b><span>{d.authorities.saudi.s}</span></span></div>
          <div className="g3"><span className="d3" /><span><b>{d.authorities.uae.n}</b><span>{d.authorities.uae.s}</span></span></div>
          <div className="g3"><span className="d3" /><span><b>{d.authorities.europe.n}</b><span>{d.authorities.europe.s}</span></span></div>
        </div>
      </div>

      {/* the four verticals */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). The heading is the question an
            official types; the lede is the whole answer in 39 words, and it
            names HelloVerify and the four mandates rather than opening on "the
            same primary-source pipeline" — a lede whose subject is "the same"
            is unciteable the moment an engine lifts it off the page (§11a.2
            rule 3).

            Every fact is already on this page: the four kinds of authority are
            the cards immediately below, and 120+ countries is the trust strip
            above. `k` is left as the eyebrow it was. */}
        <SecHead k={d.mandates.k} h={d.mandates.h}>
          {d.mandates.lede}
        </SecHead>
        <div className="body3 paths3">
          {VERTICALS.map((c) => (
            <AppLink key={c.href} href={c.href} className={`cell ph ${c.span}`}>
              <Image className="pimg" src={c.img} alt="" fill sizes={SIZES_PATH_SPAN3} />
              <div className="scrim" />
              <span className="tag">{d.paths[c.href].tag}</span>
              <span className="from">{d.paths[c.href].from}</span>
              <div className="body">
                <div className="h">{d.paths[c.href].h}</div>
                <div className="p">{d.paths[c.href].p}</div>
              </div>
              <span className="go" aria-hidden="true">
                <Arrow />
              </span>
            </AppLink>
          ))}
        </div>
      </div>

      {/* why governments — the five reasons from the homepage canvas */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2), 43 words. The five countries are the
            "Governments we work with" block above — Singapore's Ministry of
            Manpower, India, Saudi Arabia, the UAE and European authorities —
            restated rather than invented, because this is a claim about real
            government clients and a wrong one is worse than a bland heading. */}
        <SecHead k={d.why.k} h={d.why.h}>
          {d.why.lede}
        </SecHead>
        {/* Still written out longhand, five times: the five blocks are one
            shape, but turning them into a `.map()` would put a React `key` on
            each where a hand-written sibling has none, which moves the flight
            payload for a refactor this change is not. Only the fifteen strings
            moved. */}
        <div className="body3" style={{ maxWidth: 760 }}>
          <div className="rz">
            <div className="n">{d.why.rows.primarySource.n}</div>
            <div>
              <div className="t">{d.why.rows.primarySource.t}</div>
              <p className="p">{d.why.rows.primarySource.p}</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">{d.why.rows.onePlatform.n}</div>
            <div>
              <div className="t">{d.why.rows.onePlatform.t}</div>
              <p className="p">{d.why.rows.onePlatform.p}</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">{d.why.rows.proven.n}</div>
            <div>
              <div className="t">{d.why.rows.proven.t}</div>
              <p className="p">{d.why.rows.proven.p}</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">{d.why.rows.builtToLast.n}</div>
            <div>
              <div className="t">{d.why.rows.builtToLast.t}</div>
              <p className="p">{d.why.rows.builtToLast.p}</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">{d.why.rows.evidence.n}</div>
            <div>
              <div className="t">{d.why.rows.evidence.t}</div>
              <p className="p">{d.why.rows.evidence.p}</p>
            </div>
          </div>
        </div>
      </div>

      {/* procurement readiness */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        {/* ANSWER BLOCK (§11a.2), 38 words. "What artefacts do you have" is
            the procurement-shaped query, so the answer lists them by name —
            the four cert cards below plus the three artefacts the old lede
            already named. The Ministry of Manpower reference is the mom.jpg
            card below, not a new claim. */}
        <SecHead k={d.procurement.k} h={d.procurement.h}>
          {d.procurement.lede}
        </SecHead>
        <div className="body3 certs3">
          {/* FOUR OF THE EIGHT MARKS, and the SUBSET is the editorial point
              of this page rather than an oversight: a ministry asks for the
              security certification, the data-protection stance, the industry
              membership and a reference that another ministry is already
              live. India's National Skills Registry is on the homepage and on
              every vertical page and is deliberately not here — it answers a
              question an Indian employer asks, not one a licensing authority
              does. Naming the ids is what makes that a choice a reader can
              see; four copies of markup did not.

              Headings and status words come from `CREDENTIAL_MARKS` in
              `lib/content/company.ts` (BUILD-SPEC §11a.3). This page was
              already right on the one that mattered — "GDPR-aligned data
              handling", against the homepage's "GDPR compliant" — which is
              why that is the wording the table carries. */}
          <CertCards
            ids={["iso27001", "gdpr", "pbsa", "mom"]}
            glosses={{
              /* Per-page, because the link text differs from the same card on
                 `/about` ("the story →" there). Genuinely per-page copy, so
                 it is not folded — the PeopleStrip judgement from Part 5.

                 THREE CHILDREN, and the `{" "}` between the sentence and the
                 link is the middle one. It is CONTENT (`lib/copy/index.ts`,
                 first corollary) and stays exactly where it was; the leaf
                 could not carry it either, since an edge-whitespace leaf is
                 what `tools/test/copy.test.ts` §3 rejects. */
              mom: (
                <>
                  {d.procurement.momGloss}{" "}
                  <AppLink href="/governments/manpower-education/ministry-of-manpower" style={{ fontWeight: 500 }}>{d.procurement.momLink}</AppLink>
                </>
              ),
            }}
          />
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-line btn-sm">{d.procurement.securityInFull}</AppLink>
        </div>
      </div>
    </PageShell>
  );
}

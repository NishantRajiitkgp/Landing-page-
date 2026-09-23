/** /about — the company page. Facts only: everything here traces to the canvas
 *  annotation's "REAL" list (YC, 20M+, 2,000+, 120+, 33+, 6 offices, MOM, certs). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import { YCBadge } from "@/components/brand/YCBadge";
import Image from "next/image";
import { SIZES_PATH_SPAN2 } from "@/lib/img";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { ABOUT } from "@/lib/copy/about";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(ABOUT);

  return (
    <PageShell
      crumbs={[{ label: t.crumb }]}
      closing={{
        heading: t.closing.heading,
        sub: t.closing.sub,
      }}
    >
      <div className="wrap hero3">
        <div className="k">{t.hero.kicker}</div>
        <h1 className="h1">{t.hero.h1}</h1>
        <p className="sub">{t.hero.sub}</p>
        <div className="hrow">
          <span
            className="rise"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, height: 38,
              padding: "0 16px 0 14px", borderRadius: 999, background: "var(--white)",
              border: "1px solid var(--hair)", fontSize: 13, fontWeight: 500, color: "var(--ink-soft)",
            }}
          >
            <span>{t.hero.backedBy}</span>
            <YCBadge width={103} height={20} />
          </span>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{t.strip.founded}</span>
          <span className="it">{t.strip.checks}</span>
          <span className="it">{t.strip.clients}</span>
          <span className="it">{t.strip.countries}</span>
          <span className="it">{t.strip.offices}</span>
        </div>
      </div>

      {/* what we believe */}
      <div className="wrap sec3">
        <SecHead k={t.believe.kicker} h={t.believe.heading}>{t.believe.lede}</SecHead>
        <div className="body3" style={{ maxWidth: 760 }}>
          <div className="rz">
            <div className="n">{t.believe.items.one.n}</div>
            <div>
              <div className="t">{t.believe.items.one.t}</div>
              <p className="p">{t.believe.items.one.p}</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">{t.believe.items.two.n}</div>
            <div>
              <div className="t">{t.believe.items.two.t}</div>
              <p className="p">{t.believe.items.two.p}</p>
            </div>
          </div>
          <div className="rz">
            <div className="n">{t.believe.items.three.n}</div>
            <div>
              <div className="t">{t.believe.items.three.t}</div>
              <p className="p">{t.believe.items.three.p}</p>
            </div>
          </div>
        </div>
      </div>

      {/* who we serve */}
      <div className="wrap sec3">
        <SecHead k={t.serve.kicker} h={t.serve.heading}>{t.serve.lede}</SecHead>
        <div className="body3 paths3">
          <AppLink href="/governments" className="cell ph span2">
            <Image className="pimg" src="/img/10-ministry-hall.jpg" alt="" fill sizes={SIZES_PATH_SPAN2} />
            <div className="scrim" />
            <span className="tag">{t.serve.cards.governments.tag}</span>
            <div className="body">
              <div className="h">{t.serve.cards.governments.h}</div>
              <div className="p">{t.serve.cards.governments.p}</div>
            </div>
          </AppLink>
          <AppLink href="/business" className="cell ph span2">
            <Image className="pimg" src="/img/11-office-first-day.jpg" alt="" fill sizes={SIZES_PATH_SPAN2} />
            <div className="scrim" />
            <span className="tag">{t.serve.cards.business.tag}</span>
            <div className="body">
              <div className="h">{t.serve.cards.business.h}</div>
              <div className="p">{t.serve.cards.business.p}</div>
            </div>
          </AppLink>
          <AppLink href="/individuals" className="cell ph span2">
            <Image className="pimg" src="/img/15-home-doorway.jpg" alt="" fill sizes={SIZES_PATH_SPAN2} />
            <div className="scrim" />
            <span className="tag">{t.serve.cards.individuals.tag}</span>
            <div className="body">
              <div className="h">{t.serve.cards.individuals.h}</div>
              <div className="p">{t.serve.cards.individuals.p}</div>
            </div>
          </AppLink>
        </div>
      </div>

      {/* offices */}
      <div className="wrap sec3">
        <SecHead k={t.offices.kicker} h={t.offices.heading}>{t.offices.lede}</SecHead>
        <div className="body3 off3">
          <div className="o3"><b>{t.offices.list.noida.city}</b><span>{t.offices.list.noida.where}</span></div>
          <div className="o3"><b>{t.offices.list.manila.city}</b><span>{t.offices.list.manila.where}</span></div>
          <div className="o3"><b>{t.offices.list.singapore.city}</b><span>{t.offices.list.singapore.where}</span></div>
          <div className="o3"><b>{t.offices.list.dubai.city}</b><span>{t.offices.list.dubai.where}</span></div>
          <div className="o3"><b>{t.offices.list.cairo.city}</b><span>{t.offices.list.cairo.where}</span></div>
          <div className="o3"><b>{t.offices.list.newYork.city}</b><span>{t.offices.list.newYork.where}</span></div>
        </div>
      </div>

      {/* credentials */}
      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <SecHead k={t.credentials.kicker} h={t.credentials.heading}>{t.credentials.lede}</SecHead>
        <div className="body3 certs3">
          {/* SEVEN OF THE EIGHT MARKS. This is the credentials page, so it is
              the surface that shows the reviewed list in full (BUILD-SPEC
              §11a.3, TASKS 2b: a claim in the entity or in `llms.txt` that is
              not also on this page is a claim with no reviewed source).

              GDPR IS THE ONE MISSING, AND IT IS A REAL GAP rather than a
              subset decision. `CREDENTIALS` carries "GDPR-aligned data
              protection practices" and `/platform/security-compliance`
              renders the card; this page never had it. Found 22 Sep 2026
              while converting all nine `.cert` surfaces — the two
              seven-card pages turned out to be different sevens, this one
              short a GDPR card and that one short the Ministry of Manpower
              card. Adding it is a decision about what this page SHOWS, not a
              fix to what a card SAYS, which is what this change was scoped
              to; it is carried in TASKS instead of taken here.

              The ids are named rather than mapped from the table wholesale,
              so a credential added to `CREDENTIAL_MARKS` cannot appear on a
              page nobody re-read. That failure mode is not hypothetical in
              the other direction: the three lines added on 22 Sep reached
              this page and `/platform/security-compliance` and none of the
              other seven, which is the bug this conversion fixed.

              Evidence for ISO/IEC 27701, SOC 2 and ISO 9001 is weaker than
              for the cards around them, and the note that says so in full is
              on `CREDENTIALS` in `lib/content/company.ts`. It is deliberately
              NOT restated here: restating the credentials is what produced
              the four disagreeing surfaces in the first place, and the same
              applies to the reasoning behind them. Two consequences are
              properties of this markup and so stay with it — all three tiles
              are typographic plates rather than badges, because neither repo
              holds a certification mark for any of them, and none of the
              three is in `/platform/security-compliance`'s artefact table. */}
          <CertCards
            ids={["iso27001", "iso27701", "soc2", "iso9001", "pbsa", "nsr", "mom"]}
            glosses={{
              /* The only per-page gloss here: this card ends in a link into
                 the case study, and the link text differs from the same card
                 on `/governments` ("read the story →"). Genuinely per-page
                 copy, so it is not folded — the PeopleStrip judgement from
                 Part 5. Two leaves, not one function leaf taking the anchor:
                 see `lib/copy/about.en.tsx#credentials.momGloss`. */
              mom: (
                <>
                  {t.credentials.momGloss}{" "}
                  <AppLink href="/governments/manpower-education/ministry-of-manpower" style={{ fontWeight: 500 }}>{t.credentials.momStory}</AppLink>
                </>
              ),
            }}
          />
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-line btn-sm">{t.credentials.securityCta}</AppLink>
        </div>
      </div>
    </PageShell>
  );
}

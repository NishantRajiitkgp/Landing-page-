/** /platform — hub for the proof layer (Template 2, lighter). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { SIZES_PATH_SPAN3 } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { PLATFORM } from "@/lib/copy/platform";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/platform");
}

export default async function PlatformHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  // Words in `lib/copy/platform`, structure here. The page was already
  // `async` for `params`, so this adds no Server Component boundary and
  // cannot move a flight row — the hazard `lib/copy/index.ts`'s fourth
  // corollary describes.
  const t = await copy(PLATFORM);

  return (
    <PageShell
      crumbs={[{ label: t.crumb }]}
      closing={{
        heading: t.hub.closing.heading,
        sub: t.hub.closing.sub,
      }}
    >
      <div className="wrap hero3">
        <div className="k">{t.hub.hero.k}</div>
        <h1 className="h1">{t.hub.hero.h1}</h1>
        <p className="sub">{t.hub.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/platform/security-compliance" className="btn btn-ink">{t.hub.hero.cta}</AppLink>
          <AppLink href="/platform/technology" className="btn btn-ghost">
            <span>{t.hub.hero.seeTech}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        {/* Each item is `<b>figure</b> tail` — two children, so ONE rich-text
            leaf rather than two string leaves. `{t.a}{t.b}` would put two
            adjacent text children where one sits today and React's SSR writes
            `<!-- -->` between those (`lib/copy/index.ts`, byte identity). */}
        <div className="strip3">
          <span className="it">{t.hub.strip.read}</span>
          <span className="it">{t.hub.strip.countries}</span>
          <span className="it">{t.hub.strip.offices}</span>
          <span className="it">{t.hub.strip.certs}</span>
        </div>
      </div>

      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). The only H2 on this hub, so it
            carries the query a technical or procurement reader arrives with.
            The lede is the whole answer in 41 words and names the platform's
            three layers rather than "the interesting part" and "what happens
            after it", which pointed outside the block (§11a.2 rule 3).

            The three layers are the hero's own sentence and the three cards
            below; 1.2 s, 120+ countries and six offices are the strip above.
            Deliberately silent on the certifications the strip lists: that
            list is owned by `lib/content/company.ts` and
            `/platform/security-compliance`, and gated by `npm run check:llms`. */}
        <SecHead k={t.hub.layers.k} h={t.hub.layers.h}>
          {t.hub.layers.lede}
        </SecHead>
        {/* The three cards are written out LONGHAND, as they were: the hrefs,
            images and grid spans differ and none of them is copy, so there is
            no repeated unit to drive from a list and no `key=` to preserve.
            Only the four words per card moved, keyed by destination —
            `chrome.footer.links`' shape. */}
        <div className="body3 paths3">
          <AppLink href="/platform/technology" className="cell ph span3">
            <Image className="pimg" src="/img/03-engineer-manila.jpg" alt="" fill sizes={SIZES_PATH_SPAN3} />
            <div className="scrim" />
            <span className="tag">{t.hub.paths["/platform/technology"].tag}</span>
            <span className="from">{t.hub.paths["/platform/technology"].from}</span>
            <div className="body">
              <div className="h">{t.hub.paths["/platform/technology"].h}</div>
              <div className="p">{t.hub.paths["/platform/technology"].p}</div>
            </div>
            {/* All three `.go` arrows on this page were inline copies of
                `brand/Arrow.tsx` missing its `aria-hidden` — 3 of the 6 such
                copies TASKS Part 5 carried (§4 rule 2, §17 condition 22). They
                are shared rather than patched, so the attribute cannot go
                missing again. The defect was latent here and not audible: the
                `.go` span already carries `aria-hidden="true"`, which hides the
                whole subtree, so no screen reader announced these three. The
                other three, on `/business`, `/governments` and `/individuals`,
                sit in the same `.go` span and are `<Arrow />` now too. */}
            <span className="go" aria-hidden="true">
              <Arrow />
            </span>
          </AppLink>
          <AppLink href="/platform/security-compliance" className="cell ph span3">
            <Image className="pimg" src="/img/09-licensing-officer.jpg" alt="" fill sizes={SIZES_PATH_SPAN3} />
            <div className="scrim" />
            <span className="tag">{t.hub.paths["/platform/security-compliance"].tag}</span>
            <span className="from">{t.hub.paths["/platform/security-compliance"].from}</span>
            <div className="body">
              <div className="h">{t.hub.paths["/platform/security-compliance"].h}</div>
              <div className="p">{t.hub.paths["/platform/security-compliance"].p}</div>
            </div>
            <span className="go" aria-hidden="true">
              <Arrow />
            </span>
          </AppLink>
          <AppLink href="/platform/coverage" className="cell ph span3">
            <Image className="pimg" src="/img/19-singapore.jpg" alt="" fill sizes={SIZES_PATH_SPAN3} />
            <div className="scrim" />
            <span className="tag">{t.hub.paths["/platform/coverage"].tag}</span>
            <span className="from">{t.hub.paths["/platform/coverage"].from}</span>
            <div className="body">
              <div className="h">{t.hub.paths["/platform/coverage"].h}</div>
              <div className="p">{t.hub.paths["/platform/coverage"].p}</div>
            </div>
            <span className="go" aria-hidden="true">
              <Arrow />
            </span>
          </AppLink>
        </div>
      </div>
    </PageShell>
  );
}

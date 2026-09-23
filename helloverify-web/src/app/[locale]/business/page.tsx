/** /business — audience hub (Template 2). Real content, not a link farm (IA §10.1). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { SIZES_PATH_SPAN2, SIZES_PATH_SPAN3 } from "@/lib/img";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { BUSINESS, type PathHref } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/business");
}

/** The five cards' ORDER, hrefs, grid spans and images — routing and layout,
 *  which stay here. The four strings each card renders moved to
 *  `lib/copy/business`, keyed by the same href, which is the shape
 *  `chrome/SiteFooter.tsx` uses for its columns and the argument
 *  `lib/copy/index.ts` makes under "Where the keys come from". `PathHref`
 *  makes a sixth destination without copy a TS2322 on this array. */
const PATHS: readonly { href: PathHref; span: string; img: string }[] = [
  { href: "/business/enterprise", span: "span3", img: "/img/11-office-first-day.jpg" },
  { href: "/business/smb", span: "span3", img: "/img/13-factory-floor.jpg" },
  { href: "/business/employee-verification", span: "span2", img: "/img/05-warehouse-pune.jpg" },
  { href: "/business/customer-kyc", span: "span2", img: "/img/12-phone-signup.jpg" },
  { href: "/business/certifier", span: "span2", img: "/img/06-supplier-cairo.jpg" },
];

export default async function BusinessHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(BUSINESS);

  return (
    <PageShell crumbs={[{ label: t.crumb }]}>
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{t.hub.hero.k}</div>
        <h1 className="h1">{t.hub.hero.h1}</h1>
        <p className="sub">{t.hub.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{t.hub.hero.cta}</AppLink>
          <AppLink href="/business/smb" className="btn btn-ghost">
            <span>{t.hub.hero.plans}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* proof strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it">{t.hub.strip.checks}</span>
          <span className="it">{t.hub.strip.clients}</span>
          <span className="it">{t.hub.strip.package}</span>
          <span className="it">{t.hub.strip.countries}</span>
          <span className="it">{t.hub.strip.certs}</span>
        </div>
      </div>

      {/* the five paths */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). Question-shaped H2, and the lede
            is the whole answer in 43 words — it names HelloVerify and the five
            products rather than saying "each of these", so it still answers
            the question once an engine lifts it off the page (§11a.2 rule 3).

            Every fact is already in the PATHS list rendered directly below:
            the SLA, "from 30 min", "at signup" and Certifier's two days are
            that list's own `from` and `p` fields. The closing clause is the
            next section's lede verbatim ("what changes is only which checks
            run"), so the hub cannot drift from the pipeline it describes. */}
        <SecHead k={t.hub.fiveWays.k} h={t.hub.fiveWays.h}>
          {t.hub.fiveWays.lede}
        </SecHead>
        <div className="body3 paths3">
          {PATHS.map((c) => (
            <AppLink key={c.href} href={c.href} className={`cell ph ${c.span}`}>
              <Image className="pimg" src={c.img} alt="" fill sizes={c.span === "span2" ? SIZES_PATH_SPAN2 : SIZES_PATH_SPAN3} />
              <div className="scrim" />
              <span className="tag">{t.hub.paths[c.href].tag}</span>
              <span className="from">{t.hub.paths[c.href].from}</span>
              <div className="body">
                <div className="h">{t.hub.paths[c.href].h}</div>
                <div className="p">{t.hub.paths[c.href].p}</div>
              </div>
              <span className="go" aria-hidden="true">
                <Arrow />
              </span>
            </AppLink>
          ))}
        </div>
      </div>

      {/* how it runs + receipt proof */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 40 words, composed from the four `Steps`
            records below rather than paraphrased, so the citeable sentence and
            the rendered steps cannot disagree. §11a.3 rates "how does
            background verification work" a top query shape and this hub is
            the page that should answer it. */}
        <SecHead k={t.hub.pipeline.k} h={t.hub.pipeline.h}>
          {t.hub.pipeline.lede}
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`.
            §11a.3 rates this exact question a top query shape and this hub is
            the page that answers it, so it is the one HowTo on the site that
            was asked for by name. */}
        {/* ONE string, read twice. The `name` above was a second literal of the
            `SecHead` `h` eleven lines up, which is two chances for a
            translation to break the equality `check-schema.mjs` compares per
            page; now there is one leaf. The ORDER stays here — a sequence is
            structure, and an array leaf would let a locale ship three steps
            (`lib/copy/index.ts`, "almost no arrays"). */}
        <Steps
          name={t.hub.pipeline.h}
          items={[t.hub.steps.upload, t.hub.steps.read, t.hub.steps.confirm, t.hub.steps.report]}
        />
      </div>

      {/* integrations */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 39 words. The six integrations are named
            verbatim from the `.svc` chips below — "ATS integrations", not
            "ATS connectors" — because an answer block that renames what the
            page lists is two facts where there should be one. */}
        <SecHead k={t.hub.integrate.k} h={t.hub.integrate.h}>
          {t.hub.integrate.lede}
        </SecHead>
        <div className="body3 intg3">
          <span className="svc">{t.hub.services.api}</span>
          <span className="svc">{t.hub.services.webhooks}</span>
          <span className="svc">{t.hub.services.csv}</span>
          <span className="svc">{t.hub.services.ats}</span>
          <span className="svc">{t.hub.services.whatsapp}</span>
          <span className="svc">{t.hub.services.sso}</span>
          <AppLink href="/platform/technology" className="btn btn-ghost btn-sm">
            <span>{t.hub.explore}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* compliance hand-off */}
      <div className="wrap sec3" style={{ paddingBottom: 40 }}>
        {/* TWO OF THE EIGHT MARKS, and a subset is the right answer here: this
            is a hub page's compliance hand-off, two cards wide by design, and
            its job is to point at `/platform/security-compliance` rather than
            to restate the list. Both glosses are per-page and stay so — this
            buyer is the one who asks for reports under NDA, and the PBSA card
            ends in the link the whole band exists for. What is NOT per-page is
            the heading or the status word; those come from `CREDENTIAL_MARKS`
            in `lib/content/company.ts` now (BUILD-SPEC §11a.3). */}
        <div className="certs3 hair-top" style={{ marginTop: 0 }}>
          <CertCards
            ids={["iso27001", "pbsa"]}
            glosses={{
              iso27001: t.hub.certs.iso27001,
              /* The `{" "}` is CONTENT and stays exactly where it was: these
                 are three children, and React's SSR writes a `<!-- -->`
                 between the first two. Folding the sentence and the link into
                 one function leaf would collapse them to two and move a byte —
                 the same call, for the same reason, as `chrome.consent.body`. */
              pbsa: (
                <>
                  {t.hub.certs.pbsa}{" "}
                  <AppLink href="/platform/security-compliance" style={{ fontWeight: 500 }}>{t.hub.certs.pbsaLink}</AppLink>
                </>
              ),
            }}
          />
        </div>
      </div>
    </PageShell>
  );
}

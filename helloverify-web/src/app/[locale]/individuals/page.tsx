/** /individuals — audience hub (Template 2). Surfaces what the old site hid behind /#consumer-services. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/chrome/PageShell";
import Image from "next/image";
import { CERT_BOX, SIZES_PATH_SPAN3 } from "@/lib/img";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { INDIVIDUALS, type IndividualsPathKey } from "@/lib/copy/individuals";
import { copy } from "@/lib/copy/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/individuals");
}

/** The four path cards' STRUCTURE — where each goes, which image it carries,
 *  how wide it sits. The words are `individuals.hub.paths`, keyed by `k`, and
 *  `IndividualsPathKey` makes a fifth card added without a label TS2322 right
 *  here. `k` rather than the href because two of the four point at the same
 *  route, which is the note `lib/copy/individuals.en.tsx` records. */
const PATHS: readonly { k: IndividualsPathKey; href: string; span: string; img: string }[] = [
  { k: "hellov", href: "/individuals/hellov", span: "span3", img: "/img/12-phone-signup.jpg" },
  { k: "immigration", href: "/individuals/immigration", span: "span3", img: "/img/14-visa-counter.jpg" },
  { k: "homeFamily", href: "/individuals/home-family", span: "span3", img: "/img/15-home-doorway.jpg" },
  { k: "tenants", href: "/individuals/hellov", span: "span3", img: "/img/07-tenant-singapore.jpg" },
];

export default async function IndividualsHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enables static rendering: without it every next-intl call in this
  // subtree (AppLink resolves the locale) falls back to reading request
  // headers, which makes the route dynamic. BUILD-SPEC §5.
  setRequestLocale(locale);
  const t = await copy(INDIVIDUALS);
  const c = t.hub;

  return (
    <PageShell
      crumbs={[{ label: t.crumb }]}
      closing={{
        heading: c.closing.heading,
        sub: c.closing.sub,
        ctaLabel: c.closing.ctaLabel,
        ctaHref: "https://app.helloverify.com",
        img: "/img/15-home-doorway.jpg",
      }}
    >
      <div className="wrap hero3">
        <div className="k">{c.hero.k}</div>
        <h1 className="h1">{c.hero.h1}</h1>
        <p className="sub">{c.hero.sub}</p>
        <div className="hrow">
          <a href="https://app.helloverify.com" className="btn btn-ink">{c.hero.cta}</a>
          <AppLink href="/individuals/hellov" className="btn btn-ghost">
            <span>{c.hero.plans}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      <div className="wrap">
        <div className="strip3">
          <span className="it">{c.strip.thirtyMin}</span>
          <span className="it">{c.strip.noApp}</span>
          <span className="it">{c.strip.since2018}</span>
          <span className="it">{c.strip.consent}</span>
        </div>
      </div>

      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). The heading is now the question a
            family actually types, and the lede is the whole answer in 42 words
            — it names HelloVerify and the people being checked rather than
            saying "the same pipeline", which is unciteable once an engine lifts
            the block off the page (§11a.2 rule 3).

            Every noun here is already on this page: the four `PATHS` cards name
            the driver, the tenant, the buyer and the business partner, the
            nanny comes from the Home & family card, the visa interview from the
            old lede, and "30 min for most checks" from the strip above. The
            three blocks on this page measure 42, 42 and 36 words. */}
        <SecHead k={c.whatPeopleCheck.k} h={c.whatPeopleCheck.h}>
          {c.whatPeopleCheck.lede}
        </SecHead>
        <div className="body3 paths3">
          {PATHS.map((x) => {
            /** The card's words. `key={p.h}` is the same string it was before
                this page joined the copy layer — third corollary in
                `lib/copy/index.ts`, asserted in `copy.test.ts` §13. */
            const p = c.paths[x.k];
            return (
              <AppLink key={p.h} href={x.href} className={`cell ph ${x.span}`}>
                <Image className="pimg" src={x.img} alt="" fill sizes={SIZES_PATH_SPAN3} />
                <div className="scrim" />
                <span className="tag">{p.tag}</span>
                <span className="from">{p.from}</span>
                <div className="body">
                  <div className="h">{p.h}</div>
                  <div className="p">{p.p}</div>
                </div>
                <span className="go" aria-hidden="true">
                  <Arrow />
                </span>
              </AppLink>
            );
          })}
        </div>
      </div>

      <div className="wrap sec3">
        <SecHead k={c.howItWorks.k} h={c.howItWorks.h}>
          {c.howItWorks.lede}
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`,
            so the node and the heading are the same string — now ONE leaf read
            twice rather than two identical literals a translation could part. */}
        <Steps
          name={c.howItWorks.h}
          items={[c.steps.you, c.steps.us, c.steps.chat]}
        />
      </div>

      <div className="wrap sec3" style={{ paddingBottom: 20 }}>
        <SecHead k={c.consent.k} h={c.consent.h}>
          {c.consent.lede}
        </SecHead>
        <div className="body3 certs3">
          {/* NEITHER OF THESE IS A CREDENTIAL CARD, and both are deliberately
              left hand-written rather than driven from `CREDENTIAL_MARKS` in
              `lib/content/company.ts` (BUILD-SPEC §11a.3). They are `.cert`
              markup around a STANCE — "They consent, then we check",
              "Documents deleted on schedule" are promises to the person being
              checked, under a heading that asks "Can I check someone without
              telling them?" — and they borrow `gdpr.jpg` and `iso.jpg` as
              illustration. Neither names a credential in its heading and
              neither carries a status word, so there is nothing here for the
              table to own, and both would need the `heading` override
              `chrome/CertCard.tsx` refuses to have.

              Same judgement as `chrome/SecHead.tsx`, which shared 49 identical
              blocks and left 21 alone because they were not the same shape.
              Measured across the 40 cards the nine surfaces rendered on 22 Sep
              2026: 37 are credential cards and three are this shape — these two
              and the GDPR card on `/business/customer-kyc`.

              The second gloss DOES name a credential ("ISO 27001 certified
              storage"), and it is left as prose because it agrees with the
              reviewed list. It is worth knowing it is there: it is a status
              word this consumer page states in copy that no table governs, the
              same exposure as the answer blocks on `/business/enterprise` and
              `/governments`. */}
          <div className="cert">
            <Image src="/img/gdpr.jpg" alt={c.certs.consent.alt} width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">{c.certs.consent.h}</div>
              <p className="p">{c.certs.consent.p}</p>
            </div>
          </div>
          <div className="cert">
            <Image src="/img/iso.jpg" alt={c.certs.retention.alt} width={CERT_BOX} height={CERT_BOX} />
            <div>
              <div className="h">{c.certs.retention.h}</div>
              <p className="p">{c.certs.retention.p}</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

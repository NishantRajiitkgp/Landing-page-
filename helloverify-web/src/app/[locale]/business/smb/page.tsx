/** /business/smb — product page with PUBLIC pricing (Template 4, IA §4.3).
 *  Prices are placeholders pending commercial sign-off (IA §10.4) and say so on the page. */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { Tick } from "@/components/brand/Tick";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { BUSINESS, type SmbCheckKey, type SmbPackKey } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/business/smb";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}


/** WHICH CHECKS ARE IN EACH PACKAGE, in order. That is not copy: it is what
 *  the price was set for, and the card renders `{p.lines.length} checks` from
 *  it. The seven strings a card shows moved to `lib/copy/business` keyed by
 *  package, and the check NAMES to a table of their own — eight leaves for
 *  eleven rendered lines, because three checks appear in two packages. The
 *  split is `chrome/SiteFooter.tsx`'s `COLS`/`links`, and `SmbPackKey` /
 *  `SmbCheckKey` make a fourth package or a ninth check without copy a
 *  TS2322 here, in every locale at once. */
const PACKS: readonly { k: SmbPackKey; lines: readonly SmbCheckKey[] }[] = [
  { k: "blue", lines: ["pan", "registrationCertificate", "drivingLicence", "criminalRecord"] },
  { k: "white", lines: ["education", "employment", "moonlighting", "currentAddress"] },
  { k: "driver", lines: ["drivingLicence", "criminalRecord", "currentAddress"] },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Background check packages for small business",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function SmbPage({
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
  /** The three cards resolved once and read twice — by the rack below and by
   *  the `Service` node's `offers`, which was `PACKS.map(...)` before the copy
   *  move and still mirrors exactly what the page renders (§8.2). */
  const packs = PACKS.map((p) => ({ ...p, ...t.smb.packs[p.k] }));
  const service: ServiceFacts = {
    ...SERVICE,
    offers: packs.map((p) => ({ name: p.tt, description: p.sub })),
  };

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/business" }, { label: t.smb.crumb }]}
      closing={{
        heading: t.smb.closing.heading,
        sub: t.smb.closing.sub,
        ctaLabel: t.smb.closing.ctaLabel,
        ctaHref: "https://app.helloverify.com",
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{t.smb.hero.k}</div>
        <h1 className="h1">{t.smb.hero.h1}</h1>
        <p className="sub">{t.smb.hero.sub}</p>
        <div className="hrow">
          <a href="https://app.helloverify.com" className="btn btn-ink">{t.smb.hero.buy}</a>
          <AppLink href="/contact" className="btn btn-ghost">
            <span>{t.smb.hero.talkFirst}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          <span className="it">{t.smb.strip.package}</span>
          <span className="it">{t.smb.strip.checks}</span>
          <span className="it">{t.smb.strip.subscription}</span>
          <span className="it">{t.smb.strip.invoice}</span>
        </div>
      </div>

      {/* pricing rack */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). 44 words, every figure taken from
            the PACKS records rendered below — three packages, their turnarounds,
            per-candidate pricing — plus the trust strip's "No subscription" and
            "GST invoice on every order".

            TWO THINGS DELIBERATELY LEFT OUT, and the reason is that an answer
            block is read AWAY from the page:

            - The rupee figures. They are placeholders pending commercial
              sign-off, and the `.pricenote` below says so — but a block built
              to survive extraction leaves that disclaimer behind, so a
              citeable "₹349" would become a firm price the moment an engine
              lifts it. The heading therefore asks what you can buy, not what
              it costs.
            - The blue-collar package's check list. It contains "Registration
              certificate", whose turnaround TASKS.md measures as 30 min on the
              homepage and 60 min on /business/enterprise, and which is not in
              the catalogue at all. Naming it inside this package's 30 minutes
              would settle that in a sentence built to be quoted, so the answer
              gives the package's turnaround and not its contents. The
              white-collar list has no such conflict and is named in full. */}
        <SecHead k={t.smb.packages.k} h={t.smb.packages.h}>
          {t.smb.packages.lede}
        </SecHead>
        <div className="body3 rack3">
          {packs.map((p) => (
            <div className="rc" key={p.tt}>
              <div className="hd"><span>{p.hd0}</span><span>{p.hd1}</span></div>
              <div className="tt">{p.tt}</div>
              <div className="sub">{p.sub}</div>
              <div className="sep" />
              {/* `key` still resolves to the label, as it did when the label
                  WAS the array element — third corollary of the byte-identity
                  rule in `lib/copy/index.ts`. */}
              {p.lines.map((l) => (
                <div className="ln" key={t.smb.checks[l]}><Tick /><span>{t.smb.checks[l]}</span></div>
              ))}
              <div className="sep" />
              <div className="price">
                <span className="lb">{t.smb.card.perCandidate}</span>
                <span className="v">{p.price}<small>{t.smb.card.inclGst}</small></span>
              </div>
              <div className="ready">
                {/* A FUNCTION leaf: the count is the page's, and the markup is
                    two adjacent text children with React's `<!-- -->` between
                    them. Measured with `renderToString` — `{n}{" checks · ready
                    in"}` inline and the same pair inside a Fragment emit the
                    same bytes, separator included; joining them does not. */}
                <span className="lb">{t.smb.card.readyIn(p.lines.length)}</span>
                <span className="v">{p.ready}</span>
              </div>
              <div className="bc" />
              <div className="buy">
                <span className="who">{p.who}</span>
                <a href="https://app.helloverify.com" className="btn btn-ink btn-sm">{t.smb.card.buyNow}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="pricenote">
          {t.smb.pricenote(
            <AppLink href="/contact" style={{ color: "inherit", textDecoration: "underline" }}>{t.smb.pricenoteLink}</AppLink>,
          )}
        </div>
      </div>

      {/* build your own */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 44 words. The times are the `.pl3` chips
            below and the count is the button's own "All 33 checks"; nothing
            here is new copy. */}
        <SecHead k={t.smb.alacarte.k} h={t.smb.alacarte.h}>
          {t.smb.alacarte.lede}
        </SecHead>
        <div className="body3 cloud3" style={{ marginTop: 36 }}>
          {/* Each chip keeps its three children — the `.d` dot, the name, the
              `.t` time — so these are two text-node swaps apiece and no child
              is merged or split. */}
          <span className="pl3 fast"><span className="d" />{t.smb.chips.identity.n}<span className="t">{t.smb.chips.identity.t}</span></span>
          <span className="pl3 fast"><span className="d" />{t.smb.chips.pan.n}<span className="t">{t.smb.chips.pan.t}</span></span>
          <span className="pl3 fast"><span className="d" />{t.smb.chips.drivingLicence.n}<span className="t">{t.smb.chips.drivingLicence.t}</span></span>
          <span className="pl3 fast"><span className="d" />{t.smb.chips.criminal.n}<span className="t">{t.smb.chips.criminal.t}</span></span>
          <span className="pl3 fast"><span className="d" />{t.smb.chips.currentAddress.n}<span className="t">{t.smb.chips.currentAddress.t}</span></span>
          <span className="pl3 fast"><span className="d" />{t.smb.chips.digitalEmployment.n}<span className="t">{t.smb.chips.digitalEmployment.t}</span></span>
          <span className="pl3"><span className="d" />{t.smb.chips.employment.n}<span className="t">{t.smb.chips.employment.t}</span></span>
          <span className="pl3"><span className="d" />{t.smb.chips.education.n}<span className="t">{t.smb.chips.education.t}</span></span>
          <AppLink href="/resources/checks" className="btn btn-line btn-sm">{t.smb.allChecks}</AppLink>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            <div className="k">{t.smb.howItWorks.k}</div>
            {/* Question-shaped H2 with NO lede added (§11a.2). This band has
                never carried one — it is a bare `sec-head`, not a `SecHead` —
                and the three `Steps` cards below already read as the answer.
                Same call made on /checks/[check] for its two lede-less bands:
                converting the heading is copy, adding a paragraph where the
                design has none is a layout change. */}
            <h2 className="h2" style={{ marginTop: 12 }}>{t.smb.howItWorks.h}</h2>
          </div>
        </div>
        {/* HowTo (§17 condition 18): `name` is this band's own `<h2>`, so the
            node and the heading are the same string — now ONE leaf read twice
            rather than two identical literals a translation could part. */}
        <Steps
          name={t.smb.howItWorks.h}
          items={[t.smb.steps.pick, t.smb.steps.link, t.smb.steps.report]}
        />
      </div>

      {/* FAQ — markup and FAQPage node both from the same records (see
          FaqSection). The order is written here because a sequence is
          structure; the four questions are `business.smb.faqs`. */}
      <FaqSection
        head={t.smb.faqHead}
        faqs={[t.smb.faqs.consent, t.smb.faqs.subscription, t.smb.faqs.unverifiable, t.smb.faqs.invoice]}
      />

      <JsonLd data={serviceNode(locale, service)} />
    </PageShell>
  );
}

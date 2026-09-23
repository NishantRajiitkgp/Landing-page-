/** /business/enterprise — vertical page (Template 3, the workhorse pattern). */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { copyFor } from "@/lib/seo/copy";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { setRequestLocale } from "next-intl/server";
import { SecHead } from "@/components/chrome/SecHead";
import { Arrow } from "@/components/brand/Arrow";
import { Steps } from "@/components/chrome/Steps";
import { Lanes, type Lane } from "@/components/chrome/Lanes";
import { CheckTable, type Row } from "@/components/chrome/CheckTable";
import { BUSINESS, type LaneKey, type PillKey, type RowKey } from "@/lib/copy/business";
import { copy } from "@/lib/copy/request";
import { FAQ_ORDER } from "./content";

/** This page's route, stated ONCE. `pageMetadata` and the Service node below
 *  both read it, so §8.2's graph does not add a second chance to name the
 *  wrong route on top of the one §8.1 already guards. */
const PATH = "/business/enterprise";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, PATH);
}


/** Which pills, in which order, and which render `.fast` — structure, and it
 *  stays. The names and the times are `lib/copy/business`'s, keyed by
 *  `LaneKey` and `PillKey`, so a lane or a pill added without copy is TS2322
 *  on this array in every locale at once. `fast` is a CSS class, not a word,
 *  which is why it did not go with them. The shape is
 *  `chrome/SiteFooter.tsx`'s `COLS`, for the reason `lib/copy/index.ts`
 *  argues under "Where the keys come from". */
const LANES: readonly { k: LaneKey; pills: readonly { p: PillKey; fast?: boolean }[] }[] = [
  {
    k: "identity",
    pills: [
      { p: "identity", fast: true },
      { p: "pan", fast: true },
      { p: "passport", fast: true },
      { p: "age", fast: true },
      { p: "drivingLicence", fast: true },
      // 30 min, not 60. This page was the only surface saying 60 min;
      // `sections/Checks.tsx` says 30 min. The old site defines this check
      // as "a vehicle's registration details, including ownership and
      // registration status" (`public/cms/en/employees.base.json`), i.e.
      // the RTO record - the SAME authority as Driving licence, which the
      // catalogue rates 30 min and fast. Two checks against one registry
      // cannot differ by 2x.
      { p: "registrationCertificate", fast: true },
    ],
  },
  {
    k: "work",
    pills: [
      { p: "digitalEmployment", fast: true },
      { p: "moonlighting", fast: true },
      { p: "entitlementToWork", fast: true },
      { p: "employment" },
      { p: "education" },
    ],
  },
  {
    k: "records",
    pills: [
      { p: "credit", fast: true },
      { p: "globalDatabase", fast: true },
      { p: "criminal", fast: true },
      { p: "currentAddress", fast: true },
      { p: "tradeLicence" },
      { p: "directorsGst" },
    ],
  },
];

/** Same split as `LANES`: the six rows' order and their `.fast` flag here,
 *  their four strings in the dictionary under the same keys. */
const ROWS: readonly { k: RowKey; fast?: boolean }[] = [
  { k: "identityPan", fast: true },
  { k: "drivingLicence", fast: true },
  { k: "criminal", fast: true },
  { k: "digitalEmployment", fast: true },
  { k: "employment" },
  { k: "education" },
];

/** BUILD-SPEC §8.2 (`Service`, per solution) and §11a.3 (`areaServed`).
 *  `description` is this page's own reviewed description, read from the copy
 *  table (`lib/seo/copy.ts`, §8.1) rather than paraphrased here, so the page
 *  title, the meta description, the Service node and llms.txt cannot drift
 *  apart. */
const SERVICE: ServiceFacts = {
  path: PATH,
  name: "Enterprise background verification",
  description: copyFor(PATH).description,
  serviceType: "Background verification",
};

export default async function EnterprisePage({
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
  const lanes: Lane[] = LANES.map((l) => ({
    ...t.enterprise.lanes[l.k],
    pills: l.pills.map((p) => ({ ...t.enterprise.pills[p.p], fast: p.fast })),
  }));
  const rows: Row[] = ROWS.map((r) => ({ ...t.enterprise.rows[r.k], fast: r.fast }));

  return (
    <PageShell
      crumbs={[{ label: t.crumb, href: "/business" }, { label: t.enterprise.crumb }]}
      closing={{
        heading: t.enterprise.closing.heading,
        sub: t.enterprise.closing.sub,
      }}
    >
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{t.enterprise.hero.k}</div>
        <h1 className="h1">{t.enterprise.hero.h1}</h1>
        <p className="sub">{t.enterprise.hero.sub}</p>
        <div className="hrow">
          <AppLink href="/contact" className="btn btn-ink">{t.enterprise.hero.cta}</AppLink>
          <a href="#turnaround" className="btn btn-ghost">
            <span>{t.enterprise.hero.turnaround}</span>
            <Arrow />
          </a>
        </div>
      </div>

      {/* trust strip */}
      <div className="wrap">
        <div className="strip3">
          {/* Each item is `<b>figure</b> tail` — two children, and one
              rich-text leaf rather than two string leaves, because
              `{t.a}{t.b}` puts two adjacent text children where one sits
              today and React's SSR separates those with `<!-- -->`. Measured
              with `renderToString` before the move: Fragment-wrapping an
              element-plus-text pair is byte-identical; joining them is not. */}
          <span className="it">{t.enterprise.strip.clients}</span>
          <span className="it">{t.enterprise.strip.checks}</span>
          <span className="it">{t.enterprise.strip.riders}</span>
          <span className="it">{t.enterprise.strip.certs}</span>
        </div>
      </div>

      {/* what we verify */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (BUILD-SPEC §11a.2). 42 words. The three questions are
            the LANES records' own `gh` fields, the four times are their pills,
            and "33 checks" is the old heading and the button below.

            Still deliberately silent on three pills' turnarounds — Entitlement
            to work, Registration certificate and Directors & GST — even though
            all three now AGREE across every surface as of 22 Sep 2026. The
            reason has changed rather than gone: two of the three are not in
            `lib/content/checks.ts` at all, so their agreement rests on two
            pages matching rather than on a canonical entry, and a sentence
            written to be quoted away from the page should rest on the stronger
            of the two. Add them to the catalogue and these can be named. */}
        <SecHead k={t.enterprise.verify.k} h={t.enterprise.verify.h}>
          {t.enterprise.verify.lede}
        </SecHead>
        <Lanes lanes={lanes} />
        <div style={{ marginTop: 36 }}>
          <AppLink href="/resources/checks" className="btn btn-line btn-sm">{t.enterprise.allChecks}</AppLink>
        </div>
      </div>

      {/* how it works */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 42 words, built from the four `Steps` records
            below plus this band's own "no app, no account". */}
        <SecHead k={t.enterprise.howItWorks.k} h={t.enterprise.howItWorks.h}>
          {t.enterprise.howItWorks.lede}
        </SecHead>
        {/* HowTo (§17 condition 18): `name` is this band's own `SecHead` `h`,
            so the node and the heading are the same string — now ONE leaf read
            twice rather than two identical literals, so a translation cannot
            break the equality `check-schema.mjs` compares per page. */}
        <Steps
          name={t.enterprise.howItWorks.h}
          items={[
            t.enterprise.steps.upload,
            t.enterprise.steps.read,
            t.enterprise.steps.confirm,
            t.enterprise.steps.report,
          ]}
        />
      </div>

      {/* turnaround & coverage */}
      <div className="wrap sec3" id="turnaround">
        {/* ANSWER BLOCK (§11a.2). 42 words, and every time is a ROWS record
            rendered in the table immediately below — same six checks, same
            order — so the quotable sentence and the table cannot drift. The
            120+ countries figure is the table's own footnote. None of the
            three disputed checks appears in ROWS, so nothing had to be left
            out here. */}
        <SecHead k={t.enterprise.turnaroundBand.k} h={t.enterprise.turnaroundBand.h}>
          {t.enterprise.turnaroundBand.lede}
        </SecHead>
        {/* `note` is a FUNCTION leaf taking the anchor, which is the shape
            `lib/copy/index.ts` describes for a sentence wrapping something the
            component owns — here an href and an inline style. A plain string
            would have had to end in a space to keep the byte, and an
            edge-whitespace leaf is what `tools/test/copy.test.ts` §3 rejects. */}
        <CheckTable
          rows={rows}
          note={t.enterprise.note(
            <AppLink href="/platform/coverage" style={{ color: "inherit", textDecoration: "underline" }}>{t.enterprise.noteLink}</AppLink>,
          )}
        />
      </div>

      {/* compliance & security */}
      <div className="wrap sec3">
        {/* ANSWER BLOCK (§11a.2). 45 words, from the four `.cert` cards below
            and the closing step's "auditable trail". Counted with
            `split(/\s+/)`, the convention `tools/test/answer-blocks.test.ts`
            uses; the note here previously read 44, which is the same sentence
            counted without its two em dashes, and both numbers sit inside
            that test's 25-70 band either way.

            IT SAID "GDPR COMPLIANT" UNTIL 22 SEP 2026, which made it the
            second prose surface blurring the distinction
            `/platform/security-compliance`'s standfirst says it does not
            blur — the card beside it said the same, and the homepage said it
            too. The reviewed word is "aligned" (`CREDENTIALS` writes
            "GDPR-aligned data protection practices"), so the claim here is
            now the reviewed one. Worth noting for the next answer block: the
            Part 8 rule that no certification name appears in an answer block
            was already broken on this page and on `/governments` before that
            rule was written down, which is exactly why a status word in prose
            can drift with nothing to catch it.

            The NSR card is NOT folded in. It reads "National Skills Registry /
            India's registry of verified IT and ITeS professionals" — a
            description of the registry, where the ISO, GDPR and PBSA cards
            each state HelloVerify's own standing. Turning a logo into
            "HelloVerify is on the NSR" would be a new credential claim, and
            §11a.2 does not license one; credentials are Part 2b's surface. */}
        <SecHead k={t.enterprise.compliance.k} h={t.enterprise.compliance.h}>
          {t.enterprise.compliance.lede}
        </SecHead>
        {/* The same four as the homepage and the six vertical pages, from
            `CREDENTIAL_MARKS` in `lib/content/company.ts`. Two of the four
            were outliers before 22 Sep 2026: this page headed the PBSA card
            "Professional Background Screening Association" where five other
            surfaces said "PBSA member", and it was the SECOND surface saying
            "GDPR compliant" where the procurement page says "GDPR —
            aligned" (the homepage was the other). Glosses are all defaults
            here — nothing on this page needs its own length. */}
        <div className="body3 certs3">
          <CertCards ids={["iso27001", "gdpr", "pbsa", "nsr"]} />
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>{t.enterprise.securityInFull}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from the SAME array (see
          FaqSection). The five questions are `business.enterprise.faqs`; the
          order they are asked in is `./content`, which is structure. */}
      <FaqSection
        head={t.enterprise.faqHead}
        faqs={FAQ_ORDER.map((k) => t.enterprise.faqs[k])}
      />

      <JsonLd data={serviceNode(locale, SERVICE)} />
    </PageShell>
  );
}

/**
 * Template 3 — the vertical/solution workhorse (DESIGN.md §7, IA §6).
 * Anatomy is fixed so every vertical reads the same and each H2 block stays a
 * self-contained, citable unit; only the content varies.
 */
import { PageShell } from "@/components/chrome/PageShell";
import { FaqSection } from "@/components/chrome/FaqSection";
import type { ClosingCta } from "@/components/chrome/ClosingCta";
import { CertCards } from "@/components/chrome/CertCard";
import { AppLink } from "@/components/chrome/AppLink";
import { CommerceCta } from "@/components/commerce/CommerceCta";
import type { PackageCheckoutDetails } from "@/lib/auth/types";
import type { Crumb } from "@/lib/seo/schema/breadcrumbs";
import type { Faq } from "@/lib/seo/schema/faq";
import { serviceNode, type ServiceFacts } from "@/lib/seo/schema/service";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import { Arrow } from "@/components/brand/Arrow";
import { Steps, type Step } from "@/components/chrome/Steps";
import { TEMPLATES } from "@/lib/copy/templates";
import { copy } from "@/lib/copy/request";

export type Pill = { n: string; t?: string; fast?: boolean };
/** `id` keys the lane when `gt` repeats across lanes. */
export type Lane = { id?: string; gt: string; gh: string; pills: Pill[] };
// The step card moved to `chrome/Steps.tsx` when 41 hand-written copies of
// it turned up across 12 pages that are not built on this template. Re-
// exported here so the six vertical pages keep importing one module.
export type { Step };
export type Row = { nm: string; sub: string; tm?: string; fast?: boolean; src?: string };
type Band = "verify" | "steps" | "table" | "compliance";

export type VerticalContent = {
  crumbs: readonly Crumb[];
  /** The `Service` this page describes (BUILD-SPEC §8.2). Required rather
   *  than optional: every page built on this template IS a solution page,
   *  so a missing node here would be an omission, not a choice, and tsc
   *  reporting it is cheaper than a checker noticing later. */
  service: ServiceFacts;
  eyebrow: string;
  h1: React.ReactNode;
  sub: string;
  primary?: { label: string; href: string };
  primaryCommerce?: PackageCheckoutDetails;
  secondary?: { label: string; href: string };
  /** Optional control under the hero lede (immigration audience tabs). The
   *  sections below are untouched — this is a slot, not a restyle. */
  heroAfter?: React.ReactNode;
  /** Partner marks above the trust strip, the `.logos3` row the enterprise
   *  page uses. */
  partners?: { h: string; logos: readonly { src: string; alt: string }[] };
  strip: React.ReactNode[];
  /** Omitted: no "what we verify" band at all (trade's source has none). */
  verifyHead?: React.ReactNode;
  verifyLede?: string;
  lanes: Lane[];
  laneCols?: number;
  stepsHead: React.ReactNode;
  stepsLede?: string;
  steps: Step[];
  /** `false` when the cards are concurrent claims rather than a sequence, so
   *  no HowTo is emitted. Must agree with `HOWTO_NOT_A_SEQUENCE`. */
  stepsAreSequence?: boolean;
  tableHead: React.ReactNode;
  tableLede?: string;
  rows: Row[];
  tableNote?: React.ReactNode;
  /** Omitted: the band shows its eyebrow and certificate cards only. */
  complianceHead?: React.ReactNode;
  complianceLede?: string;
  /** Bands whose template eyebrow does not describe this page's content
   *  ("Turnaround & coverage" over a table with no times); they render
   *  without one. */
  plainBands?: readonly Band[];
  faqHead: React.ReactNode;
  faqs: readonly Faq[];
  closing: React.ComponentProps<typeof ClosingCta>;
};

/** The four credentials every vertical page shows, and this array WAS the four
 *  cards — copy, status words and all — until 22 Sep 2026.
 *
 *  It was the closest thing the site had to a source, which is exactly why it
 *  is worth recording that it still drifted from the other eight surfaces: it
 *  said "GDPR-aligned data handling" where the homepage said "GDPR compliant"
 *  and `/platform/security-compliance` said "GDPR — aligned", and it glossed
 *  PBSA "Member of the global standards body…" where `/about` and
 *  `/governments` used the reviewed list's own tail, "The global standards body
 *  for the screening industry." Driving four of nine files from a local array is
 *  not a source; it is a fifth copy with better ergonomics. The records live in
 *  `CREDENTIAL_MARKS` in `lib/content/company.ts` now, and only the choice of
 *  WHICH four is a property of this template. */
const CERT_IDS = ["iso27001", "gdpr", "pbsa", "nsr"] as const;

/** Async only to resolve the locale for the Service node's absolute URLs —
 *  the same `getLocale()` call `PageShell` and `AppLink` already make, and
 *  static because every page calls `setRequestLocale` (BUILD-SPEC §5). */
export async function VerticalPage(c: VerticalContent) {
  const locale = await getLocale();
  // Words in `lib/copy/templates`, structure here. Two awaits and one
  // `getLocale()`: next-intl caches that call per request, so `copy()`
  // re-uses the resolution the line above already paid for.
  const t = await copy(TEMPLATES);
  // A page whose source publishes no turnaround or source drops that column.
  const hasTm = c.rows.some((r) => r.tm);
  const hasSrc = c.rows.some((r) => r.src);
  const tableCols =
    hasTm && hasSrc
      ? undefined
      : { gridTemplateColumns: ["minmax(0, 1fr)", hasTm && "130px", hasSrc && "220px"].filter(Boolean).join(" ") };
  const kicker = (b: Band) => (c.plainBands?.includes(b) ? null : <div className="k">{t.bands[b]}</div>);

  return (
    <PageShell crumbs={c.crumbs} closing={c.closing}>
      {/* hero */}
      <div className="wrap hero3">
        <div className="k">{c.eyebrow}</div>
        <h1 className="h1">{c.h1}</h1>
        <p className="sub">{c.sub}</p>
        {c.heroAfter}
        <div className="hrow">
          {c.primaryCommerce ? (
            <CommerceCta
              className="btn btn-ink"
              label={c.primary?.label ?? t.talkToSales}
              packageDetails={c.primaryCommerce}
            />
          ) : (
            <AppLink href={c.primary?.href ?? "/contact"} className="btn btn-ink">{c.primary?.label ?? t.talkToSales}</AppLink>
          )}
          {c.secondary && (
            <AppLink href={c.secondary.href} className="btn btn-ghost">
              <span>{c.secondary.label}</span>
              <Arrow />
            </AppLink>
          )}
        </div>
      </div>

      {/* partner marks + trust strip */}
      <div className="wrap">
        {c.partners && (
          <>
            <p className="logos3-h">{c.partners.h}</p>
            <ul className="logos3">
              {c.partners.logos.map((l) => (
                <li key={l.src}>
                  <Image src={l.src} alt={l.alt} width={150} height={40} />
                </li>
              ))}
            </ul>
          </>
        )}
        {c.strip.length > 0 && (
          <div className="strip3">
            {c.strip.map((s, i) => (
              <span className="it" key={i}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* what we verify */}
      {c.verifyHead && (
        <div className="wrap sec3">
          <div className="sec-head">
            <div>
              {kicker("verify")}
              <h2 className="h2" style={{ marginTop: 12 }}>{c.verifyHead}</h2>
            </div>
            {c.verifyLede && <p className="lede" style={{ marginBottom: 8 }}>{c.verifyLede}</p>}
          </div>
          {c.lanes.length > 0 && (
            <div
              className="body3 lanes3"
              style={c.laneCols ? { gridTemplateColumns: `repeat(${c.laneCols}, minmax(0, 1fr))` } : undefined}
            >
              {c.lanes.map((l) => (
                <div key={l.id ?? l.gt}>
                  <div className="lgt">{l.gt}</div>
                  <div className="lgh">{l.gh}</div>
                  <div className="cloud3">
                    {l.pills.map((p) => (
                      <span key={p.n} className={`pl3${p.fast ? " fast" : ""}`}>
                        <span className="d" />
                        {p.n}
                        {p.t && <span className="t">{p.t}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* how it works */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            {kicker("steps")}
            <h2 className="h2" style={{ marginTop: 12 }}>{c.stepsHead}</h2>
          </div>
          {c.stepsLede && <p className="lede" style={{ marginBottom: 8 }}>{c.stepsLede}</p>}
        </div>
        {/* HowTo (§17 condition 18): the heading above is the node's name, so
            all six vertical pages emit one from the `steps` they already
            render, with no second string to keep in step.
            `typeof` rather than a cast or a narrowed `stepsHead: string`,
            because `stepsHead` is `ReactNode` for the same reason
            `FaqSection`'s `head` is — reviewed headings elsewhere carry a
            `<br />` the design depends on — and a heading that is not a plain
            string cannot be stated verbatim in JSON-LD. All six are strings
            today (measured: six `stepsHead="How …"` literals), so all six
            emit; one written as JSX would silently emit none, which is why
            `check-schema.mjs` lists the six pages that must have the node
            rather than counting whatever the build produced. */}
        <Steps
          items={c.steps}
          name={c.stepsAreSequence !== false && typeof c.stepsHead === "string" ? c.stepsHead : undefined}
        />
      </div>

      {/* turnaround & coverage */}
      <div className="wrap sec3" id="turnaround">
        <div className="sec-head">
          <div>
            {kicker("table")}
            <h2 className="h2" style={{ marginTop: 12 }}>{c.tableHead}</h2>
          </div>
          {c.tableLede && <p className="lede" style={{ marginBottom: 8 }}>{c.tableLede}</p>}
        </div>
        <div className="body3 tbl3">
          {(hasTm || hasSrc) && (
            <div className="hd" style={tableCols}>
              <span>{t.table.check}</span>
              {hasTm && <span>{t.table.turnaround}</span>}
              {hasSrc && <span>{t.table.confirmedWith}</span>}
            </div>
          )}
          {c.rows.map((r) => (
            <div className="r" key={r.nm} style={tableCols}>
              <span className="nm">{r.nm}<small>{r.sub}</small></span>
              {hasTm && <span className={`tm${r.fast ? " fast" : ""}`}>{r.tm}</span>}
              {hasSrc && <span className="src">{r.src}</span>}
            </div>
          ))}
          {c.tableNote && <div className="note">{c.tableNote}</div>}
        </div>
      </div>

      {/* compliance & security */}
      <div className="wrap sec3">
        <div className="sec-head">
          <div>
            {kicker("compliance")}
            {c.complianceHead && <h2 className="h2" style={{ marginTop: 12 }}>{c.complianceHead}</h2>}
          </div>
          {c.complianceLede && <p className="lede" style={{ marginBottom: 8 }}>{c.complianceLede}</p>}
        </div>
        <div className="body3 certs3">
          <CertCards ids={CERT_IDS} />
        </div>
        <div style={{ marginTop: 32 }}>
          <AppLink href="/platform/security-compliance" className="btn btn-ghost btn-sm">
            <span>{t.securityInFull}</span>
            <Arrow />
          </AppLink>
        </div>
      </div>

      {/* FAQ — markup and FAQPage node both from `c.faqs` (see FaqSection). */}
      <FaqSection head={c.faqHead} faqs={c.faqs} />

      <JsonLd data={serviceNode(locale, c.service)} />
    </PageShell>
  );
}

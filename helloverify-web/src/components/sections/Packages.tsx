import { Fragment, type ReactNode } from "react";

import { Tick } from "@/components/brand/Tick";

/** Packages, drawn as receipts.
 *
 *  712 lines for nine cards, six on desktop and three on mobile, each one
 *  written out by hand. The card is now one component over one record list
 *  (BUILD-SPEC §4 rule 2, §17 condition 22) — the same shape
 *  `app/[locale]/business/smb/page.tsx` already uses for its own `PACKS`.
 *
 *  THE TWO BREAKPOINTS SHARE ONE LIST HERE, which `PeopleStrip.tsx` deliberately
 *  did not do. The difference is measured, not assumed: there the copy differed
 *  between breakpoints ("Driving licence · 30 min" vs "Licence · 30 min"), so
 *  folding the lists would have meant inventing a shared string. Here all seven
 *  fields of all three mobile cards are byte-identical to their desktop
 *  counterparts — only the order and the subset differ. Two lists would have
 *  been two copies of the same words.
 *
 *  What is NOT in the records, because it belongs to the breakpoint rather than
 *  to the package (all three measured against the emitted HTML, not eyeballed):
 *
 *  - the whitespace text nodes between a card's rows. The desktop card has a
 *    space between every row; the mobile card has them only around the `ln` run
 *    and before `act`. React emits those as real text nodes, so they are part of
 *    the output, which is why `gap` is `null` rather than `" "` on mobile.
 *  - the "Buy now" button's height — 36px desktop, 34px mobile.
 *  - the "Explore" link's inline flex box, which mobile sets and desktop does
 *    not.
 */

type Pack = {
  /** The right-hand half of the header rule; the left is always "Package". */
  readonly hd: string;
  /** A `ReactNode`, not a string, for the two titles the artboard exporter
   *  split around an `&amp;`. React emits `Visa<!-- --> <!-- -->&amp;…` for
   *  those — five text nodes with hydration separators between them — and a
   *  plain "Visa & healthcare" would collapse them to one. Different bytes for
   *  the same pixels, and this refactor is required to change neither. */
  readonly tt: ReactNode;
  readonly sub: string;
  /** Same reason as `tt`: "Credit &amp; company" is four nodes, not one. */
  readonly lines: readonly ReactNode[];
  readonly ready: string;
  readonly who: string;
  /** The one consumer package sells directly; the other five link to a page.
   *  The button's size is not here — see the header note. */
  readonly buy?: boolean;
};

const PACKS: readonly Pack[] = [
  {
    hd: "Enterprise · SMB",
    tt: "Blue-collar hire",
    sub: "Drivers, riders, warehouse, security",
    lines: ["PAN card", "Registration certificate", "Driving licence", "Criminal record"],
    ready: "30 minutes",
    who: "One upload from the candidate",
  },
  {
    hd: "Enterprise · SMB",
    tt: "White-collar hire",
    sub: "Corporate, tech, finance, healthcare",
    lines: ["Education", "Employment", "Moonlighting", "Current address"],
    ready: "3 days",
    who: "Registrar-confirmed",
  },
  {
    hd: "Consumer · HelloV",
    tt: "Driver",
    sub: "For families and small fleets",
    lines: ["Driving licence", "Criminal record", "Current address"],
    ready: "30 minutes",
    who: "Also as Basic, without address",
    buy: true,
  },
  {
    hd: "Vendors · Certifier",
    tt: "Trade licence risk",
    sub: "Before you sign a supplier",
    lines: [
      "Trade licence",
      "Defaulting directors",
      "Criminal records",
      <>Credit{" "}&amp;{" "}company</>,
    ],
    ready: "2 days",
    who: "Certified vendor profile",
  },
  {
    hd: "Vendors · Certifier",
    tt: "Vendor financial risk",
    sub: "Before the first purchase order",
    lines: [
      "Financial assessment",
      "GST screening",
      "Credit checks",
      "Promoter criminal history",
    ],
    ready: "2 days",
    who: "Certified vendor profile",
  },
  {
    hd: "Premium services",
    tt: <>Visa{" "}&amp;{" "}healthcare</>,
    sub: "Applicants and licensing bodies",
    lines: [
      "Application form filling",
      "Document pre-screening",
      "Primary source verification",
    ],
    ready: "3 days",
    who: "Submission-ready file",
  },
];

/** Mobile carries three of the six, and not the first three: Driver sits
 *  second, ahead of the white-collar package it follows on desktop. The rest
 *  are behind the link under the rack. */
const MOBILE: readonly Pack[] = [PACKS[0], PACKS[2], PACKS[1]];

function PackCard({ p, mob = false }: { p: Pack; mob?: boolean }) {
  // See the header note: the desktop card separates every row with a real space
  // text node, the mobile card separates only some of them.
  const gap = mob ? null : " ";
  return (
    <div className="rc">
      {" "}
      <div className="hd">
        <span>Package</span>
        <span>{p.hd}</span>
      </div>
      {gap}
      <div className="tt">{p.tt}</div>
      {gap}
      <div className="sub">{p.sub}</div>
      {gap}
      <div className="sep"></div>
      {" "}
      {p.lines.map((l, i) => (
        <div className="ln" key={i}>
          <Tick />
          <span>{l}</span>
        </div>
      ))}
      {" "}
      <div className="sep"></div>
      {gap}
      <div className="tot">
        {/* Derived, not stored: the count agreed with `lines.length` on all
            nine cards, so storing it would only be somewhere for the two to
            disagree. `smb/page.tsx` derives it the same way.

            INTERPOLATED INTO ONE STRING, not written as
            `{p.lines.length} checks · ready in`. Measured: that spelling makes
            the number and the words two adjacent children, and React's SSR
            separates adjacent text nodes with `<!-- -->` for hydration — nine
            cards, nine extra comments, 72 bytes the hand-written markup did not
            emit. The template literal is a single child and a single text
            node. */}
        <span className="lb">{`${p.lines.length} checks · ready in`}</span>
        <span className="v">{p.ready}</span>
      </div>
      {gap}
      <div className="bc"></div>
      {" "}
      <div className="act">
        <span className="who">{p.who}</span>
        {p.buy ? (
          <a
            href="#"
            className="btn btn-ink btn-sm"
            style={{ height: mob ? "34px" : "36px" }}
          >
            Buy now
          </a>
        ) : (
          <a
            href="#"
            // Spread rather than `style={mob ? {…} : undefined}`. Both render
            // the same HTML, but the second puts `"style":"$undefined"` into
            // the flight payload on every desktop card, where the hand-written
            // markup carried no `style` prop at all. Measured in
            // `.next/server/app/en.html`; see `tools/port/html-identity.mjs`.
            {...(mob
              ? { style: { display: "inline-flex", alignItems: "center", gap: "6px" } }
              : {})}
          >
            Explore{" "}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
      {" "}
    </div>
  );
}

/** The rack. Each card is preceded by a space and the run ends with one,
 *  exactly as the hand-written markup did — real text nodes between the cards,
 *  not formatting. */
function Rack({
  packs,
  mob,
  style,
}: {
  packs: readonly Pack[];
  mob?: boolean;
  style: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {packs.map((p, i) => (
        <Fragment key={i}>
          {" "}
          <PackCard p={p} mob={mob} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

export function Packages() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "150px" }}>
          {" "}
          <div className="sec-head">
            {" "}
            <h2 className="h2">
              Or take a package.
              <br />
              One upload, one answer.
            </h2>
            {" "}
            <p className="lede" style={{ marginBottom: "8px" }}>
              A fixed set of checks with one turnaround. Everything runs in parallel, so a package is only as slow as its slowest check.
            </p>
            {" "}
          </div>
          {" "}
          <Rack
            packs={PACKS}
            style={{
              marginTop: "80px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "48px 32px",
              alignItems: "start",
            }}
          />
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">
            Or take a package. One upload, one answer.
          </h2>
          {" "}
          <p className="lede">
            A fixed set of checks with one turnaround — as fast as its slowest check.
          </p>
          {" "}
          <Rack
            packs={MOBILE}
            mob
            style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "34px" }}
          />
          {" "}
          {/* Outside the repeated run, and the reason the mobile rack can be a
              subset at all. PeopleStrip's regression was exactly this: an
              extraction that read the repeated track and not what followed it. */}
          <a href="#" className="btn btn-line full" style={{ marginTop: "34px" }}>
            Trade licence, vendor risk{" "}
            &amp;
            {" "}premium packages
          </a>
          {" "}
        </div>
      </div>
    </>
  );
}

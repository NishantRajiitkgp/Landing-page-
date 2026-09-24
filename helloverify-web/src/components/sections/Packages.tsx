import { Fragment } from "react";

import { Arrow } from "@/components/brand/Arrow";
import { Tick } from "@/components/brand/Tick";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type PackId, type PackLineId } from "@/lib/copy/sections";
// Homepage v2 styles are one sheet per section (see `app/v2/hero.css`).
import "@/app/v2/packages.css";
import { PackPhoto, type PackPhotoProps } from "./PackPhoto";

/** Packages, drawn as receipts.
 *
 *  DESKTOP IS HOMEPAGE V2 (Sep 2026): the six receipts became photo cards
 *  (`./PackPhoto`) over the same records and the same words. The phone keeps
 *  its three receipts below, so `PackCard` and `Rack` now render the `.mob`
 *  tree only.
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
  readonly k: PackId;
  /** Which lines this card lists, and in what order. The words are one flat
   *  table in `lib/copy/sections` — including the two the artboard exporter
   *  split around an `&amp;`, which are still `ReactNode` leaves there. React
   *  emits `Visa<!-- --> <!-- -->&amp;…` for those: five text nodes with
   *  hydration separators between them, where a plain "Visa & healthcare"
   *  would collapse them to one. Different bytes for the same pixels, and
   *  neither this refactor nor that move was allowed to change either. */
  readonly lines: readonly PackLineId[];
  /** The one consumer package sells directly; the other five link to a page.
   *  The button's size is not here — see the header note. */
  readonly buy?: boolean;
};

/** The six cards in desktop order, and the only two things about one that are
 *  not words: which lines it lists, and whether it sells. Everything a reader
 *  sees is `lib/copy/sections`' `packages`. */
const PACKS: readonly Pack[] = [
  { k: "blueCollar", lines: ["pan", "rc", "licence", "criminal"] },
  { k: "whiteCollar", lines: ["education", "employment", "moonlighting", "address"] },
  { k: "driver", lines: ["licence", "criminal", "address"], buy: true },
  { k: "tradeRisk", lines: ["tradeLicence", "directors", "criminalRecords", "credit"] },
  { k: "vendorRisk", lines: ["financial", "gst", "creditChecks", "promoter"] },
  { k: "visaHealth", lines: ["form", "prescreen", "primary"] },
];

/** The v2 desktop card's photograph, its focal point, and where its link
 *  goes — the IA's page for that package's audience (`lib/seo/routes.ts`).
 *  The focal points are the board's. */
const PHOTOS: Record<PackId, Pick<PackPhotoProps, "src" | "focus" | "href">> = {
  blueCollar: { src: "/img/v2/pkg-bluecollar.jpg", focus: "50% 35%", href: "/business/smb" },
  whiteCollar: { src: "/img/v2/pkg-whitecollar.jpg", focus: "50% 30%", href: "/business/enterprise" },
  driver: { src: "/img/v2/pkg-driver.jpg", focus: "50% 40%", href: "/individuals/hellov" },
  tradeRisk: { src: "/img/v2/pkg-trade.jpg", focus: "40% 40%", href: "/business/certifier" },
  vendorRisk: { src: "/img/v2/pkg-vendor.jpg", focus: "50% 35%", href: "/business/certifier" },
  visaHealth: { src: "/img/v2/pkg-visa.jpg", focus: "55% 40%", href: "/individuals/immigration" },
};

/** Mobile carries three of the six, and not the first three: Driver sits
 *  second, ahead of the white-collar package it follows on desktop. The rest
 *  are behind the link under the rack. */
const MOBILE: readonly Pack[] = [PACKS[0], PACKS[2], PACKS[1]];

async function PackCard({ p, mob = false }: { p: Pack; mob?: boolean }) {
  const t = (await copy(SECTIONS)).packages;
  const pk = t.packs[p.k];
  // See the header note: the desktop card separates every row with a real space
  // text node, the mobile card separates only some of them.
  const gap = mob ? null : " ";
  return (
    <div className="rc">
      {" "}
      <div className="hd">
        <span>{t.package}</span>
        <span>{pk.hd}</span>
      </div>
      {gap}
      <div className="tt">{pk.tt}</div>
      {gap}
      <div className="sub">{pk.sub}</div>
      {gap}
      <div className="sep"></div>
      {" "}
      {p.lines.map((l, i) => (
        <div className="ln" key={i}>
          <Tick />
          <span>{t.lines[l]}</span>
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
            node.

            THE INTERPOLATION IS WHY `tot` IS A FUNCTION LEAF and not a
            string. A leaf of `" checks · ready in"` concatenated here would
            carry edge whitespace, which `tools/test/copy.test.ts` §3 rejects
            because it is invisible in review; two leaves would be two
            children again. A function keeps the sentence whole and lets a
            locale put the number anywhere in it — the third leaf shape
            `lib/copy`'s header lists. */}
        <span className="lb">{t.tot(p.lines.length)}</span>
        <span className="v">{pk.ready}</span>
      </div>
      {gap}
      <div className="bc"></div>
      {" "}
      <div className="act">
        <span className="who">{pk.who}</span>
        {p.buy ? (
          <a
            href="#"
            className="btn btn-ink btn-sm"
            style={{ height: mob ? "34px" : "36px" }}
          >
            {t.buy}
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
            {t.explore}{" "}
            <Arrow size="14" />
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

export async function Packages() {
  const t = (await copy(SECTIONS)).packages;

  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "150px" }}>
          {" "}
          <div className="sec-head">
            {" "}
            <h2 className="h2">
              {t.headingA}
              <br />
              {t.headingB}
            </h2>
            {" "}
            <p className="lede" style={{ marginBottom: "8px" }}>
              {t.lede}
            </p>
            {" "}
          </div>
          {" "}
          <div className="pq-grid">
            {PACKS.map((p) => (
              <PackPhoto key={p.k} k={p.k} lines={p.lines} buy={p.buy} {...PHOTOS[p.k]} />
            ))}
          </div>
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">
            {t.headingMob}
          </h2>
          {" "}
          <p className="lede">
            {t.ledeMob}
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
            {t.more}
          </a>
          {" "}
        </div>
      </div>
    </>
  );
}

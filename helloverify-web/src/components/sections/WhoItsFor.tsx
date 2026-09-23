import { Fragment } from "react";
import Image from "next/image";

import { SIZES_BENTO_NARROW, SIZES_BENTO_WIDE, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type CellSrc } from "@/lib/copy/sections";

/** Who it is for - the audience bento.
 *
 *  324 lines for six cells written twice. One record list now (BUILD-SPEC §4
 *  rule 2, §17 condition 22).
 *
 *  The copy is shared: tag, `from`, and heading were equal between the two
 *  copies on five of six cells. The sixth differs and is a field, not a branch -
 *  the first cell's tag is "Governments & authorities" on desktop and
 *  "Governments" on mobile.
 *
 *  THE MOBILE CELLS USED TO RENDER NO PHOTOGRAPH - six flat tints where desktop
 *  had six photographs. Fixed in its own commit, after the extraction, because
 *  the extraction is gated on byte-identical output and this changes it.
 *
 *  That it was a defect and not a choice is settled by `design.css` rather than
 *  by taste: the mobile stylesheet already defines `.pimg`, and already carries
 *  `.ph:has(.pimg) .light { display: none }` and `.ph:has(.pimg)::after` inside
 *  its `max-width: 1080px` block - complete support for an image that was never
 *  rendered. `SIZES_BENTO_NARROW` even opens with `(max-width: 1080px) 90vw`,
 *  a clause written for a mobile bento photograph and never once exercised.
 *
 *  `sizes` is derived from the column span rather than stored. A cell that
 *  spans two columns is twice as wide, so it takes `SIZES_BENTO_WIDE`; that
 *  held on all six, and it is causal rather than coincidental - `sizes`
 *  describes the box `next/image` has to fill. See `lib/img.ts`, which took
 *  those numbers off a CDP census.
 */

type Cell = {
  readonly src: CellSrc;
  /** Desktop's bento shape. Mobile is a single column and ignores it. */
  readonly span?: "row" | "col";
};

/** The order and the bento shape. Everything a reader sees - the caption, the
 *  tag, the mobile tag, the `from` and the heading - is keyed by photograph in
 *  `lib/copy/sections`, which is where the sixth cell's shorter mobile tag now
 *  lives too. */
const CELLS: readonly Cell[] = [
  { src: "/img/10-ministry-hall.jpg", span: "row" },
  { src: "/img/11-office-first-day.jpg", span: "col" },
  { src: "/img/12-phone-signup.jpg" },
  { src: "/img/13-factory-floor.jpg" },
  { src: "/img/14-visa-counter.jpg" },
  { src: "/img/15-home-doorway.jpg", span: "col" },
];

async function BentoCell({ c, mob = false }: { c: Cell; mob?: boolean }) {
  const cell = (await copy(SECTIONS)).whoItsFor.cells[c.src];
  // Desktop separates the photograph, the tag pair and the body with real
  // space text nodes; the mobile cell has none of them.
  const gap = mob ? null : " ";
  const span =
    c.span === "row" ? { gridRow: "span 2" } : c.span === "col" ? { gridColumn: "span 2" } : {};
  /** Replaces the `dimNote` field, which is deleted. The caption on the factory
   *  cell was white at 40% because `/img/13-factory-floor.jpg`'s tint is dark
   *  (`#6E6C63`, relative luminance 0.1494) - a fact about the photograph, so it
   *  is keyed by photograph in `lib/img.ts` beside the tint itself. `dimNote`
   *  restated that fact as card data, where it could disagree with the picture,
   *  and its value was an `rgba()` literal that `hv/no-color-literal` could not
   *  see until it was extended past hex on 22 Sep 2026. Measured before the
   *  move: of these six images only the factory floor is dark enough to invert,
   *  so the rendered result is unchanged. */
  const noteColour = noteInk(c.src);
  return (
    <div className="cell ph" style={mob ? { background: tint(c.src) } : { ...span, background: tint(c.src) }}>
      {gap}
      <div className="light"></div>
      <Image
        className="pimg"
        src={c.src}
        alt=""
        fill
        sizes={c.span === "col" ? SIZES_BENTO_WIDE : SIZES_BENTO_NARROW}
      />
      {/* The placeholder label, shown only where there is no photograph:
          `design.css` has `.ph:has(.pimg) .note { display: none }` at BOTH
          breakpoints. So it is desktop-only markup by inheritance from the
          artboard rather than by design, and the mobile cell does not get one
          now that it has a picture. */}
      {!mob && (
        <div className="note" {...(noteColour !== undefined ? { style: { color: noteColour } } : {})}>
          {cell.note}
        </div>
      )}
      <div className="scrim"></div>
      {gap}
      <div className="tag">{mob && "mobTag" in cell ? cell.mobTag : cell.tag}</div>
      <div className="from">{cell.from}</div>
      {gap}
      <div className="body">
        <div className="h">{cell.h}</div>
      </div>
      {gap}
    </div>
  );
}

/** Each cell is preceded by a space and the run ends with one. The trailing
 *  space sits OUTSIDE the map: an array whose last child is a text node makes
 *  React emit a `<!-- -->` after it for hydration. */
function Bento({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {CELLS.map((c, i) => (
        <Fragment key={i}>
          {" "}
          <BentoCell c={c} mob={mob} />
        </Fragment>
      ))}{" "}
    </div>
  );
}

export async function WhoItsFor() {
  const t = (await copy(SECTIONS)).whoItsFor;

  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
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
          <Bento style={{ marginTop: "80px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gridAutoRows: "290px", gap: "20px" }} />
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          {/* No `sec-head` and no lede. The desktop block carries a paragraph
              this one has never had - accounted for, not assumed symmetrical. */}
          <h2 className="h2">{t.headingMob}</h2>
          {" "}
          <Bento mob style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }} />
          {" "}
        </div>
      </div>
    </>
  );
}

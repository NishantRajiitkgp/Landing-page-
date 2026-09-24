import { Fragment } from "react";
import Image from "next/image";

import { SIZES_BENTO_NARROW, SIZES_BENTO_WIDE, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type CellSrc } from "@/lib/copy/sections";

/** Who it is for - the audience bento. PHONE ONLY.
 *
 *  324 lines for six cells written twice. One record list now (BUILD-SPEC §4
 *  rule 2, §17 condition 22).
 *
 *  THE DESKTOP TREE IS GONE. Homepage v2 gave each audience its own desktop
 *  band (GovSeals/GovDossiers, Enterprises, Smb, Diligence, Consumer), and
 *  `app/[locale]/page.tsx` renders this component inside `.mob` only. The
 *  `.dsk` bento it still carried - a three-column grid with its own heading,
 *  lede, six photographs and six placeholder captions - went into the HTML
 *  and the flight payload on every load and was never shown at any width
 *  (Sep 2026 perf pass: 6.3 KB of markup). The copy only it read went with
 *  it; see `lib/copy/sections.en.tsx`.
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
 *  spanned two columns on the desktop bento took `SIZES_BENTO_WIDE`; both
 *  constants resolve to 90vw on the phone, so the span is kept only to pick
 *  the same `sizes` string (and so the same srcset request) as before. See
 *  `lib/img.ts`, which took those numbers off a CDP census.
 */

type Cell = {
  readonly src: CellSrc;
  /** The desktop bento shape, which now only selects `sizes`. */
  readonly span?: "row" | "col";
};

/** The order. Everything a reader sees - the tag, the `from` and the
 *  heading - is keyed by photograph in `lib/copy/sections`. */
const CELLS: readonly Cell[] = [
  { src: "/img/10-ministry-hall.jpg", span: "row" },
  { src: "/img/11-office-first-day.jpg", span: "col" },
  { src: "/img/12-phone-signup.jpg" },
  { src: "/img/13-factory-floor.jpg" },
  { src: "/img/14-visa-counter.jpg" },
  { src: "/img/15-home-doorway.jpg", span: "col" },
];

async function BentoCell({ c }: { c: Cell }) {
  const cell = (await copy(SECTIONS)).whoItsFor.cells[c.src];
  return (
    <div className="cell ph" style={{ background: tint(c.src) }}>
      <div className="light"></div>
      <Image
        className="pimg"
        src={c.src}
        alt=""
        fill
        sizes={c.span === "col" ? SIZES_BENTO_WIDE : SIZES_BENTO_NARROW}
      />
      <div className="scrim"></div>
      <div className="tag">{cell.tag}</div>
      <div className="from">{cell.from}</div>
      <div className="body">
        <div className="h">{cell.h}</div>
      </div>
    </div>
  );
}

/** Rendered by `app/[locale]/page.tsx` inside its own `.mob` wrapper.
 *
 *  Each cell is preceded by a space and the run ends with one. The trailing
 *  space sits OUTSIDE the map: an array whose last child is a text node makes
 *  React emit a `<!-- -->` after it for hydration. */
export async function WhoItsFor() {
  const t = (await copy(SECTIONS)).whoItsFor;

  return (
    <div className="wrap sec hair-top">
      {" "}
      {/* No `sec-head` and no lede: the phone board never had either. */}
      <h2 className="h2">{t.headingMob}</h2>
      {" "}
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {CELLS.map((c, i) => (
          <Fragment key={i}>
            {" "}
            <BentoCell c={c} />
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

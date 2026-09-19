import type { ReactNode } from "react";
import { Fragment } from "react";
import Image from "next/image";

import { SIZES_BENTO_NARROW, SIZES_BENTO_WIDE, tint } from "@/lib/img";

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
  readonly src: string;
  readonly note: string;
  /** The one caption drawn at 40% white rather than the default. */
  readonly dimNote?: boolean;
  readonly tag: ReactNode;
  /** Mobile's shorter tag, where it has one. */
  readonly mobTag?: ReactNode;
  readonly from: string;
  readonly h: ReactNode;
  /** Desktop's bento shape. Mobile is a single column and ignores it. */
  readonly span?: "row" | "col";
};

const CELLS: readonly Cell[] = [
  {
    src: "/img/10-ministry-hall.jpg",
    note: "photo · ministry hall",
    tag: <>Governments{" "}&amp;{" "}authorities</>,
    mobTag: "Governments",
    from: "from 3 days",
    h: (
      <>
        Licences, visas
        <br />
        and permits
      </>
    ),
    span: "row",
  },
  {
    src: "/img/11-office-first-day.jpg",
    note: "photo · office, first day",
    tag: <>Enterprise{" "}&amp;{" "}SMB · BGV</>,
    from: "from 30 min",
    h: "Every hire, white-collar and blue",
    span: "col",
  },
  {
    src: "/img/12-phone-signup.jpg",
    note: "photo · phone, signup",
    tag: <>KYC · Trust{" "}&amp;{" "}Safety</>,
    from: "15 min",
    h: "Customers, verified at signup",
  },
  {
    src: "/img/13-factory-floor.jpg",
    note: "photo · factory floor",
    dimNote: true,
    tag: "Vendors · Certifier",
    from: "from 2 days",
    h: "Know who you buy from",
  },
  {
    src: "/img/14-visa-counter.jpg",
    note: "photo · visa counter",
    tag: "Premium services",
    from: "assisted",
    h: "Visas and healthcare credentials",
  },
  {
    src: "/img/15-home-doorway.jpg",
    note: "photo · home, doorway",
    tag: "Consumer · HelloV",
    from: "30 min",
    h: "The people in your home",
    span: "col",
  },
];

function BentoCell({ c, mob = false }: { c: Cell; mob?: boolean }) {
  // Desktop separates the photograph, the tag pair and the body with real
  // space text nodes; the mobile cell has none of them.
  const gap = mob ? null : " ";
  const span =
    c.span === "row" ? { gridRow: "span 2" } : c.span === "col" ? { gridColumn: "span 2" } : {};
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
        <div className="note" {...(c.dimNote ? { style: { color: "rgba(255,255,255,0.4)" } } : {})}>
          {c.note}
        </div>
      )}
      <div className="scrim"></div>
      {gap}
      <div className="tag">{mob && c.mobTag !== undefined ? c.mobTag : c.tag}</div>
      <div className="from">{c.from}</div>
      {gap}
      <div className="body">
        <div className="h">{c.h}</div>
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

export function WhoItsFor() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div className="sec-head">
            {" "}
            <h2 className="h2">
              For the moment you
              <br />
              need to trust someone.
            </h2>
            {" "}
            <p className="lede" style={{ marginBottom: "8px" }}>
              A health ministry licensing ten thousand nurses and a family hiring one nanny need the same thing: a real answer, quickly. Same platform, different door.
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
          <h2 className="h2">For the moment you need to trust someone.</h2>
          {" "}
          <Bento mob style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }} />
          {" "}
        </div>
      </div>
    </>
  );
}

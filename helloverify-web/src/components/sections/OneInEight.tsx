/** The fraud band (homepage v2, Sep 2026; canvas sheet 03), once "1 in 8".

    Eight synthetic document scans from seven countries on an evidence table,
    every one forged, each with a different trick: a swapped name, pen
    strokes, correction fluid, a printed seal, a degree-mill sticker, a
    scraped mark, a tape-lifted year, a traced signature. A UV lamp follows
    the pointer and shows each sheet under 365 nm, where each trick shows
    its own way. Clicking a document flags it and opens its case file with
    the findings drawn on the sheet.

    One tree at every width: the canvas has no phone artboard for it, so the
    phone layout is the same table reflowed to two columns (`app/v2/fraud.css`).
    The heading and footnote are static and rendered here; everything that
    shares state — the table, its status line, the reveal button — is the
    `./OneInEightTable` island. */
import { copy } from "@/lib/copy/request";
import { SECTIONS } from "@/lib/copy/sections";
// One sheet per v2 section (see the header of `app/v2/hero.css`).
import "@/app/v2/fraud.css";
import { OneInEightTable } from "./OneInEightTable";

export async function OneInEight() {
  const t = (await copy(SECTIONS)).oneInEight;

  return (
    <div className="wrap hair-top ff">
      <div className="ff-mast">
        <span className="k">{t.sheet}</span>
        <span className="ff-flag">{t.flag}</span>
      </div>
      <div className="sec-head" style={{ marginTop: "22px" }}>
        <h2 className="h2">
          <em className="ff-one">{t.headingEm}</em> {t.heading}
        </h2>
        <p className="lede" style={{ marginBottom: "8px" }}>
          {t.lede}
          <sup className="ff-sup">{t.fn}</sup>
        </p>
      </div>
      <OneInEightTable t={t} />
      <p className="ff-fn">
        <sup>{t.fn}</sup> {t.footnote}
      </p>
    </div>
  );
}

/** One in eight — the fraud band (homepage v2, Sep 2026; canvas sheet 03).

    Eight synthetic certificates on an evidence table, one of them forged. A
    UV lamp follows the pointer and shows the security features the genuine
    seven carry and the forgery lacks; clicking a certificate checks it, and
    the forgery is referred.

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
          <sup className="ff-sup">{t.fn}</sup>
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

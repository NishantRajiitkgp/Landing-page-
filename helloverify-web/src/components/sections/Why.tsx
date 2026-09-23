import { Fragment } from "react";
import Image from "next/image";

import { SIZES_WHY, noteInk, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type WhyEvidenceId, type WhyReasonId } from "@/lib/copy/sections";

/** Why governments work with us.
 *
 *  328 lines for five reasons and one evidence card, each written out once per
 *  breakpoint. One list now, and one card component (BUILD-SPEC §4 rule 2,
 *  §17 condition 22).
 *
 *  Everything is shared: the five reasons matched field for field between the
 *  copies, and so did all fourteen strings in the evidence card. What differs
 *  is geometry only - the mobile photograph is a fixed 520px tall and its
 *  evidence card is inset to the edges instead of sized by the artboard.
 *
 *  The reason rows are separated differently at the two breakpoints, which is
 *  output and not formatting: desktop puts a space text node before the first
 *  row and after the last, mobile only between them.
 */

/** The five reasons, in order. The numeral is the ordinal the card prints AND
 *  the React key, so it stays here and doubles as the dictionary key - it is
 *  position, not words. The two lines of words are in `lib/copy/sections`. */
const REASONS: readonly WhyReasonId[] = ["01", "02", "03", "04", "05"];

/** The four lines under "One result, and how we know", in order. The label is
 *  still the React key, and it still resolves to the same English string -
 *  third corollary of the byte-identity rule in `lib/copy`'s header. */
const EVIDENCE: readonly WhyEvidenceId[] = ["read", "confirmed", "artefact", "reviewed"];

const PHOTO = "/img/09-licensing-officer.jpg";

async function Reasons({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  const t = (await copy(SECTIONS)).why;

  return (
    <div style={style}>
      {REASONS.map((n, i) => (
        <Fragment key={n}>
          {(!mob || i > 0) && " "}
          <div className="rz">
            <span className="n">{n}</span>
            <div>
              <div className="t">{t.reasons[n].t}</div>
              <div className="p">{t.reasons[n].p}</div>
            </div>
          </div>
        </Fragment>
      ))}
      {!mob && " "}
    </div>
  );
}

async function WhyCard({ mob }: { mob?: boolean }) {
  const t = (await copy(SECTIONS)).why;

  return (
    <div
      className="whyv ph"
      style={mob ? { background: tint(PHOTO), height: "520px" } : { background: tint(PHOTO) }}
    >
      {" "}
      <div className="light"></div>
      <Image className="pimg" src={PHOTO} alt="" fill sizes={SIZES_WHY} />
      {/* The caption is inverted because THIS photograph's tint is dark
          (`#8C8C7A`, relative luminance 0.2574) - a per-photograph fact, so it
          sits beside the tint in `lib/img.ts` rather than as a literal here.
          The literal was one of six `rgba()` values that `hv/no-color-literal`
          could not see before 22 Sep 2026. */}
      <div className="note" style={{ top: "18%", color: noteInk(PHOTO) }}>
        {t.card.note}
      </div>
      {" "}
      <div className="scrim" style={{ height: "70%" }}></div>
      {" "}
      <div
        className="evcard"
        {...(mob
          ? { style: { insetInlineStart: "16px", insetInlineEnd: "16px", bottom: "16px", width: "auto" } }
          : {})}
      >
        {" "}
        <div className="sealsm">
          <span>{t.card.seal}</span>
        </div>
        {" "}
        <div className="k">{t.card.k}</div>
        {" "}
        <div className="serif" style={{ margin: "8px 80px 12px 0", fontSize: "22px", lineHeight: "1.05" }}>
          {t.card.title}
        </div>
        {EVIDENCE.map((k) => (
          <Fragment key={t.evidence[k].label}>
            {" "}
            <div className="r">
              <span>{t.evidence[k].label}</span>
              <span>{t.evidence[k].value}</span>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

export async function Why() {
  const t = (await copy(SECTIONS)).why;

  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)", gap: "80px", alignItems: "center" }}>
            {" "}
            <div>
              {" "}
              <h2 className="h2" style={{ fontSize: "56px" }}>
                {t.heading}
              </h2>
              {" "}
              <p className="lede" style={{ marginTop: "22px", maxWidth: "400px" }}>
                {t.lede}
              </p>
              {" "}
              <Reasons style={{ marginTop: "36px" }} />
              {" "}
            </div>
            {" "}
            <WhyCard />
            {" "}
          </div>
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">{t.heading}</h2>
          {" "}
          <p className="lede">
            {t.lede}
          </p>
          {" "}
          <Reasons mob style={{ marginTop: "24px" }} />
          {" "}
          {/* The mobile card carries its own top margin on a wrapper, where the
              desktop card is a grid column. */}
          <div style={{ marginTop: "28px" }}>
            <WhyCard mob />
          </div>
          {" "}
        </div>
      </div>
    </>
  );
}

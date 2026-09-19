import { Fragment } from "react";
import Image from "next/image";

import { SIZES_WHY, tint } from "@/lib/img";

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

const REASONS: readonly (readonly [string, string, string])[] = [
  ["01", "Primary source, at national scale", "Confirmed with the issuer — never a proxy database."],
  ["02", "One platform, public and private", "People, businesses, suppliers and institutions."],
  ["03", "Proven with governments", "India, Saudi Arabia, the UAE, Singapore, European workflows."],
  ["04", "Built to last", "Infrastructure regulators rely on for years, not a project."],
  ["05", "Evidence, not opinion", "Remarks, artefacts and an auditable trail with every result."],
];

/** The four lines under "One result, and how we know" - label, then value. */
const EVIDENCE: readonly (readonly [string, string])[] = [
  ["Read by", "HelloVerify AI · 14 fields · 1.2 s"],
  ["Confirmed", "RTO Karnataka · 10:08"],
  ["Artefact", "Sarathi record · PDF · hashed"],
  ["Reviewed", "K.S. · audit trail, 5 events"],
];

const PHOTO = "/img/09-licensing-officer.jpg";

function Reasons({ mob, style }: { mob?: boolean; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {REASONS.map(([n, t, p], i) => (
        <Fragment key={n}>
          {(!mob || i > 0) && " "}
          <div className="rz">
            <span className="n">{n}</span>
            <div>
              <div className="t">{t}</div>
              <div className="p">{p}</div>
            </div>
          </div>
        </Fragment>
      ))}
      {!mob && " "}
    </div>
  );
}

function WhyCard({ mob }: { mob?: boolean }) {
  return (
    <div
      className="whyv ph"
      style={mob ? { background: tint(PHOTO), height: "520px" } : { background: tint(PHOTO) }}
    >
      {" "}
      <div className="light"></div>
      <Image className="pimg" src={PHOTO} alt="" fill sizes={SIZES_WHY} />
      <div className="note" style={{ top: "18%", color: "rgba(255,255,255,0.4)" }}>
        photo · licensing officer at a counter, natural light
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
          <span>Verified</span>
        </div>
        {" "}
        <div className="k">One result, and how we know</div>
        {" "}
        <div className="serif" style={{ margin: "8px 80px 12px 0", fontSize: "22px", lineHeight: "1.05" }}>
          Driving licence
        </div>
        {EVIDENCE.map(([label, value]) => (
          <Fragment key={label}>
            {" "}
            <div className="r">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

export function Why() {
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
                Why governments work with us.
              </h2>
              {" "}
              <p className="lede" style={{ marginTop: "22px", maxWidth: "400px" }}>
                A ministry isn't buying reports. It's buying the trust layer under every permit, licence and clearance.
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
          <h2 className="h2">Why governments work with us.</h2>
          {" "}
          <p className="lede">
            A ministry isn't buying reports. It's buying the trust layer under every permit, licence and clearance.
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

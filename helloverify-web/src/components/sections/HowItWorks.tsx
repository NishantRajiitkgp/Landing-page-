import { Fragment } from "react";

import { PANELS } from "@/components/blocks/HowItWorksPanels";

/** How a verification runs, end to end.
 *
 *  910 lines, of which 321 were a second copy of the four animated panels -
 *  byte-identical to the first, compared line by line. They now live in
 *  `blocks/HowItWorksPanels.tsx` and are rendered once per breakpoint from one
 *  list (BUILD-SPEC §4 rule 2, §17 condition 22).
 *
 *  The four step names were written THREE times each: the desktop track label,
 *  the mobile track label, and the caption card under the desktop stage. They
 *  are one field now, and the caption's number is derived from the position
 *  rather than stored, because 01-04 followed the order in every copy.
 *
 *  The two breakpoints draw genuinely different furniture around the same four
 *  steps - desktop lays them along a horizontal `.stage` with absolute
 *  positions, mobile stacks them down a `.vstage` with none, and only desktop
 *  carries the caption cards. So the positions are a desktop-only field and the
 *  captions a desktop-only block; neither is invented for mobile.
 */

type Step = {
  readonly label: string;
  readonly sub: string;
  /** Desktop only: where the node sits on the horizontal track. */
  readonly at: string;
  /** Desktop only: the caption card's paragraph under the stage. */
  readonly cap: string;
};

const STEPS: readonly Step[] = [
  {
    label: "Upload",
    sub: "09:40 · candidate's phone",
    at: "14.25%",
    cap: "Photograph the document. Edges, glare and focus are checked before the shutter fires.",
  },
  {
    label: "Read",
    sub: "1.2 s · HelloVerify AI",
    at: "38.08%",
    cap: "AI captures every field, checks the document against itself, and finds the office that issued it.",
  },
  {
    label: "Confirm",
    sub: "RTO Karnataka · the source",
    at: "61.9%",
    cap: "The request goes to the issuer. For a degree, that means the registrar — not a website that looks like one.",
  },
  {
    label: "Report",
    sub: "10:10 · shared with HR",
    at: "85.75%",
    cap: "One report, with the source named beside every result.",
  },
];

/** The clock above the track. Mobile sets it static and lets the rule stretch;
 *  the times either side are the same. */
function Clock({ mob }: { mob?: boolean }) {
  return (
    <div className="clock" {...(mob ? { style: { position: "static", marginTop: "24px" } } : {})}>
      <span>09:40</span>
      <span className="tr" {...(mob ? { style: { flex: "1" } } : {})}>
        <i></i>
      </span>
      <span>10:10</span>
    </div>
  );
}

export function HowItWorks() {
  return (
    <>
      <div className="dsk">
        <div className="wrap hair-top" style={{ paddingTop: "120px", paddingBottom: "140px" }}>
          {" "}
          <div className="sec-head">
            {" "}
            <h2 className="h2">
              One upload.
              <br />
              Then we get to work.
            </h2>
            {" "}
            <p className="lede" style={{ marginBottom: "8px" }}>
              A driving licence in Bengaluru, start to finish. Thirty minutes, on loop.
            </p>
            {" "}
          </div>
          {" "}
          <div className="stage" style={{ marginTop: "72px" }}>
            {" "}
            <Clock />
            {" "}
            <div className="strack"></div>
            {" "}
            <div className="trail"></div>
            {" "}
            <div className="pk"></div>
            {" "}
            {STEPS.map((s, i) => (
              <Fragment key={s.label}>
                <div className="node" style={{ insetInlineStart: s.at, animationName: `node${i}` }}></div>
                {" "}
              </Fragment>
            ))}
            {STEPS.map((s) => (
              <Fragment key={s.label}>
                <div className="stlbl" style={{ insetInlineStart: s.at }}>
                  <b>{s.label}</b>
                  <span>{s.sub}</span>
                </div>
                {" "}
              </Fragment>
            ))}
            <div className="panels">
              {PANELS.map((Panel, i) => (
                <Fragment key={i}>
                  {" "}
                  <Panel />
                </Fragment>
              ))}{" "}
            </div>
            {" "}
          </div>
          {" "}
          {/* Outside the repeated run, and desktop only: the mobile block ends
              at the last panel and has no caption cards at all. */}
          <div style={{ marginTop: "48px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "40px" }}>
            {STEPS.map((s, i) => (
              <Fragment key={s.label}>
                {" "}
                <div className="cap">
                  {/* 01-04, derived: the caption order matched the track order
                      in every copy, so a stored number would only be somewhere
                      for the two to disagree. */}
                  <div className="n">{`0${i + 1}`}</div>
                  <div className="t">{s.label}</div>
                  <p className="p">{s.cap}</p>
                </div>
              </Fragment>
            ))}{" "}
          </div>
          {" "}
        </div>
      </div>
      <div className="mob">
        <div className="wrap sec hair-top">
          {" "}
          <h2 className="h2">One upload. Then we get to work.</h2>
          {" "}
          <p className="lede">
            A driving licence in Bengaluru, start to finish. Thirty minutes, on loop.
          </p>
          {" "}
          <Clock mob />
          {" "}
          <div className="vstage">
            {" "}
            <div className="vrail"></div>
            <div className="vtrail"></div>
            <div className="vpk"></div>
            {STEPS.map((s, i) => {
              const Panel = PANELS[i];
              return (
                <Fragment key={s.label}>
                  {" "}
                  <div className="stn2">
                    {" "}
                    <div className="node" style={{ animationName: `node${i}` }}></div>
                    {" "}
                    <div className="stlbl2">
                      <b>{s.label}</b>
                      <span>{s.sub}</span>
                    </div>
                    {" "}
                    <Panel />
                    {" "}
                  </div>
                </Fragment>
              );
            })}{" "}
          </div>
          {" "}
        </div>
      </div>
    </>
  );
}

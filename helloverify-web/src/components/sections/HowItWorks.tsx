import { Fragment } from "react";

import { PANELS } from "@/components/blocks/HowItWorksPanels";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type StepId } from "@/lib/copy/sections";

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
  readonly k: StepId;
  /** Desktop only: where the node sits on the horizontal track. */
  readonly at: string;
};

/** The order, and the only field that is not words. The label, the `sub` and
 *  the desktop caption are `lib/copy/sections`' `howItWorks.steps`, keyed by
 *  the same four ids - which is what now holds the three places a step name
 *  is rendered to one string. */
const STEPS: readonly Step[] = [
  { k: "upload", at: "14.25%" },
  { k: "read", at: "38.08%" },
  { k: "confirm", at: "61.9%" },
  { k: "report", at: "85.75%" },
];

/** The clock above the track. Mobile sets it static and lets the rule stretch;
 *  the times either side are the same. */
async function Clock({ mob }: { mob?: boolean }) {
  const t = (await copy(SECTIONS)).howItWorks;

  return (
    <div className="clock" {...(mob ? { style: { position: "static", marginTop: "24px" } } : {})}>
      <span>{t.clock.start}</span>
      <span className="tr" {...(mob ? { style: { flex: "1" } } : {})}>
        <i></i>
      </span>
      <span>{t.clock.end}</span>
    </div>
  );
}

export async function HowItWorks() {
  const t = (await copy(SECTIONS)).howItWorks;

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
              <Fragment key={t.steps[s.k].label}>
                <div className="node" style={{ insetInlineStart: s.at, animationName: `node${i}` }}></div>
                {" "}
              </Fragment>
            ))}
            {STEPS.map((s) => (
              <Fragment key={t.steps[s.k].label}>
                <div className="stlbl" style={{ insetInlineStart: s.at }}>
                  <b>{t.steps[s.k].label}</b>
                  <span>{t.steps[s.k].sub}</span>
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
              <Fragment key={t.steps[s.k].label}>
                {" "}
                <div className="cap">
                  {/* 01-04, derived: the caption order matched the track order
                      in every copy, so a stored number would only be somewhere
                      for the two to disagree. */}
                  <div className="n">{`0${i + 1}`}</div>
                  <div className="t">{t.steps[s.k].label}</div>
                  <p className="p">{t.steps[s.k].cap}</p>
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
          <h2 className="h2">{t.headingMob}</h2>
          {" "}
          <p className="lede">
            {t.lede}
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
                <Fragment key={t.steps[s.k].label}>
                  {" "}
                  <div className="stn2">
                    {" "}
                    <div className="node" style={{ animationName: `node${i}` }}></div>
                    {" "}
                    <div className="stlbl2">
                      <b>{t.steps[s.k].label}</b>
                      <span>{t.steps[s.k].sub}</span>
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

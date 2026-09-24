import { Fragment } from "react";

import { PANELS } from "@/components/blocks/HowItWorksPanels";
import { copy } from "@/lib/copy/request";
import { SECTIONS, type StepId } from "@/lib/copy/sections";

/** How a verification runs, end to end. PHONE ONLY.
 *
 *  910 lines, of which 321 were a second copy of the four animated panels -
 *  byte-identical to the first, compared line by line. They now live in
 *  `blocks/HowItWorksPanels.tsx` (BUILD-SPEC §4 rule 2, §17 condition 22).
 *
 *  THE DESKTOP TREE IS GONE. Homepage v2 folded this band into
 *  `HowWeKnow.tsx` (sheet 04), which reuses `howItWorks.headingA`/`headingB`
 *  and every `steps.*.cap` verbatim, and `app/[locale]/page.tsx` renders this
 *  component inside `.mob` only. The `.dsk` tree it still carried - the
 *  horizontal `.stage`, the node positions and the caption cards - was
 *  emitted into the HTML and the flight payload on every load and never
 *  shown at any width (Sep 2026 perf pass: 10.6 KB of markup). What remains
 *  is the phone's `.vstage`, which stacks the four steps with a panel each.
 */

/** The order. The label and the `sub` are `lib/copy/sections`'
 *  `howItWorks.steps`, keyed by the same four ids. */
const STEPS: readonly StepId[] = ["upload", "read", "confirm", "report"];

/** The clock above the track: static, with the rule stretched between the
 *  two times. */
async function Clock() {
  const t = (await copy(SECTIONS)).howItWorks;

  return (
    <div className="clock" style={{ position: "static", marginTop: "24px" }}>
      <span>{t.clock.start}</span>
      <span className="tr" style={{ flex: "1" }}>
        <i></i>
      </span>
      <span>{t.clock.end}</span>
    </div>
  );
}

/** Rendered by `app/[locale]/page.tsx` inside its own `.mob` wrapper. */
export async function HowItWorks() {
  const t = (await copy(SECTIONS)).howItWorks;

  return (
    <div className="wrap sec hair-top">
      {" "}
      <h2 className="h2">{t.headingMob}</h2>
      {" "}
      <p className="lede">
        {t.lede}
      </p>
      {" "}
      <Clock />
      {" "}
      <div className="vstage">
        {" "}
        <div className="vrail"></div>
        <div className="vtrail"></div>
        <div className="vpk"></div>
        {STEPS.map((k, i) => {
          const Panel = PANELS[i];
          return (
            <Fragment key={t.steps[k].label}>
              {" "}
              <div className="stn2">
                {" "}
                <div className="node" style={{ animationName: `node${i}` }}></div>
                {" "}
                <div className="stlbl2">
                  <b>{t.steps[k].label}</b>
                  <span>{t.steps[k].sub}</span>
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
  );
}

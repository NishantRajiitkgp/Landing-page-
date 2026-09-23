import { Fragment } from "react";
import Image from "next/image";

import { SIZES_AVATAR, tint } from "@/lib/img";
import { copy } from "@/lib/copy/request";
import {
  BLOCKS,
  type ConfirmEventId,
  type DocCheckId,
  type ReadFieldId,
  type ReportRowId,
} from "@/lib/copy/blocks";
import { EASE, Licence, PanelTick } from "@/components/blocks/PanelParts";

/** The four scenes of the homepage process animation, lifted out of
 *  `sections/HowItWorks.tsx`.
 *
 *  They were written out twice there, once per breakpoint, and the two copies
 *  were byte-identical - 321 lines each, compared line by line rather than by
 *  eye. They live here so `HowItWorks.tsx` can render the same four at both
 *  breakpoints and stay under 300 lines (BUILD-SPEC §4 rule 2, §17
 *  condition 22).
 *
 *  `blocks/PanelParts.tsx` holds what all four share - the loop, the tick and
 *  the licence card - and holds the paragraphs that explained them. Split out
 *  23 Sep 2026 because this file stood at 299 of the 300 lines
 *  `eslint.config.mjs` allows, which cannot absorb the copy layer's three
 *  lines. The seam was measured (`scratchpad/scene_fanout_5bd3.py`): `EASE`
 *  and `PanelTick` are referenced by 4 of the 4 scenes and `Licence` by 2,
 *  while every record list left here is referenced by exactly 1.
 *
 *  REJECTED - folding the two `className="who"` headers into one component.
 *  Diffed rather than eyeballed: 4 of their 11 lines match and all four are a
 *  bare `<div>` or `</div>` - one carries a seal drawn in SVG, the other a
 *  photograph with its tint and its `sizes`. Part 5's rule is to check the
 *  halves before collapsing them. It would buy ~10 lines that are no longer
 *  needed, at the cost of building a new component out of inline JSX, which
 *  is the one shape here that can move a separator.
 */

async function UploadPanel() {
  const t = (await copy(BLOCKS)).panels;
  return (
    <div className="panel">
      {" "}
      <div className="viewf">
        {" "}
        <Licence className="lic big" style={{ animation: `flat ${EASE}` }} />
        {" "}
        <div className="corners">
          {["c1", "c2", "c3", "c4"].map((c) => (
            <i className={c} key={c}></i>
          ))}
        </div>
        {" "}
        <div className="flash"></div>
        {" "}
      </div>
      {" "}
      <div className="chipline" style={{ animation: `r_cap ${EASE}` }}>
        <span className="chipok">
          <PanelTick anim="t_cap" size="12px" onChip />
          {t.upload.captured}
        </span>
        <span className="mono" style={{ color: "var(--muted)" }}>
          {t.upload.quality}
        </span>
      </div>
      {" "}
    </div>
  );
}

/** The fields the reader lifts off the licence. `steps(n)` is the typewriter
 *  length and is per-field, so it is stored rather than derived from the text -
 *  "A. RAMESH" is 9 characters and types in 9 steps, but "KA05 •••• 4812" is 14
 *  characters and types in 14 while "LMV · MCWG" is 10 and types in 10, which
 *  only holds because the bullets and the middot each count as one. Storing it
 *  keeps that coincidence from becoming a rule. */
const FIELDS: readonly (readonly [ReadFieldId, string, number])[] = [
  ["name", "tw1", 9],
  ["licence", "tw2", 14],
  ["vehicleClass", "tw3", 10],
  ["valid", "tw4", 14],
];

/** What the reader confirms about the document itself, in order. The label
 *  and the value are `lib/copy/blocks`' `panels.read.checks`; `c1`'s label is
 *  still a `ReactNode` there, split around the `&amp;` as the exporter wrote
 *  it. */
const DOC_CHECKS: readonly DocCheckId[] = ["c1", "c2", "c3"];

async function ReadPanel() {
  const t = (await copy(BLOCKS)).panels;
  return (
    <div className="panel">
      {" "}
      <div className="scanwrap">
        <Licence className="lic small" />
        <div className="beam"></div>
      </div>
      {" "}
      <div className="flds">
        {FIELDS.map(([f, anim, steps]) => (
          <Fragment key={anim}>
            {" "}
            <div className="fld">
              <span className="l">{t.read.fields[f].l}</span>
              <span className="v tw" style={{ animation: `${anim} 12.0s steps(${steps}) infinite` }}>
                {t.read.fields[f].v}
              </span>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
      <div className="chks">
        {DOC_CHECKS.map((id) => (
          <Fragment key={id}>
            {" "}
            <div className="chk" style={{ animation: `r_${id} ${EASE}` }}>
              <PanelTick anim={`t_${id}`} size="14px" />
              <span>{t.read.checks[id].l}</span>
              <b>{t.read.checks[id].v}</b>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

/** The two events in the confirmation log. The second carries `ok`. */
const EVENTS: readonly (readonly [ConfirmEventId, boolean])[] = [
  ["e1", false],
  ["e2", true],
];

async function ConfirmPanel() {
  const t = (await copy(BLOCKS)).panels;
  return (
    <div className="panel">
      {" "}
      <div className="who" style={{ animation: `r_who ${EASE}` }}>
        <div className="seal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke="#15140F" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="n">{t.confirm.office}</div>
          <div className="s">{t.confirm.officeSub}</div>
        </div>
      </div>
      {" "}
      <div className="ringwrap">
        {" "}
        <svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#E3DFD6" strokeWidth="2"></circle>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#CFCAC0"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="100"
            transform="rotate(-90 50 50)"
            style={{ strokeDasharray: "100", strokeDashoffset: "100", animation: "ring 12.0s linear infinite, ringdone 12.0s linear infinite" }}
          ></circle>
        </svg>
        {" "}
        <div className="rc-in">
          <span className="wait" style={{ animation: "waiting 12.0s linear infinite" }}>
            {t.confirm.waitingA}
            <br />
            {t.confirm.waitingB}
          </span>
          <PanelTick anim="t_rto" size="30px" />
        </div>
        {" "}
      </div>
      {" "}
      <div className="evs">
        {EVENTS.map(([id, ok]) => (
          <Fragment key={id}>
            {" "}
            <div className={ok ? "ev ok" : "ev"} style={{ animation: `r_${id} ${EASE}` }}>
              <span className="ts">{t.confirm.events[id].ts}</span>
              <span>{t.confirm.events[id].text}</span>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

/** The finished report. These four times are the animation's own story and are
 *  NOT the catalogue in `lib/content/checks.ts` - see the turnaround
 *  disagreement carried in TASKS.md before reconciling them. */
const REPORT_ROWS: readonly ReportRowId[] = ["r1", "r2", "r3", "r4"];

async function ReportPanel() {
  const t = (await copy(BLOCKS)).panels;
  return (
    <div className="panel">
      {" "}
      <div className="who" style={{ animation: `r_rep ${EASE}` }}>
        <div className="ph av" style={{ background: tint("/img/21-portrait-ramesh.jpg") }}>
          <div className="light"></div>
          <Image className="pimg" src="/img/21-portrait-ramesh.jpg" alt="" fill sizes={SIZES_AVATAR} />
        </div>
        <div>
          <div className="n">{t.report.person}</div>
          <div className="s">{t.report.personSub}</div>
        </div>
      </div>
      {" "}
      <div className="rows">
        {REPORT_ROWS.map((id) => (
          <Fragment key={id}>
            {" "}
            <div className="row" style={{ animation: `r_${id} ${EASE}` }}>
              <span>{t.report.rows[id].n}</span>
              <span className="t">{t.report.rows[id].t}</span>
              <PanelTick anim={`t_${id}`} size="14px" />
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
      <div className="foot" style={{ animation: `r_foot ${EASE}` }}>
        {t.report.foot}
      </div>
      {" "}
      <div className="sealglow"></div>
      {" "}
      <div className="vseal">
        <span>{t.report.seal}</span>
      </div>
      {" "}
    </div>
  );
}

/** In step order: Upload, Read, Confirm, Report. */
export const PANELS = [UploadPanel, ReadPanel, ConfirmPanel, ReportPanel] as const;

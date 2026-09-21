import { Fragment } from "react";
import Image from "next/image";

import { SIZES_AVATAR, tint } from "@/lib/img";

/** The four scenes of the homepage process animation, lifted out of
 *  `sections/HowItWorks.tsx`.
 *
 *  They were written out twice there, once per breakpoint, and the two copies
 *  were byte-identical - 321 lines each, compared line by line rather than by
 *  eye. They live here so `HowItWorks.tsx` can render the same four at both
 *  breakpoints and stay under 300 lines (BUILD-SPEC §4 rule 2, §17
 *  condition 22).
 *
 *  Every animation on this page runs on the same 12-second loop with the same
 *  easing; only the keyframe name differs. `EASE` states that once - measured
 *  across all 22 animated elements, none of which disagreed.
 *
 *  `PanelTick` settles the open question TASKS.md carried about these: the 18
 *  inline ticks differ ONLY in their keyframe name and their box, never in the
 *  path, the stroke width, the dash array or the `pathLength`. So one component
 *  taking a name reproduces all of them exactly - it is a structural change,
 *  not a change of values, which is why it could be proved byte-identical.
 *
 *  The two colour literals stay: they are the artwork's own ink, drawn on a
 *  filled chip and on paper respectively, and the artboards set them as SVG
 *  presentation attributes rather than through a class. That is the same
 *  exemption `sections/International.tsx`'s flags hold.
 */

/** Every loop on this page: 12 seconds, the artboards' easing, forever. */
const EASE = "12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite";

/** Everything the tick's path carries except its colour and its keyframe.
 *  Spread rather than repeated, and spread in this position so the emitted
 *  attribute order still reads `d stroke strokeWidth … pathLength style`. */
const TICK_PEN = { strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", pathLength: "24" } as const;
const TICK_D = "M3.5 8.5l3 3 6-7";

/** The drawn-on tick. `anim` is the keyframe name, `size` the box it is set in
 *  - 12px on the capture chip, 14px in the lists, 30px inside the ring.
 *
 *  THE TWO COLOURS ARE BRANCHED AS WHOLE `<path>`s, not as `stroke={c ? a : b}`.
 *  `hv/no-color-literal` exempts a literal only when the JSX attribute is its
 *  direct parent - deliberately, so UI colour cannot hide one expression deep
 *  inside an SVG - and a ternary is exactly that one expression. The rule is
 *  right and this bends to it; widening the exemption to accommodate the first
 *  file that trips it is how a rule rots. Nothing is duplicated but the word
 *  `stroke`: the pen and the path are shared above. */
function PanelTick({ anim, size, onChip }: { anim: string; size: string; onChip?: boolean }) {
  const draw = { strokeDasharray: "24", strokeDashoffset: "24", animation: `${anim} ${EASE}` };
  return (
    <svg className="tick" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: size, height: size }}>
      {onChip ? (
        <path d={TICK_D} stroke="#FFFFFF" {...TICK_PEN} style={draw} />
      ) : (
        <path d={TICK_D} stroke="#1B6B4A" {...TICK_PEN} style={draw} />
      )}
    </svg>
  );
}

/** The licence card, drawn twice here - large and flat in the viewfinder,
 *  small under the scanner beam. The inner markup was identical in both. */
function Licence({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div className={className} {...(style ? { style } : {})}>
      <span className="lt">Driving licence</span>
      <span className="lr">IND</span>
      <div className="face"></div>
      <div className="ln1"></div>
      <div className="ln2"></div>
      <div className="ln3"></div>
      <div className="ln4"></div>
      <div className="holo"></div>
    </div>
  );
}

function UploadPanel() {
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
          Captured
        </span>
        <span className="mono" style={{ color: "var(--muted)" }}>
          sharp · no glare · all edges
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
const FIELDS: readonly (readonly [string, string, string, number])[] = [
  ["Name", "A. RAMESH", "tw1", 9],
  ["Licence", "KA05 •••• 4812", "tw2", 14],
  ["Class", "LMV · MCWG", "tw3", 10],
  ["Valid till", "13 · 03 · 2039", "tw4", 14],
];

/** What the reader confirms about the document itself. */
const DOC_CHECKS: readonly (readonly [string, React.ReactNode, string])[] = [
  ["c1", <>Template{" "}&amp;{" "}fonts</>, "match"],
  ["c2", "Face vs. selfie", "98%"],
  ["c3", "Issuer", "RTO Karnataka"],
];

function ReadPanel() {
  return (
    <div className="panel">
      {" "}
      <div className="scanwrap">
        <Licence className="lic small" />
        <div className="beam"></div>
      </div>
      {" "}
      <div className="flds">
        {FIELDS.map(([label, value, anim, steps]) => (
          <Fragment key={anim}>
            {" "}
            <div className="fld">
              <span className="l">{label}</span>
              <span className="v tw" style={{ animation: `${anim} 12.0s steps(${steps}) infinite` }}>
                {value}
              </span>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
      <div className="chks">
        {DOC_CHECKS.map(([id, label, value]) => (
          <Fragment key={id}>
            {" "}
            <div className="chk" style={{ animation: `r_${id} ${EASE}` }}>
              <PanelTick anim={`t_${id}`} size="14px" />
              <span>{label}</span>
              <b>{value}</b>
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
    </div>
  );
}

/** The two events in the confirmation log. The second carries `ok`. */
const EVENTS: readonly (readonly [string, string, string, boolean])[] = [
  ["e1", "09:41", "Request filed with the issuing office", false],
  ["e2", "10:08", "Record matched · licence valid", true],
];

function ConfirmPanel() {
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
          <div className="n">Regional Transport Office</div>
          <div className="s">Karnataka · issuing authority</div>
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
            waiting for
            <br />
            the RTO
          </span>
          <PanelTick anim="t_rto" size="30px" />
        </div>
        {" "}
      </div>
      {" "}
      <div className="evs">
        {EVENTS.map(([id, ts, text, ok]) => (
          <Fragment key={id}>
            {" "}
            <div className={ok ? "ev ok" : "ev"} style={{ animation: `r_${id} ${EASE}` }}>
              <span className="ts">{ts}</span>
              <span>{text}</span>
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
const REPORT_ROWS: readonly (readonly [string, string, string])[] = [
  ["r1", "PAN", "15 min"],
  ["r2", "Registration certificate", "28 min"],
  ["r3", "Driving licence", "30 min"],
  ["r4", "Criminal", "30 min"],
];

function ReportPanel() {
  return (
    <div className="panel">
      {" "}
      <div className="who" style={{ animation: `r_rep ${EASE}` }}>
        <div className="ph av" style={{ background: tint("/img/21-portrait-ramesh.jpg") }}>
          <div className="light"></div>
          <Image className="pimg" src="/img/21-portrait-ramesh.jpg" alt="" fill sizes={SIZES_AVATAR} />
        </div>
        <div>
          <div className="n">A. Ramesh</div>
          <div className="s">Delivery rider · Bengaluru</div>
        </div>
      </div>
      {" "}
      <div className="rows">
        {REPORT_ROWS.map(([id, name, time]) => (
          <Fragment key={id}>
            {" "}
            <div className="row" style={{ animation: `r_${id} ${EASE}` }}>
              <span>{name}</span>
              <span className="t">{time}</span>
              <PanelTick anim={`t_${id}`} size="14px" />
            </div>
          </Fragment>
        ))}{" "}
      </div>
      {" "}
      <div className="foot" style={{ animation: `r_foot ${EASE}` }}>
        30 min · 4 sources
      </div>
      {" "}
      <div className="sealglow"></div>
      {" "}
      <div className="vseal">
        <span>Verified</span>
      </div>
      {" "}
    </div>
  );
}

/** In step order: Upload, Read, Confirm, Report. */
export const PANELS = [UploadPanel, ReadPanel, ConfirmPanel, ReportPanel] as const;

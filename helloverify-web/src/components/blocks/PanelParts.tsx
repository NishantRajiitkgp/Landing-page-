import { copy } from "@/lib/copy/request";
import { BLOCKS } from "@/lib/copy/blocks";

/** What all four scenes of the homepage process animation share.
 *
 *  SPLIT OUT OF `blocks/HowItWorksPanels.tsx` 23 Sep 2026, by line range and
 *  with the mover asserting the bytes are unchanged apart from three `export`
 *  keywords, because that file stood at 299 of the 300 lines
 *  `eslint.config.mjs` allows - one line of headroom against a copy layer that
 *  costs about three lines per component that joins it (an import and an
 *  `await copy(NS)`). Which declarations belong here was measured, not chosen
 *  (`scratchpad/scene_fanout_5bd3.py`, counting scenes rather than
 *  identifiers): `EASE` and `PanelTick` are referenced by 4 of the 4 scenes
 *  and `Licence` by 2, while `FIELDS`, `DOC_CHECKS`, `EVENTS` and
 *  `REPORT_ROWS` are each referenced by exactly 1 and therefore stayed beside
 *  the scene that owns them. `TICK_PEN` and `TICK_D` are referenced by no
 *  scene at all - only by `PanelTick` - so they travel with it.
 *
 *  REJECTED - splitting the four scenes two and two. The split point would be
 *  arbitrary, both halves would import this vocabulary anyway, and `PANELS`
 *  would have to be assembled from two modules.
 *
 *  `Licence` STAYS `async` rather than taking its two strings as props from
 *  its caller. It is async in the tree the byte-identity snapshot was taken
 *  from, and `lib/copy/index.ts`'s fourth corollary is that `async` is what
 *  decides where a flight row - and so a `<!-- -->` - begins. Moving a
 *  declaration between modules moves no row; un-asyncing it would, at both of
 *  its call sites, which is the change this split exists to avoid making.
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
export const EASE = "12.0s cubic-bezier(0.16, 1, 0.3, 1) infinite";

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
export function PanelTick({ anim, size, onChip }: { anim: string; size: string; onChip?: boolean }) {
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
export async function Licence({ className, style }: { className: string; style?: React.CSSProperties }) {
  const t = (await copy(BLOCKS)).panels;
  return (
    <div className={className} {...(style ? { style } : {})}>
      <span className="lt">{t.licence.title}</span>
      <span className="lr">{t.licence.region}</span>
      <div className="face"></div>
      <div className="ln1"></div>
      <div className="ln2"></div>
      <div className="ln3"></div>
      <div className="ln4"></div>
      <div className="holo"></div>
    </div>
  );
}

import type { ReactNode } from "react";

/** The flag box, and the one drawing two of these blocks share.
 *
 *  Extracted from `sections/Presence.tsx` 23 Sep 2026 to clear `max-lines`:
 *  that file stood at exactly 300 of the 300 `eslint.config.mjs` allows, so
 *  the next thing in it that needed the copy layer - an import plus an
 *  `await copy(NS)`, about three lines - could not have had them. Which
 *  symbols belong here was measured rather than chosen
 *  (`scratchpad/census_maxlines_5bd3.py`): these are the only two declarations
 *  in that file referenced from BOTH halves of the split - `Flag` once in
 *  `blocks/DayBand.tsx` and once in `blocks/Governments.tsx`, `FLAG_INDIA` the
 *  same. Put either one inside a block and the other block imports from it,
 *  which is why this third module exists rather than two.
 *
 *  A THIRD CALL SITE EXISTS AND IS NOT TAKEN. `sections/International.tsx:137`
 *  hand-writes the same `<span className="fl">` around the same
 *  `<svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice">`, differing
 *  only in a hardcoded `30px` where this takes `size` - diffed, not assumed.
 *  Rewiring it is a separate commit: this one is gated on byte-identical HTML
 *  and that file is not being moved in it (Part 5, "do not batch these").
 *
 *  THE FLAG DRAWINGS THEMSELVES ARE STILL NOT SHAREABLE WITH
 *  `International.tsx`, checked rather than assumed: its Singapore crescent
 *  sits at cx 9.5/10.6 where `blocks/DayBand.tsx`'s is at 6.2/7.3, and its
 *  Philippines triangle is drawn from a different origin - different boxes,
 *  different drawings. Only Egypt happens to match, so a shared registry would
 *  carry two variants of most countries and be no simpler. Within Presence
 *  India genuinely is drawn twice, byte-identically, for the Noida row and the
 *  Government of India tile: hence `FLAG_INDIA`.
 *
 *  Flag hex stays literal - facts about the world, not palette, which is the
 *  exemption `check:tokens` was given in Part 3.
 */

export const FLAG_INDIA = (
  <>
    <rect width="30" height="20" fill="#FFFFFF" />
    <rect width="30" height="6.7" fill="#FF9933" />
    <rect y="13.3" width="30" height="6.7" fill="#138808" />
    <circle cx="15" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="0.8" />
  </>
);

/** Saudi Arabia, the UAE and the EU, moved here from `blocks/Governments.tsx`
 *  (Sep 2026) because homepage v2's seals (`sections/GovSeals.tsx`) inlay the
 *  same three drawings, and India's reason for living here now applies to
 *  them too. Same elements, same attribute strings. */
export const FLAG_KSA = (
  <>
    <rect width="30" height="20" fill="#006C35" />
    <rect x="7" y="7.2" width="16" height="1.3" fill="#FFFFFF" rx="0.6" />
    <rect x="9" y="11" width="12" height="1.1" fill="#FFFFFF" rx="0.5" />
  </>
);

export const FLAG_UAE = (
  <>
    <rect width="30" height="6.7" fill="#00732F" />
    <rect y="6.7" width="30" height="6.6" fill="#FFFFFF" />
    <rect y="13.3" width="30" height="6.7" fill="#15140F" />
    <rect x="3" width="8" height="20" fill="#FF0000" />
  </>
);

/** The twelve stars, clockwise from three o'clock on a radius of 6. */
const EU_STARS = [
  ["21.00", "10.00"], ["20.20", "13.00"], ["18.00", "15.20"], ["15.00", "16.00"],
  ["12.00", "15.20"], ["9.80", "13.00"], ["9.00", "10.00"], ["9.80", "7.00"],
  ["12.00", "4.80"], ["15.00", "4.00"], ["18.00", "4.80"], ["20.20", "7.00"],
];

export const FLAG_EU = (
  <>
    <rect width="30" height="20" fill="#003399" />
    {EU_STARS.map(([cx, cy]) => (
      <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="1" fill="#FFCC00" />
    ))}
  </>
);

export function Flag({ children, size }: { children: ReactNode; size: string }) {
  return (
    <span className="fl" style={{ width: size, height: size }}>
      <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{children}</svg>
    </span>
  );
}

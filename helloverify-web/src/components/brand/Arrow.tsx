/** The forward arrow that sits inside a ghost or line button.
 *
 *  Inlined 19 times across 17 files, character for character, before this
 *  existed (BUILD-SPEC §4 rule 2, §17 condition 22) — plus two files that had
 *  each declared their own local `const Arrow` returning exactly this. The same
 *  shape `components/brand/Tick.tsx` found for the confirmation tick, which was
 *  inlined 87 times.
 *
 *  TWO VARIANTS ARE DELIBERATELY LEFT ALONE, because collapsing them would
 *  change output rather than structure:
 *
 *  - **Six copies carry no `aria-hidden`.** They are otherwise identical. That
 *    is an accessibility inconsistency, not a formatting one — a decorative SVG
 *    with no label and no `aria-hidden` is announced as an unnamed graphic — so
 *    it is a carried finding in TASKS.md and a fix of its own, not a silent
 *    side effect of an extraction. `check:a11y` does not currently catch it.
 *  - **The 14px copies** in the section components are a different size and
 *    stay inline until something needs them shared.
 */
export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

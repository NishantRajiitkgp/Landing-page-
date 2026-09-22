/** The forward arrow that sits inside a ghost or line button.
 *
 *  Inlined 19 times across 17 files, character for character, before this
 *  existed (BUILD-SPEC §4 rule 2, §17 condition 22) — plus two files that had
 *  each declared their own local `const Arrow` returning exactly this. The same
 *  shape `components/brand/Tick.tsx` found for the confirmation tick, which was
 *  inlined 87 times.
 *
 *  **The six copies that carried no `aria-hidden` are now three**, and the
 *  three that are left are deferred by ownership rather than by choice
 *  (22 Sep 2026). Found by the shared path data `M3 8h10M9 4l4 4-4 4`: 13
 *  inline copies remain in `src/`, and exactly 6 of them had lost the
 *  attribute — three in `app/[locale]/platform/page.tsx`, one each in
 *  `business/`, `governments/` and `individuals/page.tsx`. The first three are
 *  `<Arrow />` now; the other three are in files another agent holds.
 *
 *  Shared rather than patched: adding `aria-hidden` to a copy fixes one
 *  instance, and the next paste loses it again. All six were attribute-for-
 *  attribute identical to this component, in the same order, so the swap emits
 *  the same bytes — that identity is why replacement was available at all.
 *
 *  **The defect was latent, not audible, and that is worth recording rather
 *  than being re-discovered:** all six sit inside `<span className="go"
 *  aria-hidden="true">`, and `aria-hidden` hides the whole subtree, so nothing
 *  announced them. The finding's premise ("announced as an unnamed graphic")
 *  holds for a bare arrow in general and did not hold for these. `check:a11y`
 *  cannot see either way — jsdom axe has no rule that fires on an unlabelled
 *  decorative `<svg>` — so neither the defect nor its mitigation is gated.
 *
 *  **The 14px copies still stay inline** — `sections/Checks.tsx`,
 *  `International.tsx`, `Packages.tsx`. They differ in `width`/`height` (14,
 *  not 16), which this component takes no prop for, and all three already
 *  carry `aria-hidden`, so there is nothing to fix and adding a size prop for
 *  three call sites would be a wider change than the defect asked for.
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

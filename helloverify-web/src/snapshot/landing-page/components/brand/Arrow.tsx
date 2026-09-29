/** The forward arrow that sits inside a ghost or line button, and the only
 *  `<svg>` in `src/` that still draws it (BUILD-SPEC §4 rule 2, §17
 *  condition 22).
 *
 *  Inlined 19 times across 17 files, character for character, before this
 *  existed - plus two files that had each declared their own local
 *  `const Arrow` returning exactly this. The same shape
 *  `components/brand/Tick.tsx` found for the confirmation tick, which was
 *  inlined 87 times.
 *
 *  **The last 6 hand-written copies are gone (22 Sep 2026).** Found, as before,
 *  by the shared path data `M3 8h10M9 4l4 4-4 4`. What they were, measured
 *  attribute by attribute before any of them was touched:
 *
 *    - `app/[locale]/business/page.tsx`, `governments/page.tsx` and
 *      `individuals/page.tsx`: identical to this component attribute for
 *      attribute and in the same order, EXCEPT that all three had lost
 *      `aria-hidden="true"` from the `<svg>`. So those three pages gain that
 *      one attribute and nothing else. The three like them on `/platform` were
 *      shared in the round before; these were left then only because another
 *      agent held the files.
 *    - `sections/Checks.tsx`, `International.tsx` and `Packages.tsx`:
 *      identical except `width`/`height` of 14 rather than 16. The `viewBox`
 *      stays `0 0 16 16` in all three, so it is the same drawing in a smaller
 *      box, not a different one. `Checks.tsx` kept its copy in a module-level
 *      `const ARROW` used once.
 *
 *  **`size` REVERSES A REFUSAL, and the reason for the refusal has expired.**
 *  This component took no size prop, on the grounds that three call sites did
 *  not justify one when the defect being fixed was a missing `aria-hidden`
 *  somewhere else. Retiring the inline copies IS the change now, so those three
 *  sites are the point rather than collateral, and the alternative is keeping a
 *  second copy of the drawing alive over two bytes.
 *
 *  It is a STRING, not a number. `size={14}` would emit `width="14"` too, but
 *  the emitted bytes have to match the markup being replaced exactly
 *  (`tools/port/html-identity.mjs`), and a string is the attribute text with no
 *  stringification step left to reason about. Sizing from CSS the way `Tick`
 *  does was rejected for the mirror-image reason: `.tick` carries no
 *  `width`/`height` at all, and dropping those two attributes here would change
 *  the HTML at all 32 call sites rather than at none.
 *
 *  **MIRRORING UNDER RTL IS DONE IN CSS, NOT HERE** - `app/globals.css`, keyed
 *  on this path data with `:has()` and signed by `--flip` (§17 condition 15).
 *  That rule's comment carries the argument, including why this component does
 *  not emit a mirrored `d` for Arabic. The short version: a `className` would
 *  move the emitted HTML at every existing call site, and a leaf component has
 *  no way to know the direction anyway.
 *
 *  **The `aria-hidden` defect was latent, not audible, and that is worth
 *  recording rather than being re-discovered:** all six sat inside
 *  `<span className="go" aria-hidden="true">`, and `aria-hidden` hides the
 *  whole subtree, so nothing announced them. The finding's premise ("announced
 *  as an unnamed graphic") holds for a bare arrow in general and did not hold
 *  for these. `check:a11y` cannot see either way - jsdom axe has no rule that
 *  fires on an unlabelled decorative `<svg>` - so neither the defect nor its
 *  mitigation is gated.
 */
export function Arrow({ size = "16" }: { size?: "14" | "16" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

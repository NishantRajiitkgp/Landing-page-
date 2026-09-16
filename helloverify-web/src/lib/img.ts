/**
 * Measured `sizes` values for the photo cards.
 *
 * Every `next/image` with `fill` MUST carry a `sizes`. Without it Next assumes
 * `100vw`, asks the optimizer for a ~1440px variant and drops it into a 300px
 * box — making the page heavier than the raw <img> it replaced.
 *
 * These are `vw` rather than `px` on purpose. Next filters the srcset ladder by
 * the smallest `vw` it can find in the string; a px-only `sizes` disables that
 * filter and emits every candidate width, which measured at ~1,540 bytes of
 * HTML per image (≈97 KB across the 63 photo cards).
 *
 * The numbers are not estimates. They come from a CDP census of every visible
 * <img> box on all 14 image-bearing routes at 1440px and 390px, converted to vw
 * and rounded up (over-asking costs nothing — sharp caps at the source's own
 * width). The breakpoint is the design system's single 1080px line (DESIGN.md
 * §2.3). Re-run tools/port/imgcensus.mjs if a layout width changes.
 */

/** `.paths3 .cell.ph.span2` — 2 of 6 grid columns, so a third of the row. 383px → 350px. */
export const SIZES_PATH_SPAN2 = "(max-width: 1080px) 90vw, 27vw";

/** `.paths3 .cell.ph.span3` — 3 of 6 grid columns, so half the row. 584px → 350px. */
export const SIZES_PATH_SPAN3 = "(max-width: 1080px) 90vw, 41vw";

/** `.close2.ph` closing band, and the blog lead `.cell.ph`. 1185px → 364px. */
export const SIZES_FULL = "(max-width: 1080px) 94vw, 83vw";

/** `.side.ph` — the contact page photo column. 494px → 350px. */
export const SIZES_SIDE = "(max-width: 1080px) 90vw, 35vw";

/** `.whyv.ph` — the "why governments work with us" photo. 645px → 350px. */
export const SIZES_WHY = "(max-width: 1080px) 90vw, 45vw";

/** `.ccard.ph` — country/coverage card. 221px → 350px (the mobile card is wider). */
export const SIZES_CCARD = "(max-width: 1080px) 90vw, 16vw";

/** `.person.ph` — the drifting people strip. 290–340px → 190–220px. */
export const SIZES_PERSON = "(max-width: 1080px) 57vw, 24vw";

/** `.cell.ph` in the WhoItsFor bento, narrow column. 382px → 350px. */
export const SIZES_BENTO_NARROW = "(max-width: 1080px) 90vw, 27vw";

/** `.cell.ph` in the WhoItsFor bento, wide column. 783px → 350px. */
export const SIZES_BENTO_WIDE = "(max-width: 1080px) 90vw, 55vw";

/** `.ph` hero/feature photo. 672px → 364px. */
export const SIZES_FEATURE = "(max-width: 1080px) 94vw, 47vw";

/** Tiny fixed `fill` boxes: `.ph.av` (40px) and the inline `.ph` mark (52px). */
export const SIZES_AVATAR = "40px";
export const SIZES_MARK = "52px";

/**
 * Fixed-size images (explicit width/height rather than `fill`), from the CSS.
 * `.cert img` 72→56, `.certline img` 34, `.gt img` 36, `.by img` 44,
 * `.byline img` 40. The CSS sizes the box; these feed the 1x/2x srcset.
 */
export const CERT_BOX = 72;
export const CERTLINE_BOX = 34;
export const AVATAR_GT = 36;
export const AVATAR_BY = 44;
export const AVATAR_BYLINE = 40;

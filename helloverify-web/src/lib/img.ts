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

/** The placeholder tint behind each photograph.
 *
 *  `.ph` is the box a photo sits in. It carries a neutral default in
 *  `design.css`, and every instance overrode it inline with a colour matched to
 *  that specific image - 57 hex literals across the components, which is what
 *  BUILD-SPEC §17 condition 21 was counting.
 *
 *  They are NOT palette, which is why they are here rather than in DESIGN.md as
 *  tokens: the tint is a property of one photograph, the same category as
 *  `blurDataURL`. Swapping the brand palette does not change the colour that
 *  belongs behind a picture of a rider in Bengaluru. Keyed by image so the two
 *  cannot drift, and so a new photo without a tint is a type error rather than
 *  a silently wrong box.
 */
export const PLACEHOLDER_TINT: Record<string, string> = {
  "/img/01-rider-bengaluru.jpg": "#CFA58E",
  "/img/02-nurse-abudhabi.jpg": "#B7C3B2",
  "/img/03-engineer-manila.jpg": "#ADB4BE",
  "/img/04-nanny-gurugram.jpg": "#D8CBB2",
  "/img/05-warehouse-pune.jpg": "#6E6C63",
  "/img/06-supplier-cairo.jpg": "#B3B08F",
  "/img/07-tenant-singapore.jpg": "#D6BCB2",
  "/img/08-cfo-london.jpg": "#C9C2B4",
  "/img/09-licensing-officer.jpg": "#8C8C7A",
  "/img/10-ministry-hall.jpg": "#B3B08F",
  "/img/11-office-first-day.jpg": "#D8CBB2",
  "/img/12-phone-signup.jpg": "#ADB4BE",
  "/img/13-factory-floor.jpg": "#6E6C63",
  "/img/14-visa-counter.jpg": "#C9C2B4",
  "/img/15-home-doorway.jpg": "#D6BCB2",
  "/img/16-united-kingdom.jpg": "#5E6A78",
  "/img/17-philippines.jpg": "#6F7A5C",
  "/img/18-uae.jpg": "#9A7E5E",
  "/img/19-singapore.jpg": "#5C6F73",
  "/img/20-egypt.jpg": "#A08260",
  "/img/21-portrait-ramesh.jpg": "#B7C3B2",
  "/img/22-portrait-fleet-head.jpg": "#ADB4BE",
  "/img/23-closing.jpg": "#6B6E5B",
};

/** `tint("/img/01-rider-bengaluru.jpg")` -> its placeholder colour.
 *
 *  Throws rather than returning a default: a missing entry means a photograph
 *  was added without one, and a wrong-coloured box is exactly the kind of thing
 *  nobody notices until it is in front of a customer.
 */
export function tint(src: string): string {
  const value = PLACEHOLDER_TINT[src];
  if (!value) {
    throw new Error(
      `tint: no placeholder colour for ${JSON.stringify(src)}. ` +
        `Add one to PLACEHOLDER_TINT in lib/img.ts.`,
    );
  }
  return value;
}

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
  /** Homepage v2 photographs (Higgsfield, Sep 2026). Each tint is the
   *  photograph's mean colour, measured with sharp `stats()`, not picked. */
  "/img/v2/cs-anyone.jpg": "#93887B",
  "/img/v2/cs-contact.jpg": "#7F725F",
  "/img/v2/cs-cyber.jpg": "#8F7D75",
  "/img/v2/cs-driver.jpg": "#7B7F72",
  "/img/v2/cs-identity.jpg": "#81746B",
  "/img/v2/cs-nanny.jpg": "#8B7159",
  "/img/v2/cs-staff.jpg": "#928173",
  "/img/v2/cs-tenant.jpg": "#807869",
  "/img/v2/dd-trade.jpg": "#7B7064",
  "/img/v2/dd-vendor.jpg": "#93897F",
  "/img/v2/en-blue.jpg": "#A1968B",
  "/img/v2/en-selfie.jpg": "#AA998D",
  "/img/v2/en-vendor.jpg": "#AC927D",
  "/img/v2/en-white.jpg": "#938A7D",
  "/img/v2/pkg-bluecollar.jpg": "#7B7B72",
  "/img/v2/pkg-driver.jpg": "#646559",
  "/img/v2/pkg-trade.jpg": "#726B5F",
  "/img/v2/pkg-vendor.jpg": "#8F8277",
  "/img/v2/pkg-visa.jpg": "#8C8A83",
  "/img/v2/pkg-whitecollar.jpg": "#A9A297",
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

/** The placeholder CAPTION colour, for the photographs whose tint is too dark
 *  for the default one. Same category as `PLACEHOLDER_TINT` above, and here
 *  for the same reason - it is a fact about one photograph, not palette.
 *
 *  `design.css` gives `.ph .note` `rgba(21,20,15,0.45)` at both breakpoints:
 *  dark ink at 45%, legible on a light tint and not on a dark one. Ten tiles
 *  inverted it to translucent white in an inline `style` prop, and those
 *  literals are what extended `hv/no-color-literal` past hex on 22 Sep 2026 -
 *  six occurrences across five components, all of them this caption.
 *
 *  **Keyed by image because the tint is what decides it, measured rather than
 *  asserted.** Relative luminance of every tint that inverts the caption is
 *  <= 0.2574 (`#8C8C7A`, licensing officer) and of every tint that keeps the
 *  default is >= 0.4213 (`#CFA58E`, rider) - a clean gap with no photograph in
 *  it. The call sites previously each carried their own trigger for the same
 *  fact (`p.live` in PeopleStrip, a `dimNote` field in WhoItsFor, nothing at
 *  all in the other three), so the colour and its cause could drift apart.
 *
 *  **The three alpha values are the artboards' own and are NOT unified.** 0.4
 *  on the two mid tints, 0.45 on the five country cards, 0.35 on
 *  the closing band. Collapsing them to one number would change what six tiles
 *  render, which is a DESIGN.md decision and not a lint fix; they are recorded
 *  per photograph instead, which is byte-faithful. Every entry here is the
 *  value that image already rendered - no photograph rendered a caption at two
 *  different values, checked across all five components before the move.
 */
const PLACEHOLDER_NOTE: Record<string, string> = {
  /** `sections/Why.tsx`, one tile. */
  "/img/09-licensing-officer.jpg": "rgba(255,255,255,0.4)",
  /** `sections/PeopleStrip.tsx`, the live card at both breakpoints. */
  "/img/05-warehouse-pune.jpg": "rgba(255,255,255,0.4)",
  /** `sections/International.tsx`, all five country cards. */
  "/img/16-united-kingdom.jpg": "rgba(255,255,255,0.45)",
  "/img/17-philippines.jpg": "rgba(255,255,255,0.45)",
  "/img/18-uae.jpg": "rgba(255,255,255,0.45)",
  "/img/19-singapore.jpg": "rgba(255,255,255,0.45)",
  "/img/20-egypt.jpg": "rgba(255,255,255,0.45)",
  /** `sections/Contact.tsx`, the desktop closing band. */
  "/img/23-closing.jpg": "rgba(255,255,255,0.35)",
};

/** `noteInk("/img/05-warehouse-pune.jpg")` -> its caption colour, or
 *  `undefined` where `design.css`'s default dark caption is the right one.
 *
 *  Undefined rather than throwing, which is the opposite of `tint()` above and
 *  deliberate: a missing tint is always a defect, whereas most photographs
 *  legitimately have no entry here - 15 of the 23 keep the default (the WhoItsFor factory-floor entry went with that band's desktop tree, Sep 2026). Callers
 *  must therefore leave the `style` prop off entirely rather than pass
 *  `undefined` through it where the markup never had one; see the flight-payload
 *  note in `sections/Packages.tsx`.
 */
export function noteInk(src: string): string | undefined {
  return PLACEHOLDER_NOTE[src];
}

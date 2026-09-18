/** Rasterise the wordmark to `public/logo.png` for `Organization.logo`.
 *
 *  BUILD-SPEC §8.2 puts `Organization` in the root layout; Google's guidance for
 *  that node wants a RASTER logo (PNG/JPG, at least 112px on its shortest side).
 *  This site's mark is inline SVG in `components/brand/Logo.tsx` with no file
 *  behind it, and the old site pointed `logo` at
 *  `/assets/nav/header-logo-figma.svg` — an SVG, which the guidance does not
 *  want, at a path that does not exist here. So item 6 and item 7 both shipped
 *  the entity with no `logo` at all.
 *
 *  The source SVG sits next to this script rather than the PNG being committed
 *  as a mystery binary: the mark is reproducible from text, and a reviewer can
 *  diff it. `./logo.svg` is the artwork as supplied, with one substitution —
 *  `fill="black"` becomes the design system's ink, `#15140F`, which is what
 *  `Logo.tsx` renders. Both files carry the same 12 glyph fills and the same
 *  single `#EC2E21` accent, and the path data is the `Logo.tsx` geometry scaled
 *  6.186x (viewBox 1064x388 against 172x50) — checked before use, because "a
 *  logo from the desktop" is exactly the kind of asset that turns out to be an
 *  old brand.
 *
 *  WHITE BACKGROUND, not transparent. The glyphs are near-black, so a
 *  transparent PNG disappears wherever Google composites it onto a dark
 *  surface, and their guidance is that the logo should look right on white.
 *
 *  Run it when the artwork changes:
 *      npm run build:logo
 */
import { readFile, writeFile } from "node:fs/promises";

import sharp from "sharp";

const here = new URL("./", import.meta.url);
const svg = await readFile(new URL("logo.svg", here), "utf8");

/** Native size. 1064x388 clears Google's 112px floor several times over, and
 *  keeping the artwork's own aspect ratio means no letterboxing decision. */
const png = await sharp(Buffer.from(svg))
  .flatten({ background: "#FFFFFF" })
  .png({ compressionLevel: 9 })
  .toBuffer();

const out = new URL("../../public/logo.png", here);
await writeFile(out, png);

const { width, height, size } = { ...(await sharp(png).metadata()), size: png.length };
console.log(`public/logo.png  ${width}x${height}  ${(size / 1024).toFixed(1)} KB`);
if (Math.min(width, height) < 112) {
  console.log("FAIL - Google's Organization.logo guidance wants >= 112px on the short side");
  process.exit(1);
}

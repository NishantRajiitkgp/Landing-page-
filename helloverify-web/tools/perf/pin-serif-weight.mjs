/** Pin Newsreader's `wght` axis at 400, keeping `opsz` and every glyph
 *  (BUILD-SPEC §9.1, §9.3; TASKS.md Part 12).
 *
 *  WHY. §9.1 budgets fonts at 60 KB a page; the build shipped 241.9 KB, 208 KB
 *  of it the two Newsreader faces. A browser census of every serif text node
 *  on ten routes at 1440px and 390px (24 Sep 2026) found the serif drawn at
 *  weight 400 for 15,249 characters, 500 for 18 and 600 for 16 — so the
 *  200-800 weight axis was carrying ~100 KB of deltas for 34 characters. The
 *  two exceptions: the FAQ accordion's "+" (`.faq3 summary .m`) is set to 400
 *  in the same change; the forged certificate's name (`.ff-forged .ff-name`)
 *  keeps 600 on purpose — it is one of the forgery tells — and is drawn as
 *  synthesised bold.
 *
 *  WHAT IS KEPT, and why that is the point. `opsz` (6-72) is untouched: the
 *  serif runs from 8px captions to a 212px display figure, and `layout.tsx`
 *  records that the canvas depends on it — pinning opsz instead would change
 *  every headline's letterforms. Measured on the shipped faces, instancing
 *  wght alone: roman 95.6 -> 34.3 KB, italic 107.1 -> 38.3 KB (ASCII probe);
 *  wght 400-600 kept as a range would have been 56.8 / 63.8.
 *
 *  WHY A SEPARATE TOOL and not a flag on `subset-fonts.mjs`. That script reads
 *  the UNSUBSET faces out of `.next/static/media` and refuses to run on its
 *  own output, because subsetting only removes glyphs (see its header). This
 *  one instances an axis and passes the face's own full cmap as the text, so
 *  it cannot narrow the glyph set — and it asserts that, rather than trusting
 *  it. It is idempotent: a face with no `wght` axis left is skipped.
 *
 *      node tools/perf/pin-serif-weight.mjs          # then `npm run build`
 */
import { readFile, writeFile } from "node:fs/promises";

import fontverter from "fontverter";
import hbInit from "harfbuzzjs";
import subsetFont from "subset-font";

const root = new URL("../../", import.meta.url);
const FACES = ["newsreader-roman.woff2", "newsreader-italic.woff2"];
const hb = await hbInit;

async function inspect(woff2) {
  const face = hb.createFace(hb.createBlob(await fontverter.convert(woff2, "sfnt")), 0);
  const info = { unicodes: [...face.collectUnicodes()].sort((a, b) => a - b), axes: face.getAxisInfos() };
  face.destroy();
  return info;
}

let failed = false;
for (const name of FACES) {
  const path = new URL(`src/fonts/${name}`, root);
  const src = await readFile(path);
  const before = await inspect(src);
  if (!before.axes.wght) {
    console.log(`  ${name.padEnd(26)} already pinned (no wght axis) — skipped`);
    continue;
  }
  const text = String.fromCodePoint(...before.unicodes);
  const out = await subsetFont(src, text, { targetFormat: "woff2", variationAxes: { wght: 400 } });
  const after = await inspect(out);

  const lost = before.unicodes.filter((u) => !after.unicodes.includes(u));
  const problems = [];
  if (lost.length) problems.push(`lost ${lost.length} codepoint(s): ${lost.map((u) => "U+" + u.toString(16)).join(" ")}`);
  if (after.axes.wght) problems.push("wght axis still present");
  if (JSON.stringify(after.axes.opsz) !== JSON.stringify(before.axes.opsz)) problems.push(`opsz changed: ${JSON.stringify(after.axes.opsz)}`);
  if (problems.length) {
    failed = true;
    console.log(`  x ${name}: ${problems.join("; ")} — NOT written`);
    continue;
  }
  await writeFile(path, out);
  console.log(
    `  ${name.padEnd(26)} ${(src.length / 1024).toFixed(1).padStart(6)} KB -> ${(out.length / 1024).toFixed(1).padStart(5)} KB` +
      `  (${before.unicodes.length} codepoints kept, opsz ${before.axes.opsz.min}-${before.axes.opsz.max} kept)`,
  );
}
if (failed) {
  console.log("\nFAIL - a face would have changed beyond the wght pin; nothing was written for it.");
  process.exit(1);
}
console.log("\nPASS - wght pinned at 400; every codepoint and the opsz axis preserved.");

/** Subset the webfonts to the glyphs this site actually renders (BUILD-SPEC §9.3).
 *
 *  §9.1 budgets fonts at 60 KB per page. Measured before this ran: **324.1 KB**
 *  on the homepage, 5.4x over, and the single largest breach of the whole
 *  performance budget. 276 KB of it is Newsreader alone — a variable font
 *  carrying the full weight axis (200-800), an optical-size axis, and every
 *  glyph in Google's "latin" subset, in roman AND italic.
 *
 *  §9.3 prescribes the fix in as many words: "`next/font/local` with
 *  self-hosted variable WOFF2, subset to the glyphs actually used per script."
 *  `subsets: ["latin"]` is not that — "latin" is ~200 glyphs of Google's
 *  choosing, and this site renders about a sixth of them.
 *
 *  WHAT "ACTUALLY USED" MEANS HERE, and why it is safe. The glyph set is read
 *  out of the 56 prerendered HTML pages — the real text, after entity decoding,
 *  with markup and script payloads stripped — and then widened by a fixed
 *  SAFETY set below. The measurement alone would be too tight: it describes the
 *  copy that exists today, and a subsetted font is a page that renders tofu the
 *  first time an editor types a character nobody has used yet.
 *
 *  The variable axes are PRESERVED. `layout.tsx` notes the canvas depends on
 *  Newsreader's `opsz` axis (the 112px hero sets far wider letterforms than the
 *  14pt master), so dropping to a static instance would be a visible design
 *  change. harfbuzz keeps the axes through a subset; only glyphs are removed.
 *
 *  Run after changing copy or fonts, then rebuild:
 *      npm run build && npm run build:fonts && npm run build
 *
 *  The double build is not a mistake: the glyph census reads the emitted HTML,
 *  so it needs a build to read, and the result needs a build to ship.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";

import subsetFont from "subset-font";

const root = new URL("../../", import.meta.url);

/** Characters that must survive even if no page uses one today.
 *
 *  ASCII printable is the floor. The rest are characters this design reaches
 *  for and a copy editor will reach for again: the typographic quotes and
 *  dashes the house style uses throughout, the rupee sign on the pricing pages,
 *  the arrows and middots in the chrome, and the accented letters that turn up
 *  in place and person names across 120+ countries.
 */
const SAFETY =
  Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join("") +
  " ­" +
  "‘’‚“”„•…‹›€₹£¥" +
  "–—·×÷±≈≠≤≥→←↑↓" +
  "©®™°§¶№";

/** Accented Latin is NOT blanket-included. Measured: adding the Latin-1 and
 *  Latin Extended-A accents costs 12.5 KB on Newsreader roman alone, ~40 KB
 *  across the four faces, against a 60 KB budget for all of them. The census
 *  below picks up every accented character the copy actually uses (place and
 *  person names across 120+ countries do produce some), so the cost is paid
 *  only where it buys something. A name typed for the first time after this
 *  runs renders in the fallback face until the next build — which is the trade
 *  §9.3 asks for when it says "subset to the glyphs actually used". */

/** Every character the build actually emits. */
async function usedCodepoints() {
  const chars = new Set(SAFETY);

  async function walk(dir) {
    for (const item of await readdir(new URL(dir, root), { withFileTypes: true })) {
      if (item.isDirectory()) await walk(`${dir}${item.name}/`);
      else if (item.name.endsWith(".html")) {
        const html = await readFile(new URL(`${dir}${item.name}`, root), "utf8");
        const text = html
          // The RSC flight payload repeats every string JSON-encoded; dropping
          // it changes nothing about the glyph set but keeps this honest about
          // reading rendered text rather than serialised props.
          .replace(/<script[\s\S]*?<\/script>/g, " ")
          .replace(/<style[\s\S]*?<\/style>/g, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/&#x27;|&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ");
        for (const ch of text) chars.add(ch);
      }
    }
  }
  await walk(".next/server/app/");

  // Control characters are not glyphs.
  for (const ch of [...chars]) {
    const c = ch.codePointAt(0);
    if (c < 0x20 && c !== 0x20) chars.delete(ch);
  }
  return chars;
}

/** The four faces the pages preload, by the hashed filename `next/font/google`
 *  gave them. `-s.p.` marks the preloaded latin file; the siblings are other
 *  unicode-ranges that no page on this site ever requests.
 *
 *  Reading them out of the build rather than re-downloading from Google keeps
 *  this reproducible offline and guarantees the subset starts from exactly the
 *  bytes that shipped.
 */
const FACES = [
  { out: "newsreader-roman.woff2", match: /^d38f3bca7db33566-s\.p\./ },
  { out: "newsreader-italic.woff2", match: /^2b7d3311b69a4dca-s\.p\./ },
  { out: "instrument-sans.woff2", match: /^f06bf9da926bae75-s\.p\./ },
  { out: "geist-mono.woff2", match: /^797e433ab948586e-s\.p\./ },
];

const chars = await usedCodepoints();
const text = [...chars].sort().join("");
console.log(`glyph census: ${chars.size} characters across the prerendered pages\n`);

const media = await readdir(new URL(".next/static/media/", root));

/** Refuse when `.next/static/media` holds this script's own OUTPUT.
 *
 *  THE PIPELINE REVERSED, and the failure it produced pointed the wrong way.
 *  This script was written when `layout.tsx` used `next/font/google`, so the
 *  build emitted the full Google faces into `.next/static/media` and this read
 *  them, subset them, and wrote `src/fonts/`. §9.3 then moved the layout to
 *  `next/font/local` reading `src/fonts/` -- so the build now emits copies of
 *  the SUBSETS into that same directory, under `next/font/local`'s naming
 *  (`newsreader_roman-s.p.<hash>.woff2`) rather than the content hashes in
 *  `FACES`. Measured: the four files there are byte-identical to the four in
 *  `src/fonts/`.
 *
 *  The old message read "no source font matching /^d38f3bca7db33566-s\.p\./
 *  ... Run `npm run build` first, or the font hashes changed." A build had
 *  been run and no hash had changed, so the only repair it suggested was to
 *  update the regexes -- and THAT IS THE DESTRUCTIVE ONE. `subsetFont` only
 *  removes glyphs, so pointing this at the subsets re-subsets them, narrowing
 *  the face permanently on every run against a census that shrinks whenever
 *  copy is cut. `check:perf` measures bytes and would call it an improvement.
 *
 *  Recovery, which needs the network and is therefore not automated here:
 *  restore `next/font/google` in `app/[locale]/layout.tsx`, `npm run build` to
 *  re-download the full faces, run this, then put `next/font/local` back --
 *  the double build the header above already describes, with an extra step.
 *  Vendoring the unsubset sources under `design-src/fonts/` would end this for
 *  good and is the open decision. */
const subsets = await Promise.all(
  FACES.map(async (face) => {
    try {
      return await readFile(new URL(`src/fonts/${face.out}`, root));
    } catch {
      return null;
    }
  }),
);
const shipped = subsets.filter((b) => b !== null).map((b) => b.length);
const mediaFonts = media.filter((f) => f.endsWith(".woff2"));
if (mediaFonts.length > 0 && shipped.length === FACES.length) {
  const sizes = await Promise.all(
    mediaFonts.map(async (f) => (await readFile(new URL(`.next/static/media/${f}`, root))).length),
  );
  const allAreSubsets = sizes.every((n) => shipped.includes(n));
  if (allAreSubsets) {
    console.log("FAIL - .next/static/media holds this script's OUTPUT, not its input.");
    console.log("       The layout loads src/fonts/ via next/font/local (§9.3), so the");
    console.log("       build copies the SUBSET faces there. Re-running would subset an");
    console.log("       already-subset face and narrow it permanently - subsetFont only");
    console.log("       removes glyphs. Do NOT 'fix' this by updating the FACES regexes.");
    console.log("       Recovery needs the unsubset sources; see the note above this check.");
    console.log(
      `       Matched by size: ${mediaFonts.length} face(s) in media, all equal to a file in src/fonts/.`,
    );
    process.exit(1);
  }
}

await mkdir(new URL("src/fonts/", root), { recursive: true });

let before = 0;
let after = 0;
for (const face of FACES) {
  const name = media.find((f) => face.match.test(f));
  if (!name) {
    console.log(`FAIL - no source font matching ${face.match} in .next/static/media.`);
    console.log("       Run `npm run build` first, or the font hashes changed.");
    process.exit(1);
  }
  const src = await readFile(new URL(`.next/static/media/${name}`, root));
  const out = await subsetFont(src, text, { targetFormat: "woff2" });
  await writeFile(new URL(`src/fonts/${face.out}`, root), out);
  before += src.length;
  after += out.length;
  const pct = ((1 - out.length / src.length) * 100).toFixed(0);
  console.log(
    `  ${face.out.padEnd(26)} ${(src.length / 1024).toFixed(1).padStart(7)} KB -> ` +
      `${(out.length / 1024).toFixed(1).padStart(6)} KB  (-${pct}%)`,
  );
}

console.log(
  `\ntotal ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB ` +
    `(§9.1 budget: 60 KB per page)`,
);

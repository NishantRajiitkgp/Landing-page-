/** Subset the webfonts to the glyphs this site actually renders (BUILD-SPEC §9.3).
 *
 *  §9.1 budgets fonts at 60 KB per page. The Latin trio started at 324.1 KB
 *  on the homepage; glyph-subset + pinning Newsreader `wght` at 400 took it
 *  to 123.3 KB (ceiling 127). That still misses §9.1, and the rest is a
 *  DESIGN.md decision — see `check-budgets.mjs`.
 *
 *  SOURCES LIVE IN `design-src/fonts/`, NOT IN `.next/static/media`.
 *
 *  This script used to read the four faces `next/font/google` emitted into
 *  the build, keyed on content hashes (`^d38f3bca7db33566-s\.p\.` and three
 *  siblings). §9.3 then moved the layout to `next/font/local` reading
 *  `src/fonts/`, so the build copies the SUBSETS into that same directory.
 *  Pointing this at those files re-subsets them and narrows the face
 *  permanently — `subsetFont` only removes glyphs, and `check:perf` would
 *  call the loss an improvement. The recovery note used to say "put
 *  `next/font/google` back, rebuild, run this" — a network round-trip that
 *  nobody can run offline, and the hashes it matched no longer exist.
 *
 *  Vendoring the unsubset sources under `design-src/fonts/` is the fix that
 *  note asked for (TASKS.md Part 9b, 4 Oct 2026):
 *
 *      design-src/fonts/noto-sans-devanagari.woff2   script sources (OFL)
 *      design-src/fonts/noto-serif-devanagari.woff2
 *      design-src/fonts/noto-sans-arabic.woff2
 *      design-src/fonts/noto-naskh-arabic.woff2
 *      design-src/fonts/latin/*.woff2                optional; see LATIN
 *
 *  LATIN SOURCES ARE OPTIONAL because they were never checked in. The four
 *  files in `src/fonts/{newsreader,instrument,geist}*` are already subset;
 *  without the full faces this script cannot safely touch them, so it
 *  leaves them alone and says so. Adding `design-src/fonts/latin/<out>`
 *  for any of those four turns that face back on.
 *
 *  SCRIPT FACES ARE REQUIRED. No face this site shipped carried a Devanagari
 *  or Arabic glyph, so `hi` / `ar` could not ship. The Noto files above are
 *  the fontsource 400 "devanagari" / "arabic" subsets — already cut to the
 *  script, OFL-1.1, and large enough to re-subset from. The SAFETY blocks
 *  below keep the whole script even when the HTML census is still Latin-only
 *  (today: `routing.locales` is `["en"]`). Without that, the first run after
 *  adding the files would strip every Devanagari/Arabic glyph and the next
 *  translation would be tofu until someone noticed.
 *
 *  Run after changing copy or fonts, then rebuild:
 *      npm run build && npm run build:fonts && npm run build
 *
 *  The double build is not a mistake: the glyph census reads the emitted HTML,
 *  so it needs a build to read, and the result needs a build to ship.
 */
import { readdir, readFile, writeFile, mkdir, access } from "node:fs/promises";

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
const LATIN_SAFETY =
  Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join("") +
  " ­" +
  "‘’‚“”„•…‹›€₹£¥" +
  "–—·×÷±≈≠≤≥→←↑↓" +
  "©®™°§¶№";

/** A closed Unicode range as a string of every code point in it. */
function block(from, to) {
  let s = "";
  for (let i = from; i <= to; i++) s += String.fromCodePoint(i);
  return s;
}

/** ZWJ / ZWNJ are not "letters" and a census of visible text will miss them;
 *  Hindi conjuncts and Arabic lam-alef need them in the cmap. */
const JOINERS = "\u200C\u200D";

/** The whole Devanagari block (U+0900–097F). A first-time Hindi word that
 *  the census has never seen still has to render. */
const DEVANAGARI_SAFETY = block(0x0900, 0x097f) + JOINERS;

/** Arabic (U+0600–06FF) plus the two smaller Arabic supplements. Presentation
 *  forms (FB50–FDFF, FE70–FEFF) are REJECTED: Noto draws contextual forms
 *  from GSUB on the standard block, and those ranges are ~1,400 extra glyphs
 *  this page never types. */
const ARABIC_SAFETY = block(0x0600, 0x06ff) + block(0x0750, 0x077f) + block(0x08a0, 0x08ff) + JOINERS;

/** Accented Latin is NOT blanket-included. Measured: adding the Latin-1 and
 *  Latin Extended-A accents costs 12.5 KB on Newsreader roman alone, ~40 KB
 *  across the four faces, against a 60 KB budget for all of them. The census
 *  below picks up every accented character the copy actually uses (place and
 *  person names across 120+ countries do produce some), so the cost is paid
 *  only where it buys something. A name typed for the first time after this
 *  runs renders in the fallback face until the next build — which is the
 *  trade §9.3 asks for when it says "subset to the glyphs actually used". */

/** Every character the build actually emits. */
async function usedCodepoints() {
  const chars = new Set();

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
  try {
    await walk(".next/server/app/");
  } catch (err) {
    if (err && err.code === "ENOENT") {
      console.log("note - no .next/server/app yet; census is empty, SAFETY blocks still apply.\n");
    } else {
      throw err;
    }
  }

  // Control characters are not glyphs.
  for (const ch of [...chars]) {
    const c = ch.codePointAt(0);
    if (c < 0x20 && c !== 0x20) chars.delete(ch);
  }
  return chars;
}

/** A face this script may rewrite. `src` is relative to the repo root of
 *  `helloverify-web`. `optional: true` means "leave the shipped file alone
 *  when the source is missing" — the Latin recovery path. */
const FACES = [
  {
    out: "newsreader-roman.woff2",
    src: "design-src/fonts/latin/newsreader-roman.woff2",
    safety: LATIN_SAFETY,
    optional: true,
  },
  {
    out: "newsreader-italic.woff2",
    src: "design-src/fonts/latin/newsreader-italic.woff2",
    safety: LATIN_SAFETY,
    optional: true,
  },
  {
    out: "instrument-sans.woff2",
    src: "design-src/fonts/latin/instrument-sans.woff2",
    safety: LATIN_SAFETY,
    optional: true,
  },
  {
    out: "geist-mono.woff2",
    src: "design-src/fonts/latin/geist-mono.woff2",
    safety: LATIN_SAFETY,
    optional: true,
  },
  {
    out: "noto-sans-devanagari.woff2",
    src: "design-src/fonts/noto-sans-devanagari.woff2",
    safety: DEVANAGARI_SAFETY,
  },
  {
    out: "noto-serif-devanagari.woff2",
    src: "design-src/fonts/noto-serif-devanagari.woff2",
    safety: DEVANAGARI_SAFETY,
  },
  {
    out: "noto-sans-arabic.woff2",
    src: "design-src/fonts/noto-sans-arabic.woff2",
    safety: ARABIC_SAFETY,
  },
  {
    out: "noto-naskh-arabic.woff2",
    src: "design-src/fonts/noto-naskh-arabic.woff2",
    safety: ARABIC_SAFETY,
  },
];

async function exists(rel) {
  try {
    await access(new URL(rel, root));
    return true;
  } catch {
    return false;
  }
}

const chars = await usedCodepoints();
console.log(`glyph census: ${chars.size} characters across the prerendered pages\n`);

/** Refuse when someone points a face at `.next/static/media`. That directory
 *  holds this script's OUTPUT under `next/font/local`. The old FACES regexes
 *  lived there; keeping the tripwire means a future edit that "just updates
 *  the path" fails here instead of silently narrowing a subset. */
for (const face of FACES) {
  if (face.src.includes(".next/")) {
    console.log(`FAIL - ${face.out} source is ${face.src}.`);
    console.log("       Sources belong under design-src/fonts/, never in the build output.");
    process.exit(1);
  }
}

await mkdir(new URL("src/fonts/", root), { recursive: true });

let before = 0;
let after = 0;
let wrote = 0;
let skipped = 0;

for (const face of FACES) {
  if (!(await exists(face.src))) {
    if (!face.optional) {
      console.log(`FAIL - missing required source ${face.src}`);
      console.log("       Vendor the OFL face under design-src/fonts/ (see this file's header).");
      process.exit(1);
    }
    console.log(`  ${face.out.padEnd(30)}  SKIP  no source at ${face.src}`);
    skipped += 1;
    continue;
  }

  const src = await readFile(new URL(face.src, root));
  const keep = new Set(chars);
  for (const ch of face.safety) keep.add(ch);
  const text = [...keep].sort().join("");
  const out = await subsetFont(src, text, { targetFormat: "woff2" });
  await writeFile(new URL(`src/fonts/${face.out}`, root), out);
  before += src.length;
  after += out.length;
  wrote += 1;
  const pct = ((1 - out.length / src.length) * 100).toFixed(0);
  console.log(
    `  ${face.out.padEnd(30)} ${(src.length / 1024).toFixed(1).padStart(7)} KB -> ` +
      `${(out.length / 1024).toFixed(1).padStart(6)} KB  (-${pct}%)`,
  );
}

console.log(
  `\nwrote ${wrote}, skipped ${skipped}   ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB ` +
    `(§9.1 budget: 60 KB per page; English ceiling is Latin-only)`,
);

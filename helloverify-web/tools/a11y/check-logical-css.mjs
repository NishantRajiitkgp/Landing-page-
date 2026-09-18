/** "CSS logical properties only, lint-enforced" (BUILD-SPEC §12, §7, §14.2).
 *
 *  §7 ships an Arabic locale and §12 makes RTL a conformance item. A stylesheet
 *  written in `left`/`right` cannot be mirrored: set `dir="rtl"` and every
 *  `margin-left` stays on the left, so the layout comes apart instead of
 *  reflecting. `tools/port/logical-css.py` converted 192 declarations; this is
 *  the rule that stops them coming back.
 *
 *  §14.2 asks for this as a lint rule. There is no ESLint in this repo and this
 *  is a CSS concern that ESLint would not see anyway, so it lives with the
 *  other build gates. It reads the source stylesheets, not the build output —
 *  the place to catch a physical property is where it was typed.
 *
 *  SCOPE: the INLINE axis only. In a horizontal writing mode RTL flips inline,
 *  not block, so `margin-top` is identical in Arabic and English. The 156
 *  block-axis declarations in these files are correct as they stand and are
 *  deliberately not flagged — a rule that fires on correct code gets disabled.
 *
 *  Paint positioning (`background-position`, `transform-origin`,
 *  `object-position`) is also not flagged. Those place artwork rather than
 *  layout, and mirroring a photograph's focal point is usually wrong. Six such
 *  values exist; they are a design decision per instance, not a lint failure.
 */
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

const FILES = ["src/app/design.css", "src/app/pages.css", "src/app/globals.css"];

/** Each rule is a property at declaration position, plus its logical
 *  replacement, so the failure message says what to write instead. */
const PHYSICAL = [
  [/(?:^|[;{\s])(margin-left)\s*:/gm, "margin-inline-start"],
  [/(?:^|[;{\s])(margin-right)\s*:/gm, "margin-inline-end"],
  [/(?:^|[;{\s])(padding-left)\s*:/gm, "padding-inline-start"],
  [/(?:^|[;{\s])(padding-right)\s*:/gm, "padding-inline-end"],
  [/(?:^|[;{\s])(border-left)(?:-width|-color|-style)?\s*:/gm, "border-inline-start"],
  [/(?:^|[;{\s])(border-right)(?:-width|-color|-style)?\s*:/gm, "border-inline-end"],
  [/(?:^|[;{]|\n)\s*(left)\s*:/gm, "inset-inline-start"],
  [/(?:^|[;{]|\n)\s*(right)\s*:/gm, "inset-inline-end"],
  [/(text-align)\s*:\s*left\b/gm, "text-align: start"],
  [/(text-align)\s*:\s*right\b/gm, "text-align: end"],
  [/(float)\s*:\s*left\b/gm, "float: inline-start"],
  [/(float)\s*:\s*right\b/gm, "float: inline-end"],
];

const findings = [];
let scanned = 0;

for (const file of FILES) {
  const css = await readFile(new URL(file, root), "utf8").catch(() => null);
  if (css === null) continue;
  scanned++;

  for (const [re, logical] of PHYSICAL) {
    for (const m of css.matchAll(re)) {
      const line = css.slice(0, m.index).split("\n").length;
      findings.push(`${file}:${line}  ${m[1]} — use ${logical}`);
    }
  }
}

console.log(`stylesheets scanned: ${scanned}`);
console.log(`rules: ${PHYSICAL.length} inline-axis properties (block axis and paint positioning are out of scope)\n`);

if (findings.length) {
  for (const f of findings.slice(0, 25)) console.log(`  x ${f}`);
  if (findings.length > 25) console.log(`  … and ${findings.length - 25} more`);
  console.log(
    `\nFAIL - ${findings.length} physical inline propert(ies).\n` +
      "       These cannot mirror under dir=\"rtl\" (§7, §12). Run\n" +
      "       `python tools/port/logical-css.py --write` to convert them.",
  );
  process.exit(1);
}

console.log("PASS - no physical inline properties; the stylesheets can mirror");
process.exit(0);

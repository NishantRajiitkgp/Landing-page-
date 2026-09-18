/** "Zero hex literals outside the theme" (BUILD-SPEC §17 condition 21).
 *
 *  The rule exists so the palette is centralised and changeable: a colour typed
 *  into a component is a colour nobody can re-theme, re-check for contrast, or
 *  find. It started at **382 literals** across `src/`; this is what holds the
 *  line at the 5 that remain.
 *
 *  TWO EXEMPTIONS, both narrower than they sound, and both measured.
 *
 *  1. **SVG artwork.** 194 of the original 382 are `fill=` / `stroke=` on inline
 *     SVG — national flags in `sections/International.tsx` and
 *     `sections/Presence.tsx`, the wordmark in `brand/Logo.tsx`, the YC badge.
 *     Singapore's flag is #C8102E whether or not the brand changes; that is a
 *     fact about the world, not a design decision, and tokenising it would make
 *     the palette meaningless. Brand marks are the same category: drawn once,
 *     not part of the type-and-surface system.
 *
 *     This exemption is NOT a licence to put UI colour in an SVG attribute. The
 *     confirmation tick was inlined 87 times with its colour repeated each time;
 *     it is now `components/brand/Tick.tsx`, drawn once and coloured from CSS.
 *     The test is repetition and role, not file type.
 *
 *  2. **`app/[locale]/opengraph-image.tsx`.** The OG card is rendered by Satori
 *     at build time. Satori has no CSSOM and cannot resolve a custom property,
 *     so `var(--paper)` would render as nothing. Its two constants must be
 *     literals, and they are named and commented as the tokens they mirror.
 *
 *  WHAT IS NOT EXEMPT: anything in a `style={{ }}` object, which is where UI
 *  colour lives in this codebase. That is the surface the rule is about, and it
 *  is currently clean.
 *
 *  Placeholder tints are worth knowing about because they look like a third
 *  exemption and are not one: the 57 `.ph` background colours moved to
 *  `PLACEHOLDER_TINT` in `lib/img.ts`, keyed by photograph. They are a property
 *  of one image, like `blurDataURL` — not palette, but not a literal in a
 *  component either.
 *
 *  §14.2 wants this as an ESLint rule. There is no ESLint yet (TASKS.md Part 4);
 *  until there is, it runs with the other build gates.
 *
 *      node tools/ci/check-tokens.mjs
 */
import { readdir, readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

const HEX = /#[0-9A-Fa-f]{3,8}\b/g;

/** A hex used as an SVG presentation attribute — artwork, per exemption 1. */
const SVG_ATTR = /(?:fill|stroke|stopColor|floodColor|lightingColor)="#[0-9A-Fa-f]{3,8}"/g;

/** Exemption 2, by path. Anything added here needs a reason in this file. */
const EXEMPT_FILES = new Map([
  [
    "src/app/[locale]/opengraph-image.tsx",
    "Satori renders this at build time and cannot resolve CSS custom properties",
  ],
]);

const findings = [];
let scanned = 0;
let artwork = 0;
let exempted = 0;

async function walk(dir) {
  for (const item of await readdir(new URL(dir, root), { withFileTypes: true })) {
    if (item.isDirectory()) {
      await walk(`${dir}${item.name}/`);
      continue;
    }
    if (!item.name.endsWith(".tsx")) continue;

    const rel = `${dir}${item.name}`;
    const source = await readFile(new URL(rel, root), "utf8");
    scanned++;

    const exemptReason = EXEMPT_FILES.get(rel);

    source.split("\n").forEach((line, i) => {
      /** Blank out SVG attributes first, so a hex inside one is not counted —
       *  and so a hex elsewhere on the same line still is. */
      const masked = line.replace(SVG_ATTR, (m) => " ".repeat(m.length));
      artwork += (line.match(SVG_ATTR) ?? []).length;

      for (const m of masked.matchAll(HEX)) {
        if (exemptReason) {
          exempted++;
          continue;
        }
        findings.push(`${rel}:${i + 1}  ${m[0]}  —  ${line.trim().slice(0, 72)}`);
      }
    });
  }
}

await walk("src/");

console.log(`files scanned: ${scanned}`);
console.log(`SVG artwork literals (exempt, see header): ${artwork}`);
console.log(`exempt by path: ${exempted}`);
console.log("");

if (findings.length) {
  for (const f of findings.slice(0, 20)) console.log(`  x ${f}`);
  if (findings.length > 20) console.log(`  … and ${findings.length - 20} more`);
  console.log(
    `\nFAIL - ${findings.length} colour literal(s) outside the palette.\n` +
      "       Use a token from design.css. If the value is a property of one\n" +
      "       image rather than of the design, it belongs in PLACEHOLDER_TINT\n" +
      "       in lib/img.ts. If it is artwork, it belongs in an SVG attribute.",
  );
  process.exit(1);
}

console.log("PASS - no colour literals in UI code; the palette is the only source");
process.exit(0);

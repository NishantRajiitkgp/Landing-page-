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

/** Comments are stripped before anything is matched, replaced by their own
 *  newline count so reported line numbers stay true.
 *
 *  Not hypothetical: the `--flip` comment added to `globals.css` in Part 9
 *  quotes `translateX(-50%)` while explaining why it exists, and the first run
 *  of the new rules below counted it as a declaration. A gate that fails on its
 *  own documentation gets its documentation deleted. */
const COMMENTS = /\/\*[\s\S]*?\*\//g;
const decomment = (css) => css.replace(COMMENTS, (m) => "\n".repeat((m.match(/\n/g) ?? []).length));

/** Split a shorthand on whitespace, but never inside parentheses.
 *
 *  `padding: 15px clamp(24px, 8.334vw, 120px)` is TWO values. A naive split
 *  reads it as four with an asymmetric pair, and the patch script that first
 *  did this conversion tried to rewrite that working declaration into nonsense
 *  before a count assertion stopped it. */
function values(text) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (depth === 0 && /\s/.test(ch)) {
      if (cur) out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

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

/** Four-value `padding`/`margin` whose left and right differ.
 *
 *  THE BLIND SPOT THAT MATTERED. `PHYSICAL` above matches property NAMES, so
 *  `padding: 0 12px 0 10px` is invisible to it -- there is no `padding-left`
 *  token anywhere in the line. Sixteen of these were in `design.css` and two in
 *  `pages.css` when `dir="rtl"` was first rendered, and `.pin`'s was one of the
 *  two declarations that pushed four boxes off the homepage at both
 *  breakpoints. A symmetric four-value shorthand is left alone: if right equals
 *  left it already mirrors. */
const SHORTHAND = /\b(padding|margin)\s*:\s*([^;{}]+);/g;

/** `transform-origin`'s inline edge, which has no logical keyword in CSS.
 *
 *  The module comment above exempts paint positioning, and that exemption is
 *  still right for `background-position` and `object-position` -- mirroring a
 *  photograph's focal point usually is wrong. It was NOT right for
 *  `transform-origin`, because all five uses here are `scaleX` growth
 *  animations anchored to the inline start, not artwork placement. They read
 *  `var(--origin-x)` now (declared in `globals.css`), so a literal is a
 *  regression rather than a decision. */
const ORIGIN = /(transform-origin)\s*:\s*(?:left|right)\b/g;

/** `background-position` naming an inline edge outside a `[dir=]` rule.
 *
 *  One exists: the custom `<select>` chevron in `pages.css`. It genuinely
 *  cannot be written logically, so the rule is not "never" but "say which
 *  direction" -- a `[dir="rtl"]` companion has to exist in the same file. */
const BG_POSITION = /(background-position)\s*:\s*[^;]*\b(?:left|right)\b/g;

/** Non-zero `translateX` that does not go through `--flip`, and gradients with
 *  a horizontal component. CAPPED, NOT FORBIDDEN, and the cap is the argument.
 *
 *  These are motion and paint direction, not layout: a sheen that sweeps
 *  left-to-right and a 135deg gradient are each a per-instance design decision,
 *  and `tools/e2e/rtl.spec.ts` cannot see either -- geometry does not know which
 *  way a thing is travelling or shading. Reported every run so the population
 *  is visible, and failing above the cap so it cannot grow without someone
 *  deciding to. Same shape as `check-css-color.mjs`'s `BOARD_CAP`.
 *
 *  THE CAP HAS ALREADY PAID FOR ITSELF. It started at 13. One page still
 *  failed the RTL suite after the first conversion pass, and the element
 *  responsible was in this inventory rather than outside it:
 *  `.dayaxis span:last-child`'s `translateX(-100%)`, which pulls the last axis
 *  label inside the plot's end. Three of the 13 turned out to be layout and
 *  were flipped; the remaining 10 are `shimmer`, `sheen` and `.lic::after` --
 *  sweeps across a surface, where the direction a highlight travels in Arabic
 *  is a design call and no box moves outside the viewport either way.
 *
 *  `translateX(0)` is direction-neutral and excluded; the `drift` keyframe's
 *  `from` is one. */
const TRANSLATE_X = /translateX\((?:[^()]|\([^()]*\))*\)/g;
const ZERO_X = /^translateX\(\s*0\w*\s*\)$/;
const GRADIENT = /(?:linear|repeating-linear)-gradient\(\s*(to\s+(?:left|right)(?:\s+\w+)?|-?\d+(?:\.\d+)?deg)/g;
const CAP = { translateX: 10, gradient: 14 };

/** A gradient angle with any horizontal component. 0deg and 180deg are purely
 *  vertical and mirror to themselves; `to left`/`to right` always flip. */
function horizontal(axis) {
  if (!axis.includes("deg")) return true;
  const mod = ((parseFloat(axis) % 180) + 180) % 180;
  return mod > 1 && mod < 179;
}

const findings = [];
const capped = { translateX: [], gradient: [] };
let scanned = 0;

for (const file of FILES) {
  const raw = await readFile(new URL(file, root), "utf8").catch(() => null);
  if (raw === null) continue;
  scanned++;
  const css = decomment(raw);
  const at = (index) => css.slice(0, index).split("\n").length;

  for (const [re, logical] of PHYSICAL) {
    for (const m of css.matchAll(re)) {
      findings.push(`${file}:${at(m.index)}  ${m[1]} — use ${logical}`);
    }
  }

  for (const m of css.matchAll(SHORTHAND)) {
    const parts = values(m[2]);
    if (parts.length !== 4 || parts[1] === parts[3]) continue;
    const [top, right, bottom, left] = parts;
    const block = top === bottom ? top : `${top} ${bottom}`;
    findings.push(
      `${file}:${at(m.index)}  ${m[1]}: ${m[2]} — left and right differ; ` +
        `use ${m[1]}-block: ${block}; ${m[1]}-inline: ${left} ${right}`,
    );
  }

  for (const m of css.matchAll(ORIGIN)) {
    findings.push(`${file}:${at(m.index)}  ${m[0]} — use transform-origin: var(--origin-x)`);
  }

  for (const m of css.matchAll(BG_POSITION)) {
    if (css.includes('[dir="rtl"]')) continue;
    findings.push(`${file}:${at(m.index)}  ${m[0]} — needs a [dir="rtl"] companion in this file`);
  }

  for (const m of css.matchAll(TRANSLATE_X)) {
    if (m[0].includes("var(--flip)") || ZERO_X.test(m[0])) continue;
    capped.translateX.push(`${file}:${at(m.index)}  ${m[0]}`);
  }

  for (const m of css.matchAll(GRADIENT)) {
    if (!horizontal(m[1])) continue;
    capped.gradient.push(`${file}:${at(m.index)}  gradient ${m[1]}`);
  }
}

console.log(`stylesheets scanned: ${scanned}`);
console.log(
  `rules: ${PHYSICAL.length} inline-axis properties, asymmetric four-value shorthands,\n` +
    "       transform-origin, background-position (block axis and object-position are out of scope)\n",
);

for (const key of ["translateX", "gradient"]) {
  const found = capped[key];
  console.log(`  ${key}: ${found.length} unflipped, cap ${CAP[key]}`);
  if (found.length > CAP[key]) {
    for (const f of found.slice(0, 25)) console.log(`    ! ${f}`);
    findings.push(
      `${key}: ${found.length} unflipped occurrences, cap is ${CAP[key]} — ` +
        "flip it with var(--flip), or raise the cap and say why in this file",
    );
  }
}
console.log("");

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

/** Colour contrast, computed from the tokens (BUILD-SPEC §12, WCAG 2.2 AA 1.4.3).
 *
 *  §12 lists "Every token pair verified" as a requirement and names the
 *  precedent: the old brand `#007AFF` measured 4.02:1 on white, failed AA, was
 *  used 455 times, and was replaced by `#1A3FCB` (8.02:1). That token is gone
 *  from this repo — verified, zero occurrences. This is the check that keeps it
 *  that way and covers every other pair.
 *
 *  WHY THIS EXISTS SEPARATELY FROM AXE. `check-axe.mjs` runs the real axe-core
 *  ruleset but in jsdom, which does no layout, so axe's `color-contrast` rule
 *  cannot run there. Computing from the token table is not a weaker substitute —
 *  it is stricter. axe samples rendered pixels and SKIPS any text whose
 *  background it cannot resolve (gradients, images, transparency), which on a
 *  design like this one is a lot of text. A token table has no such gaps.
 *
 *  It reads `design.css` and `pages.css`, which are GENERATED from the canvas by
 *  `tools/port/build-css.py` and carry a "do not hand-edit" header. That is
 *  precisely why the check reads them rather than a hand-kept list: the numbers
 *  come from whatever the generator last emitted.
 *
 *  Run any time — it needs no build:
 *      node tools/a11y/check-contrast.mjs
 */
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

/** WCAG 2.2 AA, 1.4.3. "Large" is >=24px, or >=18.66px when bold. */
const AA_NORMAL = 4.5;
const AA_LARGE = 3.0;

/** Text colours that are knowingly below their threshold, with the measurement
 *  and the reason. An entry here is a DECISION, visible in the diff — not a way
 *  to make the gate quiet.
 *
 *  Nothing may be added without a number and a sentence. */
const ACCEPTED = [
  {
    token: "faint",
    on: "paper",
    measured: 2.43,
    reason:
      "40 selectors use --faint as text, all 10.5-12px mono labels (eyebrows, " +
      "axis labels, table headers), so the threshold is 4.5:1 and the gap is " +
      "large. The lightest value that passes is #716F68 — which measures 1.06:1 " +
      "against --muted (#6F6B62), i.e. visually the same colour. So the design's " +
      "third text tier is not achievable at AA on this paper: closing it means " +
      "either collapsing --faint into --muted or enlarging 40 label styles. " +
      "Both are DESIGN.md decisions. This is the site's one remaining AA text " +
      "failure and it is the §17 box that is still open.",
  },
];

// ─────────────────────────────────────────────────────────── colour maths
const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255);
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// ─────────────────────────────────────────────────────────── the inputs
const css = [
  await readFile(new URL("src/app/design.css", root), "utf8"),
  await readFile(new URL("src/app/pages.css", root), "utf8"),
].join("\n");

/** The token table, from the `:root` the generator emits. */
const tokens = Object.fromEntries(
  [...css.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{3,8})/g)].map((m) => [m[1], m[2].toUpperCase()]),
);

/** §12 names this one explicitly. It is gone; the assertion stops it returning
 *  through a copy-paste from the old repo, which still uses it. */
const banned = Object.entries(tokens).filter(([, v]) => v === "#007AFF");

/** The surfaces text sits on. `paper` is the page; `white` is cards and
 *  receipts; `ink` is the reversed bands (the closing CTA, the dark strips). */
const SURFACES = { paper: tokens.paper, white: "#FFFFFF", ink: tokens.ink };

/** Every rule that sets a text colour from a token, with its font-size if the
 *  same rule states one. Rules are `selector { decls }`; a token used as `color`
 *  is text, a token used as `background`/`border` is not and is out of 1.4.3's
 *  scope (that is 1.4.11, non-text contrast, which needs layout). */
const usages = new Map();
for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
  const [, selector, body] = m;
  for (const c of body.matchAll(/(?:^|[;{\s])color:\s*var\(--([a-z-]+)\)/g)) {
    const token = c[1];
    if (!tokens[token]) continue;
    const size = Number(body.match(/font-size:\s*([\d.]+)px/)?.[1] ?? 16);
    const bold = /font-weight:\s*(600|700|800|900|bold)/.test(body);
    const entry = usages.get(token) ?? { count: 0, smallest: Infinity, boldAtSmallest: false, sample: "" };
    entry.count++;
    if (size < entry.smallest) {
      entry.smallest = size;
      entry.boldAtSmallest = bold;
      entry.sample = selector.trim().replace(/\s+/g, " ").slice(0, 48);
    }
    usages.set(token, entry);
  }
}

// ─────────────────────────────────────────────────────────── the report
const failures = [];
const accepted = [];

console.log(`tokens: ${Object.keys(tokens).length}   text usages parsed: ${usages.size} token(s)\n`);
console.log("  token      smallest use   on paper   required   verdict");

for (const [token, use] of [...usages].sort((a, b) => a[1].smallest - b[1].smallest)) {
  const large = use.smallest >= 24 || (use.boldAtSmallest && use.smallest >= 18.66);
  const required = large ? AA_LARGE : AA_NORMAL;
  const measured = ratio(tokens[token], SURFACES.paper);
  const ok = measured >= required;
  const exempt = ACCEPTED.find((a) => a.token === token);

  const verdict = ok ? "ok" : exempt ? "ACCEPTED" : "FAIL";
  console.log(
    `  --${token.padEnd(9)} ${String(use.smallest).padStart(6)}px${large ? " (lg)" : "     "}` +
      `  ${measured.toFixed(2).padStart(7)}  ${required.toFixed(1).padStart(9)}   ${verdict}`,
  );

  if (!ok && !exempt) {
    failures.push(
      `--${token} is ${measured.toFixed(2)}:1 on --paper but is used as text at ` +
        `${use.smallest}px (${use.sample}), which needs ${required}:1. ` +
        `${use.count} selector(s).`,
    );
  }
  if (!ok && exempt) accepted.push({ ...exempt, measured, required, use });
}

if (banned.length) {
  failures.push(
    `#007AFF is back, as ${banned.map(([k]) => `--${k}`).join(", ")}. ` +
      `§12 names it as the known live failure: 4.02:1, fails AA.`,
  );
}

if (accepted.length) {
  console.log("\naccepted, with reasons:");
  for (const a of accepted) {
    console.log(`  - --${a.token} on --${a.on}: ${a.measured.toFixed(2)}:1, needs ${a.required}:1`);
    console.log(`    ${a.reason.replace(/(.{76})\s/g, "$1\n    ")}`);
  }
}

console.log("");
if (failures.length) {
  for (const f of failures) console.log(`  x ${f}`);
  console.log(
    `\nFAIL - ${failures.length} token(s) below their WCAG 2.2 AA threshold.\n` +
      "       Either change the token or add it to ACCEPTED with a measurement\n" +
      "       and a reason — §12 is a procurement requirement, so silence is not\n" +
      "       an option either way.",
  );
  process.exit(1);
}

console.log(
  accepted.length
    ? `PASS - no new contrast failures. ${accepted.length} accepted, listed above.`
    : "PASS - every text token meets its WCAG 2.2 AA threshold.",
);
process.exit(0);

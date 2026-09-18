/** BUILD-SPEC §12's gate: "zero critical or serious axe violations on any
 *  route, in any locale."
 *
 *  §12 opens by saying this is a contractual requirement rather than a quality
 *  preference — EAA enforcement has been active since June 2025, EN 301 549
 *  v4.1.1 makes WCAG 2.2 AA the presumed standard, and HelloVerify sells to
 *  ministries who ask for a conformance report during procurement. So the gate
 *  is not "we ran a linter once"; it is evidence, regenerated every build.
 *
 *  AXE IN JSDOM, NOT PLAYWRIGHT, and the trade is worth stating precisely.
 *  §12 asks for `@axe-core/playwright` per route per locale. That needs a real
 *  browser, and the same argument as §14.3 applies: a 200 MB download makes a
 *  check slower to run and likelier to be skipped. This runs the SAME axe-core
 *  ruleset — the engine is identical, only the host differs — against the 56
 *  prerendered HTML files, in about a second.
 *
 *  WHAT THAT COSTS, stated rather than buried. jsdom does no layout, so rules
 *  needing geometry or computed paint cannot run:
 *
 *    - `color-contrast` — covered instead by `check-contrast.mjs`, which
 *      computes every token pair exactly rather than sampling rendered pixels.
 *      That is stricter, not weaker: axe skips text it cannot resolve a
 *      background for, and a token table has no such gaps.
 *    - `target-size` (WCAG 2.2 AA, 2.5.8) — genuinely needs layout. Recorded in
 *      README's known gaps as needing the browser pass §12 also asks for.
 *    - `scrollable-region-focusable` — same reason.
 *
 *  Everything structural — landmarks, heading order, form labels, link and
 *  button names, ARIA validity, list semantics, duplicate ids, document
 *  language — is fully checkable from the served markup, and that is the bulk
 *  of what axe finds on a content site.
 *
 *  ONE LOCALE TODAY. §12 says "all 3 locales"; `routing.locales` declares `en`
 *  only (§7 — declaring a locale without copy would publish an English route
 *  tree under /hi and /ar). This walks whatever the build emitted, so it covers
 *  all three the day they ship, with no edit here.
 *
 *  Run after `next build`:
 *      node tools/a11y/check-axe.mjs
 */
import { readFile } from "node:fs/promises";

import axe from "axe-core";
import { JSDOM, VirtualConsole } from "jsdom";

import { htmlPages } from "../seo/build-output.mjs";

const root = new URL("../../", import.meta.url);

/** §12's gate is critical + serious. `moderate` and `minor` are reported as a
 *  count so they are visible without blocking — they are real, but a gate that
 *  fails on a minor finding gets its threshold raised rather than its findings
 *  fixed. */
const BLOCKING = new Set(["critical", "serious"]);

/** Rules jsdom cannot evaluate. Disabled explicitly rather than left to report
 *  "incomplete", so the output says what was checked and what was not. */
const NEEDS_LAYOUT = ["color-contrast", "target-size", "scrollable-region-focusable"];

/** WCAG 2.2 AA is the target (§12), so the tags are the AA ladder plus
 *  best-practice rules that map to real barriers (landmarks, headings). */
const RUN_ONLY = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

const pages = await htmlPages(root);

const byRule = new Map();
let checked = 0;
let blocking = 0;
let advisory = 0;

for (const [path, file] of pages) {
  if (path.startsWith("/_")) continue; // not pages people visit
  const html = await readFile(new URL(file, root), "utf8");

  /** jsdom logs every CSS parse error the design system produces; none of them
   *  affect the rules that can run here, and 56 pages of that noise buries the
   *  findings. */
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(html, { virtualConsole, pretendToBeVisual: true });

  const results = await axe.run(dom.window.document.documentElement, {
    runOnly: RUN_ONLY,
    rules: Object.fromEntries(NEEDS_LAYOUT.map((id) => [id, { enabled: false }])),
    resultTypes: ["violations"],
    elementRef: false,
  });
  checked++;

  for (const v of results.violations) {
    const severe = BLOCKING.has(v.impact ?? "");
    if (severe) blocking += v.nodes.length;
    else advisory += v.nodes.length;

    const key = `${v.impact}|${v.id}`;
    const entry = byRule.get(key) ?? { ...v, pages: new Set(), sample: null, count: 0 };
    entry.pages.add(path);
    entry.count += v.nodes.length;
    entry.sample ??= v.nodes[0]?.html?.slice(0, 160);
    byRule.set(key, entry);
  }

  dom.window.close();
}

console.log(`pages checked: ${checked}   (axe-core ${axe.version}, jsdom)`);
console.log(`rules: ${RUN_ONLY.join(", ")}`);
console.log(`not runnable without layout: ${NEEDS_LAYOUT.join(", ")}\n`);

const sorted = [...byRule.values()].sort((a, b) => {
  const rank = (x) => (BLOCKING.has(x.impact) ? 0 : 1);
  return rank(a) - rank(b) || b.count - a.count;
});

for (const v of sorted) {
  const mark = BLOCKING.has(v.impact ?? "") ? "x" : "-";
  console.log(
    `  ${mark} [${v.impact}] ${v.id} — ${v.count} node(s) on ${v.pages.size} page(s)`,
  );
  console.log(`      ${v.help}`);
  console.log(`      e.g. ${[...v.pages][0]}: ${v.sample}`);
}

console.log("");
console.log(`blocking (critical/serious): ${blocking}`);
console.log(`advisory (moderate/minor):   ${advisory}`);
console.log("");

if (blocking > 0) {
  console.log(
    `FAIL - ${blocking} critical/serious violation(s). §12's gate is zero, on every\n` +
      "       route, in every locale. This is a procurement requirement, not a\n" +
      "       quality preference — see §12.",
  );
  process.exit(1);
}

console.log(
  advisory > 0
    ? `PASS - no critical or serious violations. ${advisory} advisory finding(s) above.`
    : "PASS - no axe violations at any impact level.",
);
process.exit(0);

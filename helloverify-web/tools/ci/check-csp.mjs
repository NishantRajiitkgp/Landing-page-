/** The CSP's inline-style allowlist, checked against the build (BUILD-SPEC §13).
 *
 *  `next.config.ts` sets `style-src 'self'` plus a short list of `sha256-`
 *  hashes. Those hashes exist for exactly two blocks, and both belong to Next
 *  itself: the inline `<style>` on `/_not-found` and on `/_global-error`.
 *
 *  WHY HASHES AND NOT `'unsafe-inline'`. Relaxing `style-src` site-wide to
 *  style two error pages is the wrong trade: `style-src 'unsafe-inline'` is the
 *  directive that makes CSS-based data exfiltration and a good deal of UI
 *  redressing possible on all 56 real pages. Two hashes cost nothing and keep
 *  the directive tight.
 *
 *  WHY A CHECK IS REQUIRED FOR THEM TO BE SAFE. A pinned hash is a promise
 *  about bytes that a `next` upgrade can break silently — the 404 page would
 *  simply render unstyled, on a page nobody looks at until a customer does.
 *  This reads every inline `<style>` the build emitted and fails if any of them
 *  is not in the allowlist, printing the hash to add. It is the same relation
 *  `check-sitemap.mjs` has to `routes.ts`: the config states an intention, the
 *  gate proves the build still matches it.
 *
 *  `script-src` IS hash-checked now, and not from this config. Next inlines the
 *  RSC flight payload as `self.__next_f.push(...)`, which differs per page —
 *  425 blocks across 58 pages, every one of them changing on every build
 *  because the payload embeds the build id and the chunk names. No static
 *  config can name them, which is why `tools/ci/inject-csp.mjs` computes them
 *  after the build and writes a per-page `<meta http-equiv>`.
 *
 *  So the second half of this gate checks a different relation from the first.
 *  For styles, the config states an intention and the gate proves the build
 *  matches it. For scripts, the build states the hashes and the gate proves
 *  they are the RIGHT hashes for the bytes beside them — because a wrong hash
 *  is silent: the page still paints, and only hydration is gone.
 *
 *  Run after `next build` (which runs the injector):
 *      node tools/ci/check-csp.mjs
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import { htmlPages } from "../seo/build-output.mjs";

const root = new URL("../../", import.meta.url);

/** Must match `style-src` in `next.config.ts`. Two entries, both Next's own
 *  error-page styling. */
const ALLOWED = new Set([
  "sha256-Wwucq8eX2r0YFymkQhDXm5hN0+FfSvI3s4JSSaqa4iw=",
  "sha256-Z5XTK23DFuEMs0PwnyZDO9SWxemQ5HxcpVaBNuUJyWY=",
]);

const pages = await htmlPages(root);

const found = new Map();
for (const [path, file] of pages) {
  const html = await readFile(new URL(file, root), "utf8");
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const hash = "sha256-" + createHash("sha256").update(m[1], "utf8").digest("base64");
    if (!found.has(hash)) found.set(hash, { pages: new Set(), sample: m[1].trim().slice(0, 70) });
    found.get(hash).pages.add(path);
  }
}

console.log(`pages scanned: ${pages.size}`);
console.log(`distinct inline <style> blocks: ${found.size}`);
console.log(`allowlisted in next.config.ts: ${ALLOWED.size}\n`);

const unlisted = [...found].filter(([hash]) => !ALLOWED.has(hash));
const unused = [...ALLOWED].filter((hash) => !found.has(hash));

for (const [hash, info] of found) {
  const mark = ALLOWED.has(hash) ? "ok" : "NOT ALLOWED";
  console.log(`  [${mark}] ${hash}`);
  console.log(`      ${[...info.pages].join(", ")}`);
  console.log(`      ${info.sample}…`);
}

const failures = [];
if (unlisted.length) {
  failures.push(
    `${unlisted.length} inline <style> block(s) are not in the CSP allowlist and ` +
      `would be BLOCKED by style-src.\n      Add to next.config.ts and to ALLOWED here:\n      ` +
      unlisted.map(([h]) => `'${h}'`).join("\n      "),
  );
}
if (unused.length) {
  // Not fatal on its own, but a stale hash means the block it pinned has
  // changed — and the new one is almost certainly in `unlisted` above.
  failures.push(
    `${unused.length} allowlisted hash(es) match nothing in the build — stale:\n      ` +
      unused.join("\n      "),
  );
}

console.log("");
if (failures.length) {
  for (const f of failures) console.log(`  x ${f}\n`);
  console.log(`FAIL - ${failures.length} CSP problem(s)`);
  process.exit(1);
}

// ───────────────────────────────────────────── script-src, per page, by hash

/** Inline `<script>` only — anything with a `src` is governed by `'self'`.
 *  Must stay identical to the pattern in `inject-csp.mjs`; if the two ever
 *  disagree about what counts as an inline script, this gate stops being a
 *  check on that tool and becomes a second opinion. */
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
const CSP_META = /<meta data-csp-hashes[^>]*content="([^"]*)"[^>]*>/;

const scriptProblems = [];
let pagesWithMeta = 0;
let scriptHashes = 0;

for (const [page, file] of pages) {
  const html = await readFile(new URL(file, root), "utf8");
  const meta = CSP_META.exec(html);
  if (!meta) {
    scriptProblems.push(`${page}: no injected script-src meta — did \`inject-csp\` run?`);
    continue;
  }
  pagesWithMeta += 1;
  const policy = meta[1];

  if (policy.includes("unsafe-inline")) {
    scriptProblems.push(`${page}: the injected policy contains 'unsafe-inline'`);
  }

  // The meta is stripped before hashing, exactly as the injector does, so the
  // two are computing over the same bytes.
  const body = html.replace(CSP_META, "");
  const expected = new Set(
    [...body.matchAll(INLINE_SCRIPT)].map(
      ([, src]) => `'sha256-${createHash("sha256").update(src, "utf8").digest("base64")}'`,
    ),
  );
  const listed = new Set(policy.split(/\s+/).filter((t) => t.startsWith("'sha256-")));
  scriptHashes += listed.size;

  const missing = [...expected].filter((h) => !listed.has(h));
  const extra = [...listed].filter((h) => !expected.has(h));
  if (missing.length) {
    scriptProblems.push(
      `${page}: ${missing.length} inline script(s) would be BLOCKED — hash not listed`,
    );
  }
  if (extra.length) {
    // Not merely untidy: a hash that matches nothing means the block it was
    // computed for has changed, and the new one is in `missing` above.
    scriptProblems.push(`${page}: ${extra.length} listed hash(es) match no script — stale`);
  }
}

console.log(
  `\npages with an injected script-src: ${pagesWithMeta} of ${pages.size}` +
    `   (${scriptHashes} hashes, ${(scriptHashes / Math.max(1, pagesWithMeta)).toFixed(1)} per page)`,
);

if (scriptProblems.length) {
  for (const p of scriptProblems.slice(0, 12)) console.log(`  x ${p}`);
  if (scriptProblems.length > 12) console.log(`  … and ${scriptProblems.length - 12} more`);
  console.log(`\nFAIL - ${scriptProblems.length} script-src problem(s)`);
  process.exit(1);
}

console.log(
  "PASS - every inline <style> is allowlisted, and every page's script-src\n" +
    "       lists exactly the hashes of the inline scripts beside it",
);
process.exit(0);

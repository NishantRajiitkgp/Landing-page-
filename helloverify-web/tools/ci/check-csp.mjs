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
 *  `script-src` is NOT hash-checked, because it cannot be: Next inlines the RSC
 *  flight payload as `self.__next_f.push(...)`, which differs per page — 424
 *  blocks across 58 pages. That is why `script-src` keeps `'unsafe-inline'`,
 *  and the long note in `next.config.ts` explains why the nonce §13 asks for is
 *  not available to a statically prerendered site.
 *
 *  Run after `next build`:
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

console.log("PASS - every inline <style> in the build is allowlisted by the CSP");
process.exit(0);

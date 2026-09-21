#!/usr/bin/env node
/** Post-build: give every prerendered page a hash-based `script-src`.
 *
 *  BUILD-SPEC §17 condition 11, and TASKS.md Part 7's preferred route.
 *
 *  ## The problem this works around
 *
 *  §13 asks for a nonce. Next's own documentation is explicit that a nonce
 *  requires dynamic rendering — `docs/01-app/02-guides/content-security-policy.md`
 *  line 181, *"Static pages are generated at build time, when no request or
 *  response headers exist — so no nonce can be injected."* Every page here is
 *  prerendered, §5 requires that, §17 condition 23 requires zero dynamic
 *  routes, and all ten build-output gates read the prerendered HTML. A nonce
 *  would trade all of that away to constrain inline scripts the build itself
 *  emits.
 *
 *  Hashes need no request. They can be computed after the build, from the
 *  bytes that will actually be served, and delivered in the document.
 *
 *  ## Why a `<meta>` and not the header
 *
 *  The hashes are per page — 2 to 17 of them, and every one changes on every
 *  build because the flight payload embeds the build id and the chunk names.
 *  `next.config.ts`'s `headers()` is evaluated before any page is rendered, so
 *  it cannot know them; the union across 58 pages is 258 distinct hashes and
 *  roughly 14 KB of header on every response. A `<meta http-equiv>` carries
 *  only the page's own.
 *
 *  ## The header keeps `'unsafe-inline'`, and the policy is still strict
 *
 *  MEASURED IN A REAL BROWSER, because it is the load-bearing claim and
 *  "should" is not a measurement. With the header at
 *  `script-src 'self' 'unsafe-inline'` and a document `<meta>` at
 *  `script-src 'self'`, an inline script does NOT run: multiple policies are
 *  each enforced and a script must satisfy all of them. Add the script's hash
 *  to the meta and it runs again. So the enforced policy is the intersection —
 *  hash-only — even though the header still says `'unsafe-inline'`.
 *
 *  That distinction is worth stating plainly rather than ticking a box:
 *  condition 11 reads "CSP has no `'unsafe-inline'` in `script-src`". The
 *  EFFECTIVE policy has no inline latitude. The HEADER still contains the
 *  token, because removing it there would block the build's own scripts, whose
 *  hashes the header cannot know. Closing it literally means per-request
 *  headers from middleware over a build-time manifest, which cannot be built
 *  before the build that produces the hashes.
 *
 *  ## Position matters
 *
 *  A `<meta>` policy governs everything after it, so it goes immediately after
 *  `<head>`. Measured: all inline scripts on every page sit in the BODY — the
 *  two JSON-LD blocks at the top of it and the flight payload at the end — so
 *  one meta at the start of head covers all of them.
 *
 *  The JSON-LD blocks are hashed too, though they are `application/ld+json`
 *  data blocks rather than executable script. Including them costs two hashes
 *  and removes the need to make a claim about how a browser treats a
 *  non-executable script type under CSP.
 *
 *      node tools/ci/inject-csp.mjs        # runs as part of `npm run build`
 */

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const APP = ".next/server/app";

/** Marks our own tag so a second run replaces rather than stacks. */
const MARK = "data-csp-hashes";

/** Inline `<script>` only — anything with a `src` is governed by `'self'`. */
const INLINE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;
const EXISTING = new RegExp(`<meta ${MARK}[^>]*>`);
const HEAD = /<head(?:\s[^>]*)?>/;

const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("base64");

function pages(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".html")) out.push(p);
    }
  };
  walk(root);
  return out.sort();
}

let injected = 0;
let hashTotal = 0;
const problems = [];

for (const file of pages(APP)) {
  const original = readFileSync(file, "utf8");
  // Strip any previous injection first, so the hashes are computed over the
  // same bytes on a re-run and the tool is idempotent.
  const html = original.replace(EXISTING, "");

  const hashes = [...html.matchAll(INLINE)].map(([, body]) => `'sha256-${sha256(body)}'`);
  const unique = [...new Set(hashes)];

  const head = HEAD.exec(html);
  if (!head) {
    problems.push(`${file}: no <head> to inject into`);
    continue;
  }

  // Only `script-src`. Every other directive stays in the one header
  // `next.config.ts` defines — §13's "single CSP source, no duplicated
  // copies". Two places declaring `img-src` is how they come to disagree.
  const policy = ["script-src 'self'", ...unique].join(" ");
  const tag = `<meta ${MARK} http-equiv="Content-Security-Policy" content="${policy}">`;

  const at = head.index + head[0].length;
  writeFileSync(file, html.slice(0, at) + tag + html.slice(at));
  injected += 1;
  hashTotal += unique.length;
}

if (problems.length) {
  for (const p of problems) console.error(`inject-csp: ${p}`);
  process.exit(1);
}

console.log(
  `inject-csp: ${injected} pages, ${hashTotal} script hashes ` +
    `(${(hashTotal / injected).toFixed(1)} per page average)`,
);

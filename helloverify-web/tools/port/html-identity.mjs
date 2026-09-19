#!/usr/bin/env node
/** Byte-identity of the prerendered HTML, across a source change.
 *
 *  BUILD-SPEC §4 rule 2 / §17 condition 22 is being met by splitting the
 *  oversized section components (TASKS.md Part 5), and a split changes no
 *  values — so the emitted markup must not move by a byte. This is the one
 *  place in this repo where byte-identity IS the right test: Part 3 corrected
 *  the criterion for tokenisation, where `#F6F4EF` and `var(--paper)` are
 *  different bytes and identical rendering, but here neither side of the
 *  comparison is meant to change at all.
 *
 *      node tools/port/html-identity.mjs snapshot <dir>   # before the change
 *      npm run build
 *      node tools/port/html-identity.mjs compare  <dir>   # after it
 *
 *  It has already earned its keep three times, none of them visible in a diff
 *  of the source: `PeopleStrip.tsx` had a caption row silently dropped and a
 *  progress bar added to a card that never had one, and `Packages.tsx` had nine
 *  `<!-- -->` hydration separators that `{p.lines.length} checks` emits and
 *  `` {`${n} checks`} `` does not.
 *
 *  ## What is compared, and what is deliberately not
 *
 *  **The build id is normalised.** Next mints a fresh 21-character `BUILD_ID`
 *  per build and embeds it in every page, so without that one substitution all
 *  58 files differ and the check reports nothing. Measured against also
 *  normalising script `src` hashes: once the build id was neutralised, 57 of 58
 *  pages were already byte-equal, so the chunk names here carry no content
 *  hash and normalising them would only have widened the blind spot.
 *
 *  **The markup and the flight payload are counted separately, and the payload
 *  difference has to be opted into with `--allow-payload`.** Each page holds
 *  both: the server-rendered HTML, and the React flight payload that hydration
 *  replays, pushed in `<script>self.__next_f.push(…)</script>` chunks. Driving
 *  markup from a record list necessarily changes the second even when the first
 *  is untouched, because `.map()` gives every child a `key` and a hand-written
 *  sibling has none — measured on `Packages.tsx`: identical markup on all 58
 *  pages, and a homepage payload 11 shared rows shorter, carrying `["$","$1",
 *  "2",…]` keyed fragments where bare siblings used to be. `PeopleStrip.tsx`
 *  shipped the same shape and its keyed fragments are in `HEAD`'s payload now.
 *
 *  ## A word in this file can change the stylesheet
 *
 *  Tailwind v4 auto-detects its sources and that sweep includes `tools/`, so
 *  any token here that resolves to a utility is generated into the shipped CSS.
 *  Measured, because this file caused it: one sentence using the bare word that
 *  names the CSS property between `border` and `box-shadow` added a 165-byte
 *  rule to `chunks/*.css` on every page, and moved the chunk hash — which this
 *  tool then reported against itself. Keep utility-shaped words out of the
 *  prose here. The general fix, restricting Tailwind's globs to `src/`, is a
 *  carried finding in TASKS.md rather than part of a refactor commit.
 *
 *  So the payload cannot be asserted equal through this kind of refactor. It is
 *  still reported, and still fails the run unless the flag says the deviation
 *  was expected, because "the payload moved" is the one signal left that the
 *  React tree changed shape somewhere the markup does not show it.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const APP = ".next/server/app";
const BUILD_ID_FILE = ".next/BUILD_ID";
const MANIFEST = "build-id.txt";

/** Every prerendered page, as paths relative to `root`. */
function pages(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".html")) out.push(relative(root, p).split("\\").join("/"));
    }
  };
  walk(root);
  return out.sort();
}

/** The build id is substituted literally, with each side's own id, rather than
 *  by a pattern — a page that merely looks like it contains an id cannot be
 *  blanked by accident. */
function read(path, buildId) {
  return readFileSync(path, "utf8").split(buildId).join("<BUILD_ID>");
}

const PUSH = /<script>self\.__next_f\.push\(.*?\)<\/script>/gs;
const markupOf = (html) => html.replace(PUSH, "<PUSH>");

/** The emitted stylesheet, whose name is a hash of its contents.
 *
 *  Found by breaking this tool rather than by reading Next's source: deleting
 *  one `className="btn btn-line full"` link from `Packages.tsx` renamed the CSS
 *  chunk, because Tailwind generates from the classes it finds in `src/`, and
 *  that name is in the `<link>` of every page. All 58 then reported a markup
 *  difference and the one real one was lost in the noise.
 *
 *  So it is pulled out and compared once. It is NOT quietly normalised away: a
 *  split changes no classes, so a moved stylesheet hash is itself a regression
 *  and fails the run. Normalising it and moving on would have hidden exactly
 *  the mutation that found it. */
const CSS_CHUNK = /\/_next\/static\/chunks\/[a-z0-9]+\.css/g;
const stylesheets = (html) => new Set(html.match(CSS_CHUNK) ?? []);

function snapshot(dir) {
  if (!existsSync(APP)) fail(`no ${APP} — run \`npm run build\` first`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const list = pages(APP);
  for (const rel of list) {
    const dest = join(dir, rel);
    mkdirSync(join(dest, ".."), { recursive: true });
    cpSync(join(APP, rel), dest);
  }
  writeFileSync(join(dir, MANIFEST), readFileSync(BUILD_ID_FILE, "utf8").trim());
  console.log(`snapshot: ${list.length} pages -> ${dir}`);
}

/** The first differing region, with enough context either side to name it.
 *  Reported once per file: a split that goes wrong goes wrong repeatedly, and
 *  58 pages × every occurrence is unreadable. */
function firstDiff(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const ctx = 90;
  return { at: i, old: a.slice(Math.max(0, i - ctx), i + ctx), new: b.slice(Math.max(0, i - ctx), i + ctx) };
}

function compare(dir, allowPayload) {
  if (!existsSync(join(dir, MANIFEST))) fail(`${dir} is not a snapshot — no ${MANIFEST}`);
  const oldId = readFileSync(join(dir, MANIFEST), "utf8").trim();
  const newId = readFileSync(BUILD_ID_FILE, "utf8").trim();

  const before = pages(dir);
  const after = pages(APP);
  const missing = before.filter((p) => !after.includes(p));
  const extra = after.filter((p) => !before.includes(p));

  // Read once, so the stylesheet can be compared across the whole build before
  // any page is judged on it.
  const pair = new Map();
  const cssBefore = new Set();
  const cssAfter = new Set();
  for (const rel of before) {
    if (missing.includes(rel)) continue;
    const a = read(join(dir, rel), oldId);
    const b = read(join(APP, rel), newId);
    pair.set(rel, [a, b]);
    for (const s of stylesheets(a)) cssBefore.add(s);
    for (const s of stylesheets(b)) cssAfter.add(s);
  }
  const cssMoved = [...cssBefore].some((s) => !cssAfter.has(s)) || cssBefore.size !== cssAfter.size;
  // Substituted only so the per-page diffs show the real difference instead of
  // the hash; the move itself is reported and is fatal.
  const blindCss = (s) => s.replace(CSS_CHUNK, "/_next/static/chunks/<CSS>.css");

  const markupDiff = [];
  const payloadDiff = [];
  for (const rel of before) {
    if (missing.includes(rel)) continue;
    let [a, b] = pair.get(rel);
    if (cssMoved) [a, b] = [blindCss(a), blindCss(b)];
    if (a === b) continue;
    const ma = markupOf(a);
    const mb = markupOf(b);
    if (ma !== mb) markupDiff.push([rel, ma.length, mb.length, firstDiff(ma, mb)]);
    else payloadDiff.push([rel, a.length, b.length, firstDiff(a, b)]);
  }

  for (const rel of missing) console.error(`GONE         ${rel}`);
  for (const rel of extra) console.error(`NEW          ${rel}`);
  if (cssMoved) {
    console.error(
      `STYLESHEET   ${[...cssBefore].join(" ")} -> ${[...cssAfter].join(" ")}\n` +
        `             the class set changed, so this is not a pure split`,
    );
  }
  for (const [rel, la, lb, d] of markupDiff) {
    console.error(`MARKUP       ${rel}  ${la} -> ${lb} bytes, first at ${d.at}`);
    console.error(`  before  …${d.old}…`);
    console.error(`  after   …${d.new}…`);
  }
  for (const [rel, la, lb, d] of payloadDiff) {
    console.error(`PAYLOAD-ONLY ${rel}  ${la} -> ${lb} bytes, first at ${d.at}`);
    console.error(`  before  …${d.old}…`);
    console.error(`  after   …${d.new}…`);
  }

  const n = before.length;
  console.log(`${n - markupDiff.length - missing.length} of ${n} pages byte-identical in markup`);
  console.log(
    `${n - markupDiff.length - payloadDiff.length - missing.length} of ${n} also byte-identical in the flight payload`,
  );

  const fatal =
    missing.length +
    extra.length +
    markupDiff.length +
    (cssMoved ? 1 : 0) +
    (allowPayload ? 0 : payloadDiff.length);
  if (fatal) {
    if (payloadDiff.length && !allowPayload) {
      console.error(
        `\n${payloadDiff.length} page(s) differ only in the flight payload. If that is the expected\n` +
          `cost of driving markup from a list (keys on mapped children), re-run with\n` +
          `--allow-payload and say so in the commit message.`,
      );
    }
    process.exit(1);
  }
}

function fail(msg) {
  console.error(`html-identity: ${msg}`);
  process.exit(1);
}

const argv = process.argv.slice(2);
const allowPayload = argv.includes("--allow-payload");
const [mode, dir] = argv.filter((a) => !a.startsWith("--"));
if (!dir || (mode !== "snapshot" && mode !== "compare")) {
  fail("usage: html-identity.mjs snapshot|compare <dir> [--allow-payload]");
}
if (mode === "snapshot") snapshot(dir);
else compare(dir, allowPayload);

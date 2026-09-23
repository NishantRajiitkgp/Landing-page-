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
 *  blanked by accident.
 *
 *  The CSP meta goes out here, before either question is asked, because it is
 *  neither markup nor payload - see CSP_META below. Putting it in `markupOf`
 *  instead was measured and rejected: the markup verdict came out right (58 of
 *  58 identical across the three condition-22 splits) but the meta stayed in
 *  the raw comparison, so all 58 pages fell into the payload bucket and
 *  "0 of 58 also byte-identical in the flight payload" was true whether or not
 *  a single payload had moved. */
function read(path, buildId) {
  return readFileSync(path, "utf8").split(buildId).join("<BUILD_ID>").replace(CSP_META, "<CSP>");
}

/** A RUN of adjacent push scripts collapses to ONE token, not one each.
 *
 *  Found by `Presence.tsx`, which reported a markup difference of exactly six
 *  bytes: `<PUSH>` once fewer at the very end of the document. Next splits the
 *  flight payload into `<script>` chunks by size, so reshaping the payload
 *  changes how many there are — which is a payload fact, and this function
 *  exists to remove payload facts. Replacing each script with its own token
 *  leaked the count back in, and would have failed every future split on it. */
const PUSH = /(?:<script>self\.__next_f\.push\(.*?\)<\/script>)+/gs;

/** The per-page CSP meta, which is a hash of the scripts above.
 *
 *  Part 7's `tools/ci/inject-csp.mjs` writes `<meta data-csp-hashes
 *  http-equiv="Content-Security-Policy">` carrying the SHA-256 of every inline
 *  script on the page -- and the flight payload is one of those scripts. So the
 *  meta is a pure function of the bytes `PUSH` exists to remove, and leaving it
 *  in made this tool report a markup difference on EVERY page for any change at
 *  all. Measured on the three §17 condition-22 splits: `0 of 58 pages
 *  byte-identical in markup`, all 58 the same byte length as before, and every
 *  first difference inside this attribute. The tool had silently stopped
 *  working when Part 7 landed, because nothing ran it afterwards.
 *
 *  NOT a loss of coverage, which is why normalising it is the right answer here
 *  and was the wrong answer for the stylesheet hash above. A wrong meta is
 *  `check:csp`'s job and it is a far better check than this one: it recomputes
 *  each page's hashes from the bytes beside them and fails on a stale or
 *  missing one. This tool asks a different question -- did the markup move --
 *  and the meta is not markup anyone wrote.
 *
 *  Broken deliberately after adding it: with the meta normalised, changing one
 *  visible word in a split file still fails the run and names the page, so the
 *  normalisation removes a derived field rather than the signal.
 */
const CSP_META = /<meta data-csp-hashes [^>]*>/g;

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
/** `[A-Za-z0-9_-]+`, not `[a-z0-9]+`. Next emits chunk names containing `-`
 *  and `_`, and the narrower class silently matched one side of a comparison
 *  and not the other: measured 23 Sep, the stylesheet moved
 *  `3fcm-v_zu-br-.css` -> `201be97f9ffw9.css`, only the second matched, so
 *  `blindCss` neutralised the new name and left the old one in place and this
 *  tool reported `2 of 62 pages byte-identical in markup` for a change that
 *  never touched markup. A false regression on the one run where a real one
 *  was plausible; the same bug narrowed slightly would report a false pass. */
const CSS_CHUNK = /\/_next\/static\/chunks\/[A-Za-z0-9_-]+\.css/g;
const stylesheets = (html) => new Set(html.match(CSS_CHUNK) ?? []);

/** The emitted client chunks, whose names are hashes of their contents.
 *
 *  Deliberately NOT normalised by default, and this tool's own history is the
 *  argument: through the first eleven extractions not one JS chunk name moved,
 *  because a Server Component's markup never reaches the client bundle.
 *  Splitting `ContactForm.tsx` moved one, correctly — it is a Client Component,
 *  so re-chunking it changes what the browser downloads even when the markup is
 *  identical to the byte. That gets said out loud once and acknowledged with
 *  `--allow-script`, rather than normalised away where nobody would see it. */
const JS_CHUNK = /\/_next\/static\/chunks\/[A-Za-z0-9_-]+\.js/g;
const scripts = (html) => new Set(html.match(JS_CHUNK) ?? []);

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

function compare(dir, allowPayload, allowScript) {
  if (!existsSync(join(dir, MANIFEST))) fail(`${dir} is not a snapshot — no ${MANIFEST}`);
  const oldId = readFileSync(join(dir, MANIFEST), "utf8").trim();
  const newId = readFileSync(BUILD_ID_FILE, "utf8").trim();

  const before = pages(dir);
  const after = pages(APP);
  const missing = before.filter((p) => !after.includes(p));
  const extra = after.filter((p) => !before.includes(p));

  /** Pass one: the chunk names only, then throw the documents away.
   *
   *  The stylesheet and script sets have to be known across the WHOLE build
   *  before any single page is judged, which is why this pass exists. It used
   *  to keep every pair in a `Map` for pass two to reuse -- 62 x 2 documents
   *  live at once, each also regex-scanned, with the intermediates in the same
   *  heap. Measured 23 Sep after the copy layer landed: V8 aborted with
   *  `# Fatal error in , line 0`, no stack and no page named, which reads as
   *  "the build is broken" rather than "this tool needs more memory".
   *  `--max-old-space-size=8192` completed the identical comparison at
   *  62 of 62.
   *
   *  So the documents are dropped here and re-read in pass two. That is double
   *  the I/O on files the OS has just cached, against a peak heap that no
   *  longer scales with the page count. */
  const cssBefore = new Set();
  const cssAfter = new Set();
  const jsBefore = new Set();
  const jsAfter = new Set();
  for (const rel of before) {
    if (missing.includes(rel)) continue;
    const a = read(join(dir, rel), oldId);
    const b = read(join(APP, rel), newId);
    for (const s of stylesheets(a)) cssBefore.add(s);
    for (const s of stylesheets(b)) cssAfter.add(s);
    for (const s of scripts(a)) jsBefore.add(s);
    for (const s of scripts(b)) jsAfter.add(s);
  }
  const cssMoved = [...cssBefore].some((s) => !cssAfter.has(s)) || cssBefore.size !== cssAfter.size;
  const jsGone = [...jsBefore].filter((s) => !jsAfter.has(s));
  const jsNew = [...jsAfter].filter((s) => !jsBefore.has(s));
  const jsMoved = jsGone.length > 0 || jsNew.length > 0;
  // Substituted only so the per-page diffs show the real difference instead of
  // the hash; the move itself is reported and is fatal.
  const blindCss = (s) => s.replace(CSS_CHUNK, "/_next/static/chunks/<CSS>.css");
  const blindJs = (s) => s.replace(JS_CHUNK, "/_next/static/chunks/<JS>.js");

  const markupDiff = [];
  const payloadDiff = [];
  for (const rel of before) {
    if (missing.includes(rel)) continue;
    // Re-read rather than cache; see the note on pass one.
    let [a, b] = [read(join(dir, rel), oldId), read(join(APP, rel), newId)];
    if (cssMoved) [a, b] = [blindCss(a), blindCss(b)];
    if (jsMoved) [a, b] = [blindJs(a), blindJs(b)];
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
  if (jsMoved) {
    console.error(
      `SCRIPT       ${jsGone.join(" ")} -> ${jsNew.join(" ")}\n` +
        `             a client chunk's contents changed — expected only when a Client\n` +
        `             Component was reshaped. Acknowledge with --allow-script.`,
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
    (jsMoved && !allowScript ? 1 : 0) +
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
const allowScript = argv.includes("--allow-script");
const [mode, dir] = argv.filter((a) => !a.startsWith("--"));
if (!dir || (mode !== "snapshot" && mode !== "compare")) {
  fail("usage: html-identity.mjs snapshot|compare <dir> [--allow-payload] [--allow-script]");
}
if (mode === "snapshot") snapshot(dir);
else compare(dir, allowPayload, allowScript);

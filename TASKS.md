# TASKS

The remaining work on the helloverify.com rebuild, in the order it should be
done. One part per sitting: say **"next"** to move to the following part.

Status as measured on **18 September 2026**, branch `feat/leads-api-zoho`.
BUILD-SPEC §17 defines done as 24 conditions — **8 met, 9 partly met, 7 not
started**. The full reading, with evidence per condition, is in the build ledger
artifact and in `helloverify-web/README.md`.

---

## How we work

This is the standing agreement. It matters more than speed, and it is written
here so it survives a cleared context.

1. **Plan first, then stop.** State the plan and any decisions needed. Wait.
2. **Implement.**
3. **Verify by measuring.** "Verified" means a command was run and its output
   read. Never assert how a framework behaves — prove it against the build
   output or against the framework's own source in `node_modules`.
4. **Update the docs that are now wrong.** Including this file.

Rules that have repeatedly earned their place:

- **Break your own guard.** A check that has never failed is not evidence. Every
  gate in this repo has been deliberately broken; the mutation that turns out to
  be a byte-identical no-op gets documented as a no-op rather than counted as
  coverage.
- **Comments explain why, with the measurement in them.** Match the house style
  in `src/lib/seo/*.ts` — §-references to BUILD-SPEC, and the rejected
  alternative stated with its reason.
- **Read `helloverify-web/AGENTS.md` first.** This is Next 16.3.5 and it differs
  from training data; the docs are in `node_modules/next/dist/docs/`.
- **Windows.** Write patch scripts to a `.py` file and run them. Never embed the
  code being patched in a bash-quoted string — bash `$`-expansion and Python
  escapes have silently corrupted files three times (heredoc backslashes, `\b`
  becoming a 0x08 byte inside a regex, `${...}` expanded out of a JS template
  literal). Verify after: `node --check`, `tsc`, or re-read the bytes.
- **Never run an EOL/text normaliser over `src/`** without excluding binaries.
  It holds `app/favicon.ico` and four `.woff2` faces; `\r\n` occurs naturally in
  binary data and a blanket rewrite corrupted three of them.

Before finishing any part:

```sh
cd helloverify-web
npm run build && npm run check:all   # 10 gates
npm test                             # 100 assertions
npm run typecheck
```

And for anything touching routing, headers or redirects:

```sh
npx next start -p 3100 &
npm run probe:redirects http://localhost:3100   # 823 assertions
npm run contract http://localhost:3100          # 27 assertions
```

---

## Part 1 — Checkpoint the work · **DONE (18 Sep 2026)**

Eight thematic commits, `4886729`..`69157b7`, on `feat/leads-api-zoho`. Working
tree clean; build, ten gates, 100 tests and `tsc` all green afterwards.

Two things worth recording:

- **"One commit per item" was not achievable.** `next.config.ts`, `layout.tsx`
  and the 32 page files each carry changes from three or four items, and
  hunk-level splitting (`git add -p`) is interactive, which this environment
  blocks. Commits are therefore file-granular and thematic, and each message
  states what it spans.
- **The real count was 77 files, not 98.** 21 of the 76 "modified" files had
  line-ending-only changes from an earlier EOL normaliser and staged as zero
  content — `core.autocrlf` normalises to LF on staging, so git recorded nothing
  for them. That is more evidence for the `.gitattributes` decision in Part 11.

Not done here, deliberately: no push, no branch strategy, no pipeline.

---

## Part 2 — Apply the three open decisions

Each needs an answer first; none is more than an hour of work once answered.

**2a. `--faint` fails WCAG AA.** It measures **2.43:1** on paper and is used as
text in 40 selectors, all 10–12px uppercase labels (chart axes, table headers,
totals), which need 4.5:1. The lightest passing value is `#716F68` — which
measures **1.06:1 against `--muted`**, i.e. the same colour to the eye. So the
design's third text tier is not achievable at AA on this paper.

- Option A: collapse `--faint` into `--muted`. Loses a tier.
- Option B: enlarge the 40 label styles past the large-text threshold (≥18.66px
  bold or ≥24px), where 3:1 applies.
- Either way it changes DESIGN.md. `tools/a11y/check-contrast.mjs` carries it as
  an explicit ACCEPTED entry meanwhile.

**2b. ISO/IEC 27701 and SOC 2.** The old site claims both (its `llms.txt` and
`seo.ts` respectively); neither is on this site's reviewed credentials list, so
neither is published and the build fails if either reappears. If they are real,
add them to `lib/content/company.ts` **and** `/about` together. If they are not,
the old site is claiming them today and should stop.

**2c. The live site's schema names the wrong city.** The old
`StructuredData.tsx` says Mumbai; confirmed answer is Noida. Worth correcting on
the old site while it is still serving traffic.

**Acceptance:** §17 condition 14 closes; `check:contrast` passes with no ACCEPTED
entries; `check:llms` still rejects the unevidenced certifications.

---

## Part 3 — Design tokens · **DONE (18 Sep 2026)**

**UI colour literals: 119 → 0.** Total hex 382 → 199, the remainder being 194
SVG artwork and 5 OG-card constants, both documented exemptions enforced by
`npm run check:tokens` (gate broken four ways, all caught).

What the measurement changed about the plan:

- **Most of the 382 were not UI colour.** 194 are SVG artwork — national flags,
  the wordmark — which are facts about the world, not palette. 57 were
  per-photograph placeholder tints. Only 119 were design-system colour.
- **The dominant cause was duplication.** One confirmation tick was inlined
  **87 times**, each copy carrying its own hex, plus four local `const Tick`
  declarations (one never used). Now `components/brand/Tick.tsx`.
- **Four new tokens, not seventeen** — `--white`, `--green-light`, `--tick-off`,
  `--ink-soft`. The tints went to `PLACEHOLDER_TINT` in `lib/img.ts`, keyed by
  image, because a tint belongs to a photograph rather than to the design.

**The acceptance criterion in the original plan was wrong**, and is corrected
here for every future part: **byte-identity cannot test a tokenisation**, because
`background:#F6F4EF` and `background:var(--paper)` are different bytes and
identical rendering. Use instead, in order of preference:

1. **Inverse substitution** — resolve every `var(--x)` on *both* sides back to
   its literal, then compare. (Resolving only the new side gives a false
   mismatch once a snapshot itself contains `var()`.)
2. **Source-level positional proof** where the change is a source rewrite —
   compare against `HEAD` rather than against a build.
3. **An explicit chain assertion** where neither applies, as for `currentColor`:
   class → token → value, asserted equal to what it replaced.

Byte-identity remains the right test for a pure refactor that changes no values
at all — the FAQ lift and the component splits in Part 5.

---

## Part 4 — ESLint · **DONE (18 Sep 2026)**

`npm run lint` is real and passes. Flat config with `eslint-config-next`, plus
`hv/no-color-literal` and `hv/logical-css` in `tools/eslint/`. Both broken on
purpose — five mutations fire, two correctly stay silent. CI's Lint step now
runs it instead of explaining itself.

`tools/ci/check-tokens.mjs` was **removed**, not kept alongside: the ESLint rule
does the same job on the AST, so keeping both would be two implementations of
one rule. `check:logical` stays — it reads the stylesheets, which ESLint cannot.

**The AST found what the regex gates could not**, and the biggest item is worth
carrying forward:

- **77 physical properties in inline `style={{ }}` objects.** Every one is an
  RTL blocker that `check:logical` structurally could not see, so Part 3's "192
  declarations converted" undercounted the real job by a third. Fixed by
  `eslint --fix` (the rule ships a fixer) and proved by inverse substitution:
  74 changed lines, 0 unexplained.
- **2 colour literals in `app/manifest.ts`** — now a third documented exemption.
  The manifest is JSON the OS chrome reads before any stylesheet exists.
- **7 React issues in `ContactForm.tsx`**: `ErrorText` was declared inside the
  render body (a new component type every render, so the paragraph remounted
  rather than updated) and `useRef(Date.now())` read the clock during render.
  Both fixed. Worth noting the visible cost of the first was nil — nothing in
  `ErrorText` holds focus or state — so this was a correctness smell, not the
  user-facing bug it first looked like.
- **6 dead `serviceNode` imports** left over from the JSON-LD work.

`react/no-unescaped-entities` is narrowed rather than disabled: it still forbids
`>` and `}`, and no longer forbids a plain apostrophe, which had flagged 71
places in signed-off copy for zero rendered difference.

---

## Part 5 — Split the oversized components · **2 of 9 done**

§4 rule 2 and §17 condition 22. **10 files still exceed 300 lines.**

**The shape is the same in every one: one card written N times.** Measured:

| file | lines | the repeat |
|---|---:|---|
| `HowItWorks.tsx` | 910 | 8 nodes, 8 panels, 18 animated ticks |
| `International.tsx` | 778 | 10 country cards |
| `Consumer.tsx` | 610 | 16 service rows |
| `Presence.tsx` | 532 | 20 flags, 12 rows |
| `Checks.tsx` | 520 | 17 product rows |
| `Why.tsx` | 328 | 10 reason rows |
| `WhoItsFor.tsx` | 324 | 12 cells |
| `ContactForm.tsx` | 328 | — no repeat; a genuine split |
| `security-compliance/page.tsx` | 334 | — |
| `enterprise/page.tsx` | 334 | — |
| ~~`PeopleStrip.tsx`~~ | ~~684~~ → **209** | **done** |
| ~~`Packages.tsx`~~ | ~~712~~ → **294** | **done** |

So the fix is not "cut the file in half" — it is extract the repeated unit and
drive it from a record list, which is what `smb/page.tsx` already does with
`PACKS` and what `components/brand/Tick.tsx` did in Part 3. Each file also holds
a `.dsk` and a `.mob` block, which are NOT the same markup.

**Whether the two breakpoints share one list is a per-file measurement, not a
rule.** PeopleStrip's copy genuinely differed ("Driving licence · 30 min" vs
"Licence · 30 min"), so folding its lists would have meant inventing a shared
string, and they stayed apart. Packages measured the other way: all seven fields
of all three mobile cards were byte-identical to their desktop counterparts, and
only the order and the subset differed, so two lists would have been two copies
of the same words. Check before deciding; do not assume either shape.

**Do not batch these.** PeopleStrip alone produced two regressions that only the
byte-identity check caught:

- the rewrite dropped a whole caption row from the desktop block — two visible
  lines of marketing copy, gone, because the extraction looked at the repeated
  track and not at what followed it;
- and it gave the mobile in-progress card a progress bar it never had, by
  conflating "pulsing dot" with "progress bar".

Neither would have survived a screenshot, and neither was visible in review.

**Method, per file:**

1. Parse the repeated unit's fields out of the existing markup — never retype
   copy.
2. Check whether the halves of any duplicated run are identical before
   collapsing them.
3. Account for everything *outside* the repeated run, which is where both
   regressions above came from.
4. Snapshot `.next/server/app`, rewrite, rebuild, and require **byte-identical**
   markup on all 58 pages — `tools/port/html-identity.mjs snapshot|compare`,
   written for this part. This is the one part where byte-identity IS the right
   test: a split changes no values.

   Three things that harness had to learn, all by being broken:

   - **Normalise the build id.** Next mints a fresh one per build and embeds it
     in every page; without that substitution all 58 files differ and the check
     reports nothing.
   - **The flight payload cannot be held identical, and is reported separately.**
     `.map()` gives every child a `key` where a hand-written sibling has none, so
     the serialised React tree moves even when the markup does not — measured on
     Packages: identical markup on all 58 pages, 11 fewer shared rows and +268
     bytes of payload on the homepage. It still fails the run unless
     `--allow-payload` says the deviation was expected, because a moved payload
     is the only signal left that the tree changed shape invisibly.
   - **The stylesheet hash is its own finding.** Tailwind generates from the
     classes it finds, so dropping one `className` renames `chunks/*.css`, which
     appears in the `<link>` of every page — 58 near-identical diffs hiding the
     one real one. It is now reported once, and is fatal: a pure split changes no
     classes.

**Carried findings:**

- **`WhoItsFor.tsx`'s mobile block renders no photographs.** Desktop has six
  cells with six images; `.mob` repeats the cells with the same tints and zero
  `<Image>`. Fix it while that file is open.
- **`HowItWorks.tsx` holds the last 18 inline ticks**, each with a unique
  `animation` name and dash offset, so they are individually drawn rather than
  repeats of `<Tick>`. Decide there whether they become one component taking a
  delay.
- **Tailwind v4 scans `tools/`, so a word in a build script ships CSS.** The
  new harness used the bare word for the CSS property between `border` and
  `box-shadow` in a comment; Tailwind's extractor read it as a candidate and
  generated a real 165-byte `.outline` rule into `chunks/*.css` on every page,
  moving the chunk hash. Measured by removing the file and rebuilding: 122,086
  bytes back to 121,921. The comment was reworded, but the exposure is general —
  every script in `tools/` that quotes markup is a source of phantom utilities,
  and `check:perf` measures the total without questioning what is in it. The fix
  is to restrict Tailwind's source globs to `src/`; it is not in the refactor
  commit because it is a build-config change, not a split.
- **`hv/no-color-literal` only matches hex.** `rgba(255,255,255,0.4)` in a style
  prop slips through — found in PeopleStrip's live card. Worth extending the
  rule to `rgb()`/`rgba()`/`hsl()` when convenient.

---

## Part 6 — The browser layer

Unlocks four §17 conditions at once, and is the single biggest remaining gap in
verification. Everything so far reads static output or HTTP headers; nothing has
ever rendered a page.

- **Playwright**, per §14.1 — E2E for locale switching, form submission,
  navigation.
- **`@axe-core/playwright`** for the two rules jsdom cannot run: `target-size`
  (2.5.8, AA in WCAG 2.2) and `scrollable-region-focusable`.
- **Lighthouse CI** for the three `timings` budgets deferred from §9.1 — LCP
  < 2.0s, CLS < 0.1, TBT < 200ms — and the image-weight budget, which cannot be
  measured from the build because `next/image` generates variants at request
  time.
- A **screenshot harness** would also de-risk Parts 3 and 5; consider pulling it
  forward if those feel hairy.

**Acceptance:** §17 conditions 3 and 12 close; `check:a11y` stops listing three
rules as unrunnable.

---

## Part 7 — Close the CSP

§17 condition 11. Every CSP directive is strict except `script-src`, which keeps
`'unsafe-inline'` because the nonce §13 specifies requires per-request rendering
— which would make all 56 static pages dynamic and blind every build-output gate
(Next's own docs, `content-security-policy.md:181`).

- **Preferred: post-build hash injection.** Compute each page's inline-script
  hashes after `next build` and rewrite a per-page `<meta http-equiv>` CSP.
  Preserves static rendering. `frame-ancestors` must stay in the HTTP header
  because `<meta>` ignores it.
- Alternative: accept dynamic rendering. Much larger than it sounds — it trades
  away §5 and every gate built on it.

**Acceptance:** `script-src` has no `'unsafe-inline'`; `npm run contract` stops
reporting it as a deviation; `check:static` still passes.

---

## Part 8 — The content pass

§17 conditions 17 and 18, and §11a.2. Fifteen pages carry real FAQ blocks, lifted
to data so markup and schema cannot drift. What has not happened is a systematic
pass over body copy:

- **Question-shaped `H2`s with ~40-word answer blocks** on every commercial page,
  per §11a.2's answer-block pattern — self-contained, no orphan pronouns.
- **`HowTo` schema** on the process sections, once those sections are shaped for
  it. §11a.3 rates "how does background verification work" a top query shape.

This is a copy review, not a refactor. It needs a writer, and the answer blocks
are the single highest-leverage thing left for AI citation.

---

## Part 9 — The `hi` and `ar` locales

§17 conditions 7 and 15. Routing is live and every URL carries its locale;
`routing.locales` declares `en` only, because §7 makes a missing translation a
build error and declaring a locale without copy would publish an English route
tree under `/hi` and `/ar`.

- Blocked on **translated copy**. The old repo has real Devanagari and Arabic
  content to port.
- The copy table (`lib/seo/copy.ts`) was built for this — translating is now
  keying one table by locale, not hunting 32 literals across the app.
- **RTL:** the CSS can mirror (192 physical properties converted, lint-enforced)
  but no page has ever rendered with `dir="rtl"`. Expect residue — icons and
  arrows pointing the wrong way, and the six paint-positioning values the
  converter deliberately left alone.
- Shipping a locale means **removing it from `LEGACY_LOCALES`** in
  `lib/seo/legacy-urls.ts` in the same change, or the new pages redirect away
  from themselves.

---

## Part 10 — Measurement

§17 conditions 19 and 20, and §11a.5. Both need access rather than code.

- **GA4 segments** for AI referral sources — `chat.openai.com`, `perplexity.ai`,
  `claude.ai`, `gemini.google.com`.
- **Server-log analysis** of AI crawler hits: are they arriving, what are they
  fetching, are they hitting redirects.
- Citation monitoring: periodically prompt each engine with the 20 target
  queries and log whether HelloVerify is cited and how it is described.

---

## Part 11 — Azure: pipeline, deploy, cutover

Deliberately deferred. Everything here waits on the move off GitHub.

- Port `.github/workflows/ci.yml` to Azure Pipelines. Every gate is a plain npm
  script, so **only the YAML wrapper changes**.
- Automated deploy on merge — **not `trigger: none`**, which is AUDIT G2 and
  exactly what the old pipeline did.
- **Rollback wired on contract-suite failure** (§17 condition 24).
- **Apex → www 308** (§17 condition 5) — load-balancer and DNS configuration,
  not application code. The contract suite already asserts it and will catch its
  absence at cutover.
- Branch protection, required checks, one long-lived branch.
- Dependabot, and a pre-commit secret-scanning hook to sit alongside
  `npm run check:secrets`.
- **Decide on `.gitattributes`.** `core.autocrlf=true` with no `.gitattributes`
  means a fresh clone checks out CRLF — and line endings measurably change the
  emitted HTML here. The fix is `* text=auto eol=lf`; it was not added because it
  changes checkout behaviour for everyone.

---

## Known open questions that are not parts

- **Is 120 KB of JS reachable on this stack?** The worst page is 159.7 KB
  brotli, of which roughly 60 KB is React and the rest is the App Router
  runtime. The codebase has already refused next-intl's client runtime, the
  message catalogue and zod-on-client to protect this budget. The number may
  predate the framework choice, in which case the budget should move rather than
  the code. Worth attributing properly before promising anything.
- **`tools/port/build-css.py` cannot run** — `design-src/artboards/` is not in
  this tree, so `design.css` is maintained in place despite its generated-file
  header. If the artboards return, re-running it undoes the logical-CSS
  conversion; `check:logical` catches that.
- **The four old blog posts redirect by subject, not by content** (IA §9).
  Porting them is strictly better; the targets are one line to change.
- **`/support/track` has no destination** — the only entry left in
  `PENDING_DECISIONS` in `lib/seo/legacy-urls.ts`.

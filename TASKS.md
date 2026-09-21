# TASKS

The remaining work on the helloverify.com rebuild, in the order it should be
done. One part per sitting: say **"next"** to move to the following part.

Status as measured on **22 September 2026**, branch `feat/leads-api-zoho`.
BUILD-SPEC §17 defines done as 24 conditions — **9 met, 10 partly met, 5 not
started**. Condition 22 closed with Part 5. Condition 11 is now met in
enforcement and open in the header's wording — see Part 7, which is deliberate
and measured rather than unfinished. Conditions 3 and 12 moved to partly met
with Part 6: the lab half is measured, the field half needs a deployment and
the locale half needs Part 9. The full reading, with evidence per condition, is in the build ledger
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

**2c. The live site's schema names the wrong city.** ~~The old
`StructuredData.tsx` says Mumbai; confirmed answer is Noida.~~ **ANSWERED
(Noida) and DONE, 22 Sep** — old repo, branch `fix/schema-city-noida`, commit
`bc32f92`, not pushed.

Both the `Organization` and `LocalBusiness` nodes said Mumbai, Maharashtra.
`addressRegion` was dropped rather than corrected to Uttar Pradesh, because the
reviewed address carries city and country only and a region stated there and
nowhere else is the same kind of guess that produced Maharashtra.

Checking the first one found a second: the English contact page said **"India,
New Delhi:"** — a different wrong city for the same office. Also fixed.

**Still wrong, and it needs a native speaker rather than a guess:** the Hindi
and Arabic contact pages carry the same stale city — `नई दिल्ली` in
`public/cms/hi/contactUs.base.json` and `نيودلهي` in `public/cms/ar/...`. Only
the city name is wrong; the structure around it is fine. Transliterating a place
name is unreviewed copy, which this project does not publish, so it is left for
confirmation. The standard renderings are `नोएडा` and `نويدا` — one word each,
if you want to confirm them.

Not verified by a build: the old repo has no `node_modules`, so neither `tsc`
nor `vite` could run. The JSON was re-parsed after editing; the TSX change
removes one property from two object literals.

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

## Part 5 — Split the oversized components · **DONE (21 Sep 2026)**

§4 rule 2 and **§17 condition 22, now met: no component file exceeds 300
lines.** Measured with `find src -name '*.tsx'` after the last extraction.

**The shape is the same in every one: one card written N times.** Measured:

| file | lines | the repeat |
|---|---:|---|
| ~~`HowItWorks.tsx`~~ | ~~910~~ → **192** + **292** | **done**, split in two |
| ~~`ContactForm.tsx`~~ | ~~328~~ → **243** + **102** | **done**, split in two |
| ~~`PeopleStrip.tsx`~~ | ~~684~~ → **209** | **done** |
| ~~`Packages.tsx`~~ | ~~712~~ → **294** | **done** |
| ~~`International.tsx`~~ | ~~778~~ → **285** | **done** |
| ~~`Consumer.tsx`~~ | ~~610~~ → **241** | **done** |
| ~~`Presence.tsx`~~ | ~~532~~ → **298** | **done** |
| ~~`Checks.tsx`~~ | ~~520~~ → **265** | **done** |
| ~~`WhoItsFor.tsx`~~ | ~~324~~ → **198** | **done** |
| ~~`Why.tsx`~~ | ~~328~~ → **155** | **done** |
| ~~`enterprise/page.tsx`~~ | ~~334~~ → **293** | **done** |
| ~~`security-compliance/page.tsx`~~ | ~~334~~ → **291** | **done** |

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
of the same words. International measured the same way — same five countries,
same order, flags equal character for character. Check before deciding; do not
assume either shape.

**Extract the fields with a script that diffs the copies, before writing any
markup.** Packages was read by eye and needed a second pass (`{n} checks`
emitted nine `<!-- -->` separators). International and Consumer were diffed by
script and landed byte-identical on the first build. On Consumer that script
paid for itself twice over: it found that the mobile Basic plan card has two
ticked lines where desktop has three, which reading would have smoothed over,
and it found that the 142-line phone mock was byte-identical to a component the
repo already had.

**Look for the unit somewhere else in the repo before extracting it.**
`components/blocks/HelloVPhone.tsx` already existed, lifted from the same
artboard for `/individuals/hellov`. Consumer held two more hand-written copies
of it — 284 of its 610 lines — and nothing had noticed. Worth a grep for a
distinctive class name (`phone2`, `rc`, `ccard`) before writing a new
component. `Presence.tsx` is the counter-example that makes this a check
rather than a rule: its five flags look like `International.tsx`'s, and they are
not — the same countries are drawn for different boxes, so only Egypt matches.
Diff before sharing.

**When the two views disagree on order, reference by id rather than picking
one.** `Checks.tsx` draws the same 17 checks as a desktop timeline and three
mobile buckets, and neither order derives from the other — mobile's slow bucket
is lane order, its fast bucket is position order. Each view now lists the ids it
shows, so both orders are explicit and no name is written twice. A no-op
mutation confirmed it: reordering the check records themselves changes nothing,
because the views name their own order.

**An array whose last child is a text node costs 8 bytes.** React emits a
`<!-- -->` after it for hydration, so a `{" "}` that trailed each mapped item
has to sit outside the `.map()` instead. Measured on `Checks.tsx`; the same
shape is why `PeopleStrip.tsx`'s `Track` is written `{...map}{" "}`.

**A behaviour fix in one of these files is its own commit.** The extraction is
gated on byte-identical output; a fix changes the output, so the two cannot be
verified by the same run. Sequence them: extract, prove identity, commit, then
fix and show that the diff is exactly the intended change and nothing else. On
`WhoItsFor.tsx` the fix was applied as a mutation first, caught at +4,087 bytes,
which is the evidence for splitting rather than an argument for it — and the fix
commit's own diff was six `<img>` elements added and zero tokens removed,
checked element by element.

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
   - **A run of `<script>self.__next_f.push()>` chunks collapses to ONE token,
     not one each.** Presence reported a six-byte markup difference that was a
     `<PUSH>` once fewer at the end of the document: Next splits the payload
     into script chunks by size, so reshaping the payload changes how many there
     are. Tokenising them individually leaked a payload fact back into the
     markup comparison and would have failed every future split on it.
   - **The stylesheet hash is its own finding.** Tailwind generates from the
     classes it finds, so dropping one `className` renames `chunks/*.css`, which
     appears in the `<link>` of every page — 58 near-identical diffs hiding the
     one real one. It is now reported once, and is fatal: a pure split changes no
     classes.

**Two things measured along the way that settle earlier claims.**

- **`&apos;` and a plain apostrophe emit identical bytes.** Part 4 narrowed
  `react/no-unescaped-entities` on that basis; a no-op mutation on `Why.tsx`
  now measures it rather than restating it.
- **The finest differences this check resolves are one byte.** A single `{" "}`
  dropped from a run — on `Consumer.tsx` and again on `Why.tsx` — moves the
  page by exactly one byte and is caught. Three separate mutations across the
  eight files changed nothing at all in length and were still caught, which is
  the argument against ever gating these on file size.

**The two page files were long because of repetition OUTSIDE them.** TASKS
recorded "no repeat" for both, and that was wrong — the repetition was
cross-file, so counting within a file could not see it. Three shared components
came out of them and shortened seventeen other files on the way:

| component | copies | in | removed |
|---|---:|---:|---:|
| `chrome/SecHead.tsx` | 47 | 17 files | 232 lines |
| `chrome/Steps.tsx` | 41 cards, 12 blocks | 12 files | ~120 lines |
| `brand/Arrow.tsx` | 19 | 17 files | — |

`Steps` already existed inside `templates/VerticalPage.tsx`, driving the six
vertical pages from data; twelve pages not built on that template had
hand-written the same five-line card 41 times. It is now one module and
`VerticalPage` imports it. **Grep the templates as well as the components**
before writing a new one — that is the second time a unit already existed.

**Two codemod bugs, both caught, both worth not repeating:**

- **`.*?` under `re.S` spans lines.** The first `SecHead` codemod matched from
  one block through to a *later* block's `<h2>` and rewrote everything between.
  `tsc` caught it; a luckier mis-match would have compiled. Groups must be
  `[^
]*?` unless the field genuinely spans lines. The same bug was in the
  census regex, which is why the count was first reported as 49 and is 47.
- **JSX text is not a JS string.** The JSX parser decodes entities in text
  children, so `&amp;` there is one character; moved verbatim into a JS string
  it is five, and React escapes the `&` again and emits `&amp;amp;`. Three
  pages, caught by the byte check and by nothing else. Decode with
  `html.unescape` when lifting JSX text into data.

**Carried findings:**

- ~~**`WhoItsFor.tsx`'s mobile block renders no photographs.**~~ **Fixed**, in
  its own commit after the extraction. That it was a defect and not a choice was
  settled from `design.css`, not from taste: the `max-width: 1080px` block
  already defines `.pimg` and already carries `.ph:has(.pimg) .light
  { display: none }`, and `SIZES_BENTO_NARROW` opens with a
  `(max-width: 1080px) 90vw` clause — complete support for an image never
  rendered. The same rule set also settled what NOT to add: `.ph:has(.pimg)
  .note { display: none }` means the caption is the placeholder shown *instead
  of* a photograph, so mobile did not get one.
- ~~**`HowItWorks.tsx` holds the last 18 inline ticks.**~~ **Settled by
  measurement, not by decision.** The premise was wrong: they do not carry
  unique dash offsets. All 18 share one path, one stroke width, one
  `pathLength` and one `strokeDasharray`, and differ ONLY in the keyframe name
  and the box they are set in. So `PanelTick` reproduces every one exactly and
  the change was structural, which is why it could be proved byte-identical.
  They are still not `brand/Tick.tsx`: that one is a static mark coloured by
  CSS, these are drawn on by a keyframe and carry their own stroke.
- **`hv/no-color-literal` cannot see through a conditional.** Its exemption
  requires the JSX attribute to be the literal's *direct* parent, so
  `stroke={onChip ? "#FFFFFF" : "#1B6B4A"}` is an error where two branched
  `<path>`s are not. That strictness is deliberate and documented in the rule —
  UI colour must not hide one expression deep inside an SVG — so
  `HowItWorksPanels.tsx` bends to it rather than the exemption being widened
  for the first file that tripped it. Recorded in case a second file makes the
  case, not as a defect.
- **The `.lic` licence-card markup is written three times** — twice in
  `blocks/HowItWorksPanels.tsx`, where it is now one local component, and once
  more in `blocks/HelloVPhone.tsx` as `.lic chat`. Sharing it across the two
  would touch a file marked `lint-collisions: canvas-verbatim`, so it wants its
  own commit and its own diff of the two inner blocks first.
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
- **Six arrow SVGs carry no `aria-hidden`.** They are otherwise identical to
  the 19 that `brand/Arrow.tsx` now owns. A decorative SVG with no label and no
  `aria-hidden` is announced as an unnamed graphic, so this is an accessibility
  defect rather than a formatting one and wants its own commit. `check:a11y`
  does not catch it — jsdom axe has no rule that fires here — which is worth
  knowing on its own.
- **The same check has three different turnaround times across the site.**
  `lib/content/checks.ts` is the canonical catalogue behind `/checks/[check]`,
  and two other places restate it: `sections/Checks.tsx` and
  `business/enterprise/page.tsx`. Measured disagreements — Directors & GST is
  3 days in the catalogue and on enterprise but **2 days** on the homepage;
  Registration certificate is 30 min on the homepage and **60 min** on
  enterprise; Entitlement to work is 24 hrs and slow on the homepage but
  **60 min and fast** on enterprise. Two of those are not in the catalogue at
  all. This needs an answer before the three can be driven from one list, and
  the homepage currently contradicts a page on the same site.
- **`.cert` cards are written out 28 times across 9 files**, and only
  `security-compliance` drives them from an array. They are NOT all the same:
  the ISO 27001 logo carries five different headings and GDPR four, so this is
  not a lift-and-share like `SecHead`. It also touches the credentials surface
  that Part 2b is blocked on, so it waits for 2b.
- **No gate reads the stylesheets for colour.** Part 3 measured "UI colour
  literals: 119 → 0" over `src/**/*.tsx` and said so; the stylesheets were never
  in scope. `app/design.css` holds **228** colour literals and `app/pages.css`
  **36**. Most are artwork or are token values written out longhand (`#FFFFFF`
  ×81, `#1B6B4A` ×40, `#CFCAC0` ×30), but `#7D796F` is neither — it is UI colour
  that is not a token and fails AA at 3.95:1, and it shipped. The coverage was
  lost in Part 4: `check:tokens` read files as text and was removed as redundant
  with `hv/no-color-literal`, which is an ESLint rule and cannot see CSS —
  exactly the reasoning that kept `check:logical`, not applied to colour. Note
  `design.css` carries a generated-file header and its generator cannot run
  (see the open questions below), so this is not a simple find-and-replace.
- **`hv/no-color-literal` only matches hex.** `rgba(255,255,255,0.4)` in a style
  prop slips through — found in PeopleStrip's live card. Worth extending the
  rule to `rgb()`/`rgba()`/`hsl()` when convenient.

---

## Part 6 — The browser layer · **DONE (22 Sep 2026)**

Unlocks four §17 conditions at once, and is the single biggest remaining gap in
verification. Everything before it read static output or HTTP headers; **as of
today something renders a page**.

**Done:** Playwright on pinned Chromium, 124 tests over two viewports (1440 and
390, because `.dsk`/`.mob` are separate markup rather than one tree reflowing).
`npm run test:e2e`. Two specs so far:

- `tools/e2e/breakpoints.spec.ts` — both trees ship and exactly one is on
  screen, checked either side of the 1080/1081 seam. Nothing could see this
  before: that both trees are in the HTML is a string search, that one of them
  is *painted* needs a box model.
- `tools/e2e/a11y.spec.ts` — the three axe rules `check:a11y` has always
  reported it cannot run, over all 56 routes. Only those three: the jsdom gate
  already covers every other rule on every page in seconds with no browser.

**It found two things on the first run.** One is fixed, one needs you:

- **Fixed:** the two API samples on `/platform/technology` scroll sideways at
  390px and were not keyboard-reachable (WCAG 2.1.1). They now carry
  `tabIndex={0}` and a `role="region"` named from the header above each block.
  Desktop never showed it — the samples fit, so nothing scrolls.
- **Needs a decision, and it is a THIRD colour problem, not Part 2a:**
  `#7D796F` measures **3.95:1** on paper where 4.5:1 is required, on five nodes
  — the placeholder text of the homepage's mock contact form, hard-coded in
  `app/design.css` on `.inp` at both breakpoints. `--muted` (#6F6B62) would pass
  at 4.83:1. Accepted in the sweep with its measurement, exactly as `--faint`
  is, so the finding is visible rather than silent.

**Also done (22 Sep):** the lead form end to end, and Lighthouse CI.

- `tools/e2e/contact-form.spec.ts` — 7 tests over the seam no unit can reach: a
  Server Action invoked by a real POST, `useActionState` rendering the result,
  and the browser's own constraint validation deciding whether the POST happens
  at all. It pins that an empty submit makes **no POST**, that a server field
  error comes back *associated* (`aria-invalid`, `aria-describedby`) and not
  merely visible, that typing survives a rejection, and that the `<select>`
  keeps its choice — the regression `key={state.token}` exists for, now guarded.
  **Nothing leaves the machine:** `zohoConfig()` returns null without the three
  `ZOHO_*` variables and there is no `.env` here, so the CRM sink is null. That
  is a property of the environment, not of the test — pointing this suite at an
  origin that has credentials would file real leads.
- **Lighthouse CI, budgets met.** `budget.json` carries only what `check:perf`
  defers — the three `timings` plus image weight — because two gates asserting
  one number in different units is how they come to disagree. Measured, 3 runs
  per URL, mobile emulation: homepage LCP **1,089 ms** against a 2,000 ms
  budget, CLS **0**, TBT **150 ms** against 200, images **118 KB** against 250.
  Broken to check it fires: LCP budget at 100 ms reported `found: 1133.991` and
  exited 1. These are **lab** numbers against a local origin — no latency, no
  CDN, so optimistic — and condition 3 also wants CrUX field data after 28 days.

**Two costs of Lighthouse, for you to weigh:**

1. **It is unreliable on Windows.** Roughly every other invocation dies in
   `chrome-launcher`'s teardown with `EPERM` on its temp profile directory,
   *after* the audit — so it costs the run, not the numbers. Playwright's
   isolated Chromium and a project-local `TEMP` both failed to fix it. Expected
   to be Windows-only file locking; unverified, because verifying it means
   running it on Linux CI.
2. **It adds 10 dev-only advisories** (7 high) through `lighthouse` →
   `puppeteer-core`. `npm audit --omit=dev` is still **0**, and CI has no audit
   step, so nothing is broken and nothing reaches production. The alternative is
   moving Lighthouse to CI-only.

**Navigation E2E done (22 Sep).** `tools/e2e/navigation.spec.ts`, 9 tests. Every
internal `href` carries its locale — `AppLink` checked in the DOM rather than
trusted, broken with one unprefixed anchor and caught on all four pages. The
CSS-only mobile menu opens from the keyboard, which pins the reason `.vh` is
used for the checkbox instead of `display: none`: a `<label>` is not focusable,
so the whole keyboard path depends on the checkbox staying in the tab order.

**And one thing worth knowing about the architecture, now asserted:** a nav
click is a **full document load**. The first version of that test asserted the
opposite and failed — the test being wrong, not the site. `AppLink` emits a
plain `<a>` because next-intl's `<Link>` is a Client Component that would force
`NextIntlClientProvider` on at the root for 15.7 KB brotli on every page, and
there is not one `next/link` in the codebase. The test guards that decision
rather than endorsing it: add `next/link` and it fails, and whoever did has to
account for the script budget. It also proves its own instrument with a
`pushState` first, because `toBeUndefined()` would otherwise pass even if the
sentinel were never set.

**Answered and done (22 Sep): Playwright runs in CI.** A separate `browser`
job, not more steps on `verify` — it installs a ~115 MB Chromium and takes
minutes, and a typo in a unit test should not wait for that. Both are required
checks, so nothing merges on the fast one alone. Chromium only and pinned:
these are accessibility and performance measurements, and a number that moves
with whichever browser the runner happened to have is not a measurement.

Verified by running the CI code path locally rather than by reading the YAML —
`CI=true npx playwright test` makes `reuseExistingServer` false, so Playwright
starts its own server instead of adopting whatever is on the port. 162 passed.

The Lighthouse step carries `continue-on-error`, and the reason is stated in the
file so it is not mistaken for indifference: it dies roughly every other run on
Windows in `chrome-launcher`'s teardown, and this job is the first chance to
find out whether that is Windows-only. If it proves reliable on Linux, the line
comes off and it gates.

**Part 6 is done.**

- ~~**`@axe-core/playwright`** for the two rules jsdom cannot run~~ — **done**,
  and it was three rules, not two: `color-contrast` as well as `target-size`
  (2.5.8, AA in WCAG 2.2) and `scrollable-region-focusable`.
- **Lighthouse CI** for the three `timings` budgets deferred from §9.1 — LCP
  < 2.0s, CLS < 0.1, TBT < 200ms — and the image-weight budget, which cannot be
  measured from the build because `next/image` generates variants at request
  time.
- A **screenshot harness** would also de-risk Parts 3 and 5; consider pulling it
  forward if those feel hairy.

**Acceptance:** §17 conditions 3 and 12 close; `check:a11y` stops listing three
rules as unrunnable. Condition 12 is now met for `en` with two accepted
foregrounds; it stays open until those are decided and until `hi`/`ar` exist
(Part 9), since it reads "all three locales".

**Three things the harness had to learn, each by being wrong — kept because the
next person will hit them too:**

1. **Only the homepage is a two-tree port.** The first spec asserted two trees
   on five pages and failed on four. `class="dsk"` appears in 1 of 58 emitted
   pages; the other 57 are one responsive tree.
2. **Animation and scroll reveal made the scan flaky AND lenient.** Two
   identical runs returned 68 and 69 contrast nodes. Fixed with
   `reducedMotion: "reduce"` — which uses the site's own
   `prefers-reduced-motion` block rather than injected CSS — plus a `settle()`
   that scrolls the whole document so `.rise` blocks actually paint. Before it,
   the scan audited roughly the first screen and called it the page.
3. **A stale `next start` silently became the thing under test.** A fix
   verified present in `.next/server/app/...` kept reporting as broken because
   the origin was three builds old. `tools/e2e/global-setup.ts` now refuses to
   run unless the served page contains `.next/BUILD_ID`; broken both ways to
   check it fires. `reuseExistingServer` is worth the speed, but not unguarded.
   It has since caught a second stale server in ordinary use.
4. **`requestAnimationFrame` is throttled in a page that is not visible.**
   `settle()` yielded on rAF, and every Playwright test gets its own page, so
   under `fullyParallel` most are not visible and the scroll loop stalled — two
   tests timed out at 30s in a full run while passing alone. It yields on
   `setTimeout` now, reads `scrollHeight` once instead of re-reading a growing
   document, and caps its steps.
5. **A *different* two tests failed each run, which is what identified this as
   contention** rather than a page defect. 112 full-page axe scans at the
   default worker count, alongside `next start`, timed out somewhere.
   `timeout: 60_000` and `workers: 4` fixed it and the suite got **faster** —
   2.5 minutes, down from 3.7. `retries: 0` stays: a retry would have hidden
   this, and a suite that is green on the second attempt is not green.

---

## Part 7 — Close the CSP · **DONE in enforcement (22 Sep 2026)**

§17 condition 11. The preferred route was taken: **post-build hash injection**.
`tools/ci/inject-csp.mjs` runs as part of `npm run build`, computes the SHA-256
of every inline script on every page — 425 blocks across 58 pages, 2 to 17 per
page — and writes a per-page `<meta http-equiv>` carrying `script-src 'self'`
plus exactly those hashes and nothing else. Static rendering is untouched;
`check:static` still passes and `next build` still emits zero dynamic routes.

**Read the acceptance criterion carefully, because it is half met and the half
that is missing is the wording rather than the security.**

Measured in a browser, not reasoned about: with the header at
`script-src 'self' 'unsafe-inline'` and a document meta at `script-src 'self'`,
an inline script **does not run**. Multiple policies are each enforced and a
script must satisfy all of them, so the **effective** policy is the intersection
— hash-only. `tools/e2e/csp.spec.ts` proves it on the real site, including that
an unlisted inline script is actually refused; without that last assertion the
rest would pass equally well if the browser were ignoring the meta.

The header still contains `'unsafe-inline'`, and cannot not: the hashes are per
page, every one changes on every build (the flight payload embeds the build id
and the chunk names), and `headers()` is evaluated before any page is rendered.
The union across 58 pages is 258 hashes, ~14 KB on every response.

So: **`script-src` has no inline latitude in enforcement; the header text still
has the token.** `npm run contract` no longer says "box open" — it makes both
halves of that statement, and gained two assertions doing it (29, from 27). The
remaining literal gap needs per-request headers from middleware over a
build-time manifest, which cannot exist before the build that produces the
hashes. **That is a decision for you, not a task:** it is real work for a
wording, and it would put a per-request step in front of 58 static pages.

`check:csp` now proves each page lists the right hashes for the bytes beside it
— a wrong hash is silent, since the page still paints and only hydration is
gone. Broken three ways: injector skipped (58 pages named), a script added after
hashing (a missing hash *and* a stale one), `'unsafe-inline'` smuggled into the
meta (caught, plus the 17 scripts it orphaned).

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

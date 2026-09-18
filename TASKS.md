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

## Part 3 — Design tokens: eliminate the 382 hex literals

§17 condition 21. **382 hex literals** remain in component files, concentrated in
the ported canvas sections — 108 in `Presence.tsx`, 58 in `International.tsx`,
33 in `Packages.tsx`.

- Map every literal to an existing token where one matches; propose new tokens
  only where the value is genuinely distinct, and say how many uses justify each.
- The palette is seven tokens today (`--paper --ink --muted --faint --hair
  --green --red`); expect the real answer to be a handful more, not fifty.
- Held to **byte-identical rendered markup** — the technique used for the FAQ
  lift and the logical-CSS conversion. A literal replaced by a token with a
  different value is a visual regression the gates cannot see.

**Acceptance:** hex count in `src/components` and `src/app/**/*.tsx` is zero or
justified per remaining case; all 56 pages byte-identical to the pre-change
build with `<script>` bodies stripped.

---

## Part 4 — ESLint, and the two rules §14.2 asks for

No ESLint is configured; the CI `Lint` step currently says so rather than
passing silently.

- Wire up ESLint with the Next config.
- **The no-hex-outside-theme rule**, which only becomes enforceable after Part 3.
- **The logical-CSS rule** — already enforced for stylesheets by
  `npm run check:logical`; this extends it to inline `style={{ }}` objects in
  TSX, which that gate does not read.

**Acceptance:** `npm run lint` is real and passes; both rules fail on a
deliberately introduced violation.

---

## Part 5 — Split the 13 oversized components

§4 rule 2 and §17 condition 22. **13 files exceed 300 lines**; the largest is
`HowItWorks.tsx` at 910, then `Packages.tsx` 809, `International.tsx` 778.

All are ported canvas sections, so the risk is visual regression. Do Part 3
first — tokenised markup is far easier to split safely — and lean on the
byte-identity harness throughout.

**Acceptance:** no file in `src/components` or `src/app` over 300 lines; all 56
pages byte-identical.

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

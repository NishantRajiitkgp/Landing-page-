# TASKS

The remaining work on the helloverify.com rebuild, in the order it should be
done. One part per sitting: say **"next"** to move to the following part.

Status as measured on **22 September 2026**, branch `feat/leads-api-zoho`.
BUILD-SPEC §17 defines done as 24 conditions — **10 met, 9 partly met, 5 not
started**. Condition 22 closed with Part 5. **Condition 18 closed on 22 Sep**
— the `HowTo` node is emitted and `check:schema` verifies it against the
rendered cards on a central build, which is the run the agent round could not
do for itself; it moves from partly met, since `FAQPage`, `Service`,
`Organization` and `BreadcrumbList` were already green and `HowTo` was the one
missing type. Condition 11 is now met in
enforcement and open in the header's wording — see Part 7, which is deliberate
and measured rather than unfinished. Conditions 3 and 12 moved to partly met
with Part 6: the lab half is measured, the field half needs a deployment and
the locale half needs Part 9. **Part 2a closed condition 12's last accepted
contrast exception on 22 Sep** — `--faint` is deleted rather than excused, both
gates now carry zero accepted foregrounds, so 12 waits on the `hi`/`ar` locales
alone. The full reading, with evidence per condition, is in the build ledger
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
npm run build && npm run check:all   # 11 gates
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

**2a. `--faint` fails WCAG AA.** ~~It measures **2.43:1** on paper and is used as
text in 40 selectors, all 10–12px uppercase labels (chart axes, table headers,
totals), which need 4.5:1.~~ **ANSWERED (Option A) and DONE, 22 Sep** — the
token is deleted and every use reads `var(--muted)`.

**Option B was never viable, and the original framing of it here was wrong.**
"Enlarge the 40 label styles past the large-text threshold (≥18.66px bold or
≥24px), where 3:1 applies" only helps a colour that sits between 3:1 and 4.5:1.
`--faint` (`#A29E94`) measures **2.43:1** on `--paper` and **2.67:1** on
`--white` — **below 3:1 as well**. No type size passes it. That is worth
recording as a method note rather than just a correction: an accepted-failure
entry should carry the ratio against *both* thresholds, because "make it
bigger" reads as an option until you check the second number.

**Option A was chosen because darkening was no option either.** The lightest
colour on that hue reaching 4.5:1 is `#726F68` (4.56:1), and it measures
**1.06:1 against `--muted`** (`#6F6B62`) — the same colour to the eye. (This
file and the gate previously named `#716F68`; recomputed, that is 4.58:1 and
also 1.06:1 from `--muted`, so it is a hair darker and the conclusion is
unchanged.) A tier nobody can distinguish from the tier above it is not a tier,
so it was removed rather than nudged.

**"40 selectors" undercounted what a reader sees.** 40 is the count of
`var(--faint)` uses in `design.css`; `pages.css` carried 29 more, and the
browser renders **180 elements** in faint text **on the homepage alone**
(measured, not inferred). Converted, by file:

| file | changed |
|---|---|
| `src/app/design.css` | 40 `var(--faint)` → `var(--muted)`, plus 2 longhand `background: #A29E94` on `.typing i`; **both `:root` declarations removed** |
| `src/app/pages.css` | 29 `var(--faint)` → `var(--muted)` |
| `src/app/[locale]/legal/[slug]/page.tsx` | 1 `style={{ }}` prop |
| `src/components/sections/CustomerStory.tsx` | 4 |
| `src/components/sections/Consumer.tsx` | 2 |
| `src/components/sections/PeopleStrip.tsx` | 1 |
| `design-src/artboards/*.dc.html` (nine) | 1 declaration + 20 `var()` each, plus 1–6 inline `#A29E94` per board (19 in all) |

**79 live references and 2 declarations in `src/`; 199 references and 9
declarations across the nine artboards.** Nothing in `src/` still names
`--faint` or `#A29E94` outside the WHY comments that record the decision.

**Two hits needed a decision rather than a substitution.**

- **`.typing i` is a visual change, not a contrast fix.** The HelloV chat mock's
  three typing dots carried `background: #A29E94` — the token's value written
  out longhand, the same shape as the `#FFFFFF` ×81 / `#1B6B4A` ×40 duplication
  Part 3 found. They are a *background*, so 1.4.3 never applied and no ratio
  forced the change; they moved to `var(--muted)` because the alternative was
  keeping a hex that is no longer in DESIGN.md §2.1 for a tier that no longer
  exists. The dots are visibly darker. Reverting them means adding a decorative
  non-text token, which is a DESIGN.md decision, not a revert.
- **`tools/port/jsx/*.txt` still contains `#A29E94`** (7 files, 10 hits) and was
  deliberately left. That directory is *output* — `build-sections.py` creates it
  — and it is a pre-tokenisation capture: it also holds `#FFFFFF` and `#E3DFD6`
  longhand for tokens that do exist, so converting only this one colour would
  make it neither the capture nor the current design. Regenerating it from the
  fixed boards now emits `var(--muted)`.

**The artboards had to change, and that is the finding worth carrying.**
`design-src/artboards/` is present and git-tracked (the "known open questions"
entry below), so `tools/port/build-css.py` runs, and it regenerates `design.css`
from `Main.dc.html` and `Mobile.dc.html` verbatim. Leaving the boards alone
would have made this fix exactly as durable as nobody running that script — and
**no gate read the stylesheets for colour**, so the reintroduction would have
been silent — the same hazard the `.inp` `#7D796F` fix carried until
`check:css-color` landed later the same day, which now reports that literal in
all nine boards. Only the
colour token was touched in the boards; they are otherwise the verbatim capture.

**Both gates lost their exception rather than having it satisfied.**

- `tools/a11y/check-contrast.mjs` — `ACCEPTED` is now `[]`, with a comment
  saying why it should stay that way. Re-broken in a throwaway copy of the tree
  (another agent holds this one): a new failing token `--ghost` `#B5B0A6` used
  as 12px text → **exit 1**; `--faint` `#A29E94` reintroduced with a usage →
  **exit 1** (the proof the entry is really gone, not merely unreachable);
  `#007AFF` back as a token → **exit 1**; a new *passing* token `--slate`
  `#5A564E` → **exit 0**, so it does not fire on correct code. Unmutated it
  prints three tokens (`--ink` 16.78, `--muted` 4.83, `--green` 5.88) and
  "every text token meets its WCAG 2.2 AA threshold".
- `tools/e2e/a11y.spec.ts` — `ACCEPTED_FG` is **deleted**, not emptied, along
  with the accepted/blocking split and the annotation that read it. Every axe
  violation now fails the run. That also removed the flaky half of the test: the
  accepted count was annotated rather than asserted because repeated homepage
  scans returned 70–74 faint nodes, and there is nothing left to count.

DESIGN.md §2.1 no longer describes a third tier or an "AA by design" exemption;
§8 rule 5's accessibility floor now has no exemptions at all.

**2b. ISO/IEC 27701, SOC 2 and ISO 9001.** ~~The old site claims both (its
`llms.txt` and `seo.ts` respectively); neither is on this site's reviewed
credentials list, so neither is published and the build fails if either
reappears.~~ **ANSWERED (all three real) and DONE, 22 Sep** — published
"according to the old site", so the old site's own wording governs. It began as
two claims; ISO 9001 is a third, found while rewriting the gate below and
confirmed by the owner afterwards on the same day.

**The exact strings, and where they are published today**, in
`D:\Projects\Application Frontend HV`:

- `public/llms.txt:67` — "ISO/IEC 27001 and ISO/IEC 27701 certified", generated
  by `scripts/generate-seo-files.mjs:180`. So **"ISO/IEC 27701"**, not
  "ISO 27701".
- `src/config/seo.ts:50` — "…20M+ verifications with ISO 27001 & SOC 2
  compliance." So **"SOC 2"**, and **"compliance"** rather than "certified" —
  which is also the technically correct word, since a SOC 2 engagement ends in
  an auditor's attestation report and not in a certificate. Published here as
  "SOC 2 compliant".
- `public/cms/en/educationAuthorities.base.json:126` — "HelloVerify is ISO 9001
  and 27701 certified and GDPR compliant." So **"ISO 9001"** and **"certified"**.
  No `/IEC`, which is also correct: 9001 is an ISO standard, not a joint
  ISO/IEC one. This is the only place the old site claims 9001 in words; the
  only other mentions are a badge reference, and that badge is not what its name
  says (see below).

Changed together, as the rule requires: `lib/content/company.ts` (`CREDENTIALS`,
which `llms.txt` emits verbatim), `/about` (three new `.cert` cards),
`/platform/security-compliance` (three new `CERTS` rows, with the status word
explicit), and `lib/seo/schema/organization.ts` — where 27701 and ISO 9001
become second and third `Certification` entries and **SOC 2 deliberately does
not**, because there is no issuing body to name in `issuedBy` and modelling an
attestation as a certificate is the overstatement that node's
`memberOf`/`hasCertification` split exists to prevent. That reasoning does not
reach ISO 9001: it is a certification against a published standard, audited by a
certification body, so the type fits and the weakness in the evidence is about
whether we hold it — a `CREDENTIALS` question, not a schema-type one.

**The security-compliance standfirst still counts four claim types**, checked
rather than assumed. "Certified, compliant, aligned and member" — ISO 9001 is
"certified", already one of the four, so the sentence still enumerates the table
below it. What did need saying is scope: ISO 9001 is the only row on that page
that is not about security, privacy or data protection, so its copy states that
it certifies the management system and not any verification's outcome.

**The badge exists and is the wrong badge.** The old site references
`/assets/aboutus/ISO_9001_1.png` from `public/cms/{en,hi,ar}/globals.base.json`
and the file is real — a generic blue ISO roundel captioned **27001**. It is
27001 artwork under a misleading filename, so nothing was ported and
`/img/iso-9001.jpg` is a typographic plate matching 27701's and SOC 2's;
captioning a 27001 roundel "ISO 9001" would publish a picture of a different
standard. Two further findings on the old site, both still live: that one file
fills **both** slots of a two-badge strip, and the real TÜV SÜD "ISO 27001" mark
sitting beside it (`ISO_27001_1.png`) is referenced nowhere. That mark is the
only evidence in either repo of WHICH body certified anything — relevant because
`issuedBy` says "International Organization for Standardization" on all three
entries, which is consistent but not strictly correct, since ISO publishes
standards and accredited bodies certify. Left consistent deliberately: changing
one of three on the strength of an unreferenced logo is worse than three that
agree.

**The gate was rewritten rather than relaxed.** `check-llms.mjs` rejected the
two literal strings `"27701"` and `"SOC 2"`, which made it exactly as good as
that list was long — ISO 9001, SOC 1, HIPAA or FedRAMP would all have shipped
silently. It now derives an **allowlist from `CREDENTIALS`**: every
certification-shaped token in `llms.txt` must name a standard that appears on
the reviewed list, so adding a line to that array is the only way to publish a
claim. Exercised against 13 cases before and after (`ISO 9001`, `SOC 1`,
`SOC 3`, `HIPAA`, `PCI-DSS`, `FedRAMP`, `HITRUST`, `TISAX`, `ISO/IEC 42001`,
`ISO 22301` all rejected; years, prices and a bare "ISO" all silent). The one
case the old denylist caught and a shape check would not — "ISO 9001 **and
27701** certified", where the second standard carries no prefix, which is how
`public/cms/en/educationAuthorities.base.json:126` writes it — is handled by
distributing the prefix across the conjunction before scanning.

**And it needed no edit to publish the third claim**, which is the gate's own
acceptance test passing. Adding one line to `CREDENTIALS` moved ISO 9001 from
rejected to allowed with the shape pattern untouched; re-measured after, the
credential block, the old site's "ISO 9001 and 27701" conjunction and a
three-way "ISO 27001, 9001 and 27701" all pass, while HIPAA, SOC 1, ISO 22301,
ISO/IEC 42001 and FedRAMP are still rejected and years, prices and a bare "ISO"
are still silent. The gate that caught the claim is also what found it: ISO 9001
was this check's worked example of what the old denylist missed, which is why
`educationAuthorities.base.json:126` was read closely enough to notice.

**The evidence is weaker than everything else on that list, and is recorded as
such** in a comment on `CREDENTIALS`, on both pages and on the entity: "the
previous site published them and the owner confirmed", with no certificate,
audit report or auditor name in either repo for any of the three. Consequences,
so that the weakness is visible rather than asserted: the three `.cert` tiles are
typographic plates rather than badges (drawing a mark nobody issued us would
claim more than the evidence does), and none of the three is in the
`/platform/security-compliance` artefact table, because promising a reviewer a
document nobody has seen is the precise overstatement that page says it does not
make. **If a certificate or a SOC 2 report is produced, replace that paragraph
with a citation of it** — issuer, scope, date — and add the artefacts.

**Not changed, and it now under-claims:** the homepage's
`components/sections/Compliance.tsx` lists ISO 27001, GDPR, PBSA and NSR and
does not carry the three new lines. ~~It also already disagrees with
`/platform/security-compliance` on GDPR — "GDPR compliant" there against
"GDPR — aligned" here, which is the exact distinction that page's standfirst
says it does not blur.~~ Adding cards there changes homepage bytes against a
460 KB ceiling and a measured LCP, so it wants its own commit with the
measurement in it.

**The GDPR half is FIXED (22 Sep 2026)** — see the `.cert` finding in Part 5,
which drove every card on the site from one table. The homepage was not the
only surface saying "GDPR compliant": `/business/enterprise` said it on its card
AND in its answer block, so the count was two card surfaces and one prose
surface, not one. All now read the reviewed "aligned".

**The four-versus-seven half is deliberately still open, and is now a choice
rather than a leftover.** The homepage names the four ids it shows and carries a
comment saying why it is four, so re-taking the decision is reading one list. The
reason not to take it here is unchanged and is this paragraph's: three more cards
is homepage bytes against a 460 KB ceiling and a measured 1,089 ms LCP, and no
build could be run while four agents shared the tree.

**Two gaps that this file did not know about, found while making the surfaces
agree.** Both are "which cards does this page show", so both are editorial and
neither was taken:

- **`/about` has no GDPR card.** It renders seven and GDPR is not among them,
  even though `CREDENTIALS` carries it and this file calls `/about` the reviewed
  credentials list.
- **`/platform/security-compliance` has no Ministry of Manpower card.** It also
  renders seven — so the two seven-card pages are different sevens, each short
  one card the other has.

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
entries — **met, 22 Sep**: the list is `[]` and the run prints "every text token
meets its WCAG 2.2 AA threshold"; `check:llms` still rejects the unevidenced
certifications. All three of 2a/2b/2c are now answered, so **Part 2 is done**.

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
- ~~**Tailwind v4 scans `tools/`, so a word in a build script ships CSS.**~~
  **DONE in source, pending one build (22 Sep 2026).** The new harness used the
  bare word for the CSS property between `border` and `box-shadow` in a comment;
  Tailwind's extractor read it as a candidate and generated a real 165-byte
  `.outline` rule into `chunks/*.css` on every page, moving the chunk hash.
  Measured by removing the file and rebuilding: 122,086 bytes back to 121,921.

  `src/app/globals.css` now reads
  `@import "tailwindcss/utilities.css" layer(utilities) source("../")`.
  **The mechanism was read out of the installed package, not recalled** —
  `node_modules/tailwindcss/dist/lib.mjs`, 4.3.3: the `@tailwind utilities`
  branch reads a `source(…)` parameter off that at-rule, and an `@import`'s
  trailing condition is desugared to `@media source(…)`, whose handler
  re-attaches it with `sourceBase` set to the importing file's directory. It has
  to go on the **utilities** import — `tailwindcss/utilities.css` is literally
  `@tailwind utilities;`, and on the theme import the clause is silently inert.
  `@source not "…"` is in the same file and was rejected: a denylist is only as
  good as its length (`design-src/`, `messages/`, `public/`), and its failure
  mode is extra CSS rather than an error.

  **Re-proved the way the original was proved**, with `@tailwindcss/postcss`
  driven directly rather than `next build`: a throwaway `tools/port/_tw-bait.mjs`
  carrying `subpixel-antialiased` in a comment moved the generated stylesheet
  171,034 → 171,133 bytes and emitted the rule; with the clause, the same file
  changes nothing. It removed five further phantoms beyond the bait —
  `.flex-wrap`, `.text-wrap`, `.transition`, `.ease-in-out`, `.ease-out`, all
  CSS keywords picked out of `design-src/artboards/*.dc.html` — for 675 → 669
  selectors and −1,242 bytes unminified, and **zero** real selectors lost. CSS
  files inside the import graph are not scanned as content: `design.css`
  declares `text-wrap: balance` inside `src/` and `.text-wrap` still went.

  **Still wanted from a central build:** the shipped `chunks/*.css` byte count
  and its hash. The plugin is the one `postcss.config.mjs` names, so the
  mechanism is measured; the emitted chunk is not.
- ~~**Six arrow SVGs carry no `aria-hidden`.**~~ **Three fixed, three deferred
  by ownership (22 Sep 2026), and the premise was wrong.** Found by the shared
  path data: 13 inline copies in `src/`, exactly 6 missing the attribute —
  three in `platform/page.tsx`, one each in `business/`, `governments/` and
  `individuals/page.tsx`. The first three are `<Arrow />` now; the other three
  are held by other agents and are the identical one-line change.

  **Replaced rather than patched**, because adding the attribute fixes one copy
  and the next paste loses it again. All six were attribute-for-attribute
  identical to `brand/Arrow.tsx` in the same order, so the swap emits the same
  bytes; the two 16px copies that already *had* the attribute
  (`sections/Hero.tsx`, `sections/CustomerStory.tsx`) went the same way for the
  same reason. The three 14px copies (`Checks`, `International`, `Packages`)
  stay inline: they differ in `width`/`height`, which `Arrow` takes no prop
  for, and all three already carry `aria-hidden`.

  **The defect was latent, not audible.** All six sit inside `<span
  className="go" aria-hidden="true">`, which hides the whole subtree, so no
  screen reader announced them — "announced as an unnamed graphic" is true of a
  bare arrow in general and was not true of these. `check:a11y` cannot see
  either the defect or the mitigation, so this was never gated and still is
  not; the fix is durable through the shared component instead.
- ~~**The same check has three different turnaround times across the site.**~~
  **RESOLVED (22 Sep 2026), from the old site's own data.** All three checks now
  agree on every surface.

  The tie-break was not a guess. The old site publishes a **Mode** for all 32
  checks in its per-check catalogue (`public/cms/en/bgvSmb.base.json`), and that
  taxonomy maps onto speed consistently across every one of them: Database,
  Document, Digital and Online answer in 15–60 min (Address "Digital" 30 min,
  Credit and Global Database "Database" 15 min), while anything needing a third
  party to reply takes days (Employment "Email/Database" 2 days, Education
  "Database/Email" 3 days).

  - **Entitlement to work → 60 min, fast.** Listed there as
    "Right/Eligibility to work — Mode: Database/Document", so no third party is
    in the loop. The homepage's 24 hrs was the outlier; it moved to the 60-min
    stop, out of the "1–3 days" bucket and into the 60-min one — whose label
    widened to "Provident-fund and work-authorisation records", because it was
    then describing two of its three chips.
  - **Registration certificate → 30 min, fast.** The old site defines it as
    "a **vehicle's** registration details, including ownership and registration
    status" — the RTO record, the *same authority* as Driving licence, which
    the catalogue rates 30 min. Two checks against one registry cannot differ
    by 2×. The enterprise page's 60 min was the outlier.
  - **Directors & GST → 3 days.** The catalogue and the enterprise page already
    agreed; the homepage's 2 days was the outlier and moved to the 3-day axis
    stop.

  **`/business/smb`'s package promise is now correct rather than optimistic.**
  The blue-collar package is PAN (15 min), Registration certificate (30),
  Driving licence (30) and Criminal record (30) — slowest 30 — so "ready in 30
  minutes" holds. That promise sits in an answer block, which is why it was
  worth settling rather than softening.

  **Still not fixed: there is no single source for two of the three.** Neither
  Registration certificate nor Entitlement to work is in
  `lib/content/checks.ts`, so their agreement rests on two pages matching rather
  than on a canonical entry, and nothing would catch them drifting again.
  Adding them means writing a full catalogue entry each — `answers`, `fields`,
  `caveat`, `usedBy`, `countries` — which is reviewed product copy, and it
  would also publish two new `/checks/[check]` pages. That needs an owner, not
  an inference, so it is deliberately left. The enterprise page's answer block
  stays silent on all three turnarounds for exactly this reason, and says so.
- ~~**`.cert` cards are written out 28 times across 9 files**, and only
  `security-compliance` drives them from an array.~~ **DONE (22 Sep 2026), and
  it was a live correctness bug on a compliance claim, not a refactor.** Name
  and status word now come from `CREDENTIAL_MARKS` in `lib/content/company.ts`
  and render through `components/chrome/CertCard.tsx`. **29 hand-written blocks
  → 3**, the three being genuinely not this shape (below).

  **Four counts in the sentence above were wrong, and the corrections are the
  point rather than pedantry.** Re-measured from `git show HEAD:` on all nine
  files:

  - **29 hand-written blocks, not 28**, plus two array-driven surfaces, so 31
    `className="cert"` sites and **40 cards rendered**.
  - **TWO surfaces already drove them from an array**, not one:
    `security-compliance` AND `templates/VerticalPage.tsx`. That matters,
    because `VerticalPage`'s array was the thing that looked most like a source
    and had still drifted — it glossed PBSA "Member of the global standards
    body…" where `/about` used the reviewed list's own tail. Four files fed from
    a local array is a fifth copy with better ergonomics, not a source.
  - **The ISO 27001 logo carried THREE headings, not five**, and **GDPR carried
    FIVE, not four**. The two numbers were swapped, and the swap flattered the
    situation: GDPR is the credential whose status word is the claim this site
    says it does not blur, and it was the worst-drifted of the eight.
  - **"Not a lift-and-share like `SecHead`" was the wrong conclusion drawn from
    the right observation.** The headings differ because three of the 40 cards
    are not credential cards at all — `.cert` markup around a stance, reusing
    `gdpr.jpg`/`iso.jpg` as illustration ("Consent first, always", "They
    consent, then we check", "Documents deleted on schedule"). Set those aside
    and the other 37 are the same shape. So it was exactly a `SecHead`: share
    the identical majority, leave the minority that is a different shape, and
    say which is which at each site. All three are still hand-written and each
    carries a comment saying why. The trap they set is that one of them sat
    directly beside a real credential card — `/business/customer-kyc` renders a
    stance card and an "ISO 27001 certified" card in the same container — so
    "this page is not credential cards" would have been the wrong call at file
    granularity. It is a per-card judgement.

  **What was actually wrong, measured:** the homepage showed four credentials
  against seven on `/about` and `/platform/security-compliance`; the homepage
  and `/business/enterprise` both said "GDPR compliant" where the reviewed word
  is "aligned" (and enterprise said it in prose too); the homepage's `.dsk` and
  `.mob` blocks disagreed with each other on the PBSA heading; and
  `/platform/security-compliance` had given NSR a **fifth status word,
  "empanelled"**, contradicting its own standfirst's count of four and claiming
  a standing `CREDENTIALS` deliberately withholds. Two smaller ones on the same
  page: its file header named `"targeting"` as the fourth claim type where the
  standfirst says "member" and nothing renders "targeting", and the 22 Sep note
  concluding the count was "checked rather than assumed" had checked the new row
  (ISO 9001) rather than the table.

  **The four status words are a type now** — `CredentialStatus` in
  `lib/content/company.ts` — so the standfirst's count is enforced by `tsc`.
  Broken four ways to confirm it fires, in a probe file compiled outside the
  repo so nothing was written into a tree three other agents were using: an
  unknown id, `"empanelled"`, `"targeting"`, and a `heading` override are all
  rejected; a correct call is silent.

  **Not closed, deliberately:** which cards each page shows. `/about` has no
  GDPR card, `/platform/security-compliance` has no MOM card, and the homepage
  still shows four — all three are recorded in Part 2b. ~~And nothing gates the table against `CREDENTIALS`.~~
  **CLOSED the same day** by `tools/test/credentials.test.ts` (29 assertions):
  the claim each mark makes is now asserted to appear in exactly one
  `CREDENTIALS` line, with `mom` excepted **by name and with its reason** in
  the test rather than by loosening the assertion for all eight. A second
  assertion guards the exception itself, so if `/about`'s line is ever rewritten
  to match the card, the stale exemption fails instead of standing as a licence
  for the two lists to disagree. The four-status-word count is asserted too —
  that is the one a fifth word (`NSR - empanelled`) had already slipped past,
  on the very page whose standfirst counts four.

  Both were measured facts with nothing holding them, which is the state this
  repo has been bitten by before: true the day they are written, silently false
  at the first edit. **Broken to prove they hold** — GDPR reverted to
  "compliant" and a fifth status word reintroduced; each fails the named
  assertion and nothing else.
- ~~**No gate reads the stylesheets for colour.**~~ **DONE (22 Sep 2026)** —
  `npm run check:css-color`, `tools/a11y/check-css-color.mjs`, wired into
  `check:all` (now 11 gates; CI runs `check:all`, so the YAML is untouched).
  The coverage was lost in Part 4: `check:tokens` read files as text and was
  removed as redundant with `hv/no-color-literal`, which is an ESLint rule and
  cannot see CSS — exactly the reasoning that kept `check:logical`, not applied
  to colour.

  **The count was wrong, and measuring it is what decided the gate's shape.**
  228 + 36 = 264 counted hex only. Re-measured: **267 hex and 175 in functional
  notation, 442 in all** — `rgba()` was more than a third of the colour in these
  files and nothing had ever counted it. Normalising it to `#RRGGBBAA` is what
  let it be compared against the palette:

  | class | count |
  |---|---:|
  | inside a comment — blanked, not scanned | 11 |
  | `:root` custom-property declarations | 19 |
  | token value written longhand, **text** | 44 |
  | token value + an alpha, **text** | 23 |
  | token value written longhand, surface | 141 |
  | token value + an alpha, surface | 128 |
  | not a token, surface (near-ink, gradients, tints, rules) | 76 |
  | **not a token, text** | **0** |

  The last row is the point: `#7D796F`'s class is **empty**. Every text colour in
  these stylesheets resolves to a declared token — 67 spelled out instead of
  `var(--x)`, none off-palette — so the one zero-tolerance rule is one the code
  passes today, and 442 literals produce **0 failures**. A gate that flags 442
  things gets switched off.

  **One hard rule, plus a ratchet.** A text colour must resolve to a token, no
  exemption list, and the failure carries the measured ratio against `--paper`,
  `--white` and `--ink` — it reproduces 3.95:1 itself, from the bytes.
  Everything else is recorded in `BASELINE` with a count and a reason: an
  unrecorded colour fails, and a recorded group that **grows** fails, so the 336
  longhand uses are debt that cannot spread rather than 336 red lines. A count
  coming in *under* its record prints "lower it to N" and does not fail — a gate
  that fails on an improvement is the definition of one that gets disabled.

  **The generator's inputs are in scope too, which closes the silent half of the
  open question below.** The nine boards are scored against the *shipped*
  palette rather than their own `:root` (which pre-dates Part 3's four added
  tokens, and scoring them against themselves reports 220 "non-token" text
  colours, 219 of which are current palette values spelled out). Measured that
  way the answer is one colour: `color: #7D796F` on `.inp`, nine times, one per
  board. Reported with file and line and **capped at 9** rather than failed —
  they are input, not shipped bytes, so it is a latent hazard and not a live
  defect. Fix the boards and the cap goes to 0.

  **Two things the parser had to do, both found by measuring.** Comments are
  blanked character-for-character so line numbers stay true: 11 of the remaining
  literals sit inside the WHY comments that record their own removal, `#7D796F`
  ×4 among them, so a gate reading raw text fails on its own documentation and
  the obvious "fix" is to delete the reasoning. `url()` is blanked too, and that
  removes **zero** literals today — stated rather than left as implied coverage,
  because `select.inp`'s chevron writes its `--muted` stroke percent-encoded
  (`%236F6B62`), which a `#` regex never saw.

  **Broken ten ways — six must fail, four must not.** `#7D796F` back on `.inp`
  → exit 1 with "3.95:1 on --paper"; `color: #6F6B62`, `--muted`'s own value
  longhand → exit 1, "Either use `var(--muted)`"; the same colour as
  `rgba(125,121,111,0.95)` → exit 1, the form no other gate reads; a 69th
  longhand `#FFFFFF` surface → exit 1, "68 recorded, 69 found"; `#ABCDEF` on a
  background → exit 1; a 10th non-token text colour in the boards → exit 1. And
  silent where it must be: a new rule written with `var()` → exit 0; the failing
  colour named in a comment → exit 0; one longhand `#3D3B35` converted to
  `var()` → exit 0 plus "lower it to 9". The tenth is a **deliberate no-op**,
  recorded as one: `rgba(255,255,255,0.6)` → `0.61` changes nothing, because
  alpha is collapsed to a `+a` flag — keeping it made the table 90 rows
  (`--ink` at 12 alphas, `--green` at 11, `--white` at 11) and made them
  rounding-sensitive, for a distinction that has nothing to do with whether the
  colour came from the palette. The first mutation also found a defect in the
  gate's own wording: rule 2 was offering "or add it to `BASELINE` with a
  reason" for a non-token *text* colour, which is advice that does not exist.

  **Not fixed, deliberately: the 336 longhand uses.** `color: #FFFFFF` →
  `color: var(--white)` is mechanical and is the same duplication Part 3 removed
  from `src/**/*.tsx`. It is left because `design.css` is regenerated from
  `design-src/artboards/` — inputs present and git-tracked — so a rewrite of the
  output that is not also a rewrite of the nine boards is one `python` away from
  being undone, silently. That is a stylesheet-and-artboard change with its own
  diff, not a tooling change. Rule 3 holds the line until someone does it.
- ~~**`hv/no-color-literal` only matches hex.**~~ **DONE (22 Sep 2026)** —
  `rgb()`, `rgba()`, `hsl()` and `hsla()` now match, in both the legacy comma
  and the modern space/slash forms. It found **6 whole-value literals across 5
  files**, and all six were one thing: the `.ph .note` placeholder caption.

  **Five went to `lib/img.ts`, the exemption they belong in**, as
  `PLACEHOLDER_NOTE` keyed by photograph — because the photograph is what
  decides them. Measured, not asserted: every tint whose caption inverts to
  white has relative luminance ≤ 0.2574 and every tint that keeps
  `design.css`'s dark default is ≥ 0.4213, a clean gap with no photograph in
  it. That also removed two restatements of the same fact — `p.live` in
  `PeopleStrip` and a `dimNote` field in `WhoItsFor`, now deleted — either of
  which could have disagreed with the picture. The three alpha values (0.4,
  0.45, 0.35) are the artboards' own and are **not** unified: that would change
  what six tiles render, which is a DESIGN.md decision, so they are recorded
  per photograph and the change is byte-faithful.

  **No new tokens were created.** One literal is left and it is a real
  decision for you: `rgba(255,255,255,0.82)` on the closing band's copy in
  `sections/Contact.tsx` is UI colour with nowhere to go — the palette has no
  translucent white tier, and `var(--white)` at full opacity would visibly
  change the paragraph. It carries the repo's **only lint suppression**, with
  the reasoning and two ways out beside it. One occurrence is thin evidence for
  a new tier (Part 3: four new tokens, not seventeen).

  **Both patterns are anchored, deliberately.** A value must BE a colour, so a
  colour inside a longer value is still missed — 5 more in `Contact.tsx`, all
  scrim gradients and text shadows over a photograph, exactly as
  `linear-gradient(#FFFFFF, #000000)` has always passed. The gap is shared with
  hex rather than introduced, and those five are effects, which is a DESIGN.md
  question. Measured and recorded rather than missed.

  Broken five ways, through the real config with `npx eslint`: the reported
  `rgba()` restored to PeopleStrip → **fires**; a flag's `fill="rgb(200 16 46)"`
  → **silent**, so the artwork exemption covers functional notation too; the
  same value one expression deep as `fill={wide ? … : …}` → **fires twice**, so
  the direct-parent strictness survives the extension; ten near-misses in one
  style object (`rgba`, `rgb(255,255,255` unclosed, `translate(10,20)`,
  `grayscale(0.4)`, a shadow, a gradient, `rgb(red,green,blue)`,
  `notrgb(1,2,3)`) → **all silent**; `hsl(200deg 50% 50% / 0.4)` and
  `rgb(255 255 255)` in their place → **both fire**. Plus 32 cases through
  ESLint's `Linter` against the rule module. The harness proved its own
  liveness first: its initial run reported zero for every case *including hex*,
  which was a config error in the harness and not a silent rule.

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
- ~~**Needs a decision, and it is a THIRD colour problem, not Part 2a:**~~
  **ANSWERED (use `--muted`) and DONE, 22 Sep.** `#7D796F` measured **3.95:1**
  on paper where 4.5:1 is required, on five nodes — the placeholder text of the
  homepage's mock contact form, hard-coded in `app/design.css` on `.inp` at
  both breakpoints. Now `var(--muted)` (#6F6B62, **4.83:1**) at both, and
  `#7d796f` is out of `ACCEPTED_FG` in `tools/e2e/a11y.spec.ts`, so the colour
  reappearing anywhere fails the sweep rather than being tolerated.

  **Checking it found two more nodes than the finding named.** `app/pages.css`
  carried the same literal twice — `input.inp::placeholder` and
  `select.inp:invalid` / `option[value=""]` — and those are the **real** contact
  form, not the homepage mock. Both changed. **Why the sweep named only the mock
  is NOT verified here** — no browser was run, since builds are centralised
  while several agents share this tree — but the likely reason is that axe's
  `color-contrast` rule reads an element's own text and cannot see a
  `::placeholder`. If that is right, the real form's placeholders were failing
  AA with nothing able to report them, and the five-node count understated the
  defect. Worth confirming on the next `test:e2e` run.

  **And the premise about the generator is out of date.** `design-src/artboards/`
  IS present and git-tracked (9 `.dc.html` boards plus `canvas.json`), contrary
  to this file and to `build-css.py`'s own docstring. All nine still carry
  `color: #7D796F` on `.inp`, so re-running the generator would silently
  reintroduce this — a second hazard alongside its undoing of the logical-CSS
  conversion, and at the time no gate caught it — `check:css-color` now does,
  naming all nine boards with a line number, and fails if a tenth appears.
  Recorded in the
  `design.css` comment; the artboards were left alone, since they are the
  verbatim canvas capture and editing them is a separate decision. **That
  decision was taken for the other colour, 22 Sep:** Part 2a's `--faint`
  collapse WAS applied to all nine boards, because a colour fix that lives only
  in the generator's output is one `python tools/port/build-css.py` away from
  being undone with nothing to report it. `#7D796F` on `.inp` is still in the
  boards and still carries that exposure.

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
rules as unrunnable. ~~Condition 12 is now met for `en` with **one** accepted
foreground — `--faint`, Part 2a~~ — **condition 12 is now met for `en` with
ZERO accepted foregrounds (22 Sep).** Both colours that had entries are fixed
rather than excused: `#7D796F` here, and `--faint` by Part 2a, which deleted the
token. `ACCEPTED_FG` is gone from `tools/e2e/a11y.spec.ts` and `ACCEPTED` is
empty in `check-contrast.mjs`, so either colour reappearing fails a gate. It
stays open only until `hi`/`ar` exist (Part 9), since it reads "all three
locales".

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

## Part 8 — The content pass · **answer blocks and `HowTo` DONE in source (22 Sep 2026); one answer block waits on a turnaround decision**


§17 conditions 17 and 18, and §11a.2.

**The pattern, on two deliberately different shapes.** Review these two and the
remaining pages follow the same rule; correct the voice here and it costs two
files rather than fifteen.

1. **`/checks/[check]` — one template, twelve pages.** A new question-shaped H2
   (`How long does {name} verification take?`) with a ~40-word answer composed
   entirely from `lib/content/checks.ts`: source, turnaround, coverage and the
   catalogue's own `answers` sentence. Three statement headings became the
   questions people type — "In the report." → "What is in the {name} report?",
   "The limit of this check." → "What can the {name} check not confirm?",
   "Usually for." → "Who needs this check?"
2. **`/business/employee-verification` — hand-written prose.** Three answer
   blocks, each built from numbers already on the page.

**No new facts were invented.** Every figure comes from the catalogue or from
the same page's own chips and strip. One was deliberately left out: entitlement
to work's turnaround, because it is one side of the three-way disagreement
carried below, and a citeable sentence is the worst place to pick a side by
accident.

**Generating twelve pages from one template produced two grammar bugs, and a
third was already there.** All three were invisible in the source and obvious in
the rendered output:

- `c.name.toLowerCase()` rendered "Directors & GST" as "directors & gst"
- "a {name} check" read "a Identity check" on three of the twelve
- **pre-existing**: the closing CTA had said "Run a {name} check" — with both
  faults — on all twelve pages since it was written. Found by the new test, not
  by reading the pages.

The article is `the` throughout rather than an a/an test, which would itself be
wrong for the next name added. `tools/test/answer-blocks.test.ts` asserts both,
plus that every interpolated field is non-empty and every answer is 25–70 words:
100 → 237 assertions.

**And that test was briefly worthless, which is worth recording.** Its article
assertion was written through a shell heredoc as `/\ba \${c.name}/`, and the
heredoc turned `\b` into a literal **0x08 backspace byte**. The regex then
looked for a backspace and matched nothing, so the guard passed the very
mutation it existed to catch. Found by printing `repr()` of the line. Both
assertions are plain `includes()` now — nothing to escape — and both were
re-broken afterwards to confirm they fire. This is the third distinct
manifestation of the heredoc trap in the "How we work" rules above, and the only
one so far that produced a *silently useless check* rather than a broken file.

**All 19 commercial pages done (22 Sep 2026)**, the remaining 17 in one parallel
pass: `business/` (hub, smb, enterprise, certifier, customer-kyc),
`governments/` (hub + 4 + the MOM case study), `individuals/` (hub + 3),
`platform/` (hub + 3). **60 answer blocks**, every one measured at 36–45 words
by script rather than by eye.

Three calls worth keeping, because they are the ones a second pass would
otherwise re-litigate:

- **Placeholder prices stay out of answer blocks.** `/business/smb` (₹349/₹999)
  and `/individuals/hellov` (₹499/₹799) both publish prices the `.pricenote`
  marks as "pending commercial sign-off". An answer block is designed to be read
  AWAY from its page, so the disclaimer does not travel with the figure and an
  engine would cite an unsigned price as fact. Both pages answer how they are
  priced — per candidate, per person, not by subscription — and the cards keep
  the numbers with the disclaimer intact. The two pages were written by
  different passes and initially disagreed; `hellov` was rewritten to match.
- **No certification name appears in any answer block**, including on the three
  pages that render credential cards. Credentials are owned by `CREDENTIALS` in
  `lib/content/company.ts` and gated by `check:llms`; restating them in prose
  would be a fourth surface to keep in step.
- **`/platform/security-compliance`'s "Certifications & memberships" heading was
  deliberately NOT converted.** The obvious question is "which certifications do
  you hold", and no answer to it avoids restating the reviewed list. It carries
  a comment saying so.

**`HowTo` DONE (22 Sep 2026), §17 condition 18** — `lib/seo/schema/howto.ts`
plus one optional `name` prop on `chrome/Steps.tsx`, which emits the node from
the `items` it already renders, exactly as `FaqSection` emits `FAQPage`.
**14 nodes on 14 pages, from 63 step cards nobody retyped.** Eight pages name it
at the `<Steps>` call; the six vertical pages take it from `VerticalPage`'s
`stepsHead`, which is the `<h2>` above the strip.

Five things worth carrying:

- **The mapping is `t` → `name`, `p` → `text`, and `n` is deliberately unused.**
  `n` carries a counter, which `step`'s array order already states and which
  `HowToStep.position` would state a second time, plus a per-card ornament that
  is not the step's name — "01 · Candidate's phone", "02 · HelloVerify AI".
  Folding it in would emit "01 · Candidate's phone Upload", a string that
  appears nowhere on the page and that the new gate rejects on its own terms.
- **Four of the eighteen strips are NOT a HowTo, and a numbered strip is not
  evidence that it is one.** `/business/customer-kyc` lists three mutually
  exclusive routes — the strip says so itself, "02 · **Or** redirect", and its
  lede says "three ways" — so marking it up as a sequence would tell an engine
  to do all three in order. `/platform/coverage` answers "what does global
  coverage actually mean", a definition whose cards are its properties.
  `/platform/security-compliance` says "four controls apply to every
  verification", i.e. concurrently. The Ministry of Manpower case study lists
  "four things in the contract" — deliverables. The last two are the tempting
  ones: both headings are how-shaped.
- **A nameless node is worse than none**, so `howTo()` returns `null` without a
  name or with fewer than two steps rather than borrowing the band's eyebrow
  ("How it works") — instructions for an unstated task is the mis-citation
  §11a.3 exists to prevent. Because a missing node is *invisible* (a `Steps`
  call without `name` renders a byte-identical strip), `check-schema.mjs` holds
  both lists and fails if a strip is in neither, rather than counting what the
  build happened to emit.
- **The homepage's own process section is deliberately not one, and it is the
  interesting exclusion.** `components/sections/HowItWorks.tsx` does not use
  `Steps` — it is the two-tree port — and its per-stage paragraph (`cap`) is a
  **desktop-only** field, the same finding Part 5 recorded about that file's
  caption row. So a `HowTo` there would mark up text that a reader at 390px
  never sees, which is the one thing this pairing exists to prevent. Its `<h2>`
  is also a statement, "One upload. Then we get to work.", so there is no
  question to name it with. `/business` carries the same four stages, in
  `Steps`, under "How does background verification work?" — that is where the
  node lives.
- **Google retired the HowTo rich result in 2023**, so this is a §11a.3
  retrieval node and not an §8.2 rich-result one. Stated as the reason it is
  shaped for extraction rather than as a finding — nothing in this repo can
  measure Google's SERP behaviour. Condition 18 asks for the node by name and
  the whole cost is one array read twice, so "do not emit it" was refused.

**Verified as far as a shared tree allows, and the gap is stated rather than
papered over.** The unmodified gate was run against the build output that
predates the node: `HowTo: 0 of 18 strips (4 are not sequences), 63 step cards
read`, all 14 owed pages named, every other section of the graph still green —
so the decision lists, the strip parser and the report path all execute. Four
further mutations (a step reworded on the page only; a node spliced between two
cards; the container class renamed; nine `<span class="t">` pills beside a
strip) were run over that emitted HTML in memory: caught, caught, caught, and
correctly ignored. **No `next build`, `tsc` or `npm test` was run** — four
agents share this tree and builds collide — so condition 18 was left to close
on the next central run.

**That run has since happened, and it is what closed 18.** On the build all
four agents' work landed in: `check:all` 11/11 with `check:schema` reading the
emitted `HowTo` nodes against the rendered cards, `tsc --noEmit` clean, `lint`
clean, 285 unit tests, 162 Playwright passed / 4 skipped with no flakes, 823
redirect and 29 contract assertions. 58 pages, 442 CSP hashes.

**Still to do:**

- ~~**One answer block restates a contradicted promise.**~~ **RESOLVED** by the
  turnaround settlement below, which is what this bullet said the fix had to
  be. `/business/smb`'s block promises the blue-collar package "in 30 minutes";
  that package is PAN (15 min), Registration certificate (30), Driving licence
  (30) and Criminal record (30), so the slowest is 30 and the promise holds.
  Registration certificate's conflicting 60 min on `/business/enterprise` was
  the outlier and moved, settled from the old site's own Mode taxonomy rather
  than by softening the block into vagueness.
- **RTL:** the CSS can mirror (192 physical properties converted, lint-enforced)
  but no page has ever rendered with `dir="rtl"`. Expect residue — icons and
  arrows pointing the wrong way, and the six paint-positioning values the
  converter deliberately left alone.
- Shipping a locale means **removing it from `LEGACY_LOCALES`** in
  `lib/seo/legacy-urls.ts` in the same change, or the new pages redirect away
  from themselves.

---

## Part 10 — Measurement · **the code is done (22 Sep 2026); the rest is access
and two non-code blockers**

**Shipped, and inert until configured.** `components/analytics/Analytics.tsx`
renders GA4 only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set at build time, and
`next.config.ts` adds Google's origins to `script-src`, `connect-src` and
`img-src` only then. Measured both ways: with an id the header gains
`googletagmanager` plus the four analytics hosts, 56 pages carry the tag and
every one of their inline init scripts is hashed by `inject-csp` (428 hashes,
from 425), the third-party origin count goes 0 → 1 against a budget of 5, and
the homepage grows 447.7 → 450.1 KB against a 460 KB ceiling. Without it,
neither the header nor the body mentions Google at all and §9.4's measured zero
third-party origins stays zero.

**`lib/analytics/ai-referrers.ts` is the segment, as code.** A GA4 segment
defined in the console is invisible to this repo — no diff, no test, and it
silently stops matching when a product changes hostname. This classifies the
referrer here and sends the result as one `ai_source` dimension, so the GA4 side
is `ai_source = claude` rather than a pattern nobody owns, and the same function
will serve the server-log analysis below. 36 new assertions (100 → 136),
including the near-misses a naive `includes()` would get wrong:
`notperplexity.ai` and `claude.ai.attacker.example` are both `null`.

§11a.5 names four hosts; the list carries ten, because a segment built on
`chat.openai.com` alone misses everyone who arrived from `chatgpt.com`.

**One hazard avoided, worth recording.** The obvious shape — read `headers()`,
classify the referrer on the server — calls a dynamic API and would turn all 58
prerendered pages into per-request renders, taking §5, condition 23 and every
build-output gate with it. The host list is serialised into the tag's snippet
and matched against `document.referrer` in the browser instead.

**Two blockers that are not GA4 access:**

1. **`/legal/cookie-policy` is a stub** — every section reads "[ Section text
   pending legal review ]", including "Analytics and performance". Setting an
   analytics cookie while the policy says nothing about it is not defensible,
   and the `Organization` node's `areaServed` includes the UK.
2. **There is no consent UI.** Consent Mode initialises with
   `analytics_storage: "denied"`, which is the only correct default without one;
   GA4 then sends cookieless pings and stores nothing until something calls
   `gtag('consent','update',…)`. Nothing does. Until a banner exists the reports
   are modelled rather than counted, so the AI-referral numbers will be
   directional. A banner is a design decision, not a dependency.

**Still needing access rather than code:**

- **GA4 segments** — the dimension arrives as `ai_source`; building audiences on
  it is console work.
- **Server-log analysis** of AI crawler hits. This is CDN and load-balancer log
  work, not application code: a page served from cache never reaches the app at
  all, so app-side logging would systematically miss exactly the hits that
  matter. It belongs with Part 11.
- **Citation monitoring** — periodically prompt each engine with the 20 target
  queries and log whether HelloVerify is cited. Real code, but it needs an API
  key per engine.

### The original plan, for reference

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
- **`tools/port/build-css.py` must not be re-run, and the stated reason is
  wrong.** Both this file and the script's own docstring said it *cannot* run
  because `design-src/artboards/` is not in this tree. Measured 22 Sep:
  the directory **is** there and git-tracked — nine `.dc.html` boards and
  `canvas.json`, which is every input `sheet()` opens. So `design.css` is
  maintained in place by choice, not by impossibility, and the generated-file
  header is a live hazard rather than a dead one. Two things it would undo:
  the logical-CSS conversion, which `check:logical` catches, and the `.inp`
  contrast fix, which **`check:css-color` now catches** (it scores the boards
  against the shipped palette and reports the nine `color: #7D796F` on `.inp`,
  capped at nine) — the boards still carry it. Either fix the boards and re-run with
  `logical-css.py --write`, or delete the script; leaving it runnable with a
  false "cannot run" note is the worst of the three.

  **Part 2a took the "fix the boards" half for its own change** (22 Sep): the
  `--faint` declaration is out of all nine boards and every `var(--faint)` and
  inline `#A29E94` in them now reads `var(--muted)`, so regeneration reproduces
  the collapse instead of reversing it. Only the colour token was touched — the
  boards are otherwise still the verbatim capture, and the script was **not**
  run. So the list of things a regeneration would undo is now two, not three,
  and the `.inp` literal is the only one left — no longer silent: it is what
  `check:css-color`'s artboard section exists to report.
- **The four old blog posts redirect by subject, not by content** (IA §9).
  Porting them is strictly better; the targets are one line to change.
- **`/support/track` has no destination** — the only entry left in
  `PENDING_DECISIONS` in `lib/seo/legacy-urls.ts`.

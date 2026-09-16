# HelloVerify — Design System

**Companion to:** [`AUDIT.md`](./AUDIT.md) · [`BUILD-SPEC.md`](./BUILD-SPEC.md) · [`INFORMATION-ARCHITECTURE.md`](./INFORMATION-ARCHITECTURE.md) · [`DESIGN-RESEARCH.md`](./DESIGN-RESEARCH.md)
**Status:** Canonical. Extracted from the approved homepage canvas ("HelloVerify Landing Page", 9 artboards) and binding for every page that follows.
**Every contrast ratio in this document was computed, not quoted.**

`DESIGN-RESEARCH.md` set the constraints (computed contrast, WCAG 2.2 AA, evidence-first structure) and proposed a provisional blue. The canvas settled the actual direction, and it is not blue: it is **paper, ink, and green** — an editorial ledger. This document records that system so the remaining ~35 pages are designed *in* it rather than *near* it.

---

## 1. The idea

HelloVerify's product is a **verified fact**. The design treats every page as the paperwork of that fact, done beautifully:

- **Paper, not chrome.** A warm paper ground, white cards, hairline rules. No gradients-as-decoration, no glassmorphism, no dark "tech" sections.
- **The ledger voice.** Facts render in mono — timestamps, field names, turnaround times, registry names. If it's evidence, it's mono. If it's a claim, it's serif. If it's interface, it's sans.
- **Evidence over persuasion.** The government buyer converts on artefacts (AUDIT/IA §4.1). Every section should be able to answer "how do you know?" — a number, a named authority, a time, a source.
- **One verdict per surface.** Cards end in a conclusion (a receipt total, a "ready in 30 min", a seal) — never trail off.
- **Warm human proof.** Photography is candid people at real work (the rider, the nurse, the ministry hall) — never stock handshakes, never laptops-with-graphs.

If a new section can't be drawn with paper, hairlines, mono facts, a serif claim, and one green verdict — it isn't in this system yet.

---

## 2. Foundations

### 2.1 Colour

Defined once in `src/app/design.css` as custom properties. Never introduce a hex outside this table without adding it here first, with a computed ratio.

| Token | Hex | Role | On paper `#F6F4EF` | AA (normal text) |
|---|---|---|---|---|
| `--paper` | `#F6F4EF` | Page ground | — | — |
| *(surface)* | `#FFFFFF` | Cards, receipts, pills | — | — |
| *(panel)* | `#FBFAF6` | Inset panels inside white cards | — | — |
| `--ink` | `#15140F` | Headlines, body, primary buttons | **16.78:1** | ✅ AAA |
| *(soft ink)* | `#3D3B35` | Nav links, ledes, secondary body | **10.19:1** | ✅ AAA |
| `--muted` | `#6F6B62` | Captions, supporting copy | **4.83:1** | ✅ AA |
| `--faint` | `#A29E94` | k-labels, decorative meta ONLY | 2.43:1 | ❌ — see rule below |
| `--hair` | `#E3DFD6` | Hairline rules, borders | — | — |
| *(dash)* | `#EAE6DC` / `#D8D3C9` | Dashed separators (receipts, ledgers) | — | — |
| `--green` | `#1B6B4A` | THE accent: verified, live, time, totals | **5.88:1** | ✅ AA (6.46:1 on white) |
| `--red` | `#EC2E21` | Logo swoosh ONLY | 3.84:1 | n/a — never text |

**Rules.**
- **Green is a verdict, not a theme.** It marks what is verified, live, fast, or concluded — dots, ticks, totals, zones, the now-line. A page should read ~95% ink/paper with green landing only where something has been *proven*. Never green backgrounds for whole sections, never green headlines.
- **Red exists only inside the logo.** In a verification product red reads as "failed check" (canvas annotation). Failure states, if ever needed, get ink + language, not red.
- **`--faint` fails AA (2.43:1) by design** — it is for *redundant decorative* meta only (k-labels that repeat the adjacent H2, axis labels, watermarks). Any text a reader must be able to read uses `--muted` or darker. Form placeholder `#7D796F` (3.95:1) is acceptable only because the label above it carries the information (WCAG placeholder exemption); never rely on a placeholder alone.
- Buttons: white on ink = 18.44:1; white on green = 6.46:1. Both pass.

### 2.2 Type

Three faces, three jobs. Loaded via `next/font` (`layout.tsx`); referenced only through `--serif` / `--sans` / `--mono`.

| Face | Token | Job |
|---|---|---|
| **Newsreader** (variable, `opsz` axis ON — mandatory) | `--serif` | Display: H1/H2, big numbers, pull quotes. *Italic* = the human, warm, or time-valued clause ("*in minutes.*", "*30 min*", "*a verified beginning*"). Weight 400 always — size does the work. |
| **Instrument Sans** 400/500/600 | `--sans` | UI and body: nav, buttons, ledes, paragraphs, card titles. |
| **Geist Mono** 400/500 | `--mono` | Evidence: k-labels, timestamps, field names/values, chips, axis text, footers of receipts. |

**Scale** (desktop → mobile):

| Role | Desktop | Mobile | Notes |
|---|---|---|---|
| H1 (home only) | 112/0.96, −0.03em | 54/0.98 | text-wrap: balance |
| H1 (inner pages) | 68–84/1.0, −0.03em | 40–44 | < 8 words (IA §4.2) |
| H2 section | 68/1.0, −0.03em (`.h2`) | 40 | balance |
| Card/serif sub-head | 30–34/1.05, −0.02em | 24–27 | receipts `.tt`, `.cap .t` |
| Big number | 176/0.9, −0.045em | 104 | `.big` — keep the clip-headroom fix |
| Lede | 18–21/1.45–1.5 | 15.5–17 | `--muted` or soft ink; text-wrap: pretty |
| Body / list | 14–15.5/1.45–1.55 | 13.5–14.5 | |
| Button | 16 (lg) / 14 (sm), 500 | 15 / 13 | |
| Mono meta | 11–13.5 | 10–12.5 | |
| k-label | 12 caps, +0.08em | 11 | `.k` |

**Line-height assumes UA `normal` — Tailwind preflight stays OFF** (`globals.css`). This is a hard engineering constraint of the system.

### 2.3 Space, grid, shape

- Page: fluid to **max-width 1440**, gutters `clamp(24px, 8.334vw, 120px)` (`.wrap`).
- Section rhythm: **120–160px** top padding desktop, 72px mobile (`.sec`). Sections separated by full-bleed hairlines (`.hair-top`), not background changes.
- Section head: `.sec-head` — 7/5 grid, H2 left, lede right, baseline-aligned (`align-items: end`). Mobile stacks with lede `margin-top: 14px`.
- Radii: cards/receipts **24–26**, photo cards **22** (16 mobile), inputs **12**, pills/chips/buttons **999**.
- Shadows: long-throw and soft only — e.g. `0 40px 80px -50px rgba(21,20,15,0.45)` (hero card), `0 18px 40px -24px rgba(21,20,15,0.25)` (receipts). Never tight/dark "material" shadows.
- Breakpoint: **1080px** — single breakpoint, two worlds. New pages are written mobile-responsive in one tree (the dual `.dsk`/`.mob` tree is a homepage-port artefact, not the pattern going forward). No tablet-specific designs; below 1080 the phone layout holds a ≤720px centred column.

### 2.4 Buttons & links

| Class | Look | Use |
|---|---|---|
| `.btn.btn-ink` | White on ink pill, hover `#2A2823` | THE primary CTA. **One per page** (IA §5) — "Talk to sales" or "Buy now", never both competing. |
| `.btn.btn-line` | White pill, hair border → ink border on hover | Secondary ("Explore", "See all 33 checks" on mobile) |
| `.btn.btn-ghost` | Text + arrow, hover green | Tertiary, inline "see more" |
| Text links | Ink, hover green, no underline in chrome; underline in long-form prose | Legal/blog body links underline |

Heights 52 (lg) / 40 (sm) desktop, 50/38 mobile. Arrow glyph: the 16×16 stroked SVG from the canvas, `stroke-width: 1.6`.

---

## 3. Component vocabulary

The signature moves, all already in `design.css` — new pages compose these before inventing anything:

| Component | Canvas class | What it says |
|---|---|---|
| **k-label** | `.k` | Mono caps section eyebrow — "HELLOVERIFY AI", "GOVERNMENTS WE WORK WITH" |
| **Hairline rule** | `.hair-top` | Section boundary. The page is ruled like a document. |
| **Receipt** | `.rc` (+ `.tt .sub .ln .sep .tot .bc .act`) | A package/price as a till receipt: dashed seps, serif-italic green total, barcode. Anything priced renders as a receipt. |
| **Status chip** | `.chip`, `.pl` | White pill + status dot + mono fact ("Criminal · 30 min") |
| **Live dot** | `.dot` / `.dot.live` | Green 7px dot; pulses when something is happening now |
| **Tick** | `.tick` svg | 16×16 green stroke check — the atomic unit of "verified" |
| **Photo card** | `.ph` + `.scrim .chip .who` | Photo, bottom scrim, serif role + city, chip with check + time. People are always named by role, never "user". |
| **Big number** | `.big` + `.big-l` | 176px serif count with rise-in reveal, muted one-line caption below |
| **Dot-plot / axis** | `.lane .axis .plot .pin` | Facts plotted against time; green zone = "minutes" |
| **Day band** | `.dayband .cov .drow` | Timeline with a green now-line — global coverage as hours |
| **Ledger row** | `.d2f` (demo redesign) | `LABEL value ✓` — mono label col, mono value, tick |
| **Verdict strip** | `.d2foot`, `.rc .tot` | The card's conclusion: live dot + mono verdict + serif-italic green time |
| **Seal** | `.vseal` | "Verified" rubber-stamp roundel — sparingly, one per page max |
| **Barcode** | `.rc .bc` | Repeating-gradient barcode — receipts and document footers |
| **Phone frame** | `.phone2` | Consumer (HelloV) surfaces only |
| **Cert row** | `.cert` | Grayscale cert logo + name + one-line meaning; colour on hover |
| **Form field** | `.fld-l .inp .seg` | Mono caps label, paper input on white card, segment pills |

**Composition rules.**
1. White cards sit on paper; inset panels inside cards are `#FBFAF6`. Never white-on-white without a hairline.
2. Numbers get serif, their units/captions get mono or muted sans — never the same style for value and label.
3. Left column tells, right column proves (sec-head, why-rows, story quote + stat).
4. Any list of facts is a ruled ledger (hairline or dashed separators), not floating bullet points.

---

## 4. Motion

- **Reveals are one-shot**: `rise` 0.9s `cubic-bezier(0.2,0.7,0.2,1)`, staggered `.d1–.d6` (0.05–0.8s). Content never blanks or loops away after arriving (demo-redesign lesson).
- **Ambience is allowed to loop**: the people-strip drift (80s), scan beam, progress shimmer, dring conic spin, dot pulse. Loops move *light and position*, never text opacity.
- Easing family: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, linear only for drift/sweeps.
- Everything must remain correct with animation off: final states are the readable states. (Also required for `prefers-reduced-motion: reduce` — to be honoured site-wide with a global media block in the functionality phase.)

---

## 5. Photography

From the canvas photo brief, binding for all pages: warm, candid, real people at work in real places — natural light, no stock handshakes, no laptops-with-graphs. Every photo card carries a role + place (serif + small sans) and usually a chip stating the check + time. The strongest image goes to the closing/contact section. Budget: ≤250 KB per page of imagery (DESIGN-RESEARCH §hard budget), `next/image` in the functionality phase.

---

## 6. Voice

- H1s: **< 8 words**, declarative, audience-specific. The italic serif clause carries the warmth ("*in minutes.*").
- Facts carry sources: "20M+ *checks completed since 2018, every one at the primary source.*"
- Mono text is telegraphic: `Degree · 3 days`, `RTO Karnataka`, `09:40 → 10:10`.
- No exclamation marks, no "world-class/cutting-edge/seamless". The register is a competent clerk, not a pitch deck.
- Buttons say what happens: "Talk to sales", "Buy now", "Explore", "Read the story".

---

## 7. Page templates (IA §6 × this system)

Site chrome for ALL inner pages — per IA §2 the nav becomes audience-first:

```
┌ NAV: [logo]  Governments Business Individuals Platform Resources   [EN] [Talk to sales] ┐
│ utility links About / Support move to footer + contact                                  │
├ BREADCRUMB (mono, faint→muted, "/" separators) — inner pages only                       │
│ …page…                                                                                  │
├ CLOSING CTA BAND (photo + form or single CTA — shared component)                        │
└ FOOTER (canvas footer, link columns re-grouped to the new IA)                           ┘
```

> ⚠️ The ported homepage still shows the OLD nav (Solutions/Products/Premium services/…) because the canvas predates the IA decision. Migrating the homepage header/footer to the new IA nav is a **pending approved-deviation** — do it when the first inner pages land so the chrome ships consistent.

**T1 · Home** — done (the canvas port).

**T2 · Audience hub** (`/governments`, `/business`, `/individuals`) — real content, not link farms (IA open decision #1):
H1 + lede → proof strip (numbers/named clients in that segment) → **vertical cards as photo-cards or receipts** (one per child page) → segment-specific "how it works" excerpt → compliance strip → closing CTA.

**T3 · Vertical/solution** (the workhorse, ~13 pages): breadcrumb → H1 <8 words + one-sentence sub + single CTA → trust strip → "What we verify" (ledger/chip cloud) → "How it works" (numbered stage) → "Turnaround & coverage" (dot-plot or table) → "Compliance & security" (cert rows) → FAQ (ruled accordion) → closing CTA. Every H2 block self-contained and citable (AEO).

**T4 · Product + pricing** (`/business/smb`, `/individuals/hellov`): T3 + **receipts as the pricing table** — the canvas already prices in receipts; SMB public pricing (IA §4.3) renders as a receipt rack with a "Buy now" ink button per receipt, outbound to `app.helloverify.com`.

**T5 · Programmatic** (`/checks/:check`, `/countries/:country`): one tight template — breadcrumb, H1 ("Driving licence verification in India"), verdict strip up top (time, source, coverage), ledger of what's checked, dot-plot position vs siblings, FAQ, CTA. Data-driven; designed once.

**T6 · Editorial** (blog/guides): 680px measure, serif display head, sans body 17/1.65, mono asides and figure captions, ruled pull-quotes, ToC as a k-label ledger.

**T7 · Conversion** (`/contact`): the canvas contact section grown to a page — photo left ("Every great journey…"), real form right, office/mono details below.

**T8 · Legal**: 680px measure, numbered H2 ledger ToC, `--ink` on paper, generous 10.19:1+ everywhere, effective-date in mono.

---

## 8. Engineering rules for new pages

1. New pages: **single responsive tree** (no `.dsk`/`.mob` duplication — that's the homepage port only). Reuse `design.css` classes; page-specific CSS goes in `src/app/pages.css` (new file, same token vocabulary), never inline hexes.
2. The homepage's generated files stay generated (`tools/port/*`); do not hand-edit `sections/*` for homepage sections.
3. Every new colour/size decision lands in this document first.
4. All pages static (`BUILD-SPEC` G5); no client JS for design-phase pages.
5. Accessibility floor: WCAG 2.2 AA — text ≥ 4.5:1 (only `--faint` decorative meta and placeholders exempt per §2.1), focus-visible rings (ink 2px offset 2px) on all interactive elements, `alt` on every content image, one `h1` per page, landmarks (`header/main/footer/nav`).

---

## 9. Design roadmap (the "parts")

Chrome first, then audiences by commercial priority (IA §4), then the long tail.

| Part | Scope | Template |
|---|---|---|
| **D1** | Shared chrome: new IA nav + breadcrumb + closing-CTA band + footer regroup; homepage nav migration | — |
| **D2** | `/business` hub + `/business/enterprise` (sets T2 + T3) | T2, T3 |
| **D3** | `/business/smb` (public pricing) + `/business/employee-verification` + `/business/customer-kyc` + `/business/certifier` | T4, T3 |
| **D4** | `/governments` hub + 4 verticals (health, immigration, manpower-education, trade) | T2, T3 |
| **D5** | `/individuals` hub + hellov + immigration + home-family | T2, T4, T3 |
| **D6** | `/platform` : technology, security-compliance (procurement artefacts), coverage | T3 variants |
| **D7** | `/resources`: blog index + post template, glossary; `/checks/:check` + `/countries/:country` templates | T6, T5 |
| **D8** | `/about`, `/contact`, `/legal/:slug` | T7, T8 |

Each part ships as live routes in `helloverify-web` (static, dead links allowed until the functionality phase), screenshot-reviewed at 1440/390 before hand-off.

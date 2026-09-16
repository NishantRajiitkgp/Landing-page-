# HelloVerify — Design Research & Rationale

**Companion to:** [`AUDIT.md`](./AUDIT.md) · [`BUILD-SPEC.md`](./BUILD-SPEC.md) · [`INFORMATION-ARCHITECTURE.md`](./INFORMATION-ARCHITECTURE.md)
**Status:** Research and rationale. **Visual design decisions happen in the next session.** This document establishes the evidence, the constraints, and the one thing that cannot wait — the colour system.
**Every contrast ratio in this document was computed, not quoted.**

---

## 1. Why we are doing this

Not "the site looks old." That is a symptom. The business case:

### 1.1 The credibility gap

HelloVerify sells **trust infrastructure to governments**. The product is verification — proving that a claim is true.

The website currently:

- ships an **AES encryption key in public JavaScript** (`AUDIT.md` E1)
- has a **dead apex domain** (`AUDIT.md` A3)
- fails its own **brand colour accessibility** (§3.1 below)
- serves a **12.5 MB homepage** (`AUDIT.md` B1)

A security buyer who opens DevTools during evaluation — and they do — finds a credential in the bundle. **The website is the first product demo, and it currently demonstrates the opposite of the thing being sold.**

### 1.2 Procurement is now a design constraint

- EAA enforcement active since **28 June 2025**
- **EN 301 549 v4.1.1** published **2 Sept 2026**, expected in the EU Official Journal **Nov 2026** → **WCAG 2.2 AA** becomes the presumed standard
- **Public institutions will only contract with vendors meeting it** — a conformance report is part of procurement
- A B2B label does not exempt a service sold into the EU market

HelloVerify's highest-value buyers are ministries. Accessibility conformance is a **line item in the tender**, not a design preference.

### 1.3 The discovery channel is changing under us

| Engine | Reach |
|---|---|
| ChatGPT | ~800M weekly active users |
| Google Gemini | ~750M monthly, plus ~2B via AI Overviews |
| Perplexity | ~45M+ |
| Claude | ~30M |

A meaningful and growing share of "which BGV vendor should we use" now gets answered **before anyone visits a website**. Classical SEO gets you into the index; it does not get you into the answer. That requires content structured for extraction — see `BUILD-SPEC.md` §11a.

### 1.4 Measurable conversion cost

| Finding | Research | Current state |
|---|---|---|
| Single dominant CTA converts **13.5%** vs **10.5%** for 5+ CTAs | [SaaS Hero](https://www.saashero.net/design/b2b-saas-landing-page-examples/) | Header alone offers 8 destinations |
| Clear value prop converts **35–40%** better | [SaaS Hero](https://www.saashero.net/design/landing-page-design-inspiration-2026/) | H1 is 9 words, two fused sentences, one audience |
| Reducing form fields 11 → 4 lifts conversion **~120%** | [Genesys Growth](https://genesysgrowth.com/blog/designing-b2b-saas-landing-pages) | Contact form component is 953 lines |
| High-performing B2B H1 ≈ **< 8 words / 44 chars** | [SaaS Hero](https://www.saashero.net/design/b2b-saas-landing-page-examples/) | Current H1: **64 characters** |

**The rebuild is not cosmetic. It is a credibility, compliance, discoverability, and conversion problem that happens to also look dated.**

---

## 2. Human psychology — what actually moves a B2B buyer

### 2.1 Cognitive load is the enemy

Every additional choice costs conversion. The 2026 consensus is that whitespace is a **functional tool**, not decoration — it reduces the number of things competing for attention at any moment.

Applied:
- **One primary action per page.** Everything else is visually subordinate.
- **Five nav items, not eight** (`INFORMATION-ARCHITECTURE.md` §2).
- Progressive disclosure — a 953-line contact form becomes 4 fields, with the rest asked after the lead exists.

### 2.2 The 3–5 second value check

The 2026 standard has moved from static taglines to hero sections that **demonstrate value within 3–5 seconds**.

The visitor is answering one question: *"Is this for me?"* If the H1 speaks to employers while the page sells to ministries, SMBs, and consumers simultaneously, every audience answers "probably not."

This is the single strongest argument for the audience-hub IA.

### 2.3 Trust is shown, not claimed

The most effective above-the-fold B2B trust signals, in order:

1. **Named customer logos with specific outcome metrics** — not anonymous logo walls
2. **Third-party badges with review counts** — G2, PBSA membership
3. **Security certifications relevant to the buyer's industry** — ISO 27001/27701, SOC 2
4. **Concrete numbers** — 20M+ checks, 120+ countries, 2000+ clients

HelloVerify **has all four** and puts them below the fold or in a footer strip. Trust signals belong above the fold, not hidden at the bottom.

> **Psychological mechanism:** for a high-risk, high-consideration purchase, the buyer is not looking for reasons to say yes — they are looking for reasons to **not be blamed** for saying yes. Certifications and named references are risk transfer. Design for the internal defence, not the pitch.

### 2.4 Specificity beats superlative

"Instant AI-Powered Background Checks" is a claim. "Age verification in 15 minutes, driving licence in 30, employment in 60" is **evidence** — and it is already on the current site, buried in a grid.

Specific numbers also happen to be what AI engines extract and cite. Statistics and structured formatting measurably increase AI citation probability. **The same content change serves human persuasion and machine retrieval.**

### 2.5 Transparency as a differentiator

2026 B2B buyers expect clear pricing, visible certifications, and customer logos. The category norm — "Talk to sales" for everything — now reads as evasive to the self-serve segment.

Recommendation: publish SMB pricing, keep enterprise and government sales-led. (`INFORMATION-ARCHITECTURE.md` §10, decision 4.)

### 2.6 Cultural load — three locales, three reading orders

Arabic is RTL. Hindi has a taller default line box. English is the design baseline.

Psychology consequence: **layouts that depend on left-to-right visual sequencing break meaning in Arabic.** This is why `BUILD-SPEC.md` §7 mandates CSS logical properties as a lint-enforced rule rather than a review item — RTL correctness must be structural, not vigilance-based.

---

## 3. The colour system

This is the one design decision made now, because it is **blocking an accessibility failure** and every other decision depends on it.

### 3.1 Blocking finding — the current brand blue fails WCAG AA

Computed:

| Colour | Use | vs white | WCAG AA text (4.5:1) |
|---|---|---:|---|
| **`#007AFF`** | **Brand blue, used 455×, including CTA labels** | **4.02:1** | ❌ **FAIL** |
| `#00247A` | Navy | 13.70:1 | ✅ Pass |
| `#1B354A` | Ink | 12.69:1 | ✅ Pass |

White text on a `#007AFF` button measures **4.02:1**. CTA labels are 15px / weight 500 — **normal text**, requiring 4.5:1. This fails.

It is also fails as a text colour on white. And `#007AFF` is **Apple's system blue** — an unowned, instantly recognisable default that reads as "we used the picker's first suggestion."

**Three reasons to change it: it's inaccessible, it's unowned, and it's a procurement liability (§1.2).**

### 3.2 Why blue is still correct

- Blue is the **most trusted brand colour globally** — 54% of consumers name it their most trusted, and 83% of the world's most trusted brands use it
- Blue is the safest hue for **colour vision deficiency** — ~8–10% of men have red-green CVD; blue/yellow deficiency is far rarer
- Shade carries distinct meaning: **cobalt/royal = active, confident** · **navy = authoritative, established** · **sky = approachable, calm**

For a verification company selling to governments, the required reading is **authoritative + confident**, not *calm* and not *playful*. That points at **cobalt for action, deep navy for authority** — a two-tone system, not one blue doing both jobs.

> **The 2026 caveat:** blue is no longer differentiating in tech — the category is saturated. Escape is via **warm neutrals and generous space**, not by abandoning blue. The brand stays blue; the *surface* stops being cold. That is why the recommended background is a warm off-white (`#FBFBF9`) rather than clinical `#FFFFFF` or the current cold `#F1F8FF`.

### 3.3 Recommended ramp — all values computed

```css
@theme {
  /* Brand blue — action, links, focus */
  --color-blue-50:  #F0F4FF;
  --color-blue-100: #DDE5FF;
  --color-blue-200: #BCCBFF;
  --color-blue-300: #93A9FB;
  --color-blue-400: #6B85F2;
  --color-blue-500: #3D5FE8;
  --color-blue-600: #1A3FCB;   /* ★ PRIMARY — CTAs, links */
  --color-blue-700: #1533A4;   /* hover */
  --color-blue-800: #132A7E;   /* pressed */
  --color-blue-900: #0D1B3E;   /* ★ INK — headings, authority surfaces */
  --color-blue-950: #080F24;
}
```

| Step | Hex | vs `#FFF` | vs `#FBFBF9` | AA text | AA UI (3:1) | Role |
|---|---|---:|---:|:---:|:---:|---|
| 50 | `#F0F4FF` | 1.10 | 1.06 | — | — | Tinted surface |
| 100 | `#DDE5FF` | 1.26 | 1.21 | — | — | Subtle fill |
| 200 | `#BCCBFF` | 1.60 | 1.54 | — | — | Borders on tint |
| 300 | `#93A9FB` | 2.26 | 2.18 | ❌ | ❌ | Decorative only |
| 400 | `#6B85F2` | 3.35 | 3.24 | ❌ | ✅ | Non-text UI, dark-mode links |
| 500 | `#3D5FE8` | 5.25 | 5.07 | ✅ | ✅ | Secondary action |
| **600** | **`#1A3FCB`** | **8.02** | **7.74** | ✅ | ✅ | **PRIMARY** |
| 700 | `#1533A4` | 10.29 | 9.93 | ✅ | ✅ | Hover |
| 800 | `#132A7E` | 12.65 | 12.21 | ✅ | ✅ | Pressed |
| **900** | **`#0D1B3E`** | **16.89** | **16.30** | ✅ | ✅ | **INK / headings** |
| 950 | `#080F24` | 19.02 | 18.36 | ✅ | ✅ | Deepest surface |

### 3.4 Why `#1A3FCB` specifically

| Criterion | Result |
|---|---|
| **Accessibility** | **8.02:1** on white — passes AA (4.5) and **AAA (7.0)** for normal text. The current `#007AFF` is 4.02. **2× better.** |
| **Ownership** | Not a framework default, not Apple's system blue, not Tailwind `blue-600` (`#2563EB`, 5.17:1). Distinctive. |
| **Psychology** | Cobalt — reads *active and confident*, the correct register for a verification platform. |
| **Brand continuity** | Still recognisably HelloVerify blue. Not a rebrand — a correction. |
| **Headroom** | Leaves a legible 500 for secondary actions and a 400 that passes 3:1 for dark-mode links. |

**Paired ink `#0D1B3E` at 16.89:1** does the authority work that the old navy `#00247A` did, in a cooler, more restrained register — and gives an enormous contrast budget for long-form legal and compliance content.

### 3.5 Neutrals — warm, not clinical

```css
--color-surface:   #FBFBF9;   /* warm off-white — page ground */
--color-surface-2: #F4F6FB;   /* section alternation */
--color-line:      #E4E8F0;   /* hairlines */
--color-ink-400:   #8A95AC;   /* ⚠ 2.91:1 — DECORATIVE / DISABLED ONLY */
--color-ink-500:   #5A6784;   /* 5.47:1 — secondary text, AA pass */
--color-ink-700:   #2B3A5C;   /* 10.88:1 — body text */
--color-ink-900:   #0D1B3E;   /* 16.30:1 — headings */
```

⚠️ **`#8A95AC` measures 2.91:1 and fails AA for text.** It is listed deliberately, restricted to disabled states and non-informational decoration. Every lighter grey that "looks nice for captions" is a conformance failure — the current site has `#909090` on white in the footer copyright at **~3.9:1**, which also fails.

### 3.6 Accent — one, not five

The current site uses **211 distinct hex colours**. The replacement system needs exactly **one** accent, for status and emphasis:

| Candidate | Hex | on `#FBFBF9` | Reads as |
|---|---|---:|---|
| Amber | `#B45309` | 4.85 | Warning, attention |
| Teal | `#0F766E` | 5.28 | Verified, secure |
| **Emerald** | **`#047857`** | **5.29** | **Verified, pass, cleared** |
| Rose | `#BE123C` | 6.07 | Flagged, failed |

**Recommendation: emerald `#047857` as the single accent** — semantically exact for a verification product ("verified / cleared"), passes AA, and pairs cleanly with cobalt without competing. Rose `#BE123C` reserved strictly for genuine error/flag states.

> **Semantic colour must never be the only signal** — ~8% of men cannot reliably separate red from green. Every pass/fail state carries an icon and a text label alongside colour.

### 3.7 Dark mode

Not a Phase 1 requirement. But the ramp is built so it is a token swap, not a redesign: `blue-400` (3.35:1 on white) passes 3:1 as a dark-surface link colour, and `blue-950` works as a dark ground.

---

## 4. Typography — direction, not final selection

**Decision deferred to the design session.** What research constrains:

### 4.1 Drop Merriweather

The current display face is **Merriweather** — a high-contrast newspaper serif, used **163 times** via `font-serif`. On a saturated navy field this is the visual signature of 2008–2012 corporate brochureware. It is the single largest contributor to the "old" perception.

### 4.2 The 2026 split

The field has divided into two coherent aesthetics: **techno-futurist** (dark, neon, shaders, bento grids) and **editorial** (light, warm neutrals, confident type, generous space). Both work. **Hedging between them is what reads as dated.**

For a compliance/trust product selling to governments: **editorial**. Techno-futurist reads as a crypto startup, which is the opposite of the required signal.

### 4.3 Hard constraints

| Constraint | Value | Source |
|---|---|---|
| Maximum families | **2** | Current site loads 4 across 14 weights (`AUDIT.md` B3) |
| Delivery | Self-hosted variable WOFF2, subset per script | `BUILD-SPEC.md` §9.3 |
| Font budget | **< 60 KB total** | `BUILD-SPEC.md` §9.1 |
| Script coverage | Latin + Devanagari + Arabic, subset and loaded per locale | `AUDIT.md` F1 |
| H1 length | **< 8 words / ~44 characters** | Conversion research |
| Body minimum | 16px, line-height ≥ 1.5 | WCAG 2.2 AA |

**A serif can absolutely return** — an editorial serif is squarely in the 2026 aesthetic. What must not return is a *newspaper* serif at display weight on a dark blue field.

---

## 5. Whitespace and layout

- Whitespace is **functional**, not decorative — it is the mechanism that reduces cognitive load (§2.1)
- **One idea per section.** This is also the structural requirement for AI citation (`BUILD-SPEC.md` §11a): each section must stand alone when extracted
- The current homepage runs ~11 `H2` sections with no rhythm and no breathing room between them
- A consistent vertical scale (`--spacing-section`) replaces 2,867 hand-tuned pixel values

**Constraint that makes this real:** no hex literal, no arbitrary `[…px]` value outside `@theme` — enforced by lint, failing the build (`BUILD-SPEC.md` §3.3).

---

## 6. Motion

- Subtle micro-interactions that **guide decisions**, not decorate
- Everything must respect `prefers-reduced-motion` — WCAG 2.2 AA
- Motion must not affect CLS. Budget is **0.1** (`BUILD-SPEC.md` §9.1)
- **No scroll-jacking, no entrance animation on the LCP element.** Animating the hero delays the largest paint, which is the metric under the tightest threshold

---

## 7. What this means for the design session

Settled here, not up for redebate:

- ✅ Primary `#1A3FCB` · Ink `#0D1B3E` · Surface `#FBFBF9` · Accent `#047857`
- ✅ Two font families maximum, self-hosted, < 60 KB
- ✅ Editorial direction, not techno-futurist
- ✅ One primary CTA per page
- ✅ Trust signals above the fold
- ✅ H1 under 8 words
- ✅ Every combination WCAG 2.2 AA or better
- ✅ Logical properties only — RTL is structural

Open for the design session:

- Typeface selection (within §4.3 constraints)
- Layout system — grid, section rhythm, card treatment
- Photography vs illustration vs abstract (with a hard image budget of 250 KB/page)
- Hero composition — how "3–5 second value" is demonstrated
- Iconography style
- How the accent is deployed
- Whether a serif returns, and where

---

## 8. Verify the numbers yourself

```bash
node -e "
function lum(h){const c=h.replace('#','').match(/../g).map(x=>{let v=parseInt(x,16)/255;
  return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
  return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
function cr(a,b){const l1=lum(a),l2=lum(b),[h,l]=l1>l2?[l1,l2]:[l2,l1];return (h+0.05)/(l+0.05);}
console.log('#007AFF on white:', cr('#007AFF','#FFFFFF').toFixed(2), '← current, FAILS AA');
console.log('#1A3FCB on white:', cr('#1A3FCB','#FFFFFF').toFixed(2), '← proposed, passes AAA');
"
```

---

## Sources

**Colour & trust**
- [Blue colour psychology in branding, 2026](https://colorarchive.org/guides/blue-color-psychology-branding-guide/)
- [Colour psychology in fintech branding](https://weandthecolor.com/color-psychology-in-fintech-branding-how-the-right-palette-builds-user-trust/209146)
- [Why blue is no longer king in tech branding](https://desinance.com/design/tech-branding-colors/)
- [WebAIM: contrast and colour accessibility](https://webaim.org/articles/contrast/)

**Conversion psychology**
- [B2B SaaS landing pages that convert, 2026](https://www.saashero.net/design/b2b-saas-landing-page-examples/)
- [Designing B2B SaaS landing pages](https://genesysgrowth.com/blog/designing-b2b-saas-landing-pages)
- [Landing page trust signals](https://www.saashero.net/design/landing-page-design-trust-signals/)
- [Landing page psychology beats pretty design](https://uistudioz.com/blog/landing-page-design-psychology-beats-design/)

**Design direction**
- [SaaS UI trends 2026](https://www.saasui.design/blog/7-saas-ui-design-trends-2026)
- [B2B SaaS website design trends](https://www.designrush.com/best-designs/websites/trends/b2b-saas-website-design)
- [Landing page design trends 2026](https://www.saashero.net/design/landing-page-design-inspiration-2026/)

**Accessibility & compliance**
- [European Accessibility Act overview](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
- [EAA compliance checklist & WCAG 2.2](https://www.webability.io/blog/eaa-compliance-checklist)
- [Does the EAA apply to B2B?](https://eye-able.com/blog/eaa-b2b)

**AI discovery**
- [GEO complete guide 2026](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026)
- [GEO for B2B](https://www.mersel.ai/generative-engine-optimization)

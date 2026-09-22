# HelloVerify — New Site Build Specification

**Project:** HelloVerify marketing site, rebuilt from scratch
**Target stack:** Next.js 16.3 (App Router) · TypeScript · Tailwind CSS v4
**Date:** 14 September 2026
**Companion documents:**
- [`AUDIT.md`](./AUDIT.md) — every decision here traces to a finding there
- [`INFORMATION-ARCHITECTURE.md`](./INFORMATION-ARCHITECTURE.md) — page flows, sitemap, user journeys, URL migration map
- [`DESIGN-RESEARCH.md`](./DESIGN-RESEARCH.md) — conversion psychology, colour system, accessibility rationale

**Explicitly out of scope for this document:** visual design, brand, art direction. Design is a separate workstream. This spec defines the *machine* the design will be poured into.

---

## 1. Goals and non-goals

### Goals

| # | Goal | Traces to |
|---|---|---|
| G1 | Every URL resolves correctly, once, at the server. No redirect chains, no client-side address rewriting. | AUDIT A2, A5 |
| G2 | Homepage transfers **under 500 KB** on first visit. Current: 12.5 MB. | AUDIT B1 |
| G3 | Core Web Vitals in the green on mobile field data: LCP < 2.0s, INP < 200ms, CLS < 0.1. | AUDIT B6 |
| G4 | No secret ever reaches the browser. | AUDIT E1 |
| G5 | Every page is server-rendered HTML at build time. No prerender-by-browser-automation. | AUDIT C2, G3 |
| G6 | A UI change happens in one place and propagates everywhere. | AUDIT D2, D3 |
| G7 | Content editing does not require a developer or a deploy. | AUDIT D5 |
| G8 | The architecture supports 100s of programmatic SEO pages without new engineering. | AUDIT C3 |
| G9 | CI proves production is correct *after* deploy, not just that the build compiled. | AUDIT G1 |

### Non-goals

- Porting the cart / orders / auth / Razorpay / KSA-applicant flows. **See §2.**
- Redesigning the brand. Design tokens will be defined as *slots*; values land later.
- Migrating the existing backend APIs. The new site consumes them unchanged.

---

## 2. Scope decision — marketing site only

The old repo contains two products fused into one codebase:

| Surface | Routes | Decision |
|---|---|---|
| **Marketing site** | 28 public routes — home, solutions, products, about, technology, contact, blog, policies | ✅ **In scope. This is the rebuild.** |
| **Authenticated app** | `/cart`, `/orders`, `/orders/candidate`, `/orders/smb-candidates`, `/profile-settings`, Razorpay checkout, KSA applicant auth, travel-assistance flows | ❌ **Out of scope.** Stays in the old repo, or moves to a separate app. |

**Rationale.** The authenticated surface is why the marketing site ships a 2.68 MB bundle containing an AES key and a payment SDK (AUDIT B2, E1). Marketing pages and a transactional app have opposite requirements — one wants static HTML at the edge with zero JS, the other wants a client runtime and a session. Fusing them is the single biggest architectural mistake in the current build, and carrying it forward would reproduce every symptom.

**Recommended split:**

```
www.helloverify.com      → new Next.js marketing site  (this spec)
app.helloverify.com      → existing SPA, unchanged, deployed as-is
```

The old SPA keeps working at a subdomain with **no code changes**. Links from marketing to app are plain cross-origin links.

> **OPEN DECISION — needs sign-off before Phase 0.** If the business requires cart/checkout to live on `www`, say so now. It changes the hosting tier, the CSP, the session strategy, and roughly three weeks of estimate. Everything below assumes the split.

---

## 3. Stack decisions

Each decision states what was chosen, why, and what was rejected. No decision is made on fashion.

### 3.1 Framework — Next.js 16.3.x, App Router

**Chosen.** Latest stable is **16.3.4** (31 Aug 2026).

| Capability | Why it matters here |
|---|---|
| **Static rendering by default** | Replaces the Playwright prerenderer (AUDIT G3) with a first-class build step. No Chromium in CI. |
| **`generateMetadata`** | Server-generated `<title>`, canonical, OG, hreflang. Kills the client-side DOM mutation in `PageMetaManager.tsx` (AUDIT C2). |
| **`generateStaticParams`** | Locale × route matrix generated at build time. Enables G8 — programmatic pages are a data array, not 100 new files. |
| **`redirects()` in `next.config`** | Real server 308s for the 10 obsolete URLs currently redirecting via JavaScript (AUDIT A5). |
| **Middleware** | Server-side locale negotiation, replacing the client `<Navigate to="/en">` (AUDIT F1). |
| **Server Actions** | Zoho CRM submission moves server-side. Fixes AUDIT E1. |
| **Nonce-based CSP** | Removes `'unsafe-inline'` (AUDIT E2). Only possible with a server. |
| **`next/image`** | AVIF/WebP, responsive `srcset`, automatic `width`/`height`, `priority` for LCP. Fixes AUDIT B4, B5. |
| **`next/font`** | Self-hosted, subset, zero-CLS fonts. Removes two render-blocking CDN origins (AUDIT B3). |

**Cache Components / PPR:** available (stable in 16, replaces the old experimental PPR flag) but **not used in Phase 1.** A marketing site should be 100% static. Reach for `use cache` only when a genuinely dynamic segment appears — a live pricing feed, a personalised CTA. Adding a caching model before there is anything to cache is how the last build accumulated complexity.

**Rejected:**
- *Astro* — better for pure content, but the contact/quote flows, locale switcher, and future logged-in CTAs want a real React runtime and Server Actions. Astro would win on payload and lose on the app boundary.
- *Staying on Vite SPA* — cannot fix A2, C2, E1, or E2 without a server. Non-starter.
- *WordPress* — hard no for a security/compliance vendor selling to governments.

### 3.2 Language — TypeScript, `strict: true`

The old codebase has **zero `: any`** (AUDIT D6). That discipline is the one thing to carry over wholesale. Additionally enable `noUncheckedIndexedAccess` and `verbatimModuleSyntax`.

### 3.3 Styling — Tailwind CSS v4 + shadcn/ui

**Tailwind v4** with **CSS-first configuration**. No `tailwind.config.js`; the theme lives in CSS under `@theme`, content detection is automatic, and the engine is ~3.5× faster on full builds.

```css
/* app/styles/theme.css */
@import "tailwindcss";

@theme {
  /* Colour is DECIDED — see DESIGN-RESEARCH.md §3. All ratios computed. */
  --color-blue-600: #1A3FCB;   /* primary action — 8.02:1 on white (AAA) */
  --color-blue-700: #1533A4;   /* hover */
  --color-ink-900:  #0D1B3E;   /* headings — 16.89:1 */
  --color-ink-700:  #2B3A5C;   /* body — 10.88:1 */
  --color-ink-500:  #5A6784;   /* secondary — 5.47:1 */
  --color-surface:  #FBFBF9;   /* warm off-white ground */
  --color-line:     #E4E8F0;
  --color-accent:   #047857;   /* verified / cleared — 5.29:1 */

  /* Type + spacing land in the design session. */
  --font-sans: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-heading), ui-sans-serif, system-ui, sans-serif;

  --spacing-section: 6rem;
  --radius-card: 0.75rem;
}
```

**The hard rule, enforced in CI:** no hex colour and no arbitrary `[…px]` value in any component. Everything references a token. This is the direct countermeasure to AUDIT D3 (211 hex colours, 2,867 arbitrary pixel values).

```jsonc
// eslint.config.js — fail the build, not a code review
"no-restricted-syntax": [
  "error",
  {
    "selector": "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
    "message": "Use a design token from @theme, not a hex literal."
  }
]
```

**shadcn/ui** for accessible primitives (Radix under the hood, copied into the repo rather than installed). Gives keyboard/ARIA-correct dialogs, dropdowns, tabs, and accordions without owning the a11y work — and without a dependency that dictates visual design.

**Rejected:** CSS Modules (no token enforcement), styled-components (runtime cost, RSC friction), a component library with opinions (Mantine/MUI — fights the design workstream).

### 3.4 Internationalisation — `next-intl`

**Chosen.** Built for App Router from the ground up; translations work in Server Components with no workarounds; the proxy (`middleware.ts` was renamed `proxy.ts` in Next 16) handles locale negotiation from one config; TypeScript knows every translation key. ~1.8M weekly downloads vs ~494k for `next-i18next`, and growing ~4× year on year.

**Rejected:** `react-i18next` (what the old site uses) — client-runtime-first, requires provider gymnastics in RSC, and would push translation loading back into the browser. `next-i18next` only gained App Router support in v16 (March 2026) and remains the smaller ecosystem for this router.

Locales: `en` (default, `x-default`), `hi`, `ar` (RTL). Architecture must accept a 4th locale by adding one array entry.

### 3.5 Content layer

> **OPEN DECISION — recommendation below, needs sign-off.**

**Phase 1 recommendation: typed in-repo content.** Content lives as TypeScript modules and MDX under `content/<locale>/`, imported at build time, fully type-checked, reviewed through PRs.

*Why start here:* zero ops, zero vendor cost, zero runtime fetch, content is versioned with the code that renders it, and type errors catch a missing Arabic key at build time instead of at runtime. It also directly fixes AUDIT D5 — no more browser-side JSON fetching with a regex comment-stripper.

**Phase 2: add Payload CMS when non-technical editing becomes a real bottleneck** — not before.

*Why Payload over the alternatives:* self-hostable on the existing GCP footprint (matters for enterprise/government data-residency questions), code-first schemas that stay in the repo and in TypeScript, no per-seat pricing curve, no vendor lock-in. It is widely regarded as the default choice for Next.js teams in 2026.

*Why not Sanity:* excellent multilingual tooling and the cleanest data layer via GROQ + TypeGen, but it is hosted SaaS with content living on a third party — a conversation you do not want to have mid-procurement with a ministry. Revisit if editorial workflow complexity outgrows Payload.

*Why not Contentful:* hardest to justify for a new project in 2026 — pricing curve plus no code-first schemas.

The abstraction boundary must be drawn at Phase 1 so Phase 2 is a swap, not a rewrite:

```ts
// lib/content/index.ts — the ONLY content entry point.
// Phase 1 reads from disk. Phase 2 reads from Payload. Callers never change.
export async function getPage(locale: Locale, slug: string): Promise<PageContent>
export async function getAllPageSlugs(locale: Locale): Promise<string[]>
```

### 3.6 Hosting — Google Cloud Run, behind Cloud CDN

**Chosen**, keeping the existing GCP footprint and Azure DevOps release process.

Since Next.js **16.2** (March 2026) the **Deployment Adapter API is stable** — built jointly by Vercel, Netlify, Cloudflare, AWS Amplify and Google — with support for App Router, SSR, ISR, middleware, Server Actions, image optimization and PPR outside Vercel. Self-hosting is a supported path, not a hack.

**Why not static export (`output: 'export'`) to the existing GCS bucket:** it would be the smallest change and it recreates every critical finding in the audit. No server means no real redirects (A2, A5), no locale negotiation (F1), no Server Actions so the CRM token stays in the browser (E1), no nonce CSP (E2), and no image optimization endpoint (B4). **The reason a server is needed is precisely the list of things currently broken.**

**Why not Vercel:** it is the highest-fidelity host for ISR/PPR and gives on-demand image optimization for free, and if the team wants to stop thinking about infrastructure, it is the correct answer. It is not the default recommendation here only because HelloVerify already runs on GCP, sells to government buyers who ask where data is processed, and has an Azure DevOps release process in place. **If those constraints are softer than they appear, Vercel cuts Phase 0 roughly in half — flag it.**

**Cloud Run configuration:**

| Setting | Value | Reason |
|---|---|---|
| Container | Node 22 LTS, `output: 'standalone'` | Minimal image, fast cold start |
| Min instances | `1` | Eliminates cold-start on the LCP path |
| CPU | Always-allocated | Image optimization needs CPU outside request scope |
| Concurrency | 80 | Static-heavy workload |
| Front door | Cloud CDN via external HTTPS LB | Edge caching of static and optimized assets |
| **Compression** | **Brotli + gzip enabled at the LB** | **Direct fix for AUDIT A1 — verified in CI, see §12** |

### 3.7 Supporting libraries

| Concern | Choice | Note |
|---|---|---|
| Forms | `react-hook-form` + `zod` v4 + `@hookform/resolvers` | Same schema client and server |
| Server validation | `zod` | The schema is the contract |
| Bot/abuse defence | Arcjet (`@arcjet/next`) or equivalent | See §10 |
| Icons | `lucide-react`, tree-shaken | Replaces the double-loaded Font Awesome (AUDIT B3) |
| Schema types | `schema-dts` | Type-checked JSON-LD |
| Analytics | `@next/third-parties` (GTM) | Correct script loading strategy |
| Unit/component tests | Vitest | Jest is legacy in 2026; Next's own docs use Vitest |
| E2E | Playwright | Already a team dependency |
| A11y | `@axe-core/playwright` + `vitest-axe` | Automated WCAG scanning at both layers |
| Perf gates | Lighthouse CI + `budget.json` | Fails CI on regression |

---

## 4. Repository structure

```
helloverify-web/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                  # html lang/dir, fonts, providers, JSON-LD org graph
│   │   ├── page.tsx                    # home
│   │   ├── about/page.tsx
│   │   ├── technology/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── solutions/[slug]/page.tsx   # authority verticals
│   │   ├── products/[slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── legal/[slug]/page.tsx       # policies
│   │   ├── countries/[country]/page.tsx   # programmatic SEO — §11
│   │   ├── checks/[check]/page.tsx        # programmatic SEO — §11
│   │   └── not-found.tsx
│   ├── api/
│   │   └── leads/route.ts              # server-only Zoho bridge
│   ├── sitemap.ts                      # replaces generate-seo-files.mjs
│   ├── robots.ts
│   ├── manifest.ts
│   └── opengraph-image.tsx             # replaces generate-og-image.mjs
├── components/
│   ├── ui/                             # shadcn primitives — Button, Dialog, Tabs…
│   ├── primitives/                     # Section, Container, Heading, Prose, Stat…
│   ├── blocks/                         # Hero, TrustStrip, FeatureGrid, FAQ, CTA, LogoWall
│   └── layout/                         # Header, Footer, LocaleSwitcher, Breadcrumbs
├── content/
│   ├── en/  hi/  ar/                   # MDX + typed TS content
├── lib/
│   ├── content/                        # the content boundary (§3.5)
│   ├── seo/                            # metadata builders, JSON-LD factories
│   ├── i18n/                           # next-intl config, routing, locale list
│   └── integrations/zoho.ts            # SERVER ONLY — never imported by a client component
├── messages/  en.json  hi.json  ar.json
├── public/                             # only truly static files. NOT an image dump.
├── e2e/                                # Playwright
├── src/proxy.ts                        # locale negotiation (NOT middleware.ts — renamed in Next 16)
├── next.config.ts                      # redirects, headers, image config
└── lighthouse-budget.json
```

**Rules:**
1. `components/blocks/*` compose from `components/primitives/*`. A block never hardcodes a colour or a spacing value. *(Fixes AUDIT D2, D3.)*
2. No file over **300 lines**. Enforced by lint. *(The old repo's largest component is 1,708 lines.)*
3. `lib/integrations/*` carries `import 'server-only'` at the top. A client import becomes a build error. *(Fixes AUDIT E1 structurally, not by convention.)*
4. Default to Server Components. `'use client'` requires a one-line comment stating why.

---

## 5. Rendering strategy

| Route class | Strategy | Rationale |
|---|---|---|
| All marketing pages | **Static (SSG)** via `generateStaticParams` | Pure HTML from CDN. Nothing to be slow. |
| Blog posts | **Static**, rebuilt on content change | Same. |
| Programmatic country/check pages | **Static**, generated from a data array | Hundreds of pages, zero incremental engineering. |
| Contact/quote submission | **Server Action** → server route | Secrets stay server-side. |
| 404 | Static | — |

**There is no SSR in Phase 1.** If a page needs per-request data later, that segment — and only that segment — gets `use cache` / PPR treatment. The default stays static.

Target: `next build` emits **zero** dynamic routes in Phase 1. This is an assertable property and it belongs in CI.

---

## 6. The URL contract

The single most important section of this document. AUDIT A2 exists because nobody wrote this down.

### 6.1 Canonical form

```
https://www.helloverify.com/<locale>/<path>
```

| Rule | Value |
|---|---|
| Scheme | `https` only. HSTS preload retained. |
| Host | `www.helloverify.com`. **`helloverify.com` must 308 to `www`.** |
| Trailing slash | **Never.** `trailingSlash: false`. One form, enforced at the edge. |
| `index.html` | **Never appears in a URL.** Not in the address bar, not in a redirect target, not in the sitemap. |
| Locale prefix | **Always present**, including for `en`. No unprefixed duplicates. |
| Case | Lowercase, hyphenated. |
| Canonical tag | **Self-referencing**, absolute, byte-identical to the sitemap entry and to the hreflang entry for that locale. |

**Acceptance test — every one of these must hold in production:**

```
GET https://helloverify.com/            → 308 → https://www.helloverify.com/
GET https://www.helloverify.com/        → 307 → /en   (Accept-Language negotiated)
GET https://www.helloverify.com/en      → 200      (no redirect)
GET https://www.helloverify.com/en/     → 308 → /en
GET .../en/index.html                   → 404
GET .../en/about                        → 200, canonical == self, no redirect
```

The `/` → `/en` redirect is **307 (temporary)**, not 308: the response varies by `Accept-Language`, so it must not be cached as permanent. `x-default` points at `/en`.

### 6.2 Redirect map

All legacy redirects move from the dead `web.config` and from client-side `<Navigate>` into `next.config.ts` as real **308**s.

> **CORRECTION (item 3, implemented).** The sketch below predates the audience-first IA and **every one of its targets points at a route that does not exist** — `/products/bgv-smb`, `/products/customer-kyc`, `/products/hellov`, `/products/immigration`, `/solutions/trade-authorities`. It is also incomplete: it lists 16 obsolete aliases and omits the ~20 pages that simply *moved*, which are the ones actually in the sitemap. Treat it as historical.
>
> The live contract is `src/lib/seo/legacy-urls.ts` (the table, with the provenance of every row) and `src/lib/seo/redirects.ts` (the emitter). **53 routes → 388 rules.** Targets follow `INFORMATION-ARCHITECTURE.md` §9, which supersedes this block wherever the two disagree — notably `/solutions` and `/products`, which go to `/governments` and `/business`, not to `/`.
>
> Four things this sketch does not account for, each of which produces a redirect chain if missed:
>
> 1. **`redirects` run before the proxy** (Next 16 pipeline step 2 vs 3), so every destination must be locale-prefixed and land on a real 200.
> 2. **`/index.html` must be generated per rule**, not stripped generically. The one-line strip below turns `/en/smb/index.html` into `/en/smb` and only *then* into `/en/business/smb` — a chain on exactly the URLs AUDIT A2 says Google holds.
> 3. **The indexed locale set is `en|hi|ar`; the served set is `en`.** 56 of the old sitemap's 84 URLs are `/hi` and `/ar`, and they consolidate onto English rather than 404ing. Pages that never moved (`/hi/about`) need a catch-all ordered after the specific rules and before the `/index.html` strip.
> 4. **Trailing-slash forms cannot be one hop.** Next registers `/:path+/` with `priority: true`, so `/en/smb/` is 308 → 308. The only lever is `skipTrailingSlashRedirect`, which would serve both `/en/about` and `/en/about/` as 200 site-wide — the duplicate-content failure §6.1 forbids. Two 308s is the better trade and is asserted as such.
>
> Still open: `/support/track` has no destination (see `PENDING_DECISIONS`). The old site already contradicted itself there — `web.config` *and* `App.tsx` both sent it to `?tab=enquiry`, never `?tab=track`.

```ts
// Historical sketch — see the correction above. Targets here are dead routes.
const LEGACY = [
  ['/smb',                         '/products/bgv-smb'],
  ['/kyc',                         '/products/customer-kyc'],
  ['/products/trust-safety',       '/products/customer-kyc'],
  ['/consumer',                    '/products/hellov'],
  ['/consumer/basic',              '/products/hellov'],
  ['/consumer/premium',            '/products/hellov'],
  ['/premium/consumer-service',    '/products/hellov'],
  ['/visa-screening',              '/products/immigration'],
  ['/solutions/business-trade',    '/solutions/trade-authorities'],
  ['/signup',                      '/contact'],
  ['/support',                     '/contact'],
  ['/support/enquiry',             '/contact'],
  ['/support/track',               '/contact'],
  ['/premium',                     '/contact'],
  ['/solutions',                   '/'],
  ['/products',                    '/'],
] as const

export default {
  trailingSlash: false,
  async redirects() {
    return [
      // Locale-scoped legacy paths
      ...LEGACY.flatMap(([from, to]) =>
        LOCALES.map((l) => ({
          source: `/${l}${from}`,
          destination: `/${l}${to}`,
          permanent: true,          // 308
        })),
      ),
      // Kill the /index.html family for good
      { source: '/:path*/index.html', destination: '/:path*', permanent: true },
    ]
  },
}
```

**Additional required redirect (not in the old codebase):** every currently-indexed `/<locale>/<path>/index.html` URL must 308 to its clean form. Those URLs exist in Google's index today because of AUDIT A2 and must be consolidated, not orphaned.

### 6.3 Verification

A post-deploy CI job probes the live origin for every rule in §6.1 and every entry in §6.2, and **fails the release** on mismatch. This is the missing control from AUDIT G1 — the old pipeline verified `dist/`, never production.

**Built:** `tools/seo/probe-redirects.mjs` (`npm run probe:redirects <origin>`). It takes an origin, so the same command gates a local build and a production deploy. **815 assertions**, and the one that matters most is hop *count*: every legacy URL must reach a 200 in one hop, because a chain is the specific failure the old site shipped. It also reads `.next/routes-manifest.json` when present, to check what Next actually registered rather than what the emitter meant to hand it. Two deviations are reported without failing — `/xx/about` returns 307→404 rather than a flat 404 (§7's to settle), and the seven cross-host rules assume `app.helloverify.com` resolves at cutover.

---

## 7. Internationalisation architecture

```ts
// lib/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'hi', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',        // /en/about — never an unprefixed duplicate
  localeDetection: true,         // Accept-Language negotiation at the edge
})
```

```ts
// app/[locale]/layout.tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false   // unknown locale → 404, never a soft 200

export default async function LocaleLayout({ params, children }) {
  const { locale } = await params
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  )
}
```

### RTL is a build rule, not a review item

The old site sets `dir="rtl"` correctly but styles with physical properties, so Arabic layout correctness is manual and per-component (AUDIT F1).

**Rule: CSS logical properties only.** `margin-inline-start`, not `margin-left`. `text-start`, not `text-left`. `padding-inline`, not `px-*`-with-assumptions. Tailwind v4 ships logical utilities — use them exclusively, and lint against the physical variants.

### Translation completeness is a build gate

`messages/*.json` are typed against the `en` keyset. A missing `ar` key is a **type error**, not a runtime fallback. This replaces `cms-locale-parity.mjs` (AUDIT F1) — the drift detector becomes unnecessary because drift becomes unrepresentable.

---

## 8. SEO implementation

### 8.1 Metadata

> **CORRECTION (item 5, implemented).** The sketch below is right about the shape and wrong about two details, both of which were measured on the build output rather than argued. The live contract is `src/lib/seo/metadata.ts` (one helper, called by all 32 pages) and `tools/seo/check-sitemap.mjs` (which reads the emitted HTML and fails the build on a disagreement).
>
> 1. **`openGraph` must NOT be set per page.** Next merges metadata shallowly, so a page-level `openGraph` *replaces* the object the layout resolved — and `next/dist/lib/metadata/resolve-metadata.js#mergeStaticMetadata` attaches an `opengraph-image` file only to the segment that owns it, which is the layout. Setting `openGraph` exactly as sketched below removed `og:image` from all 56 prerendered pages at once. The trade is `og:url` against `og:image`, and `og:image` wins: every page here is reachable at exactly one URL (§6.1 — the alternatives 308), so a scraper's fetched URL already *is* the canonical, while a dead card is visible on every share. `og:title`/`og:description` auto-fill from the page title and description; `og:type`, `og:site_name`, `og:locale`, `og:image` and `twitter:card` inherit from the layout. All six are asserted per page.
> 2. **The copy does not come from a `seo` translation namespace — yet.** Each page still states its own reviewed title and description and passes them to the helper. Centralising 32 pairs into a table is the right end state and is what the `getTranslations` call below implies, but it is a copy review, so it belongs with the locale work (§7), not with a canonical tag.
>
> Two things the sketch leaves implicit, both load-bearing:
>
> - **`generateMetadata` is handed no pathname**, so every page names its own route as a string — 32 chances to name the wrong one. That is guarded twice: the helper rejects a `path` that is not in the route manifest (a build error), and the checker asserts each emitted canonical equals *its own* URL, which is the half the helper cannot see because another page's route is still a valid manifest entry. Both guards were confirmed by breaking them on purpose.
> - **Canonical and hreflang are built by the same `absoluteUrl(localePath(…))` calls `app/sitemap.ts` makes**, so §6.1's byte-identity rule holds by construction. Passing the relative form instead emits identical bytes (`metadataBase` resolves it) — absolute is for legibility and for a checker that can compare plain strings, not for the output.
>
> Cosmetic, but it costs an hour if you meet it cold: **Next writes `hrefLang="en"`, not `hreflang="en"`**, into the HTML, despite its own docs showing the lowercase form. Crawlers do not care — HTML attribute names are case-insensitive — but grepping the build output for `hreflang` finds nothing.
>
> §14.3's production contract test still stands: this gate proves the build is correct, not that the deployment is.

```ts
// app/[locale]/[...]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  const path = `/${locale}/${slug}`

  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.description`),
    alternates: {
      canonical: path,                              // self-referencing, absolute via metadataBase
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}/${slug}`])),
        'x-default': `/en/${slug}`,
      },
    },
    openGraph: { type: 'website', url: path, locale, siteName: 'HelloVerify' },
    twitter: { card: 'summary_large_image' },
  }
}
```

`metadataBase: new URL('https://www.helloverify.com')` and a title template go in the root layout — everything else inherits.

**Hreflang correctness rules** (all currently satisfied by the old site; do not regress — each is now asserted per page by `npm run check:sitemap`):
- Absolute URLs with protocol and host. Relative `href` is invalid.
- Trailing-slash form **identical** across canonical, hreflang and sitemap.
- Every language version carries a **self-referencing** canonical. Never point `hi` and `ar` at the `en` page — that tells Google to ignore them.
- `x-default` → `/en`. It is the neutral fallback, not a country-targeted page.

**Port from `src/config/seo.ts` (337 lines):** all 28 route title/description pairs, translated. That copy is written and reviewed — reuse it verbatim.

**Drop:** `<meta name="keywords">`.

### 8.2 Structured data

> **CORRECTION (item 6, implemented).** The table below is right about which
> nodes to emit and where. Three things in the surrounding prose are wrong, and
> one instruction cannot be followed as written.
>
> 1. **`WithContext<Thing>` on the component prop does not make a malformed
>    graph fail `tsc`.** `Thing` is the union of every schema.org type, and
>    TypeScript's excess-property check fires only on a *fresh object literal at
>    its assignment site*. Measured, four cases, transcripts in
>    `tools/test/schema-types.md`: `foundingYear: "2018"` on a fresh literal
>    typed `WithContext<Organization>` is an error; the same invented property
>    on a non-fresh value assigned to `WithContext<Thing>` — which is exactly
>    the shape the sketch below produces — type-checks clean. The strictness
>    therefore lives in each builder's concrete return type
>    (`src/lib/seo/schema/*.ts`), and the component prop stays loose because it
>    has to render all six node kinds. Incidentally, `WithContext<T>` is a
>    union, so one node cannot be derived from another by spreading
>    (*TS2698*) — write a fresh literal.
>
> 2. **`JSON.stringify` alone is not safe in that `dangerouslySetInnerHTML`.**
>    `<script type="application/ld+json">` is a raw text element: the HTML
>    parser ends it at the first `</script` sequence, wherever that appears,
>    including inside a JSON string, and does not decode entities. The
>    serialiser escapes `<` as `\u003c` — legal JSON for the same character, so
>    the graph is unchanged while the sequence never reaches the HTML parser.
>    Nothing on the site triggers it today; `tools/test/json-ld.test.ts` covers
>    it in 10 assertions, including that the unescaped form really does break.
>
> 3. **"Port from `StructuredData.tsx`" — done, from
>    `D:\Projects\Application Frontend HV`.** (Item 6 shipped before that repo
>    was available and re-derived the facts from `app/[locale]/about` and
>    `src/lib/content/*`, omitting every field it could not evidence. Item 7
>    completed the port.) `sameAs`, `telephone` and `email` are now real values
>    from the old site rather than omissions.
>
>    **The old schema was wrong about the head office**, which is the reason to
>    port facts rather than files: it says Mumbai (`StructuredData.tsx:45`),
>    while its own `seo.ts:50` says "Founded in Noida" and its contact page says
>    "India, New Delhi". Confirmed as **Noida** — so the JSON-LD running in
>    production today names the wrong city. Two further conflicts settled the
>    same way: **six** offices, not the four its contact page lists, and the
>    LinkedIn `/company/` page, not the `/in/…` personal profile its footer
>    links.
>
>    **Not ported: ISO/IEC 27701 and SOC 2.** The old `llms.txt` claims the
>    first and the old `seo.ts` the second; neither appears on this site's
>    reviewed `/about` credentials list, so both are omitted pending
>    confirmation and `check-llms.mjs` fails the build if either reappears. An
>    unevidenced certification claim is the worst kind of schema error for a
>    compliance vendor. `logo` and `streetAddress` remain absent — the old
>    repo's logo is an SVG at a path that does not exist here, and no street
>    line exists in either repo.
>
> 4. **`BreadcrumbList` "on every page below depth 1" is emitted slightly wider
>    and slightly narrower than that.** Wider: it comes from `PageShell`, so
>    every page with a visible trail gets one, hubs included. Narrower: the
>    eight `/legal/*` pages get none, because their middle rung (`Legal`) is not
>    a page and Google requires `item` on every element but the last. 47 of 56.
>
> Two further decisions worth recording, both taken because the alternative
> asserts something untrue:
>
> - **`Offer` carries no `price`.** Both package pages say on the page that
>   their prices are placeholders pending commercial sign-off (IA §10.4). A
>   visible caveat is a sentence a human reads; `"price": "349"` in JSON-LD is a
>   machine-readable commercial claim an engine will quote without it.
> - **`Service.areaServed` is the text `"120+ countries"`**, not the eight
>   entries in `content/countries.ts` — which the coverage page itself describes
>   as a subset. A short country list would let an engine answer "do you operate
>   in Germany" with a confident no.
>
> Verified the way §8.1 was: `tools/seo/check-schema.mjs` parses the emitted
> HTML and compares the graph against the page it describes, and the gate was
> broken thirteen ways — ten caught by the gate, two caught only by `tsc` and
> recorded as compiler catches rather than counted as coverage, one a
> byte-identical no-op and documented as one. The FAQ lift that made
> `FAQPage` derivable was held to byte-identical rendered markup across all 56
> pages.

JSON-LD renders **inside the page/layout component**, not in `generateMetadata`, and must be injected in a way React does not escape:

```tsx
// components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Typed with `schema-dts` so a malformed graph fails `tsc`.

| Schema | Where | Status |
|---|---|---|
| `Organization` + `ContactPoint` + `PostalAddress` | Root layout | Port from `StructuredData.tsx` |
| `WebSite` | Root layout | Add |
| `Service` (per solution/product) | Solution & product pages | Port |
| `OfferCatalog` / `Offer` | Product pages | Port |
| `BreadcrumbList` | Every page below depth 1 | **New** — AUDIT C2 |
| `BlogPosting` + `author` + `datePublished` | Blog posts | **New** — AUDIT C2 |
| `FAQPage` | Pages with a real FAQ block | **New** |

Note the January 2026 Google schema deprecations — do not implement `Q&A` or `Sitelinks Search Box`.

### 8.3 Generated SEO files

> **CORRECTION (item 7, implemented).** `llms.txt` is now generated
> (`src/lib/seo/llms.ts`, served by `src/app/llms.txt/route.ts`) and gated by
> `tools/seo/check-llms.mjs`. Three notes on the instruction as written:
>
> 1. **"Port the hand-written content" — done.** The original is 75 lines at
>    `D:\Projects\Application Frontend HV\public\llms.txt`. Its quotable
>    definition, supporting paragraph, Company block, Core services, Trust &
>    compliance and Optional blocks are all ported; only the page index is
>    regenerated, which is exactly the split this section asks for. One sentence
>    is deliberately dropped — "Public site locales: English (`/en`), Hindi
>    (`/hi`), Arabic (`/ar`)" — because this site serves `en` only and those 56
>    URLs currently 308 onto English. Advertising them to a crawler that handles
>    redirects badly (§11a.1) would be AUDIT A2 in a new file.
> 2. **"Regenerate route lists from the same manifest" required a copy table
>    first.** The manifest holds paths, change frequencies and priorities and no
>    copy; the 32 reviewed descriptions lived inside the page files. §8.1's own
>    correction called centralising them "the right end state" and deferred it —
>    item 7 forced it. `src/lib/seo/copy.ts` is that table, `pageMetadata` lost
>    its `copy` argument, and the refactor was held to byte-identical rendered
>    markup on all 56 pages.
> 3. **A Route Handler needs `export const dynamic = "force-static"`.** Next 16
>    does not cache them by default — its own docs,
>    `next/dist/docs/01-app/01-getting-started/15-route-handlers.md:51`. Without
>    it the file renders per request and never reaches the build output, so the
>    gate has nothing to read. `check-llms.mjs` fails if the prerendered body is
>    missing, which makes that a caught regression rather than a silent one.

| Old | New |
|---|---|
| `scripts/generate-seo-files.mjs` (203 lines) | `app/sitemap.ts`, `app/robots.ts` — framework-native |
| `scripts/generate-og-image.mjs` | `app/opengraph-image.tsx` — per-route OG at build time |
| `scripts/generate-favicon.mjs` | `app/icon.tsx` + static assets |
| `llms.txt` | **Keep.** Port the hand-written content; regenerate route lists from the same manifest that feeds `sitemap.ts`. |

The sitemap derives from the same route source as `generateStaticParams`. **A page cannot exist without being in the sitemap, and a sitemap entry cannot exist without a page.** That invariant is what makes AUDIT A2 impossible to reintroduce.

### 8.4 Referrer policy

> **CORRECTION (item 7, implemented).** The instruction says "change from
> `no-referrer`", but `next.config.ts` had **no `headers()` block at all** — so
> this was adding the first one, not editing a value. It now sets
> `Referrer-Policy: strict-origin-when-cross-origin` on `/:path*`, documents and
> subresources alike.
>
> It is the only header set. §13's HSTS, CSP and frame-options each need their
> own measurement — a CSP has to be built against the real script and style
> inventory — and are left to their own item rather than guessed at here.
>
> **No build-output gate can verify this**, which is worth recording: reverting
> the value passes `check:sitemap`, `check:schema` and `check:llms` untouched
> (measured). The assertion lives in `npm run probe:redirects` against a running
> origin, where reverting it fails 4 of 823 assertions — the same §14.3 argument
> that a build being correct is not the deployment being correct.

Change from `no-referrer` to **`strict-origin-when-cross-origin`** (AUDIT C2). The current setting silently degrades first-party attribution and partner referral tracking.

---

## 9. Performance

### 9.1 Budgets — enforced in CI, not aspirational

> **CORRECTION (item 8, implemented).** The budgets are now measured on every
> build by `tools/perf/check-budgets.mjs` (`npm run check:perf`). Three things
> about the sketch above:
>
> 1. **`lhci autorun` on a preview deployment is not possible here** — this repo
>    has no CI and no preview deployment. It also conflates two different kinds
>    of check. `resourceSizes` and `resourceCounts` are properties of the BUILD:
>    deterministic, no browser needed, measured today. `timings` (LCP, CLS, TBT)
>    are properties of a DEPLOYMENT and belong with §14.3, for exactly the reason
>    §14.3 exists — a build being correct is not the deployment being correct.
> 2. **One `"path": "/*"` entry is not enough.** This site has 56 routes of very
>    different weight; a per-page budget is only met if the WORST page meets it,
>    so all 56 are measured and the worst is reported per metric.
> 3. **Two of the five numbers are not met, and one may not be reachable.**
>    Measured, brotli: script 159.7 KB against 120, font 241.9 KB against 60.
>    Total is met at 445.7 KB against 500 (it was 528.7 KB before item 8). The
>    gate therefore runs two tiers — §9.1 as the reported target, and a measured
>    ceiling as the enforced one — because a gate pinned to an unreachable number
>    gets switched off or gets the number quietly raised.

```jsonc
// lighthouse-budget.json
[{
  "path": "/*",
  "resourceSizes": [
    { "resourceType": "script",   "budget": 120 },   // KB, compressed
    { "resourceType": "stylesheet","budget": 40  },
    { "resourceType": "image",    "budget": 250 },
    { "resourceType": "font",     "budget": 60  },
    { "resourceType": "total",    "budget": 500 }
  ],
  "resourceCounts": [
    { "resourceType": "third-party", "budget": 5 }
  ],
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2000 },
    { "metric": "cumulative-layout-shift",  "budget": 0.1  },
    { "metric": "total-blocking-time",      "budget": 200  }
  ]
}]
```

| Metric | Old site | Target | Factor |
|---|---:|---:|---:|
| Homepage total transfer | 12,500 KB | **< 500 KB** | **25× reduction** |
| JavaScript (compressed) | 2,614 KB (uncompressed, no chunking) | **< 120 KB** | **~22×** |
| CSS (compressed) | 195 KB (uncompressed) | **< 40 KB** | **~5×** |
| Third-party origins in `<head>` | 4 | **0** | — |
| LCP (mobile field) | not measurable | **< 2.0 s** | — |
| INP | not measurable | **< 200 ms** | — |

`lhci autorun` runs on every PR against the preview deployment. Budget breach = failed check.

### 9.2 Images

> **CORRECTION (item 8).** Two claims here do not survive measurement:
>
> - **"`priority` + `fetchpriority="high"` on the LCP image of every page."**
>   Measured across all 56 prerendered pages: the `<h1>` precedes the first
>   `<img>` on **every one of them**. The LCP element on this design is text, so
>   there is no LCP image to prioritise, and adding `priority` broadly would
>   preload non-LCP images and make things worse. Separately, Next 16.3.5's
>   `priority` emits `<link rel="preload" as="image">` and drops
>   `loading="lazy"`, but does not add `fetchpriority="high"` to the `<img>`.
> - **"No raw `<img>` — lint rule."** True today (zero across 24 files using
>   `next/image`) and now enforced, but by `check-budgets.mjs` rather than a
>   linter, since none is wired up and the rule is one grep.
>
> Image WEIGHT is still unmeasured by any gate: the optimizer generates
> `/_next/image?url=…` variants at request time, so they are not in the build
> output to weigh. That budget belongs with the timings, against a running origin.

- **`next/image` everywhere.** No raw `<img>` in components — lint rule.
- Automatic **AVIF → WebP → original** negotiation. Sharp compression alone typically cuts 40–70%; format conversion adds another 25–35%, for a combined **60–80% reduction** against the current PNGs.
- `priority` + `fetchpriority="high"` on the LCP image of every page. Currently **zero** images on the site carry it (AUDIT B5).
- `width`/`height` mandatory — `next/image` enforces it, which eliminates the 36 unsized images causing CLS.
- **Self-hosted optimization:** `sharp` installed as an explicit dependency (required when not on Vercel), running on Cloud Run with Cloud CDN caching the optimized variants. No per-transformation billing.
- **Abuse protection:** cap `deviceSizes`/`imageSizes` to the sizes actually used, and restrict `remotePatterns` to known hosts, so the optimizer cannot be driven to generate arbitrary dimensions.
- **Asset hygiene:** lowercase, hyphenated filenames, no spaces. The old repo ships `tenant-verification -egypt.png` and `employement-single-check.png` (AUDIT B1).

**One-time migration task:** re-encode all 155 PNG/JPG source images. The 3 MB and 1.8 MB PNGs must not survive the move.

### 9.3 Fonts

> **CORRECTION (item 8, implemented).** The fonts are now self-hosted and
> subset: `npm run build:fonts` (`tools/perf/subset-fonts.mjs`) takes a census of
> the 133 characters the 56 pages actually render and cuts the faces to it, then
> `next/font/local` serves them. **324.1 KB -> 241.9 KB**, no visual change —
> both of Newsreader's variable axes survive a harfbuzz subset.
>
> **"Maximum two families" is not met: the design ships three** (Newsreader,
> Instrument Sans, Geist Mono), and that is why 60 KB is out of reach. Measured
> on Newsreader roman, glyph-subset: 82 KB with both axes, 35 KB with `opsz`
> pinned, 23 KB with `opsz` pinned and `wght` narrowed, 13 KB fully static. The
> serif runs 15px to 176px, so `font-optical-sizing` is doing visible work and
> pinning it is a DESIGN.md decision rather than a build step. Even fully
> instanced, three families land near 90 KB.
>
> `subsets: ["latin"]` was the trap: it sounds like subsetting and is not — it
> is ~200 glyphs of Google's choosing, against the ~130 this site renders.

- `next/font/local` with **self-hosted variable WOFF2**, subset to the glyphs actually used per script (Latin / Devanagari / Arabic).
- **Maximum two families.** The old site loads four across 14 weights (AUDIT B3).
- `display: swap` + preloaded, zero external origins, zero CLS from font swap.
- Arabic and Devanagari get their own subsets, loaded **only** on those locales.

### 9.4 Third parties

| Script | Handling |
|---|---|
| GTM | `@next/third-parties/google` — correct loading strategy, off the critical path |
| Ahrefs Analytics | `next/script` with `strategy="lazyOnload"` |
| Font Awesome | **Removed entirely.** Replaced by tree-shaken `lucide-react`. |

Budget: **maximum 5 third-party requests** on any page, none render-blocking.

---

## 10. Forms, CRM, and abuse protection

The current contact form posts directly from the browser to Zoho with public tokens (AUDIT E1). The replacement:

```
Browser                    Server (Cloud Run)              Zoho CRM
───────                    ──────────────────              ────────
react-hook-form
  + zod (client UX)  ──POST──▶  Server Action
                               ├─ zod re-validate (same schema)
                               ├─ bot / rate-limit check
                               ├─ honeypot + timing check
                               ├─ email MX + disposable-domain check
                               └─ fetch Zoho with SERVER-ONLY token  ──▶
```

**Defence layers** — no single one is sufficient:

1. **Same zod schema on both sides.** Client validation is UX; server validation is the contract.
2. **Rate limiting per identity.** A real user submits once, maybe twice after an error. Five posts per ten minutes from one IP is already a generous ceiling.
3. **Bot detection on the POST handler** — the one place a bot cannot skip is the server receiving the submission.
4. **Email quality checks** — reject disposable domains, invalid addresses, and domains with no MX record.
5. **Honeypot field + submission-timing check** — free, catches naive spam without a CAPTCHA.

**Non-negotiable:** the Zoho token is a **server environment variable**, never `NEXT_PUBLIC_*`. `lib/integrations/zoho.ts` carries `import 'server-only'` so a client import is a build failure, not a code-review catch.

**Port from the old repo:** the Zoho field mapping in `src/lib/zohoLeadApi.ts` and `src/config/zohoCrm.ts`, including the hard-won comment that an unknown `Lead Source` makes Zoho return HTTP 200 and silently drop the lead.

---

## 11. Programmatic SEO

AUDIT C3: 12 real commercial pages for a company claiming 120+ countries and 30+ check types. This is the largest untapped organic lever, and the architecture must make it cheap.

```
/[locale]/countries/[country]     → "Background Verification in {Country}"
/[locale]/checks/[check]          → "{Check Type} Verification — process, turnaround, coverage"
/[locale]/industries/[industry]   → "BGV for {Industry}"
```

Each is **one route file + one typed data array**. `generateStaticParams` fans out; `generateMetadata` produces unique titles and descriptions per entry; `sitemap.ts` picks them up from the same source automatically.

**Quality gate — mandatory.** Programmatic pages must carry genuinely differentiated content: real turnaround times, real coverage, real regulatory context per country. Templated pages with a find-and-replace country name are thin content and will be treated as such. **Do not ship this until the content exists.** It is Phase 4 for exactly that reason.

---

## 11a. AI search optimisation (GEO / AEO)

Classical SEO gets you into the index. It does not get you into the **answer**. A growing share of "which BGV vendor should we use" is now resolved before anyone visits a website.

| Engine | Reach | Behaviour |
|---|---|---|
| ChatGPT | ~800M weekly users | Retrieval + synthesis; `OAI-SearchBot` powers search |
| Google Gemini / AI Overviews | ~750M monthly + ~2B via Overviews | Blends classical ranking with synthesis — **pages that rank well tend to appear** |
| Perplexity | ~45M+ | Heavily citation-focused, real-time, strong recency preference, most transparent about sources |
| Claude | ~30M | Synthesises rather than quoting directly |

**Foundational point:** AI platforms pull from indexed web content. Crawlability, content quality, and classical authority signals remain the base layer — GEO *extends* SEO, it does not replace it. Everything in §8 is a prerequisite for this section.

### 11a.1 Crawler access policy

Twelve crawlers matter in 2026: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI) · `ClaudeBot`, `Claude-User`, `Claude-SearchBot` (Anthropic) · `PerplexityBot`, `Perplexity-User` (Perplexity) · `Google-Extended`, `GoogleOther` (Google) · `Applebot-Extended` (Apple) · `BingBot` (Microsoft).

All of the above respect `robots.txt`. Compliance is opt-in and user-triggered real-time fetches are a grey area — treat it as a norm, not a guarantee.

**Critically: training and search are separate agents.** A site can decline to be training data while remaining eligible for citation in answers.

**Decision for HelloVerify: allow everything.** This is a marketing site whose entire purpose is discovery. There is no proprietary content to protect, and blocking a training crawler while competitors allow them removes you from the corpus that shapes category answers.

```ts
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      // Explicit allow — defensive against future default-deny policies
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'], allow: '/' },
      { userAgent: ['ClaudeBot', 'Claude-User', 'Claude-SearchBot'], allow: '/' },
      { userAgent: ['PerplexityBot', 'Perplexity-User'], allow: '/' },
      { userAgent: ['Google-Extended', 'GoogleOther', 'Applebot-Extended'], allow: '/' },
    ],
    sitemap: 'https://www.helloverify.com/sitemap.xml',
    host: 'https://www.helloverify.com',
  }
}
```

> **Note the dependency on §6.** AI crawlers handle redirects worse than Googlebot does. The current `/en` → `301` → `/en/index.html` chain (`AUDIT.md` A2) is actively costing AI citations today. **Fixing the URL contract is a GEO fix, not only an SEO fix.**

### 11a.2 Content structure for extraction

This is the part that actually determines citation probability.

**Semantic chunking — one concept per section.** AI engines parse content by section, not by page. Each section must be a **self-contained unit that survives extraction** from its surrounding context.

**The answer-block pattern — mandatory on every commercial page:**

```html
<h2>How long does employment verification take?</h2>
<p>
  <!-- ~40 words. Complete answer. No "as mentioned above". No pronouns
       referring outside this block. This is what gets extracted. -->
  HelloVerify completes digital employment verification in 60 minutes on
  average across 120+ countries, using primary-source checks against
  employer records. Complex or offline-record cases complete within
  three business days.
</p>
<!-- Supporting detail, examples, and nuance follow below. -->
```

**Rules, enforced in content review:**

1. **Question-shaped `H2`s** where a real query exists. Answer immediately below in ~40 words.
2. **Logical `H1 > H2 > H3`** — the document outline must match the argument.
3. **No orphan pronouns.** A block referring to "this process" without naming it is unciteable.
4. **Statistics with specificity.** "20M+ checks since 2018 across 120+ countries" beats "millions of checks." Statistics and structured formatting measurably increase citation probability.
5. **Comparison tables, numbered steps, FAQ blocks.** These formats are extracted disproportionately often.
6. **Cite your own sources inline.** Content that references research, government data, and industry reports scores higher in RAG retrieval. For a compliance vendor this is natural — cite the actual regulation.
7. **Semantic HTML.** `<article>`, `<section>`, `<table>`, `<dl>` — not `<div>` soup. Google's own AI-search guidance points at semantic HTML and standard crawling best practices.

### 11a.3 Schema is the machine-readable layer

Without schema, retrieval systems must infer meaning from unstructured text — which reduces both the likelihood and the accuracy of citation. Controlled tests show pages with valid, comprehensive schema are significantly more likely to be cited.

Everything in §8.2 applies, with these additions specifically for AI retrieval:

| Schema | Why it matters for AI |
|---|---|
| `FAQPage` | Directly maps question → answer; highest-value extraction format |
| `HowTo` on process sections | "How does background verification work" is a top query shape |
| `Service` + `areaServed` | Lets an engine answer "does X operate in Y country" correctly |
| `Organization` + `sameAs` | Entity disambiguation — ties HelloVerify to its LinkedIn, Crunchbase, G2 profile |
| `BlogPosting` + `datePublished` | Perplexity weights recency heavily; undated content is deprioritised |

**Entity consistency:** the `Organization` block must be byte-identical across every page and match external profiles exactly (name, address, founding date, identifiers). Inconsistent entity data is the most common reason an engine attributes a claim to the wrong company.

### 11a.4 `llms.txt`

The existing hand-written `llms.txt` is **genuinely ahead of the market** and must be ported. `robots.txt` governs *access*; `llms.txt` governs *navigation* — it points an engine at what matters.

Requirements:
- Regenerated from the same route manifest that feeds `sitemap.ts` — it can never drift
- Leads with a one-paragraph, quotable company definition
- Includes the hard numbers (20M+, 120+, 2000+, certifications)
- Lists key pages with a one-line description each

It is a proposed standard, not a ratified one, and support is not universal. It costs nothing and it is already written.

### 11a.5 Measurement

Classical rank tracking will not show this. Required from day one:

- **Referral traffic segmented by AI source** — `chat.openai.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com` in GA4
- **Citation monitoring** — periodic prompting of each engine with the 20 target queries, logging whether HelloVerify is cited and how it is described
- **Server-log analysis of AI crawler hits** — are they arriving, what are they fetching, are they hitting redirects

> **The single highest-leverage GEO action available right now is unrelated to content: fix the redirect chain and enable compression.** An engine that times out or gets a redirect loop does not cite you, regardless of how well the page is written.

---

## 12. Accessibility — a procurement requirement

> **CORRECTION (item 10, implemented).** The gate is
> `helloverify-web/tools/a11y/check-axe.mjs` plus `check-contrast.mjs`, both in
> `npm run check:all`. **Zero critical or serious violations across all 56
> pages**, down from 56 serious and 518 advisory. Four notes:
>
> 1. **axe runs in jsdom, not Playwright.** Same axe-core ruleset, same engine,
>    no browser — the §14.3 argument again: a check needing a 200 MB download is
>    a check that gets skipped. Three rules cannot run without layout and are
>    named in the output: `color-contrast`, `target-size`, and
>    `scrollable-region-focusable`.
> 2. **Contrast is computed from the tokens, which is stricter than axe.** axe
>    samples rendered pixels and skips text whose background it cannot resolve —
>    gradients, photographs, scrims, all of which this design uses heavily. A
>    token table has no such gaps. `#007AFF` is gone and its return fails the
>    build.
> 3. ~~**The table's "Known live failure" is now `--faint`, not `#007AFF`.**~~
>    **There is no known live text failure as of 22 Sep 2026.** `--faint`
>    measured **2.43:1** — worse than the 4.02:1 this section flags — and was
>    used as text in 40 `design.css` selectors and 29 in `pages.css` at
>    10.5–12px, 180 rendered nodes on the homepage alone. TASKS.md Part 2a
>    **deleted the token**: 2.43:1 is below the 3:1 large-text threshold as well,
>    so enlarging the labels could not have passed it, and the lightest passing
>    colour on that hue measures 1.06:1 from `--muted` — indistinguishable. The
>    third text tier was not achievable at AA on this paper at any size, so every
>    use now reads `var(--muted)` (4.83:1 on paper, 5.31:1 on white), the nine
>    artboards included. `check-contrast.mjs` carries **no** accepted exceptions
>    and `a11y.spec.ts` has no accepted-foreground set.
> 4. **The canvas shipped no focus style, no skip link and no
>    `prefers-reduced-motion`** — none of which is visible in a static mockup, so
>    none survived the port. All three are now in `globals.css`, deliberately not
>    in the generated `design.css`/`pages.css`.
>
> Still open, and all needing a real browser or real Arabic copy: the manual
> keyboard and screen-reader pass, `target-size` (2.5.8), and RTL — 165 physical
> CSS properties in `design.css` and 32 in `pages.css`, which must be fixed in
> `tools/port/build-css.py` rather than in its output.

Not a quality preference. A contractual one.

- EAA enforcement active since **28 June 2025**
- **EN 301 549 v4.1.1** published **2 September 2026**, expected in the EU Official Journal **November 2026** → **WCAG 2.2 Level AA** becomes the presumed technical standard
- **Public institutions contract only with vendors meeting it** — a conformance report is part of procurement
- A B2B label does not exempt a service sold into the EU market

HelloVerify sells to ministries. **An accessibility conformance statement is a sales asset.**

| Requirement | Implementation |
|---|---|
| Target | **WCAG 2.2 Level AA**, all routes, all 3 locales |
| Colour contrast | Every token pair verified — see `DESIGN-RESEARCH.md` §3 |
| **Known live failure** | Current brand `#007AFF` = **4.02:1** on white. **Fails AA.** Used 455×, including CTA labels. Replaced by `#1A3FCB` (8.02:1). |
| Keyboard | Full operability, visible focus, logical order, skip links |
| Motion | `prefers-reduced-motion` honoured everywhere |
| Forms | Labels, error identification, and instructions — not placeholder-only |
| RTL | CSS logical properties only, lint-enforced (§7) |
| Semantic HTML | Landmarks, headings, lists — also required by §11a.2 |
| Automated testing | `vitest-axe` per component, `@axe-core/playwright` per route per locale |
| Manual testing | Keyboard + screen reader pass on all 8 templates before cutover |
| Published artefact | Conformance statement at `/platform/security-compliance` |

**Gate:** zero critical or serious axe violations on any route, in any locale. CI blocking.

---

> **RTL (item 10, implemented).** 192 physical inline declarations converted to
> logical across `design.css` and `pages.css` by
> `tools/port/logical-css.py`, and enforced by `npm run check:logical` — the
> lint rule §14.2 asks for, living with the build gates because there is no
> ESLint and this is a CSS concern ESLint would not see.
>
> Two scoping decisions, both measured: **only the inline axis** is converted
> (RTL does not flip block, so the 156 `margin-top`-style declarations are
> already correct), and **paint positioning is left alone** (six values that
> place artwork rather than layout).
>
> Note for §4: **`tools/port/build-css.py` cannot run in this tree** —
> `design-src/artboards/` is not checked in — so `design.css` is maintained in
> place despite its generated-file header, and re-running the generator would
> undo this conversion. `check:logical` catches that.

## 13. Security

> **CORRECTION (item 11, implemented).** All of §13's headers are set in one
> `headers()` in `next.config.ts`, and `npm run contract` asserts them against a
> running origin (27 assertions). One row of the table cannot be implemented as
> written.
>
> **"CSP with nonce — generated per request in `proxy.ts`" is incompatible with
> §5 and §17.** Next's own documentation
> (`docs/01-app/02-guides/content-security-policy.md:181`): *"To use a nonce,
> your page must be dynamically rendered. … Static pages are generated at build
> time, when no request or response headers exist — so no nonce can be
> injected."* This site is 56 statically prerendered pages because §5 says so,
> §17 requires zero dynamic routes, and all ten build-output gates read that
> prerendered HTML. A nonce would make every page dynamic and blind every gate,
> to remove `'unsafe-inline'` from a site with zero third-party scripts and no
> inline handlers of its own.
>
> So `script-src 'unsafe-inline'` remains and §17's box stays open, reported as
> a named deviation by the contract suite. The two routes to closing it —
> post-build hash injection, or accepting dynamic rendering — are written up in
> `helloverify-web/README.md`.
>
> **`style-src` needed no such compromise.** The build emits exactly two inline
> `<style>` blocks (Next's `/_not-found` and `/_global-error`), so both are
> `sha256-` pinned and `npm run check:csp` fails if a Next upgrade changes them.
>
> **Dependency scanning found one high-severity advisory** in `sharp`; upgraded
> across a semver major to 0.35.4 with the logo and image optimiser verified.
> `npm audit` is now clean. The pre-commit hook and Dependabot rows are repo
> configuration and are not set up.

| Control | Implementation | Fixes |
|---|---|---|
| **CSP with nonce** | Generated per request in `proxy.ts` (renamed from `middleware.ts` in Next 16), removes `'unsafe-inline'` from `script-src` | AUDIT E2 |
| **Single CSP source** | Defined once in `next.config.ts` `headers()`. No duplicated copies. | AUDIT E3 |
| **No client secrets** | `server-only` on every integration module; CI greps the build output for known secret patterns | AUDIT E1 |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | AUDIT C2 |
| **HSTS** | `max-age=31536000; includeSubDomains; preload` — retained | — |
| **COOP / CORP** | `same-origin` / `same-origin` | AUDIT E3 |
| `X-Content-Type-Options` | `nosniff` | retained |
| `X-Frame-Options` / `frame-ancestors` | `DENY` / `'none'` | retained |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | retained |
| **Dependency scanning** | `npm audit` + Dependabot on PR | new |
| **Secret scanning** | Pre-commit hook + CI | new |

**Verified in CI post-deploy** (§14), not merely configured — the lesson of AUDIT G1.

---

> **CORRECTION (item 12, implemented).** Condition 21 reads "zero hex literals
> … outside `@theme`", and taken literally that would require tokenising the
> national flags drawn in `sections/International.tsx`. Singapore's flag is
> `#C8102E` regardless of the brand; putting it in the palette would make the
> palette meaningless.
>
> Measured: of 382 literals, **194 are SVG artwork** (flags, the wordmark, the
> YC badge), **57 were per-photograph placeholder tints**, and only **119 were
> UI colour**. The rule is now read as "no colour literal in UI code", enforced
> by `npm run check:tokens`, with two documented exemptions: SVG artwork, and
> the OG card, which Satori renders without a CSSOM and so cannot resolve a
> custom property.
>
> UI colour literals: **119 → 0**. The tints moved to `PLACEHOLDER_TINT` in
> `lib/img.ts`, keyed by photograph, because a tint is a property of one image
> rather than of the design. Four new tokens were needed, not seventeen.
>
> The dominant cause was duplication: one confirmation tick inlined **87 times**,
> each copy carrying its own hex. Condition 22 (no file over 300 lines) is the
> same finding from the other end.

## 14. Testing and CI/CD

### 14.1 Test strategy

> **CORRECTION (item 9, implemented).** The PR pipeline is
> `.github/workflows/ci.yml`; §14.3's suite is
> `helloverify-web/tools/ci/production-contract.mjs`. Four notes:
>
> 1. **§14.3 does not need Playwright.** Every assertion it lists is an HTTP
>    request and a header or status check — no DOM. It is plain `fetch`, sharing
>    the redirect probe's assertion helpers. Playwright earns its place for
>    §14.1's E2E and page-a11y rows, which is §12's work.
> 2. **A build is not a deployment, and the suite knows.** Against `localhost`
>    the apex-redirect and `immutable`-cache assertions degrade to warnings,
>    decided from the URL rather than a flag. The CSP assertion warns too, and
>    becomes a hard check when §13 lands.
> 3. **"Assert: 0 dynamic routes" needs to be exact.** A floor does not work: a
>    mutation adding `await headers()` to one page took the prerendered count
>    from 64 to 63 and passed a `< 50` check. `tools/ci/assert-static.mjs` now
>    compares against `allRoutes()` × locales and names the route that dropped
>    out. Note that `/[locale]/opengraph-image` legitimately carries
>    `fallback: null` — measured, `/xx/opengraph-image` answers 307 from the
>    proxy, not an on-demand render — so metadata conventions are excluded.
> 4. **The pipeline does not deploy.** §14.4's automated deploy needs GCP
>    credentials and the Cloud Run service; shipping a job that cannot
>    authenticate would repeat AUDIT G2 rather than fix it.

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | zod schemas, metadata builders, JSON-LD factories, content loaders, Server Actions |
| Component | Vitest + Testing Library | `components/ui`, `components/primitives` |
| A11y (component) | `vitest-axe` | Every primitive and block |
| E2E | Playwright | Locale switching, RTL rendering, form submission, navigation |
| A11y (page) | `@axe-core/playwright` | Every top-level route, all 3 locales |
| Performance | Lighthouse CI + `budget.json` | Every PR, against preview |
| **Live contract** | **Playwright against production** | **Post-deploy — §14.3** |

### 14.2 Pipeline — on every PR

```
typecheck → lint (incl. token + logical-property rules) → unit + component
→ build (assert: 0 dynamic routes) → E2E on preview → axe → Lighthouse CI
```

### 14.3 Post-deploy production verification — the control that was missing

This job runs **against the live origin after every release** and **rolls back on failure**. Each assertion maps to an audit finding.

```ts
// e2e/production-contract.spec.ts
test('compression is enabled', async ({ request }) => {          // AUDIT A1
  const res = await request.get('/_next/static/…', {
    headers: { 'Accept-Encoding': 'br, gzip' },
  })
  expect(res.headers()['content-encoding']).toMatch(/br|gzip/)
})

test('no URL redirects into index.html', async ({ request }) => { // AUDIT A2
  for (const url of await sitemapUrls()) {
    const res = await request.get(url, { maxRedirects: 0 })
    expect(res.status(), url).toBe(200)
  }
})

test('apex redirects to www', async ({ request }) => {            // AUDIT A3
  const res = await request.get('https://helloverify.com/', { maxRedirects: 0 })
  expect(res.status()).toBe(308)
})

test('hashed assets are immutable', async ({ request }) => {      // AUDIT A4
  const res = await request.get('/_next/static/…')
  expect(res.headers()['cache-control']).toContain('immutable')
})

test('canonical is self-referencing and matches sitemap', …)      // AUDIT C2
test('no secret patterns in shipped JS', …)                       // AUDIT E1
test('CSP has no unsafe-inline in script-src', …)                 // AUDIT E2
```

> **The old pipeline claimed to fix the `/index.html` redirect and the immutable cache headers. Neither landed, and nothing noticed for months.** This suite is the reason that cannot recur.

### 14.4 Release process

- **Automated deploy on merge to `main`.** No `trigger: none` (AUDIT G2).
- Preview environment per PR.
- Branch protection: PR required, checks required, no direct pushes to `main`.
- **One** long-lived branch. The old repo has three branches named "backup" (AUDIT G4).
- Conventional Commits. `"resolve this issue"` ×3 is not a history.

---

## 15. Migration plan

### Phase 0 — Foundation (week 1)
Repo, Next.js 16.3, TypeScript strict, Tailwind v4 tokens, lint rules (token + logical-property + file-size), Vitest/Playwright/LHCI wiring, Cloud Run + CDN + **compression verified**, CI/CD with preview deploys, post-deploy contract suite scaffolded. **Exit gate:** a blank page deploys, and the production-contract suite passes on it.

### Phase 1 — Primitives and blocks (week 2)
`components/ui` (shadcn), `components/primitives`, `components/blocks`. Header, Footer, LocaleSwitcher, Breadcrumbs. Font and image pipeline proven. **Exit gate:** one full page under budget, axe-clean, in all three locales including RTL.

### Phase 2 — Content migration (weeks 3–5)
All 12 commercial pages + 6 legal pages + blog. Copy ported from `public/cms/{en,hi,ar}` and `src/pages/policy/**`. Images re-encoded. **Exit gate:** content parity with the old site, verified page by page, in three locales.

### Phase 3 — SEO and integrations (week 6)
`sitemap.ts`, `robots.ts`, `llms.txt`, full JSON-LD graph, OG images, redirect map, Server-Action contact form + Zoho + abuse protection, GTM with Consent Mode v2. **Exit gate:** §6.1 acceptance tests green; structured data validates.

### Phase 4 — Cutover (week 7)
1. Deploy to a staging host, crawl with Screaming Frog, diff against the old site's URL inventory.
2. **Fix the apex domain** (AUDIT A3) — this is DNS/LB work, do it before cutover.
3. Switch DNS. Keep the old bucket serving for 30 days as rollback.
4. Submit the new sitemap; request reindexing of the top 20 URLs.
5. Watch Search Console coverage, CrUX, and rankings daily for 14 days.
6. Old SPA continues at `app.helloverify.com`, untouched.

### Phase 5 — Programmatic SEO (week 8+, content-gated)
Country / check-type / industry pages, released in batches as real content is written. **Not before.**

---

## 16. Interim fixes to the *current* site

The rebuild takes ~7 weeks. Three of the audit's critical findings can be fixed on the old site in under a day, and it is negligent not to. These are independent of the rebuild and none of them is wasted work.

| Fix | Effort | Impact |
|---|---|---|
| **Enable brotli/gzip on the GCS LB** | ~1 hour | Cuts ~2.6 MB from every cold visit. Single biggest available win. |
| **Fix the apex domain** | ~1 hour | Restores every non-`www` link and backlink. Currently a hard connection failure. |
| **Re-encode the two largest PNGs** (3 MB + 1.8 MB) | ~1 hour | Removes ~4 MB from the homepage. |
| **Correct the immutable cache headers** on `/assets/**` | ~30 min | Stops hourly full re-downloads for returning visitors. |

Do these this week, regardless of the rebuild.

---

## 17. Definition of done

The new site ships only when **all** of the following are true in production:

- [ ] Homepage total transfer **< 500 KB**; JS **< 120 KB** compressed
- [ ] Brotli/gzip verified on HTML, CSS, JS by automated probe
- [ ] LCP < 2.0s, INP < 200ms, CLS < 0.1 on mobile (lab, then confirmed in CrUX after 28 days)
- [ ] Zero URLs redirect to `/index.html`; zero sitemap URLs return anything but `200`
- [ ] `helloverify.com` 308s to `www.helloverify.com`
- [ ] Every page: self-referencing canonical, byte-identical to its sitemap and hreflang entry
- [ ] hreflang complete and reciprocal across `en`/`hi`/`ar` + `x-default`
- [ ] All legacy URLs return real server **308**s
- [ ] Structured data validates: Organization, WebSite, Service, BreadcrumbList, BlogPosting, FAQPage
- [ ] Zero secrets in the client bundle, verified by automated grep of build output
- [ ] CSP has no `'unsafe-inline'` in `script-src`
- [ ] axe: zero critical/serious violations on every route, all three locales
- [ ] **WCAG 2.2 AA** verified; conformance statement published at `/platform/security-compliance`
- [ ] **No colour token below its required contrast ratio** — `#007AFF` (4.02:1) fully eliminated
- [ ] Arabic RTL verified visually and programmatically on every page
- [ ] `robots.txt` explicitly allows all 12 AI crawlers; `llms.txt` generated from the route manifest
- [ ] Every commercial page carries question-shaped `H2`s with ~40-word answer blocks
- [ ] `FAQPage` + `HowTo` schema present where the content warrants it
- [ ] GA4 segments live for AI referral sources (ChatGPT, Perplexity, Claude, Gemini)
- [ ] AI crawler hits confirmed in server logs, reaching `200`s rather than redirects
- [ ] Zero hex literals and zero arbitrary `[…px]` values outside `@theme`
- [ ] No component file over 300 lines
- [ ] `next build` emits zero dynamic routes
- [ ] Post-deploy production contract suite green, with rollback wired on failure

---

## 18. Open decisions requiring sign-off

| # | Decision | Recommendation | Blocks |
|---|---|---|---|
| 1 | **Scope** — marketing only, or does cart/checkout live on `www`? | Marketing only. Old SPA → `app.helloverify.com`. | Phase 0 |
| 2 | **Hosting** — Cloud Run or Vercel? | Cloud Run, to keep GCP + Azure DevOps + data-residency answers. Vercel halves Phase 0 if those constraints are softer than they look. | Phase 0 |
| 3 | **CMS** — in-repo content now, Payload later? | Yes. Ship on typed in-repo content; add Payload when non-dev editing genuinely blocks someone. | Phase 2 |
| 4 | **Locales** — stay at 3, or plan for more? | Build for N; ship 3. Costs nothing now, expensive to retrofit. | Phase 0 |
| 5 | **Blog** — 5 posts is not a content programme. Is there an editorial plan? | Needs an owner before Phase 5 is worth building. | Phase 5 |
| 6 | **Interim fixes** — do the four §15 fixes on the old site now? | Yes. ~4 hours, independent of the rebuild. | This week |

---

## Appendix — Reference sources

Framework and stack
- [Next.js 16.3 release](https://nextjs.org/blog/next-16-3) · [Next.js 16](https://nextjs.org/blog/next-16) · [version history](https://versionlog.com/nextjs/)
- [Next.js 16 App Router guide](https://dev.to/getcraftly/nextjs-16-app-router-the-complete-guide-for-2026-2hi3)
- [Cache Components, `use cache` and PPR](https://dev.to/thekitbase/nextjs-16-cache-components-use-cache-ppr-and-when-to-reach-for-each-503e)
- [Self-hosting Next.js](https://nextjs.org/docs/app/guides/self-hosting)
- [Hosting platforms & ISR/PPR fidelity in 2026](https://dev.to/muhammadalisma/best-hosting-platforms-for-nextjs-in-2026-who-actually-handles-isr-ppr-correctly-534g)

Styling and i18n
- [Tailwind v4 + shadcn/ui as the 2026 default stack](https://starterpick.com/guides/tailwind-v4-shadcn-ui-saas-stack-2026) · [shadcn/ui Next.js install](https://ui.shadcn.com/docs/installation/next)
- [next-intl complete guide 2026](https://stacknotice.com/blog/nextjs-i18n-next-intl-guide-2026) · [next-intl vs next-i18next](https://intlpull.com/blog/next-intl-complete-guide-2026)

SEO
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld) · [Schema markup in Next.js 2026](https://socialanimal.dev/blog/schema-markup-nextjs-json-ld-structured-data-2026/)
- [Next.js SEO guide 2026](https://www.modernwebseo.com/en/blog/nextjs-seo-guide-2026) · [App Router SEO for production](https://www.javascriptdoctor.blog/2026/07/nextjs-app-router-seo-best-practices.html)
- [International SEO / hreflang 2026](https://www.digitalapplied.com/blog/international-seo-2026-hreflang-multilingual-guide)
- [Core Web Vitals 2026 thresholds](https://www.corewebvitals.io/core-web-vitals)

Performance, forms, testing
- [Self-hosted image optimization with sharp](https://www.pistack.xyz/posts/self-hosted-image-optimization-imgproxy-thumbor-sharp-2026/) · [Next.js image optimization guide](https://strapi.io/blog/nextjs-image-optimization-developers-guide)
- [Protecting a React Hook Form from spam](https://blog.arcjet.com/protecting-a-react-hook-form-from-spam/) · [RHF + Server Actions + zod](https://nehalist.io/react-hook-form-with-nextjs-server-actions/)
- [Next.js testing 2026: Vitest + Playwright](https://medium.com/@securestartkit/next-js-testing-in-2026-vitest-playwright-0caf6dd1f829) · [Automated performance & a11y testing](https://dev.to/beefedai/automated-performance-and-accessibility-testing-for-frontend-olg)

CMS
- [Headless CMS 2026: Sanity vs Contentful vs Payload](https://www.digitalapplied.com/blog/headless-cms-2026-sanity-contentful-payload-comparison) · [Best headless CMS for Next.js 2026](https://dev.to/nayankyada/best-headless-cms-for-nextjs-in-2026-sanity-vs-contentful-vs-payload-vs-storyblok-557k)

AI search (GEO / AEO)
- [Generative Engine Optimization complete guide 2026](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026) · [GEO for B2B](https://www.mersel.ai/generative-engine-optimization) · [GEO 2026 guide](https://llmrefs.com/generative-engine-optimization)
- [Answer Engine Optimization guide](https://llmrefs.com/answer-engine-optimization) · [AEO content structure 2026](https://isimplifyme.com/blog/answer-engine-optimization) · [GEO/AEO/SEO enterprise guide](https://writer.com/blog/geo-aeo-optimization/)
- [Top 12 LLM crawlers 2026](https://hyperleap.ai/blog/top-llm-crawlers-and-what-they-do-2026) · [AI crawlers explained: GPTBot, ClaudeBot, PerplexityBot](https://www.anagram.ai/blog/ai-crawlers-explained-gptbot-claudebot-perplexitybot-and-how-to-let-them-in-2026) · [AI crawler access-control decision matrix](https://www.digitalapplied.com/blog/ai-crawler-access-control-2026-robots-llms-txt-decision-matrix)

Accessibility & compliance
- [European Accessibility Act overview](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/) · [EAA compliance checklist / WCAG 2.2](https://www.webability.io/blog/eaa-compliance-checklist) · [Does the EAA apply to B2B?](https://eye-able.com/blog/eaa-b2b)
- [WebAIM: contrast and colour accessibility](https://webaim.org/articles/contrast/)

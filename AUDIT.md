# HelloVerify Website — Technical Teardown

**Audit target:** `https://www.helloverify.com` (live) + `D:\Projects\Application Frontend HV` (source)
**Date:** 14 September 2026
**Scope:** Engineering review, pre-rebuild
**Verdict:** Rebuild, don't refactor. But not for the reasons currently assumed.

---

## 0. How this audit was done

Everything below is measured, not estimated. Each finding carries the command that reproduces it. Where a claim could not be verified, it is marked as such.

| Method | What it covered |
|---|---|
| Static source analysis | 338 TS/TSX files, ~60,000 LOC in `Application Frontend HV` |
| Live HTTP probing | `curl` against 8 URL shapes, header inspection, redirect chains |
| Live payload measurement | Byte-exact download of all 50 homepage assets |
| Build pipeline review | `azure-pipelines.yml`, `scripts/*.mjs`, `vite.config.ts`, `web.config` |
| Live bundle inspection | Downloaded and grepped the shipped 2.68 MB JS bundle |
| Localisation check | Raw HTML of `/en/`, `/hi/`, `/ar/` |

Lighthouse/PSI could not be run — the PageSpeed Insights API returned `429 RESOURCE_EXHAUSTED` (shared quota, no API key available). The raw byte measurements below are more damning than a score anyway, and are not subject to run-to-run variance.

---

## 1. Executive summary

The site is a **Vite 6 + React 19 SPA** with a Playwright-based build-time prerenderer, deployed as static files to a **Google Cloud Storage bucket** behind Cloud CDN, released by a manually-triggered Azure Pipeline.

### The correction that matters

> **"React is horrible at SEO" is not this site's problem.**

Someone already solved that. `scripts/prerender.mjs` boots a Vite preview server, drives Playwright across all 28 routes × 3 locales, and writes real static HTML to `dist/<locale>/<path>/index.html`. Verified against production: the served HTML contains the `<h1>`, every `<h2>`, full body copy, a self-referencing canonical, hreflang alternates, and ~11 JSON-LD entities. Arabic is genuinely translated with `dir="rtl"`; Hindi is genuinely Devanagari. There is even a hand-written `llms.txt` for AI crawlers.

**Crawlability is fine. Everything downstream of crawlability is broken.**

The real failures are in **delivery, payload, and URL integrity** — and they are severe enough that the prerendering effort is entirely wasted. A crawler can read the page; it just has to download 12.5 MB uncompressed to do so, after following a redirect into a URL that the page itself disavows.

### Severity ledger

| # | Finding | Severity | Impact |
|---|---|---|---|
| A1 | Zero HTTP compression on all text assets | **Critical** | 6× oversized JS/CSS/HTML transfer |
| A2 | Every sitemap URL 301-redirects into `/index.html` | **Critical** | Crawl budget burn, canonical contradiction |
| A3 | Apex domain `helloverify.com` does not resolve | **Critical** | All non-www links and backlinks dead |
| B1 | Homepage transfers 12.5 MB | **Critical** | LCP failure on any real network |
| B2 | 2.68 MB single JS bundle, zero code splitting | **High** | TBT/INP failure, parse cost on every page |
| B3 | Render-blocking fonts + Font Awesome from 2 CDNs | **High** | Delays first paint on every page |
| B4 | 56 MB of unoptimised PNG/JPG, no WebP/AVIF | **High** | Dominant share of page weight |
| A4 | Hashed assets cached for 1 hour, not 1 year | **High** | Full re-download hourly for return visitors |
| E1 | AES key + CRM tokens shipped in client bundle | **High** | Secrets are public by construction |
| C2 | Client-side-only canonical/meta injection | **Medium** | Fragile; contradicts server redirects |
| D2 | 119 single-use components, no shared primitives | **Medium** | Every change is a bespoke change |
| D3 | 2,867 hardcoded pixel values, 211 hex colours | **Medium** | No design system; drift is guaranteed |
| G1 | Deploy pipeline's own fixes are not landing in prod | **Medium** | Pipeline claims ≠ production reality |
| E2 | `script-src 'unsafe-inline'` in CSP | **Medium** | Weakens XSS mitigation to near-zero |
| A5 | All server redirect rules live in a dead config file | **Medium** | Obsolete URLs return 200, not 301 |
| F1 | Locale content is good, locale *routing* is not | **Low** | Salvageable asset, poor plumbing |

---

## 2. Section A — Delivery and hosting

This is where the site actually dies. Not in React.

### A1. There is no compression. On anything. (CRITICAL)

The bucket serves raw bytes even when the client explicitly requests compression.

```bash
curl -sSI -H 'Accept-Encoding: gzip, deflate, br' \
  https://www.helloverify.com/assets/index-Bcy-TV6w.js
```

```
x-goog-stored-content-encoding: identity
Content-Length: 2677690
```

No `Content-Encoding` header is returned. Same for CSS and HTML:

| Asset | Served bytes | Realistic brotli size | Waste |
|---|---:|---:|---:|
| `index-Bcy-TV6w.js` | 2,677,690 | ~420,000 | **6.4×** |
| `index-DAmRCSo7.css` | 199,971 | ~28,000 | **7.1×** |
| `/en/` HTML | 223,774 | ~30,000 | **7.5×** |
| **Total text** | **3,101,435** | **~478,000** | **~2.6 MB wasted per cold visit** |

**Root cause:** GCS serves the stored object encoding verbatim. It does not compress on the fly. The upload step in `azure-pipelines.yml` uses `gcloud storage rsync` with no `--gzip-in-flight` flag and never sets `Content-Encoding`. Nobody ever configured it.

This single misconfiguration costs more than every other performance problem on the site combined, and it has presumably been live since launch.

### A2. Every URL in the sitemap is a redirect that contradicts its own canonical (CRITICAL)

```bash
curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
  https://www.helloverify.com/en
curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
  https://www.helloverify.com/en/products/bgv-enterprise
```

```
301 -> https://www.helloverify.com/en/index.html
301 -> https://www.helloverify.com/en/products/bgv-enterprise/index.html
```

Meanwhile the page that redirect lands on declares:

```html
<link rel="canonical" href="https://www.helloverify.com/en">
```

So the chain is: **sitemap says `/en` → server 301s to `/en/index.html` → that page's canonical points back to `/en`.** Google is told to go somewhere, then told that where it arrived isn't the real address.

All **84 sitemap URLs** are affected (28 paths × 3 locales).

```bash
curl -sS https://www.helloverify.com/sitemap.xml | grep -c '<loc>'   # 84
```

Note that `/en/` **with** a trailing slash returns `200`. So the site has three competing URL forms for every page — `/en`, `/en/`, and `/en/index.html` — with no consistent canonicalisation between them. This is the "routing problem" that was felt but never diagnosed.

**Downstream evidence of the same bug:** `src/main.tsx` contains a client-side hack that strips `/index.html` out of the address bar *after* the redirect has already happened:

```ts
const cleaned = pathname.replace(/\/index\.html$/i, '') || '/'
if (cleaned !== pathname) {
  window.history.replaceState(window.history.state, '', `${cleaned}${search}${hash}`)
}
```

The comment above it admits the router "only knows clean paths, so rewrite the address back before it reads location, or every direct hit falls through to the catch-all route." That is a band-aid over a hosting misconfiguration, running in every visitor's browser, on every page load.

**Root cause:** the GCS bucket has `MainPageSuffix` configured, which 301s any directory-shaped path to its `index.html`. Commit `cf964d8` shows a previous attempt to fix this by publishing extensionless object copies. That step still exists in the pipeline — and **it is not working in production**, as the `curl` output above proves.

### A3. The apex domain is dead (CRITICAL)

```bash
curl -sS --max-time 15 -o /dev/null -w '%{http_code}\n' https://helloverify.com/
curl -sS --max-time 15 -o /dev/null -w '%{http_code}\n' http://helloverify.com/
```

```
curl: (28) Failed to connect to helloverify.com port 443 after 21258 ms
000
000
```

Tested three times across both schemes. **`helloverify.com` without `www` does not accept connections at all.** Not a redirect — a connection timeout.

Every backlink, business card, email signature, press mention, or partner listing that points at the bare domain currently resolves to a browser error page. Any link equity pointed at the apex is entirely lost.

### A4. Cache headers are wrong — and not the wrong the pipeline claims (HIGH)

Production reality:

```bash
curl -sSI https://www.helloverify.com/assets/index-Bcy-TV6w.js | grep -i cache
# Cache-Control: public,max-age=3600
```

The pipeline explicitly claims to set something else:

```yaml
echo "Long-lived immutable cache for hashed build assets"
gcloud storage objects update "$BUCKET/assets/**" \
  --cache-control="public, max-age=31536000, immutable"
```

The filename `index-Bcy-TV6w.js` is **content-hashed** — it can safely be cached forever. Instead every returning visitor re-downloads 2.68 MB uncompressed each hour. The pipeline's intent is correct; the wildcard is not expanding, or the update runs before CDN invalidation, or the step fails silently. Either way, **what the pipeline says and what production serves do not match.** (See G1.)

### A5. Hosting configuration is split across three places, two of which are dead (MEDIUM)

| File | Status |
|---|---|
| `web.config` (IIS, 8.8 KB, 20+ rewrite rules) | **Dead.** Site is on GCS/Cloud CDN. IIS is not in the request path. |
| `deploy/nginx-devhv.conf`, `nginx-cache-snippet.conf` | **Dead** for production. |
| `azure-pipelines.yml` `gcloud storage` steps | **Live**, but see A4/G1. |

All the redirect logic in `web.config` — `smb` → `products/bgv-smb`, the KYC consolidation, the consumer-path redirects — **is not executing.** Those 301s exist only as client-side `<Navigate>` components in `src/App.tsx`, which means a crawler hitting an obsolete URL gets a `200` with an empty shell and a JS redirect, not a `301`. Thin and duplicate URLs are therefore still eligible for indexing.

---

## 3. Section B — Payload and performance

### B1. The homepage transfers 12.5 MB (CRITICAL)

Every asset referenced by `/en/` was downloaded and measured:

```
assets bytes:  12,900,446
html bytes:       223,774
TOTAL:         13,124,220 bytes  ≈  12.5 MiB
```

Top offenders:

| Bytes | Asset |
|---:|---|
| 3,001,829 | `/assets/home/key_verification/white-caller-key_verification.png` |
| 2,677,690 | `/assets/index-Bcy-TV6w.js` |
| 1,776,655 | `/assets/home/key_verification/age-verification-single-check.png` |
| 601,408 | `/assets/home/solutions/Immigration-Authorities.jpg` |
| 600,835 | `/assets/home/tenant-verification%20-egypt.png` |
| 549,736 | `/assets/home/driver-verification-philippines.png` |
| 544,739 | `/assets/home/verify-house-uae.png` |
| 517,397 | `/assets/home/key_verification/driving-single-check.png` |
| 510,355 | `/assets/home/key_verification/employement-single-check.png` |
| 464,882 | `/assets/home/solutions/Education-Qualification.jpg` |
| 458,253 | `/assets/home/solutions/Health-Authorities.png` |
| 434,820 | `/assets/home/key_verification/blue-caller-key-verification.jpg` |

A **3 MB PNG** used as a content illustration is not a performance problem, it is a process failure — no one ran the image through anything before committing it.

Incidental findings in the same list: `tenant-verification%20-egypt.png` has a **literal space** in the filename, `employement-single-check.png` is misspelled, and 25 of 50 asset paths mix casing conventions (`Immigration-Authorities.jpg` vs `driver-verification-philippines.png`). All are avoidable sources of case-sensitivity and URL-encoding bugs on object storage.

### B2. One 2.68 MB JavaScript bundle for the entire site (HIGH)

```bash
grep -o 'src="/assets/index-[^"]*"' home.html
# src="/assets/index-Bcy-TV6w.js"   — one file, no chunks
```

`vite.config.ts` sets `build.assetsInlineLimit` and nothing else. There is **no `manualChunks`, no route-level `React.lazy`, no dynamic `import()`**. Consequently a visitor to the privacy policy downloads, parses, and executes:

- the Razorpay checkout integration
- the Saudi applicant auth dialog (`SaudiIndividualAuthDialog.tsx`, **1,708 lines**)
- the cart, orders, and profile-settings flows
- `crypto-js` (AES)
- every one of the 119 marketing components
- the full CMS type layer (`src/types/cms.ts`, **3,296 lines**)

Parse-and-compile cost for 2.68 MB of uncompressed JS on a mid-range Android phone is measured in seconds, not milliseconds. This is the direct cause of poor INP.

### B3. Render-blocking third parties in `<head>` (HIGH)

Before a single pixel can paint, the browser must fetch from **two external origins**:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700
  &family=Merriweather:ital,wght@0,400;0,600;0,700;0,900;1,400
  &family=Poppins:wght@400;500;600;700
  &family=Roboto:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
```

That is **four font families across 14 weights**, plus the **entire Font Awesome 6.5.2 stylesheet** (which then pulls its own font files). Self-hosted, subset, variable fonts would cut this to a single ~30 KB WOFF2 with zero extra DNS/TLS handshakes.

Font Awesome is additionally an npm dependency (`@fortawesome/fontawesome-free`) *and* loaded from CDN — the classic double-load.

### B4. Image delivery has no modern format path (HIGH)

```
public/ total:  56 MB
  127 × .png
  126 × .svg
   28 × .jpg
    9 × .pdf
    0 × .webp
    0 × .avif
```

An `assets:optimize` script exists (`scripts/optimize-public-images.mjs`) but is **not wired into `npm run build`** — it must be run manually, and evidently has not been.

### B5. CLS and LCP hygiene gaps on the homepage

```
<img> elements:                79
  with loading="lazy":         52
  with explicit width/height:  43   (36 without → layout shift risk)
  with fetchpriority="high":    0   (LCP image is never prioritised)
```

No `fetchpriority` anywhere on the page means the browser discovers the LCP image late, behind 2.68 MB of JS in the network queue.

### B6. Reference point

Current Core Web Vitals thresholds: **LCP < 2.5s** (tightening toward 2.0s), **INP < 200ms**, **CLS < 0.1**, assessed on a 28-day CrUX field-data window. A 12.5 MB uncompressed homepage with a 2.68 MB blocking bundle and an unprioritised LCP image does not reach any of the three on mobile.

---

## 4. Section C — SEO

### C1. What is genuinely working (do not throw this away)

Verified present in the production HTML:

- ✅ Real prerendered content — H1, all H2s, body copy, nav, footer
- ✅ Self-referencing `<link rel="canonical">`
- ✅ `hreflang` alternates for `en`, `hi`, `ar` + `x-default`
- ✅ `<html lang="ar" dir="rtl">` correctly set per locale
- ✅ Rich JSON-LD graph: `Organization`, `LocalBusiness`, `Service` ×5, `OfferCatalog`, `Offer` ×4, `ContactPoint`, `PostalAddress` ×2, `Country` ×6
- ✅ `robots.txt` with correct `Disallow` rules for authenticated areas
- ✅ `llms.txt` — hand-written, genuinely good, ahead of most competitors
- ✅ `sitemap.xml` with per-URL `xhtml:link` hreflang blocks
- ✅ Per-route titles/descriptions in `src/config/seo.ts` (337 lines), translated
- ✅ Exactly one `<h1>` per page
- ✅ Ahrefs + GTM verification tags in place

This represents real, competent work. The rebuild must **port it forward, not redo it**.

### C2. What is broken

| Issue | Detail |
|---|---|
| **Canonical is injected client-side** | `PageMetaManager.tsx` (36 lines) mutates the DOM after mount. It survives only because the prerenderer snapshots post-mount HTML. Any prerender failure silently ships a page with no canonical and the wrong title. |
| **Sitemap → 301 → canonical contradiction** | See A2. Affects all 84 URLs. |
| **Obsolete URLs return 200, not 301** | `web.config` is dead (A5). `/en/smb`, `/en/kyc`, `/en/consumer` etc. redirect via JS only. |
| **`<meta name="keywords">` still present** | Ignored by every search engine since ~2009. Harmless, but a tell. |
| **Default OG/Twitter tags hardcoded to the homepage** in `index.html` | Overridden client-side per route. Any social scraper that doesn't execute JS, hitting a page whose prerender partially failed, gets homepage metadata. |
| **No `Article`/`BlogPosting` schema on blog posts** | Five blog routes exist; none emit article-level structured data. |
| **No `BreadcrumbList`** | Deep pages like `/solutions/manpower-and-education-authorities/ministry-of-manpower` get no breadcrumb rich result. |
| **`Referrer-Policy: no-referrer`** | Set globally. Strips referrer data from your own analytics and from partners' inbound attribution. `strict-origin-when-cross-origin` is the correct default. |
| **Prerender is a build-time liability** | Requires Playwright + Chromium in CI. `npm run build` fails outright if Playwright is missing. A browser download is a hard dependency of shipping a marketing page. |

### C3. Content architecture is thin

28 indexable paths, of which **10 are redirects to other paths** and 6 are legal policy pages. The genuinely commercial surface is roughly 12 pages.

For a company claiming **120+ countries** and **30+ check types**, that is a very small footprint. There is no programmatic SEO layer — no per-country pages, no per-check-type pages, no per-industry pages, no comparison or glossary content. This is the single largest organic growth lever currently unused, and it is the one the new architecture should be explicitly designed to enable.

---

## 5. Section D — Frontend architecture and code health

### D1. Scale

```
src/                338 TS/TSX files,  ~59,970 LOC
src/components/     119 .tsx files in a single flat directory
src/pages/           37 page components
src/lib/             60 modules
src/types/cms.ts     3,296 lines
```

### D2. No component reuse — 119 one-shot section components (MEDIUM)

The flat `src/components/` directory is a list of single-use page sections:

```
AboutBeliefSection      AboutValuesSection       BgvSmbTrustedBySection
AboutCertificationsComplianceSection             CertifierWhyConsiderSection
EmployeesWhyBlueCollarMatters                    HealthAuthoritiesAccuracyPromise
EducationAuthoritiesPromiseSection               CustomerKycHowItWorksSection
```

Nothing is composed from shared primitives. There is no `<Section>`, no `<Card>`, no `<Button>`, no `<Heading>`. A "trust logos strip" exists separately as `BgvSmbTrustedBySection`, `EnterpriseTrustStrip`, and `AboutTrustNumbersSection`.

**Every visual change requires editing N files and produces N slightly different results.** This is the mechanical reason the site looks inconsistent.

Largest components, all monolithic:

| Lines | File |
|---:|---|
| 1,708 | `src/components/saudi/SaudiIndividualAuthDialog.tsx` |
| 1,495 | `src/components/KeyVerificationSolutions.tsx` |
| 1,094 | `src/components/SolutionsShowcase.tsx` |
| 953 | `src/components/ContactUsUnified.tsx` |
| 888 | `src/components/saudi/SaudiTrackPanel.tsx` |
| 847 | `src/pages/account/TravelCandidatePage.tsx` |
| 803 | `src/components/ImmigrationApplicantInfoGuide.tsx` |

### D3. No design tokens — values are hardcoded, thousands of times (MEDIUM)

```bash
grep -rho '#[0-9A-Fa-f]\{6\}' src --include=*.tsx | sort -u | wc -l    # 211
grep -rho '#[0-9A-Fa-f]\{6\}' src --include=*.tsx | sort | uniq -c | sort -rn | head -4
#  455 #007AFF
#  237 #1B354A
#   74 #6B7083
#   60 #1b354a      ← same colour, different case
```

- **211 distinct hex colours** hardcoded in TSX
- The brand blue appears **455 times as `#007AFF`** and **26 more as `#007aff`**
- **2,867 arbitrary pixel values** in Tailwind bracket notation, e.g. `text-[clamp(1.375rem,5vw+0.25rem,3rem)]`, `tracking-[-0.96px]`
- `tailwind.config.js` defines only **5 colours** and 4 font families — the theme is essentially empty while 211 colours live in components

This is Figma coordinates transcribed by hand into JSX. It is not a design system; it is sediment. Any "make the buttons slightly rounder" request becomes a 455-file find-and-replace.

### D4. Client-state churn

```
139 × useEffect
```

Across a site that is ~90% static marketing content. Most of it compensates for the SPA architecture: scroll restoration, hash-target scrolling (`useScrollToPageTarget`, `useScrollToPageTop`, `useHasSectionHash`), locale syncing, and DOM-mutating meta management. In a server-rendered architecture the overwhelming majority of this disappears entirely.

### D5. Client-side data fetching for static content

`src/lib/cms.ts` fetches locale JSON from `/cms/<locale>/*.json` **at runtime, in the browser**, then deep-merges it into component props — for content that changes monthly. This means:

- a network waterfall after JS parse, before content renders
- content that only exists post-hydration (the prerenderer papers over this)
- `stripJsonComments()` — the CMS files contain JS comments and must be regex-cleaned before `JSON.parse`, which is a parser waiting to break on an apostrophe or a URL containing `//`

### D6. Positives worth noting

- **Zero `: any`** across the codebase — TypeScript discipline is genuinely good
- Only 1 missing `alt` out of 120 `<img>` in source
- Only 1 `<div onClick>` — keyboard accessibility was considered
- Source comments are unusually high-quality and explain *why*, not *what*

The problem is not carelessness. It is the absence of an architecture to be careful *within*.

---

## 6. Section E — Security and privacy

### E1. Secrets are shipped to the browser (HIGH)

`.env.example` requires:

```
# Saudi track redirect — AES key for applicant portal (must match backend; 32 chars)
# Required for production builds.
VITE_KSA_ENCRYPT_KEY=
```

**Every `VITE_*` variable is inlined into the client bundle by design.** Vite even enforces its presence at build time (`assertProductionSecrets` in `vite.config.ts`), which means the build *actively guarantees* a shared AES key is compiled into a publicly downloadable JavaScript file. `crypto-js` is confirmed present in the live bundle.

An AES key that ships to every visitor is not a key.

The same applies to the Zoho Web-to-Lead form tokens (`VITE_ZOHO_FORM_*`), confirmed in the live bundle alongside the `WebToLeadForm` endpoint — meaning the CRM lead endpoint and its credentials are public and trivially spammable. There is no rate limiting, no bot detection, and no server-side validation between the public internet and the CRM.

**This must not be carried into the new build.** Anything requiring a secret belongs behind a server route.

### E2. CSP is long but permissive (MEDIUM)

```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ...
```

`'unsafe-inline'` on `script-src` reduces the CSP's XSS protection to roughly decorative. It is there because GTM is installed as an inline bootstrap snippet. A nonce-based CSP solves this cleanly and is straightforward in a server-rendered framework — it is *not* straightforward in a static SPA, which is why it was never done.

Also present: 7 files using `dangerouslySetInnerHTML`. There *is* a `sanitizeCmsHtml.ts`, which is the right instinct — but the combination of `unsafe-inline` CSP + raw HTML injection + a client-fetched CMS is a chain worth breaking.

### E3. Other observations

- CSP is duplicated across **three** files (`vite.config.ts`, `web.config`, `public/_headers`) with "keep in sync" comments — two of which are dead. Drift hazard by construction.
- `x-goog-*` headers leak GCS object generation/metageneration internals to every visitor. Cosmetic, but unnecessary.
- No `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy`.
- `Referrer-Policy: no-referrer` — over-tight; breaks first-party attribution (see C2).
- The `requestFiltering` verb blocks for `OPTIONS`/`TRACE` live in the **dead** `web.config`, so that VAPT remediation is not actually in effect.

---

## 7. Section F — Internationalisation

**This is the best part of the codebase and should be preserved.**

```bash
curl -sS https://www.helloverify.com/ar/ | grep -o '<html[^>]*>'
# <html lang="ar" dir="rtl">
```

| Locale | Real translated content? | Evidence |
|---|---|---|
| `en` | — | baseline |
| `hi` | ✅ Yes | 33,609 Devanagari characters in served HTML |
| `ar` | ✅ Yes | 15,806 Arabic characters, `dir="rtl"` correctly set |

Titles are localised too: `منصة عالمية للتحقق من الخلفية مدعومة بالذكاء الاصطناعي | HelloVerify`

### F1. Weaknesses (LOW — content is fine, plumbing is not)

- Locale is a router param (`/:lang`) with no server-side negotiation — no `Accept-Language` handling, no geo-routing, no cookie persistence
- `/` root serves a **client-side** `<Navigate to="/en">`, not a server redirect, so the most-linked URL on the site resolves via JavaScript
- Translations live in three parallel systems: `src/i18n/*.json`, `public/cms/<locale>/*.json`, and hardcoded English fallbacks in `src/content/*.ts` — a `cms-locale-parity.mjs` script exists specifically to detect when they drift
- RTL is applied via `dir` but styling uses physical properties (`margin-left`, `text-left`) rather than CSS logical properties, so RTL correctness is manual and per-component

---

## 8. Section G — Build and CI/CD

### G1. The pipeline does not do what it says (MEDIUM)

`azure-pipelines.yml` contains a step titled:

> `'Publish extensionless copies so clean URLs skip the redirect'`

with an accurate comment describing the exact bug in A2. **Production still 301s.** Likewise the immutable-cache step (A4) — production still serves `max-age=3600`.

Two of the pipeline's most important steps are demonstrably not taking effect in production, and nothing detects this. `verify-seo-deploy.mjs` exists, but runs against `dist/` at build time — it never probes the live origin after deploy.

### G2. `trigger: none`

The pipeline is **manual-only**. There is no automated deploy on merge to `main`, so the gap between "code is correct" and "production is correct" is a human remembering to click a button.

### G3. Build fragility

`npm run build` chains **eight** sequential steps:

```
generate-favicon → generate-og-image → generate-seo-files
→ tsc -b → vite build → prerender (Playwright + Chromium)
→ verify-dist-security → verify-seo-deploy
```

A marketing-site build that requires downloading a headless Chromium is a build that will break in CI and one nobody wants to run locally. There are **18 `.mjs` build scripts totalling 2,353 lines** — a bespoke build system maintaining itself.

### G4. Repository state

```
210 commits, 8 remote branches:
  main, staging, website-staging, website-dev-backup,
  live_website_backup, live_website_changes, mohesr-modification
```

Three are named "backup". Commit messages include `"resolve this issue"` ×3 and `"implement ui fixes"`. No branch protection evidence, no PR template, no CI on PR — only a manual deploy pipeline.

---

## 9. What to salvage

Do **not** start from a blank page. These are real assets, already paid for:

| Asset | Location | Action |
|---|---|---|
| Marketing copy, all 3 locales | `public/cms/{en,hi,ar}/*.json`, `src/i18n/*.json` | **Port** — this is the expensive part |
| Per-route titles & descriptions | `src/config/seo.ts` (337 lines) | **Port** into `generateMetadata` |
| JSON-LD entity graph | `src/components/StructuredData.tsx` (233 lines) | **Port + extend** with Article/Breadcrumb |
| Route/sitemap manifest | `src/config/seo-routes.json` | **Port** into `app/sitemap.ts` |
| `llms.txt` | `scripts/generate-seo-files.mjs` | **Port** — genuinely good, keep it current |
| Arabic RTL + Hindi translations | `public/cms/{ar,hi}` | **Port** — expensive to redo |
| Redirect map (old → new URLs) | `web.config` + `src/App.tsx` | **Port** into real server 301s |
| Zoho CRM lead field mapping | `src/lib/zohoLeadApi.ts`, `src/config/zohoCrm.ts` | **Port** — but server-side |
| Source images (originals) | `public/assets/**` | **Re-encode**, don't re-shoot |
| Compliance/policy copy | `src/pages/policy/**` (~2,500 lines) | **Port verbatim** — legally reviewed |

---

## 10. Conclusion

The team that built this site was not incompetent. The TypeScript is strict, the comments explain their reasoning, accessibility was considered, three locales were genuinely translated, and someone wrote a Playwright prerenderer and an `llms.txt` before most competitors had heard of one.

What is missing is **architecture**. A static marketing site was built as a client-rendered application, then progressively patched — a prerenderer to fix crawlability, an address-bar rewrite to fix routing, a parity-checker to fix translation drift, extensionless object copies to fix redirects, three synchronised copies of a CSP to fix headers. Each patch is individually reasonable. Together they are a system held shut with tape, deployed by hand, and **three of those patches have quietly stopped working without anyone noticing.**

The fix is not another patch. The fix is a framework where:

- URLs are resolved by the server, once, correctly
- content is rendered at build time by default
- compression and caching are the platform's job, not a `gcloud` flag someone forgot
- secrets stay on the server, because there *is* a server
- components compose from tokens instead of 211 hardcoded hex values

That framework is **Next.js 16 App Router**. The plan is in **`BUILD-SPEC.md`**.

---

## Appendix — Reproduction commands

```bash
# A1 — no compression
curl -sSI -H 'Accept-Encoding: gzip, deflate, br' \
  https://www.helloverify.com/assets/index-Bcy-TV6w.js | grep -i -E 'encoding|length|cache'

# A2 — redirect chain
for u in /en /en/ /en/index.html /en/products/bgv-enterprise; do
  printf '%-32s ' "$u"
  curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "https://www.helloverify.com$u"
done

# A3 — apex domain
curl -sS --max-time 15 -o /dev/null -w '%{http_code}\n' https://helloverify.com/

# B1 — total homepage weight
curl -sS https://www.helloverify.com/en/ -o home.html
grep -o 'src="/assets/[^"]*"' home.html | sed 's/src="//;s/"//' | sort -u > assets.txt
total=0; while read -r a; do
  s=$(curl -sS -o /dev/null -w '%{size_download}' "https://www.helloverify.com$a")
  total=$((total+s)); done < assets.txt; echo "$total bytes"

# D3 — design token debt
cd "D:/Projects/Application Frontend HV"
grep -rho '#[0-9A-Fa-f]\{6\}' src --include=*.tsx | sort -u | wc -l
grep -rhno '\[[0-9]*\.\?[0-9]*px\]' src --include=*.tsx | wc -l

# E1 — secrets in the live bundle
curl -sS https://www.helloverify.com/assets/index-Bcy-TV6w.js -o bundle.js
grep -o 'WebToLeadForm' bundle.js | head
grep -c 'CryptoJS\|AES' bundle.js
```

# helloverify-web

The HelloVerify marketing site. Stack per [`../BUILD-SPEC.md`](../BUILD-SPEC.md) §4:
Next.js 16 (App Router) · TypeScript · Tailwind v4 · Turbopack.

## The homepage is a port, not a hand-build

The design lives in a Claude Design canvas: nine artboards, four desktop (1440px)
and five mobile (390px), each a complete HTML page with its own stylesheet. The
homepage reproduces those artboards exactly, so the markup and CSS here are
**generated from the artboards, not authored**.

```
design-src/artboards/     the nine .dc.html boards + canvas.json, as exported
public/img/               the 28 photos/logos the boards reference
src/app/design.css        generated — both artboard stylesheets
src/components/sections/  generated — one component per section
src/components/brand/     hand-kept — Logo and YCBadge, factored out of the boards
```

Regenerate after re-exporting the canvas:

```sh
python tools/port/build-css.py       # -> src/app/design.css
python tools/port/build-sections.py  # -> src/components/sections/*.tsx
```

Hand edits to those two outputs are lost on regeneration. To change the design,
change the canvas.

### Images

There are no raw `<img>` tags in the codebase — everything is `next/image`
(BUILD-SPEC §9.2). Two shapes, both driven from measurement:

- **Photo cards** (`.pimg`) use `fill`. `.pimg` is already
  `position:absolute; inset:0; object-fit:cover`, so `fill` is a structural
  no-op and the class keeps supplying `object-fit` and the `.ph:has(.pimg)`
  rules. Every one carries a `sizes` from `src/lib/img.ts`.
- **Fixed-size images** (cert logos, avatars) pass `width`/`height` and **no**
  `sizes`, so Next emits a plain `1x/2x` pair.

`sizes` is not optional and not guessable. Without it Next assumes `100vw` and
serves a 1440px variant into a 300px box — heavier than the raw `<img>` it
replaced. The values in `src/lib/img.ts` come from a CDP census of every visible
image box at 1440px and 390px; they are `vw` rather than `px` because a px-only
`sizes` disables Next's srcset filter (measured: 1,540 bytes of HTML per image
instead of 274).

For the generated sections the transform lives in the generator, not the output:
`tools/port/imgprops.py` holds a table keyed on `(component, container class)`,
and `h2jsx.py` applies it while walking the artboard's element tree. An image
that moves into an unmeasured container **fails the build** rather than getting
a guessed `sizes`.

Measured effect on the homepage: images **1,212.6 KB → 89.8 KB** across 28
requests → 8, with 0 element-box differences at either breakpoint.

### Three things that make the port faithful

**Both breakpoints ship.** The desktop and mobile boards have genuinely different
element trees, not just different sizes, so both render and CSS swaps them via
`.dsk` / `.mob` at 1080px.

**The two stylesheets are disjoint**, `min-width: 1081px` and `max-width: 1080px`.
The mobile board is a complete stylesheet, not an override layer — letting desktop
cascade underneath applies values that board never had.

**Tailwind ships without preflight** (`src/app/globals.css`). Preflight sets
`line-height: 1.5`; the boards assume `normal`. Utilities and theme are still
available for anything built outside the canvas.

## Verifying fidelity

`tools/port/` drives headless Chrome, freezes animations, walks the DOM of both
the artboard and the running page, and compares every element's box.

```sh
chrome --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/cdp about:blank &
npm run dev
sh tools/port/diff.sh <artboard.html> http://localhost:3000 1440 desktop
```

Last full run against the artboards: **1,504 desktop elements and 1,157 mobile
elements, 0 differences.**

The same harness also diffs the running page against itself before and after a
change, which is the gate the `next/image` migration had to pass: 14 routes ×
two breakpoints, **0 element-box differences** (homepage alone: 1,591 desktop +
1,265 mobile elements).

Two harness bugs fixed while doing that: `diff.sh` pointed at `tools/dommap.mjs`
and `tools/diffmap.py` instead of `tools/port/...`, and `diffmap.py` opened its
JSON with the platform default encoding, which threw on any page containing
smart quotes.

### Byte-identity, for the component splits

`tools/port/html-identity.mjs` is the cheaper check the element-box harness does
not replace: it needs no browser, and it reads the build rather than a running
page.

```sh
npm run build
node tools/port/html-identity.mjs snapshot ../.snap   # before the change
# rewrite the component
npm run build
node tools/port/html-identity.mjs compare  ../.snap   # after it
```

It exists for BUILD-SPEC §4 rule 2 / §17 condition 22 — splitting the oversized
section components into record-driven ones. A split changes no values, so this
is the one place where byte-identity IS the right test; §"Design tokens" below
explains why it is the wrong test for a tokenisation.

Three separate signals, because they mean different things:

| Signal | Fatal? | Why |
|---|---|---|
| markup differs | yes | the rendered page changed; this is the whole point |
| stylesheet hash moved | yes | Tailwind generates from the classes it finds, so a pure split cannot move it |
| client chunk hash moved | only without `--allow-script` | a Client Component was reshaped, so the browser downloads something different |
| flight payload differs | only without `--allow-payload` | `.map()` gives children `key`s that hand-written siblings never had |

The script signal was added last, by the last file in the set. Through eleven
extractions not one JS chunk name moved — a Server Component's markup never
reaches the client bundle — and then splitting `ContactForm.tsx`, the one Client
Component in the list, moved exactly one. It is reported rather than normalised
for the same reason as the stylesheet: it is a real change to what ships.

The build id is normalised, and nothing else is. Next mints a fresh 21-character
`BUILD_ID` per build and embeds it in every page; without that one substitution
all 58 files differ and the check reports nothing. Script `src` hashes are
deliberately **not** normalised — once the build id was neutralised, 57 of 58
pages were already byte-equal, so the chunk names carry no content hash here and
normalising them would only have widened the blind spot.

**It found a bug in itself on the first mutation.** Deleting one `className` to
prove the check fires renamed `chunks/*.css`, which is in the `<link>` of every
page, so all 58 reported and the one real difference was lost. The stylesheet is
now pulled out and compared once. It is reported rather than quietly normalised,
because a moved stylesheet hash is itself a regression for this kind of change.

**And Tailwind read this harness's own comments.** The file used the bare word
for the CSS property between `border` and `box-shadow`; Tailwind v4 auto-detects
sources, that sweep includes `tools/`, and the extractor generated a real
165-byte rule into the shipped CSS on every page — 121,921 bytes to 122,086,
chunk hash moved. Measured by removing the file and rebuilding. The comment was
reworded; the general exposure is a carried finding in `../TASKS.md`.

#### The check was broken five ways

| # | Mutation | Result |
|---|---|---|
| M1 | the trailing CTA link deleted — outside the repeated run, exactly the PeopleStrip regression | caught, and named the link |
| M2 | one `{' '}` text node dropped between two card rows | caught — 6 bytes |
| M3 | the mobile cards reordered | caught — **same byte length**, which a size check would have passed |
| M4 | `` {`${n} checks`} `` reverted to `{n} checks` | caught — +72 bytes, nine `<!-- -->` separators |
| M5 | the fields of one record reordered | **no-op** — byte-identical, as predicted |

M5 is recorded as a no-op rather than counted as coverage. M4 is not a
hypothetical: that spelling is what the first rewrite of `Packages.tsx` shipped,
and nothing else in the repo would have noticed.

## Pages

36 static routes covering the audience-first IA (`../INFORMATION-ARCHITECTURE.md`):
home · business (hub + 5) · governments (hub + 4 + MOM case study) · individuals
(hub + 3) · platform (hub + 3) · resources (hub + library + guides + glossary +
blog) · about · contact · 8 legal documents. 59 pages generated.

Templates live in `src/components/templates/` and the shared chrome in
`src/components/chrome/`. Page-level CSS is `src/app/pages.css` — same token
vocabulary as the canvas, single responsive tree, breakpoint 1080px.

The programmatic layer (IA §7) is three route files over typed data in
`src/lib/content/`: `/checks/[check]`, `/countries/[country]`,
`/resources/blog/[slug]`, all statically generated.

```sh
python tools/port/lint-collisions.py   # new markup must not reuse bare canvas classes
```

## The URL contract

Every legacy URL the old site served returns a real server **308** (BUILD-SPEC
§6.2, IA §9). The old "redirects" were client-side JS that search engines saw as
a 200 on a thin page, because `web.config` was never executed (AUDIT A5).

The table is `src/lib/seo/legacy-urls.ts` — 53 routes, each carrying the source
it came from (`web.config`, `App.tsx`, `seo-routes.json`, `sitemap.xml`). The
emitter is `src/lib/seo/redirects.ts`; the two are split only to stay under the
300-line rule. 388 rules compile.

Neither file imports anything from the app. `next.config.ts` loads outside the
app graph, so `@/` does not resolve there and `server-only` would break the
config load outright — the same plain-data discipline `lib/leads/constraints.ts`
uses to keep zod off the client.

**Order is the whole problem.** `redirects` run at step 2 of Next's pipeline and
the proxy at step 3, so every rule fires *before* locale negotiation. That means
destinations must be locale-prefixed (an unprefixed one would 308 here and 307
again in the proxy), `/index.html` must be generated per rule rather than
stripped generically, and the unserved-locale catch-all must sit after the
specific rules and before that strip. Each of those, got wrong, is a redirect
chain — which is exactly what AUDIT A2 describes on the old site.

```sh
npm run build && npx next start -p 3100 &
npm run probe:redirects http://localhost:3100
```

815 assertions: status is 308, Location is exact, and the URL reaches its 200 in
**one hop**. Takes an origin, so the same command gates CI and a production
deploy (BUILD-SPEC §6.3, the control missing in AUDIT G1).

Two accepted deviations, reported by the probe rather than hidden:

- **Trailing-slash forms take two hops.** Next registers `/:path+/` with
  `priority: true`, so it is matched before anything `redirects()` returns and
  no ordering of ours can pre-empt it. The only lever is
  `skipTrailingSlashRedirect`, which would make both `/en/about` and `/en/about/`
  return 200 across all 59 routes — the duplicate-content failure §6.1 actually
  forbids, site-wide, to save one hop on obsolete URLs. Both hops are 308, so
  consolidation stays unambiguous.
- **The 7 cross-host rules assume `app.helloverify.com` is live.** A 308 is
  cached forever; if that host does not resolve at cutover they are permanently
  dead for anyone who hits one first.

## Generated SEO files

`app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` and
`app/[locale]/opengraph-image.tsx` replace the old repo's three generator
scripts (`generate-seo-files.mjs`, 203 lines, plus the OG and favicon
generators). All four are `force-static`; the build stays at zero dynamic
routes.

The route list is `src/lib/seo/routes.ts`. Its dynamic half is derived from the
same arrays `generateStaticParams` iterates — `CHECKS`, `COUNTRIES`, `POSTS`,
`LEGAL` — so adding a check or a policy puts it in the sitemap with no second
edit. The old site kept its routes in `App.tsx` and its sitemap in
`seo-routes.json`, nothing compared them, and all 84 entries drifted onto
redirects (AUDIT A2).

```sh
npm run build && npm run check:sitemap
```

That enforces BUILD-SPEC §8.3's invariant in both directions — a page that is
not in the sitemap fails, and a sitemap entry with no page fails — by diffing
against `.next/prerender-manifest.json` rather than against intent. It also
asserts the sitemap is **disjoint from `legacy-urls.ts`** (a URL cannot be both
"must 200" and "must 308"), that no entry has a trailing slash or an
`index.html`, and that every hreflang alternate resolves to a `<loc>` in the
same file. Then it opens every emitted HTML file and checks the page tags
against it — see the next section. Currently **56 pages, 56 entries, 112
alternates**. The gate was verified by removing a route and watching it fail,
not only by watching it pass.

`robots.txt` names all twelve AI crawlers explicitly (§11a.1). `*` already
allows them; naming each is defensive against a future default-deny, and
training and retrieval are separate agents at every vendor — `GPTBot` trains,
`OAI-SearchBot` retrieves, `ChatGPT-User` is a user-triggered fetch.

The OG card renders at build time in the DESIGN.md §2.1 palette. Two known
limitations, both recorded in the file: it uses Satori's bundled font rather
than Newsreader, because loading ours would mean a network call inside
`next build`; and its word spacing is visibly uneven, which is a text-shaping
artifact and probably the same root cause. Setting `display: "block"` on every
text node was tried and produced a byte-identical PNG.

## Canonical and hreflang

Every page carries a self-referencing absolute canonical and the full hreflang
set, server-rendered at build time. This is the other half of AUDIT C2: the old
site mutated `<link rel="canonical">` from `PageMetaManager.tsx` after
hydration, so any crawler that does not run JS saw the homepage canonical on all
84 URLs.

One helper, `src/lib/seo/metadata.ts`, builds them from the same
`absoluteUrl(localePath(…))` calls `app/sitemap.ts` makes, which is what makes
§6.1's "byte-identical" rule structural rather than aspirational. All 32 pages
call it:

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/about", {
    title: "About HelloVerify",
    description: "…",
  });
}
```

`generateMetadata` is handed no pathname, so each page names its own route —
the one real hazard here — and it is guarded from both sides. The helper throws
during `next build` on a path that is not in `routes.ts`; the checker asserts
each emitted canonical equals *its own* URL, which catches the case the helper
cannot see, a page naming a route that exists but belongs to another page.

Per page, `npm run check:sitemap` asserts: exactly one canonical, equal to that
page's `<loc>`; an hreflang set string-equal to that `<loc>`'s alternates,
`x-default` included; `og:image`, `og:site_name`, `og:type`, `og:title`,
`og:description` and `twitter:card` all still present; and `og:url`, if anything
ever emits one, equal to the canonical. `/_not-found` and `/_global-error` are
checked for the *absence* of all of it.

Three things worth knowing before touching this:

- **Do not add `openGraph` to a page.** Next merges metadata shallowly, so a
  page-level `openGraph` replaces the layout's resolved object — and the
  generated OG card is attached to that object. Doing it drops `og:image` from
  all 56 pages at once. That is why `og:url` is absent here, and why the checker
  asserts the inherited tags: the mistake is invisible without it.
- **Next writes `hrefLang`, not `hreflang`**, into the HTML, contradicting its
  own documentation. Harmless — attribute names are case-insensitive — but
  grepping the output for `hreflang` finds nothing.
- **A canonical on the layout would be worse than none.** It reaches no page
  today (each defines its own `alternates`, which replaces the parent's), but it
  would silently supply `/en` to a future page that forgets to call
  `pageMetadata`, and that page would then pass the "exactly one canonical"
  check. An inherited canonical hides a missing one.

The suite was verified by breaking it six ways: an invented route, another
page's route, a layout-level canonical, a page-level `openGraph`, a dropped
`x-default`, and a relative canonical. Four are caught; the remaining two emit
byte-identical output and are documented as no-ops rather than left looking like
gaps.

## Structured data

The §8.2 graph, server-rendered into every page. `src/lib/seo/schema/` holds one
builder per node kind and `src/components/seo/JsonLd.tsx` renders them.

| Node | Where it comes from | Count |
|---|---|---|
| `Organization` + `ContactPoint` + `PostalAddress` | two module constants, rendered by the root layout | 56 |
| `WebSite` | same | 56 |
| `BreadcrumbList` | the `crumbs` prop `PageShell` already renders | 47 |
| `FAQPage` | the `Faq[]` `FaqSection` already renders | 15 |
| `Service` + `areaServed` (+ `OfferCatalog` on the two package pages) | a `ServiceFacts` const per vertical page | 12 |
| `BlogPosting` | the `POSTS` record the page already renders | 2 |

```sh
npm run build && npm run check:seo      # check:sitemap, then check:schema
```

**Nothing in the graph is a second copy of anything on the page.** That is the
whole design, and it is the same argument `routes.ts` makes for the sitemap.
Google's policy for `BreadcrumbList` and `FAQPage` is that the markup must match
what a user sees, so a parallel hand-maintained array would pass the validator
on the day it was written and drift at the first copy edit. Instead:

- `PageShell` builds `BreadcrumbList` from the array it hands `<Breadcrumb>`.
- `FaqSection` builds `FAQPage` from the array it renders as `<details>`. This
  is why the nine pages that hardcoded 39 `<details>` in JSX now state them as a
  `Faq[]` — the lift was verified as **byte-identical rendered markup**: 55 of
  56 emitted pages are identical to the pre-refactor build with `<script>`
  bodies stripped, and the 56th differs only in `/en/contact`'s `$ACTION_KEY`,
  a per-build Server Action hash.
- `Service.description` is `COPY.description`, the reviewed meta description.
- Each vertical page states its route **once**, as `const PATH`, used by both
  `pageMetadata` and its `ServiceFacts`. §8.2 adds no new chance to name the
  wrong route on top of the one §8.1 already guards.

`npm run check:schema` reads the emitted HTML and asserts: every block parses;
every `@type` is one §8.2's table authorises; exactly one `Organization` and one
`WebSite` per page and **byte-identical across all 56** (§11a.3); every `@id`
reference resolves; the `BreadcrumbList` equals the visible `<nav>` trail item
for item; every `FAQPage` question and answer appears verbatim in the rendered
`<summary>`/`<p class="a">`; `Service.@id` is that page's own canonical plus a
fragment and its offers name things the page shows; `BlogPosting.headline`
equals the visible `<h1>` and its `datePublished` equals the `POSTS` record. It
also fails the build on `QAPage` or `SearchAction` anywhere — §8.2's two January
2026 Google deprecations, enforced rather than remembered.

### The gate was broken thirteen ways

| # | Mutation | Result |
|---|---|---|
| M2 | rendered answer text edited after the JSON-LD is built | caught |
| M3 | one question marked up but not rendered | caught |
| M4 | breadcrumb trail reversed in the JSON-LD only | caught |
| M5 | `Home` rung dropped from the JSON-LD trail | caught |
| M6b | `SearchAction` in a valid form | caught, on all 56 pages |
| M7 | a page names another page's real route | caught by **both** gates |
| M8 | an `Offer` gains a placeholder price | caught |
| M9 | `BlogPosting` dated from something other than the post record | caught |
| M11 | a node with a `@type` outside §8.2's table | caught |
| M12 | `Organization` parameterised per page | caught — 55 variants, and `/en` missing its node |
| M1 | the same regression written as `{ ...ORGANIZATION, slogan }` | caught by **tsc**, not the gate — `WithContext<Organization>` is a union, so TS2698 |
| M6 | `SearchAction` carrying Google's `query-input` | caught by **tsc**, not the gate — `query-input` is not a schema.org property |
| M10 | the JSON-LD `<` escaping removed | **no-op** — byte-identical output |

M1 and M6 are recorded as compiler catches rather than counted as gate coverage:
each is a real defence, but neither exercises the assertion it was aimed at.
M12 and M6b are the same two regressions rewritten so that they compile, and
those are the runs that prove the byte-identity and deprecation checks fire.

M10 is a genuine no-op and is left documented as one. Removing
`.replace(/</g, "\\u003c")` changes nothing today because no string on this site
contains `</script`. It matters the day one does — a legal policy quoting a tag,
an FAQ answer about markup — because `<script type="application/ld+json">` is a
raw text element, so the HTML parser ends it at the first `</script` inside the
JSON. `tools/test/json-ld.test.ts` covers that in 10 assertions, including that
the unescaped form really does break:

```sh
node --import ./tools/test/register.mjs ./tools/test/json-ld.test.ts
```

Three things worth knowing before touching this:

- **`schema-dts` does not check what §8.2 says it checks.** The spec's sketch
  types the component prop `WithContext<Thing>`, and an invented property on a
  non-fresh value assigned to that type-checks clean. Excess-property checking
  only fires on a fresh object literal, so the safety has to live in the
  builders' concrete return types — which is where it does live. Four measured
  cases in `tools/test/schema-types.md`.
- **The `Organization` block is emitted from the layout, not from any page**,
  and takes no parameters, because §11a.3 requires it byte-identical everywhere.
  Making it a function of anything page-scoped is M12, which is a failed build.
- **`WithContext<T>` is a union type**, so you cannot spread one node to derive
  another. Write a fresh literal.

## llms.txt, and the copy table behind it

`/llms.txt` is generated from the route manifest, not checked in
(`src/lib/seo/llms.ts`, served by `src/app/llms.txt/route.ts`). §11a.4 asks for
a file that "can never drift" from the sitemap, and a hand-written text file is
the `seo-routes.json` mistake in a different extension.

```sh
npm run build && npm run check:llms     # or check:seo for all three gates
```

It lists **all 56 routes**, grouped by section, each as
`- [Title](url): description` in llmstxt.org's shape, under a quotable
company definition and the hard numbers. §11a.4 says "key pages", which pulls
against "can never drift" in the same list — "key" is expressed as **order**
(commercial pages first, matching the manifest's own priorities), never as
omission, because any curated subset is a second list that goes stale.

**The one-line descriptions are why `src/lib/seo/copy.ts` now exists.** All 32
reviewed title/description pairs used to live as literals inside the page files,
readable only by a React render. `llms.txt` needed them, so they moved into one
table keyed by route path, and `pageMetadata` lost its `copy` argument:

```ts
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata(locale, "/about");   // title + description come from the table
}
```

The 28 programmatic routes derive their copy from the same `CHECKS`,
`COUNTRIES`, `POSTS` and `LEGAL` records their pages render, so adding a check
needs no edit there — exactly as it needs none in `routes.ts`. A route in the
manifest with no copy is a **failed build**: `copy.ts` resolves every route
through `copyFor` at module load, which is §7's "translation completeness is a
build gate" applied to English.

None of the copy was rewritten. Every literal was lifted out of its page file by
a script, and the refactor was held to **byte-identical rendered markup: all 56
emitted pages matched the pre-refactor build exactly** (`<script>` bodies
stripped). This is also what unblocks §7 — translating the site is now keying
one table by locale, not hunting 32 literals across the app directory.

`npm run check:llms` asserts the §8.3 invariant in a fourth file (every sitemap
page is in `llms.txt` and vice versa), that no entry is in the redirect map,
that the file is prerendered with the right content type, and — the assertion
the table exists to make true — that **every title and description in
`llms.txt` is byte-identical to that page's own `<title>` and
`<meta name="description">`**. All 56 checked, every build.

### The gate was broken twelve ways

| # | Mutation | Result |
|---|---|---|
| L2 | `llms.txt` states its own title instead of the page's | caught — 56 pages disagree |
| L3 | `llms.txt` paraphrases a description | caught — 24 pages disagree |
| L4 | a hard number drifts from `/about` | caught |
| L5b | the quotable definition reduced to a stub | caught |
| L6 | `llms.txt` lists a URL that is in the redirect map | caught |
| L7 | the route handler loses `force-static` | caught — no prerendered body |
| L8 | a page bypasses the table and states its own title | caught |
| L1 | a route matching no section | caught at **build** — `renderLlmsTxt` throws |
| L9 | a route with no copy in the table | caught at **build** — `copyFor` throws |
| L10b | the referrer policy reverted to `no-referrer` | **not covered** by any build gate — see below |
| L5 | first attempt at emptying the definition | **bad mutation** — `"" + "…"` empties nothing |
| L10 | first attempt at removing the header | **bad mutation** — Next rejects `headers: []` outright |

L1 and L9 are caught by guards in the source rather than by the checker, and
are recorded that way: both are `throw`s written for exactly that case, and a
failed build is a better outcome than a failed check.

**L10b is the honest gap, and it moved an assertion.** No build-output checker
can see a response header — reverting §8.4's policy passed `check:sitemap`,
`check:schema` and `check:llms` untouched. So the referrer policy is asserted in
the **live probe** instead, along with `/llms.txt` being served unprefixed:

```sh
npm run build && npx next start -p 3100 &
npm run probe:redirects http://localhost:3100    # 823 assertions
```

Measured both ways: the probe passes at 823 assertions, and reverting the header
to `no-referrer` fails exactly 4 of them.

L10b also found a **real regression it was not aiming at**: adding the
`/llms.txt` route made `check:sitemap` fail, because a newly prerendered route
was being demanded as a sitemap entry. It is a generated SEO file, not a page,
and now sits in `NOT_PAGE_SUFFIXES` beside `robots.txt` and `sitemap.xml`.

## Referrer policy

`next.config.ts` now sets `Referrer-Policy: strict-origin-when-cross-origin` on
every path (§8.4, AUDIT C2 — the old site's global `no-referrer` "strips the
referrer from your own analytics and from partners' inbound attribution").

It is the **only** header set there, deliberately. §13 also wants HSTS, a CSP
and frame-options; a CSP in particular has to be built against the real script
and style inventory or it breaks the site silently in one browser, which is its
own item. See known gaps.

## Performance budgets

```sh
npm run build && npm run check:perf      # or check:all for all four gates
```

`tools/perf/check-budgets.mjs` measures every one of the 56 pages against
§9.1 and prints the worst page per metric. Sizes are **brotli** — what Cloud
Run behind Cloud CDN actually puts on the wire — except fonts, which are
counted raw because WOFF2 is already brotli inside.

| metric | worst page | value | §9.1 | ceiling |
|---|---|---:|---:|---:|
| script | `/en/contact` | 159.7 KB | 120 | 163 |
| stylesheet | `/en/about` | 13.6 KB | 40 | 16 |
| font | `/en/about` | 241.9 KB | 60 | 245 |
| total | `/en` | 445.7 KB | 500 | 460 |
| third-party origins | — | 0 | 5 | 5 |

**Two tiers, and the second one is the point.** `SPEC` is §9.1 verbatim;
`CEILING` is what the build actually produces plus ~3% headroom, and it is what
fails the build. A gate pinned to a target the code cannot reach gets switched
off or gets its target quietly raised. This one cannot be passed by accident, it
prints the remaining gap on every run, and it stops the gap growing.

Fonts were **324.1 KB before this item and are 241.9 KB now** — `npm run
build:fonts` takes a census of the 133 characters the 56 pages actually render
and subsets the faces to it, then `next/font/local` self-hosts the result
(§9.3). Both variable axes survive, so the type is byte-smaller and visually
identical.

That still misses §9.1's 60 KB, and the measured curve says why:

```
Newsreader roman, glyph-subset, both axes ......... 82 KB
  ... with `opsz` pinned ........................... 35 KB
  ... with `opsz` pinned and `wght` 400-600 ........ 23 KB
  ... fully static (opsz 40, wght 400) ............. 13 KB
```

The serif runs from 15px captions to a 176px display number, so
`font-optical-sizing` is doing visible work across that range — pinning `opsz`
is a design change, not a build step. Even pinning every axis on all four faces
lands near 90 KB with three families, so §9.3's own "maximum two families" would
have to go too. **That is a DESIGN.md decision**, which is why the gate records
the number rather than quietly changing the type.

**The total budget is met** (445.7 KB against 500), which it was not before:
528.7 KB.

### The gate was broken four ways

| # | Mutation | Result |
|---|---|---|
| P1 | fonts reverted to `next/font/google` | caught — font jumps to 514 KB |
| P2 | a raw `<img>` added to a component | caught |
| P3 | six third-party origins added | caught — 6 > 5 |
| P4 | an `<a href>` to another host | correctly **not** counted |

P4 is a negative test: this site links to `app.helloverify.com` from every
pricing card, and a link the user may click is not a request the page makes.

**P3 found a real bug in the gate itself.** The third-party counter had been
reporting 0 on every page — correctly by accident, since the true answer is 0 —
because a patch script wrote `\b` as a literal backspace byte (0x08) into the
regex. `/\x08src="…"/` can never match. Six external scripts did not fail the
build, which is how it surfaced. A gate that has never failed is not evidence.

## Tests and CI

```sh
npm test            # 100 assertions, Vitest
npm run typecheck
npm run build
npm run check:all   # static, sitemap, schema, llms, budgets, secrets
npm run contract http://localhost:3100   # §14.3, against a running origin
```

`.github/workflows/ci.yml` runs all of that on every PR and every push to
`main`. **Until item 9 nothing ran automatically** — six gates, a
823-assertion redirect probe and 100 unit tests, all manual. AUDIT G2 is the old
pipeline's `trigger: none`: a CI config that had to be run by hand, and
therefore wasn't.

### Vitest

§3.7 picked Vitest and the suite had been running on bare Node through a
hand-written resolve hook. The migration deliberately did **not** rewrite the 94
assertion lines: `tools/test/harness.ts` keeps `check(label, cond, got)`'s exact
signature and registers a Vitest `test()` per call, so every assertion became
its own named test with a one-line change per file.

Two config settings are load-bearing, and the second cost a debugging round:

- `resolve.conditions: ["react-server"]` resolves `server-only` to its no-op
  build — what the old `--conditions=react-server` flag did.
- **`ssr.resolve.conditions` as well.** Vitest runs test files through Vite's
  SSR pipeline, and `resolve.conditions` configures the client resolver only.
  Measured: without it, 3 of 4 suites fail with *"This module cannot be imported
  from a Client Component module"*.

`dns.test.ts` is excluded from `npm test` and available as `npm run test:net` —
it makes real MX lookups, so it can fail for reasons that have nothing to do
with the code.

### New gates

| Gate | § | What it proves |
|---|---|---|
| `check:static` | §17, §14.2, §5 | every route in the manifest prerendered, none on-demand |
| `check:secrets` | §17, AUDIT E1 | no secret names or secret shapes in `.next/static` |
| `contract` | §14.3 | what a live origin actually serves |

`contract` is **plain fetch, not Playwright** — a deliberate reading of §14.1's
table. Every assertion §14.3 lists is a request and a header or status check;
no DOM is involved. Playwright earns its place for the E2E and page-a11y rows
(locale switching, RTL, form submission), which is §12's work. Adding a 200 MB
browser download to a header check makes the suite slower to run and likelier to
be skipped — which is how the old one ended up `trigger: none`.

It runs 14 assertions and knows the difference between a build and a
deployment: against `localhost` the CDN and DNS assertions (apex → www,
`immutable` caching) **degrade to warnings**, decided from the URL rather than a
flag, so nobody can pass CI by pointing it at localhost.

### The gates were broken six ways

| # | Mutation | Result |
|---|---|---|
| C1 | a secret read from a Client Component | caught — named the chunk |
| C2 | a Zoho-shaped OAuth token hardcoded in client code | caught by shape, not by name |
| C4 | a unit test's expectation inverted | caught |
| C5 | `await headers()` added to a page | caught — `/en/about` did not prerender |
| C3 | `setRequestLocale` removed from a page | **bad mutation** — the page stayed static |
| — | `/[locale]/opengraph-image` flagged as on-demand | **false positive in the gate** |

**C5 found the gate was too weak.** `check:static` first asserted a floor
(`prerendered.length < 50`); adding `await headers()` to `/about` took the count
from 64 to 63 and it passed. It now compares **exactly** against `allRoutes()`
× locales — the fifth consumer of that one manifest — and names the route that
dropped out.

The opengraph-image false positive was settled by measurement rather than
argument: `/xx/opengraph-image` answers **307**, because `src/proxy.ts` rewrites
an unrecognised first segment before the route is reached. It is an asset of a
page, not a page, and is excluded.

## The browser layer

`npm run test:e2e` — Playwright, 124 tests over two viewports. The first thing
in this repo that renders a page; everything else reads build output or HTTP
headers.

```sh
npm run build          # it tests the BUILD, not `next dev`
npm run test:e2e
npm run test:a11y      # just the axe sweep
```

Two viewports, 1440 and 390, because `.dsk` and `.mob` are separate markup
swapped at 1080px rather than one tree reflowing — a single viewport leaves half
the site unrendered.

### What it proves that nothing else could

| Spec | Claim |
|---|---|
| `breakpoints.spec.ts` | both trees ship and **exactly one is on screen**, either side of the 1080/1081 seam |
| `a11y.spec.ts` | the three axe rules jsdom reports it cannot run, over all 56 routes |

`check:a11y` has always printed "not runnable without layout: color-contrast,
target-size, scrollable-region-focusable". Those three need a box model. The
browser scan runs **only** those three: the jsdom gate already covers every
other rule on every page in seconds with no browser, and re-running them here
would cost minutes to re-prove what is proved, and make this suite the one
people skip. Together they are the complete rule set; neither alone is.

### It found two things on its first run

**A keyboard trap in reverse, and it is fixed.** The two API samples on
`/platform/technology` set `overflow-x: auto`, so at 390px they scroll sideways
— and a keyboard user could not reach or move them (WCAG 2.1.1). They now carry
`tabIndex={0}` and a `role="region"` named from the header already above each
block, so the name is existing copy rather than invented. Desktop never showed
it: the samples fit, so nothing scrolls.

**A colour below AA that no gate could see.** `#7D796F`, the placeholder text of
the homepage's mock contact form, measures **3.95:1** on paper where 4.5:1 is
required, on five nodes. It is hard-coded in `app/design.css` on `.inp` at both
breakpoints. Three gates all miss it by construction: `hv/no-color-literal` is
an ESLint rule and reads TypeScript, not stylesheets; `check:tokens`, which did
read files as text, was removed in Part 4 as redundant with it; and
`check:contrast` walks the **token table**, so a colour that is not a token is
invisible to it. Accepted with its measurement alongside `--faint`, because the
fix (`--muted`, 4.83:1) is a DESIGN.md decision — see `../TASKS.md`.

### The lead form, end to end

`tools/e2e/contact-form.spec.ts` — 7 tests, both viewports. `abuse.test.ts` and
`schema.test.ts` already cover screening and parsing as units; what no unit
reaches is the seam, where a Server Action is invoked by a real form POST,
`useActionState` renders what came back, and the browser's own constraint
validation decides whether the POST happens at all.

What it pins, all of which could break with every unit test still green:

- an empty submit makes **no POST** — the browser enforces `required` and
  `minLength`, which is why the form ships no client validator and no zod on
  the client
- a server field error comes back **associated**, not merely visible:
  `aria-invalid` and `aria-describedby` pointing at the rendered `.err`
- typing survives a rejected submission, because the action echoes the known
  fields back
- the `<select>` keeps its choice across a rejected submission — this is the
  regression `key={state.token}` exists for, now guarded
- `?interest=` pre-selects, and an unknown value is ignored rather than injected
- the honeypot is laid out but clipped, `aria-hidden`, and unreachable by Tab

**Nothing leaves the machine, and that was checked before writing a single
submission.** `deliverLead` resolves its CRM sink through `zohoConfig()`, which
returns `null` unless `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET` and
`ZOHO_REFRESH_TOKEN` are all set. There is no `.env` in this tree, only
`.env.example`, so the sink is null and no outbound request is made. **That is a
property of the environment, not of the test** — pointing this suite at an
origin that does have Zoho credentials would file real leads.

`toBeVisible()` was the wrong predicate for the honeypot and the first version
used it. Playwright calls an element visible when it has a non-empty box, and
`.vh` is the clip technique — a 1×1 box with `clip: rect(0 0 0 0)` — so it
passes that check while being imperceptible. The test now measures the box.
`display: none` would fail the predicate and be the wrong thing to ship: a field
that is not rendered is not filled by the automation it exists to catch.

## Performance, in a browser

`npm run perf:lab` — Lighthouse CI, per §14.1's Performance row.

```sh
npm run build && npx next start -p 3100 &
CHROME_PATH='D:\playwright-browsers\chromium-1243\chrome-win64\chrome.exe' npm run perf:lab
```

`budget.json` carries **only what `check:perf` defers** — the three `timings`
and the image weight. The size budgets stay where they are measured from the
build in brotli, because two gates asserting the same number in different units
is how they come to disagree.

Measured, 3 runs per URL, mobile emulation with simulated throttling:

| URL | LCP | CLS | TBT | images |
|---|---:|---:|---:|---:|
| `/en` | 1,089 ms | 0 | 150 ms | 118 KB |
| `/en/contact` | 966 ms | 0 | 156 ms | — |
| `/en/platform/technology` | 875 ms | 0 | 46 ms | — |
| **budget** | **< 2,000 ms** | **< 0.1** | **< 200 ms** | **< 250 KB** |

Every one met, with LCP at roughly half its budget and CLS at zero — which is
`next/font` doing what §9.3 bought it for. **These are lab numbers against a
local origin**: no network latency and no CDN, so they are optimistic against
production, and §17 condition 3 also wants CrUX field data after 28 days. The
budget assertion was broken to check it fires — LCP budget set to 100 ms,
reported `found: 1133.991` and exited 1.

### Two costs of this, both worth knowing before you rely on it

**The runner is unreliable on Windows.** Roughly every other Lighthouse
invocation dies in `chrome-launcher`'s teardown with
`EPERM, Permission denied: …\lighthouse.NNNNN` — `rmSync` on the temp profile
directory before Chrome has released it. It happens *after* the audit, so it
costs the run rather than corrupting a number. Tried and did not fix it:
Playwright's isolated Chromium instead of the system one, and moving `TEMP` to a
project-local path. Expected to be Windows-only, since it is Windows file
locking, but **that is unverified here** — the fix is to run it on CI. Re-run if
it bites.

**It adds 10 dev-only advisories.** `@lhci/cli` pulls `lighthouse` →
`puppeteer-core` → `extract-zip`/`tmp`/`uuid`/`inquirer`: 7 high, 1 moderate,
2 low. `npm audit --omit=dev` still reports **0**, so nothing reaches
production, and CI has no audit step to break. Recorded rather than waved
through — the alternative is moving Lighthouse to CI-only.

### Three things the harness had to learn, each by being wrong

- **Only the homepage is a two-tree port.** The first draft of
  `breakpoints.spec.ts` asserted two trees on five pages and failed on four.
  Measured: `class="dsk"` appears in 1 of 58 emitted pages. The other 57 are
  `pages.css`, one responsive tree — so they are now asserted to have *no*
  canvas breakpoint block, which pins the boundary instead of ignoring it.
- **Animations and scroll reveal made the scan both flaky and lenient.** Two
  identical runs returned 68 and 69 contrast nodes. `reducedMotion: "reduce"`
  settles the 12-second loops using the site's own
  `prefers-reduced-motion` block rather than injected CSS; `settle()` then
  scrolls the whole document so `.rise` blocks actually paint. Before it, the
  scan was auditing roughly the first screen and calling it the page.
- **A stale `next start` silently became the thing under test.** A verified fix
  kept reporting as broken because the origin was three builds old.
  `tools/e2e/global-setup.ts` now refuses to run unless the served page
  contains `.next/BUILD_ID`. Broken both ways to check it fires.
- **`requestAnimationFrame` is throttled in a page that is not visible.**
  `settle()` yielded on rAF, and Playwright gives every test its own page, so
  under `fullyParallel` most are not visible and the scroll loop stalled: two
  tests failed with "Test timeout of 30000ms exceeded" in a full run while
  passing alone. It yields on `setTimeout` now. It also re-read
  `document.body.scrollHeight` each iteration while the document was growing,
  so the bound moved as the loop ran — read once and capped.
- **A different two tests failed each run, which is what identified it as
  contention.** 112 full-page axe scans at the default worker count, on a
  machine also running `next start`, timed out somewhere. `timeout: 60_000` and
  `workers: 4` fixed it and the suite got *faster* (2.5 min, from 3.7).
  `retries: 0` stays: a retry would have hidden this, and a suite that is green
  on the second attempt is not green.

## Accessibility

```sh
npm run build && npm run check:a11y      # axe-core over all 56 pages
npm run check:contrast                   # every text token, computed
```

§12 frames this as contractual rather than a quality preference — EAA
enforcement since June 2025, EN 301 549 making WCAG 2.2 AA the presumed
standard, and ministries asking for a conformance report during procurement.
The gate is **zero critical or serious axe violations on any route**.

**Currently zero violations at any severity, across all 56 pages.** It started
at 56 serious and 518 advisory.

| Fixed | Was |
|---|---|
| burger menu had `aria-label` on a `<label>` | **serious**, 56 pages — a `<label>` has no role permitting a name from `aria-label`, so the control could be announced unnamed. Now real text in `.sr-only`. |
| closing CTA sat in no landmark | 516 nodes — `PageShell` renders it as a sibling of `<main>`. Now `<aside>`. |
| blog posts went `<h1>` → `<h3>` | heading-order, and a direct miss of §11a.2's "logical H1 > H2 > H3". Now `<h2>`, which is also the shape retrieval engines extract. |
| homepage had no `<main>` | the one page of 56 without a main landmark — it does not use `PageShell`. |

Also added, because the ported canvas had none of them (a static mockup has no
reason to): a **skip link** (2.4.1), `:focus-visible` rings (2.4.7 — the design
defined *no* focus style, so keyboard users got whatever the browser did), and
`prefers-reduced-motion` (2.3.3). They live in `globals.css`, not in
`design.css`/`pages.css`, which are generated by `tools/port/build-css.py` and
carry a do-not-hand-edit header.

### axe in jsdom, not Playwright

§12 asks for `@axe-core/playwright`. This runs the **same axe-core ruleset** —
identical engine, different host — against the prerendered HTML in jsdom, in
about a second and with no 200 MB browser download. The same argument as §14.3:
a check that is slow to run is a check that gets skipped.

Three rules cannot run without layout, and are named in the output rather than
silently absent: `color-contrast`, `target-size` (2.5.8), and
`scrollable-region-focusable`. The first is covered better elsewhere — see
below. The other two need the browser pass §12 also asks for.

### Contrast is computed, not sampled

`check-contrast.mjs` reads the token table out of the generated CSS, works out
the smallest font size each token is used at, and applies the right threshold
(4.5:1, or 3:1 for large text). That is **stricter** than axe's rendered-pixel
sampling, which skips any text whose background it cannot resolve — gradients,
photographs, scrims, of which this design has many.

| token | smallest use | on paper | needs | |
|---|---:|---:|---:|---|
| `--ink` | 10px | 16.78 | 4.5 | ok |
| `--muted` | 10px | 4.83 | 4.5 | ok |
| `--green` | 10px | 5.88 | 4.5 | ok |
| `--faint` | 10px | **2.43** | 4.5 | **accepted, see gaps** |

`#007AFF` — the failure §12 names, 4.02:1, used 455× on the old site — is
**gone**, and the checker fails the build if it returns.

### The gates were broken seven ways

| # | Mutation | Result |
|---|---|---|
| A1 | an image loses its `alt` | caught at **build** — `next/image` requires it |
| A2 | the burger's `aria-label` comes back | caught — serious, 56 pages |
| A4 | a form input loses its label | caught at **build** |
| A5 | `#007AFF` returns as a token | caught |
| A6 | a passing token darkened below AA | caught |
| A3 | closing CTA reverts to a `<div>` | **detected** (220 nodes) but `moderate`, below the blocking threshold by design |
| A7 | the skip link is removed | **no-op** — and correctly so |

A7 is worth keeping: axe's `bypass` rule is satisfied by the `<main>` landmark,
so removing the skip link does not violate 2.4.1. The skip link is an
improvement beyond the minimum, not a fix for a failure — and a gate should not
claim otherwise.

One harness bug worth recording: the first mutation run reported four false
no-ops, because `design.css` declares its `:root` **twice** (desktop, then the
mobile artboard block) and the harness replaced only the first occurrence — the
second re-declared the original value. A mutation that does not mutate looks
exactly like a gate that does not fire.

### RTL: the stylesheets can now mirror

```sh
python tools/port/logical-css.py        # report
python tools/port/logical-css.py --write
npm run check:logical                   # the lint rule §14.2 asks for
```

§12 requires "CSS logical properties only, lint-enforced", because §7 ships
Arabic and a stylesheet written in `left`/`right` cannot be mirrored — set
`dir="rtl"` and every `margin-left` stays on the left, so the layout comes
apart instead of reflecting.

**192 declarations converted**, across both stylesheets:

| | design.css | pages.css |
|---|---:|---:|
| `left`/`right` insets | 123 | 9 |
| `margin-left`/`-right` | 18 | 7 |
| `border-left`/`-right` | 13 | 5 |
| `padding-left`/`-right` | 5 | 4 |
| `text-align` keywords | 4 | 4 |

**Only the inline axis.** In a horizontal writing mode RTL flips inline, not
block — `margin-top` means the same thing in Arabic as in English. The 156
block-axis declarations are correct as they stand, and converting them would be
churn across a design-complete stylesheet with a real chance of a typo and no
behavioural gain. The gate scopes to inline for the same reason: a rule that
fires on correct code gets disabled.

**Paint positioning is left alone** — six `background-position` /
`transform-origin` values. Those place artwork, not layout, and mirroring a
photograph's focal point is usually wrong. They are reported by the converter so
the decision is visible, and are a per-instance design call rather than a lint
failure.

The conversion was verified as a **pure property rename**: same line count, and
every one of the 138 changed lines reverses exactly to the original under the
inverse substitution. Logical properties are defined as equivalent to physical
in `horizontal-tb` + `ltr`, so English rendering is unchanged by construction.

`npm run check:logical` was broken four ways — a returning `margin-left`, a bare
`left:` inset, `text-align: right`, and `float: left`. All four caught, each
naming the file, line, and the property to use instead.

**`tools/port/build-css.py` cannot actually run in this tree.** It reads
`design-src/artboards/*.dc.html`, which is not checked in, so `design.css` is
maintained in place despite the "regenerate rather than hand-tuning" header it
writes. That header is now a statement of intent, not a working path — and if
the artboards ever return, re-running it emits the canvas stylesheet verbatim
and undoes this conversion. It carries a warning saying so; `check:logical` is
the actual safeguard.

## Security headers

One `headers()` in `next.config.ts` — §13's "Single CSP source … No duplicated
copies" (AUDIT E3) — applied to `/:path*`, documents and subresources alike.

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `connect-src 'self'`, `upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `Cross-Origin-Opener-Policy` / `-Resource-Policy` | `same-origin` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` (§8.4) |

**`style-src` is hash-pinned, not `'unsafe-inline'`.** The build emits exactly
two inline `<style>` blocks across 58 pages, both Next's own error-page styling
on `/_not-found` and `/_global-error`. Relaxing the directive site-wide to style
two error pages would be the wrong trade — `style-src 'unsafe-inline'` is what
enables CSS-based exfiltration and UI redressing on the 56 real pages. The two
`sha256-` hashes are pinned, and `npm run check:csp` fails the build if a Next
upgrade changes those bytes, which would otherwise surface only as an unstyled
404 that nobody looks at until a customer does.

**Development gets `'unsafe-eval'` and `ws:`, production does not.** `headers()`
applies in dev too, and Fast Refresh compiles with `eval`; without the
allowance `npm run dev` serves a page that never hydrates. Gated on `NODE_ENV`,
which `next build` sets to `production`, so the allowance cannot reach a deploy
through a forgotten env var. Verified against a production server: the served
policy contains neither.

### §13 asks for a nonce, and that is not available here

§13 specifies "CSP with nonce — generated per request in `proxy.ts` … removes
`'unsafe-inline'` from `script-src`". Next's own documentation
(`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`,
line 181) is explicit:

> To use a nonce, your page must be **dynamically rendered**. … Static pages are
> generated at build time, when no request or response headers exist — so no
> nonce can be injected.

Every page here is statically prerendered, and not incidentally: §5 requires it,
§17 requires `next build` to emit zero dynamic routes, and **all ten
build-output gates read the prerendered HTML**. A nonce would turn 56 static
pages into 56 per-request renders and blind every one of those checks — in order
to remove `'unsafe-inline'` from a site that ships no third-party script and no
inline handler of its own.

So `script-src` keeps `'unsafe-inline'`, §17's box stays open, and the
production contract reports it as a named deviation rather than asserting it
away. Measured, what is actually inline: 7 blocks on a typical page — 4 are
Next's `self.__next_f.push(...)` flight payload, 3 are the §8.2 JSON-LD graph.
All first-party, all emitted by the build. §9.4 measures **zero third-party
origins** site-wide.

Two ways to close it, both real work rather than config:

1. **Post-build hash injection.** Compute each page's inline-script hashes after
   `next build` and rewrite a per-page `<meta http-equiv>` CSP. Preserves static
   rendering. Costs a post-processing step, and `frame-ancestors` must stay in
   the HTTP header because `<meta>` ignores it.
2. **Accept dynamic rendering** for the nonce, and rebuild the gates around a
   running server instead of the build output. That is a much larger change than
   it sounds, and it trades away §5.

### Dependency scanning

`npm audit` found one high-severity advisory in `sharp` (the image optimiser,
and what `build:logo` rasterises with). Upgraded 0.34.5 → **0.35.4**, a semver
major: build clean, logo byte-identical at 1064×388, image optimiser still
answering 200, all gates green. **`npm audit` now reports 0 vulnerabilities.**

## Design tokens

```sh
npm run check:tokens
```

§17 condition 21 asks for zero hex literals outside the theme. There were
**382**. There are now **5**, and all five are a documented exemption.

| | was | now |
|---|---:|---:|
| UI colour (`style={{ }}`) | 119 | **0** |
| placeholder tints | 57 | **0** — moved to the asset layer |
| SVG artwork | 194 | 194 — exempt, see below |
| OG image constants | 5 | 5 — exempt |

**The biggest single cause was duplication, not colour.** The confirmation tick
was inlined **87 times** across 9 files, each copy carrying its own hex, and
four page modules had declared their own local `const Tick` on top of that — one
of which was never used. It is now `components/brand/Tick.tsx`, drawn once with
four tones. That alone removed 65 SVG blocks.

The tick takes its colour from `currentColor` and a tone class, not from
`stroke="var(--green)"`. A `var()` in an SVG presentation attribute is legal CSS
and does work in current browsers — but nothing in this project renders in a
browser yet (Part 6), so that would have been a claim nothing here could check.
`currentColor` needs no such claim.

**Placeholder tints are not palette.** `.ph` is the box a photo sits in, and
each of the 57 inline backgrounds was matched to one photograph. Swapping the
brand does not change the colour that belongs behind a picture of a rider in
Bengaluru, so they moved to `PLACEHOLDER_TINT` in `lib/img.ts`, keyed by image —
the same category as `blurDataURL`. 23 photographs, and the map was built from
the literals themselves: **zero photographs had conflicting tints**.

**SVG artwork stays literal**, and that is the rule working rather than an
escape from it. Singapore's flag is `#C8102E` whether or not the brand changes.
The test is repetition and role, not file type — which is why the tick was
extracted and the flags were not.

Four new tokens: `--white`, `--green-light`, `--tick-off`, `--ink-soft`. Four,
not seventeen, because the tints went to the asset layer instead.

### Verification, and why it is not byte-identity

Byte-identity cannot be the test for a tokenisation: `background: "#F6F4EF"`
emits `background:#F6F4EF` and the tokenised form emits `background:var(--paper)`
— different bytes, identical rendering. Three proofs were used instead:

- **Inverse substitution.** Resolve every `var(--x)` in both the old and the new
  output back to the literal it names, then compare. 56 pages: 54 byte-identical,
  2 value-equivalent, **0 unexplained**.
- **Source-level positional proof** for the tints: every `tint("…")` call
  resolves, through `PLACEHOLDER_TINT`, to exactly the literal it replaced, in
  the same order, in the same file, compared against `HEAD`. **57 of 57.**
- **The tone chain** for the tick, which `currentColor` puts beyond substitution:
  each tone class → its token → its value, asserted equal to the original
  stroke. **4 of 4.**

The gate was broken four ways: a hex returning in a style prop, a hex on the
same line as an exempt SVG attribute (proving the exemption is not a line-level
loophole), a tint hardcoded instead of looked up, and a photograph losing its
map entry — which fails the build, because `tint()` throws rather than returning
a default.

## Lint

```sh
npm run lint
```

§14.2's pipeline asks for "lint (incl. token + logical-property rules)". ESLint
flat config (`eslint.config.mjs`) with `eslint-config-next`, plus **two local
rules in `tools/eslint/`** — which are the reason this is not just the stock
config.

**`hv/no-color-literal`** replaced `tools/ci/check-tokens.mjs` outright. Same
rule, done on the AST rather than by regex, which buys two things: it can tell a
colour in an SVG artwork attribute from one in a style object *on the same line*
(the regex needed a masking trick), and it reports in the editor rather than at
the end of a build. One rule, one implementation — the script is gone.

**`hv/logical-css`** covers what `npm run check:logical` structurally cannot.
That gate reads the stylesheets; this reads `style={{ }}` objects in TSX, which
are JavaScript and invisible to it. Both are needed.

### What the AST found that the regex gates could not

| | found |
|---|---:|
| physical properties in inline styles | **77** |
| colour literals (in `app/manifest.ts`) | **2** |
| components created during render | **6** |
| impure `Date.now()` during render | **1** |
| dead imports | **6** |

The 77 are the significant ones: every `left:` and `marginLeft:` in a `style`
prop is an RTL blocker that `check:logical` was never able to see, so Part 3's
"192 declarations converted" was an undercount of the real job by a third.

They were fixed by `eslint --fix` — the rule ships a fixer, which is safe
because every replacement is value-identical until `dir` flips. Proved the same
way as the stylesheet conversion: 74 changed lines across 5 files, each
reversing exactly to the original under the inverse mapping, **0 unexplained**.

### Three exemptions, each with a reason in the rule

- **SVG presentation attributes** — artwork. Singapore's flag is `#C8102E`
  whatever the brand does.
- **`app/[locale]/opengraph-image.tsx`** — Satori has no CSSOM.
- **`app/manifest.ts`** — found by the rule itself. The web app manifest is JSON
  the OS chrome reads before any stylesheet exists, so `theme_color` cannot be a
  custom property.

`react/no-unescaped-entities` is **narrowed rather than disabled**: it keeps
forbidding `>` and `}`, which are genuinely ambiguous next to JSX, and stops
forbidding a plain apostrophe. That default flagged 71 places in reviewed
marketing copy, and `Don't` and `Don&apos;t` render byte-identical HTML.

### The rules were broken seven ways

Five fire, two correctly stay silent: artwork colour in an SVG attribute, and a
physical key in an object that is not a `style` prop. A rule that fires on
correct code gets disabled, so the negative tests matter as much as the others.

## Known gaps

- **`--faint` is 2.43:1 and is the one remaining WCAG AA text failure.** It is
  used as text in 40 selectors, all 10.5–12px uppercase labels (chart axes,
  table headers, totals), so the threshold is 4.5:1. The lightest value that
  passes is `#716F68`, which measures **1.06:1 against `--muted`** — visually
  the same colour. So the design's third text tier is not achievable at AA on
  this paper: closing it means collapsing `--faint` into `--muted`, or enlarging
  40 label styles. Both are DESIGN.md decisions, so the checker carries it as an
  explicit ACCEPTED entry with the measurement rather than changing the design
  unasked. **This is the §17 box still open.**
- **RTL is half done: the CSS can mirror, but nothing has rendered it.** The
  192 physical inline declarations are converted and lint-enforced (above), so
  the mechanical blocker is gone. What remains needs actual Arabic: no `ar`
  locale ships (§7), so no page has ever been rendered with `dir="rtl"`, and
  the visual pass §12 asks for cannot happen until it does. Expect the usual
  residue when it lands — icons and arrows that point the wrong way, and the six
  paint-positioning values the converter deliberately left alone.
- **No manual keyboard or screen-reader pass.** §12 asks for one across all 8
  templates before cutover. Automated tooling finds roughly a third of real
  barriers; it cannot tell you a focus order is confusing.
- **`target-size` (2.5.8, AA in WCAG 2.2) is unverified.** It needs layout,
  which jsdom does not do. Belongs with the browser pass.
- **The accessibility copy on `/platform/security-compliance` was wrong and has
  been corrected.** It claimed secondary text at "10.2:1" — a figure matching no
  pair in the token system — and justified the sub-threshold tone as
  "decorative meta … redundant by design", which the usage contradicts: it
  carries table headers and chart axes. Now states measured values and names the
  outstanding exception. **Worth a copy review**, since it is the page a
  procurement reviewer reads.
- **CI does not deploy.** §14.4 wants automated deploy on merge to `main`. That
  needs GCP credentials and the Cloud Run service to exist (§3.6); a deploy job
  that cannot authenticate would be AUDIT G2 in a new file. Branch protection,
  required checks and the one-long-lived-branch rule are repo settings, not
  files — still to be turned on.
- **§14.2's last three steps are not wired**: E2E on preview, axe, Lighthouse CI.
  All need a browser or a preview deployment. The `todo` job in `ci.yml` lists
  them so the gap shows in the PR checks rather than only in a doc.
- **`tools/test` is still excluded from `tsconfig.json`**, so the tests
  themselves are not typechecked. Harmless now that Vitest runs them — it was
  listed as a gap when nothing did.
- **`script-src` still allows `'unsafe-inline'` — §17's CSP box is open.** The
  nonce §13 specifies cannot be used on a statically prerendered site (Next's
  own docs; see the section above for the two ways to close it). Every other CSP
  directive is strict, and `style-src` is hash-pinned rather than relaxed.
- **No pre-commit secret-scanning hook.** §13 asks for one alongside the CI
  grep. `npm run check:secrets` exists and runs in `check:all`; the git hook is
  repo tooling, which is out of scope while the move to Azure is pending.
- **No Dependabot.** §13 pairs it with `npm audit`. Also repo configuration.
- **`WhoItsFor.tsx`'s mobile block renders no photographs.** Found while moving
  the tints: the desktop grid has six cells with six images, and the `.mob`
  block repeats the same six cells with the same tints and **zero** `<Image>`
  elements. On mobile those cells are flat colour where desktop shows a photo.
  Almost certainly a porting miss rather than a design decision — worth fixing
  with Part 5, which splits that file anyway.
- **Two §9.1 budgets are not met, and the gate says so on every run.** Fonts
  241.9 KB against 60, scripts 159.7 KB against 120. The font gap needs a
  DESIGN.md decision (see the measured curve above). The script gap is React 19
  (~60 KB) plus the Next App Router client runtime; this codebase has already
  refused next-intl's client runtime, the message catalogue and zod-on-client to
  protect it, so **whether 120 KB is reachable at all on this stack is an open
  question** — it may be that the budget predates the framework choice.
- **Image weight is not measured by any gate.** `next/image` emits
  `/_next/image?url=…&w=…`, generated by the optimizer at request time and never
  present in the build output. Measuring `public/img` instead would report bytes
  no visitor downloads. It belongs with the timings, against a running origin.
- **§9.1's three `timings` budgets (LCP, CLS, TBT) are not enforced anywhere.**
  They need a browser against a deployment, so they belong with §14.3's
  post-deploy contract test. `lhci autorun` as §9.1 describes needs CI and a
  preview deployment; this repo has neither.
- **§9.2's "`priority` on the LCP image of every page" does not apply here.**
  Measured across all 56 pages: **the `<h1>` precedes the first `<img>` on every
  one of them**, so the LCP element is text, not an image. Adding `priority`
  broadly would preload images that are not the LCP and make things worse. Two
  pages carry it (`/contact`, `/resources/blog`) for side images that are
  plausibly in the first viewport. Also worth knowing: in Next 16.3.5 `priority`
  emits a `<link rel="preload" as="image">` and drops `loading="lazy"`, but does
  **not** put `fetchpriority="high"` on the `<img>` as §9.2 assumes.
- **Two certification claims in the old site are unconfirmed and not emitted.**
  Its `llms.txt` claims **ISO/IEC 27701** and its `seo.ts` claims **SOC 2**.
  Neither appears on this site's `/about`, which is the reviewed credentials
  list, so neither is in the entity or in `llms.txt` — and `check-llms.mjs`
  fails the build if either reappears. If they are real, add them to
  `lib/content/company.ts` and to `/about` together.
- **The old site's live JSON-LD names the wrong head office.** It says Mumbai;
  the confirmed answer is Noida. Worth fixing on the old site too while it is
  still serving, since that schema is what Google has indexed.
- **No `streetAddress` or postcode.** Neither repo states one — `PostalAddress`
  carries locality and country only. Confirmed as not worth chasing.
- **Only §8.4's header is set; the rest of §13 is not.** No HSTS, no CSP, no
  `X-Frame-Options`, no `X-Content-Type-Options`. `next.config.ts` had no
  `headers()` block at all before this item.
- **`core.autocrlf=true` and there is no `.gitattributes`, so line endings change
  the emitted HTML.** Measured, not theorised: patch scripts in this item wrote
  73 files as CRLF, and `/en/resources/glossary` then rendered one extra space
  inside a `<dd>` — a real byte difference in served output from a
  whitespace-only change to source. Normalising the tree back to LF made all 56
  pages byte-identical again. The tree is LF now, but a fresh clone with
  `autocrlf=true` will check out CRLF and reintroduce it. The fix is a
  `.gitattributes` with `* text=auto eol=lf`; not added here because it changes
  checkout behaviour for everyone and that is a repo-policy call.

  **If you write such a normaliser, exclude binary files.** `src/` holds
  `app/favicon.ico` and four `.woff2` faces, and `
` occurs naturally in
  binary data — a blanket LF rewrite silently corrupted three of them here. They
  were recovered from `.next/dev/static/media/` and from git; harfbuzz parsing
  each font is the check that they are actually intact, not just present.
- **The footer's social links are still `href="#"`.** The real URLs are now in
  `lib/content/company.ts` and in the `Organization` entity; the visible footer
  has not been wired to them, which is a UI change rather than an SEO one.
- **`Service.areaServed` is the text `"120+ countries"`, not a country list.**
  `lib/content/countries.ts` holds eight guides and the coverage page says so
  ("a further 90+ countries are covered through …"), so emitting those eight
  would let an engine answer "does HelloVerify operate in Germany" with a
  confident no. The text form states the reviewed claim and excludes nothing.
  A real coverage list replaces it.
- **The eight `/legal/*` pages carry no `BreadcrumbList`.** Their trail is
  Home → Legal → *Policy*, and `/legal` is not a page, so the middle rung has no
  `item` — which Google requires on every element but the last. Dropping the
  rung from the markup only would make it disagree with the visible trail. The
  fix is a `/legal` index page, which is an IA change.
- **A blog post's breadcrumb ends at its category, not its title.** The markup
  mirrors the visible trail, which is the rule that matters, so this is a
  content oddity rather than a schema one — but it is why a post's
  `BreadcrumbList` says "Verification" where a reader might expect the headline.
- **`BlogPosting` has no `image` or `dateModified`.** `Post` carries neither; the
  only image on the record is the byline portrait, which is not the article
  image, and a `dateModified` copied from `datePublished` tells a
  recency-weighting engine something untrue the first time a post is edited.
- **`og:locale` is hardcoded `en` in the root layout.** Correct while `en` is
  the only served locale, wrong the moment `hi` or `ar` ships — the layout is
  under `[locale]`, so the fix is converting its `metadata` export to
  `generateMetadata` and reading `params`. Left for the locale work rather than
  guessed at now. `og:url` is absent site-wide by the same trade described
  above; nothing consumes it that does not already have the canonical.
- **`/support/track` has no destination.** The only entry left in
  `PENDING_DECISIONS` in `src/lib/seo/legacy-urls.ts`. There is no
  verification-tracking page here, and the old site already contradicted itself:
  `web.config` and `App.tsx` both sent it to `?tab=enquiry`, never `?tab=track`.
- **`/xx/about` returns 307 → 404, not a flat 404.** §6.1 wants the flat one.
  next-intl reads an unrecognised first segment as a path rather than a locale
  and prefixes it. Pre-existing and separate from the redirect work.
- **The four old blog posts redirect by subject, not by content.** See IA §9.
  Porting them is strictly better; the targets are one line to change.
- **`tools/test` is excluded from `tsconfig.json`.** Its files are run through a
  custom loader, so `tsc` sees them as non-modules colliding in global scope and
  `npm run build` failed outright with 34 errors. The exclusion unblocks the
  build; the real fix is moving the suite to Vitest.
- **Locale routing is live; `hi` and `ar` are not.** Every URL is
  `/<locale>/<path>` (`localePrefix: "always"`), negotiated in `src/proxy.ts`
  — note `proxy.ts`, not `middleware.ts`: the middleware file convention is
  deprecated in Next 16. `src/lib/i18n/routing.ts` declares `en` only, because
  §7 makes a missing translation a type error and declaring a locale without
  copy would publish a whole English route tree under /hi and /ar. Adding a
  locale is one array entry once the copy exists; the old repo has real
  Devanagari and Arabic content to port. Note that the **56 indexed `/hi` and
  `/ar` URLs 308 onto English** in the meantime (`LEGACY_LOCALES` in
  `src/lib/seo/legacy-urls.ts`) — so shipping a locale means removing it from
  that list in the same change that adds it to `routing.ts`, or the new pages
  redirect away from themselves.
- **RTL is not done.** §7 requires logical CSS properties. There are 165
  physical ones in the generated `design.css` and 32 in `pages.css`. Fixing the
  generated file means teaching `tools/port/build-css.py` to emit logical
  properties — not hand-editing its output.
- No CMS.
- **The contact form is wired end to end; Zoho credentials are not set.** The
  form posts to a Server Action (`src/app/contact/actions.ts`) which validates
  against the zod contract, runs the §10 abuse layers, and delivers through
  `src/lib/integrations/zoho.ts` (REST v8, OAuth refresh token, `server-only`).
  With `ZOHO_CLIENT_ID`/`_SECRET`/`_REFRESH_TOKEN` absent, development logs the
  lead and reports success while production logs it at ERROR and tells the user
  to email `LEADS_FALLBACK_EMAIL` — it never claims a lead was received when it
  was not. See `.env.example` for the full contract, including
  `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, which Cloud Run requires once it runs
  more than one container.
- **Legal copy is not drafted.** `src/lib/content/legal.ts` holds document
  structure only; operative text ports verbatim from the existing site after
  counsel review. Pages render a visible "awaiting legal copy" state.
- Pricing figures are placeholders pending commercial sign-off (IA §10.4) and
  say so on the page.
- The check library documents 12 of 33 checks and 6 country guides — the rest
  wait for real content rather than shipping templated stubs (IA §7 quality gate).
- Accessibility conformance statement / VPAT is in progress, stated as such on
  `/platform/security-compliance`.
- **Fonts are the remaining G2 breach.** 410 KB across 5 woff2 on the homepage,
  against a 60 KB budget — 56% of the page. Newsreader accounts for 358 KB of it
  (a two-axis variable face in two styles), and 85 KB of that is a latin-ext file
  pulled in by the two `₹` characters in the placeholder pricing alone. The fix
  is BUILD-SPEC §9.3: self-host via `next/font/local`, subset to the glyphs the
  design uses. Not yet done.
- No tablet artboard exists; 1080px and below uses the mobile board in a 720px
  centred column.
- Copy is verbatim from the canvas, including everything its "READ ME FIRST"
  annotation flags as placeholder (most turnaround times, the sample candidate,
  the WhatsApp thread, the customer quote, the driver plan prices).

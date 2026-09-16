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

## Pages

36 static routes covering the audience-first IA (`../INFORMATION-ARCHITECTURE.md`):
home · business (hub + 5) · governments (hub + 4 + MOM case study) · individuals
(hub + 3) · platform (hub + 3) · resources (hub + library + guides + glossary +
blog) · about · contact · 6 legal documents.

Templates live in `src/components/templates/` and the shared chrome in
`src/components/chrome/`. Page-level CSS is `src/app/pages.css` — same token
vocabulary as the canvas, single responsive tree, breakpoint 1080px.

The programmatic layer (IA §7) is three route files over typed data in
`src/lib/content/`: `/checks/[check]`, `/countries/[country]`,
`/resources/blog/[slug]`, all statically generated.

```sh
python tools/port/lint-collisions.py   # new markup must not reuse bare canvas classes
```

## Known gaps

- **Design phase only.** No routing beyond static pages, no i18n, no CMS.
- The contact form has real fields but no action — it needs the server-only Zoho
  bridge (BUILD-SPEC §4).
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

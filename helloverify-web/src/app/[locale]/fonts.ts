/** The site's faces, imported by the root layout. `next/font` needs each
 *  `localFont` call at module scope with literal options, so they cannot be
 *  built by a helper. */
import localFont from "next/font/local";

/** SELF-HOSTED AND SUBSET, not `next/font/google` (BUILD-SPEC §9.3).
 *
 *  §9.3 asks for "`next/font/local` with self-hosted variable WOFF2, subset to
 *  the glyphs actually used per script". The files come from
 *  `npm run build:fonts` (`tools/perf/subset-fonts.mjs`), which takes a census
 *  of every character the 56 prerendered pages emit and cuts the faces down to
 *  it.
 *
 *  Measured, homepage font transfer: **324.1 KB -> 241.9 KB**, a 25% cut, with
 *  no change to the type itself. The §9.1 budget is 60 KB and this does NOT
 *  reach it — see the note in `tools/perf/check-budgets.mjs` for the full
 *  measured curve and why closing the rest needs a design decision rather than
 *  a build step.
 *
 *  FOUR NOTO FACES sit under the Latin trio for `hi` / `ar` only. They are
 *  not in this className on `en`, they are not preloaded, and
 *  `scriptStackOf` is the switch — see the block below the Latin trio.
 *
 *  `opsz` SURVIVES; `wght` IS PINNED AT 400 (24 Sep 2026). A census found the
 *  serif drawn at 400 for 15,249 characters and at 500/600 for 34, so
 *  `tools/perf/pin-serif-weight.mjs` instanced the weight axis out: the two
 *  faces went 202.7 KB -> 84.1 KB with every glyph kept. The `weight` below is
 *  therefore "400", not a range. `opsz` is kept because the canvas depends on
 *  it: the serif runs from 15px captions to a
 *  176px display number, so `font-optical-sizing: auto` is doing real work
 *  across that range. harfbuzz keeps the axes through a subset — only glyphs
 *  are removed — so this is byte-smaller, not visually different.
 *
 *  Self-hosting also removes the last third-party origin from the critical path
 *  (§9.4), though `next/font/google` had already inlined these at build time,
 *  so that part was already true.
 */
export const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  /** `weight` is what `next/font/local` writes into the `@font-face`: "400",
   *  because the weight axis is instanced out (see above). A request for 600
   *  is then drawn as synthesised bold — used once, deliberately, on the
   *  forged certificate name in `app/v2/fraud.css`. */
  src: [
    { path: "../../fonts/newsreader-roman.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/newsreader-italic.woff2", weight: "400", style: "italic" },
  ],
});

export const instrumentSans = localFont({
  variable: "--font-instrument",
  display: "swap",
  src: [{ path: "../../fonts/instrument-sans.woff2", weight: "400 700", style: "normal" }],
});

export const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [{ path: "../../fonts/geist-mono.woff2", weight: "400 500", style: "normal" }],
});

/** Script faces, Latin-only pages must not pay for them (TASKS.md Part 9b).
 *
 *  `preload: false` is load-bearing. `next/font` defaults to preloading every
 *  `localFont` in this module, which would put four Noto WOFF2s on `/en` —
 *  ~200 KB against a 127 KB English ceiling — for glyphs that page cannot
 *  paint. The CSS variables are applied only when `scriptStackOf(locale)`
 *  says so, and without a preload the browser fetches a face only if the
 *  computed `font-family` names it AND the page has matching glyphs.
 */
export const notoSansDeva = localFont({
  variable: "--font-noto-sans-deva",
  display: "swap",
  preload: false,
  src: [{ path: "../../fonts/noto-sans-devanagari.woff2", weight: "400", style: "normal" }],
});
export const notoSerifDeva = localFont({
  variable: "--font-noto-serif-deva",
  display: "swap",
  preload: false,
  src: [{ path: "../../fonts/noto-serif-devanagari.woff2", weight: "400", style: "normal" }],
});
export const notoSansArab = localFont({
  variable: "--font-noto-sans-arab",
  display: "swap",
  preload: false,
  src: [{ path: "../../fonts/noto-sans-arabic.woff2", weight: "400", style: "normal" }],
});
export const notoNaskh = localFont({
  variable: "--font-noto-naskh",
  display: "swap",
  preload: false,
  src: [{ path: "../../fonts/noto-naskh-arabic.woff2", weight: "400", style: "normal" }],
});

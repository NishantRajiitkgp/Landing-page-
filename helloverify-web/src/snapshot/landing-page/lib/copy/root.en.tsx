/** English copy for the `app/[locale]` root segment — the layout and the
 *  homepage. One leaf, and the file exists because of what that leaf is.
 *
 *  ONE LEAF FOR THREE ROOT FILES, WHICH IS THE FINDING. The brief for this
 *  slice expected 6 matched nodes across `page.tsx`, `layout.tsx` and a
 *  `not-found`. Measured on this tree: there is no `not-found` under
 *  `[locale]` at all (`app/_not-found` is Next's own, and the built
 *  `_not-found.html` renders `<html>` with no `lang`, so it does not pass
 *  through this layout — the layout's own header records that measurement);
 *  `page.tsx` has zero text nodes, because the homepage is fifteen `sections/**`
 *  components and a `<main>`; and `layout.tsx` has exactly one, the WCAG 2.4.1
 *  bypass link. The other five matched nodes are in `opengraph-image.tsx`,
 *  which is deliberately NOT migrated — see below.
 *
 *  `opengraph-image.tsx` IS OUT OF SCOPE, AND NOT AS A JUDGEMENT CALL.
 *  Next hashes that file's SOURCE BYTES into the image's query string:
 *  `next/dist/build/webpack/loaders/next-metadata-image-loader.js:60` computes
 *  `interpolateName(this, "[contenthash]", { context, content })` and line 64
 *  makes it `hashQuery`. Every page in the build carries the result —
 *  `.next/server/app/en/about.html` emits
 *  `og:image" content="https://www.helloverify.com/en/opengraph-image?cb6069355efdd234"`
 *  and the same string again as `twitter:image`. Editing that file by one
 *  character therefore moves two meta tags on all 62 pages, which is exactly
 *  what this migration is measured against. Its `alt` export is a
 *  module-scope constant besides, evaluated with no request and so out of
 *  reach of `copy()`. Both halves have to change together, on a day the HTML
 *  is allowed to move.
 *
 *  `.tsx` rather than `.ts`, with no JSX in it, so that the namespace can
 *  take a rich-text leaf later without moving files — the same reason
 *  `./index`'s recipe names `.tsx` unconditionally for step 1.
 *
 *  MEASURED: **4 matched nodes across the three root files, 1 leaf** — the
 *  one ratio in this slice that runs the other way, because all four matched
 *  nodes are in `opengraph-image.tsx` and the one leaf is in a file the
 *  matcher scores zero on: the bypass link's text sits on its own line
 *  between `>` and `<`, and the matcher is single-line. A 1-in-1 file it
 *  cannot see, and a file it can see that must not be touched
 *  (`tools/test/copy.test.ts` §7).
 */

export const en = {
  /** WCAG 2.4.1. The first focusable element on every page, and the string
   *  `messages/en.json`'s orphaned `common.skipToContent` key was supposed to
   *  hold — `./index`'s opening paragraph records that nothing ever read it
   *  and that the layout hardcoded a DIFFERENT string. This is that key,
   *  finally wired, with the layout's own wording rather than the JSON's, so
   *  the emitted HTML does not move. The JSON file is left alone: it is
   *  `lib/i18n/request.ts`'s, and retiring it is that module's decision. */
  skipToContent: "Skip to main content",
};

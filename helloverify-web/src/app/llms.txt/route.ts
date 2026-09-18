/** `/llms.txt` — navigation for AI crawlers (BUILD-SPEC §8.3, §11a.4).
 *
 *  A Route Handler rather than a file in `public/`, for the same reason
 *  `app/sitemap.ts` is not a static `sitemap.xml`: the content is generated
 *  from the route manifest, so it cannot drift from the pages that exist. A
 *  checked-in text file would be the hand-maintained `seo-routes.json` all over
 *  again (AUDIT A2).
 *
 *  It sits at `app/`, NOT under `app/[locale]/`, so the served path is
 *  `/llms.txt` with no locale prefix — the same placement `robots.ts`,
 *  `sitemap.ts` and `manifest.ts` already use. `robots.txt` governs access and
 *  `llms.txt` governs navigation (§11a.4); neither is a page, so neither is
 *  localised.
 *
 *  `force-static` IS LOAD-BEARING AND IS NOT THE DEFAULT. Next 16's own docs
 *  are explicit — `node_modules/next/dist/docs/01-app/01-getting-started/`
 *  `15-route-handlers.md:51`: "Route Handlers are not cached by default. You
 *  can, however, opt into caching for `GET` methods … use `export const dynamic
 *  = 'force-static'`." Without it this renders per request: 56 `canonicalOf`
 *  calls and a full manifest walk on every crawler hit, and a file that is no
 *  longer part of the build output for `check-llms.mjs` to verify. The same
 *  doc (`:148`) notes that the metadata conventions like `sitemap.ts` stay
 *  static by default — this is a plain Route Handler, so it does not inherit
 *  that.
 *
 *  Verified rather than assumed: the build output contains a prerendered body
 *  for this route, and `npm run check:llms` fails if it does not.
 */
import { renderLlmsTxt } from "@/lib/seo/llms";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(renderLlmsTxt(), {
    headers: {
      /** `text/plain`, not `text/markdown`: the file is Markdown-shaped by
       *  convention but every consumer fetches it as text, and a content type
       *  browsers download rather than display helps nobody debugging it. */
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

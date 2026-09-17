/** Locale negotiation at the edge (BUILD-SPEC §7).
 *
 *  Named `proxy.ts`, not `middleware.ts`: the middleware file convention is
 *  DEPRECATED in Next 16 and renamed to proxy. BUILD-SPEC §4 and §7 both still
 *  say `middleware.ts` and want correcting — the behaviour is identical, only
 *  the file and export names changed.
 *
 *  What this gives us that the old site could not have (AUDIT F1): the old
 *  build read the locale from a router param with no server-side negotiation,
 *  so `/` served English to everyone regardless of Accept-Language. Here the
 *  redirect is chosen per request.
 *
 *  `/` -> `/en` is a **307, not a 308** (§6.1). The response varies by
 *  Accept-Language, so marking it permanent would let a CDN or a browser cache
 *  one visitor's language negotiation and serve it to everybody.
 *
 *  Note the framework's own warning: proxy code may be deployed to the CDN
 *  separately from the render path, so nothing here may rely on shared modules
 *  or process globals. That is why the lead rate limiter lives in the Server
 *  Action rather than here.
 */
import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  /** Everything except API routes, Next's own assets, and any path that looks
   *  like a file. Without a matcher this runs on every static asset request —
   *  the docs are explicit that it would otherwise sit in front of CSS, JS and
   *  images. */
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

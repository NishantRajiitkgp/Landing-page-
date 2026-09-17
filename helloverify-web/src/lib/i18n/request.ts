/** Per-request i18n config, resolved on the server.
 *
 *  Messages are loaded here, in a Server Component context, so a translation
 *  catalogue never reaches the browser as part of the page bundle — which is
 *  the §9.1 script-budget argument applied to copy rather than to code.
 *
 *  The catalogues are deliberately thin right now. The site's copy is still
 *  literal text in TSX, ported verbatim from the design canvas, and extracting
 *  57 pages of it is a content project rather than a code change. Setting up
 *  the routing first is what unblocks items 3, 4 and 5 — they are all defined
 *  over the locale x route matrix and cannot be built against a URL surface
 *  that is about to change shape.
 */
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});

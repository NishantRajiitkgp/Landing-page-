/** Site-level constants for the generated SEO files.
 *
 *  Imports nothing, for the same reason `./legacy-urls` imports nothing: these
 *  values are read from `next.config.ts`-adjacent tooling and from the probe as
 *  well as from the app.
 */

/** The canonical origin. Every absolute URL on the site is built from this one
 *  value, so the canonical tag, the sitemap entry and the hreflang entry cannot
 *  disagree — §6.1 requires them byte-identical, and AUDIT A2 is what happens
 *  when they are generated in three places instead.
 *
 *  `www` is not optional: §6.1 makes the apex 308 here. No trailing slash —
 *  every path is joined onto this, and a double slash is a different URL.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://www.helloverify.com").replace(/\/$/, "");

export const SITE_NAME = "HelloVerify";

/** `"/en/about"` -> `"https://www.helloverify.com/en/about"`.
 *
 *  `"/"` is never a valid argument here: every page on this site carries a
 *  locale prefix, so the locale home is `/en`, not `/`. Passing `/` would
 *  produce a trailing-slash URL that 308s, which is exactly the kind of entry
 *  §6.1 forbids in a sitemap.
 */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) throw new Error(`absoluteUrl needs a rooted path, got ${path}`);
  if (path !== "/" && path.endsWith("/")) throw new Error(`no trailing slash in URLs (§6.1), got ${path}`);
  return `${SITE_URL}${path}`;
}

/** The homepage's reviewed title and description.
 *
 *  They live here rather than in either file that needs them because BOTH do:
 *  `app/[locale]/layout.tsx` carries them as the site-wide default (the value
 *  any page without its own would inherit), and `app/[locale]/page.tsx` now
 *  states them as its own so that it can carry a canonical. Two literals would
 *  be two copies of reviewed marketing copy, drifting from each other the first
 *  time one is edited.
 */
export const SITE_TITLE = "HelloVerify — Verified at the source, in minutes";

export const SITE_DESCRIPTION =
  "AI reads the documents. Our team confirms with the issuer — the university, the employer, the registry. You get an answer in as little as 15 minutes.";

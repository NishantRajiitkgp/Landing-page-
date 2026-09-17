/** Locale prefixing, as plain functions.
 *
 *  Separate from `@/components/chrome/AppLink` so a Client Component can use
 *  the same rule without importing `next-intl/server` — the same client/server
 *  split `lib/leads/constraints.ts` uses to keep zod off the client.
 */

/** Only a root-relative path is ours to localise. Protocol-relative ("//host")
 *  is somebody else's host, and is excluded deliberately, as are fragments
 *  ("#turnaround"), `mailto:` and absolute URLs. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/** "/about" + "en" -> "/en/about". The root is special-cased so "/" becomes
 *  "/en" rather than "/en/", which would then 308 to "/en" (BUILD-SPEC §6.1
 *  forbids the trailing slash and the pointless hop). */
export function localise(href: string, locale: string): string {
  if (!isInternalHref(href)) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

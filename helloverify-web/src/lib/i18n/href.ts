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
 *  forbids the trailing slash and the pointless hop) — and so does the root
 *  with a fragment or query: "/#consumer-services" -> "/en#consumer-services". */
export function localise(href: string, locale: string): string {
  if (!isInternalHref(href)) return href;
  if (href === "/" || href.startsWith("/#") || href.startsWith("/?")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

/** "/en/products/customer-kyc" -> "/products/customer-kyc"; "/hi" -> "/".
 *  A first segment that is not a served locale is left in place, so a path
 *  like "/ai" is not treated as a language. */
export function unlocalise(pathname: string, locales: readonly string[]): string {
  const path = pathname.split(/[?#]/, 1)[0] || "/";
  const parts = path.split("/");
  if (!locales.includes(parts[1] ?? "")) return path.startsWith("/") ? path : "/";
  const rest = parts.slice(2).join("/");
  return rest ? `/${rest}` : "/";
}

/** Same page, other locale. `extra` is `location.search + location.hash`
 *  ("?tab=applicant", "#form"), which `usePathname` does not carry. */
export function switchLocaleHref(
  pathname: string,
  locale: string,
  locales: readonly string[],
  extra = "",
): string {
  const bare = unlocalise(pathname, locales);
  const tail = extra.startsWith("?") || extra.startsWith("#") ? extra : "";
  return localise(bare === "/" ? `/${tail}` : `${bare}${tail}`, locale);
}

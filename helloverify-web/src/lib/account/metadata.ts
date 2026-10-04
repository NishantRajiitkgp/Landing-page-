/** noindex metadata for gated account pages. Not in `routes.ts` / the sitemap. */
import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/seo/site";

export function accountMetadata(
  locale: string,
  path: "/cart" | "/orders" | "/orders/candidate" | "/orders/smb-candidates" | "/profile-settings",
  title: string,
): Metadata {
  return {
    title: `${title} — HelloVerify`,
    robots: { index: false, follow: false },
    alternates: { canonical: absoluteUrl(`/${locale}${path}`) },
  };
}

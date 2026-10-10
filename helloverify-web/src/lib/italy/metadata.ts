/** noindex metadata for the Italy partner flow. Not in the sitemap. */
import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/seo/site";

import type { ItalyPartnerPath } from "./paths";

export function italyPartnerMetadata(locale: string, path: ItalyPartnerPath, title: string): Metadata {
  return {
    title: `${title} — HelloVerify`,
    robots: { index: false, follow: false },
    alternates: { canonical: absoluteUrl(`/${locale}${path}`) },
  };
}

/** noindex metadata for the MOM applicant flow. Not in `routes.ts` / the sitemap. */
import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/seo/site";

import type { MomFlowPath } from "./paths";

export function momFlowMetadata(locale: string, path: MomFlowPath, title: string): Metadata {
  return {
    title: `${title} — HelloVerify`,
    robots: { index: false, follow: false },
    alternates: { canonical: absoluteUrl(`/${locale}${path}`) },
  };
}

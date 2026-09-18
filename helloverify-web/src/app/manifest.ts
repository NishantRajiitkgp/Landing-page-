/** manifest.webmanifest (BUILD-SPEC §4 repo structure).
 *
 *  This is a marketing site, not an installable app, so the manifest is
 *  deliberately minimal: `display: "browser"` rather than `standalone`,
 *  because offering "Add to home screen" on a brochure site produces a
 *  chrome-less window with no way back and no offline story behind it.
 *
 *  What it is actually for is the metadata browsers read regardless of
 *  installability — the name shown when a page is pinned or shared to a
 *  launcher, and `theme_color`, which tints mobile browser UI.
 *
 *  Colours come from DESIGN.md §2.1 and nowhere else. `--paper` for both
 *  surfaces: the site is a light design on `#F6F4EF`, and tinting the address
 *  bar with `--ink` would frame every page in a dark band the design never
 *  has. `--red` is absent by rule — it exists only inside the logo.
 */
import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/lib/seo/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — verification at the source`,
    short_name: SITE_NAME,
    description:
      "Primary-source background verification, KYC and immigration screening across 120+ countries.",
    start_url: "/en",
    /** Not "/". The root 307s to a negotiated locale (§6.1), and a start_url
     *  that redirects is a launch that flickers. */
    scope: "/",
    display: "browser",
    background_color: "#F6F4EF",
    theme_color: "#F6F4EF",
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity"],
    /** KNOWN GAP: the 192px and 512px PNGs a real install prompt wants do not
     *  exist as design assets yet, and pointing at files that 404 is worse
     *  than pointing at one that resolves. `display: "browser"` means nothing
     *  currently depends on them. Add both, plus a maskable variant, when the
     *  brand assets land. */
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}

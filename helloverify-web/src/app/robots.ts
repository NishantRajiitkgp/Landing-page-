/** robots.txt (BUILD-SPEC §11a.1).
 *
 *  The policy decision is already made in the spec and it is "allow
 *  everything": this is a marketing site whose entire purpose is discovery,
 *  there is no proprietary content to protect, and declining a training
 *  crawler while competitors allow them removes HelloVerify from the corpus
 *  that shapes category answers.
 *
 *  The twelve agents below are listed EXPLICITLY even though `*` already
 *  allows them. That is deliberate and defensive: several of these are
 *  documented as moving toward default-deny unless named, and an explicit
 *  `Allow` costs nothing today and survives that change.
 *
 *  Note that training and search are separate agents at every vendor —
 *  `GPTBot` trains, `OAI-SearchBot` powers retrieval, `ChatGPT-User` is a
 *  user-triggered fetch. Allowing one does not allow the others, which is why
 *  each is named rather than assumed.
 *
 *  §11a.1's own footnote is worth keeping in view: AI crawlers handle
 *  redirects worse than Googlebot does, so item 3's redirect map is part of
 *  this file's effectiveness, not separate from it.
 */
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account pages are noindex (session, not marketing). They stay
        // disallowed so a crawler holding an old SPA URL does not fetch them.
        // /api/ is disallowed because a route handler is never a destination.
        //
        // Line comments, not a block: a robots wildcard contains the sequence
        // that would close one early.
        disallow: ["/api/", "/*/cart", "/*/cartlist", "/*/orders", "/*/profile-settings"],
      },
      // OpenAI — training, search, user-triggered fetch.
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"], allow: "/" },
      // Anthropic.
      { userAgent: ["ClaudeBot", "Claude-User", "Claude-SearchBot"], allow: "/" },
      // Perplexity.
      { userAgent: ["PerplexityBot", "Perplexity-User"], allow: "/" },
      // Google's AI-specific agents, and Apple's.
      { userAgent: ["Google-Extended", "GoogleOther", "Applebot-Extended"], allow: "/" },
      // Microsoft.
      { userAgent: ["BingBot"], allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    /** Declares the canonical host, which is the other half of §6.1's
     *  apex-to-www rule. Non-standard and ignored by Google; Yandex and a few
     *  others honour it, and it is free. */
    host: SITE_URL,
  };
}

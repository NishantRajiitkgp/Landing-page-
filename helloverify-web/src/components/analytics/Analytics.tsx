import Script from "next/script";

import { AI_REFERRER_HOSTS } from "@/lib/analytics/ai-referrers";

/** GA4, wired and inert (BUILD-SPEC §11a.5, TASKS.md Part 10).
 *
 *  ## It renders nothing until someone sets an id
 *
 *  `NEXT_PUBLIC_GA_MEASUREMENT_ID` is read at build time. Unset, this returns
 *  `null`: no script, no request, no cookie, and §9.4's measured zero
 *  third-party origins stays zero. The CSP in `next.config.ts` also only grows
 *  the Google origins when that variable is set, so a strict policy is not
 *  weakened speculatively for a tag that is not there.
 *
 *  That is the point of shipping it this way: the code is reviewable, testable
 *  and mergeable now, and turning it on is one variable — plus two things that
 *  are not code.
 *
 *  ## Two blockers that are not an id
 *
 *  1. **The cookie policy is a stub.** Every section of `/legal/cookie-policy`
 *     reads "[ Section text pending legal review ]", including "Analytics and
 *     performance". Setting an analytics cookie while the policy says nothing
 *     about it is not defensible, and the `Organization` node's `areaServed`
 *     includes the UK.
 *  2. **There is no consent UI**, so Consent Mode is initialised with
 *     `analytics_storage: "denied"` — the only correct default without one.
 *     GA4 then sends cookieless pings and stores nothing until something calls
 *     `gtag('consent','update',…)`. Nothing does yet; a banner is a design
 *     decision. Consequence worth knowing before the id goes in: with consent
 *     denied the reports are modelled rather than counted, so Part 10's
 *     AI-referral numbers will be directional until a banner exists.
 *
 *  ## The referrer is classified IN THE BROWSER, and that is not a preference
 *
 *  The obvious shape — read `headers()`, classify on the server, pass the
 *  result in — would call a dynamic API and turn all 58 prerendered pages into
 *  per-request renders. That is §5, §17 condition 23, and every build-output
 *  gate. So the host list is serialised into the snippet and matched against
 *  `document.referrer` in the browser instead. `document.referrer` survives our
 *  own `/` -> `/en` 307, because a redirect does not rewrite it.
 *
 *  The list is serialised FROM `lib/analytics/ai-referrers.ts` rather than
 *  restated here, so the browser and the server-side classifier cannot
 *  disagree about what counts as an AI referral.
 *
 *  ## `afterInteractive`
 *
 *  §9.1 budgets 120 KB of script and the homepage ships 163. Blocking first
 *  paint on a third-party request buys nothing: no measurement here needs to
 *  run before hydration.
 */

const ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/** `[["claude.ai","claude"],…]` — small enough to inline, and generated so the
 *  two copies of the list cannot drift. */
const HOSTS_JSON = JSON.stringify(AI_REFERRER_HOSTS.map(([host, source]) => [host, source]));

export function Analytics() {
  if (!ID) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {[
          "window.dataLayer=window.dataLayer||[];",
          "function gtag(){dataLayer.push(arguments)}",
          // Consent Mode v2 defaults - denied until a banner says otherwise.
          "gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied',",
          "'ad_user_data':'denied','ad_personalization':'denied'});",
          "gtag('js',new Date());",
          // Same matching rule as classifyReferrer(): exact host, or a
          // subdomain of it, so www.perplexity.ai matches and
          // notperplexity.ai does not.
          `var H=${HOSTS_JSON},s=null;try{`,
          "var h=new URL(document.referrer).hostname.toLowerCase();",
          "for(var i=0;i<H.length;i++){if(h===H[i][0]||h.endsWith('.'+H[i][0])){s=H[i][1];break}}",
          "}catch(e){}",
          `gtag('config','${ID}',s?{'ai_source':s}:{});`,
        ].join("")}
      </Script>
    </>
  );
}

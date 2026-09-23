import Script from "next/script";

import { AI_REFERRER_HOSTS } from "@/lib/analytics/ai-referrers";
import { consentRestoreSnippet } from "@/lib/analytics/consent";

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
 *  2. ~~There is no consent UI~~ **CLOSED.**
 *     `components/chrome/ConsentBanner.tsx` now renders a bar on all 60 pages
 *     that carry this layout, and drives the four signals below through
 *     `lib/analytics/consent.ts` — which both files import, so neither can
 *     rename a signal without the other. Consent Mode still initialises
 *     `denied`, because that is what "before the visitor has answered" means;
 *     `consentRestoreSnippet()` below re-applies a STORED grant immediately
 *     after the default, and a live click reaches `window.gtag` directly.
 *     Ordering is the only subtlety and it is handled in that module: the
 *     banner's boot script never pushes a stored decision, so `default`
 *     always precedes `update` whichever of the two scripts runs first.
 *
 *  3. **THIS TAG CANNOT RUN UNDER THE ENFORCED CSP TODAY**, which is a third
 *     blocker and was not known when the two above were written. Read from
 *     `node_modules/next/dist/client/script.js`: with `appDir` set,
 *     `strategy="afterInteractive"` returns `null` from render and creates
 *     the element in a `useEffect`. So neither `<Script>` below is in the
 *     prerendered HTML, `tools/ci/inject-csp.mjs` never sees `ga4-init` to
 *     hash it, and the per-page `<meta>` it writes is `script-src 'self'`
 *     plus hashes — no `https://www.googletagmanager.com`, whatever the
 *     header in `next.config.ts` allows, because the effective policy is the
 *     intersection of the two. Setting the measurement id therefore buys a
 *     refused inline script and a refused remote script.
 *
 *     Not fixed here, deliberately: the inline half is one line (a raw
 *     `<script dangerouslySetInnerHTML>`, which the consent bar already uses
 *     for exactly this reason), but the remote half needs `inject-csp.mjs` to
 *     carry the GA origin into the meta, and that file is the CSP gate's own
 *     implementation. Recorded so that turning GA on is not attempted without
 *     it.
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
          // Consent Mode v2 defaults - denied until the banner says otherwise.
          "gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied',",
          "'ad_user_data':'denied','ad_personalization':'denied'});",
          /** A decision made on an earlier visit, re-applied. Generated from
           *  `lib/analytics/consent.ts` rather than restated, so the key, the
           *  record version and the four signal names have exactly one
           *  definition — the same reason `HOSTS_JSON` is generated above.
           *  It emits an `update` only for a stored grant: `denied` is what
           *  the line above already said, and repeating it would cost bytes
           *  on 60 pages to change nothing. */
          consentRestoreSnippet(),
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

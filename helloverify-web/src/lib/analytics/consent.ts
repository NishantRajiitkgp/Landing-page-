/** The cookie-consent contract: one module, because three separate things have
 *  to agree about it byte for byte (BUILD-SPEC §11a.5, §13, §17 conditions 3,
 *  11, 12 and 19).
 *
 *  The three are `components/chrome/ConsentBanner.tsx` (the UI and the
 *  browser-side state machine), `components/analytics/Analytics.tsx` (the GA4
 *  init snippet, which has to restore a stored decision before the tag runs)
 *  and `tools/test/consent.test.ts`. Two of them ship as INLINE SCRIPT STRINGS,
 *  so nothing but a shared source of truth can stop them drifting — the same
 *  device `Analytics.tsx` already uses for `AI_REFERRER_HOSTS`, and for the
 *  same stated reason: "the browser and the server-side classifier cannot
 *  disagree about what counts as an AI referral".
 *
 *  ## Why the runtime is a generated string and not a Client Component
 *
 *  MEASURED, not preferred. `tools/perf/check-budgets.mjs` attributes script
 *  weight by summing the brotli size of every `/_next/static/**.js` a page
 *  references. On the build in `.next` at the time of writing, the worst page
 *  is `/en/contact` at **161.8 KB against a 163 KB ceiling — 1.2 KB spare** —
 *  and a Client Component in the ROOT LAYOUT lands on all 60 pages that render
 *  it, including that one.
 *
 *  An inline `<script>` is invisible to that metric: it is not a
 *  `/_next/static` reference. It costs document bytes instead, which the
 *  `total` budget counts — worst page `/en` at 449.9 KB against a 460 KB
 *  ceiling, 10.1 KB spare. So the same behaviour can be bought out of a pot
 *  with eight times the headroom, and the script budget does not move at all.
 *
 *  REJECTED: a `"use client"` banner with `useState`/`useEffect`. It is the
 *  obvious shape and it is the one that cannot be afforded: React state, an
 *  effect and an event handler compile to a new client chunk on every page,
 *  and 1.2 KB is not a budget to spend on a two-button bar. It would also
 *  paint AFTER hydration, which is the CLS problem below.
 *
 *  REJECTED: a cookie plus a Server Component that reads it. Reading cookies
 *  is a dynamic API; it would turn 60 prerendered pages into per-request
 *  renders and blind every build-output gate — §5, §17 condition 23, and the
 *  same argument `Analytics.tsx` already makes about `headers()`.
 *
 *  ## Why the decision lives in `localStorage` and not a cookie
 *
 *  A cookie is sent on every request. That makes it a cache key the CDN has to
 *  reason about (§3.6) and it is the first step towards reading it on the
 *  server, which is the dynamic-rendering trap above. `localStorage` is never
 *  sent, is readable synchronously before first paint, and survives a session.
 *
 *  It is also the narrower thing to have to justify in the policy: the cookie
 *  policy's `essential` section lists "Remembering cookie consent preferences"
 *  as strictly necessary, no consent required — which is exactly what this one
 *  key is, and nothing more.
 *
 *  KNOWN AND NOT FIXED: Safari's ITP can evict script-written `localStorage`
 *  after seven days without interaction, so a Safari visitor may be asked
 *  again. A cookie has the same seven-day cap under ITP when set from script,
 *  so the alternative buys nothing; a `Set-Cookie` from the server would, and
 *  that is the dynamic-rendering trade above.
 *
 *  ## The record is versioned
 *
 *  `{"v":1,"c":"granted","t":"<ISO>"}`. `v` exists so that adding a category
 *  later — the cookie policy's `categories` section is still unwritten — can
 *  invalidate every stored decision rather than silently reinterpreting a
 *  yes-to-analytics as a yes-to-something-else. An unrecognised `v` reads as
 *  "no decision", which re-asks. `t` is the evidence half: a consent record
 *  with no timestamp cannot answer "when did they agree".
 */

/** One key, one version. Namespaced because `localStorage` is shared with
 *  everything else this origin ever stores. */
export const CONSENT_KEY = "hv.consent";
export const CONSENT_VERSION = 1;

/** `<html data-hv-consent="ask|set">`. The attribute is set by a parser-blocking
 *  script BEFORE the banner element is parsed, which is the whole CLS
 *  argument: §17 condition 3 records CLS at 0.000 on every measured page, and
 *  an element that is shown or hidden after first paint moves content. Nothing
 *  here toggles after paint — the decision is already made when the browser
 *  first lays the bar out. */
export const CONSENT_ROOT_ATTR = "data-hv-consent";

/** The delegated-click hook. An ATTRIBUTE rather than an inline `onclick`,
 *  because `script-src` is hash-only in the effective policy
 *  (`tools/ci/inject-csp.mjs`) and an inline handler would need
 *  `'unsafe-hashes'` — §13, §17 condition 11. Delegation on `document` also
 *  means the one boot script can be the FIRST node in `<body>`, before the
 *  buttons it wires up exist. */
export const CONSENT_ACTION_ATTR = "data-hv-consent-act";

/** Doubles as the banner's fragment target, so `href="#cookie-settings"` from
 *  anywhere on the site both reveals the bar (via `hashchange`) and scrolls to
 *  it (via the browser's own fragment handling) with no JavaScript of its own.
 *  That is the hook the footer link the cookie policy promises will use. */
export const CONSENT_BANNER_ID = "cookie-settings";

export type ConsentChoice = "granted" | "denied";
export type ConsentAction = "accept" | "reject" | "open";

/** Consent Mode v2, and this list is COPIED FROM NOWHERE: it is the exact set
 *  `Analytics.tsx` initialises to "denied", in that order. A banner that drove
 *  a different set would leave a signal no UI can ever change. */
export const CONSENT_SIGNALS = [
  "analytics_storage",
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
] as const;

export type ConsentSignal = (typeof CONSENT_SIGNALS)[number];

/** All four move together, and that is a decision rather than a shortcut.
 *
 *  The cookie policy this banner links to declares two consent-requiring
 *  categories — "Analytics and performance" and "Marketing cookies", both
 *  "Consent Required: Yes" — and its `managing` section describes the banner
 *  as one that lets you "accept or reject non-essential cookies". Binary is
 *  what the published text promises, so binary is what ships.
 *
 *  REJECTED: per-category toggles. The policy's own `categories` section is
 *  still `body: null` (pending counsel), and the site ships exactly one tag —
 *  GA4 — so a second checkbox would control nothing that exists and could not
 *  be tested against anything. When a marketing tag actually lands, this
 *  function grows a category argument and `CONSENT_VERSION` goes to 2, which
 *  re-asks everyone rather than reinterpreting their answer. */
export function consentSignals(choice: ConsentChoice): Record<ConsentSignal, ConsentChoice> {
  return Object.fromEntries(CONSENT_SIGNALS.map((s) => [s, choice])) as Record<
    ConsentSignal,
    ConsentChoice
  >;
}

/** What gets written to `localStorage`. `at` is injected rather than read from
 *  the clock so the round trip is testable. */
export function consentRecord(choice: ConsentChoice, at: Date): string {
  return JSON.stringify({ v: CONSENT_VERSION, c: choice, t: at.toISOString() });
}

/** The state machine, in one direction: stored bytes -> decision, or null for
 *  "has not chosen".
 *
 *  EVERY failure mode returns null rather than throwing or guessing, and the
 *  list is not hypothetical — `localStorage` is shared, user-writable, and
 *  survives deploys. Absent, empty, not JSON, JSON that is not an object, a
 *  record from a future or past `CONSENT_VERSION`, and a `c` that is neither
 *  signal: all of them re-ask. The one direction that must never happen is a
 *  malformed record reading as "granted", so the check is an allowlist of two
 *  exact strings rather than a truthiness test.
 *
 *  The browser copy of this lives in `consentBootScript()` below and is
 *  generated from the same constants; `tools/test/consent.test.ts` runs both
 *  over the same inputs so that "they agree" is measured rather than claimed. */
export function readStoredConsent(raw: string | null | undefined): ConsentChoice | null {
  if (typeof raw !== "string") return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const record = parsed as { v?: unknown; c?: unknown };
  if (record.v !== CONSENT_VERSION) return null;
  return record.c === "granted" || record.c === "denied" ? record.c : null;
}

const json = (value: unknown) => JSON.stringify(value);

/** The banner's entire runtime, as a string, for a raw inline `<script>`.
 *
 *  ES5 on purpose — no arrow functions, no `const`, no optional chaining. This
 *  is the one script on the site that is NOT compiled by anything, so it is
 *  also the one that has to parse in whatever the visitor brought. A syntax
 *  error here would throw before the attribute is set, which fails CLOSED: the
 *  bar stays hidden and Consent Mode stays denied.
 *
 *  It runs as the first node in `<body>`, which is load-bearing three times
 *  over. A classic inline script blocks the parser, so `<html>` carries its
 *  attribute before the banner element below it exists — no flash, no shift.
 *  The stylesheet is already applied, because it is a render-blocking `<link>`
 *  in `<head>`. And the click handler is delegated to `document`, so wiring up
 *  buttons that have not been parsed yet is not a problem to solve.
 *
 *  REJECTED: `next/script` with `strategy="beforeInteractive"`. Measured in
 *  `node_modules/next/dist/client/script.js`: in the App Router it does not
 *  emit a `<script>` at all, it emits `(self.__next_s=…).push(…)` for Next's
 *  own runtime to execute later — which is after hydration, which is after
 *  paint. `afterInteractive` is worse still: the component returns `null` on
 *  the server and creates the element in a `useEffect`, so the script is never
 *  in the prerendered HTML, `tools/ci/inject-csp.mjs` never sees it, and the
 *  hash-only `script-src` refuses it. See the note at the top of
 *  `Analytics.tsx`. */
export function consentBootScript(): string {
  return [
    "(function(){",
    `var K=${json(CONSENT_KEY)},V=${CONSENT_VERSION},A=${json(CONSENT_ROOT_ATTR)};`,
    `var B=${json(CONSENT_BANNER_ID)},P=${json(CONSENT_ACTION_ATTR)};`,
    `var G=${json(consentSignals("granted"))},N=${json(consentSignals("denied"))};`,
    "var D=document,R=D.documentElement;",
    // Mirrors readStoredConsent(). Every throw is caught, including the one
    // `localStorage` itself makes when a browser is set to block site data.
    "function read(){try{var r=JSON.parse(localStorage.getItem(K));",
    "return r&&r.v===V&&(r.c==='granted'||r.c==='denied')?r.c:null}catch(e){return null}}",
    // The only route to gtag. Silent when GA is off, which is the state today:
    // Analytics renders nothing without NEXT_PUBLIC_GA_MEASUREMENT_ID.
    "function tell(c){if(typeof window.gtag==='function')",
    "window.gtag('consent','update',c==='granted'?G:N)}",
    "function ask(){R.setAttribute(A,'ask')}",
    "function decide(c){",
    "try{localStorage.setItem(K,JSON.stringify({v:V,c:c,t:new Date().toISOString()}))}catch(e){}",
    "R.setAttribute(A,'set');tell(c);",
    // The focused button is about to be hidden, and focus falling to <body>
    // loses a keyboard user their place (WCAG 2.4.3). The bar sits directly
    // above the content, so the content is where focus belongs next; it is
    // also already on screen, because the bar can only be operated from the
    // top of the page.
    "var m=D.getElementById('main-content')||D.querySelector('main');",
    "if(m){m.setAttribute('tabindex','-1');m.focus()}}",
    // Reopening moves focus INTO the bar, which also scrolls it into view -
    // the reopen control sits below the footer, so the scroll is the point.
    "function reopen(){ask();var b=D.getElementById(B);if(b)b.focus()}",
    "R.setAttribute(A,read()?'set':'ask');",
    // On a cold load with the fragment already in the URL there is nothing to
    // focus yet, so only the attribute is set and the browser's own fragment
    // scroll does the rest.
    "if(location.hash==='#'+B)ask();",
    "D.addEventListener('click',function(e){var t=e.target;",
    `var el=t&&t.closest?t.closest('[${CONSENT_ACTION_ATTR}]'):null;if(!el)return;`,
    "var a=el.getAttribute(P);",
    "if(a==='open'){e.preventDefault();reopen()}",
    "else if(a==='accept'||a==='reject'){decide(a==='accept'?'granted':'denied')}});",
    "addEventListener('hashchange',function(){if(location.hash==='#'+B)reopen()});",
    "})()",
  ].join("");
}

/** The half of the contract that belongs to the GA4 snippet.
 *
 *  Consent Mode's ordering rule is that `default` comes before any `update`,
 *  and the two scripts here run in an order nobody controls: the boot script
 *  at parse time, `ga4-init` after hydration. So the boot script NEVER pushes
 *  a stored decision — it only handles a live click, when `window.gtag` either
 *  exists or does not — and `ga4-init` reads the same key itself, immediately
 *  after its own `default`. Both orders then produce default-then-update, and
 *  neither needs a queue.
 *
 *  Only "granted" emits anything. "denied" is already the default, so pushing
 *  it would be a no-op with a cost in bytes on 60 pages. */
export function consentRestoreSnippet(): string {
  return [
    `try{var hvc=JSON.parse(localStorage.getItem(${json(CONSENT_KEY)}));`,
    `if(hvc&&hvc.v===${CONSENT_VERSION}&&hvc.c==='granted')`,
    `gtag('consent','update',${json(consentSignals("granted"))});`,
    "}catch(e){}",
  ].join("");
}

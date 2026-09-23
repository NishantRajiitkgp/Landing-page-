import {
  CONSENT_ACTION_ATTR,
  CONSENT_BANNER_ID,
  type ConsentAction,
  consentBootScript,
} from "@/lib/analytics/consent";
import { pick } from "@/lib/copy";
import { CHROME } from "@/lib/copy/chrome";
import { copy } from "@/lib/copy/request";
import { localise } from "@/lib/i18n/href";

/** The cookie consent bar (BUILD-SPEC §11a.5, §12, §13; §17 conditions 3, 11,
 *  12 and 19).
 *
 *  §17 condition 19 — "GA4 segments live for AI referral sources" — has been
 *  blocked on this, not on the measurement id. `Analytics.tsx` states the two
 *  blockers in its own header; this closes the second of them. Consent Mode is
 *  initialised `denied` there and STAYS denied until something calls
 *  `gtag('consent','update',…)`. This is that something, and it drives exactly
 *  the four signals that file names, via `lib/analytics/consent.ts` so the two
 *  cannot drift.
 *
 *  ## `components/chrome/`, not `components/analytics/`
 *
 *  `components/analytics/Analytics.tsx` renders nothing a visitor can see or
 *  operate — it is a tag. This is a bar with two buttons that a person reads
 *  and clicks, on every page, and it gates all non-essential storage rather
 *  than analytics specifically. It sits with `SiteNav` and `SiteFooter`. The
 *  coupling to the tag runs through `lib/analytics/consent.ts`, which is the
 *  only place the two share anything.
 *
 *  ## NOT a Client Component, and the number is the argument
 *
 *  This would have been the SECOND `"use client"` file in the codebase.
 *  Measured on the build in `.next`: worst-page script is 161.8 KB on
 *  `/en/contact` against `check:perf`'s 163 KB ceiling — 1.2 KB spare — and a
 *  client component mounted in the root layout lands on every one of the 60
 *  pages that render it. `tools/perf/check-budgets.mjs` counts only
 *  `/_next/static/**.js` references, so the cost of this component as written
 *  is exactly **0.0 KB of script**: the markup is server-rendered and its
 *  runtime is one inline `<script>`, which that gate cannot see and the
 *  hash-based CSP handles by construction.
 *
 *  What it does cost is document bytes, against the `total` budget — worst
 *  page `/en` at 449.9 KB of a 460 KB ceiling. Measured on the emitted
 *  homepage: the markup and the script add ~0.7 KB brotli, including the copy
 *  the RSC flight payload carries a second time.
 *
 *  ## IN FLOW AT THE TOP, not a fixed overlay
 *
 *  A `position: fixed` bottom sheet is the conventional shape and it was
 *  rejected on evidence. It covers whatever is under it: Playwright's click
 *  actionability check fails when another element is at the hit point, and
 *  `tools/e2e/contact-form.spec.ts` clicks a Submit button that sits low on a
 *  long form — Blink's `scrollIntoViewIfNeeded` does not scroll an element
 *  that is already inside the viewport, occluded or not. That is not merely a
 *  test problem: the same bar covers the same button for a real visitor.
 *
 *  In flow, nothing is covered, and CLS stays at the 0.000 §17 condition 3
 *  records — the bar is laid out at first paint or not at all, because the
 *  boot script has already written `data-hv-consent` on `<html>` by the time
 *  this element is parsed. It never appears or disappears after paint. The one
 *  shift it can cause is the bar being removed when a button is clicked, which
 *  falls inside the 500 ms `hadRecentInput` window every CLS implementation
 *  excludes.
 *
 *  ## Accept and reject are the same button
 *
 *  Same class, same size, same row, adjacent. Not a styling accident: the
 *  EDPB's guidance is that refusing must be no harder than accepting, and a
 *  filled "Accept" beside an outlined "Reject" is the pattern regulators name.
 *  `.btn-sm` is 40 px tall on desktop and 38 px on mobile, both over WCAG 2.2
 *  AA 2.5.8's 24 px — which `tools/e2e/a11y.spec.ts` measures in a real
 *  browser on every route at both breakpoints.
 *
 *  REJECTED: a third "Manage" button opening a category panel. The cookie
 *  policy's own `categories` section is still pending counsel and the site
 *  ships one tag, so the panel would offer a choice with nothing behind it.
 *  See `consentSignals()` for what has to change when that stops being true.
 */

/** Spread rather than typed, because the attribute name is a constant the boot
 *  script also reads — writing `data-hv-consent-act="accept"` here would be a
 *  second spelling of it, and a rename would silently unwire the button. */
const act = (action: ConsentAction) => ({ [CONSENT_ACTION_ATTR]: action });

/** Mount as the first child of `<body>`, after the skip link.
 *
 *  After, not before: the skip link is WCAG 2.4.1's bypass and the root
 *  layout's comment calls it "first focusable element on every page". Tab
 *  order is then skip link, consent bar, nav — which is the right order for a
 *  bar asking a question before the visit starts.
 *
 *  The `<script>` is INSIDE this fragment and above the `<section>` on
 *  purpose. HTML parsing is sequential and a classic inline script blocks the
 *  parser, so the attribute that decides whether the bar is displayed is set
 *  before the bar exists. Moving the script below the section, or into
 *  `<head>` via `next/script`, breaks that.
 *
 *  SYNCHRONOUS, AND THE COPY IS READ WITH `pick()` RATHER THAN `copy()`. The
 *  root layout already hands this component the locale, so awaiting
 *  `getLocale()` a second time would buy nothing and make the one component
 *  that must render before the parser reaches the bar into an async one. This
 *  is the single case `lib/copy/index.ts` names for the pure accessor. */
export function ConsentBanner({ locale }: { locale: string }) {
  const t = pick(CHROME, locale).consent;

  return (
    <>
      {/* Raw <script>, not `next/script`. Verified in
          `node_modules/next/dist/client/script.js`: with `appDir` set,
          `afterInteractive` returns null from render and creates the element
          in an effect, so it is absent from the prerendered HTML and
          `tools/ci/inject-csp.mjs` cannot hash it; `beforeInteractive` emits a
          `self.__next_s.push(…)` queue Next drains after hydration. Both are
          too late, and one of them is refused by the CSP. React emits
          `dangerouslySetInnerHTML` verbatim — confirmed in
          `react-dom/cjs/react-dom-server.node.development.js`, `pushScriptImpl`
          — so the bytes the hash is computed over are the bytes that run. */}
      <script dangerouslySetInnerHTML={{ __html: consentBootScript() }} />
      <section
        id={CONSENT_BANNER_ID}
        className="ckb"
        /** A named `<section>` is a `region` landmark, so its contents are
         *  inside one and axe's `region` rule stays satisfied on all 60
         *  routes. `role="dialog"` was rejected: it is not modal, it does not
         *  trap focus, and a dialog that does neither misdescribes itself to a
         *  screen reader. `tabIndex={-1}` makes it a focus target for the
         *  reopen path without putting it in the tab order. */
        tabIndex={-1}
        aria-labelledby={`${CONSENT_BANNER_ID}-t`}
      >
        <div className="ckb-in">
          <div className="ckb-c">
            {/* A <p>, not an <h2>. The bar renders above every page's <h1>,
                and a heading there is a heading in the document outline that
                belongs to no section of the document. The accessible name of
                the landmark is this visible line, which is also what WCAG
                2.5.3 asks for. */}
            <p className="ckb-s" id={`${CONSENT_BANNER_ID}-t`}>
              {t.title}
            </p>
            {/* Three children — the sentence, the `{" "}`, and the anchor —
                and they stay three. React's SSR writes a `<!-- -->` between
                the first two, so folding the link into the leaf (the function
                shape `lib/copy/index.ts` describes) would change the bytes on
                every page. See that leaf's note. */}
            <p className="ckb-t">
              {t.body}{" "}
              <a className="ckb-a" href={localise("/legal/cookie-policy", locale)}>
                {t.policy}
              </a>
            </p>
          </div>
          <div className="ckb-b">
            <button type="button" className="btn btn-sm btn-line" {...act("accept")}>
              {t.accept}
            </button>
            <button type="button" className="btn btn-sm btn-line" {...act("reject")}>
              {t.reject}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/** The re-open control. Mount at the END of `<body>`, after `{children}`.
 *
 *  It has to exist somewhere a visitor can find it, and the copy already
 *  promises where: the privacy policy says the manager is "opened by selecting
 *  Cookie Preferences in the website footer", and the cookie policy's
 *  `managing` section says "the cookie settings option in the website footer".
 *  `components/chrome/SiteFooter.tsx` is where that belongs and it is being
 *  edited concurrently by another agent, so this renders as its own strip
 *  immediately below the footer instead — same place on the page, one file to
 *  delete when the footer link lands.
 *
 *  Either way the wiring is already done: the boot script listens for
 *  `hashchange`, so `<a href="#cookie-settings">` anywhere on the site reopens
 *  the bar and scrolls to it with no JavaScript of its own. Whoever adds the
 *  footer link needs that href and nothing else.
 *
 *  Hidden until a decision exists — `[data-hv-consent="set"]` — so a first
 *  visit shows the bar and not a second control saying the same thing, and a
 *  visitor with JavaScript off sees neither.
 *
 *  ASYNC, UNLIKE `ConsentBanner` ABOVE, and for the one reason that matters:
 *  it takes no props. Adding a `locale` prop would mean editing
 *  `app/[locale]/layout.tsx`, and the copy layer exists partly so that a
 *  component migration never has to touch a call site — so it awaits
 *  `copy(CHROME)` like the rest of the chrome does. */
export async function ConsentSettings() {
  const t = (await copy(CHROME)).consent;

  return (
    <section className="ckr" aria-label={t.reopenRegion}>
      <div className="ckr-in">
        <button type="button" className="btn btn-sm btn-line" {...act("open")}>
          {t.reopen}
        </button>
      </div>
    </section>
  );
}

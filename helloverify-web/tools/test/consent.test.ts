import { readFileSync } from "node:fs";

import { JSDOM } from "jsdom";

import { check } from "./harness";

import {
  CONSENT_ACTION_ATTR,
  CONSENT_BANNER_ID,
  CONSENT_KEY,
  CONSENT_ROOT_ATTR,
  CONSENT_SIGNALS,
  CONSENT_VERSION,
  type ConsentChoice,
  consentBootScript,
  consentRecord,
  consentRestoreSnippet,
  consentSignals,
  readStoredConsent,
} from "../../src/lib/analytics/consent";

/** The cookie-consent state machine (BUILD-SPEC §11a.5, §12, §17 condition 19).
 *
 *  THE THING THAT ACTUALLY RUNS IS A STRING. `consentBootScript()` is ES5
 *  source handed to a raw inline `<script>`, because a Client Component costs
 *  script budget this build does not have (161.8 KB of a 163 KB ceiling — see
 *  the component header). Nothing type-checks it, ESLint does not read it, and
 *  `tsc` sees a string literal. So it is EXECUTED here, in jsdom, against the
 *  same markup the component renders, rather than inspected.
 *
 *  Two readers of the same bytes exist — `readStoredConsent()` in TypeScript
 *  and `read()` inside that string — and the last section below runs both over
 *  one table of malformed inputs and asserts they return the same answer. A
 *  divergence there is the failure mode that matters: a record the TypeScript
 *  half rejects and the browser half accepts is a visitor tracked without
 *  consent.
 *
 *  `runScripts: "outside-only"` rather than `"dangerously"`: it gives
 *  `window.eval` without executing anything the document itself contains, so
 *  the only script under test is the one being tested.
 */
console.log("cookie consent");

// ─────────────────────────────────────────────────────────── the fixture

/** The markup `ConsentBanner.tsx` renders, built from the SAME exported
 *  constants the component and the script use — so a renamed attribute breaks
 *  the component and this fixture together rather than leaving the test
 *  passing against markup nobody ships. */
function page(): string {
  return [
    "<!doctype html><html><body>",
    `<section id="${CONSENT_BANNER_ID}" tabindex="-1">`,
    `<button type="button" ${CONSENT_ACTION_ATTR}="accept">Accept</button>`,
    `<button type="button" ${CONSENT_ACTION_ATTR}="reject">Reject</button>`,
    "</section>",
    '<main id="main-content"><h1>page</h1></main>',
    `<button type="button" ${CONSENT_ACTION_ATTR}="open">Cookie preferences</button>`,
    "</body></html>",
  ].join("");
}

type Booted = {
  win: JSDOM["window"];
  doc: Document;
  /** Every `gtag()` call the script made, in order. */
  calls: unknown[][];
  attr: () => string | null;
  stored: () => string | null;
  click: (action: string) => void;
};

function boot(
  opts: { stored?: string | null; hash?: string; gtag?: boolean; blockStorage?: boolean } = {},
): Booted {
  const dom = new JSDOM(page(), {
    url: `https://www.helloverify.test/en${opts.hash ?? ""}`,
    runScripts: "outside-only",
  });
  const win = dom.window as unknown as Window & typeof globalThis;

  if (opts.stored !== undefined && opts.stored !== null) {
    win.localStorage.setItem(CONSENT_KEY, opts.stored);
  }
  if (opts.blockStorage) {
    Object.defineProperty(win, "localStorage", {
      configurable: true,
      get() {
        throw new Error("site data blocked");
      },
    });
  }

  const calls: unknown[][] = [];
  if (opts.gtag !== false) {
    (win as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...a: unknown[]) =>
      void calls.push(a);
  }

  (dom.window as unknown as { eval: (s: string) => unknown }).eval(consentBootScript());

  const doc = win.document;
  return {
    win: dom.window,
    doc,
    calls,
    attr: () => doc.documentElement.getAttribute(CONSENT_ROOT_ATTR),
    stored: () => (opts.blockStorage ? null : win.localStorage.getItem(CONSENT_KEY)),
    click: (action: string) => {
      const el = doc.querySelector(`[${CONSENT_ACTION_ATTR}="${action}"]`);
      if (!el) throw new Error(`no control for ${action}`);
      (el as HTMLElement).click();
    },
  };
}

const RECORD = (choice: ConsentChoice) => consentRecord(choice, new Date("2026-09-23T10:00:00Z"));

// ─────────────────────────────────────────── 1. the record, parsed in TS

console.log("1. readStoredConsent");

check("a granted record reads back", readStoredConsent(RECORD("granted")) === "granted");
check("a denied record reads back", readStoredConsent(RECORD("denied")) === "denied");

/** Nothing on this list may ever read as a consent. `localStorage` is shared,
 *  user-writable and survives deploys, so every one of these is a shape the
 *  parser will meet in the wild rather than an invented edge case. */
const NOT_A_DECISION: Array<[string, string | null | undefined]> = [
  ["absent", null],
  ["undefined", undefined],
  ["empty string", ""],
  ["not JSON at all", "granted"],
  ["truncated JSON", '{"v":1,"c":"gran'],
  ["JSON null", "null"],
  ["JSON true", "true"],
  ["a bare string", '"granted"'],
  ["an array", '["granted"]'],
  ["no version", '{"c":"granted"}'],
  ["a string version", '{"v":"1","c":"granted"}'],
  ["a future version", `{"v":${CONSENT_VERSION + 1},"c":"granted"}`],
  ["a past version", `{"v":${CONSENT_VERSION - 1},"c":"granted"}`],
  ["no choice", `{"v":${CONSENT_VERSION}}`],
  ["a truthy non-choice", `{"v":${CONSENT_VERSION},"c":"yes"}`],
  ["a boolean choice", `{"v":${CONSENT_VERSION},"c":true}`],
  ["uppercase", `{"v":${CONSENT_VERSION},"c":"GRANTED"}`],
];

for (const [label, raw] of NOT_A_DECISION) {
  check(`${label} is not a decision`, readStoredConsent(raw) === null, raw);
}

// ─────────────────────────────────────────── 2. the Consent Mode signals

console.log("2. consentSignals");

for (const choice of ["granted", "denied"] as const) {
  const signals = consentSignals(choice);
  check(
    `${choice} sets all four signals`,
    CONSENT_SIGNALS.every((s) => signals[s] === choice) &&
      Object.keys(signals).length === CONSENT_SIGNALS.length,
    JSON.stringify(signals),
  );
}

/** The names are the contract with `Analytics.tsx`'s `consent default` line.
 *  Asserted by name rather than by count so that renaming one cannot be
 *  covered by adding another. */
check(
  "the four signals are Consent Mode v2's, in the order Analytics.tsx uses",
  CONSENT_SIGNALS.join(",") ===
    "analytics_storage,ad_storage,ad_user_data,ad_personalization",
  CONSENT_SIGNALS.join(","),
);

// ───────────────────────────────────── 3. the boot script, run in a browser

console.log("3. consentBootScript");

check("a first visit is asked", boot().attr() === "ask");
check("a stored grant is not asked again", boot({ stored: RECORD("granted") }).attr() === "set");
check("a stored refusal is not asked again", boot({ stored: RECORD("denied") }).attr() === "set");
check("a corrupt record re-asks", boot({ stored: '{"v":1,"c":"gran' }).attr() === "ask");
check(
  "a record from another version re-asks",
  boot({ stored: `{"v":${CONSENT_VERSION + 1},"c":"granted"}` }).attr() === "ask",
);

/** A browser set to block site data throws on the `localStorage` GETTER, not
 *  on `getItem`. The script must still run to completion: if it throws, the
 *  attribute is never written, both elements stay hidden by CSS, and the
 *  visitor is silently given no way to consent. */
{
  const b = boot({ blockStorage: true });
  check("blocked site data still asks", b.attr() === "ask");
  b.click("accept");
  check("blocked site data still answers gtag", b.calls.length === 1);
  check("and the bar still closes", b.attr() === "set");
}

{
  const b = boot();
  b.click("accept");
  check("accept records the decision", readStoredConsent(b.stored()) === "granted");
  check("accept closes the bar", b.attr() === "set");
  check(
    "accept pushes consent update with all four granted",
    JSON.stringify(b.calls) ===
      JSON.stringify([["consent", "update", consentSignals("granted")]]),
    JSON.stringify(b.calls),
  );
  check(
    "accept moves focus to the content the bar sat above",
    b.doc.activeElement === b.doc.getElementById("main-content"),
    b.doc.activeElement?.tagName,
  );
}

{
  const b = boot();
  b.click("reject");
  check("reject records the decision", readStoredConsent(b.stored()) === "denied");
  check("reject closes the bar", b.attr() === "set");
  check(
    "reject pushes consent update with all four denied",
    JSON.stringify(b.calls) === JSON.stringify([["consent", "update", consentSignals("denied")]]),
    JSON.stringify(b.calls),
  );
}

/** Reject must cost exactly what accept costs: one click, on a control that is
 *  there on the same visit. Anything else is not a choice — see the component
 *  header on the EDPB's wording. */
check(
  "reject is one click, like accept",
  (() => {
    const a = boot();
    const r = boot();
    a.click("accept");
    r.click("reject");
    return a.attr() === "set" && r.attr() === "set";
  })(),
);

/** Changing your mind. Both routes reach the same state: the button below the
 *  footer, and the `#cookie-settings` fragment any link anywhere can use. */
{
  const b = boot({ stored: RECORD("denied") });
  b.click("open");
  check("the reopen control re-asks", b.attr() === "ask");
  check(
    "and moves focus into the bar so it is announced",
    b.doc.activeElement === b.doc.getElementById(CONSENT_BANNER_ID),
    b.doc.activeElement?.id,
  );
  b.click("accept");
  check("a reopened bar can change the answer", readStoredConsent(b.stored()) === "granted");
}

check(
  "arriving at #cookie-settings opens the bar even after a decision",
  boot({ stored: RECORD("granted"), hash: `#${CONSENT_BANNER_ID}` }).attr() === "ask",
);

check(
  "no decision is pushed to gtag at load - Consent Mode's default must come first",
  boot({ stored: RECORD("granted") }).calls.length === 0,
);

check(
  "a click outside any control does nothing",
  (() => {
    const b = boot();
    b.doc.querySelector("h1")?.dispatchEvent(
      new b.win.MouseEvent("click", { bubbles: true }),
    );
    return b.attr() === "ask" && b.calls.length === 0;
  })(),
);

// ──────────────────────────── 4. the GA4 restore snippet, run in a browser

console.log("4. consentRestoreSnippet");

function restore(stored: string | null): unknown[][] {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "https://www.helloverify.test/en",
    runScripts: "outside-only",
  });
  const win = dom.window as unknown as Window & { gtag?: (...a: unknown[]) => void };
  if (stored !== null) win.localStorage.setItem(CONSENT_KEY, stored);
  const calls: unknown[][] = [];
  win.gtag = (...a: unknown[]) => void calls.push(a);
  (dom.window as unknown as { eval: (s: string) => unknown }).eval(consentRestoreSnippet());
  return calls;
}

check(
  "a stored grant is re-applied on the next page load",
  JSON.stringify(restore(RECORD("granted"))) ===
    JSON.stringify([["consent", "update", consentSignals("granted")]]),
  JSON.stringify(restore(RECORD("granted"))),
);
check("a stored refusal pushes nothing - denied is already the default", restore(RECORD("denied")).length === 0);
check("no decision pushes nothing", restore(null).length === 0);
check("a corrupt record pushes nothing and does not throw", restore("{").length === 0);

// ─────────────────── 5. the two parsers, over one table, must not disagree

console.log("5. the TypeScript parser and the browser parser agree");

const ALL_INPUTS: Array<[string, string | null]> = [
  ["granted", RECORD("granted")],
  ["denied", RECORD("denied")],
  ...NOT_A_DECISION.filter(([, raw]) => raw !== undefined).map(
    ([label, raw]) => [label, raw as string | null] as [string, string | null],
  ),
];

for (const [label, raw] of ALL_INPUTS) {
  const inTs = readStoredConsent(raw);
  const inBrowser = boot({ stored: raw }).attr() === "set" ? "some" : null;
  check(
    `both parsers agree on: ${label}`,
    (inTs === null) === (inBrowser === null),
    `ts=${inTs} browser=${inBrowser}`,
  );
}

// ─────────────────────────────────────── 6. the component renders the pair

console.log("6. the component");

const source = readFileSync(
  new URL("../../src/components/chrome/ConsentBanner.tsx", import.meta.url),
  "utf8",
);

/** A choice needs both halves and a way back. The fixture above proves the
 *  script handles all three actions; this proves the shipped component
 *  actually renders a control for each of them. */
for (const action of ["accept", "reject", "open"] as const) {
  check(`ConsentBanner.tsx renders a "${action}" control`, source.includes(`act("${action}")`));
}
check(
  "ConsentBanner.tsx takes its attribute names from the shared contract",
  source.includes("@/lib/analytics/consent") && source.includes("CONSENT_ACTION_ATTR"),
);
/** Anchored to the start of a line, not `includes`, and that is not
 *  pedantry: the first version of this check read `source.includes('"use
 *  client"')` and failed on the component's own header, which quotes the
 *  directive while explaining why it is absent. A gate that fails on its
 *  documentation gets its documentation deleted — the same trap
 *  `tools/a11y/check-logical-css.mjs` records in its `decomment` note. */
check(
  "the banner is not a Client Component - the script budget has 1.2 KB spare",
  !/^["']use client["']/m.test(source),
);

import { defineConfig, devices } from "@playwright/test";

/** Playwright, as BUILD-SPEC §14.1's E2E and page-a11y rows ask for.
 *
 *  This is the first thing in the repo that renders a page. Everything before
 *  it reads build output or HTTP headers, which is why three axe rules have
 *  been reported as "not runnable without layout" on every run of
 *  `npm run check:a11y` — `color-contrast`, `target-size` and
 *  `scrollable-region-focusable` all need a real box model.
 *
 *  ## It runs against the BUILD, not against `next dev`
 *
 *  `next start` serves exactly the artefact the ten gates already measured, so
 *  a Playwright failure and a `check:*` failure are talking about the same
 *  bytes. `next dev` would not be: it serves unminified, unbundled modules
 *  through a different pipeline, and a performance number taken from it would
 *  be meaningless. The server is therefore NOT started with `npm run dev`, and
 *  `webServer` deliberately does not run a build first — a stale `.next` should
 *  fail loudly rather than be silently rebuilt under a test run.
 *
 *  ## Two projects, because the site ships two element trees
 *
 *  `.dsk` and `.mob` are not a responsive reflow of one tree; they are separate
 *  markup, swapped by CSS at 1080px, and both are in the HTML. A single
 *  viewport would leave half the site unrendered and unaudited. 1440 and 390
 *  are the artboard widths the port was measured against (see README).
 *
 *  ## Port 3100
 *
 *  The same port `npm run probe:redirects` and `npm run contract` use, so a
 *  server already started for those is reused rather than fought over.
 */

const PORT = 3100;
const BASE_URL = process.env.PW_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tools/e2e",
  // Stops the run if the origin is serving a different build than the one on
  // disk. See the file — this is not hypothetical.
  globalSetup: "./tools/e2e/global-setup.ts",
  // Vitest globs `tools/test/**/*.test.ts`; this globs `tools/e2e/**/*.spec.ts`.
  // The two suites cannot pick up each other's files.
  testMatch: "**/*.spec.ts",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL: BASE_URL,

    /** Animations off, and this is load-bearing rather than tidy.
     *
     *  The homepage runs 12-second keyframe loops, and axe computes contrast
     *  from whatever is painted at the instant it is asked. Two runs of the
     *  same scan disagreed before this was set — measured, and it is how the
     *  setting came to be here at all.
     *
     *  It uses the SITE'S OWN mechanism rather than injecting foreign CSS the
     *  way `tools/port/dommap.mjs` does: `globals.css` already answers
     *  `prefers-reduced-motion: reduce` with `animation-duration: 0.01ms;
     *  animation-iteration-count: 1`, so every element settles on its final
     *  keyframe and stays there. Deterministic, and it is a state a real user
     *  actually browses in rather than a test-only fiction.
     *
     *  WHAT THIS DOES NOT COVER, stated rather than implied: contrast that
     *  fails only part-way through an animation. axe scans a moment, not a
     *  timeline, and nothing here samples mid-loop.
     */
    reducedMotion: "reduce",

    trace: "retain-on-failure",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
  ],

  webServer: {
    command: `npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

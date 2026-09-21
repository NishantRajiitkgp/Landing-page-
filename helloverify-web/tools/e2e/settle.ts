import type { Page } from "@playwright/test";

/** Bring a page to the state an audit should measure, deterministically.
 *
 *  WHY THIS EXISTS, measured rather than assumed. Two identical axe runs over
 *  the homepage returned 68 and 69 contrast nodes. `reducedMotion: "reduce"`
 *  had already settled the keyframe loops, so the loops were not the cause.
 *  The cause is scroll reveal: the design's `.rise` blocks start hidden and are
 *  revealed when they come into view, so a section never scrolled past is never
 *  painted, and axe skips what is not painted. That made the scan both flaky
 *  AND too lenient — it audited roughly the first screen and called it the
 *  page.
 *
 *  ## Two things the first version of this got wrong
 *
 *  It yielded with `requestAnimationFrame`, and Chromium throttles rAF in a
 *  page that is not visible. Playwright gives every test its own page, so under
 *  `fullyParallel` most of them are not, and the loop stalled: two tests failed
 *  with "page.evaluate: Test timeout of 30000ms exceeded" in a full run while
 *  passing on their own. It now yields with `setTimeout`, which is a macrotask
 *  and is not tied to frame production.
 *
 *  It also re-read `document.body.scrollHeight` on every iteration, and the
 *  document GROWS as reveals fire — so the bound moved as the loop ran. The
 *  height is now read once and the step count is capped, which makes the worst
 *  case a fixed number of yields rather than a function of how much the page
 *  expands while being scrolled.
 */

/** Enough for the longest page here at 390px, and a hard stop either way.
 *  The homepage is the tallest and needs roughly 25 steps at that width. */
const MAX_STEPS = 60;

export async function settle(page: Page): Promise<void> {
  await page.evaluate(async (maxSteps) => {
    const yieldToTask = () => new Promise((r) => setTimeout(r, 0));

    // Read once: the document grows as reveals fire, and a moving target makes
    // the loop unbounded.
    const height = document.body.scrollHeight;
    const step = Math.max(1, window.innerHeight);
    const steps = Math.min(maxSteps, Math.ceil(height / step));

    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, i * step);
      // IntersectionObserver callbacks are delivered asynchronously, so the
      // loop has to yield for a reveal to actually fire.
      await yieldToTask();
    }

    // Anything added while scrolling still needs to be reached.
    window.scrollTo(0, document.body.scrollHeight);
    await yieldToTask();
    window.scrollTo(0, 0);
    await yieldToTask();
  }, MAX_STEPS);

  // Fonts change metrics, and `target-size` is measured in pixels.
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

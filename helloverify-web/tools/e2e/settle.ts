import type { Page } from "@playwright/test";

/** Bring a page to the state an audit should measure, deterministically.
 *
 *  WHY THIS EXISTS, measured rather than assumed. Two identical axe runs over
 *  the homepage returned 68 and 69 contrast nodes. `reducedMotion: "reduce"`
 *  had already settled the keyframe loops, so the loops were not the cause.
 *  The cause is scroll reveal: the design's `.rise` blocks start hidden and
 *  are revealed when they come into view, so a section that was never scrolled
 *  past is never painted, and axe skips what is not painted.
 *
 *  That made the scan both flaky AND too lenient - it was auditing roughly the
 *  first screen and calling it the page. Scrolling the whole document before
 *  the scan fixes both: every reveal has fired, so the count is stable and it
 *  covers the whole page.
 *
 *  Scrolls in viewport-sized steps rather than jumping to the bottom, because
 *  a single jump can skip an IntersectionObserver entirely - the element is
 *  never intersecting on any frame.
 */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    window.scrollTo(0, 0);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
  // Fonts change metrics, and `target-size` is measured in pixels.
  await page.evaluate(() => document.fonts.ready);
}

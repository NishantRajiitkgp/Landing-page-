import { expect, test } from "@playwright/test";

/** The port's central claim, rendered for the first time.
 *
 *  README: "Both breakpoints ship. The desktop and mobile boards have genuinely
 *  different element trees, not just different sizes, so both render and CSS
 *  swaps them via `.dsk` / `.mob` at 1080px." and "The two stylesheets are
 *  disjoint, `min-width: 1081px` and `max-width: 1080px`."
 *
 *  Every gate so far could see that both trees are in the HTML — that is a
 *  string search. None could see that exactly one of them is ON SCREEN, which
 *  needs a box model. If the media queries ever overlap, or a `.mob` block
 *  loses its class, the page shows the same section twice and nothing else in
 *  this repo says a word.
 *
 *  THE TWO-TREE PORT IS THE HOMEPAGE ONLY, which the first draft of this file
 *  got wrong and the run corrected: it asserted two trees on five pages and
 *  failed on four of them. Measured against the build — `class="dsk"` appears
 *  in 1 of the 58 emitted pages. The other 57 are `app/pages.css`, a single
 *  responsive tree, exactly as the README's Pages section says. So the pages
 *  are split here into the one and the rest, and the rest are asserted to have
 *  NO canvas breakpoint tree at all, which pins the boundary rather than
 *  ignoring it.
 */

const CANVAS_PAGE = "/en";
const TEMPLATE_PAGES = ["/en/business", "/en/individuals", "/en/platform", "/en/contact"];

test(`${CANVAS_PAGE}: both trees ship, exactly one is visible`, async ({ page }, testInfo) => {
  await page.goto(CANVAS_PAGE);

  expect(await page.locator(".dsk").count(), "the homepage has a .dsk tree").toBeGreaterThan(0);
  expect(await page.locator(".mob").count(), "the homepage has a .mob tree").toBeGreaterThan(0);

  const onDesktop = testInfo.project.name === "desktop";
  const shown = onDesktop ? ".dsk" : ".mob";
  const hidden = onDesktop ? ".mob" : ".dsk";

  await expect(page.locator(shown).first()).toBeVisible();

  // Every block of the hidden tree, not just the first: a single `.mob`
  // section that failed to hide would be a duplicated section on screen.
  const hiddenCount = await page.locator(hidden).count();
  expect(hiddenCount, `${hidden} blocks to check`).toBeGreaterThan(0);
  for (let i = 0; i < hiddenCount; i++) {
    await expect(page.locator(hidden).nth(i), `${hidden} block ${i}`).toBeHidden();
  }
});

for (const path of TEMPLATE_PAGES) {
  test(`${path}: one responsive tree, no canvas breakpoint blocks`, async ({ page }) => {
    await page.goto(path);
    // `tools/port/lint-collisions.py` forbids reusing bare canvas classes in
    // new markup at the source level. This is the same rule observed in the
    // rendered page, which also catches a class arriving through a shared
    // component rather than through the template's own JSX.
    expect(await page.locator(".dsk").count(), `${path} has no .dsk block`).toBe(0);
    expect(await page.locator(".mob").count(), `${path} has no .mob block`).toBe(0);
    await expect(page.locator("main, body").first()).toBeVisible();
  });
}

test("the 1080px boundary is exclusive, not overlapping", async ({ page }) => {
  await page.goto(CANVAS_PAGE);

  // 1080 is the last mobile pixel and 1081 the first desktop one, per the two
  // stylesheets. Checked either side of the seam, because an off-by-one there
  // shows both trees at once and is invisible to any string search.
  for (const [width, visible, gone] of [
    [1080, ".mob", ".dsk"],
    [1081, ".dsk", ".mob"],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator(visible).first(), `${width}px shows ${visible}`).toBeVisible();
    await expect(page.locator(gone).first(), `${width}px hides ${gone}`).toBeHidden();
  }
});

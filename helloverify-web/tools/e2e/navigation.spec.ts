import { expect, test } from "@playwright/test";

/** Navigation, as rendered and as operated (BUILD-SPEC §14.1's E2E row).
 *
 *  `npm run probe:redirects` already asserts 823 URL contracts over HTTP, and
 *  `check:sitemap` already proves the manifest and the emitted canonicals
 *  agree. Neither can see whether a link in the chrome actually goes anywhere
 *  when clicked, whether the App Router navigates without a document reload, or
 *  whether the menu opens for someone using a keyboard. That is what is here.
 */

const PAGES = ["/en", "/en/business", "/en/platform/technology", "/en/contact"];

/** Hrefs that are deliberately not routes. `#` is the design-phase
 *  placeholder — the language switcher and the three social icons — and
 *  `app.helloverify.com` is the product, which is not this site. */
const NOT_A_ROUTE = (href: string) =>
  href === "#" ||
  href.startsWith("http") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:") ||
  href.startsWith("#");

test.describe("navigation", () => {
  for (const path of PAGES) {
    test(`${path}: every internal link carries the locale`, async ({ page }) => {
      await page.goto(path);

      const hrefs = await page.locator("a[href]").evaluateAll((els) =>
        els.map((e) => e.getAttribute("href") ?? ""),
      );
      const internal = hrefs.filter((h) => !NOT_A_ROUTE(h));
      expect(internal.length, "the page has internal links").toBeGreaterThan(5);

      // `AppLink` exists so that no href is written without its locale. A raw
      // `href="/about"` would still resolve — `src/proxy.ts` would redirect it
      // — at the cost of a round trip on every click, which is exactly the
      // kind of thing that is invisible until someone measures navigation.
      const unprefixed = internal.filter((h) => h !== "/en" && !h.startsWith("/en/"));
      expect(unprefixed, `hrefs missing the /en prefix on ${path}`).toEqual([]);
    });
  }

  test("a nav click is a full document load, which is the documented trade", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "the .links nav is the desktop tree");

    await page.goto("/en");

    // A value on `window` survives a client-side transition and does not
    // survive a document load, which is how the two are told apart. No
    // HTTP-level probe can see the difference.
    await page.evaluate(() => {
      (window as unknown as { __nav?: number }).__nav = 1;
    });

    // Prove the instrument BEFORE trusting it. A `toBeUndefined()` assertion
    // passes just as happily when the sentinel was never set, so first show
    // that a genuine client-side transition would keep it: `pushState` changes
    // the URL without a document load, which is what `next/link` does.
    // Without this, the assertion below could not fail and would be theatre.
    await page.evaluate(() => history.pushState({}, "", "/en?instrument-check"));
    expect(
      await page.evaluate(() => (window as unknown as { __nav?: number }).__nav),
      "a client-side URL change keeps window state, so the sentinel works",
    ).toBe(1);
    await page.evaluate(() => history.replaceState({}, "", "/en"));

    await page.locator("nav[aria-label='Primary'] a", { hasText: "Business" }).click();
    await expect(page).toHaveURL(/\/en\/business$/);
    await expect(page.locator("h1")).toBeVisible();

    // THIS ASSERTS THE ABSENCE OF CLIENT-SIDE ROUTING, deliberately, and the
    // first version of this test asserted its presence and failed — which was
    // the test being wrong about the architecture, not a defect.
    //
    // `chrome/AppLink.tsx` emits a plain `<a>`, not `next/link`, and says why:
    // next-intl's `<Link>` is a Client Component that reads the locale from
    // `NextIntlClientProvider`, so using it anywhere forces that provider on at
    // the root and ships 15.7 KB brotli of client runtime to every visitor — on
    // a page already over the §9.1 script budget — to compute a prefix the
    // server already knows. There is not a single `next/link` in the codebase.
    //
    // So this is a guard on that decision rather than an endorsement of it. If
    // someone introduces `next/link`, navigation becomes a client transition,
    // this fails, and whoever changed it has to say what happened to the
    // script budget. That is the conversation this test exists to force.
    const survived = await page.evaluate(
      () => (window as unknown as { __nav?: number }).__nav,
    );
    expect(
      survived,
      "window state was discarded, so this was a document load — see AppLink.tsx",
    ).toBeUndefined();
  });

  test("the back button returns to the previous route", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "the .links nav is the desktop tree");

    await page.goto("/en");
    await page.locator("nav[aria-label='Primary'] a", { hasText: "Platform" }).click();
    await expect(page).toHaveURL(/\/en\/platform$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator(".dsk").first()).toBeVisible();
  });

  test("the mobile menu opens from the keyboard, not only the mouse", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "the burger is the mobile tree");

    await page.goto("/en");

    const menu = page.locator("nav[aria-label='Primary, mobile']");
    const toggle = page.locator("#nav-menu-toggle");
    await expect(menu).toBeHidden();

    // The disclosure is CSS-only: a `<label class="burger">` and a `.vh`
    // checkbox, with `:checked ~ .menu` doing the work. A `<label>` is NOT
    // focusable, so the keyboard path depends entirely on the checkbox still
    // being reachable — `.vh` clips it visually but leaves it in the tab
    // order, which is the reason that class is used here instead of
    // `display: none`. This test is that reasoning, checked.
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Space");

    await expect(menu).toBeVisible();
    await expect(menu.locator("a").first()).toBeVisible();

    await page.keyboard.press("Space");
    await expect(menu).toBeHidden();
  });

  test("the mobile menu's links go where they say", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "the burger is the mobile tree");

    await page.goto("/en");
    // The label, because that is the mouse path a visitor takes. `check()` on
    // the input itself times out: `.vh` clips it to a 1x1 box and Playwright
    // requires a checkbox to be visible and stable before checking it.
    await page.locator("label.burger").click();

    const menu = page.locator("nav[aria-label='Primary, mobile']");
    await menu.locator("a", { hasText: "Governments" }).click();
    await expect(page).toHaveURL(/\/en\/governments$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("the wordmark returns to the homepage and is named", async ({ page }) => {
    await page.goto("/en/contact");
    const home = page.locator("header a[aria-label='HelloVerify — home']");
    await expect(home).toHaveCount(1);
    await home.click();
    await expect(page).toHaveURL(/\/en$/);
  });
});

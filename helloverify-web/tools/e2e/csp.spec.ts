import { expect, test } from "@playwright/test";

/** The hash-based `script-src` that `tools/ci/inject-csp.mjs` writes.
 *
 *  A wrong hash does not throw and does not show: the script is silently
 *  refused, the page still paints because the HTML is already there, and only
 *  hydration is gone. So this is the one part of the CSP work that a build-time
 *  gate cannot finish — `check:csp` can prove the meta lists the right hashes
 *  for the bytes on disk, but only a browser can prove the browser agrees.
 *
 *  Three things are checked, and the second is the one that matters:
 *
 *  1. the policy is delivered, and is hash-based rather than `'unsafe-inline'`
 *  2. NO CSP violation is reported — i.e. every hash matches
 *  3. the page hydrated, which is what a refused flight payload would cost
 */

/** Chromium reports a blocked inline script here. Collected per test rather
 *  than globally so a violation is attributed to the page that caused it. */
function watchViolations(page: import("@playwright/test").Page): string[] {
  const seen: string[] = [];
  page.on("console", (m) => {
    const t = m.text();
    if (/Content Security Policy|Refused to execute|Refused to load/i.test(t)) seen.push(t);
  });
  return seen;
}

const PAGES = ["/en", "/en/contact", "/en/platform/technology", "/en/legal/privacy-policy"];

for (const path of PAGES) {
  test(`${path}: hash-based script-src, no violations, hydrated`, async ({ page }) => {
    const violations = watchViolations(page);
    await page.goto(path, { waitUntil: "load" });

    const meta = page.locator('meta[http-equiv="Content-Security-Policy"]');
    await expect(meta).toHaveCount(1);
    const policy = (await meta.getAttribute("content")) ?? "";

    expect(policy, "the meta governs script-src").toContain("script-src 'self'");
    expect(policy, "and does so by hash").toMatch(/'sha256-[A-Za-z0-9+/=]{44}'/);
    expect(policy, "with no inline latitude of its own").not.toContain("unsafe-inline");

    // Hydration is the observable consequence. `window.next` is set by the
    // App Router's client runtime, which only exists if the flight payload
    // executed — so this fails if any hash is wrong.
    await expect
      .poll(() => page.evaluate(() => typeof (window as unknown as { next?: unknown }).next), {
        timeout: 10_000,
      })
      .toBe("object");

    expect(violations, `CSP violations on ${path}`).toEqual([]);
  });
}

test("the injected policy actually refuses an unlisted inline script", async ({ page }) => {
  const violations = watchViolations(page);
  await page.goto("/en");

  // The guard for the guard. Everything above passes equally well if the meta
  // were being ignored — by the browser, or because the tag landed after the
  // scripts it is supposed to govern. Adding a script whose hash is NOT listed
  // must be refused; if it runs, the policy is decoration.
  await page.evaluate(() => {
    const s = document.createElement("script");
    s.textContent = "window.__injected = 1;";
    document.body.appendChild(s);
  });

  expect(
    await page.evaluate(() => (window as unknown as { __injected?: number }).__injected),
    "an unlisted inline script must not run",
  ).toBeUndefined();
  expect(violations.length, "and the refusal is reported").toBeGreaterThan(0);
});

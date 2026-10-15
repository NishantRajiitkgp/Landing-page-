import { expect, test } from "@playwright/test";

/** Part 3 — gated account routes on this host. */
test.describe("account routes", () => {
  test("logged-out /en/orders lands on home with the OTP modal", async ({ page }) => {
    await page.goto("/en/orders");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("dialog", { name: "Login" })).toBeVisible();
  });

  test("logged-in session can open cart, orders, and profile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Sign Up in the bar is the desktop control");

    // The homepage bar has no Sign Up (`SiteNav showSignUp={false}`); inner pages do.
    await page.goto("/en/individuals");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await page.getByLabel("Mobile Number").fill("9876543210");
    await page.getByRole("button", { name: "Login Via OTP" }).click();
    const boxes = page.locator(".lg-otp-in");
    await expect(boxes).toHaveCount(6);
    for (let i = 0; i < 6; i++) await boxes.nth(i).fill(String(i + 1));
    await page.getByRole("button", { name: "Verify OTP" }).click();
    await expect(page).toHaveURL(/\/en\/orders$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "My Orders" })).toBeVisible();

    await page.goto("/en/cart");
    await expect(page.getByRole("heading", { name: "My Cart" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /feels so light/i })).toBeVisible();

    await page.goto("/en/profile-settings");
    await expect(page.getByRole("heading", { name: "Profile Setting" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Update Profile" })).toBeVisible();
  });
});

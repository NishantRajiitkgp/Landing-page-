import { chromium } from "@playwright/test";

/** node tools/e2e/_ma-flow.mjs [en|ar] [desk|phone] — walks register → apply → sign out → sign in. */
const locale = process.argv[2] ?? "en";
const tag = process.argv[3] ?? "desk";
const base = `http://localhost:3000/${locale}/solutions/manpower-and-education-authorities/ministry-of-manpower`;
const shot = (page, name) => page.screenshot({ path: `tools/e2e/_maf-${locale}-${tag}-${name}.png` });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: tag === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !/Content Security Policy/.test(m.text()) && errors.push(m.text()));
const step = (label) => console.log("·", label, page.url().replace(base, "…"));

await page.goto(`${base}/register`, { waitUntil: "networkidle", timeout: 120000 });
await page.locator(".consent-banner button, [data-consent] button").first().click({ timeout: 2000 }).catch(() => {});

// Submit empty: every error shows, focus lands on the first.
await page.locator(".ma-submit").click();
await page.waitForTimeout(300);
console.log("errors on empty submit:", await page.locator(".ma-err").count(), "focus:", await page.evaluate(() => document.activeElement?.id));
await shot(page, "1-empty");

await page.fill("#ma-first", "Arjun");
await page.fill("#ma-last", "Rao");

// Duplicate email.
await page.fill("#ma-email", "already@used.com");
await page.locator("#ma-email").press("Enter");
await page.waitForTimeout(1200);
console.log("duplicate:", await page.locator(".ma-field .ma-err").first().innerText().catch(() => "none"));
await shot(page, "2-duplicate");

await page.fill("#ma-email", "arjun.rao@example.com");
await page.locator("#ma-email").press("Enter");
await page.locator(".ma-code").first().waitFor();
await shot(page, "3-email-code");
await page.locator(".ma-code .ma-otp-in").first().pressSequentially("123456", { delay: 40 });
await page.locator(".ma-ok").first().waitFor({ timeout: 8000 });
step("email verified");

await page.fill("#ma-phone", "91234567");
await page.locator("#ma-phone").press("Enter");
await page.locator(".ma-code .ma-otp-in").first().waitFor();
// Wrong code first.
await page.locator(".ma-code .ma-otp-in").first().pressSequentially("111111", { delay: 30 });
await page.waitForTimeout(1200);
console.log("wrong code:", await page.locator(".ma-code .ma-err").first().innerText().catch(() => "none"));
await shot(page, "4-wrong-code");
await page.locator(".ma-code .ma-otp-in").first().pressSequentially("123456", { delay: 30 });
await page.locator(".ma-ok").nth(1).waitFor({ timeout: 8000 });
step("phone verified");

await page.fill("#ma-password", "Arjun2026");
await page.locator("#ma-consent").check();
await shot(page, "5-ready");
await page.locator(".ma-submit").click();
await page.waitForURL(/\/apply$/, { timeout: 15000 });
await page.locator(".ma-apply").waitFor();
await page.waitForTimeout(600);
step("on apply");
await shot(page, "6-apply");

await page.locator(".ma-apply-head .btn-line").click();
await page.waitForURL(/\/sign-in$/, { timeout: 15000 });
step("signed out");

// The account just registered lives in the demo cookie; sign in with it.
await page.waitForTimeout(800);
await page.fill("#ma-si-email", "arjun.rao@example.com");
await page.fill("#ma-si-password", "wrong-pass1");
await page.locator(".ma-submit").click();
await page.waitForTimeout(1200);
console.log("wrong password:", await page.locator(".ma-alert").innerText().catch(() => "none"));
await shot(page, "7-wrong-pass");
await page.fill("#ma-si-password", "Arjun2026");
await page.locator(".ma-submit").click();
await page.locator(".ma-otp-in").waitFor({ timeout: 8000 });
await page.waitForTimeout(500);
await shot(page, "8-signin-code");
await page.locator(".ma-otp-in").pressSequentially("123456", { delay: 30 });
await page.waitForURL(/\/apply$/, { timeout: 15000 });
step("signed in again");

// Forgot password view.
await page.locator(".ma-apply-head .btn-line").click();
await page.waitForURL(/\/sign-in$/);
await page.waitForTimeout(800);
await page.locator(".ma-lrow .ma-link").click();
await page.waitForTimeout(400);
await shot(page, "9-forgot");

console.log("console errors:", errors.length ? errors : "none");
await browser.close();

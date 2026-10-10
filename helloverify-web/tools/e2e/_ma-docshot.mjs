import { chromium } from "@playwright/test";

/** node tools/e2e/_ma-docshot.mjs — the passport upload row on a phone, empty and done. */
const base = "http://localhost:3000/en/solutions/manpower-and-education-authorities/ministry-of-manpower";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.goto(`${base}/sign-in`, { waitUntil: "networkidle", timeout: 120000 });
await page.locator(".ma-demo-fill").click();
await page.locator(".ma-submit").click();
await page.locator(".ma-otp-in").pressSequentially("123456", { delay: 20 });
await page.waitForURL(/\/apply/);
await page.evaluate(() => Object.keys(localStorage).forEach((k) => k.startsWith("hv-mom-draft:") && localStorage.removeItem(k)));
await page.goto(`${base}/apply#about`, { waitUntil: "networkidle" });
const row = page.locator(".mf-doc-w").first();
await row.scrollIntoViewIfNeeded();
await row.screenshot({ path: "tools/e2e/_mad-empty.png" });
await page.locator(".mf-doc-w input[type=file]").first().setInputFiles({
  name: "passport-photo-page-priya-menon-2026.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4\n" + "x".repeat(2_400_000)),
});
await page.locator(".mf-doc.is-done").waitFor();
await row.screenshot({ path: "tools/e2e/_mad-done.png" });
await browser.close();

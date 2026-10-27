import { chromium } from "@playwright/test";

const browser = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await page.goto("http://localhost:3000/en/products/customer-kyc", { waitUntil: "load", timeout: 180000 });
  const sec = page.locator("section[aria-labelledby='kyc-why-h']");
  await sec.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(2500);
  await sec.screenshot({ path: `tools/e2e/_kyc-why-${w}.png` });
  await page.close();
}
await browser.close();

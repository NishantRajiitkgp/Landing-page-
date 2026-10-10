import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/en/technology", { waitUntil: "networkidle", timeout: 120000 });
for (let i = 0; i < 3; i++) {
  await page.locator(".tk-step").nth(i).evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - window.innerHeight * 0.6));
  await page.waitForTimeout(3800);
  console.log(i, await page.locator(".tk-pil").getAttribute("data-active"));
  await page.screenshot({ path: `tools/e2e/_tech-pil-real-${i}.png` });
}
await browser.close();

import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "networkidle", timeout: 120000 });
const el = page.locator(".tk-proof");
await el.scrollIntoViewIfNeeded();
const anims = () => page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), 0);
await anims();
for (const t of [600, 1500, 2200, 2650, 3000, 3600, 4100, 5200]) {
  await page.evaluate((t) => document.getAnimations().forEach((a) => { a.currentTime = t; }), t);
  await page.waitForTimeout(120);
  await el.screenshot({ path: `tools/e2e/_tech-f${t}.png` });
}
await browser.close();

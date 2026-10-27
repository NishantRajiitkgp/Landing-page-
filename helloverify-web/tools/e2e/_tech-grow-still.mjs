import { chromium } from "@playwright/test";

const browser = await chromium.launch();
for (const [tag, opts] of [
  ["reduced", { reducedMotion: "reduce" }],
  ["nojs", { javaScriptEnabled: false }],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...opts });
  await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
  const sec = page.locator(".tk-cmp");
  await sec.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(2500);
  console.log(tag, "section height", await sec.evaluate((el) => el.offsetHeight));
  await sec.screenshot({ path: `tools/e2e/_tech-grow-${tag}.png` });
  await page.close();
}
await browser.close();

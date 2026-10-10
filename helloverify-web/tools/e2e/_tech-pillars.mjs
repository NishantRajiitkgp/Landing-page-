import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "pil";
const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desk", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(800);
  const head = page.locator(".tk-pil .tk-head");
  await head.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -80));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-head.png` });
  const steps = page.locator(".tk-step");
  for (let i = 0; i < 3; i++) {
    await steps.nth(i).evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollBy(0, r.top + r.height / 2 - window.innerHeight / 2);
    });
    await page.waitForTimeout(i === 1 ? 4200 : 3900);
    const active = await page.locator(".tk-pil").getAttribute("data-active");
    console.log(name, "step", i, "active", active);
    await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-${i}.png` });
  }
  console.log(name, "errors", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

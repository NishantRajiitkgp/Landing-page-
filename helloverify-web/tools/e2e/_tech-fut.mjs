import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "fut";
const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desk", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
  const el = page.locator(".tk-fut").first();
  await el.evaluate((n) => window.scrollTo(0, n.getBoundingClientRect().top + window.scrollY - 60));
  await page.waitForTimeout(4200);
  await page.mouse.move(2, 2);
  await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}.png` });
  await el.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-full.png` });
  const row = page.locator(".tk-fut-r").nth(1);
  await row.hover();
  await page.waitForTimeout(1400);
  await el.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-hover.png` });
  const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, "overflow", ow, "errors", errors);
  await page.close();
}
await browser.close();

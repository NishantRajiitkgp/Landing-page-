import { chromium } from "@playwright/test";

const sel = process.argv[2] ?? ".tk-hero";
const tag = process.argv[3] ?? "hero";
const path = process.argv[4] ?? "/en/technology";
const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desk", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4500);
  const box = await el.boundingBox();
  if (box) await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.45);
  await page.waitForTimeout(900);
  await el.screenshot({ path: `tools/e2e/_tech-${tag}-${name}.png` });
  await page.close();
}
await browser.close();

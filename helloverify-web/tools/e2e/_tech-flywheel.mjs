import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const at = (process.argv[6] ?? "1.4,2.9,4.2,7,10.5,13.2,15.6,17.4").split(",").map(Number);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1500);
const box = page.locator(".tk-fw-box");
await page.locator(".tk-cmp").evaluate((el) => el.scrollIntoView({ block: "start" }));
await page.evaluate(() => window.scrollBy(0, 120));
const t0 = Date.now();
for (const s of at) {
  const wait = s * 1000 - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `tools/e2e/_tech-fw-${tag}-${width}-${String(Math.round(s * 10)).padStart(3, "0")}.png` });
}
console.log("box", await box.boundingBox(), "errors", errors);
await browser.close();

import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const at = (process.argv[6] ?? "1.2,2.6,3.4,4.6,5.8,7.2,8.5,9.6,10.8,12.2,13.6,15.9").split(",").map(Number);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.locator(".tk-gl[data-live]").waitFor({ timeout: 60000 });
const t0 = Date.now();
const board = page.locator(width > 1080 ? ".tk-hero" : ".tk-gl");
for (const s of at) {
  const wait = s * 1000 - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await board.screenshot({ path: `tools/e2e/_tech-hero-${tag}-${width}-${String(Math.round(s * 10)).padStart(3, "0")}.png` });
}
console.log("errors", errors);
await browser.close();

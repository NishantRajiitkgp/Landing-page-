import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const at = (process.argv[6] ?? "0.9,1.6,2.6,3.2,4.2,5.0,6.0,6.6,7.3,7.8,8.5,9.0,9.8").split(",").map(Number);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && !m.text().includes("Content Security Policy") && errors.push(m.text()));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1200);
const geo = await page.evaluate(() => {
  const r = document.querySelector(".tk-cx-run").getBoundingClientRect();
  return { top: r.top + scrollY, h: r.height, vh: innerHeight };
});
for (const t of at) {
  const y = geo.top - geo.vh * 0.35 + (t / 10) * (geo.h - geo.vh * 0.65);
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `tools/e2e/_tech-grow-${tag}-${width}-${String(Math.round(t * 10)).padStart(3, "0")}.png` });
}
console.log("geo", geo, "errors", errors);
await browser.close();

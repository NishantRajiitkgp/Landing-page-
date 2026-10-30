import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const stops = (process.argv[6] ?? "0,.08,.17,.25,.3,.36,.45,.55,.62,.68,.78,.9,1").split(",").map(Number);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(2500);
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

for (const p of stops) {
  await page.evaluate((p) => {
    const run = document.querySelector(".tk-sy-run");
    const r = run.getBoundingClientRect();
    const vh = window.innerHeight;
    const top = r.top + window.scrollY - vh * 0.5;
    const span = r.height - vh * 0.5;
    window.scrollTo(0, top + span * p);
  }, p);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `tools/e2e/_tech-story-${tag}-${width}-${String(Math.round(p * 100)).padStart(3, "0")}.png` });
}
console.log("errors", errors);
await browser.close();

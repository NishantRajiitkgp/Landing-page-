import { chromium } from "@playwright/test";

/** node tools/e2e/_gwt-shot.mjs <plate class> <tag> <ms,ms,...> */
const sel = `.gw-viz:has(${process.argv[2] ?? ".gwt-min"})`;
const tag = process.argv[3] ?? "gwt";
const frames = (process.argv[4] ?? "2400,3500,4600,6300").split(",").map(Number);

const browser = await chromium.launch();
for (const loc of ["en", "ar", "hi"]) {
  for (const [dev, viewport] of [
    ["desk", { width: 1440, height: 900 }],
    ["phone", { width: 390, height: 844 }],
  ]) {
    if (loc !== "en" && dev === "phone") continue;
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    await page.goto(`http://localhost:3000/${loc}`, { waitUntil: "networkidle", timeout: 180000 });
    await page.getByRole("button", { name: /^(Reject|رفض|अस्वीकार)/ }).first().click({ timeout: 3000 }).catch(() => {});
    const viz = page.locator(sel).first();
    await viz.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await viz.screenshot({ path: `tools/e2e/_${tag}-${loc}-${dev}.png` });
    await page.close();
  }
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/en", { waitUntil: "networkidle", timeout: 180000 });
await page.getByRole("button", { name: /^Reject/ }).first().click({ timeout: 3000 }).catch(() => {});
const viz = page.locator(sel).first();
await viz.scrollIntoViewIfNeeded();
await page.waitForSelector(".gw-go");
const t0 = Date.now();
for (const at of frames) {
  await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
  await viz.screenshot({ path: `tools/e2e/_${tag}-anim-${at}.png` });
}
await browser.close();

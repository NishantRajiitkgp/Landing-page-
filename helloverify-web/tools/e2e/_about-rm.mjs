import { chromium } from "@playwright/test";

const browser = await chromium.launch();

const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await rm.goto("http://localhost:3000/en/about", { waitUntil: "networkidle", timeout: 120000 });
await rm.getByRole("button", { name: /^Reject/ }).first().click({ timeout: 3000 }).catch(() => {});
await rm.evaluate(() => window.scrollTo(0, 0));
await rm.waitForTimeout(300);
await rm.screenshot({ path: "tools/e2e/_ab-rm-hero.png" });
for (const sel of [".ab-bel-in", ".ab-num"]) {
  await rm.evaluate((s) => window.scrollTo(0, window.scrollY + document.querySelector(s).getBoundingClientRect().top - 90), sel);
  await rm.waitForTimeout(400);
  await rm.screenshot({ path: `tools/e2e/_ab-rm-${sel.replace(/[^a-z]/g, "")}.png` });
}
const counts = await rm.evaluate(() => [...document.querySelectorAll(".ab-stat-v [aria-hidden]")].map((e) => e.textContent));
console.log("reduced-motion counts", counts);
await rm.close();

const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await pg.goto("http://localhost:3000/en/about", { waitUntil: "networkidle", timeout: 120000 });
await pg.getByRole("button", { name: /^Reject/ }).first().click({ timeout: 3000 }).catch(() => {});
await pg.evaluate(() => window.scrollTo(0, 0));
for (const t of [1000, 1900, 2700, 3600]) {
  await pg.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  await pg.evaluate((ms) => document.getAnimations().forEach((a) => (a.currentTime = ms)), t);
  await pg.screenshot({ path: `tools/e2e/_ab-hero-${t}.png`, clip: { x: 120, y: 330, width: 1200, height: 460 } });
}
await browser.close();

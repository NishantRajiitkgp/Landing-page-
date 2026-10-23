import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const logs = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && logs.push(m.text().slice(0, 200)));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(2000);
const box = await page.locator(".tk-sy-run").boundingBox();
console.log("runway height", box?.height);
await page.locator(".tk-sy-track").scrollIntoViewIfNeeded();
await page.screenshot({ path: "tools/e2e/_tech-story-still.png", fullPage: false });
await page.locator(".tk-sy-card").nth(1).scrollIntoViewIfNeeded();
await page.screenshot({ path: "tools/e2e/_tech-story-still-2.png", fullPage: false });
console.log("console", logs);
await browser.close();

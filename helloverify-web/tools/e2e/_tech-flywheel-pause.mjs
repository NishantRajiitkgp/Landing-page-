import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await page.locator(".tk-cmp").evaluate((el) => el.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1500);
const p = () => page.locator(".tk-cmp").evaluate((el) => el.style.getPropertyValue("--t"));
const btn = page.locator(".tk-fw-pause");
await btn.click();
const a = await p();
await page.waitForTimeout(1200);
console.log("paused label:", await btn.getAttribute("aria-label"), "| frozen:", a === (await p()));
await btn.click();
await page.waitForTimeout(600);
console.log("resumed label:", await btn.getAttribute("aria-label"), "| moving:", a !== (await p()));

const still = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await still.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await still.locator(".tk-cmp").evaluate((el) => el.scrollIntoView({ block: "start" }));
await still.waitForTimeout(1200);
console.log("reduced motion --t:", await still.locator(".tk-cmp").evaluate((el) => el.style.getPropertyValue("--t")), "| button shown:", await still.locator(".tk-fw-pause").isVisible());
await browser.close();

import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await page.locator(".tk-rc-box").evaluate((el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(3000);
const p = () => page.locator(".tk-cmp").evaluate((el) => el.style.getPropertyValue("--c"));
const btn = page.locator(".tk-rc-pause");
await btn.click();
const a = await p();
await page.waitForTimeout(1200);
console.log("paused label:", await btn.getAttribute("aria-label"), "| frozen:", a === (await p()), a);
await btn.click();
await page.waitForTimeout(600);
console.log("resumed label:", await btn.getAttribute("aria-label"), "| moving:", a !== (await p()));

const still = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await still.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await still.locator(".tk-rc-box").evaluate((el) => el.scrollIntoView({ block: "center" }));
await still.waitForTimeout(1500);
const cmp = still.locator(".tk-cmp");
console.log(
  "reduced motion --c:", await cmp.evaluate((el) => el.style.getPropertyValue("--c")),
  "| phase:", await cmp.getAttribute("data-phase"),
  "| button shown:", await still.locator(".tk-rc-pause").isVisible(),
);
await still.locator(".tk-rc-box").screenshot({ path: "tools/e2e/_tech-rc-still.png" });

const nojs = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
await nojs.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await nojs.locator(".tk-rc-box").screenshot({ path: "tools/e2e/_tech-rc-nojs.png" });
await browser.close();

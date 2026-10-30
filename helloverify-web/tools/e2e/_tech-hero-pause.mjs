import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const sample = async (page) =>
  page.evaluate(() => {
    const c = document.querySelector(".tk-gl-cv");
    return c.toDataURL().length + ":" + c.toDataURL().slice(-40);
  });

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await page.locator(".tk-gl[data-live]").waitFor();
await page.waitForTimeout(2500);
const btn = page.locator(".tk-gl-pause");
console.log("label before:", await btn.getAttribute("aria-label"));
await btn.click();
await page.waitForTimeout(300);
const a = await sample(page);
await page.waitForTimeout(1500);
const b = await sample(page);
console.log("label paused:", await btn.getAttribute("aria-label"), "| frozen:", a === b);
await btn.click();
await page.waitForTimeout(800);
console.log("moving again:", (await sample(page)) !== b);

const still = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await still.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await still.locator(".tk-gl[data-live]").waitFor();
await still.waitForTimeout(1500);
const s1 = await sample(still);
await still.waitForTimeout(1500);
console.log("reduced motion still:", s1 === (await sample(still)), "| button shown:", await still.locator(".tk-gl-pause").isVisible(), "| case:", await still.locator(".tk-gl-case").getAttribute("data-s"));
await still.locator(".tk-hero").screenshot({ path: "tools/e2e/_tech-hero-still.png" });
await browser.close();

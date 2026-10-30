import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/products/customer-kyc", { waitUntil: "load", timeout: 180000 });
const hero = page.locator(".kz-hero");
for (const s of [1, 3]) {
  await page.waitForFunction((n) => document.querySelector(".kh-stage")?.getAttribute("data-step") === String(n), s, { timeout: 30000 });
  await page.waitForTimeout(700);
  await hero.screenshot({ path: `tools/e2e/_kyc-flow-hero-${s}.png` });
}
const steps = page.locator(".kw-steps li");
for (const i of [0, 3, 5]) {
  await steps.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `tools/e2e/_kyc-flow-step${i + 1}.png` });
}

const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await m.goto("http://localhost:3000/en/products/customer-kyc", { waitUntil: "load", timeout: 180000 });
await m.waitForTimeout(1500);
await m.screenshot({ path: "tools/e2e/_kyc-flow-m-hero.png" });
await m.locator(".kw-steps li").nth(3).evaluate((el) => el.scrollIntoView({ block: "start" }));
await m.waitForTimeout(1200);
await m.screenshot({ path: "tools/e2e/_kyc-flow-m-step.png" });
await browser.close();

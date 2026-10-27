import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/products/customer-kyc", { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "tools/e2e/_kyc-red-hero.png" });

const steps = page.locator(".kw-steps li");
for (const i of [0, 3]) {
  await steps.nth(i).evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `tools/e2e/_kyc-red-step${i + 1}.png` });
}
for (const [sel, name] of [[".kz-fork", "fork"], [".kz-ops", "ops"], [".kz-bundle", "bundle"], [".kz-rbi", "rbi"], [".kz-close", "close"]]) {
  await page.locator(sel).evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1800);
  await page.locator(sel).screenshot({ path: `tools/e2e/_kyc-red-${name}.png` });
}
await page.locator(".kz-law li").first().hover();
await page.waitForTimeout(600);
await page.locator(".kz-law").screenshot({ path: "tools/e2e/_kyc-red-law.png" });

const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await m.goto("http://localhost:3000/en/products/customer-kyc", { waitUntil: "load", timeout: 180000 });
await m.locator(".kw-steps li").nth(1).evaluate((el) => el.scrollIntoView({ block: "start" }));
await m.waitForTimeout(1200);
await m.screenshot({ path: "tools/e2e/_kyc-red-m-steps.png" });
await browser.close();

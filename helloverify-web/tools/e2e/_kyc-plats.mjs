import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/products/customer-kyc", { waitUntil: "load", timeout: 180000 });
const sec = page.locator(".kz-plats");
await sec.evaluate((el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(2500);
await sec.screenshot({ path: "tools/e2e/_kyc-plats-1440.png" });
await browser.close();

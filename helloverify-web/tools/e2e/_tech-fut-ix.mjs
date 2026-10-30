import { chromium, devices } from "@playwright/test";

/** The future-of-trust board's interaction: keyboard focus lights a layer;
    on a touch phone, tapping a layer's name pins it until tapped again. */
const browser = await browser0();
async function browser0() { return chromium.launch(); }
const errors = [];

let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push(String(e)));
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1000);
await page.locator('.tk-ft-item[data-hg="1"] .tk-ft-go').focus();
const kb = await page.locator(".tk-fut").evaluate((el) => el.dataset.focus);
await page.locator('.tk-ft-item[data-hg="1"] .tk-ft-go').blur();
const kbOut = await page.locator(".tk-fut").evaluate((el) => el.dataset.focus ?? "none");
console.log("keyboard focus ->", kb, "| after blur ->", kbOut);
await page.close();

page = await browser.newPage({ ...devices["iPhone 13"] });
page.on("pageerror", (e) => errors.push(String(e)));
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1000);
const go = (k) => page.locator(`.tk-ft-item[data-hg="${k}"] .tk-ft-go`);
const state = () => page.locator(".tk-fut").evaluate((el) => ({ focus: el.dataset.focus ?? "none", pressed: [...el.querySelectorAll(".tk-ft-go")].map((b) => b.getAttribute("aria-pressed")).join(",") }));
await go(0).tap();
await page.waitForTimeout(400);
console.log("tap 01 ->", JSON.stringify(await state()));
await go(2).tap();
await page.waitForTimeout(400);
console.log("tap 03 ->", JSON.stringify(await state()));
await go(2).tap();
await page.waitForTimeout(400);
console.log("tap 03 again ->", JSON.stringify(await state()));
console.log("errors", errors);
await browser.close();

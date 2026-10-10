import { chromium } from "@playwright/test";

const browser = await chromium.launch();
for (const [tag, path, viewport] of [
  ["desk", "/en", { width: 1440, height: 900 }],
  ["phone", "/en", { width: 390, height: 844 }],
  ["ar", "/ar", { width: 1440, height: 900 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Content Security Policy/.test(m.text()) && errors.push(m.text()));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 180000 });
  await page.getByRole("button", { name: /^(Reject|رفض)/ }).first().click({ timeout: 3000 }).catch(() => {});
  const rails = page.locator(".kv-clients");
  for (let i = 0; i < (await rails.count()); i++) {
    await rails.nth(i).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await rails.nth(i).screenshot({ path: `tools/e2e/_wc-${tag}-${i}.png` });
  }
  if (tag === "desk") {
    await page.locator("#kv-white").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `tools/e2e/_wc-desk-panels.png` });
  }
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll(".kv-logos img")].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src")),
  );
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(tag, "broken:", broken, "x-overflow:", ov, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

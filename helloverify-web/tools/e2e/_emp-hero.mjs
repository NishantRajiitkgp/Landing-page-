import { chromium } from "@playwright/test";

const tag = process.argv[2] ?? "before";
const browser = await chromium.launch();
for (const [vp, path, viewport] of [
  ["desk", "/en/employee-verification", { width: 1440, height: 900 }],
  ["phone", "/en/employee-verification", { width: 390, height: 844 }],
  ["ar", "/ar/employee-verification", { width: 1440, height: 900 }],
  ["tab", "/en/employee-verification", { width: 900, height: 1100 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Content Security Policy/.test(m.text()) && errors.push(m.text().slice(0, 160)));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 180000 });
  await page.getByRole("button", { name: /^(Reject|رفض)/ }).first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(900);
  await page.screenshot({ path: `tools/e2e/_emph-${tag}-${vp}.png` });
  if (vp === "desk") {
    const card = page.locator(".emp4-jump").first();
    await card.hover();
    await page.waitForTimeout(500);
    await page.locator(".emp4-hero").screenshot({ path: `tools/e2e/_emph-${tag}-hover.png` });
  }
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(vp, "x-overflow:", ov, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

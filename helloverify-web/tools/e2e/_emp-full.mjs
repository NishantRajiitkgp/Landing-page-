import { chromium } from "@playwright/test";

const tag = process.argv[2] ?? "before";
const only = process.argv[3];
const browser = await chromium.launch();
for (const [vp, path, viewport] of [
  ["desk", "/en/employee-verification", { width: 1440, height: 900 }],
  ["phone", "/en/employee-verification", { width: 390, height: 844 }],
  ["ar", "/ar/employee-verification", { width: 1440, height: 900 }],
  ["tab", "/en/employee-verification", { width: 900, height: 1100 }],
  ["hi", "/hi/employee-verification", { width: 1280, height: 900 }],
]) {
  if (only && only !== vp) continue;
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Content Security Policy/.test(m.text()) && errors.push(m.text().slice(0, 160)));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 180000 });
  await page.getByRole("button", { name: /^(Reject|رفض)/ }).first().click({ timeout: 3000 }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  const n = await page.locator(".emp4 > section").count();
  for (let i = 0; i < n; i++) {
    const s = page.locator(".emp4 > section").nth(i);
    if (await s.locator("#emp4-auto-h, #emp4-psv-h").count()) continue;
    await s.screenshot({ path: `tools/e2e/_empf-${tag}-${vp}-${i}.png` });
  }
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(vp, "sections:", n, "x-overflow:", ov, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

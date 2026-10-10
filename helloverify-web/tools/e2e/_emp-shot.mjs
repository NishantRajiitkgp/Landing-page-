import { chromium } from "@playwright/test";

const tag = process.argv[2] ?? "before";
const only = process.argv[3];
const browser = await chromium.launch();
for (const [vp, path, viewport] of [
  ["desk", "/en/employee-verification", { width: 1440, height: 900 }],
  ["phone", "/en/employee-verification", { width: 390, height: 844 }],
  ["ar", "/ar/employee-verification", { width: 1440, height: 900 }],
]) {
  if (only && only !== vp) continue;
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Content Security Policy/.test(m.text()) && errors.push(m.text().slice(0, 160)));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 180000 });
  await page.getByRole("button", { name: /^(Reject|رفض)/ }).first().click({ timeout: 3000 }).catch(() => {});
  const seg = page.locator("#employees-white-collar");
  await seg.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const el = document.querySelector("#employees-white-collar");
    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 40);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `tools/e2e/_emp-${tag}-${vp}.png` });
  if (vp === "phone") {
    await page.evaluate(() => window.scrollBy(0, 760));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `tools/e2e/_emp-${tag}-${vp}2.png` });
  }
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll("#employees-white-collar img")].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src")),
  );
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(vp, "broken:", broken, "x-overflow:", ov, "errors:", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

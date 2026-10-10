import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "cmp";
const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desk", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
  const sec = page.locator(".tk-cmp");
  await sec.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 40));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-mid.png` });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-done.png` });
  if (name === "desk") {
    await page.locator(".tk-cmp-c").nth(1).hover();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-hover.png` });
  } else {
    await sec.evaluate((el) => window.scrollBy(0, el.querySelector(".tk-cmp-list").getBoundingClientRect().top - 80));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-list.png` });
  }
  console.log(name, "errors", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "sec";
const browser = await chromium.launch();
for (const [name, viewport] of [
  ["desk", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
  const el = page.locator(".tk-sec").first();
  const at = (f) => el.evaluate((n, f) => window.scrollTo(0, n.getBoundingClientRect().top + window.scrollY - innerHeight * f), f);
  await at(0.62);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-mid.png` });
  await at(0.02);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}.png` });
  const lock = await el.evaluate((n) => n.hasAttribute("data-lock"));
  if (name === "desk") {
    await page.locator(".tk-seal").nth(1).hover();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `tools/e2e/_tech-${tag}-${name}-hover.png` });
  }
  const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, "locked", lock, "overflow", ow, "errors", errors);
  await page.close();
}
await browser.close();

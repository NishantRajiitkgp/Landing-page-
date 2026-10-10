import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto("http://localhost:3000/en/technology", { waitUntil: "networkidle", timeout: 120000 });
for (const sel of [".tk-pil", ".tk-cmp", ".tk-areas", ".tk-fut", ".tk-sec"]) {
  const el = page.locator(sel).first();
  await el.evaluate((n) => window.scrollTo(0, n.getBoundingClientRect().top + window.scrollY - 40));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `tools/e2e/_tech-rm${sel.replace(".tk-", "-")}.png` });
}
console.log("sec locked", await page.locator(".tk-sec").evaluate((n) => n.hasAttribute("data-lock")));
console.log("fut --sp", await page.locator(".tk-fut").evaluate((n) => n.style.getPropertyValue("--sp") || "(css default)"));
await browser.close();

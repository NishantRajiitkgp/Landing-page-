import { chromium } from "@playwright/test";

const width = Number(process.argv[2] ?? 1440);
const browser = await chromium.launch();
for (const [tag, opts] of [
  ["reduced", { reducedMotion: "reduce" }],
  ["nojs", { javaScriptEnabled: false }],
]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, ...opts });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
  await page.waitForTimeout(1200);
  const box = await page.locator(".tk-road").evaluate((n) => {
    const r = n.getBoundingClientRect();
    return { top: r.top + scrollY, h: r.height };
  });
  await page.evaluate((v) => scrollTo(0, v), box.top + 400);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `tools/e2e/_tech-road-${tag}-${width}.png` });
  console.log(tag, box);
  await ctx.close();
}
await browser.close();

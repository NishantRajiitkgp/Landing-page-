import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
const stage = page.locator(".tk-stage");
for (let i = 0; i < 3; i++) {
  await page.locator(".tk-step").nth(i).evaluate((el) => {
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.top + r.height / 2 - window.innerHeight / 2);
  });
  await page.waitForTimeout(900);
  const active = await page.locator(".tk-pil").getAttribute("data-active");
  for (const t of [1200, 2100, 2900, 5000]) {
    await page.evaluate(
      ([t, i]) =>
        document.querySelectorAll(`.tk-v${i + 1} *`).forEach((n) =>
          n.getAnimations().forEach((a) => {
            a.pause();
            a.currentTime = t;
          }),
        ),
      [t, i],
    );
    await page.waitForTimeout(150);
    await stage.screenshot({ path: `tools/e2e/_tech-pil-${tag}-${i}-${t}.png` });
  }
  console.log("step", i, "active", active);
}
await browser.close();

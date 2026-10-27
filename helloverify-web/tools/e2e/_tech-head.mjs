import { chromium } from "@playwright/test";

const browser = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await page.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
  const head = page.locator(".tk-pil .sec-head");
  await head.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(600);
  const box = await page.locator(".tk-pil .h2").boundingBox();
  const lines = await page.locator(".tk-pil .h2").evaluate((el) => {
    const keep = el.querySelector(".tk-pil-keep");
    const r = el.getBoundingClientRect();
    const k = keep?.getBoundingClientRect();
    return {
      text: el.innerText,
      head: { w: Math.round(r.width), h: Math.round(r.height) },
      keep: k ? { w: Math.round(k.width), h: Math.round(k.height), overflow: k.width > r.width + 1 } : null,
    };
  });
  console.log(w, JSON.stringify(lines), "box", box);
  await head.screenshot({ path: `tools/e2e/_tech-head-${w}.png` });
  await page.close();
}
await browser.close();

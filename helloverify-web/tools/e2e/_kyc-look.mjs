import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
for (const p of ["", "/products/bgv-smb", "/products/hellov", "/products/certifier", "/technology"]) {
  await page.goto(`http://localhost:3000/en${p}`, { waitUntil: "load", timeout: 180000 });
  await page.waitForTimeout(2000);
  const name = p.replaceAll("/", "_") || "_home";
  await page.screenshot({ path: `tools/e2e/_look${name}.png`, fullPage: true });
  const bgs = await page.evaluate(() => {
    const tally = {};
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width * r.height < 60000) continue;
      const c = getComputedStyle(el).backgroundColor;
      if (c === "rgba(0, 0, 0, 0)") continue;
      tally[c] = (tally[c] || 0) + 1;
    }
    return tally;
  });
  console.log(p || "/", JSON.stringify(bgs));
}
await browser.close();

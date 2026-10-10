import { chromium } from "@playwright/test";

const out = process.argv[2] ?? "tools/e2e/_ab";
const path = process.argv[3] ?? "/en/about";
const only = process.argv[4];
const browser = await chromium.launch();
const SECTIONS = [".ab-story", ".ab-bel-in", ".ab-inv", ".ab-num", ".ab-val", ".ab-voice", ".tk-sec"];

for (const [tag, viewport] of [
  ["desk", { width: 1440, height: 900 }],
  ["phone", { width: 390, height: 844 }],
]) {
  if (only && only !== tag) continue;
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Content Security Policy/.test(m.text()) && errors.push(m.text()));
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.getByRole("button", { name: /^(Reject|رفض|अस्वीकार)/ }).first().click({ timeout: 3000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(5500);
  await page.screenshot({ path: `${out}-${tag}-0hero.png` });

  for (const [i, sel] of SECTIONS.entries()) {
    const ok = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const y = window.scrollY + r.top - (s === ".ab-bel-in" ? window.innerHeight * 0.18 : 90);
      window.scrollTo(0, Math.max(0, y));
      return true;
    }, sel);
    if (!ok) continue;
    await page.waitForTimeout(3200);
    await page.screenshot({ path: `${out}-${tag}-${i + 1}${sel.replace(/[^a-z]/g, "")}.png` });
  }

  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(tag, "height", h, "x-overflow", ov, "errors", errors.length ? errors : "none");
  await page.close();
}
await browser.close();

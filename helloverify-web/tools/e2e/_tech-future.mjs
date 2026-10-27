import { chromium } from "@playwright/test";

/** Screenshots of the future-of-trust section. Args: path tag width height points.
    A point is progress through the section's runway (0…1), or `s` for the section head on screen. */
const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const at = (process.argv[6] ?? "s").split(",");
const opts = process.argv[7] ?? "";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, reducedMotion: opts.includes("reduced") ? "reduce" : "no-preference", javaScriptEnabled: !opts.includes("nojs") });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && !m.text().includes("Content Security Policy") && errors.push(m.text()));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1500);
const geo = await page.evaluate(() => {
  const s = document.querySelector(".tk-fut");
  const run = s.querySelector(".tk-ft-run") ?? s;
  const r = run.getBoundingClientRect();
  const sr = s.getBoundingClientRect();
  return { top: r.top + scrollY, h: r.height, stop: sr.top + scrollY, sh: sr.height, vh: innerHeight };
});
for (const code of at) {
  let y;
  if (code === "s") y = geo.stop;
  else if (code.startsWith("y")) y = geo.stop + Number(code.slice(1));
  else y = geo.top - geo.vh * 0.35 + Number(code) * (geo.h - geo.vh * 0.65);
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(opts.includes("fast") ? 700 : 1800);
  if (opts.includes("hover")) {
    const k = Number(opts.match(/hover(\d)/)?.[1] ?? 0);
    const el = page.locator(`.tk-fut [data-k="${k}"]`).first();
    if (await el.count()) { await el.hover(); await page.waitForTimeout(1600); }
  }
  await page.screenshot({ path: `tools/e2e/_tech-fut-${tag}-${width}-${code}.png` });
}
console.log("geo", geo, "errors", errors);
await browser.close();

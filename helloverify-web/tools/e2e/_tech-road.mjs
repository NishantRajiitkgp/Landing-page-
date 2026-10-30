import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
/** Points on the journey: `h3` is stop 3 at rest, `r3` mid-ride after it, `b3.5` half built, a bare number is progress 0…1. */
const at = (process.argv[6] ?? "h0,r0,h1,h2,h3,h4,h5,h6,h7,r7,h8").split(",");

const STOPS = 8;
const SEGS = [{ k: "lead", i: 0, w: 0.9 }];
for (let i = 0; i <= STOPS; i++) {
  SEGS.push({ k: "build", i, w: i < STOPS ? 1.5 : 1.3 }, { k: "hold", i, w: i < STOPS ? 0.45 : 0.7 });
  if (i < STOPS) SEGS.push({ k: "travel", i, w: 1.15 });
}
const TOTAL = SEGS.reduce((a, s) => a + s.w, 0);
const before = (k, i) => {
  const idx = SEGS.findIndex((s) => s.k === k && s.i === i);
  return SEGS.slice(0, idx).reduce((a, s) => a + s.w, 0);
};
const prog = (code) => {
  const k = code[0];
  const v = Number(code.slice(1));
  if (k === "h") return (before("hold", v) + SEGS.find((s) => s.k === "hold" && s.i === v).w * 0.6) / TOTAL;
  if (k === "r") return (before("travel", v) + 1.15 * 0.5) / TOTAL;
  if (k === "b") {
    const i = Math.floor(v);
    return (before("build", i) + 1.5 * (v - i)) / TOTAL;
  }
  return Number(code);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && !m.text().includes("Content Security Policy") && errors.push(m.text()));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1500);
const geo = await page.evaluate(() => {
  const r = document.querySelector(".tk-rd-run").getBoundingClientRect();
  return { top: r.top + scrollY, h: r.height, vh: innerHeight };
});
for (const code of at) {
  const p = prog(code);
  const y = geo.top - geo.vh * 0.4 + p * (geo.h - geo.vh * 0.6);
  await page.evaluate((v) => scrollTo(0, v), y);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `tools/e2e/_tech-road-${tag}-${width}-${code}.png` });
}
console.log("geo", geo, "errors", errors);
await browser.close();

import { chromium } from "@playwright/test";

/** The future-of-trust board at rest and with each layer hovered. Args: path tag width height. */
const path = process.argv[2] ?? "/en/technology";
const tag = process.argv[3] ?? "en";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.addInitScript(() => localStorage.setItem("hv-consent", "set"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:3000${path}`, { waitUntil: "load", timeout: 180000 });
await page.waitForTimeout(1200);
const sec = page.locator(".tk-fut");
await sec.evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY + 60));
await page.waitForTimeout(800);
const clip = await sec.boundingBox();
const shot = (name) => page.screenshot({ path: `tools/e2e/_tech-fut-${tag}-${width}-${name}.png`, clip: { x: 0, y: Math.max(0, clip.y), width, height: Math.min(height, clip.height) } });
await shot("rest");
const states = [];
for (const k of [0, 1, 2]) {
  await page.locator(`.tk-ft-item[data-hg="${k}"] .tk-ft-go`).hover();
  await page.waitForTimeout(900);
  states.push(await sec.evaluate((el) => el.dataset.focus));
  await shot(`hover${k}`);
}
await page.mouse.move(5, 5);
await page.waitForTimeout(600);
states.push(await sec.evaluate((el) => el.dataset.focus ?? "none"));
console.log("focus states", states, "errors", errors);
await browser.close();

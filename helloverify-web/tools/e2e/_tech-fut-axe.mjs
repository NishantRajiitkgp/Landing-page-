import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const b = await chromium.launch();
for (const motion of ["no-preference", "reduce"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: motion });
  await p.addInitScript(() => localStorage.setItem("hv-consent", "set"));
  await p.goto("http://localhost:3000/en/technology", { waitUntil: "load", timeout: 180000 });
  await p.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  await p.locator(".tk-fut").evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY + 1200));
  await p.waitForTimeout(1500);
  const res = await p.evaluate(async () => {
    const r = await window.axe.run(".tk-fut", { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] } });
    return r.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.length} — ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  });
  console.log(motion, res.length ? res.join("\n") : "no violations");
  await p.close();
}
await b.close();

import { readFileSync, writeFileSync } from "node:fs";

const file = "src/app/v2/tech.css";
let css = readFileSync(file, "utf8");
const next = readFileSync("tools/e2e/_cx.css", "utf8").replace(/\r\n/g, "\n");

const a = css.indexOf("/* ═══════════════════════════════════════════════════ COMPOUNDING NETWORK ═══");
const b = css.indexOf("/* ═══════════════════════════════════════════════════════ PLATFORM AREAS ═══");
if (a < 0 || b < 0) throw new Error("section markers not found");
css = css.slice(0, a) + next + css.slice(b);

const p = css.indexOf("/* ── Phone and tablet ── */\n@media (max-width: 1080px) {\n  .tk-cmp {");
const q = css.indexOf("/* Reduced motion. The global rule");
if (p >= 0 && q > p) css = css.slice(0, p) + css.slice(q);

writeFileSync(file, css);
console.log("ok", css.split("\n").length, "lines");

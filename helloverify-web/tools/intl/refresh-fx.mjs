/** Refreshes the US $ rates in `src/lib/international/fx.json`.
 *
 *  The site makes no third-party calls (CSP `connect-src 'self'`), so the
 *  /international check builder converts prices with the rates that ship in
 *  the build. Run this, review the diff, and deploy to move them on:
 *      npm run fx:refresh
 *
 *  Only the currencies already in `fx.json` are rewritten; a currency the
 *  feed does not carry keeps its old rate and is reported. */
import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../../src/lib/international/fx.json", import.meta.url);
const FEED = "https://open.er-api.com/v6/latest/USD";

const fx = JSON.parse(await readFile(FILE, "utf8"));
const res = await fetch(FEED);
if (!res.ok) throw new Error(`${FEED}: HTTP ${res.status}`);
const body = await res.json();
if (body.result !== "success" || !body.rates) throw new Error(`${FEED}: ${body["error-type"] ?? "no rates"}`);

const missing = [];
for (const cur of Object.keys(fx.rates)) {
  const rate = body.rates[cur];
  if (typeof rate === "number" && rate > 0) fx.rates[cur] = rate;
  else missing.push(cur);
}

const at = new Date(body.time_last_update_unix * 1000);
fx.asOf = at.toISOString().slice(0, 10);
fx.source = `open.er-api.com, base USD, ${at.toUTCString().slice(5, 22)} UTC`;

await writeFile(FILE, `${JSON.stringify(fx, null, 2)}\n`);
console.log(`fx.json: ${Object.keys(fx.rates).length - missing.length} rates as of ${fx.asOf}`);
if (missing.length) console.warn(`not in the feed, left as they were: ${missing.join(", ")}`);

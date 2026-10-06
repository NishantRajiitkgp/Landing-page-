/** Part 8: marketing CTAs that still hopped to `app.helloverify.com`.
 *
 *  The individuals hub is new, so "Start a check" stays on this host
 *  (`/products/hellov`). Immigration's old applicant CTA was the visa
 *  portal — a different product from the www cart — so it must not be
 *  rewritten as `CommerceCta`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { APP_HOST, VISA_HOST } from "../../src/lib/seo/legacy-urls.ts";
import { check } from "./harness.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function page(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const HUB = "src/app/[locale]/individuals/page.tsx";
const IMMIGRATION = "src/app/[locale]/products/immigration/page.tsx";

const hub = page(HUB);
const immigration = page(IMMIGRATION);

const APP_HREF = /href=["']https:\/\/app\.helloverify\.com|ctaHref:\s*["']https:\/\/app\.helloverify\.com/;

function leftoverAppHops(dir: string): string[] {
  const hits: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "landing-page" || entry.name === "snapshot") continue;
    const next = join(dir, entry.name);
    if (entry.isDirectory()) {
      hits.push(...leftoverAppHops(next));
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry.name)) continue;
    if (APP_HREF.test(readFileSync(next, "utf8"))) {
      hits.push(relative(root, next).replaceAll("\\", "/"));
    }
  }
  return hits;
}

console.log("1. visa portal is the old applicant host");
check("VISA_HOST is visa.helloverify.com", VISA_HOST === "https://visa.helloverify.com/");

console.log("2. individuals hub stays on this host");
check("hub source does not name the app", !hub.includes(APP_HOST));
check("hub closing goes to /products/hellov", hub.includes('ctaHref: "/products/hellov"'));
check(
  "hub hero Start a check goes to /products/hellov",
  hub.includes('href="/products/hellov"') && hub.includes("{c.hero.cta}"),
);

console.log("3. immigration goes to the visa portal, not the app cart");
check("immigration source does not name the app", !immigration.includes(APP_HOST));
check("immigration partners CTA uses VISA_HOST", immigration.includes("href={VISA_HOST}"));
check("immigration guide CTA uses VISA_HOST", immigration.includes("ctaHref={VISA_HOST}"));

console.log("4. no other live marketing page still hrefs the app");
{
  const hops = leftoverAppHops(join(root, "src/app"));
  check("src/app has no leftover app hrefs", hops.length === 0, hops);
}

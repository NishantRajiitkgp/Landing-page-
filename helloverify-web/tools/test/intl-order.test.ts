/** `/international`'s check builder arithmetic (`lib/international/order.ts`):
 *  local currency, the high-risk fee, rush, the conversion charge, and the
 *  one-report delivery day. Rates are `fx.json`'s, read back here rather than
 *  copied, so a `fx:refresh` does not break the suite. */
import { existsSync } from "node:fs";

import { check } from "./harness.ts";

import fx from "../../src/lib/international/fx.json";
import {
  currencyOf,
  formatMoney,
  INTL_CHECKS,
  INTL_COUNTRIES,
  isHighRisk,
  rateOf,
} from "../../src/lib/international/catalog.ts";
import { localPrice, quoteOf } from "../../src/lib/international/order.ts";

console.log("0. every country can be priced and shown");
const CUR = fx.currency as Record<string, string>;
const unpriced = INTL_COUNTRIES.filter((c) => !CUR[c.code] || currencyOf(c.code) !== CUR[c.code]);
const flagless = INTL_COUNTRIES.filter((c) => !existsSync(new URL(`../../public/flags/${c.code.toLowerCase()}.svg`, import.meta.url)));
check("72 countries, each with checks", INTL_COUNTRIES.length === 72 && INTL_COUNTRIES.every((c) => INTL_CHECKS[c.code]?.length), INTL_COUNTRIES.length);
check("every country has a currency with a rate", unpriced.length === 0, unpriced);
check("every country has a flag", flagless.length === 0, flagless);
check("24 high-risk countries, all in the catalog", fx.highRisk.countries.length === 24 && fx.highRisk.countries.every((c) => INTL_CHECKS[c]), fx.highRisk.countries);

const rows = (code: string, ...ids: string[]) => ids.map((id) => INTL_CHECKS[code].find((r) => r.id === `${code}-${id}`)!);

console.log("1. US $ is unchanged: no fee, no conversion charge");
const us = quoteOf("US", rows("US", "EDU", "EMP"), false, "each");
check("US: $135 + $95 = $230", us.cur === "USD" && us.subtotal === 230 && us.total === 230 && us.fxFee === 0, us);
const usRush = quoteOf("US", rows("US", "EDU", "EMP"), true, "each");
check("US rush: +30% = $299", usRush.rushFee === 69 && usRush.total === 299, usRush);
check("US prices format as before", formatMoney(135, "USD") === "$135");

console.log("2. a high-risk country carries the fee, in its own currency");
const afn = rateOf("AFN");
const af = quoteOf("AF", rows("AF", "EDU", "EMP"), false, "each");
const afSub = Math.round(235 * afn) + Math.round(195 * afn);
check("Afghanistan is high-risk, United States is not", isHighRisk("AF") && !isHighRisk("US"));
check("AF: each check is (price + $100) in AFN", localPrice(rows("AF", "EDU")[0], "AF") === Math.round(235 * afn), af);
check(
  "AF: 2% conversion charge on the subtotal",
  af.cur === "AFN" && af.feeUsd === 100 && af.subtotal === afSub && af.fxFee === Math.round(afSub * 0.02) && af.total === afSub + af.fxFee,
  af,
);

console.log("3. two-decimal currencies keep their fils");
const kwd = rateOf("KWD");
const kw = quoteOf("KW", rows("KW", "EDU"), false, "each");
const kwSub = Math.round(135 * kwd * 100) / 100;
check("KW: KWD rounds to 2 places", kw.subtotal === kwSub && kw.fxFee === Math.round(kwSub * 0.02 * 100) / 100, kw);

console.log("4. delivery: one report is the longest turnaround plus a day");
const pair = rows("US", "EDU", "PASS");
const each = quoteOf("US", pair, false, "each");
const one = quoteOf("US", pair, false, "together");
const oneRush = quoteOf("US", pair, true, "together");
check("each: first in 1, last in 9", !each.together && each.first === 1 && each.last === 9 && each.reportDays === 9, each);
check("together: 10 working days", one.together && one.reportDays === 10, one);
check("together with rush: 5 + 1", oneRush.last === 5 && oneRush.reportDays === 6, oneRush);
check(
  "a single check cannot be 'together'",
  !quoteOf("US", rows("US", "EDU"), false, "together").together,
);

console.log("5. rush is only offered when it shortens something");
const oneDay = quoteOf("US", rows("US", "PASS", "GDB"), true, "each");
check("all one-day checks: no rush, no fee", !oneDay.rushOK && !oneDay.rushOn && oneDay.total === 45, oneDay);
check("a longer check brings it back", quoteOf("US", pair, true, "each").rushOn);

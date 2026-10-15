/** The country list and per-country checks for the International checks table.
 *
 *  `catalog.json` is generated from the ops sheets (International Pricing & TAT,
 *  International Verification Checks V2 for turnarounds, Criminal for the
 *  per-country criminal turnaround and feasibility). Package cards stay the
 *  CMS's four countries.
 *
 *  `fx.json` is each country's currency, a dated US $ rate snapshot
 *  (`npm run fx:refresh`), the conversion charge, and the high-risk
 *  countries (World Bank FCV list) that carry a flat fee on every check. The
 *  site makes no third-party calls, so rates ship with the build. */
import data from "./catalog.json";
import fx from "./fx.json";

import { localise } from "@/lib/i18n/href";

export type IntlCheck = {
  id: string;
  name: string;
  price: string;
  tat: string;
  details?: string;
};

export type IntlCountry = { code: string; name: string };

export const INTL_COUNTRIES = data.countries as IntlCountry[];
export const INTL_CHECKS = data.checks as Record<string, IntlCheck[]>;

export const CMS_ORDER = ["uk", "uae", "philippines", "egypt"] as const;
export type CmsCountryId = (typeof CMS_ORDER)[number];

const ISO_OF: Record<string, CmsCountryId> = {
  GB: "uk",
  AE: "uae",
  PH: "philippines",
  EG: "egypt",
};

export type CmsCountryCopy = {
  name: string;
  flagAlt: string;
  checksFlagAlt: string;
};

export type IntlOption = {
  code: string;
  name: string;
  cms: boolean;
  /** `public/flags/` (flag-icons, MIT), one 4:3 SVG per catalog country. */
  flagSrc: string;
  flagAlt?: string;
  /** The English name's initial: the list is in English order in every
   *  locale, so its A–Z headings are too. */
  letter: string;
  currency: string;
  risk: boolean;
};

export const FX_AS_OF = fx.asOf;
export const FX_CONVERSION = fx.conversionPct;
export const RISK_FEE_USD = fx.highRisk.feeUsd;

const RATES = fx.rates as Record<string, number>;
const CURRENCY = fx.currency as Record<string, string>;
const HIGH_RISK = new Set(fx.highRisk.countries);

export function currencyOf(code: string): string {
  const cur = CURRENCY[code];
  return cur && RATES[cur] ? cur : "USD";
}

export function rateOf(cur: string): number {
  return RATES[cur] ?? 1;
}

export function isHighRisk(code: string): boolean {
  return HIGH_RISK.has(code);
}

/** KWD, BHD and OMR keep two decimals; every other currency is whole units. */
function decimalsOf(cur: string): number {
  return rateOf(cur) < 0.5 ? 2 : 0;
}

export function roundIn(n: number, cur: string): number {
  const f = 10 ** decimalsOf(cur);
  return Math.round(n * f) / f;
}

export function toLocal(usd: number, cur: string): number {
  return roundIn(usd * rateOf(cur), cur);
}

export function formatMoney(n: number, cur: string): string {
  const dp = decimalsOf(cur);
  if (cur === "USD") return `$${n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur,
    currencyDisplay: "symbol",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(n);
}

export function cmsIdFor(code: string): CmsCountryId | undefined {
  return ISO_OF[code];
}

const ALIAS: Record<string, string> = {
  uk: "GB",
  gb: "GB",
  gbr: "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  uae: "AE",
  ae: "AE",
  are: "AE",
  "united arab emirates": "AE",
  philippines: "PH",
  ph: "PH",
  phl: "PH",
  egypt: "EG",
  eg: "EG",
  egy: "EG",
  us: "US",
  usa: "US",
  "united states": "US",
  "united states of america": "US",
};

/** `?country=` accepts a CMS id (`uk`), an ISO code, or a catalog name. */
export function resolveIntlCode(hint: string): string {
  const key = hint.trim().toLowerCase();
  if (!key) return "";
  const alias = ALIAS[key];
  if (alias && INTL_CHECKS[alias]) return alias;
  const byCode = INTL_COUNTRIES.find((c) => c.code.toLowerCase() === key);
  if (byCode) return byCode.code;
  const byName = INTL_COUNTRIES.find((c) => c.name.toLowerCase() === key);
  return byName?.code ?? "";
}

/** CMS countries keep their localized name and flag alt. The rest use the
 *  catalog's English name, and are marked so the audit skips them. */
export function intlOptions(
  countries: Record<CmsCountryId, CmsCountryCopy>,
  kind: "regional" | "checks",
): IntlOption[] {
  return INTL_COUNTRIES.map((c) => {
    const flagSrc = `/flags/${c.code.toLowerCase()}.svg`;
    const letter = c.name.charAt(0).toUpperCase();
    const currency = currencyOf(c.code);
    const risk = isHighRisk(c.code);
    const id = ISO_OF[c.code];
    if (!id) return { code: c.code, name: c.name, cms: false, flagSrc, letter, currency, risk };
    const meta = countries[id];
    return {
      code: c.code,
      name: meta.name,
      cms: true,
      flagSrc,
      flagAlt: kind === "checks" ? meta.checksFlagAlt : meta.flagAlt,
      letter,
      currency,
      risk,
    };
  });
}

export function enquiryHref(locale: string): string {
  return localise("/contact?tab=enquiry", locale);
}

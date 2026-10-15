/** The check builder's arithmetic: what a set of ticked checks costs in the
 *  country's currency and when it arrives. Pure, so `IntlChecks` and
 *  `IntlSummary` read one answer.
 *
 *  Order of charges: each check's US $ price plus the high-risk fee, in local
 *  currency; +30% rush on that; then, outside US $, the conversion charge on
 *  the lot. One combined report takes the longest turnaround plus a working
 *  day to compile. */
import {
  currencyOf,
  FX_CONVERSION,
  isHighRisk,
  RISK_FEE_USD,
  roundIn,
  toLocal,
  type IntlCheck,
} from "@/lib/international/catalog";

export type Delivery = "each" | "together";

export const RUSH = 0.3;

export type Quote = {
  cur: string;
  /** US $ added to every check in a high-risk country; 0 elsewhere. */
  feeUsd: number;
  subtotal: number;
  rushFee: number;
  fxFee: number;
  total: number;
  /** Rush is offered while some ticked check takes longer than a day. */
  rushOK: boolean;
  rushOn: boolean;
  together: boolean;
  /** Working days to the first result and to the last. */
  first: number;
  last: number;
  /** Working days to the whole request: `last`, or `last + 1` for one report. */
  reportDays: number;
  longest: IntlCheck | null;
};

export function priceOf(row: IntlCheck): number {
  const n = Number(row.price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function localPrice(row: IntlCheck, code: string): number {
  return toLocal(priceOf(row) + (isHighRisk(code) ? RISK_FEE_USD : 0), currencyOf(code));
}

export function quoteOf(code: string, picked: readonly IntlCheck[], rush: boolean, delivery: Delivery): Quote {
  const cur = currencyOf(code);
  const rushOK = picked.some((r) => (spanOf(r.tat, false)?.[1] ?? 0) > 1);
  const rushOn = rush && rushOK;
  const together = delivery === "together" && picked.length > 1;
  const subtotal = roundIn(
    picked.reduce((sum, r) => sum + localPrice(r, code), 0),
    cur,
  );
  const rushFee = roundIn(subtotal * RUSH, cur);
  const beforeFx = subtotal + (rushOn ? rushFee : 0);
  const fxFee = cur === "USD" ? 0 : roundIn(beforeFx * FX_CONVERSION, cur);
  const spans = picked.map((r) => spanOf(r.tat, rushOn)).filter((s): s is readonly [number, number] => s !== null);
  const first = spans.length ? Math.min(...spans.map((s) => s[0])) : 0;
  const last = spans.length ? Math.max(...spans.map((s) => s[1])) : 0;
  return {
    cur,
    feeUsd: isHighRisk(code) ? RISK_FEE_USD : 0,
    subtotal,
    rushFee,
    fxFee,
    total: roundIn(beforeFx + fxFee, cur),
    rushOK,
    rushOn,
    together,
    first,
    last,
    reportDays: together ? last + 1 : last,
    longest: picked.reduce<IntlCheck | null>((max, r) => (!max || daysOf(r) > daysOf(max) ? r : max), null),
  };
}

/** The slowest figure in a turnaround: "4-7 Working Days" is 7. */
export function daysOf(row: IntlCheck): number {
  const nums = row.tat.match(/\d+/g)?.map(Number) ?? [];
  return nums.length ? Math.max(...nums) : Number.POSITIVE_INFINITY;
}

const half = (n: number) => Math.max(1, Math.ceil(n / 2));

/** Halve every figure in a TAT string. One working day is the floor. */
export function halfTat(tat: string): string {
  return tat.replace(/\d+/g, (n) => String(half(Number(n))));
}

/** "4-7 Working Days" → [4, 7], halved under rush as `halfTat` does. */
export function spanOf(tat: string, rush: boolean): readonly [number, number] | null {
  const nums = tat.match(/\d+/g)?.map((n) => (rush ? half(Number(n)) : Number(n))) ?? [];
  return nums.length ? [Math.min(...nums), Math.max(...nums)] : null;
}

/** Today plus `n` working days, Saturday and Sunday skipped. */
export function addWorkingDays(n: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let left = n; left > 0; ) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w !== 0 && w !== 6) left--;
  }
  return d;
}

/** Day before month in English ("Fri, 16 Oct"); digits stay Latin in every
 *  locale, like the prices beside them. */
const dateLocale = (locale: string) => `${locale === "en" ? "en-GB" : locale}-u-nu-latn`;

export function shortDate(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(dateLocale(locale), { weekday: "short", day: "numeric", month: "short" }).format(d);
}

export function isoDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(dateLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** US $ is "US $" everywhere, as the price note spells it. */
export function currencyName(cur: string, locale: string): string {
  if (cur === "USD") return "US $";
  try {
    return new Intl.DisplayNames([locale], { type: "currency" }).of(cur) ?? cur;
  } catch {
    return cur;
  }
}

/** Long local amounts (`IDR 3,130,586`, `IRR 393,527,475`) step the serif down. */
export function sizeOf(label: string): "long" | "xl" | "xxl" | undefined {
  return label.length > 15 ? "xxl" : label.length > 12 ? "xl" : label.length > 9 ? "long" : undefined;
}

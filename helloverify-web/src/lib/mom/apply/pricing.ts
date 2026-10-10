/** The application's price, from the MOM pricing data (`lib/mom/*.json`).
 *  Education Verification and Accreditation are per qualification; Express is
 *  per application. GST is added on top. */
import type { MomDoc } from "../doc";

import { needsAccreditation } from "./policy";
import type { Draft } from "./types";

export type Prices = { edu: number; acc: number; express: number; gst: number };

export function pricesFrom(doc: MomDoc): Prices {
  const band = doc.screening.pricing.packagesBand;
  const items = band.packages.flatMap((p) => p.lineItems);
  const amount = (id: string) => items.find((i) => i.id === id)?.amount ?? 0;
  return { edu: amount("eqv"), acc: amount("accreditation"), express: band.expressAddon.amount, gst: band.gstRate };
}

export type QuoteLine = { id: "edu" | "acc" | "express"; qty: number; amount: number };
export type Quote = { lines: QuoteLine[]; subtotal: number; gst: number; total: number };

const cents = (n: number) => Math.round(n * 100) / 100;

export function quote(draft: Pick<Draft, "quals" | "express">, prices: Prices): Quote {
  const n = Math.max(1, draft.quals.length);
  const acc = draft.quals.filter(needsAccreditation).length;
  const lines: QuoteLine[] = [{ id: "edu", qty: n, amount: n * prices.edu }];
  if (acc) lines.push({ id: "acc", qty: acc, amount: acc * prices.acc });
  if (draft.express) lines.push({ id: "express", qty: 1, amount: prices.express });
  const subtotal = cents(lines.reduce((s, l) => s + l.amount, 0));
  const gst = cents(subtotal * prices.gst);
  return { lines, subtotal, gst, total: cents(subtotal + gst) };
}

export function money(amount: number, locale: string): string {
  return new Intl.NumberFormat(`${locale}-u-nu-latn`, { style: "currency", currency: "SGD", currencyDisplay: "code" }).format(amount);
}

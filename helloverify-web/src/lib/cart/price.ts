/** Parse a display price (e.g. `₹174`) for quantity math. From the old SPA. */

export function parseUnitPrice(display: string): number | null {
  const match = display.replace(/,/g, "").match(/[\d.]+/);
  if (!match) return null;
  const value = Number.parseFloat(match[0]);
  return Number.isFinite(value) ? value : null;
}

export function extractCurrencyPrefix(priceDisplay?: string): string {
  const prefix = priceDisplay?.trim().match(/^[^\d]+/)?.[0]?.trim();
  return prefix && prefix.length > 0 ? prefix : "₹";
}

export function formatMoney(amount: number, currencyPrefix: string): string {
  return `${currencyPrefix}${Math.round(amount)}`;
}

export function getUnitPrice(details: {
  priceDisplay?: string;
  unitAmount?: number;
}): number | null {
  if (details.unitAmount != null && Number.isFinite(details.unitAmount)) {
    return details.unitAmount;
  }
  if (details.priceDisplay) return parseUnitPrice(details.priceDisplay);
  return null;
}

export type CheckoutPriceBreakdown = {
  basePriceDisplay: string;
  totalDisplay: string;
  unitDisplay: string | null;
};

export function resolveCheckoutPricing(
  details: { priceDisplay?: string; unitAmount?: number },
  quantity: number,
  fallback: string,
): CheckoutPriceBreakdown {
  const unit = getUnitPrice(details);
  const prefix = extractCurrencyPrefix(details.priceDisplay);

  if (unit == null) {
    const label = details.priceDisplay?.trim() || fallback;
    return { basePriceDisplay: label, totalDisplay: label, unitDisplay: null };
  }

  const unitDisplay = formatMoney(unit, prefix);
  return {
    basePriceDisplay: unitDisplay,
    totalDisplay: formatMoney(unit * quantity, prefix),
    unitDisplay,
  };
}

/** The four HelloV home services that check out through the Hello Staff
 *  onboarding backend (`hello_staff/onboarding`) instead of WhatsApp. Package
 *  ids, base prices, the FIR add-on and the document each one verifies are
 *  the Hello Staff app's own (`Home.tsx`, `Verify.tsx`). Verify Anyone, Cyber
 *  Identity, Know The Identity and Know Your Contact stay on WhatsApp. */

export type HsDoc = "dl" | "aadhaar";
export type HsTier = "basic" | "advanced";

export type HsService = {
  slug: "driver" | "home-staff" | "nanny" | "tenant";
  /** Hello Staff's `selectedPackage` key. */
  key: "drivers" | "home-staff" | "nanny" | "tenants";
  packageId: number;
  price: number;
  doc: HsDoc;
};

export const HS_SERVICES = [
  { slug: "driver", key: "drivers", packageId: 8569, price: 499, doc: "dl" },
  { slug: "home-staff", key: "home-staff", packageId: 8400, price: 399, doc: "aadhaar" },
  { slug: "nanny", key: "nanny", packageId: 2161, price: 599, doc: "aadhaar" },
  { slug: "tenant", key: "tenants", packageId: 2158, price: 999, doc: "aadhaar" },
] as const satisfies readonly HsService[];

export type HsSlug = (typeof HS_SERVICES)[number]["slug"];

/** Advanced is Basic plus this add-on. The label is "FIR Record". */
export const FIR_ADDON = 300;

/** Hello Staff's `check_master_id` / `check_ref_id` per document. */
export const CHECK_MASTER: Record<HsDoc, number> = { dl: 4, aadhaar: 16 };

/** The question ids Hello Staff's OCR fills, per document. */
export const OCR_FIELDS: Record<HsDoc, readonly string[]> = {
  aadhaar: ["2", "103", "159", "19", "4"],
  dl: ["2", "4", "67", "160"],
};

export function hsService(slug: string): HsService | undefined {
  return HS_SERVICES.find((s) => s.slug === slug);
}

/** Locale-relative; the caller localises it. */
export function hsPath(slug: HsSlug, tier: HsTier = "basic"): string {
  return `/products/hellov/verify/${slug}${tier === "advanced" ? "?plan=advanced" : ""}`;
}

export function hsTotal(service: HsService, fir: boolean): number {
  return service.price + (fir ? FIR_ADDON : 0);
}

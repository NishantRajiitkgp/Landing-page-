import { readSession } from "@/lib/auth/storage";
import type { PackageCheckoutDetails } from "@/lib/auth/types";

import { getUnitPrice } from "./price";

/** Home / SMB payload the old `AddToCartDialogComponent` posted. */
export function buildAddToCartPayload(
  details: PackageCheckoutDetails,
  unitCount: number,
): Record<string, unknown> {
  const session = readSession();
  const userUuid = session?.user?.uuid;
  const unitPrice = getUnitPrice(details) ?? 0;
  const totalAmount = Math.round(unitPrice * unitCount);
  const packageId = details.packageId ?? details.checkCode ?? details.packageName;

  if (details.packageType === "home" || details.packageType === "smb") {
    return {
      user_uuid: userUuid,
      total_price: totalAmount,
      items: [
        {
          package_id: packageId,
          package_name: details.packageName,
          price: unitPrice,
          quantity: unitCount,
          persons: unitCount,
          currency: "INR",
        },
      ],
      ...(details.addToCartBody ?? {}),
    };
  }

  return {
    unit_count: unitCount,
    package: details.packageName,
    visa: details.visa ?? details.packageName,
    package_type: details.packageType,
    total_amount: unitPrice,
    ...(details.addToCartBody ?? {}),
    ...(details.checkCode ? { check_code: details.checkCode } : {}),
  };
}

export function cartItemFromPayload(payload: Record<string, unknown>): {
  uuid: string;
  package: string;
  check_name: string;
  unit_count: number;
  persons: number;
  price: number;
  total_amount: number;
  currency: string;
  package_type?: string;
  check_code?: string;
} {
  const items = payload.items as
    | {
        package_id?: string;
        package_name?: string;
        price?: number;
        quantity?: number;
        persons?: number;
        currency?: string;
      }[]
    | undefined;
  const first = Array.isArray(items) ? items[0] : null;
  const unitCount = Number(first?.persons ?? first?.quantity ?? payload.unit_count ?? payload.persons ?? 1) || 1;
  const unitPrice = Number(first?.price ?? payload.price ?? payload.total_amount ?? 0) || 0;
  const name = String(first?.package_name ?? payload.package ?? payload.packageName ?? "Package");
  const checkCode = String(first?.package_id ?? payload.check_code ?? payload.package_id ?? "").trim();
  return {
    uuid: `mock-cart-${Date.now()}`,
    package: name,
    check_name: name,
    unit_count: unitCount,
    persons: unitCount,
    price: unitPrice,
    total_amount: unitPrice * unitCount,
    currency: String(first?.currency ?? payload.currency ?? "INR"),
    package_type: payload.package_type != null ? String(payload.package_type) : first ? "SMB" : undefined,
    ...(checkCode ? { check_code: checkCode } : {}),
  };
}

/** Angular `AddToCartComponent` payment meta for `POST /payment-init`. */

import type { ApiEnvelope } from "@/lib/auth/types";

import type { CartItem, PaymentInitData, PaymentInitResponse } from "./types";

/**
 * - Lines without `check_code` are travel-style “card” lines.
 * - When any line has `check_code` (SMB/BGV), `is_cart_payment` is true and
 *   `user_card_ids` must include **every** cart line UUID (empty array → API 500).
 * - Travel-only carts: `is_cart_payment` false; IDs are the travel line UUIDs.
 */
export function deriveCartPaymentMeta(cartData: CartItem[]) {
  const allIds = cartData.map((item) => item.uuid).filter((id): id is string => Boolean(id));

  const idsWithoutCheckCode = cartData
    .filter((item) => {
      if (!Object.prototype.hasOwnProperty.call(item, "check_code")) return true;
      const code = item.check_code;
      return code == null || String(code).trim() === "";
    })
    .map((item) => item.uuid)
    .filter((id): id is string => Boolean(id));

  const isCartPayment = cartData.length !== idsWithoutCheckCode.length;
  const cartIds = isCartPayment ? allIds : idsWithoutCheckCode;

  return { cartIds, isCartPayment };
}

export function isPaymentInitResponse(
  res: PaymentInitResponse | undefined,
): res is PaymentInitResponse & { data: PaymentInitData } {
  if (!res?.data) return false;
  return res.success === true || res.status === true;
}

/** Angular `PaymentService.razorResponse` navigates only when `res.success == true`. */
export function isPaymentCallbackSuccess(res: (ApiEnvelope & { success?: boolean }) | undefined): boolean {
  if (!res) return false;
  if (res.success === true) return true;
  if (res.success === false) return false;
  return res.status === true;
}

export function cartPayCurrency(items: CartItem[]): string {
  return items.some((item) => String(item.currency ?? "").toUpperCase() === "USD") ? "USD" : "INR";
}

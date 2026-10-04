import type { ApiEnvelope } from "@/lib/auth/types";

import { cartItemFromPayload } from "./payload";
import type { AddToCartResponse, CartListResponse, PaymentCallbackResponse, PaymentInitResponse } from "./types";

export function mockAddToCart(payload: Record<string, unknown>): AddToCartResponse {
  const item = cartItemFromPayload(payload);
  return { status: true, mock: true, message: "Added to cart (mock)", data: item };
}

export function mockGetCartDetails(): CartListResponse {
  return { status: true, mock: true, data: [] };
}

export function mockRemoveCartItem(): ApiEnvelope {
  return { status: true, mock: true, message: "Removed" };
}

/** Server is stateless — client writes the order after this returns. */
export function mockPaymentInit(): PaymentInitResponse {
  return {
    status: true,
    success: true,
    mock: true,
    data: {
      merchant_key: "rzp_test_mock_key",
      payable_amount: 0,
      order_id: `order_mock_${Date.now()}`,
    },
  };
}

export function mockPaymentCallback(): PaymentCallbackResponse {
  return { status: true, success: true, mock: true, message: "Payment completed (mock)" };
}

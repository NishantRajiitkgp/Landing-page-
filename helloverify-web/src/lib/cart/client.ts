/** Browser calls to `/api/cart/*`. Mock lines persist in sessionStorage. */

import { getAuthToken } from "@/lib/auth/storage";
import type { ApiEnvelope } from "@/lib/auth/types";

import { appendMockCart, completeMockPayment, readMockCart, removeMockCartItem } from "./storage";
import type {
  AddToCartResponse,
  CartItem,
  CartListResponse,
  PaymentCallbackResponse,
  PaymentInitResponse,
  RazorpaySuccessPayload,
} from "./types";

async function call<T>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json: T & { message?: string };
  try {
    json = (await res.json()) as T & { message?: string };
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed (${res.status})`);
  }
  return json;
}

export async function addToCart(payload: Record<string, unknown>): Promise<AddToCartResponse> {
  const json = await call<AddToCartResponse>("/api/cart/add", payload);
  if (json.mock && json.data && typeof json.data === "object") {
    appendMockCart(json.data as CartItem);
  }
  return json;
}

export async function getCartDetails(): Promise<CartListResponse> {
  const json = await call<CartListResponse>("/api/cart/list");
  if (json.mock) {
    return { status: true, mock: true, data: readMockCart() };
  }
  return json;
}

export async function removeCartItem(uuid: string): Promise<ApiEnvelope> {
  const json = await call<ApiEnvelope>("/api/cart/remove", { uuid });
  if (json.mock) removeMockCartItem(uuid);
  return json;
}

export async function paymentInitCartIds(
  userCardIds: string[],
  is_cart_payment: boolean,
  currency: string,
): Promise<PaymentInitResponse> {
  return call<PaymentInitResponse>("/api/cart/pay-init", {
    user_card_ids: userCardIds,
    is_cart_payment,
    currency,
  });
}

export async function paymentCallback(payload: RazorpaySuccessPayload): Promise<PaymentCallbackResponse> {
  return call<PaymentCallbackResponse>("/api/cart/pay-callback", payload);
}

/** Mock carts never open Razorpay — the order is written here. */
export function finishMockPayment(): PaymentCallbackResponse {
  return completeMockPayment();
}

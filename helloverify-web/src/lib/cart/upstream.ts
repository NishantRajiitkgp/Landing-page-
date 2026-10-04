import "server-only";

import { travelUserApi } from "@/lib/auth/env";
import type { ApiEnvelope } from "@/lib/auth/types";

import type { AddToCartResponse, CartListResponse, PaymentCallbackResponse, PaymentInitResponse, RazorpaySuccessPayload } from "./types";

const TIMEOUT_MS = 12_000;

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const err = (await res.json()) as { message?: string };
      if (err?.message) message = err.message;
    } catch {
      /* empty */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function authHeaders(token: string | null): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function upstreamAddToCart(
  payload: Record<string, unknown>,
  token: string | null,
): Promise<AddToCartResponse> {
  const res = await timedFetch(`${travelUserApi()}/add-to-cart`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return readJson<AddToCartResponse>(res);
}

export async function upstreamCartList(token: string | null): Promise<CartListResponse> {
  const res = await timedFetch(`${travelUserApi()}/cart-list`, {
    headers: authHeaders(token),
  });
  return readJson<CartListResponse>(res);
}

export async function upstreamRemoveCartItem(
  payload: Record<string, unknown>,
  token: string | null,
): Promise<ApiEnvelope> {
  const res = await timedFetch(`${travelUserApi()}/remove-order-from-cart/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return readJson<ApiEnvelope>(res);
}

export async function upstreamPaymentInit(
  body: { user_card_ids: string[]; is_cart_payment: boolean; currency: string },
  token: string | null,
): Promise<PaymentInitResponse> {
  const res = await timedFetch(`${travelUserApi()}/payment-init`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  return readJson<PaymentInitResponse>(res);
}

export async function upstreamPaymentCallback(
  payload: RazorpaySuccessPayload,
  token: string | null,
): Promise<PaymentCallbackResponse> {
  const res = await timedFetch(`${travelUserApi()}/payment-callback`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return readJson<PaymentCallbackResponse>(res);
}

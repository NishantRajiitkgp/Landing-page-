/** Cart + payment shapes from the old SPA `travelAssistance.ts`. */

import type { ApiEnvelope } from "@/lib/auth/types";

export type CartItem = {
  uuid?: string;
  package?: string;
  package_type?: string;
  visa?: string;
  country?: string;
  unit_count?: number;
  total_amount?: number;
  currency?: string;
  check_code?: string;
  check_name?: string;
  persons?: number;
  price?: number;
};

export type AddToCartResponse = ApiEnvelope & {
  mock?: boolean;
  cart?: {
    items?: Record<string, unknown>[];
  };
};

export type CartListResponse = ApiEnvelope<CartItem[]> & {
  mock?: boolean;
};

export type PaymentInitData = {
  merchant_key: string;
  payable_amount: number;
  order_id: string;
};

export type PaymentInitResponse = ApiEnvelope<PaymentInitData> & {
  mock?: boolean;
  success?: boolean;
};

export type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type PaymentCallbackResponse = ApiEnvelope & {
  mock?: boolean;
  success?: boolean;
};

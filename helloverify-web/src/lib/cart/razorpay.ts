/** Load checkout.js and open the Razorpay modal. Live carts only. */

import type { RazorpaySuccessPayload } from "./types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

export function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-razorpay]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.dataset.razorpay = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay script failed"));
    document.head.appendChild(script);
  });
}

export type RazorpayOpenOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (payload: RazorpaySuccessPayload) => void;
  onDismiss?: () => void;
};

export async function openRazorpayCheckout(options: RazorpayOpenOptions): Promise<void> {
  await loadRazorpayScript();
  if (!window.Razorpay) throw new Error("Razorpay unavailable");

  const rzp = new window.Razorpay({
    key: options.key,
    amount: options.amount,
    currency: options.currency,
    name: options.name,
    description: options.description,
    order_id: options.order_id,
    handler: (res: RazorpaySuccessPayload) => options.onSuccess(res),
    prefill: options.prefill,
    theme: { color: "#15140F" },
    modal: {
      ondismiss: () => options.onDismiss?.(),
    },
  });
  rzp.open();
}

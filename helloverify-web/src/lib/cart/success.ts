import type { ApiEnvelope } from "@/lib/auth/types";

/** Angular add-to-cart treats any truthy JSON body as success. */
export function isAddToCartSuccess(res: ApiEnvelope | undefined): boolean {
  if (!res || typeof res !== "object") return false;
  if (res.status === true || res.success === true) return true;
  const body = res as Record<string, unknown>;
  if (body.cart && typeof body.cart === "object") return true;
  const msg = String(res.message ?? "").toLowerCase();
  return msg.includes("success") || msg.includes("added to cart");
}

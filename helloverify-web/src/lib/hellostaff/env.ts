/** Hello Staff checkout runtime. Unset `HELLOSTAFF_LIVE` is the demo in
 *  development: the OTP is 123456 and nothing reaches api.helloverify.com. */
import "server-only";

import { createHash } from "node:crypto";

import { demoAllowed } from "@/lib/runtime/demo";

const TRUE = new Set(["1", "true", "yes"]);

/** Always live in production, so a missing setting answers `not_connected`
 *  rather than accepting 123456. */
export function helloStaffLive(): boolean {
  return !demoAllowed() || TRUE.has((process.env.HELLOSTAFF_LIVE ?? "").trim().toLowerCase());
}

/** Seals the case cookie. Live refuses to run without a real secret. */
export function hsSealKey(): Buffer | null {
  const secret = process.env.HELLOSTAFF_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return createHash("sha256").update(secret).digest();
  if (helloStaffLive()) return null;
  return createHash("sha256").update("helloverify-hellostaff-demo-only").digest();
}

/** The base64 `user:password` Hello Staff sends to `payment-request-case` and
 *  `case-payment-callback`. A credential: it never leaves the server. */
export function hsPaymentAuth(): string | null {
  return process.env.HELLOSTAFF_PAYMENT_BASIC_AUTH?.trim() || null;
}

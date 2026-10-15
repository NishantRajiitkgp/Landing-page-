/** Italy partner account runtime. Unset is the demo. */
import "server-only";

import { createHash } from "node:crypto";

import { demoAllowed } from "@/lib/runtime/demo";

const TRUE = new Set(["1", "true", "yes"]);

/** Always live in production; see `momLive`. */
export function italyLive(): boolean {
  return !demoAllowed() || TRUE.has((process.env.ITALY_PARTNER_LIVE ?? "").trim().toLowerCase());
}

/** 32-byte key. Live refuses to run without a real secret. */
export function sealKey(): Buffer | null {
  const secret = process.env.ITALY_PARTNER_SECRET?.trim();
  if (secret && secret.length >= 32) return createHash("sha256").update(secret).digest();
  if (italyLive()) return null;
  return createHash("sha256").update("helloverify-italy-partner-demo-only").digest();
}

/** MOM applicant account runtime. Unset is the demo: codes are 123456 and
 *  accounts live in a sealed cookie on the applicant's own browser. */
import "server-only";

import { createHash } from "node:crypto";

import { demoAllowed } from "@/lib/runtime/demo";

const TRUE = new Set(["1", "true", "yes"]);

/** Always live in production, so a missing setting answers `not_connected`
 *  rather than accepting 123456. */
export function momLive(): boolean {
  return !demoAllowed() || TRUE.has((process.env.MOM_APPLY_LIVE ?? "").trim().toLowerCase());
}

/** 32-byte key for sealed cookies and tokens. Live refuses to run without a
 *  real secret; the demo falls back to a fixed key, which protects nothing but
 *  demo data. */
export function sealKey(): Buffer | null {
  const secret = process.env.MOM_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return createHash("sha256").update(secret).digest();
  if (momLive()) return null;
  return createHash("sha256").update("helloverify-mom-demo-only").digest();
}

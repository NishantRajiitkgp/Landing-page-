/** Employer account runtime. Same live switch and secret as the applicant
 *  flow, with its own derived key so applicant tokens never open it. */
import "server-only";

import { createHash } from "node:crypto";

import { sealKey } from "@/lib/mom/account/env";

export { momLive as orgLive } from "@/lib/mom/account/env";

export function orgKey(): Buffer | null {
  const base = sealKey();
  return base ? createHash("sha256").update("mom-org:").update(base).digest() : null;
}

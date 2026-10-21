import { fill } from "@/components/momapply/fill";
import type { HellostaffCopy } from "@/lib/copy/hellostaff";
import type { HsFailure } from "@/lib/hellostaff/types";

/** The backend's own message where it sent one (Hello Staff shows those
 *  verbatim), otherwise ours for the code. */
export function failText(t: HellostaffCopy, f: HsFailure): string {
  if (f.code === "rate_limited") return fill(t.errors.rate_limited, { s: f.retryAfter ?? 30 });
  if (f.message && (f.code === "invalid_code" || f.code === "upstream")) return f.message;
  return t.errors[f.code];
}

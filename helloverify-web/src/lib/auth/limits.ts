/** OTP send / verify limits for `/api/auth/*` and `/api/authority/*`. Same
 *  limiter and client identity as the MOM account routes, with their own keys. */
import "server-only";

import { clientKey, type Limit } from "@/lib/mom/account/limits";

export { spend } from "@/lib/mom/account/limits";

const MINUTE = 60_000;

export function otpLimits(scope: string, headers: Headers) {
  const client = clientKey(headers);
  return {
    send: (target: string): Limit[] => [
      [`${scope}:cool:${target}`, 1, 30_000],
      [`${scope}:send:${target}`, 5, 10 * MINUTE],
      [`${scope}:send-ip:${client}`, 20, 10 * MINUTE],
    ],
    verify: (target: string): Limit[] => [
      [`${scope}:verify:${target}`, 8, 10 * MINUTE],
      [`${scope}:verify-ip:${client}`, 30, 10 * MINUTE],
    ],
  };
}

export function tooMany(retryAfter: number, extra: Record<string, unknown> = {}) {
  return Response.json(
    { status: false, ...extra, message: `Too many attempts. Try again in ${retryAfter} seconds.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

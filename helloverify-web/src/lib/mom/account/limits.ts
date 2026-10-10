/** Abuse limits for codes and passwords. Same limiter and client identity as
 *  the lead form, with their own keys. */
import "server-only";

import { leadsConfig } from "@/lib/leads/env";
import { identifyClient } from "@/lib/leads/identity";
import { rateLimiter } from "@/lib/leads/ratelimit";

const MINUTE = 60_000;

/** [key, max, windowMs] */
export type Limit = readonly [string, number, number];

export function clientKey(headers: Headers): string {
  return identifyClient(headers, leadsConfig().trustedProxyHops).key;
}

export const LIMITS = {
  sendCode: (target: string, client: string): Limit[] => [
    [`mom:cool:${target}`, 1, 30_000],
    [`mom:send:${target}`, 5, 10 * MINUTE],
    [`mom:send-ip:${client}`, 20, 10 * MINUTE],
  ],
  verifyCode: (target: string): Limit[] => [[`mom:verify:${target}`, 8, 10 * MINUTE]],
  signIn: (email: string, client: string): Limit[] => [
    [`mom:signin:${email}`, 8, 10 * MINUTE],
    [`mom:signin-ip:${client}`, 30, 10 * MINUTE],
  ],
  forgot: (email: string, client: string): Limit[] => [
    [`mom:forgot:${email}`, 3, 10 * MINUTE],
    [`mom:forgot-ip:${client}`, 10, 10 * MINUTE],
  ],
};

/** Seconds to wait if any limit is spent, otherwise 0. */
export async function spend(limits: Limit[]): Promise<number> {
  for (const [key, max, windowMs] of limits) {
    const decision = await rateLimiter.consume(key, max, windowMs);
    if (!decision.allowed) return decision.retryAfterSeconds;
  }
  return 0;
}

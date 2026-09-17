/** The abuse screen (BUILD-SPEC §10 defence layers 2–5).
 *
 *  Runs cheapest-first, and runs the rate limiter FIRST of all so that every
 *  submission consumes budget — including the ones a later layer rejects. A
 *  bot that trips the honeypot on every attempt should still exhaust its own
 *  allowance rather than get unlimited free tries at finding a gap.
 *
 *  No single layer here is sufficient and none is claimed to be. Together they
 *  replace what the old build had between the public internet and the CRM,
 *  which was nothing at all (AUDIT E1).
 */
import "server-only";

import { assessEmail } from "./email";
import { leadsConfig } from "./env";
import { identifyClient, type Identity } from "./identity";
import { logEvent } from "./log";
import { rateLimiter } from "./ratelimit";
import type { Lead, Signals } from "./schema";

export type RejectionKind =
  | "rate-limited"
  | "honeypot"
  | "too-fast"
  | "email-disposable"
  | "email-undeliverable";

export type AbuseVerdict =
  | { allowed: true; identity: Identity }
  | {
      allowed: false;
      kind: RejectionKind;
      identity: Identity;
      retryAfterSeconds?: number;
    };

export async function screenSubmission(args: {
  headers: Headers;
  lead: Lead;
  signals: Signals;
}): Promise<AbuseVerdict> {
  const config = leadsConfig();
  const identity = identifyClient(args.headers, config.trustedProxyHops);

  const reject = (kind: RejectionKind, retryAfterSeconds?: number): AbuseVerdict => {
    logEvent("INFO", "leads.rejected", {
      kind,
      identity: identity.key,
      identityTrusted: identity.trusted,
      retryAfterSeconds,
    });
    return { allowed: false, kind, identity, retryAfterSeconds };
  };

  // 2. Rate limit per identity.
  const decision = await rateLimiter.consume(
    identity.key,
    config.rateLimit.max,
    config.rateLimit.windowMs,
  );
  if (!decision.allowed) return reject("rate-limited", decision.retryAfterSeconds);

  // 5. Honeypot — a field no human can see, so any content is automation.
  if (args.signals.honeypot && args.signals.honeypot.trim() !== "") {
    return reject("honeypot");
  }

  // 5. Timing. Absent signal means "no information", not "suspicious": a
  // visitor with JavaScript disabled submits a perfectly valid form and sends
  // no elapsed time at all.
  if (args.signals.elapsedMs !== undefined && args.signals.elapsedMs < config.minFillMs) {
    return reject("too-fast");
  }

  // 4. Email quality. Last, because it is the only layer that may touch the
  // network, and it fails open by design.
  const verdict = await assessEmail(args.lead.email, { mxCheck: config.mxCheck });
  if (verdict === "disposable") return reject("email-disposable");
  if (verdict === "undeliverable") return reject("email-undeliverable");

  return { allowed: true, identity };
}

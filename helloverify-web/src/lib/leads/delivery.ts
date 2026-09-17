/** Where a validated lead goes, and what happens when it cannot get there.
 *
 *  The point of this module is that "we failed to deliver" is a first-class
 *  outcome with its own user-facing state, not an exception that resolves to a
 *  cheerful thank-you page. AUDIT E1's form posted straight to Zoho from the
 *  browser; the failure mode nobody could see was a lead that vanished. The
 *  contract here is: a lead is either delivered, or it is written somewhere a
 *  human can recover it AND the user is told to use another route.
 */
import "server-only";

import { zohoConfig, zohoSink } from "@/lib/integrations/zoho";
import { logEvent } from "./log";
import type { Lead } from "./schema";

export type DeliveryFailure =
  /** No CRM credentials in this environment. A misconfiguration, not a bug. */
  | "not-configured"
  /** Network, timeout, or 5xx. Worth one retry. */
  | "upstream-error"
  /** The CRM answered and declined. Includes the HTTP 200 + failure-body case,
   *  which is how the old integration lost leads silently (BUILD-SPEC §10). */
  | "upstream-rejected";

export type DeliveryOutcome =
  | { ok: true; via: string; reference?: string }
  | { ok: false; reason: DeliveryFailure; detail: string };

export interface DeliveryContext {
  receivedAt: Date;
  /** Coarse identity, for correlating a log line with a rate-limit decision.
   *  Not stored in the CRM. */
  identity?: string;
}

export interface LeadSink {
  readonly name: string;
  deliver(lead: Lead, ctx: DeliveryContext): Promise<DeliveryOutcome>;
}

/** The lead in full, on the failure path only.
 *
 *  This deliberately writes name, email and phone into the application log,
 *  because the alternative is losing the enquiry entirely. It is a privacy
 *  trade, and it is the kind of thing a DPA can have an opinion about — if
 *  retention rules require it, redact here and accept that recovery then needs
 *  the user to resubmit. */
function recordUndelivered(lead: Lead, ctx: DeliveryContext, outcome: DeliveryOutcome) {
  if (outcome.ok) return;
  logEvent("ERROR", "lead.undelivered", {
    reason: outcome.reason,
    detail: outcome.detail,
    identity: ctx.identity,
    receivedAt: ctx.receivedAt.toISOString(),
    lead,
  });
}

/** Stands in for the CRM when no credentials are configured, so the whole
 *  pipeline — validation, abuse checks, form states — is exercisable locally
 *  without a Zoho account. Never used in production: see `deliverLead`. */
const developmentSink: LeadSink = {
  name: "log",
  async deliver(lead, ctx) {
    logEvent("INFO", "lead.accepted.no-crm-configured", {
      identity: ctx.identity,
      lead,
    });
    return { ok: true, via: "log" };
  },
};

/** Zoho when it is configured, nothing when it is not.
 *
 *  Resolved per call rather than at module load: the sink must appear as soon
 *  as credentials exist in the environment, without a rebuild. */
function resolveSink(): LeadSink | null {
  return zohoConfig() ? zohoSink : null;
}

const isProduction = process.env.NODE_ENV === "production";

/** Deliver, with one retry on a transport-shaped failure. A rejection from the
 *  CRM is not retried — sending the same invalid record twice just produces
 *  two failures. */
export async function deliverLead(lead: Lead, ctx: DeliveryContext): Promise<DeliveryOutcome> {
  const sink = resolveSink();

  if (!sink) {
    if (!isProduction) return developmentSink.deliver(lead, ctx);
    const outcome: DeliveryOutcome = {
      ok: false,
      reason: "not-configured",
      detail: "No CRM sink is configured in this environment.",
    };
    recordUndelivered(lead, ctx, outcome);
    return outcome;
  }

  let outcome = await attempt(sink, lead, ctx);
  if (!outcome.ok && outcome.reason === "upstream-error") {
    outcome = await attempt(sink, lead, ctx);
  }

  if (!outcome.ok) recordUndelivered(lead, ctx, outcome);
  return outcome;
}

async function attempt(sink: LeadSink, lead: Lead, ctx: DeliveryContext): Promise<DeliveryOutcome> {
  try {
    return await sink.deliver(lead, ctx);
  } catch (error) {
    return {
      ok: false,
      reason: "upstream-error",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

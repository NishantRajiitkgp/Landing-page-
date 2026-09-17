/** The lead submission entry point (BUILD-SPEC §10).
 *
 *  A Server Action rather than `app/api/leads/route.ts`. §10's own diagram and
 *  §5's rendering table both say Server Action; §4's repo listing is the
 *  outlier. Three things settle it: Next compares `Origin` against
 *  `Host`/`X-Forwarded-Host` on every action POST, so CSRF protection is
 *  framework-level rather than hand-written; there is no stable public URL for
 *  a spam bot to farm, which is the specific failure AUDIT E1 describes; and a
 *  page with an action stays statically prerendered, where a POST route
 *  handler would be the build's first dynamic route and break §5's assertion.
 *
 *  The Next docs are explicit that framework protection is not a substitute
 *  for treating this as an untrusted entry point — everything below assumes
 *  the POST did not come from our form.
 */
"use server";

import { headers } from "next/headers";

import { screenSubmission, type AbuseVerdict } from "@/lib/leads/abuse";
import { FIELDS, type LeadField } from "@/lib/leads/constraints";
import { deliverLead } from "@/lib/leads/delivery";
import { leadsConfig } from "@/lib/leads/env";
import { leadMessages } from "@/lib/leads/messages";
import { parseSubmission } from "@/lib/leads/schema";
import type { LeadFormState } from "@/lib/leads/state";

/** The user's own input, read back verbatim so a failed submission does not
 *  cost them their typing. Only the known fields — never the whole FormData,
 *  which also carries React's `$ACTION_` entries and the honeypot. */
function echo(form: FormData): Partial<Record<LeadField, string>> {
  const values: Partial<Record<LeadField, string>> = {};
  for (const field of Object.keys(FIELDS) as LeadField[]) {
    const raw = form.get(FIELDS[field]);
    if (typeof raw === "string" && raw !== "") values[field] = raw;
  }
  return values;
}

function rejectionMessage(verdict: Extract<AbuseVerdict, { allowed: false }>, fallbackEmail: string) {
  switch (verdict.kind) {
    case "rate-limited":
      return leadMessages.rateLimited(verdict.retryAfterSeconds ?? 60, fallbackEmail);
    case "email-disposable":
      return leadMessages.disposableEmail;
    case "email-undeliverable":
      return leadMessages.undeliverableEmail;
    case "honeypot":
    case "too-fast":
      return leadMessages.suspicious(fallbackEmail);
  }
}

export async function submitLead(
  _previous: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  // Changes every submission so the form's live region re-announces an
  // outcome whose wording did not change.
  const token = Date.now();
  const { fallbackEmail } = leadsConfig();
  const values = echo(form);

  // 1. The schema is the contract. Validation runs BEFORE the rate limiter on
  //    purpose: a person who makes five typos should not be locked out, and a
  //    rejected parse costs nothing — no network, no CRM, no state.
  const parsed = parseSubmission(form);
  if (!parsed.ok) {
    return {
      status: "invalid",
      message: leadMessages.invalid,
      fieldErrors: parsed.fieldErrors,
      values,
      token,
    };
  }

  // 2-5. Rate limit, honeypot, timing, email quality.
  const verdict = await screenSubmission({
    headers: await headers(),
    lead: parsed.lead,
    signals: parsed.signals,
  });

  if (!verdict.allowed) {
    return {
      status: "rejected",
      message: rejectionMessage(verdict, fallbackEmail),
      retryAfterSeconds: verdict.retryAfterSeconds,
      values,
      token,
    };
  }

  // 6. Deliver, or say so plainly. `deliverLead` has already written the lead
  //    to the log at ERROR by the time a failure gets back here.
  const outcome = await deliverLead(parsed.lead, {
    receivedAt: new Date(),
    identity: verdict.identity.key,
  });

  if (!outcome.ok) {
    return { status: "degraded", message: leadMessages.degraded(fallbackEmail), values, token };
  }

  return { status: "success", message: leadMessages.success, token };
}

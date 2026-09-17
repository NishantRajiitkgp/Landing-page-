/** Zoho CRM REST v8 bridge. SERVER ONLY (BUILD-SPEC §4 rule 3, AUDIT E1).
 *
 *  This module is the structural fix for E1. The old build posted to Zoho's
 *  Web-to-Lead endpoint from the browser with tokens compiled into the bundle,
 *  using `mode: 'no-cors'` — so the response was opaque and the application
 *  could not tell a delivered lead from a dropped one. Every "thank you" it
 *  ever showed was unverified.
 *
 *  REST v8 fixes both halves: the refresh token is a real server secret, and
 *  the response says per record whether it was accepted, so `deliverLead`'s
 *  distinction between delivered and degraded is actually enforceable.
 *
 *  `import "server-only"` makes a client import a build error rather than a
 *  code-review catch.
 */
import "server-only";

import { logEvent, logOnce } from "@/lib/leads/log";
import type { DeliveryOutcome, LeadSink } from "@/lib/leads/delivery";
import type { Lead } from "@/lib/leads/schema";

import { toZohoLead } from "./zoho-fields";

const TIMEOUT_MS = 8_000;
/** Refresh a little before expiry so a request never races the boundary. */
const TOKEN_SKEW_MS = 60_000;

interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accountsHost: string;
  leadSource?: string;
}

export function zohoConfig(): ZohoConfig | null {
  const clientId = process.env.ZOHO_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_CLIENT_SECRET?.trim();
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) return null;

  return {
    clientId,
    clientSecret,
    refreshToken,
    accountsHost: process.env.ZOHO_ACCOUNTS_HOST?.trim() || "https://accounts.zoho.com",
    leadSource: process.env.ZOHO_LEAD_SOURCE?.trim() || undefined,
  };
}

interface AccessToken {
  value: string;
  apiDomain: string;
  expiresAt: number;
}

/** On globalThis so a dev hot reload does not discard a valid token and burn
 *  refresh calls, which Zoho rate-limits. */
const globalRef = globalThis as typeof globalThis & {
  __hvZohoToken?: AccessToken;
  __hvZohoTokenInflight?: Promise<AccessToken>;
  __hvZohoLeadSourceChecked?: boolean;
};

async function withTimeout(input: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

/** Exchanges the long-lived refresh token for a short-lived access token.
 *
 *  Zoho's refresh endpoint answers HTTP 200 with `{"error": "..."}` for a
 *  revoked or invalid token, so the body has to be inspected — checking
 *  `res.ok` alone reports success and then fails confusingly downstream. The
 *  same shape of mistake is what made the old Web-to-Lead path unobservable. */
async function refreshAccessToken(config: ZohoConfig): Promise<AccessToken> {
  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });

  const res = await withTimeout(`${config.accountsHost}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const body = (await res.json().catch(() => null)) as
    | { access_token?: string; expires_in?: number; api_domain?: string; error?: string }
    | null;

  if (!res.ok || !body || body.error || !body.access_token) {
    throw new Error(`Zoho token refresh failed (HTTP ${res.status}): ${body?.error ?? "no access_token"}`);
  }

  return {
    value: body.access_token,
    // Zoho tells us which data centre to call; trusting it beats hardcoding a
    // host that silently 401s when the org lives in another region.
    apiDomain: body.api_domain ?? "https://www.zohoapis.com",
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 - TOKEN_SKEW_MS,
  };
}

/** Single-flight: concurrent submissions share one refresh rather than racing
 *  to spend the refresh-call quota. */
async function accessToken(config: ZohoConfig): Promise<AccessToken> {
  const cached = globalRef.__hvZohoToken;
  if (cached && cached.expiresAt > Date.now()) return cached;

  if (!globalRef.__hvZohoTokenInflight) {
    globalRef.__hvZohoTokenInflight = refreshAccessToken(config)
      .then((token) => {
        globalRef.__hvZohoToken = token;
        return token;
      })
      .finally(() => {
        globalRef.__hvZohoTokenInflight = undefined;
      });
  }

  return globalRef.__hvZohoTokenInflight;
}

/** Verifies the configured `Lead_Source` against the org's real picklist, once
 *  per process, before it can cost anything.
 *
 *  This is the single most expensive mistake available in this integration:
 *  under Web-to-Lead an unknown Lead Source made Zoho answer HTTP 200 and drop
 *  the record. REST reports it instead of swallowing it, but finding out per
 *  lead is still worse than finding out at startup — and the failure is a
 *  config typo, not a runtime condition. Never fatal: a metadata call that
 *  fails must not stop a lead being sent. */
async function checkLeadSource(config: ZohoConfig, token: AccessToken): Promise<void> {
  if (!config.leadSource || globalRef.__hvZohoLeadSourceChecked) return;
  globalRef.__hvZohoLeadSourceChecked = true;

  try {
    const res = await withTimeout(`${token.apiDomain}/crm/v8/settings/fields?module=Leads`, {
      headers: { Authorization: `Zoho-oauthtoken ${token.value}` },
    });
    if (!res.ok) return;

    const body = (await res.json()) as {
      fields?: Array<{ api_name?: string; pick_list_values?: Array<{ actual_value?: string; display_value?: string }> }>;
    };

    const field = body.fields?.find((f) => f.api_name === "Lead_Source");
    const allowed = (field?.pick_list_values ?? [])
      .map((v) => v.actual_value ?? v.display_value)
      .filter((v): v is string => Boolean(v));

    if (allowed.length && !allowed.includes(config.leadSource)) {
      logEvent("ERROR", "zoho.lead-source.invalid", {
        configured: config.leadSource,
        allowed,
        detail:
          "ZOHO_LEAD_SOURCE is not in the Leads Lead_Source picklist. Zoho will reject every record until this matches or the variable is unset.",
      });
    }
  } catch (error) {
    logOnce("INFO", "zoho.lead-source.check-skipped", {
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

/** Reads the per-record verdict out of a v8 insert response.
 *
 *  A 2xx here does NOT mean the lead was stored — v8 reports per record inside
 *  `data[]`, and a rejected record sits under an HTTP 200 alongside a
 *  `status: "error"`. Asserting on the body is the whole point of moving off
 *  Web-to-Lead. */
function readInsertResult(status: number, body: unknown): DeliveryOutcome {
  const record = (body as { data?: Array<Record<string, unknown>> } | null)?.data?.[0];

  if (record?.status === "success") {
    const id = (record.details as { id?: string } | undefined)?.id;
    return { ok: true, via: "zoho", reference: id };
  }

  if (record) {
    const apiName = (record.details as { api_name?: string } | undefined)?.api_name;
    return {
      ok: false,
      reason: "upstream-rejected",
      detail: `${record.code ?? "UNKNOWN"}: ${record.message ?? "record rejected"}${apiName ? ` (field ${apiName})` : ""}`,
    };
  }

  // 401 and 5xx are transport-shaped and worth the retry deliverLead applies;
  // a 4xx with no usable body is not going to succeed on a second attempt.
  const retryable = status === 401 || status >= 500;
  return {
    ok: false,
    reason: retryable ? "upstream-error" : "upstream-rejected",
    detail: `Unreadable Zoho response (HTTP ${status})`,
  };
}

async function deliver(lead: Lead): Promise<DeliveryOutcome> {
  const config = zohoConfig();
  if (!config) {
    return { ok: false, reason: "not-configured", detail: "Zoho credentials are absent." };
  }

  let token = await accessToken(config);
  await checkLeadSource(config, token);

  const send = (t: AccessToken) =>
    withTimeout(`${t.apiDomain}/crm/v8/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${t.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [toZohoLead(lead, config.leadSource)] }),
    });

  let res = await send(token);

  // An access token can be revoked before its stated expiry. Refresh once and
  // retry rather than reporting a failure the next attempt would not hit.
  if (res.status === 401) {
    globalRef.__hvZohoToken = undefined;
    token = await accessToken(config);
    res = await send(token);
  }

  const body = await res.json().catch(() => null);
  return readInsertResult(res.status, body);
}

export const zohoSink: LeadSink = {
  name: "zoho",
  deliver,
};

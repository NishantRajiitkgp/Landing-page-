/** Response helpers shared by the `/api/mom/*` routes. */
import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import type { ApplyErrorCode, ApplyStepName } from "./apply/types";
import type { BatchStep } from "./org/checkout";

const STATUS: Record<ApplyErrorCode, number> = {
  invalid_input: 400,
  invalid_code: 400,
  code_expired: 400,
  unverified: 400,
  duplicate: 409,
  wrong_credentials: 401,
  no_session: 401,
  too_large: 413,
  bad_type: 415,
  rate_limited: 429,
  not_connected: 503,
  upstream: 502,
};

export function reply(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function failure(code: ApplyErrorCode, extra: { field?: string; retryAfter?: number; step?: ApplyStepName | BatchStep } = {}) {
  return reply({ ok: false, code, ...extra }, STATUS[code]);
}

export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

import "server-only";

import { getAuthorityPortal, type AuthorityId } from "./portals";

const TRANSIENT = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_RETRIES = 4;

class AuthorityHttpError extends Error {
  status: number;
  retryable: boolean;
  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthorityHttpError";
    this.status = status;
    this.retryable = TRANSIENT.has(status);
  }
}

async function readPayload(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Only GETs retry: a timed-out POST may already have sent an SMS or created
 *  a registration upstream. */
export async function authorityRequest(
  authorityId: AuthorityId,
  path: string,
  init: RequestInit,
): Promise<Record<string, unknown>> {
  const base = getAuthorityPortal(authorityId).apiBase;
  const retries = (init.method ?? "GET") === "GET" ? MAX_RETRIES : 0;
  let last: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${base}${path}`, init);
      const json = await readPayload(res);
      if (res.ok) return json;
      throw new AuthorityHttpError(String(json.message ?? `Request failed (${res.status})`), res.status);
    } catch (e) {
      last = e instanceof Error ? e : new Error(String(e));
      const retry = attempt < retries && (e instanceof AuthorityHttpError ? e.retryable : true);
      if (!retry) throw last;
    }
    await sleep(500 * 2 ** attempt);
  }
  throw last ?? new Error("Request failed");
}

export function authorityPost(authorityId: AuthorityId, path: string, body: unknown) {
  return authorityRequest(authorityId, path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function authorityGet(authorityId: AuthorityId, path: string) {
  return authorityRequest(authorityId, path, { method: "GET" });
}

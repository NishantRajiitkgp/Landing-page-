/** Forward OTP calls to the travel-auth host. Server-only — the browser never
 *  sees `TRAVEL_AUTH_BASE`.
 */
import "server-only";

import { travelAuthApi } from "./env";
import { UpstreamFailure } from "./failure";
import type { ApiEnvelope, OtpSendResponse, OtpVerifyResponse, TravelUser } from "./types";

const TIMEOUT_MS = 12_000;

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new UpstreamFailure(res.status);
  return (await res.json()) as T;
}

function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

export async function upstreamSendOtp(mobile: string): Promise<OtpSendResponse> {
  const form = new FormData();
  form.append("mobile_num", mobile);
  const res = await timedFetch(`${travelAuthApi()}/send-otp`, { method: "POST", body: form });
  return readJson<OtpSendResponse>(res);
}

export async function upstreamLogin(user: string, otp: string): Promise<OtpVerifyResponse> {
  const res = await timedFetch(`${travelAuthApi()}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, otp }),
  });
  return readJson<OtpVerifyResponse>(res);
}

export async function upstreamSaveProfile(
  payload: { name: string; email: string; mobile_num: string; gender: string },
  token: string | null,
): Promise<ApiEnvelope<TravelUser>> {
  const form = new FormData();
  for (const key of Object.keys(payload) as (keyof typeof payload)[]) {
    form.append(key, payload[key]);
  }
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await timedFetch(`${travelAuthApi()}/save-login-user-detail`, {
    method: "POST",
    headers,
    body: form,
  });
  return readJson<ApiEnvelope<TravelUser>>(res);
}

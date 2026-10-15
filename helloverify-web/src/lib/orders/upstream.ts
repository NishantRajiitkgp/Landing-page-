import "server-only";

import { smbApi, travelUserApi } from "@/lib/auth/env";
import { UpstreamFailure } from "@/lib/auth/failure";

import type { InviteResponse, OrderListResponse, SendInvitePayload, SmbSendInvitePayload } from "./types";

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

function authHeaders(token: string | null): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeInvitePackageId(packageId: string | number): string | number {
  if (typeof packageId === "number") return packageId;
  const trimmed = packageId.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export async function upstreamOrderList(token: string | null): Promise<OrderListResponse> {
  const res = await timedFetch(`${travelUserApi()}/order-list`, {
    headers: authHeaders(token),
  });
  return readJson<OrderListResponse>(res);
}

export async function upstreamSmbInvite(
  payload: SmbSendInvitePayload,
  token: string | null,
): Promise<InviteResponse> {
  const res = await timedFetch(`${smbApi()}/send-invite/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      uuid: payload.uuid,
      package_id: normalizeInvitePackageId(payload.package_id),
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      mobile_number: payload.mobile_number,
    }),
  });
  return readJson<InviteResponse>(res);
}

export async function upstreamTravelInvite(
  payload: SendInvitePayload,
  token: string | null,
): Promise<InviteResponse> {
  const res = await timedFetch(`${travelUserApi()}/save-member-details`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return readJson<InviteResponse>(res);
}

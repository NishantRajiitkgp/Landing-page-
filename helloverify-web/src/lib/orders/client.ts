/** Browser calls to `/api/orders/*`. Mock orders persist in sessionStorage. */

import { getAuthToken } from "@/lib/auth/storage";
import { applyMockSmbInvite, applyMockTravelInvite, readMockOrders } from "@/lib/cart/storage";

import type { InviteResponse, OrderListResponse, SendInvitePayload, SmbSendInvitePayload } from "./types";

async function call<T>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json: T & { message?: string };
  try {
    json = (await res.json()) as T & { message?: string };
  } catch {
    throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed (${res.status})`);
  }
  return json;
}

export async function getOrderList(): Promise<OrderListResponse> {
  const json = await call<OrderListResponse>("/api/orders/list");
  if (json.mock) {
    return { status: true, mock: true, data: readMockOrders() };
  }
  return json;
}

export async function sendSmbInvite(payload: SmbSendInvitePayload): Promise<InviteResponse> {
  const json = await call<InviteResponse>("/api/orders/invite-smb", payload);
  if (json.mock) {
    const { case_id } = applyMockSmbInvite(payload);
    return { ...json, data: { case_id } };
  }
  return json;
}

export async function sendCandidateInvite(payload: SendInvitePayload): Promise<InviteResponse> {
  const json = await call<InviteResponse>("/api/orders/invite-travel", payload);
  if (json.mock) {
    const { case_id } = applyMockTravelInvite(payload);
    return { ...json, data: { case_id } };
  }
  return json;
}

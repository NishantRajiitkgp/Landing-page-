/** Browser calls to `/api/auth/*`. Persist happens here, not on the server. */

import {
  clearAuthStorage,
  getAuthToken,
  getPendingMobile,
  persistLoginData,
  persistOtpSendData,
} from "./storage";
import type { ApiEnvelope, OtpSendResponse, OtpVerifyResponse, TravelUser } from "./types";

async function post<T>(path: string, body: unknown, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
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

export async function sendOtp(mobile: string): Promise<OtpSendResponse> {
  clearAuthStorage();
  const json = await post<OtpSendResponse>("/api/auth/send-otp", { mobile });
  if (json.status === true && json.data) {
    persistOtpSendData(json.data, mobile);
  }
  return json;
}

export async function verifyOtp(user: string, otp: string): Promise<OtpVerifyResponse> {
  const json = await post<OtpVerifyResponse>("/api/auth/login", { user, otp });
  if (json.status === true && json.data) {
    const data = json.data as {
      user?: TravelUser & { access_token?: string };
      access_token?: string;
      refresh?: string;
    };
    persistLoginData(
      {
        user: data.user,
        access_token: data.access_token ?? data.user?.access_token,
        refresh: data.refresh,
      },
      getPendingMobile(),
    );
  }
  return json;
}

export async function saveLoginUserDetail(payload: {
  name: string;
  email: string;
  mobile_num: string;
  gender: string;
}): Promise<ApiEnvelope<TravelUser>> {
  const json = await post<ApiEnvelope<TravelUser>>("/api/auth/save-profile", payload, getAuthToken());
  if (json.status === true && json.data) {
    persistLoginData({ user: json.data, access_token: getAuthToken() ?? undefined }, payload.mobile_num);
  }
  return json;
}

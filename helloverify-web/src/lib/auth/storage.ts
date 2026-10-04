/** sessionStorage keys the old SPA used (`travelAuthStorage.ts`).
 *
 *  Browser-only. Callers hydrate after mount so SSR HTML stays logged-out and
 *  does not mismatch. Unlike the old mock, this never calls `localStorage.clear()`.
 */

import type { SessionPayload, StoredCredentials, TravelUser } from "./types";

export const CREDENTIALS_KEY = "currentUser";
export const AUTH_TOKEN_KEY = "authToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const PENDING_MOBILE_KEY = "pending_mobile_num";

function store(): Storage | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage;
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return Date.now() > payload.exp * 1000;
  } catch {
    return true;
  }
}

function normalizeUser(raw: string | TravelUser | undefined, mobileFallback?: string): TravelUser | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    return { uuid: raw, mobile_num: mobileFallback };
  }
  return {
    ...raw,
    mobile_num: raw.mobile_num ?? raw.phone ?? mobileFallback,
  };
}

export function getStoredCredentials(): StoredCredentials | null {
  const raw = store()?.getItem(CREDENTIALS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredCredentials;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return store()?.getItem(AUTH_TOKEN_KEY) ?? null;
}

export function getRefreshToken(): string | null {
  return store()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function setAuthTokens(accessToken: string, refreshToken?: string): void {
  const s = store();
  if (!s) return;
  s.setItem(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) s.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function persistOtpSendData(data: StoredCredentials, mobile_num?: string): void {
  const s = store();
  if (!s) return;
  s.setItem(CREDENTIALS_KEY, JSON.stringify(data));
  if (mobile_num) s.setItem(PENDING_MOBILE_KEY, mobile_num);
}

export function getPendingMobile(): string | undefined {
  return store()?.getItem(PENDING_MOBILE_KEY) ?? undefined;
}

export function persistLoginData(
  data: StoredCredentials & { user?: TravelUser },
  mobileFallback?: string,
): SessionPayload | null {
  const user = normalizeUser(data.user, mobileFallback);
  if (!user) return null;

  const userAccessToken =
    typeof data.user === "object" && data.user && "access_token" in data.user
      ? (data.user as TravelUser & { access_token?: string }).access_token
      : undefined;

  const accessToken = data.access_token ?? userAccessToken;
  const refresh = data.refresh;
  const stored: StoredCredentials = {
    ...data,
    user,
    access_token: accessToken,
    refresh,
  };

  const s = store();
  if (!s) return { user, token: accessToken, refresh };
  s.setItem(CREDENTIALS_KEY, JSON.stringify(stored));
  if (accessToken) setAuthTokens(accessToken, refresh);
  return { user, token: accessToken, refresh };
}

export function readSession(): SessionPayload | null {
  const creds = getStoredCredentials();
  if (!creds) return null;
  const token = getAuthToken() ?? creds.access_token;
  const user = normalizeUser(creds.user);
  if (!user) return null;
  return {
    user,
    token: token ?? undefined,
    refresh: creds.refresh ?? getRefreshToken() ?? undefined,
  };
}

export function writeSession(payload: SessionPayload): void {
  const creds = getStoredCredentials() ?? {};
  persistLoginData({
    ...creds,
    user: payload.user,
    access_token: payload.token ?? creds.access_token,
    refresh: payload.refresh ?? creds.refresh,
  });
}

export function clearSession(): void {
  const s = store();
  if (!s) return;
  s.removeItem(CREDENTIALS_KEY);
  s.removeItem(AUTH_TOKEN_KEY);
  s.removeItem(REFRESH_TOKEN_KEY);
  s.removeItem(PENDING_MOBILE_KEY);
}

/** Auth keys only. The old mock called `localStorage.clear()` / `sessionStorage.clear()`. */
export function clearAuthStorage(): void {
  clearSession();
}

export function hasValidAuthToken(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  if (token.startsWith("mock-")) return true;
  return !isJwtExpired(token);
}

export function getOtpUserToken(): string | null {
  const creds = getStoredCredentials();
  if (!creds?.user) return null;
  return typeof creds.user === "string" ? creds.user : creds.user.uuid ?? null;
}

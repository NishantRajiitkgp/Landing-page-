/** Browser calls to `/api/mom/org/*`. The session is an httpOnly cookie. */
import type { AccountFailure, ForgotBody, SendCodeBody, SignInBody, SignInVerifyBody, VerifyCodeBody } from "@/lib/mom/account/types";

import type { OrgRegisterBody, OrgResult, OrgSessionView, OrgUser } from "./types";

const BASE = "/api/mom/org";

const offline: AccountFailure = { ok: false, code: "upstream" };

async function request<T extends object>(action: string, body?: unknown): Promise<OrgResult<T>> {
  try {
    const res = await fetch(`${BASE}/${action}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as OrgResult<T> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

export const momOrg = {
  session: () => request<OrgSessionView>("session"),
  sendCode: (body: SendCodeBody) => request<{ demo: boolean }>("send-code", body),
  verifyCode: (body: VerifyCodeBody) => request<{ proof: string }>("verify-code", body),
  register: (body: OrgRegisterBody) => request<{ user: OrgUser }>("register", body),
  signIn: (body: SignInBody) =>
    request<{ challenge: string; sentTo: string; expiresIn: number; demo: boolean }>("sign-in", body),
  signInVerify: (body: SignInVerifyBody) => request<{ user: OrgUser }>("sign-in-verify", body),
  forgotPassword: (body: ForgotBody) => request<{ sentTo: string }>("forgot-password", body),
  signOut: () => request("sign-out", {}),
};

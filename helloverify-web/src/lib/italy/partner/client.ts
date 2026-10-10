/** Browser calls to `/api/italy/partner/*`. The session is an httpOnly cookie. */
import type {
  AccountFailure,
  AccountResult,
  ForgotBody,
  Partner,
  RegisterBody,
  SendCodeBody,
  SessionView,
  SignInBody,
  SignInVerifyBody,
  VerifyCodeBody,
} from "./types";

const BASE = "/api/italy/partner";

const offline: AccountFailure = { ok: false, code: "upstream" };

async function request<T extends object>(action: string, body?: unknown): Promise<AccountResult<T>> {
  try {
    const res = await fetch(`${BASE}/${action}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as AccountResult<T> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

export const italyPartner = {
  session: () => request<SessionView>("session"),
  sendCode: (body: SendCodeBody) => request<{ demo: boolean }>("send-code", body),
  verifyCode: (body: VerifyCodeBody) => request<{ proof: string }>("verify-code", body),
  register: (body: RegisterBody) => request<{ partner: Partner }>("register", body),
  signIn: (body: SignInBody) =>
    request<{ challenge: string; sentTo: string; expiresIn: number; demo: boolean }>("sign-in", body),
  signInVerify: (body: SignInVerifyBody) => request<{ partner: Partner }>("sign-in-verify", body),
  forgotPassword: (body: ForgotBody) => request<{ sentTo: string }>("forgot-password", body),
  signOut: () => request("sign-out", {}),
};

/** Browser calls to `/api/authority/:id/:action`. No session is written. */

export type AuthorityClientResult = {
  is_success?: boolean;
  status?: boolean;
  message?: string;
  mock?: boolean;
  url?: string;
  data?: { duplicate_found?: boolean };
  result?: Array<{ Dialingcode: string; country_code?: string; country_name?: string }>;
  physicain?: unknown;
  non_physician?: unknown;
};

async function post(
  authority: string,
  action: string,
  body: Record<string, unknown> = {},
): Promise<AuthorityClientResult> {
  const res = await fetch(`/api/authority/${authority}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as AuthorityClientResult;
  if (!res.ok && !json.message) json.message = `Request failed (${res.status})`;
  return json;
}

export const authorityClient = {
  sendEmailOtp: (authority: string, payload: { email: string; candidate_name: string }) =>
    post(authority, "send-email-otp", payload),
  sendMobileOtp: (
    authority: string,
    payload: { dialing_code: string; mobile: string; candidate_name: string },
  ) => post(authority, "send-mobile-otp", payload),
  verifyOtp: (authority: string, payload: { email?: string; mobile?: string; otp: string }) =>
    post(authority, "verify-otp", payload),
  latestToken: (authority: string, payload: { email: string }) => post(authority, "latest-token", payload),
  invite: (authority: string, payload: Record<string, unknown>) => post(authority, "invite", payload),
  dialCodes: (authority: string) => post(authority, "dial-codes"),
  packages: (authority: string) => post(authority, "packages"),
  forgotPassword: (authority: string, payload: { username: string }) =>
    post(authority, "forgot-password", payload),
  loginHandoff: (authority: string, payload: { email: string; password: string; otp: string }) =>
    post(authority, "login-handoff", payload),
};

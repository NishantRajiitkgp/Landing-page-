/** Wire types for `/api/italy/partner/*`. */

export type Partner = {
  id: string;
  first: string;
  last: string;
  email: string;
  dial: string;
  phone: string;
};

export type AccountErrorCode =
  | "invalid_input"
  | "invalid_code"
  | "code_expired"
  | "duplicate"
  | "unverified"
  | "rate_limited"
  | "wrong_credentials"
  | "no_session"
  | "not_connected"
  | "upstream";

export type AccountFailure = {
  ok: false;
  code: AccountErrorCode;
  field?: string;
  retryAfter?: number;
};

export type AccountResult<T extends object = object> = ({ ok: true } & T) | AccountFailure;

export type SessionView = { partner: Partner | null; demo: boolean };

export type SendCodeBody =
  | { channel: "email"; email: string; name: string }
  | { channel: "phone"; dial: string; phone: string; name: string };

export type VerifyCodeBody =
  | { channel: "email"; email: string; code: string }
  | { channel: "phone"; dial: string; phone: string; code: string };

export type RegisterBody = {
  first: string;
  last: string;
  email: string;
  dial: string;
  phone: string;
  password: string;
  consent: true;
  emailProof: string;
  phoneProof: string;
};

export type SignInBody = { email: string; password: string };
export type SignInVerifyBody = { challenge: string; code: string };
export type ForgotBody = { email: string };

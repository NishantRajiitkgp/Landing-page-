/** Consumer OTP session — same shape as the old SPA (`travelAssistance.ts`). */

export type TravelUser = {
  uuid?: string;
  name?: string;
  email?: string;
  mobile_num?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | string;
};

export type SessionPayload = {
  user: TravelUser;
  token?: string;
  refresh?: string;
};

export type ApiEnvelope<T = unknown> = {
  status?: boolean;
  success?: boolean;
  message?: string;
  data?: T;
  /** Present when the Next route served the in-process mock, not the travel API. */
  mock?: boolean;
};

export type OtpSendResponse = ApiEnvelope<{
  otp_code?: string;
  user?: string;
}>;

export type OtpVerifyResponse = ApiEnvelope<{
  user?: TravelUser;
  access_token?: string;
  refresh?: string;
}>;

/** Held for Part 4 (Buy now → checkout). Unused by the Part 2 modal. */
export type PackageCheckoutDetails = {
  packageType: "home" | "smb" | string;
  packageId?: string;
  packageName: string;
  description?: string;
  priceDisplay?: string;
  unitAmount?: number;
  checkCode?: string;
  visa?: string;
  includedChecks?: string[];
  addToCartBody?: Record<string, unknown>;
};

export type StoredCredentials = {
  user?: string | TravelUser;
  access_token?: string;
  refresh?: string;
  otp_code?: string;
};

export type Gender = "MALE" | "FEMALE" | "OTHER";

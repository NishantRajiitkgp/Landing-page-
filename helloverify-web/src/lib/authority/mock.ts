import { MOM_REGISTRATION_DEFAULTS, getAuthorityPortal, type AuthorityId } from "./portals";
import type { PackageRow } from "./invite";

export const AUTHORITY_MOCK_OTP = "123456";
export const AUTHORITY_MOCK_DUPLICATE_EMAIL = "already@used.com";

export type AuthorityApiResult = {
  is_success?: boolean;
  status?: boolean;
  message?: string;
  mock?: boolean;
  url?: string;
  data?: { duplicate_found?: boolean };
  result?: Array<{ Dialingcode: string; country_code?: string; country_name?: string }>;
};

const MOCK_PACKAGE: PackageRow = {
  client_package_id: 6,
  package: "Education Pack",
  program: MOM_REGISTRATION_DEFAULTS.program,
  sbu: MOM_REGISTRATION_DEFAULTS.sbu,
  section: MOM_REGISTRATION_DEFAULTS.section,
  checks: ["Degree", "Identity"],
};

function ok(extra: AuthorityApiResult = {}): AuthorityApiResult {
  return { is_success: true, status: true, mock: true, ...extra };
}

function fail(message: string): AuthorityApiResult {
  return { is_success: false, status: false, mock: true, message };
}

export function mockSendEmailOtp(email: string): AuthorityApiResult {
  if (email === AUTHORITY_MOCK_DUPLICATE_EMAIL) return fail("Duplicate email");
  return ok();
}

export function mockSendMobileOtp(): AuthorityApiResult {
  return ok();
}

export function mockVerifyOtp(otp: string): AuthorityApiResult {
  return otp === AUTHORITY_MOCK_OTP ? ok() : fail("Invalid OTP");
}

export function mockLatestToken(): AuthorityApiResult {
  return ok();
}

export function mockInvite(email: string): AuthorityApiResult {
  if (email.toLowerCase() === AUTHORITY_MOCK_DUPLICATE_EMAIL) {
    return { status: false, mock: true, message: "Duplicate registration", data: { duplicate_found: true } };
  }
  return ok();
}

export function mockDialCodes(): AuthorityApiResult {
  return ok({
    result: [
      { Dialingcode: "+91", country_code: "IN", country_name: "India" },
      { Dialingcode: "+65", country_code: "SG", country_name: "Singapore" },
      { Dialingcode: "+971", country_code: "AE", country_name: "United Arab Emirates" },
    ],
  });
}

export function mockPackages(): Record<string, unknown> & { status?: boolean; mock?: boolean } {
  return { status: true, mock: true, physicain: [MOCK_PACKAGE], non_physician: [] };
}

export function mockForgotPassword(): AuthorityApiResult {
  return ok({ message: "Reset link sent" });
}

export function mockHandoffUrl(authorityId: AuthorityId): AuthorityApiResult {
  return ok({ url: `${getAuthorityPortal(authorityId).candidateOrigin}/` });
}

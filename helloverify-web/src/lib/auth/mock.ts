/** In-process travel-auth stand-in. OTP `123456`; mobile `9111111111` is first-time.
 *
 *  No sessionStorage — the client persists, the way the live proxy path does.
 *  The handshake id encodes the mobile so verify does not need a server store.
 */
import "server-only";

import { MOCK_NEW_USER_MOBILE, MOCK_OTP } from "./env";

export { MOCK_NEW_USER_MOBILE, MOCK_OTP };
import type { ApiEnvelope, OtpSendResponse, OtpVerifyResponse, TravelUser } from "./types";
import { isMobile, isOtp } from "./validate";

export const MOCK_USER_PREFIX = "mock-user:";

function pause(): Promise<void> {
  return new Promise((r) => setTimeout(r, process.env.VITEST ? 0 : 200));
}

export function mockUserToken(mobile: string): string {
  return `${MOCK_USER_PREFIX}${mobile}`;
}

export function mobileFromMockUser(user: string): string | null {
  return user.startsWith(MOCK_USER_PREFIX) ? user.slice(MOCK_USER_PREFIX.length) : null;
}

export async function mockSendOtp(mobile: string): Promise<OtpSendResponse> {
  await pause();
  if (!isMobile(mobile)) {
    return { status: false, message: "Mobile number must be 10 digits", mock: true };
  }
  return {
    status: true,
    message: "OTP sent (mock). Use 123456",
    mock: true,
    data: { user: mockUserToken(mobile) },
  };
}

export async function mockVerifyOtp(user: string, otp: string): Promise<OtpVerifyResponse> {
  await pause();
  if (!isOtp(otp)) {
    return { status: false, message: "OTP must be 6 digits", mock: true };
  }
  if (otp !== MOCK_OTP) {
    return { status: false, message: "Invalid OTP (mock expects 123456)", mock: true };
  }
  const mobile = mobileFromMockUser(user) ?? MOCK_NEW_USER_MOBILE;
  const isNew = mobile === MOCK_NEW_USER_MOBILE;
  const profile: TravelUser = isNew
    ? { uuid: "mock-uuid-new", mobile_num: mobile }
    : {
        uuid: "mock-uuid-returning",
        name: "Demo User",
        email: "demo@helloverify.com",
        mobile_num: mobile,
        gender: "MALE",
      };
  return {
    status: true,
    message: isNew ? "Account created (mock)" : "Logged in (mock)",
    mock: true,
    data: {
      user: profile,
      access_token: "mock-jwt-token",
      refresh: "mock-refresh-token",
    },
  };
}

export async function mockSaveLoginUserDetail(payload: {
  name: string;
  email: string;
  mobile_num: string;
  gender: string;
}): Promise<ApiEnvelope<TravelUser>> {
  await pause();
  const user: TravelUser = {
    uuid: "mock-uuid-new",
    ...payload,
  };
  return {
    status: true,
    message: "Profile saved (mock)",
    mock: true,
    data: user,
  };
}

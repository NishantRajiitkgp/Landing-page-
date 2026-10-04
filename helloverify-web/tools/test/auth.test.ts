import { check } from "./harness.ts";

import {
  AUTH_TOKEN_KEY,
  CREDENTIALS_KEY,
  clearAuthStorage,
  hasValidAuthToken,
  persistLoginData,
  persistOtpSendData,
  readSession,
} from "../../src/lib/auth/storage.ts";
import { isEmail, isGender, isMobile, isName, isOtp } from "../../src/lib/auth/validate.ts";
import {
  MOCK_NEW_USER_MOBILE,
  MOCK_OTP,
  mockSaveLoginUserDetail,
  mockSendOtp,
  mockUserToken,
  mockVerifyOtp,
} from "../../src/lib/auth/mock.ts";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
}

const session = new MemoryStorage();
const local = new MemoryStorage();
Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: session });
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: local });

console.log("1. field rules match the old LoginDialog");
check("10-digit mobile", isMobile("9876543210"));
check("short mobile fails", !isMobile("98765"));
check("6-digit otp", isOtp("123456"));
check("short otp fails", !isOtp("12345"));
check("latin name of 3+", isName("Ada Lovelace"));
check("short name fails", !isName("Al"));
check("email", isEmail("demo@helloverify.com"));
check("bare word is not email", !isEmail("demo"));
check("MALE is a gender", isGender("MALE"));
check("Men is not a gender token", !isGender("Men"));

console.log("2. mock OTP — 123456 / 9111111111 is first-time");
{
  const sent = await mockSendOtp("9876543210");
  check("send-otp ok", sent.status === true && sent.mock === true, sent);
  check("handshake id encodes mobile", sent.data?.user === mockUserToken("9876543210"), sent.data);

  const bad = await mockVerifyOtp(sent.data?.user ?? "", "000000");
  check("wrong otp rejected", bad.status === false, bad);

  const returning = await mockVerifyOtp(sent.data?.user ?? "", MOCK_OTP);
  check(
    "other mobile is Demo User",
    returning.status === true &&
      returning.data?.user?.name === "Demo User" &&
      !!returning.data?.user?.email,
    returning.data?.user,
  );
  check("mock access token is set", returning.data?.access_token === "mock-jwt-token", returning.data);

  const first = await mockSendOtp(MOCK_NEW_USER_MOBILE);
  const created = await mockVerifyOtp(first.data?.user ?? "", MOCK_OTP);
  check(
    "9111111111 has no name/email (register step)",
    created.status === true && !created.data?.user?.name && !created.data?.user?.email,
    created.data?.user,
  );

  const saved = await mockSaveLoginUserDetail({
    name: "New Person",
    email: "new@helloverify.com",
    mobile_num: MOCK_NEW_USER_MOBILE,
    gender: "FEMALE",
  });
  check("profile save returns the name", saved.status === true && saved.data?.name === "New Person", saved.data);
}

console.log("3. sessionStorage keys match the old SPA; localStorage is left alone");
{
  local.setItem("keep-me", "yes");
  persistOtpSendData({ user: "handshake", otp_code: "123456" }, "9876543210");
  check("otp send writes currentUser", session.getItem(CREDENTIALS_KEY)?.includes("handshake") === true);

  persistLoginData(
    { user: { uuid: "u1", name: "Ada", mobile_num: "9876543210" }, access_token: "mock-jwt-token" },
    "9876543210",
  );
  const sessionNow = readSession();
  check("readSession has the user", sessionNow?.user.name === "Ada", sessionNow);
  check("mock token counts as valid", hasValidAuthToken());

  clearAuthStorage();
  check("auth keys gone", session.getItem(CREDENTIALS_KEY) === null && session.getItem(AUTH_TOKEN_KEY) === null);
  check("unrelated localStorage survives", local.getItem("keep-me") === "yes");
}

{
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 10 })).toString("base64url");
  session.setItem(AUTH_TOKEN_KEY, `x.${payload}.y`);
  check("expired jwt is not valid", hasValidAuthToken() === false);
}

/** Shared field rules — the old LoginDialog's regexes, used by the modal and the API. */

import type { Gender } from "./types";

export const EMAIL_REGEX =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Za-z0-9]([A-Za-z0-9]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)*$/;

export const NAME_REGEX = /^[a-zA-Z\s]{3,}$/;

export const MOBILE_REGEX = /^\d{10}$/;

export const OTP_REGEX = /^\d{6}$/;

const GENDERS = new Set<string>(["MALE", "FEMALE", "OTHER"]);

export function isMobile(value: string): boolean {
  return MOBILE_REGEX.test(value);
}

export function isOtp(value: string): boolean {
  return OTP_REGEX.test(value);
}

export function isName(value: string): boolean {
  return NAME_REGEX.test(value.trim());
}

export function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function isGender(value: string): value is Gender {
  return GENDERS.has(value);
}

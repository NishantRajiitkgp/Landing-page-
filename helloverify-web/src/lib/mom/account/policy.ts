/** Field rules for the MOM applicant account. Pure, so the browser ticks the
 *  same password rules the server enforces. */

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;
export const SIGN_IN_CODE_SECONDS = 300;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const NAME_MAX = 50;
export const PHONE_MIN = 7;
export const PHONE_MAX = 15;

export type PasswordRule = "length" | "letter" | "number";
export const PASSWORD_RULES: readonly PasswordRule[] = ["length", "letter", "number"];

export function passwordRules(password: string): Record<PasswordRule, boolean> {
  return {
    length: password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX,
    letter: /\p{L}/u.test(password),
    number: /\d/.test(password),
  };
}

export function isStrongPassword(password: string): boolean {
  return PASSWORD_RULES.every((rule) => passwordRules(password)[rule]);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME = /^\p{L}[\p{L}\p{M}' .-]*$/u;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length <= 254 && EMAIL.test(email);
}

export function normalizeName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function isName(value: string): boolean {
  const name = normalizeName(value);
  return name.length > 0 && name.length <= NAME_MAX && NAME.test(name);
}

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_MAX);
}

export function isPhone(value: string): boolean {
  const digits = phoneDigits(value);
  return digits.length >= PHONE_MIN && digits === value.replace(/\D/g, "");
}

export function isDial(value: string): boolean {
  return /^\+\d{1,4}$/.test(value);
}

export function otpDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, OTP_LENGTH);
}

export function isOtp(value: string): boolean {
  return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value);
}

/** `priya.menon@gmail.com` → `pr•••@gmail.com`. */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  return `${user.slice(0, Math.min(2, user.length))}•••@${domain}`;
}

/** `+65`, `91234567` → `+65 •••• 4567`. */
export function maskPhone(dial: string, digits: string): string {
  return `${dial} •••• ${digits.slice(-4)}`;
}

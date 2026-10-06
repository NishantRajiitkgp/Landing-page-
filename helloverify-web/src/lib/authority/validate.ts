/** Field rules from the old `saudiAuthValidation` (email / 10-digit phone / 6-digit OTP).
 *  MOM's live dialog accepts 7–15 digits; MOHESR and the site login stay at 10. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\d{10}$/;
const OTP = /^\d{6}$/;

export function normalizeEmail(value: string): string {
  return value.trim();
}

export function normalizePhoneDigits(value: string, max = 10): string {
  return value.replace(/\D/g, "").slice(0, max);
}

export function isValidPhoneSpan(value: string, min: number, max: number): boolean {
  return new RegExp(`^\\d{${min},${max}}$`).test(value);
}

export function normalizeOtp(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function isValidEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length > 0 && email.length <= 254 && EMAIL.test(email);
}

export function isValidPhone(value: string): boolean {
  return PHONE.test(normalizePhoneDigits(value));
}

export function isValidOtp(value: string): boolean {
  return OTP.test(normalizeOtp(value));
}

/** Request schemas for `/api/mom/account/*`. Server-only so zod stays out of
 *  the client bundle; the rules themselves live in `./policy`. */
import "server-only";

import { z } from "zod";

import {
  isDial,
  isEmail,
  isName,
  isOtp,
  isPhone,
  isStrongPassword,
  normalizeEmail,
  normalizeName,
  PASSWORD_MAX,
} from "./policy";

const email = z.string().max(254).transform(normalizeEmail).refine(isEmail);
const name = z.string().max(120).transform(normalizeName).refine(isName);
const dial = z.string().trim().refine(isDial);
const phone = z.string().trim().refine(isPhone);
const code = z.string().trim().refine(isOtp);
const password = z.string().min(1).max(PASSWORD_MAX);
const token = z.string().min(20).max(4096);

export const sendCodeSchema = z.discriminatedUnion("channel", [
  z.object({ channel: z.literal("email"), email, name }),
  z.object({ channel: z.literal("phone"), dial, phone, name }),
]);

export const verifyCodeSchema = z.discriminatedUnion("channel", [
  z.object({ channel: z.literal("email"), email, code }),
  z.object({ channel: z.literal("phone"), dial, phone, code }),
]);

export const registerSchema = z.object({
  first: name,
  last: name,
  email,
  dial,
  phone,
  password: password.refine(isStrongPassword),
  consent: z.literal(true),
  emailProof: token,
  phoneProof: token,
});

export const signInSchema = z.object({ email, password });
export const signInVerifySchema = z.object({ challenge: token, code });
export const forgotSchema = z.object({ email });

/** The first failing field, so the browser can put the message beside it. */
export function firstField(error: z.ZodError): string | undefined {
  const path = error.issues[0]?.path[0];
  return typeof path === "string" ? path : undefined;
}

/** Request schemas for `/api/mom/org/*`. Codes, sign-in and reset reuse the
 *  applicant schemas; only registration carries the organisation. */
import "server-only";

import { z } from "zod";

import { isDial, isEmail, isName, isPhone, isStrongPassword, normalizeEmail, normalizeName, PASSWORD_MAX } from "@/lib/mom/account/policy";

import { isOrgKind, isOrgName, isRegNo, tidy } from "./policy";

export { firstField, forgotSchema, sendCodeSchema, signInSchema, signInVerifySchema, verifyCodeSchema } from "@/lib/mom/account/requests";

const token = z.string().min(20).max(4096);
const name = z.string().max(120).transform(normalizeName).refine(isName);

export const orgRegisterSchema = z.object({
  org: z.string().max(200).transform(tidy).refine(isOrgName),
  reg: z.string().max(60).transform(tidy).refine(isRegNo),
  kind: z.string().refine(isOrgKind),
  first: name,
  last: name,
  email: z.string().max(254).transform(normalizeEmail).refine(isEmail),
  dial: z.string().trim().refine(isDial),
  phone: z.string().trim().refine(isPhone),
  password: z.string().min(1).max(PASSWORD_MAX).refine(isStrongPassword),
  consent: z.literal(true),
  emailProof: token,
  phoneProof: token,
});

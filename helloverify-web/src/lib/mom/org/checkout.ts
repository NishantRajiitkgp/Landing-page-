/** What an employer confirms and is invoiced for at checkout, and what comes
 *  back once paid. Pure, so the browser checks what the server enforces. */
import { isEmail, normalizeEmail } from "../account/policy";
import type { QuoteLine } from "../apply/pricing";
import type { ApplyErrorCode, PassType, Qual } from "../apply/types";

import { isOrgName, isRegNo, ORG_MAX, REG_MAX, tidy } from "./policy";
import type { OrgUser } from "./types";

export const ADDRESS_MAX = 300;
export const PO_MAX = 40;

/** Who the one tax invoice is made out to. */
export type BatchBilling = { org: string; reg: string; email: string; address: string; country: string; po: string };

export const BILLING_FIELDS = ["org", "reg", "email", "address", "country", "po"] as const;
export type BillingField = (typeof BILLING_FIELDS)[number];
export type BillingIssue = "required" | "org" | "reg" | "email" | "address" | "po";

/** The three things the employer confirms before paying. */
export const DECLARATIONS = ["act", "consent", "terms"] as const;
export type Declaration = (typeof DECLARATIONS)[number];
export type Declarations = Record<Declaration, boolean>;

export const NO_DECLARATIONS: Declarations = { act: false, consent: false, terms: false };

export function blankBilling(user: Pick<OrgUser, "org" | "reg" | "email" | "dial">): BatchBilling {
  return { org: user.org, reg: user.reg, email: user.email, address: "", country: user.dial === "+65" ? "SG" : "", po: "" };
}

export function billingIssues(b: BatchBilling): Partial<Record<BillingField, BillingIssue>> {
  const out: Partial<Record<BillingField, BillingIssue>> = {};
  if (!b.org.trim()) out.org = "required";
  else if (!isOrgName(b.org)) out.org = "org";
  if (!isRegNo(b.reg)) out.reg = "reg";
  if (!b.email.trim()) out.email = "required";
  else if (!isEmail(b.email)) out.email = "email";
  const address = tidy(b.address);
  if (!address) out.address = "required";
  else if (address.length < 8 || address.length > ADDRESS_MAX || !/\p{L}/u.test(address)) out.address = "address";
  if (!/^[A-Z]{2}$/.test(b.country)) out.country = "required";
  if (b.po.trim() && !/^[\p{L}\p{N}][\p{L}\p{N} ./#_-]{0,39}$/u.test(tidy(b.po))) out.po = "po";
  return out;
}

export const cleanBilling = (b: BatchBilling): BatchBilling => ({
  org: tidy(b.org).slice(0, ORG_MAX),
  reg: tidy(b.reg).slice(0, REG_MAX),
  email: normalizeEmail(b.email),
  address: tidy(b.address).slice(0, ADDRESS_MAX),
  country: b.country,
  po: tidy(b.po).slice(0, PO_MAX),
});

export type BatchStep = "candidates" | "documents" | "review";

export type BatchFailure = { ok: false; code: ApplyErrorCode; retryAfter?: number; step?: BatchStep };

/** What the Letter of Authorisation names for one qualification. */
export type PaidQual = Pick<Qual, "level" | "course" | "institution" | "country" | "start" | "end">;

/** One case per candidate, opened when the batch is paid. Carries what the
 *  candidate checks and signs on their Letter of Authorisation. */
export type PaidCase = {
  id: string;
  candidate: string;
  name: string;
  email: string;
  passportNo: string;
  dob: string;
  nationality: string;
  passType: PassType;
  quals: PaidQual[];
  acc: number;
  express: boolean;
};

/** The seller on the tax invoice. */
export type Supplier = { name: string; gst: string; address: string };

/** A paid batch and its invoice. Prices are the server's quote at checkout,
 *  sealed into the payment, so the invoice cannot drift from the charge. */
export type PaidBatch = {
  id: string;
  invoice: string;
  /** ISO timestamp. */
  paidAt: string;
  reference: string;
  demo: boolean;
  billing: BatchBilling;
  supplier: Supplier;
  lines: QuoteLine[];
  subtotal: number;
  gst: number;
  /** GST as a whole percentage, as quoted. */
  rate: number;
  total: number;
  currency: "SGD";
  cases: PaidCase[];
};

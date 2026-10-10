/** The MOM application draft and the wire types of `/api/mom/apply/*`. */
import type { AccountErrorCode } from "../account/types";

export const PASS_TYPES = ["EP", "SP", "ONE", "PEP", "TEP"] as const;
export type PassType = (typeof PASS_TYPES)[number];

export const LEVELS = ["diploma", "advancedDiploma", "bachelor", "pgDiploma", "master", "doctorate", "professional"] as const;
export type Level = (typeof LEVELS)[number];

export const DOC_KINDS = ["passport", "certificate", "transcript", "translation", "supporting"] as const;
export type DocKind = (typeof DOC_KINDS)[number];

/** An uploaded file. `id` is a sealed receipt the server issued to this
 *  applicant for this slot; submission checks it, so it cannot be forged. */
export type DocRef = { id: string; name: string; size: number; type: string };

export type About = {
  fullName: string;
  /** YYYY-MM-DD */
  dob: string;
  /** ISO 3166-1 alpha-2 */
  nationality: string;
  passportNo: string;
  /** YYYY-MM-DD */
  passportExpiry: string;
  passType: PassType | "";
};

export type Qual = {
  id: string;
  level: Level | "";
  course: string;
  institution: string;
  /** On MOM's list: true / false when picked from search, null when typed. */
  listed: boolean | null;
  /** ISO 3166-1 alpha-2 */
  country: string;
  /** YYYY-MM, either half may be empty while the applicant picks. */
  start: string;
  end: string;
  studentId: string;
  english: boolean;
};

export type Draft = {
  v: 1;
  about: About;
  quals: Qual[];
  /** Keyed by `slotKey()`. */
  docs: Record<string, DocRef>;
  express: boolean;
  /** The typed signature on the Letter of Authorisation and the declaration. */
  sign: { name: string; agreed: boolean };
  /** `name` is null until the applicant edits it, and the pay step shows the
   *  passport name in the meantime. */
  billing: { name: string | null; company: string };
  /** Furthest step index the applicant has reached. */
  reached: number;
  savedAt: number;
};

export type Billing = { name: string; company: string };

export type ApplyStepName = "about" | "qualifications" | "review" | "pay";

/** What was paid. The price is the server's quote at checkout, sealed into
 *  the payment, so the receipt cannot drift from the charge. */
export type CaseFile = {
  id: string;
  /** ISO timestamp. */
  paidAt: string;
  express: boolean;
  holder: string;
  pass: PassType;
  quals: { institution: string; level: Level; course: string }[];
  billing: Billing;
  lines: { id: "edu" | "acc" | "express"; qty: number; amount: number }[];
  gst: number;
  total: number;
  currency: "SGD";
  reference: string;
};

export type Institution = { name: string; country: string; listed: boolean };

export type ApplyErrorCode = AccountErrorCode | "too_large" | "bad_type";
export type ApplyFailure = { ok: false; code: ApplyErrorCode; retryAfter?: number; step?: ApplyStepName };
export type ApplyResult<T extends object = object> = ({ ok: true } & T) | ApplyFailure;

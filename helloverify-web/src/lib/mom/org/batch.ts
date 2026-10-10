/** The employer batch: candidates, their qualifications and the checks on
 *  each. Pure, so the browser and the API apply the same rules. A candidate's
 *  fields reuse the applicant rules; only the checks are chosen here. */
import { isEmail } from "../account/policy";
import {
  aboutIssues,
  blankQual,
  needsAccreditation,
  PASSPORT_SLOT,
  qualIssues,
  qualSlots,
  type Issue,
  type QualIssues,
  type Slot,
} from "../apply/policy";
import type { Prices, Quote, QuoteLine } from "../apply/pricing";
import type { DocRef, PassType, Qual } from "../apply/types";
import type { BatchBilling } from "./checkout";

export const BATCH_MAX = 200;

export type Candidate = {
  id: string;
  fullName: string;
  /** Where the candidate's authorisation link goes. */
  email: string;
  /** YYYY-MM-DD */
  dob: string;
  /** ISO 3166-1 alpha-2 */
  nationality: string;
  passportNo: string;
  /** YYYY-MM-DD */
  passportExpiry: string;
  passType: PassType | "";
  quals: Qual[];
  /** Accreditation on every qualification. Those not on MOM's list carry it
   *  regardless. */
  acc: boolean;
  express: boolean;
  /** Keyed by `slotKey()`, the applicant's slots. */
  docs: Record<string, DocRef>;
};

export type Batch = {
  v: 1;
  candidates: Candidate[];
  reached: number;
  savedAt: number;
  /** Invoice details, kept once typed; prefilled from the account until then. */
  billing?: BatchBilling;
};

export type BatchIssue = Issue | "email" | "duplicate";

export const CANDIDATE_FIELDS = ["fullName", "email", "passportNo", "nationality", "dob", "passportExpiry", "passType"] as const;
export type CandidateField = (typeof CANDIDATE_FIELDS)[number];

export type CandidateIssues = {
  fields: Partial<Record<CandidateField, BatchIssue>>;
  quals: Record<string, QualIssues>;
  count: number;
};

export const CANDIDATE_ID_RE = /^c[a-z0-9]{8}$/;

export function newCandidateId(): string {
  return `c${Math.random().toString(36).slice(2, 10).padEnd(8, "0")}`;
}

export function blankCandidate(): Candidate {
  return {
    id: newCandidateId(),
    fullName: "",
    email: "",
    dob: "",
    nationality: "",
    passportNo: "",
    passportExpiry: "",
    passType: "",
    quals: [blankQual()],
    acc: false,
    express: false,
    docs: {},
  };
}

/** Passport first, then each qualification's documents, required or not. */
export const candidateSlots = (c: Pick<Candidate, "quals">): Slot[] => [PASSPORT_SLOT, ...c.quals.flatMap(qualSlots)];

export const missingSlots = (c: Pick<Candidate, "quals" | "docs">): Slot[] =>
  candidateSlots(c).filter((s) => s.required && !c.docs[s.key]);

const blankQualFields = (q: Qual) => !q.level && !q.course.trim() && !q.institution.trim() && !q.country && !q.start && !q.end;

/** Nothing typed at all: closing it should leave no trace. */
export const isBlankCandidate = (c: Candidate) =>
  CANDIDATE_FIELDS.every((f) => !c[f].trim()) && c.quals.every(blankQualFields);

/** Documents come in the next step, so the applicant's document issues are dropped. */
export function candidateIssues(c: Candidate, now: string, duplicate = false): CandidateIssues {
  const about = aboutIssues(c, { passport: { id: "", name: "", size: 0, type: "" } }, now);
  const fields: CandidateIssues["fields"] = {};
  for (const f of CANDIDATE_FIELDS) {
    if (f === "email") continue;
    const issue = about[f];
    if (issue) fields[f] = issue;
  }
  if (!c.email.trim()) fields.email = "required";
  else if (!isEmail(c.email)) fields.email = "email";
  if (!fields.passportNo && duplicate) fields.passportNo = "duplicate";

  const quals: CandidateIssues["quals"] = {};
  let count = Object.keys(fields).length;
  for (const q of c.quals) {
    const issues = Object.fromEntries(Object.entries(qualIssues(q, {}, now)).filter(([k]) => !k.includes(":")));
    quals[q.id] = issues;
    count += Object.keys(issues).length;
  }
  return { fields, quals, count };
}

/** Every candidate's issues, with passports that appear twice flagged on the later ones. */
export function batchIssues(batch: Pick<Batch, "candidates">, now: string): Map<string, CandidateIssues> {
  const seen = new Set<string>();
  const out = new Map<string, CandidateIssues>();
  for (const c of batch.candidates) {
    const passport = c.passportNo.trim();
    const duplicate = passport !== "" && seen.has(passport);
    if (passport) seen.add(passport);
    out.set(c.id, candidateIssues(c, now, duplicate));
  }
  return out;
}

export const qualHasAcc = (c: Pick<Candidate, "acc">, q: Qual) => c.acc || needsAccreditation(q);

/** Qualifications that must carry Accreditation whatever the employer picks. */
export const requiredAcc = (c: Candidate) => c.quals.filter(needsAccreditation).length;

const cents = (n: number) => Math.round(n * 100) / 100;

/** Education per qualification, Accreditation per qualification that has it,
 *  Express per candidate. One GST line on the lot. */
export function batchQuote(candidates: readonly Candidate[], prices: Prices): Quote {
  const quals = candidates.reduce((n, c) => n + c.quals.length, 0);
  const acc = candidates.reduce((n, c) => n + c.quals.filter((q) => qualHasAcc(c, q)).length, 0);
  const express = candidates.filter((c) => c.express).length;
  const lines: QuoteLine[] = [];
  if (quals) lines.push({ id: "edu", qty: quals, amount: quals * prices.edu });
  if (acc) lines.push({ id: "acc", qty: acc, amount: acc * prices.acc });
  if (express) lines.push({ id: "express", qty: express, amount: express * prices.express });
  const subtotal = cents(lines.reduce((s, l) => s + l.amount, 0));
  const gst = cents(subtotal * prices.gst);
  return { lines, subtotal, gst, total: cents(subtotal + gst) };
}

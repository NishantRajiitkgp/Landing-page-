/** Rules for the MOM application, shared by the browser and the API. Issues
 *  are codes; each locale owns the sentence. */
import { normalizeName } from "../account/policy";

import type { About, DocKind, Draft, Qual } from "./types";

export const MAX_QUALS = 5;
export const FILE_MAX_MB = 10;
export const FILE_MAX_BYTES = FILE_MAX_MB * 1024 * 1024;
export const FILE_ACCEPT = "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";
export const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export const COURSE_MAX = 120;
export const INSTITUTION_MAX = 160;
export const STUDENT_ID_MAX = 40;
export const FULL_NAME_MAX = 100;
export const COMPANY_MAX = 120;
export const PASSPORT_MIN = 6;
export const PASSPORT_MAX = 12;
export const EARLIEST_YEAR = 1960;

const FULL_NAME = /^[\p{L}\p{M}][\p{L}\p{M}' .,-]*$/u;
export const isFullName = (v: string) => {
  const name = normalizeName(v);
  return name.length > 1 && name.length <= FULL_NAME_MAX && FULL_NAME.test(name);
};

export const normalizePassport = (raw: string) =>
  raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, PASSPORT_MAX);

export const isPassportNo = (v: string) => new RegExp(`^[A-Z0-9]{${PASSPORT_MIN},${PASSPORT_MAX}}$`).test(v);

const COMPANY = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}&.'’,() -]*$/u;

/** Empty is allowed: a company is only there when the invoice needs one. */
export function isCompany(value: string): boolean {
  const name = value.replace(/\s+/g, " ").trim();
  return name.length > 1 && name.length <= COMPANY_MAX && COMPANY.test(name);
}

export const slotKey = (kind: DocKind, qualId?: string) => (qualId ? `${qualId}:${kind}` : kind);
export const SLOT_RE = /^(?:passport|q[a-z0-9]{4,16}:(?:certificate|transcript|translation|supporting))$/;

export type Slot = { key: string; kind: DocKind; required: boolean };

export function qualSlots(q: Qual): Slot[] {
  const slots: Slot[] = [
    { key: slotKey("certificate", q.id), kind: "certificate", required: true },
    { key: slotKey("transcript", q.id), kind: "transcript", required: true },
  ];
  if (!q.english) slots.push({ key: slotKey("translation", q.id), kind: "translation", required: true });
  slots.push({ key: slotKey("supporting", q.id), kind: "supporting", required: false });
  return slots;
}

export const PASSPORT_SLOT: Slot = { key: "passport", kind: "passport", required: true };

export function requiredSlots(draft: Draft): Slot[] {
  return [PASSPORT_SLOT, ...draft.quals.flatMap(qualSlots)].filter((s) => s.required);
}

/** Accreditation is added for every named institution not confirmed on MOM's list. */
export const needsAccreditation = (q: Qual) => q.institution.trim() !== "" && q.listed !== true;

export type Issue = "required" | "name" | "dob" | "passportNo" | "expired" | "month" | "order" | "future" | "doc" | "signMatch" | "agree" | "company";

/** Upper bounds in working days, from MOM's published turnaround. */
export const TURNAROUND = { standard: 15, express: 7 } as const;

/** Version of the Letter of Authorisation wording; submission records it. */
export const LOA_VERSION = "2026-10";

/** `YYYY-MM-DD` in the applicant's own time zone. */
export function today(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

function yearsBefore(date: string, years: number): string {
  return `${Number(date.slice(0, 4)) - years}${date.slice(4)}`;
}

export type AboutIssues = Partial<Record<keyof About | "passport", Issue>>;

export function aboutIssues(a: About, docs: Draft["docs"], now: string): AboutIssues {
  const out: AboutIssues = {};
  if (!a.fullName.trim()) out.fullName = "required";
  else if (!isFullName(a.fullName)) out.fullName = "name";
  if (!a.dob) out.dob = "required";
  else if (!DATE_RE.test(a.dob) || a.dob > yearsBefore(now, 16) || a.dob < yearsBefore(now, 90)) out.dob = "dob";
  if (!a.nationality) out.nationality = "required";
  if (!a.passportNo) out.passportNo = "required";
  else if (!isPassportNo(a.passportNo)) out.passportNo = "passportNo";
  if (!a.passportExpiry) out.passportExpiry = "required";
  else if (!DATE_RE.test(a.passportExpiry) || a.passportExpiry <= now) out.passportExpiry = "expired";
  if (!a.passType) out.passType = "required";
  if (!docs.passport) out.passport = "doc";
  return out;
}

export type QualIssues = Partial<Record<keyof Qual | string, Issue>>;

export function qualIssues(q: Qual, docs: Draft["docs"], now: string): QualIssues {
  const out: QualIssues = {};
  if (!q.level) out.level = "required";
  if (!q.course.trim()) out.course = "required";
  if (!q.institution.trim()) out.institution = "required";
  if (!q.country) out.country = "required";
  const month = now.slice(0, 7);
  for (const f of ["start", "end"] as const) {
    const v = q[f];
    if (!v || v === "-") out[f] = "required";
    else if (!MONTH_RE.test(v)) out[f] = "month";
    else if (v > month) out[f] = "future";
  }
  if (!out.start && !out.end && q.end < q.start) out.end = "order";
  for (const slot of qualSlots(q)) if (slot.required && !docs[slot.key]) out[slot.key] = "doc";
  return out;
}

const signForm = (v: string) => normalizeName(v.normalize("NFKC")).toLowerCase();

/** The signature is the passport name, typed again; case and spacing are free. */
export const signatureMatches = (typed: string, fullName: string) =>
  signForm(typed) !== "" && signForm(typed) === signForm(fullName);

export function signIssues(draft: Pick<Draft, "about" | "sign">): { sign?: Issue; agree?: Issue } {
  const out: { sign?: Issue; agree?: Issue } = {};
  if (!draft.sign.name.trim()) out.sign = "required";
  else if (!signatureMatches(draft.sign.name, draft.about.fullName)) out.sign = "signMatch";
  if (!draft.sign.agreed) out.agree = "agree";
  return out;
}

/** The day the report should be ready, counted from the day payment landed. */
export function reportDay(paidAt: string, express: boolean): string {
  return addWorkingDays(paidAt.slice(0, 10), express ? TURNAROUND.express : TURNAROUND.standard);
}

/** `YYYY-MM-DD` plus `n` weekdays. Public holidays vary, so callers say "around". */
export function addWorkingDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  for (let left = n; left > 0; ) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d.toISOString().slice(0, 10);
}

export function newQualId(): string {
  return `q${Math.random().toString(36).slice(2, 10).padEnd(8, "0")}`;
}

export function blankQual(): Qual {
  return { id: newQualId(), level: "", course: "", institution: "", listed: null, country: "", start: "", end: "", studentId: "", english: true };
}

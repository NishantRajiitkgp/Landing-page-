/** Turns a posted application into a draft the server is willing to price.
 *  Shape failures are `invalid_input`; a real draft with gaps is `incomplete`
 *  and names the step, so the browser can take the applicant back to it.
 *  Prices are never read from the body. */
import {
  aboutIssues,
  isCompany,
  isFullName,
  MAX_QUALS,
  qualIssues,
  qualSlots,
  requiredSlots,
  signIssues,
  SLOT_RE,
} from "./policy";
import { LEVELS, PASS_TYPES, type ApplyStepName, type Billing, type DocRef, type Draft, type Level, type PassType, type Qual } from "./types";

export type Read =
  | { ok: true; draft: Draft; billing: Billing }
  | { ok: false; code: "invalid_input" }
  | { ok: false; code: "incomplete"; step: ApplyStepName };

const QUAL_ID = /^q[a-z0-9]{4,16}$/;
const str = (v: unknown, max: number) => (typeof v === "string" && v.length <= max ? v : null);

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function qual(raw: unknown): Qual | null {
  if (!isRecord(raw) || typeof raw.id !== "string" || !QUAL_ID.test(raw.id)) return null;
  if (typeof raw.level !== "string" || (raw.level !== "" && !(LEVELS as readonly string[]).includes(raw.level))) return null;
  const course = str(raw.course, 200);
  const institution = str(raw.institution, 200);
  const country = str(raw.country, 2);
  const start = str(raw.start, 7);
  const end = str(raw.end, 7);
  const studentId = str(raw.studentId, 80);
  if (!course || !institution || country === null || !start || !end || studentId === null) return null;
  if (country !== "" && !/^[A-Z]{2}$/.test(country)) return null;
  if (raw.listed !== true && raw.listed !== false && raw.listed !== null) return null;
  if (typeof raw.english !== "boolean") return null;
  return {
    id: raw.id,
    level: raw.level as Level | "",
    course,
    institution,
    listed: raw.listed,
    country,
    start,
    end,
    studentId,
    english: raw.english,
  };
}

export function doc(raw: unknown): DocRef | null {
  if (!isRecord(raw)) return null;
  const id = str(raw.id, 2000);
  const name = str(raw.name, 200);
  const type = str(raw.type, 80);
  if (!id || name === null || !type || typeof raw.size !== "number" || !Number.isFinite(raw.size) || raw.size < 0) return null;
  return { id, name, size: raw.size, type };
}

/** `null` when the body is not an application at all. */
export function readSubmission(body: unknown, now: string): Read {
  if (!isRecord(body) || !isRecord(body.about) || !Array.isArray(body.quals) || !isRecord(body.docs) || !isRecord(body.sign)) {
    return { ok: false, code: "invalid_input" };
  }
  const a = body.about;
  const fullName = str(a.fullName, 200);
  const dob = str(a.dob, 10);
  const nationality = str(a.nationality, 2);
  const passportNo = str(a.passportNo, 20);
  const passportExpiry = str(a.passportExpiry, 10);
  const passType = str(a.passType, 8);
  if (!fullName || !dob || nationality === null || !passportNo || !passportExpiry || passType === null) return { ok: false, code: "invalid_input" };
  if (nationality !== "" && !/^[A-Z]{2}$/.test(nationality)) return { ok: false, code: "invalid_input" };
  if (passType !== "" && !(PASS_TYPES as readonly string[]).includes(passType)) return { ok: false, code: "invalid_input" };
  if (body.quals.length < 1 || body.quals.length > MAX_QUALS) return { ok: false, code: "invalid_input" };
  if (typeof body.express !== "boolean") return { ok: false, code: "invalid_input" };
  if (typeof body.sign.name !== "string" || body.sign.name.length > 200 || typeof body.sign.agreed !== "boolean") {
    return { ok: false, code: "invalid_input" };
  }

  const quals: Qual[] = [];
  for (const raw of body.quals) {
    const q = qual(raw);
    if (!q || quals.some((have) => have.id === q.id)) return { ok: false, code: "invalid_input" };
    quals.push(q);
  }

  const docs: Draft["docs"] = {};
  for (const [slot, raw] of Object.entries(body.docs)) {
    if (!SLOT_RE.test(slot)) return { ok: false, code: "invalid_input" };
    const parsed = doc(raw);
    if (!parsed) return { ok: false, code: "invalid_input" };
    docs[slot] = parsed;
  }

  const billingRaw = isRecord(body.billing) ? body.billing : {};
  const billingName = str(billingRaw.name, 200);
  const company = str(billingRaw.company, 200);
  if (billingName === null || company === null) return { ok: false, code: "invalid_input" };
  const billing: Billing = { name: billingName, company };

  const draft: Draft = {
    v: 1,
    about: { fullName, dob, nationality, passportNo, passportExpiry, passType: passType as PassType | "" },
    quals,
    docs,
    express: body.express,
    sign: { name: body.sign.name, agreed: body.sign.agreed },
    billing: { name: billingName, company },
    reached: 5,
    savedAt: 0,
  };

  if (Object.keys(aboutIssues(draft.about, draft.docs, now)).length) return { ok: false, code: "incomplete", step: "about" };
  if (draft.quals.some((q) => Object.keys(qualIssues(q, draft.docs, now)).length)) return { ok: false, code: "incomplete", step: "qualifications" };
  if (Object.keys(signIssues(draft)).length) return { ok: false, code: "incomplete", step: "review" };
  if (!isFullName(billing.name)) return { ok: false, code: "incomplete", step: "pay" };
  if (billing.company.trim() && !isCompany(billing.company)) return { ok: false, code: "incomplete", step: "pay" };
  return { ok: true, draft, billing: { name: billing.name.replace(/\s+/g, " ").trim(), company: billing.company.replace(/\s+/g, " ").trim() } };
}

export type OpenedReceipt = { a: string; s: string; r: string };

/** Every uploaded file must be a receipt this server issued to this applicant
 *  for this exact slot. Returns the step to send the applicant back to. */
export function rejectReceipts(draft: Draft, applicantId: string, open: (id: string) => OpenedReceipt | null): ApplyStepName | null {
  const allowed = new Set(["passport", ...draft.quals.flatMap((q) => qualSlots(q).map((s) => s.key))]);
  for (const [slot, file] of Object.entries(draft.docs)) {
    const step: ApplyStepName = slot === "passport" ? "about" : "qualifications";
    if (!allowed.has(slot)) return step;
    const got = open(file.id);
    if (!got || got.a !== applicantId || got.s !== slot || typeof got.r !== "string" || got.r.length === 0) return step;
  }
  for (const slot of requiredSlots(draft)) if (!draft.docs[slot.key]) return slot.key === "passport" ? "about" : "qualifications";
  return null;
}

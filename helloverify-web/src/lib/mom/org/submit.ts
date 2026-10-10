/** Turns a posted batch into one the server is willing to price. Shape
 *  failures are `invalid_input`; a real batch with gaps is `incomplete` and
 *  names the step to go back to. Prices are never read from the body. */
import { MAX_QUALS, SLOT_RE } from "../apply/policy";
import { doc, isRecord, qual } from "../apply/submit";
import { PASS_TYPES, type PassType, type Qual } from "../apply/types";

import { BATCH_MAX, batchIssues, CANDIDATE_ID_RE, candidateSlots, missingSlots, type Candidate } from "./batch";
import { billingIssues, cleanBilling, DECLARATIONS, type BatchBilling, type BatchStep, type Declarations } from "./checkout";

export type BatchRead =
  | { ok: true; candidates: Candidate[]; billing: BatchBilling; agree: Declarations }
  | { ok: false; code: "invalid_input" }
  | { ok: false; code: "incomplete"; step: BatchStep };

const str = (v: unknown, max: number) => (typeof v === "string" && v.length <= max ? v : null);
const bad = { ok: false, code: "invalid_input" } as const;

function candidate(raw: unknown): Candidate | null {
  if (!isRecord(raw) || typeof raw.id !== "string" || !CANDIDATE_ID_RE.test(raw.id)) return null;
  const fullName = str(raw.fullName, 200);
  const email = str(raw.email, 254);
  const dob = str(raw.dob, 10);
  const nationality = str(raw.nationality, 2);
  const passportNo = str(raw.passportNo, 20);
  const passportExpiry = str(raw.passportExpiry, 10);
  const passType = str(raw.passType, 8);
  if (fullName === null || email === null || dob === null || nationality === null || passportNo === null || passportExpiry === null || passType === null) {
    return null;
  }
  if (nationality !== "" && !/^[A-Z]{2}$/.test(nationality)) return null;
  if (passType !== "" && !(PASS_TYPES as readonly string[]).includes(passType)) return null;
  if (typeof raw.acc !== "boolean" || typeof raw.express !== "boolean") return null;
  if (!Array.isArray(raw.quals) || raw.quals.length < 1 || raw.quals.length > MAX_QUALS || !isRecord(raw.docs)) return null;

  const quals: Qual[] = [];
  for (const r of raw.quals) {
    const q = qual(r);
    if (!q || quals.some((have) => have.id === q.id)) return null;
    quals.push(q);
  }
  const docs: Candidate["docs"] = {};
  for (const [slot, r] of Object.entries(raw.docs)) {
    const parsed = SLOT_RE.test(slot) ? doc(r) : null;
    if (!parsed) return null;
    docs[slot] = parsed;
  }
  return { id: raw.id, fullName, email, dob, nationality, passportNo, passportExpiry, passType: passType as PassType | "", quals, acc: raw.acc, express: raw.express, docs };
}

export function readBatchSubmission(body: unknown, now: string): BatchRead {
  if (!isRecord(body) || !Array.isArray(body.candidates) || !isRecord(body.billing) || !isRecord(body.agree)) return bad;
  if (body.candidates.length < 1 || body.candidates.length > BATCH_MAX) return bad;

  const candidates: Candidate[] = [];
  for (const raw of body.candidates) {
    const c = candidate(raw);
    if (!c || candidates.some((have) => have.id === c.id)) return bad;
    candidates.push(c);
  }

  const b = body.billing;
  const billing = {
    org: str(b.org, 200),
    reg: str(b.reg, 40),
    email: str(b.email, 254),
    address: str(b.address, 400),
    country: str(b.country, 2),
    po: str(b.po, 60),
  };
  if (Object.values(billing).some((v) => v === null)) return bad;
  const ticks: Record<string, unknown> = isRecord(body.agree) ? body.agree : {};
  const agree = Object.fromEntries(DECLARATIONS.map((d) => [d, ticks[d]]));
  if (Object.values(agree).some((v) => typeof v !== "boolean")) return bad;

  const issues = batchIssues({ candidates }, now);
  if (candidates.some((c) => issues.get(c.id)?.count)) return { ok: false, code: "incomplete", step: "candidates" };
  if (candidates.some((c) => missingSlots(c).length)) return { ok: false, code: "incomplete", step: "documents" };
  const filled = billing as BatchBilling;
  if (Object.values(agree).some((v) => v !== true) || Object.keys(billingIssues(filled)).length) return { ok: false, code: "incomplete", step: "review" };
  return { ok: true, candidates, billing: cleanBilling(filled), agree: agree as Declarations };
}

export type OpenedOrgReceipt = { o: string; c: string; s: string; r: string };

/** Every file must be a receipt this server issued to this organisation, for
 *  this candidate and this exact slot. */
export function orgReceiptsValid(candidates: readonly Candidate[], orgId: string, open: (id: string) => OpenedOrgReceipt | null): boolean {
  for (const c of candidates) {
    const allowed = new Set(candidateSlots(c).map((s) => s.key));
    for (const [slot, file] of Object.entries(c.docs)) {
      if (!allowed.has(slot)) return false;
      const got = open(file.id);
      if (!got || got.o !== orgId || got.c !== c.id || got.s !== slot || typeof got.r !== "string" || !got.r) return false;
    }
  }
  return true;
}

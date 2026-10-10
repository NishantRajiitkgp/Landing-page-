/** Browser calls to `/api/mom/org/batch/*`. */
import { uploadTo, type Upload } from "../apply/client";
import type { ApplyFailure, ApplyResult, Institution } from "../apply/types";
import type { Candidate } from "./batch";
import type { BatchBilling, BatchFailure, Declarations, PaidBatch } from "./checkout";
import type { LoaMark, LoaStatus } from "./loa";

const BASE = "/api/mom/org/batch";
const offline: ApplyFailure = { ok: false, code: "upstream" };

async function call<T extends object>(path: string, init?: RequestInit): Promise<ApplyResult<T>> {
  try {
    const res = await fetch(`${BASE}/${path}`, { credentials: "same-origin", cache: "no-store", ...init });
    const json = (await res.json().catch(() => null)) as ApplyResult<T> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

export function searchOrgInstitutions(q: string, signal?: AbortSignal) {
  return call<{ items: Institution[] }>(`institutions?q=${encodeURIComponent(q)}`, { signal });
}

/** A candidate's document; the receipt is bound to this account, candidate and slot. */
export function uploadCandidateDoc(candidate: string, file: File, slot: string, onProgress: (fraction: number) => void): Upload {
  return uploadTo(`${BASE}/upload`, { candidate, slot }, file, onProgress);
}

const post = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export function resolveInstitutions(names: string[]) {
  return call<{ items: (Institution | null)[] }>("resolve", post({ names }));
}

type Opened = { intent: string; total: number; amount: number; currency: "SGD" };
export type BatchCheckout = ({ ok: true; demo: true } & Opened) | ({ ok: true; demo: false; key: string; orderId: string } & Opened) | BatchFailure;
export type BatchPaid = { ok: true; batch: PaidBatch; receipt: string } | BatchFailure;

export function checkoutBatch(candidates: readonly Candidate[], billing: BatchBilling, agree: Declarations) {
  return call<object>("checkout", post({ candidates, billing, agree })) as Promise<BatchCheckout>;
}

export function payBatch(body: { intent: string; razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string }) {
  return call<object>("pay", post(body)) as Promise<BatchPaid>;
}

export function loaStatus(receipt: string) {
  return call<{ status: LoaStatus }>("status", post({ receipt }));
}

/** Live emails the unsigned candidates their links; demo hands the links back. */
export function sendLoaLinks(receipt: string, cases?: string[]) {
  return call<{ demo: boolean; sent: number; links: Record<string, string> }>("links", post({ receipt, cases }));
}

export function uploadSignedLoa(receipt: string, caseId: string, file: File) {
  const body = new FormData();
  body.append("receipt", receipt);
  body.append("case", caseId);
  body.append("file", file);
  return call<{ mark: LoaMark }>("loa", { method: "POST", body });
}

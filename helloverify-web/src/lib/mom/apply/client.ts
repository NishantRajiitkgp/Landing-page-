/** Browser calls to `/api/mom/apply/*`. Uploads use XHR for progress. */
import { FILE_MAX_BYTES, FILE_TYPES } from "./policy";
import type { ApplyFailure, ApplyResult, CaseFile, DocRef, Draft, Institution } from "./types";

const BASE = "/api/mom/apply";
const offline: ApplyFailure = { ok: false, code: "upstream" };

async function post<T extends object>(action: string, body: unknown): Promise<ApplyResult<T>> {
  try {
    const res = await fetch(`${BASE}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as ApplyResult<T> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

export type CheckoutResponse =
  | { ok: true; already: true; application: CaseFile }
  | { ok: true; demo: true; intent: string; total: number; amount: number; currency: "SGD" }
  | { ok: true; demo: false; intent: string; total: number; amount: number; currency: "SGD"; key: string; orderId: string }
  | ApplyFailure;

export async function application(): Promise<ApplyResult<{ application: CaseFile | null }>> {
  try {
    const res = await fetch(`${BASE}/application`, { credentials: "same-origin", cache: "no-store" });
    const json = (await res.json().catch(() => null)) as ApplyResult<{ application: CaseFile | null }> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

export function checkout(draft: Draft, billing: { name: string; company: string }): Promise<CheckoutResponse> {
  return post("checkout", { ...draft, billing }) as Promise<CheckoutResponse>;
}

export function pay(body: { intent: string; razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string }): Promise<ApplyResult<{ application: CaseFile; already?: boolean }>> {
  return post("pay", body);
}

export async function searchInstitutions(q: string, signal?: AbortSignal): Promise<ApplyResult<{ items: Institution[] }>> {
  try {
    const res = await fetch(`${BASE}/institutions?q=${encodeURIComponent(q)}`, { credentials: "same-origin", cache: "no-store", signal });
    const json = (await res.json().catch(() => null)) as ApplyResult<{ items: Institution[] }> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

/** Checks the browser can make before spending the upload. The server checks
 *  again, by content rather than by the declared type. */
export function precheck(file: File): ApplyFailure | null {
  if (file.size > FILE_MAX_BYTES) return { ok: false, code: "too_large" };
  if (file.type && !(FILE_TYPES as readonly string[]).includes(file.type)) return { ok: false, code: "bad_type" };
  return null;
}

export type Upload = { done: Promise<ApplyResult<{ doc: DocRef }>>; abort: () => void };

export function uploadDocument(file: File, slot: string, onProgress: (fraction: number) => void): Upload {
  return uploadTo(`${BASE}/upload`, { slot }, file, onProgress);
}

export function uploadTo(url: string, fields: Record<string, string>, file: File, onProgress: (fraction: number) => void): Upload {
  const xhr = new XMLHttpRequest();
  const done = new Promise<ApplyResult<{ doc: DocRef }>>((resolve) => {
    const early = precheck(file);
    if (early) return resolve(early);
    const body = new FormData();
    for (const [k, v] of Object.entries(fields)) body.append(k, v);
    body.append("file", file);
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      const json = xhr.response as ApplyResult<{ doc: DocRef }> | null;
      resolve(json && typeof json.ok === "boolean" ? json : offline);
    };
    xhr.onerror = () => resolve(offline);
    xhr.onabort = () => resolve({ ok: false, code: "invalid_input" });
    xhr.send(body);
  });
  return { done, abort: () => xhr.abort() };
}

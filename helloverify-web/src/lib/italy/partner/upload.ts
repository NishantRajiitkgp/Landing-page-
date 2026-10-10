/** Browser upload to `/api/italy/partner/upload`. */
import { FILE_MAX_BYTES, FILE_TYPES } from "@/lib/mom/apply/policy";

import type { AccountErrorCode } from "./types";

export type PartnerDoc = { id: string; name: string; size: number; type: string };

export type UploadFailure = { ok: false; code: AccountErrorCode | "too_large" | "bad_type"; retryAfter?: number };

export type Upload = { done: Promise<{ ok: true; doc: PartnerDoc } | UploadFailure>; abort: () => void };

const offline: UploadFailure = { ok: false, code: "upstream" };

export function uploadPartnerDoc(file: File, slot: string, onProgress: (fraction: number) => void): Upload {
  const xhr = new XMLHttpRequest();
  const done = new Promise<{ ok: true; doc: PartnerDoc } | UploadFailure>((resolve) => {
    if (file.size > FILE_MAX_BYTES) return resolve({ ok: false, code: "too_large" });
    if (file.type && !(FILE_TYPES as readonly string[]).includes(file.type)) return resolve({ ok: false, code: "bad_type" });
    const body = new FormData();
    body.append("slot", slot);
    body.append("file", file);
    xhr.open("POST", "/api/italy/partner/upload");
    xhr.withCredentials = true;
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      const json = xhr.response as { ok: true; doc: PartnerDoc } | UploadFailure | null;
      resolve(json && typeof json.ok === "boolean" ? json : offline);
    };
    xhr.onerror = () => resolve(offline);
    xhr.onabort = () => resolve({ ok: false, code: "invalid_input" });
    xhr.send(body);
  });
  return { done, abort: () => xhr.abort() };
}

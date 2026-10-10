/** Documents and institution search behind `/api/mom/apply/*`.
 *
 *  Demo: uploads are checked and then discarded, institutions come from a
 *  sample directory. Live: both go to api.helloverify.sg; the endpoints are
 *  `null` until the backend team supplies them, and answer `not_connected`. */
import "server-only";

import { createHash } from "node:crypto";

import { authorityPost } from "@/lib/authority/upstream";

import { AccountError } from "../account/backend";
import { searchDemoInstitutions } from "./institutions";
import type { Institution } from "./types";

export type StoredFile = { bytes: Uint8Array; name: string; type: string; slot: string; applicantId: string };

export type GatewayOrder = { orderId: string; key: string };

export interface ApplyBackend {
  /** Returns the upstream's document reference (demo: a content hash). */
  store(file: StoredFile): Promise<string>;
  institutions(query: string): Promise<Institution[]>;
  /** Razorpay order. Amount is in cents. Demo never calls it. */
  checkout(amount: number, receipt: string, applicantId: string): Promise<GatewayOrder>;
  /** Checks the gateway signature. Demo never calls it. */
  confirm(orderId: string, paymentId: string, signature: string): Promise<void>;
}

const LIVE_ENDPOINTS: Record<"upload" | "institutions" | "checkout" | "confirm", string | null> = {
  upload: null,
  institutions: null,
  checkout: null,
  confirm: null,
};

function endpoint(name: keyof typeof LIVE_ENDPOINTS): string {
  const path = LIVE_ENDPOINTS[name];
  if (!path) throw new AccountError("not_connected");
  return path;
}

export const demoApplyBackend: ApplyBackend = {
  async store(file) {
    return `demo-${createHash("sha256").update(file.bytes).digest("hex").slice(0, 24)}`;
  },
  async institutions(query) {
    return searchDemoInstitutions(query);
  },
  async checkout() {
    throw new AccountError("not_connected");
  },
  async confirm() {
    throw new AccountError("not_connected");
  },
};

async function call(path: string, body: unknown): Promise<Record<string, unknown>> {
  try {
    return await authorityPost("mom", path, body);
  } catch {
    throw new AccountError("upstream");
  }
}

export const liveApplyBackend: ApplyBackend = {
  async store(file) {
    const res = await call(endpoint("upload"), {
      applicant_id: file.applicantId,
      slot: file.slot,
      file_name: file.name,
      content_type: file.type,
      content: Buffer.from(file.bytes).toString("base64"),
    });
    const ref = (res.data as { document_id?: unknown } | undefined)?.document_id;
    if (typeof ref !== "string" || !ref) throw new AccountError("upstream");
    return ref;
  },
  async institutions(query) {
    const res = await call(endpoint("institutions"), { q: query });
    if (!Array.isArray(res.data)) throw new AccountError("upstream");
    return (res.data as { name?: unknown; country?: unknown; listed?: unknown }[])
      .map((r) => ({ name: String(r.name ?? ""), country: String(r.country ?? ""), listed: r.listed === true }))
      .filter((r) => r.name);
  },
  async checkout(amount, receipt, applicantId) {
    const res = await call(endpoint("checkout"), { applicant_id: applicantId, amount, currency: "SGD", receipt });
    const data = res.data as { order_id?: unknown; key_id?: unknown } | undefined;
    if (typeof data?.order_id !== "string" || typeof data?.key_id !== "string") throw new AccountError("upstream");
    return { orderId: data.order_id, key: data.key_id };
  },
  async confirm(orderId, paymentId, signature) {
    await call(endpoint("confirm"), { order_id: orderId, payment_id: paymentId, signature });
  },
};

/** Content sniffing: the declared type must match the first bytes. */
export function sniff(bytes: Uint8Array): "application/pdf" | "image/jpeg" | "image/png" | null {
  const at = (i: number, ...b: number[]) => b.every((v, j) => bytes[i + j] === v);
  if (at(0, 0x25, 0x50, 0x44, 0x46, 0x2d)) return "application/pdf";
  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  return null;
}

export function cleanFileName(raw: string): string {
  const base = raw.split(/[\\/]/).pop() ?? "";
  const clean = base.replace(/[\p{C}<>:"|?*]/gu, "").replace(/\s+/g, " ").trim();
  return (clean || "document").slice(-120);
}

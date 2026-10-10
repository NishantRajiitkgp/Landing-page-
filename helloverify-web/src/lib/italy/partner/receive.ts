/** Document upload for the Italy partner. Demo keeps a sealed receipt and
 *  discards the bytes. Live has no endpoint yet. */
import "server-only";

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

import { italyLive } from "@/lib/italy/partner/env";
import { readSession } from "@/lib/italy/partner/session";
import { clientKey, spend } from "@/lib/mom/account/limits";
import { seal } from "@/lib/mom/account/seal";
import { cleanFileName, sniff } from "@/lib/mom/apply/backend";
import { FILE_MAX_BYTES } from "@/lib/mom/apply/policy";
import { failure, reply } from "@/lib/mom/http";

const SLOTS = new Set(["pan", "address", "bank", "gst", "agreement"]);
const ENVELOPE = 64 * 1024;
const RECEIPT_TTL = 30 * 24 * 60 * 60;
const MINUTE = 60_000;

export async function receiveUpload(req: NextRequest, key: Buffer) {
  if (italyLive()) return failure("not_connected");
  const session = readSession(req, key);
  if (!session) return failure("no_session");
  if (Number(req.headers.get("content-length") ?? 0) > FILE_MAX_BYTES + ENVELOPE) return failure("too_large");
  const wait = await spend([[`it:upload:${session.partner.id}`, 40, 10 * MINUTE], [`it:upload-ip:${clientKey(req.headers)}`, 80, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return failure("invalid_input");
  }
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");
  if (!SLOTS.has(slot) || !(file instanceof File)) return failure("invalid_input");
  if (file.size > FILE_MAX_BYTES) return failure("too_large");
  if (file.size === 0) return failure("bad_type");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  if (!type) return failure("bad_type");

  const ref = `demo-${createHash("sha256").update(bytes).digest("hex").slice(0, 24)}`;
  const id = seal(key, "document", { a: session.partner.id, s: slot, r: ref }, RECEIPT_TTL);
  return reply({ ok: true, doc: { id, name: cleanFileName(file.name), size: file.size, type } });
}

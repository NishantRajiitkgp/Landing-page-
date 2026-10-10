/** MOM application: institution search, document upload, checkout, payment
 *  and the paid application. Signed-in applicants only. Demo unless
 *  `MOM_APPLY_LIVE` is set (see `.env.example`). */
import type { NextRequest } from "next/server";

import { logEvent } from "@/lib/leads/log";
import { AccountError } from "@/lib/mom/account/backend";
import { momLive, sealKey } from "@/lib/mom/account/env";
import { clientKey, spend } from "@/lib/mom/account/limits";
import { seal } from "@/lib/mom/account/seal";
import { readSession } from "@/lib/mom/account/session";
import { cleanFileName, demoApplyBackend, liveApplyBackend, sniff } from "@/lib/mom/apply/backend";
import { getApplication, postCheckout, postPay } from "@/lib/mom/apply/pay";
import { FILE_MAX_BYTES, SLOT_RE } from "@/lib/mom/apply/policy";
import type { DocRef } from "@/lib/mom/apply/types";
import { failure, reply, sameOrigin } from "@/lib/mom/http";

export const dynamic = "force-dynamic";

const MINUTE = 60_000;
/** A receipt outlives any sensible draft; submission re-checks it. */
const RECEIPT_TTL = 30 * 24 * 60 * 60;
/** Multipart framing on top of the file itself. */
const ENVELOPE = 64 * 1024;

const backend = () => (momLive() ? liveApplyBackend : demoApplyBackend);

function unexpected(action: string, e: unknown) {
  if (e instanceof AccountError) return failure(e.code);
  logEvent("ERROR", "mom.apply.unexpected", { action, detail: e instanceof Error ? e.message : String(e) });
  return failure("upstream");
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/mom/apply/[action]">) {
  const { action } = await ctx.params;
  if (action !== "institutions" && action !== "application") return failure("invalid_input");
  const key = sealKey();
  if (!key) return failure("not_connected");
  const session = readSession(req, key);
  if (!session) return failure("no_session");
  if (action === "application") return getApplication(req, session, key);

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return reply({ ok: true, items: [] });
  const wait = await spend([[`mom:inst:${clientKey(req.headers)}`, 120, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  try {
    return reply({ ok: true, items: await backend().institutions(q) });
  } catch (e) {
    return unexpected(action, e);
  }
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/mom/apply/[action]">) {
  const { action } = await ctx.params;
  if (action !== "upload" && action !== "checkout" && action !== "pay") return failure("invalid_input");
  const key = sealKey();
  if (!key) return failure("not_connected");
  if (!sameOrigin(req)) return reply({ ok: false, code: "invalid_input" }, 403);
  const session = readSession(req, key);
  if (!session) return failure("no_session");
  if (action === "checkout") return postCheckout(req, session, key);
  if (action === "pay") return postPay(req, session, key);

  if (Number(req.headers.get("content-length") ?? 0) > FILE_MAX_BYTES + ENVELOPE) return failure("too_large");
  const wait = await spend([[`mom:upload:${session.applicant.id}`, 60, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return failure("invalid_input");
  }
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");
  if (!SLOT_RE.test(slot) || !(file instanceof File)) return failure("invalid_input");
  if (file.size > FILE_MAX_BYTES) return failure("too_large");
  if (file.size === 0) return failure("bad_type");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  if (!type) return failure("bad_type");
  const name = cleanFileName(file.name);

  try {
    const ref = await backend().store({ bytes, name, type, slot, applicantId: session.applicant.id });
    const id = seal(key, "document", { a: session.applicant.id, s: slot, r: ref }, RECEIPT_TTL);
    const doc: DocRef = { id, name, size: file.size, type };
    return reply({ ok: true, doc });
  } catch (e) {
    return unexpected(action, e);
  }
}

/** Employer batch: institution search, the MOM-list lookup for an imported
 *  sheet's institutions, candidate documents, checkout and payment.
 *  Signed-in organisations only. Demo unless `MOM_APPLY_LIVE` is set. */
import type { NextRequest } from "next/server";

import { logEvent } from "@/lib/leads/log";
import { AccountError } from "@/lib/mom/account/backend";
import { clientKey, spend } from "@/lib/mom/account/limits";
import { seal } from "@/lib/mom/account/seal";
import { cleanFileName, demoApplyBackend, liveApplyBackend, sniff } from "@/lib/mom/apply/backend";
import { fold } from "@/lib/mom/apply/institutions";
import { FILE_MAX_BYTES, INSTITUTION_MAX, SLOT_RE } from "@/lib/mom/apply/policy";
import type { DocRef, Institution } from "@/lib/mom/apply/types";
import { BATCH_MAX, CANDIDATE_ID_RE } from "@/lib/mom/org/batch";
import { orgKey, orgLive } from "@/lib/mom/org/env";
import { postLoa } from "@/lib/mom/org/loaOrg";
import { postBatchCheckout, postBatchPay } from "@/lib/mom/org/pay";
import { readOrgSession } from "@/lib/mom/org/session";
import type { OrgUser } from "@/lib/mom/org/types";
import { failure, reply, sameOrigin } from "@/lib/mom/http";

export const dynamic = "force-dynamic";

const MINUTE = 60_000;
/** A receipt outlives any sensible batch; checkout re-checks it. */
const RECEIPT_TTL = 30 * 24 * 60 * 60;
/** Multipart framing on top of the file itself. */
const ENVELOPE = 64 * 1024;
/** Upstream lookups in flight at once while resolving a sheet. */
const PARALLEL = 6;

const POST_ACTIONS = new Set(["resolve", "upload", "checkout", "pay", "status", "links", "loa"]);

const backend = () => (orgLive() ? liveApplyBackend : demoApplyBackend);

function unexpected(action: string, e: unknown) {
  if (e instanceof AccountError) return failure(e.code);
  logEvent("ERROR", "mom.org.batch.unexpected", { action, detail: e instanceof Error ? e.message : String(e) });
  return failure("upstream");
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/mom/org/batch/[action]">) {
  const { action } = await ctx.params;
  if (action !== "institutions") return failure("invalid_input");
  const key = orgKey();
  if (!key) return failure("not_connected");
  if (!readOrgSession(req, key)) return failure("no_session");

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return reply({ ok: true, items: [] });
  const wait = await spend([[`org:inst:${clientKey(req.headers)}`, 120, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  try {
    return reply({ ok: true, items: await backend().institutions(q) });
  } catch (e) {
    return unexpected(action, e);
  }
}

/** The exact institution for each name, or null when it isn't one we know. */
async function resolve(names: string[]): Promise<(Institution | null)[]> {
  const out: (Institution | null)[] = new Array(names.length).fill(null);
  let next = 0;
  async function worker() {
    while (next < names.length) {
      const i = next++;
      const want = fold(names[i]);
      const hits = await backend().institutions(names[i]);
      out[i] = hits.find((h) => fold(h.name) === want) ?? null;
    }
  }
  await Promise.all(Array.from({ length: Math.min(PARALLEL, names.length) }, worker));
  return out;
}

/** One candidate document. Checked by content, then stored (demo: hashed and
 *  dropped). The receipt names the account, candidate and slot, so it cannot
 *  be moved to another candidate or forged. */
async function upload(req: NextRequest, key: Buffer, user: OrgUser) {
  if (Number(req.headers.get("content-length") ?? 0) > FILE_MAX_BYTES + ENVELOPE) return failure("too_large");
  const wait = await spend([[`org:upload:${user.id}`, 600, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return failure("invalid_input");
  }
  const candidate = String(form.get("candidate") ?? "");
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");
  if (!CANDIDATE_ID_RE.test(candidate) || !SLOT_RE.test(slot) || !(file instanceof File)) return failure("invalid_input");
  if (file.size > FILE_MAX_BYTES) return failure("too_large");
  if (file.size === 0) return failure("bad_type");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  if (!type) return failure("bad_type");
  const name = cleanFileName(file.name);
  try {
    const ref = await backend().store({ bytes, name, type, slot, applicantId: `${user.id}:${candidate}` });
    const id = seal(key, "document", { o: user.id, c: candidate, s: slot, r: ref }, RECEIPT_TTL);
    const doc: DocRef = { id, name, size: file.size, type };
    return reply({ ok: true, doc });
  } catch (e) {
    return unexpected("upload", e);
  }
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/mom/org/batch/[action]">) {
  const { action } = await ctx.params;
  if (!POST_ACTIONS.has(action)) return failure("invalid_input");
  const key = orgKey();
  if (!key) return failure("not_connected");
  if (!sameOrigin(req)) return reply({ ok: false, code: "invalid_input" }, 403);
  const session = readOrgSession(req, key);
  if (!session) return failure("no_session");
  if (action === "upload") return upload(req, key, session.user);
  try {
    if (action === "checkout") return await postBatchCheckout(req, session.user, key);
    if (action === "pay") return await postBatchPay(req, session.user, key);
    if (action === "status" || action === "links" || action === "loa") return await postLoa(req, action, session.user, key);
  } catch (e) {
    return unexpected(action, e);
  }

  const body = (await req.json().catch(() => null)) as { names?: unknown } | null;
  const names = body?.names;
  if (
    !Array.isArray(names) ||
    names.length > BATCH_MAX ||
    !names.every((n): n is string => typeof n === "string" && n.trim().length > 1 && n.length <= INSTITUTION_MAX)
  ) {
    return failure("invalid_input");
  }
  const wait = await spend([[`org:resolve:${session.user.id}`, 30, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  try {
    return reply({ ok: true, items: await resolve(names) });
  } catch (e) {
    return unexpected(action, e);
  }
}

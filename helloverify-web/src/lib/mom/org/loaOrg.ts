/** The employer's side of a paid batch's letters: who has signed, sending the
 *  signing links again, and uploading a letter signed on paper. Every call
 *  presents the batch receipt from payment, which names the account. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { spend } from "../account/limits";
import { unseal } from "../account/seal";
import { cleanFileName, demoApplyBackend, liveApplyBackend, sniff } from "../apply/backend";
import { FILE_MAX_BYTES } from "../apply/policy";
import { failure, reply } from "../http";
import type { PaidBatch } from "./checkout";
import { orgLive } from "./env";
import { loaBackend, loaToken, readLoaJar, ticketsFor, writeLoaJar } from "./loaServer";
import { PAY_MAX } from "./pay";
import type { OrgUser } from "./types";

const MINUTE = 60_000;
const ENVELOPE = 64 * 1024;

type Receipt = { o: string; batch: PaidBatch };

function openReceipt(key: Buffer, user: OrgUser, token: unknown): PaidBatch | null {
  const r = typeof token === "string" ? unseal<Receipt>(key, "batch", token) : null;
  return r && r.o === user.id ? r.batch : null;
}

export async function postLoa(req: NextRequest, action: "status" | "links" | "loa", user: OrgUser, key: Buffer): Promise<NextResponse> {
  const jar = readLoaJar(req, key);
  const backend = loaBackend(jar);
  const finish = (res: NextResponse) => {
    writeLoaJar(res, key, jar);
    return res;
  };

  if (action === "loa") {
    if (Number(req.headers.get("content-length") ?? 0) > FILE_MAX_BYTES + PAY_MAX + ENVELOPE) return failure("too_large");
    const wait = await spend([[`org:loa:${user.id}`, 60, 10 * MINUTE]]);
    if (wait) return failure("rate_limited", { retryAfter: wait });
    const form = await req.formData().catch(() => null);
    const batch = openReceipt(key, user, form?.get("receipt"));
    const c = batch?.cases.find((x) => x.id === form?.get("case"));
    const file = form?.get("file");
    if (!batch || !c || !(file instanceof File)) return failure("invalid_input");
    if (file.size > FILE_MAX_BYTES) return failure("too_large");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = file.size ? sniff(bytes) : null;
    if (!type) return failure("bad_type");
    const store = orgLive() ? liveApplyBackend : demoApplyBackend;
    const ref = await store.store({ bytes, name: cleanFileName(file.name), type, slot: "loa", applicantId: `${user.id}:${c.candidate}` });
    const mark = await backend.upload(user.id, batch.id, c.id, ref);
    return finish(reply({ ok: true, mark }));
  }

  if (Number(req.headers.get("content-length") ?? 0) > PAY_MAX) return failure("too_large");
  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const batch = openReceipt(key, user, body.receipt);
  if (!batch) return failure("invalid_input");
  const ids = batch.cases.map((c) => c.id);

  if (action === "status") {
    const wait = await spend([[`org:loa-status:${user.id}`, 240, 10 * MINUTE]]);
    if (wait) return failure("rate_limited", { retryAfter: wait });
    return reply({ ok: true, status: await backend.status(ids) });
  }

  const asked = Array.isArray(body.cases) ? new Set(body.cases.filter((x): x is string => typeof x === "string")) : null;
  const signed = await backend.status(ids);
  const cases = batch.cases.filter((c) => !signed[c.id] && (!asked || asked.has(c.id)));
  if (!cases.length) return reply({ ok: true, demo: backend.demo, sent: 0, links: {} });
  const perCase = backend.demo ? [] : cases.map((c): [string, number, number] => [`org:link:${c.id}`, 3, 60 * MINUTE]);
  const wait = await spend([[`org:links:${user.id}`, 30, 10 * MINUTE], ...perCase]);
  if (wait) return failure("rate_limited", { retryAfter: wait });

  const tickets = ticketsFor(batch, user.id, cases);
  const tokens = tickets.map((t) => loaToken(key, t));
  if (backend.demo) return reply({ ok: true, demo: true, sent: 0, links: Object.fromEntries(cases.map((c, i) => [c.id, tokens[i]])) });
  await backend.sendLinks(tickets, tokens);
  return reply({ ok: true, demo: false, sent: cases.length, links: {} });
}

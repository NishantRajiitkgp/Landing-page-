/** Checkout and payment for `/api/mom/org/batch/{checkout,pay}`.
 *
 *  The batch is validated and priced here, then sealed with a case id per
 *  candidate. Pay trusts the seal, not the browser, so paying twice gives the
 *  same batch. Demo confirms immediately; live opens one Razorpay SGD order and
 *  checks the gateway's signature upstream, which also numbers the tax
 *  invoice. Those endpoints are null until the backend team supplies them.
 *  Live then emails each candidate the link to sign their letter. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { authorityPost } from "@/lib/authority/upstream";
import { logEvent } from "@/lib/leads/log";
import { momDoc } from "@/lib/mom/doc";

import { AccountError } from "../account/backend";
import { spend } from "../account/limits";
import { seal, unseal } from "../account/seal";
import { liveApplyBackend } from "../apply/backend";
import { newBatchId, newCaseId } from "../apply/ids";
import { today } from "../apply/policy";
import { pricesFrom } from "../apply/pricing";
import type { PassType } from "../apply/types";
import { failure, reply } from "../http";
import { batchQuote, qualHasAcc } from "./batch";
import type { BatchBilling, PaidBatch, PaidCase, Supplier } from "./checkout";
import { orgLive } from "./env";
import { loaBackend, loaToken, ticketsFor } from "./loaServer";
import { orgReceiptsValid, readBatchSubmission, type OpenedOrgReceipt } from "./submit";
import type { OrgUser } from "./types";

const MINUTE = 60_000;
const INTENT_TTL = 15 * 60;
/** The paid batch is the employer's receipt; later calls present it back. */
export const RECEIPT_TTL = 400 * 24 * 60 * 60;
/** 200 candidates with every document receipt fit well inside this. */
const CHECKOUT_MAX = 3_000_000;
export const PAY_MAX = 1_000_000;

type Intent = Omit<PaidBatch, "paidAt" | "reference" | "invoice"> & { o: string; orderId?: string };

/** `null` = api.helloverify.sg has no batch endpoint for this yet. */
const BATCH_ENDPOINTS = { confirm: null as string | null };

/** The seller on the invoice. Live refuses to sell without a GST number. */
function supplier(): Supplier | null {
  const name = process.env.MOM_INVOICE_NAME?.trim() || "HelloVerify Ai Pte. Ltd.";
  const gst = process.env.MOM_INVOICE_GST_NO?.trim() ?? "";
  const address = process.env.MOM_INVOICE_ADDRESS?.trim() ?? "";
  if (orgLive() && (!gst || !address)) return null;
  return { name, gst, address };
}

async function bodyOf(req: NextRequest, max: number): Promise<unknown | undefined> {
  if (Number(req.headers.get("content-length") ?? 0) > max) return undefined;
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

const limited = (key: string) => spend([[key, 8, 10 * MINUTE]]);

export async function postBatchCheckout(req: NextRequest, user: OrgUser, key: Buffer): Promise<NextResponse> {
  if (Number(req.headers.get("content-length") ?? 0) > CHECKOUT_MAX) return failure("too_large");
  const wait = await limited(`org:checkout:${user.id}`);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  const seller = supplier();
  if (!seller) return failure("not_connected");

  const read = readBatchSubmission(await bodyOf(req, CHECKOUT_MAX), today());
  if (!read.ok) return failure("invalid_input", read.code === "incomplete" ? { step: read.step } : {});
  if (!orgReceiptsValid(read.candidates, user.id, (id) => unseal<OpenedOrgReceipt>(key, "document", id))) {
    return failure("invalid_input", { step: "documents" });
  }

  const prices = pricesFrom(momDoc("en"));
  const priced = batchQuote(read.candidates, prices);
  const cases: PaidCase[] = read.candidates.map((c) => ({
    id: newCaseId(),
    candidate: c.id,
    name: c.fullName.replace(/\s+/g, " ").trim(),
    email: c.email.trim().toLowerCase(),
    passportNo: c.passportNo,
    dob: c.dob,
    nationality: c.nationality,
    passType: c.passType as PassType,
    quals: c.quals.map((q) => ({ level: q.level, course: q.course.trim(), institution: q.institution.trim(), country: q.country, start: q.start, end: q.end })),
    acc: c.quals.filter((q) => qualHasAcc(c, q)).length,
    express: c.express,
  }));
  const intent: Intent = {
    o: user.id,
    id: newBatchId(),
    demo: !orgLive(),
    billing: read.billing,
    supplier: seller,
    lines: priced.lines,
    subtotal: priced.subtotal,
    gst: priced.gst,
    rate: Math.round(prices.gst * 100),
    total: priced.total,
    currency: "SGD",
    cases,
  };
  const amount = Math.round(priced.total * 100);

  if (!orgLive()) {
    return reply({ ok: true, demo: true, intent: seal(key, "payment", intent, INTENT_TTL), total: priced.total, amount, currency: "SGD" });
  }
  try {
    const order = await liveApplyBackend.checkout(amount, intent.id, user.id);
    const token = seal(key, "payment", { ...intent, orderId: order.orderId }, INTENT_TTL);
    return reply({ ok: true, demo: false, intent: token, orderId: order.orderId, key: order.key, total: priced.total, amount, currency: "SGD" });
  } catch (e) {
    return failure(e instanceof AccountError ? e.code : "upstream");
  }
}

async function confirmLive(intent: Intent, orderId: string, paymentId: string, signature: string): Promise<{ invoice: string; cases: string[] }> {
  if (!BATCH_ENDPOINTS.confirm) throw new AccountError("not_connected");
  let res: Record<string, unknown>;
  try {
    res = await authorityPost("mom", BATCH_ENDPOINTS.confirm, {
      order_id: orderId,
      payment_id: paymentId,
      signature,
      batch_id: intent.id,
      billing: intent.billing satisfies BatchBilling,
      candidates: intent.cases.map((c) => ({ candidate_id: c.candidate, name: c.name, email: c.email, passport_no: c.passportNo, express: c.express })),
    });
  } catch {
    throw new AccountError("upstream");
  }
  const data = res.data as { invoice_no?: unknown; case_ids?: unknown } | undefined;
  const ids = data?.case_ids;
  if (typeof data?.invoice_no !== "string" || !Array.isArray(ids) || ids.length !== intent.cases.length || !ids.every((x) => typeof x === "string" && x)) {
    throw new AccountError("upstream");
  }
  return { invoice: data.invoice_no, cases: ids as string[] };
}

export async function postBatchPay(req: NextRequest, user: OrgUser, key: Buffer): Promise<NextResponse> {
  const wait = await limited(`org:pay:${user.id}`);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  const body = await bodyOf(req, PAY_MAX);
  const posted = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const intent = unseal<Intent>(key, "payment", typeof posted.intent === "string" ? posted.intent : null);
  if (!intent || intent.o !== user.id || intent.total <= 0) return failure("invalid_input");

  const tag = intent.id.slice(4).replace("-", "");
  let paid: PaidBatch = {
    id: intent.id,
    invoice: `DEMO-${tag}`,
    paidAt: new Date().toISOString(),
    reference: `P-DEMO${tag}`,
    demo: intent.demo,
    billing: intent.billing,
    supplier: intent.supplier,
    lines: intent.lines,
    subtotal: intent.subtotal,
    gst: intent.gst,
    rate: intent.rate,
    total: intent.total,
    currency: "SGD",
    cases: intent.cases,
  };
  if (orgLive()) {
    const paymentId = typeof posted.razorpay_payment_id === "string" ? posted.razorpay_payment_id : "";
    const orderId = typeof posted.razorpay_order_id === "string" ? posted.razorpay_order_id : "";
    const signature = typeof posted.razorpay_signature === "string" ? posted.razorpay_signature : "";
    if (!intent.orderId || orderId !== intent.orderId || paymentId.length < 4 || signature.length < 8) return failure("invalid_input");
    try {
      const done = await confirmLive(intent, orderId, paymentId, signature);
      paid = { ...paid, reference: paymentId, invoice: done.invoice, cases: paid.cases.map((c, i) => ({ ...c, id: done.cases[i] })) };
    } catch (e) {
      return failure(e instanceof AccountError ? e.code : "upstream");
    }
    const tickets = ticketsFor(paid, user.id, paid.cases);
    try {
      await loaBackend({ status: {}, changed: false }).sendLinks(tickets, tickets.map((t) => loaToken(key, t)));
    } catch (e) {
      logEvent("WARNING", "mom.org.loa.links", { batch: paid.id, detail: e instanceof Error ? e.message : String(e) });
    }
  }
  return reply({ ok: true, batch: paid, receipt: seal(key, "batch", { o: user.id, batch: paid }, RECEIPT_TTL) });
}

/** Checkout and payment for `/api/mom/apply/{checkout,pay,application}`.
 *
 *  The amount is computed here, then sealed. Pay trusts the seal, not the
 *  browser. Demo confirms immediately; live opens a Razorpay order and checks
 *  the gateway's signature upstream. Those endpoints are null until they exist. */
import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { momDoc } from "@/lib/mom/doc";

import { AccountError } from "../account/backend";
import { momLive } from "../account/env";
import { clientKey, spend } from "../account/limits";
import { seal, unseal } from "../account/seal";
import type { SessionData } from "../account/session";
import { failure, reply } from "../http";
import { liveApplyBackend } from "./backend";
import { readCases, writeCases } from "./cases";
import { newCaseId, newReference } from "./ids";
import { today } from "./policy";
import { pricesFrom, quote } from "./pricing";
import { rejectReceipts, readSubmission } from "./submit";
import type { Billing, CaseFile, Level, PassType } from "./types";

const MINUTE = 60_000;
const INTENT_TTL = 15 * 60;
const BODY_MAX = 100_000;

type Intent = {
  a: string;
  caseId: string;
  reference: string;
  orderId?: string;
  total: number;
  gst: number;
  lines: CaseFile["lines"];
  express: boolean;
  holder: string;
  pass: PassType;
  quals: { institution: string; level: Level; course: string }[];
  billing: Billing;
};

function tooBig(req: NextRequest): boolean {
  return Number(req.headers.get("content-length") ?? 0) > BODY_MAX;
}

async function bodyOf(req: NextRequest): Promise<unknown | undefined> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

function limited(key: string) {
  return spend([[key, 8, 10 * MINUTE]]);
}

function caseFrom(intent: Intent, reference: string): CaseFile {
  return {
    id: intent.caseId,
    paidAt: new Date().toISOString(),
    express: intent.express,
    holder: intent.holder,
    pass: intent.pass,
    quals: intent.quals,
    billing: intent.billing,
    lines: intent.lines,
    gst: intent.gst,
    total: intent.total,
    currency: "SGD",
    reference,
  };
}

function saved(req: NextRequest, key: Buffer, applicantId: string): CaseFile | null {
  return readCases(req, key).find((c) => c.applicantId === applicantId)?.file ?? null;
}

export async function postCheckout(req: NextRequest, session: SessionData, key: Buffer): Promise<NextResponse> {
  if (tooBig(req)) return failure("too_large");
  const wait = await limited(`mom:checkout:${session.applicant.id}`);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  const have = saved(req, key, session.applicant.id);
  if (have) return reply({ ok: true, already: true, application: have });

  const read = readSubmission(await bodyOf(req), today());
  if (!read.ok) return failure("invalid_input", read.code === "incomplete" ? { step: read.step } : {});
  const forged = rejectReceipts(read.draft, session.applicant.id, (id) => unseal(key, "document", id));
  if (forged) return failure("invalid_input", { step: forged });

  const priced = quote(read.draft, pricesFrom(momDoc("en")));
  const intent: Intent = {
    a: session.applicant.id,
    caseId: newCaseId(),
    reference: newReference(),
    total: priced.total,
    gst: priced.gst,
    lines: priced.lines,
    express: read.draft.express,
    holder: read.draft.about.fullName.replace(/\s+/g, " ").trim(),
    pass: read.draft.about.passType as PassType,
    quals: read.draft.quals.map((q) => ({ institution: q.institution.trim(), level: q.level as Level, course: q.course.trim() })),
    billing: read.billing,
  };

  if (!momLive()) {
    return reply({ ok: true, demo: true, intent: seal(key, "payment", intent, INTENT_TTL), total: priced.total, amount: Math.round(priced.total * 100), currency: "SGD" });
  }
  try {
    const order = await liveApplyBackend.checkout(Math.round(priced.total * 100), intent.caseId, session.applicant.id);
    const token = seal(key, "payment", { ...intent, orderId: order.orderId }, INTENT_TTL);
    return reply({ ok: true, demo: false, intent: token, orderId: order.orderId, key: order.key, total: priced.total, amount: Math.round(priced.total * 100), currency: "SGD" });
  } catch (e) {
    return failure(e instanceof AccountError ? e.code : "upstream");
  }
}

export async function postPay(req: NextRequest, session: SessionData, key: Buffer): Promise<NextResponse> {
  if (tooBig(req)) return failure("too_large");
  const wait = await limited(`mom:pay:${session.applicant.id}`);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  const have = saved(req, key, session.applicant.id);
  if (have) return reply({ ok: true, already: true, application: have });

  const body = await bodyOf(req);
  const posted = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const intent = unseal<Intent>(key, "payment", typeof posted.intent === "string" ? posted.intent : null);
  if (!intent || intent.a !== session.applicant.id || intent.total <= 0) return failure("invalid_input");

  let reference = intent.reference;
  if (momLive()) {
    const paymentId = typeof posted.razorpay_payment_id === "string" ? posted.razorpay_payment_id : "";
    const orderId = typeof posted.razorpay_order_id === "string" ? posted.razorpay_order_id : "";
    const signature = typeof posted.razorpay_signature === "string" ? posted.razorpay_signature : "";
    if (!intent.orderId || orderId !== intent.orderId || paymentId.length < 4 || signature.length < 8) return failure("invalid_input");
    try {
      await liveApplyBackend.confirm(orderId, paymentId, signature);
    } catch (e) {
      return failure(e instanceof AccountError ? e.code : "upstream");
    }
    reference = paymentId;
  }

  const file = caseFrom(intent, reference);
  const res = reply({ ok: true, application: file });
  writeCases(res, key, [...readCases(req, key).filter((c) => c.applicantId !== session.applicant.id), { applicantId: session.applicant.id, file }]);
  return res;
}

export async function getApplication(req: NextRequest, session: SessionData, key: Buffer): Promise<NextResponse> {
  const wait = await spend([[`mom:case:${clientKey(req.headers)}`, 120, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });
  return reply({ ok: true, application: saved(req, key, session.applicant.id) });
}

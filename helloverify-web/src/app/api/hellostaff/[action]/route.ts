/** Hello Staff checkout for the four HelloV home services: OTP sign-in, the
 *  case's document check, Razorpay, OCR and DigiLocker. Every call forwards
 *  to the Hello Staff onboarding API unchanged (`lib/hellostaff/upstream`);
 *  the case id comes from the sealed cookie, never from the browser. Demo
 *  unless `HELLOSTAFF_LIVE` is set (see `.env.example`). */
import { NextResponse, type NextRequest } from "next/server";

import { logEvent } from "@/lib/leads/log";
import { clientKey, spend } from "@/lib/mom/account/limits";
import { CHECK_MASTER, hsService, hsTotal, type HsService } from "@/lib/hellostaff/catalog";
import { demoHelloStaff } from "@/lib/hellostaff/demo";
import { helloStaffLive, hsSealKey } from "@/lib/hellostaff/env";
import { clearHsSession, readHsSession, writeHsSession, type HsSession } from "@/lib/hellostaff/session";
import type { HsErrorCode } from "@/lib/hellostaff/types";
import { HsUpstreamError, liveHelloStaff } from "@/lib/hellostaff/upstream";
import { sameOrigin } from "@/lib/mom/http";

export const dynamic = "force-dynamic";

const MINUTE = 60_000;
const FILE_MAX = 5 * 1024 * 1024;
const FILE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]);

const MOBILE = /^[6-9]\d{9}$/;
const OTP = /^\d{4,6}$/;
const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AADHAAR = /^\d{12}$/;
const TOKEN = /^[\w.:-]{1,200}$/;

const STATUS: Record<HsErrorCode, number> = {
  invalid_input: 400,
  invalid_code: 400,
  no_session: 401,
  too_large: 413,
  rate_limited: 429,
  not_connected: 503,
  upstream: 502,
};

const backend = () => (helloStaffLive() ? liveHelloStaff : demoHelloStaff);

function reply(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function failure(code: HsErrorCode, extra: { message?: string; retryAfter?: number } = {}) {
  return reply({ ok: false, code, ...extra }, STATUS[code]);
}

function unexpected(action: string, e: unknown) {
  if (e instanceof HsUpstreamError) {
    logEvent(e.code === "not_connected" ? "ERROR" : "WARNING", "hellostaff.upstream", { action, detail: e.message });
    return failure(e.code);
  }
  logEvent("ERROR", "hellostaff.unexpected", { action, detail: e instanceof Error ? e.message : String(e) });
  return failure("upstream");
}

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v: unknown) => (Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : 0);

function device(v: unknown): Record<string, string> {
  if (!v || typeof v !== "object") return {};
  return Object.fromEntries(
    Object.entries(v as Record<string, unknown>)
      .slice(0, 16)
      .map(([k, x]) => [k.slice(0, 40), str(x, 400)]),
  );
}

/** Only the question ids the backend lists for this check, as strings. */
function pickAnswers(raw: unknown, ids: number[]): Record<string, string> {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return Object.fromEntries(ids.map((id) => [String(id), str(src[String(id)], 500)]).filter(([, v]) => v));
}

type Ctx = { session: HsSession; service: HsService; master: number };

async function lifecycleFor({ session, service, master }: Ctx): Promise<string | null> {
  const all = await backend().lifecycles(session.caseId, service.packageId);
  return all.find((l) => l.checkRefId === master)?.lifecycleId || null;
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/hellostaff/[action]">) {
  const { action } = await ctx.params;
  const key = hsSealKey();
  if (!key) return failure("not_connected");
  const q = req.nextUrl.searchParams;

  try {
    if (action === "states") return reply({ ok: true, items: await backend().states(int(q.get("country")) || 1) });
    if (action === "cities") {
      const state = int(q.get("state"));
      if (!state) return failure("invalid_input");
      return reply({ ok: true, items: await backend().cities(state) });
    }
    if (action === "case") {
      const session = readHsSession(req, key);
      const service = hsService(q.get("service") ?? "");
      if (!service) return failure("invalid_input");
      if (!session || session.slug !== service.slug) return failure("no_session");
      const master = CHECK_MASTER[service.doc];
      const listed = (await backend().lifecycles(session.caseId, service.packageId)).some((l) => l.checkRefId === master);
      const check = listed ? await backend().checkQuestions(session.caseId, master) : null;
      return reply({ ok: true, case: { caseId: session.caseId, name: session.name, mobile: session.mobile, check } });
    }
  } catch (e) {
    return unexpected(action, e);
  }
  return failure("invalid_input");
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/hellostaff/[action]">) {
  const { action } = await ctx.params;
  const key = hsSealKey();
  if (!key) return failure("not_connected");
  if (!sameOrigin(req)) return reply({ ok: false, code: "invalid_input" }, 403);

  if (action === "extract") return extract(req, key);

  let body: Record<string, unknown>;
  try {
    body = ((await req.json()) ?? {}) as Record<string, unknown>;
  } catch {
    return failure("invalid_input");
  }

  try {
    if (action === "send-otp") {
      const mobile = str(body.mobile);
      if (!MOBILE.test(mobile)) return failure("invalid_input");
      const wait = await spend([
        [`hs:cool:${mobile}`, 1, 30_000],
        [`hs:send:${mobile}`, 5, 10 * MINUTE],
        [`hs:send-ip:${clientKey(req.headers)}`, 20, 10 * MINUTE],
      ]);
      if (wait) return failure("rate_limited", { retryAfter: wait });
      const sent = await backend().sendOtp(mobile);
      return sent.sent ? reply({ ok: true }) : failure("upstream", { message: sent.message });
    }

    if (action === "login") return login(body, key);

    if (action === "sign-out") {
      const res = reply({ ok: true });
      clearHsSession(res);
      return res;
    }

    const service = hsService(str(body.service));
    const session = readHsSession(req, key);
    if (!service) return failure("invalid_input");
    if (!session || session.slug !== service.slug) return failure("no_session");
    const c: Ctx = { session, service, master: CHECK_MASTER[service.doc] };

    switch (action) {
      case "pay-order": {
        if (!helloStaffLive()) return reply({ ok: true, demo: true, amount: hsTotal(service, body.fir === true) });
        const order = await liveHelloStaff.paymentRequest(session.caseId);
        return reply({ ok: true, demo: false, ...order });
      }
      case "pay-verify": {
        if (!helloStaffLive()) return reply({ ok: true });
        const p = {
          razorpay_payment_id: str(body.razorpay_payment_id),
          razorpay_order_id: str(body.razorpay_order_id),
          razorpay_signature: str(body.razorpay_signature, 400),
        };
        if (!p.razorpay_payment_id || !p.razorpay_order_id || !p.razorpay_signature) return failure("invalid_input");
        return (await liveHelloStaff.paymentVerify(p)) ? reply({ ok: true }) : failure("upstream");
      }
      case "save-check": {
        const docType = body.docType === "digilocker" ? "digilocker" : "upload";
        const check = await backend().checkQuestions(session.caseId, c.master);
        if (!check.checkId) return failure("upstream");
        if (check.filled) return reply({ ok: true, already: true });
        const answers = pickAnswers(body.answers, check.questions.map((q) => q.id));
        const saved = await backend().saveCheck(check.checkId, docType, answers);
        return saved.saved ? reply({ ok: true }) : failure("upstream", { message: saved.message });
      }
      case "digilocker-start": {
        const lifecycle = await lifecycleFor(c);
        if (!lifecycle) return failure("upstream");
        const s = await backend().digilockerSession(lifecycle);
        if (!s) return failure("upstream");
        return reply({ ok: true, sessionId: s.sessionId, docType: s.docType || (service.doc === "dl" ? "DRVLC" : "ADHAR") });
      }
      case "digilocker-open": {
        const sessionId = str(body.sessionId);
        const docType = service.doc === "dl" ? "DRVLC" : "ADHAR";
        if (!TOKEN.test(sessionId)) return failure("invalid_input");
        if (service.doc === "aadhaar") {
          const aadhaar = str(body.aadhaar);
          if (!AADHAAR.test(aadhaar)) return failure("invalid_input");
          await backend().saveAadhaar(aadhaar, session.caseId);
        }
        const lifecycle = await lifecycleFor(c);
        if (!lifecycle || !(await backend().digilockerSource(lifecycle))) return failure("upstream");
        return reply({ ok: true, url: backend().digilockerUrl(sessionId, docType) });
      }
      case "digilocker-list": {
        const sessionId = str(body.sessionId);
        if (!TOKEN.test(sessionId)) return failure("invalid_input");
        const list = await backend().listDocuments(sessionId);
        return reply({ ok: true, ...list, retryUrl: backend().digilockerRetryUrl(sessionId) });
      }
      case "digilocker-select": {
        const sessionId = str(body.sessionId);
        const accessToken = str(body.accessToken, 400);
        const docs = (Array.isArray(body.docs) ? body.docs : [])
          .slice(0, 10)
          .map((d) => ({ name: str((d as Record<string, unknown>)?.name), uri: str((d as Record<string, unknown>)?.uri, 400) }))
          .filter((d) => d.uri);
        if (!TOKEN.test(sessionId) || !accessToken || !docs.length) return failure("invalid_input");
        const r = await backend().selectDocuments(accessToken, sessionId, docs);
        return r.saved ? reply({ ok: true }) : failure("upstream", { message: r.message });
      }
      case "digilocker-submit": {
        const check = await backend().checkQuestions(session.caseId, c.master);
        if (!check.checkId) return failure("upstream");
        if (check.filled) return reply({ ok: true, already: true });
        const count = await backend().digiDocCount(check.checkId);
        /** Hello Staff submits an Aadhaar check even when DigiLocker had
         *  nothing; a licence check without a document is refused. */
        if (!count && service.doc === "dl") return reply({ ok: false, code: "upstream", none: true }, 200);
        const answers = pickAnswers(body.answers, check.questions.map((q) => q.id));
        const saved = await backend().saveCheck(check.checkId, "digilocker", answers);
        return saved.saved ? reply({ ok: true, found: count > 0 }) : failure("upstream", { message: saved.message });
      }
    }
  } catch (e) {
    return unexpected(action, e);
  }
  return failure("invalid_input");
}

async function login(body: Record<string, unknown>, key: Buffer) {
  const service = hsService(str(body.service));
  const mobile = str(body.mobile);
  const otp = str(body.otp);
  const mode = body.mode === "register" ? "register" : "login";
  if (!service || !MOBILE.test(mobile) || !OTP.test(otp)) return failure("invalid_input");

  const wait = await spend([[`hs:verify:${mobile}`, 8, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });

  const common = { otp, mobile, device: device(body.device) };
  let outcome;
  if (mode === "register") {
    const r = (body.register ?? {}) as Record<string, unknown>;
    const name = str(r.name, 120);
    const email = str(r.email, 160);
    const address = str(r.address, 400);
    const countryId = int(r.countryId) || 1;
    const stateId = int(r.stateId);
    const cityId = int(r.cityId);
    /** Hello Staff asks for PAN and checks its shape, but `login` takes no
     *  PAN field, so it is validated here and not sent. */
    if (!name || !PAN.test(str(r.pan).toUpperCase()) || !EMAIL.test(email) || !address || !stateId || !cityId) {
      return failure("invalid_input");
    }
    outcome = await backend().login({ ...common, mode, name, email, address, countryId, stateId, cityId, packageId: service.packageId });
  } else {
    outcome = await backend().login({ ...common, mode });
  }

  if (!outcome.ok) return failure("invalid_code", { message: outcome.message });
  if (!outcome.caseId) return failure("upstream");
  const res = reply({ ok: true, caseId: outcome.caseId, name: outcome.name });
  writeHsSession(res, key, { caseId: outcome.caseId, userId: outcome.userId, name: outcome.name, mobile: outcome.mobile, slug: service.slug });
  return res;
}

async function extract(req: NextRequest, key: Buffer) {
  if (Number(req.headers.get("content-length") ?? 0) > 2 * FILE_MAX + 64 * 1024) return failure("too_large");
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return failure("invalid_input");
  }
  const service = hsService(String(form.get("service") ?? ""));
  const session = readHsSession(req, key);
  if (!service) return failure("invalid_input");
  if (!session || session.slug !== service.slug) return failure("no_session");

  const files = form.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);
  const need = service.doc === "aadhaar" ? 2 : 1;
  if (files.length !== need) return failure("invalid_input");
  if (files.some((f) => f.size > FILE_MAX)) return failure("too_large");
  if (files.some((f) => f.type && !FILE_TYPES.has(f.type))) return failure("invalid_input");

  const wait = await spend([[`hs:ocr:${session.caseId}`, 20, 10 * MINUTE]]);
  if (wait) return failure("rate_limited", { retryAfter: wait });

  try {
    return reply({ ok: true, fields: await backend().extract(session.caseId, CHECK_MASTER[service.doc], files) });
  } catch (e) {
    return unexpected("extract", e);
  }
}

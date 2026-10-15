/** MOM applicant account: codes, register, sign in, password reset, session.
 *  Demo unless `MOM_APPLY_LIVE` is set (see `.env.example`). */
import type { NextRequest, NextResponse } from "next/server";

import { logEvent } from "@/lib/leads/log";
import {
  AccountError,
  DemoDirectory,
  demoBackend,
  liveBackend,
  type CodeTarget,
  type SignInTicket,
} from "@/lib/mom/account/backend";
import { momLive, sealKey } from "@/lib/mom/account/env";
import { clientKey, LIMITS, spend } from "@/lib/mom/account/limits";
import { maskEmail, SIGN_IN_CODE_SECONDS } from "@/lib/mom/account/policy";
import {
  firstField,
  forgotSchema,
  registerSchema,
  sendCodeSchema,
  signInSchema,
  signInVerifySchema,
  verifyCodeSchema,
} from "@/lib/mom/account/requests";
import { seal, sealRemaining, unseal } from "@/lib/mom/account/seal";
import { SESSION_COOKIE, clearSession, readDemo, readSession, writeDemo, writeSession } from "@/lib/mom/account/session";
import { failure, reply, sameOrigin } from "@/lib/mom/http";

export const dynamic = "force-dynamic";

const PROOF_TTL = 20 * 60;

const targetKey = (t: CodeTarget) => (t.channel === "email" ? `e:${t.email}` : `p:${t.dial}${t.phone}`);

export async function GET(req: NextRequest, ctx: RouteContext<"/api/mom/account/[action]">) {
  const { action } = await ctx.params;
  if (action !== "session") return failure("invalid_input");
  const key = sealKey();
  if (!key) return failure("not_connected");
  const session = readSession(req, key);
  const res = reply({ ok: true, applicant: session?.applicant ?? null, demo: !momLive() });
  const ttl = sealRemaining(key, "session", req.cookies.get(SESSION_COOKIE)?.value);
  if (session && ttl) writeSession(res, key, session, ttl);
  return res;
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/mom/account/[action]">) {
  const { action } = await ctx.params;
  const key = sealKey();
  if (!key) return failure("not_connected");
  if (!sameOrigin(req)) return reply({ ok: false, code: "invalid_input" }, 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const demo = !momLive();
  const directory = demo ? new DemoDirectory(readDemo(req, key)) : null;
  const backend = directory ? demoBackend(directory) : liveBackend();
  const client = clientKey(req.headers);
  const finish = (res: NextResponse) => {
    if (directory?.changed) writeDemo(res, key, directory.accounts);
    return res;
  };

  try {
    switch (action) {
      case "send-code": {
        const parsed = sendCodeSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const target: CodeTarget =
          parsed.data.channel === "email"
            ? { channel: "email", email: parsed.data.email }
            : { channel: "phone", dial: parsed.data.dial, phone: parsed.data.phone };
        const wait = await spend(LIMITS.sendCode(targetKey(target), client));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        await backend.sendCode(target, parsed.data.name);
        return reply({ ok: true, demo });
      }

      case "verify-code": {
        const parsed = verifyCodeSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const target: CodeTarget =
          parsed.data.channel === "email"
            ? { channel: "email", email: parsed.data.email }
            : { channel: "phone", dial: parsed.data.dial, phone: parsed.data.phone };
        const wait = await spend(LIMITS.verifyCode(targetKey(target)));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        await backend.verifyCode(target, parsed.data.code);
        return reply({ ok: true, proof: seal(key, "proof", { t: targetKey(target) }, PROOF_TTL) });
      }

      case "register": {
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const { emailProof, phoneProof, first, last, email, dial, phone, password } = parsed.data;
        const account = { first, last, email, dial, phone, password };
        const emailOk = unseal<{ t: string }>(key, "proof", emailProof)?.t === `e:${account.email}`;
        if (!emailOk) return failure("unverified", { field: "email" });
        const phoneOk = unseal<{ t: string }>(key, "proof", phoneProof)?.t === `p:${account.dial}${account.phone}`;
        if (!phoneOk) return failure("unverified", { field: "phone" });
        const applicant = await backend.register(account);
        const res = reply({ ok: true, applicant });
        writeSession(res, key, { applicant });
        return finish(res);
      }

      case "sign-in": {
        const parsed = signInSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const wait = await spend(LIMITS.signIn(parsed.data.email, client));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        const ticket = await backend.signIn(parsed.data.email, parsed.data.password);
        return reply({
          ok: true,
          challenge: seal(key, "challenge", ticket, SIGN_IN_CODE_SECONDS),
          sentTo: maskEmail(parsed.data.email),
          expiresIn: SIGN_IN_CODE_SECONDS,
          demo,
        });
      }

      case "sign-in-verify": {
        const parsed = signInVerifySchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const ticket = unseal<SignInTicket>(key, "challenge", parsed.data.challenge);
        if (!ticket) return failure("code_expired");
        const wait = await spend(LIMITS.verifyCode(`signin:${ticket.email}`));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        const applicant = await backend.signInVerify(ticket, parsed.data.code);
        const res = reply({ ok: true, applicant });
        writeSession(res, key, { applicant, upstream: ticket.upstream });
        return res;
      }

      case "forgot-password": {
        const parsed = forgotSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const wait = await spend(LIMITS.forgot(parsed.data.email, client));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        await backend.forgotPassword(parsed.data.email);
        return reply({ ok: true, sentTo: maskEmail(parsed.data.email) });
      }

      case "sign-out": {
        const res = reply({ ok: true });
        clearSession(res);
        return res;
      }

      default:
        return failure("invalid_input");
    }
  } catch (e) {
    if (e instanceof AccountError) return failure(e.code, { field: e.field });
    logEvent("ERROR", "mom.account.unexpected", { action, detail: e instanceof Error ? e.message : String(e) });
    return failure("upstream");
  }
}

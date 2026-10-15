/** Employer account: codes, register, sign in, password reset, session.
 *  Demo unless `MOM_APPLY_LIVE` is set. */
import type { NextRequest, NextResponse } from "next/server";

import { logEvent } from "@/lib/leads/log";
import { clientKey, spend } from "@/lib/mom/account/limits";
import { maskEmail, SIGN_IN_CODE_SECONDS } from "@/lib/mom/account/policy";
import { seal, sealRemaining, unseal } from "@/lib/mom/account/seal";
import { failure, reply, sameOrigin } from "@/lib/mom/http";
import { AccountError, demoOrgBackend, liveOrgBackend, OrgDirectory, type CodeTarget, type OrgTicket } from "@/lib/mom/org/backend";
import { orgKey, orgLive } from "@/lib/mom/org/env";
import { ORG_LIMITS } from "@/lib/mom/org/limits";
import {
  firstField,
  forgotSchema,
  orgRegisterSchema,
  sendCodeSchema,
  signInSchema,
  signInVerifySchema,
  verifyCodeSchema,
} from "@/lib/mom/org/requests";
import { ORG_SESSION_COOKIE, clearOrgSession, readOrgDemo, readOrgSession, writeOrgDemo, writeOrgSession } from "@/lib/mom/org/session";
import type { OrgKind } from "@/lib/mom/org/types";

export const dynamic = "force-dynamic";

const PROOF_TTL = 20 * 60;

const targetKey = (t: CodeTarget) => (t.channel === "email" ? `e:${t.email}` : `p:${t.dial}${t.phone}`);

export async function GET(req: NextRequest, ctx: RouteContext<"/api/mom/org/[action]">) {
  const { action } = await ctx.params;
  if (action !== "session") return failure("invalid_input");
  const key = orgKey();
  if (!key) return failure("not_connected");
  const session = readOrgSession(req, key);
  const res = reply({ ok: true, user: session?.user ?? null, demo: !orgLive() });
  const ttl = sealRemaining(key, "session", req.cookies.get(ORG_SESSION_COOKIE)?.value);
  if (session && ttl) writeOrgSession(res, key, session, ttl);
  return res;
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/mom/org/[action]">) {
  const { action } = await ctx.params;
  const key = orgKey();
  if (!key) return failure("not_connected");
  if (!sameOrigin(req)) return reply({ ok: false, code: "invalid_input" }, 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const demo = !orgLive();
  const directory = demo ? new OrgDirectory(readOrgDemo(req, key)) : null;
  const backend = directory ? demoOrgBackend(directory) : liveOrgBackend();
  const client = clientKey(req.headers);
  const finish = (res: NextResponse) => {
    if (directory?.changed) writeOrgDemo(res, key, directory.accounts);
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
        const wait = await spend(ORG_LIMITS.sendCode(targetKey(target), client));
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
        const wait = await spend(ORG_LIMITS.verifyCode(targetKey(target)));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        await backend.verifyCode(target, parsed.data.code);
        return reply({ ok: true, proof: seal(key, "proof", { t: targetKey(target) }, PROOF_TTL) });
      }

      case "register": {
        const parsed = orgRegisterSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const { emailProof, phoneProof, org, reg, kind, first, last, email, dial, phone, password } = parsed.data;
        const account = { org, reg, kind: kind as OrgKind, first, last, email, dial, phone, password };
        const emailOk = unseal<{ t: string }>(key, "proof", emailProof)?.t === `e:${account.email}`;
        if (!emailOk) return failure("unverified", { field: "email" });
        const phoneOk = unseal<{ t: string }>(key, "proof", phoneProof)?.t === `p:${account.dial}${account.phone}`;
        if (!phoneOk) return failure("unverified", { field: "phone" });
        const user = await backend.register(account);
        const res = reply({ ok: true, user });
        writeOrgSession(res, key, { user });
        return finish(res);
      }

      case "sign-in": {
        const parsed = signInSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const wait = await spend(ORG_LIMITS.signIn(parsed.data.email, client));
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
        const ticket = unseal<OrgTicket>(key, "challenge", parsed.data.challenge);
        if (!ticket) return failure("code_expired");
        const wait = await spend(ORG_LIMITS.verifyCode(`signin:${ticket.email}`));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        const user = await backend.signInVerify(ticket, parsed.data.code);
        const res = reply({ ok: true, user });
        writeOrgSession(res, key, { user });
        return res;
      }

      case "forgot-password": {
        const parsed = forgotSchema.safeParse(body);
        if (!parsed.success) return failure("invalid_input", { field: firstField(parsed.error) });
        const wait = await spend(ORG_LIMITS.forgot(parsed.data.email, client));
        if (wait) return failure("rate_limited", { retryAfter: wait });
        await backend.forgotPassword(parsed.data.email);
        return reply({ ok: true, sentTo: maskEmail(parsed.data.email) });
      }

      case "sign-out": {
        const res = reply({ ok: true });
        clearOrgSession(res);
        return res;
      }

      default:
        return failure("invalid_input");
    }
  } catch (e) {
    if (e instanceof AccountError) return failure(e.code, { field: e.field });
    logEvent("ERROR", "mom.org.unexpected", { action, detail: e instanceof Error ? e.message : String(e) });
    return failure("upstream");
  }
}

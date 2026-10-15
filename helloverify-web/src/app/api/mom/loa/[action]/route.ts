/** A candidate signs the Letter of Authorisation their employer's batch asked
 *  for: open the link, confirm an emailed code, sign. No account; the link's
 *  sealed ticket names the case. Demo unless `MOM_APPLY_LIVE` is set. */
import type { NextRequest, NextResponse } from "next/server";

import { logEvent } from "@/lib/leads/log";
import { AccountError } from "@/lib/mom/account/backend";
import { clientKey, spend } from "@/lib/mom/account/limits";
import { maskEmail, maskPassport } from "@/lib/mom/account/policy";
import { seal, unseal } from "@/lib/mom/account/seal";
import { signatureMatches } from "@/lib/mom/apply/policy";
import { failure, reply, sameOrigin } from "@/lib/mom/http";
import { orgKey } from "@/lib/mom/org/env";
import type { LoaView } from "@/lib/mom/org/loa";
import { LOA_CODE_SECONDS, LOA_PROOF_TTL, loaBackend, openLoaToken, readLoaJar, writeLoaJar } from "@/lib/mom/org/loaServer";

export const dynamic = "force-dynamic";

const MINUTE = 60_000;
const BODY_MAX = 32_000;
const ACTIONS = ["open", "send", "verify", "sign"] as const;
type Action = (typeof ACTIONS)[number];

const isAction = (a: string): a is Action => (ACTIONS as readonly string[]).includes(a);

export async function POST(req: NextRequest, ctx: RouteContext<"/api/mom/loa/[action]">) {
  const { action } = await ctx.params;
  if (!isAction(action)) return failure("invalid_input");
  const key = orgKey();
  if (!key) return failure("not_connected");
  if (!sameOrigin(req)) return reply({ ok: false, code: "invalid_input" }, 403);
  if (Number(req.headers.get("content-length") ?? 0) > BODY_MAX) return failure("too_large");

  const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
  const ticket = openLoaToken(key, body.token);
  if (!ticket) return failure("invalid_input", { field: "token" });
  const id = ticket.c.id;
  const client = clientKey(req.headers);
  const jar = readLoaJar(req, key);
  const backend = loaBackend(jar);
  const finish = (res: NextResponse) => {
    writeLoaJar(res, key, jar);
    return res;
  };

  try {
    if (action === "open") {
      const wait = await spend([[`loa:open:${client}`, 120, 10 * MINUTE]]);
      if (wait) return failure("rate_limited", { retryAfter: wait });
      const signed = (await backend.status([id]))[id] ?? null;
      const c = ticket.c;
      const view: LoaView = {
        id: c.id,
        name: c.name,
        passportNo: maskPassport(c.passportNo),
        dob: "",
        nationality: c.nationality,
        passType: c.passType,
        quals: c.quals,
        express: c.express,
        org: ticket.org,
        batch: ticket.b,
        paidAt: ticket.paidAt,
        sentTo: maskEmail(c.email),
        signed,
      };
      return reply({ ok: true, demo: backend.demo, view });
    }

    if (action === "send") {
      const wait = await spend([
        [`loa:send:${id}`, 1, 30_000],
        [`loa:send:${id}:w`, 5, 10 * MINUTE],
        [`loa:send:${client}`, 20, 10 * MINUTE],
      ]);
      if (wait) return failure("rate_limited", { retryAfter: wait });
      await backend.sendCode(ticket);
      return reply({ ok: true, sentTo: maskEmail(ticket.c.email), expiresIn: LOA_CODE_SECONDS });
    }

    if (action === "verify") {
      const code = typeof body.code === "string" ? body.code : "";
      if (!/^\d{6}$/.test(code)) return failure("invalid_code", { field: "code" });
      const wait = await spend([[`loa:verify:${id}`, 8, 10 * MINUTE]]);
      if (wait) return failure("rate_limited", { retryAfter: wait });
      await backend.verifyCode(ticket, code);
      return reply({
        ok: true,
        proof: seal(key, "loa-proof", { k: id }, LOA_PROOF_TTL),
        passportNo: ticket.c.passportNo,
        dob: ticket.c.dob,
      });
    }

    const proof = unseal<{ k: string }>(key, "loa-proof", typeof body.proof === "string" ? body.proof : null);
    if (proof?.k !== id) return failure("unverified");
    const name = typeof body.name === "string" ? body.name.slice(0, 200) : "";
    if (!signatureMatches(name, ticket.c.name)) return failure("invalid_input", { field: "name" });
    if (body.agreed !== true) return failure("invalid_input", { field: "agreed" });
    const wait = await spend([[`loa:sign:${id}`, 8, 10 * MINUTE]]);
    if (wait) return failure("rate_limited", { retryAfter: wait });
    const signed = await backend.sign(ticket, name.replace(/\s+/g, " ").trim(), { ip: client, agent: (req.headers.get("user-agent") ?? "").slice(0, 300) });
    logEvent("INFO", "mom.loa.signed", { batch: ticket.b, case: id });
    return finish(reply({ ok: true, signed }));
  } catch (e) {
    if (e instanceof AccountError) return failure(e.code, e.field ? { field: e.field } : {});
    logEvent("ERROR", "mom.loa.unexpected", { action, detail: e instanceof Error ? e.message : String(e) });
    return failure("upstream");
  }
}

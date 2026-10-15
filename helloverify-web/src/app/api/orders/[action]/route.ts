/** Order list + candidate invite proxy. Mock when `TRAVEL_AUTH_BASE` is unset. */
import { isMockTravelAuth } from "@/lib/auth/env";
import { proxyFail, UpstreamFailure } from "@/lib/auth/failure";
import { mockOrderList, mockSmbInvite, mockTravelInvite } from "@/lib/orders/mock";
import { upstreamOrderList, upstreamSmbInvite, upstreamTravelInvite } from "@/lib/orders/upstream";
import type { SendInvitePayload, SmbSendInvitePayload } from "@/lib/orders/types";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function fail(message: string, status = 400) {
  return json({ status: false, message }, status);
}

function bearer(req: Request): string | null {
  const raw = req.headers.get("authorization");
  if (!raw?.startsWith("Bearer ")) return null;
  const token = raw.slice(7).trim();
  return token || null;
}

function liveBearer(req: Request): string | null {
  const token = bearer(req);
  if (!isMockTravelAuth() && !token) throw new UpstreamFailure(401);
  return token;
}

export async function GET(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (action !== "list") return fail("Unknown orders action", 404);
  try {
    const data = isMockTravelAuth() ? mockOrderList() : await upstreamOrderList(liveBearer(req));
    return json(data);
  } catch (e) {
    return proxyFail(e, "Orders request failed");
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (action === "list") {
    try {
      const data = isMockTravelAuth() ? mockOrderList() : await upstreamOrderList(liveBearer(req));
      return json(data);
    } catch (e) {
      return proxyFail(e, "Orders request failed");
    }
  }
  if (action !== "invite-smb" && action !== "invite-travel") return fail("Unknown orders action", 404);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid JSON");
  }

  try {
    if (action === "invite-smb") {
      if (isMockTravelAuth()) return json(mockSmbInvite());
      return json(await upstreamSmbInvite(body as unknown as SmbSendInvitePayload, liveBearer(req)));
    }
    if (isMockTravelAuth()) return json(mockTravelInvite());
    return json(await upstreamTravelInvite(body as unknown as SendInvitePayload, liveBearer(req)));
  } catch (e) {
    return proxyFail(e, "Invite request failed");
  }
}

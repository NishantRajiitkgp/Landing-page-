/** Cart + payment proxy. Mock when `TRAVEL_AUTH_BASE` is unset. */
import { isMockTravelAuth } from "@/lib/auth/env";
import { proxyFail, UpstreamFailure } from "@/lib/auth/failure";
import {
  mockAddToCart,
  mockGetCartDetails,
  mockPaymentCallback,
  mockPaymentInit,
  mockRemoveCartItem,
} from "@/lib/cart/mock";
import {
  upstreamAddToCart,
  upstreamCartList,
  upstreamPaymentCallback,
  upstreamPaymentInit,
  upstreamRemoveCartItem,
} from "@/lib/cart/upstream";
import type { RazorpaySuccessPayload } from "@/lib/cart/types";

export const dynamic = "force-dynamic";

const GET_ACTIONS = new Set(["list"]);
const POST_ACTIONS = new Set(["add", "list", "remove", "pay-init", "pay-callback"]);

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
  if (!GET_ACTIONS.has(action)) return fail("Unknown cart action", 404);
  try {
    const data = isMockTravelAuth() ? mockGetCartDetails() : await upstreamCartList(liveBearer(req));
    return json(data);
  } catch (e) {
    return proxyFail(e, "Cart request failed");
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  if (!POST_ACTIONS.has(action)) return fail("Unknown cart action", 404);
  if (action === "list") {
    try {
      const data = isMockTravelAuth() ? mockGetCartDetails() : await upstreamCartList(liveBearer(req));
      return json(data);
    } catch (e) {
      return proxyFail(e, "Cart request failed");
    }
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid JSON");
  }

  try {
    if (action === "add") {
      const data = isMockTravelAuth() ? mockAddToCart(body) : await upstreamAddToCart(body, liveBearer(req));
      return json(data);
    }
    if (action === "remove") {
      const data = isMockTravelAuth() ? mockRemoveCartItem() : await upstreamRemoveCartItem(body, liveBearer(req));
      return json(data);
    }
    if (action === "pay-init") {
      if (isMockTravelAuth()) return json(mockPaymentInit());
      const ids = Array.isArray(body.user_card_ids)
        ? body.user_card_ids.filter((id): id is string => typeof id === "string" && id.length > 0)
        : [];
      if (!ids.length) return fail("user_card_ids required");
      return json(
        await upstreamPaymentInit(
          {
            user_card_ids: ids,
            is_cart_payment: body.is_cart_payment === true,
            currency: typeof body.currency === "string" ? body.currency : "INR",
          },
          liveBearer(req),
        ),
      );
    }
    if (isMockTravelAuth()) return json(mockPaymentCallback());
    return json(await upstreamPaymentCallback(body as unknown as RazorpaySuccessPayload, liveBearer(req)));
  } catch (e) {
    return proxyFail(e, "Cart request failed");
  }
}

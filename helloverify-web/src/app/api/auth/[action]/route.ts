/** OTP proxy. Mock when `TRAVEL_AUTH_BASE` is unset (see `.env.example`). */
import { isMockTravelAuth } from "@/lib/auth/env";
import { proxyFail } from "@/lib/auth/failure";
import { otpLimits, spend, tooMany } from "@/lib/auth/limits";
import { mockSaveLoginUserDetail, mockSendOtp, mockVerifyOtp } from "@/lib/auth/mock";
import { upstreamLogin, upstreamSaveProfile, upstreamSendOtp } from "@/lib/auth/upstream";
import { isEmail, isGender, isMobile, isName, isOtp } from "@/lib/auth/validate";

export const dynamic = "force-dynamic";

const ACTIONS = new Set(["send-otp", "login", "save-profile"]);

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

export async function POST(
  req: Request,
  ctx: { params: Promise<{ action: string }> },
) {
  const { action } = await ctx.params;
  if (!ACTIONS.has(action)) return fail("Unknown auth action", 404);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid JSON");
  }

  const limits = otpLimits("auth", req.headers);

  try {
    if (action === "send-otp") {
      const mobile = String(body.mobile ?? "").trim();
      if (!isMobile(mobile)) return fail("Mobile number must be 10 digits");
      const wait = await spend(limits.send(mobile));
      if (wait) return tooMany(wait);
      const data = isMockTravelAuth() ? await mockSendOtp(mobile) : await upstreamSendOtp(mobile);
      // Only the handshake id leaves this host; the old API also echoed the code.
      return json({
        status: data.status,
        message: data.message,
        mock: data.mock,
        data: data.data?.user ? { user: data.data.user } : undefined,
      });
    }

    if (action === "login") {
      const user = String(body.user ?? "").trim();
      const otp = String(body.otp ?? "").trim();
      if (!user) return fail("Missing user token");
      if (!isOtp(otp)) return fail("OTP must be 6 digits");
      const wait = await spend(limits.verify(user));
      if (wait) return tooMany(wait);
      const data = isMockTravelAuth() ? await mockVerifyOtp(user, otp) : await upstreamLogin(user, otp);
      return json(data);
    }

    const name = String(body.name ?? "");
    const email = String(body.email ?? "").trim();
    const mobile_num = String(body.mobile_num ?? "").trim();
    const gender = String(body.gender ?? "").trim();
    if (!isName(name)) return fail("Name must be at least 3 characters and contain only letters and spaces");
    if (!isEmail(email) || !isGender(gender) || !isMobile(mobile_num)) {
      return fail("Please complete all required fields");
    }
    const payload = { name: name.trim(), email, mobile_num, gender };
    const token = bearer(req);
    if (!isMockTravelAuth() && !token) return fail("Please sign in again", 401);
    const data = isMockTravelAuth()
      ? await mockSaveLoginUserDetail(payload)
      : await upstreamSaveProfile(payload, token);
    return json(data);
  } catch (e) {
    return proxyFail(e, "Auth request failed");
  }
}

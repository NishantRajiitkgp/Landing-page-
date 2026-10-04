/** MOM / MOHESR applicant proxy. Mock unless `AUTHORITY_API_LIVE` is set. */
import { authorityEncryptKey, useMockAuthorityAuth } from "@/lib/authority/env";
import { applicantHandoffUrl } from "@/lib/authority/encrypt";
import {
  mockDialCodes,
  mockForgotPassword,
  mockHandoffUrl,
  mockInvite,
  mockLatestToken,
  mockPackages,
  mockSendEmailOtp,
  mockSendMobileOtp,
  mockVerifyOtp,
} from "@/lib/authority/mock";
import { getAuthorityPortal, isAuthorityId } from "@/lib/authority/portals";
import { authorityGet, authorityPost } from "@/lib/authority/upstream";
import { isValidEmail, isValidOtp, isValidPhone, normalizeEmail, normalizeOtp, normalizePhoneDigits } from "@/lib/authority/validate";

export const dynamic = "force-dynamic";

const ACTIONS = new Set([
  "send-email-otp",
  "send-mobile-otp",
  "verify-otp",
  "latest-token",
  "invite",
  "dial-codes",
  "packages",
  "forgot-password",
  "login-handoff",
]);

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function fail(message: string, status = 400) {
  return json({ status: false, is_success: false, message }, status);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ authority: string; action: string }> },
) {
  const { authority, action } = await ctx.params;
  if (!isAuthorityId(authority)) return fail("Unknown authority", 404);
  if (!ACTIONS.has(action)) return fail("Unknown authority action", 404);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const mock = useMockAuthorityAuth();

  try {
    if (action === "send-email-otp") {
      const email = normalizeEmail(String(body.email ?? ""));
      const candidate_name = String(body.candidate_name ?? "").trim();
      if (!isValidEmail(email) || !candidate_name) return fail("Valid email and name are required");
      const data = mock
        ? mockSendEmailOtp(email)
        : await authorityPost(authority, "agency_portal/send-email-otp/", { email, candidate_name });
      return json(data);
    }

    if (action === "send-mobile-otp") {
      const mobile = normalizePhoneDigits(String(body.mobile ?? ""));
      const dialing_code = String(body.dialing_code ?? "").trim();
      const candidate_name = String(body.candidate_name ?? "").trim();
      if (!isValidPhone(mobile) || !dialing_code || !candidate_name) {
        return fail("Valid phone, dial code and name are required");
      }
      const data = mock
        ? mockSendMobileOtp()
        : await authorityPost(authority, "agency_portal/send-mobile-otp/", {
            dialing_code,
            mobile,
            candidate_name,
          });
      return json(data);
    }

    if (action === "verify-otp") {
      const otp = normalizeOtp(String(body.otp ?? ""));
      if (!isValidOtp(otp)) return fail("OTP must be 6 digits");
      const email = body.email ? normalizeEmail(String(body.email)) : undefined;
      const mobile = body.mobile ? normalizePhoneDigits(String(body.mobile)) : undefined;
      const data = mock
        ? mockVerifyOtp(otp)
        : await authorityPost(authority, "agency_portal/verify-pre-registered-otp/", {
            ...(email ? { email } : {}),
            ...(mobile ? { mobile } : {}),
            otp,
          });
      return json(data);
    }

    if (action === "latest-token") {
      const email = normalizeEmail(String(body.email ?? ""));
      if (!isValidEmail(email)) return fail("Valid email is required");
      const data = mock
        ? mockLatestToken()
        : await authorityPost(authority, "agency_portal/get-latest-token/", { email });
      return json(data);
    }

    if (action === "invite") {
      const email = normalizeEmail(String(body["4"] ?? body.email ?? ""));
      const data = mock
        ? mockInvite(email)
        : await authorityPost(authority, "health_care/api/candidate_invite_case_registration/", body);
      return json(data);
    }

    if (action === "dial-codes") {
      const data = mock ? mockDialCodes() : await authorityGet(authority, "health_care/api/get_dialcode/");
      return json(data);
    }

    if (action === "packages") {
      const data = mock
        ? mockPackages()
        : await authorityPost(authority, "health_care/api/package_details_registration/", {});
      return json(data);
    }

    if (action === "forgot-password") {
      const username = normalizeEmail(String(body.username ?? ""));
      if (!isValidEmail(username)) return fail("Valid email is required");
      const data = mock
        ? mockForgotPassword()
        : await authorityPost(authority, "users/auth/forgot_password/", {
            username,
            is_candidate: true,
          });
      return json(data);
    }

    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
    const otp = normalizeOtp(String(body.otp ?? ""));
    if (!isValidEmail(email) || !password.trim() || !isValidOtp(otp)) {
      return fail("Email, password and a 6-digit OTP are required");
    }
    if (mock) return json(mockHandoffUrl(authority));
    const key = authorityEncryptKey();
    if (!key) return fail("Portal handoff is not configured", 503);
    return json({
      status: true,
      is_success: true,
      url: applicantHandoffUrl(getAuthorityPortal(authority).candidateOrigin, email, password, otp, key),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Authority request failed";
    return fail(message, 502);
  }
}

/** MOM / MOHESR applicant proxy. Mock unless `AUTHORITY_API_LIVE` is set. */
import { otpLimits, spend, tooMany } from "@/lib/auth/limits";
import { authorityEncryptKey, isMockAuthorityAuth } from "@/lib/authority/env";
import { applicantHandoffUrl } from "@/lib/authority/encrypt";
import { buildInvitePayload } from "@/lib/authority/invite";
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
import {
  isValidEmail,
  isValidOtp,
  isValidPhone,
  isValidPhoneSpan,
  normalizeEmail,
  normalizeOtp,
  normalizePhoneDigits,
} from "@/lib/authority/validate";

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

/** The fields the applicant pages read. Upstream bodies can also carry tokens
 *  and case data, which stay on this host. */
function outcome(raw: unknown) {
  const data = (raw ?? {}) as Record<string, unknown>;
  const flagged = (data.data as { duplicate_found?: unknown } | undefined)?.duplicate_found === true;
  const duplicate = flagged || /duplicate/i.test(typeof data.message === "string" ? data.message : "");
  return json({
    status: data.status,
    is_success: data.is_success,
    ...(duplicate ? { data: { duplicate_found: true } } : {}),
    mock: data.mock,
  });
}

const PACKAGE_FIELD = /^[\w-]{1,32}$/;

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

  const mock = isMockAuthorityAuth();
  const limits = otpLimits(`authority:${authority}`, req.headers);
  const phoneMax = authority === "mom" ? 15 : 10;
  const phoneValid = (digits: string) => (authority === "mom" ? isValidPhoneSpan(digits, 7, 15) : isValidPhone(digits));

  try {
    if (action === "send-email-otp") {
      const email = normalizeEmail(String(body.email ?? ""));
      const candidate_name = String(body.candidate_name ?? "").trim();
      if (!isValidEmail(email) || !candidate_name) return fail("Valid email and name are required");
      const wait = await spend(limits.send(`email:${email}`));
      if (wait) return tooMany(wait, { is_success: false });
      const data = mock
        ? mockSendEmailOtp(email)
        : await authorityPost(authority, "agency_portal/send-email-otp/", { email, candidate_name });
      return outcome(data);
    }

    if (action === "send-mobile-otp") {
      const mobile = normalizePhoneDigits(String(body.mobile ?? ""), phoneMax);
      const dialing_code = String(body.dialing_code ?? "").trim();
      const candidate_name = String(body.candidate_name ?? "").trim();
      if (!phoneValid(mobile) || !dialing_code || !candidate_name) {
        return fail("Valid phone, dial code and name are required");
      }
      const wait = await spend(limits.send(`tel:${dialing_code}${mobile}`));
      if (wait) return tooMany(wait, { is_success: false });
      const data = mock
        ? mockSendMobileOtp()
        : await authorityPost(authority, "agency_portal/send-mobile-otp/", {
            dialing_code,
            mobile,
            candidate_name,
          });
      return outcome(data);
    }

    if (action === "verify-otp") {
      const otp = normalizeOtp(String(body.otp ?? ""));
      if (!isValidOtp(otp)) return fail("OTP must be 6 digits");
      const email = body.email ? normalizeEmail(String(body.email)) : undefined;
      const mobile = body.mobile ? normalizePhoneDigits(String(body.mobile), phoneMax) : undefined;
      if (!email && !mobile) return fail("Email or phone is required");
      const wait = await spend(limits.verify(email ? `email:${email}` : `tel:${mobile}`));
      if (wait) return tooMany(wait, { is_success: false });
      const data = mock
        ? mockVerifyOtp(otp)
        : await authorityPost(authority, "agency_portal/verify-pre-registered-otp/", {
            ...(email ? { email } : {}),
            ...(mobile ? { mobile } : {}),
            otp,
          });
      return outcome(data);
    }

    if (action === "latest-token") {
      const email = normalizeEmail(String(body.email ?? ""));
      if (!isValidEmail(email)) return fail("Valid email is required");
      const wait = await spend(limits.send(`login:${email}`));
      if (wait) return tooMany(wait, { is_success: false });
      const data = mock
        ? mockLatestToken()
        : await authorityPost(authority, "agency_portal/get-latest-token/", { email });
      return outcome(data);
    }

    if (action === "invite") {
      // Rebuilt from the form fields so the caller cannot set `client`, `geos`
      // or `force_duplicate_reg`.
      const email = normalizeEmail(String(body["4"] ?? ""));
      const number = normalizePhoneDigits(String(body["5"] ?? ""), phoneMax);
      const fields = {
        name: String(body["1"] ?? "").trim(),
        last: String(body["3"] ?? "").trim(),
        email,
        number,
        dialCode: String(body.dialing_code ?? "").trim(),
        client_package_id: String(body.client_package_id ?? "").trim(),
        program: String(body.program ?? "").trim(),
        sbu: String(body.sbu ?? "").trim(),
        section: String(body.section ?? "").trim(),
      };
      const packageOk =
        PACKAGE_FIELD.test(fields.client_package_id) &&
        (authority !== "mohesr" || [fields.program, fields.sbu, fields.section].every((v) => PACKAGE_FIELD.test(v)));
      if (!fields.name || !isValidEmail(email) || !phoneValid(number) || !fields.dialCode || !packageOk) {
        return fail("Please complete all required fields");
      }
      const wait = await spend(limits.verify(`invite:${email}`));
      if (wait) return tooMany(wait, { is_success: false });
      const data = mock
        ? mockInvite(email)
        : await authorityPost(
            authority,
            "health_care/api/candidate_invite_case_registration/",
            buildInvitePayload(authority, fields),
          );
      return outcome(data);
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
      const wait = await spend(limits.send(`forgot:${username}`));
      if (wait) return tooMany(wait, { is_success: false });
      const data = mock
        ? mockForgotPassword()
        : await authorityPost(authority, "users/auth/forgot_password/", {
            username,
            is_candidate: true,
          });
      return outcome(data);
    }

    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
    const otp = normalizeOtp(String(body.otp ?? ""));
    if (!isValidEmail(email) || !password.trim() || !isValidOtp(otp)) {
      return fail("Email, password and a 6-digit OTP are required");
    }
    const wait = await spend(limits.verify(`login:${email}`));
    if (wait) return tooMany(wait, { is_success: false });
    if (mock) return json(mockHandoffUrl(authority));
    const key = authorityEncryptKey();
    if (!key) return fail("Portal handoff is not configured", 503);
    return json({
      status: true,
      is_success: true,
      url: applicantHandoffUrl(getAuthorityPortal(authority).candidateOrigin, email, password, otp, key),
    });
  } catch {
    return fail("Authority request failed", 502);
  }
}

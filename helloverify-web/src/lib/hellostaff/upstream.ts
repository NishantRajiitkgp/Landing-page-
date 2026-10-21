/** The Hello Staff onboarding API, called from the server. Endpoints, bodies
 *  and every `client_name` spelling are the Hello Staff app's `api/auth.ts`,
 *  unchanged — the backend is not ours to alter. What moved is where the
 *  calls run: here, so the payment credential and the case id stay off the
 *  browser. */
import "server-only";

import { hsPaymentAuth } from "./env";
import type { HsDigiDoc, HsPlace, HsQuestion } from "./types";

const API_BASE = "https://api.helloverify.com/hello_staff/onboarding";
const DIGILOCKER_BASE = "https://api.helloverify.com/digilocker/api_digilocker";
const OCR_BASE = "https://api.helloverify.com/dominos/onboarding";
const DIGILOCKER_CLIENT_ID = "7813A358";
const DIGILOCKER_REDIRECT = "https://api.helloverify.com/digilocker/api_digilocker/digilocker_callback/";
const DIGILOCKER_AUTHORIZE = "https://api.digitallocker.gov.in/public/oauth2/1/authorize";
const TIMEOUT = 25_000;

export class HsUpstreamError extends Error {
  constructor(
    readonly code: "upstream" | "not_connected",
    detail: string,
  ) {
    super(detail);
  }
}

type Json = Record<string, unknown>;

async function call(url: string, init: RequestInit): Promise<Json> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT) });
  } catch (e) {
    throw new HsUpstreamError("upstream", `${url}: ${e instanceof Error ? e.message : String(e)}`);
  }
  const body = (await res.json().catch(() => null)) as Json | null;
  if (!body || typeof body !== "object") throw new HsUpstreamError("upstream", `${url}: ${res.status} not JSON`);
  return body;
}

const postJson = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  call(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

const postForm = (url: string, form: FormData) => call(url, { method: "POST", body: form });

function paymentHeaders(): Record<string, string> {
  const auth = hsPaymentAuth();
  if (!auth) throw new HsUpstreamError("not_connected", "HELLOSTAFF_PAYMENT_BASIC_AUTH unset");
  return { Authorization: `Basic ${auth}` };
}

const obj = (v: unknown): Json => (v && typeof v === "object" ? (v as Json) : {});
const str = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

export type LoginInput = {
  otp: string;
  mobile: string;
  device: Record<string, string>;
} & (
  | { mode: "login" }
  | {
      mode: "register";
      name: string;
      email: string;
      address: string;
      countryId: number;
      stateId: number;
      cityId: number;
      packageId: number;
    }
);

export type LoginOutcome =
  | { ok: true; caseId: string; userId: string; name: string; mobile: string }
  | { ok: false; message: string };

export type CheckData = {
  checkId: number | null;
  filled: boolean;
  questions: HsQuestion[];
  answers: Record<string, string>;
};

export type Lifecycle = { checkRefId: number; lifecycleId: string };

export type DigiList =
  | { state: "docs"; accessToken: string; docs: HsDigiDoc[] }
  | { state: "fetched"; message: string }
  | { state: "none"; message: string }
  | { state: "waiting" };

export const liveHelloStaff = {
  async sendOtp(mobile: string): Promise<{ sent: boolean; message: string }> {
    const res = await postJson(`${API_BASE}/send_mobile_otp/`, { mobile, client_name: "hello_staff" });
    return { sent: Boolean(res.success) || res.status === 200, message: str(res.message) };
  },

  /** `login_with_otp` signs an existing user in; `login` registers one
   *  against the chosen package. Same split as the Hello Staff login page. */
  async login(input: LoginInput): Promise<LoginOutcome> {
    const res =
      input.mode === "login"
        ? await postJson(`${API_BASE}/login_with_otp/`, {
            otp: input.otp,
            mobile: input.mobile,
            device_details: input.device,
            client_name: "hello_staff",
          })
        : await postJson(`${API_BASE}/login/`, {
            otp: input.otp,
            name: input.name,
            mobile: input.mobile,
            email_id: input.email,
            address: input.address,
            country_id: input.countryId,
            state_id: input.stateId,
            city_id: input.cityId,
            device_details: input.device,
            client_name: "hello_staff",
            package_id: input.packageId,
          });
    const r = obj(res.result);
    if (!r.status) return { ok: false, message: str(r.message) };
    const name =
      input.mode === "login"
        ? str(r.name) || ""
        : [str(r.frist_name), str(r.last_name)].filter(Boolean).join(" ") || input.name;
    return { ok: true, caseId: str(r.case_id), userId: str(r.user_id), name, mobile: str(r.mobile) || input.mobile };
  },

  async states(countryId: number): Promise<HsPlace[]> {
    const res = await postJson(`${API_BASE}/state_list/`, { country_id: countryId });
    return (Array.isArray(res.result) ? res.result : []).map((s) => ({ id: Number(obj(s).auto_id), name: str(obj(s).state_name) }));
  },

  async cities(stateId: number): Promise<HsPlace[]> {
    const res = await postJson(`${API_BASE}/city_list/`, { state_id: stateId });
    return (Array.isArray(res.result) ? res.result : []).map((c) => ({ id: Number(obj(c).auto_id), name: str(obj(c).city_name) }));
  },

  async lifecycles(caseId: string, packageId: number): Promise<Lifecycle[]> {
    const res = await postJson(`${API_BASE}/get_package_headers/`, {
      case_id: Number(caseId),
      client_name: "hellostaff",
      package_id: packageId,
    });
    return (Array.isArray(res.result) ? res.result : []).map((h) => ({
      checkRefId: Number(obj(obj(h).check).check_ref_id),
      lifecycleId: str(obj(h).lifecycle_auto_id),
    }));
  },

  async checkQuestions(caseId: string, checkMasterId: number): Promise<CheckData> {
    const res = await postJson(`${API_BASE}/check_questions/`, {
      case_id: caseId,
      client_name: "hellostaff",
      check_master_id: checkMasterId,
    });
    const r = obj(res.result);
    const questions: HsQuestion[] = [];
    const answers: Record<string, string> = {};
    for (const item of Array.isArray(r.init_data) ? r.init_data : []) {
      const q = obj(obj(item).question);
      const a = obj(obj(item).answer);
      if (!q.auto_id) continue;
      questions.push({
        id: Number(q.auto_id),
        name: str(q.question_name),
        control: str(q.question_control_type),
        mandatory: Boolean(q.is_mandatory),
        byApplicant: Boolean(q.is_filled_by_applicant),
      });
      const value = str(a.ops_answer) || str(a.init_answer);
      if (value) answers[String(q.auto_id)] = value;
    }
    return { checkId: r.check_id ? Number(r.check_id) : null, filled: Boolean(r.is_filled), questions, answers };
  },

  /** OCR on the uploaded Aadhaar (front + back) or licence. */
  async extract(caseId: string, checkMasterId: number, files: File[]): Promise<Record<string, string>> {
    const form = new FormData();
    form.append("file", files[0]);
    if (files[1]) form.append("file1", files[1]);
    form.append("case_id", caseId);
    form.append("check_master_id", String(checkMasterId));
    form.append("client_name", "Hello_Staff");
    const res = await postForm(`${OCR_BASE}/extract_data/`, form);
    const r = obj(res.result);
    return Object.fromEntries(Object.entries(r).map(([k, v]) => [k, str(v)]));
  },

  async saveCheck(checkId: number, docType: "upload" | "digilocker", answers: Record<string, string>): Promise<{ saved: boolean; message: string }> {
    const form = new FormData();
    form.append("check_id", String(checkId));
    form.append("doc_type", docType);
    form.append("client_name", "hellostaff");
    for (const [k, v] of Object.entries(answers)) if (v) form.append(k, v);
    const res = await postForm(`${API_BASE}/save_check/`, form);
    return { saved: res.status === 200 || res.result === "success", message: str(res.message) };
  },

  async paymentRequest(caseId: string): Promise<{ key: string; orderId: string; amount: number }> {
    const res = await postJson(`${API_BASE}/payment-request-case/`, { case_id: caseId }, paymentHeaders());
    const order = obj(res.order);
    const orderId = str(order.provider_order_id) || str(res.order_id);
    if (!orderId) throw new HsUpstreamError("upstream", "payment-request-case: no order id");
    return { key: str(res.razorpay_key), orderId, amount: Number(res.total_amount || order.total_amount) };
  },

  async paymentVerify(p: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }): Promise<boolean> {
    const res = await postJson(`${API_BASE}/case-payment-callback/`, p, paymentHeaders());
    return res.status === "success";
  },

  async digilockerSession(lifecycleId: string): Promise<{ sessionId: string; docType: string } | null> {
    const res = await postJson(`${OCR_BASE}/create_session/`, { check_id: lifecycleId, client_name: "HelloStaff" });
    const r = obj(res.result);
    return r.session_id ? { sessionId: str(r.session_id), docType: str(r.req_doctype) } : null;
  },

  async saveAadhaar(aadhaar: string, caseId: string): Promise<void> {
    await postJson(`${OCR_BASE}/save_aadhar_number/`, { aadhar: aadhaar, case_id: caseId, client_name: "hello_staff" });
  },

  async digilockerSource(lifecycleId: string): Promise<boolean> {
    const res = await postJson(`${DIGILOCKER_BASE}/digilocker_set_source/`, { check_id: Number(lifecycleId), source: "Hello_Staff" });
    return Boolean(res.result);
  },

  digilockerUrl(sessionId: string, docType: string): string {
    const q = new URLSearchParams({
      response_type: "code",
      client_id: DIGILOCKER_CLIENT_ID,
      redirect_uri: DIGILOCKER_REDIRECT,
      state: sessionId,
      req_doctype: docType,
    });
    return `${DIGILOCKER_AUTHORIZE}?${q}`;
  },

  async listDocuments(sessionId: string): Promise<DigiList> {
    const res = await postJson(`${DIGILOCKER_BASE}/list_of_document/`, { session_id: sessionId, client_name: "hello_staff" });
    if (res.result === "false") return { state: "fetched", message: str(res.message) };
    if (Array.isArray(res.docs_list_json)) {
      const docs = res.docs_list_json.map((d) => (Array.isArray(d) ? { name: str(d[0]), uri: str(d[1]) } : { name: "", uri: "" }));
      return docs.length ? { state: "docs", accessToken: str(res.access_token), docs } : { state: "waiting" };
    }
    if (res.result && res.result !== "true") return { state: "none", message: str(res.result) };
    return { state: "waiting" };
  },

  async selectDocuments(accessToken: string, sessionId: string, docs: HsDigiDoc[]): Promise<{ saved: boolean; message: string }> {
    const res = await postJson(`${DIGILOCKER_BASE}/select_document/`, { access_token: accessToken, session_id: sessionId, doc_list: docs });
    const rj = obj(res.res_json);
    return rj.status === "fail" ? { saved: false, message: str(rj["error-desc"]) } : { saved: true, message: "" };
  },

  async digiDocCount(checkId: number): Promise<number> {
    const res = await postJson(`${API_BASE}/digi_docs_list/`, { check_id: checkId });
    return Array.isArray(res.result) ? res.result.length : 0;
  },

  /** DigiLocker's own "log in again" link, for a session it could not read. */
  digilockerRetryUrl(sessionId: string): string {
    return `${DIGILOCKER_REDIRECT}?state=${encodeURIComponent(sessionId)}`;
  },
};

export type HelloStaffBackend = typeof liveHelloStaff;

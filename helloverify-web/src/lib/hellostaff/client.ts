/** Browser calls to `/api/hellostaff/*`. */
import type { HsSlug } from "./catalog";
import type { HsCase, HsDigiDoc, HsFailure, HsOrder, HsPlace, HsRegister, HsResult } from "./types";

const BASE = "/api/hellostaff";
const offline: HsFailure = { ok: false, code: "upstream" };

async function read<T extends object>(res: Promise<Response>): Promise<HsResult<T>> {
  try {
    const json = (await (await res).json().catch(() => null)) as HsResult<T> | null;
    return json && typeof json.ok === "boolean" ? json : offline;
  } catch {
    return offline;
  }
}

const post = <T extends object>(action: string, body: unknown) =>
  read<T>(
    fetch(`${BASE}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    }),
  );

const get = <T extends object>(action: string, query: Record<string, string | number>) =>
  read<T>(
    fetch(`${BASE}/${action}?${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]))}`, {
      credentials: "same-origin",
      cache: "no-store",
    }),
  );

/** Hello Staff's `device_details`, without its user-agent parser. */
function deviceDetails(): Record<string, string> {
  const ua = navigator.userAgent;
  const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad|iOS/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac OS/i.test(ua) ? "Mac OS" : /Linux/i.test(ua) ? "Linux" : "Unknown";
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Unknown";
  return {
    userAgent: ua,
    os,
    osVersion: "Unknown",
    browser,
    browserVersion: "Unknown",
    deviceType: matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop",
    deviceBrand: "Unknown",
    deviceModel: "Unknown",
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export const hsApi = {
  states: () => get<{ items: HsPlace[] }>("states", { country: 1 }),
  cities: (state: number) => get<{ items: HsPlace[] }>("cities", { state }),
  sendOtp: (mobile: string) => post<object>("send-otp", { mobile }),
  login: (service: HsSlug, mobile: string, otp: string, register?: HsRegister) =>
    post<{ caseId: string; name: string }>("login", {
      service,
      mobile,
      otp,
      mode: register ? "register" : "login",
      register,
      device: deviceDetails(),
    }),
  signOut: () => post<object>("sign-out", {}),
  loadCase: (service: HsSlug) => get<{ case: HsCase }>("case", { service }),
  payOrder: (service: HsSlug, fir: boolean) => post<HsOrder>("pay-order", { service, fir }) as Promise<HsOrder | HsFailure>,
  payVerify: (service: HsSlug, p: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) =>
    post<object>("pay-verify", { service, ...p }),
  saveCheck: (service: HsSlug, docType: "upload" | "digilocker", answers: Record<string, string>) =>
    post<{ already?: boolean }>("save-check", { service, docType, answers }),
  extract: (service: HsSlug, files: File[]) => {
    const form = new FormData();
    form.append("service", service);
    for (const f of files) form.append("file", f);
    return read<{ fields: Record<string, string> }>(fetch(`${BASE}/extract`, { method: "POST", body: form, credentials: "same-origin" }));
  },
  digilockerStart: (service: HsSlug) => post<{ sessionId: string; docType: string }>("digilocker-start", { service }),
  digilockerOpen: (service: HsSlug, sessionId: string, aadhaar?: string) => post<{ url: string }>("digilocker-open", { service, sessionId, aadhaar }),
  digilockerList: (service: HsSlug, sessionId: string) =>
    post<
      { retryUrl: string } & (
        | { state: "docs"; accessToken: string; docs: HsDigiDoc[] }
        | { state: "fetched" | "none"; message: string }
        | { state: "waiting" }
      )
    >("digilocker-list", { service, sessionId }),
  digilockerSelect: (service: HsSlug, sessionId: string, accessToken: string, docs: HsDigiDoc[]) =>
    post<object>("digilocker-select", { service, sessionId, accessToken, docs }),
  digilockerSubmit: (service: HsSlug, answers: Record<string, string>) =>
    post<{ already?: boolean; found?: boolean }>("digilocker-submit", { service, answers }),
};

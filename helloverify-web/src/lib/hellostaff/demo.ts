/** The Hello Staff checkout without api.helloverify.com: OTP 123456, payment
 *  confirmed in the page, DigiLocker answers with one sample document.
 *  Development only — `helloStaffLive()` is always true in production. */
import "server-only";

import { CHECK_MASTER, HS_SERVICES } from "./catalog";
import type { CheckData, HelloStaffBackend, LoginOutcome } from "./upstream";

export const DEMO_OTP = "123456";

const AADHAAR_QUESTIONS = [
  { id: 2, name: "Name", control: "text", mandatory: true, byApplicant: true },
  { id: 4, name: "Date of Birth", control: "date", mandatory: true, byApplicant: true },
  { id: 103, name: "Aadhaar Number", control: "text", mandatory: true, byApplicant: true },
  { id: 19, name: "Gender", control: "text", mandatory: false, byApplicant: false },
  { id: 159, name: "Address", control: "text", mandatory: false, byApplicant: false },
];

const DL_QUESTIONS = [
  { id: 2, name: "Name", control: "text", mandatory: true, byApplicant: true },
  { id: 4, name: "Date of Birth", control: "date", mandatory: true, byApplicant: true },
  { id: 67, name: "Driving Licence Number", control: "text", mandatory: true, byApplicant: true },
  { id: 160, name: "Valid Till", control: "date", mandatory: false, byApplicant: false },
];

/** Per-process, which is all a `next dev` demo needs. */
const saved = new Set<string>();
const sessions = new Map<string, string>();

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const demoHelloStaff: HelloStaffBackend = {
  async sendOtp() {
    await pause(300);
    return { sent: true, message: "" };
  },

  async login(input): Promise<LoginOutcome> {
    await pause(300);
    if (input.otp !== DEMO_OTP) return { ok: false, message: "Invalid OTP" };
    return {
      ok: true,
      caseId: String(90000 + Math.floor(Math.random() * 9999)),
      userId: `demo-${input.mobile}`,
      name: input.mode === "register" ? input.name : "Demo User",
      mobile: input.mobile,
    };
  },

  async states() {
    return [
      { id: 10, name: "Delhi" },
      { id: 11, name: "Haryana" },
      { id: 12, name: "Karnataka" },
      { id: 13, name: "Maharashtra" },
    ];
  },

  async cities(stateId) {
    const byState: Record<number, string[]> = {
      10: ["New Delhi"],
      11: ["Gurugram", "Faridabad"],
      12: ["Bengaluru", "Mysuru"],
      13: ["Mumbai", "Pune"],
    };
    return (byState[stateId] ?? []).map((name, i) => ({ id: stateId * 100 + i, name }));
  },

  async lifecycles(caseId, packageId) {
    const service = HS_SERVICES.find((s) => s.packageId === packageId);
    const ref = CHECK_MASTER[service?.doc ?? "aadhaar"];
    return [{ checkRefId: ref, lifecycleId: `${caseId}${ref}` }];
  },

  async checkQuestions(caseId, checkMasterId): Promise<CheckData> {
    const checkId = Number(`${caseId}${checkMasterId}`);
    return {
      checkId,
      filled: saved.has(String(checkId)),
      questions: checkMasterId === CHECK_MASTER.dl ? DL_QUESTIONS : AADHAAR_QUESTIONS,
      answers: {},
    };
  },

  async extract(_caseId, checkMasterId): Promise<Record<string, string>> {
    await pause(700);
    if (checkMasterId === CHECK_MASTER.dl) return { "2": "Ravi Kumar", "4": "1990-04-12", "67": "DL0420110012345", "160": "2034-04-11" };
    return { "2": "Sunita Devi", "4": "1988-09-03", "103": "XXXXXXXX1234", "19": "Female", "159": "Sector 21, Gurugram" };
  },

  async saveCheck(checkId) {
    await pause(400);
    saved.add(String(checkId));
    return { saved: true, message: "" };
  },

  async paymentRequest(caseId) {
    return { key: "", orderId: `demo_order_${caseId}`, amount: 0 };
  },

  async paymentVerify() {
    return true;
  },

  async digilockerSession(lifecycleId) {
    const sessionId = `demo-${lifecycleId}`;
    sessions.set(sessionId, "waiting");
    return { sessionId, docType: lifecycleId.endsWith(String(CHECK_MASTER.dl)) ? "DRVLC" : "ADHAR" };
  },

  async saveAadhaar() {},

  async digilockerSource() {
    return true;
  },

  /** No DigiLocker to open; the sample document appears once "opened". */
  digilockerUrl(sessionId) {
    if (sessions.has(sessionId)) sessions.set(sessionId, "opened");
    return "";
  },

  async listDocuments(sessionId) {
    if (sessions.get(sessionId) !== "opened") return { state: "waiting" };
    return {
      state: "docs",
      accessToken: "demo-token",
      docs: [{ name: sessionId.endsWith(String(CHECK_MASTER.dl)) ? "Driving Licence" : "Aadhaar Card", uri: `in.gov.demo-${sessionId}` }],
    };
  },

  async selectDocuments() {
    return { saved: true, message: "" };
  },

  async digiDocCount() {
    return 1;
  },

  digilockerRetryUrl() {
    return "";
  },
};

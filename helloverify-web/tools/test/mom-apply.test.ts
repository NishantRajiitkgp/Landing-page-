/** MOM application rules: what is asked for, what is priced, what the upload
 *  route accepts. */
import { createHash } from "node:crypto";

import { cleanFileName, sniff } from "../../src/lib/mom/apply/backend.ts";
import { newCaseId } from "../../src/lib/mom/apply/ids.ts";
import { searchDemoInstitutions } from "../../src/lib/mom/apply/institutions.ts";
import {
  aboutIssues,
  addWorkingDays,
  blankQual,
  normalizePassport,
  qualIssues,
  qualSlots,
  reportDay,
  requiredSlots,
  signatureMatches,
  signIssues,
  SLOT_RE,
} from "../../src/lib/mom/apply/policy.ts";
import { maskPassport } from "../../src/lib/mom/account/policy.ts";
import { seal, sealRemaining, unseal } from "../../src/lib/mom/account/seal.ts";
import { readSubmission, rejectReceipts } from "../../src/lib/mom/apply/submit.ts";
import { money, quote, type Prices } from "../../src/lib/mom/apply/pricing.ts";
import type { About, DocRef, Draft, Qual } from "../../src/lib/mom/apply/types.ts";

import { check } from "./harness.ts";

const NOW = "2026-10-09";
const doc: DocRef = { id: "x", name: "a.pdf", size: 1, type: "application/pdf" };
const about: About = {
  fullName: "Priya Menon",
  dob: "1994-05-12",
  nationality: "IN",
  passportNo: "Z1234567",
  passportExpiry: "2031-01-01",
  passType: "EP",
};

console.log("1. About you");
check("complete about has no issues", Object.keys(aboutIssues(about, { passport: doc }, NOW)).length === 0, aboutIssues(about, { passport: doc }, NOW));
check("passport upload is required", aboutIssues(about, {}, NOW).passport === "doc");
check("expired passport is flagged", aboutIssues({ ...about, passportExpiry: "2026-10-09" }, { passport: doc }, NOW).passportExpiry === "expired");
check("under 16 is flagged", aboutIssues({ ...about, dob: "2012-01-01" }, { passport: doc }, NOW).dob === "dob");
check("passport number is cleaned to A-Z0-9", normalizePassport(" z12-345 67 ") === "Z1234567", normalizePassport(" z12-345 67 "));
check("short passport number is flagged", aboutIssues({ ...about, passportNo: "Z12" }, { passport: doc }, NOW).passportNo === "passportNo");

console.log("2. Qualifications");
const q: Qual = { ...blankQual(), level: "bachelor", course: "B.Tech", institution: "Anna University", listed: true, country: "IN", start: "2012-07", end: "2016-05" };
const full = Object.fromEntries(qualSlots(q).map((s) => [s.key, doc]));
check("complete qualification has no issues", Object.keys(qualIssues(q, full, NOW)).length === 0, qualIssues(q, full, NOW));
check("certificate and transcript are required, supporting is not", qualSlots(q).filter((s) => s.required).map((s) => s.kind).join() === "certificate,transcript");
check("non-English adds a required translation", qualSlots({ ...q, english: false }).some((s) => s.kind === "translation" && s.required));
check("end before start is flagged", qualIssues({ ...q, start: "2016-05", end: "2012-07" }, full, NOW).end === "order");
check("future completion is flagged", qualIssues({ ...q, end: "2027-01" }, full, NOW).end === "future");
check("half-picked month is flagged", qualIssues({ ...q, start: "2012-" }, full, NOW).start === "month");
check("every slot key matches the upload route's pattern", qualSlots(q).every((s) => SLOT_RE.test(s.key)) && SLOT_RE.test("passport"));
check("a forged slot is rejected", !SLOT_RE.test("q12345678:../../etc") && !SLOT_RE.test("passport2"));

console.log("3. Price");
const prices: Prices = { edu: 99, acc: 30, express: 54, gst: 0.09 };
const draft = (quals: Qual[], express = false): Pick<Draft, "quals" | "express"> => ({ quals, express });
const listed = quote(draft([q]), prices);
check("listed: 99 + 9% = 107.91", listed.total === 107.91, listed);
const unlisted = quote(draft([{ ...q, listed: false }]), prices);
check("unlisted adds accreditation: 129 + 9% = 140.61", unlisted.total === 140.61, unlisted);
check("typed (unconfirmed) institution is priced with accreditation", quote(draft([{ ...q, listed: null }]), prices).subtotal === 129);
const two = quote(draft([q, { ...q, id: "qbbbbbbbb", listed: false }], true), prices);
check("two quals, one unlisted, express: 99*2 + 30 + 54 = 282", two.subtotal === 282, two);
check("money is SGD with Latin digits in Arabic", money(107.91, "ar").includes("107.91"), money(107.91, "ar"));
check("required documents count passport + 2 per English qual", requiredSlots({ quals: [q], docs: {} } as unknown as Draft).length === 3);

console.log("4. Uploads");
check("PDF is sniffed", sniff(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])) === "application/pdf");
check("PNG is sniffed", sniff(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) === "image/png");
check("JPEG is sniffed", sniff(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])) === "image/jpeg");
check("an executable renamed .pdf is rejected", sniff(new Uint8Array([0x4d, 0x5a, 0x90, 0x00])) === null);
check("path segments are stripped from file names", cleanFileName("C:\\fake\\..\\degree.pdf") === "degree.pdf", cleanFileName("C:\\fake\\..\\degree.pdf"));
check("control characters are stripped", cleanFileName("deg\u0000ree\u202e.pdf") === "degree.pdf", cleanFileName("deg\u0000ree\u202e.pdf"));

console.log("5. Institution search");
check("prefix words match", searchDemoInstitutions("iit bom").length === 0 && searchDemoInstitutions("indian bombay")[0]?.name === "Indian Institute of Technology Bombay");
check("accents fold", searchDemoInstitutions("mapua")[0]?.name === "Mapúa University");
check("listed flag comes back", searchDemoInstitutions("anna")[0]?.listed === true && searchDemoInstitutions("osmania")[0]?.listed === false);

console.log("6. Speed and signature");
check("Friday + 7 working days is the Tuesday after next", addWorkingDays("2026-10-09", 7) === "2026-10-20", addWorkingDays("2026-10-09", 7));
check("Saturday + 1 working day is Monday", addWorkingDays("2026-10-10", 1) === "2026-10-12", addWorkingDays("2026-10-10", 1));
check("signature ignores case and spacing", signatureMatches("  priya   MENON ", "Priya Menon"));
check("a different name does not sign", !signatureMatches("Priya M", "Priya Menon"));
const sign = (name: string, agreed: boolean) => signIssues({ about, sign: { name, agreed } });
check("blank signature and no declaration are both open", sign("", false).sign === "required" && sign("", false).agree === "agree");
check("mismatched signature is flagged", sign("P Menon", true).sign === "signMatch");
check("matching signature with declaration is complete", Object.keys(sign("priya menon", true)).length === 0);

console.log("7. Payment");
const docs = {
  passport: { ...doc, id: "passport-token" },
  ...Object.fromEntries(Object.keys(full).map((slot) => [slot, { ...doc, id: `token-${slot}` }])),
};
const posted = {
  v: 1,
  about,
  quals: [q],
  docs,
  express: false,
  sign: { name: "Priya Menon", agreed: true },
  billing: { name: "Priya Menon", company: "" },
  total: 1,
};
const accepted = readSubmission(posted, NOW);
check("a complete application is accepted and the posted total is ignored", accepted.ok === true && !("total" in (accepted.ok ? accepted.draft : {})), accepted);
check("a missing declaration goes back to review", readSubmission({ ...posted, sign: { name: "Priya Menon", agreed: false } }, NOW).step === "review");
check("a junk company name goes back to pay", readSubmission({ ...posted, billing: { name: "Priya Menon", company: "!!!" } }, NOW).step === "pay");
check("express report is 7 working days out", reportDay("2026-10-09T01:00:00.000Z", true) === "2026-10-20");
check("standard report is 15 working days out", reportDay("2026-10-09T01:00:00.000Z", false) === "2026-10-30");
const id = newCaseId(new Date("2026-10-09T00:00:00Z"));
check("application ids drop 0, O, 1 and I", /^HV-26-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(id), id);
const key = createHash("sha256").update("mom-apply-test").digest();
const receipt = seal(key, "document", { a: "demo-applicant", s: "passport", r: "demo-abc" }, 60);
const open = (token: string) => unseal<{ a: string; s: string; r: string }>(key, "document", token);
check("a receipt opens only for its own purpose", open(receipt)?.r === "demo-abc" && unseal(key, "payment", receipt) === null);
const session = seal(key, "session", { a: 1 }, 100);
const left = sealRemaining(key, "session", session);
check("a session reports time left inside its original ttl", left !== null && left <= 100 && left > 90, left);
const renewed = seal(key, "session", { a: 1 }, left ?? 100);
const again = sealRemaining(key, "session", renewed);
check("rewriting a session does not extend it", again !== null && left !== null && again <= left, again);
check("passport keeps only its last three characters", maskPassport("K1234567") === "•••••567");
if (accepted.ok) {
  const draft = accepted.draft;
  check("another applicant's receipt is rejected", rejectReceipts(draft, "demo-applicant", () => ({ a: "someone-else", s: "passport", r: "x" })) === "about");
  const openSlot = (token: string) => {
    const slot = Object.entries(draft.docs).find(([, file]) => file.id === token)?.[0];
    return slot ? { a: "demo-applicant", s: slot, r: "ref" } : null;
  };
  check("receipts for this applicant and these slots are kept", rejectReceipts(draft, "demo-applicant", openSlot) === null);
}

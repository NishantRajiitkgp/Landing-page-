/** HelloV home services through Hello Staff: the catalogue against the old
 *  app and the prices the site prints, the credential staying server-side,
 *  and the `/api/hellostaff/*` route end to end in demo mode. */
import { readFileSync, readdirSync } from "node:fs";

import { NextRequest } from "next/server";

import { GET, POST } from "../../src/app/api/hellostaff/[action]/route.ts";
import { pick } from "../../src/lib/copy/index.ts";
import { INDIVIDUALS } from "../../src/lib/copy/individuals.ts";
import { SECTIONS } from "../../src/lib/copy/sections.ts";
import { FIR_ADDON, HS_SERVICES, hsPath, hsTotal } from "../../src/lib/hellostaff/catalog.ts";
import { DEMO_OTP } from "../../src/lib/hellostaff/demo.ts";

import { check } from "./harness.ts";

console.log("1. the catalogue is Hello Staff's own");
const byKey = Object.fromEntries(HS_SERVICES.map((s) => [s.key, s]));
check("drivers is package 8569 at ₹499, licence check", byKey.drivers?.packageId === 8569 && byKey.drivers.price === 499 && byKey.drivers.doc === "dl");
check("home-staff is package 8400 at ₹399, Aadhaar", byKey["home-staff"]?.packageId === 8400 && byKey["home-staff"].price === 399 && byKey["home-staff"].doc === "aadhaar");
check("nanny is package 2161 at ₹599, Aadhaar", byKey.nanny?.packageId === 2161 && byKey.nanny.price === 599 && byKey.nanny.doc === "aadhaar");
check("tenants is package 2158 at ₹999, Aadhaar", byKey.tenants?.packageId === 2158 && byKey.tenants.price === 999 && byKey.tenants.doc === "aadhaar");
check("the FIR add-on is ₹300", FIR_ADDON === 300);
check("Advanced links preselect the add-on", hsPath("nanny", "advanced") === "/products/hellov/verify/nanny?plan=advanced" && hsPath("nanny") === "/products/hellov/verify/nanny");

console.log("2. the homepage storefront prints Hello Staff's package prices");
const shop = pick(SECTIONS, "en").consumer.shop.services;
const SHOP_BASIC = "₹699";
const SHOP_ADVANCED = "₹1499";
for (const [k, card] of Object.entries(shop)) {
  const priced = card as { basicPrice?: string; price?: string };
  check(`homepage ${k}: Basic ${SHOP_BASIC}`, priced.basicPrice === SHOP_BASIC, priced.basicPrice);
  check(`homepage ${k}: Advanced ${SHOP_ADVANCED}`, priced.price === SHOP_ADVANCED, priced.price);
}
const shopKey = { driver: "driver", "home-staff": "homeStaff", nanny: "nanny", tenant: "tenant" } as const;
const cards = pick(INDIVIDUALS, "en").hellov.advanced.cards;
for (const s of HS_SERVICES) {
  const k = shopKey[s.slug];
  check(`HelloV Advanced card ${s.slug}: INR ₹${hsTotal(s, true)}`, cards[k].price === `INR ₹${hsTotal(s, true)}`, cards[k].price);
}

console.log("3. the payment credential and the upstream stay on the server");
const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const browserSide = [
  "src/lib/hellostaff/client.ts",
  "src/lib/hellostaff/catalog.ts",
  "src/lib/hellostaff/types.ts",
  ...readdirSync(new URL("../../src/components/hellostaff/", import.meta.url)).map((f) => `src/components/hellostaff/${f}`),
];
for (const f of browserSide) {
  const src = read(f);
  check(`${f} never names api.helloverify.com`, !src.includes("api.helloverify.com"));
  check(`${f} imports neither upstream nor env`, !/hellostaff\/(upstream|env|demo|session)/.test(src));
}
check("upstream.ts is server-only", read("src/lib/hellostaff/upstream.ts").includes('import "server-only"'));
check("no Basic credential literal anywhere in src/lib/hellostaff", !/Basic [A-Za-z0-9+/=]{20,}/.test(readdirSync(new URL("../../src/lib/hellostaff/", import.meta.url)).map((f) => read(`src/lib/hellostaff/${f}`)).join("\n")));

console.log("4. the route, end to end, in demo mode");
const BASE = "http://localhost:3000/api/hellostaff";
let cookie = "";

async function call(method: "GET" | "POST", action: string, body?: unknown, query = "") {
  const init: ConstructorParameters<typeof NextRequest>[1] = {
    method,
    headers: { host: "localhost:3000", origin: "http://localhost:3000", ...(cookie ? { cookie } : {}) },
  };
  if (body instanceof FormData) init.body = body;
  else if (body !== undefined) {
    init.body = JSON.stringify(body);
    (init.headers as Record<string, string>)["content-type"] = "application/json";
  }
  const req = new NextRequest(`${BASE}/${action}${query}`, init);
  const ctx = { params: Promise.resolve({ action }) } as Parameters<typeof POST>[1];
  const res = method === "GET" ? await GET(req, ctx) : await POST(req, ctx);
  const set = res.cookies.get("hv_hellostaff")?.value;
  if (set !== undefined) cookie = set ? `hv_hellostaff=${set}` : "";
  return { status: res.status, json: (await res.json()) as Record<string, unknown> };
}

const mobile = "9876543210";
const noSession = await call("GET", "case", undefined, "?service=nanny");
check("no cookie: case is no_session", noSession.status === 401 && noSession.json.code === "no_session", noSession);

const badMobile = await call("POST", "send-otp", { mobile: "12345" });
check("send-otp refuses a bad mobile", badMobile.json.code === "invalid_input", badMobile);
const sent = await call("POST", "send-otp", { mobile });
check("send-otp sends", sent.json.ok === true, sent);

const wrong = await call("POST", "login", { service: "nanny", mobile, otp: "000000", mode: "login" });
check("a wrong OTP is invalid_code and sets no cookie", wrong.json.code === "invalid_code" && !cookie, wrong);

const badPan = await call("POST", "login", {
  service: "nanny",
  mobile,
  otp: DEMO_OTP,
  mode: "register",
  register: { name: "A", pan: "BAD", email: "a@b.co", address: "x", stateId: 10, cityId: 1000 },
});
check("register refuses a malformed PAN", badPan.json.code === "invalid_input", badPan);

const login = await call("POST", "login", { service: "nanny", mobile, otp: DEMO_OTP, mode: "login" });
check("login with the demo OTP opens a case and sets the cookie", login.json.ok === true && typeof login.json.caseId === "string" && cookie.length > 0, login);

const other = await call("GET", "case", undefined, "?service=driver");
check("the cookie is for nanny only: driver is no_session", other.json.code === "no_session", other);

const loaded = await call("GET", "case", undefined, "?service=nanny");
const c = loaded.json.case as { caseId: string; check: { checkId: number; filled: boolean; questions: { id: number }[] } };
check("case comes back with the Aadhaar check and its questions", loaded.json.ok === true && c.caseId === login.json.caseId && c.check.questions.length > 0 && !c.check.filled, loaded);

const order = await call("POST", "pay-order", { service: "nanny", fir: true });
check("pay-order (demo) quotes Basic + FIR", order.json.ok === true && order.json.demo === true && order.json.amount === 899, order);

const form = new FormData();
form.append("service", "nanny");
form.append("file", new File([new Uint8Array([0xff, 0xd8, 0xff])], "front.jpg", { type: "image/jpeg" }));
const oneSide = await call("POST", "extract", form);
check("Aadhaar OCR needs both sides", oneSide.json.code === "invalid_input", oneSide);
form.append("file", new File([new Uint8Array([0xff, 0xd8, 0xff])], "back.jpg", { type: "image/jpeg" }));
const ocr = await call("POST", "extract", form);
check("OCR fills Aadhaar fields", ocr.json.ok === true && typeof (ocr.json.fields as Record<string, string>)["103"] === "string", ocr);

const saved = await call("POST", "save-check", { service: "nanny", docType: "upload", answers: { ...(ocr.json.fields as object), "999999": "ignored" } });
check("save-check saves", saved.json.ok === true && !saved.json.already, saved);
const again = await call("GET", "case", undefined, "?service=nanny");
check("…and the check now reads as filled", (again.json.case as typeof c).check.filled === true, again);

const out = await call("POST", "sign-out", {});
check("sign-out clears the cookie", out.json.ok === true && cookie === "", out);
const cross = await call("POST", "pay-order", { service: "nanny" });
check("after sign-out, pay-order is no_session", cross.json.code === "no_session", cross);

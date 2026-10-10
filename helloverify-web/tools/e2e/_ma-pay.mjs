import { chromium } from "@playwright/test";

/** node tools/e2e/_ma-pay.mjs [en|ar] [desk|phone]
 *  Pay, then the receipt: a cleared billing name, a company invoice, a sealed
 *  upload, and the same application after a reload. */
const locale = process.argv[2] ?? "en";
const tag = process.argv[3] ?? "desk";
const origin = "http://localhost:3000";
const base = `${origin}/${locale}/solutions/manpower-and-education-authorities/ministry-of-manpower`;
const shot = (page, name, full = false) => page.screenshot({ path: `tools/e2e/_map-${locale}-${tag}-${name}.png`, fullPage: full });
const pdf = (name) => ({ name, mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n% demo\n" + "x".repeat(4000)) });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: tag === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
await ctx.addCookies([{ name: "hv_consent", value: "rejected", url: origin }]).catch(() => {});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !/Content Security Policy|status of 4\d\d/.test(m.text()) && errors.push(m.text()));
const log = (...a) => console.log("·", ...a);

await page.goto(`${base}/sign-in`, { waitUntil: "networkidle", timeout: 120000 });
await page.getByRole("button", { name: /^(Reject|رفض|अस्वीकार)/ }).first().click({ timeout: 2500 }).catch(() => {});
await page.locator(".ma-demo-fill").click();
await page.locator(".ma-submit").click();
const otp = page.locator(".ma-otp-in");
if (!(await otp.waitFor({ timeout: 12000 }).then(() => true).catch(() => false))) {
  log("sign-in stopped:", (await page.locator(".ma-alert, .ma-err").allInnerTexts()).join(" | ") || "(no message)");
  await browser.close();
  process.exit(1);
}
await otp.pressSequentially("123456", { delay: 20 });
await page.waitForURL(/\/apply/, { timeout: 15000 });

const upload = async (slot, file) => {
  const res = await page.request.post(`${origin}/api/mom/apply/upload`, { multipart: { slot, file } });
  const json = await res.json();
  if (!json.ok) throw new Error(`${slot} ${res.status()} ${JSON.stringify(json)}`);
  return json.doc;
};
const q1 = "qanna0001";
const passport = await upload("passport", { name: "passport-photo-page.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]) });
const certificate = await upload(`${q1}:certificate`, pdf("degree-certificate.pdf"));
const transcript = await upload(`${q1}:transcript`, pdf("transcripts.pdf"));

const session = await page.evaluate(async () => (await fetch("/api/mom/account/session", { credentials: "same-origin" })).json());
const draft = {
  v: 1,
  about: { fullName: "Priya Menon", dob: "1994-05-12", nationality: "IN", passportNo: "Z1234567", passportExpiry: "2031-01-01", passType: "EP" },
  quals: [{ id: q1, level: "bachelor", course: "B.Tech, Computer Science", institution: "Anna University", listed: true, country: "IN", start: "2012-07", end: "2016-05", studentId: "", english: true }],
  docs: { passport, [`${q1}:certificate`]: certificate, [`${q1}:transcript`]: transcript },
  express: false,
  sign: { name: "Priya Menon", agreed: true },
  billing: { name: null, company: "" },
  reached: 5,
  savedAt: Date.now(),
};
await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: `hv-mom-draft:${session.applicant.id}`, value: JSON.stringify(draft) });
await page.goto(`${base}/apply#pay`, { waitUntil: "networkidle" });
await page.locator("#mf-billingName").waitFor();
await page.waitForTimeout(300);
log("prefilled:", await page.inputValue("#mf-billingName"), "button:", await page.locator(".mf-next").innerText());
await shot(page, "1-pay");

await page.fill("#mf-billingName", "");
await page.locator(".mf-next").click();
await page.waitForTimeout(250);
log("empty name focus:", await page.evaluate(() => document.activeElement?.id), "error:", await page.locator("#mf-billingName-err").innerText().catch(() => "none"));

await page.fill("#mf-billingName", "Priya Menon");
await page.fill("#mf-billingCompany", "HelloVerify Pte. Ltd.");
await shot(page, "2-invoice");
await page.locator(".mf-next").click();
await page.locator(".mf-id").waitFor({ timeout: 15000 });
const id = (await page.locator(".mf-id").innerText()).trim();
log("id:", id, "receipt:", (await page.locator(".mf-receipt").innerText()).replace(/\s+/g, " "));
await page.locator(".mf-done").screenshot({ path: `tools/e2e/_map-${locale}-${tag}-3-done.png` });
await shot(page, "4-full", true);

await page.reload({ waitUntil: "networkidle" });
await page.locator(".mf-id").waitFor();
log("after reload:", (await page.locator(".mf-id").innerText()).trim(), "hash:", await page.evaluate(() => location.hash));
log(
  "overflow:",
  await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll(".ma-apply *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1);
      })
      .slice(0, 6)
      .map((el) => `${el.tagName}.${[...el.classList].slice(0, 2).join(".")}`);
    return { scrollW: document.documentElement.scrollWidth, vw, wide };
  }),
);
console.log("console errors:", errors.length ? errors : "none");
if (!/^HV-\d{2}-[A-Z2-9]{6}$/.test(id)) {
  await browser.close();
  process.exit(1);
}
await browser.close();

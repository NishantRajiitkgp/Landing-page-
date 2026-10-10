import { chromium } from "@playwright/test";

/** node tools/e2e/_ma-review.mjs [en|ar] [desk|phone]
 *  Checks & speed, then Review & sign: express price, the letter, a rejected
 *  signature, edit-from-review, and overflow. */
const locale = process.argv[2] ?? "en";
const tag = process.argv[3] ?? "desk";
const base = `http://localhost:3000/${locale}/solutions/manpower-and-education-authorities/ministry-of-manpower`;
const shot = (page, name, full = false) => page.screenshot({ path: `tools/e2e/_mar-${locale}-${tag}-${name}.png`, fullPage: full });
const doc = (name, size) => ({ id: "demo", name, size, type: "application/pdf" });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: tag === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
await ctx.addCookies([{ name: "hv_consent", value: "rejected", url: "http://localhost:3000" }]).catch(() => {});
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

const session = await page.evaluate(async () => (await fetch("/api/mom/account/session", { credentials: "same-origin" })).json());
const id = session.applicant?.id;
if (!id) {
  log("no session", session);
  await browser.close();
  process.exit(1);
}

const q1 = "qanna0001";
const q2 = "qsvce0002";
const draft = {
  v: 1,
  about: { fullName: "Priya Menon", dob: "1994-05-12", nationality: "IN", passportNo: "Z1234567", passportExpiry: "2031-01-01", passType: "EP" },
  quals: [
    { id: q1, level: "bachelor", course: "B.Tech, Computer Science", institution: "Anna University", listed: true, country: "IN", start: "2012-07", end: "2016-05", studentId: "2012CS041", english: true },
    { id: q2, level: "master", course: "M.Sc Data Science", institution: "Sri Venkateswara College", listed: false, country: "IN", start: "2017-08", end: "2019-06", studentId: "", english: true },
  ],
  docs: {
    passport: doc("passport-photo-page.png", 842_113),
    [`${q1}:certificate`]: doc("anna-university-degree.pdf", 1_204_331),
    [`${q1}:transcript`]: doc("anna-transcripts-2012-2016.pdf", 2_441_002),
    [`${q2}:certificate`]: doc("svce-degree.pdf", 980_220),
    [`${q2}:transcript`]: doc("svce-transcripts.pdf", 1_550_040),
  },
  express: false,
  sign: { name: "", agreed: false },
  reached: 4,
  savedAt: Date.now(),
};
await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: `hv-mom-draft:${id}`, value: JSON.stringify(draft) });
await page.goto(`${base}/apply#checks`, { waitUntil: "networkidle" });
await page.locator(".mf-plan").waitFor();
await page.waitForTimeout(400);
log("hash:", await page.evaluate(() => location.hash));
log("etas:", (await page.locator(".mf-speed-e").allInnerTexts()).join(" || "));
log("total:", await page.locator(".mf-sum-tot b").innerText());
await shot(page, "1-checks");
await page.locator(".mf-step").screenshot({ path: `tools/e2e/_mar-${locale}-${tag}-1b-checks-card.png` });

await page.locator(".mf-speed-o").nth(1).click();
await page.waitForTimeout(250);
log("express total:", await page.locator(".mf-sum-tot b").innerText(), "on:", await page.locator(".mf-speed-o.is-on .mf-speed-n").innerText());
await page.locator(".mf-speed").screenshot({ path: `tools/e2e/_mar-${locale}-${tag}-2-speed.png` });

await page.locator(".mf-next").click();
await page.waitForFunction(() => location.hash === "#review");
await page.waitForTimeout(400);
await shot(page, "3-review");
await page.locator(".mf-loa").screenshot({ path: `tools/e2e/_mar-${locale}-${tag}-3b-letter.png` });
log(
  "date order:",
  await page.evaluate(() =>
    [...document.querySelectorAll(".mf-loa-q li:first-child bdi[dir=ltr]")].map((el) => {
      const r = el.getBoundingClientRect();
      return `${el.textContent}@${Math.round(r.x)}`;
    }),
  ),
);

await page.locator(".mf-next").click();
await page.waitForTimeout(300);
log("unsigned focus:", await page.evaluate(() => document.activeElement?.id), "alert:", await page.locator(".mf-step .ma-alert").innerText());
await page.fill("#mf-sign", "Someone Else");
await page.locator("#mf-sign").blur();
await page.waitForTimeout(200);
log("mismatch:", await page.locator("#mf-sign-err").innerText().catch(() => "none"));
await page.locator(".mf-sign").screenshot({ path: `tools/e2e/_mar-${locale}-${tag}-4-mismatch.png` });

await page.fill("#mf-sign", "priya menon");
await page.waitForTimeout(500);
log("ink:", await page.locator(".mf-loa-ink").innerText(), "signed:", await page.locator(".mf-loa-ink.is-signed").count());
await page.locator(".mf-loa-f").screenshot({ path: `tools/e2e/_mar-${locale}-${tag}-5-signed.png` });
await page.locator("#mf-agree").check();
log("agree error before tick gone:", await page.locator("#mf-agree-err").count());

const edit = page.locator(".mf-rev-edit").first();
log("edit label:", await edit.getAttribute("aria-label"));
await edit.click();
await page.waitForFunction(() => location.hash === "#about");
log("return label:", await page.locator(".mf-next").innerText());
await page.locator(".mf-next").click();
await page.waitForFunction(() => location.hash === "#review", { timeout: 8000 });
log("returned to review, signature kept:", await page.inputValue("#mf-sign"), "agreed:", await page.locator("#mf-agree").isChecked());

await page.locator(".mf-next").click();
await page.waitForTimeout(400);
log("after signing:", await page.evaluate(() => location.hash));

log(
  "overflow:",
  await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll(".ma-apply *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1);
      })
      .slice(0, 8)
      .map((el) => `${el.tagName}.${[...el.classList].slice(0, 3).join(".")}`);
    return { scrollW: document.documentElement.scrollWidth, vw, wide };
  }),
);
await shot(page, "6-full", true);
console.log("console errors:", errors.length ? errors : "none");
await browser.close();

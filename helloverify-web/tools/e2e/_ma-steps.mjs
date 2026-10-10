import { chromium } from "@playwright/test";

/** node tools/e2e/_ma-steps.mjs [en|ar] [desk|phone] — sign in, About you, Qualifications. */
const locale = process.argv[2] ?? "en";
const tag = process.argv[3] ?? "desk";
const base = `http://localhost:3000/${locale}/solutions/manpower-and-education-authorities/ministry-of-manpower`;
const shot = (page, name, full = false) => page.screenshot({ path: `tools/e2e/_mas-${locale}-${tag}-${name}.png`, fullPage: full });
const pdf = (name) => ({ name, mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n% demo\n" + "x".repeat(180000)) });
const fake = { name: "virus.pdf", mimeType: "application/pdf", buffer: Buffer.from([0x4d, 0x5a, 0x90, 0, 1, 2, 3, 4]) };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: tag === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
await ctx.addCookies([{ name: "hv_consent", value: "rejected", url: "http://localhost:3000" }]).catch(() => {});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && !/Content Security Policy|status of 4\d\d/.test(m.text()) && errors.push(m.text()));
const log = (...a) => console.log("·", ...a);
const upload = (slot, file) => page.locator(`.mf-doc-w:has([id="mf-doc-${slot}"]) input[type=file]`).setInputFiles(file);

await page.goto(`${base}/sign-in`, { waitUntil: "networkidle", timeout: 120000 });
await page.getByRole("button", { name: /^(Reject|رفض|अस्वीकार)/ }).first().click({ timeout: 2500 }).catch(() => {});
await page.locator(".ma-demo-fill").click();
await page.locator(".ma-submit").click();
await page.locator(".ma-otp-in").pressSequentially("123456", { delay: 20 });
await page.waitForURL(/\/apply/, { timeout: 15000 });
await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("hv-mom-draft:")).forEach((k) => localStorage.removeItem(k)));
await page.reload({ waitUntil: "networkidle" });
await page.locator(".mf-step").waitFor();
await page.waitForTimeout(500);
await shot(page, "1-about");

await page.locator(".mf-next").click();
await page.waitForTimeout(400);
log("about issues:", await page.locator(".mf-step .ma-err").count(), "focus:", await page.evaluate(() => document.activeElement?.id), "alert:", await page.locator(".mf-step .ma-alert").innerText());
await shot(page, "2-about-errors");

await page.fill("#mf-dob", "1994-05-12");
await page.selectOption("#mf-nationality", "IN");
await page.fill("#mf-passportNo", "z1234567");
await page.fill("#mf-passportExpiry", "2031-01-01");
await page.locator(".mf-pills label", { hasText: "Employment Pass" }).first().click();
await upload("passport", { name: "passport-bio.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]) });
await page.locator(".mf-doc.is-done").first().waitFor({ timeout: 10000 });
log("passport no:", await page.inputValue("#mf-passportNo"));
await shot(page, "3-about-done");
await page.locator(".mf-next").click();
await page.waitForFunction(() => location.hash === "#qualifications");
await page.waitForTimeout(500);
log("step:", await page.evaluate(() => location.hash), "focus:", await page.evaluate(() => document.activeElement?.id));
await shot(page, "4-quals");

const q = await page.locator(".mf-qual").first().getAttribute("aria-labelledby").then((id) => id.replace(/-h$/, ""));
await page.selectOption(`#mf-${q}-level`, "bachelor");
await page.fill(`#mf-${q}-course`, "B.Tech, Computer Science");
await page.locator(`#mf-${q}-institution`).pressSequentially("anna", { delay: 40 });
await page.locator(".mf-list li[role=option]").first().waitFor();
await shot(page, "5-search");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
log("institution:", await page.inputValue(`#mf-${q}-institution`), "country:", await page.inputValue(`#mf-${q}-country`), "status:", await page.locator(".mf-status").first().innerText());
await page.selectOption(`#mf-${q}-start`, "07");
await page.selectOption(`#mf-${q}-start-y`, "2012");
await page.selectOption(`#mf-${q}-end`, "05");
await page.selectOption(`#mf-${q}-end-y`, "2016");
await upload(`${q}:certificate`, fake);
await page.waitForTimeout(1200);
log("fake pdf:", await page.locator(`.mf-doc-w:has([id="mf-doc-${q}:certificate"]) .ma-err`).innerText().catch(() => "none"));
await upload(`${q}:certificate`, pdf("degree-certificate.pdf"));
await upload(`${q}:transcript`, pdf("transcripts-2012-2016.pdf"));
await page.waitForTimeout(1500);
await shot(page, "6-qual-filled");

await page.locator(".mf-add").click();
await page.waitForTimeout(300);
const q2 = await page.locator(".mf-qual").nth(1).getAttribute("aria-labelledby").then((id) => id.replace(/-h$/, ""));
await page.selectOption(`#mf-${q2}-level`, "master");
await page.fill(`#mf-${q2}-course`, "M.Sc Data Science");
await page.fill(`#mf-${q2}-institution`, "Sri Venkateswara College");
await page.locator(`#mf-${q2}-course`).focus();
await page.locator(".mf-next").click();
await page.waitForTimeout(500);
log("quals alert:", await page.locator(".mf-step .ma-alert").innerText().catch(() => "none"), "focus:", await page.evaluate(() => document.activeElement?.id));
await shot(page, "7-quals-errors");
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
      .map((el) => `${el.tagName}.${[...el.classList].join(".")} ${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)}`);
    return { scrollW: document.documentElement.scrollWidth, vw, scrollX: window.scrollX, wide };
  }),
);
log("summary:", (await page.locator(".mf-sum-quote").innerText()).replace(/\s+/g, " "));

await page.reload({ waitUntil: "networkidle" });
await page.locator(".mf-step").waitFor();
log("after reload:", await page.evaluate(() => location.hash), "cards:", await page.locator(".mf-qual").count(), "docs done:", await page.locator(".mf-doc.is-done").count());
await page.goBack();
await page.waitForTimeout(400);
log("after back:", await page.evaluate(() => location.hash));
await page.locator(".mf-step").screenshot({ path: `tools/e2e/_mas-${locale}-${tag}-8-back.png` });
await shot(page, "9-full", true);
console.log("console errors:", errors.length ? errors : "none");
await browser.close();

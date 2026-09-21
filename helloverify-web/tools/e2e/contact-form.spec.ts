import { expect, test } from "@playwright/test";

/** The lead form, driven by a real browser (BUILD-SPEC §14.1's E2E row, §10).
 *
 *  `tools/test/abuse.test.ts` already covers the screening rules as units, and
 *  `schema.test.ts` covers parsing. What no unit can reach is the seam: a
 *  Server Action invoked by a real form POST, `useActionState` rendering what
 *  came back, and the browser's own constraint validation deciding whether the
 *  POST happens at all. Three of the tests below fail if that seam breaks
 *  while every unit test still passes.
 *
 *  ## Nothing leaves this machine
 *
 *  Checked before writing a single submission, not assumed: `deliverLead`
 *  resolves its CRM sink through `zohoConfig()`, which returns `null` unless
 *  `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET` and `ZOHO_REFRESH_TOKEN` are all
 *  set. There is no `.env` in this tree — only `.env.example` — so the sink is
 *  null and no outbound request is made. A submission is written to the
 *  application log and nowhere else.
 *
 *  THIS IS A PROPERTY OF THE ENVIRONMENT, NOT OF THE TEST. Running this suite
 *  against an origin that does have Zoho credentials would file real leads.
 *  That is the argument for keeping it pointed at a local build, and it is why
 *  the success case uses an obviously synthetic name and an `example.com`
 *  address rather than something that could be mistaken for a person.
 */

const CONTACT = "/en/contact";

/** `example.com` is reserved by RFC 2606 and has no mail server, which the
 *  undeliverable-email check would normally reject — so these tests assert the
 *  path they actually reach rather than assuming a success. */
const SYNTHETIC = {
  name: "E2E Test Submission",
  company: "Playwright",
  email: "e2e@example.com",
  mobile: "+919999999999",
  message: "Automated end-to-end test. Not a real enquiry.",
};

test.describe("contact form", () => {
  test("the browser blocks an empty submit before any POST", async ({ page }) => {
    await page.goto(CONTACT);

    let posted = false;
    page.on("request", (r) => {
      if (r.method() === "POST") posted = true;
    });

    await page.getByRole("button", { name: "Submit" }).click();

    // `required` + `minLength` come from `lib/leads/constraints`, the same
    // module the server schema is built from. This asserts the browser is
    // actually enforcing them — the reason the form ships no client validator
    // and no zod on the client at all.
    await expect(page.locator("#name")).toBeFocused();
    expect(posted, "no POST should be made for an invalid form").toBe(false);
  });

  test("a server-side field error comes back attached to its input", async ({ page }) => {
    await page.goto(CONTACT);

    // `novalidate` the browser's own pass so the POST actually happens: the
    // point is to see what the SERVER says, which is the path a visitor with
    // an odd autofill or a scripted client takes.
    await page.locator("form.form").evaluate((f: HTMLFormElement) => f.setAttribute("novalidate", ""));

    await page.locator("#name").fill("x"); // below LIMITS.name.min
    await page.locator("#email").fill("not-an-email");
    await page.getByRole("button", { name: "Submit" }).click();

    const status = page.locator(".status[role='status']");
    await expect(status).toContainText("Check the highlighted fields and send again.");

    // The error is not merely on screen — it is associated, which is what a
    // screen reader needs and what jsdom-axe cannot confirm on a POST result.
    const email = page.locator("#email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAttribute("aria-describedby", "email-error");
    await expect(page.locator("#email-error")).toBeVisible();
  });

  test("what the user typed survives a rejected submission", async ({ page }) => {
    await page.goto(CONTACT);
    await page.locator("form.form").evaluate((f: HTMLFormElement) => f.setAttribute("novalidate", ""));

    await page.locator("#name").fill(SYNTHETIC.name);
    await page.locator("#company").fill(SYNTHETIC.company);
    await page.locator("#email").fill("not-an-email");
    await page.locator("#message").fill(SYNTHETIC.message);
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.locator(".status[role='status']")).toBeVisible();
    // `echo()` in the action reads the known fields back deliberately so a
    // failed submission does not cost the visitor their typing.
    await expect(page.locator("#name")).toHaveValue(SYNTHETIC.name);
    await expect(page.locator("#company")).toHaveValue(SYNTHETIC.company);
    await expect(page.locator("#message")).toHaveValue(SYNTHETIC.message);
  });

  test("the select keeps its choice across a rejected submission", async ({ page }) => {
    await page.goto(CONTACT);
    await page.locator("form.form").evaluate((f: HTMLFormElement) => f.setAttribute("novalidate", ""));

    const interest = page.locator("#interest");
    const value = await interest.locator("option").nth(1).getAttribute("value");
    await interest.selectOption(value!);

    await page.locator("#email").fill("not-an-email");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.locator(".status[role='status']")).toBeVisible();

    // This is the regression the `key={state.token}` remount exists for: a
    // <select> has no value attribute for React's form reset to restore, so
    // without the remount the chosen service came back empty. Measured once,
    // now guarded.
    await expect(interest).toHaveValue(value!);
  });

  test("?interest= arrives pre-selected", async ({ page }) => {
    await page.goto(CONTACT);
    const value = await page.locator("#interest option").nth(1).getAttribute("value");

    await page.goto(`${CONTACT}?interest=${value}`);
    // Applied in an effect against the DOM rather than through `defaultValue`,
    // because /contact is statically prerendered and deriving it during render
    // would be a hydration mismatch. So it is only true after hydration.
    await expect(page.locator("#interest")).toHaveValue(value!);
  });

  test("an unknown ?interest= is ignored rather than injected", async ({ page }) => {
    await page.goto(`${CONTACT}?interest=not-a-real-option`);
    await expect(page.locator("#interest")).toHaveValue("");
  });

  test("the honeypot is present, hidden, and off the keyboard path", async ({ page }) => {
    await page.goto(CONTACT);
    const pot = page.locator("input.vh[aria-hidden='true']");
    await expect(pot).toHaveCount(1);

    // NOT `toBeVisible()`, which was this test's first mistake. Playwright
    // calls an element visible when it has a non-empty box, and `.vh` is the
    // clip technique — `position:absolute; width:1px; height:1px;
    // clip:rect(0 0 0 0)` — so it has a 1x1 box and passes that predicate
    // while being imperceptible. `display:none` would be the easy way to fail
    // the predicate and the wrong thing to ship: a field that is not rendered
    // is not filled by the automation this is here to catch.
    const box = await pot.boundingBox();
    expect(box, "the honeypot is laid out, not display:none").not.toBeNull();
    expect(box!.width, "clipped to 1px wide").toBeLessThanOrEqual(1);
    expect(box!.height, "clipped to 1px tall").toBeLessThanOrEqual(1);

    await expect(pot).toHaveAttribute("tabindex", "-1");
    await expect(pot).toHaveAttribute("autocomplete", "off");

    // And it must not be reachable by keyboard, which is the property
    // `tabindex="-1"` is actually for. Tabbing from the last real control
    // must never land on it.
    await page.locator("#message").focus();
    await page.keyboard.press("Tab");
    await expect(pot).not.toBeFocused();
  });
});

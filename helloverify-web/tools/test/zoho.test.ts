import http from "node:http";

let refreshCount = 0;
let insertCount = 0;
let scenario = "success";
let lastInsertBody: unknown = null;
let lastAuthHeader = "";

const server = http.createServer((req, res) => {
  const chunks: Buffer[] = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks).toString();
    const json = (code: number, payload: unknown) => {
      res.writeHead(code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(payload));
    };

    if (req.url?.startsWith("/oauth/v2/token")) {
      refreshCount++;
      if (scenario === "revoked-refresh-token") {
        // Zoho answers 200 with an error body here. Checking res.ok alone misses it.
        return json(200, { error: "invalid_code" });
      }
      return json(200, {
        access_token: "acc-" + refreshCount,
        expires_in: 3600,
        api_domain: `http://127.0.0.1:${port}`,
        token_type: "Bearer",
      });
    }

    if (req.url?.startsWith("/crm/v8/settings/fields")) {
      return json(200, {
        fields: [
          {
            api_name: "Lead_Source",
            pick_list_values: [{ actual_value: "Web Form" }, { actual_value: "Trade Show" }],
          },
        ],
      });
    }

    if (req.url?.startsWith("/crm/v8/Leads")) {
      insertCount++;
      lastInsertBody = JSON.parse(body);
      lastAuthHeader = String(req.headers.authorization ?? "");

      if (scenario === "invalid-lead-source") {
        return json(200, {
          data: [
            {
              code: "INVALID_DATA",
              details: { api_name: "Lead_Source" },
              message: "invalid data",
              status: "error",
            },
          ],
        });
      }
      if (scenario === "server-error") return json(500, { message: "internal error" });
      if (scenario === "expired-token" && insertCount === 1) {
        return json(401, { code: "INVALID_TOKEN" });
      }

      return json(201, {
        data: [
          {
            code: "SUCCESS",
            details: { id: "5535000000123456" },
            message: "record added",
            status: "success",
          },
        ],
      });
    }

    json(404, { message: "not found" });
  });
});

await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
const port = (server.address() as { port: number }).port;

process.env.ZOHO_CLIENT_ID = "test-client";
process.env.ZOHO_CLIENT_SECRET = "test-secret";
process.env.ZOHO_REFRESH_TOKEN = "test-refresh";
process.env.ZOHO_ACCOUNTS_HOST = `http://127.0.0.1:${port}`;
process.env.ZOHO_LEAD_SOURCE = "Web Form";

const BASE = "../../src/lib/";
const { zohoSink } = await import(BASE + "integrations/zoho.ts");
const { toZohoLead } = await import(BASE + "integrations/zoho-fields.ts");
const { deliverLead } = await import(BASE + "leads/delivery.ts");

import { check } from "./harness.ts";

const g = globalThis as Record<string, unknown>;
const resetToken = () => {
  g.__hvZohoToken = undefined;
  g.__hvZohoTokenInflight = undefined;
};

const lead = {
  segment: "business",
  name: "Priya Menon",
  company: "Acme Pvt Ltd",
  email: "priya@example.com",
  mobile: "+91 98765 43210",
  interest: "certifier",
  message: "About 400 checks a month.",
} as never;

console.log("1. field mapping (pure)");
{
  const r = toZohoLead(lead, "Web Form");
  check("First_Name split", r.First_Name === "Priya", r);
  check("Last_Name split", r.Last_Name === "Menon", r);
  check("Company", r.Company === "Acme Pvt Ltd", r);
  check("Email is a real field", r.Email === "priya@example.com", r);
  check("Phone", r.Phone === "+91 98765 43210", r);
  check("Lead_Source set", r.Lead_Source === "Web Form", r);
  check("no Annual_Revenue invented", !("Annual_Revenue" in r), Object.keys(r));
  check("description carries label not slug", r.Description.includes("Vendor due diligence (Certifier)"), r.Description);
  check("description carries segment label", r.Description.includes("Segment: Business"), r.Description);
  check("description carries unsplit name", r.Description.includes("Full name as entered: Priya Menon"), r.Description);

  const single = toZohoLead({ ...(lead as object), name: "Prince" } as never);
  check("single-token name fills both", single.First_Name === "Prince" && single.Last_Name === "Prince", single);
  check("Lead_Source omitted when unset", !("Lead_Source" in single), Object.keys(single));

  const bare = toZohoLead({ segment: "individual", name: "A Singh", email: "a@b.co" } as never);
  check("missing company -> Not provided", bare.Company === "Not provided", bare);
  check("missing mobile -> no Phone key", !("Phone" in bare), Object.keys(bare));
}

console.log("2. transport");
{
  resetToken();
  refreshCount = 0;
  insertCount = 0;
  scenario = "success";
  const r = await zohoSink.deliver(lead, { receivedAt: new Date() });
  check("success", r.ok === true, r);
  check("returns record id", r.ok && r.reference === "5535000000123456", r);
  check("bearer header shape", lastAuthHeader.startsWith("Zoho-oauthtoken "), lastAuthHeader);
  check("posts one record under data[]", Array.isArray((lastInsertBody as { data: unknown[] }).data), lastInsertBody);

  const r2 = await zohoSink.deliver(lead, { receivedAt: new Date() });
  check("second send reuses cached token", refreshCount === 1 && r2.ok === true, { refreshCount });
}

console.log("3. HTTP 200 that is actually a rejection");
{
  resetToken();
  refreshCount = 0;
  insertCount = 0;
  scenario = "invalid-lead-source";
  const r = await zohoSink.deliver(lead, { receivedAt: new Date() });
  check("not reported as success", r.ok === false, r);
  check("classified as upstream-rejected", !r.ok && r.reason === "upstream-rejected", r);
  check("names the offending field", !r.ok && r.detail.includes("Lead_Source"), r);
}

console.log("4. expired access token");
{
  resetToken();
  refreshCount = 0;
  insertCount = 0;
  scenario = "expired-token";
  const r = await zohoSink.deliver(lead, { receivedAt: new Date() });
  check("401 recovered by refresh + retry", r.ok === true, r);
  check("refreshed twice", refreshCount === 2, { refreshCount });
}

console.log("5. revoked refresh token");
{
  resetToken();
  refreshCount = 0;
  scenario = "revoked-refresh-token";
  const r = await deliverLead(lead, { receivedAt: new Date(), identity: "test" });
  check("200-with-error body is not success", r.ok === false, r);
  check("surfaces as upstream-error", !r.ok && r.reason === "upstream-error", r);
}

console.log("6. 5xx retried by deliverLead");
{
  resetToken();
  insertCount = 0;
  scenario = "server-error";
  const r = await deliverLead(lead, { receivedAt: new Date(), identity: "test" });
  check("reported as failure", r.ok === false, r);
  check("retried exactly once (2 attempts)", insertCount === 2, { insertCount });
}

console.log("7. bad ZOHO_LEAD_SOURCE is caught against the live picklist");
{
  resetToken();
  g.__hvZohoLeadSourceChecked = undefined;
  process.env.ZOHO_LEAD_SOURCE = "HelloVerify";
  scenario = "success";
  const logs: string[] = [];
  const realError = console.error;
  console.error = (line: string) => logs.push(String(line));
  await zohoSink.deliver(lead, { receivedAt: new Date() });
  console.error = realError;
  const hit = logs.find((l) => l.includes("zoho.lead-source.invalid"));
  check("logs at ERROR naming the bad value", Boolean(hit && hit.includes("HelloVerify")), logs);
  check("lists the allowed values", Boolean(hit && hit.includes("Web Form")), logs);
}


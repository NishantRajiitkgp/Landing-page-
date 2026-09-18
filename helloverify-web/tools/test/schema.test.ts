import { parseSubmission } from "../../src/lib/leads/schema.ts";

import { check } from "./harness.ts";

function fd(o: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.append(k, v);
  return f;
}

const base = {
  segment: "business",
  name: "Priya Menon",
  email: "PRIYA@Example.COM ",
  company: "Acme Pvt Ltd",
  mobile: "+91 98765 43210",
  interest: "customer-kyc",
  message: "About 400 checks a month, India and Philippines.",
};

console.log("1. happy path");
{
  const r = parseSubmission(fd(base));
  check("parses", r.ok, r);
  if (r.ok) {
    check("email lowercased + trimmed", r.lead.email === "priya@example.com", r.lead.email);
    check("name kept", r.lead.name === "Priya Menon", r.lead.name);
    check("mobile kept", r.lead.mobile === "+91 98765 43210", r.lead.mobile);
    check("interest kept", r.lead.interest === "customer-kyc", r.lead.interest);
    check("no honeypot signal", r.signals.honeypot === undefined, r.signals);
  }
}

console.log("2. empty optionals collapse to undefined");
{
  const r = parseSubmission(
    fd({ segment: "individual", name: "A Singh", email: "a@b.co", company: "", mobile: "", interest: "", message: "" }),
  );
  check("parses", r.ok, r);
  if (r.ok) {
    check("company undefined", r.lead.company === undefined, r.lead.company);
    check("mobile undefined", r.lead.mobile === undefined, r.lead.mobile);
    check("interest undefined", r.lead.interest === undefined, r.lead.interest);
    check("message undefined", r.lead.message === undefined, r.lead.message);
  }
}

console.log("3. field errors");
{
  const r = parseSubmission(fd({ ...base, name: "A" }));
  check("short name rejected", !r.ok && !!r.fieldErrors.name, r);

  const r2 = parseSubmission(fd({ ...base, email: "not-an-email" }));
  check("bad email rejected", !r2.ok && !!r2.fieldErrors.email, r2);

  const r3 = parseSubmission(fd({ ...base, segment: "martian" }));
  check("bad segment rejected", !r3.ok && !!r3.fieldErrors.segment, r3);

  const r4 = parseSubmission(fd({ ...base, interest: "free-ponies" }));
  check("bad interest rejected", !r4.ok && !!r4.fieldErrors.interest, r4);

  const r5 = parseSubmission(fd({ ...base, mobile: "call me maybe" }));
  check("bad mobile rejected", !r5.ok && !!r5.fieldErrors.mobile, r5);

  const r6 = parseSubmission(fd({ ...base, message: "x".repeat(2001) }));
  check("over-long message rejected", !r6.ok && !!r6.fieldErrors.message, r6);

  const r7 = parseSubmission(fd({ ...base, name: "Priya" + String.fromCharCode(10) + "Menon" }));
  check("newline in name rejected", !r7.ok && !!r7.fieldErrors.name, r7);

  const r8 = parseSubmission(fd({ ...base, name: "Priya" + String.fromCharCode(1) + "Menon" }));
  check("control char in name rejected", !r8.ok && !!r8.fieldErrors.name, r8);

  const r9 = parseSubmission(fd({ segment: "business" }));
  check("missing name+email rejected", !r9.ok && !!r9.fieldErrors.name && !!r9.fieldErrors.email, r9);

  check("error message is a sentence", !r.ok && r.fieldErrors.name === "Enter your full name.", !r.ok && r.fieldErrors.name);
}

console.log("4. message keeps its newlines (it is prose)");
{
  const r = parseSubmission(fd({ ...base, message: "Line one" + String.fromCharCode(10) + "Line two" }));
  check("multiline message accepted", r.ok, r);
}

console.log("5. abuse signals");
{
  const r = parseSubmission(fd({ ...base, company_website: "http://spam.example", elapsed_ms: "8421" }));
  check("honeypot captured", r.ok && r.signals.honeypot === "http://spam.example", r.ok && r.signals);
  check("elapsed parsed", r.ok && r.signals.elapsedMs === 8421, r.ok && r.signals);

  const r2 = parseSubmission(fd({ ...base, elapsed_ms: "" }));
  check("empty elapsed -> undefined (not 0)", r2.ok && r2.signals.elapsedMs === undefined, r2.ok && r2.signals);

  const r3 = parseSubmission(fd({ ...base, elapsed_ms: "banana" }));
  check("junk elapsed -> undefined", r3.ok && r3.signals.elapsedMs === undefined, r3.ok && r3.signals);

  const r4 = parseSubmission(fd({ ...base, elapsed_ms: "-5" }));
  check("negative elapsed -> undefined", r4.ok && r4.signals.elapsedMs === undefined, r4.ok && r4.signals);

  const r5 = parseSubmission(fd(base));
  check("absent honeypot -> undefined", r5.ok && r5.signals.honeypot === undefined, r5.ok && r5.signals);
}

console.log("6. extra posted fields are ignored, not mapped");
{
  const r = parseSubmission(fd({ ...base, Lead_Source: "injected", owner: "someone" }));
  check("parses", r.ok, r);
  if (r.ok) {
    check(
      "lead has only the 7 known keys",
      Object.keys(r.lead).every((k) =>
        ["segment", "name", "company", "email", "mobile", "interest", "message"].includes(k),
      ),
      Object.keys(r.lead),
    );
  }
}


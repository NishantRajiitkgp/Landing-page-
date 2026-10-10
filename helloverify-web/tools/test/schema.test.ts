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
  interest: "white-collar",
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
    check("interest kept", r.lead.interest === "white-collar", r.lead.interest);
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

console.log("7. sales form — dial code and digits");
{
  const dial = {
    segment: "business",
    name: "Priya Menon",
    email: "priya@example.com",
    company: "Acme Pvt Ltd",
    countryCode: "+91",
    mobile: "9876543210",
    interest: "white-collar",
    message: "About 400 checks a month.",
  };

  const r = parseSubmission(fd(dial));
  check("dial form parses", r.ok, r);
  if (r.ok) {
    check("national number kept", r.lead.mobile === "9876543210", r.lead.mobile);
    check("country code kept", r.lead.countryCode === "+91", r.lead.countryCode);
  }

  const spaced = parseSubmission(fd({ ...dial, mobile: "98765 43210" }));
  check("spaces in the number rejected", !spaced.ok && !!spaced.fieldErrors.mobile, spaced);

  const letters = parseSubmission(fd({ ...dial, mobile: "98abc43210" }));
  check("letters in the number rejected", !letters.ok && !!letters.fieldErrors.mobile, letters);

  const short = parseSubmission(fd({ ...dial, mobile: "12345" }));
  check("fewer than 6 digits rejected", !short.ok && !!short.fieldErrors.mobile, short);

  const long = parseSubmission(fd({ ...dial, mobile: "1234567890123456" }));
  check("more than 15 digits rejected", !long.ok && !!long.fieldErrors.mobile, long);

  const badCode = parseSubmission(fd({ ...dial, countryCode: "+999" }));
  check("unknown country code rejected", !badCode.ok && !!badCode.fieldErrors.countryCode, badCode);

  const noMobile = parseSubmission(fd({ ...dial, mobile: "" }));
  check("business without a number rejected", !noMobile.ok && !!noMobile.fieldErrors.mobile, noMobile);

  const noName = parseSubmission(fd({ ...dial, name: "" }));
  check("business without a name rejected", !noName.ok && noName.fieldErrors.name === "Enter your full name.", noName);

  const digitsName = parseSubmission(fd({ ...dial, name: "Priya2" }));
  check("digits in a name rejected", !digitsName.ok && !!digitsName.fieldErrors.name, digitsName);

  const unicode = parseSubmission(fd({ ...dial, name: "प्रिया मेनन" }));
  check("unicode name accepted", unicode.ok, unicode);

  const badCompany = parseSubmission(fd({ ...dial, company: "!!" }));
  check("punctuation-only company rejected", !badCompany.ok && !!badCompany.fieldErrors.company, badCompany);

  const individual = parseSubmission(fd({ segment: "individual", name: "A Singh", email: "a@b.co", countryCode: "+91", mobile: "" }));
  check("individual without a number rejected", !individual.ok && !!individual.fieldErrors.mobile, individual);

  const gov = parseSubmission(
    fd({ segment: "government", name: "", email: "a@dept.gov", company: "", countryCode: "+91", mobile: "", interest: "", message: "" }),
  );
  check("government with only an email parses", gov.ok, gov);
  if (gov.ok) {
    check("government name stored blank", gov.lead.name === "", gov.lead.name);
    check("government number dropped", gov.lead.mobile === undefined, gov.lead.mobile);
    check("bare country code dropped", gov.lead.countryCode === undefined, gov.lead.countryCode);
  }

  const govMail = parseSubmission(fd({ segment: "government", email: "not-an-email", countryCode: "+91" }));
  check("government without a real email rejected", !govMail.ok && !!govMail.fieldErrors.email, govMail);

  const govPhone = parseSubmission(fd({ segment: "government", email: "a@dept.gov", countryCode: "+971", mobile: "501234567" }));
  check("government may still leave a number", govPhone.ok && govPhone.lead.mobile === "501234567" && govPhone.lead.countryCode === "+971", govPhone);
}

console.log("8. services per audience, and the individual's for-whom choice");
{
  const person = { segment: "individual", name: "A Singh", email: "a@b.co", countryCode: "+91", mobile: "9876543210" };
  const multi = (o: Record<string, string>, interests: string[]) => {
    const f = fd(o);
    for (const value of interests) f.append("interest", value);
    return f;
  };

  const other = parseSubmission(multi({ ...person, forWhom: "other" }, ["nanny", "driver", "nanny"]));
  check("someone else may tick several services", other.ok, other);
  if (other.ok) {
    check("all ticked services kept, deduplicated", other.lead.interests?.join() === "nanny,driver", other.lead.interests);
    check("first service mirrored in interest", other.lead.interest === "nanny", other.lead.interest);
    check("for-whom kept", other.lead.forWhom === "other", other.lead.forWhom);
  }

  const self = parseSubmission(multi({ ...person, forWhom: "self" }, ["immigration-authority"]));
  check("myself takes one authority", self.ok && self.lead.interest === "immigration-authority", self);

  const selfTwo = parseSubmission(multi({ ...person, forWhom: "self" }, ["immigration-authority", "healthcare-authority"]));
  check("myself may not tick two", !selfTwo.ok && !!selfTwo.fieldErrors.interest, selfTwo);

  const selfConsumer = parseSubmission(multi({ ...person, forWhom: "self" }, ["nanny"]));
  check("myself cannot pick a consumer service", !selfConsumer.ok && !!selfConsumer.fieldErrors.interest, selfConsumer);

  const noFor = parseSubmission(fd(person));
  check("individual must say who it is for", !noFor.ok && !!noFor.fieldErrors.forWhom, noFor);

  const bizAuthority = parseSubmission(multi({ ...person, segment: "business", forWhom: "other" }, ["healthcare-authority"]));
  check("business cannot pick an authority", !bizAuthority.ok && !!bizAuthority.fieldErrors.interest, bizAuthority);

  const bizFor = parseSubmission(multi({ ...person, segment: "business", forWhom: "other" }, ["white-collar"]));
  check("for-whom dropped outside individual", bizFor.ok && bizFor.lead.forWhom === undefined, bizFor);

  const none = parseSubmission(fd({ ...person, forWhom: "other" }));
  check("services stay optional", none.ok && none.lead.interests === undefined && none.lead.interest === undefined, none);
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


import { check } from "./harness.ts";

import { applicantHandoffUrl, decryptCaseId, encryptCaseId } from "../../src/lib/authority/encrypt.ts";
import { buildInvitePayload, flattenPackages } from "../../src/lib/authority/invite.ts";
import {
  AUTHORITY_MOCK_DUPLICATE_EMAIL,
  AUTHORITY_MOCK_OTP,
  mockHandoffUrl,
  mockInvite,
  mockPackages,
  mockVerifyOtp,
} from "../../src/lib/authority/mock.ts";
import {
  AUTHORITY_PORTALS,
  defaultTab,
  isAuthorityId,
  UAE_PASS,
} from "../../src/lib/authority/portals.ts";
import { isValidEmail, isValidOtp, isValidPhone } from "../../src/lib/authority/validate.ts";
import { pick } from "../../src/lib/copy/index.ts";
import { AUTHORITY } from "../../src/lib/copy/authority.ts";
import { LEGACY_ROUTES } from "../../src/lib/seo/legacy-urls.ts";
import { legacyRedirects } from "../../src/lib/seo/redirects.ts";
import { allRoutes } from "../../src/lib/seo/routes.ts";

console.log("1. field rules match the old authority dialog");
check("email", isValidEmail("ada@helloverify.com"));
check("bare word is not email", !isValidEmail("ada"));
check("10-digit phone", isValidPhone("9876543210"));
check("short phone fails", !isValidPhone("98765"));
check("6-digit otp", isValidOtp("123456"));
check("short otp fails", !isValidOtp("12345"));

console.log("2. portals and tabs match the old SPA");
check("mom portal", AUTHORITY_PORTALS.mom.candidateOrigin === "https://applicant.helloverify.sg");
check("mom agency", AUTHORITY_PORTALS.mom.agencyOrigin === "https://agency.helloverify.sg/");
check("mohesr portal", AUTHORITY_PORTALS.mohesr.candidateOrigin === "https://applicant.helloverify.ae");
check("mohesr has no agency", AUTHORITY_PORTALS.mohesr.agencyOrigin === undefined);
check("saudi is not an authority id here", !isAuthorityId("saudi"));
check("mom opens on register", defaultTab("mom") === "register");
check("mohesr opens on login", defaultTab("mohesr") === "login");
check("uae pass sign-in is ids.uaepass.ae", UAE_PASS.signIn.includes("ids.uaepass.ae"));

console.log("3. invite payload keeps the old flat keys");
{
  const mom = buildInvitePayload("mom", {
    name: "Ada",
    last: "Lovelace",
    email: "ada@example.com",
    number: "9876543210",
    dialCode: "+65",
    client_package_id: "6",
    program: "999",
    sbu: "999",
    section: "999",
  });
  check("mom client 701", mom.client === 701);
  check("mom program is fixed 1810", mom.program === 1810);
  check("mom channel", mom.channel_name === "applicant_invite");
  check("mom numbered name", mom["1"] === "Ada" && mom["3"] === "Lovelace");

  const ae = buildInvitePayload("mohesr", {
    name: "Ada",
    last: "Lovelace",
    email: "ada@example.com",
    number: "9876543210",
    dialCode: "+971",
    client_package_id: "9",
    program: "22",
    sbu: "33",
    section: "44",
  });
  check("mohesr client 702", ae.client === 702);
  check("mohesr program from package", ae.program === "22" && ae.sbu === "33" && ae.section === "44");

  const list = flattenPackages(mockPackages());
  check("mock package flatten", list.length === 1 && list[0]?.package === "Education Pack");
}

console.log("4. mock OTP 123456; already@used.com is duplicate");
check("good otp", mockVerifyOtp(AUTHORITY_MOCK_OTP).status === true);
check("bad otp", mockVerifyOtp("000000").status === false);
check("duplicate invite", mockInvite(AUTHORITY_MOCK_DUPLICATE_EMAIL).data?.duplicate_found === true);
check("fresh invite", mockInvite("ada@example.com").status === true);
check("mock handoff stays on applicant.ae", mockHandoffUrl("mohesr").url === "https://applicant.helloverify.ae/");

console.log("5. AES handoff is CryptoJS / OpenSSL salted");
{
  const key = "local-dev-only-32-characters!!";
  const cipher = encryptCaseId("ada@example.com", key);
  check("roundtrip", decryptCaseId(cipher, key) === "ada@example.com");
  const url = applicantHandoffUrl("https://applicant.helloverify.ae", "a@b.co", "secret", "123456", key);
  check("handoff host", url.startsWith("https://applicant.helloverify.ae/#/signinwith?"));
  check("handoff has data3/5/6", url.includes("data3=") && url.includes("data5=") && url.includes("data6="));
}

console.log("6. educationae goes to live MOHESR; saudi stays home");
check(
  "MOM case study is live",
  allRoutes().some((r) => r.path === "/solutions/manpower-and-education-authorities/ministry-of-manpower"),
);
check(
  "MOHESR record is live",
  allRoutes().some((r) => r.path === "/governments/manpower-education/mohesr"),
);
{
  const row = LEGACY_ROUTES.find((r) => r.from === "/solutions/manpower-and-education-authorities/educationae");
  check(
    "educationae 308s to the live MOHESR record",
    row?.to === "/governments/manpower-education/mohesr",
    row,
  );
  const saudi = LEGACY_ROUTES.find((r) => r.from === "/premium/saudi");
  check("saudi still 308s home", saudi?.to === "/", saudi);
  check(
    "/en/…/educationae 308s to /en/governments/manpower-education/mohesr",
    legacyRedirects().some(
      (r) =>
        r.source === "/en/solutions/manpower-and-education-authorities/educationae" &&
        r.destination === "/en/governments/manpower-education/mohesr",
    ),
  );
}

console.log("7. applicant copy is not English paste in hi/ar");
{
  const en = pick(AUTHORITY, "en");
  check("proceed cta", en.entry.applicantCta === "Proceed as individual");
  check("hi is not English paste", pick(AUTHORITY, "hi").entry.applicantCta !== en.entry.applicantCta);
  check("ar is not English paste", pick(AUTHORITY, "ar").entry.applicantCta !== en.entry.applicantCta);
}

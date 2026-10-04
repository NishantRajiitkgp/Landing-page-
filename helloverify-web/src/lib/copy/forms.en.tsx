/** English copy for `components/forms/ContactForm.tsx`.
 *
 *  THE FORMS RULING IN `./index` SAID NOT YET. The block was that ten of the
 *  visible strings lived in `lib/leads/constraints.ts` next to the slugs the
 *  CRM posts, so a `forms` namespace would cover 24 of 34 and look finished.
 *  The split is: those English tables stay in `constraints` for Zoho
 *  (`lib/integrations/zoho-fields.ts`). This namespace is the UI. The posted
 *  value is still the slug.
 *
 *  Threaded as a prop. The form is the tree's only `"use client"` file and
 *  must not import this layer — `./index` "Zero client bytes".
 */

export const en = {
  kicker: "Talk to sales",
  who: "Who is asking",
  interest: "Services of interest",
  message: "Message",
  submit: "Submit",
  sending: "Sending…",

  segments: {
    business: "Business",
    government: "Government",
    individual: "Individual",
  },

  interests: {
    enterprise: "Enterprise background verification",
    smb: "SMB packages",
    "employee-verification": "Employee verification",
    "customer-kyc": "Customer KYC / Trust & Safety",
    certifier: "Vendor due diligence (Certifier)",
    governments: "Government / authority programme",
    hellov: "Individual / HelloV",
  },

  fields: {
    name: { label: "Full name", placeholder: "Priya Menon" },
    mobile: { label: "Mobile", placeholder: "+91" },
  },

  audiences: {
    business: {
      company: { label: "Company", placeholder: "Company name" },
      email: { label: "Business email", placeholder: "name@company.com" },
      interestPlaceholder: "Employee verification, KYC, Certifier, Consumer…",
      prompt: "How many checks a month, and where?",
    },
    government: {
      company: { label: "Department or authority", placeholder: "Ministry, department or agency" },
      email: { label: "Official email", placeholder: "name@department.gov" },
      interestPlaceholder: "Government / authority programme",
      prompt: "Which programme is it for, and roughly how many applicants a year?",
    },
    individual: {
      email: { label: "Email", placeholder: "you@example.com" },
      interestPlaceholder: "Individual / HelloV",
      prompt: "Who would you like to verify — a tenant, a nanny, a driver?",
    },
  },

  consent: {
    lead: "By submitting, you consent to HelloVerify processing your data for lead generation and related communications, per our",
    policy: "Privacy Policy",
    end: ". We'll never share your brand.",
  },

  success: {
    lead: "In the meantime, the",
    pack: "compliance pack",
    mid: "lists what we can send before a call, and",
    library: "the check library",
    end: "covers turnaround times per check.",
  },

  status: {
    invalid: "Check the highlighted fields and send again.",
    ok: "Thank you — your enquiry is with us. Someone who actually runs checks will reply, usually within one working day.",
    disposable:
      "That looks like a temporary email address. Use one you can receive a reply at — we will be sending you a real answer, not a drip campaign.",
    undeliverable:
      "We cannot find a mail server for that domain, so a reply would bounce. Check the spelling of the address.",
    suspicious: (fallbackEmail: string) =>
      `We could not accept that submission. Email ${fallbackEmail} and a person will pick it up from there.`,
    rateLimited: (retryAfterSeconds: number, fallbackEmail: string) => {
      const minutes = Math.ceil(retryAfterSeconds / 60);
      const wait = minutes <= 1 ? "a minute" : `${minutes} minutes`;
      return `That is several submissions from here already. Wait ${wait} and try again, or email ${fallbackEmail} if it is urgent.`;
    },
    degraded: (fallbackEmail: string) =>
      `Your details reached us, but we could not file them automatically. We have kept a copy — to be certain this reaches a person, email ${fallbackEmail}.`,
  },
};

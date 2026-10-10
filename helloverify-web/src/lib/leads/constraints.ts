/** Lead form field constraints, as plain data.
 *
 *  This is the ONE place the client and the server agree on the field
 *  vocabulary and its limits, and it deliberately imports nothing — in
 *  particular not zod. The client form renders its HTML validation attributes
 *  from these values; the server builds its zod schema from the same values
 *  (`./schema`). Neither can drift from the other, and zod never crosses the
 *  client boundary.
 *
 *  That split is what lets us satisfy BUILD-SPEC §10 rule 1 ("same schema both
 *  sides") without spending ~20 KB of the §9.1 120 KB script budget on a
 *  client-side validator. `/contact` currently ships zero route-specific JS.
 *
 *  These slugs are OUR vocabulary, not Zoho's. The translation to whatever
 *  picklist strings the CRM actually accepts happens in one place —
 *  `lib/integrations/` — so an unknown picklist value can never leak in from
 *  a form option. (BUILD-SPEC §10: an unrecognised `Lead_Source` makes Zoho
 *  return HTTP 200 and silently drop the lead.)
 */

/** Who is asking. Drives routing, and is the only required choice. */
export const SEGMENT_VALUES = ["business", "government", "individual"] as const;
export type SegmentValue = (typeof SEGMENT_VALUES)[number];

/** English CRM labels. The form UI reads `lib/copy/forms` instead; Zoho
 *  still gets these strings (`lib/integrations/zoho-fields.ts`). */
export const SEGMENT_LABELS: Record<SegmentValue, string> = {
  business: "Business",
  government: "Government",
  individual: "Individual",
};

/** Who an individual is verifying. The old site's Applicant (their own
 *  credentials, for an authority) and Consumer (a nanny, a driver, a tenant). */
export const FOR_VALUES = ["self", "other"] as const;
export type ForValue = (typeof FOR_VALUES)[number];

export const FOR_LABELS: Record<ForValue, string> = {
  self: "For myself (Applicant)",
  other: "For someone else (Consumer)",
};

/** Optional. Sharpens routing; deliberately not required — every extra
 *  mandatory field on a conversion page costs completions (DESIGN-RESEARCH).
 *
 *  The old site's "Services of Interest" lists, in its order. The LABEL, not
 *  the slug, is what reaches Zoho. */
export const INTEREST_VALUES = [
  "white-collar",
  "blue-collar",
  "international",
  "vendor-due-diligence",
  "partnership",
  "immigration-authority",
  "healthcare-authority",
  "education-authority",
  "business-trade-authority",
  "nanny",
  "driver",
  "home-staff",
  "tenant",
  "other-verification",
] as const;
export type InterestValue = (typeof INTEREST_VALUES)[number];

export const INTEREST_LABELS: Record<InterestValue, string> = {
  "white-collar": "White Collar Verification",
  "blue-collar": "Blue Collar Verification",
  international: "International Check & Capability",
  "vendor-due-diligence": "Vendor Due Diligence",
  partnership: "Partnership (Request for a demo)",
  "immigration-authority": "Immigration Authority",
  "healthcare-authority": "Healthcare Authority",
  "education-authority": "Education Authority",
  "business-trade-authority": "Business & Trade Authority",
  nanny: "Nanny Verification",
  driver: "Driver Verification",
  "home-staff": "Home Staff",
  tenant: "Tenant Verification",
  "other-verification": "Other Verification",
};

const AUTHORITY_INTERESTS = [
  "immigration-authority",
  "healthcare-authority",
  "education-authority",
  "business-trade-authority",
] as const satisfies readonly InterestValue[];

/** The services each audience is offered, in display order. The server
 *  rejects anything outside the list for the posted audience. */
export const INTEREST_GROUPS = {
  business: ["white-collar", "blue-collar", "international", "vendor-due-diligence", "partnership"],
  government: AUTHORITY_INTERESTS,
  self: AUTHORITY_INTERESTS,
  other: ["nanny", "driver", "home-staff", "tenant", "other-verification"],
} as const satisfies Record<"business" | "government" | ForValue, readonly InterestValue[]>;

export type InterestGroup = keyof typeof INTEREST_GROUPS;

export function interestGroup(segment: SegmentValue, forWhom: ForValue): InterestGroup {
  return segment === "individual" ? forWhom : segment;
}

/** Only someone verifying other people may pick more than one service. */
export function interestIsMulti(group: InterestGroup): boolean {
  return group === "other";
}

/** Length bounds. `max` doubles as the input's `maxLength`, so a value that
 *  would fail server validation cannot normally be typed in the first place. */
export const LIMITS = {
  name: { min: 2, max: 100 },
  company: { min: 0, max: 120 },
  /** RFC 5321 caps an address at 254 octets. */
  email: { min: 6, max: 254 },
  /** Legacy formatted numbers (`+91 98765 43210`) from the contact-page enquiry. */
  mobile: { min: 7, max: 20 },
  /** National number on the sales form: digits only, country code is separate. */
  phone: { min: 6, max: 15 },
  message: { min: 0, max: 2000 },
} as const;

/** Government asks for an email only. Business and individual also require a
 *  name and a mobile number. */
export function contactDetailsRequired(segment: SegmentValue): boolean {
  return segment !== "government";
}

/** Unanchored on purpose: HTML `pattern` anchors implicitly, and `./schema`
 *  wraps it in `^(?:…)$` for zod. The browser compiles `pattern` with the `v`
 *  flag, where `(`, `)` and `-` inside a class must be escaped or the whole
 *  pattern is discarded; the escapes below are equally valid without a flag,
 *  so both consumers read it the same. Deliberately permissive — this
 *  catches a typo, it does not attempt to validate a phone number, which is
 *  not decidable from a string. */
export const MOBILE_PATTERN = String.raw`[+]?[0-9][0-9 \(\)\-]{6,19}`;

/** National number. HTML `pattern` anchors this; the server wraps it the same
 *  way as `MOBILE_PATTERN`. Built from `LIMITS.phone` so the two cannot drift. */
export const PHONE_DIGITS_PATTERN = `[0-9]{${LIMITS.phone.min},${LIMITS.phone.max}}`;

/** A letter, then letters, combining marks (Devanagari vowel signs and the
 *  like), spaces, apostrophes, periods, hyphens. `-`, `(` and `)` are escaped
 *  because the browser compiles `pattern` with the `v` flag. `\p{L}` and
 *  `\p{M}` are valid there and under the `u` flag the server uses. */
export const NAME_PATTERN = String.raw`[\p{L}][\p{L}\p{M} .'\-]{1,99}`;

/** Organisation names: a letter or digit, then the same, marks, and light punctuation. */
export const COMPANY_PATTERN = String.raw`[\p{L}\p{N}][\p{L}\p{N}\p{M} .,&'\(\)\-\/+]{1,119}`;

/** A reply address with a real domain. `type="email"` alone accepts `a@b`. */
export const EMAIL_PATTERN = String.raw`[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`;

/** Honeypot. Named like a field a form-filling bot wants and a human never
 *  sees: rendered visually hidden, `tabIndex={-1}`, `autoComplete="off"`,
 *  `aria-hidden`. Any non-empty value is a bot. */
export const HONEYPOT_FIELD = "company_website";

/** Hidden field carrying how long the form was on screen before submit.
 *  See the timing note in `./schema` for what this check is and is not worth. */
export const ELAPSED_FIELD = "elapsed_ms";

/** Every business field name the form posts, in one list, so the action and
 *  the form cannot disagree about a string literal. */
export const FIELDS = {
  segment: "segment",
  forWhom: "forWhom",
  name: "name",
  company: "company",
  email: "email",
  countryCode: "countryCode",
  mobile: "mobile",
  interest: "interest",
  message: "message",
} as const;

export type LeadField = keyof typeof FIELDS;

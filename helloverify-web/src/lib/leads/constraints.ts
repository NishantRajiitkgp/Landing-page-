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

export const SEGMENT_LABELS: Record<SegmentValue, string> = {
  business: "Business",
  government: "Government",
  individual: "Individual",
};

/** Optional. Sharpens routing; deliberately not required — every extra
 *  mandatory field on a conversion page costs completions (DESIGN-RESEARCH).
 *
 *  Each slug is the last path segment of the route that sells that thing
 *  (`certifier` -> /business/certifier, `hellov` -> /individuals/hellov), so a
 *  vertical page can deep-link `/contact?interest=<its own slug>` and arrive
 *  pre-selected. One taxonomy across URLs, JSON-LD and CRM reporting rather
 *  than three. The old site's 15 slugs are deliberately NOT carried over: they
 *  lived only in a `?service=` query parameter that nothing ever linked to, so
 *  there is no ranking equity in them, only a second vocabulary to maintain.
 *
 *  The LABEL, not the slug, is what reaches Zoho. */
export const INTEREST_VALUES = [
  "enterprise",
  "smb",
  "employee-verification",
  "customer-kyc",
  "certifier",
  "governments",
  "hellov",
] as const;
export type InterestValue = (typeof INTEREST_VALUES)[number];

export const INTEREST_LABELS: Record<InterestValue, string> = {
  enterprise: "Enterprise background verification",
  smb: "SMB packages",
  "employee-verification": "Employee verification",
  "customer-kyc": "Customer KYC / Trust & Safety",
  certifier: "Vendor due diligence (Certifier)",
  governments: "Government / authority programme",
  hellov: "Individual / HelloV",
};

/** Length bounds. `max` doubles as the input's `maxLength`, so a value that
 *  would fail server validation cannot normally be typed in the first place. */
export const LIMITS = {
  name: { min: 2, max: 100 },
  company: { min: 0, max: 120 },
  /** RFC 5321 caps an address at 254 octets. */
  email: { min: 6, max: 254 },
  mobile: { min: 7, max: 20 },
  message: { min: 0, max: 2000 },
} as const;

/** Unanchored on purpose: HTML `pattern` anchors implicitly, and `./schema`
 *  wraps it in `^(?:…)$` for zod. Written without backslash escapes so the two
 *  consumers cannot disagree about escaping. Deliberately permissive — this
 *  catches a typo, it does not attempt to validate a phone number, which is
 *  not decidable from a string. */
export const MOBILE_PATTERN = "[+]?[0-9][-0-9 ()]{6,19}";

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
  name: "name",
  company: "company",
  email: "email",
  mobile: "mobile",
  interest: "interest",
  message: "message",
} as const;

export type LeadField = keyof typeof FIELDS;

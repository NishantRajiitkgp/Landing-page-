import type { InterestValue, LeadField, SegmentValue } from "@/lib/leads/constraints";
import { LIMITS, MOBILE_PATTERN } from "@/lib/leads/constraints";

/** The lead form's field primitives, lifted out of `ContactForm.tsx`.
 *
 *  §17 condition 22 again, and this is the one file in Part 5 with no repeated
 *  card to collapse - TASKS.md called it "a genuine split" and it was right
 *  about that, though not about there being no repeat at all: four of the six
 *  fields were written out in full for the sake of six differing attributes.
 *  Those four are `TEXT_FIELDS` below; the split is what buys the room.
 *
 *  Nothing here is stateful, so none of it needs to be in the client component
 *  itself. It is still bundled as client code, because `ContactForm.tsx`
 *  imports it - moving it does not move a byte off the wire, and is not
 *  pretending to.
 */

/** Hoisted out of `ContactForm` deliberately.
 *
 *  Declared inside the render body, this is a NEW component type on every
 *  render, so React unmounts and remounts the paragraph each time rather than
 *  updating it - `react-hooks/static-components`. Nothing here holds focus or
 *  state, so the visible cost was nil, but it defeats reconciliation for no
 *  reason and the rule is right to refuse it.
 *
 *  It takes the message rather than closing over `errorFor`, which is what lets
 *  it live out here at all.
 */
export function ErrorText({ field, message, idPrefix = "" }: { field: LeadField; message?: string; idPrefix?: string }) {
  if (!message) return null;
  return (
    <p className="err" id={`${idPrefix}${field}-error`}>
      {message}
    </p>
  );
}

/** Label, control, error - the shape every field in this form has. `wide` is
 *  the two-column span the select and the textarea take. */
export function Field({
  id,
  label,
  wide,
  message,
  idPrefix = "",
  children,
}: {
  id: LeadField;
  label: string;
  wide?: boolean;
  message?: string;
  /** Prefixes the DOM ids, for a page that renders the form twice (the
   *  homepage's desktop and phone trees). The `name`s never change. */
  idPrefix?: string;
  children: React.ReactNode;
}) {
  return (
    <div {...(wide ? { className: "full2" } : {})}>
      <label className="fld-l" htmlFor={idPrefix + id}>
        {label}
      </label>
      {children}
      <ErrorText field={id} message={message} idPrefix={idPrefix} />
    </div>
  );
}

export type TextField = {
  readonly id: LeadField;
  readonly label: string;
  readonly type: "text" | "email" | "tel";
  readonly placeholder: string;
  readonly autoComplete: string;
  readonly required?: true;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly maxLength: number;
};

/** The four plain text inputs, which were written out four times for the sake
 *  of six differing attributes.
 *
 *  The render lists `required`, `minLength`, `pattern`, `maxLength`,
 *  `defaultValue` in the order the hand-written markup used, because React
 *  emits attributes in props order and an omitted one is simply absent - so one
 *  ordering reproduces all four inputs.
 *
 *  Be precise about what that evidence covers: swapping `required` and
 *  `pattern` is a measured NO-OP, because no field carries both - `mobile` is
 *  the only one with a pattern and the only text input without `required`. What
 *  is load-bearing is that `maxLength` follows them and `defaultValue` follows
 *  that. The relative order of the first three is convention, not a tested
 *  fact, and is kept only so a field that one day needs both lands right.
 *
 *  Every limit still comes from `lib/leads/constraints`, the module the server
 *  schema is built from, so the browser and the server cannot disagree. */
export const TEXT_FIELDS: readonly TextField[] = [
  { id: "name", label: "Full name", type: "text", placeholder: "Priya Menon", autoComplete: "name",
    required: true, minLength: LIMITS.name.min, maxLength: LIMITS.name.max },
  { id: "company", label: "Company", type: "text", placeholder: "Company name",
    autoComplete: "organization", maxLength: LIMITS.company.max },
  { id: "email", label: "Business email", type: "email", placeholder: "name@company.com",
    autoComplete: "email", required: true, maxLength: LIMITS.email.max },
  { id: "mobile", label: "Mobile", type: "tel", placeholder: "+91", autoComplete: "tel",
    pattern: MOBILE_PATTERN, maxLength: LIMITS.mobile.max },
];

/** What the form asks each audience (24 Sep 2026). The segment chips used to
 *  change nothing but the posted value, so a ministry was asked for its
 *  "Company" and "Business email" and offered SMB packages, and a person
 *  vetting a nanny was asked for a company too.
 *
 *  - `company` is the organisation field's wording, or absent: an individual
 *    has none, so the field is not rendered and nothing is posted (the
 *    schema already treats `company` as optional).
 *  - `interests` is the subset of `INTEREST_VALUES` that audience is offered,
 *    in order; `preset` is selected on switching to the segment, where one
 *    answer is overwhelmingly the likely one.
 *
 *  Business keeps the form's original wording exactly. The government and
 *  individual strings are NEW MICROCOPY, not from the old site. */
export type SegmentForm = {
  readonly company?: { readonly label: string; readonly placeholder: string };
  readonly email: { readonly label: string; readonly placeholder: string };
  readonly interests: readonly InterestValue[];
  readonly preset?: InterestValue;
  readonly interestPlaceholder: string;
  readonly message: string;
};

export const SEGMENT_FORM: Record<SegmentValue, SegmentForm> = {
  business: {
    company: { label: "Company", placeholder: "Company name" },
    email: { label: "Business email", placeholder: "name@company.com" },
    interests: ["enterprise", "smb", "employee-verification", "customer-kyc", "certifier"],
    interestPlaceholder: "Employee verification, KYC, Certifier, Consumer…",
    message: "How many checks a month, and where?",
  },
  government: {
    company: { label: "Department or authority", placeholder: "Ministry, department or agency" },
    email: { label: "Official email", placeholder: "name@department.gov" },
    interests: ["governments", "employee-verification"],
    preset: "governments",
    interestPlaceholder: "Government / authority programme",
    message: "Which programme is it for, and roughly how many applicants a year?",
  },
  individual: {
    email: { label: "Email", placeholder: "you@example.com" },
    interests: ["hellov"],
    preset: "hellov",
    interestPlaceholder: "Individual / HelloV",
    message: "Who would you like to verify — a tenant, a nanny, a driver?",
  },
};

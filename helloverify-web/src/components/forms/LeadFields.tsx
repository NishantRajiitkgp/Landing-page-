import type { LeadField, SegmentValue } from "@/lib/leads/constraints";
import { COMPANY_PATTERN, EMAIL_PATTERN, LIMITS, NAME_PATTERN } from "@/lib/leads/constraints";

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
 *  `maxLength` follows the constraint attrs and `defaultValue` follows that.
 *  The phone control is not in this list: country code and the national
 *  number are `PhoneField`.
 *
 *  Every limit still comes from `lib/leads/constraints`, the module the server
 *  schema is built from, so the browser and the server cannot disagree. */
export const TEXT_FIELDS: readonly TextField[] = [
  { id: "name", label: "Full name", type: "text", placeholder: "Priya Menon", autoComplete: "name",
    required: true, minLength: LIMITS.name.min, maxLength: LIMITS.name.max, pattern: NAME_PATTERN },
  { id: "company", label: "Company", type: "text", placeholder: "Company name",
    autoComplete: "organization", minLength: 2, maxLength: LIMITS.company.max, pattern: COMPANY_PATTERN },
  { id: "email", label: "Business email", type: "email", placeholder: "name@company.com",
    autoComplete: "email", required: true, maxLength: LIMITS.email.max, pattern: EMAIL_PATTERN },
];

/** What the form asks each audience (24 Sep 2026). The segment chips used to
 *  change nothing but the posted value, so a ministry was asked for its
 *  "Company" and "Business email" and offered SMB packages, and a person
 *  vetting a nanny was asked for a company too.
 *
 *  - `company` is the organisation field's wording, or absent: an individual
 *    has none, so the field is not rendered and nothing is posted (the
 *    schema already treats `company` as optional).
 *
 *  The services each audience is offered are `INTEREST_GROUPS` in
 *  `lib/leads/constraints`, which the server checks against too. */
export type SegmentForm = {
  readonly company?: { readonly label: string; readonly placeholder: string };
  readonly email: { readonly label: string; readonly placeholder: string };
  readonly interestPlaceholder: string;
  readonly message: string;
};

export const SEGMENT_FORM: Record<SegmentValue, SegmentForm> = {
  business: {
    company: { label: "Company", placeholder: "Company name" },
    email: { label: "Business email", placeholder: "name@company.com" },
    interestPlaceholder: "Select Service Type",
    message: "How many checks a month, and where?",
  },
  government: {
    company: { label: "Department or authority", placeholder: "Ministry, department or agency" },
    email: { label: "Official email", placeholder: "name@department.gov" },
    interestPlaceholder: "Select Service Type",
    message: "Which programme is it for, and roughly how many applicants a year?",
  },
  individual: {
    email: { label: "Email", placeholder: "you@example.com" },
    interestPlaceholder: "Select Service Type",
    message: "Who would you like to verify — a tenant, a nanny, a driver?",
  },
};

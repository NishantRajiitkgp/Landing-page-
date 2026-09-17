/** Lead -> Zoho CRM record. The only place our vocabulary becomes Zoho's.
 *
 *  These are REST v8 **API names** (`Last_Name`), not the Web-to-Lead webform
 *  input names the old build used (`Last Name`, with a space). The two are
 *  different namespaces and mixing them produces a record that validates and
 *  contains nothing.
 *
 *  Ported from the old repo's `buildZohoLeadFields`, keeping the rules it paid
 *  for and dropping the workarounds that only existed because the old form was
 *  a published webform with a fixed, partly mislabelled field set:
 *
 *   - `Last_Name` and `Company` are required by the Leads module itself, not
 *     just by a form layout. Both always get a value.
 *   - A single-token name goes in BOTH names. Zoho builds Lead Name from them
 *     and a blank Last_Name is rejected outright.
 *   - The old build had to post `Annual Revenue: "0"` because its webform
 *     included the field and text there dropped the lead. We do not send it:
 *     REST only stores what you give it, and inventing a revenue of zero for
 *     every lead is worse than an empty field.
 *   - The old build's `Email` never actually landed, because Email was not on
 *     the published webform. Over REST it is a first-class field and the
 *     address stops living only inside the description blob.
 */
import "server-only";

import { INTEREST_LABELS, SEGMENT_LABELS } from "@/lib/leads/constraints";
import type { Lead } from "@/lib/leads/schema";

/** Zoho rejects an over-long value rather than truncating it. Limits are the
 *  documented defaults for the standard Leads fields. */
const MAX = {
  firstName: 40,
  lastName: 80,
  company: 200,
  email: 100,
  phone: 30,
  description: 32_000,
} as const;

const clip = (value: string, max: number) => value.trim().slice(0, max);

/** "Priya Menon" -> first "Priya", last "Menon". "Priya" -> both "Priya".
 *
 *  Our form asks for one Full name, and Zoho wants two. Splitting on the first
 *  space is wrong for plenty of naming conventions, which is exactly why the
 *  whole unsplit name is repeated in the description: whatever this does to
 *  `First_Name`/`Last_Name`, the human-entered original survives verbatim. */
function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const NOT_PROVIDED = "Not provided";

/** `Label: value` segments joined by " | ", as the old build did. Zoho's list
 *  views and several export paths collapse newlines, so a single line with an
 *  explicit separator survives more round trips than a paragraph. */
function describe(lead: Lead): string {
  const rows: Array<[string, string | undefined]> = [
    ["Segment", SEGMENT_LABELS[lead.segment]],
    ["Services of interest", lead.interest ? INTEREST_LABELS[lead.interest] : undefined],
    ["Full name as entered", lead.name],
    ["Company", lead.company],
    ["Email", lead.email],
    ["Mobile", lead.mobile],
    ["Message", lead.message],
    ["Source", "helloverify.com contact form"],
  ];

  return rows.map(([label, value]) => `${label}: ${(value ?? "").trim() || "—"}`).join(" | ");
}

export interface ZohoLeadRecord {
  Last_Name: string;
  First_Name?: string;
  Company: string;
  Email: string;
  Phone?: string;
  Description: string;
  Lead_Source?: string;
}

export function toZohoLead(lead: Lead, leadSource?: string): ZohoLeadRecord {
  const { first, last } = splitName(lead.name);

  const record: ZohoLeadRecord = {
    Last_Name: clip(last || first || "Lead", MAX.lastName),
    Company: clip(lead.company || NOT_PROVIDED, MAX.company),
    Email: clip(lead.email, MAX.email),
    Description: clip(describe(lead), MAX.description),
  };

  if (first) record.First_Name = clip(first, MAX.firstName);
  if (lead.mobile) record.Phone = clip(lead.mobile, MAX.phone);
  // Omitted entirely when unconfigured. An unrecognised picklist value is the
  // one field that used to lose leads silently; `zoho.ts` checks the configured
  // value against the live picklist before the first send.
  if (leadSource) record.Lead_Source = leadSource;

  return record;
}

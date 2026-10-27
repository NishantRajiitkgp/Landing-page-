/** What `submitPartner` returns to the partner form: the lead form's state,
 *  plus the fields the lead contract has no column for. Plain types, no
 *  server imports — the client form types its `useActionState` with this. */
import type { LeadFormState } from "@/lib/leads/state";

export const CITY_MAX = 80;

export type PartnerExtraField = "company" | "city" | "partnerType" | "consent";

export interface PartnerFormState extends LeadFormState {
  /** City and partner type as typed, echoed so a failed submit keeps them. */
  extra?: { city?: string; partnerType?: string };
  extraErrors?: Partial<Record<PartnerExtraField, string>>;
}

export const INITIAL_PARTNER_FORM_STATE: PartnerFormState = { status: "idle" };

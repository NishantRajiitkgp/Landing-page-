/** The partner sign-up entry point. Not a second lead pipeline: the form's
 *  six fields are re-posted to `submitLead` as a business enquiry for
 *  `partnership`, so the schema, abuse screening and CRM delivery are the
 *  contact form's. The two fields the lead contract has no column for — city
 *  and partner type — travel in the message, in English for the CRM.
 *
 *  Everything below assumes the POST did not come from our form, the same
 *  posture as `../contact/actions.ts`. */
"use server";

import { submitLead } from "@/app/[locale]/contact/actions";
import { pick } from "@/lib/copy";
import { FORMS } from "@/lib/copy/forms";
import { PARTNER, type PartnerTypeKey } from "@/lib/copy/partner";
import { routing } from "@/lib/i18n/routing";
import { ELAPSED_FIELD, HONEYPOT_FIELD, type LeadField } from "@/lib/leads/constraints";
import { parseSubmission } from "@/lib/leads/schema";
import { INITIAL_LEAD_FORM_STATE } from "@/lib/leads/state";
import { CITY_MAX, type PartnerFormState } from "@/lib/partner/state";

const TYPES = pick(PARTNER, routing.defaultLocale).form.type.options;
const ECHO = ["name", "company", "email", "countryCode", "mobile"] as const satisfies readonly LeadField[];
const isType = (v: string): v is PartnerTypeKey => Object.hasOwn(TYPES, v);
const CITY_RE = /^[\p{L}][\p{L}\p{M} .,'()\-]*$/u;

const text = (form: FormData, key: string) => {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
};

export async function submitPartner(_previous: PartnerFormState, form: FormData): Promise<PartnerFormState> {
  const raw = form.get("locale");
  const locale = typeof raw === "string" && (routing.locales as readonly string[]).includes(raw) ? raw : routing.defaultLocale;
  const say = pick(PARTNER, locale).form;

  const city = text(form, "city");
  const type = text(form, "partnerType");
  const extra = { city, partnerType: type };
  const extraErrors: NonNullable<PartnerFormState["extraErrors"]> = {};
  if (text(form, "company").length < 2) extraErrors.company = say.checks.business;
  if (city.length < 2 || city.length > CITY_MAX || !CITY_RE.test(city)) extraErrors.city = say.checks.city;
  if (!isType(type)) extraErrors.partnerType = say.checks.type;
  if (form.get("consent") !== "on") extraErrors.consent = say.checks.consent;

  const lead = new FormData();
  lead.set("segment", "business");
  lead.set("interest", "partnership");
  for (const key of [...ECHO, HONEYPOT_FIELD, ELAPSED_FIELD]) {
    lead.set(key, text(form, key));
  }
  lead.set("locale", locale);
  lead.set(
    "message",
    ["Partner Programme sign-up", `City: ${city}`, `Partner type: ${isType(type) ? TYPES[type] : type}`].join("\n"),
  );

  if (Object.keys(extraErrors).length) {
    const parsed = parseSubmission(lead);
    return {
      status: "invalid",
      message: pick(FORMS, locale).status.invalid,
      fieldErrors: parsed.ok ? undefined : parsed.fieldErrors,
      values: Object.fromEntries(ECHO.map((k) => [k, text(form, k)])),
      extra,
      extraErrors,
      token: Date.now(),
    };
  }

  const state = await submitLead(INITIAL_LEAD_FORM_STATE, lead);
  return state.status === "success" ? { ...state, message: say.done } : { ...state, extra };
}

/** Deep links into the sales form.
 *
 *  Vertical pages still open `/contact?tab=enquiry&role=…&service=…` with the
 *  old enquiry slugs. The form posts the current vocabulary (`./constraints`).
 *  This is the only translation between the two, and it imports nothing that
 *  would pull the form onto the server.
 */
import {
  FOR_VALUES,
  INTEREST_GROUPS,
  INTEREST_VALUES,
  SEGMENT_VALUES,
  interestGroup,
  type ForValue,
  type InterestValue,
  type SegmentValue,
} from "@/lib/leads/constraints";

/** Old "Services of Interest" values, from the contact CMS, onto the slugs
 *  the form posts. A value that is already a current slug passes through. */
const SERVICE_ALIAS: Record<string, InterestValue> = {
  "white-collar-verification": "white-collar",
  "blue-collar-verification": "blue-collar",
  "international-checks-capability": "international",
  "partnership-demo": "partnership",
  "nanny-verification": "nanny",
  "driver-verification": "driver",
  "home-staff-verification": "home-staff",
  "tenant-verification": "tenant",
  "other-verification-services": "other-verification",
};

const ROLE_AUDIENCE: Record<string, { segment: SegmentValue; forWhom: ForValue }> = {
  business: { segment: "business", forWhom: "self" },
  authority: { segment: "government", forWhom: "self" },
  government: { segment: "government", forWhom: "self" },
  applicant: { segment: "individual", forWhom: "self" },
  consumer: { segment: "individual", forWhom: "other" },
  individual: { segment: "individual", forWhom: "self" },
};

export type LeadArrival = {
  segment: SegmentValue;
  forWhom: ForValue;
  interests: InterestValue[];
};

function asInterest(raw: string): InterestValue | null {
  if ((INTEREST_VALUES as readonly string[]).includes(raw)) return raw as InterestValue;
  return SERVICE_ALIAS[raw] ?? null;
}

/** Which audience offers this service when the link did not say. Authority
 *  services sit on both Government and "for myself"; a link without a role
 *  is the organisation, so Government. */
function audienceFor(interest: InterestValue): { segment: SegmentValue; forWhom: ForValue } {
  if ((INTEREST_GROUPS.business as readonly string[]).includes(interest)) {
    return { segment: "business", forWhom: "self" };
  }
  if ((INTEREST_GROUPS.other as readonly string[]).includes(interest)) {
    return { segment: "individual", forWhom: "other" };
  }
  return { segment: "government", forWhom: "self" };
}

/** `null` when the query names nothing the form can use. `contact` is an old
 *  card id and is ignored — the role already chooses the audience. */
export function leadArrival(params: URLSearchParams): LeadArrival | null {
  const role = params.get("role") ?? "";
  const fromRole = ROLE_AUDIENCE[role];
  const interest = asInterest(params.get("interest") ?? params.get("service") ?? "");
  if (!fromRole && !interest) return null;

  const base = fromRole ?? (interest ? audienceFor(interest) : { segment: "business" as const, forWhom: "self" as const });
  let forWhom = base.forWhom;
  if (base.segment === "individual" && interest && !fromRole) {
    forWhom = (INTEREST_GROUPS.other as readonly string[]).includes(interest) ? "other" : "self";
  }
  if (fromRole?.segment === "individual" && interest) {
    const onSelf = (INTEREST_GROUPS.self as readonly string[]).includes(interest);
    const onOther = (INTEREST_GROUPS.other as readonly string[]).includes(interest);
    if (onOther && !onSelf) forWhom = "other";
    else if (onSelf && !onOther) forWhom = "self";
  }

  const segment = (SEGMENT_VALUES as readonly string[]).includes(base.segment) ? base.segment : "business";
  const whom = (FOR_VALUES as readonly string[]).includes(forWhom) ? forWhom : "self";
  const offered = INTEREST_GROUPS[interestGroup(segment, whom)];
  const interests = interest && (offered as readonly string[]).includes(interest) ? [interest] : [];
  return { segment, forWhom: whom, interests };
}

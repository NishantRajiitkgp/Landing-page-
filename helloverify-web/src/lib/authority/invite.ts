import {
  MOHESR_REGISTRATION_DEFAULTS,
  MOM_REGISTRATION_DEFAULTS,
  type AuthorityId,
} from "./portals";

export type PackageRow = {
  client_package_id: number;
  package: string;
  applicant_type?: string | null;
  checks?: string[] | string;
  program: number | string;
  sbu: number | string;
  section: number | string;
};

export type InviteFields = {
  name: string;
  last: string;
  email: string;
  number: string;
  dialCode: string;
  client_package_id: string;
  program: string;
  sbu: string;
  section: string;
};

/** Flat `candidate_invite_case_registration` body — same keys as the old dialog. */
export function buildInvitePayload(authorityId: AuthorityId, form: InviteFields): Record<string, unknown> {
  const base = {
    "1": form.name,
    "2": "",
    "3": form.last,
    "4": form.email,
    "5": form.number,
    "6": "",
    "7": "",
    "10": "",
    "74": "",
    "76": "",
    "101": "",
    "103": "",
    "106": "",
    dialing_code: form.dialCode,
    channel_name: "applicant_invite",
    client_package_id: form.client_package_id,
    force_duplicate_reg: false,
  };

  if (authorityId === "mohesr") {
    return {
      ...base,
      client: MOHESR_REGISTRATION_DEFAULTS.client,
      program: form.program,
      sbu: form.sbu,
      section: form.section,
      geos: MOHESR_REGISTRATION_DEFAULTS.geos,
    };
  }

  return {
    ...base,
    client: MOM_REGISTRATION_DEFAULTS.client,
    program: MOM_REGISTRATION_DEFAULTS.program,
    sbu: MOM_REGISTRATION_DEFAULTS.sbu,
    section: MOM_REGISTRATION_DEFAULTS.section,
    geos: MOM_REGISTRATION_DEFAULTS.geos,
  };
}

export function flattenPackages(data: Record<string, unknown>): PackageRow[] {
  const physician = (data.physicain as PackageRow[] | undefined) ?? [];
  const nonPhysician = (data.non_physician as PackageRow[] | undefined) ?? [];
  return [...physician, ...nonPhysician].filter((row) => Number.isFinite(row.client_package_id));
}

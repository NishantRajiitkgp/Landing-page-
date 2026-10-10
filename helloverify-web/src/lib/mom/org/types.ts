/** Wire types for `/api/mom/org/*`. Error codes and the code/sign-in bodies
 *  are the applicant account's, so the shared form pieces work unchanged. */
import type { AccountResult } from "@/lib/mom/account/types";

export type OrgKind = "employer" | "agency";

export type OrgUser = {
  id: string;
  org: string;
  /** Registration number for the invoice; empty when not given. */
  reg: string;
  kind: OrgKind;
  first: string;
  last: string;
  email: string;
  dial: string;
  phone: string;
};

export type OrgSessionView = { user: OrgUser | null; demo: boolean };

export type OrgRegisterBody = Omit<OrgUser, "id"> & {
  password: string;
  consent: true;
  emailProof: string;
  phoneProof: string;
};

export type OrgResult<T extends object = object> = AccountResult<T>;

/** MOM employers and agencies: the organisation account and the batch. */
import type { Dictionary } from "@/lib/copy";

import { ar } from "./momOrg.ar";
import { en } from "./momOrg.en";
import { hi } from "./momOrg.hi";

export type MomOrgCopy = typeof en;

export const MOM_ORG: Dictionary<MomOrgCopy> = { en, hi, ar };

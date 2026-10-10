/** MOM applicant flow namespace - the account pages and the application. */
import type { Dictionary } from "@/lib/copy";

import { en } from "./momApply.en";
import { hi } from "./momApply.hi";
import { ar } from "./momApply.ar";

export type MomApplyCopy = typeof en;
export type MomErrors = MomApplyCopy["errors"];

export const MOM_APPLY: Dictionary<MomApplyCopy> = { en, hi, ar };

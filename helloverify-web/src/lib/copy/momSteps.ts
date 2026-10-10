/** MOM application steps namespace - About you, Qualifications, documents. */
import type { Dictionary } from "@/lib/copy";

import { en } from "./momSteps.en";
import { hi } from "./momSteps.hi";
import { ar } from "./momSteps.ar";

export type MomStepsCopy = typeof en;

export const MOM_STEPS: Dictionary<MomStepsCopy> = { en, hi, ar };

/** Applicant-login namespace — MOM / MOHESR portal handoff. */
import type { Dictionary } from "@/lib/copy";

import { en } from "./authority.en";
import { hi } from "./authority.hi";
import { ar } from "./authority.ar";

export type AuthorityCopy = typeof en;

export const AUTHORITY: Dictionary<AuthorityCopy> = { en, hi, ar };

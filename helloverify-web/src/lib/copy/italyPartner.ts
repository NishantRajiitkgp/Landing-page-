/** Italy visa partner programme. */
import type { Dictionary } from "@/lib/copy";

import { ar } from "./italyPartner.ar";
import { en } from "./italyPartner.en";
import { hi } from "./italyPartner.hi";

export type ItalyPartnerCopy = typeof en;
export type ItalyErrors = ItalyPartnerCopy["errors"];

export const ITALY_PARTNER: Dictionary<ItalyPartnerCopy> = { en, hi, ar };

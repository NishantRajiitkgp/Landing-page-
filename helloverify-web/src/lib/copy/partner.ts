/** The `partner` namespace registry — step 2 of the recipe in `./index`.
 *  Copy for `/partner-with-us`; the unions below key the page's ordered
 *  lists, so a card without words is a type error at its list. */
import type { Dictionary } from "@/lib/copy";

import { en } from "./partner.en";
import { hi } from "./partner.hi";
import { ar } from "./partner.ar";

export type PartnerCopy = typeof en;

export const PARTNER: Dictionary<PartnerCopy> = { en, hi, ar };

export type PartnerTypeKey = keyof PartnerCopy["form"]["type"]["options"];
/** What a Client Component may take: no function leaves, which React will
 *  not serialise across the boundary. */
export type PartnerFormUi = Omit<PartnerCopy["form"], "notice" | "talk"> & {
  notice: Omit<PartnerCopy["form"]["notice"], "p2">;
};
export type PartnerCalcUi = PartnerCopy["earnings"]["calc"];

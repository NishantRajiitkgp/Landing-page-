/** The `business` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny, and separate from `./business.en.tsx` for the two reasons
 *  `./chrome.ts` sets out: this is the file that turns TS2741 when a locale is
 *  declared without a dictionary, and a `.ts` registry is importable from
 *  modules that must not be compiled as JSX.
 *
 *  THE KEY UNIONS below gate the COMPONENT's structure, which is the half a
 *  dictionary cannot check on its own. Each one is exported because a page
 *  declares an ordered array against it: `/business` its five cards, and
 *  `/products/bgv-enterprise` its lanes and its pills. Add a destination or a
 *  pill without a label and it is TS2322 at that array, in every locale at
 *  once — the point argued in `./index`'s "Where the keys come from".
 *
 *  `BusinessCopy["enterprise"]` rather than a re-export of the whole subtree:
 *  the unions are what the pages need and the objects are reached through
 *  `copy(BUSINESS)` at render, so nothing else here has to be named.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./business.en";
import { hi } from "./business.hi";
import { ar } from "./business.ar";

/** The English object IS the schema — see `./index`. */
export type BusinessCopy = typeof en;

export const BUSINESS: Dictionary<BusinessCopy> = { en, hi, ar };

/** A destination the `/business` hub may card. Keyed by href for the same
 *  reason `chrome.footer.links` is: the href is the string the component
 *  needs anyway, and it is also the rendered `key=`. */
export type PathHref = keyof BusinessCopy["hub"]["paths"];

/** A `/products/bgv-smb` package card, and a row of its Select Your Checks
 *  table. The amounts and API check codes are the page's; names are copy. */
export type SmbPackKey = keyof BusinessCopy["smb"]["packages"]["items"];
export type SmbRowKey = keyof BusinessCopy["smb"]["table"]["rows"];

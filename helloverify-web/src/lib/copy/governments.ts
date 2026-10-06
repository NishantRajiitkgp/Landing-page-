/** The `governments` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny, and separate from `./governments.en.tsx` for the two reasons
 *  `./chrome.ts` sets out: this is the file that turns TS2741 when a locale is
 *  declared without a dictionary, and a `.ts` registry stays importable from
 *  modules that must not be compiled as JSX.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./governments.en";
import { hi } from "./governments.hi";
import { ar } from "./governments.ar";

/** The English object IS the schema — see `./index`. */
export type GovernmentsCopy = typeof en;

export const GOVERNMENTS: Dictionary<GovernmentsCopy> = { en, hi, ar };

/** A destination the `/governments` hub may card. Keyed by href for the same
 *  reason `chrome.footer.links` is: the href is the string the component needs
 *  anyway, and it is also the rendered `key=`. */
export type PathHref = keyof GovernmentsCopy["hub"]["paths"];

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
 *  `/business/enterprise` its lanes, its pills and its table rows. Add a
 *  destination, a pill or a row without a label and it is TS2322 at that
 *  array, in every locale at once — the point argued in `./index`'s "Where
 *  the keys come from".
 *
 *  `BusinessCopy["enterprise"]` rather than a re-export of the whole subtree:
 *  the unions are what the pages need and the objects are reached through
 *  `copy(BUSINESS)` at render, so nothing else here has to be named.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./business.en";

/** The English object IS the schema — see `./index`. */
export type BusinessCopy = typeof en;

export const BUSINESS: Dictionary<BusinessCopy> = { en };

/** A destination the `/business` hub may card. Keyed by href for the same
 *  reason `chrome.footer.links` is: the href is the string the component
 *  needs anyway, and it is also the rendered `key=`. */
export type PathHref = keyof BusinessCopy["hub"]["paths"];

/** `/business/enterprise`'s three `.lanes3` groups, the 17 pills they draw
 *  from, and the six `.tbl3` rows. Three unions rather than one because the
 *  three tables are keyed independently — a pill appears in exactly one lane
 *  today, and nothing should make that a rule. */
export type LaneKey = keyof BusinessCopy["enterprise"]["lanes"];
export type PillKey = keyof BusinessCopy["enterprise"]["pills"];
export type RowKey = keyof BusinessCopy["enterprise"]["rows"];

/** A `/business/smb` rack card, and a check one of them may list. The
 *  package's CONTENTS are the page's — they set the price and the rendered
 *  check count — while the names are the dictionary's, keyed separately
 *  because three of the eleven rendered lines are the same check in two
 *  packages. */
export type SmbPackKey = keyof BusinessCopy["smb"]["packs"];
export type SmbCheckKey = keyof BusinessCopy["smb"]["checks"];

/** The `checks` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Split from `./checks.en.tsx` for the reasons `./chrome.ts` gives: this is
 *  the file that goes TS2741 when a locale is declared without a dictionary,
 *  and a `.ts` registry is importable from modules that must not compile JSX.
 *
 *  No key unions, and here that is a boundary rather than an omission. The
 *  array this page iterates is `CHECKS` in `lib/content/checks.ts`; a
 *  `keyof ChecksCopy[...]` union over check slugs would put the catalogue's
 *  keys in the dictionary and make adding a check a copy edit, which is the
 *  arrangement `lib/seo/copy.ts` deliberately avoids for the same twelve
 *  routes. See the boundary note in `./checks.en.tsx`.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./checks.en";

/** The English object IS the schema — see `./index`. */
export type ChecksCopy = typeof en;

export const CHECKS_COPY: Dictionary<ChecksCopy> = { en };

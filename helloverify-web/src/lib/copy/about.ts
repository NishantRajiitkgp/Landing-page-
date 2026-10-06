/** The `about` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Separate from `./about.en.tsx` for the two structural reasons `./chrome.ts`
 *  sets out: this is the file a second locale is added to and the file that
 *  goes TS2741 when one is declared without a dictionary, and a `.ts` registry
 *  stays importable from modules that must not be compiled as JSX.
 *
 *  No key unions here, unlike `./chrome.ts`. The page iterates `numbers.stats`,
 *  `values.items` and `clients.items` with `Object.entries`, so a key added in
 *  English renders without a component-side array for a union to gate.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./about.en";
import { hi } from "./about.hi";
import { ar } from "./about.ar";

/** The English object IS the schema — see `./index`. */
export type AboutCopy = typeof en;

export const ABOUT: Dictionary<AboutCopy> = { en, hi, ar };

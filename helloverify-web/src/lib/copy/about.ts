/** The `about` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Separate from `./about.en.tsx` for the two structural reasons `./chrome.ts`
 *  sets out: this is the file a second locale is added to and the file that
 *  goes TS2741 when one is declared without a dictionary, and a `.ts` registry
 *  stays importable from modules that must not be compiled as JSX.
 *
 *  No key unions here, unlike `./chrome.ts`. Nothing on `/about` is a table
 *  the component iterates — the three path cards and the six office rows are
 *  written out longhand — so there is no component-side array for a union to
 *  gate. Adding one is the moment to add the union.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./about.en";

/** The English object IS the schema — see `./index`. */
export type AboutCopy = typeof en;

export const ABOUT: Dictionary<AboutCopy> = { en };

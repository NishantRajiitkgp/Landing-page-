/** The `countries` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Split from `./countries.en.tsx` for the reasons `./chrome.ts` gives: this
 *  is the file that goes TS2741 when a locale is declared without a
 *  dictionary, and a `.ts` registry is importable from modules that must not
 *  compile JSX.
 *
 *  No key unions. `./chrome.ts` exports them because `SiteNav` and
 *  `SiteFooter` declare arrays that must be gated against the dictionary's
 *  keys; here the iterated arrays are `COUNTRIES` and `c.notes` from
 *  `lib/content/countries.ts`, which this namespace deliberately does not
 *  describe — see the boundary note in `./countries.en.tsx`. A union keyed by
 *  country slug is exactly the coupling that boundary exists to avoid.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./countries.en";

/** The English object IS the schema — see `./index`. */
export type CountriesCopy = typeof en;

export const COUNTRIES_COPY: Dictionary<CountriesCopy> = { en };

/** The `resources` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Split from `./resources.en.tsx` for the reasons `./chrome.ts` gives: this
 *  is the file that goes TS2741 when a locale is declared without a
 *  dictionary, and a `.ts` registry is importable from modules that must not
 *  compile JSX.
 *
 *  NO KEY UNIONS, and the absence is a decision rather than an omission. A
 *  union exists to gate a COMPONENT-SIDE ARRAY against the dictionary's keys —
 *  `./chrome.ts` exports three because `SiteNav` and `SiteFooter` each declare
 *  one. Nothing in this subtree does:
 *
 *    - `/resources`' three `.rcard3` destinations are written out longhand in
 *      the page, as `business/employee-verification` writes its seven chips.
 *      Turning them into a `.map()` to gate them would add React keys to three
 *      static siblings that have none — a markup change with an HTML diff, for
 *      a guarantee `tsc` already gives on every literal property access.
 *    - `/resources/glossary` renders `Object.values(t.glossary.terms)`, so the
 *      dictionary's own key order IS the render order and there is no array
 *      and no order tuple to keep in step. A different call from
 *      `business/enterprise`'s `FAQ_ORDER`, deliberately: a FAQ sequence
 *      builds on itself and a glossary's does not, so a locale whose alphabet
 *      sorts differently should be free to reorder its twelve entries.
 *      `leafPaths` sorts before comparing, so `copy.test.ts` loop 2 is
 *      indifferent either way.
 *    - the four remaining pages iterate `POSTS`, `CHECKS`, `CHECK_GROUPS`,
 *      `COUNTRIES` and `REGIONS` from `lib/content/**`, which this namespace
 *      deliberately does not describe. A union keyed by post slug or country
 *      slug is exactly the coupling that boundary exists to avoid — the call
 *      `./countries.ts` already makes, and the header of `./resources.en.tsx`
 *      states the boundary in full.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./resources.en";

/** The English object IS the schema — see `./index`. */
export type ResourcesCopy = typeof en;

export const RESOURCES: Dictionary<ResourcesCopy> = { en };

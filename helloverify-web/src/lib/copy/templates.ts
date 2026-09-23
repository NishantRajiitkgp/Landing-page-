/** The `templates` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny, and separate from `./templates.en.tsx` for the two reasons
 *  `./chrome.ts` sets out: this is the file that turns TS2741 when a locale is
 *  declared without a dictionary, and a `.ts` registry is importable from
 *  modules that must not be compiled as JSX.
 *
 *  NO KEY UNIONS. `chrome.ts` exports four because `SiteNav` and `SiteFooter`
 *  declare arrays against them; `VerticalPage` declares none — everything it
 *  renders in a loop arrives as a prop from the page, and its own copy is a
 *  flat handful of leaves. Exporting a union nothing gates would be the
 *  bookkeeping the recipe warns gets skipped.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./templates.en";

/** The English object IS the schema — see `./index`. */
export type TemplatesCopy = typeof en;

export const TEMPLATES: Dictionary<TemplatesCopy> = { en };

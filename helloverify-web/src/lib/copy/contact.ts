/** The `contact` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Split from `./contact.en.tsx` for the reasons `./chrome.ts` gives: this is
 *  the file that goes TS2741 when a locale is declared without a dictionary,
 *  and a `.ts` registry is importable from modules that must not compile JSX.
 *
 *  No key unions: the page's four routing rows and six office rows are
 *  written out longhand, so there is no component-side array for a union to
 *  gate. The one iterated surface on `/contact` is inside
 *  `forms/ContactForm.tsx`, which this namespace deliberately does not reach
 *  — see the header of `./contact.en.tsx`.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./contact.en";

/** The English object IS the schema — see `./index`. */
export type ContactCopy = typeof en;

export const CONTACT: Dictionary<ContactCopy> = { en };

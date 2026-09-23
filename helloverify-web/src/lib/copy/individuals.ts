/** The `individuals` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Split from `./individuals.en.tsx` for the reasons `./chrome.ts` gives: this
 *  is the file that goes TS2741 when a locale is declared without a
 *  dictionary, and a `.ts` registry is importable from modules that must not
 *  compile JSX.
 *
 *  ONE KEY UNION. `/individuals` renders four `.ph` path cards and keeps their
 *  hrefs, images and grid spans — routing and presentation — in an array
 *  beside them; typing that array's `k` against this union makes a fifth card
 *  added without a label TS2322 at the page, in every locale at once. The same
 *  argument `./chrome.ts` makes for `NavHref`, with one difference worth
 *  stating: two of the four cards point at the SAME route, so the key is an id
 *  rather than the destination. Keying by href would have collapsed them.
 *
 *  NO UNION FOR THE VERTICAL PAGES' TABLES. `homeFamily.pills`,
 *  `immigration.pills`, the `lanes`, `rows`, `steps` and `faqs` records are
 *  all read by a page that writes its `lanes={[…]}` / `rows={[…]}` array out
 *  longhand, so the ORDER is structure and every lookup is a literal property
 *  access that `tsc` already checks. A union would gate a component-side array
 *  that does not exist — the call `./countries.ts` makes for the same reason.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./individuals.en";

/** The English object IS the schema — see `./index`. */
export type IndividualsCopy = typeof en;

export const INDIVIDUALS: Dictionary<IndividualsCopy> = { en };

/** A card the `/individuals` path rack may show. */
export type IndividualsPathKey = keyof IndividualsCopy["hub"]["paths"];

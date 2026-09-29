/** The `root` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Named for the route subtree it serves, per the rule at the end of that
 *  recipe: one namespace per route subtree, and `app/[locale]` is one. It is
 *  the smallest namespace in the repo by a wide margin — one leaf — and it is
 *  still its own namespace rather than a leaf folded into `chrome`, because
 *  `components/chrome/**` is another agent's file and the bypass link is
 *  rendered by the layout, not by any chrome component. Folding it would put
 *  a route file's only string in a component directory's dictionary.
 *
 *  Split from `./root.en.tsx` for the reasons `./chrome.ts` gives: this is
 *  the file that goes TS2741 when a locale is declared without a dictionary,
 *  and a `.ts` registry is importable from modules that must not compile JSX.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./root.en";

/** The English object IS the schema — see `./index`. */
export type RootCopy = typeof en;

export const ROOT: Dictionary<RootCopy> = { en };

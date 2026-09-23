/** The `legal` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Split from `./legal.en.tsx` for the reasons `./chrome.ts` gives: this is
 *  the file that goes TS2741 when a locale is declared without a dictionary,
 *  and a `.ts` registry is importable from modules that must not compile JSX.
 *
 *  NOT `lib/content/legal.ts`, which is a different module with a similar
 *  name and 61,068 characters of ported policy text in it. The export here is
 *  `LEGAL_COPY` rather than `LEGAL` so that the page can import both without
 *  aliasing either, and so that a reader of the page sees which one a line
 *  reaches for. The boundary between the two is in `./legal.en.tsx`.
 *
 *  No key unions: the arrays this page iterates are `LEGAL` and `d.sections`,
 *  both from that other module.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./legal.en";

/** The English object IS the schema — see `./index`. */
export type LegalCopy = typeof en;

export const LEGAL_COPY: Dictionary<LegalCopy> = { en };

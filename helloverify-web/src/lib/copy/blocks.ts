/** The `blocks` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny and separate from `./blocks.en.tsx` for the two reasons `./chrome.ts`
 *  sets out and does not need repeating: this is the file a second locale is
 *  added to and the file that fails (TS2741) when one is declared without a
 *  dictionary, and a `.ts` registry is importable from modules that must not
 *  be compiled as JSX.
 *
 *  The key unions below gate the COMPONENTS' structure. `LeadMock` declares
 *  three tables against them — the two `MOCK_FIELDS_*` orders and `SEGMENTS`
 *  — and `HowItWorksPanels` four, so a row added to a panel without copy is
 *  TS2322 at that declaration, in every locale at once.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./blocks.en";
import { hi } from "./blocks.hi";
import { ar } from "./blocks.ar";

/** The English object IS the schema — see `./index`. */
export type BlocksCopy = typeof en;

export const BLOCKS: Dictionary<BlocksCopy> = { en, hi, ar };

/** An option in the HelloV bot's menu. */
export type PhoneMenuItem = keyof BlocksCopy["helloVPhone"]["menu"]["items"];


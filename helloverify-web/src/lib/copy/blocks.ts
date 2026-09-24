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

/** The English object IS the schema — see `./index`. */
export type BlocksCopy = typeof en;

export const BLOCKS: Dictionary<BlocksCopy> = { en };

/** A message in the HelloV thread. */
export type PhoneMsgId = keyof BlocksCopy["helloVPhone"]["msgs"];

/** A line in the phone's finished report. */
export type PhoneReportRow = keyof BlocksCopy["helloVPhone"]["report"]["rows"];

/** The four tables inside the process animation. Separate unions because the
 *  four panels are four independent lists and nothing should let a `read`
 *  field id stand where a `report` row id belongs. */
export type ReadFieldId = keyof BlocksCopy["panels"]["read"]["fields"];
export type DocCheckId = keyof BlocksCopy["panels"]["read"]["checks"];
export type ConfirmEventId = keyof BlocksCopy["panels"]["confirm"]["events"];
export type ReportRowId = keyof BlocksCopy["panels"]["report"]["rows"];

/** The `platform` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny, and separate from `./platform.en.tsx` for the two reasons `./chrome.ts`
 *  sets out: this is the file that turns TS2741 when a locale is declared
 *  without a dictionary, and a `.ts` registry is importable from modules that
 *  must not be compiled as JSX — which matters here, because
 *  `app/[locale]/platform/security-compliance/content.ts` imports three of the
 *  unions below.
 *
 *  THE KEY UNIONS gate the COMPONENT's structure, the half a dictionary cannot
 *  check on its own. Each is exported because a module declares an ordered
 *  array against it: `/platform/coverage` its regions and the countries inside
 *  them, and `/platform/security-compliance`'s `./content.ts` its artefact
 *  rows, its residency rows and its questions. Add a row without copy and it is
 *  TS2322 on that array, in every locale at once — the argument `./index` makes
 *  under "Where the keys come from".
 *
 *  The hub's three path cards get NO union, unlike `business.ts`'s `PathHref`:
 *  they are written out longhand in `platform/page.tsx` rather than mapped, so
 *  there is no component-side array for a union to gate. Adding one is the
 *  moment to add the union.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./platform.en";

/** The English object IS the schema — see `./index`. */
export type PlatformCopy = typeof en;

export const PLATFORM: Dictionary<PlatformCopy> = { en };

/** `/platform/coverage`'s three region headings and the 24 countries the page
 *  distributes between them. TWO unions rather than one nested type: the
 *  dictionary holds one flat country record, for the TS2536 reason
 *  `platform.en.tsx` records at that table. */
export type RegionKey = keyof PlatformCopy["coverage"]["regions"];
export type CountryKey = keyof PlatformCopy["coverage"]["countries"];

/** `/platform/security-compliance`'s three record lists, whose ORDER — and, for
 *  the artefacts, the `.req` CSS flag — stayed in that page's `./content.ts`. */
export type ArtefactKey = keyof PlatformCopy["security"]["artefacts"];
export type ResidencyKey = keyof PlatformCopy["security"]["residency"];
export type SecurityFaqKey = keyof PlatformCopy["security"]["faqs"];

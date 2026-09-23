/** The `governments` namespace registry — step 2 of the recipe in `./index`.
 *
 *  Tiny, and separate from `./governments.en.tsx` for the two reasons
 *  `./chrome.ts` sets out: this is the file that turns TS2741 when a locale is
 *  declared without a dictionary, and a `.ts` registry stays importable from
 *  modules that must not be compiled as JSX.
 *
 *  THE KEY UNIONS below gate the COMPONENT's structure, the half a dictionary
 *  cannot check on its own. Each of the four vertical pages declares an ordered
 *  `LANES` and `ROWS` against them, exactly as `/business/enterprise` does, so a
 *  lane, a pill or a row added without copy is TS2322 on that array in every
 *  locale at once — the argument `./index` makes under "Where the keys come
 *  from".
 *
 *  PARAMETERISED BY THE PAGE rather than written out twelve times.
 *  `business.ts` exports `LaneKey`, `PillKey` and `RowKey` as three flat unions
 *  because exactly one page there has lanes; here four pages do, each with its
 *  own pills and its own times, and four independent key sets is the point —
 *  `criminal` is 30 min on three of them and a different `sub` on the fourth.
 *  Twelve flat exports would say the same thing twelve times and leave nothing
 *  naming the shape they share; `Lanes<"health">` says it once and still gates
 *  each page against its own keys only.
 */
import type { Dictionary } from "@/lib/copy";

import { en } from "./governments.en";

/** The English object IS the schema — see `./index`. */
export type GovernmentsCopy = typeof en;

export const GOVERNMENTS: Dictionary<GovernmentsCopy> = { en };

/** A destination the `/governments` hub may card. Keyed by href for the same
 *  reason `chrome.footer.links` is: the href is the string the component needs
 *  anyway, and it is also the rendered `key=`. */
export type PathHref = keyof GovernmentsCopy["hub"]["paths"];

/** The four pages built on `components/templates/VerticalPage.tsx`. The hub and
 *  the Ministry of Manpower case study are ordinary markup and need no unions.
 *
 *  Written out rather than derived: a `keyof` filtered by "has a `lanes`
 *  property" would also admit anything a later page happens to shape that way,
 *  and this is a list of four routes, which is a fact about the subtree. */
export type VerticalKey = "health" | "immigration" | "manpowerEducation" | "trade";

/** One page's lane, pill and row key sets. */
export type LaneKey<V extends VerticalKey> = keyof GovernmentsCopy[V]["lanes"];
export type PillKey<V extends VerticalKey> = keyof GovernmentsCopy[V]["pills"];
export type RowKey<V extends VerticalKey> = keyof GovernmentsCopy[V]["rows"];

/** The ordered lane list a vertical page declares: which lanes, which pills in
 *  each, and which pills render `.fast`. `fast` is a CSS class, not a word,
 *  which is why it did not travel with the copy — the same split
 *  `business/enterprise/page.tsx` makes. */
export type Lanes<V extends VerticalKey> = readonly {
  k: LaneKey<V>;
  pills: readonly { p: PillKey<V>; fast?: boolean }[];
}[];

/** The ordered `.tbl3` row list, same split. */
export type Rows<V extends VerticalKey> = readonly { k: RowKey<V>; fast?: boolean }[];
